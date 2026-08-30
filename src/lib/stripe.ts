import Stripe from "stripe";
import type { PricingTier } from "./types";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-08-26.dahlia",
  typescript: true,
});

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "essential",
    name: "Essential",
    price: 19.99,
    interval: "month",
    stripe_price_id: "", // Set after creating in Stripe Dashboard
    features: [
      "Personalized 4-week workout plan",
      "Exercise library with modifications",
      "Workout tracking & streaks",
      "Progress dashboard",
    ],
  },
  {
    id: "complete",
    name: "Complete",
    price: 34.99,
    interval: "month",
    stripe_price_id: "",
    popular: true,
    features: [
      "Everything in Essential",
      "Personalized nutrition plan",
      "7-day meal suggestions",
      "Bone Health Hub with plan cross-links",
      "Measurement tracking",
    ],
  },
  {
    id: "coaching",
    name: "Coaching",
    price: 49.99,
    interval: "month",
    stripe_price_id: "",
    features: [
      "Everything in Complete",
      "Priority plan updates",
      "Advanced progression tracking",
      "Early access to new features",
    ],
  },
];
