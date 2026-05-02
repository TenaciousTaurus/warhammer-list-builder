-- W1-1: Edition discriminator
-- Adds edition column to all game data tables and army_lists.
-- Defaults to '10e'. When 11th Edition data is ingested, rows will be set to '11e'.

ALTER TABLE factions          ADD COLUMN IF NOT EXISTS edition TEXT NOT NULL DEFAULT '10e';
ALTER TABLE detachments       ADD COLUMN IF NOT EXISTS edition TEXT NOT NULL DEFAULT '10e';
ALTER TABLE units             ADD COLUMN IF NOT EXISTS edition TEXT NOT NULL DEFAULT '10e';
ALTER TABLE unit_points_tiers ADD COLUMN IF NOT EXISTS edition TEXT NOT NULL DEFAULT '10e';
ALTER TABLE weapons           ADD COLUMN IF NOT EXISTS edition TEXT NOT NULL DEFAULT '10e';
ALTER TABLE abilities         ADD COLUMN IF NOT EXISTS edition TEXT NOT NULL DEFAULT '10e';
ALTER TABLE enhancements      ADD COLUMN IF NOT EXISTS edition TEXT NOT NULL DEFAULT '10e';
ALTER TABLE wargear_options   ADD COLUMN IF NOT EXISTS edition TEXT NOT NULL DEFAULT '10e';
ALTER TABLE battle_sizes      ADD COLUMN IF NOT EXISTS edition TEXT NOT NULL DEFAULT '10e';

ALTER TABLE army_lists        ADD COLUMN IF NOT EXISTS edition TEXT NOT NULL DEFAULT '10e';

-- Indexes so queries filtered by edition stay fast as data grows
CREATE INDEX IF NOT EXISTS idx_factions_edition          ON factions(edition);
CREATE INDEX IF NOT EXISTS idx_detachments_edition       ON detachments(edition);
CREATE INDEX IF NOT EXISTS idx_units_edition             ON units(edition);
CREATE INDEX IF NOT EXISTS idx_unit_points_tiers_edition ON unit_points_tiers(edition);
CREATE INDEX IF NOT EXISTS idx_weapons_edition           ON weapons(edition);
CREATE INDEX IF NOT EXISTS idx_abilities_edition         ON abilities(edition);
CREATE INDEX IF NOT EXISTS idx_enhancements_edition      ON enhancements(edition);
CREATE INDEX IF NOT EXISTS idx_wargear_options_edition   ON wargear_options(edition);
CREATE INDEX IF NOT EXISTS idx_battle_sizes_edition      ON battle_sizes(edition);
CREATE INDEX IF NOT EXISTS idx_army_lists_edition        ON army_lists(edition);
