import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

export default function WorkoutsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
            <Dumbbell className="h-7 w-7" />
          </div>
          <CardTitle>Your Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Your personalized workout plan will appear here once your plan is
            generated.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
