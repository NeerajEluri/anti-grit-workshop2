import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface ConfidenceBadgeProps {
  score: number; // 0 to 1
  showIcon?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ score, showIcon = true }) => {
  const percentage = Math.round(score * 100);

  let colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
  let label = "High Confidence";

  if (score < 0.55) {
    colorClasses = "bg-red-50 text-red-700 border-red-200 animate-pulse";
    label = "Low Confidence (Needs Review)";
  } else if (score < 0.80) {
    colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
    label = "Moderate Confidence";
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClasses}`}>
      {showIcon && (score >= 0.55 ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />)}
      <span>{label} ({percentage}%)</span>
    </div>
  );
};
