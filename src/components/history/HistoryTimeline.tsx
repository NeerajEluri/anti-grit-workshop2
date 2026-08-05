import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Stethoscope, Calendar, ArrowRight, MapPin } from 'lucide-react';
import { AdvisoryReport, DiseaseDiagnosis } from '../../types';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { SeverityBadge } from '../diagnosis/SeverityBadge';

type HistoryItem = 
  | ({ itemType: 'advisory' } & AdvisoryReport)
  | ({ itemType: 'diagnosis' } & DiseaseDiagnosis);

interface HistoryTimelineProps {
  items: HistoryItem[];
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
        No advisory or diagnosis records found matching filters.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isAdvisory = item.itemType === 'advisory';
        const linkPath = isAdvisory ? `/advisory/${item.id}` : `/diagnosis/${item.id}`;

        return (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl shrink-0 mt-0.5 ${
                  isAdvisory ? 'bg-agri-100 text-agri-700' : 'bg-red-50 text-red-600'
                }`}
              >
                {isAdvisory ? <Sparkles className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {isAdvisory ? 'Crop Advisory' : 'Pest/Disease Diagnosis'}
                  </span>
                  {isAdvisory ? (
                    <ConfidenceBadge score={(item as AdvisoryReport).ai_confidence_score} />
                  ) : (
                    <SeverityBadge severity={(item as DiseaseDiagnosis).severity} />
                  )}
                </div>

                <h4 className="font-extrabold text-slate-900 text-base">
                  {isAdvisory
                    ? (item as AdvisoryReport).recommended_crops?.[0]?.crop_name || 'Crop Selection Advisory'
                    : (item as DiseaseDiagnosis).diagnosis_name || (item as DiseaseDiagnosis).crop_name}
                </h4>

                <p className="text-xs text-slate-500 line-clamp-1 max-w-xl font-medium">
                  {isAdvisory
                    ? (item as AdvisoryReport).recommended_crops?.[0]?.reasoning
                    : (item as DiseaseDiagnosis).symptom_description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  {item.farm && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.farm.farm_name} ({item.farm.district})
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Link to={linkPath} className="shrink-0 w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition-all shadow-xs">
                <span>View Full Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
