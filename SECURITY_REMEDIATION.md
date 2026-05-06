# warforge.website — Complete Security Remediation Brief

**Repo:** https://github.com/TenaciousTaurus/warhammer-list-builder
**Stack:** Vercel (edge) + Supabase (Postgres/Auth/Storage/Realtime/Edge Functions) + React/Vite frontend
**Audit date:** 2026-05-06
**Authorization:** Owner-confirmed (Jeff Bukowski owns repo, Vercel project, Supabase project)
**Scope:** External pen test of `https://warforge.website/` + static review of all migrations, edge functions, frontend, git history. Read-only.

**Severity totals:** 0 Critical · 1 High · 6 Medium · 11 Low · 8 Info

---

## How to use this document

Each finding has: **ID · Severity · Where · Evidence · Why it matters · Fix (with code)**. The "Fix" sections are designed to be applied as-is. Order of operations is in the **Remediation Plan** at the bottom — follow it in order; later items depend on earlier ones being done.

Items marked **[Manual]** can't be done from code (require dashboard clicks). Items marked **[DB Migration]** belong in a new file under `supabase/migrations/`. Items marked **[Frontend]** / **[Edge Function]** / **[Vercel Config]** are obvious from context.

---

# Part 1 — Supabase Findings (the substance)

## F-01 [High] — `get_friend_activity` lets any user read any other user's friend graph & activity [DB Migration]

**File:** `supabase/migrations/20260503000003_friend_activity_feed.sql` lines 6–82

**Evidence:**
```sql
CREATE OR REPLACE FUNCTION get_friend_activity(
  p_user_id UUID,           -- ← caller-supplied, never validated
  p_limit   INT DEFAULT 20
)
RETURNS TABLE(...)
LANGUAGE plpgsql
SECURITY DEFINER             -- ← bypasses RLS
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH friend_ids AS (
    SELECT ... FROM friendships f
    WHERE (f.requester_id = p_user_id OR f.addressee_id = p_user_id)
      AND f.status = 'accepted'
  ), ...
$$;
GRANT EXECUTE ON FUNCTION get_friend_activity(UUID, INT) TO authenticated;
```

**Why it matters:** `SECURITY DEFINER` makes the function run with the function-owner's privileges, ignoring RLS. The function never compares `p_user_id` to `auth.uid()`. Any authenticated user can call `supabase.rpc('get_friend_activity', { p_user_id: '<victim-uuid>' })` and receive the victim's friend list, last-30-day game opponents/scores, and painting activity. UUIDs are unguessable but they appear in many shared contexts (tournament participant lists, public profiles, shared army lists), making leakage realistic.

**Fix:** New migration that drops the parameterized version and replaces with `auth.uid()`-driven version.

```sql
-- supabase/migrations/20260507000001_authz_hardening.sql
BEGIN;

DROP FUNCTION IF EXISTS public.get_friend_activity(UUID, INT);

CREATE OR REPLACE FUNCTION public.get_friend_activity(p_limit INT DEFAULT 20)
RETURNS TABLE (
  -- copy original RETURNS TABLE column list verbatim from the original migration
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '28000';
  END IF;

  RETURN QUERY
  WITH friend_ids AS (
    SELECT CASE
             WHEN f.requester_id = v_user_id THEN f.addressee_id
             ELSE f.requester_id
           END AS friend_id
    FROM friendships f
    WHERE (f.requester_id = v_user_id OR f.addressee_id = v_user_id)
      AND f.status = 'accepted'
  )
  -- rest of body unchanged, replace every p_user_id with v_user_id
  ;
END;
$$;

REVOKE ALL ON FUNCTION public.get_friend_activity(INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_friend_activity(INT) TO authenticated;

COMMIT;
```

**Frontend update:** Update any `rpc('get_friend_activity', { p_user_id: ... })` callsite in `frontend/src/` to drop the `p_user_id` arg. Grep: `grep -r "get_friend_activity" frontend/src`.

---

## F-02 [Medium] — `shopping_list_for_army` trusts caller-supplied `p_user_id` [DB Migration]

