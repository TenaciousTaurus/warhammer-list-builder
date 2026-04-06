-- Fix Genestealer Cults detachments: remove incorrectly inherited Tyranids
-- detachments and add the 3 correct GSC codex detachments.
--
-- The BSData parser incorrectly assigned Tyranids detachments to GSC because
-- the GSC catalog inherits from the Tyranids catalog. Production currently
-- has 8 Tyranids detachments on GSC with 0 army lists referencing them.

-- GSC faction ID: 1a0a76be-49ed-bffd-d138-967d8780a12f

-- Step 1: Remove Tyranids detachments incorrectly assigned to GSC
-- (also cascades to their enhancements)
DELETE FROM public.detachments
WHERE faction_id = '1a0a76be-49ed-bffd-d138-967d8780a12f'
  AND name IN (
    'Invasion Fleet',
    'Assimilation Swarm',
    'Crusher Stampede',
    'Synaptic Nexus',
    'Unending Swarm',
    'Vanguard Onslaught',
    'Warrior Bioform Onslaught',
    'Subterranean Assault'
  );

-- Step 2: Insert correct GSC codex detachments
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('1bd3a760-9489-26a7-0f40-6b992655cc7b', '1a0a76be-49ed-bffd-d138-967d8780a12f', 'Xenocreed Congregation',
   'Unquestioning Fanaticism: For Each ACOLYTE HYBRIDS, HYBRID METAMORPHS, and NEOPHYTE HYBRID unit from your army, while one or more CHARACTER models are leading that unit, you can re-roll Advance and Charge rolls made for it. If that CHARACTER model is a MAGUS, PRIMUS, or ACOLYTE ICONWARD, that model has the Feel No Pain 3+ ability while leading that unit.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, rule_text = EXCLUDED.rule_text;

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('f03be171-b7b8-75ee-6aeb-666723fa2d9c', '1a0a76be-49ed-bffd-d138-967d8780a12f', 'Biosanctic Broodsurge',
   'Hypermorphic Fury: Add 1 to Charge rolls made for **^^Aberrants^^**, **^^Biophagus^^** and **^^Purestrain Genestealers^^** units from your army. In addition, each time such a unit is selected to fight, if it made a Charge move this turn, until the end of the phase, add 1 to the Attacks characteristic of melee weapons equipped by the models in that unit.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, rule_text = EXCLUDED.rule_text;

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('ba9616e1-13f4-82dd-0098-62152831776d', '1a0a76be-49ed-bffd-d138-967d8780a12f', 'Brood Brother Auxilia',
   E'Brood Brothers: You can include **^^Astra Militarum^^** units in your army, even though they do not have the **^^Genestealer Cult^^** Faction keyword. The combined points cost of such units you can include in your army is:\n- Incursion: Up to 500 pts\n- Strike Force: Up to 1000 pts\n- Onslaught: Up to 1500 pts\n\nA **^^Genestealer Cult^^** model must be your Warlord, and **^^Astra Militarum^^** models from your army lose the Voice of Command ability if they have it. You cannot include units with any of the following keywords in your army using this rule: **^^Aircraft^^**; **^^Commisar^^**; **^^Epic Hero^^**; **^^Militarum Tempestus^^**; **^^Ogryn^^**; **^^Ratling^^**; **^^Tech-Priest Enginseer^^**; **^^Ministorum Priest^^**.\n\nIntegrated Tactics: Each time an **^^Astra Militarum^^** unit from your army is selected to shoot, you can select one enemy unit within 18" of and visible to that unit. If you do, until the end of the phase, models in that **^^Astra Militarum^^** unit can only target that enemy unit (and only if it is an eligible target) and that enemy unit is caught in overlapping fire. While an enemy unit is caught in overlapping fire, each time a **^^Genestealer Cult^^** model from your army targets that enemy unit with a ranged attack, add 1 to the Hit roll.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, rule_text = EXCLUDED.rule_text;
