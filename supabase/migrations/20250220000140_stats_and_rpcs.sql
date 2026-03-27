-- ============================================================
-- Phase 4/5: RPC Functions, Stats & Realtime
-- ============================================================

-- ============================================================
-- RPC: Get Player Stats
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_player_stats(target_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_games', COUNT(*),
    'wins', COUNT(*) FILTER (WHERE gs.result = 'win'),
    'losses', COUNT(*) FILTER (WHERE gs.result = 'loss'),
    'draws', COUNT(*) FILTER (WHERE gs.result = 'draw'),
    'win_rate', CASE
      WHEN COUNT(*) > 0 THEN
        ROUND((COUNT(*) FILTER (WHERE gs.result = 'win'))::numeric / COUNT(*)::numeric * 100, 1)
      ELSE 0
    END,
    'avg_vp', COALESCE(ROUND(AVG(gs.my_vp)::numeric, 1), 0),
    'avg_opponent_vp', COALESCE(ROUND(AVG(gs.opponent_vp)::numeric, 1), 0),
    'games_by_faction', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'faction_name', f.name,
        'faction_id', f.id,
        'games', cnt,
        'wins', w
      ))
      FROM (
        SELECT al.faction_id, COUNT(*) as cnt,
               COUNT(*) FILTER (WHERE gs2.result = 'win') as w
        FROM public.game_sessions gs2
        JOIN public.army_lists al ON al.id = gs2.army_list_id
        WHERE gs2.user_id = target_user_id AND gs2.status = 'completed'
        GROUP BY al.faction_id
      ) sub
      JOIN public.factions f ON f.id = sub.faction_id
    ), '[]'::jsonb)
  ) INTO result
  FROM public.game_sessions gs
  WHERE gs.user_id = target_user_id AND gs.status = 'completed';

  RETURN COALESCE(result, jsonb_build_object(
    'total_games', 0, 'wins', 0, 'losses', 0, 'draws', 0,
    'win_rate', 0, 'avg_vp', 0, 'avg_opponent_vp', 0, 'games_by_faction', '[]'::jsonb
  ));
END;
$$;

-- ============================================================
-- RPC: Get Head-to-Head Stats
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_head_to_head(user1_id uuid, user2_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Check crusade battles between these two users
  SELECT jsonb_build_object(
    'total_games', COUNT(*),
    'user1_wins', COUNT(*) FILTER (WHERE cb.winner_member_id = cm1.id),
    'user2_wins', COUNT(*) FILTER (WHERE cb.winner_member_id = cm2.id),
    'draws', COUNT(*) FILTER (WHERE cb.is_draw = true),
    'recent_battles', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'played_at', cb2.played_at,
        'player1_vp', cb2.player1_vp,
        'player2_vp', cb2.player2_vp,
        'winner', CASE
          WHEN cb2.is_draw THEN 'draw'
          WHEN cb2.winner_member_id = cm1b.id THEN 'user1'
          ELSE 'user2'
        END
      ) ORDER BY cb2.played_at DESC)
      FROM public.crusade_battles cb2
      JOIN public.campaign_members cm1b ON cm1b.user_id = user1_id
        AND (cm1b.id = cb2.player1_member_id OR cm1b.id = cb2.player2_member_id)
      JOIN public.campaign_members cm2b ON cm2b.user_id = user2_id
        AND (cm2b.id = cb2.player1_member_id OR cm2b.id = cb2.player2_member_id)
      LIMIT 10
    ), '[]'::jsonb)
  ) INTO result
  FROM public.crusade_battles cb
  JOIN public.campaign_members cm1 ON cm1.user_id = user1_id
    AND (cm1.id = cb.player1_member_id OR cm1.id = cb.player2_member_id)
  JOIN public.campaign_members cm2 ON cm2.user_id = user2_id
    AND (cm2.id = cb.player1_member_id OR cm2.id = cb.player2_member_id);

  RETURN COALESCE(result, jsonb_build_object(
    'total_games', 0, 'user1_wins', 0, 'user2_wins', 0, 'draws', 0, 'recent_battles', '[]'::jsonb
  ));
END;
$$;

