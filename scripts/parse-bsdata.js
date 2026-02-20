/**
 * BattleScribe Data Parser
 * Converts BSData/wh40k-10e .cat files into SQL migration files
 * for the Warhammer 40K Army List Builder.
 */

const { XMLParser } = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data', 'bsdata');
const OUT_DIR = path.join(__dirname, '..', 'supabase', 'migrations');

// Deterministic UUID from a string seed (so re-runs produce same IDs)
function uuidFromSeed(seed) {
  const hash = crypto.createHash('md5').update(seed).digest('hex');
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    hash.slice(12, 16),
    hash.slice(16, 20),
    hash.slice(20, 32),
  ].join('-');
}

// Escape single quotes for SQL
function esc(str) {
  if (str == null) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

// Parse XML with attributes preserved
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  isArray: (name) => {
    // These elements can appear multiple times
    const arrays = [
      'selectionEntry', 'selectionEntryGroup', 'entryLink',
      'profile', 'characteristic', 'categoryLink',
      'cost', 'constraint', 'modifier', 'rule',
      'categoryEntry', 'infoLink',
    ];
    return arrays.includes(name);
  },
});

// Category IDs from the game system that map to our roles
const ROLE_CATEGORIES = {
  'Epic Hero': 'epic_hero',
  'Character': 'character',
  'Battleline': 'battleline',
  'Infantry': 'infantry',
  'Mounted': 'mounted',
  'Beast': 'beast',
  'Vehicle': 'vehicle',
  'Monster': 'monster',
  'Fortification': 'fortification',
  'Dedicated Transport': 'dedicated_transport',
  'Allied Units': 'allied',
};

// Priority order for role assignment (first match wins)
const ROLE_PRIORITY = [
  'epic_hero', 'character', 'battleline', 'dedicated_transport',
  'fortification', 'monster', 'vehicle', 'beast', 'mounted', 'infantry',
];

// Characteristic type IDs from the game system
const CHAR_IDS = {
  // Unit stats
  'e703-ecb6-5ce7-aec1': 'M',
  'd29d-cf75-fc2d-34a4': 'T',
  '450-a17e-9d5e-29da': 'SV',
  '750a-a2ec-90d3-21fe': 'W',
  '58d2-b879-49c7-43bc': 'LD',
  'bef7-942a-1a23-59f8': 'OC',
  // Ranged weapon stats
  '9896-9419-16a1-92fc': 'Range',
  '3bb-c35f-f54-fb08': 'A',
  '94d-8a98-cf90-183e': 'BS',
  '2229-f494-25db-c5d3': 'S',
  '9ead-8a10-520-de15': 'AP',
  'a354-c1c8-a745-f9e3': 'D',
  '7f1b-8591-2fcf-d01c': 'Keywords',
  // Melee weapon stats
  '914c-b413-91e3-a132': 'Range',
  '2337-daa1-6682-b110': 'A',
  '95d1-95f-45b4-11d6': 'WS',
  'ab33-d393-96ce-ccba': 'S',
  '41a0-1301-112a-e2f2': 'AP',
  '3254-9fe6-d824-513e': 'D',
  '893f-9000-ccf7-648e': 'Keywords',
  // Ability
  '9b8f-694b-e5e-b573': 'Description',
};

function ensureArray(val) {
  if (val == null) return [];
  return Array.isArray(val) ? val : [val];
}

function parseCharacteristics(profile) {
  const chars = {};
  for (const c of ensureArray(profile?.characteristics?.characteristic)) {
    const typeId = c['@_typeId'];
    const name = CHAR_IDS[typeId] || c['@_name'];
    chars[name] = c['#text'] ?? '';
  }
  return chars;
}

/**
 * Build a lookup map of all selectionEntry elements by ID in the catalog,
 * so we can resolve entryLink targetId references for shared weapons.
 */
function buildEntryIndex(root) {
  const index = new Map();

  function walk(node) {
    if (!node || typeof node !== 'object') return;

    // Index selectionEntry elements
    if (node['@_id'] && node['@_name']) {
      index.set(node['@_id'], node);
    }

    // Recurse into known container arrays
    for (const key of ['selectionEntry', 'selectionEntryGroup', 'sharedSelectionEntries', 'sharedSelectionEntryGroups']) {
      const container = node[key];
      if (container) {
        for (const child of ensureArray(container)) {
          walk(child);
        }
      }
    }
    // Also look inside selectionEntries/selectionEntryGroups wrapper objects
    if (node.selectionEntries) {
      for (const child of ensureArray(node.selectionEntries.selectionEntry)) {
        walk(child);
      }
    }
    if (node.selectionEntryGroups) {
      for (const child of ensureArray(node.selectionEntryGroups.selectionEntryGroup)) {
        walk(child);
      }
    }
  }

  walk(root);
  return index;
}

