-- ============================================================================
-- Migration: Explicit DENY policies for anonymous mutations on game data tables
-- Date: 2026-03-30
-- Context: Pentest finding #7 — PATCH/DELETE on game data tables returned
--   ambiguous HTTP 204 instead of clear denials. While RLS already prevented
--   actual modifications, the response codes made it unclear whether the
--   operation was authorized or simply matched zero rows.
--
-- This migration adds explicit DENY policies for INSERT/UPDATE/DELETE
-- operations by the anon role on all public game data tables, ensuring
-- clear 403 responses instead of ambiguous 204s.
--
-- ACCEPTED RISKS (documented per pentest findings #1 and #5):
--   - units, factions, detachments, weapons, abilities, enhancements,
--     unit_points_tiers, wargear_options, unit_model_variants,
--     unit_leader_targets, battle_sizes, missions, secondary_objectives,
--     stratagems, and paint_library are intentionally public-read.
--     These are game reference data with no user_id column.
--   - paint_library specifically is global reference data (Citadel, Vallejo,
--     Army Painter paint catalogs), NOT user-generated content.
--   - The Supabase /auth/v1/settings endpoint is publicly accessible by
--     platform design and cannot be restricted.
-- ============================================================================

-- Helper: For each game data table, add restrictive policies that deny
-- all mutations for the anon role. PostgreSQL RLS evaluates ALL policies
-- and requires at least one to pass — a USING(false) policy for anon
-- means mutations will always be denied with a clear RLS violation error.

DO $$
DECLARE
  game_tables text[] := ARRAY[
    'factions',
    'detachments',
    'units',
    'unit_points_tiers',
    'weapons',
    'abilities',
    'enhancements',
    'wargear_options',
    'unit_model_variants',
    'unit_leader_targets',
    'battle_sizes',
    'missions',
    'secondary_objectives',
    'stratagems',
    'paint_library'
  ];
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY game_tables LOOP
    -- Deny INSERT for anon
    EXECUTE format(
      'CREATE POLICY "Deny anon insert %1$s" ON public.%1$I FOR INSERT TO anon WITH CHECK (false)',
      tbl
    );

    -- Deny UPDATE for anon
    EXECUTE format(
      'CREATE POLICY "Deny anon update %1$s" ON public.%1$I FOR UPDATE TO anon USING (false) WITH CHECK (false)',
      tbl
    );

    -- Deny DELETE for anon
    EXECUTE format(
      'CREATE POLICY "Deny anon delete %1$s" ON public.%1$I FOR DELETE TO anon USING (false)',
      tbl
    );
  END LOOP;
END $$;
