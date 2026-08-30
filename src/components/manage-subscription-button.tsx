"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createBillingPortalSession } from "@/lib/actions/checkout";

export function ManageSubscriptionButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(async () => { await createBillingPortalSession(); })}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : null}
      Manage subscription
    </Button>
  );
}
