const FOOD_VISUALS: Record<string, { emoji: string; bg: string; accent: string }> = {
  "greek-yogurt-berry-bowl": { emoji: "🫐", bg: "#E8E0F4", accent: "#9B7EC8" },
  "overnight-oats": { emoji: "🥣", bg: "#FFF3E0", accent: "#E8A87C" },
  "smoothie-bowl": { emoji: "🥤", bg: "#FCE4EC", accent: "#E57399" },
  "veggie-egg-scramble": { emoji: "🍳", bg: "#FFF9C4", accent: "#F9A825" },
  "avocado-toast": { emoji: "🥑", bg: "#E8F5E9", accent: "#66BB6A" },
  "banana-oat-pancakes": { emoji: "🥞", bg: "#FFF3E0", accent: "#D4857A" },
  "cottage-cheese-fruit": { emoji: "🍑", bg: "#FFF3E0", accent: "#FF8A65" },
  "salmon-sweet-potato": { emoji: "🐟", bg: "#FFEBEE", accent: "#EF5350" },
  "chicken-grain-bowl": { emoji: "🍗", bg: "#FFF8E1", accent: "#FFB300" },
  "lentil-soup": { emoji: "🥘", bg: "#FBE9E7", accent: "#D84315" },
  "tofu-stir-fry": { emoji: "🥦", bg: "#E8F5E9", accent: "#43A047" },
  "turkey-lettuce-wraps": { emoji: "🥬", bg: "#F1F8E9", accent: "#7CB342" },
  "Mediterranean-plate": { emoji: "🫒", bg: "#E3F2FD", accent: "#1E88E5" },
  "sheet-pan-chicken-veggies": { emoji: "🍗", bg: "#FFF3E0", accent: "#FF8F00" },
  "trail-mix": { emoji: "🥜", bg: "#EFEBE9", accent: "#8D6E63" },
  "apple-almond-butter": { emoji: "🍎", bg: "#FFEBEE", accent: "#E53935" },
  "yogurt-snack": { emoji: "🍨", bg: "#F3E5F5", accent: "#AB47BC" },
  "edamame-snack": { emoji: "🌱", bg: "#E8F5E9", accent: "#66BB6A" },
  "hummus-veggies": { emoji: "🥕", bg: "#FFF3E0", accent: "#FF7043" },
  "energy-bites": { emoji: "⚡", bg: "#FFF9C4", accent: "#FDD835" },
  "sardine-crackers": { emoji: "🐟", bg: "#E0F2F1", accent: "#26A69A" },
};

const MEAL_TYPE_FALLBACK: Record<string, { emoji: string; bg: string; accent: string }> = {
  breakfast: { emoji: "☀️", bg: "#FFF9C4", accent: "#F9A825" },
  lunch_dinner: { emoji: "🍽️", bg: "#E8F5E9", accent: "#66BB6A" },
  snack: { emoji: "🍿", bg: "#FFF3E0", accent: "#FF8A65" },
};

export function FoodIllustration({
  mealId,
  mealType,
  size = "md",
}: {
  mealId: string;
  mealType: string;
  size?: "sm" | "md" | "lg";
}) {
  const visual = FOOD_VISUALS[mealId] || MEAL_TYPE_FALLBACK[mealType] || MEAL_TYPE_FALLBACK.lunch_dinner;

  const sizeClasses = {
    sm: "h-12 w-12 text-xl",
    md: "h-20 w-20 text-3xl",
    lg: "h-32 w-32 text-5xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden`}
      style={{ backgroundColor: visual.bg }}
    >
      <div
        className="absolute inset-0 opacity-20 rounded-2xl"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${visual.accent}, transparent 70%)`,
        }}
      />
      <span className="relative" role="img" aria-hidden="true">
        {visual.emoji}
      </span>
    </div>
  );
}

export function FoodHeroBanner({
  mealId,
  mealType,
}: {
  mealId: string;
  mealType: string;
}) {
  const visual = FOOD_VISUALS[mealId] || MEAL_TYPE_FALLBACK[mealType] || MEAL_TYPE_FALLBACK.lunch_dinner;

  return (
    <div
      className="w-full h-40 rounded-2xl flex items-center justify-center relative overflow-hidden mb-6"
      style={{ backgroundColor: visual.bg }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 60% 40%, ${visual.accent}, transparent 70%)`,
        }}
      />
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-15"
        style={{ backgroundColor: visual.accent }}
      />
      <div
        className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10"
        style={{ backgroundColor: visual.accent }}
      />
      <span className="relative text-7xl" role="img" aria-hidden="true">
        {visual.emoji}
      </span>
    </div>
  );
}
