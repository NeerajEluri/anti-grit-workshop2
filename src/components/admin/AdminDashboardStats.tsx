import React from 'react';
import { Users, Tractor, Sparkles, Stethoscope, ShieldAlert, FileSpreadsheet } from 'lucide-react';

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    totalFarms: number;
    totalAdvisories: number;
    totalDiagnoses: number;
    flaggedDiagnoses: number;
    activeCrops?: number;
  };
}

export const AdminDashboardStats: React.FC<AdminStatsProps> = ({ stats }) => {
  const cards = [
    { label: 'Registered Farmers', value: stats.totalUsers, icon: Users, color: 'bg-sky-50 text-sky-600 border-sky-200' },
    { label: 'Registered Farms', value: stats.totalFarms, icon: Tractor, color: 'bg-agri-50 text-agri-600 border-agri-200' },
    { label: 'AI Advisory Reports', value: stats.totalAdvisories, icon: Sparkles, color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { label: 'Disease Diagnoses', value: stats.totalDiagnoses, icon: Stethoscope, color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { label: 'Flagged (Low Confidence)', value: stats.flaggedDiagnoses, icon: ShieldAlert, color: 'bg-red-50 text-red-600 border-red-200 animate-pulse' },
    { label: 'Crop Master Records', value: stats.activeCrops || 4, icon: FileSpreadsheet, color: 'bg-amber-50 text-amber-600 border-amber-200' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className={`p-4 rounded-2xl border ${card.color} bg-white shadow-2xs space-y-2`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{card.label}</span>
              <Icon className="w-4 h-4 shrink-0" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{card.value}</div>
          </div>
        );
      })}
    </div>
  );
};
