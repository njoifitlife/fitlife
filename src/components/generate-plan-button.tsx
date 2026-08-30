"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generatePlan } from "@/lib/actions/plan";
import { Loader2 } from "lucide-react";

export function GeneratePlanButton() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    const result = await generatePlan();
    if (result?.error) {
      setError(result.error);
      setGenerating(false);
    }
  }

  return (
    <div>
      <Button
        size="lg"
        className="w-full"
        onClick={handleGenerate}
        disabled={generating}
      >
        {generating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Building your plan...
          </>
        ) : (
          "Generate my plan"
        )}
      </Button>
      {error && (
        <p className="text-sm text-destructive mt-3 text-center">{error}</p>
      )}
    </div>
  );
}
