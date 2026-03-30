-- ============================================================
-- Phase 2: Game Sessions, Missions, Stratagems, Objectives
-- ============================================================

-- ============================================================
-- GAME DATA TABLES (public read)
-- ============================================================

-- Missions
CREATE TABLE public.missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('matched', 'crusade', 'narrative', 'combat_patrol')),
  source text,
  description text,
  primary_objective text,
  deployment_map_url text,
  max_primary_per_round integer NOT NULL DEFAULT 15,
  max_total integer NOT NULL DEFAULT 90,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read missions" ON public.missions FOR SELECT USING (true);

-- Secondary objectives
CREATE TABLE public.secondary_objectives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'tactical',
  description text NOT NULL DEFAULT '',
  max_vp integer NOT NULL DEFAULT 15,
  is_fixed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.secondary_objectives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read secondary objectives" ON public.secondary_objectives FOR SELECT USING (true);

-- Stratagems (core + faction/detachment specific)
CREATE TABLE public.stratagems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('core', 'faction')) DEFAULT 'core',
  faction_id uuid REFERENCES public.factions(id) ON DELETE CASCADE,
  detachment_id uuid REFERENCES public.detachments(id) ON DELETE CASCADE,
  phase text NOT NULL,
  cp_cost integer NOT NULL DEFAULT 1,
  when_text text NOT NULL,
  effect_text text NOT NULL,
  restrictions text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stratagems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read stratagems" ON public.stratagems FOR SELECT USING (true);

CREATE INDEX idx_stratagems_faction ON public.stratagems (faction_id) WHERE faction_id IS NOT NULL;
CREATE INDEX idx_stratagems_detachment ON public.stratagems (detachment_id) WHERE detachment_id IS NOT NULL;
CREATE INDEX idx_stratagems_type ON public.stratagems (type);

-- ============================================================
-- USER DATA TABLES (owner-only via RLS)
-- ============================================================

-- Game sessions
CREATE TABLE public.game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  army_list_id uuid NOT NULL REFERENCES public.army_lists(id),
  mission_id uuid REFERENCES public.missions(id),
  opponent_name text,
  opponent_faction text,
  status text NOT NULL CHECK (status IN ('setup', 'active', 'paused', 'completed')) DEFAULT 'setup',
  current_round integer NOT NULL DEFAULT 1,
  current_phase integer NOT NULL DEFAULT 0,
  player_turn text NOT NULL CHECK (player_turn IN ('player', 'opponent')) DEFAULT 'player',
  cp integer NOT NULL DEFAULT 0,
  my_vp integer NOT NULL DEFAULT 0,
  opponent_vp integer NOT NULL DEFAULT 0,
  result text CHECK (result IN ('win', 'loss', 'draw')),
  timer_player_seconds integer NOT NULL DEFAULT 0,
  timer_opponent_seconds integer NOT NULL DEFAULT 0,
  invite_code text UNIQUE,
  notes text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Owner CRUD
CREATE POLICY "Owner select own sessions"
  ON public.game_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Owner insert own sessions"
  ON public.game_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner update own sessions"
  ON public.game_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner delete own sessions"
  ON public.game_sessions FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_game_sessions_user ON public.game_sessions (user_id);
CREATE INDEX idx_game_sessions_army_list ON public.game_sessions (army_list_id);
CREATE INDEX idx_game_sessions_status ON public.game_sessions (status) WHERE status IN ('active', 'paused');

-- Updated_at trigger
CREATE TRIGGER game_sessions_updated_at
  BEFORE UPDATE ON public.game_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Game session events (timestamped log)
CREATE TABLE public.game_session_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id uuid NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  round integer NOT NULL,
  phase integer NOT NULL,
  event_type text NOT NULL,
  description text NOT NULL,
  data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.game_session_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner select session events"
  ON public.game_session_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = game_session_events.game_session_id
      AND gs.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner insert session events"
  ON public.game_session_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = game_session_events.game_session_id
      AND gs.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner delete session events"
  ON public.game_session_events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = game_session_events.game_session_id
      AND gs.user_id = auth.uid()
    )
  );

