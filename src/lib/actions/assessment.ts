"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getOrCreateAssessment() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", user.id)
    .is("completed_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (existing) return existing;

  const { data: created, error } = await supabase
    .from("assessments")
    .insert({ user_id: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return created;
}

export async function saveAssessmentSection(
  assessmentId: string,
  section: number,
  data: Record<string, unknown>
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("assessments")
    .update({
      ...data,
      current_section: section + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", assessmentId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function completeAssessment(assessmentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("assessments")
    .update({
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", assessmentId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  redirect("/safety-acknowledgment");
}
