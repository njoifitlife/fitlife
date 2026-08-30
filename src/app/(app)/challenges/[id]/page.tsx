"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trophy, Calendar, Check, Circle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Challenge } from "@/lib/types";

import challengesData from "../../../../../content/challenges.json";
const challenges = challengesData as Challenge[];

export default function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const challenge = challenges.find((c) => c.id === id);
  if (!challenge) notFound();

  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [enrolled, setEnrolled] = useState(false);

  const toggleDay = (day: number) => {
    const next = new Set(completedDays);
    if (next.has(day)) {
      next.delete(day);
    } else {
      next.add(day);
    }
    setCompletedDays(next);
  };

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
        <div className="text-5xl mb-3">
          <Trophy className="h-12 w-12 text-warning mx-auto" />
        </div>
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

      {!enrolled ? (
        <Card className="mb-6">
          <CardContent className="py-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Ready to take on this challenge? Join now and start tracking your
              daily progress.
            </p>
            <Button onClick={() => setEnrolled(true)} size="lg">
              Join Challenge
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
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

          <div className="space-y-2">
            {challenge.daily_tasks.map((task, index) => (
              <button
                key={index}
                onClick={() => toggleDay(index)}
                className="w-full text-left"
              >
                <Card
                  className={cn(
                    "transition-colors",
                    completedDays.has(index) && "bg-success/5 border-success/20"
                  )}
                >
                  <CardContent className="py-3 flex items-start gap-3">
                    {completedDays.has(index) ? (
                      <div className="h-5 w-5 rounded-full bg-success flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/30 shrink-0 mt-0.5" />
                    )}
                    <span
                      className={cn(
                        "text-sm",
                        completedDays.has(index) &&
                          "line-through text-muted-foreground"
                      )}
                    >
                      {task}
                    </span>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
