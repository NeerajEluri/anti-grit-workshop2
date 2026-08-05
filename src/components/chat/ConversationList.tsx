import React from 'react';
import { MessageSquare, Plus, Tractor } from 'lucide-react';
import { ChatConversation } from '../../types';
import { Button } from '../common/Button';

interface ConversationListProps {
  conversations: ChatConversation[];
  activeId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeId,
  onSelect,
  onNew,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-agri-600" />
          <span>Chat Threads</span>
        </h3>
        <Button size="sm" onClick={onNew} className="text-xs py-1.5 px-3">
          <Plus className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No chat threads yet. Click "New Chat" to start consulting AgriAdvisor AI.
          </div>
        ) : (
          conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`w-full text-left p-3 rounded-xl transition-all border ${
                c.id === activeId
                  ? 'bg-agri-50 border-agri-300 font-bold text-agri-900 shadow-2xs'
                  : 'bg-slate-50/50 hover:bg-slate-100 border-transparent text-slate-700 font-medium'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs truncate">{c.title}</span>
              </div>
              {c.farm && (
                <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1 mt-1">
                  <Tractor className="w-3 h-3 text-agri-600 shrink-0" />
                  <span className="truncate">{c.farm.farm_name}</span>
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
