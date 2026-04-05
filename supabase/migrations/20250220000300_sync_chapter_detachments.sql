-- ============================================================
-- Sync Chapter Detachments & Enhancements to Production
-- ============================================================
-- Problem: 5 Space Marine chapters are missing their detachments
-- and enhancements in production. Additionally, 2 detachments
-- were incorrectly assigned to the wrong chapters.
--
-- Fixes:
-- 1. Delete misplaced "Hammer of Avernii" from Black Templars
-- 2. Delete misplaced "Shadowmark Talon" from Deathwatch
-- 3. Insert correct detachments for all 5 chapters
-- 4. Insert all 20 enhancements (4 per chapter)
-- ============================================================

-- Step 1: Delete misplaced detachments (cascades to enhancements)
-- No army lists reference these, verified before migration.
DELETE FROM public.enhancements WHERE detachment_id IN (
  SELECT id FROM public.detachments
  WHERE name = 'Hammer of Avernii'
    AND faction_id = (SELECT id FROM public.factions WHERE name = 'Black Templars')
);
DELETE FROM public.detachments
WHERE name = 'Hammer of Avernii'
  AND faction_id = (SELECT id FROM public.factions WHERE name = 'Black Templars');

DELETE FROM public.enhancements WHERE detachment_id IN (
  SELECT id FROM public.detachments
  WHERE name = 'Shadowmark Talon'
    AND faction_id = (SELECT id FROM public.factions WHERE name = 'Deathwatch')
);
DELETE FROM public.detachments
WHERE name = 'Shadowmark Talon'
  AND faction_id = (SELECT id FROM public.factions WHERE name = 'Deathwatch');

-- Step 2: Insert correct detachments for all 5 chapters

