import { describe, it, expect } from 'vitest';
import {
  getUnitPoints,
  selectTotalPoints,
  selectOverLimit,
  selectUnitCountsInList,
  selectUnitEnhancementMap,
  selectAssignedEnhancementIds,
  selectEnhancementLimitReached,
  selectUnitLimitWarnings,
  selectEnhancementWarnings,
  selectBattleSizeWarnings,
  selectTransportWarnings,
  selectPointsMismatch,
  selectFilteredUnits,
  selectUnitsByRole,
  selectFilteredAlliedUnits,
  selectRosterByRole,
  selectRosterAlliedUnits,
  selectRosterSectionPoints,
  selectRosterAlliedPoints,
  selectSelectedLu,
  getEnhancementForUnit,
  getModelVariantsForUnit,
  getCompositionForUnit,
  getCompositionSummary,
  getWargearSummary,
  getEligibleLeaders,
  getAttachmentForTarget,
  isLeaderAttachedElsewhere,
  type UnitWithRelations,
  type ArmyListUnitWithDetails,
} from './listEditorStore';
import type { Enhancement } from '../../../shared/types/database';

// ============================================================
// Mock data factories
// ============================================================

function mockUnit(overrides?: Partial<UnitWithRelations>): UnitWithRelations {
  return {
    id: 'unit-1',
    faction_id: 'faction-1',
    name: 'Intercessors',
    role: 'battleline',
    movement: '6"',
    toughness: 4,
    save: '3+',
    wounds: 2,
    leadership: 6,
    objective_control: 2,
    keywords: ['Infantry', 'Battleline'],
    max_per_list: 6,
    is_legends: false,
    transport_capacity: null,
    transport_keywords_allowed: null,
    transport_keywords_excluded: null,
    created_at: '2025-01-01T00:00:00Z',
    unit_points_tiers: [
      { id: 't1', unit_id: 'unit-1', model_count: 5, points: 90 },
      { id: 't2', unit_id: 'unit-1', model_count: 10, points: 180 },
    ],
    abilities: [],
    weapons: [],
    ...overrides,
  } as UnitWithRelations;
}

function mockListUnit(overrides?: Partial<ArmyListUnitWithDetails>): ArmyListUnitWithDetails {
  const unit = mockUnit();
  return {
    id: 'alu-1',
    army_list_id: 'list-1',
    unit_id: unit.id,
    model_count: 5,
    sort_order: 0,
    units: unit,
    ...overrides,
  } as ArmyListUnitWithDetails;
}

// Minimal store state for selectors
function mockState(overrides?: Record<string, unknown>) {
  return {
    listId: 'list-1',
    list: {
      id: 'list-1',
      faction_id: 'faction-1',
      detachment_id: 'det-1',
      name: 'Test List',
      points_limit: 2000,
      battle_size: 'strike_force',
      user_id: 'user-1',
      detachments: { id: 'det-1', faction_id: 'faction-1', name: 'Test Detachment' },
    },
    listUnits: [] as ArmyListUnitWithDetails[],
    availableUnits: [] as UnitWithRelations[],
    enhancements: [] as Enhancement[],
    listEnhancements: [] as { id: string; enhancement_id: string; army_list_unit_id: string }[],
    wargearOptions: [],
    unitWargearSelections: new Map(),
    modelVariants: [],
    unitCompositions: new Map(),
    leaderTargets: [],
    leaderAttachments: [],
    alliedUnitIds: new Set<string>(),
    serverValidation: null,
    serverValidationError: false,
    loading: false,
    error: null,
    showExport: false,
    unitPickerFilter: '',
    selectedArmyListUnitId: null,
    collapsedPickerRoles: new Set<string>(),
    showLegends: false,
    ...overrides,
  };
}

// ============================================================
// Tests
// ============================================================

