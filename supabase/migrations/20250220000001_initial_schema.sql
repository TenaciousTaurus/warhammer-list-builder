-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- GAME DATA TABLES (public read)
-- ============================================================

-- Factions
create table public.factions (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  icon_url text,
  created_at timestamptz not null default now()
);

-- Detachments
create table public.detachments (
  id uuid primary key default uuid_generate_v4(),
  faction_id uuid not null references public.factions(id) on delete cascade,
  name text not null,
  rule_text text,
  created_at timestamptz not null default now(),
  unique(faction_id, name)
);

-- Units (datasheets)
create table public.units (
  id uuid primary key default uuid_generate_v4(),
  faction_id uuid not null references public.factions(id) on delete cascade,
  name text not null,
  role text not null check (role in (
    'epic_hero', 'character', 'battleline', 'infantry',
    'mounted', 'beast', 'vehicle', 'monster',
    'fortification', 'dedicated_transport', 'allied'
  )),
  movement text not null default '6"',
  toughness integer not null default 4,
  save text not null default '3+',
  wounds integer not null default 1,
  leadership integer not null default 6,
  objective_control integer not null default 1,
  keywords text[] not null default '{}',
  is_unique boolean not null default false,
  created_at timestamptz not null default now()
);

-- Unit points tiers
create table public.unit_points_tiers (
  id uuid primary key default uuid_generate_v4(),
  unit_id uuid not null references public.units(id) on delete cascade,
  model_count integer not null,
  points integer not null,
  unique(unit_id, model_count)
);

-- Weapons
create table public.weapons (
  id uuid primary key default uuid_generate_v4(),
  unit_id uuid not null references public.units(id) on delete cascade,
  name text not null,
  type text not null check (type in ('ranged', 'melee')),
  range text,
  attacks text not null default '1',
  skill text not null default '3+',
  strength integer not null default 4,
  ap integer not null default 0,
  damage text not null default '1',
  keywords text[] not null default '{}'
);

-- Abilities
create table public.abilities (
  id uuid primary key default uuid_generate_v4(),
  unit_id uuid not null references public.units(id) on delete cascade,
  name text not null,
  type text not null check (type in ('core', 'faction', 'unique', 'invulnerable')),
  description text not null
);

-- Enhancements (per detachment)
create table public.enhancements (
  id uuid primary key default uuid_generate_v4(),
  detachment_id uuid not null references public.detachments(id) on delete cascade,
  name text not null,
  points integer not null,
  description text not null
);

-- ============================================================
-- USER DATA TABLES (owner-only access)
-- ============================================================

-- Army lists
create table public.army_lists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  name text not null,
  faction_id uuid not null references public.factions(id),
  detachment_id uuid not null references public.detachments(id),
  points_limit integer not null default 2000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Army list units
create table public.army_list_units (
  id uuid primary key default uuid_generate_v4(),
  army_list_id uuid not null references public.army_lists(id) on delete cascade,
  unit_id uuid not null references public.units(id),
  model_count integer not null default 1,
  sort_order integer not null default 0
);

-- Army list enhancements
create table public.army_list_enhancements (
  id uuid primary key default uuid_generate_v4(),
  army_list_id uuid not null references public.army_lists(id) on delete cascade,
  enhancement_id uuid not null references public.enhancements(id),
  army_list_unit_id uuid not null references public.army_list_units(id) on delete cascade
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Game data tables: public read
alter table public.factions enable row level security;
alter table public.detachments enable row level security;
alter table public.units enable row level security;
alter table public.unit_points_tiers enable row level security;
alter table public.weapons enable row level security;
alter table public.abilities enable row level security;
alter table public.enhancements enable row level security;

create policy "Public read factions" on public.factions for select using (true);
create policy "Public read detachments" on public.detachments for select using (true);
create policy "Public read units" on public.units for select using (true);
create policy "Public read unit_points_tiers" on public.unit_points_tiers for select using (true);
create policy "Public read weapons" on public.weapons for select using (true);
create policy "Public read abilities" on public.abilities for select using (true);
create policy "Public read enhancements" on public.enhancements for select using (true);

-- User data tables: full access for now (auth comes later)
alter table public.army_lists enable row level security;
alter table public.army_list_units enable row level security;
alter table public.army_list_enhancements enable row level security;

-- Permissive policies for local dev (no auth yet)
create policy "Allow all army_lists" on public.army_lists for all using (true) with check (true);
create policy "Allow all army_list_units" on public.army_list_units for all using (true) with check (true);
create policy "Allow all army_list_enhancements" on public.army_list_enhancements for all using (true) with check (true);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger army_lists_updated_at
  before update on public.army_lists
  for each row execute function public.update_updated_at();
