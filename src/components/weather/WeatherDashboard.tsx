import React from 'react';
import { CloudSun, Sun, Droplets, CloudRain, Compass, Thermometer } from 'lucide-react';
import { Farm, WeatherData } from '../../types';

interface WeatherDashboardProps {
  farms: Farm[];
  selectedFarm?: Farm | null;
  weather?: WeatherData | null;
  onSelectFarm: (farmId: string) => void;
}

export const WeatherDashboard: React.FC<WeatherDashboardProps> = ({
  farms,
  selectedFarm,
  weather,
  onSelectFarm,
}) => {
  return (
    <div className="space-y-6">
      {/* Farm Selector Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <CloudSun className="w-6 h-6 text-agri-600" />
            <span>Farm Weather & Agronomic Forecast</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time microclimate intelligence grounded in your farm location.</p>
        </div>

        {farms.length > 0 && (
          <div className="w-full sm:w-64">
            <select
              value={selectedFarm?.id || ''}
              onChange={(e) => onSelectFarm(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 focus:border-agri-500 focus:outline-none"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.farm_name} ({f.district}, {f.state})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {weather && selectedFarm ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Weather Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-900 via-slate-850 to-agri-950 rounded-2xl p-8 text-white shadow-xl border border-slate-800 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sun className="w-64 h-64 text-amber-400" />
            </div>

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-agri-400 bg-agri-950 px-3 py-1 rounded-full border border-agri-800 uppercase tracking-wider">
                  Live Microclimate
                </span>
                <h3 className="text-2xl font-extrabold mt-3">{selectedFarm.farm_name}</h3>
                <p className="text-xs text-slate-300 font-medium">{selectedFarm.district}, {selectedFarm.state}</p>
              </div>

              <div className="text-right">
                <div className="text-5xl font-extrabold tracking-tight">{weather.temp_c}°C</div>
                <p className="text-sm font-semibold text-agri-300 mt-1">{weather.condition}</p>
              </div>
            </div>

            <div className="relative z-10 bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 leading-relaxed text-xs text-slate-200">
              <span className="font-bold text-agri-400 block mb-1">Agronomist Weather Assessment:</span>
              {weather.forecast_summary}
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/40">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Humidity</span>
                <span className="text-lg font-extrabold text-white">{weather.humidity}%</span>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/40">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Rain Chance</span>
                <span className="text-lg font-extrabold text-sky-400">{weather.rain_probability}%</span>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/40">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Wind Speed</span>
                <span className="text-lg font-extrabold text-teal-400">{weather.wind_kph} km/h</span>
              </div>
            </div>
          </div>

          {/* Actionable Rules Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-900 text-base">Agronomic Guidelines</h4>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-agri-50 border border-agri-200">
                <h5 className="font-bold text-agri-900">Spraying Window</h5>
                <p className="text-agri-950 mt-1">
                  {weather.rain_probability > 40
                    ? "High precipitation risk. Postpone pesticide/fungicide sprays to prevent wash-off."
                    : "Low rain chance. Optimal morning window for foliar spray applications."}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200">
                <h5 className="font-bold text-sky-900">Irrigation Timing</h5>
                <p className="text-sky-950 mt-1">
                  {weather.temp_c > 32
                    ? "High daytime evapotranspiration. Schedule drip irrigation in early morning or late evening."
                    : "Standard moisture loss. Maintain regular irrigation intervals."}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
          No farm selected or weather data unavailable.
        </div>
      )}
    </div>
  );
};