**File:** `supabase/migrations/20260502000006_shopping_list_rpc.sql` lines 5–54

**Evidence:**
```sql
CREATE OR REPLACE FUNCTION public.shopping_list_for_army(
  p_list_id UUID,
  p_user_id UUID            -- ← trusted blindly
)
RETURNS TABLE(...) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN QUERY
  SELECT ... FROM army_list_units alu
  JOIN army_lists al ON al.id = alu.army_list_id
  WHERE alu.army_list_id = p_list_id
    AND al.user_id       = p_user_id;   -- not auth.uid()
END;
$$;
```

**Why it matters:** Same antipattern as F-01. Lower blast radius (requires correlating list-UUID + owner-UUID), but still an authorization bypass.

**Fix:** Add to the `20260507000001_authz_hardening.sql` migration:

```sql
DROP FUNCTION IF EXISTS public.shopping_list_for_army(UUID, UUID);

CREATE OR REPLACE FUNCTION public.shopping_list_for_army(p_list_id UUID)
RETURNS TABLE (
  -- copy original RETURNS TABLE column list
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated' USING ERRCODE='28000'; END IF;
  RETURN QUERY
  SELECT ... FROM army_list_units alu
  JOIN army_lists al ON al.id = alu.army_list_id
  WHERE alu.army_list_id = p_list_id
    AND al.user_id       = v_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.shopping_list_for_army(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.shopping_list_for_army(UUID) TO authenticated;
```

**Frontend update:** Drop the `p_user_id` argument at every callsite.

---

## F-03 [Medium] — `paint_equivalents` UPDATE policy is `USING (TRUE)` [DB Migration]

**File:** `supabase/migrations/20260502000008_paint_equivalents.sql` lines 18–23

**Evidence:**
```sql
CREATE POLICY "paint_equivalents_auth_vote" ON public.paint_equivalents
  FOR UPDATE TO authenticated USING (TRUE);
-- no WITH CHECK clause
```

**Why it matters:** Any authenticated user can run `UPDATE paint_equivalents SET similarity_score = 0, votes = -999, source = 'malicious' WHERE TRUE` and vandalize community data. No `WITH CHECK` means even row-key changes are permitted.

**Fix:** Replace direct UPDATE with a vote-only RPC. Add to the hardening migration:

```sql
DROP POLICY IF EXISTS "paint_equivalents_auth_vote" ON public.paint_equivalents;

CREATE OR REPLACE FUNCTION public.vote_paint_equivalent(
  p_paint_id_a UUID,
  p_paint_id_b UUID,
  p_delta INT DEFAULT 1
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated' USING ERRCODE='28000'; END IF;
  IF p_delta NOT IN (-1, 1) THEN RAISE EXCEPTION 'delta must be -1 or 1'; END IF;
  -- Optional: rate-limit per user via a separate table or use Supabase rate limiter at edge
  UPDATE public.paint_equivalents
  SET votes = votes + p_delta, updated_at = NOW()
  WHERE (paint_id_a = p_paint_id_a AND paint_id_b = p_paint_id_b)
     OR (paint_id_a = p_paint_id_b AND paint_id_b = p_paint_id_a);
END;
$$;

REVOKE ALL ON FUNCTION public.vote_paint_equivalent(UUID,UUID,INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.vote_paint_equivalent(UUID,UUID,INT) TO authenticated;
```

**Frontend update:** Replace any `.from('paint_equivalents').update(...)` with `.rpc('vote_paint_equivalent', { p_paint_id_a, p_paint_id_b, p_delta: 1 })`.

---

## F-04 [Medium] — RLS recursion bug in `organisations` / `organisation_members` [DB Migration]

**File:** `supabase/migrations/20250220000220_organisations.sql` lines 47–99

**Evidence:**
```sql
CREATE POLICY "Members can view org members"
  ON organisation_members FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organisation_members AS om       -- ← self-reference
      WHERE om.organisation_id = organisation_members.organisation_id
        AND om.user_id = auth.uid()
    )
  );
-- Same anti-pattern in "Org admins can manage members" (lines 89-99)
-- Same on organisations table "Members can view their organisations" (47-56)
```

