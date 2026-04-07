/**
 * Generate a sync migration for enhancements that exist in the new seed file
 * but are missing from production.
 *
 * Strategy:
 * 1. Parse the freshly-generated seed file (20250220000160_seed_all_factions.sql)
 *    to extract all enhancements grouped by (faction_name, detachment_name).
 * 2. Read the production enhancements list from /tmp/prod_enhancements.csv
 *    (generated via: supabase db query --linked --output csv).
 * 3. Compute the diff — enhancements in seed but not in production.
 * 4. Emit a migration that inserts each missing enhancement, looking up the
 *    detachment_id by (faction_name, detachment_name) at runtime to avoid
 *    ID mismatch issues.
 *
 * The migration uses ON CONFLICT (id) DO UPDATE so it's idempotent.
 */

const fs = require('fs');
const path = require('path');

const SEED_FILE = path.join(__dirname, '..', 'supabase', 'migrations', '20250220000160_seed_all_factions.sql');
const PROD_CSV = path.join(__dirname, '.prod_enhancements.csv');
const PROD_DET_CSV = path.join(__dirname, '.prod_detachments.csv');
const OUT_FILE = path.join(__dirname, '..', 'supabase', 'migrations', '20260406210000_sync_missing_enhancements.sql');

function unescapeSql(s) {
  return s.replace(/''/g, "'");
}

function escSql(s) {
  if (s == null) return 'NULL';
  return "'" + String(s).replace(/'/g, "''") + "'";
}

// 1. Parse seed file
const content = fs.readFileSync(SEED_FILE, 'utf8');

const factionNames = new Map(); // factionId -> name
const detInfo = new Map();      // detId -> {factionId, name}

const factionRegex = /INSERT INTO public\.factions \(id, name, alignment\) VALUES\n\s*\('([^']+)',\s*'((?:[^']|'')+)'/g;
let m;
while ((m = factionRegex.exec(content)) !== null) {
  factionNames.set(m[1], unescapeSql(m[2]));
}

const detRegex = /INSERT INTO public\.detachments \(id, faction_id, name, rule_text\) VALUES\n\s*\('([^']+)',\s*'([^']+)',\s*'((?:[^']|'')+)'/g;
while ((m = detRegex.exec(content)) !== null) {
  detInfo.set(m[1], { factionId: m[2], name: unescapeSql(m[3]) });
}

const enhRegex = /INSERT INTO public\.enhancements \(id, detachment_id, name, points, description\) VALUES\n\s*\('([^']+)',\s*'([^']+)',\s*'((?:[^']|'')+)',\s*(\d+),\s*'((?:[^']|''|[^'])*?)'\);/g;
const seedEnhancements = [];
while ((m = enhRegex.exec(content)) !== null) {
  const det = detInfo.get(m[2]);
  if (!det) continue;
  const fname = factionNames.get(det.factionId);
  if (!fname) continue;
  seedEnhancements.push({
    id: m[1],
    factionName: fname,
    detName: det.name,
    name: unescapeSql(m[3]),
    points: parseInt(m[4]),
    description: m[5], // keep raw — already SQL-escaped
  });
}

console.log(`Parsed ${seedEnhancements.length} enhancements from seed file`);

// 2. Read production CSV (faction_name,det_name,enh_name)
// The supabase CLI prepends an "Initialising login role..." line, so we
// find the actual header row and start from there.
const prodCsv = fs.readFileSync(PROD_CSV, 'utf8');
const allLines = prodCsv.trim().split('\n');
const headerIdx = allLines.findIndex(l => l.startsWith('faction_name,'));
if (headerIdx === -1) throw new Error('Could not find CSV header in ' + PROD_CSV);
const prodLines = allLines.slice(headerIdx + 1);

// CSV parser that handles quoted fields with embedded commas
function parseCsvLine(line) {
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { cur += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { fields.push(cur); cur = ''; }
      else { cur += ch; }
    }
  }
  fields.push(cur);
  return fields;
}

