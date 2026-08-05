import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Farm } from '../types';
import { DiagnosisUploadForm } from '../components/diagnosis/DiagnosisUploadForm';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export const DiagnosisRequestPage: React.FC = () => {
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

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await api.post('/diagnosis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showToast('Crop disease diagnosis complete!', 'success');
      navigate(`/diagnosis/${res.data.diagnosis.id}`);
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to analyze crop photo', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading farm profiles..." />;

  if (farms.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-4 max-w-lg mx-auto my-12">
        <h3 className="text-lg font-bold text-slate-800">No Farm Profiles Registered</h3>
        <p className="text-xs text-slate-500">Please register a farm profile before diagnosing crop diseases.</p>
        <button onClick={() => navigate('/farms/new')} className="bg-agri-600 text-white text-xs font-bold px-4 py-2 rounded-xl">
          Add Farm Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <DiagnosisUploadForm
        farms={farms}
        selectedFarmId={farmIdParam || undefined}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};
