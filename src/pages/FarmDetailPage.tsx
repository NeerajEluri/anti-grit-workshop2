import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Farm } from '../types';
import { FarmDetailPanel } from '../components/farms/FarmDetailPanel';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export const FarmDetailPage: React.FC = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!farmId) return;
    api.get(`/farms/${farmId}`)
      .then((res) => setFarm(res.data?.farm))
      .catch((err) => {
        showToast('Farm profile not found or access denied', 'error');
        navigate('/farms');
      })
      .finally(() => setLoading(false));
  }, [farmId]);

  const handleDelete = async () => {
    if (!farm || !window.confirm(`Are you sure you want to delete "${farm.farm_name}"?`)) return;
    try {
      await api.delete(`/farms/${farm.id}`);
      showToast('Farm profile deleted successfully', 'success');
      navigate('/farms');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to delete farm profile', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading farm details..." />;
  }

  if (!farm) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <FarmDetailPanel farm={farm} onDelete={handleDelete} />
    </div>
  );
};
