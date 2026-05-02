# WarForge — Master Execution Plan

*The authoritative roadmap for all development work. Every task must map to an item here.
When an item is completed, mark it `[x]` and add the date.*

Last audited: 2026-05-01

---

## How to Use This Document

- **Before starting any work:** Find the matching item in this plan. If the work doesn't map to any item, either it belongs in the anti-roadmap (don't build it) or this plan needs to be updated first.
- **When completing an item:** Mark it `[x]`, add the completion date in parentheses, and note any relevant file paths or migration names changed.
- **When the plan needs to change:** Update this file as part of the same commit that changes direction. The plan and the code stay in sync.
- **Session start:** Read CLAUDE.md, then read this file. Understand where we are before writing anything.

---

## North Star

**WarForge wins when a 40K player can uninstall every other tool.**

- Official GW App → replaced by list builder + rules reference
- BattleScribe → replaced by list builder
- Tabletop Battles → replaced by play mode
- Wahapedia → complemented by in-app reference
- BCP → complemented by tournament + meta features
- Citadel Colour → replaced by collection + paint equivalents

---

## Anti-Roadmap (Never Build)

These items are permanently out of scope. If someone asks for them, the answer is no.

- Movement / positioning tracking in play mode
- Built-in AR rangefinder
- Voice / video chat
- Algorithmic home feed / doomscroll
- Custom dice physics engine
- AI list generator (until data is rock solid and demand is proven)
- Kill Team / AoS / other game systems (until 40K is fully stable)
- Subscription paywall on any core feature
- GW artwork, model photography, or flavor text reproduction

---

## Tier 0: Immediate (Do Before Wave 1)

*Small, fast, unblock future work or fix real gaps. Target: complete in 1-2 sessions.*

- [x] **T0-1** — Add `npm test -- --run` step to `.github/workflows/ci.yml` — completed 2026-05-01. File: `.github/workflows/ci.yml`

- [x] **T0-2** — Legal footer + trademark disclaimer on all pages — completed 2026-05-01. Files: `frontend/src/shared/components/AppFooter.tsx`, `frontend/src/App.tsx`, `frontend/src/shared/css/base.css`

- [x] **T0-3** — Measure and document performance baseline — completed 2026-05-01. Initial JS: 95.9 kB gzip (✅ under 200 kB target). Full bundle sizes + Lighthouse notes in CLAUDE.md "Performance Baseline" section. Lighthouse scores require manual run on production Vercel URL.

- [x] **T0-4** — Accessibility baseline audit — completed 2026-05-01. Code review found 5 `role="button"` divs missing `onKeyDown` handlers (WCAG 2.1.1) and missing `aria-live` on play mode score display (WCAG 4.1.3). All color contrast values pass AA. Findings documented in CLAUDE.md "Accessibility Baseline" section. CSS-only fixes not required (no contrast failures).

---

## Wave 1: Foundation

*Infrastructure that gets exponentially more expensive to defer. All Wave 1 items must be complete before starting Wave 2.*

### W1-1 — Edition Discriminator *(Most time-sensitive item in the entire plan)*

- [ ] Migration: add `edition TEXT NOT NULL DEFAULT '10e'` to:
  - `factions`, `detachments`, `units`, `unit_points_tiers`, `weapons`, `abilities`, `enhancements`, `wargear_options`, `battle_sizes`
- [ ] Migration: add `edition TEXT NOT NULL DEFAULT '10e'` to `army_lists`
- [ ] Update `shared/types/database.ts` to include `edition` on all affected table types
- [ ] No frontend UI needed yet — column exists, defaults to `'10e'`, 11th Edition data sets `'11e'`

**Why now:** Every user list created without this column makes the eventual backfill more painful. Do before any more data is ingested.

---

### W1-2 — Army List Versioning

- [ ] Migration: create `army_list_versions` table:
  ```sql
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID REFERENCES army_lists(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL,  -- full serialized list state
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  change_note TEXT
  ```
