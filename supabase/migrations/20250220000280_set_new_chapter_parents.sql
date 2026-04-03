-- Set parent_faction_id for newly added chapters
UPDATE factions SET parent_faction_id = '9f7c3840-0b7c-face-ee6a-35dd8ca20220'
WHERE name IN ('Imperial Fists', 'Iron Hands', 'Raven Guard', 'Salamanders', 'White Scars')
  AND parent_faction_id IS NULL;

-- Ynnari -> Aeldari
UPDATE factions SET parent_faction_id = (SELECT id FROM factions WHERE name = 'Aeldari')
WHERE name = 'Ynnari' AND parent_faction_id IS NULL;

-- Emperor's Children -> Chaos Space Marines
UPDATE factions SET parent_faction_id = (SELECT id FROM factions WHERE name = 'Chaos Space Marines')
WHERE name = 'Emperor''s Children' AND parent_faction_id IS NULL;

-- Clean up Index placeholder detachments for new chapters that inherit parent detachments
DO $$
DECLARE
  idx_det RECORD;
  replacement_id uuid;
BEGIN
  FOR idx_det IN
    SELECT d.id, d.faction_id, f.parent_faction_id
    FROM detachments d
    JOIN factions f ON f.id = d.faction_id
    WHERE d.name = 'Index'
      AND f.name IN ('Imperial Fists', 'Iron Hands', 'Raven Guard',
                     'Salamanders', 'White Scars', 'Ynnari')
      AND f.parent_faction_id IS NOT NULL
  LOOP
    -- Find replacement from parent faction
    SELECT dd.id INTO replacement_id
    FROM detachments dd
    WHERE dd.faction_id = idx_det.parent_faction_id
      AND dd.name != 'Index'
    ORDER BY dd.name
    LIMIT 1;

    IF replacement_id IS NOT NULL THEN
      UPDATE army_lists SET detachment_id = replacement_id
      WHERE detachment_id = idx_det.id;
    END IF;

    DELETE FROM detachments WHERE id = idx_det.id;
  END LOOP;
END $$;
