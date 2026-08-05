import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FarmForm } from '../components/farms/FarmForm';
import { api } from '../lib/api';
import { Farm } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export const EditFarmPage: React.FC = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!farmId) return;
    api.get(`/farms/${farmId}`)
      .then((res) => setFarm(res.data?.farm))
      .catch(() => navigate('/farms'))
      .finally(() => setLoading(false));
  }, [farmId]);

  const handleSubmit = async (data: any) => {
    if (!farmId) return;
    setIsSubmitting(true);
    try {
      await api.patch(`/farms/${farmId}`, data);
      showToast('Farm profile updated successfully!', 'success');
      navigate(`/farms/${farmId}`);
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to update farm profile', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading farm profile..." />;
  if (!farm) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <FarmForm initialData={farm} onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
};
