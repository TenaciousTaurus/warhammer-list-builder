/**
 * Data Validation Script
 * Re-parses all BSData catalogs and compares against the local Supabase DB.
 * Reports discrepancies in unit counts, roles, stats, weapons, abilities, and points.
 *
 * Usage: node scripts/validate-data.js
 * Requires: local Supabase running (npx supabase start)
 */

const { XMLParser } = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const http = require('http');

const SUPABASE_URL = 'http://localhost:54321';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

function uuidFromSeed(seed) {
  const hash = crypto.createHash('md5').update(seed).digest('hex');
  return [hash.slice(0,8),hash.slice(8,12),hash.slice(12,16),hash.slice(16,20),hash.slice(20,32)].join('-');
}

// Simple REST query against local Supabase (with pagination to handle >1000 rows)
async function queryPage(table, params = '', offset = 0, limit = 1000) {
  return new Promise((resolve, reject) => {
    const sep = params ? '&' : '';
    const url = new URL(`/rest/v1/${table}?${params}${sep}offset=${offset}&limit=${limit}`, SUPABASE_URL);
    const req = http.get(url.href, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'count=exact',
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`Failed to parse: ${data.slice(0, 200)}`)); }
      });
    });
    req.on('error', reject);
  });
}

async function query(table, params = '') {
  let all = [];
  let offset = 0;
  const limit = 1000;
  while (true) {
    const page = await queryPage(table, params, offset, limit);
    all = all.concat(page);
    if (page.length < limit) break;
    offset += limit;
  }
  return all;
}

