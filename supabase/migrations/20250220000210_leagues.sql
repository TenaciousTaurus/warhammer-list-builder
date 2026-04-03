-- Simple leagues: groups of tournaments forming a season/series
CREATE TABLE leagues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  is_public boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  share_code text UNIQUE NOT NULL DEFAULT substring(md5(random()::text), 1, 8),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Junction table linking tournaments to leagues
CREATE TABLE league_tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id uuid NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  tournament_id uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  added_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(league_id, tournament_id)
);

-- Indexes
CREATE INDEX idx_leagues_owner ON leagues (owner_id);
CREATE INDEX idx_leagues_public ON leagues (is_public, status) WHERE is_public = true;
CREATE INDEX idx_league_tournaments_league ON league_tournaments (league_id);
CREATE INDEX idx_league_tournaments_tournament ON league_tournaments (tournament_id);

-- Auto-update updated_at
CREATE TRIGGER leagues_updated_at
  BEFORE UPDATE ON leagues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- RLS
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_tournaments ENABLE ROW LEVEL SECURITY;

-- Leagues: owner CRUD
CREATE POLICY "Owner can manage own leagues"
  ON leagues FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Leagues: public read
CREATE POLICY "Anyone can view public leagues"
  ON leagues FOR SELECT
  TO authenticated
  USING (is_public = true);

-- League tournaments: visible if league is visible
CREATE POLICY "League tournaments readable if league accessible"
  ON league_tournaments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leagues
      WHERE leagues.id = league_tournaments.league_id
        AND (leagues.owner_id = auth.uid() OR leagues.is_public = true)
    )
  );

-- League tournaments: owner of league can manage
CREATE POLICY "League owner can manage league tournaments"
  ON league_tournaments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leagues
      WHERE leagues.id = league_tournaments.league_id
        AND leagues.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leagues
      WHERE leagues.id = league_tournaments.league_id
        AND leagues.owner_id = auth.uid()
    )
  );