- [ ] In `listEditorStore.ts`: after every save, insert a snapshot row (list metadata + all units + wargear + enhancements + leader attachments)
- [ ] RLS: owner-only read/write on `army_list_versions`

**Depends on:** W1-1 (edition must be in the snapshot)

---

### W1-3 — PWA: Manifest + Service Worker

- [ ] Add `vite-plugin-pwa` to `frontend/package.json`
- [ ] Configure `manifest.json`: name, short_name, icons (192×192, 512×512), display: standalone, theme_color: `#0a0a0f`
- [ ] Configure Workbox cache strategies:
  - Static assets (JS/CSS/fonts): `CacheFirst`
  - Game data endpoints (`/rest/v1/factions`, `/rest/v1/units`, etc.): `StaleWhileRevalidate`
  - User data (`/rest/v1/army_lists`, `/rest/v1/game_sessions`): `NetworkFirst` with IndexedDB fallback
- [ ] Generalize existing `SyncStatusIndicator` to show global offline state across all pages
- [ ] Add "last synced" timestamp to the nav/header when offline
- [ ] Test: disconnect network mid-game session; verify state is preserved and syncs on reconnect

**Depends on:** T0-3 (need baseline to measure improvement)

---

### W1-4 — Opponent View for Play Mode

- [ ] Add `is_spectatable BOOLEAN DEFAULT FALSE` to `game_sessions` migration
- [ ] Add route `/game/:id/spectate` — public (no auth required), read-only
- [ ] `SpectateGamePage.tsx`: subscribes to Realtime channel for the session, renders read-only view of: round/phase, both VPs, active secondary objectives, event log
- [ ] Wire existing `invite_code` on `game_sessions` as the spectate token (shareable link)
- [ ] "Share game" button in `PlayModePage.tsx` → generates spectate URL using invite code
- [ ] Opponent can see secondaries drawn (not editable, but visible) — resolves the trust gap

---

### W1-5 — Changelog Page

- [ ] Create `frontend/src/shared/data/changelog.ts` — array of `{ date: string, version: string, items: string[] }` entries, newest first
- [ ] `ChangelogPage.tsx` — renders entries in reverse chronological order
- [ ] Add route `/changelog` to `App.tsx`
- [ ] Nav badge: show "NEW" indicator when `changelog[0].date` is newer than `localStorage.lastSeenChangelog`
- [ ] Commit to adding an entry here for every meaningful change going forward

---

### W1-6 — Multi-Source Data Abstraction Layer

- [ ] Create `scripts/data-sources/base.js` — JSDoc interface defining: `getFactions()`, `getUnits(factionId)`, `getDetachments(factionId)`, `getWeapons(unitId)`, `getAbilities(unitId)`, `getEnhancements(detachmentId)`
- [ ] Create `scripts/data-sources/bsdata.js` — extract current `parse-bsdata.js` logic into it, implementing the interface
- [ ] Create `scripts/data-sources/index.js` — exports `getActiveSource()` (returns BSData implementation)
- [ ] Migration: add `data_source TEXT DEFAULT 'bsdata'` and `data_source_updated_at TIMESTAMPTZ` to `factions`
- [ ] Update ingestion script to populate `data_source_updated_at` on each run
- [ ] Surface "data freshness" per faction in the units browser (`UnitsPage.tsx`)

---

## Wave 2: Differentiators

*Features that explicitly beat competitors. Start only after all Wave 1 items are complete.*

### W2-1 — Color Scheme Browse + Share *(Highest ROI — schema already 90% done)*

