# WarForge — Warhammer 40K All-in-One Companion

## Project Vision

WarForge is an all-in-one companion app for Warhammer 40,000 (10th Edition) that consolidates the fragmented ecosystem of tools players currently juggle — list building, in-game tracking, scoring, collection management, paint tracking, Crusade campaigns, and rules reference — into a single, cohesive experience.

## Session Start Protocol

When I say "init" or "start session", do the following before any other work:

1. Read this CLAUDE.md file fully.
2. Walk through the entire project directory structure to understand the layout.
3. Read all config files (package.json, tsconfig.json, .env.local, supabase/config.toml, etc.).
4. Read key source files — entry points, route definitions, database schemas/models, stores, and shared utilities/types.
5. Review any test files to understand expected behavior and edge cases.
6. Check git status and recent commit history (last 10 commits) to understand what's been changing.
7. Summarize your understanding back to me: architecture, tech stack, key patterns, current state of the codebase, and any potential issues you notice.

Do NOT start making changes or suggestions until you've completed this review and I've confirmed your understanding is correct.

## Session End Protocol

When I say "wrap up" or "end session", do the following:

1. List every file created or modified this session.
2. Run `cd frontend && npx tsc -b` and resolve any errors we introduced.
3. Run `cd frontend && npm run build` and verify clean production build.
4. Check for any TODO, FIXME, or HACK comments we added — list them.
5. Review git status — show all staged/unstaged changes and untracked files.
6. Summarize what we accomplished: features added, bugs fixed, refactors done.
7. Note any incomplete work, known issues, or things to pick up next session.
8. Update CLAUDE.md if any new conventions, patterns, or architectural decisions were established.
9. Suggest clear, descriptive commit message(s) using conventional commits format.

Do NOT consider the session complete until the build compiles clean and I've confirmed the summary.

---

## Tech Stack

- **Frontend:** React 19 + Vite 7 + TypeScript 5.9
- **Styling:** Pure CSS with custom properties (BEM naming, glassmorphism system)
- **State Management:** Zustand (client state) + React hooks for server state
- **Routing:** React Router v7
- **Backend/API:** Supabase (PostgREST auto-generated REST API, no separate backend server)
- **Database:** PostgreSQL 17 via Supabase local (Docker)
- **Auth:** Supabase Auth (GoTrue) via Zustand store
- **Real-time:** Supabase Realtime (for multi-device game sync in Phase 2)
- **Dev Infra:** Docker, Supabase CLI (`npx supabase`)

## Architecture Decisions

- **No separate backend** — use Supabase's auto-generated REST API + Row Level Security
- **No Tailwind** — pure CSS with BEM naming and 105+ custom properties. Existing design system is mature; migrating would be churn with no user-facing benefit.
- **Zustand for state** — new features use Zustand stores. `useListEditor` hook is legacy (will be refactored to a store later).
- **Feature-based directory structure** — `src/features/{feature}/` for each major area, `src/shared/` for cross-cutting concerns.
- **Game data (factions, units, weapons, abilities) is public-read** via RLS. User data (lists, collections, campaigns) is owner-only via RLS.
- **JSONB for flexible data** — Crusade honours/scars, campaign metadata, paint recipes.
- **Migrations are additive** — never modify an existing migration file. Create new migrations for schema changes.

---

## Project Structure

