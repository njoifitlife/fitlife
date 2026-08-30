import type { Assessment, Meal } from "../types";

const EATING_PATTERN_TO_TAGS: Record<string, string[]> = {
  vegetarian: ["vegetarian"],
  vegan: ["vegan", "vegetarian"],
  pescatarian: ["pescatarian"],
  dairy_free: ["dairy_free"],
  gluten_free: ["gluten_free"],
};

const ALLERGEN_MAP: Record<string, string[]> = {
  dairy: ["dairy"],
  nuts: ["tree_nuts"],
  tree_nuts: ["tree_nuts"],
  eggs: ["eggs"],
  soy: ["soy"],
  fish: ["fish"],
  shellfish: ["shellfish"],
  gluten: ["gluten"],
  wheat: ["gluten"],
  sesame: ["sesame"],
};

function resolveAllergens(userAllergens: string[]): string[] {
  const resolved = new Set<string>();
  for (const a of userAllergens) {
    const key = a.toLowerCase().trim();
    const mapped = ALLERGEN_MAP[key];
    if (mapped) {
      for (const m of mapped) resolved.add(m);
    } else {
      resolved.add(key);
    }
  }
  return Array.from(resolved);
}

export function filterMealsByDiet(
  meals: Meal[],
  assessment: Assessment
): Meal[] {
  const pattern = assessment.eating_pattern;
  const allergens = resolveAllergens(assessment.allergies || []);

  return meals.filter((meal) => {
    if (allergens.length > 0) {
      if (meal.allergen_tags.some((a) => allergens.includes(a))) return false;
    }

    if (pattern && pattern !== "omnivore" && pattern !== "other") {
      const requiredTags = EATING_PATTERN_TO_TAGS[pattern] || [];
      if (requiredTags.length > 0) {
        const hasDietaryMatch = requiredTags.some((tag) =>
          meal.dietary_tags.includes(tag)
        );
        if (!hasDietaryMatch) return false;
      }
    }

    return true;
  });
}

export function scoreMeal(meal: Meal, assessment: Assessment): number {
  let score = 0;
  const goals = [
    assessment.primary_goal,
    ...(assessment.secondary_goals || []),
  ].filter(Boolean);

  if (goals.includes("bone_health_support")) {
    if (meal.nutrition_tags.includes("bone_health_support")) score += 3;
    if (meal.nutrition_tags.includes("calcium_rich")) score += 2;
    if (meal.nutrition_tags.includes("vitamin_d")) score += 2;
  }

  if (goals.includes("strength") || goals.includes("muscle")) {
    if (meal.nutrition_tags.includes("high_protein")) score += 2;
  }

  if (goals.includes("fat_loss")) {
    if (meal.nutrition_tags.includes("high_protein")) score += 2;
    if (meal.nutrition_tags.includes("high_fiber")) score += 1;
  }

  if (goals.includes("healthy_aging")) {
    if (meal.nutrition_tags.includes("omega_3")) score += 2;
    if (meal.nutrition_tags.includes("bone_health_support")) score += 1;
  }

  if (goals.includes("general_wellness")) {
    if (meal.nutrition_tags.includes("high_fiber")) score += 1;
    if (meal.nutrition_tags.includes("healthy_fats")) score += 1;
  }

  return score;
}

export interface WeekMealPlan {
  [day: string]: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  };
}

export function buildWeekMealPlan(
  eligible: Meal[],
  assessment: Assessment
): WeekMealPlan {
  const breakfasts = eligible.filter((m) => m.meal_type === "breakfast");
  const mains = eligible.filter((m) => m.meal_type === "lunch_dinner");
  const snacks = eligible.filter((m) => m.meal_type === "snack");

  const scoredBreakfasts = breakfasts
    .map((m) => ({ meal: m, score: scoreMeal(m, assessment) }))
    .sort((a, b) => b.score - a.score);
  const scoredMains = mains
    .map((m) => ({ meal: m, score: scoreMeal(m, assessment) }))
    .sort((a, b) => b.score - a.score);
  const scoredSnacks = snacks
    .map((m) => ({ meal: m, score: scoreMeal(m, assessment) }))
    .sort((a, b) => b.score - a.score);

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const mealsPerDay = assessment.meals_per_day || 3;
  const snacksPerDay = Math.max(0, mealsPerDay - 3);

  const plan: WeekMealPlan = {};

  for (let i = 0; i < days.length; i++) {
    const bf = scoredBreakfasts[i % scoredBreakfasts.length]?.meal;
    const lunch = scoredMains[i % scoredMains.length]?.meal;
    const dinner = scoredMains[(i + Math.floor(scoredMains.length / 2)) % scoredMains.length]?.meal;

    const daySnacks: string[] = [];
    for (let s = 0; s < snacksPerDay && s < scoredSnacks.length; s++) {
      daySnacks.push(scoredSnacks[(i + s) % scoredSnacks.length].meal.id);
    }

    plan[days[i]] = {
      breakfast: bf?.id || "",
      lunch: lunch?.id || "",
      dinner: dinner?.id || "",
      snacks: daySnacks,
    };
  }

  return plan;
}