**Why it matters:** Identical bug to the one already patched for `campaign_members`/`tournament_participants` in `20260406205758_fix_rls_recursion.sql`. Postgres re-evaluates the policy on the inner subquery → infinite recursion → query fails for any org with >1 member.

**Fix:** Add SECURITY DEFINER helper, then rewrite the policies (matches the existing pattern in `fix_rls_recursion.sql`):

```sql
CREATE OR REPLACE FUNCTION public.is_org_member(p_org_id UUID, p_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organisation_members
    WHERE organisation_id = p_org_id AND user_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_org_admin(p_org_id UUID, p_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organisation_members
    WHERE organisation_id = p_org_id AND user_id = p_user_id AND role IN ('admin','owner')
  );
$$;

REVOKE ALL ON FUNCTION public.is_org_member(UUID,UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_org_admin(UUID,UUID)  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_org_member(UUID,UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_admin(UUID,UUID)  TO authenticated;

DROP POLICY IF EXISTS "Members can view org members"      ON public.organisation_members;
DROP POLICY IF EXISTS "Org admins can manage members"     ON public.organisation_members;
DROP POLICY IF EXISTS "Members can view their organisations" ON public.organisations;

CREATE POLICY "Members can view org members" ON public.organisation_members
  FOR SELECT TO authenticated
  USING (public.is_org_member(organisation_id, auth.uid()));

CREATE POLICY "Org admins can manage members" ON public.organisation_members
  FOR ALL TO authenticated
  USING (public.is_org_admin(organisation_id, auth.uid()))
  WITH CHECK (public.is_org_admin(organisation_id, auth.uid()));

CREATE POLICY "Members can view their organisations" ON public.organisations
  FOR SELECT TO authenticated
  USING (
    is_public = true
    OR owner_id = auth.uid()
    OR public.is_org_member(id, auth.uid())
  );
```

---

## F-05 [Medium] — `paint_recipe_steps` policy named "Owner select" actually permits anon read

**File:** `supabase/migrations/20250220000090_collection_tables.sql` lines 148–155

**Evidence:**
```sql
CREATE POLICY "Owner select recipe steps" ON public.paint_recipe_steps
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.paint_recipes pr
            WHERE pr.id = paint_recipe_steps.recipe_id
            AND (pr.user_id = auth.uid() OR pr.is_public = true))
  );
```

**Why it matters:** No `TO authenticated`, so the `public` (anon) role can read steps of any public recipe. This is likely intentional for the public-recipes feature, but the policy name lies and there's no explicit anon-deny on writes.

**Fix:** Rename for clarity and add explicit anon DENY on mutations to match the migration-180 pattern:

```sql
DROP POLICY IF EXISTS "Owner select recipe steps" ON public.paint_recipe_steps;

CREATE POLICY "Public read recipe steps when recipe is public" ON public.paint_recipe_steps
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.paint_recipes pr
            WHERE pr.id = paint_recipe_steps.recipe_id
            AND (pr.user_id = auth.uid() OR pr.is_public = true))
  );

-- Explicit anon deny on mutations (mirrors migration 180 pattern)
CREATE POLICY "Anon cannot insert recipe steps" ON public.paint_recipe_steps
  FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Anon cannot update recipe steps" ON public.paint_recipe_steps
  FOR UPDATE TO anon USING (false);
CREATE POLICY "Anon cannot delete recipe steps" ON public.paint_recipe_steps
  FOR DELETE TO anon USING (false);
```

Same pattern should be applied to `paint_recipes` itself if it isn't in migration 180.

---

## F-06 [Low] — `update_hobby_streak` trigger doesn't verify `NEW.user_id = auth.uid()` [DB Migration]

**File:** `supabase/migrations/20260502000007_hobby_streaks_achievements.sql` lines 59–103

**Why it matters:** Trigger fires on `collection_entries` UPDATE. Currently safe because `collection_entries` RLS already gates UPDATE to owner — but defense-in-depth: if RLS ever loosens, this trigger silently maintains streaks for arbitrary user_ids.

