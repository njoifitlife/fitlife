"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SafetyAcknowledgmentPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleContinue() {
    if (!checked) return;
    setSaving(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    await supabase.from("safety_acknowledgments").upsert({
      user_id: user.id,
      acknowledged: true,
      acknowledged_at: new Date().toISOString(),
    });

    router.push("/dashboard");
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-warning/10 flex items-center justify-center text-warning mb-3">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <CardTitle>Before we build your plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted rounded-xl p-5 text-sm leading-relaxed text-foreground">
            <p>
              NjoiFitLife provides general fitness and nutrition information and
              is not medical care. If you have a health condition, injury,
              significant pain, or another concern that may affect exercise,
              consult an appropriate healthcare professional before beginning a
              new exercise program.
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">
              I understand and want to continue.
            </span>
          </label>

          <Button
            className="w-full"
            size="lg"
            disabled={!checked || saving}
            onClick={handleContinue}
          >
            {saving ? "Saving..." : "Continue to my plan"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
