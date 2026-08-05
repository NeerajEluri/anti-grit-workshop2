import React from 'react';
import { MarketPrice } from '../../types';
import { TrendingUp, MapPin, Calendar } from 'lucide-react';

interface MarketPriceTableProps {
  prices: MarketPrice[];
  onSelectCrop?: (cropName: string) => void;
}

export const MarketPriceTable: React.FC<MarketPriceTableProps> = ({ prices, onSelectCrop }) => {
  if (prices.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
        No mandi prices found for the selected query.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-agri-600" />
          <h4 className="font-extrabold text-slate-800 text-base">Recorded Mandi Prices</h4>
        </div>
        <span className="text-xs text-slate-400 font-semibold">{prices.length} Records</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-100/70 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4">Crop Name</th>
              <th className="py-3 px-4">Mandi Market</th>
              <th className="py-3 px-4">State</th>
              <th className="py-3 px-4">Price (₹ / Quintal)</th>
              <th className="py-3 px-4">Recorded Date</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {prices.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-extrabold text-slate-900">{item.crop_name}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">{item.market_name}</td>
                <td className="py-3.5 px-4 text-slate-500">{item.state}</td>
                <td className="py-3.5 px-4 font-mono font-extrabold text-agri-700 text-sm">
                  ₹{Number(item.price_per_quintal).toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-slate-400 font-medium">{item.recorded_date}</td>
                <td className="py-3.5 px-4 text-right">
                  {onSelectCrop && (
                    <button
                      onClick={() => onSelectCrop(item.crop_name)}
                      className="text-xs font-bold text-agri-600 hover:text-agri-700 bg-agri-50 px-2.5 py-1 rounded-lg border border-agri-200"
                    >
                      AI Selling Advice
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
