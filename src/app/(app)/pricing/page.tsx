import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { PRICING_TIERS } from "@/lib/stripe";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">
          Choose your plan
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          All plans include a personalized workout program built from your
          assessment. Cancel anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {PRICING_TIERS.map((tier) => (
          <Card
            key={tier.id}
            className={cn(
              "relative",
              tier.popular && "border-primary shadow-md"
            )}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most popular
                </span>
              </div>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg">{tier.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">
                  ${tier.price}
                </span>
                <span className="text-muted-foreground">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button
                  className="w-full"
                  variant={tier.popular ? "default" : "outline"}
                >
                  Get started
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8 max-w-lg mx-auto">
        NjoiFitLife provides general fitness and nutrition information and is not
        medical care. Consult a healthcare professional before beginning any
        exercise program.
      </p>
    </div>
  );
}
