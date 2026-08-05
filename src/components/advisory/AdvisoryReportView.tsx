import React from 'react';
import { Calendar, MapPin, Sparkles, Printer, Download } from 'lucide-react';
import { AdvisoryReport } from '../../types';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { CropRecommendationCard } from './CropRecommendationCard';
import { FertilizerScheduleTable } from './FertilizerScheduleTable';
import { IrrigationScheduleTable } from './IrrigationScheduleTable';
import { Button } from '../common/Button';

interface AdvisoryReportViewProps {
  report: AdvisoryReport;
}

export const AdvisoryReportView: React.FC<AdvisoryReportViewProps> = ({ report }) => {
  const farm = report.farm;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:p-0">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-agri-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-agri-400" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-agri-400">
                AI Agronomist Advisory Report
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {report.recommended_crops?.[0]?.crop_name || 'Crop Advisory'} Strategy
            </h2>
            {farm && (
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{farm.farm_name} • {farm.district}, {farm.state} ({farm.land_size_acres} Acres • {farm.soil_type} soil)</span>
              </p>
            )}
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2 print:hidden">
            <ConfidenceBadge score={report.ai_confidence_score} />
            <div className="flex items-center gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={handlePrint} className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
                <Printer className="w-3.5 h-3.5" />
                <span>Print Report</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80 font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Generated on {new Date(report.created_at).toLocaleDateString()}
          </span>
          <span>• Model: {report.model_used}</span>
        </div>
      </div>

      {/* Summary Box */}
      {report.ai_raw_response?.advisory_summary && (
        <div className="bg-agri-50 border border-agri-200 rounded-2xl p-5 text-sm text-agri-950 leading-relaxed font-medium">
          <h4 className="font-extrabold text-agri-900 mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-agri-600" /> Agronomist Executive Summary
          </h4>
          <p>{report.ai_raw_response.advisory_summary}</p>
        </div>
      )}

      {/* Crop Recommendation Cards */}
      <div>
        <h3 className="text-xl font-extrabold text-slate-900 mb-4">Ranked Suitable Crops</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {report.recommended_crops?.map((crop, idx) => (
            <CropRecommendationCard key={idx} crop={crop} />
          ))}
        </div>
      </div>

      {/* Fertilizer Schedule */}
      {report.fertilizer_schedule && (
        <FertilizerScheduleTable schedule={report.fertilizer_schedule} />
      )}

      {/* Irrigation Schedule */}
      {report.irrigation_schedule && (
        <IrrigationScheduleTable schedule={report.irrigation_schedule} />
      )}
    </div>
  );
};
