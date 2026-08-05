import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { strings } from '../../i18n/strings';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const t = strings.en.auth;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Try direct API proxy or client Supabase auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (authError) {
        // Fallback demo login via server route
        const res = await api.post('/auth/login', { email, password });
        if (res.data?.session?.access_token) {
          showToast('Logged in successfully', 'success');
          navigate('/dashboard');
          return;
        }
        throw new Error(authError.message);
      }

      showToast('Logged in successfully', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check credentials.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-900/30 border border-red-500/40 text-red-200 text-sm">
          {error}
        </div>
      )}

      <Input
        label={t.emailLabel}
        type="email"
        placeholder="farmer@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail className="w-4 h-4" />}
        required
      />

      <Input
        label={t.passwordLabel}
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock className="w-4 h-4" />}
        required
      />

      <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
        <LogIn className="w-4 h-4" />
        <span>{t.submitLogin}</span>
      </Button>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-400">
          {t.noAccount}{' '}
          <Link to="/register" className="text-agri-400 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </form>
  );
};
