import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Tractor,
  Sparkles,
  Stethoscope,
  History,
  MessageSquare,
  CloudSun,
  TrendingUp,
  User,
  Shield,
  FileSpreadsheet,
  Users,
  ScrollText,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { strings } from '../../i18n/strings';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { profile, isAdmin, signOut } = useAuth();
  const t = strings.en.nav;

  const farmerLinks = [
    { to: '/dashboard', label: t.dashboard, icon: LayoutDashboard },
    { to: '/farms', label: t.farms, icon: Tractor },
    { to: '/advisory/new', label: t.newAdvisory, icon: Sparkles },
    { to: '/diagnosis/new', label: t.newDiagnosis, icon: Stethoscope },
    { to: '/chat', label: t.chat, icon: MessageSquare },
    { to: '/history', label: t.history, icon: History },
    { to: '/weather', label: t.weather, icon: CloudSun },
    { to: '/market-prices', label: t.marketPrices, icon: TrendingUp },
    { to: '/profile', label: t.profile, icon: User },
  ];

  const adminLinks = [
    { to: '/admin', label: t.admin, icon: Shield },
    { to: '/admin/crops', label: t.adminCrops, icon: FileSpreadsheet },
    { to: '/admin/users', label: t.adminUsers, icon: Users },
    { to: '/admin/audit-log', label: t.adminAudit, icon: ScrollText },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-gradient-to-tr from-agri-600 to-agri-400 p-2.5 rounded-xl text-white shadow-lg shadow-agri-600/30">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-extrabold text-white text-lg tracking-tight leading-tight">AgriAdvisor</h1>
          <span className="text-[10px] font-bold text-agri-400 tracking-wider uppercase bg-agri-950/60 px-2 py-0.5 rounded-md border border-agri-800/50">AI Agronomist</span>
        </div>
      </div>

      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <div>
          <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider px-3 mb-2 block">
            Farmer Services
          </span>
          <nav className="space-y-1">
            {farmerLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-agri-600 text-white shadow-md shadow-agri-600/20 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {isAdmin && (
          <div>
            <span className="text-[11px] font-semibold uppercase text-amber-500/80 tracking-wider px-3 mb-2 block flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> Admin Control
            </span>
            <nav className="space-y-1">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-agri-600/20 text-agri-400 font-bold flex items-center justify-center border border-agri-500/30 shrink-0">
              {profile?.full_name?.charAt(0) || 'F'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{profile?.full_name || 'Farmer'}</p>
              <p className="text-[10px] text-slate-400 capitalize">{profile?.role || 'farmer'}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            title={t.logout}
            className="text-slate-400 hover:text-red-400 hover:bg-slate-800 p-2 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
