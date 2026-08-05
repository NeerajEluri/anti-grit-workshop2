import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://jupiqsxvhutpehkcmgmw.supabase.co';
const supabaseKey = 
  process.env.SUPABASE_SECRET_KEY || 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_PUBLISHABLE_KEY || 
  process.env.SUPABASE_ANON_KEY || 
  'sb_publishable_ijmK6zCMA_MsxZtzdDdWkA_ioh1MKyn';

export const isSupabaseConfigured = 
  supabaseUrl !== 'https://mock.supabase.co' && 
  supabaseKey !== 'mock_service_role_key' &&
  !supabaseKey.includes('••••');

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// In-Memory Database Store for fallback mode
class MemoryDb {
  profiles: Map<string, any> = new Map();
  farms: Map<string, any> = new Map();
  cropMaster: Map<string, any> = new Map();
  advisoryRequests: Map<string, any> = new Map();
  advisoryReports: Map<string, any> = new Map();
  diseaseDiagnoses: Map<string, any> = new Map();
  chatConversations: Map<string, any> = new Map();
  chatMessages: Map<string, any> = new Map();
  marketPrices: Map<string, any> = new Map();
  notifications: Map<string, any> = new Map();
  auditLog: Map<string, any> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    const demoAdminId = '00000000-0000-0000-0000-000000000001';
    const demoFarmerId = '00000000-0000-0000-0000-000000000002';

    this.profiles.set(demoAdminId, {
      id: demoAdminId,
      full_name: 'Dr. Ramesh Kumar (Agronomist)',
      phone: '+91 9876543210',
      role: 'admin',
      preferred_language: 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    this.profiles.set(demoFarmerId, {
      id: demoFarmerId,
      full_name: 'Rajesh Patel',
      phone: '+91 9123456789',
      role: 'farmer',
      preferred_language: 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const farmId = '11111111-1111-1111-1111-111111111111';
    this.farms.set(farmId, {
      id: farmId,
      owner_id: demoFarmerId,
      farm_name: 'Green Acres Farm',
      state: 'Gujarat',
      district: 'Anand',
      village: 'Vasna',
      latitude: 22.5645,
      longitude: 72.9289,
      land_size_acres: 5.5,
      soil_type: 'black_cotton',
      irrigation_source: 'borewell',
      water_availability: 'moderate',
      current_season: 'rabi',
      previous_crop: 'Cotton',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const crops = [
      { id: 'c1', crop_name: 'Wheat (HD-2967)', category: 'cereals', suitable_soil_types: ['alluvial', 'black_cotton', 'loamy'], suitable_seasons: ['rabi'], water_requirement: '450-650 mm', typical_duration_days: 120, average_yield_per_acre: '18-22 Quintals', notes: 'High disease resistance, responds well to timely irrigation.' },
      { id: 'c2', crop_name: 'Chickpea / Chana', category: 'pulses', suitable_soil_types: ['black_cotton', 'loamy'], suitable_seasons: ['rabi'], water_requirement: '250-350 mm', typical_duration_days: 110, average_yield_per_acre: '8-12 Quintals', notes: 'Excellent for crop rotation, fixes atmospheric nitrogen.' },
      { id: 'c3', crop_name: 'Mustard / Sarson', category: 'oilseeds', suitable_soil_types: ['alluvial', 'loamy', 'arid_sandy'], suitable_seasons: ['rabi'], water_requirement: '300-400 mm', typical_duration_days: 105, average_yield_per_acre: '7-10 Quintals', notes: 'Low water requirement, high market demand.' },
      { id: 'c4', crop_name: 'Cotton', category: 'cash_crops', suitable_soil_types: ['black_cotton', 'alluvial'], suitable_seasons: ['kharif'], water_requirement: '700-1200 mm', typical_duration_days: 160, average_yield_per_acre: '10-15 Quintals', notes: 'Requires deep black soil with good drainage.' },
    ];
    crops.forEach((c) => this.cropMaster.set(c.id, { ...c, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }));

    const prices = [
      { id: 'p1', crop_name: 'Wheat', market_name: 'Anand Mandi', state: 'Gujarat', price_per_quintal: 2450, recorded_date: new Date().toISOString().split('T')[0] },
      { id: 'p2', crop_name: 'Chickpea', market_name: 'Rajkot APMC', state: 'Gujarat', price_per_quintal: 5600, recorded_date: new Date().toISOString().split('T')[0] },
      { id: 'p3', crop_name: 'Mustard', market_name: 'Patan Mandi', state: 'Gujarat', price_per_quintal: 5200, recorded_date: new Date().toISOString().split('T')[0] },
      { id: 'p4', crop_name: 'Cotton', market_name: 'Kadi Mandi', state: 'Gujarat', price_per_quintal: 7100, recorded_date: new Date().toISOString().split('T')[0] },
    ];
    prices.forEach((p) => this.marketPrices.set(p.id, { ...p, created_at: new Date().toISOString() }));
  }
}

export const memoryDb = new MemoryDb();
