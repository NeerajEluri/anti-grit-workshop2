import { Router } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { isSupabaseConfigured, supabaseAdmin, memoryDb } from '../services/supabaseClient';
import { getFarmWeather } from '../services/weatherService';

const router = Router();
router.use(authMiddleware);

router.get('/:farmId', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { farmId } = req.params;
    const userId = req.user!.id;

    let farm: any;
    if (!isSupabaseConfigured) {
      farm = memoryDb.farms.get(farmId);
    } else {
      const { data } = await supabaseAdmin.from('farms').select('*').eq('id', farmId).single();
      farm = data;
    }

    if (!farm || (farm.owner_id !== userId && req.user!.role !== 'admin')) {
      return res.status(404).json({ error: 'Farm profile not found' });
    }

    const weather = await getFarmWeather(farm.state, farm.district);
    res.json({ farm, weather });
  } catch (err) {
    next(err);
  }
});

export default router;
