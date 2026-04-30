-- Add selection classification to wargear_options.
--
-- is_required: true  → item is always equipped (min=1, max=1 in BSData).
--              These are shown on the datasheet only — never as a user choice.
-- is_required: false → item is a genuine choice (optional or pick-one-from-group).
--
-- All existing rows default to false (preserves current behaviour while the
-- parser re-seed fills in the correct values).

alter table public.wargear_options
  add column if not exists is_required boolean not null default false;

-- Index is useful: the UI filters on this column for every unit load.
create index if not exists idx_wargear_options_required
  on public.wargear_options (unit_id, is_required);
