-- ============================================================================
-- Migration: Paint recipe public sharing (W2-1 Color Scheme Browse + Share)
-- Adds scheme_code (public share token) + public SELECT RLS for published recipes.
-- ============================================================================

ALTER TABLE public.paint_recipes
  ADD COLUMN IF NOT EXISTS scheme_code TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_paint_recipes_scheme_code
  ON public.paint_recipes (scheme_code)
  WHERE scheme_code IS NOT NULL;

-- Allow anon + authenticated users to read publicly shared recipes
CREATE POLICY "Public read public recipes"
  ON public.paint_recipes FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

-- Allow anon + authenticated users to read steps for public recipes
CREATE POLICY "Public read public recipe steps"
  ON public.paint_recipe_steps FOR SELECT
  TO anon, authenticated
  USING (
    recipe_id IN (
      SELECT id FROM public.paint_recipes WHERE is_public = true
    )
  );
