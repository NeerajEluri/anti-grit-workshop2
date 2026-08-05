import React, { useState } from 'react';
import { Sparkles, Compass, Target } from 'lucide-react';
import { Farm } from '../../types';
import { advisoryRequestSchema } from '../../validation/schemas';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { TextArea } from '../common/TextArea';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

interface AdvisoryRequestFormProps {
  farms: Farm[];
  selectedFarmId?: string;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export const AdvisoryRequestForm: React.FC<AdvisoryRequestFormProps> = ({
  farms,
  selectedFarmId,
  onSubmit,
  isLoading = false,
}) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    farm_id: selectedFarmId || (farms.length > 0 ? farms[0].id : ''),
    advisory_type: 'crop_selection',
    crop_category: '',
    specific_crop: '',
    budget_range: 'medium',
    primary_goal: 'max_yield',
    additional_notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const farmOptions = farms.map((f) => ({
    value: f.id,
    label: `${f.farm_name} (${f.district}, ${f.land_size_acres} Acres)`,
  }));

  const advisoryTypes = [
    { value: 'crop_selection', label: 'Crop Selection & Yield Optimization' },
    { value: 'fertilizer_nutrition', label: 'Fertilizer & Soil Nutrition Planning' },
    { value: 'irrigation_water_management', label: 'Irrigation & Water Conservation Schedule' },
    { value: 'disease_pest_management', label: 'Preventative Pest & Disease Advisory' },
    { value: 'weather_based', label: 'Weather-Aware Planting Strategy' },
    { value: 'market_post_harvest', label: 'Market Timing & Post-Harvest Advisory' },
  ];

  const categories = [
    { value: '', label: 'All Categories (Recommended)' },
    { value: 'cereals', label: 'Cereals (Wheat, Rice, Maize, Pearl Millet)' },
    { value: 'pulses', label: 'Pulses (Chickpea, Pigeon Pea, Lentil)' },
    { value: 'oilseeds', label: 'Oilseeds (Mustard, Groundnut, Soybean)' },
    { value: 'vegetables', label: 'Vegetables (Tomato, Onion, Potato)' },
    { value: 'fruits', label: 'Fruits (Mango, Banana, Citrus)' },
    { value: 'cash_crops', label: 'Cash Crops (Cotton, Sugarcane)' },
    { value: 'spices', label: 'Spices (Cumin, Coriander, Turmeric)' },
  ];

  const goals = [
    { value: 'max_yield', label: 'Maximize Total Crop Yield' },
    { value: 'low_risk', label: 'Low Risk & Climate Resilience' },
    { value: 'water_saving', label: 'Water Conservation & Drought Safety' },
    { value: 'market_price', label: 'Maximize Market Realization & Profitability' },
  ];

  const budgetRanges = [
    { value: 'low', label: 'Low Input Budget (Cost-effective)' },
    { value: 'medium', label: 'Medium Budget (Standard fertigation)' },
    { value: 'high', label: 'High Budget (Maximum technology & micro-nutrients)' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      crop_category: formData.crop_category || undefined,
      specific_crop: formData.specific_crop || undefined,
      budget_range: formData.budget_range || undefined,
      additional_notes: formData.additional_notes || undefined,
    };

    const result = advisoryRequestSchema.safeParse(rawPayload);
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
      showToast(err.message || 'Failed to submit advisory request', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-3 bg-agri-100 text-agri-700 rounded-xl">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">AI Crop Advisory Generator</h3>
          <p className="text-xs text-slate-500">Google Gemini analyzes farm parameters + weather forecast + soil science.</p>
        </div>
      </div>

      <div className="space-y-4">
        <Select
          label="Select Target Farm Profile *"
          name="farm_id"
          options={farmOptions}
          value={formData.farm_id}
          onChange={handleChange}
          error={errors.farm_id}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Advisory Category *"
            name="advisory_type"
            options={advisoryTypes}
            value={formData.advisory_type}
            onChange={handleChange}
            error={errors.advisory_type}
          />

          <Select
            label="Primary Farming Goal *"
            name="primary_goal"
            options={goals}
            value={formData.primary_goal}
            onChange={handleChange}
            error={errors.primary_goal}
          />

          <Select
            label="Crop Category Preference"
            name="crop_category"
            options={categories}
            value={formData.crop_category}
            onChange={handleChange}
            error={errors.crop_category}
          />

          <Select
            label="Budget Range"
            name="budget_range"
            options={budgetRanges}
            value={formData.budget_range}
            onChange={handleChange}
            error={errors.budget_range}
          />
        </div>

        <Input
          label="Specific Crop of Interest (Optional)"
          name="specific_crop"
          placeholder="e.g. Wheat / Mustard / Cotton"
          value={formData.specific_crop}
          onChange={handleChange}
          error={errors.specific_crop}
        />

        <TextArea
          label="Additional Field Notes & Observations"
          name="additional_notes"
          placeholder="Mention any observed soil issues, water salinity, pest history, or market constraints..."
          value={formData.additional_notes}
          onChange={handleChange}
          error={errors.additional_notes}
        />
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <Button type="submit" size="lg" isLoading={isLoading} className="w-full sm:w-auto">
          <Sparkles className="w-5 h-5" />
          <span>Generate Structured Advisory Report</span>
        </Button>
      </div>
    </form>
  );
};
