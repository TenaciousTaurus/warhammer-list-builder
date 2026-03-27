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
 * Count the minimum number of models in a unit by summing min constraints
 * from all type="model" child selectionEntries and selectionEntryGroups.
 *
 * BSData units typically have a structure like:
 *   Unit (type="unit")
 *     ├── Sergeant (type="model", min=1, max=1)
 *     └── Group (selectionEntryGroup, min=4, max=9)
 *         ├── Marine variant A (type="model")
 *         └── Marine variant B (type="model")
 *
 * The modifier conditions (atLeast) count ALL models including the Sergeant
 * (via includeChildSelections="true"), so our base tier model_count must
 * also count all models — not just the group min.
 */
function countMinModels(node) {
  let total = 0;

  // Count direct model-type child entries with min constraints
  for (const child of ensureArray(node?.selectionEntries?.selectionEntry)) {
    if (child['@_type'] === 'model') {
      let childMin = 0;
      for (const c of ensureArray(child?.constraints?.constraint)) {
        if (c['@_type'] === 'min' && c['@_field'] === 'selections') {
          childMin = Math.max(childMin, parseInt(c['@_value']) || 0);
        }
      }
      total += Math.max(childMin, 1); // at least 1 if it's a model entry
    }
  }

  // Count models from selectionEntryGroups (the variable-size model groups)
  for (const group of ensureArray(node?.selectionEntryGroups?.selectionEntryGroup)) {
    // Check if this group contains model-type entries
    const hasModels = ensureArray(group?.selectionEntries?.selectionEntry)
      .some(e => e['@_type'] === 'model');
    if (!hasModels) continue;

    for (const c of ensureArray(group?.constraints?.constraint)) {
      if (c['@_type'] === 'min' && c['@_field'] === 'selections') {
        total += parseInt(c['@_value']) || 0;
      }
    }
  }

  return total;
}

/**
 * Extract points cost and model count tiers from a unit entry.
 * BattleScribe uses a base cost + modifiers that change cost at different model counts.
 *
 * The modifier conditions use includeChildSelections="true" which means they
 * count ALL models in the unit (including fixed models like Sergeants/Champions).
 * So the model_count in our tiers must also reflect the total unit size.
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

  // Count total minimum models in the unit (all model entries + group minimums)
  const baseModelCount = countMinModels(node) || 1;

  // Add base tier
  if (basePoints > 0) {
    tiers.push({ model_count: baseModelCount, points: basePoints });
  }

  // Check modifiers for additional tiers (points changes at different model counts)
  // The condition values already represent total model count (includeChildSelections=true)
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

  // Deduplicate tiers by model_count (keep the one with higher points if duplicated,
  // since the modifier overrides the base cost at that threshold)
  const tierMap = new Map();
  for (const tier of tiers) {
    const existing = tierMap.get(tier.model_count);
    if (!existing || tier.points > existing.points) {
      tierMap.set(tier.model_count, tier);
    }
  }

  return [...tierMap.values()].sort((a, b) => a.model_count - b.model_count);
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
 * Extract max_per_list from BSData constraint data.
 * Checks for type="max" field="selections" constraints at both
 * scope="roster" and scope="force" (different factions use different scopes).
 * Falls back to role-based defaults per 10th Edition muster rules.
 */
function extractMaxPerList(node) {
  const role = extractRole(node);

  // Epic heroes are always max 1
  if (role === 'epic_hero') return 1;

  // Look for explicit max constraint on selections at roster or force scope
  let maxValue = null;
  for (const constraint of ensureArray(node?.constraints?.constraint)) {
    if (
      constraint['@_type'] === 'max' &&
      constraint['@_field'] === 'selections' &&
      (constraint['@_scope'] === 'roster' || constraint['@_scope'] === 'force')
    ) {
      const val = parseInt(constraint['@_value'], 10);
      if (val > 0) {
        // Take the most restrictive (smallest) if multiple constraints exist
        if (maxValue === null || val < maxValue) {
          maxValue = val;
        }
      }
    }
  }

  if (maxValue !== null) return maxValue;

  // Fall back to role-based defaults per 10th Edition rules
  if (role === 'battleline' || role === 'dedicated_transport') return 6;
  return 3;
}

/**
 * Extract wargear options from a "Wargear" selectionEntryGroup.
 * Handles direct entries, links, and subgroups.
 * Returns options with optional pool_group/pool_max from group constraints.
 */
