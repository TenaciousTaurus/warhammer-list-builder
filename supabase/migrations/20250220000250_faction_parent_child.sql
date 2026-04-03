-- Add parent_faction_id to support subfaction/chapter relationships
-- e.g. Ultramarines -> Space Marines, Blood Angels -> Space Marines
-- When a child faction is selected, the app should show both the child's
-- units AND the parent's units (they share the parent keyword).

ALTER TABLE factions ADD COLUMN IF NOT EXISTS parent_faction_id uuid REFERENCES factions(id);

CREATE INDEX IF NOT EXISTS idx_factions_parent ON factions (parent_faction_id) WHERE parent_faction_id IS NOT NULL;

-- Set parent for all Space Marine chapters
-- Space Marines faction ID from seed: 9f7c3840-0b7c-face-ee6a-35dd8ca20220
UPDATE factions SET parent_faction_id = '9f7c3840-0b7c-face-ee6a-35dd8ca20220'
WHERE name IN (
  'Ultramarines',
  'Blood Angels',
  'Dark Angels',
  'Space Wolves',
  'Black Templars',
  'Deathwatch',
  'Imperial Fists',
  'Iron Hands',
  'Raven Guard',
  'Salamanders',
  'White Scars'
);

-- Ynnari is a subfaction of Aeldari (Craftworlds)
UPDATE factions SET parent_faction_id = (SELECT id FROM factions WHERE name = 'Aeldari')
WHERE name = 'Ynnari';

-- Emperor's Children is a subfaction of Chaos Space Marines
UPDATE factions SET parent_faction_id = (SELECT id FROM factions WHERE name = 'Chaos Space Marines')
WHERE name = 'Emperor''s Children';
