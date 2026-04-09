/**
 * Hardcoded sample lists for the "Load Demo List" onboarding flow.
 *
 * Unit names are matched against the database at runtime (case-insensitive).
 * If the BSData parser renames a unit, the lookup will silently skip it and
 * the list will be created with whatever DID match — the user can edit from
 * there. Faction and battle-size IDs MUST match seed data.
 */

export interface SampleListUnit {
  /** Unit name as it appears in the units table (case-insensitive match). */
  name: string;
  modelCount: number;
}

export interface SampleList {
  /** Faction name as it appears in the factions table. */
  factionName: string;
  /** Battle size ID — must match a row in battle_sizes. */
  battleSizeId: string;
  /** Display name for the new army list. */
  listName: string;
  units: SampleListUnit[];
}

export const SAMPLE_LISTS: SampleList[] = [
  {
    factionName: 'Space Marines',
    battleSizeId: 'incursion',
    listName: 'Demo Strike Force',
    units: [
      { name: 'Captain in Gravis Armour', modelCount: 1 },
      { name: 'Intercessor Squad', modelCount: 5 },
      { name: 'Assault Intercessor Squad', modelCount: 5 },
      { name: 'Hellblaster Squad', modelCount: 5 },
      { name: 'Bladeguard Veteran Squad', modelCount: 3 },
      { name: 'Ballistus Dreadnought', modelCount: 1 },
    ],
  },
];
