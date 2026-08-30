import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function BoneHealthPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-warning/10 flex items-center justify-center text-warning mb-3">
            <Heart className="h-7 w-7" />
          </div>
          <CardTitle>Bone Health Hub</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Articles and resources to support your bone health through strength
            training and nutrition will appear here. Available on Complete and
            Coaching plans.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
