-- Like count helper RPCs
CREATE OR REPLACE FUNCTION increment_likes(row_id uuid)
RETURNS void AS $$
  UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = row_id;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_likes(row_id uuid)
RETURNS void AS $$
  UPDATE community_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = row_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Add display_name to users for community
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS display_name text;

CREATE POLICY "Users can read display names"
  ON public.users FOR SELECT
  USING (true);
