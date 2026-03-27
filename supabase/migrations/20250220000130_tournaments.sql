-- ============================================================
-- Phase 5: Tournament System
-- ============================================================

-- ============================================================
-- Tournaments
-- ============================================================

CREATE TABLE public.tournaments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  format text NOT NULL CHECK (format IN ('swiss', 'single_elimination', 'round_robin')) DEFAULT 'swiss',
  max_players integer NOT NULL DEFAULT 16,
  points_limit integer NOT NULL DEFAULT 2000,
  num_rounds integer NOT NULL DEFAULT 3,
  status text NOT NULL CHECK (status IN ('registration', 'active', 'completed', 'cancelled')) DEFAULT 'registration',
  share_code text UNIQUE NOT NULL DEFAULT substring(md5(random()::text), 1, 8),
  settings jsonb NOT NULL DEFAULT '{}',
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

-- Organizer full CRUD
CREATE POLICY "Organizer select own tournaments"
  ON public.tournaments FOR SELECT
  USING (auth.uid() = organizer_id);

CREATE POLICY "Organizer insert tournaments"
  ON public.tournaments FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizer update tournaments"
  ON public.tournaments FOR UPDATE
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizer delete tournaments"
  ON public.tournaments FOR DELETE
  USING (auth.uid() = organizer_id);

-- Participants can SELECT tournaments they're in
CREATE POLICY "Participants select tournaments"
  ON public.tournaments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tournament_participants tp
      WHERE tp.tournament_id = tournaments.id
      AND tp.user_id = auth.uid()
    )
  );

-- Anyone can SELECT by share_code (for joining)
CREATE POLICY "Public select by share code"
  ON public.tournaments FOR SELECT
  USING (share_code IS NOT NULL);

CREATE INDEX idx_tournaments_organizer ON public.tournaments (organizer_id);
CREATE INDEX idx_tournaments_share_code ON public.tournaments (share_code);
CREATE INDEX idx_tournaments_status ON public.tournaments (status) WHERE status IN ('registration', 'active');

CREATE TRIGGER tournaments_updated_at
  BEFORE UPDATE ON public.tournaments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- Tournament Participants
-- ============================================================

CREATE TABLE public.tournament_participants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id uuid NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  army_list_id uuid REFERENCES public.army_lists(id),
  display_name text NOT NULL,
  seed integer,
  dropped boolean NOT NULL DEFAULT false,
  registered_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tournament_id, user_id)
);

ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;

-- Tournament members can see all participants
CREATE POLICY "Participants select tournament participants"
  ON public.tournament_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tournament_participants tp2
      WHERE tp2.tournament_id = tournament_participants.tournament_id
      AND tp2.user_id = auth.uid()
    )
  );

-- Organizer can see all participants
CREATE POLICY "Organizer select participants"
  ON public.tournament_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tournaments t
      WHERE t.id = tournament_participants.tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

-- Users can register themselves
CREATE POLICY "Users register for tournaments"
  ON public.tournament_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update own registration (army list, drop)
CREATE POLICY "Users update own registration"
  ON public.tournament_participants FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Organizer can update any participant (seeding, drops)
CREATE POLICY "Organizer update participants"
  ON public.tournament_participants FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.tournaments t
      WHERE t.id = tournament_participants.tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

-- Users can withdraw, organizer can remove
CREATE POLICY "Users withdraw from tournaments"
  ON public.tournament_participants FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Organizer remove participants"
  ON public.tournament_participants FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.tournaments t
      WHERE t.id = tournament_participants.tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

CREATE INDEX idx_tournament_participants_tournament ON public.tournament_participants (tournament_id);
CREATE INDEX idx_tournament_participants_user ON public.tournament_participants (user_id);

-- ============================================================
-- Tournament Rounds
-- ============================================================

CREATE TABLE public.tournament_rounds (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id uuid NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round_number integer NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'active', 'completed')) DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tournament_id, round_number)
);

