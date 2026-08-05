import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Stethoscope, Tractor, ArrowRight, CloudSun, TrendingUp } from 'lucide-react';
import { Button } from '../components/common/Button';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 py-12 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-8 relative">
        <div className="inline-flex items-center gap-2 bg-agri-950/90 text-agri-400 px-4 py-1.5 rounded-full border border-agri-800/80 text-xs font-semibold shadow-lg">
          <Sparkles className="w-4 h-4 text-agri-400" />
          <span>Powered by Google Gemini 2.5 Flash Multimodal AI</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
          Personalized AI Agronomist for <span className="bg-gradient-to-r from-agri-400 via-agri-300 to-emerald-200 bg-clip-text text-transparent">Smarter Crop Yields</span>
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Ground your farm in soil science, local weather forecasts, disease vision diagnosis, and mandi market prices — all through a secure, structured AI platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto px-8 py-3.5 text-base">
              <span>Register Your Farm Profile</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3.5 text-base bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
              Farmer Login
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 space-y-4 hover:border-agri-500/50 transition-all">
          <div className="p-4 rounded-2xl bg-agri-600/20 text-agri-400 w-fit">
            <Tractor className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">AI Crop Selection Engine</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Ranked crop recommendations based on your soil type, water availability, season, and market targets.
          </p>
        </div>

        <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 space-y-4 hover:border-agri-500/50 transition-all">
          <div className="p-4 rounded-2xl bg-red-500/20 text-red-400 w-fit">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Multimodal Vision Diagnosis</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Snap leaf photos to instantly diagnose fungal rust, mildew, or insect attacks with step-by-step organic remedies.
          </p>
        </div>

        <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 space-y-4 hover:border-agri-500/50 transition-all">
          <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 w-fit">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Mandi Market Intelligence</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Track daily mandi price trends across states and receive AI recommendations on optimal crop selling windows.
          </p>
        </div>
      </section>
    </div>
  );
};