/**
 * Extract weapon profiles from a node and its children (recursive).
 * Resolves entryLink references to shared weapons.
 */
function extractWeapons(node, entryIndex, depth = 0) {
  if (depth > 6) return []; // prevent infinite recursion
  const weapons = [];

  // Direct profiles on this node
  for (const profile of ensureArray(node?.profiles?.profile)) {
    const typeName = profile['@_typeName'];
    if (typeName === 'Ranged Weapons' || typeName === 'Melee Weapons') {
      const chars = parseCharacteristics(profile);
      const wpnKeywords = (chars.Keywords || '')
        .split(',')
        .map(k => k.trim())
        .filter(k => k && k !== '-');

      weapons.push({
        name: profile['@_name'],
        type: typeName === 'Ranged Weapons' ? 'ranged' : 'melee',
        range: typeName === 'Ranged Weapons' ? (chars.Range || null) : null,
        attacks: chars.A || '1',
        skill: chars.BS || chars.WS || '4+',
        strength: parseInt(chars.S) || 4,
        ap: parseInt(chars.AP) || 0,
        damage: chars.D || '1',
        keywords: wpnKeywords,
      });
    }
  }

  // Recurse into child selectionEntries
  for (const child of ensureArray(node?.selectionEntries?.selectionEntry)) {
    weapons.push(...extractWeapons(child, entryIndex, depth + 1));
  }
  for (const child of ensureArray(node?.selectionEntryGroups?.selectionEntryGroup)) {
    weapons.push(...extractWeapons(child, entryIndex, depth + 1));
  }

  // Resolve entryLinks (references to shared weapons)
  for (const link of ensureArray(node?.entryLinks?.entryLink)) {
    const targetId = link['@_targetId'];
    const target = entryIndex.get(targetId);
    if (target) {
      weapons.push(...extractWeapons(target, entryIndex, depth + 1));
    }
    // Also check profiles directly on the link itself
    weapons.push(...extractWeapons(link, entryIndex, depth + 1));
  }

  return weapons;
}

/**
 * Extract abilities from a unit entry.
 */
function extractAbilities(node) {
  const abilities = [];

  for (const profile of ensureArray(node?.profiles?.profile)) {
    if (profile['@_typeName'] === 'Abilities') {
      const chars = parseCharacteristics(profile);
      const desc = chars.Description || '';
      const name = profile['@_name'];

      // Classify ability type
      let type = 'unique';
      const nameLower = name.toLowerCase();
      if (nameLower.includes('invulnerable') || nameLower.match(/\d\+\s*invuln/)) {
        type = 'invulnerable';
      } else if (['deep strike', 'deadly demise', 'feel no pain', 'firing deck',
        'leader', 'lone operative', 'scouts', 'stealth', 'infiltrators',
        'objective secured'].some(core => nameLower.includes(core.toLowerCase()))) {
        type = 'core';
      } else if (['oath of moment', 'waaagh!', 'power of the machine spirit',
        'power from pain', 'strands of fate', 'voice of the hive mind',
        'harbingers of dread', 'shadow in the warp'].some(f => nameLower.includes(f.toLowerCase()))) {
        type = 'faction';
      }

      abilities.push({ name, type, description: desc });
    }
  }

  // Check infoLinks for faction/core abilities referenced by name
  for (const link of ensureArray(node?.infoLinks?.infoLink)) {
    if (link['@_type'] === 'rule') {
      const name = link['@_name'];
      if (!name) continue;
      // Only add well-known faction abilities from infoLinks
      const nameLower = name.toLowerCase();
      if (['oath of moment', 'templar vows'].some(f => nameLower.includes(f.toLowerCase()))) {
        if (!abilities.some(a => a.name.toLowerCase() === nameLower)) {
          abilities.push({ name, type: 'faction', description: '' });
        }
      }
    }
  }

  return abilities;
}

/**
 * Extract unit stat line from the first Unit profile found in the entry.
 */
function extractStats(node) {
  // Check direct profiles
  for (const profile of ensureArray(node?.profiles?.profile)) {
    if (profile['@_typeName'] === 'Unit') {
      return parseCharacteristics(profile);
    }
  }

  // Check child model entries for stat profiles
  for (const child of ensureArray(node?.selectionEntries?.selectionEntry)) {
    const stats = extractStats(child);
    if (stats) return stats;
  }
  for (const group of ensureArray(node?.selectionEntryGroups?.selectionEntryGroup)) {
    for (const child of ensureArray(group?.selectionEntries?.selectionEntry)) {
      const stats = extractStats(child);
      if (stats) return stats;
    }
  }

  return null;
}

