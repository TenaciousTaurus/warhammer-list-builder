-- W2-7: Geographic Tournament Discovery
-- W2-8: Meta Analysis Dashboard

-- -------------------------------------------------------
-- W2-7: Venue fields on tournaments
-- -------------------------------------------------------

ALTER TABLE public.tournaments
  ADD COLUMN IF NOT EXISTS venue_city TEXT,
  ADD COLUMN IF NOT EXISTS venue_lat  NUMERIC(10,7),
  ADD COLUMN IF NOT EXISTS venue_lng  NUMERIC(10,7);

-- RPC: tournaments within radius using Haversine formula
CREATE OR REPLACE FUNCTION public.tournaments_near(
  p_lat       NUMERIC,
  p_lng       NUMERIC,
  p_radius_km INT DEFAULT 50
)
RETURNS TABLE (
  id           UUID,
  name         TEXT,
  format       TEXT,
  status       TEXT,
  is_public    BOOLEAN,
  share_code   TEXT,
  max_players  INT,
  points_limit INT,
  num_rounds   INT,
  venue_city   TEXT,
  venue_lat    NUMERIC,
  venue_lng    NUMERIC,
  distance_km  NUMERIC,
  created_at   TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.id,
    t.name,
    t.format,
    t.status,
    t.is_public,
    t.share_code,
    t.max_players,
    t.points_limit,
    t.num_rounds,
    t.venue_city,
    t.venue_lat,
    t.venue_lng,
    ROUND(
      6371 * 2 * ASIN(SQRT(
        POWER(SIN(RADIANS((t.venue_lat - p_lat) / 2)), 2)
        + COS(RADIANS(p_lat)) * COS(RADIANS(t.venue_lat))
          * POWER(SIN(RADIANS((t.venue_lng - p_lng) / 2)), 2)
      ))::NUMERIC, 1
    ) AS distance_km,
    t.created_at
  FROM tournaments t
  WHERE t.is_public = TRUE
    AND t.status IN ('registration', 'active')
    AND t.venue_lat IS NOT NULL
    AND t.venue_lng IS NOT NULL
    AND 6371 * 2 * ASIN(SQRT(
      POWER(SIN(RADIANS((t.venue_lat - p_lat) / 2)), 2)
      + COS(RADIANS(p_lat)) * COS(RADIANS(t.venue_lat))
        * POWER(SIN(RADIANS((t.venue_lng - p_lng) / 2)), 2)
    )) <= p_radius_km
  ORDER BY distance_km ASC;
$$;

GRANT EXECUTE ON FUNCTION public.tournaments_near(NUMERIC, NUMERIC, INT) TO anon, authenticated;

-- -------------------------------------------------------
-- W2-8: Meta Analysis RPCs
-- Only counts completed games linked to public tournaments
-- -------------------------------------------------------

CREATE OR REPLACE FUNCTION public.faction_win_rates(p_days INT DEFAULT 30)
RETURNS TABLE (
  faction_id   UUID,
  faction_name TEXT,
  win_rate     NUMERIC,
  wins         INT,
  total_games  INT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    f.id                                                          AS faction_id,
    f.name                                                        AS faction_name,
    ROUND(
      COALESCE(
        SUM(CASE WHEN gs.result = 'win' THEN 1 ELSE 0 END)::NUMERIC
        / NULLIF(COUNT(gs.id), 0), 0
      ) * 100, 1
    )                                                             AS win_rate,
    SUM(CASE WHEN gs.result = 'win' THEN 1 ELSE 0 END)::INT      AS wins,
    COUNT(gs.id)::INT                                             AS total_games
  FROM factions f
  JOIN army_lists al ON al.faction_id = f.id
  JOIN game_sessions gs ON gs.army_list_id = al.id
  WHERE gs.status = 'completed'
    AND gs.completed_at >= NOW() - (p_days || ' days')::INTERVAL
    AND EXISTS (
      SELECT 1
      FROM tournament_pairings tp
      JOIN tournament_rounds tr ON tr.id = tp.round_id
      JOIN tournaments t ON t.id = tr.tournament_id
      WHERE tp.game_session_id = gs.id
        AND t.is_public = TRUE
    )
  GROUP BY f.id, f.name
  HAVING COUNT(gs.id) >= 3
  ORDER BY win_rate DESC, total_games DESC;
$$;

GRANT EXECUTE ON FUNCTION public.faction_win_rates(INT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.detachment_play_rates(p_days INT DEFAULT 30)
RETURNS TABLE (
  detachment_id   UUID,
  detachment_name TEXT,
  faction_name    TEXT,
  play_count      INT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    d.id                AS detachment_id,
    d.name              AS detachment_name,
    f.name              AS faction_name,
    COUNT(gs.id)::INT   AS play_count
  FROM detachments d
  JOIN factions f ON f.id = d.faction_id
  JOIN army_lists al ON al.detachment_id = d.id
  JOIN game_sessions gs ON gs.army_list_id = al.id
  WHERE gs.status = 'completed'
    AND gs.completed_at >= NOW() - (p_days || ' days')::INTERVAL
    AND EXISTS (
      SELECT 1
      FROM tournament_pairings tp
      JOIN tournament_rounds tr ON tr.id = tp.round_id
      JOIN tournaments t ON t.id = tr.tournament_id
      WHERE tp.game_session_id = gs.id
        AND t.is_public = TRUE
    )
  GROUP BY d.id, d.name, f.name
  ORDER BY play_count DESC;
$$;

GRANT EXECUTE ON FUNCTION public.detachment_play_rates(INT) TO anon, authenticated;
