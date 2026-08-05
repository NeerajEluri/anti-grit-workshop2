import { Router } from 'express';
import multer from 'multer';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { diagnosisRequestSchema, aiDiagnosisSchema } from '../../src/validation/schemas';
import { isSupabaseConfigured, supabaseAdmin, memoryDb } from '../services/supabaseClient';
import { SYSTEM_INSTRUCTION, buildDiseaseDiagnosisPrompt, DISEASE_DIAGNOSIS_JSON_SCHEMA } from '../prompts/diseaseDiagnosis';
import { generateStructuredAIResponse } from '../services/geminiClient';
import { aiRateLimiter } from '../middleware/rateLimiter';

const router = Router();
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG/PNG image files are allowed'));
    }
  },
});

router.use(authMiddleware);

router.post('/', upload.single('image_file'), aiRateLimiter, async (req: AuthenticatedRequest, res, next) => {
  try {
    const rawBody = {
      farm_id: req.body.farm_id,
      crop_name: req.body.crop_name,
      symptom_description: req.body.symptom_description,
      affected_area_percent: req.body.affected_area_percent ? parseInt(req.body.affected_area_percent) : undefined,
      days_since_symptoms: req.body.days_since_symptoms ? parseInt(req.body.days_since_symptoms) : undefined,
    };

    const parsed = diagnosisRequestSchema.parse(rawBody);
    const userId = req.user!.id;
    const file = req.file;

    // Retrieve farm
    let farm: any;
    if (!isSupabaseConfigured) {
      farm = memoryDb.farms.get(parsed.farm_id);
    } else {
      const { data } = await supabaseAdmin.from('farms').select('*').eq('id', parsed.farm_id).single();
      farm = data;
    }

    if (!farm || (farm.owner_id !== userId && req.user!.role !== 'admin')) {
      return res.status(404).json({ error: 'Farm profile not found or access denied' });
    }

    const imageStoragePath = file ? `diagnoses/${Date.now()}_${file.originalname}` : 'diagnoses/sample_leaf.jpg';

    // Build Gemini Vision prompt
    const promptText = buildDiseaseDiagnosisPrompt(farm, parsed);

    const mockFallback = () => ({
      diagnosis_name: "Yellow Rust (Puccinia striiformis) / Powdery Mildew",
      is_image_clear: true,
      severity: "moderate" as const,
      confidence_score: 0.88,
      explanation: `Observed symptoms on ${parsed.crop_name} leaves in ${farm.district} match early fungal spore colonization. High morning humidity in ${farm.current_season} accelerates fungal lesion expansion.`,
      treatment_plan: [
        { step_number: 1, action: "Foliar Spray Application", product_or_method: "Propiconazole 25% EC @ 1 ml/liter of water or Tebuconazole", timing: "Apply immediately in calm morning hours", is_organic_alternative: false },
        { step_number: 2, action: "Bio-Control Spray", product_or_method: "Trichoderma viride @ 5g/liter or Neem Oil (10,000 ppm) @ 3ml/liter", timing: "Repeat after 7 days as follow-up", is_organic_alternative: true },
        { step_number: 3, action: "Field Sanitation & Water Management", product_or_method: "Reduce sprinkler duration to lower canopy humidity; destroy heavily infected leaf debris", timing: "Ongoing", is_organic_alternative: true }
      ],
      prevention_tips: [
        "Sow rust-resistant seed varieties (HD-2967, DBW-187) in upcoming seasons.",
        "Avoid excess nitrogenous fertilizer top-dressing which creates lush foliage vulnerable to rust fungi.",
        "Maintain crop spacing for adequate airflow through the canopy."
      ]
    });

    const aiResult = await generateStructuredAIResponse(
      SYSTEM_INSTRUCTION,
      promptText,
      DISEASE_DIAGNOSIS_JSON_SCHEMA,
      (data) => aiDiagnosisSchema.parse(data),
      mockFallback,
      file?.buffer,
      file?.mimetype
    );

    const requiresAdminReview = aiResult.confidenceScore < 0.55;

    const diagnosisId = 'diag-' + Math.random().toString(36).substring(2, 9);
    const record = {
      id: diagnosisId,
      farm_id: farm.id,
      owner_id: userId,
      crop_name: parsed.crop_name,
      image_storage_path: imageStoragePath,
      symptom_description: parsed.symptom_description,
      affected_area_percent: parsed.affected_area_percent || 15,
      days_since_symptoms: parsed.days_since_symptoms || 3,
      diagnosis_name: aiResult.data.diagnosis_name,
      severity: aiResult.data.severity,
      confidence_score: aiResult.confidenceScore,
      treatment_plan: aiResult.data.treatment_plan,
      prevention_tips: aiResult.data.prevention_tips,
      ai_raw_response: aiResult.rawResponse,
      requires_admin_review: requiresAdminReview,
      created_at: new Date().toISOString(),
      farm,
    };

    if (!isSupabaseConfigured) {
      memoryDb.diseaseDiagnoses.set(diagnosisId, record);
    } else {
      await supabaseAdmin.from('disease_diagnoses').insert({
        farm_id: farm.id,
        owner_id: userId,
        crop_name: parsed.crop_name,
        image_storage_path: imageStoragePath,
        symptom_description: parsed.symptom_description,
        affected_area_percent: parsed.affected_area_percent,
        days_since_symptoms: parsed.days_since_symptoms,
        diagnosis_name: aiResult.data.diagnosis_name,
        severity: aiResult.data.severity,
        confidence_score: aiResult.confidenceScore,
        treatment_plan: aiResult.data.treatment_plan,
        prevention_tips: aiResult.data.prevention_tips,
        ai_raw_response: aiResult.rawResponse,
        requires_admin_review: requiresAdminReview,
      });
    }

    res.status(201).json({ diagnosis: record });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;
    if (!isSupabaseConfigured) {
      const list = Array.from(memoryDb.diseaseDiagnoses.values()).filter(d => d.owner_id === userId || req.user!.role === 'admin');
      return res.json({ diagnoses: list });
    }

    let query = supabaseAdmin.from('disease_diagnoses').select('*, farm:farms(*)');
    if (req.user!.role !== 'admin') {
      query = query.eq('owner_id', userId);
    }
    const { data: diagnoses, error } = await query;
    if (error) throw error;
    res.json({ diagnoses });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    if (!isSupabaseConfigured) {
      const diag = memoryDb.diseaseDiagnoses.get(id);
      if (!diag || (diag.owner_id !== userId && req.user!.role !== 'admin')) {
        return res.status(404).json({ error: 'Diagnosis not found or access denied' });
      }
      return res.json({ diagnosis: diag });
    }

    const { data: diagnosis, error } = await supabaseAdmin
      .from('disease_diagnoses')
      .select('*, farm:farms(*)')
      .eq('id', id)
      .single();

    if (error || !diagnosis) {
      return res.status(404).json({ error: 'Diagnosis record not found' });
    }

    if (diagnosis.owner_id !== userId && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }

    res.json({ diagnosis });
  } catch (err) {
    next(err);
  }
});

export default router;
