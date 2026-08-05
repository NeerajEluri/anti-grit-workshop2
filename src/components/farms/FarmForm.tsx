import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, Save } from 'lucide-react';
import { Farm } from '../../types';
import { farmProfileSchema } from '../../validation/schemas';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

interface FarmFormProps {
  initialData?: Farm;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export const FarmForm: React.FC<FarmFormProps> = ({ initialData, onSubmit, isLoading = false }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    farm_name: initialData?.farm_name || '',
    state: initialData?.state || 'Gujarat',
    district: initialData?.district || '',
    village: initialData?.village || '',
    latitude: initialData?.latitude ? String(initialData.latitude) : '',
    longitude: initialData?.longitude ? String(initialData.longitude) : '',
    land_size_acres: initialData?.land_size_acres ? String(initialData.land_size_acres) : '',
    soil_type: initialData?.soil_type || 'black_cotton',
    irrigation_source: initialData?.irrigation_source || 'borewell',
    water_availability: initialData?.water_availability || 'moderate',
    current_season: initialData?.current_season || 'rabi',
    previous_crop: initialData?.previous_crop || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const indianStates = [
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Haryana', label: 'Haryana' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'West Bengal', label: 'West Bengal' },
  ];

  const soilTypes = [
    { value: 'black_cotton', label: 'Black Cotton Soil (Regur)' },
    { value: 'alluvial', label: 'Alluvial Soil' },
    { value: 'red_soil', label: 'Red Soil' },
    { value: 'laterite', label: 'Laterite Soil' },
    { value: 'arid_sandy', label: 'Arid / Sandy Soil' },
    { value: 'mountain_forest', label: 'Mountain / Forest Soil' },
    { value: 'saline_alkaline', label: 'Saline / Alkaline Soil' },
    { value: 'loamy', label: 'Loamy Soil' },
  ];

  const irrigationSources = [
    { value: 'borewell', label: 'Borewell / Tubewell' },
    { value: 'canal', label: 'Canal Irrigation' },
    { value: 'rainfed', label: 'Rainfed (No Artificial Irrigation)' },
    { value: 'drip', label: 'Drip Irrigation System' },
    { value: 'sprinkler', label: 'Sprinkler System' },
    { value: 'tank_pond', label: 'Farm Pond / Water Tank' },
    { value: 'river_lift', label: 'River Lift Irrigation' },
  ];

  const waterAvailabilities = [
    { value: 'abundant', label: 'Abundant (Year-round water)' },
    { value: 'moderate', label: 'Moderate (Seasonal water)' },
    { value: 'scarce', label: 'Scarce (Limited / Critical supply)' },
  ];

  const seasons = [
    { value: 'rabi', label: 'Rabi (Winter Season - Oct to Mar)' },
    { value: 'kharif', label: 'Kharif (Monsoon Season - Jun to Oct)' },
    { value: 'zaid', label: 'Zaid (Summer Season - Mar to Jun)' },
    { value: 'perennial', label: 'Perennial (Year-round Crops)' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const rawPayload = {
      ...formData,
      land_size_acres: parseFloat(formData.land_size_acres),
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
    };

    const result = farmProfileSchema.safeParse(rawPayload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      showToast('Please correct form validation errors', 'error');
      return;
    }

    try {
      await onSubmit(result.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to save farm profile', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-3 bg-agri-100 text-agri-700 rounded-xl">
          <Tractor className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">
            {initialData ? 'Edit Farm Profile' : 'Register New Farm Profile'}
          </h3>
          <p className="text-xs text-slate-500">Provide precise agronomic metadata to ground AI recommendations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Farm Name *"
          name="farm_name"
          placeholder="e.g. North Field / Krishna Farm"
          value={formData.farm_name}
          onChange={handleChange}
          error={errors.farm_name}
          required
        />

        <Select
          label="State *"
          name="state"
          options={indianStates}
          value={formData.state}
          onChange={handleChange}
          error={errors.state}
        />

        <Input
          label="District *"
          name="district"
          placeholder="e.g. Anand / Ludhiana"
          value={formData.district}
          onChange={handleChange}
          error={errors.district}
          required
        />

        <Input
          label="Village (Optional)"
          name="village"
          placeholder="e.g. Vasna"
          value={formData.village}
          onChange={handleChange}
          error={errors.village}
        />

        <Input
          label="Land Size (Acres) *"
          name="land_size_acres"
          type="number"
          step="0.1"
          placeholder="e.g. 5.5"
          value={formData.land_size_acres}
          onChange={handleChange}
          error={errors.land_size_acres}
          required
        />

        <Select
          label="Soil Type *"
          name="soil_type"
          options={soilTypes}
          value={formData.soil_type}
          onChange={handleChange}
          error={errors.soil_type}
        />

        <Select
          label="Irrigation Source *"
          name="irrigation_source"
          options={irrigationSources}
          value={formData.irrigation_source}
          onChange={handleChange}
          error={errors.irrigation_source}
        />

        <Select
          label="Water Availability *"
          name="water_availability"
          options={waterAvailabilities}
          value={formData.water_availability}
          onChange={handleChange}
          error={errors.water_availability}
        />

        <Select
          label="Current Season *"
          name="current_season"
          options={seasons}
          value={formData.current_season}
          onChange={handleChange}
          error={errors.current_season}
        />

        <Input
          label="Previous Harvested Crop (Optional)"
          name="previous_crop"
          placeholder="e.g. Cotton / Paddy"
          value={formData.previous_crop}
          onChange={handleChange}
          error={errors.previous_crop}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        <Input
          label="Latitude (Optional)"
          name="latitude"
          type="number"
          step="0.000001"
          placeholder="e.g. 22.5645"
          value={formData.latitude}
          onChange={handleChange}
          error={errors.latitude}
        />

        <Input
          label="Longitude (Optional)"
          name="longitude"
          type="number"
          step="0.000001"
          placeholder="e.g. 72.9289"
          value={formData.longitude}
          onChange={handleChange}
          error={errors.longitude}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={() => navigate('/farms')}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          <Save className="w-4 h-4" />
          <span>Save Farm Profile</span>
        </Button>
      </div>
    </form>
  );
};
