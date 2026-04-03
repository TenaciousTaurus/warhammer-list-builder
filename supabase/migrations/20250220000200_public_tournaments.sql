-- Add is_public column to tournaments for public browsing
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;

-- Index for public tournament queries
CREATE INDEX IF NOT EXISTS idx_tournaments_public
  ON tournaments (is_public, status)
  WHERE is_public = true;

-- Allow anyone authenticated to browse public tournaments
CREATE POLICY "Anyone can view public tournaments"
  ON tournaments FOR SELECT
  TO authenticated
  USING (is_public = true);
