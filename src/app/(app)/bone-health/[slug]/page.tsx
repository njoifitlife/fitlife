import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getBoneHealthArticleBySlug, getBoneHealthArticles } from "@/lib/content";

export async function generateStaticParams() {
  const articles = await getBoneHealthArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function BoneHealthArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getBoneHealthArticleBySlug(slug);
  if (!article) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link
        href="/bone-health"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Bone Health Hub
      </Link>

      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>

      <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
        {article.content}
      </div>
    </div>
  );
}
