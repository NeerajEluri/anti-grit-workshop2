import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MarketPrice } from '../../types';

interface MarketPriceChartProps {
  prices: MarketPrice[];
  cropName: string;
}

export const MarketPriceChart: React.FC<MarketPriceChartProps> = ({ prices, cropName }) => {
  if (!prices || prices.length === 0) return null;

  // Format data for Recharts
  const chartData = prices
    .map((p) => ({
      date: p.recorded_date,
      price: Number(p.price_per_quintal),
      mandi: p.market_name,
    }))
    .reverse();

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-extrabold text-slate-900 text-base">
            Mandi Price Trend — {cropName}
          </h4>
          <p className="text-xs text-slate-500">Historical market rate fluctuations (₹ / Quintal)</p>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={['dataMin - 100', 'dataMax + 100']} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
              formatter={(val: any) => [`₹${val} / Quintal`, 'Price']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ fill: '#16a34a', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
