-- Fix overly permissive SELECT policy on users table.
-- The "Users can read display names" policy used USING (true) which exposed
-- all columns (email, is_admin, stripe_customer_id) to every authenticated user.

DROP POLICY IF EXISTS "Users can read display names" ON public.users;

-- Create a view for public profile data (display_name only)
CREATE OR REPLACE VIEW public.user_profiles AS
  SELECT id, display_name FROM public.users;

GRANT SELECT ON public.user_profiles TO authenticated;

-- Admin RPC for reading subscriptions (Priority 5)
CREATE OR REPLACE FUNCTION get_admin_subscriptions()
RETURNS TABLE (
  user_id uuid,
  status text,
  stripe_price_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean,
  created_at timestamptz
) AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
    SELECT s.user_id, s.status, s.stripe_price_id,
           s.current_period_end, s.cancel_at_period_end, s.created_at
    FROM public.subscriptions s;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Admin RPC for reading user list
CREATE OR REPLACE FUNCTION get_admin_users()
RETURNS TABLE (
  id uuid,
  email text,
  display_name text,
  created_at timestamptz
) AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users WHERE users.id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
    SELECT u.id, u.email, u.display_name, u.created_at
    FROM public.users u
    ORDER BY u.created_at DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix like RPCs: add auth check and recount from community_likes
-- instead of blind increment/decrement to prevent count manipulation
CREATE OR REPLACE FUNCTION increment_likes(row_id uuid)
RETURNS void AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  UPDATE community_posts
    SET likes_count = (SELECT count(*) FROM community_likes WHERE post_id = row_id)
    WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION decrement_likes(row_id uuid)
RETURNS void AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  UPDATE community_posts
    SET likes_count = (SELECT count(*) FROM community_likes WHERE post_id = row_id)
    WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
