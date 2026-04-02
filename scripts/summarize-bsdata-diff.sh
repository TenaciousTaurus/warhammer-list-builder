#!/usr/bin/env bash
# summarize-bsdata-diff.sh
# Generates a Markdown PR body summarizing changes in the BSData seed migration.
# Expects to be run from the repo root with uncommitted changes in the migration file.

set -euo pipefail

MIGRATION="supabase/migrations/20250220000160_seed_all_factions.sql"

# --- Header counts from old and new versions ---

OLD_HEADER=$(git show HEAD:"$MIGRATION" 2>/dev/null | head -4 || echo "")
NEW_HEADER=$(head -4 "$MIGRATION")

extract_counts() {
  # Extracts "N factions, M total units" from the header comment
  echo "$1" | grep -oP '\d+ factions' | grep -oP '\d+' || echo "?"
}
extract_units() {
  echo "$1" | grep -oP '\d+ total units' | grep -oP '\d+' || echo "?"
}

OLD_FACTIONS=$(extract_counts "$OLD_HEADER")
NEW_FACTIONS=$(extract_counts "$NEW_HEADER")
OLD_UNITS=$(extract_units "$OLD_HEADER")
NEW_UNITS=$(extract_units "$NEW_HEADER")

# --- Diff stats ---

DIFF_STAT=$(git diff --stat -- "$MIGRATION" | tail -1 || echo "no changes")

# --- Extract new and removed units ---
# Unit INSERT lines look like: INSERT INTO public.units ... VALUES ('uuid', 'faction_id', 'Unit Name', ...
# We diff the unit INSERT lines to find additions and removals.

git show HEAD:"$MIGRATION" 2>/dev/null \
  | grep "^INSERT INTO public\.units " \
  | sed "s/.*VALUES (//; s/).*//" \
  | sort > /tmp/old-units.txt || touch /tmp/old-units.txt

grep "^INSERT INTO public\.units " "$MIGRATION" \
  | sed "s/.*VALUES (//; s/).*//" \
  | sort > /tmp/new-units.txt

# Extract unit ID (field 1) and name (field 3) — fields are comma-separated, values are quoted
extract_unit_names() {
  # Input: sorted VALUES lines. Output: "id|name" pairs
  awk -F", " '{ gsub(/'\''/, "", $1); gsub(/'\''/, "", $3); print $1 "|" $3 }' "$1"
}

extract_unit_names /tmp/old-units.txt > /tmp/old-unit-ids.txt
extract_unit_names /tmp/new-units.txt > /tmp/new-unit-ids.txt

# New units: IDs in new but not in old
NEW_UNIT_NAMES=$(comm -13 <(cut -d'|' -f1 /tmp/old-unit-ids.txt) <(cut -d'|' -f1 /tmp/new-unit-ids.txt) \
  | while read -r id; do grep "^${id}|" /tmp/new-unit-ids.txt | cut -d'|' -f2; done)

# Removed units: IDs in old but not in new
REMOVED_UNIT_NAMES=$(comm -23 <(cut -d'|' -f1 /tmp/old-unit-ids.txt) <(cut -d'|' -f1 /tmp/new-unit-ids.txt) \
  | while read -r id; do grep "^${id}|" /tmp/old-unit-ids.txt | cut -d'|' -f2; done)

# --- Extract points changes ---
# Points tier lines: INSERT INTO public.unit_points_tiers ... VALUES ('uuid', 'unit_id', model_count, points)

git show HEAD:"$MIGRATION" 2>/dev/null \
  | grep "^INSERT INTO public\.unit_points_tiers " \
  | sed "s/.*VALUES (//; s/).*//" \
  | sort > /tmp/old-points.txt || touch /tmp/old-points.txt

grep "^INSERT INTO public\.unit_points_tiers " "$MIGRATION" \
  | sed "s/.*VALUES (//; s/).*//" \
  | sort > /tmp/new-points.txt

# Build "unit_id|model_count|points" for comparison
extract_points() {
  awk -F", " '{ gsub(/'\''/, "", $2); print $2 "|" $3 "|" $4 }' "$1"
}

extract_points /tmp/old-points.txt | sort > /tmp/old-pts-flat.txt
extract_points /tmp/new-points.txt | sort > /tmp/new-pts-flat.txt

# Find changed lines (same unit_id|model_count but different points)
POINTS_CHANGES=""
POINTS_COUNT=0
MAX_POINTS_DISPLAY=30

while IFS='|' read -r uid mc old_pts; do
  new_line=$(grep "^${uid}|${mc}|" /tmp/new-pts-flat.txt 2>/dev/null || true)
  if [ -n "$new_line" ]; then
    new_pts=$(echo "$new_line" | cut -d'|' -f3)
    if [ "$old_pts" != "$new_pts" ]; then
      # Resolve unit name
      unit_name=$(grep "^${uid}|" /tmp/new-unit-ids.txt 2>/dev/null | head -1 | cut -d'|' -f2 || echo "Unknown")
      POINTS_COUNT=$((POINTS_COUNT + 1))
      if [ "$POINTS_COUNT" -le "$MAX_POINTS_DISPLAY" ]; then
        POINTS_CHANGES="${POINTS_CHANGES}| ${unit_name} (${mc}) | ${old_pts} | ${new_pts} |
"
      fi
    fi
  fi
done < /tmp/old-pts-flat.txt

# --- Output Markdown ---

cat <<EOF
## BSData Auto-Update

Updated game data from [BSData/wh40k-10e](https://github.com/BSData/wh40k-10e).

### Summary
- **Factions:** ${OLD_FACTIONS} -> ${NEW_FACTIONS}
- **Total units:** ${OLD_UNITS} -> ${NEW_UNITS}
- **Migration diff:** ${DIFF_STAT}
EOF

# New units section
NEW_COUNT=$(echo "$NEW_UNIT_NAMES" | grep -c . 2>/dev/null || echo 0)
if [ "$NEW_COUNT" -gt 0 ]; then
  echo ""
  echo "### New Units ($NEW_COUNT)"
  echo "$NEW_UNIT_NAMES" | head -30 | while read -r name; do
    echo "- $name"
  done
  if [ "$NEW_COUNT" -gt 30 ]; then
    echo "- ...and $((NEW_COUNT - 30)) more"
  fi
fi

# Removed units section
REMOVED_COUNT=$(echo "$REMOVED_UNIT_NAMES" | grep -c . 2>/dev/null || echo 0)
if [ "$REMOVED_COUNT" -gt 0 ]; then
  echo ""
  echo "### Removed Units ($REMOVED_COUNT)"
  echo "$REMOVED_UNIT_NAMES" | head -30 | while read -r name; do
    echo "- $name"
  done
  if [ "$REMOVED_COUNT" -gt 30 ]; then
    echo "- ...and $((REMOVED_COUNT - 30)) more"
  fi
fi

# Points changes section
if [ "$POINTS_COUNT" -gt 0 ]; then
  echo ""
  echo "### Points Changes ($POINTS_COUNT)"
  echo "| Unit | Old | New |"
  echo "|------|-----|-----|"
  echo -n "$POINTS_CHANGES"
  if [ "$POINTS_COUNT" -gt "$MAX_POINTS_DISPLAY" ]; then
    echo "| ...and $((POINTS_COUNT - MAX_POINTS_DISPLAY)) more | | |"
  fi
fi

cat <<EOF

---

See [BSData/wh40k-10e recent commits](https://github.com/BSData/wh40k-10e/commits/main) for details.
EOF
