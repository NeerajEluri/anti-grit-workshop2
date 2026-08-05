import React from 'react';
import { Award, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { RecommendedCrop } from '../../types';

interface CropRecommendationCardProps {
  crop: RecommendedCrop;
}

export const CropRecommendationCard: React.FC<CropRecommendationCardProps> = ({ crop }) => {
  const suitabilityPercent = Math.round(crop.suitability_score * 100);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
      <div className="absolute top-0 right-0 bg-agri-600 text-white font-extrabold text-xs px-3 py-1 rounded-bl-xl shadow-xs">
        Rank #{crop.rank}
      </div>

      <div className="space-y-4">
        <div className="pr-12">
          <h4 className="text-xl font-extrabold text-slate-900">{crop.crop_name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden max-w-[120px]">
              <div className="bg-agri-500 h-full rounded-full" style={{ width: `${suitabilityPercent}%` }}></div>
            </div>
            <span className="text-xs font-bold text-agri-700">{suitabilityPercent}% Suitability</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
          {crop.reasoning}
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-0.5">Expected Yield</span>
            <div className="flex items-center gap-1 font-extrabold text-emerald-950 text-sm">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>{crop.expected_yield_range}</span>
            </div>
          </div>

          <div className="bg-sky-50/60 p-2.5 rounded-xl border border-sky-100">
            <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block mb-0.5">Crop Duration</span>
            <div className="flex items-center gap-1 font-extrabold text-sky-950 text-sm">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>{crop.estimated_duration_days} Days</span>
            </div>
          </div>
        </div>

        {crop.risk_factors && crop.risk_factors.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Key Risk Factors & Mitigations
            </span>
            <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside pl-1">
              {crop.risk_factors.map((risk, idx) => (
                <li key={idx}>{risk}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
