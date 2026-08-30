import { notFound } from "next/navigation";
import { ChevronLeft, UtensilsCrossed, Leaf, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getMealById, getAllMeals } from "@/lib/content";
import { FoodHeroBanner } from "@/components/food-illustration";

export async function generateStaticParams() {
  const meals = await getAllMeals();
  return meals.map((m) => ({ id: m.id }));
}

export default async function MealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meal = await getMealById(id);
  if (!meal) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link
        href="/nutrition"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Meal Plan
      </Link>

      <FoodHeroBanner mealId={meal.id} mealType={meal.meal_type} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{meal.name}</h1>
        <p className="text-sm text-muted-foreground mt-1 capitalize">
          {meal.meal_type.replace("_", " / ")}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {meal.dietary_tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium"
          >
            <Leaf className="h-3 w-3" />
            {tag.replace(/_/g, " ")}
          </span>
        ))}
        {meal.allergen_tags.length > 0 && (
          <>
            {meal.allergen_tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive font-medium"
              >
                <AlertTriangle className="h-3 w-3" />
                Contains {tag}
              </span>
            ))}
          </>
        )}
      </div>

      {/* Ingredients */}
      <Card className="mb-4">
        <CardContent className="py-4">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-primary" />
            Ingredients
          </h2>
          <ul className="space-y-1.5">
            {meal.ingredients.map((ingredient, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {ingredient}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Prep Steps */}
      <Card className="mb-4">
        <CardContent className="py-4">
          <h2 className="font-semibold text-sm mb-3">Preparation</h2>
          <ol className="space-y-2">
            {meal.prep_steps.map((step, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-3">
                <span className="font-bold text-primary shrink-0 w-5 text-right">
                  {i + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Nutrition Tags */}
      {meal.nutrition_tags.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <h2 className="font-semibold text-sm mb-2">Nutrition highlights</h2>
            <div className="flex flex-wrap gap-1.5">
              {meal.nutrition_tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                >
                  {tag.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
