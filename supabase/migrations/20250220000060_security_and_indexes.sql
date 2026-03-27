-- =============================================
-- Code Review Fixes:
-- 1. Replace permissive RLS on army_list_unit_composition
--    and army_list_leader_attachments with owner-only policies
-- 2. Add search_path to SECURITY DEFINER function
-- 3. Add missing foreign key indexes for performance
-- =============================================

-- =============================================
-- 1a. army_list_unit_composition: owner-only via join
-- =============================================
DROP POLICY IF EXISTS "army_list_unit_composition_all" ON public.army_list_unit_composition;

CREATE POLICY "Owner select composition"
  ON public.army_list_unit_composition FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.army_list_units alu
      JOIN public.army_lists al ON al.id = alu.army_list_id
      WHERE alu.id = army_list_unit_composition.army_list_unit_id
      AND al.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner insert composition"
  ON public.army_list_unit_composition FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.army_list_units alu
      JOIN public.army_lists al ON al.id = alu.army_list_id
      WHERE alu.id = army_list_unit_composition.army_list_unit_id
      AND al.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner update composition"
  ON public.army_list_unit_composition FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.army_list_units alu
      JOIN public.army_lists al ON al.id = alu.army_list_id
      WHERE alu.id = army_list_unit_composition.army_list_unit_id
      AND al.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.army_list_units alu
      JOIN public.army_lists al ON al.id = alu.army_list_id
      WHERE alu.id = army_list_unit_composition.army_list_unit_id
      AND al.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner delete composition"
  ON public.army_list_unit_composition FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.army_list_units alu
      JOIN public.army_lists al ON al.id = alu.army_list_id
      WHERE alu.id = army_list_unit_composition.army_list_unit_id
      AND al.user_id = auth.uid()
    )
  );

-- Public read for shared lists
CREATE POLICY "Public read shared composition"
  ON public.army_list_unit_composition FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.army_list_units alu
      JOIN public.army_lists al ON al.id = alu.army_list_id
      WHERE alu.id = army_list_unit_composition.army_list_unit_id
      AND al.share_code IS NOT NULL
    )
  );

-- =============================================
-- 1b. army_list_leader_attachments: owner-only via join
-- =============================================
DROP POLICY IF EXISTS "Allow all leader attachments" ON public.army_list_leader_attachments;

CREATE POLICY "Owner select leader attachments"
  ON public.army_list_leader_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.army_lists
      WHERE army_lists.id = army_list_leader_attachments.army_list_id
      AND army_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner insert leader attachments"
  ON public.army_list_leader_attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.army_lists
      WHERE army_lists.id = army_list_leader_attachments.army_list_id
      AND army_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner update leader attachments"
  ON public.army_list_leader_attachments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.army_lists
      WHERE army_lists.id = army_list_leader_attachments.army_list_id
      AND army_lists.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.army_lists
      WHERE army_lists.id = army_list_leader_attachments.army_list_id
      AND army_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner delete leader attachments"
  ON public.army_list_leader_attachments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.army_lists
      WHERE army_lists.id = army_list_leader_attachments.army_list_id
      AND army_lists.user_id = auth.uid()
    )
  );

-- Public read for shared lists
CREATE POLICY "Public read shared leader attachments"
  ON public.army_list_leader_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.army_lists
      WHERE army_lists.id = army_list_leader_attachments.army_list_id
      AND army_lists.share_code IS NOT NULL
    )
  );

-- =============================================
-- 2. Fix SECURITY DEFINER: add search_path
-- =============================================
CREATE OR REPLACE FUNCTION public.duplicate_army_list(source_list_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_list_id uuid;
  v_old_unit_id uuid;
  v_new_unit_id uuid;
  v_user_id uuid;
  rec RECORD;
BEGIN
  -- Verify ownership
  SELECT user_id INTO v_user_id
  FROM public.army_lists
  WHERE id = source_list_id;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Source list not found: %', source_list_id;
  END IF;

  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Not authorized to duplicate this list';
  END IF;

  -- Copy the army list (always owned by the current user)
  INSERT INTO public.army_lists (user_id, name, faction_id, detachment_id, points_limit)
  SELECT auth.uid(), name || ' (Copy)', faction_id, detachment_id, points_limit
  FROM public.army_lists WHERE id = source_list_id
  RETURNING id INTO v_new_list_id;

  -- Copy units and build old->new ID mapping
  FOR rec IN
    SELECT id, unit_id, model_count, sort_order
    FROM public.army_list_units
    WHERE army_list_id = source_list_id
    ORDER BY sort_order
  LOOP
    INSERT INTO public.army_list_units (army_list_id, unit_id, model_count, sort_order)
    VALUES (v_new_list_id, rec.unit_id, rec.model_count, rec.sort_order)
    RETURNING id INTO v_new_unit_id;

    v_old_unit_id := rec.id;

    -- Copy enhancements for this unit
    INSERT INTO public.army_list_enhancements (army_list_id, enhancement_id, army_list_unit_id)
    SELECT v_new_list_id, enhancement_id, v_new_unit_id
    FROM public.army_list_enhancements
    WHERE army_list_id = source_list_id AND army_list_unit_id = v_old_unit_id;

    -- Copy wargear selections for this unit
    INSERT INTO public.army_list_unit_wargear (army_list_unit_id, wargear_option_id)
    SELECT v_new_unit_id, wargear_option_id
    FROM public.army_list_unit_wargear
    WHERE army_list_unit_id = v_old_unit_id;

    -- Copy model composition for this unit
    INSERT INTO public.army_list_unit_composition (army_list_unit_id, model_variant_id, count)
    SELECT v_new_unit_id, model_variant_id, count
    FROM public.army_list_unit_composition
    WHERE army_list_unit_id = v_old_unit_id;

    -- Copy leader attachments for this unit
    INSERT INTO public.army_list_leader_attachments (army_list_id, leader_army_list_unit_id, target_army_list_unit_id)
    SELECT v_new_list_id, v_new_unit_id, target_army_list_unit_id
    FROM public.army_list_leader_attachments
    WHERE army_list_id = source_list_id AND leader_army_list_unit_id = v_old_unit_id;
  END LOOP;

  RETURN v_new_list_id;
END;
$$;

-- Keep permissions restricted
REVOKE EXECUTE ON FUNCTION public.duplicate_army_list(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.duplicate_army_list(uuid) TO authenticated;

-- =============================================
-- 3. Add missing foreign key indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_army_list_units_unit ON public.army_list_units(unit_id);
CREATE INDEX IF NOT EXISTS idx_unit_points_tiers_unit ON public.unit_points_tiers(unit_id);
CREATE INDEX IF NOT EXISTS idx_weapons_unit ON public.weapons(unit_id);
CREATE INDEX IF NOT EXISTS idx_abilities_unit ON public.abilities(unit_id);
CREATE INDEX IF NOT EXISTS idx_enhancements_detachment ON public.enhancements(detachment_id);
CREATE INDEX IF NOT EXISTS idx_detachments_faction ON public.detachments(faction_id);
CREATE INDEX IF NOT EXISTS idx_units_faction ON public.units(faction_id);
