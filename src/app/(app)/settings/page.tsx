import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, CreditCard, LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { ProfileForm } from "@/components/profile-form";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";
import { getSubscription } from "@/lib/entitlement";
import Link from "next/link";

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("display_name, email, stripe_customer_id")
    .eq("id", user.id)
    .single();

  const subscription = await getSubscription(supabase, user.id);

  const isActive = subscription && ACTIVE_STATUSES.has(subscription.status);
  const hasStripeCustomer = !!profile?.stripe_customer_id;

  const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID || "";
  const billingLabel =
    subscription?.stripe_price_id === monthlyPriceId ? "Monthly" : "Annual";

  const periodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

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

      {/* Membership */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            Membership
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isActive ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    NjoiFitLife Membership
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {billingLabel} &middot; Active
                  </p>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  Active
                </span>
              </div>
              {subscription.cancel_at_period_end && periodEnd && (
                <p className="text-xs text-muted-foreground">
                  Cancels at end of period ({periodEnd})
                </p>
              )}
              {!subscription.cancel_at_period_end && periodEnd && (
                <p className="text-xs text-muted-foreground">
                  Renews {periodEnd}
                </p>
              )}
              {hasStripeCustomer && <ManageSubscriptionButton />}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">No active membership</p>
                <p className="text-xs text-muted-foreground">
                  Subscribe to unlock your full experience
                </p>
              </div>
              <Link href="/pricing">
                <Button size="sm">Subscribe</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card>
        <CardContent className="py-4">
          <form action={signOut}>
            <Button variant="outline" className="w-full" type="submit">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
