-- ============================================================
-- Model composition and leader attachment tables.
-- These were previously embedded in the seed migration but need
-- to exist before 000060_security_and_indexes.sql runs.
-- ============================================================

-- Unit model variants (e.g. "Plague Champion", "Plague Marine")
CREATE TABLE IF NOT EXISTS public.unit_model_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  name text NOT NULL,
  min_count integer NOT NULL DEFAULT 0,
  max_count integer NOT NULL DEFAULT 10,
  default_count integer NOT NULL DEFAULT 0,
  is_leader boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  group_name text,
  UNIQUE(unit_id, name)
);
CREATE INDEX IF NOT EXISTS idx_unit_model_variants_unit ON public.unit_model_variants(unit_id);

ALTER TABLE public.unit_model_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read model variants"
  ON public.unit_model_variants FOR SELECT USING (true);

-- Army list unit composition (model counts per variant)
CREATE TABLE IF NOT EXISTS public.army_list_unit_composition (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  army_list_unit_id uuid NOT NULL REFERENCES public.army_list_units(id) ON DELETE CASCADE,
  model_variant_id uuid NOT NULL REFERENCES public.unit_model_variants(id) ON DELETE CASCADE,
  count integer NOT NULL DEFAULT 0,
  UNIQUE(army_list_unit_id, model_variant_id)
);
CREATE INDEX IF NOT EXISTS idx_army_list_unit_composition_alu ON public.army_list_unit_composition(army_list_unit_id);

ALTER TABLE public.army_list_unit_composition ENABLE ROW LEVEL SECURITY;
-- Permissive until locked down in 000060_security_and_indexes
CREATE POLICY "army_list_unit_composition_all"
  ON public.army_list_unit_composition USING (true) WITH CHECK (true);

-- Unit leader targets (which leaders can join which units)
CREATE TABLE IF NOT EXISTS public.unit_leader_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  leader_unit_id uuid NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  target_unit_id uuid NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  UNIQUE(leader_unit_id, target_unit_id)
);
CREATE INDEX IF NOT EXISTS idx_unit_leader_targets_leader ON public.unit_leader_targets(leader_unit_id);
CREATE INDEX IF NOT EXISTS idx_unit_leader_targets_target ON public.unit_leader_targets(target_unit_id);

ALTER TABLE public.unit_leader_targets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read leader targets"
  ON public.unit_leader_targets FOR SELECT USING (true);

-- Army list leader attachments (leader-to-bodyguard unit pairings in a list)
CREATE TABLE IF NOT EXISTS public.army_list_leader_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  army_list_id uuid NOT NULL REFERENCES public.army_lists(id) ON DELETE CASCADE,
  leader_army_list_unit_id uuid NOT NULL REFERENCES public.army_list_units(id) ON DELETE CASCADE,
  target_army_list_unit_id uuid NOT NULL REFERENCES public.army_list_units(id) ON DELETE CASCADE,
  UNIQUE(leader_army_list_unit_id)
);
CREATE INDEX IF NOT EXISTS idx_army_list_leader_attachments_list ON public.army_list_leader_attachments(army_list_id);
CREATE INDEX IF NOT EXISTS idx_army_list_leader_attachments_target ON public.army_list_leader_attachments(target_army_list_unit_id);

ALTER TABLE public.army_list_leader_attachments ENABLE ROW LEVEL SECURITY;
-- Permissive until locked down in 000060_security_and_indexes
CREATE POLICY "Allow all leader attachments"
  ON public.army_list_leader_attachments USING (true) WITH CHECK (true);
