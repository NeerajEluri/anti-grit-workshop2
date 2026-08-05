import React, { useState } from 'react';
import { CropMaster } from '../../types';
import { cropMasterSchema } from '../../validation/schemas';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { TextArea } from '../common/TextArea';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

interface CropMasterFormProps {
  initialData?: CropMaster | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CropMasterForm: React.FC<CropMasterFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    crop_name: initialData?.crop_name || '',
    category: initialData?.category || 'cereals',
    suitable_soil_types: initialData?.suitable_soil_types || ['black_cotton', 'alluvial'],
    suitable_seasons: initialData?.suitable_seasons || ['rabi'],
    water_requirement: initialData?.water_requirement || '450-650 mm',
    typical_duration_days: initialData?.typical_duration_days ? String(initialData.typical_duration_days) : '120',
    average_yield_per_acre: initialData?.average_yield_per_acre || '18-22 Quintals',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'cereals', label: 'Cereals' },
    { value: 'pulses', label: 'Pulses' },
    { value: 'oilseeds', label: 'Oilseeds' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'cash_crops', label: 'Cash Crops' },
    { value: 'spices', label: 'Spices' },
    { value: 'fibre_crops', label: 'Fibre Crops' },
    { value: 'fodder_crops', label: 'Fodder Crops' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const rawPayload = {
      ...formData,
      typical_duration_days: formData.typical_duration_days ? parseInt(formData.typical_duration_days) : undefined,
    };

    const result = cropMasterSchema.safeParse(rawPayload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      showToast('Please correct crop master form errors', 'error');
      return;
    }

    try {
      await onSubmit(result.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to save crop master record', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Crop Name *"
        value={formData.crop_name}
        onChange={(e) => setFormData((prev) => ({ ...prev, crop_name: e.target.value }))}
        error={errors.crop_name}
        required
      />

      <Select
        label="Crop Category *"
        options={categories}
        value={formData.category}
        onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as any }))}
        error={errors.category}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Water Requirement"
          value={formData.water_requirement}
          onChange={(e) => setFormData((prev) => ({ ...prev, water_requirement: e.target.value }))}
        />

        <Input
          label="Typical Duration (Days)"
          type="number"
          value={formData.typical_duration_days}
          onChange={(e) => setFormData((prev) => ({ ...prev, typical_duration_days: e.target.value }))}
        />
      </div>

      <Input
        label="Average Yield Per Acre"
        value={formData.average_yield_per_acre}
        onChange={(e) => setFormData((prev) => ({ ...prev, average_yield_per_acre: e.target.value }))}
      />

      <TextArea
        label="Agronomic Master Notes"
        value={formData.notes}
        onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
        rows={3}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Save Crop Record
        </Button>
      </div>
    </form>
  );
};
