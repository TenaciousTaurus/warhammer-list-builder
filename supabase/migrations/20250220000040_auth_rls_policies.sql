-- =============================================
-- Phase 3: Replace permissive RLS policies with
-- proper auth-based owner-only policies.
-- Game data (factions, units, weapons, etc.) stays public-read.
-- User data (army_lists, list_units, etc.) is owner-only.
-- Shared lists (share_code IS NOT NULL) remain publicly readable.
-- =============================================

-- =============================================
-- 1. army_lists: owner-only CRUD
-- =============================================
DROP POLICY IF EXISTS "Allow all army_lists" ON public.army_lists;

-- Owner can see their own lists
CREATE POLICY "Owner select own lists"
  ON public.army_lists FOR SELECT
  USING (auth.uid() = user_id);
-- Note: "Public read shared lists" policy from migration 30 still applies
-- (share_code IS NOT NULL), allowing unauthenticated access to shared lists.

-- Owner can create lists (user_id must match auth)
CREATE POLICY "Owner insert own lists"
  ON public.army_lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Owner can update their own lists
CREATE POLICY "Owner update own lists"
  ON public.army_lists FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Owner can delete their own lists
CREATE POLICY "Owner delete own lists"
  ON public.army_lists FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- 2. army_list_units: owner-only via join
-- =============================================
DROP POLICY IF EXISTS "Allow all army_list_units" ON public.army_list_units;

-- Owner CRUD on list units (checked via parent army_list)
CREATE POLICY "Owner select list units"
  ON public.army_list_units FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.army_lists
      WHERE army_lists.id = army_list_units.army_list_id
      AND army_lists.user_id = auth.uid()
    )
  );
-- Note: "Public read shared list units" policy from migration 30 still applies.

CREATE POLICY "Owner insert list units"
  ON public.army_list_units FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.army_lists
      WHERE army_lists.id = army_list_units.army_list_id
      AND army_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner update list units"
  ON public.army_list_units FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.army_lists
      WHERE army_lists.id = army_list_units.army_list_id
      AND army_lists.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.army_lists
      WHERE army_lists.id = army_list_units.army_list_id
      AND army_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner delete list units"
  ON public.army_list_units FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.army_lists
      WHERE army_lists.id = army_list_units.army_list_id
      AND army_lists.user_id = auth.uid()
    )
  );

-- =============================================
-- 3. army_list_enhancements: owner-only via join
-- =============================================
DROP POLICY IF EXISTS "Allow all army_list_enhancements" ON public.army_list_enhancements;

CREATE POLICY "Owner select list enhancements"
  ON public.army_list_enhancements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.army_lists al
      JOIN public.army_list_units alu ON alu.army_list_id = al.id
      WHERE alu.id = army_list_enhancements.army_list_unit_id
      AND al.user_id = auth.uid()
    )
  );
-- Note: "Public read shared list enhancements" policy from migration 30 still applies.

CREATE POLICY "Owner insert list enhancements"
  ON public.army_list_enhancements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.army_lists al
      JOIN public.army_list_units alu ON alu.army_list_id = al.id
      WHERE alu.id = army_list_enhancements.army_list_unit_id
      AND al.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner update list enhancements"
  ON public.army_list_enhancements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.army_lists al
      JOIN public.army_list_units alu ON alu.army_list_id = al.id
      WHERE alu.id = army_list_enhancements.army_list_unit_id
      AND al.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.army_lists al
      JOIN public.army_list_units alu ON alu.army_list_id = al.id
      WHERE alu.id = army_list_enhancements.army_list_unit_id
      AND al.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner delete list enhancements"
  ON public.army_list_enhancements FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.army_lists al
      JOIN public.army_list_units alu ON alu.army_list_id = al.id
      WHERE alu.id = army_list_enhancements.army_list_unit_id
      AND al.user_id = auth.uid()
    )
  );

-- =============================================
-- 4. army_list_unit_wargear: owner-only via join
-- =============================================
DROP POLICY IF EXISTS "army_list_unit_wargear_all" ON public.army_list_unit_wargear;

CREATE POLICY "Owner select list wargear"
  ON public.army_list_unit_wargear FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.army_list_units alu
      JOIN public.army_lists al ON al.id = alu.army_list_id
      WHERE alu.id = army_list_unit_wargear.army_list_unit_id
      AND al.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner insert list wargear"
  ON public.army_list_unit_wargear FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.army_list_units alu
      JOIN public.army_lists al ON al.id = alu.army_list_id
      WHERE alu.id = army_list_unit_wargear.army_list_unit_id
      AND al.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner update list wargear"
  ON public.army_list_unit_wargear FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.army_list_units alu
      JOIN public.army_lists al ON al.id = alu.army_list_id
      WHERE alu.id = army_list_unit_wargear.army_list_unit_id
      AND al.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.army_list_units alu
      JOIN public.army_lists al ON al.id = alu.army_list_id
      WHERE alu.id = army_list_unit_wargear.army_list_unit_id
      AND al.user_id = auth.uid()
    )
  );

CREATE POLICY "Owner delete list wargear"
  ON public.army_list_unit_wargear FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.army_list_units alu
      JOIN public.army_lists al ON al.id = alu.army_list_id
      WHERE alu.id = army_list_unit_wargear.army_list_unit_id
      AND al.user_id = auth.uid()
    )
  );

-- Public read for wargear in shared lists (missing from migration 30)
CREATE POLICY "Public read shared list wargear"
  ON public.army_list_unit_wargear FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.army_list_units alu
      JOIN public.army_lists al ON al.id = alu.army_list_id
      WHERE alu.id = army_list_unit_wargear.army_list_unit_id
      AND al.share_code IS NOT NULL
    )
  );

-- =============================================
-- 5. Update duplicate_army_list to use auth.uid()
-- =============================================
CREATE OR REPLACE FUNCTION public.duplicate_army_list(source_list_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
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
  END LOOP;

  RETURN v_new_list_id;
END;
$$;

-- Restrict duplicate to authenticated users only
REVOKE EXECUTE ON FUNCTION public.duplicate_army_list(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.duplicate_army_list(uuid) TO authenticated;
