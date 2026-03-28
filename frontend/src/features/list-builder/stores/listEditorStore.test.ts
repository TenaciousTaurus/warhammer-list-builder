import { describe, it, expect } from 'vitest';
import {
  selectTotalPoints,
  selectOverLimit,
  selectUnitCountsInList,
  selectUnitEnhancementMap,
  selectAssignedEnhancementIds,
  selectEnhancementLimitReached,
  selectUnitLimitWarnings,
  selectEnhancementWarnings,
  selectBattleSizeWarnings,
  selectFilteredUnits,
  selectUnitsByRole,
  selectFilteredAlliedUnits,
  selectSelectedLu,
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
