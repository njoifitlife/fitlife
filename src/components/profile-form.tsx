"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateDisplayName } from "@/lib/actions/profile";
import { Loader2 } from "lucide-react";

export function ProfileForm({ currentName }: { currentName: string }) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateDisplayName(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSaved(true);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <div>
        <Label htmlFor="display_name">Display name</Label>
        <Input
          id="display_name"
          name="display_name"
          defaultValue={currentName}
          maxLength={30}
          required
          className="mt-1"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save"
          )}
        </Button>
        {saved && (
          <span className="text-xs text-primary">Saved!</span>
        )}
        {error && (
          <span className="text-xs text-destructive">{error}</span>
        )}
      </div>
    </form>
  );
}
