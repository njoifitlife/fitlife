"use client";

import { useState, useTransition, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { createPost } from "@/lib/actions/community";
import { cn } from "@/lib/utils";

const POST_TYPES = [
  { value: "motivation", label: "Motivation" },
  { value: "milestone", label: "Milestone" },
  { value: "progress", label: "Progress" },
  { value: "question", label: "Question" },
] as const;

export function CommunityPostForm({ userInitial }: { userInitial: string }) {
  const [postType, setPostType] = useState("motivation");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("post_type", postType);
    startTransition(async () => {
      const result = await createPost(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  return (
    <Card className="mb-6">
      <CardContent className="py-4">
        <form ref={formRef} action={handleSubmit}>
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
              {userInitial}
            </div>
            <div className="flex-1">
              <textarea
                name="content"
                placeholder="Share a win, milestone, or question..."
                rows={2}
                maxLength={500}
                required
                className="w-full text-sm resize-none bg-transparent border-0 outline-none placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t">
            <div className="flex gap-1.5">
              {POST_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setPostType(t.value)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors",
                    postType === t.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <Send className="h-3.5 w-3.5 mr-1" />
                  Post
                </>
              )}
            </Button>
          </div>
          {error && (
            <p className="text-xs text-destructive mt-2">{error}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
