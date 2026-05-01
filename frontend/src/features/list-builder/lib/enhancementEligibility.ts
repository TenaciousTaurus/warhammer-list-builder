/**
 * Parses the "X model only" restriction embedded in enhancement description text and
 * determines whether a given unit is eligible to take the enhancement.
 *
 * GW encodes restrictions like "KROOT model only" or "T'AU EMPIRE model (excluding KROOT) only"
 * directly in description prose. We parse these at runtime.
 *
 * Strategy for faction-level keywords (e.g. "T'AU EMPIRE"):
 *   These never appear in unit.keywords in our DB (they're implicit army-wide keywords).
 *   If a required keyword token isn't found in ANY unit's keywords across the available pool,
 *   we treat it as a faction keyword and allow the enhancement for all units.
 */

type UnitLike = { keywords?: string[] | null };
type EnhancementLike = { description: string };

function stripMarkdown(text: string): string {
  return text.replace(/\*\*|\^\^|\[|\]/g, '');
}

export function parseEnhancementRestriction(description: string): {
  /** OR groups of AND keywords — unit satisfies if any group is fully present */
  required: string[][];
  /** Unit is excluded if it has any of these keywords */
  excluded: string[];
} {
  const clean = stripMarkdown(description);

  // Pattern 1: "X model (excluding Y) only."
  // Pattern 2: "X model only (excluding Y)."
  // Pattern 3: "X model with the Z ability only."
  const match =
    clean.match(/^(.+?)\s+model\s*(?:\(excluding\s+(.+?)\s+models?\))?\s*(?:with\s+.+?\s+)?only[.,\s]/i) ??
    clean.match(/^(.+?)\s+model\s*(?:with\s+.+?\s+)?only\s+\(excluding\s+(.+?)\s+models?\)[.,\s]/i);

  if (!match) return { required: [], excluded: [] };

  const requiredStr = match[1].trim();
  const excludedStr = (match[2] ?? '').trim();

  // Split required by " or " → each element is an AND group split by whitespace
  const required = requiredStr
    .split(/\s+or\s+/i)
    .map(group => group.trim().split(/\s+/).map(w => w.toLowerCase()));

  const excluded = excludedStr
    ? excludedStr.split(/\s+or\s+/i).map(s => s.trim().toLowerCase())
    : [];

  return { required, excluded };
}

/**
 * Returns true if the unit is eligible to take the enhancement.
 *
 * @param allUnitKeywords  Lowercase set of all keywords that appear on ANY unit in the
 *                         available pool. Used to distinguish unit-level keywords (like
 *                         "kroot", "walker") from faction-level ones (like "t'au empire").
 */
export function isEnhancementEligible(
  enhancement: EnhancementLike,
  unit: UnitLike,
  allUnitKeywords: Set<string>,
): boolean {
  const { required, excluded } = parseEnhancementRestriction(enhancement.description);
  if (required.length === 0 && excluded.length === 0) return true;

  const unitKeys = new Set((unit.keywords ?? []).map(k => k.toLowerCase()));

  // Exclusions — only enforce if the keyword is a known unit-level keyword
  for (const exc of excluded) {
    if (allUnitKeywords.has(exc) && unitKeys.has(exc)) return false;
  }

  // Required — unit must satisfy at least one OR group entirely
  if (required.length > 0) {
    const satisfied = required.some(andGroup =>
      andGroup.every(token => {
        // If this token doesn't appear in any unit's keywords it's faction-level → always pass
        if (!allUnitKeywords.has(token)) return true;
        return unitKeys.has(token);
      }),
    );
    if (!satisfied) return false;
  }

  return true;
}

/** Builds the set of all unit-level keywords from an array of units. */
export function buildAllUnitKeywords(units: UnitLike[]): Set<string> {
  const set = new Set<string>();
  for (const u of units) {
    for (const k of u.keywords ?? []) {
      set.add(k.toLowerCase());
    }
  }
  return set;
}
