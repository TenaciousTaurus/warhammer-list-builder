-- W2-10: Restore army list from a saved version snapshot.
-- Creates a new army_list named "<original name> (restored)" and copies
-- only the top-level metadata from the snapshot. Unit rows are NOT restored
-- because wargear/composition FK integrity depends on live game data;
-- the caller receives the new list id and can open it in the editor.

CREATE OR REPLACE FUNCTION restore_army_list_version(
  p_version_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_snapshot      JSONB;
  v_list_row      JSONB;
  v_original_name TEXT;
  v_new_id        UUID;
BEGIN
  -- Ownership gate: version must belong to a list the caller owns
  SELECT snapshot INTO v_snapshot
  FROM   army_list_versions alv
  JOIN   army_lists         al ON al.id = alv.list_id
  WHERE  alv.id         = p_version_id
    AND  al.user_id     = auth.uid();

  IF v_snapshot IS NULL THEN
    RAISE EXCEPTION 'version not found or access denied';
  END IF;

  v_list_row      := v_snapshot -> 'list';
  v_original_name := v_list_row ->> 'name';

  INSERT INTO army_lists (
    user_id,
    name,
    faction_id,
    detachment_id,
    points_limit,
    battle_size,
    edition
  )
  VALUES (
    auth.uid(),
    v_original_name || ' (restored)',
    (v_list_row ->> 'faction_id')::UUID,
    (v_list_row ->> 'detachment_id')::UUID,
    COALESCE((v_list_row ->> 'points_limit')::INT, 2000),
    COALESCE(v_list_row ->> 'battle_size', 'strike_force'),
    COALESCE(v_list_row ->> 'edition', '10th')
  )
  RETURNING id INTO v_new_id;

  RETURN v_new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION restore_army_list_version(UUID) TO authenticated;
REVOKE EXECUTE ON FUNCTION restore_army_list_version(UUID) FROM PUBLIC;
