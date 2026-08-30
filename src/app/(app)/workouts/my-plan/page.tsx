import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { WorkoutDay } from "@/lib/types";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_TYPE_LABELS: Record<string, string> = {
  workout: "Workout Day",
  rest: "Rest Day",
  active_recovery: "Active Recovery",
};

export default async function MyPlanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: plan } = await supabase
    .from("fitness_plans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!plan) redirect("/dashboard");

  const { data: days } = await supabase
    .from("workout_days")
    .select("*")
    .eq("fitness_plan_id", plan.id)
    .eq("week_number", plan.current_week)
    .order("day_number", { ascending: true });

  const workoutDays = (days || []) as WorkoutDay[];

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
        <h1 className="text-2xl font-bold">Your Plan</h1>
        <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1">
          <Calendar className="h-3.5 w-3.5" />
          Week {plan.current_week} of {plan.program_length_weeks}
        </p>
      </div>

      <div className="space-y-3">
        {workoutDays.map((day) => {
          const isWorkout = day.day_type === "workout";
          const exerciseCount = day.exercises?.length || 0;

          return (
            <Link
              key={day.id}
              href={isWorkout ? `/workouts/my-plan/${day.id}` : "#"}
              className={cn(!isWorkout && "pointer-events-none")}
            >
              <Card
                className={cn(
                  "transition-shadow",
                  isWorkout && "hover:shadow-md cursor-pointer"
                )}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0",
                      day.day_type === "workout"
                        ? "bg-primary/10 text-primary"
                        : day.day_type === "active_recovery"
                          ? "bg-accent/10 text-accent"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {DAY_NAMES[(day.day_number - 1) % 7]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">
                      {DAY_TYPE_LABELS[day.day_type]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isWorkout
                        ? `${exerciseCount} exercises`
                        : day.day_type === "active_recovery"
                          ? "Light movement or stretching"
                          : "Take a break — you've earned it"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
