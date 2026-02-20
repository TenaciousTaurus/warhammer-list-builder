-- Server-side points calculation and army list validation
-- Mirrors the client-side logic in ListEditorPage.tsx

-- Calculate total points for an army list
create or replace function public.calculate_list_points(list_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_points_limit integer;
  v_unit_points integer;
  v_enhancement_points integer;
  v_total_points integer;
begin
  -- Get the list's points limit
  select points_limit into v_points_limit
  from public.army_lists
  where id = list_id;

  if v_points_limit is null then
    raise exception 'Army list not found: %', list_id;
  end if;

  -- Calculate unit points using the same tier-matching logic as the client:
  -- For each unit, find the highest tier where tier.model_count <= unit's model_count
  select coalesce(sum(tier_points), 0) into v_unit_points
  from (
    select distinct on (alu.id)
      upt.points as tier_points
    from public.army_list_units alu
    join public.unit_points_tiers upt
      on upt.unit_id = alu.unit_id
      and upt.model_count <= alu.model_count
    where alu.army_list_id = list_id
    order by alu.id, upt.model_count desc
  ) matched_tiers;

  -- Calculate enhancement points
  select coalesce(sum(e.points), 0) into v_enhancement_points
  from public.army_list_enhancements ale
  join public.enhancements e on e.id = ale.enhancement_id
  where ale.army_list_id = list_id;

  -- Sum totals
  v_total_points := v_unit_points + v_enhancement_points;

  return jsonb_build_object(
    'total_points', v_total_points,
    'unit_points', v_unit_points,
    'enhancement_points', v_enhancement_points,
    'points_limit', v_points_limit,
    'is_valid', v_total_points <= v_points_limit
  );
end;
$$;

-- Full army list validation: points + duplicate unique unit detection
create or replace function public.validate_army_list(list_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_points jsonb;
  v_duplicate_units jsonb;
begin
  -- Get points calculation
  v_points := public.calculate_list_points(list_id);

  -- Find duplicate unique units (epic heroes and other units that should only appear once)
  -- Units with role 'epic_hero' are always unique; others may be added multiple times
  select coalesce(jsonb_agg(jsonb_build_object(
    'unit_id', unit_id,
    'unit_name', unit_name,
    'count', cnt
  )), '[]'::jsonb)
  into v_duplicate_units
  from (
    select u.id as unit_id, u.name as unit_name, count(*) as cnt
    from public.army_list_units alu
    join public.units u on u.id = alu.unit_id
    where alu.army_list_id = list_id
      and u.role = 'epic_hero'
    group by u.id, u.name
    having count(*) > 1
  ) dupes;

  return v_points || jsonb_build_object(
    'duplicate_unique_units', v_duplicate_units,
    'has_duplicate_uniques', jsonb_array_length(v_duplicate_units) > 0
  );
end;
$$;

-- Grant execute permissions for the anonymous and authenticated roles
grant execute on function public.calculate_list_points(uuid) to anon, authenticated;
grant execute on function public.validate_army_list(uuid) to anon, authenticated;
