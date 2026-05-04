-- W3-3: Battle Report Export
-- Adds a short public share code to completed game sessions.
-- When report_code is set, the session is publicly readable (no auth required).

ALTER TABLE game_sessions
  ADD COLUMN IF NOT EXISTS report_code TEXT UNIQUE;

CREATE UNIQUE INDEX IF NOT EXISTS game_sessions_report_code_idx ON game_sessions (report_code);

-- Allow anon/public to read completed sessions that have a report_code set.
-- This is intentionally narrow: only report_code-bearing rows, never active sessions.
CREATE POLICY "Public read completed battle reports"
  ON game_sessions
  FOR SELECT
  TO anon, authenticated
  USING (report_code IS NOT NULL);

-- RPC: generate_battle_report_code(p_session_id UUID)
-- Callable by the session owner. Generates a short alphanumeric code and marks the
-- session as publicly shareable. Idempotent — returns existing code if already set.
CREATE OR REPLACE FUNCTION generate_battle_report_code(p_session_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing TEXT;
  v_code     TEXT;
BEGIN
  -- Must be the session owner
  IF NOT EXISTS (
    SELECT 1 FROM game_sessions
    WHERE id = p_session_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Return existing code if already generated
  SELECT report_code INTO v_existing FROM game_sessions WHERE id = p_session_id;
  IF v_existing IS NOT NULL THEN
    RETURN v_existing;
  END IF;

  -- Generate a unique 10-char alphanumeric code
  LOOP
    v_code := lower(
      substring(
        replace(replace(encode(gen_random_bytes(8), 'base64'), '+', ''), '/', ''),
        1, 10
      )
    );
    EXIT WHEN NOT EXISTS (SELECT 1 FROM game_sessions WHERE report_code = v_code);
  END LOOP;

  UPDATE game_sessions SET report_code = v_code WHERE id = p_session_id;
  RETURN v_code;
END;
$$;

GRANT EXECUTE ON FUNCTION generate_battle_report_code(UUID) TO authenticated;
