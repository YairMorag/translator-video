-- NextPlay Academy — initial schema
-- This mirrors the mock data model in lib/types.ts and lib/data/*.
-- The POC runs entirely on in-memory mock data; this migration is the
-- seam for wiring up real Supabase persistence + auth later.

create extension if not exists "pgcrypto";

-- ---------- Enums ----------

create type role as enum ('school_admin', 'coach', 'parent', 'player');
create type position_type as enum ('goalkeeper', 'defender', 'midfielder', 'winger', 'striker');
create type dominant_foot as enum ('left', 'right', 'both');
create type consent_status as enum ('pending', 'approved', 'revoked');
create type task_category as enum (
  'ball_control', 'first_touch', 'passing', 'speed_agility',
  'mobility', 'recovery', 'light_strength', 'position_specific'
);
create type intensity as enum ('low', 'medium', 'high');
create type plan_status as enum ('draft', 'approved', 'completed');
create type assigned_task_status as enum ('assigned', 'started', 'completed', 'skipped');
create type note_visibility as enum ('private', 'parent_visible');
create type risk_type as enum ('pain', 'high_fatigue', 'no_activity', 'coach_review');
create type risk_severity as enum ('low', 'medium', 'high');
create type risk_status as enum ('open', 'resolved');

-- ---------- Core tables ----------

create table schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  created_at timestamptz not null default now()
);

create table teams (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  name text not null,
  age_group text not null,
  season text not null,
  coach_id uuid, -- references profiles(id), added after profiles exists
  created_at timestamptz not null default now()
);

-- App-specific user data. auth_user_id links to Supabase Auth's auth.users.
create table profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  role role not null,
  school_id uuid not null references schools(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table teams
  add constraint teams_coach_id_fkey foreign key (coach_id) references profiles(id) on delete set null;

create table players (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  school_id uuid not null references schools(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  full_name text not null,
  birth_year int not null,
  age int not null,
  position position_type not null,
  dominant_foot dominant_foot not null,
  weekly_availability int not null default 2,
  known_limitations text,
  parent_consent_status consent_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table parent_player_links (
  id uuid primary key default gen_random_uuid(),
  parent_profile_id uuid not null references profiles(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  relationship text not null default 'parent',
  created_at timestamptz not null default now(),
  unique (parent_profile_id, player_id)
);

create table coach_team_links (
  id uuid primary key default gen_random_uuid(),
  coach_profile_id uuid not null references profiles(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (coach_profile_id, team_id)
);

create table task_catalog (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category task_category not null,
  age_min int not null,
  age_max int not null,
  positions position_type[], -- null/empty means "all positions"
  duration_minutes int not null,
  intensity intensity not null,
  equipment_needed text not null,
  instructions text[] not null,
  safety_notes text not null,
  why_it_matters text not null,
  coach_approved_default boolean not null default true,
  created_at timestamptz not null default now()
);

create table weekly_plans (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  coach_id uuid not null references profiles(id) on delete cascade,
  week_start_date date not null,
  focus_area task_category not null,
  focus_label text,
  status plan_status not null default 'draft',
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  unique (player_id, week_start_date)
);

create table assigned_tasks (
  id uuid primary key default gen_random_uuid(),
  weekly_plan_id uuid not null references weekly_plans(id) on delete cascade,
  task_id uuid not null references task_catalog(id) on delete restrict,
  player_id uuid not null references players(id) on delete cascade,
  assigned_by_coach_id uuid not null references profiles(id) on delete cascade,
  due_date date not null,
  status assigned_task_status not null default 'assigned',
  created_at timestamptz not null default now()
);

create table task_reports (
  id uuid primary key default gen_random_uuid(),
  assigned_task_id uuid not null references assigned_tasks(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  completed boolean not null,
  difficulty int not null check (difficulty between 1 and 5),
  fatigue int not null check (fatigue between 1 and 5),
  pain_reported boolean not null default false,
  note text,
  created_at timestamptz not null default now()
);

create table coach_notes (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references profiles(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  note text not null,
  visibility note_visibility not null default 'private',
  created_at timestamptz not null default now()
);

create table consents (
  id uuid primary key default gen_random_uuid(),
  parent_profile_id uuid not null references profiles(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  consent_type text not null default 'home_training_participation',
  status consent_status not null default 'pending',
  accepted_at timestamptz,
  revoked_at timestamptz,
  unique (parent_profile_id, player_id, consent_type)
);

create table risk_flags (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  source text not null,
  type risk_type not null,
  severity risk_severity not null,
  status risk_status not null default 'open',
  note text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- ---------- Indexes ----------

create index on teams (school_id);
create index on profiles (school_id);
create index on players (team_id);
create index on players (school_id);
create index on parent_player_links (parent_profile_id);
create index on parent_player_links (player_id);
create index on coach_team_links (coach_profile_id);
create index on weekly_plans (player_id, week_start_date);
create index on assigned_tasks (player_id);
create index on assigned_tasks (weekly_plan_id);
create index on task_reports (player_id);
create index on coach_notes (player_id);
create index on risk_flags (player_id, status);
