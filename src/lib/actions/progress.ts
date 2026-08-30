"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function logWeight(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const value = parseFloat(formData.get("weight") as string);
  if (isNaN(value) || value < 50 || value > 600) {
    return { error: "Please enter a valid weight." };
  }

  const { error } = await supabase.from("progress_entries").insert({
    user_id: user.id,
    entry_type: "weight",
    label: "Weight",
    value,
    unit: "lbs",
  });

  if (error) return { error: error.message };

  revalidatePath("/progress");
}