**Fix:** Add an `auth.uid()` check at the top of the trigger function body:

```sql
CREATE OR REPLACE FUNCTION public.update_hobby_streak() ... AS $$
BEGIN
  -- Defense-in-depth: refuse if the row's user_id doesn't match the caller
  IF auth.uid() IS NOT NULL AND NEW.user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'user_id mismatch on collection_entries update' USING ERRCODE='42501';
  END IF;
  -- ... existing body
END; $$;
```

(The `auth.uid() IS NOT NULL` guard preserves admin/migration-time updates.)

---

## F-07 [Low] — `check_and_award_achievements(p_user_id)` lets users grant achievements to others [DB Migration]

**File:** `supabase/migrations/20260502000007_hobby_streaks_achievements.sql` lines 114–178

**Evidence:**
```sql
CREATE OR REPLACE FUNCTION public.check_and_award_achievements(p_user_id UUID)
... SECURITY DEFINER SET search_path = public AS $$
...
INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (p_user_id, ...);
$$;
```

**Why it matters:** Any authenticated user can call with another user's UUID, polluting that user's achievement history. Writes only — no exfiltration — but unauthorized state mutation.

**Fix:** Drop the parameter, use `auth.uid()`. Add to the hardening migration:

```sql
DROP FUNCTION IF EXISTS public.check_and_award_achievements(UUID);

CREATE OR REPLACE FUNCTION public.check_and_award_achievements()
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated' USING ERRCODE='28000'; END IF;
  -- replace every p_user_id with v_user_id in the body
END; $$;

REVOKE ALL ON FUNCTION public.check_and_award_achievements() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_and_award_achievements() TO authenticated;
```

**Frontend update:** Drop the argument at every callsite.

---

## F-08 [Low] — "Public via share_code" policies are functionally "public to everyone" [DB Migration + Product Decision]

**Files:**
- `supabase/migrations/20250220000130_tournaments.sql:105-107`
- `supabase/migrations/20250220000100_crusade_campaigns.sql:111-113`
- `supabase/migrations/20250220000030_duplicate_list_and_sharing.sql:58-61`

**Evidence (representative):**
```sql
CREATE POLICY "Public select tournaments by share code"
  ON public.tournaments FOR SELECT
  USING (share_code IS NOT NULL);     -- share_code is NOT NULL DEFAULT, so this matches every row
```

**Why it matters:** `share_code` is `NOT NULL` with an auto-generated default, so the predicate is always true → every row is publicly readable. The implicit security model is "the URL containing the share_code is the bearer token," but the database doesn't enforce that. A misconfigured client (or `select *` from PostgREST without a filter) returns everything.

For 8-char hex `share_code`s (md5 substring), entropy is 2³² — brute-forceable for valuable targets given enough time, especially since Supabase's anon-key rate limits are generous.

**Fix (option A, minimum-change):** Make `share_code` nullable and only set it when the user enables sharing. This way, "private" rows have `share_code IS NULL` and the policy correctly excludes them:

```sql
-- Apply per affected table (tournaments, campaigns, army_lists)
ALTER TABLE public.tournaments ALTER COLUMN share_code DROP NOT NULL;
ALTER TABLE public.tournaments ALTER COLUMN share_code DROP DEFAULT;
-- existing rows: optionally NULL them and require users to re-share
UPDATE public.tournaments SET share_code = NULL WHERE is_public = false;  -- if there's an is_public column
```

**Fix (option B, stronger):** Require explicit share_code filter via PostgREST. Add a header check:

```sql
DROP POLICY "Public select tournaments by share code" ON public.tournaments;
CREATE POLICY "Public select tournaments by share code" ON public.tournaments
  FOR SELECT
  USING (
    share_code IS NOT NULL
    AND share_code = current_setting('request.headers', true)::json->>'x-share-code'
  );
```

Frontend then sends `headers: { 'x-share-code': '<code>' }` when accessing shared content. Increases entropy requirement to "must know the exact code per request."

**Decide which to use** with the product owner; option A is lower-risk and lower-effort.