describe('selectTotalPoints', () => {
  it('calculates total from units + enhancements', () => {
    const unit1 = mockUnit({ id: 'u1', unit_points_tiers: [{ id: 't1', unit_id: 'u1', model_count: 5, points: 90 }] });
    const unit2 = mockUnit({ id: 'u2', name: 'Captain', role: 'character', unit_points_tiers: [{ id: 't2', unit_id: 'u2', model_count: 1, points: 80 }] });

    const state = mockState({
      listUnits: [
        mockListUnit({ id: 'alu-1', unit_id: 'u1', model_count: 5, units: unit1 }),
        mockListUnit({ id: 'alu-2', unit_id: 'u2', model_count: 1, units: unit2 }),
      ],
      enhancements: [{ id: 'enh-1', name: 'Iron Resolve', points: 25 }],
      listEnhancements: [{ id: 'le-1', enhancement_id: 'enh-1', army_list_unit_id: 'alu-2' }],
    });

    // 90 (intercessors) + 80 (captain) + 25 (enhancement) = 195
    expect(selectTotalPoints(state as never)).toBe(195);
  });

  it('returns 0 for empty list', () => {
    const state = mockState();
    expect(selectTotalPoints(state as never)).toBe(0);
  });
});

describe('selectOverLimit', () => {
  it('returns false when under limit', () => {
    const state = mockState({ list: { ...mockState().list, points_limit: 2000 } });
    expect(selectOverLimit(state as never)).toBe(false);
  });

  it('returns true when over limit', () => {
    const unit = mockUnit({ unit_points_tiers: [{ id: 't1', unit_id: 'unit-1', model_count: 5, points: 1500 }] });
    const state = mockState({
      list: { ...mockState().list, points_limit: 1000 },
      listUnits: [mockListUnit({ model_count: 5, units: unit })],
    });
    expect(selectOverLimit(state as never)).toBe(true);
  });
});

describe('selectUnitCountsInList', () => {
  it('counts units by unit_id', () => {
    const unit = mockUnit({ id: 'u1' });
    const state = mockState({
      listUnits: [
        mockListUnit({ id: 'alu-1', unit_id: 'u1', units: unit }),
        mockListUnit({ id: 'alu-2', unit_id: 'u1', units: unit }),
        mockListUnit({ id: 'alu-3', unit_id: 'u2', units: mockUnit({ id: 'u2', name: 'Other' }) }),
      ],
    });

    const counts = selectUnitCountsInList(state as never);
    expect(counts.get('u1')).toBe(2);
    expect(counts.get('u2')).toBe(1);
  });
});

describe('selectUnitEnhancementMap', () => {
  it('maps army_list_unit_id to enhancement info', () => {
    const state = mockState({
      listEnhancements: [
        { id: 'le-1', enhancement_id: 'enh-1', army_list_unit_id: 'alu-1' },
        { id: 'le-2', enhancement_id: 'enh-2', army_list_unit_id: 'alu-3' },
      ],
    });

    const map = selectUnitEnhancementMap(state as never);
    expect(map.get('alu-1')).toEqual({ enhancementId: 'enh-1', listEnhancementId: 'le-1' });
    expect(map.get('alu-3')).toEqual({ enhancementId: 'enh-2', listEnhancementId: 'le-2' });
    expect(map.has('alu-2')).toBe(false);
  });
});

describe('selectAssignedEnhancementIds', () => {
  it('returns a set of assigned enhancement IDs', () => {
    const state = mockState({
      listEnhancements: [
        { id: 'le-1', enhancement_id: 'enh-1', army_list_unit_id: 'alu-1' },
        { id: 'le-2', enhancement_id: 'enh-2', army_list_unit_id: 'alu-2' },
      ],
    });

    const ids = selectAssignedEnhancementIds(state as never);
    expect(ids.has('enh-1')).toBe(true);
    expect(ids.has('enh-2')).toBe(true);
    expect(ids.has('enh-3')).toBe(false);
  });
});

describe('selectEnhancementLimitReached', () => {
  it('returns false when under 3', () => {
    const state = mockState({
      listEnhancements: [{ id: 'le-1', enhancement_id: 'enh-1', army_list_unit_id: 'alu-1' }],
    });
    expect(selectEnhancementLimitReached(state as never)).toBe(false);
  });

  it('returns true when at 3', () => {
    const state = mockState({
      listEnhancements: [
        { id: 'le-1', enhancement_id: 'enh-1', army_list_unit_id: 'alu-1' },
        { id: 'le-2', enhancement_id: 'enh-2', army_list_unit_id: 'alu-2' },
        { id: 'le-3', enhancement_id: 'enh-3', army_list_unit_id: 'alu-3' },
      ],
    });
    expect(selectEnhancementLimitReached(state as never)).toBe(true);
  });
});

