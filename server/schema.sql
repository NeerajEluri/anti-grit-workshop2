-- ============================================================
-- AI-POWERED AGRICULTURE CROP ADVISORY ASSISTANT - DATABASE SCHEMA
-- PostgreSQL schema for Supabase
-- ============================================================

-- EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ENUMS
create type user_role as enum ('farmer', 'admin');
create type crop_category as enum ('cereals','pulses','oilseeds','vegetables','fruits','cash_crops','spices','fibre_crops','fodder_crops');
create type soil_type as enum ('alluvial','black_cotton','red_soil','laterite','arid_sandy','mountain_forest','saline_alkaline','loamy');
create type irrigation_source as enum ('rainfed','canal','borewell','drip','sprinkler','tank_pond','river_lift');
create type water_availability as enum ('scarce','moderate','abundant');
create type crop_season as enum ('kharif','rabi','zaid','perennial');
create type advisory_type as enum ('crop_selection','disease_pest_management','fertilizer_nutrition','irrigation_water_management','weather_based','market_post_harvest');
create type severity_level as enum ('low','moderate','high','critical');
create type budget_range as enum ('low','medium','high');
create type primary_goal as enum ('max_yield','low_risk','water_saving','market_price');
create type notification_type as enum ('advisory_ready','diagnosis_ready','disease_risk_alert','irrigation_due','market_price_alert');

