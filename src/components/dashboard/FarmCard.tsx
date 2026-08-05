import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Droplets, Compass, ArrowRight } from 'lucide-react';
import { Farm } from '../../types';

interface FarmCardProps {
  farm: Farm;
}

export const FarmCard: React.FC<FarmCardProps> = ({ farm }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-agri-600 transition-colors">
              {farm.farm_name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{farm.village ? `${farm.village}, ` : ''}{farm.district}, {farm.state}</span>
            </div>
          </div>
          <span className="bg-agri-100 text-agri-800 font-bold text-xs px-2.5 py-1 rounded-full border border-agri-200 shrink-0">
            {farm.land_size_acres} Acres
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-slate-400 block font-medium text-[10px] uppercase tracking-wider">Soil Type</span>
            <span className="font-semibold text-slate-700 capitalize">{farm.soil_type.replace('_', ' ')}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-slate-400 block font-medium text-[10px] uppercase tracking-wider">Irrigation</span>
            <div className="flex items-center gap-1 font-semibold text-slate-700 capitalize">
              <Droplets className="w-3 h-3 text-sky-500" />
              <span>{farm.irrigation_source.replace('_', ' ')}</span>
            </div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-slate-400 block font-medium text-[10px] uppercase tracking-wider">Season</span>
            <div className="flex items-center gap-1 font-semibold text-slate-700 capitalize">
              <Compass className="w-3 h-3 text-emerald-500" />
              <span>{farm.current_season}</span>
            </div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-slate-400 block font-medium text-[10px] uppercase tracking-wider">Previous Crop</span>
            <span className="font-semibold text-slate-700 truncate block">{farm.previous_crop || 'Fallow / None'}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <Link
          to={`/farms/${farm.id}`}
          className="text-xs font-bold text-agri-600 hover:text-agri-700 inline-flex items-center gap-1.5 transition-colors"
        >
          <span>View Farm Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to={`/advisory/new?farmId=${farm.id}`}
          className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl transition-all shadow-xs"
        >
          Get Advisory
        </Link>
      </div>
    </div>
  );
};
