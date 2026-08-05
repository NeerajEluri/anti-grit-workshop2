import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { CropMaster } from '../../types';
import { CropMasterTable } from '../../components/admin/CropMasterTable';
import { CropMasterForm } from '../../components/admin/CropMasterForm';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

export const AdminCropsPage: React.FC = () => {
  const { showToast } = useToast();

  const [crops, setCrops] = useState<CropMaster[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCrop, setEditingCrop] = useState<CropMaster | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const res = await api.get('/admin/crops');
      setCrops(res.data?.crops || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingCrop) {
        await api.patch(`/admin/crops/${editingCrop.id}`, data);
        showToast('Crop master record updated!', 'success');
      } else {
        await api.post('/admin/crops', data);
        showToast('New crop master record created!', 'success');
      }
      setIsModalOpen(false);
      setEditingCrop(null);
      await fetchCrops();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to save crop record', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this crop master record?')) return;
    try {
      await api.delete(`/admin/crops/${id}`);
      showToast('Crop master record deleted', 'success');
      await fetchCrops();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to delete crop record', 'error');
    }
  };

  if (loading) return <LoadingSpinner label="Loading crop master database..." />;

  return (
    <div className="space-y-6">
      <CropMasterTable
        crops={crops}
        onEdit={(crop) => {
          setEditingCrop(crop);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
        onAddNew={() => {
          setEditingCrop(null);
          setIsModalOpen(true);
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCrop ? 'Edit Crop Master Record' : 'Add Crop Master Record'}
      >
        <CropMasterForm
          initialData={editingCrop}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};
