import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { api } from '../../lib/api';
import { AdminDashboardStats } from '../../components/admin/AdminDashboardStats';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setStats(res.data?.stats))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading admin analytics..." />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-amber-600" />
          <span>Platform Agronomy Oversight Dashboard</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">Global usage metrics, system confidence flags, and crop master management.</p>
      </div>

      {stats && <AdminDashboardStats stats={stats} />}
    </div>
  );
};
