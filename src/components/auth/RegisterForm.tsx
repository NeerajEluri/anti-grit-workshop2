import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, UserPlus } from 'lucide-react';
import { api } from '../../lib/api';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { strings } from '../../i18n/strings';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const t = strings.en.auth;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await api.post('/auth/register', {
        email,
        password,
        full_name: fullName,
        phone: phone || undefined,
        role: 'farmer',
      });

      showToast(t.registerSuccess, 'success');
      navigate('/login');
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Registration failed';
      setError(msg);
      showToast(msg, 'error');
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
        label={t.fullNameLabel}
        type="text"
        placeholder="Rajesh Patel"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        icon={<UserIcon className="w-4 h-4" />}
        required
      />

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
        placeholder="Minimum 6 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock className="w-4 h-4" />}
        minLength={6}
        required
      />

      <Input
        label={t.phoneLabel}
        type="tel"
        placeholder="+91 98765 43210"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
        <UserPlus className="w-4 h-4" />
        <span>{t.submitRegister}</span>
      </Button>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-400">
          {t.hasAccount}{' '}
          <Link to="/login" className="text-agri-400 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};
