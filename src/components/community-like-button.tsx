"use client";

import { useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleLike } from "@/lib/actions/community";
import { cn } from "@/lib/utils";

export function CommunityLikeButton({
  postId,
  likesCount,
  isLiked,
}: {
  postId: string;
  likesCount: number;
  isLiked: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => toggleLike(postId))}
      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
    >
      <Heart
        className={cn(
          "h-3.5 w-3.5",
          isLiked && "fill-primary text-primary"
        )}
      />
      {likesCount}
    </button>
  );
}
