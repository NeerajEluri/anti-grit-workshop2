import { Router } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { advisoryRequestSchema, aiCropRecommendationSchema } from '../../src/validation/schemas';
import { isSupabaseConfigured, supabaseAdmin, memoryDb } from '../services/supabaseClient';
import { getFarmWeather } from '../services/weatherService';
import { SYSTEM_INSTRUCTION, buildCropRecommendationPrompt, CROP_RECOMMENDATION_JSON_SCHEMA } from '../prompts/cropRecommendation';
import { generateStructuredAIResponse } from '../services/geminiClient';
import { aiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authMiddleware);

router.post('/request', aiRateLimiter, async (req: AuthenticatedRequest, res, next) => {
  try {
    const parsedRequest = advisoryRequestSchema.parse(req.body);
    const userId = req.user!.id;

    // Retrieve farm
    let farm: any;
    if (!isSupabaseConfigured) {
      farm = memoryDb.farms.get(parsedRequest.farm_id);
    } else {
      const { data } = await supabaseAdmin.from('farms').select('*').eq('id', parsedRequest.farm_id).single();
      farm = data;
    }

    if (!farm || (farm.owner_id !== userId && req.user!.role !== 'admin')) {
      return res.status(404).json({ error: 'Farm profile not found or access denied' });
    }

    // Weather snapshot
    const weather = await getFarmWeather(farm.state, farm.district);

    // Build prompt & Gemini call
    const promptText = buildCropRecommendationPrompt(farm, parsedRequest, weather.forecast_summary);

    const mockFallback = () => ({
      recommended_crops: [
        {
          crop_name: parsedRequest.specific_crop || "Wheat (HD-3086)",
          rank: 1,
          suitability_score: 0.92,
          reasoning: `Highly suited for ${farm.soil_type} soil in ${farm.state} during ${farm.current_season} season. Excellent drought tolerance and strong yield potential.`,
          expected_yield_range: "18-24 Quintals / Acre",
          estimated_duration_days: 125,
          risk_factors: ["Terminal heat stress if planted late", "Yellow rust risk during humid spells"]
        },
        {
          crop_name: "Chickpea / Chana (JG-14)",
          rank: 2,
          suitability_score: 0.86,
          reasoning: `Pulse crop providing atmospheric nitrogen fixation, low water footprint matches ${farm.water_availability} availability.`,
          expected_yield_range: "8-12 Quintals / Acre",
          estimated_duration_days: 110,
          risk_factors: ["Pod borer attack during flowering", "Wilt disease in waterlogged soils"]
        },
        {
          crop_name: "Mustard / Sarson (Pusa Bold)",
          rank: 3,
          suitability_score: 0.81,
          reasoning: "Commercial oilseed option with strong local mandi liquidity and low pest pressure.",
          expected_yield_range: "7-10 Quintals / Acre",
          estimated_duration_days: 105,
          risk_factors: ["Aphids infestation during cold nights"]
        }
      ],
      fertilizer_schedule: [
        { crop_name: parsedRequest.specific_crop || "Wheat", stage: "Basal (At Sowing)", timing: "Day 0", fertilizer_type: "DAP + MOP + Zinc", quantity_per_acre: "50kg DAP + 25kg MOP + 10kg Zinc Sulphate" },
        { crop_name: parsedRequest.specific_crop || "Wheat", stage: "First Irrigation (CRI Stage)", timing: "Day 21", fertilizer_type: "Urea", quantity_per_acre: "35kg Urea" },
        { crop_name: parsedRequest.specific_crop || "Wheat", stage: "Jointing Stage", timing: "Day 45", fertilizer_type: "Urea", quantity_per_acre: "35kg Urea" }
      ],
      irrigation_schedule: [
        { crop_name: parsedRequest.specific_crop || "Wheat", growth_stage: "Crown Root Initiation", frequency: "20-25 days after sowing", water_amount: "50-60 mm" },
        { crop_name: parsedRequest.specific_crop || "Wheat", growth_stage: "Tillering Stage", frequency: "40-45 days after sowing", water_amount: "50 mm" },
        { crop_name: parsedRequest.specific_crop || "Wheat", growth_stage: "Flowering & Grain Filling", frequency: "70-85 days after sowing", water_amount: "50 mm" }
      ],
      overall_confidence_score: 0.90,
      advisory_summary: `Optimal crop plan generated for ${farm.farm_name} (${farm.district}, ${farm.state}). Grounded in ${farm.soil_type} soil characteristics and ${farm.current_season} weather forecast.`
    });

    const aiResult = await generateStructuredAIResponse(
      SYSTEM_INSTRUCTION,
      promptText,
      CROP_RECOMMENDATION_JSON_SCHEMA,
      (data) => aiCropRecommendationSchema.parse(data),
      mockFallback
    );

    const requestId = 'req-' + Math.random().toString(36).substring(2, 9);
    const reportId = 'rep-' + Math.random().toString(36).substring(2, 9);

    const advisoryReport = {
      id: reportId,
      request_id: requestId,
      farm_id: farm.id,
      owner_id: userId,
      recommended_crops: aiResult.data.recommended_crops,
      fertilizer_schedule: aiResult.data.fertilizer_schedule,
      irrigation_schedule: aiResult.data.irrigation_schedule,
      risk_factors: aiResult.data.recommended_crops.flatMap(c => c.risk_factors),
      ai_confidence_score: aiResult.confidenceScore,
      ai_raw_response: aiResult.rawResponse,
      model_used: 'gemini-2.5-flash',
      created_at: new Date().toISOString(),
      farm,
    };

    if (!isSupabaseConfigured) {
      memoryDb.advisoryRequests.set(requestId, { id: requestId, requested_by: userId, ...parsedRequest });
      memoryDb.advisoryReports.set(reportId, advisoryReport);
    } else {
      const { data: reqRow } = await supabaseAdmin.from('advisory_requests').insert({
        requested_by: userId,
        ...parsedRequest,
      }).select().single();

      await supabaseAdmin.from('advisory_reports').insert({
        request_id: reqRow.id,
        farm_id: farm.id,
        owner_id: userId,
        recommended_crops: aiResult.data.recommended_crops,
        fertilizer_schedule: aiResult.data.fertilizer_schedule,
        irrigation_schedule: aiResult.data.irrigation_schedule,
        risk_factors: aiResult.data.recommended_crops.flatMap(c => c.risk_factors),
        ai_confidence_score: aiResult.confidenceScore,
        ai_raw_response: aiResult.rawResponse,
        model_used: 'gemini-2.5-flash',
      });
    }

    res.status(201).json({ report: advisoryReport });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { farm_id, advisory_type } = req.query;

    if (!isSupabaseConfigured) {
      let list = Array.from(memoryDb.advisoryReports.values()).filter(r => r.owner_id === userId || req.user!.role === 'admin');
      if (farm_id) list = list.filter(r => r.farm_id === farm_id);
      return res.json({ reports: list });
    }

    let query = supabaseAdmin.from('advisory_reports').select('*, farm:farms(*)');
    if (req.user!.role !== 'admin') {
      query = query.eq('owner_id', userId);
    }
    if (farm_id) {
      query = query.eq('farm_id', farm_id as string);
    }
    const { data: reports, error } = await query;
    if (error) throw error;
    res.json({ reports });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    if (!isSupabaseConfigured) {
      const report = memoryDb.advisoryReports.get(id);
      if (!report || (report.owner_id !== userId && req.user!.role !== 'admin')) {
        return res.status(404).json({ error: 'Advisory report not found or access denied' });
      }
      return res.json({ report });
    }

    const { data: report, error } = await supabaseAdmin
      .from('advisory_reports')
      .select('*, farm:farms(*)')
      .eq('id', id)
      .single();

    if (error || !report) {
      return res.status(404).json({ error: 'Advisory report not found' });
    }

    if (report.owner_id !== userId && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }

    res.json({ report });
  } catch (err) {
    next(err);
  }
});

export default router;
