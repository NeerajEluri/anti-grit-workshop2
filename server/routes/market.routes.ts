import { Router } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { isSupabaseConfigured, supabaseAdmin, memoryDb } from '../services/supabaseClient';
import { SYSTEM_INSTRUCTION, buildSellingInsightPrompt, SELLING_INSIGHT_JSON_SCHEMA } from '../prompts/sellingInsight';
import { generateStructuredAIResponse } from '../services/geminiClient';
import { aiSellingInsightSchema } from '../../src/validation/schemas';
import { aiRateLimiter } from '../middleware/rateLimiter';

const router = Router();
router.use(authMiddleware);

router.get('/prices', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { crop, state } = req.query;

    if (!isSupabaseConfigured) {
      let prices = Array.from(memoryDb.marketPrices.values());
      if (crop) prices = prices.filter(p => p.crop_name.toLowerCase().includes((crop as string).toLowerCase()));
      if (state) prices = prices.filter(p => p.state.toLowerCase() === (state as string).toLowerCase());
      return res.json({ prices });
    }

    let query = supabaseAdmin.from('market_prices').select('*').order('recorded_date', { ascending: false });
    if (crop) query = query.ilike('crop_name', `%${crop}%`);
    if (state) query = query.eq('state', state as string);

    const { data: prices, error } = await query;
    if (error) throw error;
    res.json({ prices });
  } catch (err) {
    next(err);
  }
});

router.post('/insight', aiRateLimiter, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { crop_name, state } = req.body;
    if (!crop_name || !state) {
      return res.status(400).json({ error: 'Crop name and state are required' });
    }

    let prices: any[] = [];
    if (!isSupabaseConfigured) {
      prices = Array.from(memoryDb.marketPrices.values()).filter(p => p.crop_name.toLowerCase().includes(crop_name.toLowerCase()));
    } else {
      const { data } = await supabaseAdmin.from('market_prices').select('*').ilike('crop_name', `%${crop_name}%`).order('recorded_date', { ascending: false }).limit(10);
      prices = data || [];
    }

    const promptText = buildSellingInsightPrompt(crop_name, state, prices);

    const mockFallback = () => ({
      crop_name,
      recommendation: "wait" as "sell_now" | "wait" | "monitor",
      reasoning: `Prices for ${crop_name} in ${state} are currently trending upwards due to reduced arrivals in regional mandis. Holding stock for 2-3 weeks could net a 5-8% higher realization per quintal.`,
      confidence_score: 0.86
    });

    const aiResult = await generateStructuredAIResponse(
      SYSTEM_INSTRUCTION,
      promptText,
      SELLING_INSIGHT_JSON_SCHEMA,
      (data) => aiSellingInsightSchema.parse(data),
      mockFallback
    );

    res.json({ insight: aiResult.data });
  } catch (err) {
    next(err);
  }
});

export default router;
