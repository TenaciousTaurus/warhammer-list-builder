-- Add alignment to factions so we know which allied factions are available
-- when building a list. Values: 'imperium' | 'chaos' | 'xenos' | 'unaligned'
ALTER TABLE public.factions
  ADD COLUMN IF NOT EXISTS alignment text
  DEFAULT 'xenos'
  CHECK (alignment IN ('imperium', 'chaos', 'xenos', 'unaligned'));

COMMENT ON COLUMN public.factions.alignment IS
  'Faction alignment group. Determines which allied factions can be included in a list.';
