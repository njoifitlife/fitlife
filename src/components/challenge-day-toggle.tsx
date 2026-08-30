"use client";

import { useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Circle } from "lucide-react";
import { toggleChallengeDay } from "@/lib/actions/challenges";
import { cn } from "@/lib/utils";

export function ChallengeDayToggle({
  enrollmentId,
  challengeId,
  dayIndex,
  task,
  isCompleted,
}: {
  enrollmentId: string;
  challengeId: string;
  dayIndex: number;
  task: string;
  isCompleted: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className="w-full text-left"
      disabled={isPending}
      onClick={() =>
        startTransition(() =>
          toggleChallengeDay(enrollmentId, dayIndex, challengeId)
        )
      }
    >
      <Card
        className={cn(
          "transition-colors",
          isCompleted && "bg-primary/5 border-primary/20"
        )}
      >
        <CardContent className="py-3 flex items-start gap-3">
          {isCompleted ? (
            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground/30 shrink-0 mt-0.5" />
          )}
          <span
            className={cn(
              "text-sm",
              isCompleted && "line-through text-muted-foreground"
            )}
          >
            Day {dayIndex + 1}: {task}
          </span>
        </CardContent>
      </Card>
    </button>
  );
}
