-- Fix Dark Angels and Genestealer Cults detachment gaps
--
-- Dark Angels:
--   Problem: Has "Librarius Conclave" (a generic Space Marines detachment) and is
--            missing "Lion's Blade Task Force" (a DA-specific detachment).
--   Root cause: An earlier migration incorrectly moved Librarius Conclave to DA,
--               and a partial name-match bug prevented Lion's Blade Task Force
--               from being mapped to DA. The seed file is correct; production drifted.
--   Fix: Remove Librarius Conclave from DA, insert Lion's Blade Task Force + 4 enhancements.
--
-- Genestealer Cults:
--   Problem: Missing 3 codex detachments — Host of Ascension, Outlander Claw, Final Day.
--            These are defined in Library - Tyranids.cat and were never pushed to production.
--   Fix: Insert the 3 missing detachments + 4 enhancements each.

-- ── Dark Angels ──────────────────────────────────────────────────────────────

-- Remove Librarius Conclave from Dark Angels (0 enhancements, belongs to generic SM)
DELETE FROM public.detachments
WHERE faction_id = (SELECT id FROM public.factions WHERE name = 'Dark Angels')
  AND name = 'Librarius Conclave';

-- Add Lion's Blade Task Force
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('930e80e8-0081-97d1-7681-008f0fe14974',
   (SELECT id FROM public.factions WHERE name = 'Dark Angels'),
   'Lion''s Blade Task Force',
   'In the Lion''s Claws: - Each time an enemy unit (excluding ^^**Monsters^^** and ^^**Vehicles^^**) within Engagement Range of one or more ^^**Ravenwing^^** units from your army Falls Back, all models in that enemy unit must take a Desperate Escape test. When doing so, if that enemy unit is Battle‑shocked, subtract 1 from each of those tests.
- Each time a ^^**Deathwing^^** unit from your army declares a charge, if one or more targets of that charge are within Engagement Range of one or more ^^**Ravenwing^^**  units from your army, add 2 to the Charge roll.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

-- Lion's Blade Task Force enhancements
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('a0bfd858-f8c1-3ee5-5e45-fc215b832439', '930e80e8-0081-97d1-7681-008f0fe14974', 'Calibanite Armaments', 15,
   '**^^Adeptus Astartes^^** model only. Add 1 to the Damage characteristic of the bearer''s melee weapons.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('ff6ed8cc-269f-d1d3-81dc-dc8a270f56f4', '930e80e8-0081-97d1-7681-008f0fe14974', 'Lord of the Hunt', 15,
   'Ravenwing model only. The bearer''s unit is eligible to shoot and declare a charge in a turn in which it Fell Back and you can re‑roll Desperate Escape tests taken for models in the bearer''s unit.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('9ffd9146-2e49-da40-8893-0d32c0e9f0db', '930e80e8-0081-97d1-7681-008f0fe14974', 'Stalwart Champion', 25,
   'Captain, Chaplain or Lieutenant model only. While the bearer''s unit is not Battle‑shocked, add 1 to the Objective Control characteristic of models in the bearer''s unit.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('a04c6a91-1bde-4d3f-d7ca-840aee79602b', '930e80e8-0081-97d1-7681-008f0fe14974', 'Fulgus Magna', 20,
   'Deathwing model only. Once per battle, at the end of your opponent''s turn, if the bearer''s unit is not within Engagement Range of one or more enemy units, the bearer can use this Enhancement. If it does, remove the bearer''s unit from the battlefield and place it into Strategic Reserves.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

-- ── Genestealer Cults ────────────────────────────────────────────────────────

-- Host of Ascension
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('e5f1982f-c25f-3c09-d20a-abc0ec006149',
   (SELECT id FROM public.factions WHERE name = 'Genestealer Cults'),
   'Host of Ascension',
   'A Perfect Ambush: Each time a GENESTEALER CULTS unit from your army is set up on the battlefield as Reinforcements, until the end of your next Fight phase, weapons equipped by models in that unit have the [SUSTAINED HITS 1] and [IGNORES COVER] abilities')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('edbf0520-d53e-41e0-9fdb-aa973042994b', 'e5f1982f-c25f-3c09-d20a-abc0ec006149', 'Our Time is Nigh', 20,
   '**^^Genestealer Cults^^** model only. Once per battle, when the bearer''s unit declares a charge, the bearer can use the Enhancement. If it does, until the end of the phase, add 2 to Charge rolls made for the bearer''s unit.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('bffb9a9b-f16a-5277-79c7-f9e275831f39', 'e5f1982f-c25f-3c09-d20a-abc0ec006149', 'A Chink in Their Armour', 20,
   '**^^Genestealer Cults^^** model only. Each time the bearer is set up on the battlefield as Reinforcements, until the end of your next Fight phase, ranged weapons equipped in the bearer''s unit have the **[LETHAL HITS]** ability.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('d9d15c32-07e0-8222-bb37-201c29736048', 'e5f1982f-c25f-3c09-d20a-abc0ec006149', 'Prowling Agitant', 15,
   '**^^Genestealer Cults^^** model only. Once per turn, when an enemy unit ends a Normal, Advanced, or Fall Back move within 9" of the bearer''s unit, if the bearer''s unit is not within Engagement Range of any enemy units, it can make a Normal move of up to D6".')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('9f750170-d4fe-c0da-794a-ceff39530a82', 'e5f1982f-c25f-3c09-d20a-abc0ec006149', 'Assassination Edict', 15,
   '**^^Genestealer Cults^^** model only. Each time a model in the bearer''s unit makes an attack that targets a **^^Character^^** unit, add 1 to the Hit roll.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

-- Outlander Claw
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('6dedd715-bc01-0999-3708-a1e39abef23e',
   (SELECT id FROM public.factions WHERE name = 'Genestealer Cults'),
   'Outlander Claw',
   'Rapid Takeover: While a GENESTEALER CULTS MOUNTED or GENESTEALER CULTS VEHICLE model from your army is not Battle‑shocked, add 1 to its Objective Control characteristic. In addition, at the end of your Command phase, if one or more ATALAN JACKALS units from your army are within range of an objective marker you control, that objective marker remains under your control until your opponent''s Level of Control over that objective marker is greater than yours at the end of a phase.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('8a7110de-1673-f472-9bfa-8400011eb1da', '6dedd715-bc01-0999-3708-a1e39abef23e', 'Serpentine Tactics', 10,
   '**^^Genestealer Cults Mounted^^** model only. The bearer''s unit is eligible to shoot in a turn in which it Fell Back.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('0bd36730-27da-a82c-a3cb-0ee4066f06ac', '6dedd715-bc01-0999-3708-a1e39abef23e', 'Cartographic Data-leech', 10,
   '**^^Genestealer Cults^^** model only. While the bearer is embarked within a **^^Transport^^**, each time that **^^Transport^^** is selected to shoot, until end of the phase, improve the Ballistic Skill characteristic of ranged weapons equipped by that **^^Transport^^** as a result of the Firing Deck ability by 1.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('4cefcf22-8faa-0aa2-02d7-0fce06b4df4b', '6dedd715-bc01-0999-3708-a1e39abef23e', 'Starfall Shells', 10,
   '**^^Genestealer Cults Mounted^^** model only. In your Shooting phase, after the bearer has shot, select one enemy unit by one or more of those attacks made with a cult sniper rifle. Until the start of your next Shooting phase, each time a model in that enemy unit makes an attack, subtract 1 from the Hit roll.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('606d382a-0212-fe07-2921-e9da23a66063', '6dedd715-bc01-0999-3708-a1e39abef23e', 'Assault Commando', 15,
   '**^^Genestealer Cults^^** model only. Each time a model in the bearer''s unit makes a ranged attack, if it disembarked from a **^^Transport^^** this turn, you can re-roll the Hit roll.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

-- Final Day
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('fc98f7ad-c6e3-92e4-0c15-0011c56b65be',
   (SELECT id FROM public.factions WHERE name = 'Genestealer Cults'),
   'Final Day',
   'The Star Children''s Blessings: You can include TYRANIDS VANGUARD INVADER units (excluding AIRCRAFT, BROODLORD and GENESTEALERS units) in your army. The combined points cost of such units depends on your battle size:

■ Incursion: Up to 500 pts
■ Strike Force: Up to 1000 pts
■ Onslaught: Up to 1500 pts

No TYRANIDS models from your army can be your WARLORD.

Psionic Parasitism: At the end of your Movement phase, for each TYRANIDS SYNAPSE unit from your army, you can select one friendly GENESTEALER CULTS unit (excluding PURESTRAIN GENESTEALER and PATRIARCH units) and one friendly TYRANIDS unit each within 9" of and visible to that SYNAPSE unit. If you do, that GENESTEALER CULTS unit from your army suffers D3+1 mortal wounds and one model in the selected TYRANIDS unit regains up to that many lost wounds and until the start of your next Movement phase, each time a model in the selected TYRANIDS unit makes an attack, add 1 to the Hit roll.

TYRANIDS units from your army have the following ability:

Catalyst (Aura): While an enemy unit is within 6" of this unit, each time a friendly GENESTEALER CULTS unit makes an attack that targets that enemy unit, add 1 to the Hit roll.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('ccc2c6cc-447d-b07d-791f-3084406b8203', 'fc98f7ad-c6e3-92e4-0c15-0011c56b65be', 'Synaptic Auger', 15,
   '**^^Tyranids^^** model only. Each time the bearer would regain one or more lost wounds from the Psionic Parasitism Detachment rule, it regains up to twice that number of lost wounds instead.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('e43e42a7-f3e9-b3ad-5b1a-c067620a3274', 'fc98f7ad-c6e3-92e4-0c15-0011c56b65be', 'Vanguard Tyrant', 25,
   '**^^Winged Hive Tyrant^^** model only. Improve the Strength and Armour Penetration characteristics of melee weapons equipped by the bearer by 1.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('da10b0b7-cd1d-ee77-0f40-0fc517454d89', 'fc98f7ad-c6e3-92e4-0c15-0011c56b65be', 'Inhuman Integration', 20,
   '**^^Genestealer Cults^^** model only. Weapons equipped by models in the bearer''s unit have the **[SUSTAINED HITS 1]** ability while targeting an enemy unit within 6" of one or more friendly **^^Tyranids^^**units.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('0a3a7551-3ca7-53f3-2501-f9ae655e16a6', 'fc98f7ad-c6e3-92e4-0c15-0011c56b65be', 'Enraptured Damnation', 10,
   '**^^Genestealer Cults^^** model only. Enemy units cannot use the Fire Overwatch Stratagem to shoot at the bearer''s unit.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;
