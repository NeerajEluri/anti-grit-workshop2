import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stethoscope, Calendar, MapPin, AlertOctagon } from 'lucide-react';
import { api } from '../lib/api';
import { DiseaseDiagnosis } from '../types';
import { SeverityBadge } from '../components/diagnosis/SeverityBadge';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { TreatmentPlanList } from '../components/diagnosis/TreatmentPlanList';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export const DiagnosisDetailPage: React.FC = () => {
  const { diagnosisId } = useParams<{ diagnosisId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [diagnosis, setDiagnosis] = useState<DiseaseDiagnosis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!diagnosisId) return;
    api.get(`/diagnosis/${diagnosisId}`)
      .then((res) => setDiagnosis(res.data?.diagnosis))
      .catch(() => {
        showToast('Diagnosis record not found', 'error');
        navigate('/history');
      })
      .finally(() => setLoading(false));
  }, [diagnosisId]);

  if (loading) return <LoadingSpinner label="Loading diagnosis details..." size="lg" />;
  if (!diagnosis) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-red-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Stethoscope className="w-5 h-5 text-red-400" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-red-400">
                AI Vision Disease & Pest Diagnosis
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {diagnosis.diagnosis_name || diagnosis.crop_name}
            </h2>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Crop: {diagnosis.crop_name} • Farm: {diagnosis.farm?.farm_name || 'Target Farm'}</span>
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <SeverityBadge severity={diagnosis.severity} />
            <ConfidenceBadge score={diagnosis.confidence_score} />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80 font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Diagnosed on {new Date(diagnosis.created_at).toLocaleDateString()}
          </span>
          {diagnosis.requires_admin_review && (
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5" /> Flagged for Admin Agronomist Review
            </span>
          )}
        </div>
      </div>

      {/* Overview & Symptom card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h4 className="font-extrabold text-slate-900 text-base">Symptom & Visual Diagnosis Notes</h4>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {diagnosis.symptom_description}
          </p>
          {diagnosis.ai_raw_response?.explanation && (
            <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-red-900 block mb-1">Fungal / Pest Mechanism:</span>
              {diagnosis.ai_raw_response.explanation}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h4 className="font-extrabold text-slate-900 text-sm">Diagnostic Parameters</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
              <span className="text-slate-400 font-medium">Affected Field Area:</span>
              <span className="font-bold text-slate-800">{diagnosis.affected_area_percent}%</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-50">
              <span className="text-slate-400 font-medium">Days Observed:</span>
              <span className="font-bold text-slate-800">{diagnosis.days_since_symptoms} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Treatment Plan */}
      <TreatmentPlanList
        steps={diagnosis.treatment_plan || []}
        preventionTips={diagnosis.prevention_tips || []}
      />
    </div>
  );
};