describe('selectUnitLimitWarnings', () => {
  it('warns when a unit exceeds its max_per_list', () => {
    const unit = mockUnit({ id: 'u1', name: 'Intercessors', max_per_list: 3 });
    const state = mockState({
      listUnits: [
        mockListUnit({ id: 'alu-1', unit_id: 'u1', units: unit }),
        mockListUnit({ id: 'alu-2', unit_id: 'u1', units: unit }),
        mockListUnit({ id: 'alu-3', unit_id: 'u1', units: unit }),
        mockListUnit({ id: 'alu-4', unit_id: 'u1', units: unit }),
      ],
    });

    const warnings = selectUnitLimitWarnings(state as never);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('Intercessors');
    expect(warnings[0]).toContain('4/3');
  });

  it('returns empty for valid lists', () => {
    const unit = mockUnit({ id: 'u1', max_per_list: 6 });
    const state = mockState({
      listUnits: [mockListUnit({ unit_id: 'u1', units: unit })],
    });
    expect(selectUnitLimitWarnings(state as never)).toEqual([]);
  });
});

describe('selectEnhancementWarnings', () => {
  it('warns when too many enhancements', () => {
    const state = mockState({
      listEnhancements: [
        { id: 'le-1', enhancement_id: 'enh-1', army_list_unit_id: 'alu-1' },
        { id: 'le-2', enhancement_id: 'enh-2', army_list_unit_id: 'alu-2' },
        { id: 'le-3', enhancement_id: 'enh-3', army_list_unit_id: 'alu-3' },
        { id: 'le-4', enhancement_id: 'enh-4', army_list_unit_id: 'alu-4' },
      ],
      listUnits: [],
      enhancements: [],
    });

    const warnings = selectEnhancementWarnings(state as never);
    expect(warnings.some(w => w.includes('4/3'))).toBe(true);
  });

  it('warns when epic hero has enhancement', () => {
    const epicHero = mockUnit({ id: 'u1', name: 'Guilliman', role: 'epic_hero' });
    const state = mockState({
      listUnits: [mockListUnit({ id: 'alu-1', unit_id: 'u1', units: epicHero })],
      listEnhancements: [{ id: 'le-1', enhancement_id: 'enh-1', army_list_unit_id: 'alu-1' }],
      enhancements: [{ id: 'enh-1', name: 'Iron Resolve', points: 25 }],
    });

    const warnings = selectEnhancementWarnings(state as never);
    expect(warnings.some(w => w.includes('Epic Hero'))).toBe(true);
  });
});

describe('selectBattleSizeWarnings', () => {
  it('warns when points limit mismatches battle size', () => {
    const state = mockState({
      list: { ...mockState().list, battle_size: 'strike_force', points_limit: 1500 },
    });

    const warnings = selectBattleSizeWarnings(state as never);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('Strike Force');
    expect(warnings[0]).toContain('2000');
  });

  it('returns empty when correct', () => {
    const state = mockState({
      list: { ...mockState().list, battle_size: 'strike_force', points_limit: 2000 },
    });
    expect(selectBattleSizeWarnings(state as never)).toEqual([]);
  });
});

describe('selectFilteredUnits', () => {
  it('filters by search query', () => {
    const units = [
      mockUnit({ id: 'u1', name: 'Intercessors' }),
      mockUnit({ id: 'u2', name: 'Captain' }),
    ];
    const state = mockState({
      availableUnits: units,
      unitPickerFilter: 'cap',
    });

    const filtered = selectFilteredUnits(state as never);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Captain');
  });

  it('excludes legends when showLegends is false', () => {
    const units = [
      mockUnit({ id: 'u1', name: 'Normal Unit', is_legends: false }),
      mockUnit({ id: 'u2', name: 'Legends Unit', is_legends: true }),
    ];
    const state = mockState({
      availableUnits: units,
      showLegends: false,
    });

    const filtered = selectFilteredUnits(state as never);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Normal Unit');
  });

  it('includes legends when showLegends is true', () => {
    const units = [
      mockUnit({ id: 'u1', name: 'Normal Unit', is_legends: false }),
      mockUnit({ id: 'u2', name: 'Legends Unit', is_legends: true }),
    ];
    const state = mockState({
      availableUnits: units,
      showLegends: true,
    });

    const filtered = selectFilteredUnits(state as never);
    expect(filtered).toHaveLength(2);
  });
});

