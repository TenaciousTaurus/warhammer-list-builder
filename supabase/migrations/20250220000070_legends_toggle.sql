-- Add is_legends flag to units for Legends/Index unit filtering
ALTER TABLE public.units ADD COLUMN is_legends boolean NOT NULL DEFAULT false;

-- Index for efficient filtering
CREATE INDEX idx_units_is_legends ON public.units (is_legends) WHERE is_legends = true;
