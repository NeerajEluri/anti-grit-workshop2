import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Stethoscope, MessageSquare, Plus, Tractor } from 'lucide-react';
import { api } from '../lib/api';
import { Farm, AdvisoryReport, WeatherData, NotificationItem } from '../types';
import { FarmCard } from '../components/dashboard/FarmCard';
import { WeatherSnapshotWidget } from '../components/dashboard/WeatherSnapshotWidget';
import { RecentAdvisoryWidget } from '../components/dashboard/RecentAdvisoryWidget';
import { AlertsWidget } from '../components/dashboard/AlertsWidget';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { strings } from '../i18n/strings';

export const DashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const t = strings.en.dashboard;

  const [farms, setFarms] = useState<Farm[]>([]);
  const [advisories, setAdvisories] = useState<AdvisoryReport[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [farmsRes, advRes] = await Promise.all([
          api.get('/farms'),
          api.get('/advisory'),
        ]);

        const farmList = farmsRes.data?.farms || [];
        setFarms(farmList);
        setAdvisories(advRes.data?.reports || []);

        if (farmList.length > 0) {
          const firstFarm = farmList[0];
          const weatherRes = await api.get(`/weather/${firstFarm.id}`);
          setWeather(weatherRes.data?.weather || null);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading farm profile dashboard..." size="lg" />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.welcome}, {profile?.full_name || 'Farmer'}! 👋
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            AgriAdvisor AI is active. {farms.length} registered farm profiles under management.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/advisory/new">
            <Button size="sm" className="bg-agri-600 hover:bg-agri-700">
              <Sparkles className="w-4 h-4" />
              <span>Get Recommendation</span>
            </Button>
          </Link>
          <Link to="/diagnosis/new">
            <Button variant="secondary" size="sm">
              <Stethoscope className="w-4 h-4" />
              <span>Diagnose Crop</span>
            </Button>
          </Link>
          <Link to="/chat">
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 text-agri-600" />
              <span>Agronomist Chat</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <WeatherSnapshotWidget weather={weather} farmName={farms[0]?.farm_name} />

          {/* Farms section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Tractor className="w-5 h-5 text-agri-600" />
                <span>{t.yourFarms}</span>
              </h3>
              <Link to="/farms/new">
                <Button variant="outline" size="sm">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Farm Profile</span>
                </Button>
              </Link>
            </div>

            {farms.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                <p className="text-sm font-semibold text-slate-700">{t.noFarmsYet}</p>
                <Link to="/farms/new">
                  <Button>{t.createFirstFarm}</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {farms.map((f) => (
                  <FarmCard key={f.id} farm={f} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <AlertsWidget notifications={[]} />
          <RecentAdvisoryWidget reports={advisories} />
        </div>
      </div>
    </div>
  );
};
