export type UserRole = 'farmer' | 'admin';

export type CropCategory = 
  | 'cereals'
  | 'pulses'
  | 'oilseeds'
  | 'vegetables'
  | 'fruits'
  | 'cash_crops'
  | 'spices'
  | 'fibre_crops'
  | 'fodder_crops';

export type SoilType = 
  | 'alluvial'
  | 'black_cotton'
  | 'red_soil'
  | 'laterite'
  | 'arid_sandy'
  | 'mountain_forest'
  | 'saline_alkaline'
  | 'loamy';

export type IrrigationSource = 
  | 'rainfed'
  | 'canal'
  | 'borewell'
  | 'drip'
  | 'sprinkler'
  | 'tank_pond'
  | 'river_lift';

export type WaterAvailability = 'scarce' | 'moderate' | 'abundant';

export type CropSeason = 'kharif' | 'rabi' | 'zaid' | 'perennial';

export type AdvisoryType = 
  | 'crop_selection'
  | 'disease_pest_management'
  | 'fertilizer_nutrition'
  | 'irrigation_water_management'
  | 'weather_based'
  | 'market_post_harvest';

export type SeverityLevel = 'low' | 'moderate' | 'high' | 'critical';

export type BudgetRange = 'low' | 'medium' | 'high';

export type PrimaryGoal = 'max_yield' | 'low_risk' | 'water_saving' | 'market_price';

export type NotificationType = 
  | 'advisory_ready'
  | 'diagnosis_ready'
  | 'disease_risk_alert'
  | 'irrigation_due'
  | 'market_price_alert';

export interface UserProfile {
  id: string;
  full_name: string;
  phone?: string | null;
  role: UserRole;
  preferred_language: string;
  created_at: string;
  updated_at: string;
}

export interface Farm {
  id: string;
  owner_id: string;
  farm_name: string;
  state: string;
  district: string;
  village?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  land_size_acres: number;
  soil_type: SoilType;
  irrigation_source: IrrigationSource;
  water_availability: WaterAvailability;
  current_season: CropSeason;
  previous_crop?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CropMaster {
  id: string;
  crop_name: string;
  category: CropCategory;
  suitable_soil_types: SoilType[];
  suitable_seasons: CropSeason[];
  water_requirement?: string | null;
  typical_duration_days?: number | null;
  average_yield_per_acre?: string | null;
  notes?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdvisoryRequest {
  id: string;
  farm_id: string;
  requested_by: string;
  advisory_type: AdvisoryType;
  crop_category?: CropCategory | null;
  specific_crop?: string | null;
  budget_range?: BudgetRange | null;
  primary_goal: PrimaryGoal;
  additional_notes?: string | null;
  created_at: string;
}

export interface RecommendedCrop {
  crop_name: string;
  rank: number;
  suitability_score: number;
  reasoning: string;
  expected_yield_range: string;
  estimated_duration_days: number;
  risk_factors: string[];
}

export interface FertilizerScheduleItem {
  crop_name: string;
  stage: string;
  timing: string;
  fertilizer_type: string;
  quantity_per_acre: string;
}

export interface IrrigationScheduleItem {
  crop_name: string;
  growth_stage: string;
  frequency: string;
  water_amount: string;
}

export interface AdvisoryReport {
  id: string;
  request_id: string;
  farm_id: string;
  owner_id: string;
  recommended_crops: RecommendedCrop[];
  fertilizer_schedule: FertilizerScheduleItem[];
  irrigation_schedule: IrrigationScheduleItem[];
  risk_factors?: string[] | null;
  ai_confidence_score: number;
  ai_raw_response: any;
  model_used: string;
  created_at: string;
  farm?: Farm;
}

export interface TreatmentStep {
  step_number: number;
  action: string;
  product_or_method: string;
  timing: string;
  is_organic_alternative: boolean;
}

export interface DiseaseDiagnosis {
  id: string;
  farm_id: string;
  owner_id: string;
  crop_name: string;
  image_storage_path: string;
  symptom_description: string;
  affected_area_percent?: number | null;
  days_since_symptoms?: number | null;
  diagnosis_name: string;
  severity: SeverityLevel;
  confidence_score: number;
  treatment_plan: TreatmentStep[];
  prevention_tips: string[];
  ai_raw_response: any;
  requires_admin_review: boolean;
  created_at: string;
  farm?: Farm;
}

export interface ChatConversation {
  id: string;
  owner_id: string;
  farm_id?: string | null;
  title: string;
  created_at: string;
  updated_at: string;
  farm?: Farm;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface MarketPrice {
  id: string;
  crop_name: string;
  market_name: string;
  state: string;
  price_per_quintal: number;
  recorded_date: string;
  created_at: string;
}

export interface WeatherData {
  temp_c: number;
  humidity: number;
  rain_probability: number;
  condition: string;
  wind_kph: number;
  forecast_summary: string;
}

export interface NotificationItem {
  id: string;
  owner_id: string;
  farm_id?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLogItem {
  id: string;
  admin_id: string;
  action: string;
  target_table: string;
  target_id?: string | null;
  details?: any;
  created_at: string;
  admin_profile?: UserProfile;
}
