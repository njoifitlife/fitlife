-- Challenges live in content JSON, not the database.
-- Update enrollments to reference content IDs (text) instead of UUID FK.

ALTER TABLE challenge_enrollments
  DROP CONSTRAINT IF EXISTS challenge_enrollments_challenge_id_fkey;

ALTER TABLE challenge_enrollments
  ALTER COLUMN challenge_id TYPE text USING challenge_id::text;

-- Drop the now-unused challenges DB table
DROP TABLE IF EXISTS challenges CASCADE;