CREATE INDEX idx_game_session_events_session ON public.game_session_events (game_session_id);

-- Game session scores (VP breakdown per round per objective)
CREATE TABLE public.game_session_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id uuid NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  round integer NOT NULL,
  objective_name text NOT NULL,
  vp_scored integer NOT NULL DEFAULT 0,
  UNIQUE(game_session_id, round, objective_name)
);

ALTER TABLE public.game_session_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner select session scores"
  ON public.game_session_scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = game_session_scores.game_session_id
      AND gs.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner insert session scores"
  ON public.game_session_scores FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = game_session_scores.game_session_id
      AND gs.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner upsert session scores"
  ON public.game_session_scores FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = game_session_scores.game_session_id
      AND gs.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = game_session_scores.game_session_id
      AND gs.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner delete session scores"
  ON public.game_session_scores FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = game_session_scores.game_session_id
      AND gs.user_id = auth.uid()
    )
  );

CREATE INDEX idx_game_session_scores_session ON public.game_session_scores (game_session_id);

-- Game session unit states (casualty/wound tracking)
CREATE TABLE public.game_session_unit_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id uuid NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  army_list_unit_id uuid NOT NULL REFERENCES public.army_list_units(id),
  model_states jsonb NOT NULL DEFAULT '[]',
  UNIQUE(game_session_id, army_list_unit_id)
);

ALTER TABLE public.game_session_unit_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner select unit states"
  ON public.game_session_unit_states FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = game_session_unit_states.game_session_id
      AND gs.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner insert unit states"
  ON public.game_session_unit_states FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = game_session_unit_states.game_session_id
      AND gs.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner update unit states"
  ON public.game_session_unit_states FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = game_session_unit_states.game_session_id
      AND gs.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = game_session_unit_states.game_session_id
      AND gs.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner delete unit states"
  ON public.game_session_unit_states FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.game_sessions gs
      WHERE gs.id = game_session_unit_states.game_session_id
      AND gs.user_id = auth.uid()
    )
  );

CREATE INDEX idx_game_session_unit_states_session ON public.game_session_unit_states (game_session_id);

-- ============================================================
-- SEED: Core Stratagems (10th Edition)
-- ============================================================

INSERT INTO public.stratagems (name, type, phase, cp_cost, when_text, effect_text, restrictions) VALUES
('Command Re-roll', 'core', 'Any', 1,
  'Any phase, just after you have made a Hit roll, a Wound roll, a Damage roll, a saving throw, an Advance roll, a Charge roll, a Desperate Escape test, a Hazardous test, or just after you have rolled the dice to determine the number of attacks made with a weapon.',
  'You re-roll that roll, test or saving throw.',
  NULL),
('Counter-offensive', 'core', 'Fight', 2,
  'Fight phase, just after an enemy unit has fought.',
  'Select one of your units that is within Engagement Range of one or more enemy units and that has not already been selected to fight this phase. That unit fights next.',
  NULL),
('Epic Challenge', 'core', 'Fight', 1,
  'Fight phase, when a Character unit from your army that is within Engagement Range of one or more Attached units is selected to fight.',
  'Until the end of the phase, melee attacks made by Character models in your unit can only target the enemy Character unit.',
  NULL),
('Fire Overwatch', 'core', 'Opponent''s Movement/Charge', 1,
  'Your opponent''s Movement or Charge phase, just after an enemy unit is set up or when an enemy unit starts or ends a Normal, Advance, Fall Back, or Charge move.',
  'Your unit can shoot that enemy unit as if it were your Shooting phase, but hit on unmodified 6s only and cannot use Hazardous weapons.',
  'Cannot be used during a phase in which your unit has already been selected to shoot.'),
