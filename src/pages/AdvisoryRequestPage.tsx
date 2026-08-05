import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Farm } from '../types';
import { AdvisoryRequestForm } from '../components/advisory/AdvisoryRequestForm';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export const AdvisoryRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const farmIdParam = searchParams.get('farmId');

  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    api.get('/farms')
      .then((res) => setFarms(res.data?.farms || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (payload: any) => {
    setIsSubmitting(true);
    try {
      const res = await api.post('/advisory/request', payload);
      showToast('AI Crop Advisory generated successfully!', 'success');
      navigate(`/advisory/${res.data.report.id}`);
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to generate advisory report', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading farm profiles..." />;

  if (farms.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-4 max-w-lg mx-auto my-12">
        <h3 className="text-lg font-bold text-slate-800">No Farm Profiles Found</h3>
        <p className="text-xs text-slate-500">You need at least one registered farm profile to generate grounded AI advisories.</p>
        <button
          onClick={() => navigate('/farms/new')}
          className="bg-agri-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          Create Farm Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <AdvisoryRequestForm
        farms={farms}
        selectedFarmId={farmIdParam || undefined}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};
