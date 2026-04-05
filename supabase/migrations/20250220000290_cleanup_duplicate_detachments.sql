-- Clean up chapter-specific detachments that are incorrectly stored under
-- the parent Space Marines faction_id. These were created by an older version
-- of the parser before it learned to route detachments to their owning chapter.
-- The correct versions now exist under each chapter's own faction_id.

-- Space Marines parent faction ID
-- 9f7c3840-0b7c-face-ee6a-35dd8ca20220

-- Generic SM detachments that SHOULD stay on the parent:
-- Gladius Task Force, Anvil Siege Force, Ironstorm Spearhead,
-- Firestorm Assault Force, Stormlance Task Force, Vanguard Spearhead,
-- 1st Company Task Force, Librarius Conclave, Bastion Task Force,
-- Orbital Assault Force

-- Delete any detachment on the parent Space Marines faction that is NOT
-- one of the 10 generic detachments. These are stale chapter-specific
-- detachments that should only exist on their chapter faction.
DELETE FROM public.detachments
WHERE faction_id = '9f7c3840-0b7c-face-ee6a-35dd8ca20220'
  AND name NOT IN (
    'Gladius Task Force',
    'Anvil Siege Force',
    'Ironstorm Spearhead',
    'Firestorm Assault Force',
    'Stormlance Task Force',
    'Vanguard Spearhead',
    '1st Company Task Force',
    'Librarius Conclave',
    'Bastion Task Force',
    'Orbital Assault Force'
  );

-- Also clean up for Chaos Space Marines parent if same issue exists
-- CSM parent faction ID: e6b2eb73-3843-da9f-1e59-da4d5ea594c5
-- (Only keep generic CSM detachments, remove any chapter-specific ones)

-- Clean up for Aeldari parent if Drukhari/Ynnari detachments leaked
-- Aeldari faction ID varies — this is handled by the ON CONFLICT in seed
