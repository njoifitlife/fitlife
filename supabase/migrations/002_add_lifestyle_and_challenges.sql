-- Add new lifestyle fields to assessments
ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS number_of_kids integer,
  ADD COLUMN IF NOT EXISTS stress_level text CHECK (stress_level IN ('low', 'moderate', 'high')),
  ADD COLUMN IF NOT EXISTS sleep_quality text CHECK (sleep_quality IN ('poor', 'fair', 'good', 'excellent')),
  ADD COLUMN IF NOT EXISTS goal_weight_lbs numeric,
  ADD COLUMN IF NOT EXISTS postpartum boolean DEFAULT false;

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  duration_days integer NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  daily_tasks jsonb NOT NULL DEFAULT '[]',
  reward_badge text NOT NULL DEFAULT '',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User challenge enrollments
CREATE TABLE IF NOT EXISTS challenge_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  current_day integer DEFAULT 1,
  UNIQUE(user_id, challenge_id)
);

-- Challenge day completions
CREATE TABLE IF NOT EXISTS challenge_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES challenge_enrollments(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(enrollment_id, day_number)
);

-- Community posts (motivation wall)
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_type text NOT NULL CHECK (post_type IN ('motivation', 'milestone', 'progress', 'question')),
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Community post likes
CREATE TABLE IF NOT EXISTS community_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- RLS policies
ALTER TABLE challenge_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments"
  ON challenge_enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrollments"
  ON challenge_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments"
  ON challenge_enrollments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own completions"
  ON challenge_completions FOR SELECT
  USING (enrollment_id IN (
    SELECT id FROM challenge_enrollments WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own completions"
  ON challenge_completions FOR INSERT
  WITH CHECK (enrollment_id IN (
    SELECT id FROM challenge_enrollments WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view all community posts"
  ON community_posts FOR SELECT
  USING (true);

CREATE POLICY "Users can create own posts"
  ON community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON community_posts FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view all likes"
  ON community_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own likes"
  ON community_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own likes"
  ON community_likes FOR DELETE
  USING (auth.uid() = user_id);