describe('selectUnitsByRole', () => {
  it('groups non-allied units by role', () => {
    const units = [
      mockUnit({ id: 'u1', name: 'Intercessors', role: 'battleline' }),
      mockUnit({ id: 'u2', name: 'Captain', role: 'character' }),
      mockUnit({ id: 'u3', name: 'Knight', role: 'vehicle' }),
    ];
    const state = mockState({
      availableUnits: units,
      alliedUnitIds: new Set(['u3']),
    });

    const byRole = selectUnitsByRole(state as never);
    expect(byRole['battleline']).toHaveLength(1);
    expect(byRole['character']).toHaveLength(1);
    expect(byRole['vehicle']).toBeUndefined(); // u3 is allied
  });
});

describe('selectFilteredAlliedUnits', () => {
  it('returns only allied units from filtered set', () => {
    const units = [
      mockUnit({ id: 'u1', name: 'Intercessors' }),
      mockUnit({ id: 'u2', name: 'Imperial Knight' }),
    ];
    const state = mockState({
      availableUnits: units,
      alliedUnitIds: new Set(['u2']),
    });

    const allied = selectFilteredAlliedUnits(state as never);
    expect(allied).toHaveLength(1);
    expect(allied[0].name).toBe('Imperial Knight');
  });
});

describe('selectSelectedLu', () => {
  it('returns selected list unit', () => {
    const lu = mockListUnit({ id: 'alu-1' });
    const state = mockState({
      listUnits: [lu],
      selectedArmyListUnitId: 'alu-1',
    });

    expect(selectSelectedLu(state as never)).toBe(lu);
  });

  it('returns null when nothing selected', () => {
    const state = mockState({ selectedArmyListUnitId: null });
    expect(selectSelectedLu(state as never)).toBeNull();
  });
});

// ============================================================
// Additional selector tests
// ============================================================

describe('getUnitPoints', () => {
  it('returns points for exact tier match', () => {
    const unit = mockUnit({
      unit_points_tiers: [
        { id: 't1', unit_id: 'unit-1', model_count: 5, points: 90 },
        { id: 't2', unit_id: 'unit-1', model_count: 10, points: 180 },
      ],
    });
    expect(getUnitPoints(unit, 5)).toBe(90);
    expect(getUnitPoints(unit, 10)).toBe(180);
  });

  it('returns highest applicable tier for intermediate counts', () => {
    const unit = mockUnit({
      unit_points_tiers: [
        { id: 't1', unit_id: 'unit-1', model_count: 5, points: 90 },
        { id: 't2', unit_id: 'unit-1', model_count: 10, points: 180 },
      ],
    });
    expect(getUnitPoints(unit, 7)).toBe(90);
  });

  it('returns 0 when model count below all tiers', () => {
    const unit = mockUnit({
      unit_points_tiers: [
        { id: 't1', unit_id: 'unit-1', model_count: 5, points: 90 },
      ],
    });
    expect(getUnitPoints(unit, 1)).toBe(0);
  });

  it('handles unsorted tiers', () => {
    const unit = mockUnit({
      unit_points_tiers: [
        { id: 't2', unit_id: 'unit-1', model_count: 10, points: 180 },
        { id: 't1', unit_id: 'unit-1', model_count: 5, points: 90 },
      ],
    });
    expect(getUnitPoints(unit, 10)).toBe(180);
  });
});

