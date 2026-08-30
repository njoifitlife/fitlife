import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Trophy, Calendar } from "lucide-react";
import Link from "next/link";
import type { Challenge } from "@/lib/types";
import { ChallengeEnrollButton } from "@/components/challenge-enroll-button";
import { ChallengeDayToggle } from "@/components/challenge-day-toggle";

import challengesData from "../../../../../content/challenges.json";
const challenges = challengesData as Challenge[];

export function generateStaticParams() {
  return challenges.map((c) => ({ id: c.id }));
}

export default async function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge = challenges.find((c) => c.id === id);
  if (!challenge) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: enrollment } = await supabase
    .from("challenge_enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("challenge_id", id)
    .single();

  let completedDays = new Set<number>();

  if (enrollment) {
    const { data: completions } = await supabase
      .from("challenge_completions")
      .select("day_number")
      .eq("enrollment_id", enrollment.id);

    completedDays = new Set((completions || []).map((c) => c.day_number));
  }

  const progress =
    challenge.daily_tasks.length > 0
      ? Math.round((completedDays.size / challenge.daily_tasks.length) * 100)
      : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link
        href="/challenges"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Challenges
      </Link>

      <div className="text-center mb-6">
        <Trophy className="h-12 w-12 text-accent mx-auto mb-3" />
        <h1 className="text-2xl font-bold">{challenge.name}</h1>
        <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
          {challenge.description}
        </p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {challenge.duration_days} days
          </span>
          <span className="text-sm text-muted-foreground">
            Badge: {challenge.reward_badge}
          </span>
        </div>
      </div>

      {!enrollment ? (
        <Card className="mb-6">
          <CardContent className="py-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Ready to take on this challenge? Join now and start tracking your
              daily progress.
            </p>
            <ChallengeEnrollButton challengeId={id} />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedDays.size}/{challenge.daily_tasks.length} days
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {progress === 100 && (
            <Card className="mb-6 bg-primary/10 border-primary/20">
              <CardContent className="py-4 text-center">
                <p className="font-semibold text-sm">
                  Challenge complete! You earned the &ldquo;{challenge.reward_badge}&rdquo; badge!
                </p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            {challenge.daily_tasks.map((task, index) => (
              <ChallengeDayToggle
                key={index}
                enrollmentId={enrollment.id}
                challengeId={id}
                dayIndex={index}
                task={task.replace(/^Day \d+:\s*/, "")}
                isCompleted={completedDays.has(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
