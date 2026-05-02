-- ============================================================================
-- Migration: Spectatable game sessions (W1-4 Opponent View)
-- Adds is_spectatable flag to game_sessions and public read policies
-- so spectators can follow a live game via invite_code without auth.
-- ============================================================================

-- Add spectatable flag
ALTER TABLE public.game_sessions
  ADD COLUMN IF NOT EXISTS is_spectatable BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_game_sessions_invite_code ON public.game_sessions (invite_code)
  WHERE invite_code IS NOT NULL;

-- Allow anyone (anon + authenticated) to SELECT spectatable sessions.
-- Existing owner-only policies remain; RLS uses OR semantics.
CREATE POLICY "Public read spectatable sessions"
  ON public.game_sessions FOR SELECT
  TO anon, authenticated
  USING (is_spectatable = true);

-- Allow anyone to read events from spectatable sessions
CREATE POLICY "Public read spectatable events"
  ON public.game_session_events FOR SELECT
  TO anon, authenticated
  USING (
    game_session_id IN (
      SELECT id FROM public.game_sessions WHERE is_spectatable = true
    )
  );

-- Allow anyone to read scores from spectatable sessions
CREATE POLICY "Public read spectatable scores"
  ON public.game_session_scores FOR SELECT
  TO anon, authenticated
  USING (
    game_session_id IN (
      SELECT id FROM public.game_sessions WHERE is_spectatable = true
    )
  );
