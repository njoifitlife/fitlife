import { Card, CardContent } from "@/components/ui/card";
import { Bone, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { getBoneHealthArticles } from "@/lib/content";

export default async function BoneHealthPage() {
  const articles = await getBoneHealthArticles();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-3">
          <Bone className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold">Bone Health Hub</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Learn how your plan supports strength and healthy aging
        </p>
      </div>

      <div className="space-y-3">
        {articles.map((article) => (
          <Link key={article.id} href={`/bone-health/${article.slug}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-3 py-4">
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{article.title}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