function extractWargearFromGroup(group, entryIndex) {
  const options = [];

  // Check for pool constraints on the group itself (e.g. "Special weapons" max=2)
  let groupPoolGroup = null;
  let groupPoolMax = null;
  for (const c of ensureArray(group?.constraints?.constraint)) {
    if (c['@_type'] === 'max' && c['@_field'] === 'selections') {
      const maxVal = parseInt(c['@_value']);
      if (maxVal > 0 && maxVal < 20) {
        groupPoolGroup = group['@_name'] || 'Wargear';
        groupPoolMax = maxVal;
      }
    }
  }

  // Direct entries (simple wargear options)
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
        pool_group: groupPoolGroup,
        pool_max: groupPoolMax,
      });
    });
  }

  // Direct links (shared wargear references)
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
      pool_group: groupPoolGroup,
      pool_max: groupPoolMax,
    });
  }

  // Subgroups (e.g. "Weapon 1", "Weapon 2", "Plague knives options")
  for (const subgroup of ensureArray(group?.selectionEntryGroups?.selectionEntryGroup)) {
    const sgName = subgroup['@_name'] || 'Wargear';
    let sgIdx = 0;

    // Check for pool constraints on subgroups too
    let sgPoolGroup = null;
    let sgPoolMax = null;
    for (const c of ensureArray(subgroup?.constraints?.constraint)) {
      if (c['@_type'] === 'max' && c['@_field'] === 'selections') {
        const maxVal = parseInt(c['@_value']);
        if (maxVal > 0 && maxVal < 20) {
          sgPoolGroup = sgName;
          sgPoolMax = maxVal;
        }
      }
    }

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
        pool_group: sgPoolGroup || groupPoolGroup,
        pool_max: sgPoolMax || groupPoolMax,
      });
      sgIdx++;
    }

    // Resolve links in subgroups
    for (const link of ensureArray(subgroup?.entryLinks?.entryLink)) {
      const linkName = link['@_name'];
      if (!linkName) continue;
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
        pool_group: sgPoolGroup || groupPoolGroup,
        pool_max: sgPoolMax || groupPoolMax,
      });
      sgIdx++;
    }
  }

  return options;
}

/**
 * Extract wargear options from a unit node.
 * Looks at the top-level node AND inside child model-type selectionEntries,
 * since multi-model units (e.g. Plague Marines) nest wargear inside
 * individual model definitions (Plague Champion, Plague Marine).
 */
function extractWargearOptions(node, entryIndex) {
  const options = [];
  const seen = new Set(); // Deduplicate by group_name:name

  function addOptions(opts) {
    for (const opt of opts) {
      const key = `${opt.group_name}:${opt.name}`;
      if (!seen.has(key)) {
        seen.add(key);
        options.push(opt);
      }
    }
  }

  // 1) Check top-level selectionEntryGroups for "Wargear"
  for (const group of ensureArray(node?.selectionEntryGroups?.selectionEntryGroup)) {
    if (group['@_name'] === 'Wargear') {
      addOptions(extractWargearFromGroup(group, entryIndex));
    }
    // Also check for "Replace X" style groups at the top level (e.g. vehicle loadouts)
    if (group['@_name'] && group['@_name'].startsWith('Replace ')) {
      addOptions(extractWargearFromGroup(group, entryIndex).map(o => ({
        ...o,
        group_name: group['@_name'],
      })));
    }
  }

  // 2) Recurse into child model-type selectionEntries (e.g. "Plague Champion", "Plague Marine")
  for (const child of ensureArray(node?.selectionEntries?.selectionEntry)) {
    if (child['@_type'] !== 'model') continue;
    const modelName = child['@_name'] || '';

    for (const group of ensureArray(child?.selectionEntryGroups?.selectionEntryGroup)) {
      if (group['@_name'] === 'Wargear') {
        const modelOpts = extractWargearFromGroup(group, entryIndex);
        // Prefix group names with model name to avoid collisions between models
        // and tag with model_variant_name for DB linking
        addOptions(modelOpts.map(o => ({
          ...o,
          model_variant_name: modelName,
          group_name: modelOpts.length > 1 && o.group_name === 'Wargear'
            ? `${modelName} wargear`
            : o.group_name !== 'Wargear'
              ? `${modelName}: ${o.group_name}`
              : o.group_name,
        })));
      }
    }

    // Also check entryLinks on models that resolve to shared entries with wargear
    for (const link of ensureArray(child?.entryLinks?.entryLink)) {
      if (link['@_type'] !== 'selectionEntryGroup') continue;
      const target = entryIndex.get(link['@_targetId']);
      if (!target || target['@_name'] !== 'Wargear') continue;
      const modelOpts = extractWargearFromGroup(target, entryIndex);
      addOptions(modelOpts.map(o => ({
        ...o,
        model_variant_name: modelName,
        group_name: modelOpts.length > 1 && o.group_name === 'Wargear'
          ? `${modelName} wargear`
          : o.group_name !== 'Wargear'
            ? `${modelName}: ${o.group_name}`
            : o.group_name,
      })));
    }
  }

  // 3) Check for "model variant" pattern: selectionEntryGroups containing model-type entries
  //    (e.g. Blightlord Terminators: "2-9 Blightlord Terminators" group with model variants)
  for (const group of ensureArray(node?.selectionEntryGroups?.selectionEntryGroup)) {
    if (group['@_name'] === 'Wargear') continue; // Already handled above
    const modelEntries = ensureArray(group?.selectionEntries?.selectionEntry)
      .filter(e => e['@_type'] === 'model');
    if (modelEntries.length >= 2) {
      // This is a model variant group — treat each model as a loadout option
      const groupName = group['@_name'] || 'Loadout';
      const defaultId = group['@_defaultSelectionEntryId'];
      modelEntries.forEach((e) => {
        addOptions([{
          group_name: groupName,
          name: e['@_name'],
          is_default: e['@_id'] === defaultId,
          points: 0,
        }]);
      });
    }
  }

  return options;
}

