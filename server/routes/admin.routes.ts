import { Router } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { cropMasterSchema } from '../../src/validation/schemas';
import { isSupabaseConfigured, supabaseAdmin, memoryDb } from '../services/supabaseClient';

const router = Router();
router.use(authMiddleware);
router.use(adminMiddleware);

// Helper to log admin mutations
async function logAdminAction(adminId: string, action: string, targetTable: string, targetId?: string, details?: any) {
  const entry = {
    id: 'audit-' + Math.random().toString(36).substring(2, 9),
    admin_id: adminId,
    action,
    target_table: targetTable,
    target_id: targetId || null,
    details: details || null,
    created_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured) {
    memoryDb.auditLog.set(entry.id, entry);
  } else {
    await supabaseAdmin.from('admin_audit_log').insert({
      admin_id: adminId,
      action,
      target_table: targetTable,
      target_id: targetId,
      details,
    });
  }
}

router.get('/dashboard', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!isSupabaseConfigured) {
      const totalUsers = memoryDb.profiles.size;
      const totalFarms = memoryDb.farms.size;
      const totalAdvisories = memoryDb.advisoryReports.size;
      const totalDiagnoses = memoryDb.diseaseDiagnoses.size;
      const flaggedDiagnoses = Array.from(memoryDb.diseaseDiagnoses.values()).filter(d => d.requires_admin_review).length;

      return res.json({
        stats: {
          totalUsers,
          totalFarms,
          totalAdvisories,
          totalDiagnoses,
          flaggedDiagnoses,
          activeCrops: memoryDb.cropMaster.size,
        }
      });
    }

    const [{ count: totalUsers }, { count: totalFarms }, { count: totalAdvisories }, { count: totalDiagnoses }, { count: flaggedDiagnoses }] = await Promise.all([
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('farms').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('advisory_reports').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('disease_diagnoses').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('disease_diagnoses').select('*', { count: 'exact', head: true }).eq('requires_admin_review', true),
    ]);

    res.json({
      stats: {
        totalUsers: totalUsers || 0,
        totalFarms: totalFarms || 0,
        totalAdvisories: totalAdvisories || 0,
        totalDiagnoses: totalDiagnoses || 0,
        flaggedDiagnoses: flaggedDiagnoses || 0,
      }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/crops', async (_req, res, next) => {
  try {
    if (!isSupabaseConfigured) {
      return res.json({ crops: Array.from(memoryDb.cropMaster.values()) });
    }
    const { data: crops, error } = await supabaseAdmin.from('crop_master').select('*').order('crop_name');
    if (error) throw error;
    res.json({ crops });
  } catch (err) {
    next(err);
  }
});

router.post('/crops', async (req: AuthenticatedRequest, res, next) => {
  try {
    const parsed = cropMasterSchema.parse(req.body);
    const adminId = req.user!.id;

    if (!isSupabaseConfigured) {
      const id = 'crop-' + Math.random().toString(36).substring(2, 9);
      const crop = { id, ...parsed, created_by: adminId, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      memoryDb.cropMaster.set(id, crop);
      await logAdminAction(adminId, 'CREATE_CROP', 'crop_master', id, parsed);
      return res.status(201).json({ crop });
    }

    const { data: crop, error } = await supabaseAdmin.from('crop_master').insert({ ...parsed, created_by: adminId }).select().single();
    if (error) throw error;

    await logAdminAction(adminId, 'CREATE_CROP', 'crop_master', crop.id, parsed);
    res.status(201).json({ crop });
  } catch (err) {
    next(err);
  }
});

router.patch('/crops/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const parsed = cropMasterSchema.partial().parse(req.body);
    const adminId = req.user!.id;

    if (!isSupabaseConfigured) {
      const existing = memoryDb.cropMaster.get(id);
      if (!existing) return res.status(404).json({ error: 'Crop entry not found' });
      const updated = { ...existing, ...parsed, updated_at: new Date().toISOString() };
      memoryDb.cropMaster.set(id, updated);
      await logAdminAction(adminId, 'UPDATE_CROP', 'crop_master', id, parsed);
      return res.json({ crop: updated });
    }

    const { data: updated, error } = await supabaseAdmin.from('crop_master').update(parsed).eq('id', id).select().single();
    if (error) throw error;

    await logAdminAction(adminId, 'UPDATE_CROP', 'crop_master', id, parsed);
    res.json({ crop: updated });
  } catch (err) {
    next(err);
  }
});

router.delete('/crops/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user!.id;

    if (!isSupabaseConfigured) {
      memoryDb.cropMaster.delete(id);
      await logAdminAction(adminId, 'DELETE_CROP', 'crop_master', id);
      return res.json({ message: 'Crop entry deleted' });
    }

    const { error } = await supabaseAdmin.from('crop_master').delete().eq('id', id);
    if (error) throw error;

    await logAdminAction(adminId, 'DELETE_CROP', 'crop_master', id);
    res.json({ message: 'Crop entry deleted' });
  } catch (err) {
    next(err);
  }
});

router.get('/users', async (_req, res, next) => {
  try {
    if (!isSupabaseConfigured) {
      return res.json({ users: Array.from(memoryDb.profiles.values()) });
    }
    const { data: users, error } = await supabaseAdmin.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

router.patch('/users/:id/role', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const adminId = req.user!.id;

    if (!['farmer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role must be farmer or admin' });
    }

    if (!isSupabaseConfigured) {
      const user = memoryDb.profiles.get(id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      user.role = role;
      memoryDb.profiles.set(id, user);
      await logAdminAction(adminId, 'UPDATE_USER_ROLE', 'profiles', id, { role });
      return res.json({ user });
    }

    const { data: updated, error } = await supabaseAdmin.from('profiles').update({ role }).eq('id', id).select().single();
    if (error) throw error;

    await logAdminAction(adminId, 'UPDATE_USER_ROLE', 'profiles', id, { role });
    res.json({ user: updated });
  } catch (err) {
    next(err);
  }
});

router.get('/audit-log', async (_req, res, next) => {
  try {
    if (!isSupabaseConfigured) {
      return res.json({ logs: Array.from(memoryDb.auditLog.values()) });
    }
    const { data: logs, error } = await supabaseAdmin.from('admin_audit_log').select('*, admin_profile:profiles(*)').order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ logs });
  } catch (err) {
    next(err);
  }
});

export default router;
