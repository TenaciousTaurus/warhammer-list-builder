-- ============================================================
-- Phase 4: Crusade & Campaign Mode — Core Tables
-- ============================================================
-- Tables are created first, then RLS policies are added after
-- all tables exist (to avoid forward-reference errors).

-- ============================================================
-- CREATE TABLES
-- ============================================================

CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  share_code text UNIQUE NOT NULL DEFAULT substring(md5(random()::text), 1, 8),
  max_players integer NOT NULL DEFAULT 8,
  points_limit integer NOT NULL DEFAULT 2000,
  status text NOT NULL CHECK (status IN ('recruiting', 'active', 'completed', 'archived')) DEFAULT 'recruiting',
  settings jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.campaign_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('owner', 'player')) DEFAULT 'player',
  display_name text NOT NULL,
  requisition_points integer NOT NULL DEFAULT 5,
  supply_limit integer NOT NULL DEFAULT 1000,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, user_id)
);

CREATE TABLE public.crusade_rosters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_member_id uuid NOT NULL UNIQUE REFERENCES public.campaign_members(id) ON DELETE CASCADE,
  faction_id uuid NOT NULL REFERENCES public.factions(id),
  name text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.crusade_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crusade_roster_id uuid NOT NULL REFERENCES public.crusade_rosters(id) ON DELETE CASCADE,
  unit_id uuid NOT NULL REFERENCES public.units(id),
  custom_name text,
  model_count integer NOT NULL DEFAULT 1,
  points_cost integer NOT NULL DEFAULT 0,
  xp integer NOT NULL DEFAULT 0,
  rank text NOT NULL CHECK (rank IN (
    'battle_ready', 'blooded', 'battle_hardened', 'heroic', 'legendary'
  )) DEFAULT 'battle_ready',
  battles_played integer NOT NULL DEFAULT 0,
  battles_survived integer NOT NULL DEFAULT 0,
  kills integer NOT NULL DEFAULT 0,
  honours jsonb NOT NULL DEFAULT '[]',
  scars jsonb NOT NULL DEFAULT '[]',
  is_destroyed boolean NOT NULL DEFAULT false,
  destroyed_in_battle_id uuid,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- ENABLE RLS
-- ============================================================

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crusade_rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crusade_units ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES: campaigns
-- ============================================================

CREATE POLICY "Owner select own campaigns"
  ON public.campaigns FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Owner insert campaigns"
  ON public.campaigns FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owner update campaigns"
  ON public.campaigns FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owner delete campaigns"
  ON public.campaigns FOR DELETE
  USING (auth.uid() = owner_id);

CREATE POLICY "Members select campaigns"
  ON public.campaigns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.campaign_id = campaigns.id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Public select by share code"
  ON public.campaigns FOR SELECT
  USING (share_code IS NOT NULL);

-- ============================================================
-- RLS POLICIES: campaign_members
-- ============================================================

CREATE POLICY "Members select campaign members"
  ON public.campaign_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm2
      WHERE cm2.campaign_id = campaign_members.campaign_id
      AND cm2.user_id = auth.uid()
    )
  );

CREATE POLICY "Users join campaigns"
  ON public.campaign_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members update own membership"
  ON public.campaign_members FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner update campaign members"
  ON public.campaign_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = campaign_members.campaign_id
      AND c.owner_id = auth.uid()
    )
  );

CREATE POLICY "Members leave campaigns"
  ON public.campaign_members FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Owner remove campaign members"
  ON public.campaign_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = campaign_members.campaign_id
      AND c.owner_id = auth.uid()
    )
  );

-- ============================================================
-- RLS POLICIES: crusade_rosters
-- ============================================================

CREATE POLICY "Owner select own roster"
  ON public.crusade_rosters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.id = crusade_rosters.campaign_member_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Members select campaign rosters"
  ON public.crusade_rosters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      JOIN public.campaign_members cm2 ON cm2.campaign_id = cm.campaign_id
      WHERE cm.id = crusade_rosters.campaign_member_id
      AND cm2.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner insert roster"
  ON public.crusade_rosters FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.id = crusade_rosters.campaign_member_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner update roster"
  ON public.crusade_rosters FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.id = crusade_rosters.campaign_member_id
      AND cm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.id = crusade_rosters.campaign_member_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner delete roster"
  ON public.crusade_rosters FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.id = crusade_rosters.campaign_member_id
      AND cm.user_id = auth.uid()
    )
  );

-- ============================================================
-- RLS POLICIES: crusade_units
-- ============================================================

CREATE POLICY "Owner select own units"
  ON public.crusade_units FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.crusade_rosters cr
      JOIN public.campaign_members cm ON cm.id = cr.campaign_member_id
      WHERE cr.id = crusade_units.crusade_roster_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Members select campaign units"
  ON public.crusade_units FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.crusade_rosters cr
      JOIN public.campaign_members cm ON cm.id = cr.campaign_member_id
      JOIN public.campaign_members cm2 ON cm2.campaign_id = cm.campaign_id
      WHERE cr.id = crusade_units.crusade_roster_id
      AND cm2.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner insert units"
  ON public.crusade_units FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.crusade_rosters cr
      JOIN public.campaign_members cm ON cm.id = cr.campaign_member_id
      WHERE cr.id = crusade_units.crusade_roster_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner update units"
  ON public.crusade_units FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.crusade_rosters cr
      JOIN public.campaign_members cm ON cm.id = cr.campaign_member_id
      WHERE cr.id = crusade_units.crusade_roster_id
      AND cm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.crusade_rosters cr
      JOIN public.campaign_members cm ON cm.id = cr.campaign_member_id
      WHERE cr.id = crusade_units.crusade_roster_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner delete units"
  ON public.crusade_units FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.crusade_rosters cr
      JOIN public.campaign_members cm ON cm.id = cr.campaign_member_id
      WHERE cr.id = crusade_units.crusade_roster_id
      AND cm.user_id = auth.uid()
    )
  );

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_campaigns_owner ON public.campaigns (owner_id);
CREATE INDEX idx_campaigns_share_code ON public.campaigns (share_code);
CREATE INDEX idx_campaigns_status ON public.campaigns (status) WHERE status IN ('recruiting', 'active');

CREATE INDEX idx_campaign_members_campaign ON public.campaign_members (campaign_id);
CREATE INDEX idx_campaign_members_user ON public.campaign_members (user_id);

CREATE INDEX idx_crusade_rosters_member ON public.crusade_rosters (campaign_member_id);

CREATE INDEX idx_crusade_units_roster ON public.crusade_units (crusade_roster_id);
CREATE INDEX idx_crusade_units_unit ON public.crusade_units (unit_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER crusade_rosters_updated_at
  BEFORE UPDATE ON public.crusade_rosters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER crusade_units_updated_at
  BEFORE UPDATE ON public.crusade_units
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
