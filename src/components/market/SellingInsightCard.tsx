import React from 'react';
import { TrendingUp, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { ConfidenceBadge } from '../common/ConfidenceBadge';

interface SellingInsightProps {
  insight: {
    crop_name: string;
    recommendation: 'sell_now' | 'wait' | 'monitor';
    reasoning: string;
    confidence_score: number;
  };
}

export const SellingInsightCard: React.FC<SellingInsightProps> = ({ insight }) => {
  const badgeConfig = {
    sell_now: { label: 'RECOMMENDED TO SELL NOW', bg: 'bg-emerald-600 text-white', icon: TrendingUp },
    wait: { label: 'RECOMMENDED TO HOLD / WAIT', bg: 'bg-amber-600 text-white', icon: Clock },
    monitor: { label: 'MONITOR MANDI ARRIVALS', bg: 'bg-sky-600 text-white', icon: AlertTriangle },
  };

  const currentConfig = badgeConfig[insight.recommendation] || badgeConfig.monitor;
  const Icon = currentConfig.icon;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-agri-950 rounded-2xl p-6 text-white shadow-xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-agri-400" />
          <h4 className="font-extrabold text-base">AI Selling Time Intelligence</h4>
        </div>
        <ConfidenceBadge score={insight.confidence_score} />
      </div>

      <div className="space-y-2">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold shadow-sm ${currentConfig.bg}`}>
          <Icon className="w-4 h-4" />
          <span>{currentConfig.label}</span>
        </span>
        <h3 className="text-xl font-extrabold text-white mt-1">{insight.crop_name} Market Guidance</h3>
      </div>

      <p className="text-xs text-slate-200 bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 leading-relaxed">
        {insight.reasoning}
      </p>
    </div>
  );
};