/**
 * Extract points cost and model count tiers from a unit entry.
 * BattleScribe uses a base cost + modifiers that change cost at different model counts.
 */
function extractPointsTiers(node) {
  const tiers = [];

  // Get base points
  let basePoints = 0;
  for (const cost of ensureArray(node?.costs?.cost)) {
    if (cost['@_name'] === 'pts') {
      basePoints = parseInt(cost['@_value']) || 0;
    }
  }

  // Get min/max model count from the unit's group constraints
  let minModels = 1;
  let maxModels = 1;

  for (const group of ensureArray(node?.selectionEntryGroups?.selectionEntryGroup)) {
    for (const constraint of ensureArray(group?.constraints?.constraint)) {
      if (constraint['@_type'] === 'min' && constraint['@_field'] === 'selections') {
        minModels = parseInt(constraint['@_value']) || 1;
      }
      if (constraint['@_type'] === 'max' && constraint['@_field'] === 'selections') {
        const val = parseInt(constraint['@_value']);
        if (val > 0) maxModels = val;
      }
    }
  }

  // Add base tier
  if (basePoints > 0) {
    tiers.push({ model_count: minModels || 1, points: basePoints });
  }

  // Check modifiers for additional tiers (points changes at different model counts)
  for (const mod of ensureArray(node?.modifiers?.modifier)) {
    if (mod['@_field'] === '51b2-306e-1021-d207') { // pts field ID
      const newPts = parseInt(mod['@_value']) || 0;
      // Find the condition that triggers this modifier
      for (const cond of ensureArray(mod?.conditions?.condition)) {
        if (cond['@_type'] === 'atLeast' && cond['@_field'] === 'selections') {
          const modelThreshold = parseInt(cond['@_value']) || 0;
          if (newPts > 0 && modelThreshold > 0) {
            tiers.push({ model_count: modelThreshold, points: newPts });
          }
        }
      }
    }
  }

  // If no tiers found but we have a base cost, add single tier
  if (tiers.length === 0 && basePoints > 0) {
    tiers.push({ model_count: 1, points: basePoints });
  }

  return tiers;
}

/**
 * Extract role from category links on a unit entry.
 */
function extractRole(node) {
  const roles = new Set();

  for (const link of ensureArray(node?.categoryLinks?.categoryLink)) {
    const catName = link['@_name'];
    if (catName && ROLE_CATEGORIES[catName]) {
      roles.add(ROLE_CATEGORIES[catName]);
    }
  }

  // Return highest priority role
  for (const role of ROLE_PRIORITY) {
    if (roles.has(role)) return role;
  }

  return 'infantry'; // default
}

/**
 * Extract keywords from category links.
 */
function extractKeywords(node) {
  const keywords = [];
  for (const link of ensureArray(node?.categoryLinks?.categoryLink)) {
    const name = link['@_name'];
    if (name && !name.startsWith('Faction:') && !name.startsWith('Configuration') &&
        !['Grenades'].includes(name)) {
      keywords.push(name);
    }
  }
  return keywords;
}

/**
 * Check if a unit is unique/named character.
 */
function isUniqueUnit(node) {
  const role = extractRole(node);
  if (role === 'epic_hero') return true;

  // Check for max 1 constraint at roster level
  for (const constraint of ensureArray(node?.constraints?.constraint)) {
    if (constraint['@_type'] === 'max' && constraint['@_value'] === '1' &&
        constraint['@_scope'] === 'roster' && constraint['@_field'] === 'selections') {
      return true;
    }
  }
  return false;
}

/**
 * Extract wargear options from a unit's "Wargear" selection entry group.
 * Returns an array of { group_name, name, is_default, points }.
 */
