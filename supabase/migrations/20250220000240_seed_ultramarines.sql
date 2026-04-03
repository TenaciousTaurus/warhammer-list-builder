-- ============================================================
-- Ultramarines faction seed data
-- Auto-generated from BSData/wh40k-10e: Imperium - Ultramarines.cat
-- 15 units, 1 detachments
-- Generated: 2026-04-03T04:05:59.179Z
-- ============================================================

-- ============================================================
-- SEED DATA: Ultramarines
-- Auto-generated from BSData/wh40k-10e
-- ============================================================

INSERT INTO public.factions (id, name, alignment) VALUES
  ('9e75f6a7-1c9f-c662-18a2-277fd7c4d3c1', 'Ultramarines', 'imperium')
ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name, alignment = EXCLUDED.alignment;

-- Detachments
INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES
  ('d849c561-6275-b78a-4ae8-0416eaeab1f9', '9e75f6a7-1c9f-c662-18a2-277fd7c4d3c1', 'Index', 'Default detachment using index rules.')
ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;

-- Units
INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('0dd06cea-26a3-bff8-ea5c-6819a41b7978', '9e75f6a7-1c9f-c662-18a2-277fd7c4d3c1', 'Captain Sicarius', 'epic_hero', '6"', 4, '2+', 5, 6, 1, '{"Epic Hero", "Character", "Infantry", "Captain", "Imperium", "Sicarius"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('0dd06cea-26a3-bff8-ea5c-6819a41b7978', 1, 85);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('0dd06cea-26a3-bff8-ea5c-6819a41b7978', 'Artisan Plasma Pistol', 'ranged', '12"', '1', '2+', 8, -3, '2', '{"Pistol"}'),
  ('0dd06cea-26a3-bff8-ea5c-6819a41b7978', 'Talassarian Tempest Blade', 'melee', NULL, '6', '2+', 5, -2, '2', '{"Lethal Hits"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('0dd06cea-26a3-bff8-ea5c-6819a41b7978', 'Lead From the Front', 'unique', 'While this model is leading a unit, models in that unit have the Scouts 6" ability and ranged weapons equipped by models in that unit have the [ASSAULT] ability.'),
  ('0dd06cea-26a3-bff8-ea5c-6819a41b7978', 'Knight Champion of Macragge', 'unique', 'Once per turn, when an enemy unit ends a Normal, Advance or Fall Back move within 9" of this model, if this model’s unit is not within Engagement Range of one or more enemy units, it can make a Normal move of up to 6".'),
  ('0dd06cea-26a3-bff8-ea5c-6819a41b7978', 'Leader', 'core', 'This model can be attached to the following units:

■ Assault Intercessor Squad
■ Bladeguard Veteran Squad
■ Company Heroes
■ Sternguard Veteran Squad
■ Tactical Squad'),
  ('0dd06cea-26a3-bff8-ea5c-6819a41b7978', 'Oath of Moment', 'faction', '');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('441031e5-d604-974d-61f4-c6665bada7cc', '9e75f6a7-1c9f-c662-18a2-277fd7c4d3c1', 'Chaplain Cassius', 'epic_hero', '6"', 4, '3+', 4, 5, 1, '{"Epic Hero", "Character", "Infantry", "Chaplain Cassius", "Imperium"}', 1, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('441031e5-d604-974d-61f4-c6665bada7cc', 1, 80);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('441031e5-d604-974d-61f4-c6665bada7cc', 'Infernus', 'ranged', '12"', 'D6', 'N/A', 4, -1, '1', '{"Anti-Infantry 4+", "Devastating Wounds", "Ignores Cover", "Torrent"}'),
  ('441031e5-d604-974d-61f4-c6665bada7cc', 'Artificer Crozius', 'melee', NULL, '5', '2+', 6, -1, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('441031e5-d604-974d-61f4-c6665bada7cc', 'Catechism of Death', 'unique', 'While this model is leading a unit, melee weapons equipped by models in that unit have the [DEVASTATING WOUNDS] ability.'),
  ('441031e5-d604-974d-61f4-c6665bada7cc', 'Inspired Retribution', 'unique', 'While this model is leading a unit, each time a model in that unit is destroyed by a melee attack, if that model has not fought this phase, roll one D6. On a 4+, do not remove it from play; that destroyed model can fight after the attacking model’s unit has finished making its attacks, and is then removed from play.'),
  ('441031e5-d604-974d-61f4-c6665bada7cc', 'Leader', 'core', 'This model can be attached to the following units:

■ Assault Squad
■ Command Squad
■ Sternguard Veteran Squad
■ Tactical Squad
■ Tyrannic War Veterans
■ Vanguard Veteran Squad'),
  ('441031e5-d604-974d-61f4-c6665bada7cc', 'Oath of Moment', 'faction', '');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('4665db8b-972a-32b4-3d88-2840de070382', '9e75f6a7-1c9f-c662-18a2-277fd7c4d3c1', 'Chief Librarian Tigurius', 'epic_hero', '6"', 4, '3+', 4, 6, 1, '{"Character", "Epic Hero", "Infantry", "Imperium", "Psyker", "Chief Librarian Tigurius"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('4665db8b-972a-32b4-3d88-2840de070382', 1, 75);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('4665db8b-972a-32b4-3d88-2840de070382', '➤ Storm of the Emperor’s Wrath - Witchfire', 'ranged', '18"', 'D6', '2+', 6, -2, '2', '{"Blast", "Psychic"}'),
  ('4665db8b-972a-32b4-3d88-2840de070382', '➤ Storm of the Emperor’s Wrath - Focused Witchfire', 'ranged', '18"', '2D6', '2+', 6, -2, '2', '{"Blast", "Hazardous", "Psychic"}'),
  ('4665db8b-972a-32b4-3d88-2840de070382', 'Rod of Tigurius', 'melee', NULL, '5', '3+', 7, -2, 'D3', '{"Psychic"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('4665db8b-972a-32b4-3d88-2840de070382', 'Hood of Hellfire', 'unique', 'While this model is leading a unit, models in that unit have the Feel No Pain 4+ ability against Psychic Attacks and mortal wounds.'),
  ('4665db8b-972a-32b4-3d88-2840de070382', 'Master of Prescience (Psychic)', 'unique', 'While this model is leading a unit, each time an attack targets that unit, subtract 1 from the Hit roll. In addition, once per battle round, you can target that unit with one of the following Stratagems for 0CP: Counter-offensive; Fire Overwatch; Go to Ground;
Heroic Intervention.'),
  ('4665db8b-972a-32b4-3d88-2840de070382', 'Leader', 'core', 'This model can be attached to the following units:

■ Assault Intercessor Squad
■ Bladeguard Veteran Squad
■ Desolation Squad
■ Devastator Squad
■ Intercessor Squad
■ Sternguard Veteran Squad
■ Tactical Squad'),
  ('4665db8b-972a-32b4-3d88-2840de070382', 'Oath of Moment', 'faction', '');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', '9e75f6a7-1c9f-c662-18a2-277fd7c4d3c1', 'Marneus Calgar', 'epic_hero', '6"', 6, '2+', 6, 6, 1, '{"Epic Hero", "Character", "Infantry", "Gravis", "Chapter Master", "Marneus Calgar", "Imperium"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', 3, 200);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', 'Gauntlets of Ultramar', 'ranged', '18"', '4', '2+', 4, -1, '2', '{"Pistol", "Twin-linked"}'),
  ('f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', 'Gauntlets of Ultramar', 'melee', NULL, '6', '2+', 8, -3, '3', '{"Twin-linked"}'),
  ('f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', 'Victrix Power Sword', 'melee', NULL, '5', '2+', 5, -2, '2', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', 'Inspiring Leader', 'core', 'While this model is leading a unit, that unit is eligible to shoot and declare a charge in a turn in which it Advanced or Fell Back.'),
  ('f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', 'Master Tactician', 'unique', 'At the start of your Command phase, if this unit’s Marneus Calgar model is your WARLORD and is on the battlefield, you gain 1CP.'),
  ('f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', 'Honour Guard of Macragge', 'unique', 'While this unit contains one or more Victrix Honour Guard models, this unit’s Marneus Calgar model has the Feel No Pain 4+ ability.'),
  ('f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', 'Leader', 'core', 'This unit can be attached to the following units:

■ Aggressor Squad
■ Assault Intercessor Squad
■ Bladeguard Veteran Squad
■ Company Heroes
■ Eradicator Squad
■ Heavy Intercessor Squad
■ Infernus Squad
■ Intercessor Squad
■ Sternguard Veteran Squad
■ Tactical Squad'),
  ('f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', 'Oath of Moment', 'faction', '');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('01d72d31-f0dc-b60f-4c5a-58dc2331c2e9', 'f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', 'Marneus Calgar', 1, 1, 1, true, 0, NULL),
  ('ce8ac796-6c69-4462-aa74-f37d32f28d66', 'f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', 'Victrix Honour Guard', 2, 2, 2, false, 1, NULL)
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('97e8ebef-4295-bda8-1645-95cf066bfc1c', '9e75f6a7-1c9f-c662-18a2-277fd7c4d3c1', 'Roboute Guilliman', 'epic_hero', '8"', 9, '2+', 10, 5, 4, '{"Epic Hero", "Character", "Imperium", "Primarch", "Roboute Guilliman", "Monster"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('97e8ebef-4295-bda8-1645-95cf066bfc1c', 1, 340);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('97e8ebef-4295-bda8-1645-95cf066bfc1c', 'Hand of Dominion', 'ranged', '30"', '2', '2+', 6, -2, '2', '{"Rapid Fire 2"}'),
  ('97e8ebef-4295-bda8-1645-95cf066bfc1c', 'Hand of Dominion', 'melee', NULL, '7', '2+', 14, -4, '4', '{"Lethal Hits"}'),
  ('97e8ebef-4295-bda8-1645-95cf066bfc1c', 'The Emperor''s Sword', 'melee', NULL, '14', '2+', 8, -3, '2', '{"Devastating Wounds"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('97e8ebef-4295-bda8-1645-95cf066bfc1c', 'Author of the Codex', 'unique', 'At the Start of your Command phase, select two Author of the Codex abilities (see left). Until the start of your next Command phase, this model has those abilities.’

Primarch of the XIII (Aura): While a friendly Adeptus Astartes unit is within 6" of this model, add 1 to the Objective Control characteristic of models in that unit and you can re-roll Battle-shock and Leadership tests taken for that unit.

Master of Battle: After you have selected an enemy unit using the Oath of Moment ability, select a second enemy unit. Until the start of your next Command phase, if your Oath of Moment target is destroyed, that second enemy unit becomes your Oath of Moment target until you select a new one.

Supreme Strategist: Once per battle round, you can target one friendly ADEPTUS ASTARTES unit within 12" of this model with a Stratagem. If it does, reduce the CP cost of that use of that Stratagem by 1CP.'),
  ('97e8ebef-4295-bda8-1645-95cf066bfc1c', 'Ultramarines Bodyguard', 'unique', 'While this model is within 3" of one or more friendly Adeptus Astartes Infantry units, this model has the Lone Operative ability'),
  ('97e8ebef-4295-bda8-1645-95cf066bfc1c', 'Armour of Fate', 'unique', 'The first time this model is destroyed, roll one D6 at the end of the phase: on a 3+, set this model back up on the battlefield as close as possible to where it was destroyed and not within Engagement Range of any enemy models, with 6 wounds remaining.'),
  ('97e8ebef-4295-bda8-1645-95cf066bfc1c', 'Supreme Commander', 'unique', 'If this model is in your army, it must be your Warlord.'),
  ('97e8ebef-4295-bda8-1645-95cf066bfc1c', 'Oath of Moment', 'faction', '');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('6bf0c821-6a74-ba40-a35f-bb4d12358420', '9e75f6a7-1c9f-c662-18a2-277fd7c4d3c1', 'Sergeant Chronus', 'epic_hero', '6"', 4, '2+', 3, 6, 1, '{"Infantry", "Character", "Epic Hero", "Imperium", "Sergeant Chronus"}', 1, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('6bf0c821-6a74-ba40-a35f-bb4d12358420', 1, 75);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('6bf0c821-6a74-ba40-a35f-bb4d12358420', 'Chronus'' Servo-Arm', 'melee', NULL, '3', '3+', 8, -2, '3', '{}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('6bf0c821-6a74-ba40-a35f-bb4d12358420', 'Tank Commander', 'unique', 'While this model is commanding a Vehicle model (see reverse):

■ Ranged weapons equipped by that Vehicle model have a Ballistic Skill characteristic of 2+.
■ Each time that Vehicle model is selected to shoot, you can re-roll one Wound roll when resolving those attacks.

If your army includes one or more of the Vehicle models listed below, Sergeant Chronus must start the battle embarked within one of those models as if it were a Transport. Sergeant Chronus can only disembark from that Vehicle if it is destroyed. While embarked in this way, Sergeant Chronus is said to be commanding that Vehicle.

■ Hunter
■ Land Raider
■ Land Raider Crusader
■ Land Raider Redeemer
■ Predator Annihilator
■ Predator Destructor
■ Stalker
■ Vindicator
■ Whirlwind'),
  ('6bf0c821-6a74-ba40-a35f-bb4d12358420', 'Chronus', 'unique', 'When this model disembarks from a Vehicle model it was commanding, it has the Lone Operative ability until the end of the battle.'),
  ('6bf0c821-6a74-ba40-a35f-bb4d12358420', 'Oath of Moment', 'faction', '');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('60f6d21a-e18b-0e2e-092b-7c489487afd9', '9e75f6a7-1c9f-c662-18a2-277fd7c4d3c1', 'Sergeant Telion', 'epic_hero', '6"', 4, '4+', 3, 6, 1, '{"Epic Hero", "Character", "Infantry", "Imperium", "Sergeant Telion"}', 1, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('60f6d21a-e18b-0e2e-092b-7c489487afd9', 1, 70);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('60f6d21a-e18b-0e2e-092b-7c489487afd9', 'Combat Knife', 'melee', NULL, '4', '3+', 4, 0, '1', '{}'),
  ('60f6d21a-e18b-0e2e-092b-7c489487afd9', 'Quietus', 'ranged', '36"', '2', '2+', 4, -2, '3', '{"Precision"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('60f6d21a-e18b-0e2e-092b-7c489487afd9', 'Voice of Experience', 'unique', 'While this model is leading a unit, improve the Objective Control characteristic of models in that unit by 1 and each time a model in that unit makes an attack, add 1 to the Hit roll.'),
  ('60f6d21a-e18b-0e2e-092b-7c489487afd9', 'Guiding Hand', 'unique', 'While this model is leading a unit, each time that unit is selected to shoot or fight, select one of the following abilities to apply to weapons equipped by models in that unit until the end of the phase:


■ [LETHAL HITS]
■ [PRECISION]
■ [SUSTAINED HITS 1]'),
  ('60f6d21a-e18b-0e2e-092b-7c489487afd9', 'Leader', 'core', 'This model can be attached to the following units:

■ Scout Squad
■ Scout Sniper Squad'),
  ('60f6d21a-e18b-0e2e-092b-7c489487afd9', 'Oath of Moment', 'faction', '');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('13286088-3f71-0fc1-414a-a75995540c74', '9e75f6a7-1c9f-c662-18a2-277fd7c4d3c1', 'Tyrannic War Veterans', 'infantry', '6"', 4, '3+', 2, 6, 1, '{"Infantry", "Imperium", "Tyrannic War Veterans"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('13286088-3f71-0fc1-414a-a75995540c74', 5, 85);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('13286088-3f71-0fc1-414a-a75995540c74', 'Bolt Pistol', 'ranged', '12"', '1', '3+', 4, 0, '1', '{"Anti-Tyranids 4+", "Pistol"}'),
  ('13286088-3f71-0fc1-414a-a75995540c74', 'Boltgun', 'ranged', '24"', '2', '3+', 4, 0, '1', '{"Anti-Tyranids 4+"}'),
  ('13286088-3f71-0fc1-414a-a75995540c74', 'Close Combat Weapon', 'melee', NULL, '3', '3+', 4, 0, '1', '{"Anti-Tyranids 4+"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('13286088-3f71-0fc1-414a-a75995540c74', 'Tyrannic War Veterans', 'unique', 'Weapons equipped by models in this unit have the [DEVASTATING WOUNDS] ability when targeting Tyranids units.'),
  ('13286088-3f71-0fc1-414a-a75995540c74', 'Oath of Moment', 'faction', '');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('10261141-0d28-8efb-074f-34ba52e1b45a', '13286088-3f71-0fc1-414a-a75995540c74', 'Tyrannic War Veteran', 4, 10, 4, false, 0, 'Tyrannic War Veterans'),
  ('8b6fb65a-d0a2-bb29-28c2-d1d76eebc64e', '13286088-3f71-0fc1-414a-a75995540c74', 'Veteran Sergeant', 1, 1, 1, true, 1, 'Tyrannic War Veterans')
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES
  ('fea1784e-4145-35a2-4a00-35f9faed76dd', '13286088-3f71-0fc1-414a-a75995540c74', 'Tyrannic War Veterans', 'Tyrannic War Veteran', true, 0, NULL, NULL, NULL),
  ('fb54adf0-a494-23ea-3f0f-c6cd92b05fa2', '13286088-3f71-0fc1-414a-a75995540c74', 'Tyrannic War Veterans', 'Veteran Sergeant', false, 0, NULL, NULL, NULL)
ON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('38dd5579-bcd2-8c28-2ca5-00919e38c258', '9e75f6a7-1c9f-c662-18a2-277fd7c4d3c1', 'Uriel Ventris', 'epic_hero', '6"', 4, '3+', 5, 6, 1, '{"Uriel Ventris", "Character", "Epic Hero", "Infantry", "Captain", "Imperium", "Tacticus"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('38dd5579-bcd2-8c28-2ca5-00919e38c258', 1, 95);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('38dd5579-bcd2-8c28-2ca5-00919e38c258', 'Invictus', 'ranged', '24"', '2', '2+', 4, -1, '2', '{}'),
  ('38dd5579-bcd2-8c28-2ca5-00919e38c258', 'Sword of Idaeus', 'melee', NULL, '6', '2+', 6, -2, '2', '{"Sustained Hits 1"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('38dd5579-bcd2-8c28-2ca5-00919e38c258', 'Unorthodox Strategist [Aura]', 'unique', 'Each time your opponent targets a unit from their army with a  stratagem, if that unit is within 12" of this model, increase the cost of that use of that Stratagem by 1CP (this is not cumulative with any other rules that would increase the CP cost of that Stratagem).'),
  ('38dd5579-bcd2-8c28-2ca5-00919e38c258', 'Master of the Fleet', 'unique', 'During the Declare Battle Formations step, if your army includes this model, select one Phobos, Gravis, or Tacticus Adeptus Astartes Infantry unit from your army.  That unit gains the Deep Strike ability.'),
  ('38dd5579-bcd2-8c28-2ca5-00919e38c258', 'Leader', 'core', 'This model can be attached to the following units:

■ Assault Intercessor Squad
■ Bladeguard Veteran Squad''
■ Company Heroes
■ Intercessor Squad
■ Sternguard Veteran Squad
■ Tactical Squad'),
  ('38dd5579-bcd2-8c28-2ca5-00919e38c258', 'Oath of Moment', 'faction', '');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('759541e8-40cd-0b7b-c74f-67b6d414f958', '9e75f6a7-1c9f-c662-18a2-277fd7c4d3c1', 'Ultramarines Honour Guard', 'infantry', '6"', 4, '2+', 2, 6, 1, '{"Infantry", "Imperium", "Honor Guard"}', 3, true);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('759541e8-40cd-0b7b-c74f-67b6d414f958', 4, 155);

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('759541e8-40cd-0b7b-c74f-67b6d414f958', 'Honour Guard', 'unique', 'While a Captain or Chapter Master model is leading this unit, each time an attack targets this unit, subtract 1 from the Wound roll.'),
  ('759541e8-40cd-0b7b-c74f-67b6d414f958', 'Honour Guard of Macragge', 'unique', 'MARNEUS CALGAR can be attached to this unit. If a CAPTAIN model from your army with the Leader ability can be attached to a COMMAND SQUAD, it can be attached to this unit instead.'),
  ('759541e8-40cd-0b7b-c74f-67b6d414f958', 'Oath of Moment', 'faction', '');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('af54c8e0-4452-fbb5-fbef-d55c1f8b39bd', '759541e8-40cd-0b7b-c74f-67b6d414f958', 'Company Ancient', 1, 1, 1, true, 2, NULL),
  ('c3f745a8-4895-9367-577d-fb464e44e49e', '759541e8-40cd-0b7b-c74f-67b6d414f958', 'Company Champion', 1, 1, 1, true, 3, NULL),
  ('4dfd4030-f4b5-4554-945c-0404200ce4e3', '759541e8-40cd-0b7b-c74f-67b6d414f958', 'Honour Guard', 2, 2, 2, false, 4, NULL)
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('90a6b68d-6914-82ab-0a1f-5d53319c896c', '9e75f6a7-1c9f-c662-18a2-277fd7c4d3c1', 'Lieutenant Titus', 'epic_hero', '6"', 4, '3+', 5, 6, 1, '{"Infantry", "Character", "Imperium", "Epic Hero", "Lieutenant", "Titus", "Tacticus"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('90a6b68d-6914-82ab-0a1f-5d53319c896c', 1, 70);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('90a6b68d-6914-82ab-0a1f-5d53319c896c', 'Astartes Chainsword', 'melee', NULL, '8', '2+', 4, -1, '1', '{"Anti-Infantry 2+"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('90a6b68d-6914-82ab-0a1f-5d53319c896c', 'Press the Attack', 'unique', ': Weapons equipped by models in this model’s unit have the [SUSTAINED HITS 1] ability.'),
  ('90a6b68d-6914-82ab-0a1f-5d53319c896c', 'Honour of the Chapter', 'unique', 'If this model is destroyed by a melee attack, if it has not fought this phase, roll one D6: on a 2+, do not remove it from play. This model can fight after the attacking unit has finished making its attacks, and is then removed from play.'),
  ('90a6b68d-6914-82ab-0a1f-5d53319c896c', 'Leader', 'core', 'This model can be attached to the following units:

■ Assault Intercessor Squad
■ Bladeguard Veteran Squad
■ Hellblaster Squad
■ Infernus Squad
■ Intercessor Squad
■ Sternguard Veteran Squad'),
  ('90a6b68d-6914-82ab-0a1f-5d53319c896c', 'Oath of Moment', 'faction', '');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', '9e75f6a7-1c9f-c662-18a2-277fd7c4d3c1', 'Marneus Calgar in Armour of Antilochus', 'epic_hero', '6"', 6, '2+', 6, 6, 1, '{"Epic Hero", "Character", "Infantry", "Imperium", "Terminator", "Chapter Master", "Marneus Calgar"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', 1, 140);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', 'Gauntlets of Ultramar', 'ranged', '18"', '4', '2+', 4, -1, '2', '{"Pistol", "Twin-linked"}'),
  ('6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', 'Gauntlets of Ultramar', 'melee', NULL, '6', '2+', 8, -3, '3', '{"Twin-linked"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', 'Inspiring Leader', 'core', 'While this model is leading a unit, that unit is eligible to shoot and declare a charge in a turn in which it Advanced or Fell Back.'),
  ('6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', 'Master Tactician', 'unique', 'At the start of your Command phase, if this unit’s Marneus Calgar model is your WARLORD and is on the battlefield, you gain 1CP.'),
  ('6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', 'Leader', 'core', 'This model can be attached to the following units: Aggressor Squad, Assault Intercessor Squad,
Bladeguard Veteran Squad, Company Heroes, Eradicator Squad, Heavy Intercessor Squad,
Infernus Squad, Intercessor Squad, Sternguard Veteran Squad, Tactical Squad, Terminator
Assault Squad, Terminator Squad, Victrix Honour Guard'),
  ('6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', 'Oath of Moment', 'faction', '');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('6b395f28-c7aa-203f-e831-714da4be1dee', '9e75f6a7-1c9f-c662-18a2-277fd7c4d3c1', 'Cato Sicarius', 'epic_hero', '6"', 4, '2+', 5, 6, 1, '{"Character", "Epic Hero", "Infantry", "Captain", "Imperium", "Tacticus", "Sicarius", "Cato"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('6b395f28-c7aa-203f-e831-714da4be1dee', 1, 95);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('6b395f28-c7aa-203f-e831-714da4be1dee', 'Artisan Plasma Pistol', 'ranged', '12"', '1', '2+', 8, -3, '2', '{"Pistol"}'),
  ('6b395f28-c7aa-203f-e831-714da4be1dee', '➤ Talassarian Tempest Blade - Strike', 'melee', NULL, '4', '2+', 6, -3, '3', '{"Devastating Wounds"}'),
  ('6b395f28-c7aa-203f-e831-714da4be1dee', '➤ Talassarian Tempest Blade - Coup de Grace', 'melee', NULL, '6', '2+', 5, -2, '2', '{"Precision"}'),
  ('6b395f28-c7aa-203f-e831-714da4be1dee', '➤ Talassarian Tempest Blade - Sweep', 'melee', NULL, '9', '2+', 5, -2, '1', '{"Sustained Hits 1"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('6b395f28-c7aa-203f-e831-714da4be1dee', 'Knight Champion of Macragge', 'unique', 'Once per turn, when an enemy unit ends a Normal, Advance or Fall Back move within 9" of this model’s unit, if this unit is not within Engagement Range of one or more enemy units, it can make a Normal move of up to 6".'),
  ('6b395f28-c7aa-203f-e831-714da4be1dee', 'Honour or Death', 'unique', 'You can target this unit with the Heroic Intervention Stratagem for 0CP, even if you have already used
that Stratagem on a different unit this phase.'),
  ('6b395f28-c7aa-203f-e831-714da4be1dee', 'Leader', 'core', 'This model can be attached to the following units: Victrix Honour Guard


You can attach this model to the above unit even if a Marneus Calgar unit has already been attached
to it. If you do, and that Bodyguard unit is destroyed, the Leader units attached to it become separate
units, with their original Starting Strengths'),
  ('6b395f28-c7aa-203f-e831-714da4be1dee', 'Oath of Moment', 'faction', '');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('bb670e32-b9ac-110c-be43-2f10ea894161', '9e75f6a7-1c9f-c662-18a2-277fd7c4d3c1', 'Captain Titus', 'epic_hero', '6"', 4, '3+', 6, 6, 1, '{"Titus", "Infantry", "Character", "Epic Hero", "Imperium", "Tacticus", "Captain"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('bb670e32-b9ac-110c-be43-2f10ea894161', 1, 90);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('bb670e32-b9ac-110c-be43-2f10ea894161', 'Master-crafted Chainsword', 'melee', NULL, '8', '2+', 5, -1, '2', '{"Anti-infantry 2+"}'),
  ('bb670e32-b9ac-110c-be43-2f10ea894161', 'Master-crafted Bolter', 'ranged', '24"', '2', '2+', 4, -1, '2', '{"Assault", "Heavy"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('bb670e32-b9ac-110c-be43-2f10ea894161', 'Press the Attack', 'unique', 'Weapons equipped by models in this model’s unit have the [SUSTAINED HITS 1] ability'),
  ('bb670e32-b9ac-110c-be43-2f10ea894161', 'Honour of Ultramar', 'unique', 'If this model is destroyed by a melee attack, if it has not fought this phase, roll one D6: on a 2+,
do not remove it from play. This model can fight after the attacking unit has finished making its attacks. If one or more enemy models are destroyed as a result of those attacks, this model regains D3 lost wounds and is not destroyed; otherwise, it is removed from play.'),
  ('bb670e32-b9ac-110c-be43-2f10ea894161', 'Leader', 'core', 'This model can be attached to the following units: 


■  Assault Intercessor Squad 
■  Bladeguard Veteran Squad 
■  Company Heroes 
■  Hellblaster Squad 
■  Infernus Squad 
■  Intercessor Squad 
■  Sternguard Veteran Squad 
■  Wardens of Ultramar'),
  ('bb670e32-b9ac-110c-be43-2f10ea894161', 'Oath of Moment', 'faction', '');

INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list, is_legends) VALUES
  ('cddb4dda-6772-2437-68cc-042c1624a9f9', '9e75f6a7-1c9f-c662-18a2-277fd7c4d3c1', 'Wardens of Ultramar', 'epic_hero', '6"', 4, '3+', 4, 6, 1, '{"Infantry", "Epic Hero", "Imperium", "Tacticus", "Wardens of Ultramar"}', 1, false);

INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES
  ('cddb4dda-6772-2437-68cc-042c1624a9f9', 6, 90);

INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES
  ('cddb4dda-6772-2437-68cc-042c1624a9f9', 'Close combat weapon', 'melee', NULL, '4', '2+', 4, 0, '1', '{}'),
  ('cddb4dda-6772-2437-68cc-042c1624a9f9', 'Archeotech Laspistol', 'ranged', '12"', '1', '3+', 4, -1, '1', '{"Pistol"}'),
  ('cddb4dda-6772-2437-68cc-042c1624a9f9', 'Power Weapon', 'melee', NULL, '4', '2+', 4, -2, '1', '{}'),
  ('cddb4dda-6772-2437-68cc-042c1624a9f9', 'Astropathic Blast', 'ranged', '12"', 'D6', '3+', 4, -1, '1', '{"Blast", "Psychic"}'),
  ('cddb4dda-6772-2437-68cc-042c1624a9f9', 'Force Stave', 'melee', NULL, '1', '2+', 5, -2, '2', '{"Psychic"}');

INSERT INTO public.abilities (unit_id, name, type, description) VALUES
  ('cddb4dda-6772-2437-68cc-042c1624a9f9', 'Second Company Banner', 'unique', 'While this unit contains Ancient Gadriel, add 1 to the Objective Control characteristic of models in this unit. While this unit contains Ancient Gadriel and Captain Titus, improve the Leadership characteristic of models in this unit by 1 as well.'),
  ('cddb4dda-6772-2437-68cc-042c1624a9f9', 'Strategium Command', 'unique', 'After both players have deployed their armies, if this unit is on the battlefield (or any Transport it
is embarked within is on the battlefield), select up to three Adeptus Astartes units from your army and redeploy them. When doing so, you can set those units up in Strategic Reserves, regardless of how many units are already in Strategic Reserves.'),
  ('cddb4dda-6772-2437-68cc-042c1624a9f9', 'Heroes of Ultramar', 'unique', 'At the start of the Declare Battle Formations step, this unit can join one of the following units. This
unit then counts as part of that unit for the rest of the battle, and that unit’s Starting Strength is
increased accordingly.


■ Assault intercessor Squad
■ Bladeguard Veteran Squad
■ Intercessor Squad
■ Sternguard Veteran Squad


This unit cannot join an Attached unit, and only Captain Titus can join a unit this unit has joined.');

INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES
  ('93584f21-a493-a1c2-2afd-bd287053de5e', 'cddb4dda-6772-2437-68cc-042c1624a9f9', 'Ancient Gadriel', 1, 1, 1, true, 0, NULL),
  ('67e213c3-a6ac-ef8f-7b77-7ba4ad421088', 'cddb4dda-6772-2437-68cc-042c1624a9f9', 'Veteran Sergeant Metaurus', 1, 1, 1, true, 1, NULL),
  ('5cd72e68-9820-6a59-be4a-19f82148c42d', 'cddb4dda-6772-2437-68cc-042c1624a9f9', 'Gaius Silva', 1, 1, 1, true, 2, NULL),
  ('15afe98c-a331-e8f3-e502-5c93a6c7d3ba', 'cddb4dda-6772-2437-68cc-042c1624a9f9', 'Aemelia Minervas', 1, 1, 1, true, 3, NULL),
  ('39a3f587-93ea-f56b-3c9f-6af7c805227c', 'cddb4dda-6772-2437-68cc-042c1624a9f9', 'Dainal Kornelius', 1, 1, 1, true, 4, NULL),
  ('dea426d3-1143-9284-00b1-9d9e95cce1a3', 'cddb4dda-6772-2437-68cc-042c1624a9f9', 'Lucia Vestha', 1, 1, 1, true, 5, NULL)
ON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;

-- Leader targets
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('ad9a2465-1584-756d-031f-71059d79a47b', '0dd06cea-26a3-bff8-ea5c-6819a41b7978', 'af8b192c-4077-c78a-04da-b596acc3703a')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('1255d5bf-73cd-67df-efb4-32689df24e6d', '0dd06cea-26a3-bff8-ea5c-6819a41b7978', '68269daa-1f86-00a4-1978-60f878ef03a2')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('11cc6444-bb12-7966-3fb9-d696ce452a88', '0dd06cea-26a3-bff8-ea5c-6819a41b7978', '7a209e63-225b-2371-5b70-64a1106fe0e5')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('c9de64a7-ee45-8f98-8d3c-f040f79da2e3', '0dd06cea-26a3-bff8-ea5c-6819a41b7978', 'b3b5c84f-cd2d-5505-2ca2-774fb04c7782')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('5374bc7b-514d-604a-f7db-c08b2ebcfdb0', '0dd06cea-26a3-bff8-ea5c-6819a41b7978', '6bcf3cab-5426-04ee-b596-10d2cdb93e53')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('f1189976-d1b7-10c5-4aed-4d2a180c6a04', '0dd06cea-26a3-bff8-ea5c-6819a41b7978', '0a22410a-1ded-b9bb-9ce3-e0abaa90ae15')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('a16748be-5776-de4c-732c-33ce108d6524', '441031e5-d604-974d-61f4-c6665bada7cc', '13286088-3f71-0fc1-414a-a75995540c74')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('f56dbab9-bea2-47ed-e20f-ce05abe4a935', '441031e5-d604-974d-61f4-c6665bada7cc', '4e95fa2b-8187-45d2-68e0-3203f7bdbe2f')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('65d75dec-dd37-a71e-31a2-a3bec76635be', '441031e5-d604-974d-61f4-c6665bada7cc', '256b4140-5d4a-0d3d-aa99-95f06ecdcd58')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('6c5e70c6-d636-717a-ec71-2a4a02089a5e', '441031e5-d604-974d-61f4-c6665bada7cc', '7bd655d9-ad21-518a-621c-170e4ebd5d89')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('bc1c4f69-32eb-1c1a-5652-62add0a884df', '441031e5-d604-974d-61f4-c6665bada7cc', 'b3b5c84f-cd2d-5505-2ca2-774fb04c7782')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('fc5bbf4b-17dd-ab43-1ea0-e1bbb027e046', '441031e5-d604-974d-61f4-c6665bada7cc', '6bcf3cab-5426-04ee-b596-10d2cdb93e53')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('8639dafe-094a-2b14-9606-00e0bb02fa90', '4665db8b-972a-32b4-3d88-2840de070382', 'af8b192c-4077-c78a-04da-b596acc3703a')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('5f911d91-a949-579a-7a51-c4f1f2e11e3b', '4665db8b-972a-32b4-3d88-2840de070382', '68269daa-1f86-00a4-1978-60f878ef03a2')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('0d6f2274-dad6-6c05-7d14-523fe035589f', '4665db8b-972a-32b4-3d88-2840de070382', '399f3160-1fb9-bbee-1fc1-fcd03f3de7d2')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('c20fe7b0-b83f-846c-c0b2-43b473c3acb1', '4665db8b-972a-32b4-3d88-2840de070382', '7a209e63-225b-2371-5b70-64a1106fe0e5')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('ba45a2ea-6cd5-4100-809b-e03b3d03e3f7', '4665db8b-972a-32b4-3d88-2840de070382', 'b3b5c84f-cd2d-5505-2ca2-774fb04c7782')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('281de88c-a0c0-dced-a894-0e861c54b5ec', '4665db8b-972a-32b4-3d88-2840de070382', '6bcf3cab-5426-04ee-b596-10d2cdb93e53')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('72baa176-566b-8468-c991-dfcffea779d6', '4665db8b-972a-32b4-3d88-2840de070382', 'a5de256d-b2c4-9183-d3d5-a6eb57f3baba')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('5a079407-b67b-694f-e9fe-fb9de20227fa', 'f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', '443cc212-e400-b732-7b82-d95fb839a44c')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('c7b80381-e03a-8bef-1449-e79696158629', 'f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', 'af8b192c-4077-c78a-04da-b596acc3703a')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('eccedb14-09eb-5d3a-2c11-ea6f915780c2', 'f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', '68269daa-1f86-00a4-1978-60f878ef03a2')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('df0ca838-acdb-4756-4d49-b086cbbabf99', 'f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', '7eff9a54-a20a-f25a-4425-d553cedcf432')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('ffd1dbdd-a75b-ce26-8741-941b68981b16', 'f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', 'ab2b4b1f-961c-f5a8-9c9f-a521933bcd49')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('3d3e924f-d63e-3a4e-8dfa-77a117cd47b9', 'f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', 'd37be919-fb8b-da09-624a-149c77a54504')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('9b1d48e5-60e7-1d3a-7d71-2dc5693012ad', 'f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', '7a209e63-225b-2371-5b70-64a1106fe0e5')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('977c3b8c-3d67-6bc7-9830-ddb077eefdda', 'f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', 'b3b5c84f-cd2d-5505-2ca2-774fb04c7782')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('4c543d10-525e-aeb6-c5cf-56f56c4d7d17', 'f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', '6bcf3cab-5426-04ee-b596-10d2cdb93e53')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('f00e7af9-b394-69e2-f172-71f9783cb3b1', 'f04b32fe-4c52-5631-4cfd-b1ef9ef223b7', '0a22410a-1ded-b9bb-9ce3-e0abaa90ae15')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('502f9c81-ae18-45c8-a233-5346410536df', '60f6d21a-e18b-0e2e-092b-7c489487afd9', '87469f62-3b45-b061-52f7-a5e5636f77df')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('076daca7-1738-e9a0-a07f-36cc58ff245c', '60f6d21a-e18b-0e2e-092b-7c489487afd9', 'b9e76540-1031-5690-e619-57d511f1a103')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('25c2b001-a0b2-52b3-5ec9-64c52735dc2d', '38dd5579-bcd2-8c28-2ca5-00919e38c258', 'af8b192c-4077-c78a-04da-b596acc3703a')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('eee4c4a9-478a-0a6e-dafa-2b7a1a8fddd5', '38dd5579-bcd2-8c28-2ca5-00919e38c258', '68269daa-1f86-00a4-1978-60f878ef03a2')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('6bb08cb9-0968-bea9-b3ba-5239e58e3eef', '38dd5579-bcd2-8c28-2ca5-00919e38c258', '7a209e63-225b-2371-5b70-64a1106fe0e5')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('847a8e61-d7a6-f050-6f1e-03591ef1619a', '38dd5579-bcd2-8c28-2ca5-00919e38c258', 'b3b5c84f-cd2d-5505-2ca2-774fb04c7782')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('fe884b4f-f6c8-ad1a-7ac3-fa501b904923', '38dd5579-bcd2-8c28-2ca5-00919e38c258', '6bcf3cab-5426-04ee-b596-10d2cdb93e53')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('82397f18-5b09-7dea-bc3f-663c01ded9e9', '38dd5579-bcd2-8c28-2ca5-00919e38c258', '0a22410a-1ded-b9bb-9ce3-e0abaa90ae15')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('a3a44334-4699-cc15-9988-2f1706ccfc6e', '90a6b68d-6914-82ab-0a1f-5d53319c896c', 'af8b192c-4077-c78a-04da-b596acc3703a')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('50a8a2a5-29d6-e233-cd67-eb82cadce7f3', '90a6b68d-6914-82ab-0a1f-5d53319c896c', '68269daa-1f86-00a4-1978-60f878ef03a2')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('20546235-7c78-7c49-d316-5a44ec562a98', '90a6b68d-6914-82ab-0a1f-5d53319c896c', '1e9bd181-b060-eb58-89b4-f23e3a15e5b7')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('606a9ba4-6d15-f00f-a20f-3ebba35e1a9d', '90a6b68d-6914-82ab-0a1f-5d53319c896c', 'd37be919-fb8b-da09-624a-149c77a54504')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('19cf41f5-c00e-e8eb-14f7-9130e3683cea', '90a6b68d-6914-82ab-0a1f-5d53319c896c', '7a209e63-225b-2371-5b70-64a1106fe0e5')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('02ed19a2-f527-c14b-3b3b-338f49a29a71', '90a6b68d-6914-82ab-0a1f-5d53319c896c', '6bcf3cab-5426-04ee-b596-10d2cdb93e53')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('d67d57f3-ffa4-711e-7b42-36d466e21fc3', '6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', '443cc212-e400-b732-7b82-d95fb839a44c')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('283f4d73-2c6e-b813-0347-47ec8448c0c3', '6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', 'af8b192c-4077-c78a-04da-b596acc3703a')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('e63ff88b-af43-bbeb-5a98-24eba56f6a6c', '6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', '4e95fa2b-8187-45d2-68e0-3203f7bdbe2f')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('4fa7bf63-d233-5054-2151-a8f330b912e8', '6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', '68269daa-1f86-00a4-1978-60f878ef03a2')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('0063ead5-c508-9f9e-2479-fdcd691797f7', '6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', '7eff9a54-a20a-f25a-4425-d553cedcf432')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('aa44fe29-0ef4-dafa-8d2d-ca907a817dcf', '6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', 'ab2b4b1f-961c-f5a8-9c9f-a521933bcd49')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('d86b5c80-7c83-41e4-615b-0c0b7ec8a0b6', '6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', 'd37be919-fb8b-da09-624a-149c77a54504')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('423f74bf-ff03-609c-2815-1588e7381f6d', '6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', '7a209e63-225b-2371-5b70-64a1106fe0e5')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('344a1faa-6921-1d9d-8c4d-7e0808e32ca2', '6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', '220a654f-f27e-a649-0683-1921250b94ce')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('dd8e8bc9-bc7e-4c13-9543-5228fb4d3c77', '6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', 'b3b5c84f-cd2d-5505-2ca2-774fb04c7782')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('569097c9-8fad-6ca3-0854-908801f5260a', '6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', '6bcf3cab-5426-04ee-b596-10d2cdb93e53')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('d7ce3efa-4eed-6525-4aa3-17d037569f36', '6ad761d1-b4a4-ed6b-f3bd-b3303d60446a', '0a22410a-1ded-b9bb-9ce3-e0abaa90ae15')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('23e71ece-759c-8b4b-21e8-411eeb3f4bfb', '6b395f28-c7aa-203f-e831-714da4be1dee', 'f04b32fe-4c52-5631-4cfd-b1ef9ef223b7')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('56a6bca9-005c-fdb4-9250-b09ef2385dc5', 'bb670e32-b9ac-110c-be43-2f10ea894161', 'cddb4dda-6772-2437-68cc-042c1624a9f9')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('bdc09bd7-e283-50a9-d370-f798a9ffba0c', 'bb670e32-b9ac-110c-be43-2f10ea894161', 'af8b192c-4077-c78a-04da-b596acc3703a')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('98cd930b-242d-d62e-583a-bdf5a0dc0c66', 'bb670e32-b9ac-110c-be43-2f10ea894161', '1e9bd181-b060-eb58-89b4-f23e3a15e5b7')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('4d4ce1d0-cdcc-0e54-b442-d9df145f13c9', 'bb670e32-b9ac-110c-be43-2f10ea894161', 'd37be919-fb8b-da09-624a-149c77a54504')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('85a1a4cc-885c-9c94-5391-76331282c4cb', 'bb670e32-b9ac-110c-be43-2f10ea894161', '7a209e63-225b-2371-5b70-64a1106fe0e5')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES
  ('c8dbd2dc-611d-c012-0f19-521c6e6e4c44', 'bb670e32-b9ac-110c-be43-2f10ea894161', '0a22410a-1ded-b9bb-9ce3-e0abaa90ae15')
ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;