/**
 * Extract model variants from a unit node.
 * Returns array of { name, min_count, max_count, default_count, is_leader, sort_order, group_name }
 */
function extractModelVariants(node) {
  const variants = [];
  const seen = new Set();
  let sortIdx = 0;

  function getConstraints(entry) {
    let min = 0, max = 10;
    for (const c of ensureArray(entry?.constraints?.constraint)) {
      if (c['@_type'] === 'min' && c['@_field'] === 'selections') min = parseInt(c['@_value']) || 0;
      if (c['@_type'] === 'max' && c['@_field'] === 'selections') max = parseInt(c['@_value']) || 10;
    }
    return { min, max };
  }

  // 1) Direct model-type child selectionEntries (e.g. "Plague Champion")
  for (const child of ensureArray(node?.selectionEntries?.selectionEntry)) {
    if (child['@_type'] !== 'model') continue;
    const name = child['@_name'];
    if (!name || seen.has(name)) continue;
    seen.add(name);

    const { min, max } = getConstraints(child);
    const isLeader = min >= 1 && max === 1;

    variants.push({
      name,
      min_count: min,
      max_count: max,
      default_count: min,
      is_leader: isLeader,
      sort_order: parseInt(child['@_sortIndex']) || sortIdx,
      group_name: null,
    });
    sortIdx++;
  }

  // 2) Model variants inside selectionEntryGroups (e.g. "4-9 Plague Marines", "Special weapons")
  for (const group of ensureArray(node?.selectionEntryGroups?.selectionEntryGroup)) {
    const groupName = group['@_name'] || null;

    for (const child of ensureArray(group?.selectionEntries?.selectionEntry)) {
      if (child['@_type'] !== 'model') continue;
      const name = child['@_name'];
      if (!name || seen.has(name)) continue;
      seen.add(name);

      const { min, max } = getConstraints(child);
      const isLeader = min >= 1 && max === 1;

      variants.push({
        name,
        min_count: min,
        max_count: max,
        default_count: min,
        is_leader: isLeader,
        sort_order: parseInt(child['@_sortIndex']) || sortIdx,
        group_name: groupName,
      });
      sortIdx++;
    }

    // 3) Recurse into sub-groups (e.g. "Special weapons" inside a parent group)
    for (const subGroup of ensureArray(group?.selectionEntryGroups?.selectionEntryGroup)) {
      const subGroupName = subGroup['@_name'] || groupName;
      for (const child of ensureArray(subGroup?.selectionEntries?.selectionEntry)) {
        if (child['@_type'] !== 'model') continue;
        const name = child['@_name'];
        if (!name || seen.has(name)) continue;
        seen.add(name);

        const { min, max } = getConstraints(child);
        variants.push({
          name,
          min_count: min,
          max_count: max,
          default_count: min,
          is_leader: false,
          sort_order: parseInt(child['@_sortIndex']) || sortIdx,
          group_name: subGroupName,
        });
        sortIdx++;
      }
    }
  }

  return variants;
}

