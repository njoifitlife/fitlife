import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Trophy, TrendingUp, MessageCircle } from "lucide-react";
import { CommunityPostForm } from "@/components/community-post-form";
import { CommunityLikeButton } from "@/components/community-like-button";
import { cn } from "@/lib/utils";

const MOTIVATION_QUOTES = [
  "Strong is the new beautiful. You're building strength that lasts a lifetime.",
  "Every rep counts. Every workout matters. You're investing in your future self.",
  "Progress, not perfection. You showed up today — that's what matters.",
  "Your body is capable of incredible things. Trust the process.",
  "Consistency builds confidence. Keep going, one day at a time.",
];

type PostType = "motivation" | "milestone" | "progress" | "question";

const POST_TABS: { label: string; value: PostType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Motivation", value: "motivation" },
  { label: "Milestones", value: "milestone" },
  { label: "Progress", value: "progress" },
  { label: "Questions", value: "question" },
];

const TYPE_ICONS: Record<PostType, typeof Sparkles> = {
  motivation: Sparkles,
  milestone: Trophy,
  progress: TrendingUp,
  question: MessageCircle,
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("display_name, email")
    .eq("id", user.id)
    .single();

  const userInitial = (
    profile?.display_name?.[0] ||
    profile?.email?.[0] ||
    "Y"
  ).toUpperCase();

  let query = supabase
    .from("community_posts")
    .select("*, users!inner(display_name, email)")
    .order("created_at", { ascending: false })
    .limit(30);

  const activeTab = filter || "all";
  if (activeTab !== "all") {
    query = query.eq("post_type", activeTab);
  }

  const { data: posts } = await query;

  const { data: userLikes } = await supabase
    .from("community_likes")
    .select("post_id")
    .eq("user_id", user.id);

  const likedPostIds = new Set((userLikes || []).map((l) => l.post_id));

  const quoteIndex =
    new Date().getDate() % MOTIVATION_QUOTES.length;
  const quote = MOTIVATION_QUOTES[quoteIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Community</h1>
        <p className="text-muted-foreground text-sm">
          Share your journey, celebrate wins, and support each other
        </p>
      </div>

      {/* Daily Motivation */}
      <Card className="mb-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
        <CardContent className="py-5">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
                Daily Motivation
              </p>
              <p className="text-sm font-medium text-foreground">{quote}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Post Composer */}
      <CommunityPostForm userInitial={userInitial} />

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {POST_TABS.map((tab) => (
          <a
            key={tab.value}
            href={tab.value === "all" ? "/community" : `/community?filter=${tab.value}`}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              activeTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-3">
        {(!posts || posts.length === 0) && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No posts yet. Be the first to share!
              </p>
            </CardContent>
          </Card>
        )}
        {(posts || []).map((post) => {
          const Icon = TYPE_ICONS[post.post_type as PostType] || Sparkles;
          const author = post.users as { display_name: string | null; email: string };
          const authorName =
            author.display_name ||
            author.email.split("@")[0].slice(0, 8) + ".";

          return (
            <Card key={post.id}>
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-bold shrink-0">
                    {authorName[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {authorName}
                      </span>
                      <Icon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(post.created_at)}
                      </span>
                    </div>
                    <p className="text-sm mt-1.5">{post.content}</p>
                    <div className="mt-3">
                      <CommunityLikeButton
                        postId={post.id}
                        likesCount={post.likes_count}
                        isLiked={likedPostIds.has(post.id)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
