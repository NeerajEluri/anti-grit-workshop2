import { z } from "zod";

export const farmProfileSchema = z.object({
  farm_name: z.string().min(2, "Farm name must be at least 2 characters").max(100),
  state: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required"),
  village: z.string().max(100).optional().or(z.literal("")),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  land_size_acres: z.number({ invalid_type_error: "Land size must be a number" }).positive("Land size must be greater than 0").max(100000),
  soil_type: z.enum([
    "alluvial","black_cotton","red_soil","laterite","arid_sandy","mountain_forest","saline_alkaline","loamy"
  ]),
  irrigation_source: z.enum([
    "rainfed","canal","borewell","drip","sprinkler","tank_pond","river_lift"
  ]),
  water_availability: z.enum(["scarce","moderate","abundant"]),
  current_season: z.enum(["kharif","rabi","zaid","perennial"]),
  previous_crop: z.string().max(100).optional().or(z.literal("")),
});

export const advisoryRequestSchema = z.object({
  farm_id: z.string().uuid("Please select a valid farm"),
  advisory_type: z.enum([
    "crop_selection","disease_pest_management","fertilizer_nutrition","irrigation_water_management","weather_based","market_post_harvest"
  ]),
  crop_category: z.enum([
    "cereals","pulses","oilseeds","vegetables","fruits","cash_crops","spices","fibre_crops","fodder_crops"
  ]).optional().nullable(),
  specific_crop: z.string().max(100).optional().or(z.literal("")),
  budget_range: z.enum(["low","medium","high"]).optional().nullable(),
  primary_goal: z.enum(["max_yield","low_risk","water_saving","market_price"]),
  additional_notes: z.string().max(1000).optional().or(z.literal("")),
});

export const diagnosisRequestSchema = z.object({
  farm_id: z.string().uuid("Please select a valid farm"),
  crop_name: z.string().min(2, "Crop name is required").max(100),
  symptom_description: z.string().min(10, "Symptom description must be at least 10 characters").max(1000),
  affected_area_percent: z.number().int().min(0).max(100).optional().nullable(),
  days_since_symptoms: z.number().int().min(0).max(365).optional().nullable(),
});

export const chatMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(2000),
});

export const cropMasterSchema = z.object({
  crop_name: z.string().min(2, "Crop name must be at least 2 characters").max(100),
  category: z.enum([
    "cereals","pulses","oilseeds","vegetables","fruits","cash_crops","spices","fibre_crops","fodder_crops"
  ]),
  suitable_soil_types: z.array(z.string()).min(1, "At least one soil type must be selected"),
  suitable_seasons: z.array(z.string()).min(1, "At least one season must be selected"),
  water_requirement: z.string().max(200).optional().or(z.literal("")),
  typical_duration_days: z.number().int().positive().optional().nullable(),
  average_yield_per_acre: z.string().max(100).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

export const aiCropRecommendationSchema = z.object({
  recommended_crops: z.array(z.object({
    crop_name: z.string(),
    rank: z.number().int(),
    suitability_score: z.number().min(0).max(1),
    reasoning: z.string(),
    expected_yield_range: z.string(),
    estimated_duration_days: z.number().int(),
    risk_factors: z.array(z.string()),
  })).min(1).max(3),
  fertilizer_schedule: z.array(z.object({
    crop_name: z.string(),
    stage: z.string(),
    timing: z.string(),
    fertilizer_type: z.string(),
    quantity_per_acre: z.string(),
  })),
  irrigation_schedule: z.array(z.object({
    crop_name: z.string(),
    growth_stage: z.string(),
    frequency: z.string(),
    water_amount: z.string(),
  })),
  overall_confidence_score: z.number().min(0).max(1),
  advisory_summary: z.string(),
});

export const aiDiagnosisSchema = z.object({
  diagnosis_name: z.string(),
  is_image_clear: z.boolean(),
  severity: z.enum(["low","moderate","high","critical"]),
  confidence_score: z.number().min(0).max(1),
  explanation: z.string(),
  treatment_plan: z.array(z.object({
    step_number: z.number().int(),
    action: z.string(),
    product_or_method: z.string(),
    timing: z.string(),
    is_organic_alternative: z.boolean(),
  })),
  prevention_tips: z.array(z.string()),
});

export const aiSellingInsightSchema = z.object({
  crop_name: z.string(),
  recommendation: z.enum(["sell_now","wait","monitor"]),
  reasoning: z.string(),
  confidence_score: z.number().min(0).max(1),
});