/**
 * Extract leader target unit names from a unit's "Leader" ability.
 * In 10th Edition, the "Leader" ability description lists which units
 * a character can be attached to. We parse that text to find matches.
 */
function extractLeaderTargets(unit, allUnitNames) {
  const targets = [];

  // Find the "Leader" ability
  const leaderAbility = unit.abilities.find(a =>
    a.name.toLowerCase() === 'leader' && a.type === 'core'
  );
  if (!leaderAbility || !leaderAbility.description) return targets;

  const desc = leaderAbility.description;

  // Match unit names from the description
  // The description typically says "This model can be attached to the following units: Unit A, Unit B"
  // or lists units with bullet points
  for (const unitName of allUnitNames) {
    if (unitName === unit.name) continue; // can't lead yourself
    // Check if the unit name appears in the ability description (case-insensitive)
    if (desc.toLowerCase().includes(unitName.toLowerCase())) {
      targets.push(unitName);
    }
  }

  return targets;
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
        const maxPerList = extractMaxPerList(entry);
        const weapons = extractWeapons(entry, entryIndex);
        const abilities = extractAbilities(entry);
        const wargearOptions = extractWargearOptions(entry, entryIndex);
        const modelVariants = extractModelVariants(entry);

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
          max_per_list: maxPerList,
          points_tiers: pointsTiers,
          weapons: [...weaponMap.values()],
          abilities,
          wargear_options: wargearOptions,
          model_variants: modelVariants,
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
        const maxPerList = extractMaxPerList(target);
        const weapons = extractWeapons(target, entryIndex);
        const abilities = extractAbilities(target);
        const wargearOptions = extractWargearOptions(target, entryIndex);
        const modelVariants = extractModelVariants(target);

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
          max_per_list: maxPerList,
          points_tiers: pointsTiers,
          weapons: [...weaponMap.values()],
          abilities,
          wargear_options: wargearOptions,
          model_variants: modelVariants,
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

  // After all units are collected, extract leader targets
  const allUnitNames = units.map(u => u.name);
  const leaderTargets = [];
  for (const unit of units) {
    const targets = extractLeaderTargets(unit, allUnitNames);
    for (const targetName of targets) {
      leaderTargets.push({
        leader_unit_name: unit.name,
        target_unit_name: targetName,
      });
    }
  }

  return {
    factionName,
    factionId,
    detachments,
    units,
    leaderTargets,
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

    lines.push(`INSERT INTO public.units (id, faction_id, name, role, movement, toughness, save, wounds, leadership, objective_control, keywords, max_per_list) VALUES`);
    lines.push(`  (${esc(unit.id)}, ${esc(factionId)}, ${esc(unit.name)}, ${esc(unit.role)}, ${esc(unit.movement)}, ${unit.toughness}, ${esc(unit.save)}, ${unit.wounds}, ${unit.leadership}, ${unit.objective_control}, ${kwArray}, ${unit.max_per_list});`);
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

    // Model variants (must come before wargear_options due to FK)
    if (unit.model_variants && unit.model_variants.length > 0) {
      lines.push(`INSERT INTO public.unit_model_variants (id, unit_id, name, min_count, max_count, default_count, is_leader, sort_order, group_name) VALUES`);
      lines.push(unit.model_variants.map(mv => {
        const mvId = uuidFromSeed(`model_variant:${factionName}:${unit.name}:${mv.name}`);
        return `  (${esc(mvId)}, ${esc(unit.id)}, ${esc(mv.name)}, ${mv.min_count}, ${mv.max_count}, ${mv.default_count}, ${mv.is_leader}, ${mv.sort_order}, ${esc(mv.group_name)})`;
      }).join(',\n') + '\nON CONFLICT (unit_id, name) DO UPDATE SET min_count = EXCLUDED.min_count, max_count = EXCLUDED.max_count, default_count = EXCLUDED.default_count, is_leader = EXCLUDED.is_leader, sort_order = EXCLUDED.sort_order, group_name = EXCLUDED.group_name;');
      lines.push('');
    }

    // Wargear options (with model_variant_id, pool_group, pool_max)
    if (unit.wargear_options && unit.wargear_options.length > 0) {
      lines.push(`INSERT INTO public.wargear_options (id, unit_id, group_name, name, is_default, points, model_variant_id, pool_group, pool_max) VALUES`);
      lines.push(unit.wargear_options.map(wo => {
        const woId = uuidFromSeed(`wargear:${factionName}:${unit.name}:${wo.group_name}:${wo.name}`);
        // Resolve model_variant_id if we have a model_variant_name
        let mvIdSql = 'NULL';
        if (wo.model_variant_name && unit.model_variants) {
          const mv = unit.model_variants.find(v => v.name === wo.model_variant_name);
          if (mv) {
            mvIdSql = esc(uuidFromSeed(`model_variant:${factionName}:${unit.name}:${mv.name}`));
          }
        }
        const poolGroupSql = wo.pool_group ? esc(wo.pool_group) : 'NULL';
        const poolMaxSql = wo.pool_max != null ? wo.pool_max : 'NULL';
        return `  (${esc(woId)}, ${esc(unit.id)}, ${esc(wo.group_name)}, ${esc(wo.name)}, ${wo.is_default}, ${wo.points}, ${mvIdSql}, ${poolGroupSql}, ${poolMaxSql})`;
      }).join(',\n') + '\nON CONFLICT (unit_id, group_name, name) DO UPDATE SET model_variant_id = EXCLUDED.model_variant_id, pool_group = EXCLUDED.pool_group, pool_max = EXCLUDED.pool_max;');
      lines.push('');
    }
  }

  // Leader targets
  if (faction.leaderTargets && faction.leaderTargets.length > 0) {
    lines.push(`-- Leader targets`);
    for (const lt of faction.leaderTargets) {
      const leaderId = uuidFromSeed(`unit:${factionName}:${lt.leader_unit_name}`);
      const targetId = uuidFromSeed(`unit:${factionName}:${lt.target_unit_name}`);
      const ltId = uuidFromSeed(`leader_target:${factionName}:${lt.leader_unit_name}:${lt.target_unit_name}`);
      lines.push(`INSERT INTO public.unit_leader_targets (id, leader_unit_id, target_unit_id) VALUES`);
      lines.push(`  (${esc(ltId)}, ${esc(leaderId)}, ${esc(targetId)})`);
      lines.push(`ON CONFLICT (leader_unit_id, target_unit_id) DO NOTHING;`);
    }
    lines.push('');
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
  let mergedLeaderTargets = [];
  const seenUnitNames = new Set();
  const seenLeaderTargets = new Set();

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

    // Merge leader targets
    for (const lt of (faction.leaderTargets || [])) {
      const key = `${lt.leader_unit_name}:${lt.target_unit_name}`;
      if (!seenLeaderTargets.has(key)) {
        seenLeaderTargets.add(key);
        mergedLeaderTargets.push(lt);
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

  // Re-extract leader targets using merged unit names for better matching
  const allMergedNames = mergedUnits.map(u => u.name);
  const reExtractedLeaderTargets = [];
  const reSeenLT = new Set();
  for (const unit of mergedUnits) {
    const targets = extractLeaderTargets(unit, allMergedNames);
    for (const targetName of targets) {
      const key = `${unit.name}:${targetName}`;
      if (!reSeenLT.has(key)) {
        reSeenLT.add(key);
        reExtractedLeaderTargets.push({ leader_unit_name: unit.name, target_unit_name: targetName });
      }
    }
  }

  const sql = generateSQL({
    factionName,
    factionId,
    detachments: mergedDetachments,
    units: mergedUnits,
    leaderTargets: reExtractedLeaderTargets,
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
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'army_list_leader_attachments') THEN
    TRUNCATE public.army_list_leader_attachments CASCADE;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'unit_leader_targets') THEN
    TRUNCATE public.unit_leader_targets CASCADE;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'army_list_unit_wargear') THEN
    TRUNCATE public.army_list_unit_wargear CASCADE;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wargear_options') THEN
    TRUNCATE public.wargear_options CASCADE;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'army_list_unit_composition') THEN
    TRUNCATE public.army_list_unit_composition CASCADE;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'unit_model_variants') THEN
    TRUNCATE public.unit_model_variants CASCADE;
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

-- Ensure model variants table exists (needed before seed data)
CREATE TABLE IF NOT EXISTS public.unit_model_variants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id uuid NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  name text NOT NULL,
  min_count integer NOT NULL DEFAULT 0,
  max_count integer NOT NULL DEFAULT 10,
  default_count integer NOT NULL DEFAULT 0,
  is_leader boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  group_name text,
  UNIQUE(unit_id, name)
);
CREATE INDEX IF NOT EXISTS idx_unit_model_variants_unit ON public.unit_model_variants(unit_id);