- [ ] Migration: add `scheme_code TEXT UNIQUE` to `paint_recipes` (auto-generated nanoid on first public share)
- [ ] Migration: RLS policy — `paint_recipes WHERE is_public = true` readable by anon
- [ ] `CommunityRecipesPage.tsx` at `/recipes/community`:
  - Filter by faction (dropdown from `factions` table)
  - Filter by color family (derived from first step's paint hex)
  - Search by recipe name
  - Cards link to public recipe detail
- [ ] Route `/recipes/:scheme_code` — public share URL, no auth required
- [ ] In `RecipeEditor.tsx`: "Make public" toggle that sets `is_public = true` and generates `scheme_code`; shows copyable share link

---

### W2-2 — Collection-Aware List Filtering

- [ ] Add `showOwnedOnly: boolean` flag to `listEditorStore.ts`
- [ ] When flag is true: filter unit picker results by joining `units.id` against `collection_entries.unit_id` for the current user (quantity > 0)
- [ ] `UnitPicker.tsx`: add "Owned only" toggle button with a collection icon
- [ ] Show "X owned" badge on unit cards even when filter is off (passive signal)
- [ ] Graceful state: if user has no collection entries, toggle shows "Add models to your collection to use this filter"

---

### W2-3 — Shopping List for Army

- [ ] Migration: create RPC `shopping_list_for_army(p_list_id UUID, p_user_id UUID)`:
  - Returns units in list not in collection, or where `collection_entries.quantity < army_list_units.model_count`
  - Columns: `unit_id`, `unit_name`, `count_needed`, `count_owned`, `est_cost_usd` (from `wishlist_items.estimated_price` or NULL)
- [ ] `ShoppingListModal.tsx`: triggered from "What do I need?" button on `ListEditorPage`
  - Shows diff as checklist: unit name, need X more, estimated cost
  - Total estimated cost at bottom
  - "Add all to wishlist" one-click action

---

### W2-4 — Hobby Streaks + Achievements

- [ ] Migration: create `hobby_streaks` table:
  ```sql
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  current_streak_days INT DEFAULT 0,
  longest_streak_days INT DEFAULT 0,
  last_activity_date DATE,
  total_active_days INT DEFAULT 0
  ```
- [ ] Migration: create `achievements` table (id, slug, name, description, icon, criteria JSONB)
- [ ] Migration: create `user_achievements` table (user_id, achievement_id, earned_at)
- [ ] Seed `achievements` with ~15 milestones: first list, first game, first model painted, first campaign, 7-day streak, 30-day streak, etc.
- [ ] DB trigger on `collection_entries` UPDATE: if `painting_status` changed and `last_activity_date != today`, update streak
- [ ] RPC `check_and_award_achievements(p_user_id UUID)` — called after: list create, game complete, paint recipe save, campaign battle log
- [ ] `StreakWidget.tsx`: flame icon + day count on Dashboard
- [ ] `AchievementsPanel.tsx`: earned badges shelf on Profile page
- [ ] RLS: owner-only on `hobby_streaks`, `user_achievements`; public read on `achievements`

---

### W2-5 — Cross-Brand Paint Equivalents

- [ ] Migration: create `paint_equivalents` table:
  ```sql
  paint_id UUID REFERENCES paint_library(id) ON DELETE CASCADE,
  equivalent_paint_id UUID REFERENCES paint_library(id) ON DELETE CASCADE,
  similarity_score INT CHECK (similarity_score BETWEEN 0 AND 100),
  source TEXT CHECK (source IN ('community', 'lab_match', 'manufacturer')),
  votes INT DEFAULT 0,
  PRIMARY KEY (paint_id, equivalent_paint_id)
  ```
- [ ] Seed equivalents from Goonhammer paint conversion charts (CSV → SQL seed migration)
- [ ] In `PaintPicker.tsx`: when a paint is not in user's inventory, show "Equivalents" collapsible section with similarity scores and brand labels
- [ ] In `RecipeEditor.tsx`: equivalent paints shown inline per step with "you own this instead" callout
- [ ] Optional: thumbs up/down voting on equivalents (increments `votes`)

---

### W2-6 — Distraction-Free Painting Mode

- [ ] Route `/recipes/:id/paint` — full-screen, hides nav
- [ ] `PaintingModeView.tsx`:
  - One step visible at a time, large readable text
  - Prev/Next navigation (swipe-friendly on mobile)
  - Step timer: optional countdown per step, vibrate API on complete
  - Paint name + technique displayed prominently
  - Photo for the step if one exists
- [ ] Exit: back button or swipe down returns to recipe detail
- [ ] Persist current step index to `localStorage` so returning resumes where left off
- [ ] Entry point: "Paint" button on recipe detail page

---

### W2-7 — Geographic Tournament Discovery

- [ ] Migration: add `venue_city TEXT`, `venue_lat NUMERIC(10,7)`, `venue_lng NUMERIC(10,7)` to `tournaments`
- [ ] Migration: create RPC `tournaments_near(p_lat NUMERIC, p_lng NUMERIC, p_radius_km INT)` using Haversine formula
- [ ] In `TournamentsPage.tsx`: "Near me" button → requests browser geolocation → calls RPC with configurable radius (25km / 50km / 100km slider)
- [ ] In tournament creation form: city/location field with browser geolocation autofill option

---

### W2-8 — Meta Analysis Dashboard

- [ ] Route `/meta` with three tabs: Factions, Detachments, Lists
- [ ] Migration: create RPCs:
  - `faction_win_rates(p_days INT)` → table(faction_id, faction_name, win_rate NUMERIC, sample_size INT)
  - `detachment_play_rates(p_days INT)` → table(detachment_id, detachment_name, faction_name, play_count INT)
  - Both join `game_sessions` → `army_lists` → `factions`/`detachments` WHERE session is from a public tournament
- [ ] `MetaPage.tsx`:
  - Factions tab: bar chart (win rate %) + sortable table, time window filter (30/60/90 days)
  - Detachments tab: most-played by faction, filterable
  - Lists tab: browse winning lists from public tournaments with full army list view
- [ ] Data note: only counts completed games linked to public tournaments (prevents gaming)

---

### W2-9 — Tournament List Submission + TO Admin

- [ ] Migration: add `list_submission_deadline TIMESTAMPTZ` and `submitted_list_id UUID REFERENCES army_lists(id)` to `tournament_participants`
- [ ] In tournament detail (participant view): "Submit List" button, visible only before deadline; runs `validate_army_list` before accepting
- [ ] After deadline: submitted lists lock — participant cannot change, TO can view
- [ ] TO admin tab on tournament detail: table of all participants with submission status (submitted / pending / none); click to view full list
- [ ] Validation: invalid list cannot be submitted; shows validation errors inline

---

### W2-10 — List Versioning UI

- [ ] `ListHistoryPanel.tsx`: slide-in panel from "History" button in list editor
  - Lists past snapshots: timestamp, points total, unit count, change note
  - Each entry: expandable summary + "Restore as new list" button (calls `duplicate_army_list` with snapshot data — non-destructive)
- [ ] History button in `ListEditorPage.tsx` header (only visible when versions exist)

**Depends on:** W1-2 (table must exist and be accumulating snapshots)

---

## Wave 3: Polish (Rolling)

*Quality and community features. No strict sequencing — pick by what users are asking for.*

- [ ] **W3-1** — Multi-list comparison view: pick 2 lists, see side-by-side diff (units in A not in B, points delta, detachment difference)
- [ ] **W3-2** — Pre-game checklist modal: "Have you set up objectives? Decided first turn? Declared warlord?" — simple checklist before play mode starts
- [ ] **W3-3** — Battle report export: shareable public URL for completed game session (turn-by-turn timeline, final score, faction matchup). No auth required to view.
- [ ] **W3-4** — Crusade narrative log: `narrative_entries JSONB` on `campaigns`; markdown-friendly journal per campaign with rich text editor in `CampaignDetailPage`
- [ ] **W3-5** — Crusade card printable export: CSS `@media print` layout for each crusade unit — stat line, XP/rank, honours, scars. "Print cards" button on roster page.
- [ ] **W3-6** — Friend activity feed: tasteful feed on Dashboard — "Mike finished painting a Rhino 2 hours ago." Pulls from collection status changes + game results for friends. No algorithmic ranking.
- [ ] **W3-7** — Player rivalries page: auto-generated `/rivalry/:user1/:user2` using existing `get_head_to_head` RPC + a dedicated UI page. Entry points on Profile and StatsPage.
- [ ] **W3-8** — Public read-only API: document and surface existing PostgREST public endpoints (game data + public lists + public tournaments). Simple API reference page at `/api` or in docs.

---

## Community & Launch

*Run parallel to development. These don't require code.*

### Before Any Public Visibility

- [ ] **CL-1** — Secure domain: check `warforge.app` and `warforge.gg` availability; register the best option
- [ ] **CL-2** — Rename GitHub repo from `warhammer-list-builder` to `warforge`
- [ ] **CL-3** — Legal footer live (T0-2 complete)

### Beta Phase (After Wave 1 complete)

- [ ] **CL-4** — Create Discord server; use as primary feedback channel
- [ ] **CL-5** — Set up public roadmap (GitHub Projects board, public visibility)
- [ ] **CL-6** — Recruit 20-50 closed beta testers from local meta group (not Reddit yet)
- [ ] **CL-7** — Commit to weekly changelog updates (W1-5 live + a new entry every week)

### Public Launch (After Wave 2 complete)

- [ ] **CL-8** — Pitch to Spikey Bits: one direct email, one paragraph, reviewer account
- [ ] **CL-9** — Pitch to Goonhammer: same format
- [ ] **CL-10** — Pitch to Wargamer: same format
- [ ] **CL-11** — One honest "I built this" post on r/WarhammerCompetitive (no reposting, no hype)
- [ ] **CL-12** — Explore BCP integration: can WarForge list/collection data complement their pairings tool?

---

## Legal & Risk

These are standing hygiene rules, not one-time tasks.

- **Stay free** — no core features behind a paywall. Monetize only via optional supporter cosmetics or storage tiers.
- **No GW assets** — no Aquila, no faction icons from GW art, no model photography, no flavor text.
- **Trademark disclaimer** — always visible (T0-2). Do not use "Warhammer 40,000" as a product feature name.
- **Data attribution** — BSData is the source. Credit it. If Wahapedia scraping is added, do not reproduce flavor text or lore.
- **Fallback documentation** — maintain a note somewhere on which features depend on which data sources. If a C&D arrives, know what's strippable.
- **Supabase portability** — schema lives in migrations, not in the dashboard. Self-hosted Postgres migration is always possible.

---

## Completed Items

*Move items here when done. Format: `[x] Item name — completed YYYY-MM-DD. Notes.`*

### Tier 0

- [x] **T0-1** — CI test step — completed 2026-05-01. Added `npm test -- --run` to `.github/workflows/ci.yml` between Build and Lint steps.
- [x] **T0-2** — Legal footer — completed 2026-05-01. `AppFooter` component renders trademark disclaimer on all pages. Hidden on list editor (full-viewport layout). Files: `AppFooter.tsx`, `App.tsx`, `base.css`.
- [x] **T0-3** — Performance baseline documented — completed 2026-05-01. Initial JS 95.9 kB gzip (✅ under 200 kB). See CLAUDE.md "Performance Baseline" section.
- [x] **T0-4** — A11y baseline documented — completed 2026-05-01. 2 WCAG AA failures logged (keyboard + aria-live), no contrast failures. See CLAUDE.md "Accessibility Baseline" section.

---

## Sequencing at a Glance

```
NOW → T0 (1-2 sessions)
       ↓
     WAVE 1 (4-8 weeks)
       W1-1 Edition discriminator  ← START HERE
       W1-2 List versioning
       W1-3 PWA + service worker
       W1-4 Opponent view
       W1-5 Changelog page
       W1-6 Data abstraction
       ↓
     WAVE 2 (8-16 weeks)
       W2-1 Scheme sharing  ← highest ROI
       W2-2 Owned-only filter
       W2-3 Shopping list
       W2-4 Streaks + achievements
       W2-5 Paint equivalents
       W2-6 Painting mode
       W2-7 Geo tournaments
       W2-8 Meta dashboard
       W2-9 List submission + TO tools
       W2-10 List history UI
       ↓
     WAVE 3 (rolling)
     + COMMUNITY (parallel throughout)
```
