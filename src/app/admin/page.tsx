import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/dashboard");

  const { data: users } = await supabase
    .from("users")
    .select("id, email, display_name, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const userIds = (users || []).map((u) => u.id);

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("user_id, status, stripe_price_id, current_period_end, cancel_at_period_end, created_at")
    .in("user_id", userIds.length > 0 ? userIds : ["__none__"]);

  const subByUser = new Map(
    (subscriptions || []).map((s) => [s.user_id, s])
  );

  const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID || "";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Admin</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Members ({users?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b">
                  <th className="pb-2 pr-4">Email</th>
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">Membership</th>
                  <th className="pb-2 pr-4">Plan</th>
                  <th className="pb-2 pr-4">Period End</th>
                  <th className="pb-2">Cancels</th>
                </tr>
              </thead>
              <tbody>
                {(users || []).map((u) => {
                  const sub = subByUser.get(u.id);
                  const billingLabel = sub
                    ? sub.stripe_price_id === monthlyPriceId
                      ? "Monthly"
                      : "Annual"
                    : "—";
                  const periodEnd = sub?.current_period_end
                    ? new Date(sub.current_period_end).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      )
                    : "—";

                  return (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 truncate max-w-[200px]">
                        {u.email}
                      </td>
                      <td className="py-2 pr-4">
                        {u.display_name || "—"}
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                            sub?.status === "active"
                              ? "bg-primary/10 text-primary"
                              : sub?.status === "canceled"
                                ? "bg-destructive/10 text-destructive"
                                : sub?.status === "past_due"
                                  ? "bg-accent/10 text-accent"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {sub?.status || "none"}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {billingLabel}
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {periodEnd}
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {sub?.cancel_at_period_end ? "Yes" : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
