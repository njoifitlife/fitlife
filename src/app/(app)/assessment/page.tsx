"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getOrCreateAssessment, saveAssessmentSection, completeAssessment } from "@/lib/actions/assessment";
import type { Assessment, Goal } from "@/lib/types";
import { cn } from "@/lib/utils";

const TOTAL_SECTIONS = 7;

const GOALS: { value: Goal; label: string }[] = [
  { value: "strength", label: "Build strength" },
  { value: "muscle", label: "Build muscle" },
  { value: "fat_loss", label: "Fat loss" },
  { value: "fitness", label: "Improve fitness" },
  { value: "healthy_aging", label: "Healthy aging" },
  { value: "balance", label: "Better balance" },
  { value: "bone_health_support", label: "Bone health support" },
  { value: "general_wellness", label: "General wellness" },
];

const EQUIPMENT = [
  "none",
  "resistance_bands",
  "dumbbells",
  "home_gym",
  "full_gym",
];

const EQUIPMENT_LABELS: Record<string, string> = {
  none: "No equipment (bodyweight only)",
  resistance_bands: "Resistance bands",
  dumbbells: "Dumbbells",
  home_gym: "Home gym setup",
  full_gym: "Full gym access",
};

const EXERCISE_PREFS = [
  "strength",
  "walking",
  "low_impact",
  "balance",
  "mobility",
  "home_workouts",
  "gym_workouts",
];

const EXERCISE_PREF_LABELS: Record<string, string> = {
  strength: "Strength training",
  walking: "Walking",
  low_impact: "Low-impact exercises",
  balance: "Balance work",
  mobility: "Mobility & flexibility",
  home_workouts: "Home workouts",
  gym_workouts: "Gym workouts",
};

