-- Fix infinite recursion in RLS policies for campaign_members and tournament_participants.
-- Both tables had SELECT policies that queried themselves, causing PostgreSQL to
-- re-evaluate the same policy on the inner query indefinitely.
--
-- Fix: create SECURITY DEFINER helper functions that bypass RLS to check membership,
-- then rewrite the self-referencing policies to use them.

-- ============================================================
-- Helper functions (bypass RLS via SECURITY DEFINER)
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_campaign_member(p_campaign_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM campaign_members
    WHERE campaign_id = p_campaign_id AND user_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_tournament_participant(p_tournament_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM tournament_participants
    WHERE tournament_id = p_tournament_id AND user_id = p_user_id
  );
$$;

-- ============================================================
-- Fix campaign_members: replace self-referencing SELECT policy
-- ============================================================

DROP POLICY IF EXISTS "Members select campaign members" ON public.campaign_members;
CREATE POLICY "Members select campaign members" ON public.campaign_members
  FOR SELECT USING (
    public.is_campaign_member(campaign_id, auth.uid())
  );

-- ============================================================
-- Fix campaigns: replace policy that queries campaign_members
-- (which would trigger the old recursive policy)
-- ============================================================

DROP POLICY IF EXISTS "Members select campaigns" ON public.campaigns;
CREATE POLICY "Members select campaigns" ON public.campaigns
  FOR SELECT USING (
    public.is_campaign_member(id, auth.uid())
  );

-- ============================================================
-- Fix tournament_participants: replace self-referencing SELECT
-- ============================================================

DROP POLICY IF EXISTS "Participants select tournament participants" ON public.tournament_participants;
CREATE POLICY "Participants select tournament participants" ON public.tournament_participants
  FOR SELECT USING (
    public.is_tournament_participant(tournament_id, auth.uid())
  );

-- ============================================================
-- Fix tournaments: replace policy that queries tournament_participants
-- ============================================================

DROP POLICY IF EXISTS "Participants select tournaments" ON public.tournaments;
CREATE POLICY "Participants select tournaments" ON public.tournaments
  FOR SELECT USING (
    public.is_tournament_participant(id, auth.uid())
  );
