import { Router } from 'express';
import { supabaseAdmin, isSupabaseConfigured, memoryDb } from '../services/supabaseClient';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, full_name, role = 'farmer' } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    if (!isSupabaseConfigured) {
      const id = 'user-' + Math.random().toString(36).substring(2, 9);
      const profile = {
        id,
        full_name,
        phone: req.body.phone || null,
        role,
        preferred_language: 'en',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      memoryDb.profiles.set(id, profile);
      return res.status(201).json({ message: 'User registered successfully', profile });
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, role },
      },
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    res.status(201).json({ message: 'User registered successfully', user: authData.user });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!isSupabaseConfigured) {
      const isAdmin = email.includes('admin');
      const token = isAdmin ? 'admin_token' : 'farmer_token';
      const profile = {
        id: isAdmin ? '00000000-0000-0000-0000-000000000001' : '00000000-0000-0000-0000-000000000002',
        full_name: isAdmin ? 'Dr. Ramesh Kumar (Admin)' : 'Rajesh Patel',
        role: isAdmin ? 'admin' : 'farmer',
        preferred_language: 'en',
      };
      return res.json({ session: { access_token: token }, profile });
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json({ session: data.session, profile });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!isSupabaseConfigured) {
      const profile = memoryDb.profiles.get(req.user!.id) || {
        id: req.user!.id,
        full_name: req.user!.full_name || 'Rajesh Patel',
        role: req.user!.role || 'farmer',
        preferred_language: 'en',
      };
      return res.json({ profile });
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.user!.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (err) {
    next(err);
  }
});

export default router;
