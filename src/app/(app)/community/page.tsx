"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Send, Sparkles, Trophy, TrendingUp } from "lucide-react";
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

const PLACEHOLDER_POSTS = [
  {
    id: "1",
    name: "Sarah M.",
    type: "milestone" as PostType,
    content: "Just completed my first 7-Day Movement Kickstart challenge! Feeling so accomplished. This is the longest I've stuck with a fitness program.",
    time: "2 hours ago",
    likes: 12,
  },
  {
    id: "2",
    name: "Lisa K.",
    type: "motivation" as PostType,
    content: "Reminder: you don't have to be great to start, but you have to start to be great. Here's to showing up for ourselves!",
    time: "4 hours ago",
    likes: 24,
  },
  {
    id: "3",
    name: "Jennifer R.",
    type: "progress" as PostType,
    content: "Week 3 of my personalized plan and I just did my first full push-up from the floor! Started with wall push-ups 3 weeks ago. The progression works!",
    time: "6 hours ago",
    likes: 31,
  },
  {
    id: "4",
    name: "Maria C.",
    type: "question" as PostType,
    content: "Has anyone tried the 30-min Low-Impact Strength workout? How does it compare to the beginner full body one?",
    time: "8 hours ago",
    likes: 5,
  },
  {
    id: "5",
    name: "Angela T.",
    type: "milestone" as PostType,
    content: "14-day streak!! I've never been this consistent. The short 10-minute workouts on busy days make all the difference.",
    time: "1 day ago",
    likes: 18,
  },
];

const TYPE_ICONS: Record<PostType, typeof Sparkles> = {
  motivation: Sparkles,
  milestone: Trophy,
  progress: TrendingUp,
  question: MessageCircle,
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<PostType | "all">("all");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const quote =
    MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];

  const filteredPosts =
    activeTab === "all"
      ? PLACEHOLDER_POSTS
      : PLACEHOLDER_POSTS.filter((p) => p.type === activeTab);

  const toggleLike = (postId: string) => {
    const next = new Set(likedPosts);
    if (next.has(postId)) {
      next.delete(postId);
    } else {
      next.add(postId);
    }
    setLikedPosts(next);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Community</h1>
        <p className="text-muted-foreground text-sm">
          Share your journey, celebrate wins, and support each other
        </p>
      </div>

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

      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
              Y
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Share a win, milestone, or question...
              </p>
            </div>
            <Button size="sm" variant="outline">
              <Send className="h-3.5 w-3.5 mr-1" />
              Post
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {POST_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              activeTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredPosts.map((post) => {
          const Icon = TYPE_ICONS[post.type];
          return (
            <Card key={post.id}>
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-bold shrink-0">
                    {post.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{post.name}</span>
                      <Icon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {post.time}
                      </span>
                    </div>
                    <p className="text-sm mt-1.5">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Heart
                          className={cn(
                            "h-3.5 w-3.5",
                            likedPosts.has(post.id) &&
                              "fill-primary text-primary"
                          )}
                        />
                        {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                      </button>
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <MessageCircle className="h-3.5 w-3.5" />
                        Reply
                      </button>
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
