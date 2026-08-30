import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Apple, Bone, TrendingUp, ChevronRight, Trophy, Users, Settings } from "lucide-react";
import { GeneratePlanButton } from "@/components/generate-plan-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: assessment } = await supabase
    .from("assessments")
    .select("completed_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const { data: acknowledgment } = await supabase
    .from("safety_acknowledgments")
    .select("acknowledged")
    .eq("user_id", user.id)
    .single();

  const { data: plan } = await supabase
    .from("fitness_plans")
    .select("id, current_week, program_length_weeks")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const { count: completionCount } = await supabase
    .from("exercise_completions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const hasCompletedAssessment = !!assessment?.completed_at;
  const hasAcknowledged = !!acknowledgment?.acknowledged;
  const hasPlan = !!plan;

  if (!hasCompletedAssessment) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Welcome to NjoiFitLife</h1>
        <p className="text-muted-foreground mb-6">
          Let&apos;s build your personalized plan. It starts with a quick
          assessment — about 5 minutes.
        </p>
        <Link href="/assessment">
          <Button size="lg" className="w-full">
            Start your assessment
          </Button>
        </Link>
      </div>
    );
  }

  if (!hasAcknowledged) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">One more step</h1>
        <p className="text-muted-foreground mb-6">
          Before we generate your plan, please review our safety information.
        </p>
        <Link href="/safety-acknowledgment">
          <Button size="lg" className="w-full">
            Continue
          </Button>
        </Link>
      </div>
    );
  }

  if (!hasPlan) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Your plan is ready to generate</h1>
        <p className="text-muted-foreground mb-6">
          Based on your assessment, we&apos;ll create a personalized 4-week
          workout and nutrition plan.
        </p>
        <GeneratePlanButton />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Good morning</h1>
        <p className="text-muted-foreground">
          Week {plan.current_week} of {plan.program_length_weeks}
        </p>
      </div>

      <div className="space-y-4">
        {/* Today's Workout */}
        <Link href="/workouts">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Dumbbell className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">Today&apos;s Workout</p>
                <p className="text-sm text-muted-foreground">
                  Tap to see your exercises for today
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </CardContent>
          </Card>
        </Link>

        {/* Today's Nutrition */}
        <Link href="/nutrition">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Apple className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">Today&apos;s Nutrition</p>
                <p className="text-sm text-muted-foreground">
                  See your meal suggestions for today
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </CardContent>
          </Card>
        </Link>

        {/* Bone Health */}
        <Link href="/bone-health">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center text-success shrink-0">
                <Bone className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">Bone Health Hub</p>
                <p className="text-sm text-muted-foreground">
                  Learn how your plan supports healthy aging
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </CardContent>
          </Card>
        </Link>

        {/* Challenges */}
        <Link href="/challenges">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning shrink-0">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">Challenges</p>
                <p className="text-sm text-muted-foreground">
                  Join a challenge to build consistency
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </CardContent>
          </Card>
        </Link>

        {/* Community */}
        <Link href="/community">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Users className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">Community</p>
                <p className="text-sm text-muted-foreground">
                  Motivation, milestones, and support
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </CardContent>
          </Card>
        </Link>

        {/* Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {completionCount || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Exercises completed
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {plan.current_week}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Current week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile / Settings */}
        <Link href="/settings">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                <Settings className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">Profile & Settings</p>
                <p className="text-sm text-muted-foreground">
                  Account, subscription, and preferences
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
