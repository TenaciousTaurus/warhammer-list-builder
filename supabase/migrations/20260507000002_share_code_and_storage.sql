-- Security hardening: share_code and collection-photos storage
-- Fixes: F-08 (Option A) and F-09

BEGIN;

-- -------------------------------------------------------
-- F-08 Option A: Make share_code nullable on all affected tables
--
-- Previous model: share_code was NOT NULL with auto-generated default,
-- so "USING (share_code IS NOT NULL)" always matched every row.
-- New model: share_code is NULL for private rows; only set when the
-- owner explicitly enables sharing. The existing policies now correctly
-- restrict public access to rows where the owner has opted in.
-- -------------------------------------------------------

-- tournaments
ALTER TABLE public.tournaments ALTER COLUMN share_code DROP NOT NULL;
ALTER TABLE public.tournaments ALTER COLUMN share_code DROP DEFAULT;
UPDATE public.tournaments SET share_code = NULL WHERE is_public = false;

-- campaigns
ALTER TABLE public.campaigns ALTER COLUMN share_code DROP NOT NULL;
ALTER TABLE public.campaigns ALTER COLUMN share_code DROP DEFAULT;
-- campaigns have no is_public column; keep existing share_codes intact —
-- users who have a share link can still use it. New campaigns start NULL.

-- organisations (also has share_code with same antipattern)
ALTER TABLE public.organisations ALTER COLUMN share_code DROP NOT NULL;
ALTER TABLE public.organisations ALTER COLUMN share_code DROP DEFAULT;
UPDATE public.organisations SET share_code = NULL WHERE is_public = false;

-- army_lists: share_code was already nullable (added via ALTER in migration 30),
-- so no schema change needed. The existing policy is already correct.

-- -------------------------------------------------------
-- F-09: Make collection-photos bucket private
--
-- Photos are now served via signed URLs (createSignedUrl) instead of
-- direct public URLs. This allows revocation and expiry control.
-- -------------------------------------------------------

UPDATE storage.buckets SET public = false WHERE id = 'collection-photos';

DROP POLICY IF EXISTS "Anyone can view collection photos" ON storage.objects;

CREATE POLICY "Owner can read own photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'collection-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

COMMIT;
