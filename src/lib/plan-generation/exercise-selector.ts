import type { Assessment, Exercise, FitnessLevel, MovementPattern, PlannedExercise } from "../types";

const EQUIPMENT_MAP: Record<string, string[]> = {
  none: [],
  resistance_bands: ["resistance_band"],
  dumbbells: ["dumbbells"],
  home_gym: ["dumbbells", "bench", "resistance_band", "kettlebell"],
  full_gym: ["dumbbells", "bench", "resistance_band", "kettlebell"],
};

function resolveEquipment(assessmentEquipment: string[]): string[] {
  const available = new Set<string>();
  for (const eq of assessmentEquipment) {
    const mapped = EQUIPMENT_MAP[eq] || [];
    for (const m of mapped) available.add(m);
  }
  return Array.from(available);
}

// Layer 1: Hard constraints — filter exercises the user can actually do
export function filterByConstraints(
  exercises: Exercise[],
  assessment: Assessment
): Exercise[] {
  const availableEquipment = resolveEquipment(assessment.equipment || []);

  return exercises.filter((ex) => {
    const needsEquipment = ex.equipment.filter((e) => e !== "");
    const hasEquipment = needsEquipment.every((e) => availableEquipment.includes(e));
    if (!hasEquipment) return false;

    const level = assessment.fitness_level || "beginner";
    if (level === "beginner" && ex.difficulty === "advanced") return false;

    if (assessment.postpartum && ex.movement_pattern === "core") {
      if (!ex.beginner_appropriate_as_standard) return false;
    }

    return true;
  });
}

// Layer 2: Personalization — score and rank exercises by goal alignment
export function scoreExercise(
  exercise: Exercise,
  assessment: Assessment
): number {
  let score = 0;
  const goals = [
    assessment.primary_goal,
    ...(assessment.secondary_goals || []),
  ].filter(Boolean);

  if (goals.includes("bone_health_support") && exercise.categories.includes("bone_health_support")) {
    score += 3;
  }
  if (goals.includes("strength") && ["push", "pull", "squat", "hinge"].includes(exercise.movement_pattern)) {
    score += 2;
  }
  if (goals.includes("fat_loss")) {
    if (exercise.muscle_groups.length >= 3) score += 2;
    if (exercise.categories.includes("full_body")) score += 1;
  }
  if (goals.includes("balance") && exercise.movement_pattern === "balance_functional") {
    score += 3;
  }
  if (goals.includes("healthy_aging")) {
    if (exercise.categories.includes("bone_health_support")) score += 2;
    if (exercise.categories.includes("balance")) score += 2;
    if (exercise.categories.includes("fall_prevention")) score += 2;
  }
  if (goals.includes("muscle") && ["push", "pull", "squat", "hinge"].includes(exercise.movement_pattern)) {
    score += 2;
  }
  if (goals.includes("fitness")) {
    score += 1;
  }

  const prefs = assessment.exercise_preferences || [];
  if (prefs.includes("low_impact") && exercise.low_impact_alternative === "Same exercise — already low impact.") {
    score += 1;
  }
  if (prefs.includes("strength") && ["push", "pull", "squat", "hinge"].includes(exercise.movement_pattern)) {
    score += 1;
  }
  if (prefs.includes("balance") && exercise.movement_pattern === "balance_functional") {
    score += 1;
  }
  if (prefs.includes("mobility") && exercise.movement_pattern === "mobility") {
    score += 1;
  }

  if (assessment.stress_level === "high" && exercise.movement_pattern === "mobility") {
    score += 1;
  }
  if (assessment.sleep_quality === "poor" && exercise.movement_pattern === "mobility") {
    score += 1;
  }

  return score;
}

// Layer 3: Variety — ensure balanced movement pattern distribution
const PATTERN_TARGETS: Record<string, MovementPattern[]> = {
  full_body: ["push", "pull", "squat", "hinge", "core"],
  upper_lower: ["push", "pull", "squat", "hinge"],
};

export function assignVersion(
  exercise: Exercise,
  level: FitnessLevel
): "modification" | "standard" | "advanced_progression" {
  if (level === "beginner") {
    return exercise.beginner_appropriate_as_standard ? "standard" : "modification";
  }
  if (level === "advanced" && exercise.advanced_progression) {
    return "advanced_progression";
  }
  return "standard";
}

