/**
 * Data Source Interface
 *
 * All data sources (BSData, future GW API, Wahapedia, etc.) must implement
 * this interface. Each method returns structured data that the ingestion
 * pipeline writes into the Supabase schema via SQL migrations.
 *
 * Implementations live alongside this file (e.g. bsdata.js).
 * The active source is selected in index.js.
 */

/**
 * @typedef {Object} FactionData
 * @property {string} id          - Deterministic UUID (stable across re-runs)
 * @property {string} name        - Display name (e.g. "Space Marines")
 * @property {string} alignment   - 'imperium' | 'chaos' | 'xenos' | 'unaligned'
 * @property {string} edition     - '10e' | '11e' | etc.
 * @property {string} dataSource  - Source identifier (e.g. 'bsdata')
 * @property {DetachmentData[]} detachments
 * @property {UnitData[]} units
 */

/**
 * @typedef {Object} DetachmentData
 * @property {string} name
 * @property {string|null} ruleText
 * @property {EnhancementData[]} enhancements
 */

/**
 * @typedef {Object} EnhancementData
 * @property {string} name
 * @property {number} points
 * @property {string|null} description
 */

/**
 * @typedef {Object} UnitData
 * @property {string} id
 * @property {string} name
 * @property {string} role         - battleline | character | vehicle | etc.
 * @property {string} movement
 * @property {number} toughness
 * @property {string} save
 * @property {number} wounds
 * @property {string} leadership
 * @property {number} objectiveControl
 * @property {string[]} keywords
 * @property {number|null} maxPerList
 * @property {boolean} isLegends
 * @property {WeaponData[]} weapons
 * @property {AbilityData[]} abilities
 * @property {WargearOptionData[]} wargearOptions
 * @property {ModelVariantData[]} modelVariants
 */

/**
 * @typedef {Object} WeaponData
 * @property {string} name
 * @property {'ranged'|'melee'} type
 * @property {string} range
 * @property {string} attacks
 * @property {string} skill
 * @property {string} strength
 * @property {string} armorPenetration
 * @property {string} damage
 * @property {string[]} keywords
 */

/**
 * @typedef {Object} AbilityData
 * @property {string} name
 * @property {string|null} description
 * @property {string} type         - 'core' | 'faction' | 'unique' | 'invulnerable' | 'other'
 */

/**
 * @typedef {Object} WargearOptionData
 * @property {string} groupName
 * @property {string} optionName
 * @property {number} points
 * @property {boolean} isDefault
 * @property {boolean} isRequired
 * @property {string|null} poolGroup
 * @property {number|null} poolMax
 */

/**
 * @typedef {Object} ModelVariantData
 * @property {string} name
 * @property {number} minCount
 * @property {number} maxCount
 * @property {number} defaultCount
 * @property {boolean} isLeader
 * @property {number} sortOrder
 * @property {string|null} groupName
 */

/**
 * @interface DataSource
 *
 * Implementations must export an object conforming to this interface.
 * All methods are synchronous — the ingestion pipeline handles async I/O.
 */

/**
 * @typedef {Object} DataSource
 * @property {string} name                    - Identifier used in data_source column (e.g. 'bsdata')
 * @property {string} label                   - Human-readable label
 * @property {() => FactionData[]} getFactions - Parse and return all faction data
 */

module.exports = {};
