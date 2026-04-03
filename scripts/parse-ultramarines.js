/**
 * One-shot script to parse the Ultramarines BSData catalog
 * and generate an additive SQL migration (does not truncate existing data).
 *
 * Usage: node scripts/parse-ultramarines.js
 */

// Re-use the full parser by requiring it as a module — but since it's a script,
// we'll duplicate the needed functions. Instead, let's just run the core parser
// logic inline.

const { XMLParser } = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data', 'bsdata');
const OUT_DIR = path.join(__dirname, '..', 'supabase', 'migrations');

// Load the main parse-bsdata.js source and eval the functions we need
// Instead, let's just call the main script with a modification...
// Actually, the cleanest approach: copy the parser functions and generate SQL.

// We'll load the main module by extracting what we need.
// Since parse-bsdata.js runs immediately, we need to extract functions manually.
// Let's just require it as a string and eval the function definitions.

// Simpler approach: modify the catalogs list and generate only Ultramarines
// by temporarily hijacking the main script. But that would regenerate everything.

// Best approach: use child_process to run a modified version.
// Actually simplest: just add Ultramarines to the CATALOGS and re-run,
// but only output the Ultramarines portion.

// Let's take the practical approach - copy the essential functions from parse-bsdata.js

function uuidFromSeed(seed) {
  const hash = crypto.createHash('md5').update(seed).digest('hex');
  return [hash.slice(0, 8), hash.slice(8, 12), hash.slice(12, 16), hash.slice(16, 20), hash.slice(20, 32)].join('-');
}

function esc(str) {
  if (str == null) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

// We need the full parser. Let's read parse-bsdata.js, strip the MAIN section,
// and eval just the functions.
const mainScript = fs.readFileSync(path.join(__dirname, 'parse-bsdata.js'), 'utf8');

// Extract everything up to "// MAIN" marker
const mainMarker = '// ============================================================\n// MAIN\n// ============================================================';
const functionsOnly = mainScript.split(mainMarker)[0];

// Eval the functions into this scope
// We need to provide the dependencies
const evalScript = functionsOnly
  .replace(/^const \{ XMLParser \}.*$/m, '') // already imported
  .replace(/^const fs = .*$/m, '')
  .replace(/^const path = .*$/m, '')
  .replace(/^const crypto = .*$/m, '')
  .replace(/^const DATA_DIR = .*$/m, '')
  .replace(/^const OUT_DIR = .*$/m, '');

eval(evalScript);

// Now all parser functions are available: parseCatalog, generateSQL, etc.

const factionName = 'Ultramarines';
const factionId = uuidFromSeed(`faction:${factionName}`);
const alignment = 'imperium';
const catFile = 'Imperium - Ultramarines.cat';

console.log(`Parsing: ${factionName} from ${catFile}...`);

const filePath = path.join(DATA_DIR, catFile);
if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const faction = parseCatalog(filePath);
if (!faction) {
  console.error('Failed to parse catalog');
  process.exit(1);
}

// Assign clean IDs
for (const unit of faction.units) {
  unit.id = uuidFromSeed(`unit:${factionName}:${unit.name}`);
}

console.log(`  -> ${faction.units.length} units, ${faction.detachments.length} detachments`);
console.log(`  Units: ${faction.units.map(u => u.name).join(', ')}`);

// If no detachments, add a default
if (faction.detachments.length === 0) {
  faction.detachments.push({
    name: 'Index',
    ruleText: 'Default detachment using index rules.',
    enhancements: [],
  });
}

// Re-extract leader targets using all unit names
// BUT: Ultramarines leaders (like Marneus Calgar) can lead Space Marines parent units
// The leader target descriptions reference units like "Aggressor Squad" which are in the
// Space Marines faction, not Ultramarines. We need to handle cross-faction leader targets.
const allUMNames = faction.units.map(u => u.name);

// Also need Space Marines unit names for cross-faction leader resolution
const smCatPath = path.join(DATA_DIR, 'Imperium - Space Marines.cat');
let smUnitNames = [];
if (fs.existsSync(smCatPath)) {
  const smFaction = parseCatalog(smCatPath);
  if (smFaction) {
    smUnitNames = smFaction.units.map(u => u.name);
  }
}

const combinedNames = [...allUMNames, ...smUnitNames];
const leaderTargets = [];
const seenLT = new Set();

for (const unit of faction.units) {
  const targets = extractLeaderTargets(unit, combinedNames);
  for (const targetName of targets) {
    const key = `${unit.name}:${targetName}`;
    if (!seenLT.has(key)) {
      seenLT.add(key);
      leaderTargets.push({ leader_unit_name: unit.name, target_unit_name: targetName });
    }
  }
}

console.log(`  -> ${leaderTargets.length} leader targets`);

// Generate SQL — but we need to fix the leader target ID generation
// For cross-faction targets (SM units), the target_unit_id should reference
// the Space Marines faction seed: uuidFromSeed(`unit:Space Marines:${name}`)
const sql = generateSQL({
  factionName,
  factionId,
  alignment,
  detachments: faction.detachments,
  units: faction.units,
  leaderTargets,
});

// Fix leader target UUIDs: if the target unit is NOT in Ultramarines,
// it must be in Space Marines
let fixedSql = sql;
for (const lt of leaderTargets) {
  if (!allUMNames.includes(lt.target_unit_name) && smUnitNames.includes(lt.target_unit_name)) {
    const wrongId = uuidFromSeed(`unit:${factionName}:${lt.target_unit_name}`);
    const correctId = uuidFromSeed(`unit:Space Marines:${lt.target_unit_name}`);
    fixedSql = fixedSql.replace(new RegExp(wrongId.replace(/[-]/g, '\\-'), 'g'), correctId);
  }
  // Same for leader units that might be in SM
  if (!allUMNames.includes(lt.leader_unit_name) && smUnitNames.includes(lt.leader_unit_name)) {
    const wrongId = uuidFromSeed(`unit:${factionName}:${lt.leader_unit_name}`);
    const correctId = uuidFromSeed(`unit:Space Marines:${lt.leader_unit_name}`);
    fixedSql = fixedSql.replace(new RegExp(wrongId.replace(/[-]/g, '\\-'), 'g'), correctId);
  }
}

// Write additive migration
const migrationFile = '20250220000240_seed_ultramarines.sql';
const header = `-- ============================================================
-- Ultramarines faction seed data
-- Auto-generated from BSData/wh40k-10e: ${catFile}
-- ${faction.units.length} units, ${faction.detachments.length} detachments
-- Generated: ${new Date().toISOString()}
-- ============================================================

`;

fs.writeFileSync(path.join(OUT_DIR, migrationFile), header + fixedSql);
console.log(`\nWrote ${migrationFile}: ${faction.units.length} units`);
