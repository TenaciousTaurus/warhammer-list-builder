# Warhammer 40K Army List Builder

## Session Start Protocol

When I say "init" or "start session", do the following before any other work:

1. Read this CLAUDE.md file fully.
2. Walk through the entire project directory structure to understand the layout.
3. Read all config files (package.json, tsconfig.json, .env.example, docker-compose.yml, etc.).
4. Read key source files — entry points, route definitions, database schemas/models, and shared utilities/types.
5. Review any test files to understand expected behavior and edge cases.
6. Check git status and recent commit history (last 10 commits) to understand what's been changing.
7. Summarize your understanding back to me: architecture, tech stack, key patterns, current state of the codebase, and any potential issues you notice.

Do NOT start making changes or suggestions until you've completed this review and I've confirmed your understanding is correct.

## Session End Protocol

When I say "wrap up" or "end session", do the following:

1. List every file created or modified this session.
2. Run the full test suite and report results. If anything fails, flag it and fix it before proceeding.
3. Run the linter/type checker and resolve any errors or warnings we introduced.
4. Check for any TODO, FIXME, or HACK comments we added — list them so nothing is forgotten.
5. Review git status — show all staged/unstaged changes and untracked files.
6. Summarize what we accomplished this session: features added, bugs fixed, refactors done.
7. Note any incomplete work, known issues, or things to pick up next session.
8. Update CLAUDE.md if any new conventions, patterns, or architectural decisions were established.
9. Suggest a clear, descriptive commit message (or multiple if the work should be split into separate commits).

Do NOT consider the session complete until tests pass, there are no linter errors, and I've confirmed the summary.



## Project Overview
A local-first army list builder for Warhammer 40,000 (10th Edition). Users can create, edit, and manage army lists with automatic points calculation and validation.

## Tech Stack
- **Frontend:** React 18 + Vite + TypeScript
- **Backend/API:** Supabase (PostgREST auto-generated REST API, no separate backend server)
- **Database:** PostgreSQL 15 via Supabase local
- **Auth:** Supabase Auth (GoTrue)
- **Dev Infra:** Docker, Supabase CLI (`npx supabase`)

## Architecture Decisions
- No separate backend — use Supabase's auto-generated REST API + Row Level Security for auth/authorization
- Supabase Edge Functions only if server-side logic is needed later (e.g. complex validation)
- All game data (factions, units, weapons) is public-read via RLS policies
- User data (army lists) is owner-only via RLS policies
- Points calculation done both client-side (for instant UI) and via a SQL function (for server-side validation)

## Local Development
- Supabase runs locally via `npx supabase start` (spins up Docker containers for Postgres, PostgREST, GoTrue, Studio)
- Frontend runs via `npm run dev` (Vite dev server on port 5173)
- Supabase Studio available at http://localhost:54323 for DB inspection
- Supabase API at http://localhost:54321
- Database migrations live in `supabase/migrations/`
- Seed data goes in migration files (for reproducibility on `supabase db reset`)

## Database Schema Concepts (10th Edition 40K)
The schema should model these game concepts:
- **Factions** — top-level armies (Space Marines, Orks, Aeldari, etc.)
- **Detachments** — army-wide rules within a faction (e.g. Gladius Task Force)
- **Enhancements** — per-detachment upgrades that can be given to character units
- **Units** — datasheets with stat lines (M, T, Sv, W, Ld, OC), keywords, roles
- **Unit roles** — epic_hero, character, battleline, infantry, mounted, beast, vehicle, monster, fortification, dedicated_transport, allied
- **Unit points tiers** — some units cost different amounts based on model count (e.g. 5 Intercessors = 90pts, 10 = 180pts)
- **Weapons** — ranged and melee weapon profiles (range, attacks, skill, strength, AP, damage, keywords)
- **Abilities** — unit abilities (core, faction, unique, invulnerable saves)
- **Wargear options** — equipment swaps available to a unit
- **Army lists** — user-created lists tied to a faction + detachment with a points limit
- **Army list units** — units added to a list with model count and sort order
- **Army list unit wargear** — selected wargear for each unit in a list
- **Army list enhancements** — enhancement assigned to a character unit in a list

## Feature Priority (in order)
1. **Army list CRUD** — create, edit, delete army lists; select faction + detachment + points limit
2. **Points calculator & validation** — live points total, over-limit warnings, duplicate unique unit detection
3. **Unit/faction database browser** — browse available units for a faction, view stat lines and weapons
4. **Import/export lists** — shareable codes or text export for tournament use

## UI/UX Direction
- Dark "grim-dark" aesthetic appropriate for 40K
- Display font: Orbitron (for headers/titles)
- Body font: Inter
- Gold accent color (#c9a84c) for imperial/important elements
- Stat lines displayed compactly (M | T | Sv | W | Ld | OC)
- Unit role color-coding (green=battleline, gold=character, red=vehicle/monster)
- Points progress bar with over-limit state
- Mobile responsive (sidebar collapses to full-width)

## Commands
```bash
npx supabase start         # Start local Supabase
npx supabase stop          # Stop Supabase
npx supabase db reset      # Reset DB & re-run all migrations
npx supabase migration new <name>  # Create new migration
cd frontend && npm run dev  # Start frontend dev server
cd frontend && npm run build # Build for production
```
