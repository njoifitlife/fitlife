import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PricingCardButton } from "@/components/pricing-card-button";

const FEATURES = [
  "Personalized 4-week workout plan",
  "Exercise library with modifications",
  "7-day personalized meal suggestions",
  "Bone Health Hub",
  "Workout & progress tracking",
  "Community access",
  "Challenges & streaks",
];

export default function PricingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">NjoiFitLife Membership</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          One membership. Full access. Choose the billing that works for you.
          Cancel anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
        {/* Monthly */}
        <Card>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg">Monthly</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold text-foreground">$14.99</span>
              <span className="text-muted-foreground">/month</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <PricingCardButton plan="monthly" variant="outline" />
          </CardContent>
        </Card>

        {/* Annual — Best Value */}
        <Card className="relative border-primary shadow-md">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
              Best Value
            </span>
          </div>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg">Annual</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold text-foreground">$119</span>
              <span className="text-muted-foreground">/year</span>
              <span className="block text-xs text-primary mt-1">
                Save over $60 vs. monthly
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <PricingCardButton plan="annual" />
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8 max-w-lg mx-auto">
        NjoiFitLife provides general fitness and nutrition information and is not
        medical care. Consult a healthcare professional before beginning any
        exercise program.
      </p>
    </div>
  );
}
