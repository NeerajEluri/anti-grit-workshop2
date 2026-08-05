import React from 'react';
import { Menu, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const { profile } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:inline">
            Active Season: Rabi 2026
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-agri-50 text-agri-700 border border-agri-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-agri-600" />
          <span>Gemini 2.5 Flash Grounded</span>
        </div>

        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-agri-500"></span>
        </button>

        <div className="h-6 w-px bg-slate-200"></div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800">{profile?.full_name}</p>
            <p className="text-[10px] text-slate-500">Gujarati / English</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-agri-600 to-agri-400 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {profile?.full_name?.charAt(0) || 'F'}
          </div>
        </div>
      </div>
    </header>
  );
};
