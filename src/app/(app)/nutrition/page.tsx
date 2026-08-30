import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, ChevronRight, UtensilsCrossed, Coffee, Cookie } from "lucide-react";
import Link from "next/link";
import { getMealById } from "@/lib/content";
import type { Meal, NutritionPlan } from "@/lib/types";

const MEAL_TYPE_ICONS: Record<string, typeof Coffee> = {
  breakfast: Coffee,
  lunch_dinner: UtensilsCrossed,
  snack: Cookie,
};

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch_dinner: "Lunch / Dinner",
  snack: "Snack",
};

const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function NutritionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: nutritionPlan } = await supabase
    .from("nutrition_plans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!nutritionPlan) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-3">
              <Apple className="h-7 w-7" />
            </div>
            <CardTitle>Nutrition Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Your personalized nutrition suggestions will appear here once your
              plan is generated.
            </p>
            <Link
              href="/dashboard"
              className="block mt-4 text-center text-sm text-primary hover:underline"
            >
              Go to dashboard to generate your plan
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const plan = nutritionPlan as NutritionPlan;
  const mealAssignments = plan.meal_assignments as Record<string, string[]>;

  const allMealIds = new Set<string>();
  for (const ids of Object.values(mealAssignments)) {
    for (const id of ids) allMealIds.add(id);
  }

  const mealsMap = new Map<string, Meal>();
  for (const id of allMealIds) {
    const meal = await getMealById(id);
    if (meal) mealsMap.set(id, meal);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Your Meal Plan</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Personalized suggestions based on your preferences
        </p>
      </div>

      <div className="space-y-6">
        {DAY_LABELS.map((dayLabel, dayIndex) => {
          const dayKey = `day_${dayIndex + 1}`;
          const mealIds = mealAssignments[dayKey] || [];
          const meals = mealIds
            .map((id) => mealsMap.get(id))
            .filter(Boolean) as Meal[];

          if (meals.length === 0) return null;

          return (
            <div key={dayKey}>
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {dayLabel}
              </h2>
              <div className="space-y-2">
                {meals.map((meal) => {
                  const Icon = MEAL_TYPE_ICONS[meal.meal_type] || Apple;
                  return (
                    <Link
                      key={`${dayKey}-${meal.id}`}
                      href={`/nutrition/${meal.id}`}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center gap-3 py-3">
                          <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {meal.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {MEAL_TYPE_LABELS[meal.meal_type]}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
