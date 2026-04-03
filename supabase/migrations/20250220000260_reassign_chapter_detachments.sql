-- Reassign chapter-specific detachments from Space Marines parent
-- to their correct child faction. The BSData parser put all detachments
-- under Space Marines, but each chapter should own their unique ones.

-- Get faction IDs
-- Space Marines: 9f7c3840-0b7c-face-ee6a-35dd8ca20220 (parent, keep generic detachments)

-- Dark Angels
UPDATE detachments SET faction_id = (SELECT id FROM factions WHERE name = 'Dark Angels')
WHERE faction_id = '9f7c3840-0b7c-face-ee6a-35dd8ca20220'
  AND name IN (
    'Unforgiven Task Force',
    'Inner Circle Task Force',
    'Company of Hunters',
    'Lion',
    'Wrath of the Rock',
    'Librarius Conclave'
  );

-- Blood Angels
UPDATE detachments SET faction_id = (SELECT id FROM factions WHERE name = 'Blood Angels')
WHERE faction_id = '9f7c3840-0b7c-face-ee6a-35dd8ca20220'
  AND name IN (
    'Liberator Assault Group',
    'The Lost Brethren',
    'The Angelic Host',
    'Angelic Inheritors',
    'Rage-Cursed Onslaught'
  );

-- Space Wolves
UPDATE detachments SET faction_id = (SELECT id FROM factions WHERE name = 'Space Wolves')
WHERE faction_id = '9f7c3840-0b7c-face-ee6a-35dd8ca20220'
  AND name IN (
    'Champions of Fenris',
    'Saga of the Hunter',
    'Saga of the Bold',
    'Saga of the Beastslayer',
    'Saga of the Great Wolf'
  );

-- Black Templars
UPDATE detachments SET faction_id = (SELECT id FROM factions WHERE name = 'Black Templars')
WHERE faction_id = '9f7c3840-0b7c-face-ee6a-35dd8ca20220'
  AND name IN (
    'Companions of Vehemence',
    'Vindication Task Force',
    'Godhammer Assault Force',
    'Forgefather',
    'Emperor',
    'Hammer of Avernii',
    'Wrathful Procession'
  );

-- Deathwatch
UPDATE detachments SET faction_id = (SELECT id FROM factions WHERE name = 'Deathwatch')
WHERE faction_id = '9f7c3840-0b7c-face-ee6a-35dd8ca20220'
  AND name IN (
    'Black Spear Task Force',
    'Shadowmark Talon'
  );

-- Ultramarines
UPDATE detachments SET faction_id = (SELECT id FROM factions WHERE name = 'Ultramarines')
WHERE faction_id = '9f7c3840-0b7c-face-ee6a-35dd8ca20220'
  AND name IN (
    'Blade of Ultramar'
  );

-- Also delete the "Index" placeholder detachments from chapters that now have real ones
DELETE FROM detachments
WHERE name = 'Index'
  AND faction_id IN (
    SELECT id FROM factions WHERE name IN (
      'Dark Angels', 'Blood Angels', 'Space Wolves',
      'Black Templars', 'Deathwatch', 'Ultramarines'
    )
  );
