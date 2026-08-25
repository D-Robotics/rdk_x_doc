/**
 * CJS helpers for the Algolia indexer. Mirrors src/context doc-scope matching
 * so Node can load them without package.json "type": "module".
 */
const path = require('path');
const {VERSION_PRODUCT_MATRIX} = require(
  path.join(__dirname, '../../src/context/doc-scope-matrix.json'),
);

function compareVersions(v1, v2) {
  const parts1 = String(v1).split('.').map(Number);
  const parts2 = String(v2).split('.').map(Number);
  const maxLength = Math.max(parts1.length, parts2.length);
  for (let i = 0; i < maxLength; i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
  }
  return 0;
}

function parseVersionExpression(versionStr) {
  if (!versionStr || typeof versionStr !== 'string') {
    return null;
  }
  let trimmed = versionStr.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    trimmed = trimmed.slice(1, -1).trim();
  }
  const m = trimmed.match(/^(>=|<=|>|<)?\s*(\d+(?:\.\d+)*)$/);
  if (!m) {
    return null;
  }
  return {operator: m[1] || '', version: m[2]};
}

function versionMatchesOperator(currentVersion, operator, version) {
  const cmp = compareVersions(currentVersion, version);
  switch (operator) {
    case '>':
      return cmp > 0;
    case '>=':
      return cmp >= 0;
    case '<':
      return cmp < 0;
    case '<=':
      return cmp <= 0;
    case '':
    default:
      return cmp === 0;
  }
}

function matchVersion(currentVersion, versionConfigs) {
  if (!versionConfigs || versionConfigs.length === 0) {
    return true;
  }
  for (const config of versionConfigs) {
    if (typeof config === 'string') {
      if (config === currentVersion) return true;
      const parsed = parseVersionExpression(config);
      if (parsed && parsed.version) {
        if (versionMatchesOperator(currentVersion, parsed.operator, parsed.version)) {
          return true;
        }
      }
      continue;
    }
    if (typeof config === 'object' && config != null && config.version) {
      const op = config.operator != null ? config.operator : '';
      if (versionMatchesOperator(currentVersion, op, config.version)) {
        return true;
      }
    }
  }
  return false;
}

function normalizeProductKey(s) {
  return String(s)
    .trim()
    .toLocaleLowerCase('en-US')
    .replace(/\s+/g, ' ');
}

function normalizeProductSeriesKey(s) {
  if (s == null || typeof s !== 'string') {
    return null;
  }
  const match = s.trim().match(/^rdk\s*-\s*(.+)$/i);
  if (!match) {
    return null;
  }
  const suffix = match[1].trim().replace(/\s+/g, ' ');
  if (!suffix) {
    return null;
  }
  return normalizeProductKey(`RDK ${suffix}`);
}

function productBelongsToSeries(currentProductCanonical, seriesKey) {
  const current = normalizeProductKey(currentProductCanonical);
  return current === seriesKey || current.startsWith(`${seriesKey} `);
}

let _canonicalLookup = null;
function getCanonicalLookup() {
  if (!_canonicalLookup) {
    const map = new Map();
    for (const list of Object.values(VERSION_PRODUCT_MATRIX || {})) {
      for (const canonical of list) {
        map.set(normalizeProductKey(canonical), canonical);
      }
    }
    _canonicalLookup = map;
  }
  return _canonicalLookup;
}

function resolveCanonicalProduct(input) {
  if (input == null || String(input).trim() === '') {
    return null;
  }
  return getCanonicalLookup().get(normalizeProductKey(input)) ?? null;
}

function scopeProductsMatchCurrent(scopeProducts, currentProductCanonical) {
  if (!scopeProducts || scopeProducts.length === 0) {
    return true;
  }
  if (currentProductCanonical == null || String(currentProductCanonical).trim() === '') {
    return false;
  }
  const cur = normalizeProductKey(currentProductCanonical);
  for (const entry of scopeProducts) {
    const seriesKey = normalizeProductSeriesKey(entry);
    if (seriesKey && productBelongsToSeries(currentProductCanonical, seriesKey)) {
      return true;
    }
    const canon = resolveCanonicalProduct(entry);
    if (canon && normalizeProductKey(canon) === cur) {
      return true;
    }
    if (normalizeProductKey(entry) === cur) {
      return true;
    }
  }
  return false;
}

module.exports = {
  matchVersion,
  scopeProductsMatchCurrent,
};