const prodSet = new Set(); // "faction|det|enh"
for (const line of prodLines) {
  const [fname, dname, ename] = parseCsvLine(line);
  prodSet.add(`${fname}|${dname}|${ename}`);
}
console.log(`Production has ${prodSet.size} enhancements`);

// 2b. Read production detachments — only sync enhancements whose detachment exists
const prodDetCsv = fs.readFileSync(PROD_DET_CSV, 'utf8');
const detLines = prodDetCsv.trim().split('\n');
const detHeaderIdx = detLines.findIndex(l => l.startsWith('faction,'));
const prodDetSet = new Set();
for (const line of detLines.slice(detHeaderIdx + 1)) {
  const [fname, dname] = parseCsvLine(line);
  prodDetSet.add(`${fname}|${dname}`);
}
console.log(`Production has ${prodDetSet.size} detachments`);

// 3. Compute diff — missing enhancements whose detachment exists in production
const missing = seedEnhancements.filter(e => {
  const enhKey = `${e.factionName}|${e.detName}|${e.name}`;
  const detKey = `${e.factionName}|${e.detName}`;
  return !prodSet.has(enhKey) && prodDetSet.has(detKey);
});
const skipped = seedEnhancements.filter(e => {
  const enhKey = `${e.factionName}|${e.detName}|${e.name}`;
  const detKey = `${e.factionName}|${e.detName}`;
  return !prodSet.has(enhKey) && !prodDetSet.has(detKey);
});
console.log(`Missing in production: ${missing.length}`);
console.log(`Skipped (detachment not in production): ${skipped.length}`);

// 4. Emit migration
const lines = [];
lines.push('-- Sync missing enhancements to production');
lines.push('-- Generated by scripts/generate-enhancement-sync.js');
lines.push('--');
lines.push('-- These enhancements exist in the seed file but were missing from production');
lines.push('-- due to BSData parser gaps (now fixed) and detachment ID mismatches');
lines.push('-- (where the seed used different detachment UUIDs than what production has).');
lines.push('--');
lines.push('-- Each insert looks up the detachment_id by (faction_name, detachment_name)');
lines.push('-- at runtime, so it works regardless of which UUID production has stored.');
lines.push('');

// Group by faction+detachment for readability
const grouped = new Map();
for (const e of missing) {
  const key = `${e.factionName}::${e.detName}`;
  if (!grouped.has(key)) grouped.set(key, []);
  grouped.get(key).push(e);
}

for (const [key, enhs] of grouped) {
  const [fname, dname] = key.split('::');
  lines.push(`-- ${fname} :: ${dname} (${enhs.length} enhancements)`);
  for (const e of enhs) {
    lines.push(`INSERT INTO public.enhancements (id, detachment_id, name, points, description)`);
    lines.push(`SELECT ${escSql(e.id)},`);
    lines.push(`       d.id,`);
    lines.push(`       ${escSql(e.name)},`);
    lines.push(`       ${e.points},`);
    lines.push(`       '${e.description}'`);
    lines.push(`FROM public.detachments d`);
    lines.push(`JOIN public.factions f ON d.faction_id = f.id`);
    lines.push(`WHERE f.name = ${escSql(fname)} AND d.name = ${escSql(dname)}`);
    lines.push(`ON CONFLICT (id) DO UPDATE SET`);
    lines.push(`  detachment_id = EXCLUDED.detachment_id,`);
    lines.push(`  name = EXCLUDED.name,`);
    lines.push(`  points = EXCLUDED.points,`);
    lines.push(`  description = EXCLUDED.description;`);
    lines.push('');
  }
}

fs.writeFileSync(OUT_FILE, lines.join('\n'));
console.log(`Wrote ${OUT_FILE}`);
console.log(`${missing.length} INSERT statements across ${grouped.size} detachments`);
