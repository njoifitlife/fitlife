import { promises as fs } from "fs";
import path from "path";
import type { Exercise, Meal, BoneHealthArticle } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

let exerciseCache: Exercise[] | null = null;
let mealCache: Meal[] | null = null;
let articleCache: BoneHealthArticle[] | null = null;

export async function getAllExercises(): Promise<Exercise[]> {
  if (exerciseCache) return exerciseCache;

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

  const exercises: Exercise[] = [];
  for (const file of files) {
    const content = await fs.readFile(path.join(exerciseDir, file), "utf-8");
    exercises.push(...JSON.parse(content));
  }

  exerciseCache = exercises;
  return exercises;
}

export async function getExerciseById(
  id: string
): Promise<Exercise | undefined> {
  const exercises = await getAllExercises();
  return exercises.find((e) => e.id === id);
}

export async function getExercisesByPattern(
  pattern: string
): Promise<Exercise[]> {
  const exercises = await getAllExercises();
  return exercises.filter((e) => e.movement_pattern === pattern);
}

export async function getExercisesByEquipment(
  available: string[]
): Promise<Exercise[]> {
  const exercises = await getAllExercises();
  return exercises.filter((e) =>
    e.equipment.every((eq) => available.includes(eq) || eq === "")
  );
}

export async function getAllMeals(): Promise<Meal[]> {
  if (mealCache) return mealCache;

  const mealDir = path.join(CONTENT_DIR, "meals");
  const files = ["breakfast.json", "lunch_dinner.json", "snacks.json"];

  const meals: Meal[] = [];
  for (const file of files) {
    const content = await fs.readFile(path.join(mealDir, file), "utf-8");
    meals.push(...JSON.parse(content));
  }

  mealCache = meals;
  return meals;
}

export async function getMealById(id: string): Promise<Meal | undefined> {
  const meals = await getAllMeals();
  return meals.find((m) => m.id === id);
}

export async function getMealsByType(
  type: "breakfast" | "lunch_dinner" | "snack"
): Promise<Meal[]> {
  const meals = await getAllMeals();
  return meals.filter((m) => m.meal_type === type);
}

export async function getMealsForDietaryTags(tags: string[]): Promise<Meal[]> {
  const meals = await getAllMeals();
  return meals.filter((m) => tags.every((tag) => m.dietary_tags.includes(tag)));
}

export async function getMealsExcludingAllergens(
  allergens: string[]
): Promise<Meal[]> {
  const meals = await getAllMeals();
  return meals.filter(
    (m) => !m.allergen_tags.some((a) => allergens.includes(a))
  );
}

export async function getBoneHealthArticles(): Promise<BoneHealthArticle[]> {
  if (articleCache) return articleCache;

  const filePath = path.join(CONTENT_DIR, "bone-health", "articles.json");
  const content = await fs.readFile(filePath, "utf-8");
  const articles: BoneHealthArticle[] = JSON.parse(content);
  articles.sort((a, b) => a.order - b.order);

  articleCache = articles;
  return articles;
}

export async function getBoneHealthArticleBySlug(
  slug: string
): Promise<BoneHealthArticle | undefined> {
  const articles = await getBoneHealthArticles();
  return articles.find((a) => a.slug === slug);
}