Same fix template applies to `campaigns` and `army_lists`. Also applies to `game_sessions` (`is_spectatable` + `report_code` columns) — review those policies for the same antipattern.

---

## F-09 [Low] — `collection-photos` storage bucket public read [Manual + DB Migration]

**File:** `supabase/migrations/20250220000190_collection_photos_bucket.sql` lines 4–46

**Evidence:**
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('collection-photos','collection-photos', true);
CREATE POLICY "Anyone can view collection photos"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'collection-photos');
```

**Why it matters:** Photos at `{user_id}/{entry_id}/{filename}` — UUIDs make enumeration impractical, but anyone with a URL keeps access forever (no expiry, no revocation). Acceptable for a "share my paint job" feature; problematic if photos contain anything sensitive (faces, addresses on packaging, etc.).

**Fix (if photos are meant to be private by default):**

```sql
UPDATE storage.buckets SET public = false WHERE id = 'collection-photos';

DROP POLICY "Anyone can view collection photos" ON storage.objects;

CREATE POLICY "Owner can read own photos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'collection-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Owner can write own photos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'collection-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Owner can delete own photos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'collection-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
```

Frontend then uses `supabase.storage.from('collection-photos').createSignedUrl(path, 3600)` for sharing (1-hour expiry). If sharing is a feature, add a `shared_photos` table tracking what's been shared with whom.

**Or:** confirm photos-are-public is intentional and document in `SECURITY.md`.

---

## F-10 [Low] — Auth password floor is 6 chars [Manual]

**File:** `supabase/config.toml` line 175 — `minimum_password_length = 6`

**Why it matters:** NIST 800-63B recommends 8+ minimum. config.toml only governs local dev; production setting is in the Supabase dashboard.

**Fix:** Supabase Dashboard → Authentication → Policies → Password Strength → set minimum length to **10** and enable **Require uppercase / lowercase / numbers / special characters** (or whatever balance you prefer).

---

## F-11 [Low] — Email confirmation disabled [Manual]

**File:** `supabase/config.toml` line 209 — `enable_confirmations = false`

**Why it matters:** Allows account creation with any email address (no verification). Enables impersonation, spam, and orphaned accounts. Production setting may differ — verify.

**Fix:** Supabase Dashboard → Authentication → Email → enable **Confirm email**. Update sign-up flow in frontend to handle the "check your email" state.

---

## F-12 [Info] — MFA disabled [Manual]

**File:** `supabase/config.toml` lines 286–287

**Fix (optional):** Supabase Dashboard → Authentication → Multi-Factor Auth → enable TOTP. Acceptable to leave disabled for a hobby product, but worth offering opt-in.

---

## F-13 [Info] — Public RPCs exposed to anon

**Files:**
- `supabase/migrations/20260502000008_paint_equivalents.sql:62` — `get_paint_equivalents` granted to anon
- `supabase/migrations/20260502000009_geo_and_meta.sql:74,123,160` — `tournaments_near`, `faction_win_rates`, `detachment_play_rates` granted to anon

**Why it matters:** Intentional design (public meta/stats), but `tournaments_near(lat, lng, radius_km)` returns tournament location data — could enable scraping of tournament locations + organizer info. Confirm this is OK.

**Fix (if scraping is a concern):**
- Add per-IP rate limiting at the Vercel edge (middleware) or via Supabase's built-in rate limiter.
- Move to authenticated-only access: `REVOKE EXECUTE ON FUNCTION ... FROM anon;` and require login.

---

## F-14 [Info] — DB network restrictions and SSL enforcement [Manual]

**File:** `supabase/config.toml` lines 67–79 (commented out / disabled in local config)

**Fix:** Supabase Dashboard → Project Settings → Database:
- **Network Restrictions:** Add CIDR allowlist for your Vercel egress IPs (or leave open if you only ever connect via PostgREST/edge functions).
- **SSL Enforcement:** Enable **Enforce SSL on incoming connections**. (Direct DB connections only — PostgREST is HTTPS regardless.)

---

## F-15 [Info] — `sanitize-errors` edge function uses service-role key as fallback apikey [Edge Function]

**File:** `supabase/functions/sanitize-errors/index.ts` lines 14–15, 57–60

**Evidence:**
```ts
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
...
const headers = new Headers(req.headers);
if (!headers.has("apikey")) {
  headers.set("apikey", SUPABASE_SERVICE_ROLE_KEY);   // ← service role as default apikey
}
```

**Why it matters:** When forwarded with the user's `Authorization: Bearer <jwt>`, PostgREST evaluates RLS using the JWT, so RLS still applies. **But** if a future code path forwards without a user JWT (e.g., a server-to-server call), the service-role apikey alone bypasses RLS entirely. Footgun, not a current vuln.

**Fix:** Use the anon key as fallback. Anon key is sufficient for PostgREST and can never bypass RLS:

```ts
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
...
if (!headers.has("apikey")) {
  headers.set("apikey", SUPABASE_ANON_KEY);
}
```

Then remove `SUPABASE_SERVICE_ROLE_KEY` from this function's env entirely (Supabase Dashboard → Edge Functions → secrets).

---

# Part 2 — Edge / Vercel / DNS Findings

## E-01 [Medium] — No DMARC / SPF on apex domain [DNS]

**Why it matters:** Without SPF/DMARC, anyone can spoof `From: anything@warforge.website` in phishing emails. Even though you don't send mail from this domain, attackers exploit unprotected domains specifically *because* there's no DMARC enforcement.

**Fix:** Add to Vercel DNS (or wherever name.com points):

```
TXT  @       "v=spf1 -all"
TXT  _dmarc  "v=DMARC1; p=reject; rua=mailto:security@yourdomain; adkim=s; aspf=s; pct=100"
```

`p=reject` tells receiving servers to refuse anything claiming to be from `@warforge.website`. `rua` gives you forensic reports.

---

## E-02 [Medium] — CSP allows `'unsafe-inline'` for styles [Vercel Config]

**File:** `frontend/vercel.json` (CSP header)

**Why it matters:** Inline-style attacks (CSS exfiltration, UI redress) bypass the rest of CSP. Limited blast radius (no script execution), but defense-in-depth.

**Fix:** Move inline styles to external stylesheets or use nonces. For a Vite + Tailwind app, build-time class extraction is already happening — the `'unsafe-inline'` is likely there for a single component or for `react-helmet`-style injections. Audit with browser devtools (Network → look for inline `<style>` tags), eliminate them, then update `vercel.json`:

```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://*.supabase.co; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests; report-uri https://warforge.website/api/csp-report"
}
```

(Note: also adds `object-src 'none'`, `upgrade-insecure-requests`, and `report-uri` — see E-04 and E-06.)

---

## E-03 [Low] — No CAA records [DNS]

**Why it matters:** Any CA can issue certs for the domain. CAA records restrict which CAs are authorized.

**Fix:**
```
CAA  0  issue   "letsencrypt.org"
CAA  0  iodef   "mailto:security@yourdomain"
```

---

## E-04 [Low] — DNSSEC not enabled [Manual]

**Why it matters:** DNS responses unsigned → cache poisoning / spoofing in transit.

**Fix:** Vercel Dashboard → Domains → `warforge.website` → DNSSEC → Enable. Vercel handles the chain of trust automatically when using `ns*.vercel-dns.com`.

---

## E-05 [Low] — Missing Cross-Origin-* hardening headers [Vercel Config]

**Why it matters:** Vulnerable to Spectre-class side-channel reads if `SharedArrayBuffer` ever gets used. Currently not exploitable, but ~free defense.

**Fix:** Add to `frontend/vercel.json` headers array:
```json
{ "key": "Cross-Origin-Opener-Policy",   "value": "same-origin" },
{ "key": "Cross-Origin-Resource-Policy", "value": "same-origin" }
```
Skip `Cross-Origin-Embedder-Policy: require-corp` unless you explicitly need cross-origin isolation — it can break embeds.

---

## E-06 [Low] — No security.txt [Static File]

**Why it matters:** No canonical channel for security researchers to report issues.

**Fix:** Create `frontend/public/.well-known/security.txt`:
```
Contact: mailto:security@yourdomain
Expires: 2027-05-06T00:00:00Z
Preferred-Languages: en
Canonical: https://warforge.website/.well-known/security.txt
```

---

## E-07 [Low] — No CSP report-uri / report-to [Vercel Config + Edge Function]

**Why it matters:** CSP is enforced but emits no telemetry. Real-world XSS attempts and third-party breakage are invisible.

**Fix:** Add `report-uri https://warforge.website/api/csp-report` to CSP (see E-02). Create a tiny Vercel serverless function or Supabase edge function `csp-report` that logs the JSON body to Datadog (or just to console).

