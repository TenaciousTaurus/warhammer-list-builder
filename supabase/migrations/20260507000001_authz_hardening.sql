-- Security hardening migration
-- Fixes: F-01, F-02, F-03, F-04, F-05, F-06, F-07, F-13
-- All SECURITY DEFINER functions now derive the caller's identity from auth.uid()
-- instead of trusting a caller-supplied p_user_id parameter.

BEGIN;

-- -------------------------------------------------------
-- F-01: get_friend_activity — remove p_user_id parameter
-- -------------------------------------------------------

DROP FUNCTION IF EXISTS public.get_friend_activity(UUID, INT);

CREATE OR REPLACE FUNCTION public.get_friend_activity(p_limit INT DEFAULT 20)
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
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '28000';
  END IF;

  RETURN QUERY
  WITH friend_ids AS (
    SELECT
      CASE
        WHEN f.requester_id = v_user_id THEN f.addressee_id
        ELSE f.requester_id
      END AS friend_id
    FROM friendships f
    WHERE (f.requester_id = v_user_id OR f.addressee_id = v_user_id)
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

REVOKE ALL ON FUNCTION public.get_friend_activity(INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_friend_activity(INT) TO authenticated;

-- -------------------------------------------------------
-- F-02: shopping_list_for_army — remove p_user_id parameter
-- -------------------------------------------------------

DROP FUNCTION IF EXISTS public.shopping_list_for_army(UUID, UUID);

CREATE OR REPLACE FUNCTION public.shopping_list_for_army(p_list_id UUID)
RETURNS TABLE (
  unit_id      UUID,
  unit_name    TEXT,
  count_needed INT,
  count_owned  INT,
  est_cost_usd NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    u.id                                  AS unit_id,
    u.name                                AS unit_name,
    SUM(alu.model_count)::INT             AS count_needed,
    COALESCE(ce_agg.total_owned, 0)::INT  AS count_owned,
    wi.estimated_price                    AS est_cost_usd
  FROM army_list_units alu
  JOIN army_lists al ON al.id = alu.army_list_id
  JOIN units u       ON u.id = alu.unit_id
  LEFT JOIN (
    SELECT unit_id, SUM(quantity)::INT AS total_owned
    FROM collection_entries
    WHERE user_id = auth.uid()
      AND unit_id IS NOT NULL
    GROUP BY unit_id
  ) ce_agg ON ce_agg.unit_id = u.id
  LEFT JOIN LATERAL (
    SELECT estimated_price
    FROM wishlist_items
    WHERE user_id         = auth.uid()
      AND unit_id         = u.id
      AND estimated_price IS NOT NULL
    ORDER BY priority ASC
    LIMIT 1
  ) wi ON TRUE
  WHERE alu.army_list_id = p_list_id
    AND al.user_id       = auth.uid()
  GROUP BY u.id, u.name, ce_agg.total_owned, wi.estimated_price
  HAVING SUM(alu.model_count) > COALESCE(ce_agg.total_owned, 0)
  ORDER BY u.name;
$$;

REVOKE ALL ON FUNCTION public.shopping_list_for_army(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.shopping_list_for_army(UUID) TO authenticated;

-- -------------------------------------------------------
-- F-03: paint_equivalents — replace open UPDATE policy with vote RPC
-- -------------------------------------------------------

DROP POLICY IF EXISTS "paint_equivalents_auth_vote" ON public.paint_equivalents;

CREATE OR REPLACE FUNCTION public.vote_paint_equivalent(
  p_paint_id_a UUID,
  p_paint_id_b UUID,
  p_delta      INT DEFAULT 1
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '28000';
  END IF;
  IF p_delta NOT IN (-1, 1) THEN
    RAISE EXCEPTION 'delta must be -1 or 1';
  END IF;
  UPDATE public.paint_equivalents
  SET votes      = votes + p_delta,
      updated_at = NOW()
  WHERE (paint_id = p_paint_id_a AND equivalent_paint_id = p_paint_id_b)
     OR (paint_id = p_paint_id_b AND equivalent_paint_id = p_paint_id_a);
END;
$$;

REVOKE ALL ON FUNCTION public.vote_paint_equivalent(UUID, UUID, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.vote_paint_equivalent(UUID, UUID, INT) TO authenticated;

-- -------------------------------------------------------
-- F-04: organisations / organisation_members — fix RLS recursion
-- Mirrors the existing pattern in 20260406205758_fix_rls_recursion.sql
-- -------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_org_member(p_org_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organisation_members
    WHERE organisation_id = p_org_id AND user_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_org_admin(p_org_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organisation_members
    WHERE organisation_id = p_org_id
      AND user_id = p_user_id
      AND role IN ('admin', 'owner')
  );
$$;

REVOKE ALL ON FUNCTION public.is_org_member(UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_org_admin(UUID, UUID)  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_org_member(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_admin(UUID, UUID)  TO authenticated;

DROP POLICY IF EXISTS "Members can view org members"        ON public.organisation_members;
DROP POLICY IF EXISTS "Org admins can manage members"       ON public.organisation_members;
DROP POLICY IF EXISTS "Members can view their organisations" ON public.organisations;

CREATE POLICY "Members can view org members"
  ON public.organisation_members FOR SELECT TO authenticated
  USING (public.is_org_member(organisation_id, auth.uid()));

CREATE POLICY "Org admins can manage members"
  ON public.organisation_members FOR ALL TO authenticated
  USING     (public.is_org_admin(organisation_id, auth.uid()))
  WITH CHECK (public.is_org_admin(organisation_id, auth.uid()));

CREATE POLICY "Members can view their organisations"
  ON public.organisations FOR SELECT TO authenticated
  USING (
    is_public = true
    OR owner_id = auth.uid()
    OR public.is_org_member(id, auth.uid())
  );

-- -------------------------------------------------------
-- F-05: paint_recipe_steps — rename misleading policy, add anon deny on mutations
-- -------------------------------------------------------

DROP POLICY IF EXISTS "Owner select recipe steps" ON public.paint_recipe_steps;

CREATE POLICY "Public read recipe steps when recipe is public"
  ON public.paint_recipe_steps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.paint_recipes pr
      WHERE pr.id = paint_recipe_steps.recipe_id
        AND (pr.user_id = auth.uid() OR pr.is_public = true)
    )
  );

CREATE POLICY "Anon cannot insert recipe steps"
  ON public.paint_recipe_steps FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Anon cannot update recipe steps"
  ON public.paint_recipe_steps FOR UPDATE TO anon USING (false);
CREATE POLICY "Anon cannot delete recipe steps"
  ON public.paint_recipe_steps FOR DELETE TO anon USING (false);

-- -------------------------------------------------------
-- F-06: update_hobby_streak — add auth.uid() defense-in-depth guard
-- -------------------------------------------------------

CREATE OR REPLACE FUNCTION public.update_hobby_streak()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  today       DATE := CURRENT_DATE;
  v_last_date DATE;
  v_current   INT;
  v_longest   INT;
  v_total     INT;
BEGIN
  -- Defense-in-depth: block if caller is authenticated but row user_id doesn't match.
  -- auth.uid() IS NULL guard preserves admin/migration-time operations.
  IF auth.uid() IS NOT NULL AND NEW.user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'user_id mismatch on collection_entries update' USING ERRCODE = '42501';
  END IF;

  IF NEW.painting_status = 'finished' AND (OLD.painting_status IS DISTINCT FROM 'finished') THEN
    SELECT last_activity_date, current_streak_days, longest_streak_days, total_active_days
      INTO v_last_date, v_current, v_longest, v_total
      FROM hobby_streaks
      WHERE user_id = NEW.user_id;

    IF NOT FOUND THEN
      INSERT INTO hobby_streaks (user_id, current_streak_days, longest_streak_days, last_activity_date, total_active_days)
        VALUES (NEW.user_id, 1, 1, today, 1);
    ELSIF v_last_date = today THEN
      NULL;
    ELSIF v_last_date = today - INTERVAL '1 day' THEN
      UPDATE hobby_streaks SET
        current_streak_days = v_current + 1,
        longest_streak_days = GREATEST(v_longest, v_current + 1),
        last_activity_date  = today,
        total_active_days   = v_total + 1
      WHERE user_id = NEW.user_id;
    ELSE
      UPDATE hobby_streaks SET
        current_streak_days = 1,
        last_activity_date  = today,
        total_active_days   = v_total + 1
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- -------------------------------------------------------
-- F-07: check_and_award_achievements — remove p_user_id parameter
-- -------------------------------------------------------

DROP FUNCTION IF EXISTS public.check_and_award_achievements(UUID);

CREATE OR REPLACE FUNCTION public.check_and_award_achievements()
RETURNS TABLE (achievement_slug TEXT, achievement_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id       UUID := auth.uid();
  v_lists_count   INT;
  v_games_count   INT;
  v_wins_count    INT;
  v_painted_count INT;
  v_recipes_count INT;
  v_streak_days   INT;
  v_in_campaign   BOOLEAN;
  v_tourney_wins  INT;
  v_ach           RECORD;
  v_earned        BOOLEAN;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '28000';
  END IF;

  SELECT COUNT(*) INTO v_lists_count   FROM army_lists         WHERE user_id = v_user_id;
  SELECT COUNT(*) INTO v_games_count   FROM game_sessions      WHERE user_id = v_user_id AND status = 'completed';
  SELECT COUNT(*) INTO v_wins_count    FROM game_sessions      WHERE user_id = v_user_id AND result  = 'win';
  SELECT COUNT(*) INTO v_painted_count FROM collection_entries WHERE user_id = v_user_id AND painting_status = 'finished';
  SELECT COUNT(*) INTO v_recipes_count FROM paint_recipes      WHERE user_id = v_user_id;
  SELECT COALESCE(current_streak_days, 0) INTO v_streak_days  FROM hobby_streaks WHERE user_id = v_user_id;
  SELECT EXISTS(SELECT 1 FROM campaign_members WHERE user_id = v_user_id) INTO v_in_campaign;
  SELECT COUNT(*) INTO v_tourney_wins
    FROM tournament_pairings tp
    JOIN tournament_participants tpart ON tpart.id = tp.winner_id
    WHERE tpart.user_id = v_user_id;

  FOR v_ach IN SELECT * FROM achievements LOOP
    CONTINUE WHEN EXISTS(
      SELECT 1 FROM user_achievements WHERE user_id = v_user_id AND achievement_id = v_ach.id
    );

    v_earned := CASE v_ach.slug
      WHEN 'first_list'          THEN v_lists_count   >= 1
      WHEN 'lists_5'             THEN v_lists_count   >= 5
      WHEN 'lists_10'            THEN v_lists_count   >= 10
      WHEN 'first_game'          THEN v_games_count   >= 1
      WHEN 'games_10'            THEN v_games_count   >= 10
      WHEN 'games_50'            THEN v_games_count   >= 50
      WHEN 'wins_10'             THEN v_wins_count    >= 10
      WHEN 'first_model_painted' THEN v_painted_count >= 1
      WHEN 'painted_10'          THEN v_painted_count >= 10
      WHEN 'painted_50'          THEN v_painted_count >= 50
      WHEN 'recipes_5'           THEN v_recipes_count >= 5
      WHEN 'streak_7'            THEN v_streak_days   >= 7
      WHEN 'streak_30'           THEN v_streak_days   >= 30
      WHEN 'first_campaign'      THEN v_in_campaign
      WHEN 'tournament_winner'   THEN v_tourney_wins  >= 1
      ELSE FALSE
    END;

    IF v_earned THEN
      INSERT INTO user_achievements (user_id, achievement_id)
        VALUES (v_user_id, v_ach.id)
        ON CONFLICT DO NOTHING;
      achievement_slug := v_ach.slug;
      achievement_name := v_ach.name;
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.check_and_award_achievements() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_and_award_achievements() TO authenticated;

-- -------------------------------------------------------
-- F-13: Revoke anon access from public stat RPCs — require login
-- -------------------------------------------------------

REVOKE ALL ON FUNCTION public.get_paint_equivalents(UUID)             FROM anon;
REVOKE ALL ON FUNCTION public.tournaments_near(NUMERIC, NUMERIC, INT) FROM anon;
REVOKE ALL ON FUNCTION public.faction_win_rates(INT)                  FROM anon;
REVOKE ALL ON FUNCTION public.detachment_play_rates(INT)              FROM anon;

GRANT EXECUTE ON FUNCTION public.get_paint_equivalents(UUID)             TO authenticated;
GRANT EXECUTE ON FUNCTION public.tournaments_near(NUMERIC, NUMERIC, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.faction_win_rates(INT)                  TO authenticated;
GRANT EXECUTE ON FUNCTION public.detachment_play_rates(INT)              TO authenticated;

COMMIT;
