import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between selection:bg-agri-500 selection:text-white">
      {/* Public Navbar */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-agri-600 to-agri-400 p-2.5 rounded-xl text-white shadow-lg shadow-agri-600/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight">AgriAdvisor AI</span>
              <span className="text-xs text-agri-400 block font-medium">Smart Agronomist Platform</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-agri-600 hover:bg-agri-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-agri-600/20"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1 flex flex-col justify-center">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AgriAdvisor AI. Empowering smallholder farmers with Google Gemini reasoning.</p>
          <p className="text-slate-400">Strictly server-side AI execution • High precision agronomy</p>
        </div>
      </footer>
    </div>
  );
};
