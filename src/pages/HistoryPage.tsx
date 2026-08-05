import React, { useEffect, useState } from 'react';
import { History } from 'lucide-react';
import { api } from '../lib/api';
import { AdvisoryReport, DiseaseDiagnosis, Farm } from '../types';
import { HistoryFilters } from '../components/history/HistoryFilters';
import { HistoryTimeline } from '../components/history/HistoryTimeline';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const HistoryPage: React.FC = () => {
  const [advisories, setAdvisories] = useState<AdvisoryReport[]>([]);
  const [diagnoses, setDiagnoses] = useState<DiseaseDiagnosis[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    Promise.all([
      api.get('/advisory'),
      api.get('/diagnosis'),
      api.get('/farms'),
    ])
      .then(([advRes, diagRes, farmRes]) => {
        setAdvisories(advRes.data?.reports || []);
        setDiagnoses(diagRes.data?.diagnoses || []);
        setFarms(farmRes.data?.farms || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading advisory history..." />;

  // Combine items
  const combinedItems = [
    ...advisories.map((a) => ({ ...a, itemType: 'advisory' as const })),
    ...diagnoses.map((d) => ({ ...d, itemType: 'diagnosis' as const })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Filter items
  const filteredItems = combinedItems.filter((item) => {
    if (typeFilter !== 'all' && item.itemType !== typeFilter) return false;
    if (selectedFarmId && item.farm_id !== selectedFarmId) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (item.itemType === 'advisory') {
        const cropMatch = item.recommended_crops?.some((c) => c.crop_name.toLowerCase().includes(term));
        if (!cropMatch) return false;
      } else {
        const diagMatch = item.diagnosis_name?.toLowerCase().includes(term) || item.crop_name.toLowerCase().includes(term);
        if (!diagMatch) return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <History className="w-6 h-6 text-agri-600" />
          <span>Unified Advisory & Diagnosis History</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">Filter, search, and revisit past crop recommendations and disease diagnoses.</p>
      </div>

      <HistoryFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedFarmId={selectedFarmId}
        onFarmChange={setSelectedFarmId}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        farms={farms}
      />

      <HistoryTimeline items={filteredItems} />
    </div>
  );
};
