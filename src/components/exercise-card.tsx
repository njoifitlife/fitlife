"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toggleExerciseCompletion } from "@/lib/actions/exercise";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise, PlannedExercise } from "@/lib/types";

interface ExerciseCardProps {
  exercise: Exercise;
  planned: PlannedExercise;
  workoutDayId: string;
  isCompleted: boolean;
}

export function ExerciseCard({
  exercise,
  planned,
  workoutDayId,
  isCompleted,
}: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleExerciseCompletion(workoutDayId, exercise.id);
    });
  }

  const versionLabel =
    planned.assigned_version === "modification"
      ? "Modified"
      : planned.assigned_version === "advanced_progression"
        ? "Advanced"
        : "Standard";

  return (
    <Card
      className={cn(
        "transition-all",
        isCompleted && "opacity-75 border-primary/30 bg-primary/5"
      )}
    >
      <CardContent className="py-4">
        <div className="flex items-start gap-3">
          <button
            onClick={handleToggle}
            disabled={isPending}
            className={cn(
              "mt-0.5 h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
              isCompleted
                ? "bg-primary border-primary text-primary-foreground"
                : "border-muted-foreground/40 hover:border-primary"
            )}
          >
            {isCompleted && <Check className="h-3.5 w-3.5" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p
                className={cn(
                  "font-semibold text-sm",
                  isCompleted && "line-through text-muted-foreground"
                )}
              >
                {exercise.name}
              </p>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                {versionLabel}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {planned.sets} sets &times; {planned.reps} &middot;{" "}
              {planned.rest_seconds}s rest
            </p>

            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-primary mt-2 flex items-center gap-1 hover:underline"
            >
              {expanded ? (
                <>
                  Hide details <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  Show details <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>

            {expanded && (
              <div className="mt-3 space-y-2.5 text-xs text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">How to do it</p>
                  <p>{exercise.instructions}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Coaching cue</p>
                  <p>{exercise.coaching_cue}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Common mistakes</p>
                  <p>{exercise.common_mistakes}</p>
                </div>
                {planned.assigned_version === "modification" && (
                  <div>
                    <p className="font-medium text-foreground">Modification</p>
                    <p>{exercise.modification}</p>
                  </div>
                )}
                {planned.assigned_version === "advanced_progression" &&
                  exercise.advanced_progression && (
                    <div>
                      <p className="font-medium text-foreground">
                        Advanced progression
                      </p>
                      <p>{exercise.advanced_progression}</p>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
