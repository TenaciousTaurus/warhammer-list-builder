-- ============================================================================
-- Migration: Data source tracking on factions (W1-6 Multi-Source Abstraction)
-- Adds data_source and data_source_updated_at so the UI can show freshness
-- and future sources (e.g. 11th Edition, Wahapedia) can coexist.
-- ============================================================================

ALTER TABLE public.factions
  ADD COLUMN IF NOT EXISTS data_source TEXT NOT NULL DEFAULT 'bsdata',
  ADD COLUMN IF NOT EXISTS data_source_updated_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_factions_data_source ON public.factions (data_source);
