-- Duplicate army list function (atomic copy of list + units + enhancements + wargear)
CREATE OR REPLACE FUNCTION public.duplicate_army_list(source_list_id uuid)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_new_list_id uuid;
  v_old_unit_id uuid;
  v_new_unit_id uuid;
  rec RECORD;
BEGIN
  -- Copy the army list
  INSERT INTO public.army_lists (user_id, name, faction_id, detachment_id, points_limit)
  SELECT user_id, name || ' (Copy)', faction_id, detachment_id, points_limit
  FROM public.army_lists WHERE id = source_list_id
  RETURNING id INTO v_new_list_id;

  IF v_new_list_id IS NULL THEN
    RAISE EXCEPTION 'Source list not found: %', source_list_id;
  END IF;

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

GRANT EXECUTE ON FUNCTION public.duplicate_army_list(uuid) TO anon, authenticated;

-- Add share_code column for URL-based list sharing
ALTER TABLE public.army_lists ADD COLUMN IF NOT EXISTS share_code text UNIQUE;

-- Public read access for shared lists
CREATE POLICY "Public read shared lists"
  ON public.army_lists
  FOR SELECT
  USING (share_code IS NOT NULL);

-- Public read for units in shared lists
CREATE POLICY "Public read shared list units"
  ON public.army_list_units
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.army_lists
      WHERE army_lists.id = army_list_units.army_list_id
      AND army_lists.share_code IS NOT NULL
    )
  );

-- Public read for enhancements in shared lists
CREATE POLICY "Public read shared list enhancements"
  ON public.army_list_enhancements
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.army_lists al
      JOIN public.army_list_units alu ON alu.army_list_id = al.id
      WHERE alu.id = army_list_enhancements.army_list_unit_id
      AND al.share_code IS NOT NULL
    )
  );
