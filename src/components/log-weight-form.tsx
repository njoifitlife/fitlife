"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logWeight } from "@/lib/actions/progress";
import { Loader2 } from "lucide-react";

export function LogWeightForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await logWeight(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1">
        <Input
          name="weight"
          type="number"
          step="0.1"
          placeholder="e.g. 155"
          required
          className="h-10"
        />
      </div>
      <span className="text-sm text-muted-foreground pb-2.5">lbs</span>
      <Button type="submit" size="sm" disabled={isPending} className="h-10">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log"}
      </Button>
      {error && (
        <p className="text-xs text-destructive ml-2 pb-2.5">{error}</p>
      )}
    </form>
  );
}