function extractWargearOptions(node, entryIndex) {
  const options = [];

  for (const group of ensureArray(node?.selectionEntryGroups?.selectionEntryGroup)) {
    if (group['@_name'] !== 'Wargear') continue;

    // Check for direct entries (simple wargear options)
    const directEntries = ensureArray(group?.selectionEntries?.selectionEntry)
      .filter(e => e['@_type'] === 'upgrade');

    if (directEntries.length > 0) {
      directEntries.forEach((e, idx) => {
        let pts = 0;
        for (const c of ensureArray(e?.costs?.cost)) {
          if (c['@_name'] === 'pts') pts = parseInt(c['@_value']) || 0;
        }
        options.push({
          group_name: 'Wargear',
          name: e['@_name'],
          is_default: idx === 0,
          points: pts,
        });
      });
    }

    // Check for direct links (shared wargear references)
    for (const link of ensureArray(group?.entryLinks?.entryLink)) {
      const linkName = link['@_name'];
      if (!linkName) continue;
      let pts = 0;
      for (const c of ensureArray(link?.costs?.cost)) {
        if (c['@_name'] === 'pts') pts = parseInt(c['@_value']) || 0;
      }
      options.push({
        group_name: 'Wargear',
        name: linkName,
        is_default: options.filter(o => o.group_name === 'Wargear').length === 0,
        points: pts,
      });
    }

    // Check for subgroups (e.g. "Weapon 1", "Weapon 2", "Sponson Weapons")
    for (const subgroup of ensureArray(group?.selectionEntryGroups?.selectionEntryGroup)) {
      const sgName = subgroup['@_name'] || 'Wargear';
      let sgIdx = 0;

      for (const e of ensureArray(subgroup?.selectionEntries?.selectionEntry)) {
        if (e['@_type'] !== 'upgrade') continue;
        let pts = 0;
        for (const c of ensureArray(e?.costs?.cost)) {
          if (c['@_name'] === 'pts') pts = parseInt(c['@_value']) || 0;
        }
        options.push({
          group_name: sgName,
          name: e['@_name'],
          is_default: sgIdx === 0,
          points: pts,
        });
        sgIdx++;
      }

      // Resolve links in subgroups
      for (const link of ensureArray(subgroup?.entryLinks?.entryLink)) {
        const linkName = link['@_name'];
        if (!linkName) continue;
        // Try to get name from target if link name is missing
        const targetName = linkName || (entryIndex.get(link['@_targetId']) || {})['@_name'];
        if (!targetName) continue;
        let pts = 0;
        for (const c of ensureArray(link?.costs?.cost)) {
          if (c['@_name'] === 'pts') pts = parseInt(c['@_value']) || 0;
        }
        options.push({
          group_name: sgName,
          name: targetName,
          is_default: options.filter(o => o.group_name === sgName).length === 0,
          points: pts,
        });
        sgIdx++;
      }
    }
  }

  return options;
}

/**
 * Extract detachments and their enhancements from the catalog.
 */
function extractDetachments(root, entryIndex) {
  const detachments = [];

  // Find the Detachment selection entry group (the one containing individual detachment choices)
  function findDetachmentGroup(node, depth = 0) {
    if (!node || depth > 5) return null;
    // A group/entry named "Detachment"/"Detachments" that has selectionEntries is the target
    const name = node['@_name'] || '';
    if ((name === 'Detachment' || name === 'Detachments') && node.selectionEntries) {
      return node;
    }
    // Recurse into child selectionEntryGroups
    for (const group of ensureArray(node?.selectionEntryGroups?.selectionEntryGroup)) {
      const found = findDetachmentGroup(group, depth + 1);
      if (found) return found;
    }
    // Follow entryLinks to resolve shared references
    for (const link of ensureArray(node?.entryLinks?.entryLink)) {
      const targetId = link['@_targetId'];
      const target = entryIndex.get(targetId);
      if (target) {
        const found = findDetachmentGroup(target, depth + 1);
        if (found) return found;
      }
    }
    return null;
  }

  // Find enhancement group
  function findEnhancementGroups(node) {
    const groups = [];
    if (!node) return groups;
    if (node['@_name'] === 'Enhancements') {
      for (const subGroup of ensureArray(node?.selectionEntryGroups?.selectionEntryGroup)) {
        groups.push(subGroup);
      }
      // Also check direct entries
      if (node.selectionEntries) {
        groups.push(node);
      }
      return groups;
    }
    for (const child of ensureArray(node?.selectionEntryGroups?.selectionEntryGroup)) {
      groups.push(...findEnhancementGroups(child));
    }
    return groups;
  }

  // Search shared groups for enhancement groups
  const sharedGroups = ensureArray(root?.sharedSelectionEntryGroups?.selectionEntryGroup);

  let detachmentGroup = null;
  let enhancementGroups = [];

  for (const group of sharedGroups) {
    if (!detachmentGroup) detachmentGroup = findDetachmentGroup(group);
    enhancementGroups.push(...findEnhancementGroups(group));
  }

  // Also search sharedSelectionEntries for the "Detachment" entry (common pattern)
  if (!detachmentGroup) {
    for (const entry of ensureArray(root?.sharedSelectionEntries?.selectionEntry)) {
      if (entry['@_name'] === 'Detachment' || entry['@_name'] === 'Detachments') {
        detachmentGroup = findDetachmentGroup(entry);
        break;
      }
    }
  }

  // Also search top-level selectionEntries (some catalogs put it there)
  if (!detachmentGroup) {
    for (const entry of ensureArray(root?.selectionEntries?.selectionEntry)) {
      if (entry['@_name'] === 'Detachment' || entry['@_name'] === 'Detachments') {
        detachmentGroup = findDetachmentGroup(entry);
        break;
      }
    }
  }

  if (!detachmentGroup) return detachments;

  // Parse each detachment
  for (const entry of ensureArray(detachmentGroup?.selectionEntries?.selectionEntry)) {
    const detName = entry['@_name'];
    if (!detName) continue;

    // Get detachment rule text
    let ruleText = '';
    for (const rule of ensureArray(entry?.rules?.rule)) {
      if (ruleText) ruleText += '\n\n';
      ruleText += `${rule['@_name']}: ${rule?.description || ''}`;
    }

    // Find matching enhancements
    const enhancements = [];
    const detNameLower = detName.toLowerCase();
    for (const enhGroup of enhancementGroups) {
      const groupName = (enhGroup['@_name'] || '').toLowerCase();
      const groupMatchesDet = groupName.includes(detNameLower) || detNameLower.includes(groupName.replace(' enhancements', ''));
      for (const enhEntry of ensureArray(enhGroup?.selectionEntries?.selectionEntry)) {
        // Match by group name (e.g. "Army of Faith Enhancements" matches "Army of Faith")
        // OR by enhancement comment field (e.g. <comment>Awakened Dynasty</comment>)
        const comment = (enhEntry.comment || '').toLowerCase();
        const commentMatchesDet = comment && comment === detNameLower;
        if (groupMatchesDet || commentMatchesDet) {
          let enhPoints = 0;
          for (const cost of ensureArray(enhEntry?.costs?.cost)) {
            if (cost['@_name'] === 'pts') enhPoints = parseInt(cost['@_value']) || 0;
          }
          let enhDesc = '';
          for (const profile of ensureArray(enhEntry?.profiles?.profile)) {
            if (profile['@_typeName'] === 'Abilities') {
              const chars = parseCharacteristics(profile);
              enhDesc = chars.Description || '';
            }
          }
          enhancements.push({
            name: enhEntry['@_name'],
            points: enhPoints,
            description: enhDesc,
          });
        }
      }
    }

    detachments.push({
      name: detName,
      ruleText: ruleText.substring(0, 2000), // truncate long rules
      enhancements,
    });
  }

  return detachments;
}