```
warforge/
├── CLAUDE.md                              # This file — project brain
├── package.json                           # Root package (parse-bsdata script deps)
├── scripts/
│   └── parse-bsdata.js                    # BattleScribe .cat → SQL migration parser
├── data/
│   └── bsdata/                            # BattleScribe catalog files (26 factions)
├── supabase/
│   ├── config.toml                        # Supabase local config
│   └── migrations/
│       ├── 20250220000001_initial_schema.sql
│       ├── 20250220000005_wargear_options.sql
│       ├── 20250220000010_seed_all_factions.sql
│       ├── 20250220000020_calculate_list_points.sql
│       ├── 20250220000030_duplicate_list_and_sharing.sql
│       ├── 20250220000040_auth_rls_policies.sql
│       ├── 20250220000050_battle_size_tiers.sql
│       ├── 20250220000055_transport_capacity.sql
│       └── 20250220000060_security_and_indexes.sql
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx                         # Router + layout
        ├── index.css                       # CSS custom properties (variables)
        ├── features/
        │   ├── list-builder/
        │   │   ├── components/             # ArmyRoster, UnitPicker, RosterItem, etc.
        │   │   │   └── unit-detail/        # ModelComposition, WargearToggle, etc.
        │   │   ├── hooks/                  # useListEditor
        │   │   ├── pages/                  # ListEditorPage, ListsPage
        │   │   └── list-builder.css
        │   ├── play-mode/
        │   │   ├── components/             # GameTracker, CasualtyTracker, etc.
        │   │   ├── stores/                 # gameSessionStore (Phase 2)
        │   │   ├── hooks/                  # useGameSession (Phase 2)
        │   │   ├── pages/                  # PlayModePage
        │   │   └── play-mode.css
        │   ├── collection/                 # Phase 3
        │   ├── crusade/                    # Phase 4
        │   └── social/                     # Phase 5
        └── shared/
            ├── components/                 # ConfirmDialog, DatasheetView, StatLine
            ├── hooks/                      # useAuth (thin wrapper over authStore)
            ├── stores/                     # authStore
            ├── types/                      # database.ts (all DB types)
            ├── lib/                        # supabase.ts (client init)
            ├── pages/                      # AuthPage, UnitsPage, SharedListPage
            └── css/                        # base.css, pages.css
```

---

## Database Schema

### Game Data Tables (public read via RLS)

| Table | Purpose |
|-------|---------|
| `factions` | Top-level armies (Space Marines, Orks, etc.) |
| `detachments` | Army-wide rules within a faction |
| `units` | Datasheets with stat lines (M, T, Sv, W, Ld, OC), keywords, roles |
| `unit_points_tiers` | Points costs at different model counts |
| `weapons` | Ranged and melee weapon profiles |
| `abilities` | Unit abilities (core, faction, unique, invulnerable) |
| `enhancements` | Per-detachment upgrades for characters |
| `wargear_options` | Equipment swap options per unit |
| `unit_model_variants` | Model composition options (e.g., Sergeant + Marines) |
| `unit_leader_targets` | Which characters can lead which units |
| `battle_sizes` | Combat Patrol, Incursion, Strike Force, Onslaught |

### User Data Tables (owner-only via RLS)

| Table | Purpose |
|-------|---------|
| `army_lists` | User's army lists with faction, detachment, points limit |
| `army_list_units` | Units in a list with model count and sort order |
| `army_list_enhancements` | Enhancement assignments to units |
| `army_list_unit_wargear` | Wargear selections per unit |
| `army_list_unit_composition` | Model variant counts per unit |
| `army_list_leader_attachments` | Leader-to-unit attachments |

### RPC Functions

| Function | Purpose |
|----------|---------|
| `calculate_list_points(list_id)` | Server-side points calculation |
| `validate_army_list(list_id)` | Full validation (points + unit limits + enhancement rules) |
| `duplicate_army_list(source_list_id)` | Atomic list duplication |

---

## Phase Roadmap

### Phase 1 — List Builder
**Status: Complete.** Unit CRUD, points tracking, wargear, enhancements, leader attachments, model composition, import/export, QR sharing, print-friendly view, tablet optimization, Legends toggle.

### Phase 2 — In-Game Play Mode
**Status: Complete.** DB-backed game sessions via Zustand store, phase-by-phase flow (Command/Movement/Shooting/Charge/Fight), CP/stratagem tracking with event logging, VP scoring with secondary objectives, chess timer (persisted to session), dice roller, casualty tracker (DB-synced), battle reports, Supabase Realtime for multi-device sync, mission selection.

