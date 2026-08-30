"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function enrollInChallenge(challengeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("challenge_enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("challenge_id", challengeId)
    .single();

  if (existing) return { alreadyEnrolled: true };

  const { error } = await supabase.from("challenge_enrollments").insert({
    user_id: user.id,
    challenge_id: challengeId,
  });

  if (error) return { error: error.message };

  revalidatePath(`/challenges/${challengeId}`);
}

export async function toggleChallengeDay(
  enrollmentId: string,
  dayNumber: number,
  challengeId: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("challenge_completions")
    .select("id")
    .eq("enrollment_id", enrollmentId)
    .eq("day_number", dayNumber)
    .single();

  if (existing) {
    await supabase
      .from("challenge_completions")
      .delete()
      .eq("id", existing.id);
  } else {
    await supabase.from("challenge_completions").insert({
      enrollment_id: enrollmentId,
      day_number: dayNumber,
    });
  }

  revalidatePath(`/challenges/${challengeId}`);
}
