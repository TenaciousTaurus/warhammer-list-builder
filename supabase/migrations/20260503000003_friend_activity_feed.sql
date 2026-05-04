-- W3-6: Friend Activity Feed
-- RPC that returns a merged activity timeline for a user's accepted friends.
-- Runs SECURITY DEFINER so it can read friend data across RLS boundaries.
-- Returns the most recent game completions and paint finishes from the last 30 days.

CREATE OR REPLACE FUNCTION get_friend_activity(
  p_user_id UUID,
  p_limit   INT DEFAULT 20
)
RETURNS TABLE(
  activity_type TEXT,
  actor_id      UUID,
  actor_name    TEXT,
  description   TEXT,
  activity_at   TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH friend_ids AS (
    SELECT
      CASE
        WHEN f.requester_id = p_user_id THEN f.addressee_id
        ELSE f.requester_id
      END AS friend_id
    FROM friendships f
    WHERE (f.requester_id = p_user_id OR f.addressee_id = p_user_id)
      AND f.status = 'accepted'
  ),
  game_events AS (
    SELECT
      'game'::TEXT                AS activity_type,
      gs.user_id                  AS actor_id,
      up.display_name             AS actor_name,
      (CASE gs.result
         WHEN 'win'  THEN 'won'
         WHEN 'loss' THEN 'lost'
         ELSE 'drew'
       END
       || ' a game'
       || CASE WHEN gs.opponent_name IS NOT NULL
            THEN ' vs ' || gs.opponent_name
            ELSE ''
          END
       || ' (' || gs.my_vp || '–' || gs.opponent_vp || ')'
      )::TEXT                     AS description,
      gs.completed_at             AS activity_at
    FROM game_sessions gs
    JOIN friend_ids fi ON fi.friend_id = gs.user_id
    JOIN user_profiles up ON up.id = gs.user_id
    WHERE gs.status = 'completed'
      AND gs.completed_at > NOW() - INTERVAL '30 days'
  ),
  paint_events AS (
    SELECT
      'painted'::TEXT             AS activity_type,
      ce.user_id                  AS actor_id,
      up.display_name             AS actor_name,
      ('finished painting '
       || ce.quantity || '× '
       || COALESCE(ce.custom_name, u.name, 'models')
      )::TEXT                     AS description,
      ce.updated_at               AS activity_at
    FROM collection_entries ce
    JOIN friend_ids fi ON fi.friend_id = ce.user_id
    JOIN user_profiles up ON up.id = ce.user_id
    LEFT JOIN units u ON u.id = ce.unit_id
    WHERE ce.painting_status IN ('painted', 'complete')
      AND ce.updated_at > NOW() - INTERVAL '30 days'
  )
  SELECT * FROM game_events
  UNION ALL
  SELECT * FROM paint_events
  ORDER BY activity_at DESC
  LIMIT p_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION get_friend_activity(UUID, INT) TO authenticated;