describe('selectTransportWarnings', () => {
  it('warns when eligible models exceed transport capacity', () => {
    const transport = mockUnit({
      id: 'transport-1',
      name: 'Rhino',
      role: 'dedicated_transport',
      transport_capacity: 12,
      transport_keywords_allowed: ['Infantry'],
      transport_keywords_excluded: ['Terminator'],
    });

    const infantry = mockUnit({ id: 'inf-1', name: 'Intercessors', keywords: ['Infantry'] });

    const state = mockState({
      listUnits: [
        mockListUnit({ id: 'alu-t', unit_id: 'transport-1', model_count: 1, units: transport }),
        mockListUnit({ id: 'alu-1', unit_id: 'inf-1', model_count: 10, units: infantry }),
        mockListUnit({ id: 'alu-2', unit_id: 'inf-1', model_count: 5, units: infantry }),
      ],
    });

    const warnings = selectTransportWarnings(state as never);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('Rhino');
    expect(warnings[0]).toContain('15');
  });

  it('excludes units with excluded keywords', () => {
    const transport = mockUnit({
      id: 'transport-1',
      name: 'Rhino',
      role: 'dedicated_transport',
      transport_capacity: 12,
      transport_keywords_allowed: ['Infantry'],
      transport_keywords_excluded: ['Terminator'],
    });

    const terminators = mockUnit({ id: 'term-1', name: 'Terminators', keywords: ['Infantry', 'Terminator'] });

    const state = mockState({
      listUnits: [
        mockListUnit({ id: 'alu-t', unit_id: 'transport-1', model_count: 1, units: transport }),
        mockListUnit({ id: 'alu-1', unit_id: 'term-1', model_count: 5, units: terminators }),
      ],
    });

    const warnings = selectTransportWarnings(state as never);
    expect(warnings).toEqual([]);
  });

  it('returns empty when no transports', () => {
    const state = mockState({
      listUnits: [mockListUnit()],
    });
    expect(selectTransportWarnings(state as never)).toEqual([]);
  });
});

describe('selectPointsMismatch', () => {
  it('returns true when server and local points differ', () => {
    const state = mockState({
      serverValidation: { total_points: 100 },
      listUnits: [mockListUnit({ model_count: 5, units: mockUnit() })],
    });
    // Local total: 90 (from mockUnit tier), server: 100
    expect(selectPointsMismatch(state as never)).toBe(true);
  });

  it('returns false when no server validation', () => {
    const state = mockState({ serverValidation: null });
    expect(selectPointsMismatch(state as never)).toBe(false);
  });

  it('returns false when points match', () => {
    const state = mockState({
      serverValidation: { total_points: 90 },
      listUnits: [mockListUnit({ model_count: 5, units: mockUnit() })],
    });
    expect(selectPointsMismatch(state as never)).toBe(false);
  });
});

describe('selectRosterByRole', () => {
  it('groups list units by role, excluding allied', () => {
    const battleline = mockUnit({ id: 'u1', role: 'battleline' });
    const character = mockUnit({ id: 'u2', name: 'Captain', role: 'character' });
    const allied = mockUnit({ id: 'u3', name: 'Knight', role: 'vehicle' });

    const state = mockState({
      listUnits: [
        mockListUnit({ id: 'alu-1', unit_id: 'u1', units: battleline }),
        mockListUnit({ id: 'alu-2', unit_id: 'u2', units: character }),
        mockListUnit({ id: 'alu-3', unit_id: 'u3', units: allied }),
      ],
      alliedUnitIds: new Set(['u3']),
    });

    const byRole = selectRosterByRole(state as never);
    expect(byRole['battleline']).toHaveLength(1);
    expect(byRole['character']).toHaveLength(1);
    expect(byRole['vehicle']).toBeUndefined();
  });
});

describe('selectRosterAlliedUnits', () => {
  it('returns only allied units from roster', () => {
    const mainUnit = mockUnit({ id: 'u1' });
    const alliedUnit = mockUnit({ id: 'u2', name: 'Knight' });

    const state = mockState({
      listUnits: [
        mockListUnit({ id: 'alu-1', unit_id: 'u1', units: mainUnit }),
        mockListUnit({ id: 'alu-2', unit_id: 'u2', units: alliedUnit }),
      ],
      alliedUnitIds: new Set(['u2']),
    });

    const allied = selectRosterAlliedUnits(state as never);
    expect(allied).toHaveLength(1);
    expect(allied[0].units.name).toBe('Knight');
  });
});