### Phase 3 — Collection & Hobby Tracker
**Status: Complete.** Collection CRUD with grid/pipeline views, enhanced stats (per-status bars, per-faction breakdown, avg cost/model), automatic unit matching (UnitMatchPicker autocomplete), photo gallery (Supabase Storage), instant list verification, wishlist, paint recipes with step editor, paint library.

### Phase 4 — Crusade & Campaign Mode
**Status: Schema + components built, needs integration testing.** Campaigns, rosters, unit progression (XP, honours, scars via JSONB), battle logging, requisitions, multiplayer campaigns with Realtime sync.

### Phase 5 — Social, Stats & Tournament
**Status: Complete.** Profiles, friendships, player stats, head-to-head records, tournaments (Swiss/Single Elim/Round Robin) with Realtime sync, public tournament browsing with filters, leagues, organisations with role-based member management.

---

## UI/UX Direction

- Dark "grim-dark" aesthetic — deep blacks, glassmorphism, NOT just "dark mode"
- Display font: **Orbitron** (headers/titles)
- Body font: **Inter** (readable body text)
- Gold accent: `#c9a84c` — imperial/important elements
- Role color-coding: green=Battleline, gold=Character, red=Vehicle/Monster, purple=Epic Hero
- Stat lines displayed compactly: M | T | Sv | W | Ld | OC
- Points progress bar with over-limit state
- Mobile responsive (sidebar collapses)
- BEM class naming convention with CSS custom properties

---

## Conventions

- **TypeScript strict mode** — no `any` unless unavoidable (and comment why)
- **Supabase queries in hooks/stores** — never call Supabase directly in components
- **Functional components** with hooks — no class components
- **BEM + CSS custom properties** — no Tailwind, no inline styles
- **One component per file** — named export matching filename
- **Colocate types** — component-specific types live in the component. Shared types in `shared/types/`
- **Error handling** — every Supabase query must handle errors with user-visible feedback
- **Loading states** — every data-fetching component shows skeleton/spinner while loading
- **Empty states** — every list/grid view has a meaningful empty state with CTA
- **Migrations are additive** — never modify existing migrations
- **RLS on every table** — game data = public read, user data = owner only
- **Commit messages** — conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`

---

## Commands

```bash
npx supabase start              # Start local Supabase (Postgres, Auth, REST, Studio)
npx supabase stop               # Stop Supabase
npx supabase status             # Show running service URLs & keys
npx supabase db reset           # Reset DB & re-run all migrations + seed
npx supabase migration new <n>  # Create new migration file
cd frontend && npm run dev      # Start frontend dev server (localhost:5173)
cd frontend && npm run build    # Production build (tsc -b && vite build)
cd frontend && npx tsc -b       # Type check
cd frontend && npx tsc --noEmit # Type check without emit (faster)
```

Supabase Studio: `http://localhost:54323`
Frontend Dev: `http://localhost:5173`

---

## Upcoming Work

### Data Quality
- [x] Parser ability extraction improved — now recurses into selectionEntryGroups and entryLinks
- 19 units missing weapons: all Fortifications (no weapon profiles in BSData by design)
- 2 units missing abilities: Tactical Drones, Spindle Drones (no ability profiles in BSData)
- [x] Code-split frontend bundle (735KB → 304KB via React.lazy route splitting)

### Phase 4: Crusade Buildout
- [x] Wire crusade components to live data (unit names resolved via join, battle participants saved, supply limit from DB)
- [x] Post-battle sequence flow (XP awards via award_crusade_xp RPC, honour/scar selection)
- [x] Campaign leaderboard from real battle data (CampaignLeaderboard component wired)

### Future Enhancements
- [x] User paint inventory UI (PaintInventoryPage + store + collection sub-nav)
- [x] Recipe step photos (upload per step in RecipeEditor, display in recipe card)
- [ ] Invite codes for multiplayer game sessions
- [ ] Opponent view for shared game sessions
