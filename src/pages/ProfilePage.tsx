import React, { useState } from 'react';
import { User, Phone, Globe, Shield, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/api';

export const ProfilePage: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [language, setLanguage] = useState(profile?.preferred_language || 'en');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi (हिन्दी)' },
    { value: 'gu', label: 'Gujarati (ગુજરાતી)' },
    { value: 'mr', label: 'Marathi (मराठी)' },
    { value: 'pa', label: 'Punjabi (પંજાબી)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      showToast('Profile updated successfully!', 'success');
      await refreshProfile();
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-3 bg-agri-100 text-agri-700 rounded-xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Farmer Account Settings</h2>
            <p className="text-xs text-slate-500">Manage contact details, language preferences, and security options.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            icon={<Phone className="w-4 h-4" />}
            placeholder="+91 98765 43210"
          />

          <Select
            label="Preferred UI Language"
            options={languageOptions}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Shield className="w-4 h-4 text-agri-600" /> Account Security & Role
            </div>
            <p className="text-slate-500">
              Role: <span className="font-bold uppercase text-slate-700">{profile?.role || 'farmer'}</span>
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button type="submit" isLoading={isSubmitting}>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