-- PROFILES (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role user_role not null default 'farmer',
  preferred_language text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- FARMS
create table if not exists public.farms (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  farm_name text not null,
  state text not null,
  district text not null,
  village text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  land_size_acres numeric(10,2) not null check (land_size_acres > 0),
  soil_type soil_type not null,
  irrigation_source irrigation_source not null,
  water_availability water_availability not null,
  current_season crop_season not null,
  previous_crop text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_farms_owner on public.farms(owner_id);

-- CROP MASTER
create table if not exists public.crop_master (
  id uuid primary key default uuid_generate_v4(),
  crop_name text not null unique,
  category crop_category not null,
  suitable_soil_types soil_type[] not null default '{}',
  suitable_seasons crop_season[] not null default '{}',
  water_requirement text,
  typical_duration_days int,
  average_yield_per_acre text,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ADVISORY REQUESTS + REPORTS
create table if not exists public.advisory_requests (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  requested_by uuid not null references public.profiles(id) on delete cascade,
  advisory_type advisory_type not null,
  crop_category crop_category,
  specific_crop text,
  budget_range budget_range,
  primary_goal primary_goal not null,
  additional_notes text,
  created_at timestamptz not null default now()
);
create index if not exists idx_advisory_requests_farm on public.advisory_requests(farm_id);
create index if not exists idx_advisory_requests_user on public.advisory_requests(requested_by);

create table if not exists public.advisory_reports (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid not null references public.advisory_requests(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  recommended_crops jsonb not null,
  fertilizer_schedule jsonb,
  irrigation_schedule jsonb,
  risk_factors jsonb,
  ai_confidence_score numeric(4,3) check (ai_confidence_score between 0 and 1),
  ai_raw_response jsonb not null,
  model_used text not null default 'gemini-2.5-flash',
  created_at timestamptz not null default now()
);
create index if not exists idx_advisory_reports_farm on public.advisory_reports(farm_id);
create index if not exists idx_advisory_reports_owner on public.advisory_reports(owner_id);

-- DISEASE / PEST DIAGNOSIS
create table if not exists public.disease_diagnoses (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  crop_name text not null,
  image_storage_path text not null,
  symptom_description text not null,
  affected_area_percent int check (affected_area_percent between 0 and 100),
  days_since_symptoms int,
  diagnosis_name text,
  severity severity_level,
  confidence_score numeric(4,3) check (confidence_score between 0 and 1),
  treatment_plan jsonb,
  prevention_tips jsonb,
  ai_raw_response jsonb not null,
  requires_admin_review boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_diagnoses_farm on public.disease_diagnoses(farm_id);
create index if not exists idx_diagnoses_owner on public.disease_diagnoses(owner_id);
create index if not exists idx_diagnoses_flagged on public.disease_diagnoses(requires_admin_review) where requires_admin_review = true;

-- CHAT
create table if not exists public.chat_conversations (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid references public.farms(id) on delete set null,
  title text not null default 'New Conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_chat_conversations_owner on public.chat_conversations(owner_id);

create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  sender text not null check (sender in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_chat_messages_conversation on public.chat_messages(conversation_id);

-- MARKET PRICES
create table if not exists public.market_prices (
  id uuid primary key default uuid_generate_v4(),
  crop_name text not null,
  market_name text not null,
  state text not null,
  price_per_quintal numeric(10,2) not null,
  recorded_date date not null default current_date,
  created_at timestamptz not null default now()
);
create index if not exists idx_market_prices_crop on public.market_prices(crop_name);
create index if not exists idx_market_prices_date on public.market_prices(recorded_date);

-- WEATHER CACHE
create table if not exists public.weather_cache (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  fetched_at timestamptz not null default now(),
  raw_payload jsonb not null,
  expires_at timestamptz not null
);
create index if not exists idx_weather_cache_farm on public.weather_cache(farm_id);

-- NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid references public.farms(id) on delete set null,
  type notification_type not null,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_notifications_owner on public.notifications(owner_id);

-- ADMIN AUDIT LOG
create table if not exists public.admin_audit_log (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid not null references public.profiles(id),
  action text not null,
  target_table text not null,
  target_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

-- TRIGGERS
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'New User'), 'farmer');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_farms_updated_at on public.farms;
create trigger trg_farms_updated_at before update on public.farms
  for each row execute function public.set_updated_at();

drop trigger if exists trg_crop_master_updated_at on public.crop_master;
create trigger trg_crop_master_updated_at before update on public.crop_master
  for each row execute function public.set_updated_at();

drop trigger if exists trg_chat_conversations_updated_at on public.chat_conversations;
create trigger trg_chat_conversations_updated_at before update on public.chat_conversations
  for each row execute function public.set_updated_at();

-- ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.farms enable row level security;
alter table public.advisory_requests enable row level security;
alter table public.advisory_reports enable row level security;
alter table public.disease_diagnoses enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;
alter table public.notifications enable row level security;
alter table public.crop_master enable row level security;
alter table public.market_prices enable row level security;
alter table public.weather_cache enable row level security;
alter table public.admin_audit_log enable row level security;

create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- RLS POLICIES
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

drop policy if exists "farms_owner_all" on public.farms;
create policy "farms_owner_all" on public.farms
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "farms_admin_select" on public.farms;
create policy "farms_admin_select" on public.farms
  for select using (public.is_admin());

drop policy if exists "advisory_requests_owner_all" on public.advisory_requests;
create policy "advisory_requests_owner_all" on public.advisory_requests
  for all using (requested_by = auth.uid()) with check (requested_by = auth.uid());

drop policy if exists "advisory_reports_owner_all" on public.advisory_reports;
create policy "advisory_reports_owner_all" on public.advisory_reports
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "advisory_reports_admin_select" on public.advisory_reports;
create policy "advisory_reports_admin_select" on public.advisory_reports
  for select using (public.is_admin());

drop policy if exists "diagnoses_owner_all" on public.disease_diagnoses;
create policy "diagnoses_owner_all" on public.disease_diagnoses
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "diagnoses_admin_select" on public.disease_diagnoses;
create policy "diagnoses_admin_select" on public.disease_diagnoses
  for select using (public.is_admin());

drop policy if exists "chat_conversations_owner_all" on public.chat_conversations;
create policy "chat_conversations_owner_all" on public.chat_conversations
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "chat_messages_owner_all" on public.chat_messages;
create policy "chat_messages_owner_all" on public.chat_messages
  for all using (
    exists (select 1 from public.chat_conversations c
            where c.id = conversation_id and c.owner_id = auth.uid())
  );

drop policy if exists "notifications_owner_all" on public.notifications;
create policy "notifications_owner_all" on public.notifications
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "crop_master_read_all" on public.crop_master;
create policy "crop_master_read_all" on public.crop_master
  for select using (true);

drop policy if exists "crop_master_admin_write" on public.crop_master;
create policy "crop_master_admin_write" on public.crop_master
  for insert with check (public.is_admin());

drop policy if exists "crop_master_admin_update" on public.crop_master;
create policy "crop_master_admin_update" on public.crop_master
  for update using (public.is_admin());

drop policy if exists "crop_master_admin_delete" on public.crop_master;
create policy "crop_master_admin_delete" on public.crop_master
  for delete using (public.is_admin());

drop policy if exists "market_prices_read_all" on public.market_prices;
create policy "market_prices_read_all" on public.market_prices
  for select using (true);

drop policy if exists "market_prices_admin_write" on public.market_prices;
create policy "market_prices_admin_write" on public.market_prices
  for insert with check (public.is_admin());

drop policy if exists "weather_cache_owner_select" on public.weather_cache;
create policy "weather_cache_owner_select" on public.weather_cache
  for select using (
    exists (select 1 from public.farms f where f.id = farm_id and f.owner_id = auth.uid())
  );

drop policy if exists "audit_log_admin_select" on public.admin_audit_log;
create policy "audit_log_admin_select" on public.admin_audit_log
  for select using (public.is_admin());

drop policy if exists "audit_log_admin_insert" on public.admin_audit_log;
create policy "audit_log_admin_insert" on public.admin_audit_log
  for insert with check (public.is_admin());
