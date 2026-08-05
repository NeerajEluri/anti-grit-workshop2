import React, { useRef, useEffect } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { ChatMessage, ChatConversation } from '../../types';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';

interface ChatWindowProps {
  conversation?: ChatConversation | null;
  messages: ChatMessage[];
  onSendMessage: (msg: string) => Promise<void>;
  isLoading?: boolean;
  suggestedFollowUps?: string[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  onSendMessage,
  isLoading = false,
  suggestedFollowUps,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!conversation) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center h-full min-h-[450px]">
        <div className="p-4 rounded-2xl bg-agri-50 text-agri-600 mb-3">
          <MessageSquare className="w-10 h-10" />
        </div>
        <h3 className="font-extrabold text-slate-800 text-lg">AI Agronomist Chat Assistant</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">Select an existing thread or start a new farm advisory conversation.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 flex flex-col h-full min-h-[500px] shadow-sm">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">{conversation.title}</h3>
          {conversation.farm && (
            <span className="text-xs text-agri-700 font-semibold bg-agri-50 px-2.5 py-0.5 rounded-md border border-agri-200 inline-block mt-1">
              Grounded in {conversation.farm.farm_name} ({conversation.farm.soil_type})
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-agri-600" />
          <span>Gemini 2.5</span>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto py-4 space-y-2 pr-1">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            Start the conversation by asking AgriAdvisor AI any question about your farm profile!
          </div>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} message={m} />)
        )}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-agri-600 p-3 bg-agri-50/60 rounded-xl max-w-xs animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>AgriAdvisor AI is analyzing agronomic records...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Footer Input */}
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} suggestedQuestions={suggestedFollowUps} />
    </div>
  );
};