-- Ensure composition table exists
CREATE TABLE IF NOT EXISTS public.army_list_unit_composition (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  army_list_unit_id uuid NOT NULL REFERENCES public.army_list_units(id) ON DELETE CASCADE,
  model_variant_id uuid NOT NULL REFERENCES public.unit_model_variants(id) ON DELETE CASCADE,
  count integer NOT NULL DEFAULT 0,
  UNIQUE(army_list_unit_id, model_variant_id)
);
CREATE INDEX IF NOT EXISTS idx_army_list_unit_composition_alu ON public.army_list_unit_composition(army_list_unit_id);

-- RLS
ALTER TABLE public.unit_model_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.army_list_unit_composition ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'unit_model_variants' AND policyname = 'Public read model variants') THEN
    CREATE POLICY "Public read model variants" ON public.unit_model_variants FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'army_list_unit_composition' AND policyname = 'army_list_unit_composition_all') THEN
    CREATE POLICY "army_list_unit_composition_all" ON public.army_list_unit_composition USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Ensure leader targets table exists
CREATE TABLE IF NOT EXISTS public.unit_leader_targets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  leader_unit_id uuid NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  target_unit_id uuid NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  UNIQUE(leader_unit_id, target_unit_id)
);
CREATE INDEX IF NOT EXISTS idx_unit_leader_targets_leader ON public.unit_leader_targets(leader_unit_id);
CREATE INDEX IF NOT EXISTS idx_unit_leader_targets_target ON public.unit_leader_targets(target_unit_id);

