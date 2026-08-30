import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function upsertSubscription(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return;
    const fallbackUserId = customer.metadata?.supabase_user_id;
    if (!fallbackUserId) return;
    return upsertWithUserId(subscription, customerId, fallbackUserId);
  }

  return upsertWithUserId(subscription, customerId, userId);
}

async function upsertWithUserId(
  subscription: Stripe.Subscription,
  customerId: string,
  userId: string
) {
  const priceId = subscription.items.data[0]?.price?.id || "";

  const firstItem = subscription.items.data[0];
  const periodStart = firstItem?.current_period_start;
  const periodEnd = firstItem?.current_period_end;

  const row = {
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    status: subscription.status,
    current_period_start: periodStart
      ? new Date(periodStart * 1000).toISOString()
      : null,
    current_period_end: periodEnd
      ? new Date(periodEnd * 1000).toISOString()
      : null,
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await supabaseAdmin
    .from("subscriptions")
    .select("id")
    .eq("stripe_subscription_id", subscription.id)
    .single();

  if (existing) {
    await supabaseAdmin
      .from("subscriptions")
      .update(row)
      .eq("id", existing.id);
  } else {
    await supabaseAdmin.from("subscriptions").insert({
      ...row,
      created_at: new Date().toISOString(),
    });
  }

  await supabaseAdmin
    .from("users")
    .update({ stripe_customer_id: customerId })
    .eq("id", userId);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === "subscription" && session.subscription) {
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        await upsertSubscription(subscription);
      }
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await upsertSubscription(subscription);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await upsertSubscription(subscription);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const invoiceSub = invoice.parent?.subscription_details?.subscription;
      if (invoiceSub) {
        const subscriptionId =
          typeof invoiceSub === "string" ? invoiceSub : invoiceSub.id;
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        await upsertSubscription(subscription);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
