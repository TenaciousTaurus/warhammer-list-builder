-- Sub-options for wargear choices that are themselves groups (e.g. "Drones (0-2)").
-- Each row is one selectable type within the parent group (e.g. "Marker Drone").
--
-- pool_max on the parent wargear_options row is the TOTAL allowed across all
-- sub-option types (e.g. 2 for Drones). max_count here is the per-type cap
-- (e.g. Guardian Drone = 1, all others = 2).

create table public.wargear_sub_options (
  id          uuid primary key default gen_random_uuid(),
  wargear_option_id uuid not null references public.wargear_options(id) on delete cascade,
  name        text not null,
  max_count   integer not null default 2,
  points      integer not null default 0,
  unique (wargear_option_id, name)
);

create index idx_wargear_sub_options_parent on public.wargear_sub_options(wargear_option_id);

-- User's sub-option selections (e.g. "2× Marker Drone" for a Cadre Fireblade).
-- One row per chosen sub-type per unit-wargear record.

create table public.army_list_unit_wargear_sub (
  id                      uuid primary key default gen_random_uuid(),
  army_list_unit_wargear_id uuid not null references public.army_list_unit_wargear(id) on delete cascade,
  wargear_sub_option_id   uuid not null references public.wargear_sub_options(id) on delete cascade,
  quantity                integer not null default 1 check (quantity >= 1),
  unique (army_list_unit_wargear_id, wargear_sub_option_id)
);

create index idx_aluw_sub_wargear on public.army_list_unit_wargear_sub(army_list_unit_wargear_id);

-- RLS
alter table public.wargear_sub_options enable row level security;
alter table public.army_list_unit_wargear_sub enable row level security;

-- Sub-options are game data — public read
create policy "wargear_sub_options_read" on public.wargear_sub_options
  for select using (true);

-- User wargear sub-selections are owner-only (via army_list_unit_wargear → army_list_units → army_lists)
create policy "aluw_sub_owner" on public.army_list_unit_wargear_sub
  for all using (
    exists (
      select 1
      from public.army_list_unit_wargear aluw
      join public.army_list_units alu on alu.id = aluw.army_list_unit_id
      join public.army_lists al on al.id = alu.army_list_id
      where aluw.id = army_list_unit_wargear_sub.army_list_unit_wargear_id
        and al.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.army_list_unit_wargear aluw
      join public.army_list_units alu on alu.id = aluw.army_list_unit_id
      join public.army_lists al on al.id = alu.army_list_id
      where aluw.id = army_list_unit_wargear_sub.army_list_unit_wargear_id
        and al.user_id = auth.uid()
    )
  );
