-- W2-4: Hobby Streaks + Achievements

-- -------------------------------------------------------
-- Tables
-- -------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.hobby_streaks (
  user_id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak_days INT  NOT NULL DEFAULT 0,
  longest_streak_days INT  NOT NULL DEFAULT 0,
  last_activity_date  DATE,
  total_active_days   INT  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.achievements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT '🏆',
  criteria    JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- -------------------------------------------------------
-- RLS
-- -------------------------------------------------------

ALTER TABLE public.hobby_streaks    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- hobby_streaks: owner only
CREATE POLICY "hobby_streaks_owner" ON public.hobby_streaks
  FOR ALL USING (user_id = auth.uid());

-- achievements: public read
CREATE POLICY "achievements_public_read" ON public.achievements
  FOR SELECT USING (TRUE);

-- user_achievements: owner only
CREATE POLICY "user_achievements_owner" ON public.user_achievements
  FOR ALL USING (user_id = auth.uid());

-- deny anon writes
CREATE POLICY "achievements_anon_deny" ON public.achievements
  FOR ALL TO anon USING (FALSE);

-- -------------------------------------------------------
-- Trigger: update streak when a model is marked finished
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
  IF NEW.painting_status = 'finished' AND (OLD.painting_status IS DISTINCT FROM 'finished') THEN
    SELECT last_activity_date, current_streak_days, longest_streak_days, total_active_days
      INTO v_last_date, v_current, v_longest, v_total
      FROM hobby_streaks
      WHERE user_id = NEW.user_id;

    IF NOT FOUND THEN
      INSERT INTO hobby_streaks (user_id, current_streak_days, longest_streak_days, last_activity_date, total_active_days)
        VALUES (NEW.user_id, 1, 1, today, 1);
    ELSIF v_last_date = today THEN
      -- Already counted today
      NULL;
    ELSIF v_last_date = today - INTERVAL '1 day' THEN
      -- Continuing streak
      UPDATE hobby_streaks SET
        current_streak_days = v_current + 1,
        longest_streak_days = GREATEST(v_longest, v_current + 1),
        last_activity_date  = today,
        total_active_days   = v_total + 1
      WHERE user_id = NEW.user_id;
    ELSE
      -- Streak broken
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

DROP TRIGGER IF EXISTS trg_update_hobby_streak ON public.collection_entries;
CREATE TRIGGER trg_update_hobby_streak
  AFTER UPDATE ON public.collection_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_hobby_streak();

-- -------------------------------------------------------
-- RPC: check_and_award_achievements
-- -------------------------------------------------------

CREATE OR REPLACE FUNCTION public.check_and_award_achievements(p_user_id UUID)
RETURNS TABLE (achievement_slug TEXT, achievement_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
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
  SELECT COUNT(*) INTO v_lists_count   FROM army_lists       WHERE user_id = p_user_id;
  SELECT COUNT(*) INTO v_games_count   FROM game_sessions    WHERE user_id = p_user_id AND status = 'completed';
  SELECT COUNT(*) INTO v_wins_count    FROM game_sessions    WHERE user_id = p_user_id AND result  = 'win';
  SELECT COUNT(*) INTO v_painted_count FROM collection_entries WHERE user_id = p_user_id AND painting_status = 'finished';
  SELECT COUNT(*) INTO v_recipes_count FROM paint_recipes    WHERE user_id = p_user_id;
  SELECT COALESCE(current_streak_days, 0) INTO v_streak_days FROM hobby_streaks WHERE user_id = p_user_id;
  SELECT EXISTS(SELECT 1 FROM campaign_members WHERE user_id = p_user_id) INTO v_in_campaign;
  SELECT COUNT(*) INTO v_tourney_wins
    FROM tournament_pairings tp
    JOIN tournament_participants tpart ON tpart.id = tp.winner_id
    WHERE tpart.user_id = p_user_id;

  FOR v_ach IN SELECT * FROM achievements LOOP
    CONTINUE WHEN EXISTS(
      SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = v_ach.id
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
        VALUES (p_user_id, v_ach.id)
        ON CONFLICT DO NOTHING;
      achievement_slug := v_ach.slug;
      achievement_name := v_ach.name;
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$;

REVOKE ALL   ON FUNCTION public.check_and_award_achievements(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_and_award_achievements(UUID) TO authenticated;

-- -------------------------------------------------------
-- Seed: 15 achievement milestones
-- -------------------------------------------------------

INSERT INTO public.achievements (slug, name, description, icon) VALUES
  ('first_list',          'First Muster',         'Created your first army list.',                   '📋'),
  ('lists_5',             'Warlord in Training',  'Created 5 army lists.',                           '📚'),
  ('lists_10',            'Master Strategist',    'Created 10 army lists.',                          '🎖️'),
  ('first_game',          'First Blood',          'Played your first game.',                         '⚔️'),
  ('games_10',            'Veteran',              'Played 10 games.',                                '🏅'),
  ('games_50',            'Battle-Hardened',      'Played 50 games.',                                '💀'),
  ('wins_10',             'Conqueror',            'Won 10 games.',                                   '🏆'),
  ('first_model_painted', 'First Stroke',         'Finished painting your first model.',             '🎨'),
  ('painted_10',          'Hobby Enthusiast',     'Finished painting 10 models.',                   '🖌️'),
  ('painted_50',          'Golden Daemon Hopeful','Finished painting 50 models.',                   '✨'),
  ('recipes_5',           'Paint Alchemist',      'Created 5 paint recipes.',                        '🧪'),
  ('streak_7',            'Seven Day Streak',     'Maintained a 7-day hobby streak.',                '🔥'),
  ('streak_30',           'Dedicated Hobbyist',   'Maintained a 30-day hobby streak.',               '🌟'),
  ('first_campaign',      'Crusader',             'Joined your first Crusade campaign.',             '⚔️'),
  ('tournament_winner',   'Grand Champion',       'Won a tournament.',                               '👑')
ON CONFLICT (slug) DO NOTHING;
