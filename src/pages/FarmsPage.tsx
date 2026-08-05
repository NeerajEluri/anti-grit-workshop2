import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Tractor } from 'lucide-react';
import { api } from '../lib/api';
import { Farm } from '../types';
import { FarmList } from '../components/farms/FarmList';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { strings } from '../i18n/strings';

export const FarmsPage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const t = strings.en.farms;

  useEffect(() => {
    api.get('/farms')
      .then((res) => setFarms(res.data?.farms || []))
      .catch((err) => console.error("Error fetching farms:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading farm profiles..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Tractor className="w-6 h-6 text-agri-600" />
            <span>{t.title}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.subtitle}</p>
        </div>
        <Link to="/farms/new">
          <Button>
            <Plus className="w-4 h-4" />
            <span>{t.addNew}</span>
          </Button>
        </Link>
      </div>

      <FarmList farms={farms} />
    </div>
  );
};
