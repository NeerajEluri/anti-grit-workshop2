import { Router } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { chatMessageSchema } from '../../src/validation/schemas';
import { isSupabaseConfigured, supabaseAdmin, memoryDb } from '../services/supabaseClient';
import { SYSTEM_INSTRUCTION, buildChatAssistantPrompt, CHAT_ASSISTANT_JSON_SCHEMA } from '../prompts/chatAssistant';
import { generateStructuredAIResponse } from '../services/geminiClient';
import { aiRateLimiter } from '../middleware/rateLimiter';
import { z } from 'zod';

const router = Router();
router.use(authMiddleware);

router.get('/conversations', async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;
    if (!isSupabaseConfigured) {
      const list = Array.from(memoryDb.chatConversations.values()).filter(c => c.owner_id === userId);
      return res.json({ conversations: list });
    }

    const { data: conversations, error } = await supabaseAdmin
      .from('chat_conversations')
      .select('*, farm:farms(*)')
      .eq('owner_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json({ conversations });
  } catch (err) {
    next(err);
  }
});

router.post('/conversations', async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { farm_id, title } = req.body;

    const convId = 'conv-' + Math.random().toString(36).substring(2, 9);
    const newConv = {
      id: convId,
      owner_id: userId,
      farm_id: farm_id || null,
      title: title || 'New Advisory Thread',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured) {
      memoryDb.chatConversations.set(convId, newConv);
      return res.status(201).json({ conversation: newConv });
    }

    const { data, error } = await supabaseAdmin
      .from('chat_conversations')
      .insert({
        owner_id: userId,
        farm_id: farm_id || null,
        title: title || 'New Advisory Thread',
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ conversation: data });
  } catch (err) {
    next(err);
  }
});

router.get('/conversations/:id/messages', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    if (!isSupabaseConfigured) {
      const messages = Array.from(memoryDb.chatMessages.values()).filter(m => m.conversation_id === id);
      return res.json({ messages });
    }

    // Check ownership
    const { data: conv } = await supabaseAdmin.from('chat_conversations').select('owner_id').eq('id', id).single();
    if (!conv || conv.owner_id !== userId) {
      return res.status(403).json({ error: 'Access denied to this conversation' });
    }

    const { data: messages, error } = await supabaseAdmin
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json({ messages });
  } catch (err) {
    next(err);
  }
});

router.post('/conversations/:id/messages', aiRateLimiter, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const parsed = chatMessageSchema.parse(req.body);

    let farmContext: any = null;
    let history: any[] = [];

    if (!isSupabaseConfigured) {
      const conv = memoryDb.chatConversations.get(id);
      if (!conv || conv.owner_id !== userId) {
        return res.status(404).json({ error: 'Conversation not found or access denied' });
      }
      if (conv.farm_id) {
        farmContext = memoryDb.farms.get(conv.farm_id);
      }
      history = Array.from(memoryDb.chatMessages.values())
        .filter(m => m.conversation_id === id)
        .slice(-6);
    } else {
      const { data: conv } = await supabaseAdmin.from('chat_conversations').select('*, farm:farms(*)').eq('id', id).single();
      if (!conv || conv.owner_id !== userId) {
        return res.status(404).json({ error: 'Conversation not found or access denied' });
      }
      farmContext = conv.farm;
      const { data: msgs } = await supabaseAdmin.from('chat_messages').select('*').eq('conversation_id', id).order('created_at', { ascending: true });
      history = (msgs || []).slice(-6);
    }

    const promptText = buildChatAssistantPrompt(farmContext, history, parsed.content);

    const mockFallback = () => ({
      reply: `For your field in ${farmContext ? farmContext.district : 'your region'} with ${farmContext ? farmContext.soil_type : 'current'} soil, ensure balanced N-P-K fertigation. If you notice leaf yellowing, consider applying a 1% Urea solution spray during early morning hours to support vigor.`,
      suggested_follow_up_questions: [
        "What is the best irrigation interval for current weather?",
        "Which organic pesticide is safe for my crop?",
        "When should I schedule the next fertilizer application?"
      ],
      referenced_topics: ["Fertigation", "Soil Health", "Microclimate"]
    });

    const aiSchema = z.object({
      reply: z.string(),
      suggested_follow_up_questions: z.array(z.string()),
      referenced_topics: z.array(z.string()),
    });

    const aiResult = await generateStructuredAIResponse(
      SYSTEM_INSTRUCTION,
      promptText,
      CHAT_ASSISTANT_JSON_SCHEMA,
      (data) => aiSchema.parse(data),
      mockFallback
    );

    const userMsgId = 'msg-u-' + Math.random().toString(36).substring(2, 9);
    const assistantMsgId = 'msg-a-' + Math.random().toString(36).substring(2, 9);

    const userMsg = { id: userMsgId, conversation_id: id, sender: 'user', content: parsed.content, created_at: new Date().toISOString() };
    const assistantMsg = { id: assistantMsgId, conversation_id: id, sender: 'assistant', content: aiResult.data.reply, created_at: new Date().toISOString() };

    if (!isSupabaseConfigured) {
      memoryDb.chatMessages.set(userMsgId, userMsg);
      memoryDb.chatMessages.set(assistantMsgId, assistantMsg);
    } else {
      await supabaseAdmin.from('chat_messages').insert([
        { conversation_id: id, sender: 'user', content: parsed.content },
        { conversation_id: id, sender: 'assistant', content: aiResult.data.reply }
      ]);
    }

    res.status(201).json({
      userMessage: userMsg,
      assistantMessage: assistantMsg,
      suggestedFollowUps: aiResult.data.suggested_follow_up_questions,
      topics: aiResult.data.referenced_topics,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