/**
 * Parse a single catalog file and return structured faction data.
 */
function parseCatalog(filePath) {
  const xml = fs.readFileSync(filePath, 'utf8');
  const root = parser.parse(xml);
  const catalog = root.catalogue || root.catalog;
  if (!catalog) return null;

  const catName = catalog['@_name'] || path.basename(filePath, '.cat');

  // Build entry index for resolving shared references
  const entryIndex = buildEntryIndex(catalog);

  // Extract faction name (clean up the prefix)
  let factionName = catName
    .replace(/^Imperium - /, '')
    .replace(/^Chaos - /, '')
    .replace(/^Aeldari - /, '')
    .replace(/ - Library$/, '')
    .replace(/^Adeptus Astartes - /, '')
    .replace(/^Xenos - /, '')
    .replace(/ Library$/, '');

  const factionId = uuidFromSeed(`faction:${factionName}`);

  // Extract detachments
  const detachments = extractDetachments(catalog, entryIndex);

  // Find all unit entries
  const units = [];
  const seenUnitNames = new Set();

  function findUnits(node) {
    for (const entry of ensureArray(node?.selectionEntries?.selectionEntry)) {
      const entryType = entry['@_type'];
      // Include 'unit' entries always; 'model' entries only if they have a direct points cost (e.g. Knights)
      const isModel = entryType === 'model';
      const hasDirectCost = ensureArray(entry?.costs?.cost).some(c => c['@_name'] === 'pts' && parseInt(c['@_value']) > 0);
      if ((entryType === 'unit' || (isModel && hasDirectCost)) && !entry['@_hidden']?.toString().includes('true')) {
        const unitName = entry['@_name'];
        if (!unitName || seenUnitNames.has(unitName)) continue;

        const stats = extractStats(entry);
        if (!stats) continue; // skip entries without stat profiles

        const pointsTiers = extractPointsTiers(entry);
        if (pointsTiers.length === 0) continue; // skip free/0pt entries

        seenUnitNames.add(unitName);
        const role = extractRole(entry);
        const keywords = extractKeywords(entry);
        const isUnique = isUniqueUnit(entry);
        const weapons = extractWeapons(entry, entryIndex);
        const abilities = extractAbilities(entry);
        const wargearOptions = extractWargearOptions(entry, entryIndex);

        // Deduplicate weapons by name+type
        const weaponMap = new Map();
        for (const w of weapons) {
          const key = `${w.name}|${w.type}`;
          if (!weaponMap.has(key)) weaponMap.set(key, w);
        }

        units.push({
          id: uuidFromSeed(`unit:${factionName}:${unitName}`),
          name: unitName,
          role,
          movement: stats.M || '6"',
          toughness: parseInt(stats.T) || 4,
          save: stats.SV || '3+',
          wounds: parseInt(stats.W) || 1,
          leadership: parseInt(stats.LD) || 6,
          objective_control: parseInt(stats.OC) || 1,
          keywords,
          is_unique: isUnique,
          points_tiers: pointsTiers,
          weapons: [...weaponMap.values()],
          abilities,
          wargear_options: wargearOptions,
        });
      }
    }

    // Also check entryLinks at the top level
    for (const link of ensureArray(node?.entryLinks?.entryLink)) {
      const targetId = link['@_targetId'];
      const target = entryIndex.get(targetId);
      if (target && (target['@_type'] === 'unit' || target['@_type'] === 'model')) {
        const unitName = target['@_name'] || link['@_name'];
        if (!unitName || seenUnitNames.has(unitName)) continue;

        const stats = extractStats(target);
        if (!stats) continue;

        const pointsTiers = extractPointsTiers(target);
        if (pointsTiers.length === 0) continue;

        seenUnitNames.add(unitName);
        const role = extractRole(target);
        const keywords = extractKeywords(target);
        const isUnique = isUniqueUnit(target);
        const weapons = extractWeapons(target, entryIndex);
        const abilities = extractAbilities(target);
        const wargearOptions = extractWargearOptions(target, entryIndex);

        const weaponMap = new Map();
        for (const w of weapons) {
          const key = `${w.name}|${w.type}`;
          if (!weaponMap.has(key)) weaponMap.set(key, w);
        }

        units.push({
          id: uuidFromSeed(`unit:${factionName}:${unitName}`),
          name: unitName,
          role,
          movement: stats.M || '6"',
          toughness: parseInt(stats.T) || 4,
          save: stats.SV || '3+',
          wounds: parseInt(stats.W) || 1,
          leadership: parseInt(stats.LD) || 6,
          objective_control: parseInt(stats.OC) || 1,
          keywords,
          is_unique: isUnique,
          points_tiers: pointsTiers,
          weapons: [...weaponMap.values()],
          abilities,
          wargear_options: wargearOptions,
        });
      }
    }
  }

  findUnits(catalog);

  // Also check shared selection entries (Library catalogs store units here)
  if (catalog.sharedSelectionEntries) {
    // sharedSelectionEntries wraps selectionEntry array directly
    const shared = { selectionEntries: catalog.sharedSelectionEntries };
    findUnits(shared);
  }

  return {
    factionName,
    factionId,
    detachments,
    units,
  };
}

