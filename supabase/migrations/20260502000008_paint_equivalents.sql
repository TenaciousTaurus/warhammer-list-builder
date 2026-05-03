-- W2-5: Cross-Brand Paint Equivalents

CREATE TABLE IF NOT EXISTS public.paint_equivalents (
  paint_id            UUID NOT NULL REFERENCES public.paint_library(id) ON DELETE CASCADE,
  equivalent_paint_id UUID NOT NULL REFERENCES public.paint_library(id) ON DELETE CASCADE,
  similarity_score    INT  NOT NULL CHECK (similarity_score BETWEEN 0 AND 100),
  source              TEXT NOT NULL CHECK (source IN ('community', 'lab_match', 'manufacturer')),
  votes               INT  NOT NULL DEFAULT 0,
  PRIMARY KEY (paint_id, equivalent_paint_id),
  CHECK (paint_id <> equivalent_paint_id)
);

CREATE INDEX IF NOT EXISTS idx_paint_equivalents_paint_id
  ON public.paint_equivalents (paint_id);

ALTER TABLE public.paint_equivalents ENABLE ROW LEVEL SECURITY;

-- Public read for all; writes restricted to authenticated (community voting)
CREATE POLICY "paint_equivalents_public_read" ON public.paint_equivalents
  FOR SELECT USING (TRUE);

CREATE POLICY "paint_equivalents_auth_vote" ON public.paint_equivalents
  FOR UPDATE TO authenticated USING (TRUE);

-- RPC: get equivalents for a paint with full paint details
CREATE OR REPLACE FUNCTION public.get_paint_equivalents(p_paint_id UUID)
RETURNS TABLE (
  equivalent_paint_id UUID,
  brand               TEXT,
  range_name          TEXT,
  paint_name          TEXT,
  paint_type          TEXT,
  hex_color           TEXT,
  is_metallic         BOOLEAN,
  similarity_score    INT,
  source              TEXT,
  votes               INT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    pe.equivalent_paint_id,
    pl.brand,
    pl.range_name,
    pl.paint_name,
    pl.paint_type,
    pl.hex_color,
    pl.is_metallic,
    pe.similarity_score,
    pe.source,
    pe.votes
  FROM paint_equivalents pe
  JOIN paint_library pl ON pl.id = pe.equivalent_paint_id
  WHERE pe.paint_id = p_paint_id
  ORDER BY pe.similarity_score DESC, pe.votes DESC
  LIMIT 10;
$$;

GRANT EXECUTE ON FUNCTION public.get_paint_equivalents(UUID) TO anon, authenticated;