---

## E-08 [Low] — CSP missing `object-src 'none'` and `upgrade-insecure-requests` [Vercel Config]

Already addressed in E-02 fix.

---

## E-09 [Info] — Wildcard certificate

`*.warforge.website` certificate is broader than necessary. If you don't actively use subdomains, switch to per-host certs (Vercel auto-issues). Otherwise no action.

---

## E-10 [Info] — TLS 1.2 still enabled

TLS 1.2 with modern ciphers is fine. Vercel doesn't expose a knob to disable it. No action.

---

## E-11 [Info] — `Access-Control-Allow-Origin: https://warforge.website` echoed on root HTML

Unusual to set CORS on the document itself, but it's hardcoded to a single origin (not echoing arbitrary `Origin` headers), so harmless. Verify by sending a request with `Origin: https://evil.com` once the rate-limit clears — should still return `https://warforge.website` (not `https://evil.com`).

---

# Part 3 — Active Web Scans That Need Re-Running

The Kali container's IP got rate-limited by Vercel mid-scan. These weren't completed and should be re-run from a fresh IP (or wait 24h):

- **Sensitive-path scan:** check that `/.env`, `/.git/config`, `/.git/HEAD`, `/.DS_Store`, `/package.json`, `/yarn.lock`, `/pnpm-lock.yaml`, `/vercel.json`, `/next.config.js`, `/wp-login.php`, `/_next/static/` all return 404. (Vercel deploys typically don't expose these, but verify.)
- **Nikto full scan:** `nikto -h https://warforge.website -ssl -o nikto.txt`
- **Dirb / gobuster:** `gobuster dir -u https://warforge.website -w /usr/share/wordlists/dirb/common.txt -t 5 --delay 200ms` (slow rate to avoid the rate-limit again)
- **CORS reflection test:** `curl -H 'Origin: https://evil.com' -I https://warforge.website/` — confirm `Access-Control-Allow-Origin` is not echoed back.

---

# Remediation Plan (in order)

## Phase 1 — Critical authz bugs (do first, ~1 hour)

Create `supabase/migrations/20260507000001_authz_hardening.sql` containing fixes for **F-01, F-02, F-03, F-04, F-07**. Update frontend callsites for each (search `frontend/src` for the function names and drop the now-dropped parameters).

Verification queries (run after migration applies):
```sql
-- Confirm new signatures
SELECT proname, pg_get_function_arguments(oid) FROM pg_proc
 WHERE proname IN ('get_friend_activity','shopping_list_for_army',
                   'check_and_award_achievements','vote_paint_equivalent')
   AND pronamespace = 'public'::regnamespace;

-- Confirm old policies dropped
SELECT polname, polrelid::regclass FROM pg_policy
 WHERE polname IN ('paint_equivalents_auth_vote','Members can view org members');

-- Confirm execute grants
SELECT proname, proacl FROM pg_proc WHERE proname='get_friend_activity';
```

## Phase 2 — Defense-in-depth cleanups (~2 hours)

- **F-05** — paint_recipe_steps explicit anon-deny + rename
- **F-06** — `update_hobby_streak` defensive `auth.uid()` check
- **F-09** — decide collection-photos privacy and apply
- **F-15** — swap `sanitize-errors` apikey from service-role to anon

## Phase 3 — Product decisions (~30 min discussion)

- **F-08** — share_code public-by-default decision (option A vs B)
- **F-13** — anon-callable RPCs (rate limit or move to auth-only)

## Phase 4 — Manual dashboard configuration (~15 min)

- **F-10** — password length → 10 chars minimum
- **F-11** — enable email confirmation
- **F-12** — enable MFA (optional)
- **F-14** — network restrictions + SSL enforcement
- **E-04** — enable DNSSEC

## Phase 5 — DNS hardening (~10 min)

- **E-01** — add SPF + DMARC `p=reject`
- **E-03** — add CAA for letsencrypt.org

## Phase 6 — HTTP header hardening (~30 min)

- **E-02** — eliminate `unsafe-inline` from style-src; add `object-src 'none'`, `upgrade-insecure-requests`, `report-uri`
- **E-05** — add COOP + CORP
- **E-06** — add `/.well-known/security.txt`
- **E-07** — stand up CSP-report endpoint

## Phase 7 — Re-verify

- Re-run Phase 1 verification queries.
- Re-run external scan from fresh IP (Part 3 above).
- Spot-check from frontend that all callsite changes work end-to-end.

---

# Files That Will Change

**New files:**
- `supabase/migrations/20260507000001_authz_hardening.sql` (Phase 1 + parts of Phase 2)
- `supabase/migrations/20260507000002_share_code_and_storage.sql` (Phase 3)
- `frontend/public/.well-known/security.txt`
- (optional) `frontend/api/csp-report.ts` or new edge function for CSP reports

**Modified files:**
- `frontend/vercel.json` — CSP, COOP, CORP headers
- `frontend/src/**/*.ts(x)` — callsites for `get_friend_activity`, `shopping_list_for_army`, `check_and_award_achievements`, `paint_equivalents` updates
- `supabase/functions/sanitize-errors/index.ts` — anon key fallback
- `supabase/config.toml` — bring local config in line with prod (password length, confirmations) so dev mirrors prod

**External / dashboard:**
- Vercel Dashboard — DNSSEC toggle
- Vercel/name.com DNS — SPF, DMARC, CAA records
- Supabase Dashboard — password policy, email confirmation, MFA, network restrictions, SSL enforcement, remove `SUPABASE_SERVICE_ROLE_KEY` from `sanitize-errors` env

---

# Cross-Table RLS Inventory (Reference)

For the receiving Claude: **every user-data table has RLS enabled.** Status table for context — this isn't action items, just situational awareness:

| Table | RLS | Owner-scoped? | Public-readable? | Anon-deny mutations? |
|---|---|---|---|---|
| army_lists, army_list_units, army_list_enhancements, army_list_unit_wargear, army_list_unit_composition, army_list_leader_attachments | ✅ | ✅ via auth.uid() chain | ✅ via share_code (F-08) | implicit |
| army_list_versions | ✅ | ✅ | ❌ | implicit (append-only) |
| user_profiles | ✅ | ✅ | authenticated only | implicit |
| friendships | ✅ | ✅ either party | ❌ | implicit |
| game_sessions, game_session_events, game_session_scores, game_session_unit_states | ✅ | ✅ via owner | ✅ via is_spectatable + report_code (F-08-style) | implicit |
| collection_entries, wishlist_items, paint_recipes, user_paint_inventory | ✅ | ✅ | recipes if is_public | implicit |
| paint_recipe_steps | ✅ | ✅ | ✅ if recipe public (F-05) | implicit |
| paint_equivalents | ✅ | ❌ broken UPDATE policy (F-03) | ✅ | implicit |
| campaigns, campaign_members, crusade_*, requisition_log | ✅ | ✅ via SECURITY DEFINER helper | ✅ via share_code | implicit |
| tournaments, tournament_participants, tournament_rounds, tournament_pairings | ✅ | ✅ via helper | ✅ via share_code + is_public | implicit |
| leagues, league_tournaments | ✅ | ✅ | ✅ if is_public | implicit |
| organisations, organisation_members | ✅ | ✅ but RLS recursion bug (F-04) | ✅ if is_public | implicit |
| hobby_streaks, user_achievements | ✅ | ✅ | ❌ | implicit |
| Reference data (factions, units, weapons, etc.) | ✅ | n/a | ✅ | ✅ explicit (mig 180) |
