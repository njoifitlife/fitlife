-- NjoiFitLife — Initial Database Schema
-- Run this in your Supabase SQL Editor (supabase.com > your project > SQL Editor)

-- ============================================
-- USERS (extends Supabase auth.users)
-- ============================================
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  is_admin boolean not null default false,
  subscription_tier text check (subscription_tier in ('free', 'essential', 'complete', 'coaching')) default 'free',
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text check (subscription_status in ('active', 'canceled', 'past_due', 'trialing', null)),
  created_at timestamptz not null default now(),
  last_active_at timestamptz default now()
);

alter table public.users enable row level security;

create policy "Users can read their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on public.users for update
  using (auth.uid() = id);

-- Trigger to auto-create a public.users row when someone signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================
-- ASSESSMENTS
-- ============================================
create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,

  -- About You
  age integer,
  height_inches integer,
  weight_lbs numeric(5,1),
  activity_level text check (activity_level in ('sedentary', 'lightly_active', 'moderately_active', 'very_active')),

  -- Goals (Step 5 Section 8a: single primary + multi secondary)
  primary_goal text check (primary_goal in (
    'strength', 'muscle', 'fat_loss', 'fitness',
    'healthy_aging', 'balance', 'bone_health_support', 'general_wellness'
  )),
  secondary_goals text[] default '{}',

  -- Fitness Experience
  fitness_level text check (fitness_level in ('beginner', 'intermediate', 'advanced')),
  current_habits text,
  resistance_experience text check (resistance_experience in ('none', 'some', 'regular')),

  -- Schedule
  days_per_week integer check (days_per_week between 1 and 7),
  session_duration integer check (session_duration in (20, 30, 45, 60)),
  preferred_days text[] default '{}',

  -- Equipment
  equipment text[] default '{}',

  -- Nutrition
  eating_pattern text check (eating_pattern in (
    'omnivore', 'vegetarian', 'vegan', 'pescatarian', 'dairy_free', 'gluten_free', 'other'
  )),
  dietary_preferences text[] default '{}',
  allergies text[] default '{}',
  disliked_foods text,
  meals_per_day integer check (meals_per_day between 1 and 6),

  -- Exercise Preferences
  exercise_preferences text[] default '{}',

  -- Status
  completed_at timestamptz,
  current_section integer default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.assessments enable row level security;

create policy "Users can manage their own assessments"
  on public.assessments for all
  using (auth.uid() = user_id);


-- ============================================
-- SAFETY ACKNOWLEDGMENTS
-- ============================================
create table public.safety_acknowledgments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null unique,
  acknowledged boolean not null default false,
  acknowledged_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.safety_acknowledgments enable row level security;

create policy "Users can manage their own acknowledgment"
  on public.safety_acknowledgments for all
  using (auth.uid() = user_id);


-- ============================================
-- FITNESS PLANS
-- ============================================
create table public.fitness_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  assessment_id uuid references public.assessments(id) on delete set null,
  program_length_weeks integer not null default 4,
  current_week integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.fitness_plans enable row level security;

create policy "Users can read their own plans"
  on public.fitness_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own plans"
  on public.fitness_plans for insert
  with check (auth.uid() = user_id);


-- ============================================
-- WORKOUT DAYS
-- ============================================
create table public.workout_days (
  id uuid primary key default gen_random_uuid(),
  fitness_plan_id uuid references public.fitness_plans(id) on delete cascade not null,
  week_number integer not null,
  day_number integer not null check (day_number between 1 and 7),
  day_type text not null check (day_type in ('workout', 'rest', 'active_recovery')),
  exercises jsonb not null default '[]',
  created_at timestamptz not null default now()
);

alter table public.workout_days enable row level security;

create policy "Users can read their own workout days"
  on public.workout_days for select
  using (
    fitness_plan_id in (
      select id from public.fitness_plans where user_id = auth.uid()
    )
  );


-- ============================================
-- EXERCISE COMPLETIONS
-- ============================================
create table public.exercise_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  workout_day_id uuid references public.workout_days(id) on delete cascade not null,
  exercise_id text not null,
  modification_used boolean default false,
  completed_at timestamptz not null default now()
);

alter table public.exercise_completions enable row level security;

create policy "Users can manage their own completions"
  on public.exercise_completions for all
  using (auth.uid() = user_id);


-- ============================================
-- NUTRITION PLANS
-- ============================================
create table public.nutrition_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  assessment_id uuid references public.assessments(id) on delete set null,
  meal_assignments jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.nutrition_plans enable row level security;

create policy "Users can read their own nutrition plans"
  on public.nutrition_plans for select
  using (auth.uid() = user_id);


-- ============================================
-- PROGRESS ENTRIES
-- ============================================
create table public.progress_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  entry_type text not null check (entry_type in ('weight', 'measurement')),
  label text,
  value numeric(7,2) not null,
  unit text not null,
  recorded_at timestamptz not null default now()
);

alter table public.progress_entries enable row level security;

create policy "Users can manage their own progress"
  on public.progress_entries for all
  using (auth.uid() = user_id);


-- ============================================
-- PLAN EXPLAINABILITY (internal debugging, Step 5 Section 9)
-- ============================================
create table public.plan_explanations (
  id uuid primary key default gen_random_uuid(),
  fitness_plan_id uuid references public.fitness_plans(id) on delete cascade,
  nutrition_plan_id uuid references public.nutrition_plans(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade not null,
  item_type text not null check (item_type in ('exercise', 'meal')),
  item_id text not null,
  week_number integer,
  assigned_version text,
  reasons jsonb not null default '[]',
  created_at timestamptz not null default now()
);

alter table public.plan_explanations enable row level security;

create policy "Only admins can read explanations"
  on public.plan_explanations for select
  using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );


-- ============================================
-- INDEXES
-- ============================================
create index idx_assessments_user on public.assessments(user_id);
create index idx_fitness_plans_user on public.fitness_plans(user_id);
create index idx_workout_days_plan on public.workout_days(fitness_plan_id);
create index idx_exercise_completions_user on public.exercise_completions(user_id);
create index idx_nutrition_plans_user on public.nutrition_plans(user_id);
create index idx_progress_entries_user on public.progress_entries(user_id);
