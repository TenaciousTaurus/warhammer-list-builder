# BSData Parser Improvement Plan

This document tracks known parser gaps in `scripts/parse-bsdata.js` and outlines fixes.

## Background

The BSData parser converts BattleScribe `.cat` files into a SQL seed migration. Different faction catalogs use different XML structures for the same logical data, and the parser must handle each variant.

## Recently Fixed (this session)

### Flat Enhancement Group Pattern

**Problem:** Some catalogs (Custodes, AdMech, Agents, CSM, Emperor's Children, Thousand Sons, Leagues of Votann) put all enhancements in a single flat `Enhancements` group instead of detachment-named sub-groups (e.g., "Shield Host Enhancements"). The parser previously only matched enhancements via group name or `<comment>` field — neither worked for these catalogs, leaving 100+ enhancements unextracted.

**Fix:** When the standard match fails, walk each enhancement's hidden modifier and extract the detachment link from condition `childId` references. Two patterns are now supported:

1. **"Hide if not selected"** — entry visible by default, modifier sets `hidden=true` when a `lessThan value="1"` or `equalTo value="0"` condition matches a detachment ID via `scope="force"` or `scope="roster"`.
2. **"Show if selected"** — entry has `hidden="true"`, modifierGroup sets `hidden=false` when an `atLeast value="1"` condition matches a detachment ID.

**Impact:** Enhancement count rose from 746 → 850 (+104), covering 28 previously empty detachments across 8 factions.

### Cross-Catalog Enhancement Group Resolution + Inline Unit Enhancements

**Problem:** Many factions (Imperial Knights, Tyranids, Genestealer Cults) define their enhancement groups in an imported library catalog rather than the primary `.cat` file. The parser only searched `root?.sharedSelectionEntryGroups` of the primary catalog, so library-defined enhancement groups were never found. Additionally, some enhancement groups within a library are referenced via `entryLink` rather than being direct children. Necrons Pantheon of Woe enhancements are embedded inside individual unit `selectionEntries`, not in any shared Enhancements group at all.

**Fix:** Three changes to `extractDetachments` in `parse-bsdata.js`:

1. **`findEnhancementGroups`** — now follows `entryLinks` of type `selectionEntryGroup` within an "Enhancements" group, resolving linked sub-groups via `entryIndex`. Fixes IK Questor Forgepact.
2. **entryIndex scan** — after searching the primary catalog's `sharedSelectionEntryGroups`, scans all nodes in `entryIndex` (which includes merged imported catalogs) for nodes named `"Enhancements"`. Deduplicates by sub-group ID to prevent double-inserts. Fixes IK, GSC, and Tyranids.
3. **Inline entryIndex scan (Strategy 3)** — scans all `hidden="true"` upgrade entries in `entryIndex` for Pattern B modifiers (modifierGroup sets `hidden=false` via `atLeast` condition on a detachment ID). Fixes Necrons Pantheon of Woe.

**Impact:** Enhancement count rose from 850 → 918 (+68), covering:
- Imperial Knights: 5 detachments now have enhancements (was 0)
- Genestealer Cults: Biosanctic Broodsurge, Brood Brother Auxilia, Xenocreed Congregation (was 0)
- Tyranids: all 8 detachments now have enhancements (was 0 — same root cause, not previously identified)
- Necrons: Pantheon of Woe now has 4 enhancements (was 0)

---

## Known Gaps (still missing)

These are edge cases that require more invasive parser changes. Estimated total: ~24 enhancements across 5 detachments.

### ~~Gap 1: Inline Unit-Embedded Enhancements~~ — FIXED

**Faction:** Necrons
**Detachment:** Pantheon of Woe (4 enhancements)

**Symptom:** Pantheon of Woe enhancements (Singularity Matrix, Quantum Goad, Animus Damper, Relativistic Tether) live inline within unit `selectionEntries`, NOT in the shared `Enhancements` group. They are conditional `selectionEntry` elements with `hidden="true"` that get unhidden via `atLeast` modifiers when Pantheon of Woe is the selected detachment.

**Why the current parser misses them:** `findEnhancementGroups` only walks `sharedSelectionEntryGroups` looking for groups named "Enhancements". These entries are scattered inside individual unit definitions.

**Proposed fix:**
- Add a second extraction pass that walks ALL `selectionEntry` elements in the catalog (via the existing `entryIndex`).
- For each entry, check if it has a `hidden="true"` attribute AND a modifierGroup that sets `hidden="false"` via an `atLeast` condition referencing a detachment entry ID.
- If both conditions match and the entry has an `Abilities` profile, treat it as an enhancement and link it to the matched detachment.

**Risk:** Could double-count if an enhancement appears both in the shared group AND inline. Mitigate by tracking already-extracted enhancement IDs.

---

### ~~Gap 2: Cross-Catalog Enhancement Group Resolution~~ — FIXED

**Faction:** Imperial Knights
**Detachment:** Questor Forgepact (4 enhancements)

**Symptom:** The "Questor Forgepact Enhancements" sub-group exists in `Imperium - Imperial Knights - Library.cat`, not in the main `Imperium - Imperial Knights.cat` that's parsed as the primary catalog. The library is referenced via `catalogueLink`.

**Why the current parser misses them:** `extractDetachments` is called with the main catalog root and only searches that catalog's `sharedSelectionEntryGroups`. While `mergeImportedCatalogues` merges imported entries into `entryIndex`, the enhancement group search isn't using that merged index.

**Proposed fix:**
- Pass the merged `entryIndex` into `extractDetachments` (or refactor to also walk imported catalogs' shared groups).
- When searching for enhancement groups, iterate through all merged shared groups, not just the primary catalog's.
- Alternative: walk every node in `entryIndex` looking for groups whose name ends in "Enhancements".

**Risk:** Could pick up enhancements from unrelated imported catalogs (e.g., Space Marines Library imported by chapters). Mitigate by scoping the search to catalogs explicitly linked from the current faction's catalog.

---

### ~~Gap 3: Library-Defined GSC Codex Detachments~~ — FIXED

**Faction:** Genestealer Cults
**Detachments:** Biosanctic Broodsurge, Brood Brother Auxilia, Xenocreed Congregation (3 detachments × 4 enhancements = 12)

**Symptom:** These three GSC-codex detachments AND their enhancement groups are defined in `data/bsdata/Library - Tyranids.cat` (despite being GSC-specific, not Tyranids). The main `Genestealer Cults.cat` only references them via entry links.

**Why the current parser misses them:**
- The detachments `Biosanctic Broodsurge Enhancements` etc. are detachment-named enhancement sub-groups (Strategy 1 should work) — but they live in the imported library, not the primary catalog.
- Same root cause as Gap 2 (cross-catalog resolution).
- The current GSC fix migration (`20260406192539_fix_gsc_detachments_and_sync.sql`) was a manual workaround that inserted the 3 detachments by hand, but didn't add their enhancements.

**Proposed fix:** Same as Gap 2. Walking imported catalogs' shared groups would resolve both gaps in one shot.

**Note:** The parser also has a separate problem where it inherits the *Tyranids* detachments (Invasion Fleet, Crusher Stampede, etc.) into GSC. The GSC fix migration deletes them, but the parser should be improved to filter them out by `notInstanceOf primary-catalogue` modifiers (which it already handles for chapter detachments — same code path could apply here).

---

### Gap 4: Genuinely Missing in BSData

**Faction:** Agents of the Imperium
**Detachment:** Veiled Blade Elimination Force (0 enhancements)

**Status:** Not a parser bug. The BSData catalog has no enhancements defined for this detachment. Either the codex hasn't shipped them yet or BSData hasn't been updated.

**Action:** None needed. Track upstream BSData updates and re-parse when the data lands.

---

## Implementation Order

If you tackle these in the future, suggested order:

1. **Gap 2 + Gap 3 together** (cross-catalog resolution) — single fix unlocks both Imperial Knights and GSC. Highest leverage.
2. **Gap 1** (inline enhancements) — Necrons-only edge case. Requires care to avoid double-counting.
3. **Gap 4** — wait for upstream BSData updates.

After fixing Gaps 1-3, re-run:
```bash
node scripts/parse-bsdata.js
node scripts/generate-enhancement-sync.js
```
And generate a follow-up sync migration for any newly-extracted enhancements.

## Validation

After parser changes, verify with:
```bash
# Check no detachments have 0 enhancements (excluding Unaligned Forces and Veiled Blade)
node -e "/* see end-of-session validation snippet */"
```

The current count is 850 enhancements across 207 detachments. A complete parser fix should bring this to ~870+ enhancements across ~210 detachments.
