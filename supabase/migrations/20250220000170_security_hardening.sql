-- =============================================
-- Security Hardening Migration
-- Addresses pentest findings F1/F2/F3:
--   - Defensive drop of any leftover permissive policies
--   - Tighten user_profiles visibility (default private)
--   - Restrict RPC function permissions to authenticated only
-- =============================================

-- =============================================
-- 1. Defensive cleanup: drop any leftover permissive
--    "Allow all" policies from initial migrations.
--    These should already be gone (dropped in migrations
--    040 and 060), but this is a safety net.
-- =============================================

DROP POLICY IF EXISTS "Allow all army_lists" ON public.army_lists;
DROP POLICY IF EXISTS "Allow all army_list_units" ON public.army_list_units;
DROP POLICY IF EXISTS "Allow all army_list_enhancements" ON public.army_list_enhancements;
DROP POLICY IF EXISTS "army_list_unit_wargear_all" ON public.army_list_unit_wargear;
DROP POLICY IF EXISTS "army_list_unit_composition_all" ON public.army_list_unit_composition;
DROP POLICY IF EXISTS "Allow all leader attachments" ON public.army_list_leader_attachments;

-- =============================================
-- 2. Tighten user_profiles visibility
--    - New profiles default to private (is_public = false)
--    - Only authenticated users can see public profiles
--      (prevents anonymous enumeration of all users)
-- =============================================

-- Change default so new users are private unless they opt in
ALTER TABLE public.user_profiles
  ALTER COLUMN is_public SET DEFAULT false;

-- Drop the current policy that allows anonymous reads of public profiles
DROP POLICY IF EXISTS "Public select public profiles" ON public.user_profiles;

-- Replace with authenticated-only access to public profiles
CREATE POLICY "Authenticated select public profiles"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() IS NOT NULL AND is_public = true);

-- Owner can still always see their own profile (existing policy unchanged)
-- "Owner select own profile" USING (auth.uid() = id) remains intact

-- =============================================
-- 3. Restrict RPC function permissions
--    calculate_list_points and validate_army_list
--    were granted to anon — restrict to authenticated only
-- =============================================

REVOKE EXECUTE ON FUNCTION public.calculate_list_points(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.validate_army_list(uuid) FROM anon;

-- Re-create with search_path hardened (defense-in-depth)
CREATE OR REPLACE FUNCTION public.calculate_list_points(list_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_points_limit integer;
  v_unit_points integer;
  v_enhancement_points integer;
  v_total_points integer;
BEGIN
  -- Get the list's points limit
  SELECT points_limit INTO v_points_limit
  FROM public.army_lists
  WHERE id = list_id;

  IF v_points_limit IS NULL THEN
    RAISE EXCEPTION 'Army list not found: %', list_id;
  END IF;

  -- Calculate unit points using tier-matching logic:
  -- For each unit, find the highest tier where tier.model_count <= unit's model_count
  SELECT coalesce(sum(tier_points), 0) INTO v_unit_points
  FROM (
    SELECT DISTINCT ON (alu.id)
      upt.points AS tier_points
    FROM public.army_list_units alu
    JOIN public.unit_points_tiers upt
      ON upt.unit_id = alu.unit_id
      AND upt.model_count <= alu.model_count
    WHERE alu.army_list_id = list_id
    ORDER BY alu.id, upt.model_count DESC
  ) matched_tiers;

  -- Calculate enhancement points
  SELECT coalesce(sum(e.points), 0) INTO v_enhancement_points
  FROM public.army_list_enhancements ale
  JOIN public.enhancements e ON e.id = ale.enhancement_id
  WHERE ale.army_list_id = list_id;

  -- Sum totals
  v_total_points := v_unit_points + v_enhancement_points;

  RETURN jsonb_build_object(
    'total_points', v_total_points,
    'unit_points', v_unit_points,
    'enhancement_points', v_enhancement_points,
    'points_limit', v_points_limit,
    'is_valid', v_total_points <= v_points_limit
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_army_list(list_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_points jsonb;
  v_unit_violations jsonb;
  v_enhancement_violations jsonb;
BEGIN
  -- Get points calculation
  v_points := public.calculate_list_points(list_id);

  -- Check unit count limits against max_per_list (10th Edition muster rules)
  SELECT coalesce(jsonb_agg(jsonb_build_object(
    'unit_id', unit_id,
    'unit_name', unit_name,
    'count', cnt,
    'max_allowed', max_allowed
  )), '[]'::jsonb)
  INTO v_unit_violations
  FROM (
    SELECT u.id AS unit_id, u.name AS unit_name, count(*) AS cnt, u.max_per_list AS max_allowed
    FROM public.army_list_units alu
    JOIN public.units u ON u.id = alu.unit_id
    WHERE alu.army_list_id = list_id
    GROUP BY u.id, u.name, u.max_per_list
    HAVING count(*) > u.max_per_list
  ) violations;

  -- Check enhancement rules (max 3 total, no duplicates, not on Epic Heroes)
  SELECT coalesce(jsonb_agg(violation), '[]'::jsonb)
  INTO v_enhancement_violations
  FROM (
    -- Too many enhancements total (max 3)
    SELECT 'Army has ' || count(*) || ' enhancements (max 3 allowed)' AS violation
    FROM public.army_list_enhancements ale
    WHERE ale.army_list_id = list_id
    HAVING count(*) > 3

    UNION ALL

    -- Duplicate enhancements
    SELECT 'Enhancement "' || e.name || '" is used ' || count(*) || ' times (max 1 allowed)' AS violation
    FROM public.army_list_enhancements ale
    JOIN public.enhancements e ON e.id = ale.enhancement_id
    WHERE ale.army_list_id = list_id
    GROUP BY e.id, e.name
    HAVING count(*) > 1

    UNION ALL

    -- Enhancements on Epic Heroes
    SELECT 'Enhancement "' || e.name || '" assigned to Epic Hero "' || u.name || '"' AS violation
    FROM public.army_list_enhancements ale
    JOIN public.enhancements e ON e.id = ale.enhancement_id
    JOIN public.army_list_units alu ON alu.id = ale.army_list_unit_id
    JOIN public.units u ON u.id = alu.unit_id
    WHERE ale.army_list_id = list_id
      AND u.role = 'epic_hero'
  ) enh_violations;

  RETURN v_points || jsonb_build_object(
    'unit_limit_violations', v_unit_violations,
    'has_unit_limit_violations', jsonb_array_length(v_unit_violations) > 0,
    'enhancement_violations', v_enhancement_violations,
    'has_enhancement_violations', jsonb_array_length(v_enhancement_violations) > 0
  );
END;
$$;

-- Re-apply permissions after function replacement (idempotent)
REVOKE EXECUTE ON FUNCTION public.calculate_list_points(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.validate_army_list(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.calculate_list_points(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_army_list(uuid) TO authenticated;
