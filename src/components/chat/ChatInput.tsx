import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  suggestedQuestions?: string[];
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  suggestedQuestions,
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;
    const msg = content.trim();
    setContent('');
    await onSendMessage(msg);
  };

  return (
    <div className="space-y-3 pt-2">
      {suggestedQuestions && suggestedQuestions.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-agri-500" /> Ideas:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSendMessage(q)}
              className="bg-white hover:bg-agri-50 text-slate-700 hover:text-agri-700 px-3 py-1.5 rounded-full border border-slate-200 hover:border-agri-300 text-xs shrink-0 transition-colors shadow-2xs font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-300 shadow-sm focus-within:border-agri-500 focus-within:ring-2 focus-within:ring-agri-500/20 transition-all">
        <input
          type="text"
          placeholder="Ask AgriAdvisor AI about fertigation, pest remedies, or market rates..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none disabled:opacity-50"
        />
        <Button type="submit" isLoading={isLoading} disabled={!content.trim()} size="sm" className="rounded-xl px-4">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
