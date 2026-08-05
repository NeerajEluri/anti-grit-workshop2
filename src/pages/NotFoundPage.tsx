import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-2xl bg-agri-600/20 text-agri-400 mb-4 animate-bounce">
        <Sprout className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">404 - Field Not Found</h1>
      <p className="text-slate-400 text-sm max-w-sm mb-6">
        The requested agronomic page does not exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 bg-agri-600 hover:bg-agri-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-md"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
