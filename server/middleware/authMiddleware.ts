import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, isSupabaseConfigured, memoryDb } from '../services/supabaseClient';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role: 'farmer' | 'admin';
    full_name?: string;
  };
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Fallback for development demo if no token provided
      req.user = {
        id: '00000000-0000-0000-0000-000000000002',
        email: 'farmer@example.com',
        role: 'farmer',
        full_name: 'Rajesh Patel',
      };
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (!isSupabaseConfigured) {
      // In development fallback mode, check if token indicates admin or farmer
      if (token === 'admin_token') {
        req.user = {
          id: '00000000-0000-0000-0000-000000000001',
          email: 'admin@example.com',
          role: 'admin',
          full_name: 'Dr. Ramesh Kumar',
        };
      } else {
        req.user = {
          id: '00000000-0000-0000-0000-000000000002',
          email: 'farmer@example.com',
          role: 'farmer',
          full_name: 'Rajesh Patel',
        };
      }
      return next();
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired access token' });
    }

    // Fetch profile role
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email,
      role: (profile?.role as any) || 'farmer',
      full_name: profile?.full_name || user.user_metadata?.full_name || 'User',
    };

    next();
  } catch (err) {
    console.error('[Auth Middleware Error]:', err);
    res.status(401).json({ error: 'Authentication failed' });
  }
}
