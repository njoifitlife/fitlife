import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Dumbbell, Scale, Flame, Calendar } from "lucide-react";
import { LogWeightForm } from "@/components/log-weight-form";

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { count: totalCompletions } = await supabase
    .from("exercise_completions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: recentCompletions } = await supabase
    .from("exercise_completions")
    .select("completed_at")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(100);

  const uniqueDays = new Set(
    (recentCompletions || []).map((c) =>
      new Date(c.completed_at).toISOString().slice(0, 10)
    )
  );

  let currentStreak = 0;
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    if (uniqueDays.has(dateStr)) {
      currentStreak++;
    } else if (i > 0) {
      break;
    }
  }

  const { data: plan } = await supabase
    .from("fitness_plans")
    .select("current_week, program_length_weeks")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const { data: weightEntries } = await supabase
    .from("progress_entries")
    .select("value, recorded_at")
    .eq("user_id", user.id)
    .eq("entry_type", "weight")
    .order("recorded_at", { ascending: false })
    .limit(10);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Your Progress</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your journey and celebrate milestones
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <CardContent className="py-4 text-center">
            <Dumbbell className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-primary">
              {totalCompletions || 0}
            </p>
            <p className="text-xs text-muted-foreground">Exercises done</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <Flame className="h-5 w-5 text-accent mx-auto mb-1" />
            <p className="text-2xl font-bold text-accent">{currentStreak}</p>
            <p className="text-xs text-muted-foreground">Day streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <Calendar className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-primary">
              {uniqueDays.size}
            </p>
            <p className="text-xs text-muted-foreground">Active days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <TrendingUp className="h-5 w-5 text-accent mx-auto mb-1" />
            <p className="text-2xl font-bold text-accent">
              {plan ? `${plan.current_week}/${plan.program_length_weeks}` : "—"}
            </p>
            <p className="text-xs text-muted-foreground">Week</p>
          </CardContent>
        </Card>
      </div>

      {/* Weight Tracker */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            Weight Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LogWeightForm />

          {weightEntries && weightEntries.length > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <p className="text-xs text-muted-foreground font-medium">
                Recent entries
              </p>
              {weightEntries.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {new Date(entry.recorded_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="font-medium">{entry.value} lbs</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { threshold: 1, label: "First exercise completed", icon: "1" },
              { threshold: 10, label: "10 exercises completed", icon: "10" },
              { threshold: 50, label: "50 exercises completed", icon: "50" },
              { threshold: 100, label: "Century club", icon: "100" },
            ].map((milestone) => {
              const achieved = (totalCompletions || 0) >= milestone.threshold;
              return (
                <div
                  key={milestone.threshold}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      achieved
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {milestone.icon}
                  </div>
                  <p
                    className={`text-sm ${achieved ? "font-medium" : "text-muted-foreground"}`}
                  >
                    {milestone.label}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
