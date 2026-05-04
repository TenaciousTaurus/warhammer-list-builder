-- W3-4: Crusade Narrative Log
-- Adds a JSONB narrative journal to campaigns.
-- Each entry: { id, title, content, author, created_at }

ALTER TABLE campaigns
  ADD COLUMN IF NOT EXISTS narrative_entries JSONB NOT NULL DEFAULT '[]'::jsonb;