-- Imperial Fists — Emperor's Shield
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('292a70ee-74ce-2f2e-6276-aac76063eaf2', '5b8f14d8-2b93-1250-2db6-d6c800392c61', 'Emperor''s Shield', 'Wrath of Dorn: Each time a model from your army with the Oath of Moment ability makes an attack that targets your Oath of Moment target, you can re-roll a Wound roll of 1.


Each time a model in a ^^**Darnath Lysander**^^ unit from your army makes an attack that targets your Oath of Moment target, you can re-roll the Wound roll.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

-- Iron Hands — Hammer of Avernii
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('b9c05f5e-9483-152c-6000-d80dd78a1c7b', 'ecdf0e38-7bec-067a-2cf4-d8523ba8385d', 'Hammer of Avernii', 'Calculated Annihilation: Each time a model from your army with the Oath of Moment ability makes an attack that targets your Oath of Moment target, you can re‑roll a Wound roll of 1.


**RECALCULATING**

Once per battle round, after your Oath of Moment target is destroyed, if a ^^**Caanok Var**^^ model from your army is on the battlefield, select one enemy unit visible to that model. That enemy unit becomes your Oath of Moment target until you select a new one.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

-- Raven Guard — Shadowmark Talon
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('7a4a2e1e-fbe6-55ff-bfdf-94dce5281506', 'bba63b9c-e53d-9e46-e33a-420c5f944ee8', 'Shadowmark Talon', 'Masters of Shadow: Each time a ranged attack targets an Adeptus Astartes unit from your army, unless the attacking model is within 12", subtract 1 from the Hit roll and the target has the Benefit of Cover against that attack.


**Unparalled Tactician**

Once per battle round, if an **^^Aethon^^** Shaan model from your army is on the battlefield, you can use the Into Darkness Stratagem for 0CP.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

-- Salamanders — Forgefather's Seekers
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('ba8f336b-f0a5-d626-bf8f-cc7953100ca8', '6cda38a9-d9f6-bd6e-7587-4a59074251a4', 'Forgefather''s Seekers', 'Vulkan''s Quest: Ranged weapons equipped by Adeptus Astartes models from your army have the [ASSAULT] ability, and each time an attack made such a weapon targets a unit within 12", add 1 to the Strength characteristic of that attack.


**Seeker''s Companions**


If your army includes Vulkan He''stan, during your turn, each Infernus Squad unit from your army is eligible to do one of the following
- Start to perform an Action in a turn in which it Advanced

- Shoot in a turn in which it started to perform an Action')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

-- White Scars — Spearpoint Task Force
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('0b7ef6a6-bbed-59d5-fa5d-e9d9598b457f', '1ea4f2e9-078b-3b7f-07d9-050779ef9fce', 'Spearpoint Task Force', 'Storm-Swift Onslaught: ^^**Adeptus Astartes**^^ units from your army are eligible to declare a charge in a turn in which they Advanced or Fell Back.

**Wrath of the First Khan**

At the end of the Fight phase, if a **^^Suboden Khan^^** unit from your army destroyed one or more enemy units this phase and is not within Engagement Range of one or more enemy units, that unit can make a Normal move of up to 6".')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

-- Step 3: Insert enhancements for all 5 chapters

-- Imperial Fists enhancements (Emperor's Shield)
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('340944bf-98b0-9dc7-9e79-91d2cf0c4246', '292a70ee-74ce-2f2e-6276-aac76063eaf2', 'Champion of the Feast', 25, '**^^Adeptus Astartes^^** model only. Add 1 to the Attacks characteristic of the bearer''s melee weapons. Once per battle, at the start of any phase, the bearer can use this Enhancement. If it does, until the end of the phase, add 1 to the Attacks characteristic of melee weapons equipped by all other models in the bearer''s unit.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('635add6e-8eec-44f5-bd24-629c10dd15ee', '292a70ee-74ce-2f2e-6276-aac76063eaf2', 'Disciple of Rhetoricus', 10, 'Adeptus Astartes Terminator model only. Improve the Objective Control characteristic of the bearer by 1. Once per battle, at the start of any phase the bearer can use this Enhancement. If it does, until the end of the phase, add 1 to the Objective Control characteristic of all other models in the bearer''s unit as well.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('ca3cdfda-f5e6-414c-7a54-eb8370c63d7a', '292a70ee-74ce-2f2e-6276-aac76063eaf2', 'Indomitable Champion', 20, 'Adeptus Astartes Terminator model only. The first time the bearer is destroyed, roll one D6 at the end of the phase. On a 2+, set the bearer back up on the battlefield, as close as possible to where it was destroyed and not within Engagement Range of any enemy units, with 3 wounds remaining.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('55431efa-27c0-7d93-322d-983fbb6becde', '292a70ee-74ce-2f2e-6276-aac76063eaf2', 'Malodraxian Standard', 20, 'Adeptus Astartes Ancient model only. Each time an attack targets the bearer''s unit, if the Strength characteristic of that attack is greater than the Toughness characteristic of the bearer''s unit, subtract 1 from the Wound roll.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

-- Iron Hands enhancements (Hammer of Avernii)
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('517b09ee-1500-9530-7840-96dab2b28b58', 'b9c05f5e-9483-152c-6000-d80dd78a1c7b', 'Spiritus Ferrum', 25, 'Adeptus Astartes model only. Add 1 to the Attacks characteristic of the bearer''s melee weapons. Once per battle, at the start of any phase, the bearer can use this Enhancement. If it does, until the end of the phase, add 1 to the Attacks characteristic of melee weapons equipped by all other models in the bearer''s unit as well.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('1587ff00-8ac0-8b58-8a1e-0ce37f40633d', 'b9c05f5e-9483-152c-6000-d80dd78a1c7b', 'Medusan Roar [Aura]', 30, 'Adeptus Astartes model only. While an enemy unit (excluding Monsters and Vehicles) is within 6" of the bearer, each time that unit fails a Battle‑shock test, one model in that unit is destroyed (chosen by its controlling player). Once per battle, when such an enemy unit fails a Battle‑shock test, you can choose for D3 models in that unit to be destroyed in this way instead.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('1b1d077d-eeca-a232-5f1e-b9cf30c59958', 'b9c05f5e-9483-152c-6000-d80dd78a1c7b', 'Iron Laurel', 10, 'Adeptus Astartes model only. Improve the Objective Control characteristic of the bearer by 1. Once per battle, at the start of any phase, the bearer can use this Enhancement. If it does, until the end of the phase, add 1 to the Objective Control characteristic of all other models in the bearer''s unit as well.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('c3bc90bc-f1c7-facb-383c-90f1d61ecfef', 'b9c05f5e-9483-152c-6000-d80dd78a1c7b', 'Steel Font', 15, 'Adeptus Astartes Terminator model only. While the bearer is leading a unit, in your Command phase, you can return 1 destroyed Bodyguard model to that unit.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

-- Raven Guard enhancements (Shadowmark Talon)
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('75b446f5-7e2b-e5ea-6924-f73ca9c976f8', '7a4a2e1e-fbe6-55ff-bfdf-94dce5281506', 'Blackwing Shroud', 25, 'Adeptus Astartes Infantry model only. While the bearer is leading a unit, models in that unit have the Infiltrators ability.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('5291931f-e441-69fb-f88b-9340b537f5ad', '7a4a2e1e-fbe6-55ff-bfdf-94dce5281506', 'Coronal Susurrant', 30, 'Phobos model only. The bearer has the following ability: Lord of Deceit (Aura): Each time your opponent targets a unit from their army with a Stratagem, if that unit is within 12" of this model, increase the cost of that usage of that Stratagem by 1CP.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('76e26a02-7aaf-3038-2bbd-59ce2c6f7d4b', '7a4a2e1e-fbe6-55ff-bfdf-94dce5281506', 'Umbral Raptor', 15, 'Adeptus Astartes model only. The bearer has the Stealth and Lone Operative abilities.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('ff93c4c2-4f60-624b-aff3-aa3e2de94979', '7a4a2e1e-fbe6-55ff-bfdf-94dce5281506', 'Hunter''s Instincts', 25, 'Adeptus Astartes model only. If the bearer''s unit is in Strategic Reserves, for the purposes of setting up that unit on the battlefield, treat the current battle round number as being one higher than it actually is.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

-- Salamanders enhancements (Forgefather's Seekers)
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('0dca9abb-267b-cd2b-bd03-ef7e3d8ad7bb', 'ba8f336b-f0a5-d626-bf8f-cc7953100ca8', 'Adamantine Mantle', 20, '**^^Adeptus Astartes^^** model only. Each time an attack is allocated the bearer, subtract 1 from the Damage characteristic of that attack. If that attack was made with a **[MELTA]** or **[TORRENT]** weapon, change the Damage characteristic of that attack to 1 instead.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('982a3ab2-d785-b804-41ed-68a75951b8f4', 'ba8f336b-f0a5-d626-bf8f-cc7953100ca8', 'War-tempered Artifice', 25, '**^^Adeptus Astartes Infantry^^** model only. Add 3 to the Strength characteristic of the bearer''s melee weapons.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('ec67eb7e-28c1-6d31-6377-9c13faf83355', 'ba8f336b-f0a5-d626-bf8f-cc7953100ca8', 'Forged in Battle', 15, 'Adeptus Astartes model only. While the bearer is leading a unit, once per turn after making a Hit roll or a saving throw for a model in that unit, you can change the result of that roll to an umodified 6.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('ec47a058-2006-0fee-1b0d-3a6df870b299', 'ba8f336b-f0a5-d626-bf8f-cc7953100ca8', 'Immolator', 10, 'Adeptus Astartes model only. Add 1 to the attacks characteristics of Torrent weapons equipped by models in the bearer''s unit.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;

-- White Scars enhancements (Spearpoint Task Force)
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('756d8800-45c0-8b1f-2637-51278702d60c', '0b7ef6a6-bbed-59d5-fa5d-e9d9598b457f', 'Spearpoint Paragon', 25, 'Adeptus Astartes model only. Improve the Strength and Armour Penetration characteristics of the bearer''s melee weapons by 1. Each time the bearer ends a Charge move, until the end of the turn, improve the Strength and Armour Penetration characteristics of the bearer''s melee weapons by 2 instead.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('100ca9cb-7693-5c37-0ac2-b6f065f0da60', '0b7ef6a6-bbed-59d5-fa5d-e9d9598b457f', 'Stormseer''s Wisdom', 15, 'Adeptus Astartes model only. While the bearer is leading a unit, you can re‑roll Advance rolls made for that unit.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('e57d4ebe-1457-240e-a257-52e064d57d6a', '0b7ef6a6-bbed-59d5-fa5d-e9d9598b457f', 'Hunter''s Eye', 20, 'Adeptus Astartes model only. Ranged weapons equipped by models in the bearer''s unit have the [SUSTAINED HITS 1] and [IGNORES COVER] abilities.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('972f29e2-b176-9fec-286f-d0f8188af510', '0b7ef6a6-bbed-59d5-fa5d-e9d9598b457f', 'Chogorian Huntmaster', 25, 'Adeptus Astartes Mounted model only. If the bearer''s unit is in Strategic Reserves, for the purposes of setting up that unit on the battlefield, treat the current battle round number as being one higher than it actually is.')
ON CONFLICT (id) DO UPDATE SET detachment_id = EXCLUDED.detachment_id, name = EXCLUDED.name, points = EXCLUDED.points, description = EXCLUDED.description;