describe('selectRosterSectionPoints', () => {
  it('sums points by role including enhancements', () => {
    const unit1 = mockUnit({ id: 'u1', role: 'battleline' });
    const unit2 = mockUnit({ id: 'u2', name: 'Captain', role: 'character', unit_points_tiers: [{ id: 't1', unit_id: 'u2', model_count: 1, points: 80 }] });

    const state = mockState({
      listUnits: [
        mockListUnit({ id: 'alu-1', unit_id: 'u1', model_count: 5, units: unit1 }),
        mockListUnit({ id: 'alu-2', unit_id: 'u2', model_count: 1, units: unit2 }),
      ],
      enhancements: [{ id: 'enh-1', name: 'Iron Resolve', points: 25 }] as Enhancement[],
      listEnhancements: [{ id: 'le-1', enhancement_id: 'enh-1', army_list_unit_id: 'alu-2' }],
    });

    const points = selectRosterSectionPoints(state as never);
    expect(points['battleline']).toBe(90);
    expect(points['character']).toBe(105); // 80 + 25
  });
});

describe('selectRosterAlliedPoints', () => {
  it('sums allied unit points', () => {
    const alliedUnit = mockUnit({ id: 'u2', unit_points_tiers: [{ id: 't1', unit_id: 'u2', model_count: 1, points: 150 }] });

    const state = mockState({
      listUnits: [
        mockListUnit({ id: 'alu-1', unit_id: 'u1', model_count: 5 }),
        mockListUnit({ id: 'alu-2', unit_id: 'u2', model_count: 1, units: alliedUnit }),
      ],
      alliedUnitIds: new Set(['u2']),
    });

    expect(selectRosterAlliedPoints(state as never)).toBe(150);
  });
});

describe('getEnhancementForUnit', () => {
  it('returns the enhancement assigned to a unit', () => {
    const enh = { id: 'enh-1', name: 'Iron Resolve', points: 25 } as Enhancement;
    const state = mockState({
      enhancements: [enh],
      listEnhancements: [{ id: 'le-1', enhancement_id: 'enh-1', army_list_unit_id: 'alu-1' }],
    });

    expect(getEnhancementForUnit(state as never, 'alu-1')).toEqual(enh);
  });

  it('returns null when no enhancement', () => {
    const state = mockState();
    expect(getEnhancementForUnit(state as never, 'alu-1')).toBeNull();
  });
});

describe('getModelVariantsForUnit', () => {
  it('filters variants by unit_id', () => {
    const state = mockState({
      modelVariants: [
        { id: 'v1', unit_id: 'unit-1', name: 'Sergeant', min_count: 1, max_count: 1 },
        { id: 'v2', unit_id: 'unit-1', name: 'Marine', min_count: 4, max_count: 9 },
        { id: 'v3', unit_id: 'unit-2', name: 'Other', min_count: 1, max_count: 1 },
      ],
    });

    expect(getModelVariantsForUnit(state as never, 'unit-1')).toHaveLength(2);
  });
});

describe('getCompositionForUnit', () => {
  it('returns composition map for a list unit', () => {
    const comp = new Map([['v1', 1], ['v2', 4]]);
    const state = mockState({
      unitCompositions: new Map([['alu-1', comp]]),
    });

    expect(getCompositionForUnit(state as never, 'alu-1')).toBe(comp);
  });

  it('returns empty map when no composition', () => {
    const state = mockState();
    expect(getCompositionForUnit(state as never, 'alu-1').size).toBe(0);
  });
});

describe('getCompositionSummary', () => {
  it('returns formatted composition string', () => {
    const comp = new Map([['v2', 4]]);
    const state = mockState({
      modelVariants: [
        { id: 'v1', unit_id: 'unit-1', name: 'Sergeant', is_leader: true, min_count: 1, max_count: 1, default_count: 1, sort_order: 0 },
        { id: 'v2', unit_id: 'unit-1', name: 'Marine', is_leader: false, min_count: 4, max_count: 9, default_count: 4, sort_order: 1 },
      ],
      unitCompositions: new Map([['alu-1', comp]]),
    });

    const summary = getCompositionSummary(state as never, 'alu-1', 'unit-1');
    expect(summary).toContain('1x Sergeant');
    expect(summary).toContain('4x Marine');
  });

  it('returns empty for units with no variants', () => {
    const state = mockState();
    expect(getCompositionSummary(state as never, 'alu-1', 'unit-1')).toBe('');
  });
});