/**
 * Generate SQL migration for a faction.
 */
function generateSQL(faction) {
  const lines = [];
  const { factionName, factionId, detachments, units } = faction;

  lines.push(`-- ============================================================`);
  lines.push(`-- SEED DATA: ${factionName}`);
  lines.push(`-- Auto-generated from BSData/wh40k-10e`);
  lines.push(`-- ============================================================`);
  lines.push('');

  // Faction
  lines.push(`INSERT INTO public.factions (id, name) VALUES`);
  lines.push(`  (${esc(factionId)}, ${esc(factionName)})`);
  lines.push(`ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;`);
  lines.push('');

  // Detachments
  if (detachments.length > 0) {
    lines.push(`-- Detachments`);
    for (const det of detachments) {
      const detId = uuidFromSeed(`detachment:${factionName}:${det.name}`);
      lines.push(`INSERT INTO public.detachments (id, faction_id, name, rule_text) VALUES`);
      lines.push(`  (${esc(detId)}, ${esc(factionId)}, ${esc(det.name)}, ${esc(det.ruleText)})`);
      lines.push(`ON CONFLICT (faction_id, name) DO UPDATE SET rule_text = EXCLUDED.rule_text;`);
      lines.push('');

      // Enhancements
      for (const enh of det.enhancements) {
        const enhId = uuidFromSeed(`enhancement:${factionName}:${det.name}:${enh.name}`);
        lines.push(`INSERT INTO public.enhancements (id, detachment_id, name, points, description) VALUES`);
        lines.push(`  (${esc(enhId)}, ${esc(detId)}, ${esc(enh.name)}, ${enh.points}, ${esc(enh.description)});`);
      }
      if (det.enhancements.length > 0) lines.push('');
    }
  }

  // Units
  lines.push(`-- Units`);
  for (const unit of units) {
    const kwArray = `'{${unit.keywords.map(k => `"${k.replace(/"/g, '\\"').replace(/'/g, "''")}"`).join(', ')}}'`;

    lines.push(`INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, is_unique) VALUES`);
    lines.push(`  (${esc(unit.id)}, ${esc(factionId)}, ${esc(unit.name)}, ${esc(unit.role)}, ${esc(unit.movement)}, ${unit.toughness}, ${esc(unit.save)}, ${unit.wounds}, ${unit.leadership}, ${unit.objective_control}, ${kwArray}, ${unit.is_unique});`);
    lines.push('');

    // Points tiers
    if (unit.points_tiers.length > 0) {
      lines.push(`INSERT INTO public.unit_points_tiers (unit_id, model_count, points) VALUES`);
      lines.push(unit.points_tiers.map(t =>
        `  (${esc(unit.id)}, ${t.model_count}, ${t.points})`
      ).join(',\n') + ';');
      lines.push('');
    }

    // Weapons
    if (unit.weapons.length > 0) {
      lines.push(`INSERT INTO public.weapons (unit_id, name, type, range, attacks, skill, strength, ap, damage, keywords) VALUES`);
      lines.push(unit.weapons.map(w => {
        const wkw = `'{${w.keywords.map(k => `"${k.replace(/"/g, '\\"').replace(/'/g, "''")}"`).join(', ')}}'`;
        return `  (${esc(unit.id)}, ${esc(w.name)}, ${esc(w.type)}, ${w.range ? esc(w.range) : 'NULL'}, ${esc(w.attacks)}, ${esc(w.skill)}, ${w.strength}, ${w.ap}, ${esc(w.damage)}, ${wkw})`;
      }).join(',\n') + ';');
      lines.push('');
    }

    // Abilities
    if (unit.abilities.length > 0) {
      lines.push(`INSERT INTO public.abilities (unit_id, name, type, description) VALUES`);
      lines.push(unit.abilities.map(a =>
        `  (${esc(unit.id)}, ${esc(a.name)}, ${esc(a.type)}, ${esc(a.description)})`
      ).join(',\n') + ';');
      lines.push('');
    }

    // Wargear options
    if (unit.wargear_options && unit.wargear_options.length > 0) {
      lines.push(`INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points) VALUES`);
      lines.push(unit.wargear_options.map(wo => {
        const woId = uuidFromSeed(`wargear:${factionName}:${unit.name}:${wo.group_name}:${wo.name}`);
        return `  (${esc(woId)}, ${esc(unit.id)}, ${esc(wo.group_name)}, ${esc(wo.name)}, ${wo.is_default}, ${wo.points})`;
      }).join(',\n') + '\nON CONFLICT (unit_id, group_name, name) DO NOTHING;');
      lines.push('');
    }
  }

  return lines.join('\n');
}