-- Ensure leader attachments table exists
CREATE TABLE IF NOT EXISTS public.army_list_leader_attachments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  army_list_id uuid NOT NULL REFERENCES public.army_lists(id) ON DELETE CASCADE,
  leader_army_list_unit_id uuid NOT NULL REFERENCES public.army_list_units(id) ON DELETE CASCADE,
  target_army_list_unit_id uuid NOT NULL REFERENCES public.army_list_units(id) ON DELETE CASCADE,
  UNIQUE(leader_army_list_unit_id)
);
CREATE INDEX IF NOT EXISTS idx_army_list_leader_attachments_list ON public.army_list_leader_attachments(army_list_id);
CREATE INDEX IF NOT EXISTS idx_army_list_leader_attachments_target ON public.army_list_leader_attachments(target_army_list_unit_id);

-- Extend wargear_options with model_variant_id, pool_group, pool_max
ALTER TABLE public.wargear_options ADD COLUMN IF NOT EXISTS model_variant_id uuid REFERENCES public.unit_model_variants(id) ON DELETE SET NULL;
ALTER TABLE public.wargear_options ADD COLUMN IF NOT EXISTS pool_group text;
ALTER TABLE public.wargear_options ADD COLUMN IF NOT EXISTS pool_max integer;

-- Extend army_list_unit_wargear with model_variant_id, quantity
ALTER TABLE public.army_list_unit_wargear ADD COLUMN IF NOT EXISTS model_variant_id uuid REFERENCES public.unit_model_variants(id) ON DELETE SET NULL;
ALTER TABLE public.army_list_unit_wargear ADD COLUMN IF NOT EXISTS quantity integer NOT NULL DEFAULT 1;

-- RLS for new tables
ALTER TABLE public.unit_leader_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.army_list_leader_attachments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'unit_leader_targets' AND policyname = 'Public read leader targets') THEN
    CREATE POLICY "Public read leader targets" ON public.unit_leader_targets FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'army_list_leader_attachments' AND policyname = 'Allow all leader attachments') THEN
    CREATE POLICY "Allow all leader attachments" ON public.army_list_leader_attachments FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

`;

fs.writeFileSync(path.join(OUT_DIR, migrationFile), header + allSQL.join('\n\n'));
console.log(`\nWrote ${migrationFile}: ${totalFactions} factions, ${totalUnits} units`);
