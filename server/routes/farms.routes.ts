import { Router } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { farmProfileSchema } from '../../src/validation/schemas';
import { isSupabaseConfigured, supabaseAdmin, memoryDb } from '../services/supabaseClient';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const ownerId = req.user!.id;
    if (!isSupabaseConfigured) {
      const farms = Array.from(memoryDb.farms.values()).filter(f => f.owner_id === ownerId || req.user!.role === 'admin');
      return res.json({ farms });
    }

    let query = supabaseAdmin.from('farms').select('*');
    if (req.user!.role !== 'admin') {
      query = query.eq('owner_id', ownerId);
    }
    const { data: farms, error } = await query;
    if (error) throw error;
    res.json({ farms });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const parsed = farmProfileSchema.parse(req.body);
    const ownerId = req.user!.id;

    if (!isSupabaseConfigured) {
      const newFarm = {
        id: 'farm-' + Math.random().toString(36).substring(2, 9),
        owner_id: ownerId,
        ...parsed,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      memoryDb.farms.set(newFarm.id, newFarm);
      return res.status(201).json({ farm: newFarm });
    }

    const { data: farm, error } = await supabaseAdmin
      .from('farms')
      .insert({ owner_id: ownerId, ...parsed })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ farm });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user!.id;

    if (!isSupabaseConfigured) {
      const farm = memoryDb.farms.get(id);
      if (!farm || (farm.owner_id !== ownerId && req.user!.role !== 'admin')) {
        return res.status(404).json({ error: 'Farm not found or access denied' });
      }
      return res.json({ farm });
    }

    const { data: farm, error } = await supabaseAdmin
      .from('farms')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    if (farm.owner_id !== ownerId && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Access denied to this farm profile' });
    }

    res.json({ farm });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user!.id;
    const parsed = farmProfileSchema.partial().parse(req.body);

    if (!isSupabaseConfigured) {
      const farm = memoryDb.farms.get(id);
      if (!farm || farm.owner_id !== ownerId) {
        return res.status(404).json({ error: 'Farm not found or access denied' });
      }
      const updated = { ...farm, ...parsed, updated_at: new Date().toISOString() };
      memoryDb.farms.set(id, updated);
      return res.json({ farm: updated });
    }

    const { data: farm } = await supabaseAdmin.from('farms').select('owner_id').eq('id', id).single();
    if (!farm || farm.owner_id !== ownerId) {
      return res.status(404).json({ error: 'Farm not found or access denied' });
    }

    const { data: updated, error } = await supabaseAdmin
      .from('farms')
      .update(parsed)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ farm: updated });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user!.id;

    if (!isSupabaseConfigured) {
      const farm = memoryDb.farms.get(id);
      if (!farm || farm.owner_id !== ownerId) {
        return res.status(404).json({ error: 'Farm not found or access denied' });
      }
      memoryDb.farms.delete(id);
      return res.json({ message: 'Farm deleted successfully' });
    }

    const { error } = await supabaseAdmin
      .from('farms')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId);

    if (error) throw error;
    res.json({ message: 'Farm deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
