import React, { useEffect, useState } from 'react';
import { TrendingUp, Search, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import { MarketPrice } from '../types';
import { MarketPriceTable } from '../components/market/MarketPriceTable';
import { MarketPriceChart } from '../components/market/MarketPriceChart';
import { SellingInsightCard } from '../components/market/SellingInsightCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';

export const MarketPricesPage: React.FC = () => {
  const { showToast } = useToast();

  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cropFilter, setCropFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  const [selectedCropForInsight, setSelectedCropForInsight] = useState('Wheat');
  const [insight, setInsight] = useState<any>(null);
  const [insightLoading, setInsightLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchPrices();
  }, [cropFilter, stateFilter]);

  const fetchPrices = async () => {
    try {
      const params = new URLSearchParams();
      if (cropFilter) params.append('crop', cropFilter);
      if (stateFilter) params.append('state', stateFilter);

      const res = await api.get(`/market/prices?${params.toString()}`);
      setPrices(res.data?.prices || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchInsight = async (cropName: string) => {
    setSelectedCropForInsight(cropName);
    setInsightLoading(true);
    try {
      const res = await api.post('/market/insight', {
        crop_name: cropName,
        state: stateFilter || 'Gujarat',
      });
      setInsight(res.data?.insight || null);
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to fetch selling insight', 'error');
    } finally {
      setInsightLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Querying mandi price rates..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-agri-600" />
            <span>Mandi Market Price Intelligence</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Track APMC rates across states and evaluate optimal harvest selling windows.</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search crop..."
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-800"
          />
          <input
            type="text"
            placeholder="State..."
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-800"
          />
        </div>
      </div>

      {/* Selling Insight & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <MarketPriceChart prices={prices} cropName={selectedCropForInsight} />
        </div>

        <div>
          {insight ? (
            <SellingInsightCard insight={insight} />
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3 text-center">
              <Sparkles className="w-8 h-8 text-agri-500 mx-auto" />
              <h4 className="font-extrabold text-slate-800 text-base">AI Selling Recommendation</h4>
              <p className="text-xs text-slate-500">
                Select a crop from the table below to generate an economic selling window recommendation.
              </p>
              <Button
                isLoading={insightLoading}
                onClick={() => handleFetchInsight(selectedCropForInsight)}
                className="w-full"
              >
                Get Selling Advice for {selectedCropForInsight}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mandi Price Table */}
      <MarketPriceTable prices={prices} onSelectCrop={handleFetchInsight} />
    </div>
  );
};
