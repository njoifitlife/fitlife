"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { generateFullPlan } from "@/lib/plan-generation/pipeline";

export async function generatePlan() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existingPlan } = await supabase
    .from("fitness_plans")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (existingPlan) {
    redirect("/dashboard");
  }

  const { data: assessment } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", user.id)
    .not("completed_at", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!assessment) {
    redirect("/assessment");
  }

  const result = await generateFullPlan(supabase, user.id, assessment);

  if (result.error) {
    return { error: result.error };
  }

  if (result.nutritionSkipped) {
    redirect("/dashboard?notice=nutrition_skipped");
  }

  redirect("/dashboard");
}
