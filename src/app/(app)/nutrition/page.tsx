import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple } from "lucide-react";

export default function NutritionPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-3">
            <Apple className="h-7 w-7" />
          </div>
          <CardTitle>Nutrition Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Your personalized nutrition suggestions will appear here once your
            plan is generated. Available on Complete and Coaching plans.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
