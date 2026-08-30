export type SubscriptionTier = "free" | "essential" | "complete" | "coaching";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing" | null;

export type ActivityLevel = "sedentary" | "lightly_active" | "moderately_active" | "very_active";
export type FitnessLevel = "beginner" | "intermediate" | "advanced";
export type ResistanceExperience = "none" | "some" | "regular";
export type SessionDuration = 10 | 20 | 30 | 45 | 60;

export type Goal =
  | "strength"
  | "muscle"
  | "fat_loss"
  | "fitness"
  | "healthy_aging"
  | "balance"
  | "bone_health_support"
  | "general_wellness";

export type EatingPattern =
  | "omnivore"
  | "vegetarian"
  | "vegan"
  | "pescatarian"
  | "dairy_free"
  | "gluten_free"
  | "other";

export type DayType = "workout" | "rest" | "active_recovery";
export type EntryType = "weight" | "measurement";

export type MovementPattern = "push" | "pull" | "squat" | "hinge" | "core" | "balance_functional" | "mobility";

export interface User {
  id: string;
  email: string;
  is_admin: boolean;
  subscription_tier: SubscriptionTier;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  created_at: string;
  last_active_at: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  age: number | null;
  height_inches: number | null;
  weight_lbs: number | null;
  activity_level: ActivityLevel | null;
  primary_goal: Goal | null;
  secondary_goals: Goal[];
  fitness_level: FitnessLevel | null;
  current_habits: string | null;
  resistance_experience: ResistanceExperience | null;
  days_per_week: number | null;
  session_duration: SessionDuration | null;
  preferred_days: string[];
  equipment: string[];
  eating_pattern: EatingPattern | null;
  dietary_preferences: string[];
  allergies: string[];
  disliked_foods: string | null;
  meals_per_day: number | null;
  exercise_preferences: string[];
  number_of_kids: number | null;
  stress_level: "low" | "moderate" | "high" | null;
  sleep_quality: "poor" | "fair" | "good" | "excellent" | null;
  goal_weight_lbs: number | null;
  postpartum: boolean;
  completed_at: string | null;
  current_section: number;
  created_at: string;
  updated_at: string;
}

export interface SafetyAcknowledgment {
  id: string;
  user_id: string;
  acknowledged: boolean;
  acknowledged_at: string | null;
  created_at: string;
}

export interface FitnessPlan {
  id: string;
  user_id: string;
  assessment_id: string | null;
  program_length_weeks: number;
  current_week: number;
  created_at: string;
}

export interface WorkoutDay {
  id: string;
  fitness_plan_id: string;
  week_number: number;
  day_number: number;
  day_type: DayType;
  exercises: PlannedExercise[];
  created_at: string;
}

export interface PlannedExercise {
  exercise_id: string;
  assigned_version: "modification" | "standard" | "advanced_progression";
  sets: number;
  reps: string;
  rest_seconds: number;
  order: number;
}

export interface ExerciseCompletion {
  id: string;
  user_id: string;
  workout_day_id: string;
  exercise_id: string;
  modification_used: boolean;
  completed_at: string;
}

export interface NutritionPlan {
  id: string;
  user_id: string;
  assessment_id: string | null;
  meal_assignments: Record<string, string[]>;
  created_at: string;
}

export interface ProgressEntry {
  id: string;
  user_id: string;
  entry_type: EntryType;
  label: string | null;
  value: number;
  unit: string;
  recorded_at: string;
}

// Content types (from JSON files, not database)
export interface Exercise {
  id: string;
  name: string;
  movement_pattern: MovementPattern;
  muscle_groups: string[];
  equipment: string[];
  difficulty: FitnessLevel;
  default_sets: number;
  default_reps: string;
  rest_seconds: number;
  instructions: string;
  coaching_cue: string;
  common_mistakes: string;
  modification: string;
  low_impact_alternative: string;
  categories: string[];
  beginner_appropriate_as_standard: boolean;
  advanced_progression?: string;
}

export interface Meal {
  id: string;
  name: string;
  meal_type: "breakfast" | "lunch_dinner" | "snack";
  dietary_tags: string[];
  allergen_tags: string[];
  nutrition_tags: string[];
  ingredients: string[];
  prep_steps: string[];
  substitute_meal_ids: string[];
}

export interface BoneHealthArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  order: number;
}

// Workout template categories for the library
export type WorkoutCategory =
  | "home"
  | "gym"
  | "beginner"
  | "low_impact"
  | "core"
  | "fat_loss"
  | "stretching"
  | "mobility"
  | "post_pregnancy"
  | "bone_health_support"
  | "full_body"
  | "upper_body"
  | "lower_body";

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  duration_minutes: 10 | 20 | 30;
  category: WorkoutCategory;
  difficulty: FitnessLevel;
  equipment: string[];
  exercise_ids: string[];
  image_emoji: string;
}

// Challenges
export interface Challenge {
  id: string;
  name: string;
  description: string;
  duration_days: number;
  category: WorkoutCategory;
  difficulty: FitnessLevel;
  daily_tasks: string[];
  reward_badge: string;
}

// Pricing tiers
export interface PricingTier {
  id: SubscriptionTier;
  name: string;
  price: number;
  interval: "month";
  features: string[];
  stripe_price_id: string;
  popular?: boolean;
}