('Go to Ground', 'core', 'Opponent''s Shooting', 1,
  'Your opponent''s Shooting phase, just after an enemy unit has selected its targets.',
  'Until the end of the phase, all models in your unit have a 6+ invulnerable save and have the Benefit of Cover.',
  NULL),
('Grenade', 'core', 'Shooting', 1,
  'Your Shooting phase, select one unit from your army that is not within Engagement Range of any enemy units and has not been selected to shoot this phase.',
  'Select one enemy unit within 8" of and visible to your unit. Roll six D6: for each 4+, that enemy unit suffers 1 mortal wound.',
  'Unit must have the Grenades keyword.'),
('Heroic Intervention', 'core', 'Opponent''s Charge', 2,
  'Your opponent''s Charge phase, just after an enemy unit ends a Charge move.',
  'Select one of your units that is within 6" of that enemy unit and not within Engagement Range of any enemy units. Your unit can make a D6" move but must end closer to the nearest enemy model.',
  NULL),
('Insane Bravery', 'core', 'Any', 1,
  'Any phase, just after you fail a Battle-shock test for a unit from your army.',
  'That unit is no longer Battle-shocked.',
  NULL),
('Rapid Ingress', 'core', 'Opponent''s Movement', 1,
  'End of your opponent''s Movement phase.',
  'Select one of your units in Reserves. Set it up anywhere on the battlefield that is more than 9" from all enemy models.',
  NULL),
('Smokescreen', 'core', 'Opponent''s Shooting', 1,
  'Your opponent''s Shooting phase, just after an enemy unit has selected its targets.',
  'Until the end of the phase, all models in your unit have the Benefit of Cover and the Stealth ability.',
  'Unit must have the Smoke keyword.'),
('Tank Shock', 'core', 'Charge', 1,
  'Your Charge phase, select one Vehicle or Monster unit from your army that made a Charge move this phase.',
  'Select one enemy unit within Engagement Range. Roll a number of D6 equal to the Toughness of your unit: for each 5+, that enemy unit suffers 1 mortal wound.',
  'Unit must be a Vehicle or Monster.'),
('Armour of Contempt', 'core', 'Opponent''s Shooting/Fight', 1,
  'Your opponent''s Shooting phase or the Fight phase, just after an enemy unit has selected its targets.',
  'Until the end of the phase, each time an attack targets your unit, worsen the Armour Penetration characteristic of that attack by 1.',
  NULL);

-- ============================================================
-- SEED: Fixed Secondary Objectives (10th Edition)
-- ============================================================

INSERT INTO public.secondary_objectives (name, category, description, max_vp, is_fixed) VALUES
('Bring it Down', 'purge', 'Score VP for destroying enemy Vehicle and Monster units.', 15, true),
('Assassination', 'purge', 'Score VP for destroying enemy Character units.', 15, true),
('Behind Enemy Lines', 'shadow', 'Score VP for having units wholly within your opponent''s deployment zone.', 15, true),
('Engage on All Fronts', 'shadow', 'Score VP for having units in three or more table quarters.', 15, true),
('Deploy Teleport Homer', 'shadow', 'Score VP for deploying a teleport homer in your opponent''s deployment zone.', 15, true),
('Investigate Signals', 'shadow', 'Score VP for performing actions on objective markers.', 15, true),
('Area Denial', 'battlefield', 'Score VP for controlling areas of the battlefield.', 15, true),
('A Tempting Target', 'battlefield', 'Score VP for holding specific objective markers.', 15, true),
('Secure No Man''s Land', 'battlefield', 'Score VP for controlling objective markers in no man''s land.', 15, true),
('Storm Hostile Objective', 'battlefield', 'Score VP for controlling objective markers in your opponent''s territory.', 15, true),
('Extend Battle Lines', 'battlefield', 'Score VP for controlling objective markers in a line across the battlefield.', 15, true),
('Cleanse', 'battlefield', 'Score VP for performing cleanse actions on objective markers.', 15, true);

-- ============================================================
-- Enable Supabase Realtime on game_sessions for multi-device sync
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.game_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_session_unit_states;
