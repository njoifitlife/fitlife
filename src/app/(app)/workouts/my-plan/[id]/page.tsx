import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ChevronLeft, Flame, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { getExerciseById } from "@/lib/content";
import { ExerciseCard } from "@/components/exercise-card";
import type { WorkoutDay, PlannedExercise, Exercise } from "@/lib/types";

export default async function WorkoutDayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: day } = await supabase
    .from("workout_days")
    .select("*")
    .eq("id", id)
    .single();

  if (!day) notFound();

  const workoutDay = day as WorkoutDay;

  if (workoutDay.day_type !== "workout") {
    redirect("/workouts/my-plan");
  }

  const { data: completions } = await supabase
    .from("exercise_completions")
    .select("exercise_id")
    .eq("user_id", user.id)
    .eq("workout_day_id", id);

  const completedIds = new Set((completions || []).map((c) => c.exercise_id));

  const exercises: (PlannedExercise & { details: Exercise })[] = [];
  for (const planned of workoutDay.exercises) {
    const details = await getExerciseById(planned.exercise_id);
    if (details) {
      exercises.push({ ...planned, details });
    }
  }

  exercises.sort((a, b) => a.order - b.order);

  const totalExercises = exercises.length;
  const completedCount = exercises.filter((e) =>
    completedIds.has(e.exercise_id)
  ).length;
  const allDone = completedCount === totalExercises && totalExercises > 0;

  const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const dayName = DAY_NAMES[(workoutDay.day_number - 1) % 7];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link
        href="/workouts/my-plan"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Weekly Plan
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{dayName}&apos;s Workout</h1>
        <div className="flex items-center gap-4 mt-1.5">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Flame className="h-3.5 w-3.5" />
            {totalExercises} exercises
          </span>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            ~{Math.round(totalExercises * 3.5)} min
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">
            {completedCount}/{totalExercises}
          </span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{
              width: `${totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {allDone && (
        <div className="mb-6 p-4 bg-primary/10 rounded-xl flex items-center gap-3">
          <Trophy className="h-6 w-6 text-primary shrink-0" />
          <div>
            <p className="font-semibold text-sm">Workout Complete!</p>
            <p className="text-xs text-muted-foreground">
              Great job — you crushed it today!
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {exercises.map((ex) => (
          <ExerciseCard
            key={ex.exercise_id}
            exercise={ex.details}
            planned={ex}
            workoutDayId={id}
            isCompleted={completedIds.has(ex.exercise_id)}
          />
        ))}
      </div>
    </div>
  );
}
