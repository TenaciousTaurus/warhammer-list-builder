# WarForge — Session Handoff

> Drop this file into a fresh Claude conversation to pick up where Jeff left off. For full project context, also read `CLAUDE.md` in this repo.

## Project in one paragraph

**WarForge** is an all-in-one Warhammer 40K (10th Edition) companion PWA that consolidates list building, in-game play tracking, collection/paint management, Crusade campaigns, and social/tournament features into one app. React 19 + Vite 7 + TypeScript + Zustand + Supabase (PostgreSQL + Auth + Realtime + Storage). Pure CSS with BEM and custom properties (no Tailwind). All phases 1–5 are feature-complete; the app is in a pre-soft-launch polish window. Production is live on Vercel, backed by hosted Supabase.

## Repo layout (highlights)

```
warhammer-list-builder/
├── CLAUDE.md                    # Full project brain — read this first
├── scripts/parse-bsdata.js      # BattleScribe catalog → SQL parser
├── data/bsdata/                 # 26 faction catalogs (source of truth)
├── supabase/migrations/         # 37 additive migrations, never modify past ones
└── frontend/src/
    ├── features/{list-builder,play-mode,collection,crusade,social}/
    │   └── {components,hooks,stores,pages}/
    └── shared/{components,stores,types,lib,pages,css}/
```

## Git / branching

- **Branching model:** feature branch → `develop` → PR to `main`. Always feature branches, no exceptions.
- **Current branch:** `develop`
- **Recent relevant merges (as of 2026-04-11):**
  - #46/#47 Production data sync (112 enhancements across 28 detachments)
  - #48 Store test coverage expansion (147 → 199 tests)
  - #49/#51 Gitignore coverage output
  - v1.1.1 release with detachment editor fix
- **Uncommitted local changes on `develop`:** `CLAUDE.md`, `frontend/src/main.tsx` (inspect before committing — may be WIP)
- **CI:** type check + build + lint on every PR via GitHub Actions; Vercel preview deploys on PRs.

## Current state

- **Phases 1–5 shipped:** list builder, play mode (with Realtime + chess timer + dice + casualty tracking), collection/paints, Crusade campaigns, social/tournaments/leagues/orgs.
- **Sentry** is wired in `frontend/src/sentry.ts` + `main.tsx` + `App.tsx` ErrorBoundary. DSN set in Vercel production. Local dev no-ops on blank DSN.
- **Tests:** Vitest. 199 passing. Critical stores covered: `listEditorStore` (51%), `gameSessionStore` (65%), `crusadeStore` (80%). Overall 11.77%.
- **Production Supabase project ref:** `ttwotrktozzkxtveppqd`. Push migrations with `npx supabase db push`.

## Priority queue (next session)

1. **Soft launch prep** — test with local gaming group (not Reddit). Review new-user onboarding flow — is it obvious what to do first? Fix feedback from testers.
2. **Uncovered test debt (low ROI, defer unless time):** multi-Promise.all loaders in `listEditorStore`/`gameSessionStore`/`crusadeStore`, `_syncSessionImmediate` retry, mutating actions needing heavy chain mocking (`addUnit`, `assignEnhancement`, `selectWargear`, `updateComposition`, `attachLeader`, `handleImport`).
3. **Parser edge cases still unfixed** (see `scripts/PARSER_IMPROVEMENTS.md`): Necrons Pantheon of Woe (inline unit-embedded), IK Questor Forgepact + GSC×3 (cross-catalog lib resolution), Agents Veiled Blade (missing in BSData upstream).
4. **Future enhancements:** invite codes for multiplayer game sessions, opponent view for shared game sessions.

## Deferred / parked

- **11th Edition roadmap.** Approved plan at `.claude/plans/cheeky-frolicking-castle.md`. Launches June 2026. Key decisions: dual 10th+11th coexist with edition dropdown, feature-flagged via DB `app_config` table. Do NOT start until dev environment for 11th is ready and rules are fully released.
- Offline/PWA mode
- Meta stats dashboard

## Architecture / conventions (non-obvious)

- **No separate backend** — Supabase PostgREST + RLS does everything. Game data = public read. User data = owner only.
- **Zustand stores** for new features; `useListEditor` hook is legacy (will be refactored).
- **Migrations are strictly additive** — never edit a past migration. Create a new one.
- **Detachment selection lives in `ListEditorPage`**, not `CreateListModal` (moved in v1.1.1).
- **Chapter detachments:** only show detachments a specific chapter can take, not all Space Marine detachments. Parent SM faction should NOT show chapter-specific detachments.
- **JSONB** for Crusade honours/scars, campaign metadata, paint recipes.
- **Commits:** conventional commits only (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`).
- **Pre-commit check:** always run `git diff --cached` before committing, especially after `git rm --cached` + edits.

## Commands

```bash
npx supabase start                  # Start local stack
npx supabase db reset               # Reset + re-seed local DB
npx supabase db push                # Push migrations to production
cd frontend && npm run dev          # localhost:5173
cd frontend && npm run build        # Production build
cd frontend && npx tsc -b           # Type check
cd frontend && npm test             # Vitest
```

Studio: `localhost:54323`. Frontend dev: `localhost:5173`.

## Session protocols (from CLAUDE.md)

- **"init" / "start session":** read CLAUDE.md, walk the directory, read config/entry files, check `git status` and last 10 commits, summarize understanding back before changing anything.
- **"wrap up" / "end session":** list modified files, run `tsc -b` + `npm run build` clean, list any TODO/FIXME added, review `git status`, summarize, suggest conventional-commit messages. Build must compile clean before session is complete.
