import React from 'react';
import { Sprout } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = "Processing agronomic data...",
  size = 'md'
}) => {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 gap-3 text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-agri-500/20 animate-ping"></div>
        <div className="relative bg-gradient-to-tr from-agri-600 to-agri-400 text-white p-3 rounded-2xl shadow-lg shadow-agri-500/30 animate-bounce">
          <Sprout className={iconSizes[size]} />
        </div>
      </div>
      {label && <p className="text-sm font-semibold text-slate-600 animate-pulse">{label}</p>}
    </div>
  );
};
