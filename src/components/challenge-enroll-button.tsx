"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { enrollInChallenge } from "@/lib/actions/challenges";

export function ChallengeEnrollButton({
  challengeId,
}: {
  challengeId: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="lg"
      disabled={isPending}
      onClick={() => startTransition(async () => { await enrollInChallenge(challengeId); })}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : null}
      Join Challenge
    </Button>
  );
}
