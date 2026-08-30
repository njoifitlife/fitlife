"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Clock, Filter, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { WorkoutTemplate } from "@/lib/types";

import templatesData from "../../../../content/workout-templates.json";
const templates = templatesData as WorkoutTemplate[];

const DURATION_FILTERS = [
  { label: "All", value: null },
  { label: "10 min", value: 10 },
  { label: "20 min", value: 20 },
  { label: "30 min", value: 30 },
] as const;

const CATEGORY_FILTERS = [
  { label: "All", value: null },
  { label: "Home", value: "home" },
  { label: "Gym", value: "gym" },
  { label: "Beginner", value: "beginner" },
  { label: "Low Impact", value: "low_impact" },
  { label: "Core", value: "core" },
  { label: "Fat Loss", value: "fat_loss" },
  { label: "Stretching", value: "stretching" },
  { label: "Mobility", value: "mobility" },
  { label: "Post-Pregnancy", value: "post_pregnancy" },
  { label: "Bone Health", value: "bone_health_support" },
] as const;

export default function WorkoutsPage() {
  const [durationFilter, setDurationFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const filtered = templates.filter((t) => {
    if (durationFilter && t.duration_minutes !== durationFilter) return false;
    if (categoryFilter && t.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Workout Library</h1>
        <p className="text-muted-foreground text-sm">
          Choose a workout by time or focus area
        </p>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Duration
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {DURATION_FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setDurationFilter(f.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                durationFilter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Category
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setCategoryFilter(f.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                categoryFilter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No workouts match your filters. Try adjusting your selection.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((template) => (
            <Link
              key={template.id}
              href={`/workouts/${template.id}`}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="text-3xl">{template.image_emoji}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{template.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {template.duration_minutes} min
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Dumbbell className="h-3 w-3" />
                        {template.equipment.length === 0
                          ? "No equipment"
                          : template.equipment.join(", ")}
                      </span>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
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
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link href="/workouts/my-plan">
          <Button className="w-full" variant="outline">
            <Dumbbell className="h-4 w-4 mr-2" />
            View My Personalized Plan
          </Button>
        </Link>
      </div>
    </div>
  );
}