export default function AssessmentPage() {
  const router = useRouter();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [section, setSection] = useState(1);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const loadAssessment = useCallback(async () => {
    const data = await getOrCreateAssessment();
    setAssessment(data);
    setSection(data.current_section || 1);
    setFormData({
      age: data.age,
      height_inches: data.height_inches,
      weight_lbs: data.weight_lbs,
      activity_level: data.activity_level,
      primary_goal: data.primary_goal,
      secondary_goals: data.secondary_goals || [],
      fitness_level: data.fitness_level,
      current_habits: data.current_habits,
      resistance_experience: data.resistance_experience,
      days_per_week: data.days_per_week,
      session_duration: data.session_duration,
      preferred_days: data.preferred_days || [],
      equipment: data.equipment || [],
      eating_pattern: data.eating_pattern,
      dietary_preferences: data.dietary_preferences || [],
      allergies: data.allergies || [],
      disliked_foods: data.disliked_foods,
      meals_per_day: data.meals_per_day,
      exercise_preferences: data.exercise_preferences || [],
    });
  }, []);

  useEffect(() => { loadAssessment(); }, [loadAssessment]);

  function updateField(key: string, value: unknown) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArrayItem(key: string, item: string) {
    setFormData((prev) => {
      const arr = (prev[key] as string[]) || [];
      return {
        ...prev,
        [key]: arr.includes(item)
          ? arr.filter((i) => i !== item)
          : [...arr, item],
      };
    });
  }

  async function handleNext() {
    if (!assessment) return;
    setSaving(true);

    const sectionData = getSectionData(section);
    const result = await saveAssessmentSection(assessment.id, section, sectionData);

    if (result.error) {
      setSaving(false);
      return;
    }

    if (section >= TOTAL_SECTIONS) {
      await completeAssessment(assessment.id);
      return;
    }

    setSection((s) => s + 1);
    setSaving(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getSectionData(s: number): Record<string, unknown> {
    switch (s) {
      case 1:
        return {
          age: formData.age ? Number(formData.age) : null,
          height_inches: formData.height_inches ? Number(formData.height_inches) : null,
          weight_lbs: formData.weight_lbs ? Number(formData.weight_lbs) : null,
          activity_level: formData.activity_level,
        };
      case 2:
        return {
          primary_goal: formData.primary_goal,
          secondary_goals: formData.secondary_goals,
        };
      case 3:
        return {
          fitness_level: formData.fitness_level,
          current_habits: formData.current_habits,
          resistance_experience: formData.resistance_experience,
        };
      case 4:
        return {
          days_per_week: formData.days_per_week ? Number(formData.days_per_week) : null,
          session_duration: formData.session_duration ? Number(formData.session_duration) : null,
        };
      case 5:
        return { equipment: formData.equipment };
      case 6:
        return {
          eating_pattern: formData.eating_pattern,
          allergies: formData.allergies,
          disliked_foods: formData.disliked_foods,
          meals_per_day: formData.meals_per_day ? Number(formData.meals_per_day) : null,
        };
      case 7:
        return { exercise_preferences: formData.exercise_preferences };
      default:
        return {};
    }
  }

  if (!assessment) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Section {section} of {TOTAL_SECTIONS}</span>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-primary hover:underline"
          >
            Save &amp; continue later
          </button>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(section / TOTAL_SECTIONS) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{sectionTitle(section)}</CardTitle>
          <CardDescription>{sectionSubtitle(section)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {section === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min={18}
                  max={100}
                  value={(formData.age as number) || ""}
                  onChange={(e) => updateField("age", e.target.value)}
                  placeholder="e.g., 48"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (inches)</Label>
                <Input
                  id="height"
                  type="number"
                  min={48}
                  max={84}
                  value={(formData.height_inches as number) || ""}
                  onChange={(e) => updateField("height_inches", e.target.value)}
                  placeholder="e.g., 65"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  min={80}
                  max={500}
                  value={(formData.weight_lbs as number) || ""}
                  onChange={(e) => updateField("weight_lbs", e.target.value)}
                  placeholder="e.g., 155"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="activity">Activity level</Label>
                <Select
                  id="activity"
                  value={(formData.activity_level as string) || ""}
                  onChange={(e) => updateField("activity_level", e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="lightly_active">Lightly active (1-2 days/week)</option>
                  <option value="moderately_active">Moderately active (3-4 days/week)</option>
                  <option value="very_active">Very active (5+ days/week)</option>
                </Select>
              </div>
            </>
          )}

          {section === 2 && (
            <>
              <div className="space-y-3">
                <Label>Primary goal (choose one)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {GOALS.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => updateField("primary_goal", g.value)}
                      className={cn(
                        "px-4 py-3 rounded-lg border text-sm font-medium text-left transition-colors",
                        formData.primary_goal === g.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border hover:bg-secondary"
                      )}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>Secondary goals (optional, select any)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {GOALS.filter((g) => g.value !== formData.primary_goal).map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => toggleArrayItem("secondary_goals", g.value)}
                      className={cn(
                        "px-4 py-3 rounded-lg border text-sm font-medium text-left transition-colors",
                        ((formData.secondary_goals as string[]) || []).includes(g.value)
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-card border-border hover:bg-secondary"
                      )}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {section === 3 && (
            <>
              <div className="space-y-2">
                <Label>Fitness level</Label>
                <div className="space-y-2">
                  {[
                    { value: "beginner", label: "Beginner", desc: "New to exercise or returning after a long break" },
                    { value: "intermediate", label: "Intermediate", desc: "Exercise regularly, comfortable with most movements" },
                    { value: "advanced", label: "Advanced", desc: "Experienced, looking for challenging workouts" },
                  ].map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => updateField("fitness_level", level.value)}
                      className={cn(
                        "w-full px-4 py-3 rounded-lg border text-left transition-colors",
                        formData.fitness_level === level.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border hover:bg-secondary"
                      )}
                    >
                      <span className="font-medium text-sm">{level.label}</span>
                      <span className={cn(
                        "block text-xs mt-0.5",
                        formData.fitness_level === level.value
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      )}>
                        {level.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Resistance training experience</Label>
                <Select
                  id="experience"
                  value={(formData.resistance_experience as string) || ""}
                  onChange={(e) => updateField("resistance_experience", e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="none">None</option>
                  <option value="some">Some experience</option>
                  <option value="regular">Regular practice</option>
                </Select>
              </div>
            </>
          )}

          {section === 4 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="days">Days per week</Label>
                <Select
                  id="days"
                  value={String(formData.days_per_week || "")}
                  onChange={(e) => updateField("days_per_week", e.target.value)}
                >
                  <option value="">Select...</option>
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <option key={d} value={d}>
                      {d} {d === 1 ? "day" : "days"}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Session duration</Label>
                <Select
                  id="duration"
                  value={String(formData.session_duration || "")}
                  onChange={(e) => updateField("session_duration", e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="20">20 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </Select>
              </div>
            </>
          )}

          {section === 5 && (
            <div className="space-y-3">
              <Label>Available equipment (select all that apply)</Label>
              <div className="space-y-2">
                {EQUIPMENT.map((eq) => (
                  <button
                    key={eq}
                    type="button"
                    onClick={() => toggleArrayItem("equipment", eq)}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg border text-sm font-medium text-left transition-colors",
                      ((formData.equipment as string[]) || []).includes(eq)
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-card border-border hover:bg-secondary"
                    )}
                  >
                    {EQUIPMENT_LABELS[eq]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {section === 6 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="eating">Eating pattern</Label>
                <Select
                  id="eating"
                  value={(formData.eating_pattern as string) || ""}
                  onChange={(e) => updateField("eating_pattern", e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="omnivore">Omnivore</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="pescatarian">Pescatarian</option>
                  <option value="dairy_free">Dairy-free</option>
                  <option value="gluten_free">Gluten-free</option>
                  <option value="other">Other</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Food allergies (comma separated)</Label>
                <Input
                  id="allergies"
                  value={((formData.allergies as string[]) || []).join(", ")}
                  onChange={(e) =>
                    updateField(
                      "allergies",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="e.g., nuts, shellfish"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meals">Meals per day</Label>
                <Select
                  id="meals"
                  value={String(formData.meals_per_day || "")}
                  onChange={(e) => updateField("meals_per_day", e.target.value)}
                >
                  <option value="">Select...</option>
                  {[2, 3, 4, 5, 6].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </Select>
              </div>
            </>
          )}

          {section === 7 && (
            <div className="space-y-3">
              <Label>Exercise preferences (select all that interest you)</Label>
              <div className="grid grid-cols-2 gap-2">
                {EXERCISE_PREFS.map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => toggleArrayItem("exercise_preferences", pref)}
                    className={cn(
                      "px-4 py-3 rounded-lg border text-sm font-medium text-left transition-colors",
                      ((formData.exercise_preferences as string[]) || []).includes(pref)
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-card border-border hover:bg-secondary"
                    )}
                  >
                    {EXERCISE_PREF_LABELS[pref]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-4">
            {section > 1 && (
              <Button
                variant="outline"
                onClick={() => setSection((s) => s - 1)}
                disabled={saving}
              >
                Back
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={handleNext}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : section === TOTAL_SECTIONS
                ? "Complete assessment"
                : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function sectionTitle(s: number): string {
  const titles: Record<number, string> = {
    1: "About you",
    2: "Your goals",
    3: "Fitness experience",
    4: "Your schedule",
    5: "Equipment",
    6: "Nutrition preferences",
    7: "Exercise preferences",
  };
  return titles[s] || "";
}

function sectionSubtitle(s: number): string {
  const subs: Record<number, string> = {
    1: "Help us understand where you're starting from.",
    2: "What do you most want from your fitness program?",
    3: "Tell us about your current fitness level.",
    4: "How often and how long can you work out?",
    5: "What do you have access to?",
    6: "We'll match meal suggestions to your preferences.",
    7: "What types of exercise interest you most?",
  };
  return subs[s] || "";
}
