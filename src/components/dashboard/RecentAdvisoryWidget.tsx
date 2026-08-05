import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { AdvisoryReport } from '../../types';
import { ConfidenceBadge } from '../common/ConfidenceBadge';

interface RecentAdvisoryProps {
  reports: AdvisoryReport[];
}

export const RecentAdvisoryWidget: React.FC<RecentAdvisoryProps> = ({ reports }) => {
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
        <Sparkles className="w-8 h-8 text-agri-500 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-700">No Advisory Reports Generated Yet</p>
        <p className="text-xs text-slate-400 mt-1 mb-4">Request a grounded crop selection & fertigation plan for your farm.</p>
        <Link
          to="/advisory/new"
          className="inline-flex items-center gap-2 text-xs font-bold bg-agri-600 hover:bg-agri-700 text-white px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          <span>Get Crop Advisory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-agri-600" />
          <span>Latest Advisory Reports</span>
        </h4>
        <Link to="/history" className="text-xs font-bold text-agri-600 hover:text-agri-700">
          View All History →
        </Link>
      </div>

      <div className="space-y-3">
        {reports.slice(0, 3).map((report) => (
          <Link
            key={report.id}
            to={`/advisory/${report.id}`}
            className="block p-4 rounded-xl border border-slate-100 hover:border-agri-300 hover:bg-agri-50/30 transition-all group"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h5 className="font-bold text-slate-800 text-sm group-hover:text-agri-600 transition-colors">
                  {report.recommended_crops?.[0]?.crop_name || 'Crop Recommendation'}
                </h5>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  {report.recommended_crops?.[0]?.reasoning || 'Tailored agronomy report'}
                </p>
              </div>
              <ConfidenceBadge score={report.ai_confidence_score} />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {new Date(report.created_at).toLocaleDateString()}
              </span>
              <span className="font-semibold text-agri-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                View Full Plan <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
