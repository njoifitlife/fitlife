import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Dumbbell, ChevronLeft, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAllExercises } from "@/lib/content";
import { ExerciseIllustration } from "@/components/exercise-illustration";
import type { WorkoutTemplate, Exercise } from "@/lib/types";

import templatesData from "../../../../../content/workout-templates.json";
const templates = templatesData as WorkoutTemplate[];

export async function generateStaticParams() {
  return templates.map((t) => ({ id: t.id }));
}

export default async function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = templates.find((t) => t.id === id);
  if (!template) notFound();

  const allExercises = await getAllExercises();
  const exercises = template.exercise_ids
    .map((eid) => allExercises.find((e) => e.id === eid))
    .filter((e): e is Exercise => e !== undefined);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link
        href="/workouts"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Library
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{template.image_emoji}</span>
          <div>
            <h1 className="text-2xl font-bold">{template.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {template.duration_minutes} min
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Dumbbell className="h-3.5 w-3.5" />
                {template.equipment.length === 0
                  ? "No equipment"
                  : template.equipment.join(", ")}
              </span>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  template.difficulty === "beginner"
                    ? "bg-success/10 text-success"
                    : template.difficulty === "intermediate"
                      ? "bg-warning/10 text-warning"
                      : "bg-destructive/10 text-destructive"
                )}
              >
                {template.difficulty}
              </span>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">{template.description}</p>
      </div>

      <div className="space-y-3 mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Exercises ({exercises.length})
        </h2>
        {exercises.map((exercise, index) => (
          <Card key={exercise.id}>
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="text-xs font-bold text-muted-foreground/50">
                    {index + 1}
                  </span>
                  <ExerciseIllustration exerciseId={exercise.id} movementPattern={exercise.movement_pattern} size="md" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{exercise.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {exercise.default_sets} sets x {exercise.default_reps}
                    {exercise.rest_seconds > 0 &&
                      ` · ${exercise.rest_seconds}s rest`}
                  </p>
                  <p className="text-xs text-foreground/80 mt-2">
                    {exercise.instructions}
                  </p>
                  <div className="mt-2 flex items-start gap-1">
                    <Info className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-primary">
                      {exercise.coaching_cue}
                    </p>
                  </div>
                  {exercise.modification && (
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium">Easier:</span>{" "}
                      {exercise.modification}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button className="w-full" size="lg">
        Start Workout
      </Button>
    </div>
  );
}