// ============================================================
// MAIN
// ============================================================

// Define which catalog files to parse, with optional library files and clean names
const CATALOGS = [
  { files: ['Imperium - Space Marines.cat'], name: 'Space Marines' },
  { files: ['Imperium - Adepta Sororitas.cat'], name: 'Adepta Sororitas' },
  { files: ['Imperium - Adeptus Custodes.cat'], name: 'Adeptus Custodes' },
  { files: ['Imperium - Adeptus Mechanicus.cat'], name: 'Adeptus Mechanicus' },
  { files: ['Imperium - Astra Militarum.cat', 'Imperium - Astra Militarum - Library.cat'], name: 'Astra Militarum' },
  { files: ['Imperium - Grey Knights.cat'], name: 'Grey Knights' },
  { files: ['Imperium - Imperial Knights.cat', 'Imperium - Imperial Knights - Library.cat'], name: 'Imperial Knights' },
  { files: ['Imperium - Black Templars.cat'], name: 'Black Templars' },
  { files: ['Imperium - Blood Angels.cat'], name: 'Blood Angels' },
  { files: ['Imperium - Dark Angels.cat'], name: 'Dark Angels' },
  { files: ['Imperium - Deathwatch.cat'], name: 'Deathwatch' },
  { files: ['Imperium - Space Wolves.cat'], name: 'Space Wolves' },
  { files: ['Chaos - Chaos Space Marines.cat'], name: 'Chaos Space Marines' },
  { files: ['Chaos - Death Guard.cat'], name: 'Death Guard' },
  { files: ['Chaos - Thousand Sons.cat'], name: 'Thousand Sons' },
  { files: ['Chaos - World Eaters.cat'], name: 'World Eaters' },
  { files: ['Chaos - Chaos Knights.cat', 'Chaos - Chaos Knights Library.cat'], name: 'Chaos Knights' },
  { files: ['Chaos - Chaos Daemons.cat', 'Chaos - Chaos Daemons Library.cat'], name: 'Chaos Daemons' },
  { files: ['Aeldari - Craftworlds.cat', 'Aeldari - Aeldari Library.cat'], name: 'Aeldari' },
  { files: ['Aeldari - Drukhari.cat', 'Aeldari - Aeldari Library.cat'], name: 'Drukhari' },
  { files: ['Leagues of Votann.cat'], name: 'Leagues of Votann' },
  { files: ['Genestealer Cults.cat', 'Library - Tyranids.cat'], name: 'Genestealer Cults' },
  { files: ['Necrons.cat'], name: 'Necrons' },
  { files: ['Orks.cat'], name: 'Orks' },
  { files: ['T\'au Empire.cat'], name: "T'au Empire" },
  { files: ['Tyranids.cat', 'Library - Tyranids.cat'], name: 'Tyranids' },
];

