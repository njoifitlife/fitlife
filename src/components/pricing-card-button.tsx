"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/lib/actions/checkout";
import type { PlanChoice } from "@/lib/types";

export function PricingCardButton({
  plan,
  variant = "default",
}: {
  plan: PlanChoice;
  variant?: "default" | "outline";
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className="w-full"
      variant={variant}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await createCheckoutSession(plan);
        })
      }
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : null}
      Get started
    </Button>
  );
}