ALTER TABLE public.tournament_rounds ENABLE ROW LEVEL SECURITY;

-- Tournament members can see rounds
CREATE POLICY "Members select tournament rounds"
  ON public.tournament_rounds FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tournament_participants tp
      WHERE tp.tournament_id = tournament_rounds.tournament_id
      AND tp.user_id = auth.uid()
    )
  );

-- Organizer can see rounds
CREATE POLICY "Organizer select rounds"
  ON public.tournament_rounds FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tournaments t
      WHERE t.id = tournament_rounds.tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

-- Only organizer can create/update/delete rounds
CREATE POLICY "Organizer insert rounds"
  ON public.tournament_rounds FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tournaments t
      WHERE t.id = tournament_rounds.tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Organizer update rounds"
  ON public.tournament_rounds FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.tournaments t
      WHERE t.id = tournament_rounds.tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Organizer delete rounds"
  ON public.tournament_rounds FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.tournaments t
      WHERE t.id = tournament_rounds.tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

CREATE INDEX idx_tournament_rounds_tournament ON public.tournament_rounds (tournament_id);

-- ============================================================
-- Tournament Pairings (matchups per round)
-- ============================================================

CREATE TABLE public.tournament_pairings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_id uuid NOT NULL REFERENCES public.tournament_rounds(id) ON DELETE CASCADE,
  player1_id uuid NOT NULL REFERENCES public.tournament_participants(id),
  player2_id uuid REFERENCES public.tournament_participants(id),
  game_session_id uuid REFERENCES public.game_sessions(id),
  player1_vp integer,
  player2_vp integer,
  winner_id uuid REFERENCES public.tournament_participants(id),
  is_draw boolean NOT NULL DEFAULT false,
  is_bye boolean NOT NULL DEFAULT false,
  table_number integer,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tournament_pairings ENABLE ROW LEVEL SECURITY;

-- Tournament members can see pairings
CREATE POLICY "Members select pairings"
  ON public.tournament_pairings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tournament_rounds tr
      JOIN public.tournament_participants tp ON tp.tournament_id = tr.tournament_id
      WHERE tr.id = tournament_pairings.round_id
      AND tp.user_id = auth.uid()
    )
  );

-- Organizer can see pairings
CREATE POLICY "Organizer select pairings"
  ON public.tournament_pairings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tournament_rounds tr
      JOIN public.tournaments t ON t.id = tr.tournament_id
      WHERE tr.id = tournament_pairings.round_id
      AND t.organizer_id = auth.uid()
    )
  );

-- Organizer creates pairings
CREATE POLICY "Organizer insert pairings"
  ON public.tournament_pairings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tournament_rounds tr
      JOIN public.tournaments t ON t.id = tr.tournament_id
      WHERE tr.id = tournament_pairings.round_id
      AND t.organizer_id = auth.uid()
    )
  );

-- Organizer or paired players can update (submit results)
CREATE POLICY "Organizer update pairings"
  ON public.tournament_pairings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.tournament_rounds tr
      JOIN public.tournaments t ON t.id = tr.tournament_id
      WHERE tr.id = tournament_pairings.round_id
      AND t.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Players update own pairings"
  ON public.tournament_pairings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.tournament_participants tp
      WHERE (tp.id = tournament_pairings.player1_id OR tp.id = tournament_pairings.player2_id)
      AND tp.user_id = auth.uid()
    )
  );

-- Organizer can delete pairings
CREATE POLICY "Organizer delete pairings"
  ON public.tournament_pairings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.tournament_rounds tr
      JOIN public.tournaments t ON t.id = tr.tournament_id
      WHERE tr.id = tournament_pairings.round_id
      AND t.organizer_id = auth.uid()
    )
  );

CREATE INDEX idx_tournament_pairings_round ON public.tournament_pairings (round_id);
CREATE INDEX idx_tournament_pairings_player1 ON public.tournament_pairings (player1_id);
CREATE INDEX idx_tournament_pairings_player2 ON public.tournament_pairings (player2_id);