let totalUnits = 0;
let totalFactions = 0;
const allSQL = [];

// First, delete old generated migrations (keep 0001 schema)
const existingMigrations = fs.readdirSync(OUT_DIR).filter(f => f.match(/^\d+_seed_.*\.sql$/));
for (const f of existingMigrations) {
  fs.unlinkSync(path.join(OUT_DIR, f));
  console.log(`Deleted old migration: ${f}`);
}

for (const catalogDef of CATALOGS) {
  const factionName = catalogDef.name;
  const factionId = uuidFromSeed(`faction:${factionName}`);

  console.log(`Parsing: ${factionName}...`);

  // Parse all files for this faction and merge results
  let mergedUnits = [];
  let mergedDetachments = [];
  const seenUnitNames = new Set();

  for (const catFile of catalogDef.files) {
    const filePath = path.join(DATA_DIR, catFile);
    if (!fs.existsSync(filePath)) {
      console.log(`  (file not found: ${catFile})`);
      continue;
    }

    const faction = parseCatalog(filePath);
    if (!faction) continue;

    // Merge units (dedup by name)
    for (const unit of faction.units) {
      if (!seenUnitNames.has(unit.name)) {
        seenUnitNames.add(unit.name);
        // Override the faction ID and unit ID to match our clean name
        unit.id = uuidFromSeed(`unit:${factionName}:${unit.name}`);
        mergedUnits.push(unit);
      }
    }

    // Merge detachments
    for (const det of faction.detachments) {
      if (!mergedDetachments.some(d => d.name === det.name)) {
        mergedDetachments.push(det);
      }
    }
  }

  if (mergedUnits.length === 0) {
    console.log(`  -> No units found, skipping`);
    continue;
  }

  console.log(`  -> ${mergedUnits.length} units, ${mergedDetachments.length} detachments`);
  totalUnits += mergedUnits.length;
  totalFactions++;

  // If no detachments found, create a default one so lists can be created
  if (mergedDetachments.length === 0) {
    mergedDetachments.push({
      name: 'Index',
      ruleText: 'Default detachment using index rules.',
      enhancements: [],
    });
  }

  const sql = generateSQL({
    factionName,
    factionId,
    detachments: mergedDetachments,
    units: mergedUnits,
  });
  allSQL.push(sql);
}

// Write a single combined migration
const migrationNum = '20250220000010';
const migrationFile = `${migrationNum}_seed_all_factions.sql`;
const header = `-- ============================================================
-- AUTO-GENERATED from BSData/wh40k-10e
-- ${totalFactions} factions, ${totalUnits} total units
-- Generated: ${new Date().toISOString()}
-- ============================================================

-- Clean existing seed data (preserve schema)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'army_list_unit_wargear') THEN
    TRUNCATE public.army_list_unit_wargear CASCADE;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wargear_options') THEN
    TRUNCATE public.wargear_options CASCADE;
  END IF;
END $$;
TRUNCATE public.abilities CASCADE;
TRUNCATE public.weapons CASCADE;
TRUNCATE public.unit_points_tiers CASCADE;
TRUNCATE public.army_list_enhancements CASCADE;
TRUNCATE public.army_list_units CASCADE;
TRUNCATE public.army_lists CASCADE;
TRUNCATE public.enhancements CASCADE;
TRUNCATE public.detachments CASCADE;
TRUNCATE public.units CASCADE;
TRUNCATE public.factions CASCADE;

`;

fs.writeFileSync(path.join(OUT_DIR, migrationFile), header + allSQL.join('\n\n'));
console.log(`\nWrote ${migrationFile}: ${totalFactions} factions, ${totalUnits} units`);
