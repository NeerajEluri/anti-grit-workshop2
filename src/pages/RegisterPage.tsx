import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Sparkles } from 'lucide-react';
import { strings } from '../i18n/strings';

export const RegisterPage: React.FC = () => {
  const t = strings.en.auth;

  return (
    <div className="max-w-md w-full mx-auto px-6 py-12">
      <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700/80 shadow-2xl backdrop-blur-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-agri-600/20 text-agri-400 mb-1">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">{t.registerTitle}</h2>
          <p className="text-xs text-slate-400">{t.registerSub}</p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
};
