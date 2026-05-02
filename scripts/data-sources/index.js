/**
 * Data source registry
 *
 * Add new sources here and switch DATA_SOURCE env var to activate them.
 * The active source is imported by parse-bsdata.js for metadata (source name,
 * mtime) that it stamps onto generated SQL.
 *
 * Future sources: gw-api.js, wahapedia.js, etc.
 */

const bsdata = require('./bsdata');

const SOURCES = {
  bsdata,
};

/**
 * Returns the active data source based on the DATA_SOURCE env var.
 * Defaults to 'bsdata'.
 * @returns {import('./base').DataSource}
 */
function getActiveSource() {
  const key = process.env.DATA_SOURCE ?? 'bsdata';
  const source = SOURCES[key];
  if (!source) {
    throw new Error(`Unknown data source: "${key}". Valid options: ${Object.keys(SOURCES).join(', ')}`);
  }
  return source;
}

module.exports = { getActiveSource, SOURCES };
