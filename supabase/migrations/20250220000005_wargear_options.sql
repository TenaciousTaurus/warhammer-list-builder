-- Wargear options: equipment choices available to a unit
-- Each option belongs to a group (e.g. "Weapon 1", "Sponson Weapons").
-- Within a group, users pick exactly one option (mutually exclusive).

create table public.wargear_options (
  id uuid primary key default uuid_generate_v4(),
  unit_id uuid not null references public.units(id) on delete cascade,
  group_name text not null,         -- e.g. "Wargear", "Weapon 1", "Sponson Weapons"
  name text not null,               -- e.g. "Storm Bolter", "Combi-weapon"
  is_default boolean not null default false,  -- first option in group is typically default
  points integer not null default 0  -- additional points cost (usually 0 in 10th ed)
);

create index idx_wargear_options_unit on public.wargear_options(unit_id);
create unique index idx_wargear_options_unique on public.wargear_options(unit_id, group_name, name);

-- User's wargear selections per unit in an army list
create table public.army_list_unit_wargear (
  id uuid primary key default uuid_generate_v4(),
  army_list_unit_id uuid not null references public.army_list_units(id) on delete cascade,
  wargear_option_id uuid not null references public.wargear_options(id) on delete cascade,
  unique(army_list_unit_id, wargear_option_id)
);

create index idx_army_list_unit_wargear_alu on public.army_list_unit_wargear(army_list_unit_id);

-- RLS policies
alter table public.wargear_options enable row level security;
alter table public.army_list_unit_wargear enable row level security;

-- Wargear options are public-read (game data)
create policy "wargear_options_read" on public.wargear_options for select using (true);

-- Army list unit wargear: permissive for now (auth not yet implemented)
create policy "army_list_unit_wargear_all" on public.army_list_unit_wargear for all using (true) with check (true);
