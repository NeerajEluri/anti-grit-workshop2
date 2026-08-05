import React from 'react';
import { Search, Filter, Tractor } from 'lucide-react';
import { Farm } from '../../types';

interface HistoryFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedFarmId: string;
  onFarmChange: (farmId: string) => void;
  typeFilter: string;
  onTypeChange: (type: string) => void;
  farms: Farm[];
}

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedFarmId,
  onFarmChange,
  typeFilter,
  onTypeChange,
  farms,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search crop, symptom, or disease..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-agri-500 focus:outline-none"
          />
        </div>

        {/* Farm Filter */}
        <select
          value={selectedFarmId}
          onChange={(e) => onFarmChange(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-agri-500 focus:outline-none"
        >
          <option value="">All Farm Profiles</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.farm_name} ({f.district})
            </option>
          ))}
        </select>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-agri-500 focus:outline-none"
        >
          <option value="all">All History Types (Advisory + Diagnosis)</option>
          <option value="advisory">Crop Advisory Reports Only</option>
          <option value="diagnosis">Disease Diagnoses Only</option>
        </select>
      </div>
    </div>
  );
};
