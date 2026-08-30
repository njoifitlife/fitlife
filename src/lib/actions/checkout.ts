"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { stripe, PRICING_TIERS } from "@/lib/stripe";
import type { SubscriptionTier } from "@/lib/types";

export async function createCheckoutSession(tierId: SubscriptionTier) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const tier = PRICING_TIERS.find((t) => t.id === tierId);
  if (!tier || !tier.stripe_price_id) {
    return { error: "This plan is not available yet." };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from("users")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: tier.stripe_price_id, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?checkout=success`,
    cancel_url: `${baseUrl}/pricing`,
    metadata: { supabase_user_id: user.id, tier: tierId },
  });

  if (session.url) {
    redirect(session.url);
  }

  return { error: "Failed to create checkout session." };
}

export async function createBillingPortalSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return { error: "No subscription found." };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${baseUrl}/settings`,
  });

  redirect(session.url);
}
