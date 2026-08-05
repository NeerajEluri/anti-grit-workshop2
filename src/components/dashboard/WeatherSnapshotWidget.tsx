import React from 'react';
import { CloudSun, Sun, Thermometer, CloudRain, Wind, Droplet } from 'lucide-react';
import { WeatherData } from '../../types';

interface WeatherSnapshotProps {
  weather?: WeatherData | null;
  farmName?: string;
}

export const WeatherSnapshotWidget: React.FC<WeatherSnapshotProps> = ({ weather, farmName }) => {
  if (!weather) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center gap-3">
          <CloudSun className="w-8 h-8 text-agri-400 animate-pulse" />
          <div>
            <h4 className="font-bold text-base">Weather Snapshot</h4>
            <p className="text-xs text-slate-400">Loading agronomic weather metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-agri-950 rounded-2xl p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Sun className="w-40 h-40 text-amber-400" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-agri-400 bg-agri-950/80 px-2.5 py-1 rounded-md border border-agri-800">
              Agronomic Microclimate
            </span>
            <h4 className="font-extrabold text-lg text-white mt-1.5">{farmName || 'Target Farm Location'}</h4>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-3xl font-extrabold text-white">
              <span>{weather.temp_c}°C</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">{weather.condition}</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 leading-relaxed">
          {weather.forecast_summary}
        </p>

        <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/40">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <Droplet className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[10px] uppercase font-bold">Humidity</span>
            </div>
            <span className="font-extrabold text-sm text-white">{weather.humidity}%</span>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/40">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] uppercase font-bold">Rain Chance</span>
            </div>
            <span className="font-extrabold text-sm text-white">{weather.rain_probability}%</span>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/40">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <Wind className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[10px] uppercase font-bold">Wind</span>
            </div>
            <span className="font-extrabold text-sm text-white">{weather.wind_kph} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};