-- ============================================================
-- RPC: Get Tournament Standings
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_tournament_standings(p_tournament_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'participant_id', sub.participant_id,
      'display_name', sub.display_name,
      'wins', sub.wins,
      'losses', sub.losses,
      'draws', sub.draws,
      'byes', sub.byes,
      'vp_for', sub.vp_for,
      'vp_against', sub.vp_against,
      'vp_diff', sub.vp_for - sub.vp_against,
      'points', sub.wins * 3 + sub.draws + sub.byes * 3,
      'dropped', sub.dropped
    ) ORDER BY (sub.wins * 3 + sub.draws + sub.byes * 3) DESC,
               (sub.vp_for - sub.vp_against) DESC
  ), '[]'::jsonb) INTO result
  FROM (
    SELECT
      tp.id as participant_id,
      tp.display_name,
      tp.dropped,
      COUNT(*) FILTER (WHERE tpa.winner_id = tp.id AND NOT tpa.is_bye) as wins,
      COUNT(*) FILTER (WHERE tpa.winner_id IS NOT NULL AND tpa.winner_id != tp.id AND NOT tpa.is_draw AND NOT tpa.is_bye) as losses,
      COUNT(*) FILTER (WHERE tpa.is_draw) as draws,
      COUNT(*) FILTER (WHERE tpa.is_bye) as byes,
      COALESCE(SUM(CASE
        WHEN tpa.player1_id = tp.id THEN COALESCE(tpa.player1_vp, 0)
        WHEN tpa.player2_id = tp.id THEN COALESCE(tpa.player2_vp, 0)
        ELSE 0
      END), 0) as vp_for,
      COALESCE(SUM(CASE
        WHEN tpa.player1_id = tp.id THEN COALESCE(tpa.player2_vp, 0)
        WHEN tpa.player2_id = tp.id THEN COALESCE(tpa.player1_vp, 0)
        ELSE 0
      END), 0) as vp_against
    FROM public.tournament_participants tp
    LEFT JOIN public.tournament_pairings tpa ON (
      tpa.player1_id = tp.id OR tpa.player2_id = tp.id
    )
    LEFT JOIN public.tournament_rounds tr ON tr.id = tpa.round_id
    WHERE tp.tournament_id = p_tournament_id
      AND (tr.id IS NULL OR tpa.completed_at IS NOT NULL)
    GROUP BY tp.id, tp.display_name, tp.dropped
  ) sub;

  RETURN result;
END;
$$;

-- ============================================================
-- RPC: Generate Swiss Pairings
-- ============================================================

