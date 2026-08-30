import type { SupabaseClient } from "@supabase/supabase-js";

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

export async function hasActiveMembership(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", userId)
    .in("status", Array.from(ACTIVE_STATUSES))
    .limit(1)
    .single();

  return !!data;
}

export async function getSubscription(
  supabase: SupabaseClient,
  userId: string
) {
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return data;
}
