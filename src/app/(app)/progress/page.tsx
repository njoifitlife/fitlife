import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-success/10 flex items-center justify-center text-success mb-3">
            <TrendingUp className="h-7 w-7" />
          </div>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Track your workout streaks, measurements, and milestones here. Start
            completing workouts to see your progress.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
