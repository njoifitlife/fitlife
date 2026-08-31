import type { Assessment } from "../types";
import { getAllExercises, getAllMeals } from "../content";
import { filterByConstraints, buildWeekPlan } from "./exercise-selector";
import { filterMealsByDiet, buildWeekMealPlan } from "./nutrition-selector";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function generateFullPlan(
  supabase: SupabaseClient,
  userId: string,
  assessment: Assessment
) {
  const allExercises = await getAllExercises();
  const eligible = filterByConstraints(allExercises, assessment);

  if (eligible.length < 4) {
    return { error: "Not enough exercises match your constraints. Try adding more equipment options." };
  }

  const { data: plan, error: planError } = await supabase
    .from("fitness_plans")
    .insert({
      user_id: userId,
      assessment_id: assessment.id,
      program_length_weeks: 4,
      current_week: 1,
    })
    .select()
    .single();

  if (planError) return { error: planError.message };

  for (let week = 1; week <= 4; week++) {
    const weekPlan = buildWeekPlan(eligible, assessment, week);

    for (const day of weekPlan) {
      const { error: dayError } = await supabase
        .from("workout_days")
        .insert({
          fitness_plan_id: plan.id,
          week_number: week,
          day_number: day.dayNumber,
          day_type: day.dayType,
          exercises: day.exercises,
        });

      if (dayError) return { error: dayError.message };
    }
  }

  const allMeals = await getAllMeals();
  const eligibleMeals = filterMealsByDiet(allMeals, assessment);

  if (eligibleMeals.length >= 3) {
    const weekMealPlan = buildWeekMealPlan(eligibleMeals, assessment);

    const { error: nutritionError } = await supabase
      .from("nutrition_plans")
      .insert({
        user_id: userId,
        assessment_id: assessment.id,
        meal_assignments: weekMealPlan,
      });

    if (nutritionError) return { error: nutritionError.message };
  }

  return {
    success: true,
    planId: plan.id,
    nutritionSkipped: eligibleMeals.length < 3,
  };
}
