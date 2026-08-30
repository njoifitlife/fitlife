"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Challenge } from "@/lib/types";

import challengesData from "../../../../content/challenges.json";
const challenges = challengesData as Challenge[];

const BADGE_EMOJIS: Record<string, string> = {
  "Movement Maker": "🏃",
  "Strength Starter": "💪",
  "Bone Health Champion": "🦴",
  "Core Crusher": "🔥",
  "30-Day Warrior": "⭐",
};

export default function ChallengesPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="h-5 w-5 text-warning" />
          <h1 className="text-2xl font-bold">Challenges</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Join a challenge to build consistency and earn badges
        </p>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge) => (
          <Link key={challenge.id} href={`/challenges/${challenge.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer mb-4">
              <CardContent className="py-5">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">
                    {BADGE_EMOJIS[challenge.reward_badge] || "🏆"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{challenge.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {challenge.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {challenge.duration_days} days
                      </span>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          challenge.difficulty === "beginner"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        )}
                      >
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Badge: {challenge.reward_badge}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-2" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
