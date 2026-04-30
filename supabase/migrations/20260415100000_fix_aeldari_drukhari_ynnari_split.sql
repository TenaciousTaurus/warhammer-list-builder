-- Fix Aeldari / Drukhari / Ynnari detachment split
--
-- Root cause: the parser assigned all 18 detachments from the shared
-- "Aeldari - Aeldari Library.cat" to all three factions because it
-- couldn't distinguish which sub-faction each detachment belonged to.
--
-- BSData analysis of modifier conditions in the Library file reveals:
--   Drukhari-only  : hidden unless primary-catalogue instanceOf Drukhari
--   Aeldari/Ynnari : hidden when primary-catalogue instanceOf Drukhari
--
-- Drukhari-specific (6): Realspace Raiders, Skysplinter Assault,
--   Reaper's Wager, Covenite Coterie, Kabalite Cartel, Spectacle of Spite
--
-- Aeldari/Craftworlds/Ynnari (12): Warhost, Armoured Warhost, Windrider Host,
--   Spirit Conclave, Guardian Battlehost, Ghosts of the Webway, Devoted of Ynnead,
--   Seer Council, Aspect Host, Serpent's Brood, Eldritch Raiders, Corsair Coterie
--
-- Target state after this migration:
--   Aeldari  : 12 (Craftworlds/Harlequins/Corsairs — remove 6 Drukhari-specific)
--   Drukhari :  6 (Drukhari-only — remove 12 Aeldari-specific)
--   Ynnari   : 12 (uses Aeldari codex — remove 6 Drukhari-specific)

-- ── Step 1: Remove Drukhari-specific detachments (+ enhancements) from Aeldari ──

DELETE FROM public.enhancements
WHERE detachment_id IN (
  SELECT d.id FROM public.detachments d
  JOIN public.factions f ON d.faction_id = f.id
  WHERE f.name = 'Aeldari'
    AND d.name IN (
      'Realspace Raiders', 'Skysplinter Assault', 'Reaper''s Wager',
      'Covenite Coterie', 'Kabalite Cartel', 'Spectacle of Spite'
    )
);

DELETE FROM public.detachments
WHERE faction_id = (SELECT id FROM public.factions WHERE name = 'Aeldari')
  AND name IN (
    'Realspace Raiders', 'Skysplinter Assault', 'Reaper''s Wager',
    'Covenite Coterie', 'Kabalite Cartel', 'Spectacle of Spite'
  );

-- ── Step 2: Remove Aeldari-specific detachments (+ enhancements) from Drukhari ──

DELETE FROM public.enhancements
WHERE detachment_id IN (
  SELECT d.id FROM public.detachments d
  JOIN public.factions f ON d.faction_id = f.id
  WHERE f.name = 'Drukhari'
    AND d.name IN (
      'Warhost', 'Armoured Warhost', 'Windrider Host', 'Spirit Conclave',
      'Guardian Battlehost', 'Ghosts of the Webway', 'Devoted of Ynnead',
      'Seer Council', 'Aspect Host', 'Serpent''s Brood',
      'Eldritch Raiders', 'Corsair Coterie'
    )
);

DELETE FROM public.detachments
WHERE faction_id = (SELECT id FROM public.factions WHERE name = 'Drukhari')
  AND name IN (
    'Warhost', 'Armoured Warhost', 'Windrider Host', 'Spirit Conclave',
    'Guardian Battlehost', 'Ghosts of the Webway', 'Devoted of Ynnead',
    'Seer Council', 'Aspect Host', 'Serpent''s Brood',
    'Eldritch Raiders', 'Corsair Coterie'
  );

-- ── Step 3: Remove Drukhari-specific detachments (+ enhancements) from Ynnari ──

DELETE FROM public.enhancements
WHERE detachment_id IN (
  SELECT d.id FROM public.detachments d
  JOIN public.factions f ON d.faction_id = f.id
  WHERE f.name = 'Ynnari'
    AND d.name IN (
      'Realspace Raiders', 'Skysplinter Assault', 'Reaper''s Wager',
      'Covenite Coterie', 'Kabalite Cartel', 'Spectacle of Spite'
    )
);

DELETE FROM public.detachments
WHERE faction_id = (SELECT id FROM public.factions WHERE name = 'Ynnari')
  AND name IN (
    'Realspace Raiders', 'Skysplinter Assault', 'Reaper''s Wager',
    'Covenite Coterie', 'Kabalite Cartel', 'Spectacle of Spite'
  );
