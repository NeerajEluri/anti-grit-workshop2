import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Droplets, Compass, Layers, Edit, Sparkles, Stethoscope } from 'lucide-react';
import { Farm } from '../../types';
import { Button } from '../common/Button';

interface FarmDetailPanelProps {
  farm: Farm;
  onDelete?: () => void;
}

export const FarmDetailPanel: React.FC<FarmDetailPanelProps> = ({ farm, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900">{farm.farm_name}</h2>
            <span className="bg-agri-100 text-agri-800 font-bold text-xs px-3 py-1 rounded-full border border-agri-200">
              {farm.land_size_acres} Acres
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mt-1">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{farm.village ? `${farm.village}, ` : ''}{farm.district}, {farm.state}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/farms/${farm.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Button>
          </Link>
          {onDelete && (
            <Button variant="danger" size="sm" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Soil Type</span>
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm capitalize">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>{farm.soil_type.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Irrigation Source</span>
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm capitalize">
            <Droplets className="w-4 h-4 text-sky-500" />
            <span>{farm.irrigation_source.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Water Supply</span>
          <span className="font-bold text-slate-800 text-sm capitalize block">{farm.water_availability}</span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Current Season</span>
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm capitalize">
            <Compass className="w-4 h-4 text-emerald-500" />
            <span>{farm.current_season}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
        <Link to={`/advisory/new?farmId=${farm.id}`}>
          <Button className="bg-agri-600 hover:bg-agri-700">
            <Sparkles className="w-4 h-4" />
            <span>Get AI Crop Advisory</span>
          </Button>
        </Link>
        <Link to={`/diagnosis/new?farmId=${farm.id}`}>
          <Button variant="secondary">
            <Stethoscope className="w-4 h-4" />
            <span>Diagnose Pest & Disease</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
