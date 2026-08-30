"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/lib/actions/checkout";
import type { SubscriptionTier } from "@/lib/types";

export function PricingCardButton({
  tierId,
  popular,
  hasPrice,
}: {
  tierId: SubscriptionTier;
  popular?: boolean;
  hasPrice: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  if (!hasPrice) {
    return (
      <Button className="w-full" variant={popular ? "default" : "outline"} disabled>
        Coming soon
      </Button>
    );
  }

  return (
    <Button
      className="w-full"
      variant={popular ? "default" : "outline"}
      disabled={isPending}
      onClick={() => startTransition(async () => { await createCheckoutSession(tierId); })}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : null}
      Get started
    </Button>
  );
}
