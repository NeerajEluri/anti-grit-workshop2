import React from 'react';
import { TreatmentStep } from '../../types';
import { Leaf, ShieldCheck } from 'lucide-react';

interface TreatmentPlanListProps {
  steps: TreatmentStep[];
  preventionTips?: string[];
}

export const TreatmentPlanList: React.FC<TreatmentPlanListProps> = ({ steps, preventionTips }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h4 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-agri-600" />
          <span>Step-by-Step Treatment & Remedy Plan</span>
        </h4>

        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.step_number}
              className={`p-4 rounded-xl border transition-all ${
                step.is_organic_alternative
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-extrabold text-xs text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                  Step #{step.step_number}: {step.action}
                </span>
                {step.is_organic_alternative && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300">
                    <Leaf className="w-3 h-3 text-emerald-600" /> Organic Bio-Option
                  </span>
                )}
              </div>

              <div className="text-xs space-y-1 mt-2">
                <p className="font-bold text-slate-800">Method / Product: {step.product_or_method}</p>
                <p className="text-slate-500 font-medium">Timing: {step.timing}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {preventionTips && preventionTips.length > 0 && (
        <div className="bg-agri-50/60 border border-agri-200 rounded-2xl p-6 space-y-3">
          <h4 className="font-extrabold text-agri-900 text-base flex items-center gap-2">
            <Leaf className="w-4 h-4 text-agri-600" />
            <span>Long-term Agronomic Prevention Tips</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-agri-950 list-disc list-inside font-medium">
            {preventionTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
