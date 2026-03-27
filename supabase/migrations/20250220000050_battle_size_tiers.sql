-- Battle size tiers (10th Edition)
-- Defines the standard game sizes with their points ranges.

CREATE TABLE public.battle_sizes (
  id text PRIMARY KEY,
  name text NOT NULL,
  min_points integer NOT NULL,
  max_points integer NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.battle_sizes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read battle_sizes" ON public.battle_sizes FOR SELECT USING (true);

INSERT INTO public.battle_sizes (id, name, min_points, max_points, sort_order) VALUES
  ('combat_patrol', 'Combat Patrol', 0, 500, 1),
  ('incursion', 'Incursion', 501, 1000, 2),
  ('strike_force', 'Strike Force', 1001, 2000, 3),
  ('onslaught', 'Onslaught', 2001, 3000, 4);

-- Add battle_size column to army_lists (nullable for existing lists)
ALTER TABLE public.army_lists
  ADD COLUMN battle_size text REFERENCES public.battle_sizes(id);

-- Backfill existing lists based on their points_limit
UPDATE public.army_lists SET battle_size = CASE
  WHEN points_limit <= 500 THEN 'combat_patrol'
  WHEN points_limit <= 1000 THEN 'incursion'
  WHEN points_limit <= 2000 THEN 'strike_force'
  ELSE 'onslaught'
END;

-- Make it NOT NULL going forward
ALTER TABLE public.army_lists ALTER COLUMN battle_size SET NOT NULL;
ALTER TABLE public.army_lists ALTER COLUMN battle_size SET DEFAULT 'strike_force';
