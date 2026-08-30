"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function toggleExerciseCompletion(
  workoutDayId: string,
  exerciseId: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("exercise_completions")
    .select("id")
    .eq("user_id", user.id)
    .eq("workout_day_id", workoutDayId)
    .eq("exercise_id", exerciseId)
    .single();

  if (existing) {
    await supabase
      .from("exercise_completions")
      .delete()
      .eq("id", existing.id);
  } else {
    await supabase.from("exercise_completions").insert({
      user_id: user.id,
      workout_day_id: workoutDayId,
      exercise_id: exerciseId,
    });
  }

  revalidatePath(`/workouts/my-plan/${workoutDayId}`);
}
