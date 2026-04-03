-- Additive seed for new factions not in original migration

-- SEED DATA: Imperial Fists
-- Auto-generated from BSData/wh40k-10e
-- ============================================================

INSERT INTO public.factions (id, name, alignment) VALUES
  ('5b8f14d8-2b93-1250-2db6-d6c800392c61', 'Imperial Fists', 'imperium')
ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name, alignment = EXCLUDED.alignment;

-- Detachments
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('3651664c-ea9e-0206-ec36-fc2053bf05d4', '5b8f14d8-2b93-1250-2db6-d6c800392c61', 'Index', 'Default detachment using index rules.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

-- Units
INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('97c50f33-7e98-3826-9c37-33115108a88e', '5b8f14d8-2b93-1250-2db6-d6c800392c61', 'Darnath Lysander', 'epic_hero', '5"', 5, '2+', 7, 6, 1, '{"Epic Hero", "Character", "Infantry", "Captain", "Imperium", "Terminator", "Darnath Lysander"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('97c50f33-7e98-3826-9c37-33115108a88e', 1, 100);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('97c50f33-7e98-3826-9c37-33115108a88e', 'Fist of Dorn', 'melee', NULL, '5', '2+', 10, -3, '3', '{"Devastating Wounds"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('97c50f33-7e98-3826-9c37-33115108a88e', 'Icon of Obstinacy', 'unique', 'Each time an attack targets this model''s unit, if the Strength characteristic of that attack is greater than or equal to the Toughness characteristic of that unit, subtract 1 from the Wound roll.'),
  ('97c50f33-7e98-3826-9c37-33115108a88e', 'Rampart', 'unique', 'Once per battle, at the start of any phase, this model can use this ability. If it does, until the end of the phase, this model has a 2+ invulnerable save.'),
  ('97c50f33-7e98-3826-9c37-33115108a88e', 'Leader', 'core', 'This model can be attached to the following units:

■ Terminator Assault Squad
■ Terminator Squad'),
  ('97c50f33-7e98-3826-9c37-33115108a88e', 'Inspiring Commander', 'unique', '‘If you include this model in your army, until the end of the battle, non-Character models in Terminator Assault Squad and Terminator Squad units from your army have an Objective Control characteristic of 2 while they are not Battle-shocked.'),
  ('97c50f33-7e98-3826-9c37-33115108a88e', 'Oath of Moment', 'faction', '');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('4ac56d1d-9c7f-3318-a9f1-4a6018b1b5ce', '5b8f14d8-2b93-1250-2db6-d6c800392c61', 'Tor Garadon', 'epic_hero', '5"', 6, '3+', 6, 6, 1, '{"Epic Hero", "Character", "Infantry", "Captain", "Gravis", "Tor Garadon", "Imperium"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('4ac56d1d-9c7f-3318-a9f1-4a6018b1b5ce', 1, 90);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('4ac56d1d-9c7f-3318-a9f1-4a6018b1b5ce', 'Artificer Grav Gun', 'ranged', '18"', '2', '2+', 5, -1, '2', '{"Anti-vehicle 2+"}'),
  ('4ac56d1d-9c7f-3318-a9f1-4a6018b1b5ce', 'Hand of Defiance', 'melee', NULL, '5', '2+', 12, -2, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('4ac56d1d-9c7f-3318-a9f1-4a6018b1b5ce', 'Signum Array', 'unique', 'While this model is leading a unit, ranged weapons equipped by models in that unit have the [IGNORES COVER] ability.'),
  ('4ac56d1d-9c7f-3318-a9f1-4a6018b1b5ce', 'Siege Captain', 'unique', 'Each time this model makes an attack that targets a Monster, Vehicle, or Fortification unit, improve the Strength, Armour Penetration and Damage characteristics of that attack by 2.'),
  ('4ac56d1d-9c7f-3318-a9f1-4a6018b1b5ce', 'Leader', 'core', 'This model can be attached to the following units:

■ Aggressor Squad
■ Eradicator Squad
■ Heavy Intercessor Squad'),
  ('4ac56d1d-9c7f-3318-a9f1-4a6018b1b5ce', 'Oath of Moment', 'faction', '');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('54a0e738-d0d9-f9ea-d26f-b124a8f4d1a5', '5b8f14d8-2b93-1250-2db6-d6c800392c61', 'Pedro Kantor', 'epic_hero', '6"', 4, '2+', 5, 6, 1, '{"Epic Hero", "Character", "Infantry", "Imperium", "Chapter Master", "Pedro Kantor"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('54a0e738-d0d9-f9ea-d26f-b124a8f4d1a5', 1, 90);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('54a0e738-d0d9-f9ea-d26f-b124a8f4d1a5', 'Dorn''s Arrow', 'ranged', '24"', '2', '2+', 5, -1, '2', '{"Rapid Fire 2", "Sustained Hits 1"}'),
  ('54a0e738-d0d9-f9ea-d26f-b124a8f4d1a5', 'Fist of Retribution', 'melee', NULL, '5', '2+', 8, -3, '3', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('54a0e738-d0d9-f9ea-d26f-b124a8f4d1a5', 'Oath of Rynn', 'unique', 'Once per battle, at the start of either player’s Command phase, this model can use this ability. When it does, until the end of the turn, add 1 to the Attacks characteristic of weapons equipped by models in this model’s unit.'),
  ('54a0e738-d0d9-f9ea-d26f-b124a8f4d1a5', 'To the Last', 'unique', 'While this model is leading a unit, each time a model in that unit makes an attack, add 1 to the Hit roll if that unit is below its Starting Strength, and add 1 to the Wound roll as well if that unit is Below Half-strength.'),
  ('54a0e738-d0d9-f9ea-d26f-b124a8f4d1a5', 'Leader', 'core', 'This model can be attached to the following units:

■ Company Heroes
■ Bladeguard Veteran Squad
■ Sternguard Veteran Squad
■ Tactical Squad'),
  ('54a0e738-d0d9-f9ea-d26f-b124a8f4d1a5', 'Inspiring Commander', 'unique', 'If you include this model in your army, until the end of the battle, non-Character models in Sternguard
Veteran Squad units from your army have an Objective Control characteristic of 2 while they are not Battle-shocked.'),
  ('54a0e738-d0d9-f9ea-d26f-b124a8f4d1a5', 'Oath of Moment', 'faction', '');


-- ============================================================
-- SEED DATA: Iron Hands
-- Auto-generated from BSData/wh40k-10e
-- ============================================================

INSERT INTO public.factions (id, name, alignment) VALUES
  ('ecdf0e38-7bec-067a-2cf4-d8523ba8385d', 'Iron Hands', 'imperium')
ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name, alignment = EXCLUDED.alignment;

-- Detachments
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('d05b90ef-c12d-8c6c-6dd4-20ef4cd35518', 'ecdf0e38-7bec-067a-2cf4-d8523ba8385d', 'Index', 'Default detachment using index rules.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

-- Units
INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('eb178d27-a064-d6c6-5883-8f795d0f458c', 'ecdf0e38-7bec-067a-2cf4-d8523ba8385d', 'Iron Father Feirros', 'epic_hero', '5"', 6, '2+', 6, 6, 1, '{"Character", "Epic Hero", "Infantry", "Imperium", "Gravis", "Iron Father Ferrios"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('eb178d27-a064-d6c6-5883-8f795d0f458c', 1, 95);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('eb178d27-a064-d6c6-5883-8f795d0f458c', 'Gorgon''s Wrath', 'ranged', '36"', '3', '2+', 5, -1, '2', '{"Sustained Hits 2"}'),
  ('eb178d27-a064-d6c6-5883-8f795d0f458c', 'Harrowhand', 'melee', NULL, '6', '3+', 7, -2, '2', '{}'),
  ('eb178d27-a064-d6c6-5883-8f795d0f458c', 'Medusan Manipuli', 'melee', NULL, '2', '3+', 8, -2, '3', '{"Extra Attacks"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('eb178d27-a064-d6c6-5883-8f795d0f458c', 'Rites of Tempering', 'unique', 'While this model is leading a unit, models in that unit have the Feel No Pain 5+ ability'),
  ('eb178d27-a064-d6c6-5883-8f795d0f458c', 'Iron Father', 'unique', 'While this model is within 3" of one or more friendly Adeptus Astartes Vehicle units, it has the Lone Operative ability.'),
  ('eb178d27-a064-d6c6-5883-8f795d0f458c', 'Master of the Forge', 'unique', 'In your Command phase, select one friendly Adeptus Astartes Vehicle model within 3" of this model. That model regains up to 3 lost wounds and, until the start of your next Command phase, each time that Vehicle model makes an attack, add 1 to the Hit roll. You cannot select a unit for this ability that has already been selected for the Blessing of the Omnissiah ability this phase, and vice versa.'),
  ('eb178d27-a064-d6c6-5883-8f795d0f458c', 'Leader', 'core', 'This model can be attached to the following units:

■ Aggressor Squad
■ Eradicator Squad
■ Heavy Intercessor Squad'),
  ('eb178d27-a064-d6c6-5883-8f795d0f458c', 'Inspiring Commander', 'unique', 'If you include this model in your army, until the end of the battle, non-Character models in Heavy
Intercessor Squad units from your army have an Objective Control characteristic of 3 while they are
not Battle-shocked.'),
  ('eb178d27-a064-d6c6-5883-8f795d0f458c', 'Oath of Moment', 'faction', '');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('34557e1e-e3c9-83de-e3fe-535a77d476a1', 'ecdf0e38-7bec-067a-2cf4-d8523ba8385d', 'Caanok Var', 'epic_hero', '5"', 5, '2+', 6, 6, 1, '{"Infantry", "Character", "Epic Hero", "Imperium", "Terminator", "Captain", "Caanok Var"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('34557e1e-e3c9-83de-e3fe-535a77d476a1', 1, 100);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('34557e1e-e3c9-83de-e3fe-535a77d476a1', 'Axiom - Strike', 'melee', NULL, '5', '2+', 8, -2, '2', '{}'),
  ('34557e1e-e3c9-83de-e3fe-535a77d476a1', 'Axiom - Sweep', 'melee', NULL, '10', '2+', 5, -2, '1', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('34557e1e-e3c9-83de-e3fe-535a77d476a1', 'Cold and Calculating', 'unique', 'Each time a model in this model’s unit makes an attack that targets a Monster or Vehicle unit, that
attack has the [LETHAL HITS] ability. Each time a model in this model’s unit makes an attack that targets any other unit, that attack has the [SUSTAINED HITS 1] ability.'),
  ('34557e1e-e3c9-83de-e3fe-535a77d476a1', 'Cerebrex Logic Engine', 'unique', '■ At the start of the Declare Battle Formations step, you can select one Adeptus Astartes Infantry unit from your army. Until the end of the battle, that unit gains the Scouts 6" ability.


■ After both players have deployed their armies, you can select one Adeptus Astartes unit from your army and redeploy it. When doing so, you can set that unit up in Strategic Reserves if you wish, regardless of how many units are already in Strategic Reserves.'),
  ('34557e1e-e3c9-83de-e3fe-535a77d476a1', 'Leader', 'core', 'This model can be attached to the following units: Terminator Assault Squad, Terminator Squad'),
  ('34557e1e-e3c9-83de-e3fe-535a77d476a1', 'Oath of Moment', 'faction', '');


-- ============================================================
-- SEED DATA: Raven Guard
-- Auto-generated from BSData/wh40k-10e
-- ============================================================

INSERT INTO public.factions (id, name, alignment) VALUES
  ('bba63b9c-e53d-9e46-e33a-420c5f944ee8', 'Raven Guard', 'imperium')
ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name, alignment = EXCLUDED.alignment;

-- Detachments
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('150195ab-9752-9740-0f8f-65a43e4bc18c', 'bba63b9c-e53d-9e46-e33a-420c5f944ee8', 'Index', 'Default detachment using index rules.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

-- Units
INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('49a13929-16ee-e403-a2eb-aacec42508f6', 'bba63b9c-e53d-9e46-e33a-420c5f944ee8', 'Kayvaan Shrike', 'epic_hero', '12"', 4, '3+', 5, 6, 1, '{"Epic Hero", "Character", "Infantry", "Imperium", "Fly", "Jump Pack", "Chapter Master", "Kayvaan Shrike", "Phobos"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('49a13929-16ee-e403-a2eb-aacec42508f6', 1, 100);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('49a13929-16ee-e403-a2eb-aacec42508f6', 'Blackout', 'ranged', '18"', '2', '2+', 5, -1, '2', '{"Pistol", "Precision"}'),
  ('49a13929-16ee-e403-a2eb-aacec42508f6', 'The Raven''s Talons', 'melee', NULL, '7', '2+', 5, -2, '2', '{"Precision", "Twin-linked"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('49a13929-16ee-e403-a2eb-aacec42508f6', 'Trifold Path of Shadow', 'unique', 'While this model is leading a unit, models  in this unit cannot be targeted by ranged attacks unless the attacking model is within 12".'),
  ('49a13929-16ee-e403-a2eb-aacec42508f6', 'Echo of the Ravenspire', 'unique', 'At the end of your opponent’s turn, if this model’s unit is not within Engagement Range of any enemy models, you can remove it from the battlefield and place it into Strategic Reserves.'),
  ('49a13929-16ee-e403-a2eb-aacec42508f6', 'Leader', 'core', 'This model can be attached to the following units:

■ Assault Intercessors with Jump Packs
■ Vanguard Veteran Squad with Jump Packs'),
  ('49a13929-16ee-e403-a2eb-aacec42508f6', 'Inspiring Commander', 'unique', 'If you include this model in your army, until the end of the battle, non-Character models in Assault
Intercessors with Jump Packs units from your army have an Objective Control characteristic of 2 while they are not Battle-shocked.'),
  ('49a13929-16ee-e403-a2eb-aacec42508f6', 'Oath of Moment', 'faction', '');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('1e1ba993-61de-98a0-e548-6d32250e013a', 'bba63b9c-e53d-9e46-e33a-420c5f944ee8', 'Aethon Shaan', 'epic_hero', '14"', 4, '3', 5, 6, 1, '{"Character", "Epic Hero", "Infantry", "Fly", "Jump Pack", "Imperium", "Tacticus", "Chapter Master", "Aethon Shaan"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('1e1ba993-61de-98a0-e548-6d32250e013a', 1, 110);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('1e1ba993-61de-98a0-e548-6d32250e013a', 'Claws of Severax', 'melee', NULL, '7', '2+', 5, -2, '2', '{"Sustained Hits 2", "Twin-linked"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('1e1ba993-61de-98a0-e548-6d32250e013a', 'Chapter Master of the Raven Guard', 'unique', 'At the start of the Declare Battle Formations step, if your army includes Aethon Shaan and Kayvaan
Shrike, until the end of the battle, your Kayvaan Shrike unit loses its Lone Operative ability and it
replaces its Chapter Master keyword with Captain.'),
  ('1e1ba993-61de-98a0-e548-6d32250e013a', 'Master of Shadows', 'unique', 'In your Command phase, you can select one unit from your opponent’s army. Until the start of your next Command phase, each time an Adeptus Astartes unit from your army declares a charge while it is within 12" of that enemy unit, you can re-roll the Charge roll, but it must declare that enemy unit as a target of that charge (if possible).'),
  ('1e1ba993-61de-98a0-e548-6d32250e013a', 'Blackwing Mantle', 'unique', 'You can target this model’s unit with the Rapid Ingress and Heroic Intervention Stratagems for 0CP,
even if you have already used that Stratagem on a different unit this phase.'),
  ('1e1ba993-61de-98a0-e548-6d32250e013a', 'Oath of Moment', 'faction', '');


-- ============================================================
-- SEED DATA: Salamanders
-- Auto-generated from BSData/wh40k-10e
-- ============================================================

INSERT INTO public.factions (id, name, alignment) VALUES
  ('6cda38a9-d9f6-bd6e-7587-4a59074251a4', 'Salamanders', 'imperium')
ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name, alignment = EXCLUDED.alignment;

-- Detachments
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('799fb3eb-37df-62cb-8be4-1e4b8d406687', '6cda38a9-d9f6-bd6e-7587-4a59074251a4', 'Index', 'Default detachment using index rules.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

-- Units
INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('168d8b9f-2ebc-5d0a-c9fd-b2731d966202', '6cda38a9-d9f6-bd6e-7587-4a59074251a4', 'Adrax Agatone', 'epic_hero', '6"', 4, '2+', 5, 6, 1, '{"Epic Hero", "Character", "Infantry", "Captain", "Adrax Agatone", "Imperium", "Tacticus"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('168d8b9f-2ebc-5d0a-c9fd-b2731d966202', 1, 85);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('168d8b9f-2ebc-5d0a-c9fd-b2731d966202', 'Drakkis', 'ranged', '12"', 'D6+3', 'N/A', 4, -1, '1', '{"Ignores Cover", "Pistol", "Torrent"}'),
  ('168d8b9f-2ebc-5d0a-c9fd-b2731d966202', 'Malleus Noctum', 'melee', NULL, '5', '2+', 10, -2, '3', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('168d8b9f-2ebc-5d0a-c9fd-b2731d966202', 'Unto the Anvil', 'unique', 'While this model is leading a unit, each time a model in that unit makes a melee attack, you can re-roll the Wound roll.'),
  ('168d8b9f-2ebc-5d0a-c9fd-b2731d966202', 'Lord of the Pyroclasts', 'unique', 'While an enemy unit is within Engagement Range of this model, halve the Objective Control characteristic of models in that enemy unit'),
  ('168d8b9f-2ebc-5d0a-c9fd-b2731d966202', 'Leader', 'core', 'This model can be attached to the following units:

■ Assault Intercessor Squad
■ Bladeguard Veteran Squad
■ Company Heroes
■ Infernus Squad
■ Intercessor Squad
■ Sternguard Veteran Squad
■ Tactical Squad'),
  ('168d8b9f-2ebc-5d0a-c9fd-b2731d966202', 'Oath of Moment', 'faction', '');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('26f75b95-595d-7cce-3196-3871b484fbae', '6cda38a9-d9f6-bd6e-7587-4a59074251a4', 'Vulkan He''stan', 'epic_hero', '6"', 4, '2+', 5, 6, 1, '{"Epic Hero", "Character", "Infantry", "Captain", "Imperium", "Vulkan He''stan", "Tacticus"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('26f75b95-595d-7cce-3196-3871b484fbae', 1, 100);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('26f75b95-595d-7cce-3196-3871b484fbae', 'Gauntlet of the Forge', 'ranged', '12"', 'D6+3', 'N/A', 6, -1, '1', '{"Ignores Cover", "Pistol", "Torrent"}'),
  ('26f75b95-595d-7cce-3196-3871b484fbae', 'Spear of Vulkan', 'melee', NULL, '6', '2+', 6, -2, '2', '{"Devastating Wounds"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('26f75b95-595d-7cce-3196-3871b484fbae', 'Forgefather', 'unique', 'In your Shooting phase, select one enemy unit within 24" of and visible to this model. Until the end of the phase, each time a friendly Adeptus Astartes model makes a ranged attack with a Torrent or Melta weapon that targets that enemy unit, you can re-roll the Wound roll'),
  ('26f75b95-595d-7cce-3196-3871b484fbae', 'Seeker of the Unfound', 'unique', 'The first time this model is set up on the battlefield, select one objective marker on the battlefield. While this model is within range of that objective marker, it has an Objective Control characteristic of 10, a Leadership characteristic of 5+ and the Feel No Pain 4+ ability.'),
  ('26f75b95-595d-7cce-3196-3871b484fbae', 'Leader', 'core', 'This model can be attached to the following units:

■ Assault Intercessor Squad
■ Company Heroes
■ Infernus Squad
■ Tactical Squad'),
  ('26f75b95-595d-7cce-3196-3871b484fbae', 'Inspiring Commander', 'unique', 'If you include this model in your army, until the end of the battle, non-Character models in Infernus Squad units from your army have an Objective Control characteristic of 2 while they are not Battle-shocked.'),
  ('26f75b95-595d-7cce-3196-3871b484fbae', 'Oath of Moment', 'faction', '');


-- ============================================================
-- SEED DATA: White Scars
-- Auto-generated from BSData/wh40k-10e
-- ============================================================

INSERT INTO public.factions (id, name, alignment) VALUES
  ('1ea4f2e9-078b-3b7f-07d9-050779ef9fce', 'White Scars', 'imperium')
ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name, alignment = EXCLUDED.alignment;

-- Detachments
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('de9d6c1f-5066-c9c9-aa71-bccea78a33e1', '1ea4f2e9-078b-3b7f-07d9-050779ef9fce', 'Index', 'Default detachment using index rules.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

-- Units
INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('e470806f-d97b-9fe7-8b59-3f76e26760b5', '1ea4f2e9-078b-3b7f-07d9-050779ef9fce', 'Kor''sarro Khan', 'epic_hero', '6"', 4, '3+', 5, 6, 1, '{"Epic Hero", "Character", "Infantry", "Captain", "Imperium", "Kor''sarro Khan", "Tacticus"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('e470806f-d97b-9fe7-8b59-3f76e26760b5', 1, 60);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('e470806f-d97b-9fe7-8b59-3f76e26760b5', 'Moonfang', 'melee', NULL, '6', '2+', 5, -2, '2', '{"Devastating Wounds", "Precision"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('e470806f-d97b-9fe7-8b59-3f76e26760b5', 'For the Khan!', 'unique', 'While this model is leading a unit, ranged weapons equipped by models in that unit have the [ASSAULT] ability and melee weapons equipped by models in that unit have the [LANCE] ability.'),
  ('e470806f-d97b-9fe7-8b59-3f76e26760b5', 'Trophy Taker', 'unique', 'Each time this model destroys an enemy Character model, you gain 1CP'),
  ('e470806f-d97b-9fe7-8b59-3f76e26760b5', 'Leader', 'core', 'This model can be attached to the following units:

■ Assault Intercessor Squad
■ Bladeguard Veteran Squad
■ Intercessor Squad
■ Sternguard Veteran Squad
■ Tactical Squad
■ Company Heroes'),
  ('e470806f-d97b-9fe7-8b59-3f76e26760b5', 'Inspiring Commander', 'unique', 'If you include this model in your army, until the end of the battle, non-Character models in Outrider Squad units from your army have an Objective Control characteristic of 3 while they are not Battle-shocked.'),
  ('e470806f-d97b-9fe7-8b59-3f76e26760b5', 'Oath of Moment', 'faction', '');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('db55b563-afc7-796c-4d0b-c6ee43408572', '1ea4f2e9-078b-3b7f-07d9-050779ef9fce', 'Suboden Khan', 'epic_hero', '12"', 5, '3+', 8, 6, 2, '{"Mounted", "Character", "Epic Hero", "Imperium", "Captain", "Suboden Khan"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('db55b563-afc7-796c-4d0b-c6ee43408572', 1, 115);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('db55b563-afc7-796c-4d0b-c6ee43408572', 'Onslaught Gatling Cannon', 'ranged', '24"', '8', '2+', 5, 0, '1', '{"Devastating Wounds"}'),
  ('db55b563-afc7-796c-4d0b-c6ee43408572', 'Stormtooth', 'melee', NULL, '6', '2+', 6, -2, '2', '{"Lance", "Anti-monster 4+", "Anti-vehicle 4+"}'),
  ('db55b563-afc7-796c-4d0b-c6ee43408572', 'Power Sword', 'melee', NULL, '8', '2+', 5, -2, '1', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('db55b563-afc7-796c-4d0b-c6ee43408572', 'Spear of Chogoris', 'unique', 'This model’s unit is eligible to shoot and declare a charge in a turn in which it Advanced or Fell Back. If that unit is already eligible to shoot and declare a charge in a turn in which it Advanced, add 1 to Advance and Charge rolls made for that unit instead.'),
  ('db55b563-afc7-796c-4d0b-c6ee43408572', 'Skilled Riders', 'unique', 'Each time a model in this model’s unit makes a Normal, Advance, Fall Back or Charge move, it can move horizontally through terrain features.'),
  ('db55b563-afc7-796c-4d0b-c6ee43408572', 'Leader', 'core', 'This model can be attached to the following units: ^^**Outrider Squad^^**'),
  ('db55b563-afc7-796c-4d0b-c6ee43408572', 'Oath of Moment', 'faction', '');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('6feb465c-e8c9-f540-e1ad-f4e65b77c1ad', 'db55b563-afc7-796c-4d0b-c6ee43408572', 'Wargear', 'Onslaught Gatling Cannon', true, 0, NULL, NULL, NULL),
  ('63dde2c8-dcd2-ffc1-126b-7c3cffd29f83', 'db55b563-afc7-796c-4d0b-c6ee43408572', 'Wargear', 'Stormtooth', false, 0, NULL, NULL, NULL),
  ('234cb03f-5a5a-8df4-fccf-b0a66faebf86', 'db55b563-afc7-796c-4d0b-c6ee43408572', 'Wargear', 'Power Sword', false, 0, NULL, NULL, NULL),
  ('093376b0-38b1-7e4d-e978-37a9cd02bc11', 'db55b563-afc7-796c-4d0b-c6ee43408572', 'Wargear', 'Heavy Bolt Pistol', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;


-- ============================================================
-- SEED DATA: Emperor's Children
-- Auto-generated from BSData/wh40k-10e
-- ============================================================

INSERT INTO public.factions (id, name, alignment) VALUES
  ('3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Emperor''s Children', 'chaos')
ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name, alignment = EXCLUDED.alignment;

-- Detachments
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('359ef477-969c-a599-6a2b-d3ed181a3aef', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Slaanesh''s Chosen', 'Internal Rivalries: ^^**Emperor''s Children Character**^^ units from your army can ignore any or all modifiers to their Move characteristic and any or all modifiers to Advance and Charge rolls made for them.

At the start of the battle, your **^^Warlord^^**''s unit is your army''s Favoured Champions. The first time in each player''s turn that an **^^Emperor''s Children Character**^^ unit from your army destroys an enemy unit, after resolving all of its attacks, that **^^Character**^^ unit becomes your army''s Favoured Champions, replacing the old one.

Each time a model in your army''s Favoured Champions unit makes an attack, you can re-roll the Wound roll.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('851bf888-0fe1-7198-4988-2e4457c5ae9c', '359ef477-969c-a599-6a2b-d3ed181a3aef', 'Eager to Prove', 15, 'You can re-roll Charge rolls made for the bearer''s unit. While the bearer''s unit is your army''s Favoured Champions, add 2" to the Move characteristic of models in that unit.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('1bab0366-4840-d3c2-dc55-39354bfdf7b7', '359ef477-969c-a599-6a2b-d3ed181a3aef', 'Repulsed by Weakness', 25, 'Each time an enemy unit (excluding **^^Monster**^^ and ^^**Vehicle**^^ units) within Engagement Range of the bearer''s unit Falls Back, models in that enemy unit must take Desperate Escape tests. When doing so, if the bearer''s unit is your army''s Favoured Champions, subtract 1 from each of those Desperate Escape tests.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('7d42ddc9-1add-f27a-4e57-1066e3e5fe0e', '359ef477-969c-a599-6a2b-d3ed181a3aef', 'Proud and Vainglorious', 20, 'You can re-roll Battle-shock and Leadership tests taken for the bearer''s unit. While the bearer''s unit is your army''s Favoured Champions, add 1 to the Objective Control characteristics of models in that unit.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('a1bb5291-1a3b-51ab-6482-bd12aa248c10', '359ef477-969c-a599-6a2b-d3ed181a3aef', 'Slayer of Champions', 15, 'The bearer''s melee weapons have the [^^Precision^^] ability, and each time the bearer makes a melee attack that targets a ^^**Character**^^ unit, improve the Strength and Armour Penetration characteristics of that attack by 1.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('ba87efa0-90f9-fb54-5378-f7fa0dd39bab', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Peerless Bladesmen', 'Exquisite Swordsmanship: Each time an ^^**Emperor''s Children**^^ unit from your army is selected to fight, if it made a Charge move this turn, select one of the abilities below. While resolving those attacks, melee weapons equipped by models in that unit have the ability:
- [^^Lethal Hits^^]
- [^^Sustained Hits 1^^]')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('42af4c84-8f4e-b22c-15db-a21bfa13d613', 'ba87efa0-90f9-fb54-5378-f7fa0dd39bab', 'Faultless Opportunist', 15, 'You can target the bearer''s unit with the Heroic Intervention Stratagem for 0CP; and can do so even if you have already targeted a different unit with that Stratagem this phase.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('32db2b9f-b513-cea5-072f-81da9ff317f2', 'ba87efa0-90f9-fb54-5378-f7fa0dd39bab', 'Blinding Speed', 25, 'Once per battle, at the start of the Fight phase, the bearer can use this Enhancement. If it does so, until the end of the phase, models in the bearer''s unit have the Fights First ability.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('f1697cca-d443-c631-1250-f9f850ad71fe', 'ba87efa0-90f9-fb54-5378-f7fa0dd39bab', 'Distortion', 25, 'Add 1 to the Attacks and Damage characteristics of melee weapons equipped by the bearer.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('cc302c9d-70df-a387-d875-045d069374b7', 'ba87efa0-90f9-fb54-5378-f7fa0dd39bab', 'Rise to the Challenge', 30, 'Once per battle, at the end of the Fight phase, if the bearer is within Engagement Range of three or more enemy models, it can use this Enhancement. If it does, the bearer can fight one additional time. When doing so, you can select one ability using the Exquisite Swordsmanship Detachment rule to apply to those attacks.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('81ea0821-6c41-b7e2-e224-5c0636c8bfda', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Rapid Evisceration', 'Mechanised Murder: Each time an ^^**Emperor''s Children^^** model from your army makes an attack, if it is a ^^**Transport^^** model or disembarked from a ^^**Transport^^** this turn, re-roll a Hit roll of 1 and re-roll a Wound roll of 1.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('8dfbdfbc-8d60-b746-3f42-520c435ca93e', '81ea0821-6c41-b7e2-e224-5c0636c8bfda', 'Sublime Presence', 25, 'Once per turn, in your Movement phase, the bearer can use this Enhancement. If it does, select one friendly **^^Emperor''s Children Transport**^^ that is in Strategic Reserves. Until the end of the phase, for the purposes of setting up that **^^Transport**^^ on the battlefield, treat the current battle round number as being one higher than it actually is.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('c76b045e-90b3-ed37-4273-e243880ae69d', '81ea0821-6c41-b7e2-e224-5c0636c8bfda', 'Spearhead Striker', 20, 'Each time the bearer disembarks from a **^^Transport**^^, until the end of the turn, you can re-roll Charge rolls made for the bearer''s unit and enemy units cannot use the Fire Overwatch Stratagem to shoot at the bearer''s unit.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('bd81b012-862c-63c2-bf14-8d348f7c2b37', '81ea0821-6c41-b7e2-e224-5c0636c8bfda', 'Accomplished Tactician', 35, 'Once per turn, in your opponent''s Shooting phase, just after an enemy unit has shot, you can select one friendly **^^Emperor''s Children**^^ unit within 9" of the bearer that was hit by one or more of those attacks, then select one friendly **^^Transport**^^ that unit is wholly within 6" of and is able to embark within. That **^^Emperor''s Children**^^ unit can embark in that **^^Transport**^^.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('20da3ae3-a6ee-e516-85fd-ede90b81c467', '81ea0821-6c41-b7e2-e224-5c0636c8bfda', 'Heretek Adept', 35, 'Once per battle round, when a saving throw is failed for a friendly **^^Emperor''s Children Vehicle**^^ model within 6" of the bearer, you can change the Damage characteristic of that attack to 0.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('53792888-3add-f98e-b4c6-4774d837e63d', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Coterie of the Conceited', 'Pledges to the Dark Prince: At the start of the battle round, if your **^^Warlord^^** is on the battlefield, you must pledge a number to Slaanesh representing how many enemy units will be destroyed this battle round. At the end of the battle round, if the number of enemy units destroyed this battle round is greater than or equal to your pledge, you gain a number of Pact points equal to your pledge. Otherwise, you do not gain any Pact points this battle round and your **^^Warlord**^^ model suffers D3 mortal wounds.

**^^Emperor''s Children^^** units from your army gain a bonus depending on how many Pact points you have gained during the battle, as shown below (these are all cumulative).

1+: Each time a model in this unit makes an attack, re-roll a Hit roll of 1.
3+: Each time a model in this unit makes an attack, re-roll a Wound roll of 1.
5+: Melee weapons equipped by models in this unit have the [^^Lethal Hits^^] and [^^Sustained Hits 1^^]] abilities.
7+: Each time a model in this unit makes an attack, a Critical Hit is scored on an unmodified Hit roll of 5+.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('2e395fd3-9b42-c0a1-442d-f9ba44184042', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Mercurial Host', 'Quicksilver Grace: You can re-roll Advance rolls made for **^^Emperor''s Children^^** units from your army.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('15812113-bf3b-d59e-beab-ab7f1ab43f02', '2e395fd3-9b42-c0a1-442d-f9ba44184042', 'Steeped in Suffering', 20, 'Each time a model in the bearer''s unit makes an attack that targets an enemy unit below its Starting Strength, add 1 to the Hit roll. If that target is also Below Half-Strength, add 1 to the Wound roll as well.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('91698783-92c3-c94a-c9d5-0962523325b8', '2e395fd3-9b42-c0a1-442d-f9ba44184042', 'Intoxicating Musk', 20, 'Each time a melee attack targets the bearer''s unit, if the Strength characteristic of that attack is greater than the Toughness characteristic of that unit, subtract 1 from the Wound roll.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('296d5499-4a04-c8d9-219a-609203f518b6', '2e395fd3-9b42-c0a1-442d-f9ba44184042', 'Tactical Perfection', 15, 'After both players have deployed their armies, select up to two **^^Emperor''s Children**^^ units from your army and redeploy them. When doing so, you can set those units up in Strategic Reserves if you wish, regardless of how many units are already in Strategic Reserves.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('362f31e7-603c-3596-a96b-6451ac85bde3', '2e395fd3-9b42-c0a1-442d-f9ba44184042', 'Loathsome Dexterity', 10, 'Each time a model in the bearer''s unit makes a Normal, Advance or Fall Back move, it can move through enemy models. When doing so, it can move within Engagement Range of such models, but cannot end that move within Engagement Range of them, and any Desperate Escape test is automatically passed.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('17d312b3-edfc-7290-6626-b201c3ebce33', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Carnival of Excess', 'Daemonic Empowerment: - While an ^^**Emperor''s Children^^** unit from your army is within 6" of one or more friendly ^^**Legions of Excess**^^ units, it is Empowered.
- While a ^^**Legions of Excess**^^ unit from your army is within 6" of one or more friendly  ^^**Emperor''s Children^^** units, it is Empowered.

While a unit from your army is Empowered, weapons equipped by models in that unit have the [^^Sustained Hits 1^^] ability. If such a weapon already has that ability, each time an attack is made with that weapon, an unmodified Hit roll of 5+ scores a Critical Hit.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('6cfe2090-ad86-8aa2-14f7-c2460899eade', '17d312b3-edfc-7290-6626-b201c3ebce33', 'Empyric Suffusion', 15, 'Once per battle round, you can target one friendly **^^Slaanesh**^^ unit within 6" of the bearer with the Heroic Intervention Stratagem for 0CP.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('58a4cb37-8a53-5957-f36d-ac7a870e7d89', '17d312b3-edfc-7290-6626-b201c3ebce33', 'Dark Blessings', 10, 'Once per battle, just after an enemy unit has selected its targets, the bearer can use this Enhancement. If it does, until the end of the phase, the bearer has a 3+ invulnerable save.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('77aba0c8-ec32-ac6b-85e0-3ba3401ab251', '17d312b3-edfc-7290-6626-b201c3ebce33', 'Possessed Blade', 25, 'At the start of the battle, select one melee weapon equipped by the bearer; add 1 to the Attacks characteristic of that weapon. In addition, each time the bearer is selected to fight, it can use this Enhancement. If it does, when resolving those attacks add 1 to the Damage characteristic of that weapon and that weapon has the [^^Devastating Wounds^^] and [^^Hazardous^^] abilities.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('3e9822cc-bd0e-aede-04dd-ca2d17733b42', '17d312b3-edfc-7290-6626-b201c3ebce33', 'Warp Walker', 30, 'Each time the bearer''s unit Advances, do not make an Advance roll. Instead, until the end of the phase, add 6" to the Movement characteristic of models in that unit. Each time a model in the bearer''s unit makes a Normal, Advance or Fall Back move, it can move through enemy models. When doing so, it can move within Engagement Range of such models, but cannot end that move within Engagement Range of them, and any Desperate Escape test is automatically passed.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('9e4f9acf-530c-b2ec-0124-4a81d4a9fbb3', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Court of the Phoenician', 'Sensational Performance: ^^**Emperor’s Children^^** units from your army have the following ability: 
**Sensational Performance**: Each time this unit is selected to fight, if this unit made a Charge move this turn, it can use this ability. If it does, until the end of the phase: 
- This unit cannot target a unit it was within Engagement Range of at the start of the turn. 
- This unit cannot target a unit that was the target of another unit’s attack this phase. 
- Improve the Strength and Armour Penetration characteristics of this unit’s melee weapons by 1.

Master of the Pageant: Once per battle round, when you target a ^^**Fulgrim^^** unit from your army with the Sinuous Breach or Prideful Superiority Stratagem, you can reduce the CP cost of that use of that Stratagem by 1CP.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('b298aa49-f511-3890-f6cb-e838d32f3f16', '9e4f9acf-530c-b2ec-0124-4a81d4a9fbb3', 'Soulstain Made Manifest', 15, 'At the start of the Fight phase, you can select one enemy unit within Engagement Range of the bearer; that unit must take a Battle‑shock test, subtracting 1 from the result.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('70799190-e8dd-8ac4-359d-938f5d137e06', '9e4f9acf-530c-b2ec-0124-4a81d4a9fbb3', 'Exalted Patron', 15, 'Add 1" to the Move characteristic of the bearer.
In the Declare Battle Formations step, the bearer can be attached to a ^^**Flawless Blades^^** unit.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('d0c52661-a841-403d-bc41-75f7b4f558aa', '9e4f9acf-530c-b2ec-0124-4a81d4a9fbb3', 'Spiritsliver', 20, 'Add 1 to the Strength and Attacks characteristics of the bearer’s melee weapons.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('4234ea2a-af4e-9bcc-9c90-b1dd213aa50b', '9e4f9acf-530c-b2ec-0124-4a81d4a9fbb3', 'Tears of the Phoenix', 25, 'Each time a model in the bearer’s unit makes a melee attack, you can ignore any or all modifiers to that attack’s Weapon Skill characteristic and any or all modifiers to the Hit roll and Wound roll.');

-- Units
INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('c76e9004-3fc2-cbc8-00ec-7607ffa81528', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Lucius the Eternal', 'epic_hero', '8"', 5, '2+', 6, 6, 1, '{"Infantry", "Character", "Epic Hero", "Chaos", "Slaanesh", "Lucius the Eternal"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('c76e9004-3fc2-cbc8-00ec-7607ffa81528', 1, 150);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('c76e9004-3fc2-cbc8-00ec-7607ffa81528', 'Blade of the Laer', 'melee', NULL, '6', '2+', 8, -3, '3', '{"Precision"}'),
  ('c76e9004-3fc2-cbc8-00ec-7607ffa81528', 'Lash of Torment', 'melee', NULL, '10', '2+', 4, -1, '1', '{"Sustained Hits 1"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('c76e9004-3fc2-cbc8-00ec-7607ffa81528', 'Leader', 'core', 'This model can be attached to the following units:
- **^^Flawless Blades^^**'),
  ('c76e9004-3fc2-cbc8-00ec-7607ffa81528', 'Duellist’s Hubris', 'unique', 'At the start of the Fight phase, if this model is not leading a unit, until the end of the phase, it has the Fights First ability.'),
  ('c76e9004-3fc2-cbc8-00ec-7607ffa81528', 'Invulnerable Save', 'invulnerable', 'This model has a 4+ invulnerable save.'),
  ('c76e9004-3fc2-cbc8-00ec-7607ffa81528', 'A Challenge Worthy of Skill', 'unique', 'Each time this model makes an attack that targets a **^^Character, Monster^^** or **^^Walker^^** unit, you can re-roll the Hit roll and re-roll the Wound roll.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('e9ee24fb-037e-e8d2-ca4a-37780f97eaf9', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Fulgrim', 'epic_hero', '16"', 11, '2+', 16, 5, 6, '{"Chaos", "Slaanesh", "Fulgrim", "Primarch", "Daemon", "Monster", "Fly", "Epic Hero", "Character"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('e9ee24fb-037e-e8d2-ca4a-37780f97eaf9', 1, 340);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('e9ee24fb-037e-e8d2-ca4a-37780f97eaf9', 'Malefic lash', 'ranged', '12"', '6', '2+', 8, -2, '2', '{"Sustained Hits 1"}'),
  ('e9ee24fb-037e-e8d2-ca4a-37780f97eaf9', 'Serpentine tail', 'melee', NULL, '6', '2+', 6, -1, '1', '{"Extra Attacks"}'),
  ('e9ee24fb-037e-e8d2-ca4a-37780f97eaf9', '➤ Daemonic blades - strike', 'melee', NULL, '6', '2+', 14, -3, 'D6+1', '{"Sustained Hits 1"}'),
  ('e9ee24fb-037e-e8d2-ca4a-37780f97eaf9', '➤ Daemonic blades - sweep', 'melee', NULL, '12', '2+', 8, -2, '2', '{"Sustained Hits 1"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('e9ee24fb-037e-e8d2-ca4a-37780f97eaf9', 'Invulnerable Save', 'invulnerable', 'This model has a 4+ invulnerable save.'),
  ('e9ee24fb-037e-e8d2-ca4a-37780f97eaf9', 'Daemonic Poisons', 'unique', 'In your Shooting phase and the Fight phase, after this model has finished making its attacks, select one enemy unit hit by one or more of those attacks. Until the end of the battle, that enemy unit is poisoned. At the start of each player''s Command phase, roll one D6 for each poisoned enemy unit on the battlefield: on a 4+, that enemy unit suffers D3 mortal wounds.'),
  ('e9ee24fb-037e-e8d2-ca4a-37780f97eaf9', 'Daemon Prince of Slaanesh', 'unique', 'At the start of your opponent''s Command phase, select one of the abilities in the Daemon Prince of Slaanesh section. Until the start of your opponent''s next Command phase, this model has that ability.'),
  ('e9ee24fb-037e-e8d2-ca4a-37780f97eaf9', 'Damaged: 1-6 Wounds Remaining', 'unique', 'While this model has 1-6 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('e9ee24fb-037e-e8d2-ca4a-37780f97eaf9', 'Supreme Commander', 'unique', 'If this model is in your army, it must be your **^^Warlord^^**.'),
  ('e9ee24fb-037e-e8d2-ca4a-37780f97eaf9', 'Serpentine', 'unique', 'Each time this model makes a Normal, Advance or Fall Back move, it can move over sections of terrain features that are 4" or less in height.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('508659f8-9c81-1ca6-f893-01a2fb98b19e', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Lord Exultant', 'character', '7"', 4, '3+', 5, 6, 1, '{"Character", "Infantry", "Chaos", "Slaanesh", "Lord Exultant"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('508659f8-9c81-1ca6-f893-01a2fb98b19e', 1, 80);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Close combat weapon', 'melee', NULL, '6', '2+', 4, 0, '1', '{}'),
  ('508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Rapture lash', 'melee', NULL, '4', '2+', 4, -1, '1', '{"Extra Attacks"}'),
  ('508659f8-9c81-1ca6-f893-01a2fb98b19e', '➤ Plasma pistol - standard', 'ranged', '12"', '1', '3+', 7, -2, '1', '{"Pistol"}'),
  ('508659f8-9c81-1ca6-f893-01a2fb98b19e', '➤ Plasma pistol - supercharge', 'ranged', '12"', '1', '3+', 8, -3, '2', '{"Hazardous", "Pistol"}'),
  ('508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Power fist', 'melee', NULL, '3', '3+', 8, -2, '2', '{}'),
  ('508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Phoenix power spear', 'melee', NULL, '5', '2+', 7, -2, '2', '{"Lance"}'),
  ('508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Master-crafted power sword', 'melee', NULL, '5', '2+', 5, -2, '2', '{"Precision"}'),
  ('508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Screamer pistol', 'ranged', '12"', '3', '2+', 5, -1, '2', '{"Ignores Cover", "Pistol"}'),
  ('508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Bolt pistol', 'ranged', '12"', '1', '3+', 4, 0, '1', '{"Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Invulnerable Save', 'invulnerable', 'This model has a 4+ invulnerable save.'),
  ('508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Perfectionists', 'unique', 'While this model is leading a unit, weapons equipped by models in that unit have the **^^[LETHAL HITS]^^** ability.'),
  ('508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Euphoric Strikes', 'unique', 'Once per battle, at the start of the Fight phase, this model can use this ability. If it does so, until the end of the phase, add 3 to the Attacks characteristic of melee weapons equipped by this model and improve the Armour Penetration characteristic of those weapons by 1.'),
  ('508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Lord of the Host', 'unique', 'If this model is attached to an **^^Emperor''s Children Battleline^^** unit during the Declare Battle Formations step, this model has the Infiltrators and Scouts 6" ability.'),
  ('508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Leader', 'core', 'This model can be attached to the following units: **^^Infractors; Tormentors^^**');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('45880894-939d-6595-5932-2299e058fe4e', '508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Wargear', 'Close combat weapon', true, 0, NULL, NULL, NULL),
  ('fb09ab89-c48f-4bcc-cc51-207f6880c101', '508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Wargear', 'Bolt pistol', false, 0, NULL, NULL, NULL),
  ('630cb93e-c303-7345-34fd-0b058b99a0e3', '508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Plasma Pistol', 'Rapture lash', true, 0, NULL, 'Plasma Pistol', 1),
  ('53a8ee90-cb94-18b5-8645-8cf8ba541e98', '508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Plasma Pistol', 'Plasma pistol', false, 0, NULL, 'Plasma Pistol', 1),
  ('f05b836d-9c78-be35-d1be-fc467e6a6102', '508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Plasma Pistol', 'Power fist', false, 0, NULL, 'Plasma Pistol', 1),
  ('08776d8c-ac4e-63bc-3ff3-8f4a765b8a2b', '508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Phoenix Power Spear', 'Phoenix power spear', true, 0, NULL, 'Phoenix Power Spear', 1),
  ('dae054d8-4806-5ff3-d3c8-1a0024168c39', '508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Phoenix Power Spear', 'Master-crafted power sword', false, 0, NULL, 'Phoenix Power Spear', 1),
  ('712f0883-d131-3ebb-f758-f2c681196b63', '508659f8-9c81-1ca6-f893-01a2fb98b19e', 'Phoenix Power Spear', 'Screamer pistol', false, 0, NULL, 'Phoenix Power Spear', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('ba290c3e-8b9a-b934-2e3c-4319fd5564d2', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Lord Kakophonist', 'character', '6"', 5, '2+', 6, 6, 1, '{"Character", "Infantry", "Chaos", "Slaanesh", "Lord Kakophonist"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('ba290c3e-8b9a-b934-2e3c-4319fd5564d2', 1, 70);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('ba290c3e-8b9a-b934-2e3c-4319fd5564d2', 'Power sword', 'melee', NULL, '6', '2+', 5, -2, '1', '{}'),
  ('ba290c3e-8b9a-b934-2e3c-4319fd5564d2', 'Close combat weapon', 'melee', NULL, '6', '2+', 4, 0, '1', '{}'),
  ('ba290c3e-8b9a-b934-2e3c-4319fd5564d2', 'Screamer pistol', 'ranged', '12"', '3', '2+', 5, -1, '2', '{"Ignores Cover", "Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('ba290c3e-8b9a-b934-2e3c-4319fd5564d2', 'Invulnerable Save', 'invulnerable', 'This model has a 4+ invulnerable save.'),
  ('ba290c3e-8b9a-b934-2e3c-4319fd5564d2', 'Leader', 'core', 'This model can be attached to the following units: **^^Emperor''s Children Terminator Squad; Noise Marines^^**'),
  ('ba290c3e-8b9a-b934-2e3c-4319fd5564d2', 'Obsessive Annunciation', 'unique', 'While this model is leading a unit, ranged weapons equipped by that unit have the [SUSTAINED HITS 1] ability.'),
  ('ba290c3e-8b9a-b934-2e3c-4319fd5564d2', 'Doom Siren', 'unique', 'In your Shooting phase, after this model''s unit has shot, select one enemy **^^Infantry^^** unit hit by one or more of those attacks and roll three D6: for each 4+, that enemy unit suffers 1 mortal wound. If an enemy suffers one or more mortal wounds as a result of this ability, it must take a Battle-shock test.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('c3edc675-04d4-aee2-33b2-418b81cb8d7c', 'ba290c3e-8b9a-b934-2e3c-4319fd5564d2', 'Wargear', 'Screamer pistol', true, 0, NULL, NULL, NULL),
  ('e740315e-9c3f-baea-f2fb-6f44cc723efb', 'ba290c3e-8b9a-b934-2e3c-4319fd5564d2', 'Weapons', 'Power sword', true, 0, NULL, 'Weapons', 1),
  ('54e53a33-4972-6e47-192a-e2870cdacdbb', 'ba290c3e-8b9a-b934-2e3c-4319fd5564d2', 'Weapons', 'Screamer pistol and close combat weapon', false, 0, NULL, 'Weapons', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('e3247303-64a2-a2a8-3544-d842b80fcdd6', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Sorcerer', 'character', '7"', 4, '3+', 4, 6, 1, '{"Character", "Infantry", "Psyker", "Chaos", "Slaanesh", "Sorcerer"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('e3247303-64a2-a2a8-3544-d842b80fcdd6', 1, 60);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('e3247303-64a2-a2a8-3544-d842b80fcdd6', 'Agonising Energies - witchfire', 'ranged', '18"', 'D6', '3+', 5, -1, 'D3', '{"Psychic"}'),
  ('e3247303-64a2-a2a8-3544-d842b80fcdd6', 'Agonising Energies - focused witchfire', 'ranged', '18"', 'D6', '3+', 6, -2, 'D3', '{"Devastating Wounds", "Hazardous", "Psychic"}'),
  ('e3247303-64a2-a2a8-3544-d842b80fcdd6', 'Force weapon', 'melee', NULL, '4', '3+', 6, -2, 'D3', '{"Psychic"}'),
  ('e3247303-64a2-a2a8-3544-d842b80fcdd6', 'Bolt pistol', 'ranged', '12"', '1', '3+', 4, 0, '1', '{"Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('e3247303-64a2-a2a8-3544-d842b80fcdd6', 'Leader', 'core', 'This model can be attached to the following units: **^^Infractors; Noise Marines; Tormentors^^**'),
  ('e3247303-64a2-a2a8-3544-d842b80fcdd6', 'Warped Interference (Psychic)', 'unique', 'While this model is leading a unit, each time a ranged attack targets that unit, models in it have the Benefit of Cover against that attack.'),
  ('e3247303-64a2-a2a8-3544-d842b80fcdd6', 'Wracking Agonies (Psychic)', 'unique', 'In your Shooting phase, after this model has shot, select one INFANTRY unit hit by one or more of those attacks made with its Agonising Energies. Until the start of your next turn, that unit is wracked with agonies. While a unit is wracked with agonies, subtract 2" from its Move characteristic and subtract 2 from charge rolls made for it.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('1bf8bf18-70d2-884e-1998-9d37caa689e5', 'e3247303-64a2-a2a8-3544-d842b80fcdd6', 'Wargear', 'Agonising Energies', true, 0, NULL, NULL, NULL),
  ('03002a83-17d9-bf4b-4215-1a575f5614fe', 'e3247303-64a2-a2a8-3544-d842b80fcdd6', 'Wargear', 'Force weapon', false, 0, NULL, NULL, NULL),
  ('362af8f8-aa1f-0b04-618c-8d5b4473ca66', 'e3247303-64a2-a2a8-3544-d842b80fcdd6', 'Wargear', 'Bolt pistol', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('10e4bbc0-e918-51bc-21e4-e603d8914be7', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Daemon Prince of Slaanesh', 'character', '10"', 10, '2+', 10, 6, 3, '{"Monster", "Character", "Chaos", "Daemon", "Slaanesh", "Daemon Prince"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('10e4bbc0-e918-51bc-21e4-e603d8914be7', 1, 180);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('10e4bbc0-e918-51bc-21e4-e603d8914be7', '➤ Hellforged weapons - strike', 'melee', NULL, '6', '2+', 8, -2, '3', '{}'),
  ('10e4bbc0-e918-51bc-21e4-e603d8914be7', '➤ Hellforged weapons - sweep', 'melee', NULL, '14', '2+', 6, 0, '1', '{}'),
  ('10e4bbc0-e918-51bc-21e4-e603d8914be7', 'Infernal cannon', 'ranged', '24"', '3', '2+', 5, -1, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('10e4bbc0-e918-51bc-21e4-e603d8914be7', 'Invulnerable Save', 'invulnerable', 'This model has a 4+ invulnerable save.'),
  ('10e4bbc0-e918-51bc-21e4-e603d8914be7', 'Lord of Excess', 'unique', 'While this model is within 3" of one or more friendly **^^Slaanesh Infantry^^**, this model has the Lone Operative ability.'),
  ('10e4bbc0-e918-51bc-21e4-e603d8914be7', 'Excessive Vigour (Aura)', 'unique', 'While a friendly **^^Slaanesh^^** unit is within 6" of this model, if that unit made a Charge move this turn, improve the Armour Penetration characteristic of melee weapons equipped by that unit by 1.'),
  ('10e4bbc0-e918-51bc-21e4-e603d8914be7', 'Ecstatic Death', 'unique', 'If this model is destroyed by a melee attack, if it has not fought this phase, roll one D6: on a 2+, do not remove it from play. This model can fight after the attacking unit has finished making its attacks, and is then removed from play.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('78744838-ad1f-fd59-82f9-19a43ff8b047', '10e4bbc0-e918-51bc-21e4-e603d8914be7', 'Wargear', 'Hellforged weapons', true, 0, NULL, NULL, NULL),
  ('1948e5a7-ddc9-7448-c5e1-7cc3b83d4e9e', '10e4bbc0-e918-51bc-21e4-e603d8914be7', 'Wargear', 'Infernal cannon', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('4a088edb-9312-969d-80ed-be1123835ffd', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Daemon Prince of Slaanesh with Wings', 'character', '14"', 9, '2+', 10, 6, 3, '{"Monster", "Character", "Chaos", "Daemon", "Slaanesh", "Fly", "Daemon Prince with Wings"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('4a088edb-9312-969d-80ed-be1123835ffd', 1, 215);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('4a088edb-9312-969d-80ed-be1123835ffd', '➤ Hellforged weapons - strike', 'melee', NULL, '6', '2+', 8, -2, '3', '{}'),
  ('4a088edb-9312-969d-80ed-be1123835ffd', '➤ Hellforged weapons - sweep', 'melee', NULL, '14', '2+', 6, 0, '1', '{}'),
  ('4a088edb-9312-969d-80ed-be1123835ffd', 'Infernal cannon', 'ranged', '24"', '3', '2+', 5, -1, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('4a088edb-9312-969d-80ed-be1123835ffd', 'Invulnerable Save', 'invulnerable', 'This model has a 4+ invulnerable save.'),
  ('4a088edb-9312-969d-80ed-be1123835ffd', 'Daemonic Destruction', 'unique', 'Each time this model ends a Charge move, select one enemy unit within Engagement Range of this model and roll one D6 for each of this model''s remaining wounds: for each 4+, that enemy unit suffers 1 mortal wound (to a maximum of 6 mortal wounds).'),
  ('4a088edb-9312-969d-80ed-be1123835ffd', 'Stimulated by Pain', 'unique', 'Each time an attack is allocated to this model, subtract 1 from the Damage characteristic of that attack.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('939a9516-97ff-1b01-191c-f4b020e8a063', '4a088edb-9312-969d-80ed-be1123835ffd', 'Wargear', 'Hellforged weapons', true, 0, NULL, NULL, NULL),
  ('a419aeb6-16b5-8778-9dc4-756197ee3678', '4a088edb-9312-969d-80ed-be1123835ffd', 'Wargear', 'Infernal cannon', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('ab55d929-a78d-62c6-ee4b-390f7312d141', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Tormentors', 'battleline', '7"', 4, '3+', 2, 6, 2, '{"Infantry", "Battleline", "Chaos", "Slaanesh", "Tormentors"}', 6, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('ab55d929-a78d-62c6-ee4b-390f7312d141', 5, 85);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('ab55d929-a78d-62c6-ee4b-390f7312d141', 'Bolt pistol', 'ranged', '12"', '1', '3+', 4, 0, '1', '{"Pistol"}'),
  ('ab55d929-a78d-62c6-ee4b-390f7312d141', '➤ Plasma pistol - standard', 'ranged', '12"', '1', '3+', 7, -2, '1', '{"Pistol"}'),
  ('ab55d929-a78d-62c6-ee4b-390f7312d141', '➤ Plasma pistol - supercharge', 'ranged', '12"', '1', '3+', 8, -3, '2', '{"Hazardous", "Pistol"}'),
  ('ab55d929-a78d-62c6-ee4b-390f7312d141', 'Rapture lash', 'melee', NULL, '6', '3+', 4, -1, '1', '{}'),
  ('ab55d929-a78d-62c6-ee4b-390f7312d141', 'Power sword', 'melee', NULL, '4', '3+', 5, -2, '1', '{}'),
  ('ab55d929-a78d-62c6-ee4b-390f7312d141', 'Boltgun', 'ranged', '24"', '2', '3+', 4, 0, '1', '{"Precision"}'),
  ('ab55d929-a78d-62c6-ee4b-390f7312d141', 'Close combat weapon', 'melee', NULL, '3', '3+', 4, 0, '1', '{}'),
  ('ab55d929-a78d-62c6-ee4b-390f7312d141', '➤ Plasma gun - standard', 'ranged', '24"', '1', '3+', 7, -2, '1', '{"Precision", "Rapid Fire 1"}'),
  ('ab55d929-a78d-62c6-ee4b-390f7312d141', '➤ Plasma gun - supercharge', 'ranged', '24"', '1', '3+', 8, -3, '2', '{"Hazardous", "Precision", "Rapid Fire 1"}'),
  ('ab55d929-a78d-62c6-ee4b-390f7312d141', 'Meltagun', 'ranged', '12"', '1', '3+', 9, -4, 'D6', '{"Melta 2", "Precision"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('ab55d929-a78d-62c6-ee4b-390f7312d141', 'Objective Defiled', 'unique', 'At the end of your Command phase, if this unit is within range of an objective marker you control, that objective marker remains under your control until your opponent''s Level of Control over that objective marker is greater than yours at the end of a phase.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('272449b6-40ca-2f0c-922f-1bf3aa2f6883', 'ab55d929-a78d-62c6-ee4b-390f7312d141', 'Obsessionist', 1, 1, 1, true, 2, NULL),
  ('01c3be1a-c5aa-735f-bb54-9af7b38f4878', 'ab55d929-a78d-62c6-ee4b-390f7312d141', 'Tormentor', 4, 9, 4, false, 1, '4-9 Tormentors'),
  ('a8fb4ca0-6308-82eb-bda9-6e5a46fbab8b', 'ab55d929-a78d-62c6-ee4b-390f7312d141', 'Tormentor w/ plasma gun', 0, 2, 0, false, 2, '4-9 Tormentors'),
  ('358167d2-e826-ce86-8466-3398da3dfd61', 'ab55d929-a78d-62c6-ee4b-390f7312d141', 'Tormentor w/ meltagun', 0, 2, 0, false, 3, '4-9 Tormentors')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('a86727ed-1fc6-e96a-8b27-31c869fa08c2', 'ab55d929-a78d-62c6-ee4b-390f7312d141', '4-9 Tormentors', 'Tormentor', true, 0, NULL, NULL, NULL),
  ('e46fd43a-3fb1-c86e-0c87-1ba800641b86', 'ab55d929-a78d-62c6-ee4b-390f7312d141', '4-9 Tormentors', 'Tormentor w/ plasma gun', false, 0, NULL, NULL, NULL),
  ('48e5ce7b-10e0-0524-99a1-f5ae56b93624', 'ab55d929-a78d-62c6-ee4b-390f7312d141', '4-9 Tormentors', 'Tormentor w/ meltagun', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('7203f668-1eeb-53cb-2155-43ccb452172f', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Infractors', 'battleline', '7"', 4, '3+', 2, 6, 2, '{"Infantry", "Battleline", "Chaos", "Slaanesh", "Infractors"}', 6, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('7203f668-1eeb-53cb-2155-43ccb452172f', 1, 85);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('7203f668-1eeb-53cb-2155-43ccb452172f', 'Bolt pistol', 'ranged', '12"', '1', '3+', 4, 0, '1', '{"Pistol"}'),
  ('7203f668-1eeb-53cb-2155-43ccb452172f', '➤ Plasma pistol - standard', 'ranged', '12"', '1', '3+', 7, -2, '1', '{"Pistol"}'),
  ('7203f668-1eeb-53cb-2155-43ccb452172f', '➤ Plasma pistol - supercharge', 'ranged', '12"', '1', '3+', 8, -3, '2', '{"Hazardous", "Pistol"}'),
  ('7203f668-1eeb-53cb-2155-43ccb452172f', 'Rapture lash', 'melee', NULL, '6', '3+', 4, -1, '1', '{}'),
  ('7203f668-1eeb-53cb-2155-43ccb452172f', 'Power sword', 'melee', NULL, '4', '3+', 5, -2, '1', '{}'),
  ('7203f668-1eeb-53cb-2155-43ccb452172f', 'Duelling sabre', 'melee', NULL, '4', '3+', 4, -1, '1', '{"Precision"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('7203f668-1eeb-53cb-2155-43ccb452172f', 'Excessive Assault', 'unique', 'Each time a model in this unit targets an enemy unit with a melee attack, re-roll a Wound roll of 1. If that enemy unit is within range of an objective marker, you can re-roll the Wound roll instead.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('4f363b35-1961-beab-1e67-195d7cc8d2f0', '7203f668-1eeb-53cb-2155-43ccb452172f', 'Obsessionist', 1, 1, 1, true, 2, NULL),
  ('66879101-9001-2803-26b8-850420b24c3e', '7203f668-1eeb-53cb-2155-43ccb452172f', 'Infractor', 4, 9, 4, false, 1, '4-9 Infractors')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('d8d217a4-e9be-3678-d575-f8e0abe7a5a1', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Flawless Blades', 'infantry', '8"', 5, '3+', 3, 6, 1, '{"Infantry", "Chaos", "Slaanesh", "Flawless Blades"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('d8d217a4-e9be-3678-d575-f8e0abe7a5a1', 3, 110);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('d8d217a4-e9be-3678-d575-f8e0abe7a5a1', 'Blissblade', 'melee', NULL, '4', '2+', 6, -3, '2', '{}'),
  ('d8d217a4-e9be-3678-d575-f8e0abe7a5a1', 'Bolt pistol', 'ranged', '12"', '1', '3+', 4, 0, '1', '{"Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('d8d217a4-e9be-3678-d575-f8e0abe7a5a1', 'Daemonic Patrons', 'unique', 'Each time this unit is selected to fight, it can call upon daemonic patrons. If it does, until the end of the phase, each time a model in this unit makes an attack. an unmodified Wound roll of 3+ scores a Critical Wound. At the end of the Fight phase, if this unit called upon daemonic patrons this phase and no enemy models were destroyed by attacks made by models in this unit this phase, one model in this unit is destroyed.'),
  ('d8d217a4-e9be-3678-d575-f8e0abe7a5a1', 'Invulnerable Save', 'invulnerable', 'Models in this unit have a 5+ invulnerable save.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('c871219d-9ea7-c65a-d9da-f6a305f08ff8', 'd8d217a4-e9be-3678-d575-f8e0abe7a5a1', 'Flawless Blade', 3, 6, 3, false, 2, NULL)
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('ff998371-52b8-45b9-fabc-2ae498db6ac8', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Chaos Terminators', 'infantry', '6"', 5, '2+', 3, 6, 1, '{"Infantry", "Chaos", "Terminator", "Slaanesh", "Terminator Squad"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('ff998371-52b8-45b9-fabc-2ae498db6ac8', 5, 155),
  ('ff998371-52b8-45b9-fabc-2ae498db6ac8', 6, 360);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Combi-weapon', 'ranged', '24"', '1', '4+', 4, 0, '1', '{"Anti-INFANTRY 4+", "Devastating Wounds", "Rapid Fire 1"}'),
  ('ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Chainfist', 'melee', NULL, '3', '4+', 8, -2, '2', '{"Anti-VEHICLE 3+"}'),
  ('ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Power fist', 'melee', NULL, '3', '3+', 8, -2, '2', '{}'),
  ('ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Paired accursed weapons', 'melee', NULL, '5', '3+', 5, -2, '1', '{"Twin-linked"}'),
  ('ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Heavy flamer', 'ranged', '12"', 'D6', 'N/A', 5, -1, '1', '{"Ignores Cover", "Torrent"}'),
  ('ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Reaper autocannon', 'ranged', '36"', '4', '3+', 7, -1, '1', '{"Devastating Wounds", "Sustained Hits 1"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Lethal Obsession', 'unique', 'In your Shooting phase, each time this unit is selected to shoot, if it makes one or more shooting attacks and all of those attacks target the same enemy unit, until the end of the turn, each time this unit declares a charge, if that enemy unit is a target of that charge, you can re-roll the Charge roll.'),
  ('ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Invulnerable Save', 'invulnerable', 'Models in this unit have a 4+ invulnerable save.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('ce159cd7-3bad-0bd1-1564-e9f6f5236861', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Terminator Champion', 1, 1, 1, true, 2, NULL),
  ('c485323c-4b8f-5251-971c-b6d3c0b80d2c', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Accursed weapon and combi-bolter', 0, 4, 0, false, 1, '4 Terminators'),
  ('c3e8a41b-6071-93c0-b2cb-5244491576ec', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Accursed weapon and combi-weapon', 0, 4, 0, false, 2, '4 Terminators'),
  ('ccee58aa-55c1-0008-0a7f-c83e5d4bd091', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Power fist and combi-weapon', 0, 3, 0, false, 3, '4 Terminators'),
  ('fa744e06-6992-420d-2d0f-126cd3a9d5bc', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Chainfist and combi-bolter', 0, 1, 0, false, 4, '4 Terminators'),
  ('65e0ffd6-a784-3afc-a88b-6b105482d2c3', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Heavy weapon', 0, 1, 0, false, 5, '4 Terminators'),
  ('365304fc-0e40-d545-16a3-4befa86b2518', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Power fist and combi-bolter', 0, 3, 0, false, 6, '4 Terminators'),
  ('f38d0713-c1b6-d823-f75b-a4b1f1042fbf', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Chainfist and combi-weapon', 0, 1, 0, false, 7, '4 Terminators'),
  ('4d01e846-5eda-72bd-5305-4aec07695ebc', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Paired accursed weapons', 0, 1, 0, false, 8, '4 Terminators')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('26c1fc84-3c0b-1ff4-46b3-f53016eb30d3', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Terminator Champion wargear', 'Accursed weapon and combi-bolter', true, 0, 'ce159cd7-3bad-0bd1-1564-e9f6f5236861', 'Wargear', 1),
  ('30b5cf0b-3751-b9cc-e151-be902b3e8827', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Terminator Champion wargear', 'Accursed weapon and combi-weapon', false, 0, 'ce159cd7-3bad-0bd1-1564-e9f6f5236861', 'Wargear', 1),
  ('c5a55bda-60c4-bfb3-e613-0f78d2abe090', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Terminator Champion wargear', 'Chainfist and combi-bolter', false, 0, 'ce159cd7-3bad-0bd1-1564-e9f6f5236861', 'Wargear', 1),
  ('471267f5-7fb4-e593-b895-a0fa4c2eb61d', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Terminator Champion wargear', 'Chainfist and combi-weapon', false, 0, 'ce159cd7-3bad-0bd1-1564-e9f6f5236861', 'Wargear', 1),
  ('5e947162-80bc-aeec-0bbf-2bc6e260e2f1', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Terminator Champion wargear', 'Power fist and combi-bolter', false, 0, 'ce159cd7-3bad-0bd1-1564-e9f6f5236861', 'Wargear', 1),
  ('190b61e6-2f1f-82e7-07bb-e6e62e721ecd', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Terminator Champion wargear', 'Power fist and combi-weapon', false, 0, 'ce159cd7-3bad-0bd1-1564-e9f6f5236861', 'Wargear', 1),
  ('3e0e0be9-ad3f-afc7-0b42-3c54e1ed3281', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', 'Terminator Champion wargear', 'Paired accursed weapons', false, 0, 'ce159cd7-3bad-0bd1-1564-e9f6f5236861', 'Wargear', 1),
  ('0fa23b51-4f31-f3e5-c5ec-256f3e9dea29', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', '4 Terminators', 'Accursed weapon and combi-bolter', false, 0, NULL, NULL, NULL),
  ('976054d2-0a35-9ade-ea8a-d784716a38ef', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', '4 Terminators', 'Accursed weapon and combi-weapon', false, 0, NULL, NULL, NULL),
  ('38ad3705-09b2-46d8-6074-e93318b54116', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', '4 Terminators', 'Power fist and combi-weapon', false, 0, NULL, NULL, NULL),
  ('603c0174-8c8b-d568-56b2-8e6e8bc51407', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', '4 Terminators', 'Chainfist and combi-bolter', false, 0, NULL, NULL, NULL),
  ('0e598872-dad1-1fdc-d630-0787c1fcf3c9', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', '4 Terminators', 'Heavy weapon', false, 0, NULL, NULL, NULL),
  ('355ca90e-682f-60a1-9894-437d32ee762a', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', '4 Terminators', 'Power fist and combi-bolter', false, 0, NULL, NULL, NULL),
  ('3776234b-3c51-c4a6-06fb-2f37c3d19d52', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', '4 Terminators', 'Chainfist and combi-weapon', false, 0, NULL, NULL, NULL),
  ('36d57d40-a414-b217-a028-5bfc64ea616c', 'ff998371-52b8-45b9-fabc-2ae498db6ac8', '4 Terminators', 'Paired accursed weapons', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('8ab33f5b-dee9-d566-25cc-3d1d5594aac7', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Chaos Spawn', 'beast', '10"', 5, '4+', 4, 7, 1, '{"Beast", "Chaos", "Slaanesh", "Chaos Spawn"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('8ab33f5b-dee9-d566-25cc-3d1d5594aac7', 2, 70);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('8ab33f5b-dee9-d566-25cc-3d1d5594aac7', 'Hideous Mutations', 'melee', NULL, 'D6+2', '4+', 5, -1, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('8ab33f5b-dee9-d566-25cc-3d1d5594aac7', 'Scuttling Horrors', 'unique', 'Once per turn, when an enemy unit ends a Normal, Advance or Fall Back move within 9" of this unit, this unit can make a Normal move of up to 6".');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('03d5f7b7-2259-7268-1ea5-87d8f77394ca', '8ab33f5b-dee9-d566-25cc-3d1d5594aac7', 'Chaos Spawn', 2, 2, 2, false, 2, NULL)
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('d4f181ed-9be1-fe08-2142-1b9f6bcb3724', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Chaos Land Raider', 'vehicle', '10"', 12, '2+', 16, 6, 5, '{"Vehicle", "Transport", "Smoke", "Chaos", "Slaanesh", "Land Raider"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('d4f181ed-9be1-fe08-2142-1b9f6bcb3724', 1, 220);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('d4f181ed-9be1-fe08-2142-1b9f6bcb3724', 'Armoured tracks', 'melee', NULL, '6', '4+', 8, 0, '1', '{}'),
  ('d4f181ed-9be1-fe08-2142-1b9f6bcb3724', 'Soulshatter lascannon', 'ranged', '48"', '2', '3+', 12, -3, 'D6+1', '{}'),
  ('d4f181ed-9be1-fe08-2142-1b9f6bcb3724', 'Combi-weapon', 'ranged', '24"', '1', '4+', 4, 0, '1', '{"Anti-INFANTRY 4+", "Devastating Wounds", "Rapid Fire 1"}'),
  ('d4f181ed-9be1-fe08-2142-1b9f6bcb3724', 'Havoc launcher', 'ranged', '48"', 'D6', '3+', 5, 0, '1', '{"Blast"}'),
  ('d4f181ed-9be1-fe08-2142-1b9f6bcb3724', 'Twin heavy bolter', 'ranged', '36"', '3', '3+', 5, -1, '2', '{"Sustained Hits 1", "Twin-linked"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('d4f181ed-9be1-fe08-2142-1b9f6bcb3724', 'Assault Ramp', 'unique', 'Each time a unit disembarks from this model after it has made a Normal move, that unit is still eligible to declare a charge this turn.'),
  ('d4f181ed-9be1-fe08-2142-1b9f6bcb3724', 'Damaged: 1-5 wounds remaining', 'unique', 'While this model has 1-5 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('a0df4bfd-59d8-6212-b9b6-b127af760cc3', 'd4f181ed-9be1-fe08-2142-1b9f6bcb3724', 'Wargear', 'Armoured tracks', true, 0, NULL, NULL, NULL),
  ('c4850aef-4c64-f43f-90f2-2616d5b1505b', 'd4f181ed-9be1-fe08-2142-1b9f6bcb3724', 'Wargear', 'Soulshatter lascannon', false, 0, NULL, NULL, NULL),
  ('f62fb025-b584-bf75-2839-f767d77be6e8', 'd4f181ed-9be1-fe08-2142-1b9f6bcb3724', 'Wargear', 'Havoc launcher', false, 0, NULL, NULL, NULL),
  ('c92ef219-aba7-29c1-5d0b-5931ba53e628', 'd4f181ed-9be1-fe08-2142-1b9f6bcb3724', 'Wargear', 'Twin heavy bolter', false, 0, NULL, NULL, NULL),
  ('75100ed4-0644-d336-e20e-899f153e4cca', 'd4f181ed-9be1-fe08-2142-1b9f6bcb3724', 'Pintle weapon', 'Combi-bolter', true, 0, NULL, 'Pintle weapon', 1),
  ('8e9f6736-db16-391e-2daa-ac1674f027bd', 'd4f181ed-9be1-fe08-2142-1b9f6bcb3724', 'Pintle weapon', 'Combi-weapon', false, 0, NULL, 'Pintle weapon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('d6d2e20f-c86c-ba33-255c-a7afa8113b8c', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Noise Marines', 'infantry', '6"', 5, '3+', 2, 6, 1, '{"Infantry", "Chaos", "Slaanesh", "Noise Marines"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('d6d2e20f-c86c-ba33-255c-a7afa8113b8c', 6, 145);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('d6d2e20f-c86c-ba33-255c-a7afa8113b8c', 'Power sword', 'melee', NULL, '4', '3+', 5, -2, '1', '{}'),
  ('d6d2e20f-c86c-ba33-255c-a7afa8113b8c', 'Screamer pistol', 'ranged', '12"', '3', '3+', 5, -1, '2', '{"Ignores Cover", "Pistol"}'),
  ('d6d2e20f-c86c-ba33-255c-a7afa8113b8c', 'Sonic blaster', 'ranged', '18"', '3', '3+', 5, -1, '2', '{"Ignores Cover"}'),
  ('d6d2e20f-c86c-ba33-255c-a7afa8113b8c', 'Close combat weapon', 'melee', NULL, '3', '3+', 4, 0, '1', '{}'),
  ('d6d2e20f-c86c-ba33-255c-a7afa8113b8c', '➤ Blastmaster - varied frequency', 'ranged', '18"', '6', '3+', 6, -2, '1', '{"Ignores Cover"}'),
  ('d6d2e20f-c86c-ba33-255c-a7afa8113b8c', '➤ Blastmaster - single frequency', 'ranged', '18"', '3', '3+', 10, -2, '3', '{"Ignores Cover"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('d6d2e20f-c86c-ba33-255c-a7afa8113b8c', 'Terrifying Crescendo', 'unique', 'In your Shooting phase, after this unit has shot, select one enemy unit hit by one or more of those attacks. Until the start of your next Shooting phase, each time a Battle-shock or Leadership test is taken for that enemy unit, subtract 1 from that test.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('ca4e88cb-6876-e70e-fa41-cfe6ad7d34e1', 'd6d2e20f-c86c-ba33-255c-a7afa8113b8c', 'Disharmonist', 1, 1, 1, true, 2, NULL),
  ('592a8531-eab0-10f7-4ddf-eab3b6ab9414', 'd6d2e20f-c86c-ba33-255c-a7afa8113b8c', 'Noise Marine w/ sonic blaster', 3, 5, 3, false, 1, '5 Noise Marines'),
  ('b19530e4-2801-98fb-c4e1-ef8d0707ec56', 'd6d2e20f-c86c-ba33-255c-a7afa8113b8c', 'Noise Marine w/ blastmaster', 0, 2, 0, false, 2, '5 Noise Marines')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('ca8eeaf0-8e5e-4c7d-37a5-2568966fddba', 'd6d2e20f-c86c-ba33-255c-a7afa8113b8c', '5 Noise Marines', 'Noise Marine w/ sonic blaster', true, 0, NULL, NULL, NULL),
  ('209a6069-72ea-e9a6-fe97-10e28ce678c0', 'd6d2e20f-c86c-ba33-255c-a7afa8113b8c', '5 Noise Marines', 'Noise Marine w/ blastmaster', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('a363d9fe-e3e4-1ca8-03ec-e72b53820a6b', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Heldrake', 'vehicle', '20"+', 10, '3+', 14, 7, 1, '{"Vehicle", "Fly", "Aircraft", "Chaos", "Daemon", "Heldrake", "Slaanesh"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('a363d9fe-e3e4-1ca8-03ec-e72b53820a6b', 1, 195);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('a363d9fe-e3e4-1ca8-03ec-e72b53820a6b', 'Heldrake claws', 'melee', NULL, '5', '3+', 7, -1, '2', '{"Anti-FLY 2+", "Devastating Wounds"}'),
  ('a363d9fe-e3e4-1ca8-03ec-e72b53820a6b', 'Baleflamer', 'ranged', '12"', 'D6+3', 'N/A', 6, -1, '2', '{"Ignores Cover", "Torrent"}'),
  ('a363d9fe-e3e4-1ca8-03ec-e72b53820a6b', 'Hades autocannon', 'ranged', '36"', '6', '3+', 8, -1, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('a363d9fe-e3e4-1ca8-03ec-e72b53820a6b', 'Airborne Predator', 'unique', 'Each time this model ends a Normal move, you can select one enemy unit that it moved over during that move and roll two D6, adding 1 to each result if that enemy unit can ^^FLY^^: for each 4+, that enemy unit suffers D3 mortal wounds.'),
  ('a363d9fe-e3e4-1ca8-03ec-e72b53820a6b', 'Invulnerable Save', 'invulnerable', 'This model has a 5+ invulnerable save.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('ea6c5490-c66f-afb7-4859-c1afd8caa773', 'a363d9fe-e3e4-1ca8-03ec-e72b53820a6b', 'Wargear', 'Heldrake claws', true, 0, NULL, NULL, NULL),
  ('9d9b2326-de72-e1e9-7f06-055ff73a1c1b', 'a363d9fe-e3e4-1ca8-03ec-e72b53820a6b', 'Mouth weapon', 'Baleflamer', true, 0, NULL, 'Mouth weapon', 1),
  ('3abe6e39-6475-ee96-64b7-a3e0c11b873d', 'a363d9fe-e3e4-1ca8-03ec-e72b53820a6b', 'Mouth weapon', 'Hades autocannon', false, 0, NULL, 'Mouth weapon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('c8e801ff-a66d-eece-7ab5-7f3299aa71ce', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Maulerfiend', 'vehicle', '10"', 10, '3+', 12, 6, 3, '{"Vehicle", "Walker", "Chaos", "Daemon", "Slaanesh", "Maulerfiend"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('c8e801ff-a66d-eece-7ab5-7f3299aa71ce', 1, 130);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('c8e801ff-a66d-eece-7ab5-7f3299aa71ce', 'Maulerfiend fists', 'melee', NULL, '6', '3+', 14, -2, 'D6+1', '{}'),
  ('c8e801ff-a66d-eece-7ab5-7f3299aa71ce', 'Magma cutter', 'ranged', '6"', '2', '3+', 9, -4, 'D6', '{"Melta 2"}'),
  ('c8e801ff-a66d-eece-7ab5-7f3299aa71ce', 'Lasher tendrils', 'melee', NULL, '6', '3+', 7, -1, '1', '{"Extra Attacks"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('c8e801ff-a66d-eece-7ab5-7f3299aa71ce', 'Glutton for Punishment', 'unique', 'Each time this model makes an attack, if it is below its Starting Strength, add 1 to the Hit roll. If this model is also Below Half-Strength, add 1 to the Wound roll as well.'),
  ('c8e801ff-a66d-eece-7ab5-7f3299aa71ce', 'Invulnerable Save', 'invulnerable', 'This model has a 5+ invulnerable save.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('8876e46a-d17e-f62b-5d05-12694f400fd8', 'c8e801ff-a66d-eece-7ab5-7f3299aa71ce', 'Wargear', 'Maulerfiend fists', true, 0, NULL, NULL, NULL),
  ('c5b14612-fc26-04ec-5fb6-f234b39a0cfe', 'c8e801ff-a66d-eece-7ab5-7f3299aa71ce', 'Head weapons', '2 magma cutters', true, 0, NULL, 'Head weapons', 1),
  ('f4c890e3-4077-3291-d14a-ed6b2a649a83', 'c8e801ff-a66d-eece-7ab5-7f3299aa71ce', 'Head weapons', 'Lasher tendrils', false, 0, NULL, 'Head weapons', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('f2513ee8-4b19-daf5-210c-496e801fc51b', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Chaos Rhino', 'dedicated_transport', '12"', 9, '3+', 10, 6, 2, '{"Vehicle", "Transport", "Dedicated Transport", "Chaos", "Rhino", "Smoke", "Slaanesh"}', 6, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('f2513ee8-4b19-daf5-210c-496e801fc51b', 1, 80);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('f2513ee8-4b19-daf5-210c-496e801fc51b', 'Armoured tracks', 'melee', NULL, '3', '4+', 6, 0, '1', '{}'),
  ('f2513ee8-4b19-daf5-210c-496e801fc51b', 'Combi-weapon', 'ranged', '24"', '1', '4+', 4, 0, '1', '{"Anti-INFANTRY 4+", "Devastating Wounds", "Rapid Fire 1"}'),
  ('f2513ee8-4b19-daf5-210c-496e801fc51b', 'Havoc launcher', 'ranged', '48"', 'D6', '3+', 5, 0, '1', '{"Blast"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('f2513ee8-4b19-daf5-210c-496e801fc51b', 'Assault Vehicle', 'unique', 'Units can disembark from this **^^Vehicle**^^ after it has Advanced. Units that do so count as having made a Normal move that phase, and cannot declare a charge in the same turn, but can otherwise act normally.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('4993cd1c-4552-6ec5-a8bc-80c8d8dcf0d7', 'f2513ee8-4b19-daf5-210c-496e801fc51b', 'Wargear', 'Armoured tracks', true, 0, NULL, NULL, NULL),
  ('527e3931-1095-52fa-962a-ad08dab98cae', 'f2513ee8-4b19-daf5-210c-496e801fc51b', 'Wargear', 'Combi-bolter', false, 0, NULL, NULL, NULL),
  ('2474a477-ff94-ff2b-7431-713cb82827e2', 'f2513ee8-4b19-daf5-210c-496e801fc51b', 'Wargear', 'Havoc launcher', false, 0, NULL, NULL, NULL),
  ('8b763d47-27a7-9a16-9ed6-bb0bdfb9ad0e', 'f2513ee8-4b19-daf5-210c-496e801fc51b', 'Pintle weapon', 'Combi-bolter', true, 0, NULL, 'Pintle weapon', 1),
  ('22ee2ff8-8f50-68d9-d840-c821fc0ac74e', 'f2513ee8-4b19-daf5-210c-496e801fc51b', 'Pintle weapon', 'Combi-weapon', false, 0, NULL, 'Pintle weapon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('8b7451e9-c8f1-212f-d064-cbcb7f467cf4', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Shalaxi Helbane', 'epic_hero', '14"', 10, '3+', 20, 6, 5, '{"Monster", "Character", "Epic Hero", "Psyker", "Chaos", "Daemon", "Slaanesh", "Shalaxi Helbane"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('8b7451e9-c8f1-212f-d064-cbcb7f467cf4', 1, 340);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('8b7451e9-c8f1-212f-d064-cbcb7f467cf4', 'Lash of Slaanesh', 'ranged', '12"', '6', '2+', 6, -1, '2', '{"Assault"}'),
  ('8b7451e9-c8f1-212f-d064-cbcb7f467cf4', '➤ Pavane of Slaanesh - witchfire', 'ranged', '18"', 'D6', '2+', 9, -1, 'D3', '{"Devastating Wounds", "Psychic"}'),
  ('8b7451e9-c8f1-212f-d064-cbcb7f467cf4', '➤ Pavane of Slaanesh - focused witchfire', 'ranged', '18"', 'D6', '2+', 9, -2, 'D3', '{"Hazardous", "Devastating Wounds", "Psychic", "Sustained Hits 3"}'),
  ('8b7451e9-c8f1-212f-d064-cbcb7f467cf4', 'Snapping claws', 'melee', NULL, '4', '2+', 6, -2, '3', '{"Devastating Wounds", "Extra Attacks"}'),
  ('8b7451e9-c8f1-212f-d064-cbcb7f467cf4', 'Soulpiercer', 'melee', NULL, '6', '2+', 12, -3, 'D6+2', '{"Precision"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('8b7451e9-c8f1-212f-d064-cbcb7f467cf4', 'Invulnerable Save', 'invulnerable', 'This model has a 4+ invulnerable save.'),
  ('8b7451e9-c8f1-212f-d064-cbcb7f467cf4', 'No Prey Can Evade', 'unique', 'You can re-roll Advance and Charge rolls made for this model.'),
  ('8b7451e9-c8f1-212f-d064-cbcb7f467cf4', 'Monarch of the Hunt', 'unique', 'At the start of the first battle round, select one enemy unit to be this model''s quarry. Each time this model makes a melee attack that targets its quarry, you can re-roll the Hit roll and you can re-roll the Wound roll. Each time this model''s quarry is destroyed, select one new enemy unit to be this model''s quarry.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('96bd8d5d-235e-7402-2a82-43c2ff32b937', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Keeper of Secrets', 'character', '14"', 10, '5+', 18, 6, 5, '{"Monster", "Character", "Psyker", "Chaos", "Daemon", "Slaanesh", "Keeper of Secrets"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('96bd8d5d-235e-7402-2a82-43c2ff32b937', 1, 240);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('96bd8d5d-235e-7402-2a82-43c2ff32b937', '➤ Phantasmagoria - witchfire', 'ranged', '18"', '6', '2+', 6, -2, '1', '{"Devastating Wounds", "Psychic"}'),
  ('96bd8d5d-235e-7402-2a82-43c2ff32b937', '➤ Phantasmagoria - focused witchfire', 'ranged', '18"', '9', '2+', 6, -2, '1', '{"Devastating Wounds", "Hazardous", "Psychic"}'),
  ('96bd8d5d-235e-7402-2a82-43c2ff32b937', 'Snapping claws', 'melee', NULL, '4', '2+', 6, -2, '3', '{"Devastating Wounds", "Extra Attacks"}'),
  ('96bd8d5d-235e-7402-2a82-43c2ff32b937', 'Witstealer sword', 'melee', NULL, '6', '2+', 8, -2, '3', '{}'),
  ('96bd8d5d-235e-7402-2a82-43c2ff32b937', 'Living whip', 'ranged', '12"', '6', '2+', 6, -1, '2', '{"Assault"}'),
  ('96bd8d5d-235e-7402-2a82-43c2ff32b937', 'Ritual knife', 'melee', NULL, '3', '2+', 6, -2, '2', '{"Extra Attacks"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('96bd8d5d-235e-7402-2a82-43c2ff32b937', 'Invulnerable Save', 'invulnerable', 'This model has a 4+ invulnerable save.'),
  ('96bd8d5d-235e-7402-2a82-43c2ff32b937', 'Daemon Lord of Slaanesh (Aura)', 'unique', 'While a friendly ^^**Legions of Excess**^^ unit is within 6" of this model, improve the Armour Penetration of melee weapons in that unit by 1.'),
  ('96bd8d5d-235e-7402-2a82-43c2ff32b937', 'Mesmerising Form', 'unique', 'Each time an attack targets this model, subtract 1 from the Hit roll.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('a9203459-2e69-b5a8-d370-ccef54fbf038', '96bd8d5d-235e-7402-2a82-43c2ff32b937', 'Wargear', 'Phantasmagoria', true, 0, NULL, NULL, NULL),
  ('3d81cd68-4ef3-5081-0634-a9f769e33831', '96bd8d5d-235e-7402-2a82-43c2ff32b937', 'Wargear', 'Snapping claws', false, 0, NULL, NULL, NULL),
  ('e07f19c2-3e13-f202-8297-0a1fed537602', '96bd8d5d-235e-7402-2a82-43c2ff32b937', 'Wargear', 'Witstealer sword', false, 0, NULL, NULL, NULL),
  ('c0fc5b43-739a-c122-848a-f1b380cb7b49', '96bd8d5d-235e-7402-2a82-43c2ff32b937', 'Wargear', 'Living whip', true, 0, NULL, 'Wargear', 1),
  ('5e51618c-4aad-cf35-cbc2-891eb9a31f04', '96bd8d5d-235e-7402-2a82-43c2ff32b937', 'Wargear', 'Ritual knife', false, 0, NULL, 'Wargear', 1),
  ('2c792378-929a-7abc-a897-434f6bccd346', '96bd8d5d-235e-7402-2a82-43c2ff32b937', 'Wargear', 'Shining aegis', false, 0, NULL, 'Wargear', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('89e5a959-f9f9-04e0-d245-21a64d184248', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Daemonettes', 'battleline', '9"', 3, '7+', 1, 7, 1, '{"Infantry", "Battleline", "Chaos", "Daemon", "Slaanesh", "Daemonettes", "Summoned"}', 6, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('89e5a959-f9f9-04e0-d245-21a64d184248', 10, 90);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('89e5a959-f9f9-04e0-d245-21a64d184248', 'Slashing claws', 'melee', NULL, '3', '3+', 4, -1, '1', '{"Devastating Wounds"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('89e5a959-f9f9-04e0-d245-21a64d184248', 'Horrifying Beauty', 'unique', 'At the start of the Fight phase, each enemy unit in Engagement Range of one or more units from your army with this ability must take a Battle-shock test, subtracting 1 from that test if that enemy unit is Below Half-strength.'),
  ('89e5a959-f9f9-04e0-d245-21a64d184248', 'Invulnerable Save', 'invulnerable', 'Models in this unit have a 5+ invulnerable save.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('17423738-7f80-fe6d-3b61-5c77ff0183c2', '89e5a959-f9f9-04e0-d245-21a64d184248', 'Daemonette', 9, 9, 9, false, 2, NULL),
  ('b824ff59-2e88-aead-cdf1-1d622f7e4cb9', '89e5a959-f9f9-04e0-d245-21a64d184248', 'Alluress', 1, 1, 1, true, 1, NULL)
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('a5d21511-0b41-0deb-a7c8-557052cda503', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Fiends', 'beast', '12"', 5, '7+', 4, 7, 2, '{"Beast", "Chaos", "Daemon", "Slaanesh", "Fiends", "Summoned"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('a5d21511-0b41-0deb-a7c8-557052cda503', 3, 95),
  ('a5d21511-0b41-0deb-a7c8-557052cda503', 4, 190);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('a5d21511-0b41-0deb-a7c8-557052cda503', 'Barbed tail and dissecting claws', 'melee', NULL, '5', '3+', 5, -2, '2', '{"Devastating Wounds"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('a5d21511-0b41-0deb-a7c8-557052cda503', 'Invulnerable Save', 'invulnerable', 'Models in this unit have a 5+ invulnerable save.'),
  ('a5d21511-0b41-0deb-a7c8-557052cda503', 'Soporific Musk', 'unique', 'Each time an enemy unit (excluding ^^**Monsters**^^ and **^^Vehicles**^^) within Engagement Range of one or more units from your army with this ability Falls Back, models in that unit must take Desperate Escape tests. When doing so, if that enemy unit is also Battle-shocked, subtract 1 from each of those Desperate Escape tests.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('c098ed39-2e9b-be54-241f-0dedfcd07315', 'a5d21511-0b41-0deb-a7c8-557052cda503', 'Fiends', 2, 5, 2, false, 2, NULL),
  ('fb64e76f-591d-6d13-01d6-4f55a5fd9530', 'a5d21511-0b41-0deb-a7c8-557052cda503', 'Blissbringer', 1, 1, 1, true, 1, NULL)
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('8bab11d2-f2fc-843f-d2a0-cc2b93dc9e6a', '3fa7d807-ad38-e1a0-d7f3-53447d6e6178', 'Seekers', 'mounted', '14"', 4, '7+', 2, 7, 1, '{"Mounted", "Chaos", "Daemon", "Slaanesh", "Seekers", "Summoned"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('8bab11d2-f2fc-843f-d2a0-cc2b93dc9e6a', 5, 80),
  ('8bab11d2-f2fc-843f-d2a0-cc2b93dc9e6a', 6, 160);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('8bab11d2-f2fc-843f-d2a0-cc2b93dc9e6a', 'Lashing tongues', 'melee', NULL, '2', '4+', 4, 0, '1', '{"Extra Attacks", "Lethal Hits"}'),
  ('8bab11d2-f2fc-843f-d2a0-cc2b93dc9e6a', 'Slashing claws', 'melee', NULL, '3', '3+', 4, -1, '1', '{"Devastating Wounds"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('8bab11d2-f2fc-843f-d2a0-cc2b93dc9e6a', 'Unholy Speed', 'unique', 'You can re-roll Advance and Charge rolls made for this unit.'),
  ('8bab11d2-f2fc-843f-d2a0-cc2b93dc9e6a', 'Invulnerable Save', 'invulnerable', 'Models in this unit have a 5+ invulnerable save.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('3a7b0ef9-fd16-1975-e286-2019e88b62ee', '8bab11d2-f2fc-843f-d2a0-cc2b93dc9e6a', 'Seeker', 4, 9, 4, false, 2, NULL),
  ('5f62b3aa-6f01-f63b-947d-a424819bc111', '8bab11d2-f2fc-843f-d2a0-cc2b93dc9e6a', 'Heartseeker', 1, 1, 1, true, 1, NULL)
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

-- Leader targets
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('1f256994-4d67-10ec-ed04-3851126e3df5', 'c76e9004-3fc2-cbc8-00ec-7607ffa81528', 'd8d217a4-e9be-3678-d575-f8e0abe7a5a1')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('f0342428-70ac-1de3-26c3-dc33c0e9b083', '508659f8-9c81-1ca6-f893-01a2fb98b19e', 'ab55d929-a78d-62c6-ee4b-390f7312d141')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('c4e2d912-cdb8-5c89-6072-a639c2aa44ca', '508659f8-9c81-1ca6-f893-01a2fb98b19e', '7203f668-1eeb-53cb-2155-43ccb452172f')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('8fcb5649-11a9-b279-af30-54a76ce6712c', 'ba290c3e-8b9a-b934-2e3c-4319fd5564d2', 'd6d2e20f-c86c-ba33-255c-a7afa8113b8c')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('bb53af53-9984-142f-0765-131a8a040d09', 'e3247303-64a2-a2a8-3544-d842b80fcdd6', 'ab55d929-a78d-62c6-ee4b-390f7312d141')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('035e72f4-f08f-885e-8a80-f6309543b065', 'e3247303-64a2-a2a8-3544-d842b80fcdd6', '7203f668-1eeb-53cb-2155-43ccb452172f')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('21fcdd50-d187-62c8-d3db-697d19363a42', 'e3247303-64a2-a2a8-3544-d842b80fcdd6', 'd6d2e20f-c86c-ba33-255c-a7afa8113b8c')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;


-- ============================================================
-- SEED DATA: Ynnari
-- Auto-generated from BSData/wh40k-10e
-- ============================================================

INSERT INTO public.factions (id, name, alignment) VALUES
  ('bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Ynnari', 'xenos')
ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name, alignment = EXCLUDED.alignment;

-- Detachments
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('1da136d7-3ab5-2643-bdc1-0640721e27c5', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Warhost', 'Martial Grace: At the start of the battle round, you receive 1 additional Battle Focus token.
Each time a unit from your army performs the Swift as the Wind Agile Manoeuvre, until the end of the phase, add an additional 1" to the Move characteristic of models in that unit.
Each time a unit from your army performs an Agile Manoeuvre that involves rolling a D6, add 1 to the result.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('7fdd0102-4bba-9208-da42-39824bdd73ba', '1da136d7-3ab5-2643-bdc1-0640721e27c5', 'Guiding Presence', 25, 'Aeldari Psyker model only. At the start of your Shooting phase, select one friendly Aeldari Vehicle model within 9" of the bearer. Until the end of the phase, each time that model makes an attack, add 1 to the Hit roll.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('e647ab54-9992-7c00-f672-2fd4c1f91b91', '1da136d7-3ab5-2643-bdc1-0640721e27c5', 'Harmonisation Matrix', 30, 'Aeldari model only. In your Command phase, if the bearer (or any Transport it is embarked within) is within range of an objective marker you control, roll one D6: on a 3+, you gain 1CP.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('00dc11f1-9d3e-d125-7819-d6ded5a74201', '1da136d7-3ab5-2643-bdc1-0640721e27c5', 'Spirit Stone of Raelyth', 20, 'Aeldari Psyker model only. While the bearer is within 3" of one or more friendly Aeldari Vehicle units, the bearer has the Lone Operative ability. In your Command phase, you can select one friendly Aeldari Vehicle model within 3" of the bearer. That model regains up to D3 lost wounds.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('89742a14-171d-f820-2076-83bd04a4e6a5', '1da136d7-3ab5-2643-bdc1-0640721e27c5', 'Guileful Strategist', 15, 'Aeldari model only. If your army includes the bearer, after both players have deployed their armies, select up to three Aeldari Vehicle units from your army and redeploy them. When doing so, any of those units can be placed into Strategic Reserves, regardless of how many units are already in Strategic Reserves.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('a398fe69-4ee0-0569-a79b-7e240aab6808', '1da136d7-3ab5-2643-bdc1-0640721e27c5', 'Psychic Destroyer', 30, '^^Asuryani^^ ^^Psyker^^ model only. Add 1 to the Damage characteristic of ranged Psychic weapons equipped by the bearer.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('b1f82cff-4397-89b5-8922-79c1e4189bdf', '1da136d7-3ab5-2643-bdc1-0640721e27c5', 'Phoenix Gem', 35, '^^Asuryani^^ model only. The first time the bearer is destroyed, remove it from play, then, at the end of the phase, roll one D6: on a 2+, set the bearer back up on the battlefield as close as possible to where it was destroyed and not within Engagement Range of one of more enemy units, with its full wounds remaining.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('0340935a-1876-a126-44c9-c0fd5d201a89', '1da136d7-3ab5-2643-bdc1-0640721e27c5', 'Gift of Foresight', 15, '^^Asuryani^^ model only. Once per battle round, you can target the bearer''s unit with the Command Re-roll Stratagem for 0CP.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('f3d491bc-e4c1-bbaa-0fc1-4d1d649e87e8', '1da136d7-3ab5-2643-bdc1-0640721e27c5', 'Timeless Strategist', 15, '^^Asuryani^^ model only. At the start of the battle round, if the bearer is on the battlefield (or any Transport it is embarked within is on the battlefield), you receive 1 additional Battle Focus token.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('cca9c025-4de2-3ba5-dae8-76f3aad96007', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Realspace Raiders', 'Alliance of Agony: At the start of the battle, you gain 2 Pain tokens for each of the following combinations your army contains (these do not need to be in the same Attached unit):
■ One or more **^^Archon^^** models and one or more **^^Kabalite Warriors^^** units.
■ One or more **^^Succubus^^** models and one or more **^^Wyches^^** units.
■ One or more **^^Haemonculus^^** models and one or more **^^Wracks^^** units.

Designer’s Note: These are all cumulative, so if your army contains at least one of all of the combinations listed above, you start the battle with 6 Pain tokens.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('b7ca90e3-8f06-6036-337b-a754767faad7', 'cca9c025-4de2-3ba5-dae8-76f3aad96007', 'Crucible of Malediction', 20, '**^^Haemonculus^^** model only. Once per battle, in your Shooting phase, the bearer can use this Enhancement. If it does, you can spend 1 Pain token. Then, each enemy unit within 12" of the bearer must take a Battle-shock test, subtracting 1 from that test if you spent 1 Pain token. Each time a **^^Psyker^^** unit fails that test, it suffers 3 mortal wounds.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('1cdcec2f-0364-292b-eb7c-694f02f1e943', 'cca9c025-4de2-3ba5-dae8-76f3aad96007', 'Eye of Spite', 15, '**^^Succubus^^** model only. Improve the Attacks and Armour Penetration characteristics of the bearer’s melee weapons by 1. Each time the bearer''s unit is selected to fight, you can spend 1 Pain token; if you do, until the end of the phase, improve the Attacks and Armour Penetration characteristics of the bearer’s melee weapons by 2 instead.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('c2b29bff-1502-08d9-c70c-1945d2a6e49c', 'cca9c025-4de2-3ba5-dae8-76f3aad96007', 'Labyrinthine Cunning', 25, '**^^Archon^^** model only. At the start of your Command phase, if the bearer is on the battlefield, you can do one of the following:
Spend 1 Pain token and gain 1CP.
Roll one D6: on a 4+, you gain 1CP.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('781d36ac-27b3-e07e-efef-3244e430aa2a', 'cca9c025-4de2-3ba5-dae8-76f3aad96007', 'Dark Vitality', 25, '**^^Drukhari^^** model only. The bearer''s unit is always Empowered - you do not need to spend any Pain tokens to activate that unit''s Pain abilities');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('b10be7c1-edd7-a887-2745-86c4292bcf8c', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Skysplinter Assault', 'Rain of Cruelty: Each time a ^^**Drukhari**^^ unit from your army disembarks from a ^^**Transport**^^, until the end of the turn:
Ranged weapons equipped by models in that disembarking units have the ^^**[Ignores Cover]**^^ ability.
Melee weapons equipped by models in that disembarking unit have the ^^**[Lance]**^^ ability.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('01f79d82-b291-1a36-ef09-f485fefa1c17', 'b10be7c1-edd7-a887-2745-86c4292bcf8c', 'Phantasmal Smoke', 15, '^^**Drukhari**^^ model only. While the bearer’s unit is wholly within 6" of a friendly ^^**Drukhari Transport**^^:
Models in the bearer’s unit have the  Stealth ability
Each time a ranged attack targets the bearer''s unit, models in that unit have the Benefit of Cover against that attack.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('abbce7c0-71f2-c4fc-9931-3b9a2e879476', 'b10be7c1-edd7-a887-2745-86c4292bcf8c', 'Sadistic Fulcrum', 15, '^^**Drukhari**^^ model only. Each time you spend 1 Pain token to Empower the bearer’s unit in the Shooting phase, select one friendly ^^**Drukhari Transport**^^ within 6" of the bearer’s unit; until the end of the phase, each time that ^^**Transport**^^ makes an attack, you can re-roll the Hit roll.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('bddffcd1-ebc8-ac5d-7381-d276d6ff7b92', 'b10be7c1-edd7-a887-2745-86c4292bcf8c', 'Spiteful Raider', 10, '^^**Drukhari**^^ model only. Each time the bearer’s unit destroys an enemy unit in the Fight phase, if that enemy unit was within range of one or more objective markers when the bearer’s unit was selected to fight, you gain 1 additional Pain token.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('90a4b561-21e6-aab7-f094-515c7105b861', 'b10be7c1-edd7-a887-2745-86c4292bcf8c', 'Nightmare Shroud', 20, '^^**Drukhari**^^ model only. Each time the bearer’s unit disembarks from a ^^**Transport**^^, until the end of the turn, enemy units cannot use the Fire Overwatch Stratagem to shoot at the bearer’s unit.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('0b72c0a7-c01e-210b-5d4c-8512cbb0ac58', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Reaper''s Wager', 'Callous Competition: At the start of the battle, Drukhari units from your army are winning the wager.
Each time a Drukhari unit from your army destroys an enemy unit, Drukhari units from your army are winning the wager.
Each time a Harlequins unit from your army destroys an enemy unit, Harlequin units from your army are winning the wager.
While Drukhari units from your army are winning the wager, Harlequin units from your army are losing the wager, and vice versa.
Each time a Drukhari or Harlequins model from your army makes an attack, if that model’s unit is winning the wager, re-roll a Hit roll of 1. If that model''s unit is losing the wager, re‑roll a Hit roll of 1 and re‑roll a Wound roll of 1 instead.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('fea3f156-5a0f-3b19-9d93-65b61552dcd8', '0b72c0a7-c01e-210b-5d4c-8512cbb0ac58', 'Archraider', 15, '^^**Harlequins**^^ or ^^**Drukhari**^^ model only. In the Declare Battle Formations step, if the bearer starts the battle embarked within a ^^**Dedicated Transport**^^, that ^^**Dedicated Transport**^^ has the Scouts 9" ability.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('9f9208bc-6b9d-f423-921c-cbe9310ce852', '0b72c0a7-c01e-210b-5d4c-8512cbb0ac58', 'Webway walker', 15, '^^**Harlequins**^^ or ^^**Drukhari**^^ model only. Models in the bearer’s unit have the Deep Strike ability. Each time the bearer’s unit is set up on the battlefield using the Deep Strike ability, if that unit is currently losing the wager, until the end of the turn, you can re‑roll Charge rolls made for that unit.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('95d8bcb7-73de-bc7e-03ec-fe0cf8bad564', '0b72c0a7-c01e-210b-5d4c-8512cbb0ac58', 'Reaper''s Cowl', 25, '^^**Harlequins**^^ model only. Models in the bearer’s unit have the Stealth and Infiltrators abilities.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('293581e1-3f4b-a971-efee-4182fdeded00', '0b72c0a7-c01e-210b-5d4c-8512cbb0ac58', 'Conductor of Torment', 20, '^^**Drukhari**^^ model only. In your Command phase, you can do one of the following:
■ If your ^^**Drukhari**^^ units are currently losing the wager, you can gain 1 Pain token. If you do, ^^**Drukhari**^^ units from your army are now winning the wager.
■ If your ^^**Drukhari**^^ units are currently winning the wager, you can discard 1 Pain token. If you do, ^^**Harlequins**^^ units from your army are now winning the wager.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('518e3d76-af3a-e5d0-3a0a-811b29b58ab8', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Armoured Warhost', 'Skilled Crews: Ranged weapons equipped by Aeldari Vehicle models from your army have the [ASSAULT] ability and you can re‑roll Advance rolls made for Aeldari Vehicle Fly units from your army.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('c64b4cbd-ee75-9c14-7799-36474107655b', '518e3d76-af3a-e5d0-3a0a-811b29b58ab8', 'Guiding Presence', 25, 'Aeldari Psyker model only. At the start of your Shooting phase, select one friendly Aeldari Vehicle model within 9" of the bearer. Until the end of the phase, each time that model makes an attack, add 1 to the Hit roll.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('aa4f2893-557d-302c-86cd-311b8f2d7725', '518e3d76-af3a-e5d0-3a0a-811b29b58ab8', 'Harmonisation Matrix', 30, 'Aeldari model only. In your Command phase, if the bearer (or any Transport it is embarked within) is within range of an objective marker you control, roll one D6: on a 3+, you gain 1CP.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('495c41c7-7616-13f9-fe36-d853f7030d61', '518e3d76-af3a-e5d0-3a0a-811b29b58ab8', 'Spirit Stone of Raelyth', 20, 'Aeldari Psyker model only. While the bearer is within 3" of one or more friendly Aeldari Vehicle units, the bearer has the Lone Operative ability. In your Command phase, you can select one friendly Aeldari Vehicle model within 3" of the bearer. That model regains up to D3 lost wounds.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('21255c9d-d620-7a33-fcd8-1856e261c5b2', '518e3d76-af3a-e5d0-3a0a-811b29b58ab8', 'Guileful Strategist', 15, 'Aeldari model only. If your army includes the bearer, after both players have deployed their armies, select up to three Aeldari Vehicle units from your army and redeploy them. When doing so, any of those units can be placed into Strategic Reserves, regardless of how many units are already in Strategic Reserves.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('313a9e4b-054a-0d4f-f1ba-ae2e93e44ff6', '518e3d76-af3a-e5d0-3a0a-811b29b58ab8', 'Psychic Destroyer', 30, '^^Asuryani^^ ^^Psyker^^ model only. Add 1 to the Damage characteristic of ranged Psychic weapons equipped by the bearer.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('6f92bad1-6775-524a-e2d8-7207ab58f2a4', '518e3d76-af3a-e5d0-3a0a-811b29b58ab8', 'Phoenix Gem', 35, '^^Asuryani^^ model only. The first time the bearer is destroyed, remove it from play, then, at the end of the phase, roll one D6: on a 2+, set the bearer back up on the battlefield as close as possible to where it was destroyed and not within Engagement Range of one of more enemy units, with its full wounds remaining.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('1a9f438a-dc3d-7e6a-d812-9fe8f9a78f30', '518e3d76-af3a-e5d0-3a0a-811b29b58ab8', 'Gift of Foresight', 15, '^^Asuryani^^ model only. Once per battle round, you can target the bearer''s unit with the Command Re-roll Stratagem for 0CP.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('143d303e-cff4-68a8-6683-8f720ac7bf2f', '518e3d76-af3a-e5d0-3a0a-811b29b58ab8', 'Timeless Strategist', 15, '^^Asuryani^^ model only. At the start of the battle round, if the bearer is on the battlefield (or any Transport it is embarked within is on the battlefield), you receive 1 additional Battle Focus token.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('9b1e9395-5451-25a9-f29c-e684abe7a3ec', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Windrider Host', 'Ride the Wind: In the Declare Battle Formations step you can set up ^^Asuryani Mounted^^ and ^^Vyper^^ units in Reserves.
During the battle, such units can be set up on the battlefield as if they were arriving from Strategic Reserves. For the purposes of setting up ^^Asuyani Mounted^^ or ^^Vyper^^ units from your army on the battlefield, treat the current battle round number as being one higher than it actually is.

In addition, at the end of your opponent''s turn, you can select a number of ^^Asuryani Mounted^^ or ^^Vyper^^ units from your army (excluding units within Engagement Range of one or more enemy units), then remove those units from the battlefield and place them into Strategic Reserves. The maximum number of units you can select depends on the battle size, as shown below:

■ Incursion - 1
■ Strike Force - 2
■ Onslaught - 3


^^Windriders^^ units from your army gain the ^^Battleline^^ keyword.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('2019ba1d-d676-14a3-7159-6f31ae1f4085', '9b1e9395-5451-25a9-f29c-e684abe7a3ec', 'Firstdrawn Blade', 10, 'Asuryani Mounted model only. Models in the bearer''s unit have the Scouts 9" ability.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('b15d25fc-ec0d-c97d-e88b-459e3e87372b', '9b1e9395-5451-25a9-f29c-e684abe7a3ec', 'Mirage Field', 25, 'Asuryani Mounted model only. Each time an attack targets the bearer''s unit, subtract 1 from the Hit roll.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('cb087848-0b4c-923e-ebd2-33fd46e53088', '9b1e9395-5451-25a9-f29c-e684abe7a3ec', 'Seersight Strike', 15, 'Asuryani Mounted Psyker model only. Psychic weapons equipped by the bearer have the [Anti-Monster 2+] and [Anti-Vehicle 2+] abilities.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('5479d034-5667-9776-17c8-1f0427616254', '9b1e9395-5451-25a9-f29c-e684abe7a3ec', 'Echoes of Ulthanesh', 20, 'Asuryani Mounted model only. In your Command phase, roll one D6, adding 1 to the result if the bearer is not within your deployment zone, and adding an additional 1 to the result if the bearer is within your opponent''s deployment zone: on a 5+, you gain 1CP.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('f70aa699-6587-ca79-dce5-ac5dbe315859', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Spirit Conclave', 'Shepherds of the Dead: Each time an Asuryani Psyker model from your army is destroyed by an enemy unit, that unit gains a Vengeful Dead token. Each time a Wraith Construct model from your army makes an attack that targets a unit with one or more Vengeful Dead tokens, add 1 to the Hit roll and add 1 to the Wound roll.
Asuryani Psyker models from your army have the following ability:
Spirit Guides (Aura): while a Wraithblades, Wraithguard or Wraithlord unit from your army is within 12" of this model, that unit has the Battle Focus ability.


Wraithblades and Wraithguard units from your army gains the Battleline keyword.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('3546190c-0a53-12a1-73e5-1d6118077a8b', 'f70aa699-6587-ca79-dce5-ac5dbe315859', 'Light of Clarity', 30, 'Spiritseer model only. In your Command phase, select one friendly Wraith Construct unit within 12" of the bearer. Until the start of your next Command phase, add 1 to the Objective Control characteristic of Infanty models in that unit and add 3 to the Objective Control characteristic of Monster models in that unit.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('90eaaea9-7362-af9c-477d-7394ee767504', 'f70aa699-6587-ca79-dce5-ac5dbe315859', 'Stave of Kurnous', 15, 'Spiritseer model only. In your Command phase, select one friendly Wraith Construct unit within 12" of the bearer (excluding Titanic units). Until the start of your next Command phase, each time a model in that unit makes an attack, on a Critical Wound, that attack has the [Precision] ability.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('a823ca28-d4ac-780c-1663-bd49598b3b6b', 'f70aa699-6587-ca79-dce5-ac5dbe315859', 'Rune of Mists', 10, 'Spiritseer model only. In your Command phase, select one friendly Wraith Construct unit within 12" of the bearer. Until the start of your next Command phase, each time a ranged attack targets that unit, unless the attacking model is within 18, models in that unit have the Benefit of Cover against that attack.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('92d3f332-61a1-dfd0-e4ec-03f3f696de18', 'f70aa699-6587-ca79-dce5-ac5dbe315859', 'Higher Duty', 25, 'Spiritseer model only. Oncer per turn, when an enemy unit ends a Normal, Advance or Fall Back move within 9" of the bearer, the bearer''s unit can make a normal move of up to 6".');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('b3c804f7-a4e0-c72c-330b-359abc8eba6d', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Guardian Battlehost', 'Defend at All Costs: Each time a Dire Avenger, Guardian, Support Weapon or War Walker model from your army makes an attack, if that model''s unit and/or the target unit are within range of one or more objective markers, add 1 to the Hit roll.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('ebc4b664-d9aa-32dd-007f-19ceb689901f', 'b3c804f7-a4e0-c72c-330b-359abc8eba6d', 'Craftworld''s Champion', 25, 'Asuryani model only. The bearer has an Objective Control characteristic of 5.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('4cbe4b0e-004b-8248-3acf-562d5039592d', 'b3c804f7-a4e0-c72c-330b-359abc8eba6d', 'Ethereal Pathway', 30, 'Asuryani model only. In the Deploy Armies step, select up to two Guardians units from your army. Models in the selected units have the Infiltrators ability.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('3108c91c-a33a-384f-9cd6-33cc0773c483', 'b3c804f7-a4e0-c72c-330b-359abc8eba6d', 'Protector of the Paths', 20, 'Asuryani model only. While the bearer is leading a Dire Avengers or Guardians unit, once per battle round, you can target the bearer''s unit with the Fire Overwatch Stratagem for 0CP, and while resolving that Stratagem, hits are scored on unmodified Hit rolls of 5+, or unmodified Hit rolls of 4+ instead if the bearer''s unit is within range of an objective marker you control.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('a5c2527c-1aae-7dad-4dd1-80559f7a7d12', 'b3c804f7-a4e0-c72c-330b-359abc8eba6d', 'Breath of Vaul', 10, '**^^Asuryani^^** model only. While the bearer is leading a **^^Storm Guardians^^** unit, each time you roll to determine the number of attacks made with a flamer equipped by a model in that unit, you can re-roll the result, and each time you make a Damage roll for a model equipped with a Guardian fusion gun in that unit, you can re-roll the result.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('217cc02c-a707-f400-9775-7529eaa4b7af', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Ghosts of the Webway', 'Acrobatic Onslaught: Each time a **^^Harlequins^^** model from your army makes a Charge move, it can move through enemy models.

Travelling Players: **^^Troupe^^** units from you army gain the **^^Battleline^^** keyword and **^^Troupe^^** models in those units have an Objective Control characteristic of 2.
You can include up to three of each of the following models in your army: **^^Death Jester**^^, **^^Shadowseer**^^, **^^Troupe Master**^^.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('4e6b26b9-f5e9-2221-e1d2-fdce7e37b7c0', '217cc02c-a707-f400-9775-7529eaa4b7af', 'Cegorach''s Coil', 25, 'Troupe Master model only. Each time the bearer''s unit ends a Charge move, select one enemy unit within Engagement Range of the bearer''s unit, then roll one D6 for each model in the bearer''s unit that is within Engagment Range of that enemy unit: for each 4+, that enemy unit suffers 1 mortal wound (to a maximum of 6 mortal wounds).');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('7934cc54-dd93-8873-a4dd-d6d6c698264a', '217cc02c-a707-f400-9775-7529eaa4b7af', 'Mask of Secrets', 15, 'Harlequins model only. Each time an enemy unit (excluding Monsters and Vehicles) within Engagement Range of the bearer''s unit Falls Back, all models in that enemy unit must take a Desperate Escape test. When doing so, if that enemy unit is Battle-shocked, subtract 1 from each of those tests.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('de73198b-8fdf-9b7f-c7bf-184b476cf0ac', '217cc02c-a707-f400-9775-7529eaa4b7af', 'Murder''s Jest', 20, 'Death Jester model only. Each time the bearer makes an attack that targets a unit that is below Half-strength, each successful Hit scores a Critical Hit.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('d238e856-e268-6fd6-7ab5-da5b49f857dc', '217cc02c-a707-f400-9775-7529eaa4b7af', 'Mistweave', 15, 'Shadowseer model only. While the bearer is leading a unit, models in that unit have the Infiltrators ability.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('5ef87cf5-3173-8da1-c652-dcefeb1f5d4e', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Devoted of Ynnead', 'Strength From Death: Lethal Intent
At the end of your opponent''s Shooting phase, if one or more Ynnari units from your army were destroyed this phase, select one Ynnari Infantry or Ynnari Mounted unit from your army that was within 6" of your destroyed unit. That unit can make a Normal move of up to D6+1".


Lethal Surge
Once per turn, when a Ynnari unit from your army performs the Fade Back Agile Manoeuvre, it can make a Lethal Surge move instead of a Normal move. If it does, roll one D6 and add 1 to the result: that unit can be moved a number of inches up to the total. When doing so, those models can be moved within Engagement Range of the enemy unit that just triggered that Agile Manoeuvre.


Lethal Reprisal
At the start of the Fight phase, select one Ynnari unit from your army (excluding Titanic units) that is below its Starting Strength. Until the end of the phase, that unit has the Fights First ability.

Servants of the Whispering God: You can include Ynnari units in your army, even though they do not have the Asuryani Faction keyword.
Asuryani units (excluding Epic Heroes) from your army gain the Ynnari keyword.
You must include Yvraine and/or The Yncarne in your army, and one of those models must be your Warlord.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('5c9baab6-4913-15e1-683e-8fafaf9b9881', '5ef87cf5-3173-8da1-c652-dcefeb1f5d4e', 'Gaze of Ynnead', 15, 'Farseer model only. The bearer''s Eldritch Storm weapon has the [Devastating Wounds] ability.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('2a9edfc7-48a4-1c3b-aa6e-0a73d8e71360', '5ef87cf5-3173-8da1-c652-dcefeb1f5d4e', 'Storm of Whispers', 10, 'Warlock model only. In your Shooting phase, after the bearer has shot, select one enemy unit hit by one or more of those attacks. That unit must take a Battle-shock test.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('4fad3d43-918e-47f7-6c19-26992ff6869e', '5ef87cf5-3173-8da1-c652-dcefeb1f5d4e', 'Borrowed Vigour', 10, '**^^Archon^^** model only. Add 2 to the Attacks characteristic of the bearer''s melee weapons.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('9dfebdc8-f679-2f90-43ca-1d5f7acbae18', '5ef87cf5-3173-8da1-c652-dcefeb1f5d4e', 'Morbid Might', 15, 'Succubus model only. Each time the bearer makes a melee attack, you can re-roll the Wound roll.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('edbaf897-dfd5-bf37-1cbb-ba5eb5143e2a', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Seer Council', 'Strands of Fate: At the start of the first battle round, you generate Fate dice by rolling a number of D6 based on the battle size, as shown below. Keep your Fate dice to one side - this is your Fate dice pool.


■ Incursion - 3
■ Strike Force - 6
■ Onslaught - 9


Each time you use one of the detachment Stratagems, if your Fate dice pool contains one or more Fate dice showing the corresponding value in the table below, you can discard one of those corresponding Fate dice. If you do, reduce the CP cost of that usage of that Stratagem by 1CP.




■ Presentiment of Dread - 1
■ Forewarned - 2
■ Unshrouded Truth - 3
■ Fate Inescapable - 4

■ Isha''s Fury - 5
■ Psychic Shield - 6')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('a8296d35-6554-f85d-52f5-3ccab28e2405', 'edbaf897-dfd5-bf37-1cbb-ba5eb5143e2a', 'Lucid Eye', 30, 'Asuryani Psyker model only. In your Command phase, you can add 1 to or subtract 1 from the value of one Fate dice in your Fate dice pool.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('46941067-a9d7-d742-14c3-5d7dc75d06a7', 'edbaf897-dfd5-bf37-1cbb-ba5eb5143e2a', 'Runes of Warding', 25, 'Asuryani Psyker model only. Models in the bearer''s unit have the Feel No Pain 4+ ability against mortal wounds, Psychic Attacks and Critical Wounds caused by attacks with the [Devastating Wounds] ability.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('dc6d9d50-36e7-3f14-c8a3-957f7e5c2d1f', 'edbaf897-dfd5-bf37-1cbb-ba5eb5143e2a', 'Stone of Eldritch Fury', 15, 'Asuryani Psyker model only. Add 12" to the Range characteristic of ranged Psychic weapons equipped by the bearer.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('5df9e001-de17-b978-3932-abde289b9e14', 'edbaf897-dfd5-bf37-1cbb-ba5eb5143e2a', 'Torc of Morai-Heg', 20, 'Asuryani Psyker model only. Once per turn, when your opponent targets a unit from their army within 12" of the bearer with a Stratagem, the bearer can use this Enhancement. If it does, increase the CP cost of that usage of that Stratagem by 1CP.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('7f9a127d-1d93-2d8c-1a1b-9391f8f1b1b2', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Aspect Host', 'Path of the Warrior: Each time an Aspect Warriors or Avatar of Khaine unit from your army is selected to shoot or fight, select one of the following abilities for it to gain until the end of the phase:

■ Each time a model in this unit makes an attack, re-roll a Hit roll of 1.
■ Each time a model in this unit makes an attack, re-roll a Wound roll of 1.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('a175bf0b-4f58-25d6-ea04-0259d2c67785', '7f9a127d-1d93-2d8c-1a1b-9391f8f1b1b2', 'Aspect of Murder', 25, '**^^Autarch^^** or **^^Autarch Wayleaper^^** model only. Add 1 to the Damage characteristics of melee weapons equipped by the bearer, and those weapons have the **[PRECISION]** ability.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('fd013bca-7353-bfd7-7580-f695edc31ebe', '7f9a127d-1d93-2d8c-1a1b-9391f8f1b1b2', 'Mantle of Wisdom', 30, '^^**Autarch^^** or ^^**Autarch Wayleaper^^** model only. While the bearer is leading an ^^**Aspect Warriors^^** unit, each time that unit is selected to shoot or fight, until the end of the phase, models in that unit gain both of the abilities from the Path of the Warrior Detachment rule.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('28547ad4-ba9a-0bad-c512-b7f22fd62129', '7f9a127d-1d93-2d8c-1a1b-9391f8f1b1b2', 'Shimmerstone', 15, 'Autarch or Autarch Wayleaper model only. While the bearer is leading an Aspect Warriors unit, each time a ranged attack targets that unit, subtract 1 from the Wound roll.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('bac02b09-1e59-e146-9daa-4a403e52029d', '7f9a127d-1d93-2d8c-1a1b-9391f8f1b1b2', 'Strategic Savant', 15, 'Autarch or Autarch Wayleaper model only. While the bearer is leading an Aspect Warriors unit, add 1 to the Objective Control characteristic of models in that unit.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('53d0e1b9-6cdd-bdcf-88c7-72a614b5fa49', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Covenite Coterie', 'Stitchflesh Abominations: Each time an attack targets a **^^Haemonculus Covens^^** unit from your army, if the Strength characteristic of that attack is greater than the Toughness characteristic of your unit, subtract 1 from the Wound roll.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('0bb2fe1e-c3f0-aee7-6eb5-070b3fde10f4', '53d0e1b9-6cdd-bdcf-88c7-72a614b5fa49', 'Master Regenesist', 25, '^^**Haemonculus**^^ model only. Each time the bearer uses its Fleshcraft ability, you can return up to D3+3 destroyed Bodyguard models to the bearer''s unit instead of D3+1.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('9ce0fc9b-4c60-bd7d-7fbb-3abc4b31f2cb', '53d0e1b9-6cdd-bdcf-88c7-72a614b5fa49', 'Master Nemesine', 5, '^^**Haemonculus**^^ model only. The bearer''s weapons have the ^^**[Anti-Beast 2+]**^^ and ^^**[Anti-Monster 4+]**^^ abilities.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('2fd4543f-c7bd-3a7d-3291-d18c91edd0c7', '53d0e1b9-6cdd-bdcf-88c7-72a614b5fa49', 'Master Artisan', 20, '^^**Haemonculus**^^ model only. Add 1 to the bearer''s Wounds characteristic and add 1 to the Toughness characteristic of models in the bearer''s unit.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('c3f6e982-e2b9-15c7-fcae-cd98859d3c43', '53d0e1b9-6cdd-bdcf-88c7-72a614b5fa49', 'Master Repugnomancer [Aura]', 15, '^^**Haemonculus**^^ model only. Add 3" to the range of the bearer''s Fear Incarnate ability, and each time a friendly ^^**Drukhari**^^ within 9" of the bearer fails a Battle-shock test or is destroyed, roll one D6; on a 4+, you gain 1 Pain token.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('90127ae8-0348-7c42-2fac-9504693962eb', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Kabalite Cartel', 'Murderous Agenda: At the start of the first battle round, select one of the Contracts from below, then select one unit from your opponent''s army that matches the ''Contract'' description in the Contract. Until that Contract is completed, that unit is your Contract unit and ^^**Kabal**^^ and ^^**Blades For Hire**^^ units from your army have the ability stated in that Contract. At the start of your Command phase, if your Contract unit is destroyed, that Contract is completed and you gain 3 Pain tokens.




**Trophy Hunters**
**Contract:** One ^^**Character**^^ unit.
**Ability:** Each time a ^^**Kabal**^^ or ^^**Blades for Hire**^^ model in this unit makes an attack that targets the Contract unit, that attack has the ^^**[Precision]**^^ ability.




**Sow Fear and Terror**
**Contract:** One ^^**Infantry**^^ or ^^**Mounted**^^ unit (excluding units containing only ^^**Character**^^ models). At the start of Your Command phase, this Contract is completed if all non-^^**Character**^^ models in that unit are destroyed.
**Ability:** Each time a ^^**Kabal**^^ or ^^**Blades for Hire**^^ model in this unit makes an attack that targets an ^^**Infantry**^^ or ^^**Mounted**^^ unit, that attack has the ^^**[Sustained Hits 1]**^^ ability.




**Show of Strength**
**Contract:** One ^^**Monster**^^ or ^^**Vehicle**^^ unit.
**Ability:** Each time a ^^**Kabal**^^ or ^^**Blades for Hire**^^ model in this unit makes an attack that targets a ^^**Monster**^^ or ^^**Vehicle**^^ unit, that attack has the ^^**[Lethal Hits]**^^ ability.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('36bacecb-e5ab-d86d-b656-b5e82bbe261d', '90127ae8-0348-7c42-2fac-9504693962eb', 'Leechbite Plate', 5, '^^**Archon**^^ model only. The bearer has a Save characteristic of 3+. At the start of either player''s Command phase, you can spend 1 Pain token; if you do, the bearer regains all of its lost wounds.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('f58de0ce-c8e4-8078-1a45-8ec8da9c1d5e', '90127ae8-0348-7c42-2fac-9504693962eb', 'Webway Awl', 25, '^^**Archon**^^ model only. Models in the bearer''s unit have the Deep Strike ability, and you can target the bearer''s unit with the Rapid Ingress Stratagem for 0CP.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('b70875bd-f0ec-d29f-03ce-876d78fd202d', '90127ae8-0348-7c42-2fac-9504693962eb', 'Informant Network', 30, '^^**Archon**^^ model only. At the start of the Declare Battle Formations step, select up to three ^^**Kabalite Warriors**^^ and/or ^^**Hand of the Archon**^^ units from your army; those units gain the Infiltrators ability.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('4d2e40ec-b8ce-dde0-b81c-28297da4bdf8', '90127ae8-0348-7c42-2fac-9504693962eb', 'Towering Arrogance', 20, '^^**Archon**^^ models only. While the bearer is leading a unit, improve the Leadership and Objective Control characteristics of models in that unit by 1.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('107192f5-4b57-9ee0-a636-f1b3eec4d15b', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Spectacle of Spite', 'Combat Drugs: At the start of your Command phase, select which Combat Drugs will be active for your army until the start of your next Command phase. To do so, either select one from the list below (you cannot select the same Combat Drug more than once per battle), or randomly select two by rolling two D6. When doing so randomly, Combat Drugs you have previously selected can become active again, but if you randomly select one that is already active for your army, it has no additional effect.


**1. Adrenalight**
Add 1 to the Attacks characteristic of melee weapons equipped by ^^**Wych Cult**^^ models from your army.


**2. Hypex**
Add 2" to the Move characteristic of ^^**Wych Cult**^^ models from your army.


**3. Serpentin**
Improve the Weapon Skill characteristic of melee weapons equipped by ^^**Wych Cult**^^ models from your army by 1.


**4. Painbringer**
Add 1 to the Toughness characteristic of ^^**Wych CUlt**^^ models from your army.


**5. Grave Lotus**
Add 1 to the Strength characteristic of melee weapons equipped by ^^**Wych Cult**^^ models from your army.


**6. Splintermind**
Improve the Leadership characteristic of ^^**Wych Cult**^^ models from your army by 1, and improve the Ballistic Skill characteristic of ranged weapons equipped by ^^**Wych Cult**^^ models from your army by 1.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('2638ae9d-4f10-7098-3870-1fc8a7c5657a', '107192f5-4b57-9ee0-a636-f1b3eec4d15b', 'Pharmacophex', 15, '^^**Succubus**^^ model only. At the start of your Command phase, after selecting which Combat Drugs will be active for your army, roll one D6 and consult the Combat Drugs list. The result rolled applies to the bearer''s unit until the start of your next Command phase in addition to any other Combat Drugs that are active for your army. If you randomly select one that is already active for your army, it has no additional effect.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('bd9a74dd-6db2-9dba-e5ed-5927bb5adf33', '107192f5-4b57-9ee0-a636-f1b3eec4d15b', 'Chronoshard', 15, '^^** Succubus**^^ model only. Once per battle, at the start of the Fight phase, the bearer can use this Enhancement. If it does, until the end of the phase, models in the bearer''s unit have the Fights First ability.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('8753d636-7c82-3cec-b777-5f3196f49fd4', '107192f5-4b57-9ee0-a636-f1b3eec4d15b', 'Periapt of Torments', 25, '^^**Succubus**^^ model only. Enemy units cannot use the Fire Overwatch stratagem to shoot at the bearer''s unit.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('825f702a-928b-ba00-0245-0c1a2301660c', '107192f5-4b57-9ee0-a636-f1b3eec4d15b', 'Morghenna''s Curse', 20, '^^**Succubus**^^ model only. Improve the Armour Penetration and Damage characteristics of the bearer''s melee weapons by 1.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('5cf9045c-6cb7-2386-97e3-3eeaeba09049', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Serpent''s Brood', 'Boons of the Brood: Weapons equipped by ^^**Harlequins Mounted**^^ and ^^**Harlequins Vehicle**^^ models from your army have the [^^**SUSTAINED HITS 1**^^] ability. Each time a Harlequins unit from your army disembarks from a Transport, until the end of the turn, that unit’s weapons have the [^^**SUSTAINED HITS 1**^^] ability.

Travelling Players: **^^Troupe^^** units from you army gain the **^^Battleline^^** keyword and **^^Troupe^^** models in those units have an Objective Control characteristic of 2.
You can include up to three of each of the following models in your army: **^^Death Jester**^^, **^^Shadowseer**^^, **^^Troupe Master**^^.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('9627ad57-8777-e9e3-07cf-2676547d0cda', '5cf9045c-6cb7-2386-97e3-3eeaeba09049', 'Key of Ghosts', 20, '^^**Harlequins**^^ model only (excluding ^^**Solitaire**^^ models). Models in the bearer’s unit have the Scouts 6" ability.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('345438ee-3ece-c393-67e0-f543ed66986b', '5cf9045c-6cb7-2386-97e3-3eeaeba09049', 'Fanged Leer', 10, '^^**Death Jester**^^ model only. When using the bearer’s Cruel Amusement ability, you can select two of the abilities for its shrieker cannon to gain, instead of one.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('e398cdbc-ba2b-1216-db6b-a40a66880867', '5cf9045c-6cb7-2386-97e3-3eeaeba09049', 'Shedskin Raiment', 25, '^^**Shadowseer**^^ model only. After both players have deployed their armies, select up to three Harlequins units from your army and redeploy them. When doing so, you can set those units up in Strategic Reserves, regardless of how many units are already in Strategic Reserves.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('ae7599ae-d56b-82ed-6951-abb2749660ec', '5cf9045c-6cb7-2386-97e3-3eeaeba09049', 'Weavers'' Wail', 20, '^^**Troupe Master**^^ model only. Add 3 to the Strength and add 1 to the Attacks characteristics of the bearer’s melee weapons.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('387870b9-09f6-91ed-524c-7bcbc62118e5', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Eldritch Raiders', 'Yriel''s Own: ^^**Aeldari**^^ units in your army are eligible to declare a charge in a turn in which they Advanced. In addition, each time an ^^**Anhrathe**^^, ^^**Rangers**^^ or ^^**Shroud Runners**^^ unit from your army Advances, you can re‑roll the Advance roll.

Veterans of the Void: Each time you add an ^^**Anhrathe**^^ unit to your army, it can be given up to one Corsair Enhancement (see right). Each Corsair Enhancement included in your army must be unique. If a unit is given a Corsair Enhancement, you must increase the points cost of that unit by the amount shown (see Munitorum Field Manual). If this causes your army to exceed the points limit for the battle you are playing, you cannot include that unit in your army.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('799e9990-219f-0656-dee3-afe01bc11b93', '387870b9-09f6-91ed-524c-7bcbc62118e5', 'Pirate Prince', 15, '^^**Prince Yriel**^^ unit only. Each time you spend a Battle Focus token to enable this unit to perform an Agile Manoeuvre, roll one D6: on a 3+, you gain 1 Battle Focus token.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('712bf337-d376-7ee3-3f09-bbd8dc89f906', '387870b9-09f6-91ed-524c-7bcbc62118e5', 'Alacritous Assault', 20, '^^**Anhrathe**^^ unit only. Melee weapons equipped by models in this unit have the ^^**[LANCE]**^^ ability.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('49d60f95-1ef6-a5e1-ac5f-030161ab1d20', '387870b9-09f6-91ed-524c-7bcbc62118e5', 'Exotic Munitions', 15, '^^**Anhrathe**^^ unit only. Ranged weapons equipped by models in this unit have the ^^**[ANTI‑MONSTER 5+]**^^ and ^^**[ANTI‑VEHICLE 5+]**^^ abilities.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('6f9bb035-26f1-bf50-f84d-b806bc58abb4', '387870b9-09f6-91ed-524c-7bcbc62118e5', 'Adrenal Infusions', 20, '^^**Anhrathe Infantry**^^ unit only. This unit can perform the Fade Back Agile Manoeuvre without spending a Battle Focus token to do so. It can do so even if other units have done so in the same phase, and doing so does not prevent other units from performing the same Agile Manoeuvre in the same phase.');

INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('80aa8e59-0a0a-36b7-6e0c-41cc8b159e3f', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Corsair Coterie', 'Relentless Raiders: While an objective marker is under your control, each time an enemy unit ends a Normal, Advance, Fall Back or Charge move within range of that objective marker, roll one D6: on a 2+, that enemy unit suffers D3 mortal wounds. 


^^**Anhrathe**^^ units from your army have the following ability: 


**Void Thieves:** At the end of a phase, if this unit is within range of an objective marker you control, that objective marker remains under your control until your opponent’s Level of Control over that objective marker is greater than yours at the end of a phase.

Veterans of the Void: Each time you add an ^^**Anhrathe**^^ unit to your army, it can be given up to one Corsair Enhancement (see right). Each Corsair Enhancement included in your army must be unique. If a unit is given a Corsair Enhancement, you must increase the points cost of that unit by the amount shown (see Munitorum Field Manual). If this causes your army to exceed the points limit for the battle you are playing, you cannot include that unit in your army.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('1b689307-70c3-9b15-7135-780d8be21312', '80aa8e59-0a0a-36b7-6e0c-41cc8b159e3f', 'Infamy (Aura)', 25, '^^**Anhrathe**^^ unit only. While an enemy unit is within 3” of this unit, subtract 1 from the Objective Control characteristic of models in that unit (to a minimum of 1).');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('eb66d064-2504-d830-acaa-61f2f16647d3', '80aa8e59-0a0a-36b7-6e0c-41cc8b159e3f', 'Webway Pathstone', 25, '^^**Anhrathe**^^ unit only. Models in this unit have the Deep Strike ability. In addition, once per battle, at the end of your opponent’s turn, if this unit is not within Engagement Range of one or more enemy units, it can use this ability. If it does, remove this unit from the battlefield and place it into Strategic Reserves.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('998b3f1d-0220-d61a-c3f1-7c62332f1e46', '80aa8e59-0a0a-36b7-6e0c-41cc8b159e3f', 'Archraider', 35, '^^**Anhrathe Character**^^ unit only. At the start of the battle, select one ^^**Character**^^ model in this unit. That model has the following ability: 


**Lord of Deceit (Aura):** Each time your opponent targets a unit from their army with a Stratagem, if that unit is within 12” of this model, increase the cost of that use of that Stratagem by 1CP.');
INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES
  ('687f601e-553e-c181-e588-d81077d4c889', '80aa8e59-0a0a-36b7-6e0c-41cc8b159e3f', 'Voidstone', 15, '^^**Anhrathe Infantry**^^ unit only. Models in this unit have a 5+ invulnerable save.');

-- Units
INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('dde9a77d-21ee-cb54-2145-7bc89a6b0a8f', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Asurmen', 'epic_hero', '7"', 3, '2+', 5, 6, 1, '{"Infantry", "Epic Hero", "Character", "Phoenix Lord", "Asurmen", "Aeldari", "Aspect Warrior"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('dde9a77d-21ee-cb54-2145-7bc89a6b0a8f', 1, 125);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('dde9a77d-21ee-cb54-2145-7bc89a6b0a8f', 'The Bloody Twins', 'ranged', '24"', '6', '2+', 5, -1, '2', '{"Assault", "Pistol"}'),
  ('dde9a77d-21ee-cb54-2145-7bc89a6b0a8f', 'The Sword of Asur', 'melee', NULL, '6', '2+', 6, -3, '3', '{"Devastating Wounds"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('dde9a77d-21ee-cb54-2145-7bc89a6b0a8f', 'Invulnerable Save (Asurmen)', 'invulnerable', 'Asurmen has a 4+ Invulnerable save'),
  ('dde9a77d-21ee-cb54-2145-7bc89a6b0a8f', 'Hand of Asuryan', 'unique', 'Once per battle, when this model is selected to shoot, it can use this ability. If it does, until the end of the phase, its Bloody Twins weapon has a Damage characteristic of 3 and the [Anti-Infantry 5+] and [Devastating Wounds] abilities.'),
  ('dde9a77d-21ee-cb54-2145-7bc89a6b0a8f', 'Tactical Acumen', 'unique', 'While this model is leading a unit, in your Shooting phase, after that unit has shot, it can make a Normal move of up to 6". If it does, until the end of the turn, that unit is not eligible to declare a charge.'),
  ('dde9a77d-21ee-cb54-2145-7bc89a6b0a8f', 'Leader', 'core', 'This model can be attached to the following unit:
■ Dire Avengers');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('23a463f0-1152-17c1-799b-ea78c8d50875', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Autarch Skyrunner', 'character', '14"', 4, '3+', 5, 6, 2, '{"Autarch", "Autarch Skyrunner", "Character", "Mounted", "Fly", "Aeldari"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('23a463f0-1152-17c1-799b-ea78c8d50875', 1, 90);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('23a463f0-1152-17c1-799b-ea78c8d50875', 'Close Combat Weapon', 'melee', NULL, '3', '2+', 3, 0, '1', '{}'),
  ('23a463f0-1152-17c1-799b-ea78c8d50875', 'Twin Shuriken Catapult', 'ranged', '18"', '2', '2+', 4, -1, '1', '{"Assault", "Twin Linked"}'),
  ('23a463f0-1152-17c1-799b-ea78c8d50875', 'Laser Lance', 'ranged', '6"', '1', '2+', 6, -3, '2', '{"Assault"}'),
  ('23a463f0-1152-17c1-799b-ea78c8d50875', 'Laser Lance', 'melee', NULL, '4', '2+', 4, -3, '2', '{"Lance"}'),
  ('23a463f0-1152-17c1-799b-ea78c8d50875', 'Dragon Fusion Gun', 'ranged', '12"', '1', '2+', 9, -4, 'D6', '{"Assault", "Melta 3"}'),
  ('23a463f0-1152-17c1-799b-ea78c8d50875', 'Banshee Blade', 'melee', NULL, '5', '2+', 4, -3, '1', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('23a463f0-1152-17c1-799b-ea78c8d50875', 'Path of Command', 'unique', 'Once per battle round, one model from your army with this ability can use it when its unit is targeted with a Stratagem. If it does, reduce the CP cost of that usage of that Stratagem by 1CP.'),
  ('23a463f0-1152-17c1-799b-ea78c8d50875', 'Invulnerable Save (Autarch)', 'invulnerable', 'An Autarch Skyrunner has a 4+ Invulnerable save'),
  ('23a463f0-1152-17c1-799b-ea78c8d50875', 'Leader', 'core', 'This model can be attached to the following unit:
■ Windriders
■ Corsair Cloud Dancer Band'),
  ('23a463f0-1152-17c1-799b-ea78c8d50875', 'Ride the WInd', 'unique', 'While this model is leading a unit, each time that unit Advances, do not make an Advance roll for it. Instead, until the end of the phase, add 6" to the Move characteristic of models in that unit');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('a556e7da-3a00-85e5-2d88-b9e74c153933', '23a463f0-1152-17c1-799b-ea78c8d50875', 'Wargear', 'Close Combat Weapon', true, 0, NULL, NULL, NULL),
  ('03d9a689-1be2-4457-3191-7e4944ac1726', '23a463f0-1152-17c1-799b-ea78c8d50875', 'Wargear', 'Twin Shuriken Catapult', false, 0, NULL, NULL, NULL),
  ('d9492958-0c66-53f3-02db-2594ea19bade', '23a463f0-1152-17c1-799b-ea78c8d50875', 'Weapon', 'Laser Lance', true, 0, NULL, 'Weapon', 1),
  ('00bb120a-cf0c-4a64-f1bb-84d265efa421', '23a463f0-1152-17c1-799b-ea78c8d50875', 'Weapon', 'Dragon Fusion Gun', false, 0, NULL, 'Weapon', 1),
  ('b9634783-b952-6291-e980-ee57820caf66', '23a463f0-1152-17c1-799b-ea78c8d50875', 'Weapon', 'Banshee Blade', false, 0, NULL, 'Weapon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Autarch', 'character', '7"', 3, '3+', 4, 6, 1, '{"Autarch", "Character", "Infantry", "Aeldari", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 1, 85);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Scorpion Chainsword', 'melee', NULL, '7', '2+', 4, -1, '1', '{"Sustained Hits 1"}'),
  ('e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Banshee Blade', 'melee', NULL, '5', '2+', 4, -2, '2', '{"Anti-Infantry 3+"}'),
  ('e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Star Glaive', 'melee', NULL, '4', '2+', 6, -3, '3', '{}'),
  ('e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Shuriken Pistol', 'ranged', '12"', '1', '2+', 4, -1, '1', '{"Assault", "Pistol"}'),
  ('e60e6237-7fd1-3ea8-1e62-5c1725f72efc', '➤ Reaper Launcher - Starshot', 'ranged', '48"', '1', '3+', 10, -2, '3', '{"Heavy", "Ignores Cover"}'),
  ('e60e6237-7fd1-3ea8-1e62-5c1725f72efc', '➤ Reaper Launcher - Starswarm', 'ranged', '48"', '2', '3+', 4, -2, '1', '{"Heavy", "Ignores Cover"}'),
  ('e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Death Spinner', 'ranged', '12"', 'D6', 'N/A', 4, -1, '1', '{"Ignores Cover", "Torrent"}'),
  ('e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Dragon Fusion Gun', 'ranged', '12"', '1', '2+', 9, -4, 'D6', '{"Assault", "Melta 3"}'),
  ('e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Dragon Fusion Pistol', 'ranged', '6"', '1', '2+', 9, -4, 'D6', '{"Assault", "Melta 3", "Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Superlative Strategist', 'unique', 'While this model is leading a unit, you can re-roll Advance rolls made for that unit, and you can re-roll any rolls made for that unit while it is performing an Agile Manoeuvre.'),
  ('e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Path of Command', 'unique', 'Once per battle round, one model from your army with this ability can use it when its unit is targeted with a Stratagem. If it does, reduce the CP cost of that usage of that stratagem by 1CP.'),
  ('e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Leader', 'core', 'This model can be attached to the following units:
■ Dark Reapers
■ Dire Avengers
■ Fire Dragons
■ Guardian Defenders
■ Howling Banshees
■ Storm Guardians
■ Striking Scorpions'),
  ('e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Invulnerable Save (Autarch)', 'invulnerable', 'An Autarch has a 4+ Invulnerable save'),
  ('e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Aspect Training', 'unique', 'While this model is leading a Howling Banshees unit, it has the Fights First ability.
While this model is leading a Striking Scorpions unit, it has the Infiltrators, Scouts 7" and Stealth abilities.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('87c7e6b3-7617-2c19-e1a8-db58b74b6424', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Melee Weapon', 'Scorpion Chainsword', true, 0, NULL, 'Melee Weapon', 1),
  ('bd0e7a94-d486-ebcc-fbc7-dc16df8bc78e', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Melee Weapon', 'Banshee Blade', false, 0, NULL, 'Melee Weapon', 1),
  ('7e0a4480-dcb3-7496-2005-ffb23cd57ed5', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Melee Weapon', 'Star Glaive', false, 0, NULL, 'Melee Weapon', 1),
  ('cbed7e5a-d3b2-a735-c36f-2c0b43e43aef', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Ranged Weapon', 'Shuriken Pistol', true, 0, NULL, 'Ranged Weapon', 1),
  ('3a0ed535-bfa4-23cf-98f8-98b5c909f815', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Ranged Weapon', 'Reaper Launcher', false, 0, NULL, 'Ranged Weapon', 1),
  ('fa0cfeba-9c25-d2d3-9eb1-55e256010e93', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Ranged Weapon', 'Death Spinner', false, 0, NULL, 'Ranged Weapon', 1),
  ('df3b6f51-d158-adfa-6959-e39b9f39b11b', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Ranged Weapon', 'Dragon Fusion Gun', false, 0, NULL, 'Ranged Weapon', 1),
  ('0a831bd8-1130-23e0-ae71-10b082a7582b', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'Ranged Weapon', 'Dragon Fusion Pistol', false, 0, NULL, 'Ranged Weapon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('84e281f7-beaf-f596-5a35-451109153bb3', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Autarch Wayleaper', 'character', '14"', 3, '3+', 4, 6, 1, '{"Character", "Infantry", "Fly", "Autarch Wayleaper", "Aeldari", "Jump Pack", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('84e281f7-beaf-f596-5a35-451109153bb3', 1, 80);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('84e281f7-beaf-f596-5a35-451109153bb3', 'Scorpion Chainsword', 'melee', NULL, '7', '2+', 4, -1, '1', '{"Sustained Hits 1"}'),
  ('84e281f7-beaf-f596-5a35-451109153bb3', 'Banshee Blade', 'melee', NULL, '5', '2+', 4, -2, '2', '{"Anti-Infantry 3+"}'),
  ('84e281f7-beaf-f596-5a35-451109153bb3', 'Star Glaive', 'melee', NULL, '4', '2+', 6, -3, '3', '{}'),
  ('84e281f7-beaf-f596-5a35-451109153bb3', 'Shuriken Pistol', 'ranged', '12"', '1', '2+', 4, -1, '1', '{"Assault", "Pistol"}'),
  ('84e281f7-beaf-f596-5a35-451109153bb3', '➤ Reaper Launcher - Starshot', 'ranged', '48"', '1', '3+', 10, -2, '3', '{"Heavy", "Ignores Cover"}'),
  ('84e281f7-beaf-f596-5a35-451109153bb3', '➤ Reaper Launcher - Starswarm', 'ranged', '48"', '2', '3+', 4, -2, '1', '{"Heavy", "Ignores Cover"}'),
  ('84e281f7-beaf-f596-5a35-451109153bb3', 'Death Spinner', 'ranged', '12"', 'D6', 'N/A', 4, -1, '1', '{"Ignores Cover", "Torrent"}'),
  ('84e281f7-beaf-f596-5a35-451109153bb3', 'Dragon Fusion Gun', 'ranged', '12"', '1', '2+', 9, -4, 'D6', '{"Assault", "Melta 3"}'),
  ('84e281f7-beaf-f596-5a35-451109153bb3', 'Dragon Fusion Pistol', 'ranged', '6"', '1', '2+', 9, -4, 'D6', '{"Assault", "Melta 3", "Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('84e281f7-beaf-f596-5a35-451109153bb3', 'Path of Command', 'unique', 'Once per battle round, one model from your army with this ability can use it when its unit is targeted with a Stratagem. If it does, reduce the CP cost of that usage of that stratagem by 1CP.'),
  ('84e281f7-beaf-f596-5a35-451109153bb3', 'Invulnerable Save (Autarch)', 'invulnerable', 'An Autarch Wayleaper has a 4+ Invulnerable save'),
  ('84e281f7-beaf-f596-5a35-451109153bb3', 'Indomitable Strength of Will', 'unique', 'While this model is leading a unit, each time you spend a Battle Focus token to enable that unit to perform an Agile Manoeuvre, roll one D6: on a 3+ you gain 1 Battle Focus token.'),
  ('84e281f7-beaf-f596-5a35-451109153bb3', 'Leader', 'core', 'This model can be attached to the following units:
■ Swooping Hawks
■ Warp Spiders');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('1f49fbf2-edf7-540c-79fb-93d4ec4be56a', '84e281f7-beaf-f596-5a35-451109153bb3', 'Melee Weapon', 'Scorpion Chainsword', true, 0, NULL, 'Melee Weapon', 1),
  ('cb57238e-308c-f108-96a0-6eb17add8e74', '84e281f7-beaf-f596-5a35-451109153bb3', 'Melee Weapon', 'Banshee Blade', false, 0, NULL, 'Melee Weapon', 1),
  ('65277430-226d-0e01-8ccf-ac018cf0ae9b', '84e281f7-beaf-f596-5a35-451109153bb3', 'Melee Weapon', 'Star Glaive', false, 0, NULL, 'Melee Weapon', 1),
  ('595a0f05-9f3a-2b49-96bf-7b3a06cae128', '84e281f7-beaf-f596-5a35-451109153bb3', 'Ranged Weapon', 'Shuriken Pistol', true, 0, NULL, 'Ranged Weapon', 1),
  ('1a93765d-5aa8-3075-cf98-dbdd2a3b2875', '84e281f7-beaf-f596-5a35-451109153bb3', 'Ranged Weapon', 'Reaper Launcher', false, 0, NULL, 'Ranged Weapon', 1),
  ('84a5ec42-43c0-bcbc-d67a-6a1724b2d600', '84e281f7-beaf-f596-5a35-451109153bb3', 'Ranged Weapon', 'Death Spinner', false, 0, NULL, 'Ranged Weapon', 1),
  ('3f978bd7-7772-8915-c8c2-895299fa4fe1', '84e281f7-beaf-f596-5a35-451109153bb3', 'Ranged Weapon', 'Dragon Fusion Gun', false, 0, NULL, 'Ranged Weapon', 1),
  ('70c43508-cac7-4d19-c467-3a1a54c3ebc0', '84e281f7-beaf-f596-5a35-451109153bb3', 'Ranged Weapon', 'Dragon Fusion Pistol', false, 0, NULL, 'Ranged Weapon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('1aa71f15-a1b2-aa92-978d-377b1a8c5323', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Avatar of Khaine', 'epic_hero', '10"', 11, '2+', 14, 6, 5, '{"Daemon", "Epic Hero", "Character", "Monster", "Avatar of Khaine", "Aeldari"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('1aa71f15-a1b2-aa92-978d-377b1a8c5323', 1, 280);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('1aa71f15-a1b2-aa92-978d-377b1a8c5323', 'The Wailing Doom', 'ranged', '12"', '1', '2+', 16, -4, 'D6+2', '{"Sustained Hits D3"}'),
  ('1aa71f15-a1b2-aa92-978d-377b1a8c5323', '➤ The Wailing Doom - Strike', 'melee', NULL, '6', '2+', 16, -4, 'D6+2', '{}'),
  ('1aa71f15-a1b2-aa92-978d-377b1a8c5323', '➤ The Wailing Doom - Sweep', 'melee', NULL, '12', '2+', 8, -2, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('1aa71f15-a1b2-aa92-978d-377b1a8c5323', 'Molten Form', 'unique', 'Each time an attack is allocated to this model, halve the Damage characteristic of that attack.'),
  ('1aa71f15-a1b2-aa92-978d-377b1a8c5323', 'The Bloody Handed (Aura)', 'unique', 'While a friendly ^^Aeldari^^ unit is within 6" of this model, add 1 to Advance and Charge rolls made for that unit.'),
  ('1aa71f15-a1b2-aa92-978d-377b1a8c5323', 'Damaged: 1-5 Wounds Remaining', 'unique', 'While this model has 1-5 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('1aa71f15-a1b2-aa92-978d-377b1a8c5323', 'Invulnerable Save (Avatar)', 'invulnerable', 'The Avatar of Khaine has a 4+ Invulnerable save');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('7d45e96b-cfa7-c335-ee65-c2a8acb2056c', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Baharroth', 'epic_hero', '14"', 3, '2+', 5, 6, 1, '{"Epic Hero", "Character", "Infantry", "Fly", "Phoenix Lord", "Baharroth", "Aspect Warrior", "Aeldari", "Jump Pack"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('7d45e96b-cfa7-c335-ee65-c2a8acb2056c', 1, 115);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('7d45e96b-cfa7-c335-ee65-c2a8acb2056c', 'Fury of the Tempest', 'ranged', '24"', '4', '2+', 6, -1, '2', '{"Assault", "Lethal Hits"}'),
  ('7d45e96b-cfa7-c335-ee65-c2a8acb2056c', 'The Shining Blade', 'melee', NULL, '6', '2+', 5, -2, '2', '{"Sustained Hits 1"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('7d45e96b-cfa7-c335-ee65-c2a8acb2056c', 'Invulnerable Save (Baharroth)', 'invulnerable', 'Baharroth has a 4+ Invulnerable save'),
  ('7d45e96b-cfa7-c335-ee65-c2a8acb2056c', 'Leader', 'core', 'This model can be attached to the following unit:
■ Swooping Hawks'),
  ('7d45e96b-cfa7-c335-ee65-c2a8acb2056c', 'Cry of the Wind', 'unique', 'Each time this model is set-up on the battlefield, until the end of the turn, each time this model makes a ranged attack, a successful unmodified Hit roll scores a Critical Hit.'),
  ('7d45e96b-cfa7-c335-ee65-c2a8acb2056c', 'Cloudstrider', 'unique', 'While this model is leading a unit, at the end of your opponent''s turn, if that unit is not within Engagement Range of one or more enemy units, you can remove it from the battlefield and place it into Strategic Reserves. In addition, while this model is leading a unit, when that unit is set-up on the battlefield using the Deep Strike ability, in your Movement phase, it can use this ability. if it does, that unit can be set-up anywhere on the battlefield that is more than 6" horizontally away from all enemy models, but until the end of the turn, it is not eligible to declare a charge.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('70e4747a-e039-e6ab-fdd0-4f2e2bcb5a58', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Crimson Hunter', 'vehicle', '20+"', 8, '3+', 12, 6, 1, '{"Vehicle", "Aircraft", "Fly", "Crimson Hunter", "Aeldari", "Aspect Warrior", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('70e4747a-e039-e6ab-fdd0-4f2e2bcb5a58', 1, 160);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('70e4747a-e039-e6ab-fdd0-4f2e2bcb5a58', 'Pulse Laser', 'ranged', '48"', '3', '3+', 9, -2, 'D6', '{}'),
  ('70e4747a-e039-e6ab-fdd0-4f2e2bcb5a58', 'Wraithbone Hull', 'melee', NULL, '3', '4+', 6, 0, '1', '{}'),
  ('70e4747a-e039-e6ab-fdd0-4f2e2bcb5a58', 'Starcannon', 'ranged', '36"', '2', '3+', 8, -3, '2', '{}'),
  ('70e4747a-e039-e6ab-fdd0-4f2e2bcb5a58', 'Bright Lance', 'ranged', '36"', '1', '3+', 12, -3, 'D6+2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('70e4747a-e039-e6ab-fdd0-4f2e2bcb5a58', 'Skyhunter', 'unique', 'Each time this model makes a ranged attack that targets a unit that can Fly, add 1 to the Hit roll and add 1 to the Wound roll.'),
  ('70e4747a-e039-e6ab-fdd0-4f2e2bcb5a58', 'Damaged: 1-4 Wounds Remaining', 'unique', 'While this model has 1-4 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('70e4747a-e039-e6ab-fdd0-4f2e2bcb5a58', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('7c7c8058-db36-d90a-6c2e-776a3b23955c', '70e4747a-e039-e6ab-fdd0-4f2e2bcb5a58', 'Wargear', 'Pulse Laser', true, 0, NULL, NULL, NULL),
  ('856a76d7-3770-c807-ae94-271728cbc1a2', '70e4747a-e039-e6ab-fdd0-4f2e2bcb5a58', 'Wargear', 'Wraithbone Hull', false, 0, NULL, NULL, NULL),
  ('9380c4d7-9244-1b92-0131-a70454bd66dc', '70e4747a-e039-e6ab-fdd0-4f2e2bcb5a58', 'Weapon Option', '2 Starcannons', true, 0, NULL, 'Weapon Option', 1),
  ('b5556ad9-a17b-b4e7-db31-3e5681640b8a', '70e4747a-e039-e6ab-fdd0-4f2e2bcb5a58', 'Weapon Option', '2 Bright Lances', false, 0, NULL, 'Weapon Option', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('353627e2-2f2f-8cc4-45bf-3eaa802e8d76', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Dark Reapers', 'infantry', '6"', 3, '3+', 1, 6, 1, '{"Dark Reapers", "Infantry", "Aspect Warrior", "Aeldari", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('353627e2-2f2f-8cc4-45bf-3eaa802e8d76', 4, 90);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('353627e2-2f2f-8cc4-45bf-3eaa802e8d76', '➤ Reaper Launcher - Starshot', 'ranged', '48"', '1', '3+', 10, -2, '3', '{"Ignores Cover"}'),
  ('353627e2-2f2f-8cc4-45bf-3eaa802e8d76', '➤ Reaper Launcher - Starswarm', 'ranged', '48"', '2', '3+', 5, -2, '1', '{"Ignores Cover"}'),
  ('353627e2-2f2f-8cc4-45bf-3eaa802e8d76', 'Close combat weapon', 'melee', NULL, '2', '3+', 3, 0, '1', '{}'),
  ('353627e2-2f2f-8cc4-45bf-3eaa802e8d76', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Ignores Cover", "Lethal Hits"}'),
  ('353627e2-2f2f-8cc4-45bf-3eaa802e8d76', 'Tempest Launcher', 'ranged', '36"', '2D6', '3+', 4, -1, '1', '{"Blast", "Indirect Fire"}'),
  ('353627e2-2f2f-8cc4-45bf-3eaa802e8d76', '➤ Missile Launcher - Starshot', 'ranged', '48"', '1', '2+', 10, -2, 'D6', '{"Ignores Cover"}'),
  ('353627e2-2f2f-8cc4-45bf-3eaa802e8d76', '➤ Missile Launcher - Sunburst', 'ranged', '48"', 'D6', '2+', 4, -1, '1', '{"Blast", "Ignores Cover"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('353627e2-2f2f-8cc4-45bf-3eaa802e8d76', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save'),
  ('353627e2-2f2f-8cc4-45bf-3eaa802e8d76', 'Inescapable Accuracy', 'unique', 'Each time a model in this unit makes a ranged attack, you can ignore any or all modifiers to that attack’s Ballistic Skill characteristic and any or all modifiers to the Hit roll.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('8ca3d765-0e17-55bd-de09-4afc4beead4a', '353627e2-2f2f-8cc4-45bf-3eaa802e8d76', 'Dark Reaper', 4, 9, 4, false, 0, '4-9 Dark Reapers'),
  ('3c151dcc-da72-704b-a68c-760aab06d92b', '353627e2-2f2f-8cc4-45bf-3eaa802e8d76', 'Dark Reaper Exarch', 1, 1, 1, true, 1, 'Dark Reaper Exarch')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('b1b11fbc-cdcc-15d2-45ee-1acb18a63d83', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Death Jester', 'character', '8"', 3, '6+', 4, 6, 1, '{"Character", "Infantry", "Death Jester", "Harlequin Allies", "Aeldari", "Corsairs and Travelling Players"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('b1b11fbc-cdcc-15d2-45ee-1acb18a63d83', 1, 90);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('b1b11fbc-cdcc-15d2-45ee-1acb18a63d83', 'Jester''s Blade', 'melee', NULL, '4', '2+', 4, 0, '1', '{}'),
  ('b1b11fbc-cdcc-15d2-45ee-1acb18a63d83', 'Shrieker Cannon', 'ranged', '24"', '3', '2+', 6, -2, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('b1b11fbc-cdcc-15d2-45ee-1acb18a63d83', 'Death is Not Enough', 'unique', 'In your Shooting phase, after this model has shot, select one enemy unit (excluding Monsters and Vehicles) hit by one or more of those attacks. That enemy unit must take a Battle-shock test. If one or more of those attacks destroyed a model in that enemy unit, subtract 1 from that test.'),
  ('b1b11fbc-cdcc-15d2-45ee-1acb18a63d83', 'Cruel Amusement', 'unique', 'In your Shooting phase, each time this model is selected to shoot, select one of the abilities below. Until the end of the phase, this model’s Shrieker Cannon has that ability:
■ [IGNORES COVER]
■ [PRECISION]
■ [SUSTAINED HITS 3]'),
  ('b1b11fbc-cdcc-15d2-45ee-1acb18a63d83', 'Invulnerable Save', 'invulnerable', 'This unit has a 4+ Invulnerable save');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('692e0c6c-1262-77d3-d6f1-b52d54ab7059', 'b1b11fbc-cdcc-15d2-45ee-1acb18a63d83', 'Wargear', 'Jester''s Blade', true, 0, NULL, NULL, NULL),
  ('1b95bcf6-2ec5-3433-b8fb-fa5fa2a8c3b5', 'b1b11fbc-cdcc-15d2-45ee-1acb18a63d83', 'Wargear', 'Shrieker Cannon', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('e476e74b-9945-5553-4c8e-8a633b13f59f', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Dire Avengers', 'infantry', '7"', 3, '4+', 1, 6, 1, '{"Dire Avengers", "Infantry", "Aeldari", "Aspect Warrior", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('e476e74b-9945-5553-4c8e-8a633b13f59f', 4, 75);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('e476e74b-9945-5553-4c8e-8a633b13f59f', 'Avenger Shuriken Catapult', 'ranged', '18"', '4', '3+', 4, -1, '1', '{"Assault"}'),
  ('e476e74b-9945-5553-4c8e-8a633b13f59f', 'Close Combat Weapon', 'melee', NULL, '2', '3+', 3, 0, '1', '{}'),
  ('e476e74b-9945-5553-4c8e-8a633b13f59f', 'Diresword', 'melee', NULL, '4', '3+', 4, -2, '1', '{}'),
  ('e476e74b-9945-5553-4c8e-8a633b13f59f', 'Shuriken Pistol', 'ranged', '12"', '1', '3+', 4, -1, '1', '{"Assault", "Pistol"}'),
  ('e476e74b-9945-5553-4c8e-8a633b13f59f', 'Power Glaive', 'melee', NULL, '3', '3+', 5, -3, '1', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('e476e74b-9945-5553-4c8e-8a633b13f59f', 'Bladestorm', 'unique', 'Ranged weapons equipped by models in this unit have the [Sustained Hits 1] ability while targeting an enemy unit within half range.'),
  ('e476e74b-9945-5553-4c8e-8a633b13f59f', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('53c0c672-2df4-229e-1acb-27a0e1e4371d', 'e476e74b-9945-5553-4c8e-8a633b13f59f', 'Dire Avenger', 4, 9, 4, false, 0, '4-9 Dire Avengers'),
  ('a30cee13-0f86-7695-3883-885aa67cf21f', 'e476e74b-9945-5553-4c8e-8a633b13f59f', 'Dire Avenger Exarch', 1, 1, 1, true, 1, 'Dire Avenger Exarch')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('a1011680-ae0f-e4d0-1a12-865981b164c6', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Eldrad Ulthran', 'epic_hero', '7"', 4, '6+', 5, 6, 1, '{"Epic Hero", "Character", "Infantry", "Psyker", "Farseer", "Eldrad Ultran", "Aeldari"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('a1011680-ae0f-e4d0-1a12-865981b164c6', 1, 120);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('a1011680-ae0f-e4d0-1a12-865981b164c6', 'Shuriken Pistol', 'ranged', '12"', '1', '2+', 4, -1, '1', '{"Assault", "Pistol"}'),
  ('a1011680-ae0f-e4d0-1a12-865981b164c6', 'Staff of Ulthamar and witchblade', 'melee', NULL, '3', '2+', 5, -1, '2', '{"Anti-Infantry 2+", "Psychic"}'),
  ('a1011680-ae0f-e4d0-1a12-865981b164c6', 'Mind War', 'ranged', '18"', '1', '2+', 5, -2, 'D6', '{"Anti-character 4+", "Precision", "Psychic"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('a1011680-ae0f-e4d0-1a12-865981b164c6', 'Invulnerable Save (Eldrad)', 'invulnerable', 'Eldrad Ulthran has a 4+ Invulnerable save'),
  ('a1011680-ae0f-e4d0-1a12-865981b164c6', 'Diviner of the Futures', 'unique', 'At the start of your Command phase, if this model is on the battlefield, you gain 1CP.'),
  ('a1011680-ae0f-e4d0-1a12-865981b164c6', 'Doom (Psychic)', 'unique', 'At the end of your Movement phase, select one enemy unit within 18" of and visible to this model. Until the start of your next Command phase, each time a friendly ^^Aeldari^^ model makes an attack that targets that enemy unit, add 1 to the Wound roll'),
  ('a1011680-ae0f-e4d0-1a12-865981b164c6', 'Leader', 'core', 'This model can be attached to the following units:
■ Guardian Defenders
■ Storm Guardians
■ Warlock Conclave');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('bc341c3a-445e-f578-d0dc-e53695bf95d6', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Falcon', 'vehicle', '14"', 9, '3+', 12, 7, 3, '{"Falcon", "Fly", "Transport", "Vehicle", "Aeldari", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('bc341c3a-445e-f578-d0dc-e53695bf95d6', 1, 130);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('bc341c3a-445e-f578-d0dc-e53695bf95d6', 'Pulse Laser', 'ranged', '48"', '3', '3+', 9, -2, 'D6', '{}'),
  ('bc341c3a-445e-f578-d0dc-e53695bf95d6', 'Wraithbone hull', 'melee', NULL, '3', '4+', 6, 0, '1', '{}'),
  ('bc341c3a-445e-f578-d0dc-e53695bf95d6', 'Twin Shuriken Catapult', 'ranged', '18"', '2', '3+', 4, -1, '1', '{"Assault", "Twin Linked"}'),
  ('bc341c3a-445e-f578-d0dc-e53695bf95d6', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Lethal Hits"}'),
  ('bc341c3a-445e-f578-d0dc-e53695bf95d6', '➤ Missile Launcher - Starshot', 'ranged', '48"', '1', '3+', 10, -2, 'D6', '{}'),
  ('bc341c3a-445e-f578-d0dc-e53695bf95d6', '➤ Missile Launcher - Sunburst', 'ranged', '48"', 'D6', '3+', 4, -1, '1', '{"Blast"}'),
  ('bc341c3a-445e-f578-d0dc-e53695bf95d6', 'Bright Lance', 'ranged', '36"', '1', '3+', 12, -3, 'D6+2', '{}'),
  ('bc341c3a-445e-f578-d0dc-e53695bf95d6', 'Scatter Laser', 'ranged', '36"', '6', '3+', 5, 0, '1', '{"Sustained Hits 1"}'),
  ('bc341c3a-445e-f578-d0dc-e53695bf95d6', 'Starcannon', 'ranged', '36"', '2', '3+', 8, -3, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('bc341c3a-445e-f578-d0dc-e53695bf95d6', 'Damaged: 1-4 Wounds Remaining', 'unique', 'While this model has 1-4 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('bc341c3a-445e-f578-d0dc-e53695bf95d6', 'Fire Support', 'unique', 'In your Shooting phase, after this model has shot, select one enemy unit hit by one or more of those attacks. Until the end of the turn, each time a friendly model that disembarked from this Transport this turn makes an attack that targets that enemy unit, you can re-roll the Wound roll');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('7c8c8ba0-0fca-151a-77a8-37546224cbf7', 'bc341c3a-445e-f578-d0dc-e53695bf95d6', 'Wargear', 'Pulse Laser', true, 0, NULL, NULL, NULL),
  ('77082846-3e41-5cbd-24ba-0bfaba15765b', 'bc341c3a-445e-f578-d0dc-e53695bf95d6', 'Wargear', 'Wraithbone hull', false, 0, NULL, NULL, NULL),
  ('2accc9f2-8941-6d0c-6766-8872f3de582c', 'bc341c3a-445e-f578-d0dc-e53695bf95d6', 'Wargear', 'Heavy Weapons', false, 0, NULL, NULL, NULL),
  ('b85a2698-7021-8e97-ff4c-c5ab6a205a67', 'bc341c3a-445e-f578-d0dc-e53695bf95d6', 'Hull weapon', 'Twin Shuriken Catapult', true, 0, NULL, 'Hull weapon', 1),
  ('acadb8a8-30a3-07e1-356e-f2a69b6453a1', 'bc341c3a-445e-f578-d0dc-e53695bf95d6', 'Hull weapon', 'Shuriken Cannon', false, 0, NULL, 'Hull weapon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Farseer', 'character', '7"', 3, '6+', 4, 6, 1, '{"Character", "Infantry", "Psyker", "Farseer", "Aeldari", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 1, 70);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 'Eldritch Storm', 'ranged', '24"', 'D6', '3+', 6, -2, 'D3', '{"Blast", "Psychic"}'),
  ('98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 'Shuriken Pistol', 'ranged', '12"', '1', '3+', 4, -1, '1', '{"Assault", "Pistol"}'),
  ('98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 'Witchblade', 'melee', NULL, '2', '2+', 3, 0, '2', '{"Anti-Infantry 2+", "Psychic"}'),
  ('98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 'Singing Spear', 'ranged', '12"', '1', '2+', 9, 0, '3', '{"Assault", "Psychic"}'),
  ('98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 'Singing Spear', 'melee', NULL, '2', '2+', 3, 0, '3', '{"Psychic"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 'Branching Fates (Psychic)', 'unique', 'While this model is leading a unit, once per phase you can change the result of one Hit roll, one Wound roll, or one Damage roll made for a model in that unit (excluding ^^Support Weapon^^ models) to an unmodified 6.'),
  ('98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 'Invulnerable Save (Farseer)', 'invulnerable', 'A Farseer has a 4+ Invulnerable save'),
  ('98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 'Guide (Psychic)', 'unique', 'At the end of your Movement phase, select one enemy unit within 18" of and visible to this model. Until the start of your next Command phase, each time a friendly Aeldari model makes an attack that targets that enemy unit, add 1 to the Hit roll. Each unit can only be selected for this ability once per turn.'),
  ('98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 'Leader', 'core', 'This model can be attached to the following units:
■ Guardian Defenders
■ Storm Guardians
■ Warlock Conclave');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('60abf6c9-4be0-f73b-21a7-5d7da0ce823a', '98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 'Wargear', 'Eldritch Storm', true, 0, NULL, NULL, NULL),
  ('f421887a-4049-4e49-f4c7-45fc8a717013', '98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 'Wargear', 'Shuriken Pistol', false, 0, NULL, NULL, NULL),
  ('b7228a0d-fabe-f0fb-3a74-56bf98359461', '98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 'Weapon', 'Witchblade', true, 0, NULL, 'Weapon', 1),
  ('53873ed2-1db7-deab-6ec0-1a50230ad4ab', '98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 'Weapon', 'Singing Spear', false, 0, NULL, 'Weapon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('d8ca34d5-ecbd-9715-7b2d-483961ce4539', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Farseer Skyrunner', 'character', '14"', 4, '6+', 5, 6, 2, '{"Farseer Skyrunner", "Farseer", "Character", "Fly", "Mounted", "Psyker", "Aeldari", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('d8ca34d5-ecbd-9715-7b2d-483961ce4539', 1, 80);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('d8ca34d5-ecbd-9715-7b2d-483961ce4539', 'Eldritch Storm', 'ranged', '24"', 'D6', '3+', 6, -2, 'D3', '{"Blast", "Psychic"}'),
  ('d8ca34d5-ecbd-9715-7b2d-483961ce4539', 'Shuriken Pistol', 'ranged', '12"', '1', '3+', 4, -1, '1', '{"Assault", "Pistol"}'),
  ('d8ca34d5-ecbd-9715-7b2d-483961ce4539', 'Twin Shuriken Catapult', 'ranged', '18"', '2', '3+', 4, -1, '1', '{"Assault", "Twin Linked"}'),
  ('d8ca34d5-ecbd-9715-7b2d-483961ce4539', 'Witchblade', 'melee', NULL, '2', '2+', 3, 0, '2', '{"Anti-Infantry 2+", "Psychic"}'),
  ('d8ca34d5-ecbd-9715-7b2d-483961ce4539', 'Singing Spear', 'ranged', '12"', '1', '3+', 9, 0, '3', '{"Assault", "Psychic"}'),
  ('d8ca34d5-ecbd-9715-7b2d-483961ce4539', 'Singing Spear', 'melee', NULL, '2', '2+', 3, 0, '3', '{"Psychic"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('d8ca34d5-ecbd-9715-7b2d-483961ce4539', 'Invulnerable Save (Farseer)', 'invulnerable', 'A Farseer Skyrunner has a 4+ Invulnerable save'),
  ('d8ca34d5-ecbd-9715-7b2d-483961ce4539', 'Branching Fates (Psychic)', 'unique', 'While this model is leading a unit, once per phase you can change the result of one Hit roll, one Wound roll, or one Damage roll made for a model in that unit to an unmodified 6.'),
  ('d8ca34d5-ecbd-9715-7b2d-483961ce4539', 'Misfortune (Psychic)', 'unique', 'At the end of your Movement phase, select one enemy unit within 18" of and visible to this model. Until the start of your next Command phase, each time a model in that unit makes an attack, subtract 1 from the Wound roll. Each unit can only be selected for this ability once per turn.'),
  ('d8ca34d5-ecbd-9715-7b2d-483961ce4539', 'Leader', 'core', 'This model can be attached to the following units:
■ Warlock Skyrunners
■ Windriders');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('919d5a49-7b54-cfed-67dc-0d808f592c3b', 'd8ca34d5-ecbd-9715-7b2d-483961ce4539', 'Wargear', 'Eldritch Storm', true, 0, NULL, NULL, NULL),
  ('5cc2bdb5-b7e4-1b4a-3721-c05fe7eb7f82', 'd8ca34d5-ecbd-9715-7b2d-483961ce4539', 'Wargear', 'Shuriken Pistol', false, 0, NULL, NULL, NULL),
  ('4abd3180-3a71-f2e3-5502-75c4ab2d1f79', 'd8ca34d5-ecbd-9715-7b2d-483961ce4539', 'Wargear', 'Twin Shuriken Catapult', false, 0, NULL, NULL, NULL),
  ('5eac0851-23bd-c58b-5447-26a78fc8493f', 'd8ca34d5-ecbd-9715-7b2d-483961ce4539', 'Weapon', 'Witchblade', true, 0, NULL, 'Weapon', 1),
  ('f3331f64-2dd5-13c7-dcfa-fe5c6fafb7e1', 'd8ca34d5-ecbd-9715-7b2d-483961ce4539', 'Weapon', 'Singing Spear', false, 0, NULL, 'Weapon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('eebf62fe-cb13-2c3f-c374-4f3425e5a231', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Fire Dragons', 'infantry', '7"', 3, '3+', 1, 6, 1, '{"Infantry", "Fire Dragons", "Aeldari", "Aspect Warrior", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('eebf62fe-cb13-2c3f-c374-4f3425e5a231', 4, 120);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('eebf62fe-cb13-2c3f-c374-4f3425e5a231', 'Dragon Fusion Gun', 'ranged', '12"', '1', '3+', 9, -4, 'D6', '{"Assault", "Melta 3"}'),
  ('eebf62fe-cb13-2c3f-c374-4f3425e5a231', 'Close combat weapon', 'melee', NULL, '2', '3+', 3, 0, '1', '{}'),
  ('eebf62fe-cb13-2c3f-c374-4f3425e5a231', 'Exarch''s Dragon Fusion Gun', 'ranged', '12"', '1', '3+', 9, -4, 'D6', '{"Assault", "Melta 6"}'),
  ('eebf62fe-cb13-2c3f-c374-4f3425e5a231', 'Dragon''s Breath Flamer', 'ranged', '12"', 'D6+2', 'N/A', 6, -2, '1', '{"Assault", "Ignores cover", "Torrent"}'),
  ('eebf62fe-cb13-2c3f-c374-4f3425e5a231', 'Firepike', 'ranged', '18"', '1', '3+', 12, -4, 'D6', '{"Assault", "Melta 3"}'),
  ('eebf62fe-cb13-2c3f-c374-4f3425e5a231', 'Dragon Axe', 'melee', NULL, '3', '3+', 6, -4, 'D6', '{}'),
  ('eebf62fe-cb13-2c3f-c374-4f3425e5a231', 'Dragon Fusion Pistol', 'ranged', '6"', '1', '3+', 9, -4, 'D6', '{"Assault", "Melta 3", "Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('eebf62fe-cb13-2c3f-c374-4f3425e5a231', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save'),
  ('eebf62fe-cb13-2c3f-c374-4f3425e5a231', 'Assured Destruction', 'unique', 'In your Shooting phase, each time a model in this unit makes a ranged attack that targets a ^^Monster^^ or ^^Vehicle^^ unit, you can re-roll the Hit roll, you can re-roll the Wound roll and you can re-roll the Damage roll.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('35c8431f-feb7-9a66-9ef7-f298d7f3b81a', 'eebf62fe-cb13-2c3f-c374-4f3425e5a231', 'Fire Dragon', 4, 9, 4, false, 0, '4-9 Fire Dragons'),
  ('4e6176b4-d9d6-7f8e-9906-fa95aae601ed', 'eebf62fe-cb13-2c3f-c374-4f3425e5a231', 'Fire Dragon Exarch', 1, 1, 1, true, 1, 'Fire Dragon Exarch')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('d47fc704-7bcb-c7f4-336f-5540c4c257e3', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Fire Prism', 'vehicle', '14"', 9, '3+', 12, 7, 3, '{"Fire Prism", "Fly", "Vehicle", "Aeldari", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('d47fc704-7bcb-c7f4-336f-5540c4c257e3', 1, 150);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('d47fc704-7bcb-c7f4-336f-5540c4c257e3', '➤ Prism Cannon - dispersed pulse', 'ranged', '60"', '2D6', '3+', 6, -2, '2', '{"Blast"}'),
  ('d47fc704-7bcb-c7f4-336f-5540c4c257e3', '➤ Prism Cannon - focused lances', 'ranged', '60"', '2', '3+', 18, -4, '6', '{"Linked Fire"}'),
  ('d47fc704-7bcb-c7f4-336f-5540c4c257e3', 'Wraithbone Hull', 'melee', NULL, '3', '4+', 6, 0, '1', '{}'),
  ('d47fc704-7bcb-c7f4-336f-5540c4c257e3', 'Twin Shuriken Catapult', 'ranged', '18"', '2', '3+', 4, -1, '1', '{"Assault", "Twin Linked"}'),
  ('d47fc704-7bcb-c7f4-336f-5540c4c257e3', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Lethal Hits"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('d47fc704-7bcb-c7f4-336f-5540c4c257e3', 'Damaged: 1-4 Wounds Remaining', 'unique', 'While this model has 1-4 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('d47fc704-7bcb-c7f4-336f-5540c4c257e3', 'Crystal Matrix', 'unique', 'Each time this model is selected to shoot, you can re-roll one Hit roll and you can re-roll one Wound roll when resolving those attacks.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('f74d4511-0742-bad0-4fbf-6a0d7e75d6d9', 'd47fc704-7bcb-c7f4-336f-5540c4c257e3', 'Wargear', 'Prism Cannon', true, 0, NULL, NULL, NULL),
  ('26e78ca9-ccd1-320b-6775-83f1ae02707b', 'd47fc704-7bcb-c7f4-336f-5540c4c257e3', 'Wargear', 'Wraithbone hull', false, 0, NULL, NULL, NULL),
  ('2bb3c09c-523b-2e0b-1050-e5fed2278bb4', 'd47fc704-7bcb-c7f4-336f-5540c4c257e3', 'Hull weapon', 'Twin Shuriken Catapult', true, 0, NULL, 'Hull weapon', 1),
  ('21873488-b77c-9a9a-4886-24c53a07d56d', 'd47fc704-7bcb-c7f4-336f-5540c4c257e3', 'Hull weapon', 'Shuriken Cannon', false, 0, NULL, 'Hull weapon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('9d2cf6fe-9269-ed7d-f3d1-22e4bd0c6499', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Fuegan', 'epic_hero', '7"', 3, '2+', 5, 6, 1, '{"Character", "Epic Hero", "Infantry", "Phoenix Lord", "Fuegan", "Aeldari", "Aspect Warrior"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('9d2cf6fe-9269-ed7d-f3d1-22e4bd0c6499', 1, 120);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('9d2cf6fe-9269-ed7d-f3d1-22e4bd0c6499', '➤ Searsong - Beam', 'ranged', '12"', '3', '2+', 8, -3, '2', '{"Assault", "Melta 1", "Sustained hits 2"}'),
  ('9d2cf6fe-9269-ed7d-f3d1-22e4bd0c6499', '➤ Searsong - Lance', 'ranged', '18"', '1', '2+', 14, -4, 'D6', '{"Assault", "Melta 6"}'),
  ('9d2cf6fe-9269-ed7d-f3d1-22e4bd0c6499', 'The Fire Axe', 'melee', NULL, '6', '2+', 5, -4, '3', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('9d2cf6fe-9269-ed7d-f3d1-22e4bd0c6499', 'Invulnerable Save (Fuegan)', 'invulnerable', 'Fuegan has a 4+ Invulnerable save'),
  ('9d2cf6fe-9269-ed7d-f3d1-22e4bd0c6499', 'Burning Lance', 'unique', 'While this model is leading a unit, add 6" to the Range characteristic of Melta weapons equipped by models in that unit.'),
  ('9d2cf6fe-9269-ed7d-f3d1-22e4bd0c6499', 'Unquenchable Resolve', 'unique', 'The first time this model is destroyed, at the end of the phase, roll one D6. On a 2+, set this model back up on the battlefield as close as possible to where it was destroyed and not within Engagement Range of one or more enemy units, with its full wounds remaining.'),
  ('9d2cf6fe-9269-ed7d-f3d1-22e4bd0c6499', 'Leader', 'core', 'This model can be attached to the following unit:
■ Fire Dragons');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('aadcf8c2-25ff-45f9-dc3c-ef2465ec54df', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Guardian Defenders', 'battleline', '7"', 3, '4+', 1, 7, 2, '{"Guardian Defenders", "Battleline", "Infantry", "Guardians", "Aeldari", "Ynnari"}', 6, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('aadcf8c2-25ff-45f9-dc3c-ef2465ec54df', 11, 100);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('aadcf8c2-25ff-45f9-dc3c-ef2465ec54df', 'Close Combat Weapon', 'melee', NULL, '1', '3+', 3, 0, '1', '{}'),
  ('aadcf8c2-25ff-45f9-dc3c-ef2465ec54df', 'Shuriken Catapult', 'ranged', '18"', '2', '3+', 4, -1, '1', '{"Assault"}'),
  ('aadcf8c2-25ff-45f9-dc3c-ef2465ec54df', '➤ Missile Launcher - Starshot', 'ranged', '48"', '1', '3+', 10, -2, 'D6', '{}'),
  ('aadcf8c2-25ff-45f9-dc3c-ef2465ec54df', '➤ Missile Launcher - Sunburst', 'ranged', '48"', 'D6', '3+', 4, -1, '1', '{"Blast"}'),
  ('aadcf8c2-25ff-45f9-dc3c-ef2465ec54df', 'Bright Lance', 'ranged', '36"', '1', '3+', 12, -3, 'D6+2', '{}'),
  ('aadcf8c2-25ff-45f9-dc3c-ef2465ec54df', 'Scatter Laser', 'ranged', '36"', '6', '3+', 5, 0, '1', '{"Sustained Hits 1"}'),
  ('aadcf8c2-25ff-45f9-dc3c-ef2465ec54df', 'Starcannon', 'ranged', '36"', '2', '3+', 8, -3, '2', '{}'),
  ('aadcf8c2-25ff-45f9-dc3c-ef2465ec54df', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Lethal Hits"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('aadcf8c2-25ff-45f9-dc3c-ef2465ec54df', 'Fleet of Foot', 'unique', 'This unit can perform the Fade Back Agile Manoeuvre without spending a Battle Focus token to do so. It can do so even if other units have done so in the same phase, and doing so does not prevent other units from performing the same Agile Manoeuvre in the same phase.'),
  ('aadcf8c2-25ff-45f9-dc3c-ef2465ec54df', 'Crewed Platform', 'unique', 'When the last Guardian Defender model in this unit is destroyed, any remaining Heavy Weapon Platform models in this unit are also destroyed.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('adde02c2-3be1-2567-4fde-35225f9fde9b', 'aadcf8c2-25ff-45f9-dc3c-ef2465ec54df', 'Guardian Defender', 10, 10, 10, false, 2, NULL),
  ('ab593208-67d1-1ba2-ef38-19f784f867d3', 'aadcf8c2-25ff-45f9-dc3c-ef2465ec54df', 'Heavy Weapon Platform', 1, 1, 1, true, 3, NULL)
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('0da280f6-ab1d-f9ce-706d-ca2455056f02', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Hemlock Wraithfighter', 'vehicle', '20+"', 8, '3+', 12, 6, 1, '{"Hemlock Wraithfighter", "Vehicle", "Fly", "Aircraft", "Psyker", "Wraith Construct", "Aeldari", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('0da280f6-ab1d-f9ce-706d-ca2455056f02', 1, 155);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('0da280f6-ab1d-f9ce-706d-ca2455056f02', 'Wraithbone Hull', 'melee', NULL, '3', '4+', 6, 0, '1', '{}'),
  ('0da280f6-ab1d-f9ce-706d-ca2455056f02', 'Heavy D-Scythe', 'ranged', '18"', 'D6', '4+', 12, -4, '2', '{"Blast"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('0da280f6-ab1d-f9ce-706d-ca2455056f02', 'Mindshock Pod (Aura, Psychic)', 'unique', 'While an enemy unit is within 9" of this model, subtract 1 from Battle-shock and Leadership tests taken for that unit.'),
  ('0da280f6-ab1d-f9ce-706d-ca2455056f02', 'Damaged: 1-4 Wounds Remaining', 'unique', 'While this model has 1-4 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('6893b2a7-aaba-29ed-12b4-dc8442237223', '0da280f6-ab1d-f9ce-706d-ca2455056f02', 'Wargear', 'Heavy D-Scythe', true, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('18300e69-1b78-1817-c3cd-7a47e3889b45', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Howling Banshees', 'infantry', '8"', 3, '4+', 1, 6, 1, '{"Howling Banshees", "Infantry", "Ynnari", "Aspect Warrior"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('18300e69-1b78-1817-c3cd-7a47e3889b45', 4, 95);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('18300e69-1b78-1817-c3cd-7a47e3889b45', 'Banshee Blade', 'melee', NULL, '2', '2+', 4, -2, '2', '{"Anti-Infantry 3+"}'),
  ('18300e69-1b78-1817-c3cd-7a47e3889b45', 'Shuriken Pistol', 'ranged', '12"', '1', '3+', 4, -1, '1', '{"Assault", "Pistol"}'),
  ('18300e69-1b78-1817-c3cd-7a47e3889b45', 'Executioner', 'melee', NULL, '3', '2+', 6, -3, '3', '{"Anti-Infantry 3+"}'),
  ('18300e69-1b78-1817-c3cd-7a47e3889b45', 'Triskele', 'melee', NULL, '6', '2+', 3, -1, '1', '{"Anti-Infantry 3+"}'),
  ('18300e69-1b78-1817-c3cd-7a47e3889b45', 'Triskele', 'ranged', '12"', '3', '3+', 3, -1, '1', '{"Assault", "Anti-Infantry 3+"}'),
  ('18300e69-1b78-1817-c3cd-7a47e3889b45', 'Mirrorswords', 'melee', NULL, '4', '2+', 4, -2, '2', '{"Anti-Infantry 3+"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('18300e69-1b78-1817-c3cd-7a47e3889b45', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable Save. This invulnerable save is improved to 4+ against melee attacks.'),
  ('18300e69-1b78-1817-c3cd-7a47e3889b45', 'Acrobatic', 'unique', 'This unit is eligible to declare a charge in a turn in which it Advanced or Fell Back');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('bd620bdf-84b2-d7fc-1a23-452d21c0fe92', '18300e69-1b78-1817-c3cd-7a47e3889b45', 'Howling Banshee', 4, 9, 4, false, 0, '4-9 Howling Banshees'),
  ('012e7bfb-3ecf-4bf8-bdfa-5b0df5f5ed87', '18300e69-1b78-1817-c3cd-7a47e3889b45', 'Howling Banshee Exarch', 1, 1, 1, true, 1, 'Howling Banshee Exarch')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('cffdbe10-034d-9d02-0889-9d09d5a726cd', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Illic Nightspear', 'epic_hero', '7"', 3, '5+', 3, 6, 1, '{"Infantry", "Character", "Epic Hero", "Illic Nightspear", "Aeldari"}', 1, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('cffdbe10-034d-9d02-0889-9d09d5a726cd', 1, 70);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('cffdbe10-034d-9d02-0889-9d09d5a726cd', 'Shuriken Pistol', 'ranged', '12"', '1', '2+', 4, -1, '1', '{"Assault", "Pistol"}'),
  ('cffdbe10-034d-9d02-0889-9d09d5a726cd', 'Voidbringer', 'ranged', '48"', '1', '2+', 6, -3, '3', '{"Devastating Wounds", "Heavy", "Precision"}'),
  ('cffdbe10-034d-9d02-0889-9d09d5a726cd', 'Aeldari power sword', 'melee', NULL, '4', '2+', 4, -2, '1', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('cffdbe10-034d-9d02-0889-9d09d5a726cd', 'Invulnerable Save (Illic Nightspear)', 'invulnerable', 'Illic Nightspear has a 5+ invulnerable save against ranged attacks.'),
  ('cffdbe10-034d-9d02-0889-9d09d5a726cd', 'Bringer of the True Death', 'unique', 'While this model is leading a unit, each time a model in that unit makes an attack, you can re-roll the Wound roll.'),
  ('cffdbe10-034d-9d02-0889-9d09d5a726cd', 'Hunter Unseen', 'unique', 'This model’s unit can only be selected as the target of a ranged attack if the attacking model is within 12".'),
  ('cffdbe10-034d-9d02-0889-9d09d5a726cd', 'Leader', 'core', 'This model can be attached to the following unit:
■ Rangers');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('302b99d8-0be7-730d-189e-69a8e9774e3b', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Jain Zar', 'epic_hero', '8"', 3, '2+', 5, 6, 1, '{"Jain Zar", "Phoenix Lord", "Character", "Epic Hero", "Infantry", "Aeldari", "Aspect Warrior"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('302b99d8-0be7-730d-189e-69a8e9774e3b', 1, 120);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('302b99d8-0be7-730d-189e-69a8e9774e3b', 'Silent Death', 'ranged', '12"', '6', '2+', 6, -2, '1', '{"Assault"}'),
  ('302b99d8-0be7-730d-189e-69a8e9774e3b', 'Blade of Destruction', 'melee', NULL, '8', '2+', 6, -3, '2', '{"Anti-Infantry 3+"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('302b99d8-0be7-730d-189e-69a8e9774e3b', 'Invulnerable Save (Jain Zar)', 'invulnerable', 'Jain Zar has a 4+ Invulnerable save'),
  ('302b99d8-0be7-730d-189e-69a8e9774e3b', 'Leader', 'core', 'This model can be attached to the following unit:
■ Howling Banshees'),
  ('302b99d8-0be7-730d-189e-69a8e9774e3b', 'Whirling Death', 'unique', 'While this model is leading a unit, each time that unit Advances, do not make an Advance roll. Instead, until the end of the phase, add 6" to the Move characteristic of models in that unit and each time a model in that unit makes an Advance move, ignore any vertical distance when determining the total distance that model can be moved during that move.'),
  ('302b99d8-0be7-730d-189e-69a8e9774e3b', 'Storm of Silence', 'unique', 'Each time this model makes an attack that targets a ^^Character^^ unit, you can re-roll the Wound roll.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('80645b00-38e9-3021-a5ce-3b7cdaf66bae', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Karandras', 'epic_hero', '7"', 3, '2+', 5, 6, 1, '{"Epic Hero", "Character", "Infantry", "Karandras", "Phoenix Lord", "Aeldari"}', 1, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('80645b00-38e9-3021-a5ce-3b7cdaf66bae', 1, 90);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('80645b00-38e9-3021-a5ce-3b7cdaf66bae', 'Arhra''s Bane', 'ranged', '12"', '2', '2+', 5, -1, '2', '{"Assault", "Pistol"}'),
  ('80645b00-38e9-3021-a5ce-3b7cdaf66bae', 'Arhra''s Bane', 'melee', NULL, '5', '2+', 8, -3, '2', '{"Sustained Hits 1"}'),
  ('80645b00-38e9-3021-a5ce-3b7cdaf66bae', 'Isirmathil', 'melee', NULL, '8', '2+', 6, -1, '1', '{"Sustained Hits 1"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('80645b00-38e9-3021-a5ce-3b7cdaf66bae', 'Invulnerable Save (Phoenix Lord)', 'invulnerable', 'Karandras has a 4+ Invulnerable save'),
  ('80645b00-38e9-3021-a5ce-3b7cdaf66bae', 'Leader', 'core', 'This model can be attached to the following unit:
■ Striking Scorpions'),
  ('80645b00-38e9-3021-a5ce-3b7cdaf66bae', 'Shadow Hunter', 'unique', 'While this model is leading a unit, each time a model in that unit makes an attack, add 1 to the Hit roll.'),
  ('80645b00-38e9-3021-a5ce-3b7cdaf66bae', 'Sustained Assault', 'unique', 'Each time this model makes a melee attack, if it made a Charge move this turn, a successful unmodified Hit roll of 4+ scores a Critical Hit'),
  ('80645b00-38e9-3021-a5ce-3b7cdaf66bae', 'The Scorpion''s Bite', 'unique', 'Melee weapons equipped by the bearer have the [DEVASTATING WOUNDS] ability when targeting units without the ^^Titanic^^ keyword');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('ec65cd78-0c2d-133e-1858-c8140bcffc91', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Maugan Ra', 'epic_hero', '7"', 3, '2+', 5, 6, 1, '{"Phoenix Lord", "Maugan Ra", "Infantry", "Epic Hero", "Character", "Aeldari", "Aspect Warrior"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('ec65cd78-0c2d-133e-1858-c8140bcffc91', 1, 100);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('ec65cd78-0c2d-133e-1858-c8140bcffc91', 'Maugetar', 'ranged', '36"', '6', '2+', 7, -2, '2', '{"Devastating wounds", "Ignores cover"}'),
  ('ec65cd78-0c2d-133e-1858-c8140bcffc91', 'Maugetar', 'melee', NULL, '5', '2+', 6, -2, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('ec65cd78-0c2d-133e-1858-c8140bcffc91', 'Leader', 'core', 'This model can be attached to the following unit:
■ Dark Reapers'),
  ('ec65cd78-0c2d-133e-1858-c8140bcffc91', 'Invulnerable Save (Maugan Ra)', 'invulnerable', 'Maugan Ra has a 4+ Invulnerable save'),
  ('ec65cd78-0c2d-133e-1858-c8140bcffc91', 'Harvester of Souls', 'unique', 'While this model is leading a unit, in your Shooting phase, after selecting targets for that unit''s attacks, if every attack targets the same unit, roll one D6 for the target unit and one D6 for every other enemy unit within 3" of the target unit. On a 5+, the unit being rolled for is struck by explosive debris; after resolving all of that unit''s attacks against the target unit, each unit struck by explosive debris suffers D3 mortal wounds.'),
  ('ec65cd78-0c2d-133e-1858-c8140bcffc91', 'Face of Death', 'unique', 'In your Shooting phase, after this model has shot, select one enemy unit hit by one or more of those attacks. That enemy unit must take a Battle-shock test, subtracting 1 from the result.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('acd8d07f-6054-1105-e39b-ec72e2abe43a', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Night Spinner', 'vehicle', '14"', 9, '3+', 12, 7, 3, '{"Fly", "Vehicle", "Night Spinner", "Aeldari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('acd8d07f-6054-1105-e39b-ec72e2abe43a', 1, 190);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('acd8d07f-6054-1105-e39b-ec72e2abe43a', 'Doomweaver', 'ranged', '48"', 'D6+3', '3+', 7, -1, '2', '{"Blast", "Indirect Fire", "Twin Linked"}'),
  ('acd8d07f-6054-1105-e39b-ec72e2abe43a', 'Wraithbone Hull', 'melee', NULL, '3', '4+', 6, 0, '1', '{}'),
  ('acd8d07f-6054-1105-e39b-ec72e2abe43a', 'Twin Shuriken Catapult', 'ranged', '18"', '2', '3+', 4, -1, '1', '{"Assault", "Twin Linked"}'),
  ('acd8d07f-6054-1105-e39b-ec72e2abe43a', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Lethal Hits"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('acd8d07f-6054-1105-e39b-ec72e2abe43a', 'Damaged: 1-4 Wounds Remaining', 'unique', 'While this model has 1-4 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('acd8d07f-6054-1105-e39b-ec72e2abe43a', 'Monofilament Web', 'unique', 'In your Shooting phase, after this model has shot, if one or more of those attacks made with its doomweaver scored a hit against an enemy unit, until the start of your next turn, that enemy unit is pinned. While a unit is pinned, subtract 2 from that unit''s Move characteristic and subtract 2 from Charge rolls made for it.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('73833a4b-24e8-b36c-9589-5df1d2420006', 'acd8d07f-6054-1105-e39b-ec72e2abe43a', 'Wargear', 'Doomweaver', true, 0, NULL, NULL, NULL),
  ('bc6b81d2-5c42-e880-8a75-5d7e9bbc4546', 'acd8d07f-6054-1105-e39b-ec72e2abe43a', 'Wargear', 'Wraithbone hull', false, 0, NULL, NULL, NULL),
  ('ae10c1ad-2fcd-cb59-b0fc-363e7a164295', 'acd8d07f-6054-1105-e39b-ec72e2abe43a', 'Hull weapon', 'Twin Shuriken Catapult', true, 0, NULL, 'Hull weapon', 1),
  ('c88d5f98-53ce-2a09-df10-588178316de5', 'acd8d07f-6054-1105-e39b-ec72e2abe43a', 'Hull weapon', 'Shuriken Cannon', false, 0, NULL, 'Hull weapon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('c84da347-c2d2-b531-fb1c-83bfbd966079', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Prince Yriel', 'epic_hero', '7"', 3, '3+', 4, 6, 1, '{"Prince Yriel", "Infantry", "Character", "Epic Hero", "Aeldari"}', 1, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('c84da347-c2d2-b531-fb1c-83bfbd966079', 1, 100);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('c84da347-c2d2-b531-fb1c-83bfbd966079', 'The Eye of Wrath', 'ranged', '6"', '1', '2+', 6, -3, '2', '{"Assault"}'),
  ('c84da347-c2d2-b531-fb1c-83bfbd966079', 'The Spear of Twilight', 'melee', NULL, '5', '2+', 6, -3, '3', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('c84da347-c2d2-b531-fb1c-83bfbd966079', 'Invulnerable Save (Prince Yriel)', 'invulnerable', 'Prince Yriel has a 4+ Invulnerable save'),
  ('c84da347-c2d2-b531-fb1c-83bfbd966079', 'Leader', 'core', 'This model can be attached to the following units:
■ Corsair Voidreavers
■ Corsair Voidscarred
■ Guardian Defenders
■ Storm Guardians'),
  ('c84da347-c2d2-b531-fb1c-83bfbd966079', 'Hero of Iyanden', 'unique', 'While this model is leading a unit, add 1 to the Objective Control characteristic of models in that unit.'),
  ('c84da347-c2d2-b531-fb1c-83bfbd966079', 'Prince of Corsairs', 'unique', 'If your army includes this model, after both players have deployed their armies, select up to three Aeldari units from your army and redeploy them. When doing so, you can set those units up in Strategic Reserves if you wish, regardless of how many units are already in Strategic Reserves.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('16f1f057-401a-4ffd-7514-ade44a3a166d', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Rangers', 'infantry', '7"', 3, '5+', 1, 7, 1, '{"Rangers", "Infantry", "Aeldari", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('16f1f057-401a-4ffd-7514-ade44a3a166d', 5, 55);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('16f1f057-401a-4ffd-7514-ade44a3a166d', 'Long rifle', 'ranged', '36"', '1', '3+', 4, -1, '2', '{"Heavy", "Precision"}'),
  ('16f1f057-401a-4ffd-7514-ade44a3a166d', 'Close Combat Weapon', 'melee', NULL, '1', '3+', 3, 0, '1', '{}'),
  ('16f1f057-401a-4ffd-7514-ade44a3a166d', 'Shuriken Pistol', 'ranged', '12"', '1', '2+', 4, -1, '1', '{"Assault", "Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('16f1f057-401a-4ffd-7514-ade44a3a166d', 'Invulnerable Save', 'invulnerable', 'Models in this unit have a 5+ invulnerable save against ranged attacks only.'),
  ('16f1f057-401a-4ffd-7514-ade44a3a166d', 'Path of the Outcast', 'unique', 'Once per turn, when an enemy unit ends a Normal, Advance or Fall Back move within 9" of this unit, it can make a Normal move of up to D6".');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('df9ce3b2-1738-da9e-45bc-fa646029c0b1', '16f1f057-401a-4ffd-7514-ade44a3a166d', 'Ranger', 5, 10, 5, false, 2, NULL)
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('a827d36f-ed6f-5b98-6dd2-a6633356a3a3', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Shadowseer', 'character', '8"', 3, '6+', 4, 6, 1, '{"Shadowseer", "Character", "Infantry", "Psyker", "Harlequin Allies", "Aeldari", "Corsairs and Travelling Players"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('a827d36f-ed6f-5b98-6dd2-a6633356a3a3', 1, 60);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('a827d36f-ed6f-5b98-6dd2-a6633356a3a3', 'Miststave', 'melee', NULL, '4', '2+', 5, -1, 'D3', '{"Psychic"}'),
  ('a827d36f-ed6f-5b98-6dd2-a6633356a3a3', 'Shuriken Pistol', 'ranged', '12"', '1', '2+', 4, -1, '1', '{"Assault", "Pistol"}'),
  ('a827d36f-ed6f-5b98-6dd2-a6633356a3a3', 'Neuro Disruptor', 'ranged', '12"', '1', '2+', 4, -2, '1', '{"Anti-infantry 2+", "Assault", "Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('a827d36f-ed6f-5b98-6dd2-a6633356a3a3', 'Leader', 'core', 'This model can be attached to the following unit:
■ Troupe'),
  ('a827d36f-ed6f-5b98-6dd2-a6633356a3a3', 'Invulnerable Save', 'invulnerable', 'This unit has a 4+ Invulnerable save'),
  ('a827d36f-ed6f-5b98-6dd2-a6633356a3a3', 'Fog of Dreams (Psychic)', 'unique', 'While this model is leading a unit, that unit can only be selected as the target of a ranged attack if the attacking model is within 18".'),
  ('a827d36f-ed6f-5b98-6dd2-a6633356a3a3', 'Treacherous Illusion (Psychic)', 'unique', 'Melee weapons equipped by enemy models have the [Hazardous] ability while targeting this model''s unit.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('11e9e03d-633a-ac69-cbbc-c57b2cb13eac', 'a827d36f-ed6f-5b98-6dd2-a6633356a3a3', 'Wargear', 'Miststave', true, 0, NULL, NULL, NULL),
  ('948fa320-2334-1e06-efee-dfbb909b2eee', 'a827d36f-ed6f-5b98-6dd2-a6633356a3a3', 'Pistol Choice', 'Shuriken Pistol', true, 0, NULL, 'Pistol Choice', 1),
  ('805d3876-90cb-dd82-ad74-d4bc38b802a0', 'a827d36f-ed6f-5b98-6dd2-a6633356a3a3', 'Pistol Choice', 'Neuro Disruptor', false, 0, NULL, 'Pistol Choice', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('ac9b9abd-139e-2a2c-2586-abe912c0b4c3', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Shining Spears', 'mounted', '14"', 4, '3+', 2, 6, 2, '{"Shining Spears", "Mounted", "Fly", "Aeldari", "Aspect Warrior", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('ac9b9abd-139e-2a2c-2586-abe912c0b4c3', 2, 110);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('ac9b9abd-139e-2a2c-2586-abe912c0b4c3', 'Twin Shuriken Catapult', 'ranged', '18"', '2', '3+', 4, -1, '1', '{"Assault", "Twin Linked"}'),
  ('ac9b9abd-139e-2a2c-2586-abe912c0b4c3', 'Laser Lance', 'ranged', '6"', '1', '3+', 6, -2, '3', '{"Assault"}'),
  ('ac9b9abd-139e-2a2c-2586-abe912c0b4c3', 'Laser Lance', 'melee', NULL, '3', '3+', 5, -2, '3', '{"Anti-Monster 3+", "Anti-Vehicle 3+", "Lance"}'),
  ('ac9b9abd-139e-2a2c-2586-abe912c0b4c3', 'Paragon Sabre', 'melee', NULL, '6', '3+', 5, -2, '2', '{}'),
  ('ac9b9abd-139e-2a2c-2586-abe912c0b4c3', 'Star Lance', 'ranged', '6"', '1', '3+', 9, -3, '3', '{"Assault"}'),
  ('ac9b9abd-139e-2a2c-2586-abe912c0b4c3', 'Star Lance', 'melee', NULL, '4', '3+', 5, -3, '3', '{"Anti-Monster 3+", "Anti-Vehicle 3+", "Lance"}'),
  ('ac9b9abd-139e-2a2c-2586-abe912c0b4c3', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Lethal Hits"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('ac9b9abd-139e-2a2c-2586-abe912c0b4c3', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable Save.'),
  ('ac9b9abd-139e-2a2c-2586-abe912c0b4c3', 'Extreme Mobility', 'unique', 'Each time this unit makes a Normal, Advance, Fall Back or Charge move, ignore any vertical distance when determining the total distance models in this unit can be moved during that move.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('f343e4da-53ea-4500-41f6-1ecc70bbae02', 'ac9b9abd-139e-2a2c-2586-abe912c0b4c3', 'Shining Spear', 2, 5, 2, false, 0, '2-5 Shining Spears'),
  ('1dcbcd4c-a6e4-9a40-505b-db575cf14fe5', 'ac9b9abd-139e-2a2c-2586-abe912c0b4c3', 'Shining Spear Exarch', 1, 1, 1, true, 1, 'Shining Spear Exarch')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('ab687ad8-ab89-d38f-d850-10d9afc027ca', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Shroud Runners', 'mounted', '14"', 4, '5+', 3, 7, 2, '{"Shroud Runners", "Fly", "Mounted", "Aeldari", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('ab687ad8-ab89-d38f-d850-10d9afc027ca', 3, 80);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('ab687ad8-ab89-d38f-d850-10d9afc027ca', 'Long rifle', 'ranged', '36"', '1', '2+', 4, -1, '2', '{"Precision"}'),
  ('ab687ad8-ab89-d38f-d850-10d9afc027ca', 'Scatter Laser', 'ranged', '36"', '6', '3+', 5, 0, '1', '{"Sustained Hits 1"}'),
  ('ab687ad8-ab89-d38f-d850-10d9afc027ca', 'Close Combat Weapon', 'melee', NULL, '1', '3+', 3, 0, '1', '{}'),
  ('ab687ad8-ab89-d38f-d850-10d9afc027ca', 'Shuriken Pistol', 'ranged', '12"', '1', '2+', 4, -1, '1', '{"Assault", "Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('ab687ad8-ab89-d38f-d850-10d9afc027ca', 'Invulnerable Save', 'invulnerable', 'Models in this unit have a 5+ invulnerable save against ranged attacks only.'),
  ('ab687ad8-ab89-d38f-d850-10d9afc027ca', 'Target Acquisition', 'unique', 'In your Shooting phase, after this unit has shot, select one enemy unit hit by one or more of those attacks made with a long rifle. Until the end of the phase, that enemy unit cannot have the Benefit of Cover.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('b0aee645-db70-5d9f-5c57-b620ebe7ffbf', 'ab687ad8-ab89-d38f-d850-10d9afc027ca', 'Shroud Runner', 3, 6, 3, false, 2, NULL)
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('15088572-6baf-0981-3b15-4837a9206457', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Skyweavers', 'mounted', '14"', 4, '4+', 3, 6, 2, '{"Skyweavers", "Fly", "Mounted", "Smoke", "Harlequin Allies", "Aeldari", "Corsairs and Travelling Players"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('15088572-6baf-0981-3b15-4837a9206457', 2, 95);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('15088572-6baf-0981-3b15-4837a9206457', 'Close Combat Weapon', 'melee', NULL, '4', '3+', 3, 0, '1', '{}'),
  ('15088572-6baf-0981-3b15-4837a9206457', 'Skyweaver Haywire Cannon', 'ranged', '24"', '2', '3+', 3, -1, '3', '{"Anti-Vehicle 4+", "Devastating Wounds"}'),
  ('15088572-6baf-0981-3b15-4837a9206457', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Lethal Hits"}'),
  ('15088572-6baf-0981-3b15-4837a9206457', 'Star Bolas', 'ranged', '12"', 'D3', '3+', 7, -2, '2', '{}'),
  ('15088572-6baf-0981-3b15-4837a9206457', 'Zephyrglaive', 'melee', NULL, '4', '3+', 6, -2, '2', '{}');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('0fd7b4f6-bdb7-6aab-3dd7-fbd2f71e5662', '15088572-6baf-0981-3b15-4837a9206457', 'Skyweaver', 2, 4, 2, false, 2, NULL)
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('8bf205cd-ba8c-3ac2-58a9-bc8bbf98e07f', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Solitaire', 'epic_hero', '12"', 3, '6+', 4, 6, 1, '{"Solitaire", "Character", "Epic Hero", "Infantry", "Harlequin Allies", "Aeldari", "Corsairs and Travelling Players"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('8bf205cd-ba8c-3ac2-58a9-bc8bbf98e07f', 1, 115);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('8bf205cd-ba8c-3ac2-58a9-bc8bbf98e07f', 'Solitaire Weapons', 'melee', NULL, '9', '2+', 6, -2, '2', '{"Precision"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('8bf205cd-ba8c-3ac2-58a9-bc8bbf98e07f', 'Invulnerable Save', 'invulnerable', 'This unit has a 4+ Invulnerable save'),
  ('8bf205cd-ba8c-3ac2-58a9-bc8bbf98e07f', 'Blitz', 'unique', 'Once per battle, in your Movement phase, before this model makes a Normal move it can use this ability. If it does, until the end of
the turn, add 2D6" to this model’s Move characteristic and add 3 to the
Attacks characteristic of this model’s Solitaire weapons.'),
  ('8bf205cd-ba8c-3ac2-58a9-bc8bbf98e07f', 'Blur of Movement', 'unique', 'This model is eligible to declare a charge in a turn in which it Advanced.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('937287c0-14bf-ee85-a754-71fbbc094e77', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Spiritseer', 'character', '7"', 3, '6+', 3, 6, 1, '{"Spiritseer", "Character", "Infantry", "Psyker", "Aeldari", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('937287c0-14bf-ee85-a754-71fbbc094e77', 1, 65);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('937287c0-14bf-ee85-a754-71fbbc094e77', 'Witch Staff', 'melee', NULL, '2', '2+', 3, 0, 'D3', '{"Anti-infantry 2+", "Psychic"}'),
  ('937287c0-14bf-ee85-a754-71fbbc094e77', 'Shuriken Pistol', 'ranged', '12"', '1', '2+', 4, -1, '1', '{"Assault", "Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('937287c0-14bf-ee85-a754-71fbbc094e77', 'Invulnerable Save (Spiritseer)', 'invulnerable', 'A Spiritseer has a 4+ Invulnerable save'),
  ('937287c0-14bf-ee85-a754-71fbbc094e77', 'Spirit Mark (Psychic)', 'unique', 'Once per turn, in your Movement phase, when this model starts or ends a move, select one friendly Wraith Construct unit within 6" of this model (excluding Titanic units) and one enemy unit visible to this model. Until the start of your next Movement phase, weapons equipped by models in that friendly unit have the [Sustained Hits 1] ability while targeting that enemy unit.'),
  ('937287c0-14bf-ee85-a754-71fbbc094e77', 'Tears of Isha (Psychic)', 'unique', 'In your Command phase, select one friendly Wraith Construct unit within 6" of this model. If one or more models in that unit are destroyed, you can return one destroyed model to that unit. Otherwise, one model in that unit regains up to D3 lost wounds. Each unit can only be selected for this ability once per turn.'),
  ('937287c0-14bf-ee85-a754-71fbbc094e77', 'Spiritseer', 'unique', 'While this model is within 3" of one or more friendly Wraith Construct units, this model has the Lone Operative ability.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('4815d33f-de2d-0c7f-cf1e-2fb9e5a84b78', '937287c0-14bf-ee85-a754-71fbbc094e77', 'Wargear', 'Witch Staff', true, 0, NULL, NULL, NULL),
  ('24f254b0-8e1b-3f49-4559-1ac719bed032', '937287c0-14bf-ee85-a754-71fbbc094e77', 'Wargear', 'Shuriken Pistol', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('da86c47d-5c83-43ab-7031-f739eab9ac07', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Starweaver', 'dedicated_transport', '14"', 6, '4+', 6, 6, 2, '{"Star Weaver", "Dedicated Transport", "Fly", "Smoke", "Vehicle", "Transport", "Aeldari", "Harlequin Allies", "Corsairs and Travelling Players"}', 6, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('da86c47d-5c83-43ab-7031-f739eab9ac07', 1, 80);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('da86c47d-5c83-43ab-7031-f739eab9ac07', 'Close Combat Weapon', 'melee', NULL, '4', '3+', 3, 0, '1', '{}'),
  ('da86c47d-5c83-43ab-7031-f739eab9ac07', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Lethal Hits"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('da86c47d-5c83-43ab-7031-f739eab9ac07', 'Invulnerable Save', 'invulnerable', 'This unit has a 4+ Invulnerable save'),
  ('da86c47d-5c83-43ab-7031-f739eab9ac07', 'Rapid Embarkation', 'unique', 'At the end of the Fight phase, if there are no models currently embarked within this Transport, you can select one friendly Harlequins Infantry unit that has 6 or fewer models that is wholly within 6" of this Transport. Unless that unit is within Engagement Range of one or more enemy units, it can embark within this Transport.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('8901d290-5ccf-64cd-e557-dc987844245c', 'da86c47d-5c83-43ab-7031-f739eab9ac07', 'Wargear', 'Close Combat Weapon', true, 0, NULL, NULL, NULL),
  ('2ffb7ddc-0f11-6204-6cdf-3f3319f2157f', 'da86c47d-5c83-43ab-7031-f739eab9ac07', 'Wargear', 'Shuriken Cannon', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('f034f924-9dd1-3e18-62bd-134e50c699c5', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Storm Guardians', 'battleline', '7"', 3, '4+', 2, 7, 1, '{"Storm Guardians", "Battleline", "Infantry", "Guardians", "Aeldari", "Ynnari"}', 6, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('f034f924-9dd1-3e18-62bd-134e50c699c5', 11, 110);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('f034f924-9dd1-3e18-62bd-134e50c699c5', 'Close Combat Weapon', 'melee', NULL, '2', '3+', 3, 0, '1', '{}'),
  ('f034f924-9dd1-3e18-62bd-134e50c699c5', 'Shuriken Pistol', 'ranged', '12"', '1', '3+', 4, -1, '1', '{"Assault", "Pistol"}'),
  ('f034f924-9dd1-3e18-62bd-134e50c699c5', 'Flamer', 'ranged', '12"', 'D6', 'N/A', 4, 0, '1', '{"Assault", "Ignores Cover", "Torrent"}'),
  ('f034f924-9dd1-3e18-62bd-134e50c699c5', 'Fusion gun', 'ranged', '12"', '1', '3+', 8, -4, 'D6', '{"Assault", "Melta 2"}'),
  ('f034f924-9dd1-3e18-62bd-134e50c699c5', 'Power sword', 'melee', NULL, '2', '3+', 4, -2, '1', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('f034f924-9dd1-3e18-62bd-134e50c699c5', 'Stormblades', 'unique', 'At the end of your Command phase, if this unit is within range of an objective marker you control, that objective marker remains under your control until your opponent''s Level of Control over that objective marker is greater than yours at the end of a phase.'),
  ('f034f924-9dd1-3e18-62bd-134e50c699c5', 'Crewed Platform', 'unique', 'When the last Storm Guardian model in this unit is destroyed, any remaining Serpent’s Scale Platform models in this unit are also destroyed.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('3477d3cc-9bd2-f8b2-82be-e63c85e76351', 'f034f924-9dd1-3e18-62bd-134e50c699c5', 'Serpent''s Scale Platform', 1, 1, 1, true, 3, NULL),
  ('472b4ab6-0e79-1d0b-ed2e-3d415c44bedb', 'f034f924-9dd1-3e18-62bd-134e50c699c5', 'Storm Guardian', 4, 10, 4, false, 1, '10 Storm Guardians'),
  ('c80d90fd-47c7-9c78-1b86-29c7465e7cec', 'f034f924-9dd1-3e18-62bd-134e50c699c5', 'Storm Guardian with Flamer', 0, 2, 0, false, 2, '10 Storm Guardians'),
  ('197b52f3-649d-30e6-b42d-12b3a0432e14', 'f034f924-9dd1-3e18-62bd-134e50c699c5', 'Storm Guardian with Fusion Gun', 0, 2, 0, false, 3, '10 Storm Guardians'),
  ('49b2cb5a-abff-6848-36e9-e53d25d74f03', 'f034f924-9dd1-3e18-62bd-134e50c699c5', 'Storm Guardian with Power Sword', 0, 2, 0, false, 4, '10 Storm Guardians'),
  ('e62bd957-3d75-428d-1088-495f9e3975c7', 'f034f924-9dd1-3e18-62bd-134e50c699c5', 'Storm Guardian with Flamer & Power Sword', 0, 2, 0, false, 5, '10 Storm Guardians'),
  ('a7ed3b07-a8af-9b7a-f50e-b23a8a794919', 'f034f924-9dd1-3e18-62bd-134e50c699c5', 'Storm Guardian with Fusion Gun & Power Sword', 0, 2, 0, false, 6, '10 Storm Guardians')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('dc9f8406-d5c6-26b1-75e8-42eeef91a58b', 'f034f924-9dd1-3e18-62bd-134e50c699c5', '10 Storm Guardians', 'Storm Guardian', true, 0, NULL, NULL, NULL),
  ('f733ed08-b96a-0e32-0361-d01ec2d92461', 'f034f924-9dd1-3e18-62bd-134e50c699c5', '10 Storm Guardians', 'Storm Guardian with Flamer', false, 0, NULL, NULL, NULL),
  ('d90d7f7a-033e-48c9-c234-5505ccceccf5', 'f034f924-9dd1-3e18-62bd-134e50c699c5', '10 Storm Guardians', 'Storm Guardian with Fusion Gun', false, 0, NULL, NULL, NULL),
  ('d0e4b31b-97ba-ddcc-dce0-ebd9d15c4bf5', 'f034f924-9dd1-3e18-62bd-134e50c699c5', '10 Storm Guardians', 'Storm Guardian with Power Sword', false, 0, NULL, NULL, NULL),
  ('bcc8ef12-a871-4111-8bf8-aa7739763223', 'f034f924-9dd1-3e18-62bd-134e50c699c5', '10 Storm Guardians', 'Storm Guardian with Flamer & Power Sword', false, 0, NULL, NULL, NULL),
  ('d82985e9-d232-c7df-072a-824d89a1f4dd', 'f034f924-9dd1-3e18-62bd-134e50c699c5', '10 Storm Guardians', 'Storm Guardian with Fusion Gun & Power Sword', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('735b3461-19a7-7556-9f64-a8f4ee9adb03', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Striking Scorpions', 'infantry', '7"', 3, '3+', 1, 6, 1, '{"Striking Scorpions", "Infantry", "Aeldari", "Aspect Warrior", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('735b3461-19a7-7556-9f64-a8f4ee9adb03', 4, 85);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('735b3461-19a7-7556-9f64-a8f4ee9adb03', 'Scorpion chainsword', 'melee', NULL, '4', '3+', 4, -1, '1', '{"Sustained Hits 1"}'),
  ('735b3461-19a7-7556-9f64-a8f4ee9adb03', 'Shuriken pistol', 'ranged', '12"', '1', '3+', 4, -1, '1', '{"Assault", "Pistol"}'),
  ('735b3461-19a7-7556-9f64-a8f4ee9adb03', 'Chainsabres', 'melee', NULL, '5', '3+', 4, -1, '1', '{"Sustained Hits 1", "Twin-Linked"}'),
  ('735b3461-19a7-7556-9f64-a8f4ee9adb03', 'Chainsabres', 'ranged', '12"', '1', '3+', 4, -1, '1', '{"Assault", "Pistol", "Twin-Linked"}'),
  ('735b3461-19a7-7556-9f64-a8f4ee9adb03', 'Scorpion''s claw', 'melee', NULL, '3', '3+', 8, -2, '2', '{}'),
  ('735b3461-19a7-7556-9f64-a8f4ee9adb03', 'Biting blade', 'melee', NULL, '4', '3+', 6, -3, '1', '{"Sustained Hits 1"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('735b3461-19a7-7556-9f64-a8f4ee9adb03', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save.'),
  ('735b3461-19a7-7556-9f64-a8f4ee9adb03', 'Mandiblasters', 'unique', 'Each time a model in this unit makes a melee attack, if it made a Charge move this turn, an unmodified Hit roll of 5+ scores a Critical Hit.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('d58f0d42-6d62-8cb4-879f-f5d7ac304187', '735b3461-19a7-7556-9f64-a8f4ee9adb03', 'Striking Scorpion', 4, 9, 4, false, 0, '4-9 Striking Scorpions'),
  ('a5bf6fd3-3bee-68e4-8ea0-89492ef5e900', '735b3461-19a7-7556-9f64-a8f4ee9adb03', 'Striking Scorpion Exarch', 1, 1, 1, true, 1, 'Striking Scorpion Exarch')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('fed8442b-fac9-9ac6-0d11-ca34331b069e', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'D-Cannon Platform', 'infantry', '7"', 6, '4+', 5, 7, 1, '{"Support Weapon", "Infantry", "Aeldari", "D-Cannon Platform", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('fed8442b-fac9-9ac6-0d11-ca34331b069e', 1, 125);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('fed8442b-fac9-9ac6-0d11-ca34331b069e', 'D-cannon', 'ranged', '24"', 'D3', '3+', 16, -4, 'D6+2', '{"Blast", "Devastating Wounds", "Indirect Fire"}'),
  ('fed8442b-fac9-9ac6-0d11-ca34331b069e', 'Close Combat Weapon', 'melee', NULL, '2', '3+', 3, 0, '1', '{}'),
  ('fed8442b-fac9-9ac6-0d11-ca34331b069e', 'Shuriken Catapult', 'ranged', '18"', '2', '3+', 4, -1, '1', '{"Assault"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('fed8442b-fac9-9ac6-0d11-ca34331b069e', 'Structural Collapse', 'unique', 'Each time this model makes an attack with its D-Cannon, re-roll a Damage roll of 1. If that attack targets a Titanic unit, you can re-roll the Damage roll instead.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('79721c16-fc1d-13e3-57c3-08b60c181664', 'fed8442b-fac9-9ac6-0d11-ca34331b069e', 'Wargear', 'D-cannon', true, 0, NULL, NULL, NULL),
  ('d255c0c7-62ee-80f1-a787-b117184ad0a7', 'fed8442b-fac9-9ac6-0d11-ca34331b069e', 'Wargear', 'Close Combat Weapon', false, 0, NULL, NULL, NULL),
  ('ce10ecd1-a59d-164f-535d-f5e7cf3aaf6c', 'fed8442b-fac9-9ac6-0d11-ca34331b069e', 'Wargear', 'Shuriken Catapult', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('db14a145-7f7b-fb5c-7704-98a26e1d369d', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Swooping Hawks', 'infantry', '14"', 3, '4+', 1, 6, 1, '{"Swooping Hawks", "Infantry", "Fly", "Aeldari", "Jump Pack", "Aspect Warrior", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('db14a145-7f7b-fb5c-7704-98a26e1d369d', 4, 95);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('db14a145-7f7b-fb5c-7704-98a26e1d369d', 'Lasblaster', 'ranged', '24"', '4', '3+', 4, 0, '1', '{"Assault", "Lethal Hits"}'),
  ('db14a145-7f7b-fb5c-7704-98a26e1d369d', 'Close Combat Weapon', 'melee', NULL, '2', '3+', 3, 0, '1', '{}'),
  ('db14a145-7f7b-fb5c-7704-98a26e1d369d', 'Exarch''s Lasblaster', 'ranged', '24"', '4', '3+', 5, -1, '1', '{"Assault", "Lethal Hits"}'),
  ('db14a145-7f7b-fb5c-7704-98a26e1d369d', 'Hawk''s Talon', 'ranged', '24"', '2', '3+', 6, -2, '2', '{"Lethal Hits"}'),
  ('db14a145-7f7b-fb5c-7704-98a26e1d369d', 'Scatter Laser', 'ranged', '36"', '6', '3+', 5, 0, '1', '{"Sustained Hits 1"}'),
  ('db14a145-7f7b-fb5c-7704-98a26e1d369d', 'Power Sword', 'melee', NULL, '5', '3+', 4, -2, '1', '{}'),
  ('db14a145-7f7b-fb5c-7704-98a26e1d369d', 'Sunpistol', 'ranged', '12"', '2', '3+', 4, 0, '1', '{"Assault", "Lethal Hits", "Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('db14a145-7f7b-fb5c-7704-98a26e1d369d', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save'),
  ('db14a145-7f7b-fb5c-7704-98a26e1d369d', 'Grenade Pack Flyover', 'unique', 'Once per turn, in your Movement phase, when this unit is set-up on the battlefield or ends a Normal, Advance or Fall Back move, it can use this ability. If it does, select one enemy unit within 8" of and visible to this unit and roll one D6 for each ^^Swooping Hawks^^ model in this unit. For each 4+, that enemy unit suffers 1 mortal wound (to a maximum of 6 mortal wounds). Each time this unit uses this ability , until the end of the turn, you cannot target this unit with the Grenades Stratagem.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('c297ae96-4b1a-62e6-203f-aa2215eb47e2', 'db14a145-7f7b-fb5c-7704-98a26e1d369d', 'Swooping Hawk', 4, 9, 4, false, 0, '4-9 Swooping Hawks'),
  ('e28fdde8-6e05-e214-cd26-2eabe04727b3', 'db14a145-7f7b-fb5c-7704-98a26e1d369d', 'Swooping Hawk Exarch', 1, 1, 1, true, 1, 'Swooping Hawk Exarch')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'The Visarch', 'epic_hero', '8"', 3, '2+', 5, 6, 1, '{"The Visarch", "Infantry", "Epic Hero", "Character", "Aeldari"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', 1, 90);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', '➤ Asu-var - quicksilver stance', 'melee', NULL, '8', '2+', 4, -1, '1', '{"Sustained Hits 2"}'),
  ('dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', '➤ Asu-var - duellist stance', 'melee', NULL, '6', '2+', 5, -2, '2', '{"Devastating Wounds", "Precision"}'),
  ('dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', '➤ Asu-var - mythic stance', 'melee', NULL, '4', '2+', 3, -4, '3', '{"Anti-Epic Hero 2+", "Precision"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', 'Invulnerable Save (The Visarch)', 'invulnerable', 'This unit has a 4+ Invulnerable save'),
  ('dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', 'Way of the Blade', 'unique', 'While this model is leading a unit, models in that unit have the Fights First ability.'),
  ('dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', 'Yvraine''s Champion', 'unique', 'While this model is leading a unit, other Character models attached to that unit have the Feel No Pain 4+ ability.'),
  ('dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', 'Leader', 'core', 'This model can be attached to the following units:
■ Corsair Voidreavers
■ Corsair Voidscarred
■ Guardian Defenders
■ Storm Guardians
■ Ynnari Incubi
■ Ynnari Kabalite Warriors
■ Ynnari Wyches

You can attach this unit to one of the above units, even if Yvraine has already been attached to it. If you do, and that Bodyguard unit is destroyed, the Leader units attached to it become separate units, with their original Starting Strengths.'),
  ('dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', 'Servant of the Whispering God', 'unique', 'If your army includes The Visarch, it cannot include any Epic Hero units (excluding Ynnari units). If your army includes any Epic Hero units (excluding Ynnari units), it cannot include The Visarch.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('e74431aa-05bd-7612-fa51-db9ff5c4f819', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'The Yncarne', 'epic_hero', '10"', 10, '2+', 12, 6, 3, '{"The Yncarne", "Epic Hero", "Monster", "Character", "Fly", "Psyker", "Daemon", "Aeldari"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('e74431aa-05bd-7612-fa51-db9ff5c4f819', 1, 260);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('e74431aa-05bd-7612-fa51-db9ff5c4f819', '➤ Vilith-zhar - Strike', 'melee', NULL, '5', '2+', 12, -4, 'D6+1', '{}'),
  ('e74431aa-05bd-7612-fa51-db9ff5c4f819', '➤ Vilith-zhar - Sweep', 'melee', NULL, '10', '2+', 6, -4, '1', '{}'),
  ('e74431aa-05bd-7612-fa51-db9ff5c4f819', 'Swirling soul energy', 'ranged', '12"', 'D6+3', 'N/A', 7, -1, 'D3', '{"Ignores Cover", "Psychic", "Torrent"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('e74431aa-05bd-7612-fa51-db9ff5c4f819', 'Invulnerable Save', 'invulnerable', 'This unit has a 4+ Invulnerable save'),
  ('e74431aa-05bd-7612-fa51-db9ff5c4f819', 'Inevitable Death', 'unique', 'Once in each of your opponent''s turns, if this model is on the battlefield when another friendly Aeldari unit is destroyed, just after removing the last model in that unit, you can remove this model from the battlefield and set it up as close as possible to where that destroyed model was destroyed and not within Engagement Range of one or more enemy units.'),
  ('e74431aa-05bd-7612-fa51-db9ff5c4f819', 'Ethereal Form', 'unique', 'Each time this model destroys an enemy unit it regains up to D3 lost wounds.'),
  ('e74431aa-05bd-7612-fa51-db9ff5c4f819', 'Avatar of the Whispering God', 'unique', 'If your army includes The Yncarne, it cannot include any Epic Hero units (excluding Ynnari units). If your army includes any Epic Hero units (excluding Ynnari units), it cannot include The Yncarne.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('f74d99ad-cdcb-032b-4d10-214799b5570f', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Troupe Master', 'character', '8"', 3, '6+', 4, 6, 1, '{"Troupe Master", "Infantry", "Character", "Harlequin Allies", "Aeldari", "Corsairs and Travelling Players"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('f74d99ad-cdcb-032b-4d10-214799b5570f', 1, 75);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('f74d99ad-cdcb-032b-4d10-214799b5570f', 'Harlequin''s Special Weapon', 'melee', NULL, '6', '2+', 4, -1, '2', '{"Devastating Wounds"}'),
  ('f74d99ad-cdcb-032b-4d10-214799b5570f', 'Troupe Master''s Blade', 'melee', NULL, '5', '2+', 5, -2, '2', '{"Devastating Wounds"}'),
  ('f74d99ad-cdcb-032b-4d10-214799b5570f', 'Shuriken Pistol', 'ranged', '12"', '1', '2+', 4, -1, '1', '{"Assault", "Pistol"}'),
  ('f74d99ad-cdcb-032b-4d10-214799b5570f', 'Fusion Pistol', 'ranged', '6"', '1', '2+', 8, -4, 'D6', '{"Assault", "Melta 2", "Pistol"}'),
  ('f74d99ad-cdcb-032b-4d10-214799b5570f', 'Neuro Disruptor', 'ranged', '12"', '1', '2+', 4, -2, '1', '{"Anti-infantry 2+", "Assault", "Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('f74d99ad-cdcb-032b-4d10-214799b5570f', 'Invulnerable Save', 'invulnerable', 'This unit has a 4+ Invulnerable save'),
  ('f74d99ad-cdcb-032b-4d10-214799b5570f', 'Leader', 'core', 'This model can be attached to the following unit:
■ Troupe'),
  ('f74d99ad-cdcb-032b-4d10-214799b5570f', 'Choreographer of War', 'unique', 'While this model is leading a unit, each time a model in that unit makes a Pile In or Consolidate move, it can move up to 6" instead of 3". In addition, it does not need to end that move closer to the closest enemy model, provided it ends as close as possible to the closest enemy unit.'),
  ('f74d99ad-cdcb-032b-4d10-214799b5570f', 'Cegorach’s Favour:', 'unique', 'Each time this model makes a melee attack you can re-roll a Hit roll of 1 and add 1 to the Wound roll.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('52875c1d-4a9b-4be4-3f98-ad4e4b61689a', 'f74d99ad-cdcb-032b-4d10-214799b5570f', 'Melee Weapon', 'Harlequin''s Special Weapon', true, 0, NULL, 'Melee Weapon', 1),
  ('f4807321-8eb3-b0af-d897-e3eeac73ad8e', 'f74d99ad-cdcb-032b-4d10-214799b5570f', 'Melee Weapon', 'Troupe Master''s Blade', false, 0, NULL, 'Melee Weapon', 1),
  ('34e97dff-bdc9-d68a-0e5d-8ca7d4beaf20', 'f74d99ad-cdcb-032b-4d10-214799b5570f', 'Pistol', 'Shuriken Pistol', true, 0, NULL, 'Pistol', 1),
  ('1a3e5762-a888-9cb1-b752-de8a84e6b75b', 'f74d99ad-cdcb-032b-4d10-214799b5570f', 'Pistol', 'Fusion Pistol', false, 0, NULL, 'Pistol', 1),
  ('e4b43cb2-8bcd-af7d-2a52-baaddf4edae4', 'f74d99ad-cdcb-032b-4d10-214799b5570f', 'Pistol', 'Neuro Disruptor', false, 0, NULL, 'Pistol', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('f2be48cf-1cea-a9b8-ef4b-078ad213397e', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Voidweaver', 'vehicle', '14"', 6, '4+', 6, 6, 2, '{"Voidweaver", "Fly", "Vehicle", "Harlequin Allies", "Aeldari", "Corsairs and Travelling Players"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('f2be48cf-1cea-a9b8-ef4b-078ad213397e', 1, 125);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('f2be48cf-1cea-a9b8-ef4b-078ad213397e', 'Close Combat Weapon', 'melee', NULL, '4', '3+', 3, 0, '1', '{}'),
  ('f2be48cf-1cea-a9b8-ef4b-078ad213397e', '➤ Prismatic Cannon - dispersed pulse', 'ranged', '24"', '2D6', '3+', 4, 0, '1', '{"Blast"}'),
  ('f2be48cf-1cea-a9b8-ef4b-078ad213397e', '➤ Prismatic Cannon - focused lances', 'ranged', '24"', '2', '3+', 12, -3, '4', '{}'),
  ('f2be48cf-1cea-a9b8-ef4b-078ad213397e', 'Voidweaver Haywire Cannon', 'ranged', '24"', '3', '3+', 4, -1, '3', '{"Anti-vehicle 4+", "Devastating Wounds"}'),
  ('f2be48cf-1cea-a9b8-ef4b-078ad213397e', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Lethal Hits"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('f2be48cf-1cea-a9b8-ef4b-078ad213397e', 'Invulnerable Save', 'invulnerable', 'This unit has a 4+ Invulnerable save'),
  ('f2be48cf-1cea-a9b8-ef4b-078ad213397e', 'Polychromatic Camoflage', 'unique', 'This unit can only be selected as the target of a ranged attack if the attacking model is within 18".');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('a12919ff-362e-7fb1-1ca5-df137fa7df96', 'f2be48cf-1cea-a9b8-ef4b-078ad213397e', 'Wargear', 'Close Combat Weapon', true, 0, NULL, NULL, NULL),
  ('ef590316-dea3-63ca-9423-5673f6e54503', 'f2be48cf-1cea-a9b8-ef4b-078ad213397e', 'Wargear', 'Shuriken Cannon', false, 0, NULL, NULL, NULL),
  ('8da2aa26-882b-f7ae-03b5-30e6b27af65e', 'f2be48cf-1cea-a9b8-ef4b-078ad213397e', 'Weapon', 'Prismatic Cannon', true, 0, NULL, 'Weapon', 1),
  ('122b05ce-6732-850f-d98f-3fed066436ed', 'f2be48cf-1cea-a9b8-ef4b-078ad213397e', 'Weapon', 'Voidweaver Haywire Cannon', false, 0, NULL, 'Weapon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('073276ad-5d3c-e24c-938e-3e098b40fcaf', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Warlock', 'character', '7"', 3, '6+', 2, 6, 1, '{"Character", "Infantry", "Psyker", "Warlock", "Aeldari", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('073276ad-5d3c-e24c-938e-3e098b40fcaf', 1, 45);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('073276ad-5d3c-e24c-938e-3e098b40fcaf', 'Witchblade', 'melee', NULL, '2', '3+', 3, 0, '2', '{"Anti-Infantry 2+", "Psychic"}'),
  ('073276ad-5d3c-e24c-938e-3e098b40fcaf', 'Singing Spear', 'ranged', '12"', '1', '3+', 9, 0, '3', '{"Assault", "Psychic"}'),
  ('073276ad-5d3c-e24c-938e-3e098b40fcaf', 'Singing Spear', 'melee', NULL, '2', '3+', 3, 0, '3', '{"Psychic"}'),
  ('073276ad-5d3c-e24c-938e-3e098b40fcaf', 'Destructor', 'ranged', '12"', 'D6', 'N/A', 5, -1, '1', '{"Psychic", "Torrent"}'),
  ('073276ad-5d3c-e24c-938e-3e098b40fcaf', 'Shuriken Pistol', 'ranged', '12"', '1', '3+', 4, -1, '1', '{"Assault", "Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('073276ad-5d3c-e24c-938e-3e098b40fcaf', 'Leader', 'core', 'This model can be attached to the following units:
■ Guardian Defenders
■ Storm Guardians
You can attach this model to a unit, even  if one ^^Autarch^^ or ^^Farseer^^ model has already been attached to it. If you do, and that Bodyguard unit is destroyed, the Leader units attached to it become separate units, with their original Starting Strengths.'),
  ('073276ad-5d3c-e24c-938e-3e098b40fcaf', 'Invulnerable Save (Warlock)', 'invulnerable', 'A Warlock has a 4+ Invulnerable save'),
  ('073276ad-5d3c-e24c-938e-3e098b40fcaf', 'Runes of Fortune (Psychic)', 'unique', 'Each time an enemy unit declares a charge, if one or more units with this ability are selected as a target of that charge, subtract 2 from the Charge roll.'),
  ('073276ad-5d3c-e24c-938e-3e098b40fcaf', 'Psychic Communion (Psychic)', 'unique', 'Each time this model is selected to shoot, until the end of the phase, add 1 to the Attacks and Strength characteristics of its Destructor weapon for each other friendly ^^Aeldari Psyker ^^ model within 6" of this model (to a maximum of +2).');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('6b37c150-b7c2-c8ab-e170-af3d057b1c5d', '073276ad-5d3c-e24c-938e-3e098b40fcaf', 'Wargear', 'Destructor', true, 0, NULL, NULL, NULL),
  ('c212209e-de38-89cf-63f7-3e5b60d0a9d8', '073276ad-5d3c-e24c-938e-3e098b40fcaf', 'Wargear', 'Shuriken Pistol', false, 0, NULL, NULL, NULL),
  ('3bfb7d99-a849-7d15-5d68-68a4a58ab33c', '073276ad-5d3c-e24c-938e-3e098b40fcaf', 'Weapon', 'Witchblade', true, 0, NULL, 'Weapon', 1),
  ('810f947e-5dda-71c6-b662-28b06200b4ce', '073276ad-5d3c-e24c-938e-3e098b40fcaf', 'Weapon', 'Singing Spear', false, 0, NULL, 'Weapon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('aac3f772-776b-4c45-ccd4-c5eca811c186', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Warlock Conclave', 'infantry', '7"', 3, '6+', 2, 6, 1, '{"Warlock Conclave", "Psyker", "Infantry", "Aeldari", "Warlock", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('aac3f772-776b-4c45-ccd4-c5eca811c186', 2, 55);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('aac3f772-776b-4c45-ccd4-c5eca811c186', 'Witchblade', 'melee', NULL, '2', '3+', 3, 0, '2', '{"Anti-Infantry 2+", "Psychic"}'),
  ('aac3f772-776b-4c45-ccd4-c5eca811c186', 'Shuriken Pistol', 'ranged', '12"', '1', '3+', 4, -1, '1', '{"Assault", "Pistol"}'),
  ('aac3f772-776b-4c45-ccd4-c5eca811c186', 'Destructor', 'ranged', '12"', 'D6', 'N/A', 5, -1, '1', '{"Psychic", "Torrent"}'),
  ('aac3f772-776b-4c45-ccd4-c5eca811c186', 'Singing Spear', 'ranged', '12"', '1', '3+', 9, 0, '3', '{"Assault", "Psychic"}'),
  ('aac3f772-776b-4c45-ccd4-c5eca811c186', 'Singing Spear', 'melee', NULL, '2', '3+', 3, 0, '3', '{"Psychic"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('aac3f772-776b-4c45-ccd4-c5eca811c186', 'Invulnerable Save', 'invulnerable', 'This unit has a 4+ Invulnerable save'),
  ('aac3f772-776b-4c45-ccd4-c5eca811c186', 'Protect (Psychic)', 'unique', 'While a ^^Farseer^^ model is leading this unit, each time an attack targets this unit, subtract 1 from the Wound roll.'),
  ('aac3f772-776b-4c45-ccd4-c5eca811c186', 'Psychic Communion (Psychic)', 'unique', 'Each time this unit is selected to shoot, for each ^^Warlock^^ model in this unit, until the end of the phase, add 1 to the Attacks and Strength characteristics of that model''s Destructor weapon for each other friendly ^^Aeldari Psyker^^ model within 6" of this model (to a maximum of +2).'),
  ('aac3f772-776b-4c45-ccd4-c5eca811c186', 'Leader', 'core', 'At the start of the Declare Battle Formations step, if this unit is not an Attached unit, this unit can join one ^^Guardian Defenders^^ or ^^Storm Guardians^^ unit from your army (a unit cannot have more than one ^^Warlock Conclave^^ unit joined to it). If it does, until the end of the battle, every model in this unit counts as being part of that Bodyguard unit, and that Bodyguard unit’s Starting Strength is increased accordingly.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('11a72fc9-972f-16a3-093c-08b543a2c7ae', 'aac3f772-776b-4c45-ccd4-c5eca811c186', 'Warlock with Witchblade', 0, 10, 0, false, 0, '2-4 Warlocks'),
  ('1eda5e1f-3c70-6409-926f-1270ee3daf79', 'aac3f772-776b-4c45-ccd4-c5eca811c186', 'Warlock with Singing Spear', 0, 10, 0, false, 1, '2-4 Warlocks')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('4a9dbe6f-1226-c40d-400b-40d9766e9ece', 'aac3f772-776b-4c45-ccd4-c5eca811c186', '2-4 Warlocks', 'Warlock with Witchblade', true, 0, NULL, NULL, NULL),
  ('4b89fa6c-a652-c56b-d326-7d3d3c1d8b26', 'aac3f772-776b-4c45-ccd4-c5eca811c186', '2-4 Warlocks', 'Warlock with Singing Spear', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('b827b3b8-6a7d-9953-27fa-c1cc0cb4c90c', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Warp Spiders', 'infantry', '12"', 3, '3+', 1, 6, 1, '{"Warp Spiders", "Infantry", "Fly", "Jump Pack", "Aeldari", "Aspect Warrior", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('b827b3b8-6a7d-9953-27fa-c1cc0cb4c90c', 4, 105);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('b827b3b8-6a7d-9953-27fa-c1cc0cb4c90c', 'Death spinner', 'ranged', '12"', 'D6', 'N/A', 4, -1, '1', '{"Ignores Cover", "Torrent"}'),
  ('b827b3b8-6a7d-9953-27fa-c1cc0cb4c90c', 'Close Combat Weapon', 'melee', NULL, '2', '3+', 3, 0, '1', '{}'),
  ('b827b3b8-6a7d-9953-27fa-c1cc0cb4c90c', 'Exarch''s Deathspinner', 'ranged', '12"', 'D6', 'N/A', 6, -2, '1', '{"Ignores Cover", "Torrent"}'),
  ('b827b3b8-6a7d-9953-27fa-c1cc0cb4c90c', 'Death Weavers', 'ranged', '6"', 'D6', 'N/A', 4, -1, '1', '{"Ignores Cover", "Torrent", "Twin-Linked"}'),
  ('b827b3b8-6a7d-9953-27fa-c1cc0cb4c90c', 'Spinneret Rifle', 'ranged', '18"', 'D6', 'N/A', 5, -1, '1', '{"Ignores Cover", "Torrent"}'),
  ('b827b3b8-6a7d-9953-27fa-c1cc0cb4c90c', 'Powerblades', 'melee', NULL, '5', '3+', 4, -2, '1', '{"Lethal Hits", "Twin-Linked"}'),
  ('b827b3b8-6a7d-9953-27fa-c1cc0cb4c90c', 'Powerblade Array', 'melee', NULL, '10', '3+', 4, -2, '1', '{"Lethal Hits", "Twin-Linked"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('b827b3b8-6a7d-9953-27fa-c1cc0cb4c90c', 'Flickerjump', 'unique', 'In your Movement phase, each time this unit is selected to make a Normal move, it can use this ability. If it does, until the end of the turn, this unit is not eligible to declare a charge and models in it have a Move characteristic of 24". Each time this unit uses this ability, at the end of the phase, roll one D6 for each model in this unit: for each 1, this unit suffers 1 mortal wound.'),
  ('b827b3b8-6a7d-9953-27fa-c1cc0cb4c90c', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('2044b6b0-276d-afc8-81a2-428e14ee5307', 'b827b3b8-6a7d-9953-27fa-c1cc0cb4c90c', 'Warp Spider', 4, 9, 4, false, 0, '4-9 Warp Spiders'),
  ('219ead4e-4bca-0fb1-fc65-1177e4a268a6', 'b827b3b8-6a7d-9953-27fa-c1cc0cb4c90c', 'Warp Spider Exarch', 1, 1, 1, true, 1, 'Warp Spider Exarch')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('eeeadaa7-b907-5d78-a251-6540848045fd', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Wave Serpent', 'dedicated_transport', '14"', 9, '3+', 13, 7, 2, '{"Wave Serpent", "Fly", "Dedicated Transport", "Vehicle", "Transport", "Aeldari", "Ynnari"}', 6, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('eeeadaa7-b907-5d78-a251-6540848045fd', 1, 125);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('eeeadaa7-b907-5d78-a251-6540848045fd', 'Wraithbone Hull', 'melee', NULL, '3', '4+', 6, 0, '1', '{}'),
  ('eeeadaa7-b907-5d78-a251-6540848045fd', 'Twin Shuriken Catapult', 'ranged', '18"', '2', '3+', 4, -1, '1', '{"Assault", "Twin Linked"}'),
  ('eeeadaa7-b907-5d78-a251-6540848045fd', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Lethal Hits"}'),
  ('eeeadaa7-b907-5d78-a251-6540848045fd', '➤ Twin Aeldari Missile Launcher - Starshot', 'ranged', '48"', '1', '3+', 10, -2, 'D6', '{"Twin-Linked"}'),
  ('eeeadaa7-b907-5d78-a251-6540848045fd', '➤ Twin Aeldari Missile Launcher - Sunburst', 'ranged', '48"', 'D6', '3+', 4, -1, '1', '{"Blast", "Twin-Linked"}'),
  ('eeeadaa7-b907-5d78-a251-6540848045fd', 'Twin Bright Lance', 'ranged', '36"', '1', '3+', 12, -3, 'D6+2', '{"Twin-Linked"}'),
  ('eeeadaa7-b907-5d78-a251-6540848045fd', 'Twin Scatter Laser', 'ranged', '36"', '6', '3+', 5, 0, '1', '{"Sustained Hits 1", "Twin-Linked"}'),
  ('eeeadaa7-b907-5d78-a251-6540848045fd', 'Twin Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Lethal Hits", "Twin-Linked"}'),
  ('eeeadaa7-b907-5d78-a251-6540848045fd', 'Twin Starcannon', 'ranged', '36"', '2', '3+', 8, -3, '2', '{"Twin-Linked"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('eeeadaa7-b907-5d78-a251-6540848045fd', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save'),
  ('eeeadaa7-b907-5d78-a251-6540848045fd', 'Wave Serpent Shield', 'unique', 'Each time a ranged attack targets this model, if the Strength characteristic of that attack is greater than the Toughness characteristic of this model, subtract 1 from the Wound roll.'),
  ('eeeadaa7-b907-5d78-a251-6540848045fd', 'Damaged: 1-4 Wounds Remaining', 'unique', 'While this model has 1-4 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('924b9a19-5f1c-8454-0fa3-e9f3efaab07a', 'eeeadaa7-b907-5d78-a251-6540848045fd', 'Wargear', 'Wraithbone Hull', true, 0, NULL, NULL, NULL),
  ('8b907318-dd4e-c302-3539-e8016152177e', 'eeeadaa7-b907-5d78-a251-6540848045fd', 'Hull weapon', 'Twin Shuriken Catapult', true, 0, NULL, 'Hull weapon', 1),
  ('83cdbc10-e2df-87ab-696b-795c23edd9db', 'eeeadaa7-b907-5d78-a251-6540848045fd', 'Hull weapon', 'Shuriken Cannon', false, 0, NULL, 'Hull weapon', 1),
  ('ce3308b5-b6b9-c538-a7fd-3fc0a1f5c986', 'eeeadaa7-b907-5d78-a251-6540848045fd', 'Turret Weapon', 'Twin Aeldari Missile Launcher', true, 0, NULL, 'Turret Weapon', 1),
  ('ff5c446c-56f0-1240-0d8b-0851eb6fcff2', 'eeeadaa7-b907-5d78-a251-6540848045fd', 'Turret Weapon', 'Twin Bright Lance', false, 0, NULL, 'Turret Weapon', 1),
  ('7c22af0b-9789-aca3-0bcb-e4d3c7a2ad39', 'eeeadaa7-b907-5d78-a251-6540848045fd', 'Turret Weapon', 'Twin Scatter Laser', false, 0, NULL, 'Turret Weapon', 1),
  ('3aadaa5a-9671-fc3a-ff06-9c9d9f82bdc2', 'eeeadaa7-b907-5d78-a251-6540848045fd', 'Turret Weapon', 'Twin Shuriken Cannon', false, 0, NULL, 'Turret Weapon', 1),
  ('312decfd-24ba-66c1-0c9d-4b5dbe07acc5', 'eeeadaa7-b907-5d78-a251-6540848045fd', 'Turret Weapon', 'Twin Starcannon', false, 0, NULL, 'Turret Weapon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('2e35105b-ec09-1ecb-5598-b074c101b2a3', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Webway Gate', 'fortification', '-', 12, '3+', 14, 6, 1, '{"Webway Gate", "Fortification", "Aeldari"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('2e35105b-ec09-1ecb-5598-b074c101b2a3', 1, 105);

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('2e35105b-ec09-1ecb-5598-b074c101b2a3', 'Arcane Cover', 'unique', 'Each time a ranged attack is allocated to a model, if that model is not fully visible to every model in the attacking unit because of this Fortification, that model has the Benefit of Cover against that attack.'),
  ('2e35105b-ec09-1ecb-5598-b074c101b2a3', 'Webway Strike', 'unique', 'Each time a friendly AELDARI unit arrives from Strategic Reserves, you can choose to set it up anywhere on the battlefield that is wholly within 6" of this FORTIFICATION. If you do, that AELDARI unit can be set up within 9" of enemy models, and can be set up within Engagement Range of enemy models. If an AELDARI unit is set up within Engagement Range of any enemy models in this way, it counts as having made a Charge move this turn and is eligible to fight this turn.'),
  ('2e35105b-ec09-1ecb-5598-b074c101b2a3', 'Deployment', 'unique', 'Both Wraithbone Arches of this Fortification must be set up with their upper points no more than 1" apart and with both statues facing in fully opposite directions so that an arch is formed, as shown on the right. Both arches are then treated as a single model for all rules purposes.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('9de865aa-f34e-6df6-9b59-05146f5e485b', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Wraithknight', 'monster', '12"', 12, '2+', 18, 6, 10, '{"Wraithknight", "Wraith Construct", "Monster", "Titanic", "Towering", "Walker", "Aeldari", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('9de865aa-f34e-6df6-9b59-05146f5e485b', 1, 435);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('9de865aa-f34e-6df6-9b59-05146f5e485b', 'Titanic Feet', 'melee', NULL, '5', '3+', 8, -1, '2', '{}'),
  ('9de865aa-f34e-6df6-9b59-05146f5e485b', 'Heavy Wraithcannon', 'ranged', '36"', 'D3', '3+', 20, -4, '2D6', '{"Devastating Wounds"}'),
  ('9de865aa-f34e-6df6-9b59-05146f5e485b', 'Suncannon', 'ranged', '48"', 'D6+4', '3+', 10, -3, '3', '{"Blast"}'),
  ('9de865aa-f34e-6df6-9b59-05146f5e485b', 'Scatter Laser', 'ranged', '36"', '6', '3+', 5, 0, '1', '{"Sustained Hits 1"}'),
  ('9de865aa-f34e-6df6-9b59-05146f5e485b', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Lethal Hits"}'),
  ('9de865aa-f34e-6df6-9b59-05146f5e485b', 'Starcannon', 'ranged', '36"', '2', '3+', 8, -3, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('9de865aa-f34e-6df6-9b59-05146f5e485b', 'Damaged: 1-6 Wounds Remaining', 'unique', 'While this model has 1-6 wounds remaining, subtract 5 from this model’s Objective Control characteristic and each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('9de865aa-f34e-6df6-9b59-05146f5e485b', 'Titanic Strides', 'unique', 'Each time this model makes a Normal, Advance or Fall Back move, it can move through models (excluding Titanic models) and sections of terrain features that are 4" or less in height. When doing so:
It can move within Engagement Range of enemy models, but cannot end that move within Engagement Range of them.
It can also move through sections of terrain features that are more than 4" in height, but if it does, after it has moved, roll one D6: on a 1, this model is battle-shocked.'),
  ('9de865aa-f34e-6df6-9b59-05146f5e485b', 'Point-blank Devastation', 'unique', 'Each time this model''s Heavy Wraithcannon or Suncannon targets a unit within half range, you can re-roll the dice to determine the number of attacks made.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('877f308a-2f67-3d96-41f3-f82654fc641b', '9de865aa-f34e-6df6-9b59-05146f5e485b', 'Wargear', 'Titanic feet', true, 0, NULL, NULL, NULL),
  ('4df8c9d6-4496-2218-fe81-f85ec9e269e7', '9de865aa-f34e-6df6-9b59-05146f5e485b', 'Left Arm', 'Scattershield', true, 0, NULL, 'Left Arm', 1),
  ('f9256a80-17fa-f92c-57ea-45d351b580fe', '9de865aa-f34e-6df6-9b59-05146f5e485b', 'Left Arm', 'Heavy Wraithcannon', false, 0, NULL, 'Left Arm', 1),
  ('69fa0c36-723f-c6e5-e37f-bb4a21205b49', '9de865aa-f34e-6df6-9b59-05146f5e485b', 'Right Arm', 'Suncannon', true, 0, NULL, 'Right Arm', 1),
  ('efb3eaee-8898-a9ed-2fff-f3cbf2a80d10', '9de865aa-f34e-6df6-9b59-05146f5e485b', 'Right Arm', 'Heavy Wraithcannon', false, 0, NULL, 'Right Arm', 1),
  ('aec16331-7388-1a4e-fc92-b98ffb86df4f', '9de865aa-f34e-6df6-9b59-05146f5e485b', 'Secondary Weapons', 'Scatter Laser', true, 0, NULL, 'Secondary Weapons', 2),
  ('6ed9951e-1bab-11d7-2a51-a9be65ab8578', '9de865aa-f34e-6df6-9b59-05146f5e485b', 'Secondary Weapons', 'Shuriken Cannon', false, 0, NULL, 'Secondary Weapons', 2),
  ('4fe2d269-88e3-a321-95cc-06b87781c174', '9de865aa-f34e-6df6-9b59-05146f5e485b', 'Secondary Weapons', 'Starcannon', false, 0, NULL, 'Secondary Weapons', 2)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('1024a069-ec6f-ee70-fdff-16909cd167b0', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Wraithlord', 'monster', '8"', 10, '2+', 10, 8, 3, '{"Wraithlord", "Wraith Construct", "Monster", "Walker", "Aeldari", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('1024a069-ec6f-ee70-fdff-16909cd167b0', 1, 140);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('1024a069-ec6f-ee70-fdff-16909cd167b0', '➤ Ghostglaive - Strike', 'melee', NULL, '4', '4+', 10, -3, 'D6+1', '{}'),
  ('1024a069-ec6f-ee70-fdff-16909cd167b0', '➤ Ghostglaive - Sweep', 'melee', NULL, '8', '4+', 7, -2, '2', '{}'),
  ('1024a069-ec6f-ee70-fdff-16909cd167b0', 'Wraithbone Fists', 'melee', NULL, '4', '4+', 7, -2, '2', '{}'),
  ('1024a069-ec6f-ee70-fdff-16909cd167b0', 'Shuriken Catapult', 'ranged', '18"', '2', '4+', 4, -1, '1', '{"Assault"}'),
  ('1024a069-ec6f-ee70-fdff-16909cd167b0', 'Flamer', 'ranged', '12"', 'D6', 'N/A', 4, 0, '1', '{"Assault", "Ignores cover", "Torrent"}'),
  ('1024a069-ec6f-ee70-fdff-16909cd167b0', '➤ Aeldari Missile Launcher - Starshot', 'ranged', '48"', '1', '4+', 10, -2, 'D6', '{}'),
  ('1024a069-ec6f-ee70-fdff-16909cd167b0', '➤ Aeldari Missile Launcher - Sunburst', 'ranged', '48"', 'D6', '4+', 4, -1, '1', '{"Blast"}'),
  ('1024a069-ec6f-ee70-fdff-16909cd167b0', 'Bright Lance', 'ranged', '36"', '1', '4+', 12, -3, 'D6+2', '{}'),
  ('1024a069-ec6f-ee70-fdff-16909cd167b0', 'Scatter Laser', 'ranged', '36"', '6', '4+', 5, 0, '1', '{"Sustained Hits 1"}'),
  ('1024a069-ec6f-ee70-fdff-16909cd167b0', 'Shuriken Cannon', 'ranged', '24"', '3', '4+', 6, -1, '2', '{"Lethal Hits"}'),
  ('1024a069-ec6f-ee70-fdff-16909cd167b0', 'Starcannon', 'ranged', '36"', '2', '4+', 8, -3, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('1024a069-ec6f-ee70-fdff-16909cd167b0', 'Fated Hero', 'unique', 'At the start of the battle, select one of the following keywords: Infantry, Monster, Mounted, Vehicle. Each time this model makes an attack that targets a unit with the selected keyword, re-roll a Hit roll of 1 and re-roll a Wound roll of 1.'),
  ('1024a069-ec6f-ee70-fdff-16909cd167b0', 'Psychic Guidance', 'unique', 'While this model is within 12" of one or more friendly Aeldari Psyker models, improve the Ballistic Skill and Weapon Skill characteristics of weapons equipped by this model by 1 and it has a Leadership characteristic of 6+.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('90732a8a-67cb-5c4a-4c7e-23de9b60cf7f', '1024a069-ec6f-ee70-fdff-16909cd167b0', 'Wargear', 'Ghostglaive', true, 0, NULL, NULL, NULL),
  ('41b94d5c-a431-bf79-757d-200cedb98f12', '1024a069-ec6f-ee70-fdff-16909cd167b0', 'Wargear', 'Wraithbone Fists', false, 0, NULL, NULL, NULL),
  ('f38e64b2-4f57-6861-6aaf-981f4a0c52b1', '1024a069-ec6f-ee70-fdff-16909cd167b0', 'Arm Weapons', 'Shuriken Catapult', true, 0, NULL, 'Arm Weapons', 2),
  ('0a004220-cac5-3971-9ddd-5804c6726f66', '1024a069-ec6f-ee70-fdff-16909cd167b0', 'Arm Weapons', 'Flamer', false, 0, NULL, 'Arm Weapons', 2),
  ('995bf4e0-3ba2-b67d-a612-17d0969099eb', '1024a069-ec6f-ee70-fdff-16909cd167b0', 'Heavy Weapons', 'Aeldari Missile Launcher', true, 0, NULL, 'Heavy Weapons', 2),
  ('b74dc353-1b0b-10c5-ea93-dabdc9e69a24', '1024a069-ec6f-ee70-fdff-16909cd167b0', 'Heavy Weapons', 'Bright Lance', false, 0, NULL, 'Heavy Weapons', 2),
  ('793ac248-9dfc-f4a7-2d0d-5744583a435e', '1024a069-ec6f-ee70-fdff-16909cd167b0', 'Heavy Weapons', 'Scatter Laser', false, 0, NULL, 'Heavy Weapons', 2),
  ('a5347ba4-f7b3-7ee9-bc4d-482c5ef43c4f', '1024a069-ec6f-ee70-fdff-16909cd167b0', 'Heavy Weapons', 'Shuriken Cannon', false, 0, NULL, 'Heavy Weapons', 2),
  ('06105759-92d1-f0dc-7111-d3f001374921', '1024a069-ec6f-ee70-fdff-16909cd167b0', 'Heavy Weapons', 'Starcannon', false, 0, NULL, 'Heavy Weapons', 2)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('2ad169fc-b38a-9be0-f659-ee20e10fa7f5', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Wraithguard', 'infantry', '6"', 6, '2+', 3, 8, 1, '{"Infantry", "Wraithguard", "Wraith Construct", "Aeldari", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('2ad169fc-b38a-9be0-f659-ee20e10fa7f5', 5, 170);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('2ad169fc-b38a-9be0-f659-ee20e10fa7f5', 'Close Combat Weapon', 'melee', NULL, '3', '4+', 5, 0, '1', '{}'),
  ('2ad169fc-b38a-9be0-f659-ee20e10fa7f5', 'Wraithcannon', 'ranged', '18"', '1', '4+', 14, -4, 'D6+1', '{}'),
  ('2ad169fc-b38a-9be0-f659-ee20e10fa7f5', 'D-Scythe', 'ranged', '12"', 'D6', 'N/A', 7, -3, '1', '{"Torrent"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('2ad169fc-b38a-9be0-f659-ee20e10fa7f5', 'War Construct', 'unique', 'This unit is eligible to shoot in a turn in which it Fell Back.'),
  ('2ad169fc-b38a-9be0-f659-ee20e10fa7f5', 'Psychic Guidance', 'unique', 'While this unit is within 12" of one or more friendly Aeldari Psyker models, models in this unit have a Leadership characteristic of 6+ and each time a model in this unit makes an attack, add 1 to the Hit roll.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('be591998-de80-c2fa-ee43-4f72fdab82a0', '2ad169fc-b38a-9be0-f659-ee20e10fa7f5', 'Wraithguard', 5, 5, 5, false, 2, NULL)
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('926ead51-8ae2-773b-e6da-ec57358d31b5', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Yvraine', 'epic_hero', '8"', 3, '6+', 4, 6, 1, '{"Yvraine", "Infantry", "Character", "Epic Hero", "Psyker", "Aeldari"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('926ead51-8ae2-773b-e6da-ec57358d31b5', 1, 100);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('926ead51-8ae2-773b-e6da-ec57358d31b5', 'Kha-vir', 'melee', NULL, '5', '2+', 4, -3, '2', '{"Devastating Wounds"}'),
  ('926ead51-8ae2-773b-e6da-ec57358d31b5', 'Storm of Whispers', 'ranged', '12"', 'D6+3', '2+', 2, -2, '1', '{"Anti-Infantry 2+", "Devastating Wounds", "Psychic"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('926ead51-8ae2-773b-e6da-ec57358d31b5', 'Invulnerable Save (Yvraine)', 'invulnerable', 'Yvraine has a 4+ Invulnerable save'),
  ('926ead51-8ae2-773b-e6da-ec57358d31b5', 'Herald of Ynnead', 'unique', 'At the start of the Fight phase, select one enemy unit within Engagement Range of this model. Until the end of the phase, each time a friendly Aeldari model makes an attack that targets that unit, you can re-roll a Wound roll of 1.'),
  ('926ead51-8ae2-773b-e6da-ec57358d31b5', 'Word of the Phoenix (Psychic)', 'unique', 'While this model is leading a unit, in your Command phase, roll one D6: on a 2+, D3+1 destroyed Bodyguard models (excluding Support Weapon models) are returned to that unit with their full wounds remaining.'),
  ('926ead51-8ae2-773b-e6da-ec57358d31b5', 'Leader', 'core', 'This model can be attached to the following units:
■ Corsair Voidscarred
■ Corsair Voidreavers
■ Guardian Defenders
■ Storm Guardians
■ Ynnari Incubi
■ Ynnari Kabalite Warriors
■ Ynnari Wyches'),
  ('926ead51-8ae2-773b-e6da-ec57358d31b5', 'Servant of the Whispering God', 'unique', 'If your army includes Yvraine, it cannot include any Epic Hero units (excluding Ynnari units). If your army includes any Epic Hero units (excluding Ynnari units), it cannot include Yvraine.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('a8408826-acaa-d425-aa2c-b3dc15b5978b', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Wraithblades', 'infantry', '6"', 6, '2+', 3, 8, 1, '{"Wraithblades", "Infantry", "Wraith Construct", "Aeldari", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('a8408826-acaa-d425-aa2c-b3dc15b5978b', 5, 160);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('a8408826-acaa-d425-aa2c-b3dc15b5978b', 'Ghostswords', 'melee', NULL, '5', '4+', 5, -2, '2', '{}'),
  ('a8408826-acaa-d425-aa2c-b3dc15b5978b', 'Ghostaxe', 'melee', NULL, '3', '4+', 7, -2, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('a8408826-acaa-d425-aa2c-b3dc15b5978b', 'Malevolent Souls', 'unique', 'Each time a model in this unit is destroyed by a melee attack, if that model has not fought this phase, roll one D6. On a 3+, do not remove it from play; that destroyed model can fight after the attacking model’s unit has finished making its attacks, and is then removed from play.'),
  ('a8408826-acaa-d425-aa2c-b3dc15b5978b', 'Psychic Guidance', 'unique', 'While this unit is within 12" of one or more friendly Aeldari Psyker models, models in this unit have a Leadership characteristic of 6+ and each time a model in this unit makes an attack, add 1 to the Hit roll.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('ec3850da-5942-ac5e-afd0-9bc9fc5c1855', 'a8408826-acaa-d425-aa2c-b3dc15b5978b', 'Wraithblade', 5, 5, 5, false, 2, NULL)
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('683811e1-4c3d-6d0f-7576-14e8c39c92db', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Archon', 'character', '7"', 3, '4+', 4, 6, 1, '{"Character", "Infantry", "Kabal", "Aeldari", "Archon"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('683811e1-4c3d-6d0f-7576-14e8c39c92db', 1, 80);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('683811e1-4c3d-6d0f-7576-14e8c39c92db', 'Splinter pistol', 'ranged', '12"', '1', '2+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault", "Pistol"}'),
  ('683811e1-4c3d-6d0f-7576-14e8c39c92db', 'Blast pistol', 'ranged', '6"', '1', '2+', 8, -3, 'D3', '{"Pistol"}'),
  ('683811e1-4c3d-6d0f-7576-14e8c39c92db', 'Huskblade', 'melee', NULL, '4', '2+', 3, -2, '3', '{"Devastating Wounds"}'),
  ('683811e1-4c3d-6d0f-7576-14e8c39c92db', 'Agoniser', 'melee', NULL, '6', '2+', 3, -2, '1', '{"Anti-Infantry 3+"}'),
  ('683811e1-4c3d-6d0f-7576-14e8c39c92db', 'Master-crafted power weapon', 'melee', NULL, '5', '2+', 4, -2, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('683811e1-4c3d-6d0f-7576-14e8c39c92db', 'Leader', 'core', 'This model can be attached to the following units:
■ Hand of the Archon
■ Incubi
■ Kabalite Warriors'),
  ('683811e1-4c3d-6d0f-7576-14e8c39c92db', 'Overlord', 'unique', 'Once per battle, at the start of any phase, you can select one friendly ^^**Drukhari**^^ unit that is Battle-shocked and within 12" of this model. That unit is no longer Battle-shocked.'),
  ('683811e1-4c3d-6d0f-7576-14e8c39c92db', 'Devious Mastermind', 'unique', 'Once per battle round, one model from your army with this ability can use it when its unit is targeted with a stratagem. If it does, reduce the CP cost of that use of that Stratagem by 1CP.'),
  ('683811e1-4c3d-6d0f-7576-14e8c39c92db', 'Shadowfield', 'unique', 'You cannot re-roll invulnerable saving throws made for the bearer. The first time an invulnerable saving throw made for the bearer is failed, until the end of the battle, the bearer has no invulnerable save.'),
  ('683811e1-4c3d-6d0f-7576-14e8c39c92db', 'Invulnerable Save', 'invulnerable', 'This unit has a 2+ invulnerable save. (See Shadowfield ability)'),
  ('683811e1-4c3d-6d0f-7576-14e8c39c92db', 'Hatred Eternal (Pain)', 'unique', 'In your Shooting or the Fight phase, when you select this model''s unit to shoot or fight, you can spend 1 Pain token to Empower that unit. While that unit is Empowered, each time a model in that unit makes an attack, you can re-roll the Hit roll.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('fce5c900-4349-f28e-9bda-886e20a7da4b', '683811e1-4c3d-6d0f-7576-14e8c39c92db', 'Pistol Choice', 'Splinter pistol', true, 0, NULL, 'Pistol Choice', 1),
  ('d1f59822-6b82-06f9-563d-554587700a4b', '683811e1-4c3d-6d0f-7576-14e8c39c92db', 'Pistol Choice', 'Blast pistol', false, 0, NULL, 'Pistol Choice', 1),
  ('2cc561ce-2662-a356-b40f-9cfbde9c1dc2', '683811e1-4c3d-6d0f-7576-14e8c39c92db', 'Pistol Choice', 'Soul Trap', false, 0, NULL, 'Pistol Choice', 1),
  ('9b9731b0-3e3d-1069-cb65-2719fb93a29c', '683811e1-4c3d-6d0f-7576-14e8c39c92db', 'Melee Choice', 'Huskblade', true, 0, NULL, 'Melee Choice', 1),
  ('9bc75b1b-23d1-2ec4-5eac-c3b07f1c9f6d', '683811e1-4c3d-6d0f-7576-14e8c39c92db', 'Melee Choice', 'Agoniser', false, 0, NULL, 'Melee Choice', 1),
  ('4ee53c67-ccf4-625a-0332-2e591e928e6e', '683811e1-4c3d-6d0f-7576-14e8c39c92db', 'Melee Choice', 'Master-crafted power weapon', false, 0, NULL, 'Melee Choice', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('1961a53f-27e8-d587-3e2f-a012a5b466de', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Beastmaster', 'character', '12"', 4, '6+', 3, 7, 1, '{"Aeldari", "Beast", "Character", "Mounted", "Fly", "Beastmaster"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('1961a53f-27e8-d587-3e2f-a012a5b466de', 1, 135);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('1961a53f-27e8-d587-3e2f-a012a5b466de', 'Agonizer', 'melee', NULL, '3', '3+', 3, -2, '1', '{"Anti-Infantry 3+"}'),
  ('1961a53f-27e8-d587-3e2f-a012a5b466de', 'Splinter pods', 'ranged', '18"', '2', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault", "Twin-Linked"}'),
  ('1961a53f-27e8-d587-3e2f-a012a5b466de', 'Clawed Fiend fists', 'melee', NULL, '5', '4+', 5, -2, '2', '{"Devastating Wounds"}'),
  ('1961a53f-27e8-d587-3e2f-a012a5b466de', 'Khymerae talons', 'melee', NULL, '4', '4+', 5, -1, '1', '{"Lethal Hits"}'),
  ('1961a53f-27e8-d587-3e2f-a012a5b466de', 'Razorwing Feathers', 'melee', NULL, '6', '4+', 3, 0, '1', '{"Sustained Hits 1"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('1961a53f-27e8-d587-3e2f-a012a5b466de', 'Beastmaster', 'unique', 'While this unit contains a Beastmaster model, you can re-roll Charge rolls made for this unit.'),
  ('1961a53f-27e8-d587-3e2f-a012a5b466de', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ Invulnerable save'),
  ('1961a53f-27e8-d587-3e2f-a012a5b466de', 'Goaded Savagery (Pain)', 'unique', 'In the Fight phase, when you select this unit to fight, you can spend 1 of your Pain tokens to Empower this unit. While this unit is Empowered, if it contains a ^^**Beastmaster**^^ model, each time a ^^**Beast**^^ model in this unit makes a melee attack, you can re-roll the Hit roll and you can re-roll the Wound roll.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('8dceee1b-48fb-6e8d-b251-31a40dd0bfcd', '1961a53f-27e8-d587-3e2f-a012a5b466de', 'Beastmaster', 1, 1, 1, true, 0, 'Beastmaster'),
  ('694d85c0-ece9-ceff-e177-6dce0715a9d1', '1961a53f-27e8-d587-3e2f-a012a5b466de', 'Clawed Fiend', 1, 1, 1, true, 1, 'Beasts'),
  ('3989d1e4-b25f-f305-58b3-7c530a977283', '1961a53f-27e8-d587-3e2f-a012a5b466de', 'Khymerae', 2, 2, 2, false, 2, 'Beasts'),
  ('69d33243-f828-0ccf-cfd9-c39bc5ab4d2b', '1961a53f-27e8-d587-3e2f-a012a5b466de', 'Razorwing Flock', 3, 3, 3, false, 3, 'Beasts')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('974b3157-6ca0-9a01-108b-969dbe635b1c', '1961a53f-27e8-d587-3e2f-a012a5b466de', 'Beasts', 'Clawed Fiend', false, 0, NULL, NULL, NULL),
  ('d3633b73-faaf-185e-e976-faeffe8cceb4', '1961a53f-27e8-d587-3e2f-a012a5b466de', 'Beasts', 'Khymerae', false, 0, NULL, NULL, NULL),
  ('0d851df7-1181-1e40-1248-35466d68a764', '1961a53f-27e8-d587-3e2f-a012a5b466de', 'Beasts', 'Razorwing Flock', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('310936a3-cc1b-3cc2-cc6f-0df6634b8795', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Court of the Archon', 'infantry', '7"', 3, '5+', 2, 7, 1, '{"Court of the Archon", "Aeldari", "Kabal", "Infantry"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('310936a3-cc1b-3cc2-cc6f-0df6634b8795', 4, 95);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('310936a3-cc1b-3cc2-cc6f-0df6634b8795', 'Shaimeshi Blade', 'melee', NULL, '4', '3+', 4, -2, '1', '{"Anti-Infantry 2+"}'),
  ('310936a3-cc1b-3cc2-cc6f-0df6634b8795', 'Shardcarbine', 'ranged', '18"', '3', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault"}'),
  ('310936a3-cc1b-3cc2-cc6f-0df6634b8795', 'Splinter pistol', 'ranged', '12"', '1', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault", "Pistol"}'),
  ('310936a3-cc1b-3cc2-cc6f-0df6634b8795', 'Sslyth battle-blade', 'melee', NULL, '3', '3+', 5, -2, '2', '{}'),
  ('310936a3-cc1b-3cc2-cc6f-0df6634b8795', 'Eyeburst', 'ranged', '12"', 'D6', 'N/A', 6, -2, '1', '{"Pistol", "Torrent"}'),
  ('310936a3-cc1b-3cc2-cc6f-0df6634b8795', 'Close combat weapon', 'melee', NULL, '2', '3+', 3, 0, '1', '{}'),
  ('310936a3-cc1b-3cc2-cc6f-0df6634b8795', 'Ur-ghul Talons', 'melee', NULL, '6', '3+', 4, 0, '1', '{"Sustained Hits 1"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('310936a3-cc1b-3cc2-cc6f-0df6634b8795', 'Court of the Archon', 'unique', 'While a ^^**Character**^^ model is leading a unit that contains one or more Lhamaean, Medusae, Sslyth and/or Ur-ghul models, that ^^**Character**^^ model has the Feel No Pain 4+ ability.'),
  ('310936a3-cc1b-3cc2-cc6f-0df6634b8795', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save'),
  ('310936a3-cc1b-3cc2-cc6f-0df6634b8795', 'Deadly Retinue (Pain)', 'unique', 'At the start of your Shooting phase or at the start of the Fight phase, you can spend 1 Pain token to Empower this unit. While this unit is Empowered:
■ If it contains one or more Lhamaean models, melee weapons equipped by models in this unit have the ^^**[LETHAL HITS]**^^ ability.
■ If it contains one or more Medusae models, ranged weapons equipped by models in this unit have the ^^**[IGNORES COVER]**^^ ability.
■ If it contains one or more Sslyth models, each time a melee attack targets this unit, subtract 1 from the Wound roll.
■ If this unit contains one or more Ur-ghul models, this unit has the Fights First ability.'),
  ('310936a3-cc1b-3cc2-cc6f-0df6634b8795', 'Court of the Archon [Legends]', 'unique', 'This unit can be led by an ^^**Archon**^^. Alternatively, in the Declare Battle Formations step, this unit can join one ^^**Kabalite Warriors**^^ or ^^**Hand of the Archon**^^ unit from your army that is being led by an ^^**Archon**^^ (a unit cannot have more than one ^^**Court of the Archon**^^ unit joined to it). If it does, until the end of the battle, every model in this unit counts as part of that ^^**Kabalite Warriors**^^ or ^^**Hand of the Archon **^^unit, and its Starting Strength is increased accordingly.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('c5cbbc5a-8a3e-a92a-cea2-220897dd280e', '310936a3-cc1b-3cc2-cc6f-0df6634b8795', 'Lhamaean', 1, 1, 1, true, 2, NULL),
  ('91d0cdaa-3874-de85-5746-2ae3f2fd8ad3', '310936a3-cc1b-3cc2-cc6f-0df6634b8795', 'Sslyth', 1, 1, 1, true, 4, NULL),
  ('73cc8c25-6283-4b22-7c11-36867d0b3dbd', '310936a3-cc1b-3cc2-cc6f-0df6634b8795', 'Medusae', 1, 1, 1, true, 3, NULL),
  ('79b90742-abc4-cfe2-30dc-19bcb5606ce6', '310936a3-cc1b-3cc2-cc6f-0df6634b8795', 'Ur-ghul', 1, 1, 1, true, 5, NULL)
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('571bb35a-fd1a-066f-9cb6-e6f70b6b5c14', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Cronos', 'monster', '7"', 7, '3+', 7, 7, 2, '{"Cronos", "Aeldari", "Haemonculus Covens", "Monster", "Fly"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('571bb35a-fd1a-066f-9cb6-e6f70b6b5c14', 1, 55);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('571bb35a-fd1a-066f-9cb6-e6f70b6b5c14', 'Spirit Vortex', 'ranged', '18"', 'D6', '3+', 5, -1, '1', '{"Blast", "Ignores Cover"}'),
  ('571bb35a-fd1a-066f-9cb6-e6f70b6b5c14', 'Spirit Syphon', 'ranged', '12"', 'D6', 'N/A', 5, -1, '1', '{"Ignores Cover", "Torrent"}'),
  ('571bb35a-fd1a-066f-9cb6-e6f70b6b5c14', 'Spirit-leech Tentacles', 'melee', NULL, '6', '3+', 5, -1, '1', '{"Anti-Infantry 2+"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('571bb35a-fd1a-066f-9cb6-e6f70b6b5c14', 'Pain Engine (Aura)', 'unique', 'Each time you spend 1 Pain token to Empower a friendly unit within 9" of this unit, roll one D6, adding 1 to the result if one or more models in this unit are not equipped with a spirit vortex: on a 5+, you gain 1 Pain token.


**Designer''s Note:** Pain tokens you spend for reasons other than Empowering a unit do not trigger this ability.'),
  ('571bb35a-fd1a-066f-9cb6-e6f70b6b5c14', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ Invulnerable save'),
  ('571bb35a-fd1a-066f-9cb6-e6f70b6b5c14', 'Pain Parasite (Pain)', 'unique', 'In your Shooting phase or the Fight phase, when you select this unit to shoot or fight, you can spend 1 Pain token to Empower this unit. While Empowered, each time this unit shoots or fights, after it has resolved its attacks, if one or more enemy models were destroyed as a result of those attacks, one model in this unit regains up to 3 lost wounds (if all models in this unit have their starting number of wounds and this unit is below its Starting Strength, 1 model is returned to this unit with 3 wounds remaining).');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('b38114c0-7287-1866-0afe-5d1e0000aacb', '571bb35a-fd1a-066f-9cb6-e6f70b6b5c14', 'Cronos', 1, 2, 1, false, 2, NULL)
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('6bcbce8b-80eb-2530-241f-92cb5354199d', '571bb35a-fd1a-066f-9cb6-e6f70b6b5c14', 'Cronos wargear', 'Spirit Syphon', true, 0, 'b38114c0-7287-1866-0afe-5d1e0000aacb', NULL, NULL),
  ('7be49e95-01ee-af4d-0a42-804c4adbc369', '571bb35a-fd1a-066f-9cb6-e6f70b6b5c14', 'Cronos wargear', 'Spirit-leech Tentacles', false, 0, 'b38114c0-7287-1866-0afe-5d1e0000aacb', NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('b866ab9a-7de8-d0f5-0ce4-119e020b1c93', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Drazhar', 'epic_hero', '7"', 3, '2+', 5, 6, 1, '{"Epic Hero", "Drazhar", "Aeldari", "Infantry", "Character", "Blades for Hire"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('b866ab9a-7de8-d0f5-0ce4-119e020b1c93', 1, 85);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('b866ab9a-7de8-d0f5-0ce4-119e020b1c93', '➤ The Executioner''s demiklaives - Dual Blades', 'melee', NULL, '8', '2+', 5, -2, '2', '{"Devastating Wounds"}'),
  ('b866ab9a-7de8-d0f5-0ce4-119e020b1c93', '➤ The Executioner''s demiklaives - Single Blade', 'melee', NULL, '6', '2+', 6, -2, '3', '{"Devastating Wounds"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('b866ab9a-7de8-d0f5-0ce4-119e020b1c93', 'Leader', 'core', 'This model can be attached to the following unit:
■ Incubi'),
  ('b866ab9a-7de8-d0f5-0ce4-119e020b1c93', 'Invulnerable Save', 'invulnerable', 'This unit has a 4+ invulnerable save.'),
  ('b866ab9a-7de8-d0f5-0ce4-119e020b1c93', 'Master of Blades (Pain)', 'unique', 'In the Fight phase, when you select this model''s unit to fight, you can spend 1 Pain token to Empower that unit. While that unit is Empowered, each time a model in that unit makes a melee attack, add 1 to the Wound roll.'),
  ('b866ab9a-7de8-d0f5-0ce4-119e020b1c93', 'Onslaught', 'unique', 'While this model is leading a unit, each time a model in that unit makes a Pile-In or Consolidation move, it can move up to 6" instead of up to 3".'),
  ('b866ab9a-7de8-d0f5-0ce4-119e020b1c93', 'Silent Executioner', 'unique', 'Each time this model make an attack that targets a unit that is below its Starting Strength, you can re-roll the Hit roll. If that target is Below Half-Strength, you can re-roll the Wound roll as well.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('c7c54f7d-7442-bae8-41d5-7efb1b5e0b40', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Grotesques', 'infantry', '7"', 5, '6+', 4, 7, 1, '{"Grotesques", "Aeldari", "Haemonculus Covens", "Infantry"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('c7c54f7d-7442-bae8-41d5-7efb1b5e0b40', 3, 80);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('c7c54f7d-7442-bae8-41d5-7efb1b5e0b40', 'Paired monstrous Weapons', 'melee', NULL, '4', '3+', 5, -2, '2', '{"Twin-Linked"}'),
  ('c7c54f7d-7442-bae8-41d5-7efb1b5e0b40', 'Liquifier Gun', 'ranged', '12"', 'D6', 'N/A', 4, -1, '1', '{"Anti-Infantry 3+", "Torrent"}'),
  ('c7c54f7d-7442-bae8-41d5-7efb1b5e0b40', 'Monstrous Weapons', 'melee', NULL, '4', '3+', 5, -2, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('c7c54f7d-7442-bae8-41d5-7efb1b5e0b40', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ Invulnerable save'),
  ('c7c54f7d-7442-bae8-41d5-7efb1b5e0b40', 'Monstrous Hulks', 'unique', 'This unit cannot embark within a ^^**Venom**^^, but it can embark within other ^^**Drukhari Transports**^^; when doing so, each ^^**Grotesque**^^ model takes up the space of 3 models.'),
  ('c7c54f7d-7442-bae8-41d5-7efb1b5e0b40', 'Macro-steroids (Pain)', 'unique', 'In the Fight phase, when you select this unit to fight, you can spend 1 of your Pain tokens to Empower this unit. While Empowered, melee weapons equipped by models in this unit have a Strength characteristic of 8 and the ^^**[LETHAL HITS]**^^ ability.'),
  ('c7c54f7d-7442-bae8-41d5-7efb1b5e0b40', 'Monstrous Charge', 'unique', 'Each time this unit ends a Charge move, select one enemy unit within Engagement Range of it, then roll one D6 for each model in this unit that is within Engagement Range of that enemy unit: for each 4+, that enemy unit suffers D3 mortal wounds.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('86b0b667-7f9a-9630-d9ac-1f536c3d4d3c', 'c7c54f7d-7442-bae8-41d5-7efb1b5e0b40', 'Grotesque w/ paired monstrous weapons', 0, 6, 0, false, 0, '3-6 Grotesques'),
  ('56bafb5d-bbce-ba98-1d8e-7a224690f4cf', 'c7c54f7d-7442-bae8-41d5-7efb1b5e0b40', 'Grotesque w/ Liquifier', 0, 6, 0, false, 1, '3-6 Grotesques')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('2b165867-df63-96e0-7fb8-e07f4af37175', 'c7c54f7d-7442-bae8-41d5-7efb1b5e0b40', '3-6 Grotesques', 'Grotesque w/ paired monstrous weapons', true, 0, NULL, NULL, NULL),
  ('55620e0c-9527-871e-4761-d67da5d43daa', 'c7c54f7d-7442-bae8-41d5-7efb1b5e0b40', '3-6 Grotesques', 'Grotesque w/ Liquifier', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('9f099c3a-3c45-c74e-1f0f-e657f1a038f9', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Haemonculus', 'character', '7"', 4, '5+', 5, 7, 1, '{"Haemonculus", "Haemonculus Covens", "Aeldari", "Character", "Infantry"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('9f099c3a-3c45-c74e-1f0f-e657f1a038f9', 1, 70);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('9f099c3a-3c45-c74e-1f0f-e657f1a038f9', 'Haemonculus tools and scissorhands', 'melee', NULL, '5', '2+', 3, -1, 'D3', '{"Anti-Infantry 2+", "Precision"}'),
  ('9f099c3a-3c45-c74e-1f0f-e657f1a038f9', 'Stinger Pistol', 'ranged', '12"', '1', '2+', 2, -1, 'D3', '{"Anti-infantry 2+", "Pistol", "Precision"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('9f099c3a-3c45-c74e-1f0f-e657f1a038f9', 'Leader', 'core', 'This model can be attached to the following unit:
■ Wracks'),
  ('9f099c3a-3c45-c74e-1f0f-e657f1a038f9', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ Invulnerable save'),
  ('9f099c3a-3c45-c74e-1f0f-e657f1a038f9', 'Fear Incarnate (Aura)', 'unique', 'While an enemy unit is within 6" of this model, worsen the Leadership characteristic of models in that unit by 1. In addition, in the Battle-shock step of your opponent''s Command phase, if such an enemy unit is below its Starting Strength, it must take a Battle-shock test.'),
  ('9f099c3a-3c45-c74e-1f0f-e657f1a038f9', 'Pain Adept', 'unique', 'In your Command phase, if one or more models from your army with this ability are on the battlefield, roll one D6: on a 4+, you gain 1 Pain token.'),
  ('9f099c3a-3c45-c74e-1f0f-e657f1a038f9', 'Fleshcraft (Pain)', 'unique', 'In your Command phase, you can spend 1 Pain token to Empower this model''s unit. Each time you do, you can return up to D3+1 destroyed Bodyguard models to that unit.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('7eafb258-0a81-2ff6-e7b4-f93772a47ed9', '9f099c3a-3c45-c74e-1f0f-e657f1a038f9', 'Wargear', 'Haemonculus tools and scissorhands', true, 0, NULL, NULL, NULL),
  ('3f1f43bc-f786-ed3f-c29e-59ef412dde86', '9f099c3a-3c45-c74e-1f0f-e657f1a038f9', 'Wargear', 'Stinger pistol', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('72f011b4-13c0-8f21-af96-7177c34b9a8f', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Hellions', 'mounted', '14"', 4, '4+', 2, 7, 1, '{"Hellions", "Aeldari", "Wych Cult", "Mounted", "Fly"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('72f011b4-13c0-8f21-af96-7177c34b9a8f', 4, 85);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('72f011b4-13c0-8f21-af96-7177c34b9a8f', 'Hellglaive', 'melee', NULL, '3', '3+', 4, -1, '2', '{"Lance", "Sustained Hits 1"}'),
  ('72f011b4-13c0-8f21-af96-7177c34b9a8f', 'Splinter Pods', 'ranged', '18"', '2', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault", "Twin Linked"}'),
  ('72f011b4-13c0-8f21-af96-7177c34b9a8f', 'Power weapon', 'melee', NULL, '4', '3+', 3, -2, '1', '{"Anti-Infantry 3+", "Lance", "Sustained Hits 1"}'),
  ('72f011b4-13c0-8f21-af96-7177c34b9a8f', 'Splinter Pistol', 'ranged', '12"', '1', '3+', 2, 0, '1', '{"Anti-infantry 3+", "Assault", "Pistol"}'),
  ('72f011b4-13c0-8f21-af96-7177c34b9a8f', 'Stunclaw', 'melee', NULL, '4', '3+', 3, -1, '1', '{"Devastating Wounds", "Lance", "Precision"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('72f011b4-13c0-8f21-af96-7177c34b9a8f', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ Invulnerable save'),
  ('72f011b4-13c0-8f21-af96-7177c34b9a8f', 'Battlefield Butchery (Pain)', 'unique', 'In the Fight phase, when you select this unit to fight, you can spend 1 Pain token to Empower this unit. While Empowered, add 1 to the Attacks and Strength characteristics of this unit''s melee weapons.'),
  ('72f011b4-13c0-8f21-af96-7177c34b9a8f', 'Skyboard Evasion', 'unique', 'Once per turn, when an enemy unit ends a Normal, Advance or Fall Back move within 9" of this unit, this unit can make a Normal move of up to D6".');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('be5c912e-efee-276a-a2bb-14788b9ea1e7', '72f011b4-13c0-8f21-af96-7177c34b9a8f', 'Hellion', 4, 9, 4, false, 0, '4-9 Hellions'),
  ('b9d7e003-bed5-e34a-699d-44a40f1da5c8', '72f011b4-13c0-8f21-af96-7177c34b9a8f', 'Heliarch', 1, 1, 1, true, 1, 'Heliarch')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('74b5bdef-503c-42c8-ed2c-c6cd21f58fe6', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Incubi', 'infantry', '7"', 3, '3+', 1, 6, 1, '{"Incubi", "Aeldari", "Infantry", "Blades for Hire"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('74b5bdef-503c-42c8-ed2c-c6cd21f58fe6', 4, 90);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('74b5bdef-503c-42c8-ed2c-c6cd21f58fe6', 'Klaive', 'melee', NULL, '3', '3+', 5, -2, '2', '{}'),
  ('74b5bdef-503c-42c8-ed2c-c6cd21f58fe6', '➤ Demiklaives - Dual Blades', 'melee', NULL, '6', '3+', 4, -2, '1', '{}'),
  ('74b5bdef-503c-42c8-ed2c-c6cd21f58fe6', '➤ Demiklaives - Single Blade', 'melee', NULL, '4', '3+', 5, -2, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('74b5bdef-503c-42c8-ed2c-c6cd21f58fe6', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save'),
  ('74b5bdef-503c-42c8-ed2c-c6cd21f58fe6', 'Tormentors', 'unique', 'At the start of the Fight phase, each enemy unit within Engagement Range of one or more units with this ability must take a Battle-shock test. Each time a model in this unit makes a melee attack that targets a Battle-shocked unit, add 1 to the Hit roll.'),
  ('74b5bdef-503c-42c8-ed2c-c6cd21f58fe6', 'Decapitating Strikes (Pain)', 'unique', 'In the Fight phase, when you select this unit to fight, you can spend 1 Pain token to Empower this unit. While Empowered, each time a model in this unit makes a melee attack that targets an ^^**Infantry**^^ unit, that attack has the ^^**[Devastating Wounds]**^^ ability.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('fefbdc08-5151-05bd-ae8b-09092cf1deff', '74b5bdef-503c-42c8-ed2c-c6cd21f58fe6', 'Incubi', 4, 9, 4, false, 0, '4-9 Incubi'),
  ('ae6525b5-2cb5-ae37-df46-46d5cf253e20', '74b5bdef-503c-42c8-ed2c-c6cd21f58fe6', 'Klaivex', 1, 1, 1, true, 1, 'Klaivex')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('a4ef9462-4013-0380-c42d-5c278276da09', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Kabalite Warriors', 'battleline', '7"', 3, '4+', 1, 7, 2, '{"Kabalite Warriors", "Aeldari", "Kabal", "Battleline", "Infantry"}', 6, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('a4ef9462-4013-0380-c42d-5c278276da09', 9, 115);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('a4ef9462-4013-0380-c42d-5c278276da09', 'Shredder', 'ranged', '18"', 'D6', 'N/A', 6, 0, '1', '{"Assault", "Torrent"}'),
  ('a4ef9462-4013-0380-c42d-5c278276da09', 'Close Combat Weapon', 'melee', NULL, '2', '3+', 3, 0, '1', '{}'),
  ('a4ef9462-4013-0380-c42d-5c278276da09', 'Splinter Rifle', 'ranged', '24"', '2', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault"}'),
  ('a4ef9462-4013-0380-c42d-5c278276da09', 'Blaster', 'ranged', '18"', '1', '3+', 8, -4, 'D6+1', '{"Assault"}'),
  ('a4ef9462-4013-0380-c42d-5c278276da09', 'Splinter Cannon', 'ranged', '36"', '3', '4+', 3, -1, '2', '{"Anti-Infantry 3+", "Heavy", "Sustained Hits 1"}'),
  ('a4ef9462-4013-0380-c42d-5c278276da09', 'Dark Lance', 'ranged', '36"', '1', '4+', 12, -3, 'D6+2', '{"Heavy"}'),
  ('a4ef9462-4013-0380-c42d-5c278276da09', 'Blast Pistol', 'ranged', '6"', '1', '3+', 8, -3, 'D3', '{"Pistol"}'),
  ('a4ef9462-4013-0380-c42d-5c278276da09', 'Splinter Pistol', 'ranged', '12"', '1', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault", "Pistol"}'),
  ('a4ef9462-4013-0380-c42d-5c278276da09', 'Power Weapon', 'melee', NULL, '3', '3+', 3, -2, '1', '{"Anti-Infantry 3+"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('a4ef9462-4013-0380-c42d-5c278276da09', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ Invulnerable save'),
  ('a4ef9462-4013-0380-c42d-5c278276da09', 'Cruel Enforcers', 'unique', 'At the end of your Command phase, if this unit is within range of an objective marker you control, that objective marker remains under you control, until your opponent''s Level of Control over that objective marker is greater than yours at the end of a phase.'),
  ('a4ef9462-4013-0380-c42d-5c278276da09', 'Sadistic Raiders (Pain)', 'unique', 'In your Shooting phase or the Fight phase, when you select this unit to shoot or fight, you can spend 1 Pain token to Empower this unit. While Empowered, each time a model in this unit makes an attack, re-roll a Wound roll of 1. If the target is within range of an objective marker, you can re-roll the Wound roll instead.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('aa49b63c-7d75-d0fe-ca1f-dfdcbda6d41a', 'a4ef9462-4013-0380-c42d-5c278276da09', 'Kabalite Warrior with Shredder', 0, 1, 0, false, 0, '9 Kabalite Warriors'),
  ('ffaa75bd-9ddf-c55d-7013-f2f609332551', 'a4ef9462-4013-0380-c42d-5c278276da09', 'Kabalite Warrior', 0, 9, 0, false, 1, '9 Kabalite Warriors'),
  ('43de02a9-6af5-89be-1f08-495c8f0b2c92', 'a4ef9462-4013-0380-c42d-5c278276da09', 'Kabalite Warrior with Blaster', 0, 1, 0, false, 2, '9 Kabalite Warriors'),
  ('4839a93c-004c-0c04-e920-817b7c4ba131', 'a4ef9462-4013-0380-c42d-5c278276da09', 'Kabalite Warrior with Splinter Cannon', 0, 1, 0, false, 3, '9 Kabalite Warriors'),
  ('7d8ebbe7-3535-6cc3-57be-e16e960e2ee0', 'a4ef9462-4013-0380-c42d-5c278276da09', 'Kabalite Warrior with Dark Lance', 0, 1, 0, false, 4, '9 Kabalite Warriors'),
  ('62f99702-f15f-a836-89b1-1b10c9c9736b', 'a4ef9462-4013-0380-c42d-5c278276da09', 'Sybarite', 1, 1, 1, true, 5, 'Sybarite')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('2caff101-7efe-dbeb-a982-8ec7e3eb49d2', 'a4ef9462-4013-0380-c42d-5c278276da09', '9 Kabalite Warriors', 'Kabalite Warrior with Shredder', false, 0, NULL, NULL, NULL),
  ('fd4aa055-6956-a09e-f32a-42c327338b3f', 'a4ef9462-4013-0380-c42d-5c278276da09', '9 Kabalite Warriors', 'Kabalite Warrior', true, 0, NULL, NULL, NULL),
  ('744d621e-6801-0c01-af57-1d773ca2a868', 'a4ef9462-4013-0380-c42d-5c278276da09', '9 Kabalite Warriors', 'Kabalite Warrior with Blaster', false, 0, NULL, NULL, NULL),
  ('df13b493-7591-0fe7-da94-a6a27b3ec527', 'a4ef9462-4013-0380-c42d-5c278276da09', '9 Kabalite Warriors', 'Kabalite Warrior with Splinter Cannon', false, 0, NULL, NULL, NULL),
  ('f05e3078-815b-aa0b-4dd1-5b69d6e0c9d9', 'a4ef9462-4013-0380-c42d-5c278276da09', '9 Kabalite Warriors', 'Kabalite Warrior with Dark Lance', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('50d2d669-1649-6863-f27a-b5c4bff1d8c6', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Lelith Hesperax', 'epic_hero', '8"', 3, '6+', 4, 6, 1, '{"Lelith Hesperax", "Aeldari", "Wych Cult", "Succubus", "Epic Hero", "Character", "Infantry"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('50d2d669-1649-6863-f27a-b5c4bff1d8c6', 1, 85);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('50d2d669-1649-6863-f27a-b5c4bff1d8c6', 'Lelith''s blades', 'melee', NULL, '8', '2+', 3, -2, '1', '{"Anti-Infantry 2+", "Precision", "Sustained Hits 2"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('50d2d669-1649-6863-f27a-b5c4bff1d8c6', 'Leader', 'core', 'This model can be attached to the following unit:
■ Wyches'),
  ('50d2d669-1649-6863-f27a-b5c4bff1d8c6', 'Brides of Death (Pain)', 'unique', 'In the Fight phase, when you select this model''s unit to fight, you can spend 1 Pain token to Empower that unit. While that unit is Empowered, each time a model in that unit makes a melee attack, improve the Strength and Armour Penetration characteristics of that attack by 1.'),
  ('50d2d669-1649-6863-f27a-b5c4bff1d8c6', 'Thrilling Spectacle', 'unique', 'Once per battle, at the start of the Fight phase, this model can use this ability. If it does, until the end of the phase, this model has a 3+ invulnerable save and change the Attacks characteristic of melee weapons equipped by this model to 12.'),
  ('50d2d669-1649-6863-f27a-b5c4bff1d8c6', 'Invulnerable Save', 'invulnerable', 'This unit has a 4+ Invulnerable save'),
  ('50d2d669-1649-6863-f27a-b5c4bff1d8c6', 'Blur of Blades', 'unique', 'While this model is leading a unit, models in that unit have the Fights First ability.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('76f714d0-ef2f-ac62-1a45-ceaee0a624bf', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Mandrakes', 'infantry', '8"', 3, '7+', 1, 7, 1, '{"Mandrakes", "Aeldari", "Infantry", "Blades for Hire"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('76f714d0-ef2f-ac62-1a45-ceaee0a624bf', 4, 75);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('76f714d0-ef2f-ac62-1a45-ceaee0a624bf', 'Baleblast', 'ranged', '18"', '2', '3+', 5, -1, '1', '{"Assault", "Devastating Wounds", "Ignores Cover"}'),
  ('76f714d0-ef2f-ac62-1a45-ceaee0a624bf', 'Glimmersteel Blade', 'melee', NULL, '3', '3+', 5, -1, '1', '{"Devastating Wounds"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('76f714d0-ef2f-ac62-1a45-ceaee0a624bf', 'Fade Away (Pain)', 'unique', 'At the end of your opponent’s Fight phase, if this unit is not within Engagement Range of one or more enemy units, you can spend 1 Pain token to Empower this unit. Each time you do, remove this unit from the battlefield and place it into Strategic Reserves.'),
  ('76f714d0-ef2f-ac62-1a45-ceaee0a624bf', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ invulnerable save.'),
  ('76f714d0-ef2f-ac62-1a45-ceaee0a624bf', 'Shade Weavers', 'unique', 'This unit cannot be targeted by ranged attacks unless the attacking model is within 18".');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('18bc0032-a938-d488-e296-a8dbce22a3ca', '76f714d0-ef2f-ac62-1a45-ceaee0a624bf', 'Mandrake', 4, 9, 4, false, 0, '4-9 Mandrakes'),
  ('f829bff4-1c92-7801-363e-bacd4d68ced7', '76f714d0-ef2f-ac62-1a45-ceaee0a624bf', 'Nightfiend', 1, 1, 1, true, 1, 'Nightfiend')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('98e359b3-2a4f-f043-1097-80621c7614c7', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Raider', 'dedicated_transport', '14"', 8, '4+', 10, 7, 2, '{"Raider", "Aeldari", "Dedicated Transport", "Fly", "Vehicle", "Transport"}', 6, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('98e359b3-2a4f-f043-1097-80621c7614c7', 1, 85);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('98e359b3-2a4f-f043-1097-80621c7614c7', 'Bladevanes and chainsnares', 'melee', NULL, 'D3+3', '4+', 6, -1, '1', '{}'),
  ('98e359b3-2a4f-f043-1097-80621c7614c7', 'Disintegrator Cannon', 'ranged', '36"', '3', '3+', 6, -3, '2', '{}'),
  ('98e359b3-2a4f-f043-1097-80621c7614c7', 'Dark Lance', 'ranged', '36"', '1', '3+', 12, -3, 'D6+2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('98e359b3-2a4f-f043-1097-80621c7614c7', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ Invulnerable save'),
  ('98e359b3-2a4f-f043-1097-80621c7614c7', 'Aethersails', 'unique', 'While one or more ^^**Drukhari**^^ units are embarked within this model, you can re-roll Advance and Charge rolls made for this model.'),
  ('98e359b3-2a4f-f043-1097-80621c7614c7', 'Splinter Racks (Pain)', 'unique', 'In your Shooting phase, when you select this model to shoot, you can spend 1 Pain token to Empower this model. While Empowered, if one or more units are embarked within this model, each time this model makes an attack with a ranged weapon that has the ^^**Anti**^^ ability, you can re-roll the Hit roll.'),
  ('98e359b3-2a4f-f043-1097-80621c7614c7', 'Vanguard of the Dark City', 'unique', 'At the start of your Command phase, select one of the abilities in the Vanguard of the Dark City section (see left) for this model. Until the start of your next Command phase, this model has that ability.'),
  ('98e359b3-2a4f-f043-1097-80621c7614c7', 'Masters of the Shadowed Sky', 'unique', 'At the end of your Command phase, if this model is within range of an objective marker you control, and if one or more ^^**Kabalite Warriors**^^ units are embarked within it, that objective marker remains under your control until your opponent''s Level of Control over that objective marker is greater than yours at the end of a phase.'),
  ('98e359b3-2a4f-f043-1097-80621c7614c7', 'Speed of the Kill', 'unique', 'Each time a ^^**Wyches**^^ unit disembarks from this model (excluding Emergency Disembarkations), models in that ^^**Wyches**^^ unit must be setup wholly within 6" of this model.'),
  ('98e359b3-2a4f-f043-1097-80621c7614c7', 'Visions of Butchery', 'unique', 'While one or more ^^**Wracks**^^ units are embarked within this model, for each ^^**Wracks**^^ model embarked within this model, add 1 to the Attacks characteristic of this model''s Bladevanes and chainsnares.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('328a84f3-d423-4e25-e6b5-f2b93865be25', '98e359b3-2a4f-f043-1097-80621c7614c7', 'Wargear', 'Bladevanes and chainsnares', true, 0, NULL, NULL, NULL),
  ('74833459-9c8e-1fc3-3f2f-23668940d627', '98e359b3-2a4f-f043-1097-80621c7614c7', 'Weapon Option', 'Disintegrator Cannon', true, 0, NULL, 'Weapon Option', 1),
  ('674d0272-6dcb-0197-2200-6b171d64fe9b', '98e359b3-2a4f-f043-1097-80621c7614c7', 'Weapon Option', 'Dark Lance', false, 0, NULL, 'Weapon Option', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('124f5b7e-04b1-8b4b-cc8b-70858956ab10', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Ravager', 'vehicle', '14"', 9, '4+', 11, 7, 3, '{"Ravager", "Aeldari", "Kabal", "Fly", "Vehicle"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('124f5b7e-04b1-8b4b-cc8b-70858956ab10', 1, 110);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('124f5b7e-04b1-8b4b-cc8b-70858956ab10', 'Bladevanes', 'melee', NULL, '3', '4+', 6, -1, '1', '{}'),
  ('124f5b7e-04b1-8b4b-cc8b-70858956ab10', 'Disintegrator Cannon', 'ranged', '36"', '3', '3+', 6, -3, '2', '{}'),
  ('124f5b7e-04b1-8b4b-cc8b-70858956ab10', 'Dark Lance', 'ranged', '36"', '1', '3+', 12, -3, 'D6+2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('124f5b7e-04b1-8b4b-cc8b-70858956ab10', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ Invulnerable save'),
  ('124f5b7e-04b1-8b4b-cc8b-70858956ab10', 'Damaged: 1-4 Wounds Remaining', 'unique', 'While this model has 1-4 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('124f5b7e-04b1-8b4b-cc8b-70858956ab10', 'Eradicate the Foe', 'unique', 'Each time this model makes an attack that targets an enemy unit that is at its Starting Strength, you can re-roll the Hit roll.'),
  ('124f5b7e-04b1-8b4b-cc8b-70858956ab10', 'Agonising Suppression (Pain)', 'unique', 'In your Shooting phase, when you select this model to shoot, you can spend 1 Pain token to Empower this model. While Empowered, after this model has shot, select one enemy unit hit by one or more of those attacks. Until the start of your next turn, that enemy unit is suppressed. While a unit is suppressed, each time a model in that unit makes an attack, subtract 1 from the Hit roll.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('b1bc1088-c4de-ea84-1564-e49689c78cb2', '124f5b7e-04b1-8b4b-cc8b-70858956ab10', 'Wargear', 'Bladevanes', true, 0, NULL, NULL, NULL),
  ('78c86329-2dcf-394d-380d-4012e8740b61', '124f5b7e-04b1-8b4b-cc8b-70858956ab10', 'Weapon Option', 'Disintegrator Cannon', true, 0, NULL, 'Weapon Option', 3),
  ('1222df80-1949-f758-58aa-288337d93848', '124f5b7e-04b1-8b4b-cc8b-70858956ab10', 'Weapon Option', 'Dark Lance', false, 0, NULL, 'Weapon Option', 3)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('cdf06b80-02f2-65ea-5ea8-80a198341fc6', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Razorwing Jetfighter', 'vehicle', '20+"', 8, '4+', 10, 7, 1, '{"Razorwing Jetfighter", "Aeldari", "Aircraft", "Vehicle", "Fly"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('cdf06b80-02f2-65ea-5ea8-80a198341fc6', 1, 170);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('cdf06b80-02f2-65ea-5ea8-80a198341fc6', 'Bladed Wings', 'melee', NULL, '3', '4+', 6, -1, '1', '{}'),
  ('cdf06b80-02f2-65ea-5ea8-80a198341fc6', '➤ Razorwing Missiles - Monoscythe Missiles', 'ranged', '48"', 'D6', '3+', 6, -1, '2', '{"Blast"}'),
  ('cdf06b80-02f2-65ea-5ea8-80a198341fc6', '➤ Razorwing Missiles - Neurotoxin Missiles', 'ranged', '48"', 'D6+3', '3+', 2, 0, '1', '{"Anti-Infantry 2+", "Blast"}'),
  ('cdf06b80-02f2-65ea-5ea8-80a198341fc6', '➤ Razorwing Missiles - Shatterfield Missiles', 'ranged', '48"', 'D6', '3+', 7, -2, '1', '{"Blast"}'),
  ('cdf06b80-02f2-65ea-5ea8-80a198341fc6', 'Dark Lance', 'ranged', '36"', '1', '3+', 12, -3, 'D6+2', '{}'),
  ('cdf06b80-02f2-65ea-5ea8-80a198341fc6', 'Disintegrator Cannon', 'ranged', '36"', '3', '3+', 6, -3, '2', '{}'),
  ('cdf06b80-02f2-65ea-5ea8-80a198341fc6', 'Splinter Cannon', 'ranged', '36"', '3', '3+', 3, -1, '2', '{"Anti-Infantry 3+", "Sustained Hits 1"}'),
  ('cdf06b80-02f2-65ea-5ea8-80a198341fc6', 'Twin Splinter Rifle', 'ranged', '24"', '2', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault", "Rapid Fire 2", "Twin Linked"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('cdf06b80-02f2-65ea-5ea8-80a198341fc6', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ Invulnerable save'),
  ('cdf06b80-02f2-65ea-5ea8-80a198341fc6', 'Ground-attack Craft', 'unique', 'Each time a model in this unit makes a ranged attack that targets an enemy unit (excluding units that can ^^**Fly**^^), add 1 to the Hit roll.'),
  ('cdf06b80-02f2-65ea-5ea8-80a198341fc6', 'Nowhere to Run (Pain)', 'unique', 'In your Shooting phase, when you select this unit to shoot, you can spend 1 Pain token to Empower this unit. While Empowered, after this unit has shot, select one enemy unit (excluding ^^**Monsters**^^ and ^^**Vehicles**^^) hit by one or more of those attacks; until the start of your next turn, that enemy unit is pinned. While a unit is pinned, subtract 2 from that unit''s Move characteristic and subtract 2 from Charge rolls made for that unit.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('c0b0d743-1040-8495-de7e-d59c516815e6', 'cdf06b80-02f2-65ea-5ea8-80a198341fc6', 'Wargear', 'Bladed wings', true, 0, NULL, NULL, NULL),
  ('0f9bcb89-ff50-763a-365c-8b80ce438497', 'cdf06b80-02f2-65ea-5ea8-80a198341fc6', 'Wargear', 'Razorwing missiles', false, 0, NULL, NULL, NULL),
  ('b02ee545-487b-b36e-f22f-c15c1a4978d9', 'cdf06b80-02f2-65ea-5ea8-80a198341fc6', 'Main Weapon', 'Two dark lances', true, 0, NULL, 'Main Weapon', 1),
  ('685fd532-1fd4-5d76-f305-03023eaf43ad', 'cdf06b80-02f2-65ea-5ea8-80a198341fc6', 'Main Weapon', 'Two disintegrator cannons', false, 0, NULL, 'Main Weapon', 1),
  ('4a347137-55f4-4db1-1473-53a3b116b415', 'cdf06b80-02f2-65ea-5ea8-80a198341fc6', 'Splinter cannon', 'Splinter Cannon', true, 0, NULL, 'Splinter cannon', 1),
  ('7a59c0cc-034a-f37c-8080-bc0636e7229e', 'cdf06b80-02f2-65ea-5ea8-80a198341fc6', 'Splinter cannon', 'Twin Splinter Rifle', false, 0, NULL, 'Splinter cannon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('8a00ad4f-daf9-fcb4-e004-f39162c33888', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Reavers', 'mounted', '16"', 4, '4+', 2, 7, 2, '{"Reavers", "Wych Cult", "Aeldari", "Fly", "Mounted"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('8a00ad4f-daf9-fcb4-e004-f39162c33888', 2, 70);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('8a00ad4f-daf9-fcb4-e004-f39162c33888', 'Splinter Rifle', 'ranged', '24"', '2', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault"}'),
  ('8a00ad4f-daf9-fcb4-e004-f39162c33888', 'Splinter Pistol', 'ranged', '12"', '1', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault", "Pistol"}'),
  ('8a00ad4f-daf9-fcb4-e004-f39162c33888', 'Bladevanes', 'melee', NULL, '4', '3+', 4, -1, '1', '{"Lance"}'),
  ('8a00ad4f-daf9-fcb4-e004-f39162c33888', 'Blaster', 'ranged', '18"', '1', '3+', 8, -4, 'D6+1', '{"Assault"}'),
  ('8a00ad4f-daf9-fcb4-e004-f39162c33888', 'Heat Lance', 'ranged', '18"', '1', '3+', 14, -4, 'D6', '{"Assault", "Melta 3"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('8a00ad4f-daf9-fcb4-e004-f39162c33888', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ invulnerable save.'),
  ('8a00ad4f-daf9-fcb4-e004-f39162c33888', 'Eviscerating Fly-by', 'unique', 'Each time this unit ends a Normal or Advance move, you can select one enemy unit (excluding ^^**Monster **^^and ^^**Vehicle**^^ units) that it moved over during that move, then roll one D6 for each model in this unit: for each 4+, that enemy unit suffers 1 mortal wound.'),
  ('8a00ad4f-daf9-fcb4-e004-f39162c33888', 'Matchless Swiftness (Pain)', 'unique', 'In your Movement phase, when you select this unit to Advance, you can spend 1 Pain token to Empower this unit. While Empowered, each time this unit Advances, do not make an Advance roll. Instead, until the end of the phase, add 8" to the Move characteristic of models in this unit.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('4655d3f4-2adb-6307-7d5e-76e66475cf45', '8a00ad4f-daf9-fcb4-e004-f39162c33888', 'Reaver', 2, 5, 2, false, 0, '2-5 Reavers'),
  ('1077a6eb-5a71-cbc9-92ad-460d0176c399', '8a00ad4f-daf9-fcb4-e004-f39162c33888', 'Reaver with Blaster', 0, 1, 0, false, 1, '2-5 Reavers'),
  ('331c3c99-268f-841f-3f41-f620dbeb5496', '8a00ad4f-daf9-fcb4-e004-f39162c33888', 'Reaver with Heat Lance', 0, 1, 0, false, 2, '2-5 Reavers'),
  ('43c2c96b-b2cb-5170-3620-22a928a2f4aa', '8a00ad4f-daf9-fcb4-e004-f39162c33888', 'Arena Champion', 1, 1, 1, true, 3, 'Arena Champion')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('1b2b8d44-761e-0570-d165-b3c81340f770', '8a00ad4f-daf9-fcb4-e004-f39162c33888', '2-5 Reavers', 'Reaver', false, 0, NULL, NULL, NULL),
  ('b010a358-2e89-298a-2b70-64d12a643b84', '8a00ad4f-daf9-fcb4-e004-f39162c33888', '2-5 Reavers', 'Reaver with Blaster', false, 0, NULL, NULL, NULL),
  ('091df816-7563-36c3-8de2-e70d29de5cff', '8a00ad4f-daf9-fcb4-e004-f39162c33888', '2-5 Reavers', 'Reaver with Heat Lance', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('bd838322-60db-0760-aa60-5a9f497fb6cb', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Scourges with Heavy Weapons', 'infantry', '14"', 3, '4+', 1, 7, 1, '{"Scourges", "Aeldari", "Fly", "Infantry", "Jump Pack", "Blades for Hire", "Scourges with Heavy Weapons"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('bd838322-60db-0760-aa60-5a9f497fb6cb', 4, 130);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('bd838322-60db-0760-aa60-5a9f497fb6cb', 'Close combat weapon', 'melee', NULL, '2', '3+', 3, 0, '1', '{}'),
  ('bd838322-60db-0760-aa60-5a9f497fb6cb', 'Blaster', 'ranged', '18"', '1', '3+', 8, -4, 'D6+1', '{"Assault"}'),
  ('bd838322-60db-0760-aa60-5a9f497fb6cb', 'Heat Lance', 'ranged', '18"', '1', '4+', 14, -4, 'D6', '{"Assault", "Heavy", "Melta 3"}'),
  ('bd838322-60db-0760-aa60-5a9f497fb6cb', 'Splinter Cannon', 'ranged', '36"', '3', '4+', 3, -1, '2', '{"Anti-Infantry 3+", "Heavy", "Sustained Hits 1"}'),
  ('bd838322-60db-0760-aa60-5a9f497fb6cb', 'Shredder', 'ranged', '18"', 'D6', 'N/A', 6, 0, '1', '{"Assault", "Torrent"}'),
  ('bd838322-60db-0760-aa60-5a9f497fb6cb', 'Dark Lance', 'ranged', '36"', '1', '4+', 12, -3, 'D6+2', '{"Heavy"}'),
  ('bd838322-60db-0760-aa60-5a9f497fb6cb', 'Haywire Blaster', 'ranged', '24"', '2', '4+', 3, -1, '3', '{"Anti-Vehicle 4+", "Devastating Wounds", "Heavy"}'),
  ('bd838322-60db-0760-aa60-5a9f497fb6cb', 'Shardcarbine', 'ranged', '18"', '3', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault"}'),
  ('bd838322-60db-0760-aa60-5a9f497fb6cb', 'Blast Pistol', 'ranged', '6"', '1', '3+', 8, -3, 'D3', '{"Pistol"}'),
  ('bd838322-60db-0760-aa60-5a9f497fb6cb', 'Power Weapon', 'melee', NULL, '3', '3+', 3, -2, '1', '{"Anti-Infantry 3+"}'),
  ('bd838322-60db-0760-aa60-5a9f497fb6cb', 'Splinter Pistol', 'ranged', '12"', '1', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault", "Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('bd838322-60db-0760-aa60-5a9f497fb6cb', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save'),
  ('bd838322-60db-0760-aa60-5a9f497fb6cb', 'Airborne Evasion', 'unique', 'In your Shooting phase, after this unit has shot, if it is not within Engagement Range of any enemy units, it can make a Normal move of up to 6". If it does, until the end of the turn, this unit is not eligible to declare a charge.'),
  ('bd838322-60db-0760-aa60-5a9f497fb6cb', 'Winged Strike (Pain)', 'unique', 'In your Shooting phase, when you select this unit to shoot, you can spend 1 Pain token to Empower this unit. While Empowered, each time a model in this unit makes a range attack, you can re-roll the Hit roll.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('b72134d0-c0a5-c59c-4c9e-2454568e33e2', 'bd838322-60db-0760-aa60-5a9f497fb6cb', 'Scourge with Heavy Weapon', 0, 4, 0, false, 0, '4 Scourges'),
  ('73055945-4b1a-63c4-28e3-d5077e69f2b6', 'bd838322-60db-0760-aa60-5a9f497fb6cb', 'Solarite', 1, 1, 1, true, 1, 'Solarite')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('ca0ae18f-c59b-f23c-ad55-d2c33cf1b976', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Succubus', 'character', '8"', 3, '6+', 4, 7, 1, '{"Succubus", "Wych Cult", "Aeldari", "Character", "Infantry"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('ca0ae18f-c59b-f23c-ad55-d2c33cf1b976', 1, 50);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('ca0ae18f-c59b-f23c-ad55-d2c33cf1b976', 'Archite glaive and agoniser', 'melee', NULL, '7', '2+', 3, -2, '1', '{"Anti-Infantry 3+", "Precision"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('ca0ae18f-c59b-f23c-ad55-d2c33cf1b976', 'Invulnerable Save', 'invulnerable', 'This unit has a 4+ Invulnerable save'),
  ('ca0ae18f-c59b-f23c-ad55-d2c33cf1b976', 'Lithe Agility (Pain)', 'unique', 'In your Movement phase when you select this model''s unit to Advance, or in your Charge phase before you make a Charge roll for this model''s unit, you can spend 1 Pain token to Empower that unit. While that unit is Empowered, you can re-roll Advance and Charge rolls made for that unit.'),
  ('ca0ae18f-c59b-f23c-ad55-d2c33cf1b976', 'Storm of Blades', 'unique', 'While this model is leading a unit, melee weapons equipped by models in that unit have the ^^**[Sustained Hits 1]**^^ ability.'),
  ('ca0ae18f-c59b-f23c-ad55-d2c33cf1b976', 'Leader', 'core', 'This model can be attached to the following unit:
■ Wyches'),
  ('ca0ae18f-c59b-f23c-ad55-d2c33cf1b976', 'Bloody Spectacle', 'unique', 'Each time this model makes a melee attack that targets a ^^**Character**^^ unit, you can re-roll the Hit roll and you can re-roll the Wound roll. Each time this model''s unit destroys a ^^**Character**^^ model, you gain 1CP.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('d8267c90-605b-485d-7724-ec4d8df3107e', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Talos', 'monster', '7"', 7, '3+', 7, 7, 2, '{"Talos", "Aeldari", "Haemonculus Covens", "Monster", "Fly"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('d8267c90-605b-485d-7724-ec4d8df3107e', 1, 80);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('d8267c90-605b-485d-7724-ec4d8df3107e', 'Macro-Scalpel', 'melee', NULL, '5', '3+', 7, -2, '2', '{}'),
  ('d8267c90-605b-485d-7724-ec4d8df3107e', 'Talos Ichor Injector', 'melee', NULL, '1', '2+', 8, -2, 'D6', '{"Extra Attacks"}'),
  ('d8267c90-605b-485d-7724-ec4d8df3107e', 'Twin Liquifier Gun', 'ranged', '12"', 'D6', 'N/A', 4, -1, '1', '{"Anti-Infantry 3+", "Torrent", "Twin-Linked"}'),
  ('d8267c90-605b-485d-7724-ec4d8df3107e', 'Chain-flails', 'melee', NULL, '8', '3+', 6, -1, '1', '{}'),
  ('d8267c90-605b-485d-7724-ec4d8df3107e', 'Talos Gauntlet', 'melee', NULL, '5', '4+', 9, -2, '3', '{}'),
  ('d8267c90-605b-485d-7724-ec4d8df3107e', 'Twin Splinter Cannon', 'ranged', '36"', '3', '3+', 3, -1, '2', '{"Anti-Infantry 3+", "Sustained hits 1", "Twin-Linked"}'),
  ('d8267c90-605b-485d-7724-ec4d8df3107e', 'Twin Haywire Blaster', 'ranged', '24"', '2', '3+', 3, -1, '3', '{"Anti-Vehicle 4+", "Devastating Wounds", "Twin-Linked"}'),
  ('d8267c90-605b-485d-7724-ec4d8df3107e', 'Twin heat lance', 'ranged', '18"', '1', '3+', 14, -4, 'D6', '{"Assault", "Melta 3", "Twin-Linked"}'),
  ('d8267c90-605b-485d-7724-ec4d8df3107e', 'Stinger Pod', 'ranged', '24"', '2D6', '3+', 5, 0, '1', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('d8267c90-605b-485d-7724-ec4d8df3107e', 'Torture Device', 'unique', 'Each time this unit destroys an enemy unit, you gain 1 additional Pain token.'),
  ('d8267c90-605b-485d-7724-ec4d8df3107e', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ Invulnerable save'),
  ('d8267c90-605b-485d-7724-ec4d8df3107e', 'Devoted to Pain', 'unique', 'If a model in this unit is equipped with 2 macro-scalpels, those weapons have the ^^**[Twin-Linked]**^^ ability.'),
  ('d8267c90-605b-485d-7724-ec4d8df3107e', 'Mindless Killing Machines (Pain)', 'unique', 'At the start of the Fight phase, you can spend 1 Pain token to Empower this unit. While Empowered, each time a model in this unit is destroyed by a melee attack, if that model has not fought this phase, roll one D6. On a 2+, do not remove it from play; that destroyed model can fight after the attacking unit has finished making its attacks, and it is then removed from play.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('ffa063f9-5f71-744e-69cf-54097b008aa4', 'd8267c90-605b-485d-7724-ec4d8df3107e', 'Talos', 1, 2, 1, false, 2, NULL)
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('325a94dc-aa9a-51db-3f17-c50b94189711', 'd8267c90-605b-485d-7724-ec4d8df3107e', 'Talos: Arm 1', 'Macro-Scalpel', true, 0, 'ffa063f9-5f71-744e-69cf-54097b008aa4', 'Arm 1', 1),
  ('aa7bab3c-da32-03c7-dbec-6f6fac6fa69d', 'd8267c90-605b-485d-7724-ec4d8df3107e', 'Talos: Arm 1', 'Talos Ichor Injector', false, 0, 'ffa063f9-5f71-744e-69cf-54097b008aa4', 'Arm 1', 1),
  ('b314e4b4-4318-a46a-ed4a-0e58d4f20656', 'd8267c90-605b-485d-7724-ec4d8df3107e', 'Talos: Arm 1', 'Twin Liquifier Gun', false, 0, 'ffa063f9-5f71-744e-69cf-54097b008aa4', 'Arm 1', 1),
  ('0f099b7c-7e36-ed5b-9f6e-8e1d2e8da186', 'd8267c90-605b-485d-7724-ec4d8df3107e', 'Talos: Arm 2', 'Chain-flails', true, 0, 'ffa063f9-5f71-744e-69cf-54097b008aa4', 'Arm 2', 1),
  ('42de27da-515f-8d68-01cf-99c91562f042', 'd8267c90-605b-485d-7724-ec4d8df3107e', 'Talos: Arm 2', 'Talos Gauntlet', false, 0, 'ffa063f9-5f71-744e-69cf-54097b008aa4', 'Arm 2', 1),
  ('4f6762c0-15c8-9b06-b43a-3f92d877df59', 'd8267c90-605b-485d-7724-ec4d8df3107e', 'Talos: Arm 2', 'Macro-Scalpel', false, 0, 'ffa063f9-5f71-744e-69cf-54097b008aa4', 'Arm 2', 1),
  ('a174854c-1c76-b211-162f-1be7cf0b9088', 'd8267c90-605b-485d-7724-ec4d8df3107e', 'Talos: Tail Weapon', 'Twin Splinter Cannon', true, 0, 'ffa063f9-5f71-744e-69cf-54097b008aa4', 'Tail Weapon', 1),
  ('99c106f6-3694-1f6d-e5de-b7982660ab81', 'd8267c90-605b-485d-7724-ec4d8df3107e', 'Talos: Tail Weapon', 'Twin Haywire Blasters', false, 0, 'ffa063f9-5f71-744e-69cf-54097b008aa4', 'Tail Weapon', 1),
  ('698bea8c-2303-e6f6-2512-4c480dad9f2d', 'd8267c90-605b-485d-7724-ec4d8df3107e', 'Talos: Tail Weapon', 'Twin Heat Lance', false, 0, 'ffa063f9-5f71-744e-69cf-54097b008aa4', 'Tail Weapon', 1),
  ('3f6af25a-f908-fa6e-895c-6b79c89e5c79', 'd8267c90-605b-485d-7724-ec4d8df3107e', 'Talos: Tail Weapon', 'Stinger Pod', false, 0, 'ffa063f9-5f71-744e-69cf-54097b008aa4', 'Tail Weapon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('ea9799ab-7a61-86c1-51bc-ac7aa7dcbd41', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Urien Rakarth', 'epic_hero', '7"', 4, '6+', 5, 6, 1, '{"Urien Rakarth", "Haemonculus Covens", "Aeldari", "Haemonculus", "Character", "Epic Hero", "Infantry"}', 1, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('ea9799ab-7a61-86c1-51bc-ac7aa7dcbd41', 1, 80);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('ea9799ab-7a61-86c1-51bc-ac7aa7dcbd41', 'Haemonculus tools and scissorhands', 'melee', NULL, '5', '2+', 3, -1, 'D3', '{"Anti-Infantry 2+", "Precision"}'),
  ('ea9799ab-7a61-86c1-51bc-ac7aa7dcbd41', 'Casket of Flensing', 'ranged', '12"', '3D6', 'N/A', 3, -1, '1', '{"Devastating Wounds", "One Shot", "Torrent"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('ea9799ab-7a61-86c1-51bc-ac7aa7dcbd41', 'Invulnerable Save', 'invulnerable', 'This unit has a 4+ Invulnerable save'),
  ('ea9799ab-7a61-86c1-51bc-ac7aa7dcbd41', 'Leader', 'core', 'This model can be attached to the following unit:
■ Wracks'),
  ('ea9799ab-7a61-86c1-51bc-ac7aa7dcbd41', 'Horrific Regeneration', 'unique', 'The first time this model is destroyed, roll one D6 at the end of the phase. On a 2+, set this model back up on the battlefield, as close as possible to where it was destroyed and not within Engagement Range of any enemy units, with its full wounds remaining'),
  ('ea9799ab-7a61-86c1-51bc-ac7aa7dcbd41', 'Sculptor of Torments (Pain)', 'unique', 'In your Fight phase, when you select this model’s unit to fight, you can spend 1 of your Pain tokens to Empower this model’s unit. While that unit is Empowered, each time a model in that unit makes a melee attack, add 1 to the Wound roll.'),
  ('ea9799ab-7a61-86c1-51bc-ac7aa7dcbd41', 'Father of Pain', 'unique', 'Each time an attack with a Damage characteristic of 1 is allocated to a model in this model’s unit, that model has the Feel No Pain 4+ ability against that attack.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('ed8e27bf-7ca3-4fd8-c1ec-5b6a9e350081', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Venom', 'dedicated_transport', '14"', 6, '4+', 6, 7, 1, '{"Venom", "Aeldari", "Fly", "Dedicated Transport", "Transport", "Vehicle"}', 6, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('ed8e27bf-7ca3-4fd8-c1ec-5b6a9e350081', 1, 70);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('ed8e27bf-7ca3-4fd8-c1ec-5b6a9e350081', 'Bladevanes', 'melee', NULL, '3', '4+', 5, -1, '1', '{}'),
  ('ed8e27bf-7ca3-4fd8-c1ec-5b6a9e350081', 'Splinter Cannon', 'ranged', '36"', '3', '3+', 3, -1, '2', '{"Anti-Infantry 3+", "Sustained hits 1"}'),
  ('ed8e27bf-7ca3-4fd8-c1ec-5b6a9e350081', 'Twin Splinter Rifle', 'ranged', '24"', '2', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault", "Rapid Fire 2", "Twin Linked"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('ed8e27bf-7ca3-4fd8-c1ec-5b6a9e350081', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ Invulnerable save'),
  ('ed8e27bf-7ca3-4fd8-c1ec-5b6a9e350081', 'Aerialists', 'unique', 'At the end of the Fight phase, if there are no models currently embarked within this ^^**Transport**^^, you can select one friendly ^^**Drukhari Infantry**^^ unit that has 6 or fewer models that is wholly within 6" of this ^^**Transport**^^ (you cannot select a unit that can ^^**Fly**^^). Unless that unit is within Engagement Range of one or more enemy units, it can embark within this ^^**Transport**^^.'),
  ('ed8e27bf-7ca3-4fd8-c1ec-5b6a9e350081', 'Rapid Deployment (Pain)', 'unique', 'In your Movement phase, when you select this model to Advance, you can spend 1 Pain token to Empower this model. While Empowered, units can disembark from this model after it has Advanced. Units that do so count as having made a Normal move that phase, and cannot declare a charge in the same turn, but can otherwise act normally in the remainder of the turn.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('8d170a76-2d93-3ff7-700f-bb19e0e5331f', 'ed8e27bf-7ca3-4fd8-c1ec-5b6a9e350081', 'Wargear', 'Bladevanes', true, 0, NULL, NULL, NULL),
  ('d1828b37-cf50-4094-78fe-7be003e185ef', 'ed8e27bf-7ca3-4fd8-c1ec-5b6a9e350081', 'Wargear', 'Splinter Cannon', false, 0, NULL, NULL, NULL),
  ('df23d6b7-89b5-1feb-60a1-89dffd2afa49', 'ed8e27bf-7ca3-4fd8-c1ec-5b6a9e350081', 'Weapon Option', 'Splinter Cannon', true, 0, NULL, 'Weapon Option', 1),
  ('099fe146-bfe1-11c6-fe98-9ff95fdb1225', 'ed8e27bf-7ca3-4fd8-c1ec-5b6a9e350081', 'Weapon Option', 'Twin Splinter Rifle', false, 0, NULL, 'Weapon Option', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('f0067ce3-699c-3bfa-22af-97e248fdfd17', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Voidraven Bomber', 'vehicle', '20+"', 9, '4+', 12, 7, 1, '{"Voidraven", "Aeldari", "Aircraft", "Vehicle", "Fly"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('f0067ce3-699c-3bfa-22af-97e248fdfd17', 1, 245);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('f0067ce3-699c-3bfa-22af-97e248fdfd17', 'Bladed Wings', 'melee', NULL, '3', '4+', 6, -1, '1', '{}'),
  ('f0067ce3-699c-3bfa-22af-97e248fdfd17', '➤ Voidraven Missiles -  Implosion Missiles', 'ranged', '48"', 'D3', '3+', 9, -2, '3', '{"Blast"}'),
  ('f0067ce3-699c-3bfa-22af-97e248fdfd17', '➤ Voidraven Missiles - Shatterfield Missiles', 'ranged', '48"', 'D6', '3+', 7, -2, '1', '{"Blast"}'),
  ('f0067ce3-699c-3bfa-22af-97e248fdfd17', 'Void Lance', 'ranged', '36"', '2', '3+', 14, -4, 'D6+2', '{}'),
  ('f0067ce3-699c-3bfa-22af-97e248fdfd17', 'Dark Scythe', 'ranged', '24"', '6', '3+', 8, -4, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('f0067ce3-699c-3bfa-22af-97e248fdfd17', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ Invulnerable save'),
  ('f0067ce3-699c-3bfa-22af-97e248fdfd17', 'Damaged: 1-4 Wounds Remaining', 'unique', 'While this model has 1-4 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('f0067ce3-699c-3bfa-22af-97e248fdfd17', 'Void Mine', 'unique', 'Once per battle, after this unit ends a Normal move, you can select one enemy model that it moved over during that move, then roll one D6 for each enemy unit within D6" of that enemy model: on a 4+, that enemy unit suffers D6 mortal wounds.'),
  ('f0067ce3-699c-3bfa-22af-97e248fdfd17', 'Nowhere to Hide (Pain)', 'unique', 'In your Shooting phase, when you select this unit to shoot, you can spend 1 Pain token to Empower this unit. While Empowered, after this unit has shot, select one enemy unit hit by one or more of those attacks. Until the end of the phase, that enemy unit cannot have the Benefit of Cover.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('04c26f0c-d3c0-3599-b118-7fa6ce5b7689', 'f0067ce3-699c-3bfa-22af-97e248fdfd17', 'Wargear', 'Bladed wings', true, 0, NULL, NULL, NULL),
  ('2f8e2b5a-497f-1370-e4a1-5cbabbd76f3b', 'f0067ce3-699c-3bfa-22af-97e248fdfd17', 'Wargear', 'Voidraven Missiles', false, 0, NULL, NULL, NULL),
  ('4eceea66-9d75-facc-db6a-2407bc3b6913', 'f0067ce3-699c-3bfa-22af-97e248fdfd17', 'Weapon Option', '2 Void Lances', true, 0, NULL, 'Weapon Option', 1),
  ('107283fe-d8ef-b693-3c06-ef8bb56d1d1a', 'f0067ce3-699c-3bfa-22af-97e248fdfd17', 'Weapon Option', '2 Dark Scythes', false, 0, NULL, 'Weapon Option', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('1015a80f-e71f-3c73-477a-f365d0ff4980', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Wracks', 'battleline', '7"', 4, '5+', 2, 7, 2, '{"Wracks", "Haemonculus Covens", "Aeldari", "Battleline", "Infantry"}', 6, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('1015a80f-e71f-3c73-477a-f365d0ff4980', 4, 65);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('1015a80f-e71f-3c73-477a-f365d0ff4980', 'Torturer''s tool', 'melee', NULL, '2', '3+', 4, -1, '1', '{"Anti-Infantry 4+"}'),
  ('1015a80f-e71f-3c73-477a-f365d0ff4980', 'Hexrifle', 'ranged', '36"', '1', '3+', 8, -2, '3', '{"Heavy", "Precision"}'),
  ('1015a80f-e71f-3c73-477a-f365d0ff4980', 'Liquifier Gun', 'ranged', '12"', 'D6', 'N/A', 4, -1, '1', '{"Anti-Infantry 3+", "Torrent"}'),
  ('1015a80f-e71f-3c73-477a-f365d0ff4980', 'Ossefactor', 'ranged', '24"', '1', '3+', 2, -2, '2', '{"Anti-Infantry 4+", "Devastating Wounds"}'),
  ('1015a80f-e71f-3c73-477a-f365d0ff4980', 'Stinger Pistol', 'ranged', '12"', '1', '3+', 2, 0, '1', '{"Anti-infantry 2+", "Pistol"}'),
  ('1015a80f-e71f-3c73-477a-f365d0ff4980', 'Power weapon', 'melee', NULL, '3', '3+', 5, -2, '1', '{"Anti-Infantry 3+"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('1015a80f-e71f-3c73-477a-f365d0ff4980', 'Torturer’s Craft', 'unique', 'In your Shooting phase and the Fight phase, after this unit has shot or fought, select one enemy unit (excluding ^^**Vehicles**^^) hit by one or more of those attacks. That units must take a Battle-shock test.'),
  ('1015a80f-e71f-3c73-477a-f365d0ff4980', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ Invulnerable save'),
  ('1015a80f-e71f-3c73-477a-f365d0ff4980', 'Experimental Enhancements (Pain)', 'unique', 'In the Fight phase, when you select this unit to fight, you can spend 1 Pain token to Empower this unit. Each time you do, select one of the following to apply to this unit until the end of the phase:

■ Melee weapons equipped by non-^^**Character**^^ models in this unit have an Attacks characteristic of 3.
■ Melee weapons equipped by non-^^**Character**^^ models in this unit have an Attacks characteristic of 4 and the ^^**[Hazardous]**^^ ability.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('b6c087ff-d483-436d-81ea-c449e0b3bffc', '1015a80f-e71f-3c73-477a-f365d0ff4980', 'Wrack', 0, 9, 0, false, 0, '4-9 Wracks'),
  ('55353bba-9bcd-a4f8-3aae-60c9248ec0b2', '1015a80f-e71f-3c73-477a-f365d0ff4980', 'Wrack with Hexrifle', 0, 2, 0, false, 1, '4-9 Wracks'),
  ('95ba4f0e-7f94-0894-c9b6-27ee00a0292f', '1015a80f-e71f-3c73-477a-f365d0ff4980', 'Wrack with Liquifier Gun', 0, 2, 0, false, 2, '4-9 Wracks'),
  ('f0d72128-1484-4f14-4325-abd3faae0155', '1015a80f-e71f-3c73-477a-f365d0ff4980', 'Wrack with Ossefactor', 0, 2, 0, false, 3, '4-9 Wracks'),
  ('cdcb086f-5eb8-dee6-6610-20709f7dcc2b', '1015a80f-e71f-3c73-477a-f365d0ff4980', 'Wrack with Stinger Pistol', 0, 2, 0, false, 4, '4-9 Wracks'),
  ('8c4dad48-d9b2-33ef-7eca-98e633fb931d', '1015a80f-e71f-3c73-477a-f365d0ff4980', 'Acothyst', 1, 1, 1, true, 5, 'Acothyst')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('01e703fb-fb24-570d-33ae-9babd6d3336f', '1015a80f-e71f-3c73-477a-f365d0ff4980', '4-9 Wracks', 'Wrack', true, 0, NULL, NULL, NULL),
  ('06303b11-bcf7-3e85-893b-3610de49993d', '1015a80f-e71f-3c73-477a-f365d0ff4980', '4-9 Wracks', 'Wrack with Hexrifle', false, 0, NULL, NULL, NULL),
  ('9f050d17-5e17-442b-0250-4323cee53475', '1015a80f-e71f-3c73-477a-f365d0ff4980', '4-9 Wracks', 'Wrack with Liquifier Gun', false, 0, NULL, NULL, NULL),
  ('45ffc688-bdce-32b4-ddea-8cee7d9fc4bb', '1015a80f-e71f-3c73-477a-f365d0ff4980', '4-9 Wracks', 'Wrack with Ossefactor', false, 0, NULL, NULL, NULL),
  ('816c282d-48b7-9d77-858a-a01ceb29f678', '1015a80f-e71f-3c73-477a-f365d0ff4980', '4-9 Wracks', 'Wrack with Stinger Pistol', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('09ad0a4a-95b1-c295-e022-542d38f67f63', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Wyches', 'battleline', '8"', 3, '6+', 1, 7, 2, '{"Wyches", "Wych Cult", "Aeldari", "Battleline", "Infantry"}', 6, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('09ad0a4a-95b1-c295-e022-542d38f67f63', 9, 90);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('09ad0a4a-95b1-c295-e022-542d38f67f63', 'Splinter Pistol', 'ranged', '12"', '1', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault", "Pistol"}'),
  ('09ad0a4a-95b1-c295-e022-542d38f67f63', 'Hekatarii Blade', 'melee', NULL, '4', '3+', 3, -1, '1', '{}'),
  ('09ad0a4a-95b1-c295-e022-542d38f67f63', 'Gladiatorial weapons', 'melee', NULL, '5', '3+', 4, -2, '1', '{}'),
  ('09ad0a4a-95b1-c295-e022-542d38f67f63', 'Blast Pistol', 'ranged', '6"', '1', '3+', 8, -4, 'D3', '{"Pistol"}'),
  ('09ad0a4a-95b1-c295-e022-542d38f67f63', 'Power weapon', 'melee', NULL, '5', '3+', 3, -2, '1', '{"Anti-Infantry 3+"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('09ad0a4a-95b1-c295-e022-542d38f67f63', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ Invulnerable save.
This unit has a 4+ Invulnerable save against melee attacks.'),
  ('09ad0a4a-95b1-c295-e022-542d38f67f63', 'No Escape', 'unique', 'Each time an enemy unit (excluding ^^**Monsters**^^ and ^^**Vehicles**^^) within Engagement Range of one or more units from your army with this ability Falls Back, all models in that enemy unit must take Desperate Escape test. When doing so, if that enemy unit is Battle-shocked, subtract 1 from each of those tests.'),
  ('09ad0a4a-95b1-c295-e022-542d38f67f63', 'Acrobatic Gladiators (Pain)', 'unique', 'At the start of your Charge phase, you can spend 1 Pain token to Empower this unit. While Empowered, this unit is eligible to declare a charge in a turn in which it Advanced or Fell Back.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('c127e38f-ee61-303a-af8f-4d2992bf732a', '09ad0a4a-95b1-c295-e022-542d38f67f63', 'Wych', 6, 9, 6, false, 0, '9 Wyches'),
  ('53773e2e-6fa4-3b00-f08e-326b6b6db368', '09ad0a4a-95b1-c295-e022-542d38f67f63', 'Wych w/ Gladiatorial weapons', 0, 3, 0, false, 1, '9 Wyches'),
  ('ad925d00-4196-5988-b0f5-84175d81c87b', '09ad0a4a-95b1-c295-e022-542d38f67f63', 'Hekatrix', 1, 1, 1, true, 2, 'Hekatrix')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('cba4ebe4-b706-a42f-d018-d7a68b81e716', '09ad0a4a-95b1-c295-e022-542d38f67f63', '9 Wyches', 'Wych', true, 0, NULL, NULL, NULL),
  ('a0caf3fe-6d32-afa3-9890-1943baf8b1b1', '09ad0a4a-95b1-c295-e022-542d38f67f63', '9 Wyches', 'Wych w/ Gladiatorial weapons', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('10a1953b-a326-00ed-3c3b-36aac9e63fbc', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Cobra', 'vehicle', '14"', 11, '2+', 24, 6, 8, '{"Vehicle", "Titanic", "Fly", "Cobra", "Aeldari"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('10a1953b-a326-00ed-3c3b-36aac9e63fbc', 1, 415);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('10a1953b-a326-00ed-3c3b-36aac9e63fbc', 'D-Impaler', 'ranged', '36"', 'D6+3', '3+', 16, -4, '4', '{"Blast", "Devastating Wounds"}'),
  ('10a1953b-a326-00ed-3c3b-36aac9e63fbc', 'Wraithbone Hull', 'melee', NULL, '6', '4+', 6, 0, '1', '{}'),
  ('10a1953b-a326-00ed-3c3b-36aac9e63fbc', '➤ Aeldari missile launcher - starshot', 'ranged', '48"', '1', '3+', 10, -2, 'D6', '{}'),
  ('10a1953b-a326-00ed-3c3b-36aac9e63fbc', '➤ Aeldari missile launcher - sunburst', 'ranged', '48"', 'D6', '3+', 4, -1, '1', '{"Blast"}'),
  ('10a1953b-a326-00ed-3c3b-36aac9e63fbc', 'Bright Lance', 'ranged', '36"', '1', '3+', 12, -3, 'D6+2', '{}'),
  ('10a1953b-a326-00ed-3c3b-36aac9e63fbc', 'Scatter Laser', 'ranged', '36"', '6', '3+', 5, 0, '1', '{}'),
  ('10a1953b-a326-00ed-3c3b-36aac9e63fbc', 'Starcannon', 'ranged', '36"', '2', '3+', 8, -3, '2', '{}'),
  ('10a1953b-a326-00ed-3c3b-36aac9e63fbc', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Sustained Hits 1"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('10a1953b-a326-00ed-3c3b-36aac9e63fbc', 'Damaged: 1-8 Wounds Remaining', 'unique', 'While this model has 1-8 wounds remaining, subtract 4 from
its Objective Control characteristic and each time this model
makes an attack, subtract 1 from the Hit roll'),
  ('10a1953b-a326-00ed-3c3b-36aac9e63fbc', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save'),
  ('10a1953b-a326-00ed-3c3b-36aac9e63fbc', 'D-Rift', 'unique', 'In your Shooting phase, just after selecting a target for this model’s D-impaler, roll one D6 for the target unit and every other unit within 3" of that unit: on a 5+, the unit being rolled for is struck by a D-rift. After this model has finished making its attacks against that target unit this phase, each unit struck by a D-rift this phase suffers D3 mortal wounds.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('64cde16d-c64a-f667-9eb3-822418262a9c', '10a1953b-a326-00ed-3c3b-36aac9e63fbc', 'Wargear', 'D-Impaler', true, 0, NULL, NULL, NULL),
  ('5f518752-a067-4b06-fba2-a75d46ce6236', '10a1953b-a326-00ed-3c3b-36aac9e63fbc', 'Wargear', 'Wraithbone hull', false, 0, NULL, NULL, NULL),
  ('11e3f121-a63a-cedc-237f-8e2134e5d82e', '10a1953b-a326-00ed-3c3b-36aac9e63fbc', 'Wargear', 'Heavy Weapons [Legends]', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('2592b43c-234a-1d76-0868-8d922b446521', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Scorpion', 'vehicle', '14"', 11, '2+', 24, 6, 8, '{"Scorpion", "Vehicle", "Fly", "Titanic", "Aeldari"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('2592b43c-234a-1d76-0868-8d922b446521', 1, 410);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('2592b43c-234a-1d76-0868-8d922b446521', 'Twin Scorpion Pulsar', 'ranged', '60"', '6', '3+', 18, -3, '5', '{"Twin-Linked"}'),
  ('2592b43c-234a-1d76-0868-8d922b446521', 'Wraithbone Hull', 'melee', NULL, '6', '4+', 6, 0, '1', '{}'),
  ('2592b43c-234a-1d76-0868-8d922b446521', '➤ Aeldari missile launcher - starshot', 'ranged', '48"', '1', '3+', 10, -2, 'D6', '{}'),
  ('2592b43c-234a-1d76-0868-8d922b446521', '➤ Aeldari missile launcher - sunburst', 'ranged', '48"', 'D6', '3+', 4, -1, '1', '{"Blast"}'),
  ('2592b43c-234a-1d76-0868-8d922b446521', 'Bright Lance', 'ranged', '36"', '1', '3+', 12, -3, 'D6+2', '{}'),
  ('2592b43c-234a-1d76-0868-8d922b446521', 'Scatter Laser', 'ranged', '36"', '6', '3+', 5, 0, '1', '{}'),
  ('2592b43c-234a-1d76-0868-8d922b446521', 'Starcannon', 'ranged', '36"', '2', '3+', 8, -3, '2', '{}'),
  ('2592b43c-234a-1d76-0868-8d922b446521', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Sustained Hits 1"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('2592b43c-234a-1d76-0868-8d922b446521', 'Damaged: 1-8 Wounds Remaining', 'unique', 'While this model has 1-8 wounds remaining, subtract 4 from
its Objective Control characteristic and each time this model
makes an attack, subtract 1 from the Hit roll'),
  ('2592b43c-234a-1d76-0868-8d922b446521', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save'),
  ('2592b43c-234a-1d76-0868-8d922b446521', 'Lanced Obliteration', 'unique', 'Each time an attack made with this model’s twin Scorpion pulsar destroys an enemy model that has the Deadly Demise ability, that model’s Deadly Demise ability inflicts mortal wounds on a D6 roll of 4+ instead of on a 6.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('429d800c-b777-ab3b-db1d-f623817bcd7b', '2592b43c-234a-1d76-0868-8d922b446521', 'Wargear', 'Twin Scorpion Pulsar', true, 0, NULL, NULL, NULL),
  ('82b4417c-21b6-6c15-7993-b3b377a298f1', '2592b43c-234a-1d76-0868-8d922b446521', 'Wargear', 'Wraithbone hull', false, 0, NULL, NULL, NULL),
  ('67730cc0-ba8f-6c18-e35b-1da332cfe68a', '2592b43c-234a-1d76-0868-8d922b446521', 'Wargear', 'Heavy Weapons [Legends]', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('f84f8fa8-c90b-d644-51e6-44ded356ad6f', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Hornet', 'vehicle', '14"', 7, '3+', 8, 6, 2, '{"Vehicle", "Fly", "Hornet", "Aeldari"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('f84f8fa8-c90b-d644-51e6-44ded356ad6f', 1, 100);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('f84f8fa8-c90b-d644-51e6-44ded356ad6f', 'Wraithbone Hull', 'melee', NULL, '3', '4+', 6, 0, '1', '{}'),
  ('f84f8fa8-c90b-d644-51e6-44ded356ad6f', '➤ Aeldari Missile Launcher - Starshot', 'ranged', '48"', '1', '3+', 10, -2, 'D6', '{}'),
  ('f84f8fa8-c90b-d644-51e6-44ded356ad6f', '➤ Aeldari Missile Launcher - Sunburst', 'ranged', '48"', 'D6', '3+', 4, -1, '1', '{"Blast"}'),
  ('f84f8fa8-c90b-d644-51e6-44ded356ad6f', 'Bright Lance', 'ranged', '36"', '1', '3+', 12, -3, 'D6+2', '{}'),
  ('f84f8fa8-c90b-d644-51e6-44ded356ad6f', 'Scatter Laser', 'ranged', '36"', '6', '3+', 5, 0, '1', '{}'),
  ('f84f8fa8-c90b-d644-51e6-44ded356ad6f', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Sustained Hits 1"}'),
  ('f84f8fa8-c90b-d644-51e6-44ded356ad6f', 'Starcannon', 'ranged', '36"', '2', '3+', 8, -3, '2', '{}'),
  ('f84f8fa8-c90b-d644-51e6-44ded356ad6f', 'Hornet Pulse Laser', 'ranged', '36"', '2', '3+', 9, -2, 'D3', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('f84f8fa8-c90b-d644-51e6-44ded356ad6f', 'Lightning Assault', 'unique', 'Each time this model ends a Normal move, you can select one enemy unit (excluding ^^Monster^^ and ^^Vehicle^^ units) that it moved over during that move, then roll six D6: for each 4+, that enemy unit suffers 1 mortal wound.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('7fb73afb-13e8-34a5-7dda-53c01846f8be', 'f84f8fa8-c90b-d644-51e6-44ded356ad6f', 'Wargear', 'Aeldari Missile Launcher', true, 0, NULL, 'Wargear', 2),
  ('6416ac65-078a-e298-8d9c-67cda1dcce92', 'f84f8fa8-c90b-d644-51e6-44ded356ad6f', 'Wargear', 'Bright Lance', false, 0, NULL, 'Wargear', 2),
  ('d8872858-add7-c767-290c-4d76bf4381c5', 'f84f8fa8-c90b-d644-51e6-44ded356ad6f', 'Wargear', 'Scatter Laser', false, 0, NULL, 'Wargear', 2),
  ('cd1bc9aa-10b0-d594-d182-b4d42d097b69', 'f84f8fa8-c90b-d644-51e6-44ded356ad6f', 'Wargear', 'Shuriken Cannon', false, 0, NULL, 'Wargear', 2),
  ('087667a2-3896-803a-0421-492b5e3c6106', 'f84f8fa8-c90b-d644-51e6-44ded356ad6f', 'Wargear', 'Starcannon', false, 0, NULL, 'Wargear', 2),
  ('80a41a25-748e-b269-5bfd-175233bd9f8c', 'f84f8fa8-c90b-d644-51e6-44ded356ad6f', 'Wargear', 'Hornet Pulse Laser', false, 0, NULL, 'Wargear', 2)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('96648a8e-79d8-2afb-d917-e34bb5d37774', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Irillyth', 'epic_hero', '12"', 3, '2+', 5, 6, 1, '{"Epic Hero", "Infantry", "Character", "Fly", "Irillyth", "Phoenix Lord", "Aeldari", "Jump Pack"}', 1, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('96648a8e-79d8-2afb-d917-e34bb5d37774', 1, 105);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('96648a8e-79d8-2afb-d917-e34bb5d37774', 'Spear of Starlight', 'ranged', '24"', '3', '3+', 8, -2, '4', '{}'),
  ('96648a8e-79d8-2afb-d917-e34bb5d37774', 'Spear of Starlight', 'melee', NULL, '4', '3+', 5, -2, '1', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('96648a8e-79d8-2afb-d917-e34bb5d37774', 'Invulnerable Save (Phoenix Lord)', 'invulnerable', 'Irillyth has a 4+ Invulnerable save'),
  ('96648a8e-79d8-2afb-d917-e34bb5d37774', 'Leader', 'core', 'This model can be attached to the following unit:
■ Shadow Spectres'),
  ('96648a8e-79d8-2afb-d917-e34bb5d37774', 'Reaper of Souls', 'unique', 'While this model is leading a unit, each time a model in that unit makes an attack, add 1 to the Hit roll'),
  ('96648a8e-79d8-2afb-d917-e34bb5d37774', 'Shadow of Death (Aura)', 'unique', 'While an enemy unit is within 6" of this model, each time that unit takes a Battle-shock or Leadership test, subtract 1 from that test.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('e8ffb60b-9d20-3393-e46e-cc6568ee5a2c', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Lynx', 'vehicle', '14"', 9, '3+', 16, 6, 4, '{"Vehicle", "Fly", "Lynx", "Aeldari"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('e8ffb60b-9d20-3393-e46e-cc6568ee5a2c', 1, 180);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('e8ffb60b-9d20-3393-e46e-cc6568ee5a2c', 'Lynx Pulsar', 'ranged', '48"', '4', '3+', 16, -3, 'D6', '{"Assault"}'),
  ('e8ffb60b-9d20-3393-e46e-cc6568ee5a2c', 'Wraithbone Hull', 'melee', NULL, '3', '4+', 6, 0, '1', '{}'),
  ('e8ffb60b-9d20-3393-e46e-cc6568ee5a2c', '➤ Aeldari missile launcher - starshot', 'ranged', '48"', '1', '3+', 10, -2, 'D6', '{}'),
  ('e8ffb60b-9d20-3393-e46e-cc6568ee5a2c', '➤ Aeldari missile launcher - sunburst', 'ranged', '48"', 'D6', '3+', 4, -1, '1', '{"Blast"}'),
  ('e8ffb60b-9d20-3393-e46e-cc6568ee5a2c', 'Bright Lance', 'ranged', '36"', '1', '3+', 12, -3, 'D6+2', '{}'),
  ('e8ffb60b-9d20-3393-e46e-cc6568ee5a2c', 'Scatter Laser', 'ranged', '36"', '6', '3+', 5, 0, '1', '{}'),
  ('e8ffb60b-9d20-3393-e46e-cc6568ee5a2c', 'Starcannon', 'ranged', '36"', '2', '3+', 8, -3, '2', '{}'),
  ('e8ffb60b-9d20-3393-e46e-cc6568ee5a2c', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Sustained Hits 1"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('e8ffb60b-9d20-3393-e46e-cc6568ee5a2c', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save'),
  ('e8ffb60b-9d20-3393-e46e-cc6568ee5a2c', 'Damaged: 1-5 Wounds Remaining', 'unique', 'While this model has 1-5 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('e8ffb60b-9d20-3393-e46e-cc6568ee5a2c', 'Speed of Vaul', 'unique', 'Each time this model Advances, do not make an Advance roll for it. Instead, until the end of the phase, add 9" to the Move characteristic of this model');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('7077993b-5b4d-6b4c-abc0-80afce068fbb', 'e8ffb60b-9d20-3393-e46e-cc6568ee5a2c', 'Wargear', 'Lynx Pulsar', true, 0, NULL, NULL, NULL),
  ('05e82417-9c0b-e71e-c4ad-2139bb642a72', 'e8ffb60b-9d20-3393-e46e-cc6568ee5a2c', 'Wargear', 'Wraithbone hull', false, 0, NULL, NULL, NULL),
  ('51ba94b6-207a-28db-dec1-d72818e195f2', 'e8ffb60b-9d20-3393-e46e-cc6568ee5a2c', 'Wargear', 'Heavy Weapons [Legends]', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('584c51f5-08ba-ea02-b9d7-58441ca87f33', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Nightwing', 'vehicle', '20+"', 8, '3+', 12, 6, 1, '{"Vehicle", "Fly", "Aircraft", "Nightwing", "Aeldari"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('584c51f5-08ba-ea02-b9d7-58441ca87f33', 1, 150);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('584c51f5-08ba-ea02-b9d7-58441ca87f33', 'Twin Bright Lance', 'ranged', '36"', '1', '3+', 12, -3, 'D6+2', '{"Twin-Linked"}'),
  ('584c51f5-08ba-ea02-b9d7-58441ca87f33', 'Twin Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Sustained Hits 1", "Twin-Linked"}'),
  ('584c51f5-08ba-ea02-b9d7-58441ca87f33', 'Wraithbone Hull', 'melee', NULL, '3', '4+', 6, 0, '1', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('584c51f5-08ba-ea02-b9d7-58441ca87f33', 'Damaged: 1-4 Wounds Remaining', 'unique', 'While this model has 1-4 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('584c51f5-08ba-ea02-b9d7-58441ca87f33', 'Interceptor', 'unique', 'Each time this model makes a ranged attack that targets a unit that can ^^Fly^^, add 1 to the Hit roll.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('7e0efd97-5a7c-ed57-e954-b62adc50239e', '584c51f5-08ba-ea02-b9d7-58441ca87f33', 'Wargear', 'Twin Bright Lance', true, 0, NULL, NULL, NULL),
  ('8035850c-4150-42a2-99c0-690b35d3ef90', '584c51f5-08ba-ea02-b9d7-58441ca87f33', 'Wargear', 'Twin Shuriken Cannon', false, 0, NULL, NULL, NULL),
  ('83de5a93-4486-38da-a877-6645007a53ec', '584c51f5-08ba-ea02-b9d7-58441ca87f33', 'Wargear', 'Wraithbone hull', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('6343028d-3024-c8aa-ef91-b995512d17ec', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Skathach Wraithknight', 'monster', '10"', 12, '2+', 18, 6, 10, '{"Skathach Wraithknight", "Wraith Construct", "Towering", "Titanic", "Walker", "Monster", "Aeldari"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('6343028d-3024-c8aa-ef91-b995512d17ec', 1, 490);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('6343028d-3024-c8aa-ef91-b995512d17ec', 'Titanic Feet', 'melee', NULL, '5', '3+', 8, -1, '2', '{}'),
  ('6343028d-3024-c8aa-ef91-b995512d17ec', '➤ Deathshroud Cannon - Dispersed', 'ranged', '12"', '3D6', '3+', 6, -1, '1', '{"Blast", "Devastating Wounds"}'),
  ('6343028d-3024-c8aa-ef91-b995512d17ec', '➤ Deathshroud Cannon - Focused', 'ranged', '48"', 'D6', '3+', 10, -3, '2', '{"Blast", "Devastating Wounds"}'),
  ('6343028d-3024-c8aa-ef91-b995512d17ec', 'Inferno Lance', 'ranged', '24"', '4', '3+', 12, -4, 'D6', '{"Melta 2"}'),
  ('6343028d-3024-c8aa-ef91-b995512d17ec', 'Scatter Laser', 'ranged', '36"', '6', '3+', 5, 0, '1', '{}'),
  ('6343028d-3024-c8aa-ef91-b995512d17ec', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Sustained Hits 1"}'),
  ('6343028d-3024-c8aa-ef91-b995512d17ec', 'Starcannon', 'ranged', '36"', '2', '3+', 8, -3, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('6343028d-3024-c8aa-ef91-b995512d17ec', 'Damaged: 1-6 Wounds Remaining', 'unique', 'While this model has 1-6 wounds remaining, subtract 5 from this model’s Objective Control characteristic and each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('6343028d-3024-c8aa-ef91-b995512d17ec', 'Agile', 'unique', 'Each time this model makes a Normal, Advance or Fall Back move, it can move over other models (excluding ^^Titanic^^ models) and terrain features that are 4" or less in height as if they were not there.'),
  ('6343028d-3024-c8aa-ef91-b995512d17ec', 'Webway Shunt Generator', 'unique', 'Once per battle, at the end of your opponent’s turn, if this model is not within Engagement Range of one or more enemy units, you can remove this model from the battlefield and place it into Strategic Reserves.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('e46745d5-e677-45bc-a3c5-002235bb4db4', '6343028d-3024-c8aa-ef91-b995512d17ec', 'Wargear', 'Titanic feet', true, 0, NULL, NULL, NULL),
  ('4bca21fa-007b-e16f-faea-c5508b69042d', '6343028d-3024-c8aa-ef91-b995512d17ec', 'Left Arm', 'Scattershield', true, 0, NULL, 'Left Arm', 1),
  ('db502d09-f36f-e6b9-ebb9-9fad0fc599d3', '6343028d-3024-c8aa-ef91-b995512d17ec', 'Left Arm', 'Deathshroud Cannon', false, 0, NULL, 'Left Arm', 1),
  ('b8dcd3b3-1aba-200b-2395-b5f9e6d3bb35', '6343028d-3024-c8aa-ef91-b995512d17ec', 'Left Arm', 'Inferno Lance', false, 0, NULL, 'Left Arm', 1),
  ('5899140e-aa12-9cf7-57da-896ecba670bb', '6343028d-3024-c8aa-ef91-b995512d17ec', 'Right Arm', 'Inferno Lance', true, 0, NULL, 'Right Arm', 1),
  ('8611491d-565b-326c-a79d-dae4ed988fc6', '6343028d-3024-c8aa-ef91-b995512d17ec', 'Right Arm', 'Deathshroud Cannon', false, 0, NULL, 'Right Arm', 1),
  ('bcc7da5c-4419-b265-c1be-04a6dfa95250', '6343028d-3024-c8aa-ef91-b995512d17ec', 'Secondary Weapons', 'Scatter Laser', true, 0, NULL, 'Secondary Weapons', 2),
  ('3e121576-4633-4ad4-fdd5-0ba560900bbe', '6343028d-3024-c8aa-ef91-b995512d17ec', 'Secondary Weapons', 'Shuriken Cannon', false, 0, NULL, 'Secondary Weapons', 2),
  ('7b118e99-f5b4-c641-2541-70ca7dfebf61', '6343028d-3024-c8aa-ef91-b995512d17ec', 'Secondary Weapons', 'Starcannon', false, 0, NULL, 'Secondary Weapons', 2)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('a4766991-fe96-2795-036b-200a8ddce5d3', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Shadow Spectres', 'infantry', '12"', 3, '3+', 2, 6, 1, '{"Infantry", "Fly", "Shadow Spectres", "Jump Pack", "Aeldari"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('a4766991-fe96-2795-036b-200a8ddce5d3', 6, 115);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('a4766991-fe96-2795-036b-200a8ddce5d3', '➤ Prism Rifle - dispersed', 'ranged', '18"', 'D6', '3+', 4, -1, '1', '{"Blast"}'),
  ('a4766991-fe96-2795-036b-200a8ddce5d3', '➤ Prism Rifle - focused', 'ranged', '24"', '1', '3+', 6, -2, '3', '{}'),
  ('a4766991-fe96-2795-036b-200a8ddce5d3', 'Close Combat Weapon', 'melee', NULL, '2', '3+', 3, 0, '1', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('a4766991-fe96-2795-036b-200a8ddce5d3', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save'),
  ('a4766991-fe96-2795-036b-200a8ddce5d3', 'Shade of Twilight', 'unique', 'In your Shooting phase, after this unit has shot, if it is not within Engagement Range of one or more enemy units, it can make a Normal move of up to D6". If it does, until the end of the turn, this unit is not eligible to declare a charge.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('3c0138fd-cf6d-484a-a6d3-d68102b3f492', 'a4766991-fe96-2795-036b-200a8ddce5d3', 'Shadow Spectre Exarch', 0, 1, 0, false, 2, NULL),
  ('112bc13a-38df-90fe-cc5b-7024722bad72', 'a4766991-fe96-2795-036b-200a8ddce5d3', 'Shadow Spectre', 0, 10, 0, false, 1, '5-10 Shadow Spectres')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('b2e500be-7c2b-0add-1bca-f445b68e7c82', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Phantom Titan', 'monster', '14"', 14, '2+', 55, 6, 20, '{"Phantom Titan", "Titanic", "Towering", "Walker", "Monster", "Aeldari", "Wraith Construct"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('b2e500be-7c2b-0add-1bca-f445b68e7c82', 1, 2100);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Phantom feet', 'melee', NULL, '4', '3+', 12, -2, '4', '{}'),
  ('b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Voidstorm missile launcher', 'ranged', '48"', '2D6', '3+', 8, -3, '2', '{}'),
  ('b2e500be-7c2b-0add-1bca-f445b68e7c82', 'D-bombard', 'ranged', '72"', 'D6', '3+', 20, -4, '2D6', '{"Blast", "Devastating Wounds"}'),
  ('b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Phantom pulsar', 'ranged', '120"', '8', '3+', 18, -4, '6', '{}'),
  ('b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Phantom starcannon', 'ranged', '36"', '4', '3+', 8, -3, '2', '{}'),
  ('b2e500be-7c2b-0add-1bca-f445b68e7c82', '➤ Wraith glaive - strike', 'melee', NULL, '6', '3+', 18, -4, '12', '{}'),
  ('b2e500be-7c2b-0add-1bca-f445b68e7c82', '➤ Wraith glaive - sweep', 'melee', NULL, '12', '3+', 8, -3, '4', '{}'),
  ('b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Pulse laser', 'ranged', '48"', '3', '3+', 9, -2, 'D6', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Damaged: 1-16 Wounds Remaining', 'unique', 'While this model has 1-16 wounds remaining, subtract 10 from this model’s Objective Control characteristic and each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Titanic Advance', 'unique', 'Each time this model makes a Normal, Advance or Fall Back move, it can move over models (excluding ^^Titanic^^ models) and terrain features that are 4" or less in height as if they were not there.'),
  ('b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Towering Wraith Construct', 'unique', 'Each time you target this model with a Stratagem, you must spend three times that Stratagem’s stated CP cost to do so.'),
  ('b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Invulnerable Save', 'invulnerable', 'Models in this unit have a 4+ invulnerable save against ranged attacks.'),
  ('b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Flawless Poise', 'unique', 'This model is eligible to shoot and declare a charge in a turn in which it Fell Back.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('e6dc14f4-55f1-cf70-9fdb-28002e074edf', 'b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Wargear', 'Phantom feet', true, 0, NULL, NULL, NULL),
  ('42f638e4-62c7-6453-0f95-320bff821cd5', 'b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Wargear', 'Voidstorm missile launcher', false, 0, NULL, NULL, NULL),
  ('e327afd8-8bca-c853-6b17-4ed074dbe9e7', 'b2e500be-7c2b-0add-1bca-f445b68e7c82', 'D-bombard Replacement', 'D-bombard', true, 0, NULL, 'D-bombard Replacement', 1),
  ('eba530c2-1c6c-6ada-05ce-33f57d84c28e', 'b2e500be-7c2b-0add-1bca-f445b68e7c82', 'D-bombard Replacement', '1 Phantom pulsar', false, 0, NULL, 'D-bombard Replacement', 1),
  ('18a62227-eff2-607f-f61d-9aff246ea074', 'b2e500be-7c2b-0add-1bca-f445b68e7c82', 'D-bombard Replacement', '2 Phantom starcannons & 1 wraith glaive', false, 0, NULL, 'D-bombard Replacement', 1),
  ('10358572-63b6-c300-d65e-bd4a7c17f170', 'b2e500be-7c2b-0add-1bca-f445b68e7c82', 'D-bombard Replacement', '2 pulse lasers & 1 wraith glaive', false, 0, NULL, 'D-bombard Replacement', 1),
  ('7a82ba94-7193-68e5-3fcc-d995677ce4e2', 'b2e500be-7c2b-0add-1bca-f445b68e7c82', 'D-bombard Replacement', '1 Phantom starcannon, 1 pulse laser & 1 wraith glaive', false, 0, NULL, 'D-bombard Replacement', 1),
  ('5ce08832-8b67-6e99-b5b8-82e80cae8928', 'b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Phantom pulsar Replacement', 'D-bombard', true, 0, NULL, 'Phantom pulsar Replacement', 1),
  ('c31d086e-d03c-66d6-1e5f-a003866f1d7b', 'b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Phantom pulsar Replacement', 'Phantom pulsar', false, 0, NULL, 'Phantom pulsar Replacement', 1),
  ('952ae219-c475-0124-51ed-1e633e67d1f6', 'b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Phantom pulsar Replacement', '2 Phantom starcannons & 1 wraith glaive', false, 0, NULL, 'Phantom pulsar Replacement', 1),
  ('30c63ca1-4c2c-2eca-445e-2c30b1420763', 'b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Phantom pulsar Replacement', '2 pulse lasers & 1 wraith glaive', false, 0, NULL, 'Phantom pulsar Replacement', 1),
  ('ccbce37f-ae2a-f7cb-7141-99f1fa5d4a48', 'b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Phantom pulsar Replacement', '1 Phantom starcannon, 1 pulse laser & 1 wraith glaive', false, 0, NULL, 'Phantom pulsar Replacement', 1),
  ('84b0bf01-d74d-48ef-79f7-ab28726af7fc', 'b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Phantom starcannon replacement', 'Pulse laser', true, 0, NULL, 'Phantom starcannon replacement', 1),
  ('b7320f22-864d-09e5-d4b0-8d253ee86c6f', 'b2e500be-7c2b-0add-1bca-f445b68e7c82', 'Phantom starcannon replacement', 'Phantom starcannon', false, 0, NULL, 'Phantom starcannon replacement', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('50461c5e-5359-93c9-5a4d-18fe6f73132b', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Revenant Titan', 'monster', '16"', 13, '2+', 30, 6, 16, '{"Revenant Titan", "Walker", "Towering", "Titanic", "Monster", "Fly", "Wraith Construct", "Aeldari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('50461c5e-5359-93c9-5a4d-18fe6f73132b', 1, 1100);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('50461c5e-5359-93c9-5a4d-18fe6f73132b', 'Cloudburst missile launcher', 'ranged', '36"', '2D6', '3+', 8, -2, '2', '{"Blast"}'),
  ('50461c5e-5359-93c9-5a4d-18fe6f73132b', 'Revenant feet', 'melee', NULL, '8', '3+', 10, -1, '3', '{}'),
  ('50461c5e-5359-93c9-5a4d-18fe6f73132b', 'Sonic Lance', 'ranged', '18"', 'D6+6', 'N/A', 8, -3, '2', '{"Anti-Monster 4+", "Anti-Vehicle 4+", "Assault", "Torrent"}'),
  ('50461c5e-5359-93c9-5a4d-18fe6f73132b', 'Revenant Pulsar', 'ranged', '60"', '6', '3+', 14, -3, '4', '{"Assault"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('50461c5e-5359-93c9-5a4d-18fe6f73132b', 'Invulnerable Save', 'invulnerable', 'Models in this unit have a 4+ invulnerable save against ranged attacks.'),
  ('50461c5e-5359-93c9-5a4d-18fe6f73132b', 'Damaged: 1-10 Wounds Remaining', 'unique', 'While this model has 1-10 wounds remaining, subtract 8 from this model’s Objective Control characteristic and each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('50461c5e-5359-93c9-5a4d-18fe6f73132b', 'Titanic Advance', 'unique', 'Each time this model makes a Normal, Advance or Fall Back move, it can move over models (excluding ^^Titanic^^ models) and terrain features that are 4" or less in height as if they were not there.'),
  ('50461c5e-5359-93c9-5a4d-18fe6f73132b', 'Towering Wraith Construct', 'unique', 'Each time you target this model with a Stratagem, you must spend twice that Stratagem’s stated CP cost to do so.'),
  ('50461c5e-5359-93c9-5a4d-18fe6f73132b', 'Revenant Jet Pack', 'unique', 'Each time this model Advances, do not make an Advance roll for it. Instead, until the end of the phase, add 8" to the Move characteristic of this model.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('60b8c319-86ad-5d06-a2c6-5262695c1265', '50461c5e-5359-93c9-5a4d-18fe6f73132b', 'Wargear', 'Cloudburst missile launcher', true, 0, NULL, NULL, NULL),
  ('82715b6f-a23d-db09-e299-49804e24f646', '50461c5e-5359-93c9-5a4d-18fe6f73132b', 'Wargear', 'Revenant feet', false, 0, NULL, NULL, NULL),
  ('e273f6ad-59f1-ac84-37c7-ece48dc30d88', '50461c5e-5359-93c9-5a4d-18fe6f73132b', 'Left Arm', 'Sonic Lance', true, 0, NULL, 'Left Arm', 1),
  ('5aad9acb-d62d-ce28-fc9c-89cbf3902897', '50461c5e-5359-93c9-5a4d-18fe6f73132b', 'Left Arm', 'Revenant Pulsar', false, 0, NULL, 'Left Arm', 1),
  ('bfa44bda-826c-627f-6bdd-0b335480e053', '50461c5e-5359-93c9-5a4d-18fe6f73132b', 'Right Arm', 'Sonic Lance', true, 0, NULL, 'Right Arm', 1),
  ('98f10b56-fcb1-3813-6a71-c70c703f78c7', '50461c5e-5359-93c9-5a4d-18fe6f73132b', 'Right Arm', 'Revenant Pulsar', false, 0, NULL, 'Right Arm', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('44e49c39-5e24-71c0-e2ac-eba53cf88ad6', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Warp Hunter', 'vehicle', '14"', 9, '3+', 12, 6, 3, '{"Vehicle", "Fly", "Warp Hunter", "Aeldari"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('44e49c39-5e24-71c0-e2ac-eba53cf88ad6', 1, 145);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('44e49c39-5e24-71c0-e2ac-eba53cf88ad6', '➤ D-Flail - blast', 'ranged', '24"', 'D3', '3+', 12, -4, '3', '{"Blast", "Devastating Wounds"}'),
  ('44e49c39-5e24-71c0-e2ac-eba53cf88ad6', '➤ D-Flail - rift', 'ranged', '12"', 'D3', 'N/A', 12, -4, '3', '{"Devastating Wounds", "Torrent"}'),
  ('44e49c39-5e24-71c0-e2ac-eba53cf88ad6', 'Wraithbone Hull', 'melee', NULL, '3', '4+', 6, 0, '1', '{}'),
  ('44e49c39-5e24-71c0-e2ac-eba53cf88ad6', 'Twin Shuriken Catapult', 'ranged', '18"', '2', '3+', 4, -1, '1', '{"Assault", "Twin Linked"}'),
  ('44e49c39-5e24-71c0-e2ac-eba53cf88ad6', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Sustained Hits 1"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('44e49c39-5e24-71c0-e2ac-eba53cf88ad6', 'Damaged: 1-4 Wounds Remaining', 'unique', 'While this model has 1-4 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('44e49c39-5e24-71c0-e2ac-eba53cf88ad6', 'Devastating Assault', 'unique', 'In your Shooting phase, after this model has shot, select one enemy unit hit by one or more of those attacks. That enemy unit must take a Battle-shock test.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('8e687a4c-6bcf-aa9c-3a77-73cbb8f07a74', '44e49c39-5e24-71c0-e2ac-eba53cf88ad6', 'Wargear', 'D-Flail', true, 0, NULL, NULL, NULL),
  ('e0753b75-352c-167d-3d71-7cd260224e39', '44e49c39-5e24-71c0-e2ac-eba53cf88ad6', 'Wargear', 'Wraithbone hull', false, 0, NULL, NULL, NULL),
  ('3b8117cf-ccb2-8bc3-52e8-7abcf69ee2f7', '44e49c39-5e24-71c0-e2ac-eba53cf88ad6', 'Hull weapon', 'Twin Shuriken Catapult', true, 0, NULL, 'Hull weapon', 1),
  ('ba7af018-2120-6ae5-ac55-5f780e52547e', '44e49c39-5e24-71c0-e2ac-eba53cf88ad6', 'Hull weapon', 'Shuriken Cannon', false, 0, NULL, 'Hull weapon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Wraithseer', 'monster', '8"', 11, '2+', 10, 6, 3, '{"Walker", "Monster", "Wraith Construct", "Wraithseer", "Psyker", "Aeldari"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 1, 160);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 'Destructor', 'ranged', '12"', 'D6', 'N/A', 5, -1, '1', '{"Psychic", "Torrent"}'),
  ('4807d3b6-32dc-e2fc-84f8-f8046d18c6de', '➤ Ghostspear - Strike', 'melee', NULL, '4', '4+', 10, -2, '3', '{"Anti-Infantry 2+", "Precision", "Psychic"}'),
  ('4807d3b6-32dc-e2fc-84f8-f8046d18c6de', '➤ Ghostspear - Sweep', 'melee', NULL, '12', '4+', 7, -1, '1', '{"Anti-Infantry 2+", "Psychic"}'),
  ('4807d3b6-32dc-e2fc-84f8-f8046d18c6de', '➤ Aeldari Missile Launcher - Starshot', 'ranged', '48"', '1', '4+', 10, -2, 'D6', '{}'),
  ('4807d3b6-32dc-e2fc-84f8-f8046d18c6de', '➤ Aeldari Missile Launcher - Sunburst', 'ranged', '48"', 'D6', '4+', 4, -1, '1', '{"Blast"}'),
  ('4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 'Bright Lance', 'ranged', '36"', '1', '4+', 12, -3, 'D6+2', '{}'),
  ('4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 'Scatter Laser', 'ranged', '36"', '6', '4+', 5, 0, '1', '{}'),
  ('4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 'Shuriken Cannon', 'ranged', '24"', '3', '4+', 6, -1, '2', '{"Sustained Hits 1"}'),
  ('4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 'Starcannon', 'ranged', '36"', '2', '4+', 8, -3, '2', '{}'),
  ('4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 'Wraithseer D-Cannon', 'ranged', '24"', '1', '4+', 14, -4, 'D6', '{"Devastating Wounds"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save'),
  ('4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 'Horrify (Psychic)', 'unique', 'In your Shooting phase, after this model has shot, select one enemy unit hit by one or more of those attacks. That enemy unit must take a Battle-shock test.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('139044df-feb2-15e2-0f78-9c3c4c118e5a', '4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 'Wargear', 'Destructor', true, 0, NULL, NULL, NULL),
  ('1c328c0d-8ddd-abe3-9661-04e583f35972', '4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 'Wargear', 'Ghostspear', false, 0, NULL, NULL, NULL),
  ('65c78d19-76aa-3cf5-5e67-0c60334c676a', '4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 'Weapon Option', 'Aeldari Missile Launcher', true, 0, NULL, 'Weapon Option', 1),
  ('54f1d2dc-8411-b358-df45-a24963278066', '4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 'Weapon Option', 'Bright Lance', false, 0, NULL, 'Weapon Option', 1),
  ('3e1a6ebe-879a-f02f-dc09-c7dc6b88edd7', '4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 'Weapon Option', 'Scatter Laser', false, 0, NULL, 'Weapon Option', 1),
  ('b27ad3af-3f72-42d0-c66e-2757e4de4c89', '4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 'Weapon Option', 'Shuriken Cannon', false, 0, NULL, 'Weapon Option', 1),
  ('858821d7-f72b-b37f-7ac5-f830f1a19fc0', '4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 'Weapon Option', 'Starcannon', false, 0, NULL, 'Weapon Option', 1),
  ('d43e7474-4195-90e0-fb7e-bc59a75522f8', '4807d3b6-32dc-e2fc-84f8-f8046d18c6de', 'Weapon Option', 'Wraithseer D-Cannon', false, 0, NULL, 'Weapon Option', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('c60b81df-1f70-d572-702d-f5f979a8e9c4', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Tantalus', 'vehicle', '16"', 10, '4+', 18, 7, 5, '{"Vehicle", "Transport", "Fly", "Aeldari"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('c60b81df-1f70-d572-702d-f5f979a8e9c4', 1, 230);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('c60b81df-1f70-d572-702d-f5f979a8e9c4', 'Dire Scythe Blades', 'melee', NULL, '6', '4+', 8, -1, '2', '{}'),
  ('c60b81df-1f70-d572-702d-f5f979a8e9c4', 'Pulse Disintegrators', 'ranged', '36"', '12', '3+', 10, -2, '2', '{"Assault"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('c60b81df-1f70-d572-702d-f5f979a8e9c4', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save'),
  ('c60b81df-1f70-d572-702d-f5f979a8e9c4', 'Damaged: 1-6 Wounds Remaining', 'unique', 'While this model has 1-6 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('c60b81df-1f70-d572-702d-f5f979a8e9c4', 'Scything Charge', 'unique', 'Each time this model ends a Charge move, select one enemy unit within Engagement Range of it and roll one D6: on a 2-3, that enemy unit suffers D3 mortal wounds; on a 4-5, that enemy unit suffers 3 mortal wounds; on a 6, that enemy unit suffers D3+3 mortal wounds.'),
  ('c60b81df-1f70-d572-702d-f5f979a8e9c4', 'Engine of Destruction (Pain)', 'unique', 'In your Shooting phase, when you select this model to shoot, you can spend 1 Pain token to Empower this model. While Empowered, this model’s pulse disintegrators have the ^^**[RAPID FIRE 8]**^^ ability.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('011f678b-f31a-47bb-0a3b-2583082e04bf', 'c60b81df-1f70-d572-702d-f5f979a8e9c4', 'Wargear', 'Dire Scythe Blades', true, 0, NULL, NULL, NULL),
  ('b80af337-f0fe-9e4d-bfb1-830b05199a4f', 'c60b81df-1f70-d572-702d-f5f979a8e9c4', 'Wargear', 'Pulse Disintegrators', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('9129860a-23d5-b841-ca62-2ff6142bf840', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Amallyn Shadowguide', 'epic_hero', '7"', 3, '5+', 3, 6, 1, '{"Epic Hero", "Infantry", "Character", "Aeldari", "Amallyn Shadowguide"}', 1, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('9129860a-23d5-b841-ca62-2ff6142bf840', 1, 75);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('9129860a-23d5-b841-ca62-2ff6142bf840', 'Power blade', 'melee', NULL, '4', '3+', 4, -2, '1', '{}'),
  ('9129860a-23d5-b841-ca62-2ff6142bf840', 'Ranger long rifle', 'ranged', '36"', '1', '3+', 4, -1, '2', '{"Heavy", "Precision"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('9129860a-23d5-b841-ca62-2ff6142bf840', 'The Path Least Travelled', 'unique', 'If your army includes this model, after both players have deployed their armies and determined who has the first turn, you can select one ^^Rangers^^ or ^^Shroud Runners^^ unit from your army and redeploy that unit. When doing so, that unit can be placed into Strategic Reserves, regardless of how many units are already in Strategic Reserves.'),
  ('9129860a-23d5-b841-ca62-2ff6142bf840', 'Path of the Outcast', 'unique', 'Once per turn, when an enemy unit ends a Normal, Advance or Fall Back move within 9" of this model, if this model is not within Engagement Range of one or more enemy units, it can make a Normal move of up to D6.'),
  ('9129860a-23d5-b841-ca62-2ff6142bf840', 'Invulnerable Save', 'invulnerable', 'This unit has a 4+ invulnerable save.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('e5a2871c-c784-9418-718b-6e67b11d5895', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Bonesinger', 'character', '7"', 3, '6+', 3, 6, 1, '{"Character", "Infantry", "Psyker", "Aeldari", "Bonesinger"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('e5a2871c-c784-9418-718b-6e67b11d5895', 1, 45);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('e5a2871c-c784-9418-718b-6e67b11d5895', 'Psytronome Shaper', 'melee', NULL, '2', '2+', 3, 0, 'D3', '{"Psychic"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('e5a2871c-c784-9418-718b-6e67b11d5895', 'Leader', 'core', 'This model can be attached to the following units:
■ Wraithblades
■ Wraithguard
■ Wraithlord'),
  ('e5a2871c-c784-9418-718b-6e67b11d5895', 'Invulnerable Save (Bonesinger)', 'invulnerable', 'A Bonesinger has a 4+ Invulnerable save'),
  ('e5a2871c-c784-9418-718b-6e67b11d5895', 'Way of the Shaper (Psychic)', 'unique', 'While this model is leading a unit, ^^Wraith Construct^^ models in that unit have the Feel No Pain 6+ ability.'),
  ('e5a2871c-c784-9418-718b-6e67b11d5895', 'Bonesinger', 'unique', 'While this model is within 3" of one or more friendly ^^Wraith Construct^^ or ^^Asuryani Vehicle^^ units, unless it is leading a unit, this model has the Lone Operative ability.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('b5c18fed-d405-9e5c-2ef4-46ff8bbe9a0f', 'e5a2871c-c784-9418-718b-6e67b11d5895', 'Wargear', 'Psytronome Shaper', true, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('079a2e32-ac0c-62c2-daeb-ed1cb7babf7c', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Corsair Cloud Dancer Band', 'mounted', '14"', 4, '3+', 2, 6, 2, '{"Mounted", "Anhrathe", "Corsair Cloud Dancer Band", "Corsairs and Travelling Players", "Aeldari"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('079a2e32-ac0c-62c2-daeb-ed1cb7babf7c', 4, 105);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('079a2e32-ac0c-62c2-daeb-ed1cb7babf7c', 'Close combat weapon', 'melee', NULL, '2', '3+', 3, 0, '1', '{}'),
  ('079a2e32-ac0c-62c2-daeb-ed1cb7babf7c', 'Twin shuriken catapult', 'ranged', '18"', '2', '3+', 4, -1, '1', '{"Assault", "Twin-linked"}'),
  ('079a2e32-ac0c-62c2-daeb-ed1cb7babf7c', 'Shuriken cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Sustained Hits 1"}'),
  ('079a2e32-ac0c-62c2-daeb-ed1cb7babf7c', 'Dark lance', 'ranged', '36"', '1', '3+', 12, -3, 'D6+2', '{}'),
  ('079a2e32-ac0c-62c2-daeb-ed1cb7babf7c', 'Dissonance cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Devastating Wounds"}'),
  ('079a2e32-ac0c-62c2-daeb-ed1cb7babf7c', 'Splinter cannon', 'ranged', '36"', '3', '3+', 3, -1, '2', '{"Anti-Infantry 3+", "Sustained Hits 1"}'),
  ('079a2e32-ac0c-62c2-daeb-ed1cb7babf7c', 'Void sabre', 'melee', NULL, '3', '3+', 4, -2, '1', '{}'),
  ('079a2e32-ac0c-62c2-daeb-ed1cb7babf7c', 'Dissonance pistol', 'ranged', '12"', '1', '3+', 6, -1, '1', '{"Devastating Wounds", "Pistol"}'),
  ('079a2e32-ac0c-62c2-daeb-ed1cb7babf7c', 'Brace of pistols', 'ranged', '12"', '2', '3+', 3, 0, '1', '{"Assault", "Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('079a2e32-ac0c-62c2-daeb-ed1cb7babf7c', 'Reckless Abandon', 'unique', 'You can target this unit with the Heroic Intervention Stratagem for 0CP, and can do so even if you have already used that Stratagem on a different unit this phase.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('4b976767-aeec-ff45-fb63-d046813b3f4d', '079a2e32-ac0c-62c2-daeb-ed1cb7babf7c', 'Cloud Dancer Felarch', 0, 1, 0, false, 3, NULL),
  ('adefe0d3-9ff9-f349-8977-304c29e41d33', '079a2e32-ac0c-62c2-daeb-ed1cb7babf7c', 'Corsair Cloud Dancer', 0, 10, 0, false, 1, '3-6 Corsair Cloud Dancers')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('79ecb6e4-1d63-6676-5197-621e23dedef4', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Firestorm', 'vehicle', '14"', 9, '3+', 12, 6, 3, '{"Vehicle", "Fly", "Firestorm", "Aeldari"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('79ecb6e4-1d63-6676-5197-621e23dedef4', 1, 115);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('79ecb6e4-1d63-6676-5197-621e23dedef4', 'Firestorm Scatter Laser', 'ranged', '36"', '16', '3+', 5, 0, '1', '{"Anti-Fly 2+"}'),
  ('79ecb6e4-1d63-6676-5197-621e23dedef4', 'Wraithbone Hull', 'melee', NULL, '3', '4+', 6, 0, '1', '{}'),
  ('79ecb6e4-1d63-6676-5197-621e23dedef4', 'Twin Shuriken Catapult', 'ranged', '18"', '2', '3+', 4, -1, '1', '{"Assault", "Twin Linked"}'),
  ('79ecb6e4-1d63-6676-5197-621e23dedef4', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Sustained Hits 1"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('79ecb6e4-1d63-6676-5197-621e23dedef4', 'Damaged: 1-4 Wounds Remaining', 'unique', 'While this model has 1-4 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('79ecb6e4-1d63-6676-5197-621e23dedef4', 'Skyfire', 'unique', 'Each time you target this model with the Fire Overwatch Stratagem just after an enemy unit that can ^^Fly^^ starts or ends a Normal, Advance or Fall Back move, when resolving that Stratagem, in addition to shooting that enemy unit, you can select up to 3 other enemy units within 24" of this model that can ^^Fly^^; this model can also shoot at each of those units with its Firestorm scatter laser (provided each one is an eligible target), but when doing so, an unmodified Hit roll of 6 is required to score a hit.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('328472cc-c315-17b1-6877-4703636d280b', '79ecb6e4-1d63-6676-5197-621e23dedef4', 'Wargear', 'Firestorm Scatter Laser', true, 0, NULL, NULL, NULL),
  ('45d640c8-9edd-b6a9-2b89-1b9bfa833e37', '79ecb6e4-1d63-6676-5197-621e23dedef4', 'Wargear', 'Wraithbone hull', false, 0, NULL, NULL, NULL),
  ('3e565638-3973-ee71-6187-62f197b0f6eb', '79ecb6e4-1d63-6676-5197-621e23dedef4', 'Hull weapon', 'Twin Shuriken Catapult', true, 0, NULL, 'Hull weapon', 1),
  ('f55565b2-4f8b-12ea-d77d-60893f31087d', '79ecb6e4-1d63-6676-5197-621e23dedef4', 'Hull weapon', 'Shuriken Cannon', false, 0, NULL, 'Hull weapon', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('d4313c8d-10b5-f7ba-33a9-ab9c8119272e', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Phoenix', 'vehicle', '20+"', 9, '3+', 16, 6, 1, '{"Vehicle", "Aeldari", "Aircraft", "Fly", "Phoenix"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('d4313c8d-10b5-f7ba-33a9-ab9c8119272e', 1, 175);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('d4313c8d-10b5-f7ba-33a9-ab9c8119272e', 'Phoenix missile array', 'ranged', '48"', 'D6', '3+', 6, -1, '2', '{"Blast"}'),
  ('d4313c8d-10b5-f7ba-33a9-ab9c8119272e', 'Phoenix pulse laser', 'ranged', '48"', '4', '3+', 10, -2, 'D6', '{}'),
  ('d4313c8d-10b5-f7ba-33a9-ab9c8119272e', 'Twin shuriken cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Sustained Hits 1", "Twin-linked"}'),
  ('d4313c8d-10b5-f7ba-33a9-ab9c8119272e', 'Wraithbone Hull', 'melee', NULL, '3', '4+', 6, 0, '1', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('d4313c8d-10b5-f7ba-33a9-ab9c8119272e', 'Strafing Run', 'unique', 'Each time this model makes a ranged attack that targets a unit that cannot FLY, add 1 to the Hit roll.'),
  ('d4313c8d-10b5-f7ba-33a9-ab9c8119272e', 'Damaged: 1-5 wounds remaining', 'unique', 'While this model has 1-5 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('c453cb2d-397a-36fc-c1f4-05418c0661ef', 'd4313c8d-10b5-f7ba-33a9-ab9c8119272e', 'Wargear', 'Phoenix missile array', true, 0, NULL, NULL, NULL),
  ('191b0b31-63d2-73da-9ae2-79b8b72e2aa2', 'd4313c8d-10b5-f7ba-33a9-ab9c8119272e', 'Wargear', 'Phoenix pulse laser', false, 0, NULL, NULL, NULL),
  ('1575c19c-4fd2-46d6-8c92-a8886f2b46e0', 'd4313c8d-10b5-f7ba-33a9-ab9c8119272e', 'Wargear', 'Twin shuriken cannon', false, 0, NULL, NULL, NULL),
  ('5ad2f81c-f327-7973-52ef-11d9acb06ff0', 'd4313c8d-10b5-f7ba-33a9-ab9c8119272e', 'Wargear', 'Wraithbone hull', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('a4d5396d-02f3-537d-e809-ec0c459c17bc', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Vampire Hunter', 'vehicle', '20+"', 12, '3+', 30, 6, 1, '{"Vehicle", "Fly", "Aircraft", "Titanic", "Vampire Hunter", "Aeldari"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('a4d5396d-02f3-537d-e809-ec0c459c17bc', 1, 460);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('a4d5396d-02f3-537d-e809-ec0c459c17bc', 'Scatter Laser', 'ranged', '36"', '6', '3+', 5, 0, '1', '{}'),
  ('a4d5396d-02f3-537d-e809-ec0c459c17bc', 'Twin Pulse Laser', 'ranged', '48"', '3', '3+', 9, -2, 'D6', '{"Twin-Linked"}'),
  ('a4d5396d-02f3-537d-e809-ec0c459c17bc', 'Twin Vampire Pulsar', 'ranged', '60"', '3', '3+', 12, -3, '4', '{"Twin-Linked"}'),
  ('a4d5396d-02f3-537d-e809-ec0c459c17bc', 'Wraithbone Hull', 'melee', NULL, '6', '4+', 6, 0, '1', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('a4d5396d-02f3-537d-e809-ec0c459c17bc', 'Damaged: 1-10 Wounds Remaining', 'unique', 'While this model has 1-10 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('a4d5396d-02f3-537d-e809-ec0c459c17bc', 'Titan Hunter', 'unique', 'Each time a ranged attack made by this model is allocated to a ^^Monster^^ or ^^Vehicle^^ model, re-roll a Damage roll of 1.'),
  ('a4d5396d-02f3-537d-e809-ec0c459c17bc', 'Invulnerable Save', 'invulnerable', 'Models in this unit have a 4+ invulnerable save against ranged attacks.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('83d51fef-582b-c4a1-95dc-e96a18101705', 'a4d5396d-02f3-537d-e809-ec0c459c17bc', 'Wargear', 'Scatter Laser', true, 0, NULL, NULL, NULL),
  ('4ecfea03-3739-ad7e-de40-9d1e5fbbaed3', 'a4d5396d-02f3-537d-e809-ec0c459c17bc', 'Wargear', 'Twin Pulse Laser', false, 0, NULL, NULL, NULL),
  ('7f909a6b-938c-1571-17dd-5592fe754ad4', 'a4d5396d-02f3-537d-e809-ec0c459c17bc', 'Wargear', 'Twin Vampire Pulsar', false, 0, NULL, NULL, NULL),
  ('d54efdc0-1698-8e2b-ffe6-a2f444b33309', 'a4d5396d-02f3-537d-e809-ec0c459c17bc', 'Wargear', 'Wraithbone hull', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('2518c015-7103-7b85-e5bd-6e277f5d8f34', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Vampire Raider', 'vehicle', '20+"', 12, '3+', 30, 6, 1, '{"Vehicle", "Fly", "Aircraft", "Titanic", "Transport", "Vampire Raider", "Aeldari"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('2518c015-7103-7b85-e5bd-6e277f5d8f34', 1, 430);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('2518c015-7103-7b85-e5bd-6e277f5d8f34', 'Scatter Laser', 'ranged', '36"', '6', '3+', 5, 0, '1', '{}'),
  ('2518c015-7103-7b85-e5bd-6e277f5d8f34', 'Twin Pulse Laser', 'ranged', '48"', '3', '3+', 9, -2, 'D6', '{"Twin-Linked"}'),
  ('2518c015-7103-7b85-e5bd-6e277f5d8f34', 'Wraithbone Hull', 'melee', NULL, '6', '4+', 6, 0, '1', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('2518c015-7103-7b85-e5bd-6e277f5d8f34', 'Damaged: 1-10 Wounds Remaining', 'unique', 'While this model has 1-10 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('2518c015-7103-7b85-e5bd-6e277f5d8f34', 'Into the Foe', 'unique', 'If a unit disembarks from this ^^Transport^^ before it moves, until the end of the turn, that unit is eligible to charge in a turn in which it Advanced.'),
  ('2518c015-7103-7b85-e5bd-6e277f5d8f34', 'Transport', 'unique', 'This model has a transport capacity of 30 ^^Aeldari Infantry^^ models. Each ^^Wraith Construct^^ model takes the space of 2 models. It cannot transport ^^Jump Pack^^ models or ^^Ynnari^^ models (excluding ^^Yvraine^^ and ^^The Visarch^^).'),
  ('2518c015-7103-7b85-e5bd-6e277f5d8f34', 'Invulnerable Save', 'invulnerable', 'Models in this unit have a 4+ invulnerable save against ranged attacks.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('81b1a46e-4ee6-4f6d-ecad-008857483879', '2518c015-7103-7b85-e5bd-6e277f5d8f34', 'Wargear', 'Scatter Laser', true, 0, NULL, NULL, NULL),
  ('db708ecc-c30a-117f-10be-deb23fffa3b6', '2518c015-7103-7b85-e5bd-6e277f5d8f34', 'Wargear', 'Twin Pulse Laser', false, 0, NULL, NULL, NULL),
  ('a100179a-511d-b9b4-18f8-b281baffb766', '2518c015-7103-7b85-e5bd-6e277f5d8f34', 'Wargear', 'Wraithbone hull', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('53433d33-8ddc-3a8b-599a-896908750466', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Wasp Assault Walker', 'vehicle', '10"', 7, '3+', 6, 6, 2, '{"Vehicle", "Fly", "Walker", "Wasp Assault Walker", "Aeldari"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('53433d33-8ddc-3a8b-599a-896908750466', 1, 95);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('53433d33-8ddc-3a8b-599a-896908750466', 'Wasp feet', 'melee', NULL, '3', '3+', 5, 0, '1', '{}'),
  ('53433d33-8ddc-3a8b-599a-896908750466', '➤ Aeldari missile launcher - starshot', 'ranged', '48"', '1', '3+', 10, -2, 'D6', '{}'),
  ('53433d33-8ddc-3a8b-599a-896908750466', '➤ Aeldari missile launcher - sunburst', 'ranged', '48"', 'D6', '3+', 4, -1, '1', '{"Blast"}'),
  ('53433d33-8ddc-3a8b-599a-896908750466', 'Bright Lance', 'ranged', '36"', '1', '3+', 12, -3, 'D6+2', '{}'),
  ('53433d33-8ddc-3a8b-599a-896908750466', 'Scatter Laser', 'ranged', '36"', '6', '3+', 5, 0, '1', '{}'),
  ('53433d33-8ddc-3a8b-599a-896908750466', 'Starcannon', 'ranged', '36"', '2', '3+', 8, -3, '2', '{}'),
  ('53433d33-8ddc-3a8b-599a-896908750466', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Sustained Hits 1"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('53433d33-8ddc-3a8b-599a-896908750466', 'Invulnerable Save', 'invulnerable', 'This unit has a 4+ Invulnerable save.'),
  ('53433d33-8ddc-3a8b-599a-896908750466', 'Cloudbreakers', 'unique', 'Each time this model Advances, do not make an Advance roll for it. Instead, until the end of the phase, add 6" to the Move characteristic of this model.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('41308c1a-4086-9eaf-b810-d40d63c8e54f', '53433d33-8ddc-3a8b-599a-896908750466', 'Wargear', 'Wasp feet', true, 0, NULL, NULL, NULL),
  ('0e055d14-52d0-3053-76a8-bdd0cb959473', '53433d33-8ddc-3a8b-599a-896908750466', 'Wargear', 'Heavy Weapons [Legends]', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('1c5a5d77-809f-e5b4-f3f8-57c22b96e277', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Raven Strike Fighter', 'vehicle', '20+"', 8, '4+', 10, 7, 1, '{"Vehicle", "Fly", "Aircraft", "Aeldari", "Raven Strike Fighter"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('1c5a5d77-809f-e5b4-f3f8-57c22b96e277', 1, 170);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('1c5a5d77-809f-e5b4-f3f8-57c22b96e277', 'Bladed wings', 'melee', NULL, '3', '4+', 6, -1, '1', '{}'),
  ('1c5a5d77-809f-e5b4-f3f8-57c22b96e277', 'Dark lance', 'ranged', '36"', '1', '3+', 12, -3, 'D6+2', '{}'),
  ('1c5a5d77-809f-e5b4-f3f8-57c22b96e277', 'Splinterstorm cannon', 'ranged', '36"', '8', '3+', 3, -1, '2', '{"Anti-Infantry 3+", "Sustained Hits 2"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('1c5a5d77-809f-e5b4-f3f8-57c22b96e277', 'Invulnerable Save', 'invulnerable', 'This model has a 5+ invulnerable save.'),
  ('1c5a5d77-809f-e5b4-f3f8-57c22b96e277', 'Ground-attack Craft', 'unique', 'Each time a model in this unit makes a ranged attack that targets an enemy unit  (excluding unit that can ^^**Fly**^^), add 1 to the Hit roll.'),
  ('1c5a5d77-809f-e5b4-f3f8-57c22b96e277', 'Shredding Fire (Pain)', 'unique', 'In your Shooting phase, when you select this unit to shoot, you can spend 1 Pain token to Empower this unit. While Empowered, the Armour Penetration characteristic of its ranged weapons is increased by 1.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('11190239-0a44-6e2f-41b3-09e3b9631387', '1c5a5d77-809f-e5b4-f3f8-57c22b96e277', 'Wargear', 'Bladed wings', true, 0, NULL, NULL, NULL),
  ('32dd2b47-d294-6491-7144-c88819ac56e6', '1c5a5d77-809f-e5b4-f3f8-57c22b96e277', 'Wargear', 'Dark lance', false, 0, NULL, NULL, NULL),
  ('6da4eb57-5ef6-6472-886d-fef1d0d160fb', '1c5a5d77-809f-e5b4-f3f8-57c22b96e277', 'Wargear', 'Splinterstorm cannon', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('5bdfed1c-6ae0-da50-5d25-f36d9b3f79a4', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Reaper', 'vehicle', '14"', 9, '4+', 11, 7, 3, '{"Vehicle", "Kabal", "Fly", "Aeldari", "Reaper"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('5bdfed1c-6ae0-da50-5d25-f36d9b3f79a4', 1, 115);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('5bdfed1c-6ae0-da50-5d25-f36d9b3f79a4', 'Bladevanes', 'melee', NULL, '3', '4+', 6, -1, '1', '{}'),
  ('5bdfed1c-6ae0-da50-5d25-f36d9b3f79a4', 'Prow blade', 'melee', NULL, '1', '4+', 8, -2, '2', '{"Extra Attacks", "Lance", "Sustained Hits 3"}'),
  ('5bdfed1c-6ae0-da50-5d25-f36d9b3f79a4', '➤ Storm vortex projector - beam', 'ranged', '36"', '3', '3+', 12, -3, 'D6', '{}'),
  ('5bdfed1c-6ae0-da50-5d25-f36d9b3f79a4', '➤ Storm vortex projector - blast', 'ranged', '24"', 'D6+3', '3+', 6, -2, '2', '{"Blast"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('5bdfed1c-6ae0-da50-5d25-f36d9b3f79a4', 'Invulnerable Save', 'invulnerable', 'This model has a 6+ invulnerable save.'),
  ('5bdfed1c-6ae0-da50-5d25-f36d9b3f79a4', 'Eradicate the Foe', 'unique', 'Each time this model makes an attack that targets an enemy unit that is at its Starting Strength, re-roll a Hit roll of 1. If the target unit has a Starting Strength of 1, this ability only applies if that unit has its starting number of wounds.'),
  ('5bdfed1c-6ae0-da50-5d25-f36d9b3f79a4', 'Damaged: 1-4 Wounds Remaining', 'unique', 'While this model has 1-4 wounds remaining, each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('5bdfed1c-6ae0-da50-5d25-f36d9b3f79a4', 'Electromagnetic Cascade (Pain)', 'unique', 'In your Shooting phase, when you select this model to shoot, you can spend 1 Pain token to Empower this model. While Empowered: 
■ Each time this model makes a ranged attack that targets a ^^**Vehicle**^^ unit, that attack has the ^^**[SUSTAINED HITS 2]**^^ ability. 
■ Each time this model makes a ranged attack that targets a non-^^**Vehicle**^^ unit, that attack has the ^^**[SUSTAINED HITS 1]**^^ ability.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('0ef76189-da6e-5d46-6d45-dbabe5e903ff', '5bdfed1c-6ae0-da50-5d25-f36d9b3f79a4', 'Wargear', 'Bladevanes', true, 0, NULL, NULL, NULL),
  ('f6289917-5cf6-0602-b141-c105c4b082e0', '5bdfed1c-6ae0-da50-5d25-f36d9b3f79a4', 'Wargear', 'Prow blade', false, 0, NULL, NULL, NULL),
  ('0ddf0bcc-d225-c3a8-20f8-d33dfa9b40a5', '5bdfed1c-6ae0-da50-5d25-f36d9b3f79a4', 'Wargear', 'Storm vortex projector', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('dbf338ac-e1f1-be74-dd6a-9377a4cc27e0', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Warlock Skyrunners', 'mounted', '14"', 4, '6+', 3, 6, 2, '{"Psyker", "Mounted", "Warlock Skyrunners", "Warlock", "Aeldari", "Fly", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('dbf338ac-e1f1-be74-dd6a-9377a4cc27e0', 1, 45);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('dbf338ac-e1f1-be74-dd6a-9377a4cc27e0', 'Twin Shuriken Catapult', 'ranged', '18"', '2', '3+', 4, -1, '1', '{"Assault", "Twin Linked"}'),
  ('dbf338ac-e1f1-be74-dd6a-9377a4cc27e0', 'Witchblade', 'melee', NULL, '2', '3+', 3, 0, '2', '{"Anti-Infantry 2+", "Psychic"}'),
  ('dbf338ac-e1f1-be74-dd6a-9377a4cc27e0', 'Shuriken Pistol', 'ranged', '12"', '1', '3+', 4, -1, '1', '{"Assault", "Pistol"}'),
  ('dbf338ac-e1f1-be74-dd6a-9377a4cc27e0', 'Destructor', 'ranged', '12"', 'D6', 'N/A', 5, -1, '1', '{"Psychic", "Torrent"}'),
  ('dbf338ac-e1f1-be74-dd6a-9377a4cc27e0', 'Singing Spear', 'ranged', '12"', '1', '3+', 9, 0, '3', '{"Assault", "Psychic"}'),
  ('dbf338ac-e1f1-be74-dd6a-9377a4cc27e0', 'Singing Spear', 'melee', NULL, '2', '3+', 3, 0, '3', '{"Psychic"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('dbf338ac-e1f1-be74-dd6a-9377a4cc27e0', 'Psychic Communion (Psychic)', 'unique', 'Each time this unit is selected to shoot, for each ^^Warlock^^ model in this unit, until the end of the phase, add 1 to the Attacks and Strength characteristics of that model''s Destructor weapon for each other friendly ^^Aeldari Psyker^^ model within 6" of this model (to a maximum of +2).'),
  ('dbf338ac-e1f1-be74-dd6a-9377a4cc27e0', 'Leader', 'core', 'At the start of the Declare Battle Formations step, if this unit is not an Attached unit, this unit can join one ^^Windriders^^ unit from your army (a unit cannot have more than one ^^Warlock Skyrunners^^ unit joined to it). If it does, until the end of the battle, every model in this unit counts as being part of that Bodyguard unit, and that Bodyguard unit’s Starting Strength is increased accordingly.'),
  ('dbf338ac-e1f1-be74-dd6a-9377a4cc27e0', 'Runes of Battle (Psychic)', 'unique', 'Weapons equipped by models in this unit have the [Ignores Cover] ability.'),
  ('dbf338ac-e1f1-be74-dd6a-9377a4cc27e0', 'Invulnerable Save (Warlock)', 'invulnerable', 'A Warlock Skyrunner has a 4+ Invulnerable save.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('f6312cda-8e40-74a0-f4f8-f5850ab23db2', 'dbf338ac-e1f1-be74-dd6a-9377a4cc27e0', 'Warlock Skyrunner with Witchblade', 0, 2, 0, false, 0, '1-2 Warlock Skyrunners'),
  ('1b8de3f6-f124-f31c-b421-326ed73fa0b4', 'dbf338ac-e1f1-be74-dd6a-9377a4cc27e0', 'Warlock Skyrunner with Singing Spear', 0, 2, 0, false, 1, '1-2 Warlock Skyrunners')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('57f25115-409d-0933-665d-d85a91e7753e', 'dbf338ac-e1f1-be74-dd6a-9377a4cc27e0', '1-2 Warlock Skyrunners', 'Warlock Skyrunner with Witchblade', true, 0, NULL, NULL, NULL),
  ('b01ef30d-5d6e-b5bd-ebe3-97724cf0736d', 'dbf338ac-e1f1-be74-dd6a-9377a4cc27e0', '1-2 Warlock Skyrunners', 'Warlock Skyrunner with Singing Spear', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('8b23b0ef-b224-f3c0-79a7-1f3062669fc2', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Ynnari Archon', 'character', '8"', 3, '4+', 4, 6, 1, '{"Character", "Infantry", "Aeldari", "Archon"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('8b23b0ef-b224-f3c0-79a7-1f3062669fc2', 1, 85);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('8b23b0ef-b224-f3c0-79a7-1f3062669fc2', 'Huskblade', 'melee', NULL, '5', '2+', 3, -2, '2', '{"Anti-Infantry 3+"}'),
  ('8b23b0ef-b224-f3c0-79a7-1f3062669fc2', 'Splinter Pistol', 'ranged', '12"', '1', '2+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault", "Pistol"}'),
  ('8b23b0ef-b224-f3c0-79a7-1f3062669fc2', 'Blast Pistol', 'ranged', '6"', '1', '2+', 8, -3, 'D3', '{"Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('8b23b0ef-b224-f3c0-79a7-1f3062669fc2', 'Leader', 'core', 'This model can be attached to the following units:
■ Ynnari Incubi
■ Ynnari Kabalite Warriors'),
  ('8b23b0ef-b224-f3c0-79a7-1f3062669fc2', 'Overlord', 'unique', 'While this model is leading a unit, each time a model in that unit makes an attack, re-roll a Wound roll of 1. While that unit is below its Starting Strength, each time a model in that unit makes an attack, you can re-roll the Wound roll instead.'),
  ('8b23b0ef-b224-f3c0-79a7-1f3062669fc2', 'Reborn Mastermind', 'unique', 'Once per battle round, one model from your army with this ability can use it when its unit is targeted with a Stratgem. If it does, reduce the CP cost of that usage of that Stratagem by 1CP.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('dfb66f3f-8861-7b60-4825-f95cf66ce363', '8b23b0ef-b224-f3c0-79a7-1f3062669fc2', 'Wargear', 'Huskblade', true, 0, NULL, NULL, NULL),
  ('46922ed7-4d17-50f3-26ed-6403d8712472', '8b23b0ef-b224-f3c0-79a7-1f3062669fc2', 'Wargear', 'Shadow Field', false, 0, NULL, NULL, NULL),
  ('f89828df-9f1b-50ee-5ba0-f11527e09df7', '8b23b0ef-b224-f3c0-79a7-1f3062669fc2', 'Pistol Choice', 'Splinter Pistol', true, 0, NULL, 'Pistol Choice', 1),
  ('b146ea14-bc49-d9ee-5532-374826f57996', '8b23b0ef-b224-f3c0-79a7-1f3062669fc2', 'Pistol Choice', 'Blast Pistol', false, 0, NULL, 'Pistol Choice', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('fa9f1b03-63ba-a2b4-2c0a-361d22903858', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Lhykhis', 'epic_hero', '12"', 3, '2+', 5, 6, 1, '{"Character", "Epic Hero", "Infantry", "Aeldari", "Jump Pack", "Fly", "Aspect Warrior", "Phoenix Lord", "Lhykhis"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('fa9f1b03-63ba-a2b4-2c0a-361d22903858', 1, 135);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('fa9f1b03-63ba-a2b4-2c0a-361d22903858', 'Brood Twain', 'ranged', '12"', 'D6+3', 'N/A', 6, -2, '1', '{"Ignores Cover", "Torrent", "Twin-Linked"}'),
  ('fa9f1b03-63ba-a2b4-2c0a-361d22903858', 'Spider''s Fangs', 'melee', NULL, '5', '2+', 4, -2, '1', '{"Extra Attacks", "Lethal Hits"}'),
  ('fa9f1b03-63ba-a2b4-2c0a-361d22903858', 'Weaverender', 'melee', NULL, '5', '2+', 6, -2, '2', '{"Lethal Hits"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('fa9f1b03-63ba-a2b4-2c0a-361d22903858', 'Leader', 'core', 'This model can be attached to the following unit:
■ Warp Spiders'),
  ('fa9f1b03-63ba-a2b4-2c0a-361d22903858', 'Invulnerable Save (Lhykhis)', 'invulnerable', 'Lhykhis has a 4+ Invulnerable save'),
  ('fa9f1b03-63ba-a2b4-2c0a-361d22903858', 'Empyric Ambush', 'unique', 'While this model is leading a unit, that unit is eligible to declare a charge in a turn in which it used its Flickerjump ability.'),
  ('fa9f1b03-63ba-a2b4-2c0a-361d22903858', 'Whispering Web', 'unique', 'In your Shooting phase, after this model has shot, select one enemy unit hit by one or more of those attacks. Until the end of the turn, each time a friendly Aeldari model makes an attack that targets that unit, an unmodified Hit roll of 5+ scores a Critical Hit.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('b3af7b67-c49f-d8c6-d8d0-95cebd117e62', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Shadow Weaver Platform', 'infantry', '7"', 6, '4+', 5, 7, 1, '{"Support Weapon", "Aeldari", "Infantry", "Shadow Weaver Platform", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('b3af7b67-c49f-d8c6-d8d0-95cebd117e62', 1, 75);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('b3af7b67-c49f-d8c6-d8d0-95cebd117e62', 'Shadow weaver', 'ranged', '48"', 'D6+2', '3+', 6, -1, '1', '{"Blast", "Indirect Fire"}'),
  ('b3af7b67-c49f-d8c6-d8d0-95cebd117e62', 'Close Combat Weapon', 'melee', NULL, '2', '3+', 3, 0, '1', '{}'),
  ('b3af7b67-c49f-d8c6-d8d0-95cebd117e62', 'Shuriken Catapult', 'ranged', '18"', '2', '3+', 4, -1, '1', '{"Assault"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('b3af7b67-c49f-d8c6-d8d0-95cebd117e62', 'Monofilament Snare', 'unique', 'In your Shooting phase, after this model has shot, select one enemy unit hit by one or more of those attacks made with its Shadow Weaver. Until the start of your next turn, that enemy unit it snared. While a unit is snared, each time that unit makes a Normal, Advance or Fall Back move, roll one D6 for each model in that unit: for each 1, that unit suffers 1 mortal wound.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('13c18838-f549-39f7-7770-8a111d3317e9', 'b3af7b67-c49f-d8c6-d8d0-95cebd117e62', 'Wargear', 'Shadow weaver', true, 0, NULL, NULL, NULL),
  ('045ce329-7414-d0fa-7c67-aee9cc5c6396', 'b3af7b67-c49f-d8c6-d8d0-95cebd117e62', 'Wargear', 'Close Combat Weapon', false, 0, NULL, NULL, NULL),
  ('a821747a-402a-3693-a0af-16e578dce826', 'b3af7b67-c49f-d8c6-d8d0-95cebd117e62', 'Wargear', 'Shuriken Catapult', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('05f256e2-2ba0-28d4-e80d-278239086a24', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Vibro Cannon Platform', 'infantry', '7"', 6, '4+', 5, 7, 1, '{"Support Weapon", "Infantry", "Aeldari", "Vibro Cannon Platform", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('05f256e2-2ba0-28d4-e80d-278239086a24', 1, 60);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('05f256e2-2ba0-28d4-e80d-278239086a24', 'Vibro Cannon', 'ranged', '48"', 'D6', '3+', 9, -1, '2', '{}'),
  ('05f256e2-2ba0-28d4-e80d-278239086a24', 'Close Combat Weapon', 'melee', NULL, '2', '3+', 3, 0, '1', '{}'),
  ('05f256e2-2ba0-28d4-e80d-278239086a24', 'Shuriken Catapult', 'ranged', '18"', '2', '3+', 4, -1, '1', '{"Assault"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('05f256e2-2ba0-28d4-e80d-278239086a24', 'Sonic Destruction', 'unique', 'In your Shooting phase, each time this model makes an attack with its Vibro Cannon that targets an enemy unit, improve the Strength, Armour Penetration and Damage characteristics of that attack by 1 for each other friendly Vibro Cannon Platform model that made one or more attacks with its Vibro Cannon that also targeted that enemy unit this phase.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('17d2cc71-b080-5137-cf4c-9cb00393a175', '05f256e2-2ba0-28d4-e80d-278239086a24', 'Wargear', 'Vibro Cannon', true, 0, NULL, NULL, NULL),
  ('145c5c24-5e87-d097-aa03-3ba1851650c7', '05f256e2-2ba0-28d4-e80d-278239086a24', 'Wargear', 'Close Combat Weapon', false, 0, NULL, NULL, NULL),
  ('569be344-2e7d-6af1-41cf-ae96b70c00b2', '05f256e2-2ba0-28d4-e80d-278239086a24', 'Wargear', 'Shuriken Catapult', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('9a1de6b0-8828-4ba5-5894-40dc25533701', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Wraithknight with Ghostglaive', 'monster', '12"', 12, '2+', 18, 6, 10, '{"Wraith Construct", "Monster", "Titanic", "Towering", "Walker", "Aeldari", "Wraithknight with Ghostglaive", "Ynnari"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('9a1de6b0-8828-4ba5-5894-40dc25533701', 1, 420);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('9a1de6b0-8828-4ba5-5894-40dc25533701', '➤ Titanic Ghostglaive - Strike', 'melee', NULL, '5', '3+', 16, -3, '6', '{}'),
  ('9a1de6b0-8828-4ba5-5894-40dc25533701', '➤ Titanic Ghostglaive - Sweep', 'melee', NULL, '15', '3+', 8, -2, '2', '{}'),
  ('9a1de6b0-8828-4ba5-5894-40dc25533701', 'Heavy Wraithcannon', 'ranged', '36"', 'D3', '3+', 20, -4, '2D6', '{"Devastating Wounds"}'),
  ('9a1de6b0-8828-4ba5-5894-40dc25533701', 'Scatter Laser', 'ranged', '36"', '6', '3+', 5, 0, '1', '{"Sustained Hits 1"}'),
  ('9a1de6b0-8828-4ba5-5894-40dc25533701', 'Shuriken Cannon', 'ranged', '24"', '3', '3+', 6, -1, '2', '{"Lethal Hits"}'),
  ('9a1de6b0-8828-4ba5-5894-40dc25533701', 'Starcannon', 'ranged', '36"', '2', '3+', 8, -3, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('9a1de6b0-8828-4ba5-5894-40dc25533701', 'Damaged: 1-6 Wounds Remaining', 'unique', 'While this model has 1-6 wounds remaining, subtract 5 from this model’s Objective Control characteristic and each time this model makes an attack, subtract 1 from the Hit roll.'),
  ('9a1de6b0-8828-4ba5-5894-40dc25533701', 'Titanic Agility', 'unique', 'Each time this model makes a Normal, Advance or Fall Back move, it can move through models and terrain features. When doing so, it can move within Engagement Range of enemy models, but cannot end that move within Engagement Range of them.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('ef5d5206-6a77-46b9-fb2a-f4163573518a', '9a1de6b0-8828-4ba5-5894-40dc25533701', 'Wargear', 'Titanic Ghostglaive', true, 0, NULL, NULL, NULL),
  ('9fc8abfa-61ff-b477-b479-575ff61bdbee', '9a1de6b0-8828-4ba5-5894-40dc25533701', 'Left Arm', 'Scattershield', true, 0, NULL, 'Left Arm', 1),
  ('a53d01ce-0a3b-ca97-68c1-11c6b23b8ad5', '9a1de6b0-8828-4ba5-5894-40dc25533701', 'Left Arm', 'Heavy Wraithcannon', false, 0, NULL, 'Left Arm', 1),
  ('de438cb8-0322-c1be-48cb-0280cc35bd56', '9a1de6b0-8828-4ba5-5894-40dc25533701', 'Secondary Weapons', 'Scatter Laser', true, 0, NULL, 'Secondary Weapons', 2),
  ('9ecf885a-6278-6819-97c8-64d0653bdc67', '9a1de6b0-8828-4ba5-5894-40dc25533701', 'Secondary Weapons', 'Shuriken Cannon', false, 0, NULL, 'Secondary Weapons', 2),
  ('52ed574e-565b-6d6d-3bf0-8b09bf46e37b', '9a1de6b0-8828-4ba5-5894-40dc25533701', 'Secondary Weapons', 'Starcannon', false, 0, NULL, 'Secondary Weapons', 2)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('5ec3816b-ca1b-023c-bbb6-99aba4ede17b', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Ynnari Succubus', 'character', '8"', 3, '6+', 4, 6, 1, '{"Succubus", "Aeldari", "Character", "Infantry"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('5ec3816b-ca1b-023c-bbb6-99aba4ede17b', 1, 45);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('5ec3816b-ca1b-023c-bbb6-99aba4ede17b', 'Succubus Weapons', 'melee', NULL, '6', '2+', 3, -2, '1', '{"Anti-Infantry 3+"}'),
  ('5ec3816b-ca1b-023c-bbb6-99aba4ede17b', 'Splinter Pistol', 'ranged', '12"', '1', '2+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault", "Pistol"}'),
  ('5ec3816b-ca1b-023c-bbb6-99aba4ede17b', 'Blast Pistol', 'ranged', '6"', '1', '2+', 8, -3, 'D3', '{"Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('5ec3816b-ca1b-023c-bbb6-99aba4ede17b', 'Invulnerable Save', 'invulnerable', 'This unit has a 4+ Invulnerable save'),
  ('5ec3816b-ca1b-023c-bbb6-99aba4ede17b', 'Empowered by Death', 'unique', 'At the start of the Fight phase, if this model''s unit is below its Starting Strength, models in that unit have the Fights First ability.'),
  ('5ec3816b-ca1b-023c-bbb6-99aba4ede17b', 'Storm of Blades', 'unique', 'While this model is leading a unit, melee weapons equipped by models in that unit have the [SUSTAINED HITS 1] ability.'),
  ('5ec3816b-ca1b-023c-bbb6-99aba4ede17b', 'Leader', 'core', 'This model can be attached to the following unit:
■ Ynnari Wyches');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('517341f0-7f14-1fa9-314e-efa8317a49ac', '5ec3816b-ca1b-023c-bbb6-99aba4ede17b', 'Wargear', 'Succubus weapons', true, 0, NULL, NULL, NULL),
  ('fddbb837-6653-1520-8e9a-eccd42023e0a', '5ec3816b-ca1b-023c-bbb6-99aba4ede17b', 'Pistol Choice', 'Splinter Pistol', true, 0, NULL, 'Pistol Choice', 1),
  ('9da7b7a0-57a1-845f-1eff-7219bfa92bf1', '5ec3816b-ca1b-023c-bbb6-99aba4ede17b', 'Pistol Choice', 'Blast Pistol', false, 0, NULL, 'Pistol Choice', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('4013a792-3644-b87d-821c-6d7faa50e6dc', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Ynnari Wyches', 'battleline', '8"', 3, '6+', 1, 6, 2, '{"Wyches", "Aeldari", "Battleline", "Infantry"}', 6, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('4013a792-3644-b87d-821c-6d7faa50e6dc', 9, 90);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('4013a792-3644-b87d-821c-6d7faa50e6dc', 'Splinter Pistol', 'ranged', '12"', '1', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault", "Pistol"}'),
  ('4013a792-3644-b87d-821c-6d7faa50e6dc', 'Hekatarii Blade', 'melee', NULL, '3', '3+', 3, -1, '1', '{}'),
  ('4013a792-3644-b87d-821c-6d7faa50e6dc', 'Blast Pistol', 'ranged', '6"', '1', '3+', 8, -3, 'D3', '{"Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('4013a792-3644-b87d-821c-6d7faa50e6dc', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ Invulnerable save against ranged attacks, and 4+ Invulnerable save against melee attacks.'),
  ('4013a792-3644-b87d-821c-6d7faa50e6dc', 'No Escape', 'unique', 'Each time an enemy unit (excluding Monsters and Vehicles) within Engagement Range of one or more units from your army with this ability is selected to Fall Back, all models in that enemy unit must take a Desperate Escape test. When doing so, if that enemy unit is Battle-shocked, subtract 1 from each of those tests.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('7c743f31-090f-b526-5c71-32059bc1a444', '4013a792-3644-b87d-821c-6d7faa50e6dc', 'Wych', 9, 9, 9, false, 0, '9 Wyches'),
  ('bd21055e-8ba0-f460-9a17-e8dca94f7edb', '4013a792-3644-b87d-821c-6d7faa50e6dc', 'Hekatrix', 1, 1, 1, true, 1, 'Hekatrix')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('1eb932d4-87e9-ea43-04b5-836b38968388', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Ynnari Incubi', 'infantry', '7"', 3, '3+', 1, 6, 1, '{"Incubi", "Aeldari", "Infantry"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('1eb932d4-87e9-ea43-04b5-836b38968388', 4, 85);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('1eb932d4-87e9-ea43-04b5-836b38968388', 'Klaive', 'melee', NULL, '3', '3+', 4, -2, '2', '{}'),
  ('1eb932d4-87e9-ea43-04b5-836b38968388', '➤ Demiklaives - Dual Blades', 'melee', NULL, '6', '3+', 4, -1, '1', '{"Twin-Linked"}'),
  ('1eb932d4-87e9-ea43-04b5-836b38968388', '➤ Demiklaives - Single Blade', 'melee', NULL, '3', '3+', 4, -2, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('1eb932d4-87e9-ea43-04b5-836b38968388', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save'),
  ('1eb932d4-87e9-ea43-04b5-836b38968388', 'Tormentors', 'unique', 'At the start of the Fight phase, each enemy unit within Engagement Range of one or more units with this ability must take a Battle-shock test.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('95d3cc24-4be5-6773-b5f9-45f3892c323b', '1eb932d4-87e9-ea43-04b5-836b38968388', 'Incubi', 4, 9, 4, false, 0, '4-9 Incubi'),
  ('bbc143f2-c671-a30a-96d7-cad1df262d2e', '1eb932d4-87e9-ea43-04b5-836b38968388', 'Klaivex', 1, 1, 1, true, 1, 'Klaivex')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('f1ca15ab-0f59-abcb-fc78-15af1a8c5450', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Ynnari Reavers', 'mounted', '16"', 4, '4+', 2, 6, 2, '{"Reavers", "Aeldari", "Fly", "Mounted"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('f1ca15ab-0f59-abcb-fc78-15af1a8c5450', 2, 65);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('f1ca15ab-0f59-abcb-fc78-15af1a8c5450', 'Splinter Rifle', 'ranged', '24"', '2', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault"}'),
  ('f1ca15ab-0f59-abcb-fc78-15af1a8c5450', 'Splinter Pistol', 'ranged', '12"', '1', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault", "Pistol"}'),
  ('f1ca15ab-0f59-abcb-fc78-15af1a8c5450', 'Bladevanes', 'melee', NULL, '3', '3+', 4, 0, '1', '{}'),
  ('f1ca15ab-0f59-abcb-fc78-15af1a8c5450', 'Blaster', 'ranged', '18"', '1', '3+', 8, -4, 'D6+1', '{"Assault"}'),
  ('f1ca15ab-0f59-abcb-fc78-15af1a8c5450', 'Heat Lance', 'ranged', '18"', '1', '3+', 14, -4, 'D6', '{"Assault", "Melta 3"}'),
  ('f1ca15ab-0f59-abcb-fc78-15af1a8c5450', 'Agonizer', 'melee', NULL, '4', '3+', 3, -1, '1', '{"Anti-Infantry 3+"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('f1ca15ab-0f59-abcb-fc78-15af1a8c5450', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ invulnerable save.'),
  ('f1ca15ab-0f59-abcb-fc78-15af1a8c5450', 'Eviscerating Fly-by', 'unique', 'Each time this unit ends a Normal move, you can select one enemy unit (excluding Monster and Vehicle units) that it moved over during that move. If you do, roll one D6 for each model in this unit: for each 4+, that enemy unit suffers 1 mortal wound.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('661ba331-4088-ab37-3283-9e77c3bf5496', 'f1ca15ab-0f59-abcb-fc78-15af1a8c5450', 'Reaver', 2, 5, 2, false, 0, '2-5 Reavers'),
  ('e89235fd-47e5-9378-eedf-6cfa97268045', 'f1ca15ab-0f59-abcb-fc78-15af1a8c5450', 'Reaver with Blaster', 0, 1, 0, false, 1, '2-5 Reavers'),
  ('507f6c9f-6f0d-8794-1a34-dc7924b39e36', 'f1ca15ab-0f59-abcb-fc78-15af1a8c5450', 'Reaver with Heat Lance', 0, 1, 0, false, 2, '2-5 Reavers'),
  ('33ece95d-5d4e-c806-3fc2-11531a1a8ef8', 'f1ca15ab-0f59-abcb-fc78-15af1a8c5450', 'Arena Champion', 1, 1, 1, true, 3, 'Arena Champion')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('4f9daa43-1932-5658-9dfa-c9da4e5c194c', 'f1ca15ab-0f59-abcb-fc78-15af1a8c5450', '2-5 Reavers', 'Reaver', false, 0, NULL, NULL, NULL),
  ('e433f936-50a3-b219-48b2-c3323d6ec9df', 'f1ca15ab-0f59-abcb-fc78-15af1a8c5450', '2-5 Reavers', 'Reaver with Blaster', false, 0, NULL, NULL, NULL),
  ('30cfd612-6f16-b132-e848-a8d8a7dd633e', 'f1ca15ab-0f59-abcb-fc78-15af1a8c5450', '2-5 Reavers', 'Reaver with Heat Lance', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('3039f608-04eb-2fd6-f477-e92aa525e824', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Ynnari Raider', 'dedicated_transport', '14"', 8, '4+', 10, 6, 2, '{"Raider", "Aeldari", "Dedicated Transport", "Fly", "Vehicle", "Transport"}', 6, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('3039f608-04eb-2fd6-f477-e92aa525e824', 1, 80);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('3039f608-04eb-2fd6-f477-e92aa525e824', 'Bladevanes', 'melee', NULL, '3', '4+', 6, 0, '1', '{}'),
  ('3039f608-04eb-2fd6-f477-e92aa525e824', 'Disintegrator Cannon', 'ranged', '36"', '3', '3+', 5, -2, '2', '{}'),
  ('3039f608-04eb-2fd6-f477-e92aa525e824', 'Dark Lance', 'ranged', '36"', '1', '3+', 12, -3, 'D6+2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('3039f608-04eb-2fd6-f477-e92aa525e824', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ Invulnerable save'),
  ('3039f608-04eb-2fd6-f477-e92aa525e824', 'Aethersails', 'unique', 'Each time this model Advances, do not make an Advance roll for it. Instead, until the end of the phase, add 6" to the Move characteristic of this model.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('b4b33a9d-19be-f3a5-9b6a-8e82f738cd7e', '3039f608-04eb-2fd6-f477-e92aa525e824', 'Wargear', 'Bladevanes', true, 0, NULL, NULL, NULL),
  ('9e7671cb-25d5-1f27-7f69-4f53560b849c', '3039f608-04eb-2fd6-f477-e92aa525e824', 'Weapon Option', 'Disintegrator Cannon', true, 0, NULL, 'Weapon Option', 1),
  ('139247e3-a124-3264-e596-01c8c974fc84', '3039f608-04eb-2fd6-f477-e92aa525e824', 'Weapon Option', 'Dark Lance', false, 0, NULL, 'Weapon Option', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('928f0f4f-439b-a4b7-b7a0-2e8af06716b1', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Ynnari Venom', 'dedicated_transport', '14"', 6, '4+', 6, 6, 1, '{"Venom", "Aeldari", "Fly", "Dedicated Transport", "Transport", "Vehicle"}', 6, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('928f0f4f-439b-a4b7-b7a0-2e8af06716b1', 1, 70);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('928f0f4f-439b-a4b7-b7a0-2e8af06716b1', 'Bladevanes', 'melee', NULL, '3', '4+', 5, 0, '1', '{}'),
  ('928f0f4f-439b-a4b7-b7a0-2e8af06716b1', 'Splinter Cannon', 'ranged', '36"', '3', '3+', 3, -1, '2', '{"Anti-Infantry 3+", "Sustained hits 1"}'),
  ('928f0f4f-439b-a4b7-b7a0-2e8af06716b1', 'Twin Splinter Rifle', 'ranged', '24"', '2', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault", "Rapid Fire 1", "Twin Linked"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('928f0f4f-439b-a4b7-b7a0-2e8af06716b1', 'Invulnerable Save', 'invulnerable', 'This unit has a 6+ Invulnerable save'),
  ('928f0f4f-439b-a4b7-b7a0-2e8af06716b1', 'Lithe Embarkation', 'unique', 'At the end of the Fight phase, if there are no models currently embarked within this Transport, you can select one friendly Ynnari Infantry unit that only includes models from the units listed in this unit''s Transport section, that has 6 or fewer models and that is wholly within 6" of this Transport. Unless that unit is within Engagement Range of one or more enemy units, it can embark within this Transport.');

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('4dc02f5e-bbd7-0dc4-6c80-e40bc1606d4e', '928f0f4f-439b-a4b7-b7a0-2e8af06716b1', 'Wargear', 'Bladevanes', true, 0, NULL, NULL, NULL),
  ('da13985e-9abc-b2d4-a87f-fcb95c2d67a8', '928f0f4f-439b-a4b7-b7a0-2e8af06716b1', 'Wargear', 'Splinter Cannon', false, 0, NULL, NULL, NULL),
  ('f4ac1a80-6f59-ce1c-f8ff-3850c71a4117', '928f0f4f-439b-a4b7-b7a0-2e8af06716b1', 'Weapon Option', 'Splinter Cannon', true, 0, NULL, 'Weapon Option', 1),
  ('282f97d2-4dbb-fd65-8183-3b78d55b4afb', '928f0f4f-439b-a4b7-b7a0-2e8af06716b1', 'Weapon Option', 'Twin Splinter Rifle', false, 0, NULL, 'Weapon Option', 1)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('b3f4e614-cfd9-e802-d51e-79b861d1f344', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Lady Malys', 'epic_hero', '7"', 3, '4+', 5, 6, 2, '{"Infantry", "Kabal", "Character", "Aeldari", "Archon", "Epic Hero", "Lady Malys"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('b3f4e614-cfd9-e802-d51e-79b861d1f344', 1, 100);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('b3f4e614-cfd9-e802-d51e-79b861d1f344', 'Lady''s Blade', 'melee', NULL, '6', '2+', 5, -3, '3', '{"Devastating Wounds", "Hazardous"}'),
  ('b3f4e614-cfd9-e802-d51e-79b861d1f344', 'Razor fan', 'melee', NULL, '6', '2+', 3, 0, '1', '{"Extra Attacks"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('b3f4e614-cfd9-e802-d51e-79b861d1f344', 'Leader', 'core', 'This model can be attached to the following units:
■ Hand of the Archon
■ Incubi
■ Kabalite Warriors'),
  ('b3f4e614-cfd9-e802-d51e-79b861d1f344', 'Archon of the Poisoned Tongue (Pain)', 'unique', 'In your Shooting phase or the Fight phase, when you select this model''s unit to shoot or fight, you can spend 1 Pain token to Empower that unit. If you do, select one of the following abilities: **^^[Sustained Hits 1]; [Lethal Hits]^^**. Until the end of the phase, while that unit is Empowered, weapons equipped by models in that unit have that selected ability.'),
  ('b3f4e614-cfd9-e802-d51e-79b861d1f344', 'Precognisant', 'unique', 'If you army includes this model, after both players have deployed their armies, select up to three ^^**Drukhari**^^ units from your army and redeploy them. When doing so, you can set those units up in Strategic Reserves if you wish, regardless of how many units are already in Strategic Reserves.'),
  ('b3f4e614-cfd9-e802-d51e-79b861d1f344', 'Mind Like a Steel Trap [Aura]', 'unique', 'Each time your opponent targets a unit from their army with a Stratagem, if that unit is within 12" of this model, increase the cost of that use of that Stratagem by 1CP.');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('d36168f8-ef99-cd9f-5586-1ef3faea287c', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Scourges with Shardcarbines', 'infantry', '14"', 3, '4+', 1, 6, 1, '{"Scourges", "Aeldari", "Fly", "Infantry", "Jump Pack", "Blades for Hire", "Scourges with Shardcarbines"}', 3, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('d36168f8-ef99-cd9f-5586-1ef3faea287c', 4, 80);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('d36168f8-ef99-cd9f-5586-1ef3faea287c', 'Close combat weapon', 'melee', NULL, '2', '3+', 3, 0, '1', '{}'),
  ('d36168f8-ef99-cd9f-5586-1ef3faea287c', 'Blaster', 'ranged', '18"', '1', '3+', 8, -4, 'D6+1', '{"Assault"}'),
  ('d36168f8-ef99-cd9f-5586-1ef3faea287c', 'Shredder', 'ranged', '18"', 'D6', 'N/A', 6, 0, '1', '{"Assault", "Torrent"}'),
  ('d36168f8-ef99-cd9f-5586-1ef3faea287c', 'Shardcarbine', 'ranged', '18"', '3', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault"}'),
  ('d36168f8-ef99-cd9f-5586-1ef3faea287c', 'Blast Pistol', 'ranged', '6"', '1', '3+', 8, -3, 'D3', '{"Pistol"}'),
  ('d36168f8-ef99-cd9f-5586-1ef3faea287c', 'Power Weapon', 'melee', NULL, '3', '3+', 3, -2, '1', '{"Anti-Infantry 3+"}'),
  ('d36168f8-ef99-cd9f-5586-1ef3faea287c', 'Splinter Pistol', 'ranged', '12"', '1', '3+', 2, 0, '1', '{"Anti-Infantry 3+", "Assault", "Pistol"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('d36168f8-ef99-cd9f-5586-1ef3faea287c', 'Invulnerable Save', 'invulnerable', 'This unit has a 5+ Invulnerable save'),
  ('d36168f8-ef99-cd9f-5586-1ef3faea287c', 'Murderous Crossfire', 'unique', 'After this unit has shot, select one enemy unit hit by one or more of those attacks. Until the end of the phase, each time a friendly ^^**Drukhari**^^ unit makes a ranged attack that targets that enemy unit, improve the Armour Penetration characteristic of that attack by 1. The same enemy unit can only be affected by this ability once per turn.'),
  ('d36168f8-ef99-cd9f-5586-1ef3faea287c', 'Swooping Descent (Pain)', 'unique', 'In your Movement phase, you can spend 1 Pain token to Empower this unit. While Empowered, each time a model in this unit is set up on the battlefield using the Deep Strike ability, it can be set up anywhere on the battlefield that is more than 6" horizontally away from all enemy units. When doing so, if this unit is set up within 9" of one or more enemy units, until the end of the turn, it is not eligible to declare a charge.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('a4c80a34-dd14-2030-7ca7-86de3cb6f3df', 'd36168f8-ef99-cd9f-5586-1ef3faea287c', 'Scourge with Special Weapon', 0, 1, 0, false, 0, 'Scourge w/ special weapon'),
  ('a3fea2cf-56d1-ef74-44fe-a4dfc5fafae6', 'd36168f8-ef99-cd9f-5586-1ef3faea287c', 'Scourge', 4, 4, 4, false, 1, 'Scourge w/ special weapon'),
  ('b6cd9b42-e1e4-3559-0575-cb3dd72ec148', 'd36168f8-ef99-cd9f-5586-1ef3faea287c', 'Solarite', 1, 1, 1, true, 2, 'Solarite')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('a39ed052-acfe-5931-25de-ab084be0c117', 'd36168f8-ef99-cd9f-5586-1ef3faea287c', 'Scourge w/ special weapon', 'Scourge with Special Weapon', false, 0, NULL, NULL, NULL),
  ('cfc34770-6d54-a71c-53e3-a3a73687ed93', 'd36168f8-ef99-cd9f-5586-1ef3faea287c', 'Scourge w/ special weapon', 'Scourge', true, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('80bb494a-390d-14e8-8504-25dc303a9a30', 'bd2437fb-3f49-3ec9-f976-8b50004cdf6e', 'Kharseth', 'epic_hero', '7"', 3, '6+', 4, 6, 1, '{"Infantry", "Aeldari", "Character", "Epic Hero", "Psyker", "Anhrathe", "Kharseth"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('80bb494a-390d-14e8-8504-25dc303a9a30', 1, 95);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('80bb494a-390d-14e8-8504-25dc303a9a30', 'Dread of the Deep Void', 'ranged', '24"', 'D6+2', '3+', 3, -2, '1', '{"Anti-Infantry 2+", "Blast", "Hazardous", "Ignores Cover", "Psychic"}'),
  ('80bb494a-390d-14e8-8504-25dc303a9a30', 'Waystave', 'melee', NULL, '3', '2+', 3, 0, '3', '{"Anti-Infantry 2+", "Psychic"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('80bb494a-390d-14e8-8504-25dc303a9a30', 'Invulnerable Save (Kharseth)', 'invulnerable', 'Kharseth has a 4+ Invulnerable save'),
  ('80bb494a-390d-14e8-8504-25dc303a9a30', 'Leader', 'core', 'This model can be attached to the following units:
■ Corsair Voidreavers
■ Corsair Voidscarred'),
  ('80bb494a-390d-14e8-8504-25dc303a9a30', 'Aethersense (Psychic)', 'unique', 'Enemy units that are set up on the battlefield from Reserves cannot be set up within 12" of this model.'),
  ('80bb494a-390d-14e8-8504-25dc303a9a30', 'Fury of the Void (Psychic)', 'unique', 'In your Shooting phase, after this model’s unit has shot, select one enemy unit hit by one or more attacks made with this model’s Dread of the Deep Void. Until the end of the turn, that unit is riven. Each time an ^^**Aeldari**^^ model from your army makes an attack that targets a riven unit, add 1 to the Strength characteristic of that attack.');

-- Leader targets
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('8ee0599c-f187-3f85-573f-29c5d9c6bd75', 'dde9a77d-21ee-cb54-2145-7bc89a6b0a8f', 'e476e74b-9945-5553-4c8e-8a633b13f59f')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('d75b7e5c-4465-93fd-c0d0-41de24d18fac', '23a463f0-1152-17c1-799b-ea78c8d50875', '079a2e32-ac0c-62c2-daeb-ed1cb7babf7c')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('9f696a70-916d-b273-811a-eb3373b7c4a7', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc', '353627e2-2f2f-8cc4-45bf-3eaa802e8d76')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('10e1bc74-bfb3-c55e-ca3b-b7d91c50fc96', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'e476e74b-9945-5553-4c8e-8a633b13f59f')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('6afad1cb-eb9e-f88c-6173-41a54750b11b', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'eebf62fe-cb13-2c3f-c374-4f3425e5a231')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('a4f66a7f-ea31-6247-11fb-8961ad21db74', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'aadcf8c2-25ff-45f9-dc3c-ef2465ec54df')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('5476407d-3010-e66b-aacc-fdd2d5dacffc', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc', '18300e69-1b78-1817-c3cd-7a47e3889b45')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('e7636252-e035-13cc-6cf9-e0df54cc33e8', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc', 'f034f924-9dd1-3e18-62bd-134e50c699c5')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('7499e66d-4e0a-897d-18b4-e3920ef52cf4', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc', '735b3461-19a7-7556-9f64-a8f4ee9adb03')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('1f09a361-4759-be87-7478-b1bf96e800ed', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc', '2592b43c-234a-1d76-0868-8d922b446521')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('888131d3-741d-6a25-dc8d-e6b1edad9143', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc', '5bdfed1c-6ae0-da50-5d25-f36d9b3f79a4')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('4a77f3ec-5784-63ab-235e-5557137be2d2', '84e281f7-beaf-f596-5a35-451109153bb3', 'db14a145-7f7b-fb5c-7704-98a26e1d369d')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('57cfb3b6-13b4-f173-615a-f05060ffa488', '84e281f7-beaf-f596-5a35-451109153bb3', 'b827b3b8-6a7d-9953-27fa-c1cc0cb4c90c')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('6e0573da-02c8-9c0c-0af6-73e49519b38a', '7d45e96b-cfa7-c335-ee65-c2a8acb2056c', 'db14a145-7f7b-fb5c-7704-98a26e1d369d')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('2647556a-9d64-6cdc-ce33-69d509ba4bde', 'a1011680-ae0f-e4d0-1a12-865981b164c6', 'aadcf8c2-25ff-45f9-dc3c-ef2465ec54df')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('9696936e-a0e7-62a4-983d-d365362f88dd', 'a1011680-ae0f-e4d0-1a12-865981b164c6', 'f034f924-9dd1-3e18-62bd-134e50c699c5')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('222d17c3-70cc-023f-bd69-d43eb5e8be97', 'a1011680-ae0f-e4d0-1a12-865981b164c6', '073276ad-5d3c-e24c-938e-3e098b40fcaf')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('6204b7d6-9f5c-5fcf-b978-42018230cdbe', 'a1011680-ae0f-e4d0-1a12-865981b164c6', 'aac3f772-776b-4c45-ccd4-c5eca811c186')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('fda11b00-4ec6-f148-4c6a-5e6816fdacc1', '98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 'aadcf8c2-25ff-45f9-dc3c-ef2465ec54df')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('df4c52f8-160c-0fb9-2d94-b078747b8940', '98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 'f034f924-9dd1-3e18-62bd-134e50c699c5')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('d84381d1-d5b0-56dd-8c97-6aaa3fb2a2e4', '98b0af62-ccf5-d900-3dd6-d5e533a2ac62', '073276ad-5d3c-e24c-938e-3e098b40fcaf')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('a190a40a-9188-7003-be7c-3caa5beb4d7b', '98b0af62-ccf5-d900-3dd6-d5e533a2ac62', 'aac3f772-776b-4c45-ccd4-c5eca811c186')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('59d91caf-eeea-f15f-5adb-45e37465240a', 'd8ca34d5-ecbd-9715-7b2d-483961ce4539', '073276ad-5d3c-e24c-938e-3e098b40fcaf')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('2a518a75-dd4e-6345-6ce1-7311a888ccaa', 'd8ca34d5-ecbd-9715-7b2d-483961ce4539', 'dbf338ac-e1f1-be74-dd6a-9377a4cc27e0')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('43a9369a-e7a0-90eb-be0b-96473f63f052', '9d2cf6fe-9269-ed7d-f3d1-22e4bd0c6499', 'eebf62fe-cb13-2c3f-c374-4f3425e5a231')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('85960425-b2cc-d5e9-cc4c-6afc28b197c1', 'cffdbe10-034d-9d02-0889-9d09d5a726cd', '16f1f057-401a-4ffd-7514-ade44a3a166d')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('b5684a54-db7d-cd15-e1e0-9b116ceef3f4', '302b99d8-0be7-730d-189e-69a8e9774e3b', '18300e69-1b78-1817-c3cd-7a47e3889b45')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('e531088c-d3ac-8635-a0a9-5393aa31542f', '80645b00-38e9-3021-a5ce-3b7cdaf66bae', '735b3461-19a7-7556-9f64-a8f4ee9adb03')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('dd9fe7fc-4347-b389-5550-9d0415d4a93c', '80645b00-38e9-3021-a5ce-3b7cdaf66bae', '2592b43c-234a-1d76-0868-8d922b446521')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('fba3238a-3d11-14da-f027-231722ccfedc', 'ec65cd78-0c2d-133e-1858-c8140bcffc91', '353627e2-2f2f-8cc4-45bf-3eaa802e8d76')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('9e4fb7df-9c4e-abfe-a992-b06f6e2ef6e8', 'ec65cd78-0c2d-133e-1858-c8140bcffc91', '5bdfed1c-6ae0-da50-5d25-f36d9b3f79a4')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('6ad80d40-dfc8-8ff3-e68b-3ec82efc1679', 'c84da347-c2d2-b531-fb1c-83bfbd966079', 'aadcf8c2-25ff-45f9-dc3c-ef2465ec54df')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('e589ffb9-e04b-4952-b6dc-e3e6dfe55c9b', 'c84da347-c2d2-b531-fb1c-83bfbd966079', 'f034f924-9dd1-3e18-62bd-134e50c699c5')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('21951f0a-e00c-debb-1e4b-913c60e87642', 'c84da347-c2d2-b531-fb1c-83bfbd966079', '8a00ad4f-daf9-fcb4-e004-f39162c33888')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('afddf5cd-cecb-9a98-0e7b-6c819e566098', 'dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', 'aadcf8c2-25ff-45f9-dc3c-ef2465ec54df')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('1834d0a7-6ca2-6268-4c15-2504e2f94bef', 'dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', 'f034f924-9dd1-3e18-62bd-134e50c699c5')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('05392798-7e83-6980-5d7d-f7af779ef45b', 'dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', '926ead51-8ae2-773b-e6da-ec57358d31b5')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('628e418d-41e9-4874-fb93-3134d5fefd93', 'dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', '74b5bdef-503c-42c8-ed2c-c6cd21f58fe6')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('6071bb6d-212b-afbd-c4bc-b3f758fcd9b7', 'dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', 'a4ef9462-4013-0380-c42d-5c278276da09')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('3cefe8a6-26aa-aab1-ce13-532db892cc30', 'dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', '8a00ad4f-daf9-fcb4-e004-f39162c33888')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('2d327e89-6685-adcf-18ec-6af41f960fbc', 'dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', '09ad0a4a-95b1-c295-e022-542d38f67f63')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('2fc8f8d7-74f6-0ee4-e6bd-25f9406bbae3', 'dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', '4013a792-3644-b87d-821c-6d7faa50e6dc')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('ac7427b5-dc39-0720-7ebd-62e0a0ba4a53', 'dc9f4f89-8a3b-9a5b-2554-8dd0feb104cd', '1eb932d4-87e9-ea43-04b5-836b38968388')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('7d150124-ceda-da2f-2326-e8f81919f666', '073276ad-5d3c-e24c-938e-3e098b40fcaf', 'e60e6237-7fd1-3ea8-1e62-5c1725f72efc')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('53225753-c464-a712-7e00-7eaada1825c3', '073276ad-5d3c-e24c-938e-3e098b40fcaf', '98b0af62-ccf5-d900-3dd6-d5e533a2ac62')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('6bf6dff1-ae21-b35d-7036-2a61cabd3a8b', '073276ad-5d3c-e24c-938e-3e098b40fcaf', 'aadcf8c2-25ff-45f9-dc3c-ef2465ec54df')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('b18819ba-8687-e719-d393-ec80401abc13', '073276ad-5d3c-e24c-938e-3e098b40fcaf', 'f034f924-9dd1-3e18-62bd-134e50c699c5')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('e3462347-eb1f-a54d-4b78-d1f5e022cece', 'aac3f772-776b-4c45-ccd4-c5eca811c186', 'aadcf8c2-25ff-45f9-dc3c-ef2465ec54df')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('af24d588-7e92-b0b3-0cff-761f1f57ad37', 'aac3f772-776b-4c45-ccd4-c5eca811c186', 'f034f924-9dd1-3e18-62bd-134e50c699c5')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('ac3604bf-74ed-1aba-32a9-e4274ae96374', 'aac3f772-776b-4c45-ccd4-c5eca811c186', '073276ad-5d3c-e24c-938e-3e098b40fcaf')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('e85cbc09-40f8-9148-21c8-f6f8964aa89b', '926ead51-8ae2-773b-e6da-ec57358d31b5', 'aadcf8c2-25ff-45f9-dc3c-ef2465ec54df')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('1d976cc6-8bb8-de39-d3c4-fa9f0e34bedd', '926ead51-8ae2-773b-e6da-ec57358d31b5', 'f034f924-9dd1-3e18-62bd-134e50c699c5')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('f543f3e8-9f13-2e27-25cb-3b31f5a980ac', '926ead51-8ae2-773b-e6da-ec57358d31b5', '74b5bdef-503c-42c8-ed2c-c6cd21f58fe6')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('71041dc0-30ba-be6c-5715-cdb77205252a', '926ead51-8ae2-773b-e6da-ec57358d31b5', 'a4ef9462-4013-0380-c42d-5c278276da09')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('22c61d4b-f7c7-facb-49d9-da5e3f4e0885', '926ead51-8ae2-773b-e6da-ec57358d31b5', '8a00ad4f-daf9-fcb4-e004-f39162c33888')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('6582c138-0ac4-5d2b-76ec-06265992eb58', '926ead51-8ae2-773b-e6da-ec57358d31b5', '09ad0a4a-95b1-c295-e022-542d38f67f63')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('8a77e5cc-8edc-aaa5-430e-39e8bac59c03', '926ead51-8ae2-773b-e6da-ec57358d31b5', '4013a792-3644-b87d-821c-6d7faa50e6dc')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('2cb61a09-a682-ecf3-f84a-714292e2e1d3', '926ead51-8ae2-773b-e6da-ec57358d31b5', '1eb932d4-87e9-ea43-04b5-836b38968388')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('1fca77bc-071c-7062-2d93-9377f7c392a1', '683811e1-4c3d-6d0f-7576-14e8c39c92db', '74b5bdef-503c-42c8-ed2c-c6cd21f58fe6')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('08951747-bae5-a5e6-8a25-53c5bef3cd28', '683811e1-4c3d-6d0f-7576-14e8c39c92db', 'a4ef9462-4013-0380-c42d-5c278276da09')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('e22156eb-090a-70aa-cbde-cd66cae95d0a', 'b866ab9a-7de8-d0f5-0ce4-119e020b1c93', '74b5bdef-503c-42c8-ed2c-c6cd21f58fe6')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('36c11425-da33-1113-1660-d78d48bd8751', '9f099c3a-3c45-c74e-1f0f-e657f1a038f9', '1015a80f-e71f-3c73-477a-f365d0ff4980')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('1faa9d38-46f4-9071-7f60-e257c065c011', '50d2d669-1649-6863-f27a-b5c4bff1d8c6', '09ad0a4a-95b1-c295-e022-542d38f67f63')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('42abea3e-0048-1811-9d53-f2771594459f', 'ca0ae18f-c59b-f23c-ad55-d2c33cf1b976', '09ad0a4a-95b1-c295-e022-542d38f67f63')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('3982b44f-ea1d-3c57-cbb2-90edccc80545', 'ea9799ab-7a61-86c1-51bc-ac7aa7dcbd41', '1015a80f-e71f-3c73-477a-f365d0ff4980')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('6c1bac42-b310-f463-4874-e6effbcf2dc2', '96648a8e-79d8-2afb-d917-e34bb5d37774', 'a4766991-fe96-2795-036b-200a8ddce5d3')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('f5de4e7b-4e45-eb5e-9bc4-4f3d2ee71b46', 'e5a2871c-c784-9418-718b-6e67b11d5895', '1024a069-ec6f-ee70-fdff-16909cd167b0')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('2eefd12c-e115-acd9-8bf9-7bc76cf76147', 'e5a2871c-c784-9418-718b-6e67b11d5895', '2ad169fc-b38a-9be0-f659-ee20e10fa7f5')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('c5d0ae59-8f69-2aec-7115-39c175add75a', 'e5a2871c-c784-9418-718b-6e67b11d5895', 'a8408826-acaa-d425-aa2c-b3dc15b5978b')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('94064838-6597-e688-1a82-52175165df50', 'dbf338ac-e1f1-be74-dd6a-9377a4cc27e0', '073276ad-5d3c-e24c-938e-3e098b40fcaf')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('4afdefdd-4a2d-25e3-0402-2f771e5c01dd', '8b23b0ef-b224-f3c0-79a7-1f3062669fc2', '74b5bdef-503c-42c8-ed2c-c6cd21f58fe6')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('2fede2fe-657a-c26d-357c-976d398ecf66', '8b23b0ef-b224-f3c0-79a7-1f3062669fc2', 'a4ef9462-4013-0380-c42d-5c278276da09')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('e406ce12-0d0c-e661-3885-ec50e11004d5', '8b23b0ef-b224-f3c0-79a7-1f3062669fc2', '1eb932d4-87e9-ea43-04b5-836b38968388')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('cee5a6ca-cea6-ec5a-c128-0d2f80c333c0', 'fa9f1b03-63ba-a2b4-2c0a-361d22903858', 'b827b3b8-6a7d-9953-27fa-c1cc0cb4c90c')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('c9f50faf-be0a-f46e-6288-d8dcfa73121e', '5ec3816b-ca1b-023c-bbb6-99aba4ede17b', '09ad0a4a-95b1-c295-e022-542d38f67f63')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('f5ae6939-4ce5-3c04-704b-48ce0db1ca9e', '5ec3816b-ca1b-023c-bbb6-99aba4ede17b', '4013a792-3644-b87d-821c-6d7faa50e6dc')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('1edb06f4-0dd7-dce4-df00-892a2d734145', 'b3f4e614-cfd9-e802-d51e-79b861d1f344', '683811e1-4c3d-6d0f-7576-14e8c39c92db')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('fcbf65cf-4cce-445a-bd19-a63054fd504c', 'b3f4e614-cfd9-e802-d51e-79b861d1f344', '74b5bdef-503c-42c8-ed2c-c6cd21f58fe6')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('fedf43a6-61d7-693a-2277-b569fcf21b04', 'b3f4e614-cfd9-e802-d51e-79b861d1f344', 'a4ef9462-4013-0380-c42d-5c278276da09')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('0d819ce7-b9c0-7a91-6a22-f737656f2bbe', '80bb494a-390d-14e8-8504-25dc303a9a30', '8a00ad4f-daf9-fcb4-e004-f39162c33888')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;


-- ============================================================