function adjustVolume(
  exercise: Exercise,
  level: FitnessLevel,
  weekNumber: number
): { sets: number; reps: string } {
  let sets = exercise.default_sets;
  const reps = exercise.default_reps;

  if (level === "beginner") {
    sets = Math.max(2, sets - 1);
  }

  if (weekNumber >= 3) {
    sets = Math.min(sets + 1, 5);
  }

  return { sets, reps };
}

export interface DayPlan {
  dayNumber: number;
  dayType: "workout" | "rest" | "active_recovery";
  exercises: PlannedExercise[];
}

export function buildWeekPlan(
  eligible: Exercise[],
  assessment: Assessment,
  weekNumber: number
): DayPlan[] {
  const daysPerWeek = assessment.days_per_week || 3;
  const sessionDuration = assessment.session_duration || 30;
  const level = assessment.fitness_level || "beginner";

  const scored = eligible.map((ex) => ({
    exercise: ex,
    score: scoreExercise(ex, assessment),
  }));
  scored.sort((a, b) => b.score - a.score);

  const exercisesPerSession = getExerciseCount(sessionDuration);

  const week: DayPlan[] = [];
  const usedThisWeek = new Set<string>();

  for (let day = 1; day <= 7; day++) {
    if (week.filter((d) => d.dayType === "workout").length >= daysPerWeek) {
      if (day <= 7) {
        const isRecoveryDay = week.filter((d) => d.dayType === "rest").length >= (7 - daysPerWeek - 1);
        week.push({
          dayNumber: day,
          dayType: isRecoveryDay ? "active_recovery" : "rest",
          exercises: [],
        });
      }
      continue;
    }

    const dayExercises: PlannedExercise[] = [];
    const patternsUsedToday = new Set<string>();

    const warmup = scored.find(
      (s) => s.exercise.movement_pattern === "mobility" && !usedThisWeek.has(s.exercise.id)
    );
    if (warmup) {
      const version = assignVersion(warmup.exercise, level);
      const vol = adjustVolume(warmup.exercise, level, weekNumber);
      dayExercises.push({
        exercise_id: warmup.exercise.id,
        assigned_version: version,
        sets: vol.sets,
        reps: vol.reps,
        rest_seconds: warmup.exercise.rest_seconds,
        order: dayExercises.length + 1,
      });
      patternsUsedToday.add("mobility");
    }

    const mainPatterns: MovementPattern[] = ["push", "pull", "squat", "hinge", "core", "balance_functional"];

    for (const pattern of mainPatterns) {
      if (dayExercises.length >= exercisesPerSession) break;
      if (patternsUsedToday.has(pattern)) continue;

      const candidate = scored.find(
        (s) =>
          s.exercise.movement_pattern === pattern &&
          !usedThisWeek.has(s.exercise.id) &&
          !dayExercises.some((de) => de.exercise_id === s.exercise.id)
      );

      if (!candidate) {
        const fallback = scored.find(
          (s) =>
            s.exercise.movement_pattern === pattern &&
            !dayExercises.some((de) => de.exercise_id === s.exercise.id)
        );
        if (fallback) {
          const version = assignVersion(fallback.exercise, level);
          const vol = adjustVolume(fallback.exercise, level, weekNumber);
          dayExercises.push({
            exercise_id: fallback.exercise.id,
            assigned_version: version,
            sets: vol.sets,
            reps: vol.reps,
            rest_seconds: fallback.exercise.rest_seconds,
            order: dayExercises.length + 1,
          });
          patternsUsedToday.add(pattern);
        }
        continue;
      }

      const version = assignVersion(candidate.exercise, level);
      const vol = adjustVolume(candidate.exercise, level, weekNumber);
      dayExercises.push({
        exercise_id: candidate.exercise.id,
        assigned_version: version,
        sets: vol.sets,
        reps: vol.reps,
        rest_seconds: candidate.exercise.rest_seconds,
        order: dayExercises.length + 1,
      });
      usedThisWeek.add(candidate.exercise.id);
      patternsUsedToday.add(pattern);
    }

    week.push({
      dayNumber: day,
      dayType: "workout",
      exercises: dayExercises,
    });
  }

  return week;
}

function getExerciseCount(duration: number): number {
  if (duration <= 10) return 4;
  if (duration <= 20) return 5;
  if (duration <= 30) return 6;
  if (duration <= 45) return 7;
  return 8;
}
