import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FarmForm } from '../components/farms/FarmForm';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

export const NewFarmPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.post('/farms', data);
      showToast('Farm profile created successfully!', 'success');
      navigate(`/farms/${res.data.farm.id}`);
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to create farm profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <FarmForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};
