import React from 'react';
import { Sparkles, User } from 'lucide-react';
import { ChatMessage } from '../../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAssistant = message.sender === 'assistant';

  return (
    <div className={`flex gap-3 my-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-agri-600 to-agri-400 text-white flex items-center justify-center shadow-xs shrink-0 mt-1">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-2xs ${
          isAssistant
            ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
            : 'bg-agri-600 text-white rounded-tr-xs font-medium'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <span
          className={`text-[10px] block mt-1.5 font-medium ${
            isAssistant ? 'text-slate-400' : 'text-agri-200 text-right'
          }`}
        >
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {!isAssistant && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-xs shrink-0 mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
