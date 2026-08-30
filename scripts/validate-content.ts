import { promises as fs } from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

const VALID_MOVEMENT_PATTERNS = [
  "push",
  "pull",
  "squat",
  "hinge",
  "core",
  "balance_functional",
  "mobility",
];
const VALID_DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const VALID_MEAL_TYPES = ["breakfast", "lunch_dinner", "snack"];

interface ValidationError {
  file: string;
  id: string;
  field: string;
  message: string;
}

async function validateExercises(): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];
  const exerciseDir = path.join(CONTENT_DIR, "exercises");
  const files = [
    "push.json",
    "pull.json",
    "squat.json",
    "hinge.json",
    "core.json",
    "balance_functional.json",
    "mobility.json",
  ];

  const allIds = new Set<string>();

  for (const file of files) {
    const content = await fs.readFile(path.join(exerciseDir, file), "utf-8");
    const exercises = JSON.parse(content);

    for (const ex of exercises) {
      if (allIds.has(ex.id)) {
        errors.push({ file, id: ex.id, field: "id", message: "Duplicate exercise ID" });
      }
      allIds.add(ex.id);

      if (!ex.name) errors.push({ file, id: ex.id, field: "name", message: "Missing name" });
      if (!VALID_MOVEMENT_PATTERNS.includes(ex.movement_pattern)) {
        errors.push({ file, id: ex.id, field: "movement_pattern", message: `Invalid: ${ex.movement_pattern}` });
      }
      if (!Array.isArray(ex.muscle_groups) || ex.muscle_groups.length === 0) {
        errors.push({ file, id: ex.id, field: "muscle_groups", message: "Must have at least one muscle group" });
      }
      if (!Array.isArray(ex.equipment)) {
        errors.push({ file, id: ex.id, field: "equipment", message: "Must be an array" });
      }
      if (!VALID_DIFFICULTIES.includes(ex.difficulty)) {
        errors.push({ file, id: ex.id, field: "difficulty", message: `Invalid: ${ex.difficulty}` });
      }
      if (!ex.default_sets || ex.default_sets < 1) {
        errors.push({ file, id: ex.id, field: "default_sets", message: "Must be >= 1" });
      }
      if (!ex.default_reps) errors.push({ file, id: ex.id, field: "default_reps", message: "Missing" });
      if (!ex.instructions) errors.push({ file, id: ex.id, field: "instructions", message: "Missing" });
      if (!ex.coaching_cue) errors.push({ file, id: ex.id, field: "coaching_cue", message: "Missing" });
      if (!ex.modification) errors.push({ file, id: ex.id, field: "modification", message: "Missing" });
      if (!ex.low_impact_alternative) errors.push({ file, id: ex.id, field: "low_impact_alternative", message: "Missing" });
      if (typeof ex.beginner_appropriate_as_standard !== "boolean") {
        errors.push({ file, id: ex.id, field: "beginner_appropriate_as_standard", message: "Must be boolean" });
      }
    }
  }

  console.log(`Validated ${allIds.size} exercises`);
  return errors;
}

async function validateMeals(): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];
  const mealDir = path.join(CONTENT_DIR, "meals");
  const files = ["breakfast.json", "lunch_dinner.json", "snacks.json"];

  const allIds = new Set<string>();
  const allMealIds: string[] = [];

  for (const file of files) {
    const content = await fs.readFile(path.join(mealDir, file), "utf-8");
    const meals = JSON.parse(content);

    for (const meal of meals) {
      if (allIds.has(meal.id)) {
        errors.push({ file, id: meal.id, field: "id", message: "Duplicate meal ID" });
      }
      allIds.add(meal.id);
      allMealIds.push(meal.id);

      if (!meal.name) errors.push({ file, id: meal.id, field: "name", message: "Missing name" });
      if (!VALID_MEAL_TYPES.includes(meal.meal_type)) {
        errors.push({ file, id: meal.id, field: "meal_type", message: `Invalid: ${meal.meal_type}` });
      }
      if (!Array.isArray(meal.dietary_tags)) {
        errors.push({ file, id: meal.id, field: "dietary_tags", message: "Must be an array" });
      }
      if (!Array.isArray(meal.allergen_tags)) {
        errors.push({ file, id: meal.id, field: "allergen_tags", message: "Must be an array" });
      }
      if (!Array.isArray(meal.ingredients) || meal.ingredients.length === 0) {
        errors.push({ file, id: meal.id, field: "ingredients", message: "Must have at least one ingredient" });
      }
      if (!Array.isArray(meal.prep_steps) || meal.prep_steps.length === 0) {
        errors.push({ file, id: meal.id, field: "prep_steps", message: "Must have at least one step" });
      }
      if (!Array.isArray(meal.substitute_meal_ids)) {
        errors.push({ file, id: meal.id, field: "substitute_meal_ids", message: "Must be an array" });
      }
    }
  }

  for (const file of files) {
    const content = await fs.readFile(path.join(mealDir, file), "utf-8");
    const meals = JSON.parse(content);
    for (const meal of meals) {
      for (const subId of meal.substitute_meal_ids || []) {
        if (!allIds.has(subId)) {
          errors.push({ file, id: meal.id, field: "substitute_meal_ids", message: `References unknown meal: ${subId}` });
        }
      }
    }
  }

  console.log(`Validated ${allIds.size} meals`);
  return errors;
}

async function validateArticles(): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];
  const filePath = path.join(CONTENT_DIR, "bone-health", "articles.json");
  const content = await fs.readFile(filePath, "utf-8");
  const articles = JSON.parse(content);

  const allIds = new Set<string>();
  const orders = new Set<number>();

  for (const article of articles) {
    if (allIds.has(article.id)) {
      errors.push({ file: "articles.json", id: article.id, field: "id", message: "Duplicate article ID" });
    }
    allIds.add(article.id);

    if (!article.title) errors.push({ file: "articles.json", id: article.id, field: "title", message: "Missing" });
    if (!article.slug) errors.push({ file: "articles.json", id: article.id, field: "slug", message: "Missing" });
    if (!article.content || article.content.length < 100) {
      errors.push({ file: "articles.json", id: article.id, field: "content", message: "Content too short (< 100 chars)" });
    }
    if (orders.has(article.order)) {
      errors.push({ file: "articles.json", id: article.id, field: "order", message: `Duplicate order: ${article.order}` });
    }
    orders.add(article.order);
  }

  console.log(`Validated ${allIds.size} bone health articles`);
  return errors;
}

async function main() {
  console.log("Validating content files...\n");

  const exerciseErrors = await validateExercises();
  const mealErrors = await validateMeals();
  const articleErrors = await validateArticles();

  const allErrors = [...exerciseErrors, ...mealErrors, ...articleErrors];

  if (allErrors.length === 0) {
    console.log("\nAll content valid!");
  } else {
    console.log(`\n${allErrors.length} errors found:\n`);
    for (const err of allErrors) {
      console.log(`  [${err.file}] ${err.id}.${err.field}: ${err.message}`);
    }
    process.exit(1);
  }
}

main().catch(console.error);
