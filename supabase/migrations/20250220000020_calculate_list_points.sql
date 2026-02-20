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

-- Full army list validation: points + unit limit enforcement + enhancement rules
create or replace function public.validate_army_list(list_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_points jsonb;
  v_unit_violations jsonb;
  v_enhancement_violations jsonb;
begin
  -- Get points calculation
  v_points := public.calculate_list_points(list_id);

  -- Check unit count limits against max_per_list (10th Edition muster rules)
  select coalesce(jsonb_agg(jsonb_build_object(
    'unit_id', unit_id,
    'unit_name', unit_name,
    'count', cnt,
    'max_allowed', max_allowed
  )), '[]'::jsonb)
  into v_unit_violations
  from (
    select u.id as unit_id, u.name as unit_name, count(*) as cnt, u.max_per_list as max_allowed
    from public.army_list_units alu
    join public.units u on u.id = alu.unit_id
    where alu.army_list_id = list_id
    group by u.id, u.name, u.max_per_list
    having count(*) > u.max_per_list
  ) violations;

  -- Check enhancement rules (max 3 total, no duplicates, not on Epic Heroes)
  select coalesce(jsonb_agg(violation), '[]'::jsonb)
  into v_enhancement_violations
  from (
    -- Too many enhancements total (max 3)
    select 'Army has ' || count(*) || ' enhancements (max 3 allowed)' as violation
    from public.army_list_enhancements ale
    where ale.army_list_id = list_id
    having count(*) > 3

    union all

    -- Duplicate enhancements
    select 'Enhancement "' || e.name || '" is used ' || count(*) || ' times (max 1 allowed)' as violation
    from public.army_list_enhancements ale
    join public.enhancements e on e.id = ale.enhancement_id
    where ale.army_list_id = list_id
    group by e.id, e.name
    having count(*) > 1

    union all

    -- Enhancements on Epic Heroes
    select 'Enhancement "' || e.name || '" assigned to Epic Hero "' || u.name || '"' as violation
    from public.army_list_enhancements ale
    join public.enhancements e on e.id = ale.enhancement_id
    join public.army_list_units alu on alu.id = ale.army_list_unit_id
    join public.units u on u.id = alu.unit_id
    where ale.army_list_id = list_id
      and u.role = 'epic_hero'
  ) enh_violations;

  return v_points || jsonb_build_object(
    'unit_limit_violations', v_unit_violations,
    'has_unit_limit_violations', jsonb_array_length(v_unit_violations) > 0,
    'enhancement_violations', v_enhancement_violations,
    'has_enhancement_violations', jsonb_array_length(v_enhancement_violations) > 0
  );
end;
$$;

-- Grant execute permissions for the anonymous and authenticated roles
grant execute on function public.calculate_list_points(uuid) to anon, authenticated;
grant execute on function public.validate_army_list(uuid) to anon, authenticated;
