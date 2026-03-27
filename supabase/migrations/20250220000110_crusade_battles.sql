-- ============================================================
-- Phase 4: Crusade Battles, Participants & Requisition
-- ============================================================

-- ============================================================
-- Crusade Battles (battles within a campaign)
-- ============================================================

CREATE TABLE public.crusade_battles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  mission_id uuid REFERENCES public.missions(id),
  game_session_id uuid REFERENCES public.game_sessions(id),
  player1_member_id uuid NOT NULL REFERENCES public.campaign_members(id),
  player2_member_id uuid NOT NULL REFERENCES public.campaign_members(id),
  player1_vp integer NOT NULL DEFAULT 0,
  player2_vp integer NOT NULL DEFAULT 0,
  winner_member_id uuid REFERENCES public.campaign_members(id),
  is_draw boolean NOT NULL DEFAULT false,
  round_number integer,
  notes text,
  played_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.crusade_battles ENABLE ROW LEVEL SECURITY;

-- Campaign members can view battles in their campaign
CREATE POLICY "Members select campaign battles"
  ON public.crusade_battles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.campaign_id = crusade_battles.campaign_id
      AND cm.user_id = auth.uid()
    )
  );

-- Either player or campaign owner can insert battles
CREATE POLICY "Players insert battles"
  ON public.crusade_battles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.campaign_id = crusade_battles.campaign_id
      AND cm.user_id = auth.uid()
    )
  );

-- Either player or campaign owner can update battles
CREATE POLICY "Players update battles"
  ON public.crusade_battles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.campaign_id = crusade_battles.campaign_id
      AND cm.user_id = auth.uid()
      AND (cm.id = crusade_battles.player1_member_id
           OR cm.id = crusade_battles.player2_member_id
           OR cm.role = 'owner')
    )
  );

-- Campaign owner can delete battles
CREATE POLICY "Owner delete battles"
  ON public.crusade_battles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = crusade_battles.campaign_id
      AND c.owner_id = auth.uid()
    )
  );

CREATE INDEX idx_crusade_battles_campaign ON public.crusade_battles (campaign_id);
CREATE INDEX idx_crusade_battles_player1 ON public.crusade_battles (player1_member_id);
CREATE INDEX idx_crusade_battles_player2 ON public.crusade_battles (player2_member_id);

-- ============================================================
-- Battle Participants (which crusade units fought)
-- ============================================================

CREATE TABLE public.crusade_battle_participants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  crusade_battle_id uuid NOT NULL REFERENCES public.crusade_battles(id) ON DELETE CASCADE,
  crusade_unit_id uuid NOT NULL REFERENCES public.crusade_units(id) ON DELETE CASCADE,
  xp_earned integer NOT NULL DEFAULT 0,
  kills_this_battle integer NOT NULL DEFAULT 0,
  survived boolean NOT NULL DEFAULT true,
  UNIQUE(crusade_battle_id, crusade_unit_id)
);

ALTER TABLE public.crusade_battle_participants ENABLE ROW LEVEL SECURITY;

-- Campaign members can view participants
CREATE POLICY "Members select battle participants"
  ON public.crusade_battle_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.crusade_battles cb
      JOIN public.campaign_members cm ON cm.campaign_id = cb.campaign_id
      WHERE cb.id = crusade_battle_participants.crusade_battle_id
      AND cm.user_id = auth.uid()
    )
  );

-- Unit owners can insert/update their participants
CREATE POLICY "Unit owners insert participants"
  ON public.crusade_battle_participants FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.crusade_units cu
      JOIN public.crusade_rosters cr ON cr.id = cu.crusade_roster_id
      JOIN public.campaign_members cm ON cm.id = cr.campaign_member_id
      WHERE cu.id = crusade_battle_participants.crusade_unit_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Unit owners update participants"
  ON public.crusade_battle_participants FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.crusade_units cu
      JOIN public.crusade_rosters cr ON cr.id = cu.crusade_roster_id
      JOIN public.campaign_members cm ON cm.id = cr.campaign_member_id
      WHERE cu.id = crusade_battle_participants.crusade_unit_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Unit owners delete participants"
  ON public.crusade_battle_participants FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.crusade_units cu
      JOIN public.crusade_rosters cr ON cr.id = cu.crusade_roster_id
      JOIN public.campaign_members cm ON cm.id = cr.campaign_member_id
      WHERE cu.id = crusade_battle_participants.crusade_unit_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE INDEX idx_battle_participants_battle ON public.crusade_battle_participants (crusade_battle_id);
CREATE INDEX idx_battle_participants_unit ON public.crusade_battle_participants (crusade_unit_id);

-- ============================================================
-- Requisition Log (RP spending history)
-- ============================================================

CREATE TABLE public.requisition_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_member_id uuid NOT NULL REFERENCES public.campaign_members(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN (
    'increase_supply', 'add_unit', 'remove_scar', 'refit',
    'fresh_recruits', 'battle_earned', 'other'
  )),
  rp_change integer NOT NULL,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.requisition_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner select own requisition log"
  ON public.requisition_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.id = requisition_log.campaign_member_id
      AND cm.user_id = auth.uid()
    )
  );

-- Campaign members can see each other's requisition logs
CREATE POLICY "Members select campaign requisition logs"
  ON public.requisition_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      JOIN public.campaign_members cm2 ON cm2.campaign_id = cm.campaign_id
      WHERE cm.id = requisition_log.campaign_member_id
      AND cm2.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner insert requisition log"
  ON public.requisition_log FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.id = requisition_log.campaign_member_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner delete requisition log"
  ON public.requisition_log FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.id = requisition_log.campaign_member_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE INDEX idx_requisition_log_member ON public.requisition_log (campaign_member_id);
