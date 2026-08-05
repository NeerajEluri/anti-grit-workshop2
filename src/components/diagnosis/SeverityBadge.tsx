import React from 'react';
import { SeverityLevel } from '../../types';
import { AlertCircle, AlertOctagon, ShieldAlert, CheckCircle } from 'lucide-react';

interface SeverityBadgeProps {
  severity: SeverityLevel;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const configs = {
    low: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle, label: 'Low Severity' },
    moderate: { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertCircle, label: 'Moderate Severity' },
    high: { bg: 'bg-orange-50 text-orange-700 border-orange-200', icon: ShieldAlert, label: 'High Severity' },
    critical: { bg: 'bg-red-50 text-red-700 border-red-200 animate-pulse', icon: AlertOctagon, label: 'CRITICAL Severity' },
  };

  const config = configs[severity] || configs.moderate;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${config.bg}`}>
      <Icon className="w-4 h-4" />
      <span>{config.label}</span>
    </div>
  );
};
