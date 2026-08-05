import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';
import { Farm } from '../../types';
import { diagnosisRequestSchema } from '../../validation/schemas';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { TextArea } from '../common/TextArea';
import { Button } from '../common/Button';
import { ImagePreview } from './ImagePreview';
import { useToast } from '../../context/ToastContext';

interface DiagnosisUploadFormProps {
  farms: Farm[];
  selectedFarmId?: string;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
}

export const DiagnosisUploadForm: React.FC<DiagnosisUploadFormProps> = ({
  farms,
  selectedFarmId,
  onSubmit,
  isLoading = false,
}) => {
  const { showToast } = useToast();

  const [farmId, setFarmId] = useState(selectedFarmId || (farms.length > 0 ? farms[0].id : ''));
  const [cropName, setCropName] = useState('');
  const [symptomDescription, setSymptomDescription] = useState('');
  const [affectedArea, setAffectedArea] = useState('15');
  const [daysObserved, setDaysObserved] = useState('3');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const farmOptions = farms.map((f) => ({
    value: f.id,
    label: `${f.farm_name} (${f.district}, ${f.land_size_acres} Acres)`,
  }));

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (errors.image_file) {
      setErrors((prev) => ({ ...prev, image_file: '' }));
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!imageFile) {
      setErrors({ image_file: 'Please upload a plant photograph' });
      showToast('Please upload a plant photograph', 'error');
      return;
    }

    const rawPayload = {
      farm_id: farmId,
      crop_name: cropName,
      symptom_description: symptomDescription,
      affected_area_percent: affectedArea ? parseInt(affectedArea) : undefined,
      days_since_symptoms: daysObserved ? parseInt(daysObserved) : undefined,
    };

    const result = diagnosisRequestSchema.safeParse(rawPayload);
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

    const formData = new FormData();
    formData.append('farm_id', farmId);
    formData.append('crop_name', cropName);
    formData.append('symptom_description', symptomDescription);
    if (affectedArea) formData.append('affected_area_percent', affectedArea);
    if (daysObserved) formData.append('days_since_symptoms', daysObserved);
    formData.append('image_file', imageFile);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      showToast(err.message || 'Failed to analyze plant photo', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
          <Stethoscope className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">AI Plant Disease & Pest Vision Diagnosis</h3>
          <p className="text-xs text-slate-500">Google Gemini Multimodal Vision inspects leaf lesions, discoloration, and insect patterns.</p>
        </div>
      </div>

      <div className="space-y-4">
        <Select
          label="Select Target Farm Profile *"
          name="farm_id"
          options={farmOptions}
          value={farmId}
          onChange={(e) => setFarmId(e.target.value)}
          error={errors.farm_id}
          required
        />

        <Input
          label="Affected Crop Name *"
          placeholder="e.g. Wheat / Tomato / Cotton"
          value={cropName}
          onChange={(e) => setCropName(e.target.value)}
          error={errors.crop_name}
          required
        />

        <ImagePreview
          file={imageFile}
          previewUrl={previewUrl}
          onSelectFile={handleFileSelect}
          onClear={handleClearImage}
          error={errors.image_file}
        />

        <TextArea
          label="Observed Symptom Description *"
          placeholder="Describe leaf spots, yellowing veins, powdery growth, wilting, or insect bites..."
          value={symptomDescription}
          onChange={(e) => setSymptomDescription(e.target.value)}
          error={errors.symptom_description}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Estimated Affected Field Area (%)"
            type="number"
            min="0"
            max="100"
            value={affectedArea}
            onChange={(e) => setAffectedArea(e.target.value)}
            error={errors.affected_area_percent}
          />

          <Input
            label="Days Since Symptoms Appeared"
            type="number"
            min="0"
            max="365"
            value={daysObserved}
            onChange={(e) => setDaysObserved(e.target.value)}
            error={errors.days_since_symptoms}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <Button type="submit" size="lg" isLoading={isLoading} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800">
          <Stethoscope className="w-5 h-5" />
          <span>Analyze Image & Diagnosing</span>
        </Button>
      </div>
    </form>
  );
};
