import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-08-26.dahlia",
  typescript: true,
});

export function getStripePriceId(plan: "monthly" | "annual"): string {
  const id =
    plan === "monthly"
      ? process.env.STRIPE_MONTHLY_PRICE_ID
      : process.env.STRIPE_ANNUAL_PRICE_ID;

  if (!id) {
    throw new Error(`Missing Stripe price ID for ${plan} plan`);
  }
  return id;
}