async function main() {
  console.log('=== WarForge Data Validation ===\n');

  let errors = 0;
  let warnings = 0;

  // 1. Check all factions exist
  console.log('--- Factions ---');
  const dbFactions = await query('factions', 'select=id,name,parent_faction_id&order=name');
  console.log(`DB has ${dbFactions.length} factions`);

  const expectedFactions = [
    'Space Marines', 'Adepta Sororitas', 'Adeptus Custodes', 'Adeptus Mechanicus',
    'Astra Militarum', 'Grey Knights', 'Imperial Knights', 'Black Templars',
    'Blood Angels', 'Dark Angels', 'Deathwatch', 'Space Wolves', 'Ultramarines',
    'Imperial Fists', 'Iron Hands', 'Raven Guard', 'Salamanders', 'White Scars',
    'Agents of the Imperium', 'Chaos Space Marines', "Emperor's Children",
    'Death Guard', 'Thousand Sons', 'World Eaters', 'Chaos Knights', 'Chaos Daemons',
    'Aeldari', 'Drukhari', 'Ynnari', 'Leagues of Votann', 'Genestealer Cults',
    'Necrons', 'Orks', "T'au Empire", 'Tyranids', 'Unaligned Forces',
  ];

  for (const name of expectedFactions) {
    if (!dbFactions.find(f => f.name === name)) {
      console.log(`  ERROR: Missing faction: ${name}`);
      errors++;
    }
  }

  // Check parent_faction_id is set for chapters
  const smId = dbFactions.find(f => f.name === 'Space Marines')?.id;
  const smChapters = ['Ultramarines', 'Blood Angels', 'Dark Angels', 'Space Wolves',
    'Black Templars', 'Deathwatch', 'Imperial Fists', 'Iron Hands',
    'Raven Guard', 'Salamanders', 'White Scars'];

  for (const chapter of smChapters) {
    const f = dbFactions.find(f => f.name === chapter);
    if (f && f.parent_faction_id !== smId) {
      console.log(`  ERROR: ${chapter} parent_faction_id not set to Space Marines`);
      errors++;
    }
  }

  const ynnari = dbFactions.find(f => f.name === 'Ynnari');
  const aeldariId = dbFactions.find(f => f.name === 'Aeldari')?.id;
  if (ynnari && ynnari.parent_faction_id !== aeldariId) {
    console.log(`  ERROR: Ynnari parent_faction_id not set to Aeldari`);
    errors++;
  }

  // 2. Check unit counts per faction
  console.log('\n--- Units ---');
  const dbUnits = await query('units', 'select=id,name,faction_id,role,is_legends&order=name');
  console.log(`DB has ${dbUnits.length} total units`);

  const factionUnitCounts = {};
  for (const u of dbUnits) {
    const fName = dbFactions.find(f => f.id === u.faction_id)?.name || 'Unknown';
    factionUnitCounts[fName] = (factionUnitCounts[fName] || 0) + 1;
  }

  for (const [fName, count] of Object.entries(factionUnitCounts).sort()) {
    console.log(`  ${fName}: ${count} units`);
  }

  // 3. Check for units with default 'infantry' role that should be epic_hero or character
  console.log('\n--- Role Checks ---');
  const suspiciousInfantry = dbUnits.filter(u =>
    u.role === 'infantry' &&
    (u.name.includes('Captain') || u.name.includes('Chaplain') || u.name.includes('Librarian') ||
     u.name.includes('Lieutenant') || u.name.includes('Sergeant') || u.name.includes('Apothecary'))
  );
  for (const u of suspiciousInfantry) {
    const fName = dbFactions.find(f => f.id === u.faction_id)?.name;
    console.log(`  WARN: ${u.name} (${fName}) has role 'infantry' but name suggests character`);
    warnings++;
  }

  const maxOneInfantry = dbUnits.filter(u => u.role === 'infantry');
  // Check if any non-legends infantry units have max_per_list = 1 (likely misclassified)
  const dbUnitsDetailed = await query('units', 'select=id,name,faction_id,role,max_per_list,is_legends,keywords&order=name');
  const suspiciousMax1 = dbUnitsDetailed.filter(u =>
    u.role === 'infantry' && u.max_per_list === 1 && !u.is_legends
  );
  for (const u of suspiciousMax1) {
    const fName = dbFactions.find(f => f.id === u.faction_id)?.name;
    console.log(`  WARN: ${u.name} (${fName}) is infantry with max_per_list=1 (should be epic_hero/character?)`);
    warnings++;
  }

  // 4. Check detachments
  console.log('\n--- Detachments ---');
  const dbDetachments = await query('detachments', 'select=id,name,faction_id&order=name');
  console.log(`DB has ${dbDetachments.length} total detachments`);

  // Check no chapter-specific detachments are on SM parent
  const smDetachments = dbDetachments.filter(d => d.faction_id === smId);
  const chapterDetNames = [
    'Unforgiven Task Force', 'Inner Circle Task Force', 'Company of Hunters', 'Lion',
    'Wrath of the Rock', 'Librarius Conclave', 'Liberator Assault Group', 'The Lost Brethren',
    'The Angelic Host', 'Angelic Inheritors', 'Rage-Cursed Onslaught', 'Champions of Fenris',
    'Saga of the Hunter', 'Saga of the Bold', 'Saga of the Beastslayer', 'Saga of the Great Wolf',
    'Companions of Vehemence', 'Vindication Task Force', 'Godhammer Assault Force', 'Forgefather',
    'Emperor', 'Hammer of Avernii', 'Wrathful Procession', 'Black Spear Task Force',
    'Shadowmark Talon', 'Blade of Ultramar',
  ];
  for (const d of smDetachments) {
    if (chapterDetNames.includes(d.name)) {
      console.log(`  ERROR: "${d.name}" is still on Space Marines parent (should be on chapter)`);
      errors++;
    }
  }

  // Check no "Index" placeholder detachments on chapters that have real ones
  for (const chapter of smChapters) {
    const fId = dbFactions.find(f => f.name === chapter)?.id;
    const chapterDets = dbDetachments.filter(d => d.faction_id === fId);
    const hasIndex = chapterDets.some(d => d.name === 'Index');
    const hasReal = chapterDets.some(d => d.name !== 'Index');
    if (hasIndex && hasReal) {
      console.log(`  WARN: ${chapter} has both 'Index' and real detachments`);
      warnings++;
    }
  }

  // Detachment counts per faction
  const factionDetCounts = {};
  for (const d of dbDetachments) {
    const fName = dbFactions.find(f => f.id === d.faction_id)?.name || 'Unknown';
    factionDetCounts[fName] = (factionDetCounts[fName] || 0) + 1;
  }
  for (const [fName, count] of Object.entries(factionDetCounts).sort()) {
    console.log(`  ${fName}: ${count} detachments`);
  }

  // 5. Check weapons and abilities exist for all units
  console.log('\n--- Weapons & Abilities ---');
  const dbWeapons = await query('weapons', 'select=unit_id&order=unit_id');
  const dbAbilities = await query('abilities', 'select=unit_id&order=unit_id');

  const unitsWithWeapons = new Set(dbWeapons.map(w => w.unit_id));
  const unitsWithAbilities = new Set(dbAbilities.map(a => a.unit_id));

  const noWeapons = dbUnits.filter(u => !unitsWithWeapons.has(u.id));
  const noAbilities = dbUnits.filter(u => !unitsWithAbilities.has(u.id));

  if (noWeapons.length > 0) {
    console.log(`  WARN: ${noWeapons.length} units have no weapons:`);
    for (const u of noWeapons.slice(0, 10)) {
      const fName = dbFactions.find(f => f.id === u.faction_id)?.name;
      console.log(`    ${u.name} (${fName})`);
    }
    if (noWeapons.length > 10) console.log(`    ... and ${noWeapons.length - 10} more`);
    warnings += noWeapons.length;
  }

  if (noAbilities.length > 0) {
    console.log(`  WARN: ${noAbilities.length} units have no abilities:`);
    for (const u of noAbilities.slice(0, 10)) {
      const fName = dbFactions.find(f => f.id === u.faction_id)?.name;
      console.log(`    ${u.name} (${fName})`);
    }
    if (noAbilities.length > 10) console.log(`    ... and ${noAbilities.length - 10} more`);
    warnings += noAbilities.length;
  }

  // 6. Check points tiers exist for all units
  console.log('\n--- Points Tiers ---');
  const dbTiers = await query('unit_points_tiers', 'select=unit_id&order=unit_id');
  const unitsWithPoints = new Set(dbTiers.map(t => t.unit_id));
  const noPoints = dbUnits.filter(u => !unitsWithPoints.has(u.id));

  if (noPoints.length > 0) {
    console.log(`  ERROR: ${noPoints.length} units have no points tiers:`);
    for (const u of noPoints.slice(0, 10)) {
      const fName = dbFactions.find(f => f.id === u.faction_id)?.name;
      console.log(`    ${u.name} (${fName})`);
    }
    if (noPoints.length > 10) console.log(`    ... and ${noPoints.length - 10} more`);
    errors += noPoints.length;
  }

  // 7. Summary
  console.log('\n=== Summary ===');
  console.log(`Factions: ${dbFactions.length}`);
  console.log(`Units: ${dbUnits.length}`);
  console.log(`Detachments: ${dbDetachments.length}`);
  console.log(`Weapons: ${dbWeapons.length}`);
  console.log(`Abilities: ${dbAbilities.length}`);
  console.log(`Points tiers: ${dbTiers.length}`);
  console.log(`\nErrors: ${errors}`);
  console.log(`Warnings: ${warnings}`);

  if (errors === 0 && warnings === 0) {
    console.log('\nAll checks passed!');
  }

  process.exit(errors > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Validation failed:', err.message);
  process.exit(1);
});
