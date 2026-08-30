import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, CreditCard, LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { ProfileForm } from "@/components/profile-form";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";
import Link from "next/link";

const TIER_LABELS: Record<string, string> = {
  free: "Free",
  essential: "Essential",
  complete: "Complete",
  coaching: "Coaching",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("display_name, email, subscription_tier, subscription_status, stripe_customer_id")
    .eq("id", user.id)
    .single();

  const tier = profile?.subscription_tier || "free";
  const hasStripe = !!profile?.stripe_customer_id;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{profile?.email}</p>
          </div>
          <ProfileForm currentName={profile?.display_name || ""} />
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {TIER_LABELS[tier]} Plan
              </p>
              <p className="text-xs text-muted-foreground">
                {profile?.subscription_status === "active"
                  ? "Active"
                  : tier === "free"
                    ? "No active subscription"
                    : profile?.subscription_status || "Inactive"}
              </p>
            </div>
            {hasStripe ? (
              <ManageSubscriptionButton />
            ) : (
              <Link href="/pricing">
                <Button size="sm">Upgrade</Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card>
        <CardContent className="py-4">
          <form action={signOut}>
            <Button
              variant="outline"
              className="w-full"
              type="submit"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