CREATE OR REPLACE FUNCTION public.generate_swiss_pairings(
  p_tournament_id uuid,
  p_round_number integer
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_round_id uuid;
  v_standings jsonb;
  v_participants jsonb[];
  v_paired uuid[] := '{}';
  v_i integer;
  v_j integer;
  v_p1 uuid;
  v_p2 uuid;
  v_table_num integer := 1;
  v_count integer;
  v_has_bye boolean;
BEGIN
  -- Verify organizer
  IF NOT EXISTS (
    SELECT 1 FROM public.tournaments t
    WHERE t.id = p_tournament_id AND t.organizer_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Only the tournament organizer can generate pairings';
  END IF;

  -- Create the round
  INSERT INTO public.tournament_rounds (tournament_id, round_number, status)
  VALUES (p_tournament_id, p_round_number, 'active')
  RETURNING id INTO v_round_id;

  -- Get current standings for sorting
  v_standings := public.get_tournament_standings(p_tournament_id);

  -- Build ordered array of active participant IDs
  SELECT array_agg(elem->>'participant_id' ORDER BY ordinality)
  INTO v_participants
  FROM jsonb_array_elements(v_standings) WITH ORDINALITY AS t(elem, ordinality)
  WHERE (elem->>'dropped')::boolean = false;

  v_count := array_length(v_participants, 1);
  IF v_count IS NULL OR v_count < 2 THEN
    RAISE EXCEPTION 'Not enough active participants for pairings';
  END IF;

  -- Pair top vs next, skipping already-paired
  v_i := 1;
  WHILE v_i <= v_count LOOP
    v_p1 := (v_participants[v_i])::uuid;

    IF v_p1 = ANY(v_paired) THEN
      v_i := v_i + 1;
      CONTINUE;
    END IF;

    -- Find next unpaired opponent
    v_j := v_i + 1;
    v_p2 := NULL;
    WHILE v_j <= v_count LOOP
      IF NOT ((v_participants[v_j])::uuid = ANY(v_paired)) THEN
        -- Check for rematch avoidance
        IF NOT EXISTS (
          SELECT 1 FROM public.tournament_pairings tpa
          JOIN public.tournament_rounds tr ON tr.id = tpa.round_id
          WHERE tr.tournament_id = p_tournament_id
          AND NOT tpa.is_bye
          AND (
            (tpa.player1_id = v_p1 AND tpa.player2_id = (v_participants[v_j])::uuid)
            OR (tpa.player2_id = v_p1 AND tpa.player1_id = (v_participants[v_j])::uuid)
          )
        ) THEN
          v_p2 := (v_participants[v_j])::uuid;
          EXIT;
        END IF;
      END IF;
      v_j := v_j + 1;
    END LOOP;

    -- If no non-rematch found, pair with next available
    IF v_p2 IS NULL THEN
      v_j := v_i + 1;
      WHILE v_j <= v_count LOOP
        IF NOT ((v_participants[v_j])::uuid = ANY(v_paired)) THEN
          v_p2 := (v_participants[v_j])::uuid;
          EXIT;
        END IF;
        v_j := v_j + 1;
      END LOOP;
    END IF;

    IF v_p2 IS NOT NULL THEN
      INSERT INTO public.tournament_pairings (round_id, player1_id, player2_id, table_number)
      VALUES (v_round_id, v_p1, v_p2, v_table_num);
      v_paired := v_paired || v_p1 || v_p2;
      v_table_num := v_table_num + 1;
    ELSE
      -- Odd player gets a bye (if they haven't had one)
      SELECT EXISTS (
        SELECT 1 FROM public.tournament_pairings tpa
        JOIN public.tournament_rounds tr ON tr.id = tpa.round_id
        WHERE tr.tournament_id = p_tournament_id
        AND tpa.is_bye AND tpa.player1_id = v_p1
      ) INTO v_has_bye;

      INSERT INTO public.tournament_pairings (round_id, player1_id, is_bye, table_number)
      VALUES (v_round_id, v_p1, true, v_table_num);
      v_paired := v_paired || v_p1;
      v_table_num := v_table_num + 1;
    END IF;

    v_i := v_i + 1;
  END LOOP;

  RETURN v_round_id;
END;
$$;

-- ============================================================
-- RPC: Award Crusade XP
-- ============================================================

CREATE OR REPLACE FUNCTION public.award_crusade_xp(p_battle_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_participant RECORD;
  v_new_xp integer;
  v_new_rank text;
BEGIN
  -- Process each participant in the battle
  FOR v_participant IN
    SELECT
      cbp.id as participant_id,
      cbp.crusade_unit_id,
      cbp.xp_earned,
      cbp.kills_this_battle,
      cbp.survived,
      cu.xp as current_xp,
      cu.battles_played,
      cu.battles_survived,
      cu.kills,
      cb.winner_member_id,
      cr.campaign_member_id
    FROM public.crusade_battle_participants cbp
    JOIN public.crusade_units cu ON cu.id = cbp.crusade_unit_id
    JOIN public.crusade_rosters cr ON cr.id = cu.crusade_roster_id
    JOIN public.crusade_battles cb ON cb.id = cbp.crusade_battle_id
    WHERE cbp.crusade_battle_id = p_battle_id
  LOOP
    -- Calculate XP: 1 for participating, 1 for winning, 1 for surviving, 1 per kill
    v_new_xp := v_participant.current_xp + 1; -- participation
    IF v_participant.survived THEN
      v_new_xp := v_new_xp + 1;
    END IF;
    v_new_xp := v_new_xp + v_participant.kills_this_battle;

    -- Check if player's member was the winner
    IF v_participant.winner_member_id = v_participant.campaign_member_id THEN
      v_new_xp := v_new_xp + 1;
    END IF;

    -- Determine rank from XP
    v_new_rank := CASE
      WHEN v_new_xp >= 51 THEN 'legendary'
      WHEN v_new_xp >= 31 THEN 'heroic'
      WHEN v_new_xp >= 16 THEN 'battle_hardened'
      WHEN v_new_xp >= 6 THEN 'blooded'
      ELSE 'battle_ready'
    END;

    -- Update the crusade unit
    UPDATE public.crusade_units
    SET
      xp = v_new_xp,
      rank = v_new_rank,
      battles_played = v_participant.battles_played + 1,
      battles_survived = v_participant.battles_survived + CASE WHEN v_participant.survived THEN 1 ELSE 0 END,
      kills = v_participant.kills + v_participant.kills_this_battle,
      is_destroyed = NOT v_participant.survived AND is_destroyed,
      destroyed_in_battle_id = CASE WHEN NOT v_participant.survived THEN p_battle_id ELSE destroyed_in_battle_id END
    WHERE id = v_participant.crusade_unit_id;

    -- Update participant XP earned
    UPDATE public.crusade_battle_participants
    SET xp_earned = v_new_xp - v_participant.current_xp
    WHERE id = v_participant.participant_id;
  END LOOP;
END;
$$;

-- ============================================================
-- Enable Supabase Realtime
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.campaigns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crusade_battles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crusade_units;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tournament_rounds;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tournament_pairings;
