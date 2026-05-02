/**
 * BSData data source adapter
 *
 * Wraps the parse-bsdata.js pipeline to conform to the DataSource interface
 * defined in base.js. The raw parsing logic lives in parse-bsdata.js;
 * this module is the seam that lets future sources plug in without touching it.
 *
 * Usage (from index.js):
 *   const source = require('./bsdata');
 *   const factions = source.getFactions(); // returns FactionData[]
 */

const path = require('path');
const { XMLParser } = require('fast-xml-parser');
const fs = require('fs');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'bsdata');

// Re-export the source identifier used in the DB data_source column
const SOURCE_NAME = 'bsdata';
const SOURCE_LABEL = 'BattleScribe Data (wh40k-10e)';

/**
 * Returns all .cat files in the BSData directory.
 * @returns {string[]} Absolute file paths
 */
function getCatFiles() {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.cat') || f.endsWith('.cat.xml'))
    .map(f => path.join(DATA_DIR, f));
}

/**
 * Returns the modification time of the most recently changed .cat file.
 * Used to populate data_source_updated_at on factions.
 * @returns {Date|null}
 */
function getLatestMtime() {
  const files = getCatFiles();
  if (files.length === 0) return null;
  const mtimes = files.map(f => fs.statSync(f).mtime.getTime());
  return new Date(Math.max(...mtimes));
}

/**
 * Minimal BSData source descriptor.
 * The full parsing pipeline remains in parse-bsdata.js — this provides
 * the metadata and utility functions the pipeline needs to stamp factions.
 *
 * @type {import('./base').DataSource}
 */
const bsdataSource = {
  name: SOURCE_NAME,
  label: SOURCE_LABEL,
  getCatFiles,
  getLatestMtime,
};

module.exports = bsdataSource;
