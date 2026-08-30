"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const content = (formData.get("content") as string)?.trim();
  const postType = (formData.get("post_type") as string) || "motivation";

  if (!content || content.length < 3) {
    return { error: "Please write something to share." };
  }
  if (content.length > 500) {
    return { error: "Posts must be 500 characters or less." };
  }

  const { error } = await supabase.from("community_posts").insert({
    user_id: user.id,
    post_type: postType,
    content,
  });

  if (error) return { error: error.message };

  revalidatePath("/community");
}

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("community_likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .single();

  if (existing) {
    await supabase.from("community_likes").delete().eq("id", existing.id);
    await supabase.rpc("decrement_likes", { row_id: postId });
  } else {
    await supabase
      .from("community_likes")
      .insert({ user_id: user.id, post_id: postId });
    await supabase.rpc("increment_likes", { row_id: postId });
  }

  revalidatePath("/community");
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("community_posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);

  revalidatePath("/community");
}