describe('getEligibleLeaders', () => {
  it('returns leader unit IDs that can lead the target', () => {
    const state = mockState({
      leaderTargets: [
        { id: 'lt-1', leader_unit_id: 'captain-1', target_unit_id: 'unit-1' },
        { id: 'lt-2', leader_unit_id: 'librarian-1', target_unit_id: 'unit-1' },
        { id: 'lt-3', leader_unit_id: 'captain-1', target_unit_id: 'unit-2' },
      ],
    });

    const leaders = getEligibleLeaders(state as never, 'unit-1');
    expect(leaders).toEqual(['captain-1', 'librarian-1']);
  });
});

describe('getAttachmentForTarget', () => {
  it('returns attachment for target unit', () => {
    const attachment = {
      id: 'la-1',
      leader_army_list_unit_id: 'alu-captain',
      target_army_list_unit_id: 'alu-1',
      army_list_id: 'list-1',
    };
    const state = mockState({
      leaderAttachments: [attachment],
    });

    expect(getAttachmentForTarget(state as never, 'alu-1')).toEqual(attachment);
  });

  it('returns undefined when no attachment', () => {
    const state = mockState();
    expect(getAttachmentForTarget(state as never, 'alu-1')).toBeUndefined();
  });
});

describe('isLeaderAttachedElsewhere', () => {
  it('returns true when leader is attached to a different target', () => {
    const state = mockState({
      leaderAttachments: [
        { id: 'la-1', leader_army_list_unit_id: 'alu-captain', target_army_list_unit_id: 'alu-other', army_list_id: 'list-1' },
      ],
    });

    expect(isLeaderAttachedElsewhere(state as never, 'alu-captain', 'alu-1')).toBe(true);
  });

  it('returns false when leader is attached to this target', () => {
    const state = mockState({
      leaderAttachments: [
        { id: 'la-1', leader_army_list_unit_id: 'alu-captain', target_army_list_unit_id: 'alu-1', army_list_id: 'list-1' },
      ],
    });

    expect(isLeaderAttachedElsewhere(state as never, 'alu-captain', 'alu-1')).toBe(false);
  });

  it('returns false when leader has no attachments', () => {
    const state = mockState();
    expect(isLeaderAttachedElsewhere(state as never, 'alu-captain', 'alu-1')).toBe(false);
  });
});

describe('getWargearSummary', () => {
  it('returns default option names from multi-option groups when no selections exist', () => {
    const state = mockState({
      wargearOptions: [
        // Multi-option group: should pick the default
        { id: 'w1', unit_id: 'unit-1', group_name: 'Pistol', name: 'Bolt pistol', is_default: true },
        { id: 'w2', unit_id: 'unit-1', group_name: 'Pistol', name: 'Plasma pistol', is_default: false },
        // Single-option group: should NOT contribute (defaults logic only adds when group has >1)
        { id: 'w3', unit_id: 'unit-1', group_name: 'Melee', name: 'Combat knife', is_default: true },
        // Different unit, should be ignored
        { id: 'w4', unit_id: 'other-unit', group_name: 'Pistol', name: 'Boltgun', is_default: true },
      ],
    });

    expect(getWargearSummary(state as never, 'alu-1', 'unit-1')).toBe('Bolt pistol');
  });

  it('returns selected option names when selections exist', () => {
    const selections = new Map<string, Map<string, string>>();
    const unitSelections = new Map<string, string>();
    unitSelections.set('Pistol', 'w2');
    unitSelections.set('Special', 'w5');
    selections.set('alu-1', unitSelections);

    const state = mockState({
      unitWargearSelections: selections,
      wargearOptions: [
        { id: 'w1', unit_id: 'unit-1', group_name: 'Pistol', name: 'Bolt pistol', is_default: true },
        { id: 'w2', unit_id: 'unit-1', group_name: 'Pistol', name: 'Plasma pistol', is_default: false },
        { id: 'w5', unit_id: 'unit-1', group_name: 'Special', name: 'Melta gun', is_default: false },
      ],
    });

    const summary = getWargearSummary(state as never, 'alu-1', 'unit-1');
    expect(summary).toContain('Plasma pistol');
    expect(summary).toContain('Melta gun');
  });

  it('returns empty string when unit has no wargear options at all', () => {
    const state = mockState();
    expect(getWargearSummary(state as never, 'alu-1', 'unit-1')).toBe('');
  });
});
