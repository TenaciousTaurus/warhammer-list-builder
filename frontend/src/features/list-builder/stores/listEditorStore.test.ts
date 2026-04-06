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

// ============================================================
// Store ACTION tests
// ============================================================

import { useListEditorStore } from './listEditorStore';
import { vi, beforeEach } from 'vitest';
import { supabase } from '../../../shared/lib/supabase';

/** Create a chainable mock that resolves when awaited */
function mockChain(resolvedValue: Record<string, unknown> = { data: null, error: null }) {
  const chain: Record<string, unknown> = {};
  const methods = ['select', 'insert', 'update', 'delete', 'upsert', 'eq', 'in', 'or', 'order', 'single'];
  for (const m of methods) {
    chain[m] = vi.fn(() => chain);
  }
  // Make it thenable so `await` resolves
  chain.then = vi.fn((resolve: (v: unknown) => void) => {
    resolve(resolvedValue);
    return chain;
  });
  return chain;
}

/** Helper: set store to a known baseline state and configure supabase mock */
function resetStore(overrides?: Record<string, unknown>) {
  // Configure supabase.from to return a properly resolving chain
  vi.mocked(supabase.from).mockImplementation(() => mockChain() as never);

  useListEditorStore.setState({
    ...mockState(),
    // Provide no-op defaults for internal helpers so actions don't throw
    _refetch: vi.fn().mockResolvedValue(undefined),
    _fetchServerValidation: vi.fn(),
    availableDetachments: [],
    ...overrides,
  } as never);
}

describe('addUnit action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetStore();
  });

  it('does not add a unit when max_per_list is reached', async () => {
    const unit = mockUnit({ id: 'u1', max_per_list: 1 });
    resetStore({
      listUnits: [mockListUnit({ id: 'alu-1', unit_id: 'u1', units: unit })],
    });

    await useListEditorStore.getState().addUnit(unit);

    // supabase.from should NOT have been called for an insert
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('does nothing when listId is null', async () => {
    resetStore({ listId: null });
    const unit = mockUnit({ id: 'u1' });

    await useListEditorStore.getState().addUnit(unit);

    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('calls supabase insert with correct table and data', async () => {
    const unit = mockUnit({
      id: 'u1',
      max_per_list: 3,
      unit_points_tiers: [
        { id: 't1', unit_id: 'u1', model_count: 5, points: 90 },
        { id: 't2', unit_id: 'u1', model_count: 10, points: 180 },
      ],
    });
    resetStore({ listUnits: [], listId: 'list-1' });

    await useListEditorStore.getState().addUnit(unit);

    expect(supabase.from).toHaveBeenCalledWith('army_list_units');
  });
});

describe('removeUnit action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetStore();
  });

  it('clears selectedArmyListUnitId when removing the selected unit', async () => {
    resetStore({ selectedArmyListUnitId: 'alu-1' });

    await useListEditorStore.getState().removeUnit('alu-1');

    expect(useListEditorStore.getState().selectedArmyListUnitId).toBeNull();
  });

  it('does not clear selectedArmyListUnitId when removing a different unit', async () => {
    resetStore({ selectedArmyListUnitId: 'alu-2' });

    await useListEditorStore.getState().removeUnit('alu-1');

    expect(useListEditorStore.getState().selectedArmyListUnitId).toBe('alu-2');
  });

  it('calls supabase delete on army_list_units', async () => {
    resetStore();

    await useListEditorStore.getState().removeUnit('alu-1');

    expect(supabase.from).toHaveBeenCalledWith('army_list_units');
  });
});

describe('selectWargear action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetStore();
  });

  it('optimistically updates unitWargearSelections Map', async () => {
    resetStore({ unitWargearSelections: new Map() });

    await useListEditorStore.getState().selectWargear('alu-1', 'ranged_weapon', 'opt-1');

    const selections = useListEditorStore.getState().unitWargearSelections;
    expect(selections.has('alu-1')).toBe(true);
    expect(selections.get('alu-1')!.get('ranged_weapon')).toBe('opt-1');
  });

  it('replaces an existing wargear selection for the same group', async () => {
    const initial = new Map<string, Map<string, string>>();
    initial.set('alu-1', new Map([['ranged_weapon', 'opt-old']]));
    resetStore({ unitWargearSelections: initial });

    await useListEditorStore.getState().selectWargear('alu-1', 'ranged_weapon', 'opt-new');

    const selections = useListEditorStore.getState().unitWargearSelections;
    expect(selections.get('alu-1')!.get('ranged_weapon')).toBe('opt-new');
  });

  it('calls supabase delete on old selection and insert for new', async () => {
    const initial = new Map<string, Map<string, string>>();
    initial.set('alu-1', new Map([['ranged_weapon', 'opt-old']]));
    resetStore({ unitWargearSelections: initial });

    await useListEditorStore.getState().selectWargear('alu-1', 'ranged_weapon', 'opt-new');

    // from() called for delete (old) and insert (new)
    expect(supabase.from).toHaveBeenCalledWith('army_list_unit_wargear');
  });
});

describe('reorderUnits action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('optimistically reorders the listUnits array', async () => {
    const lu0 = mockListUnit({ id: 'alu-0', sort_order: 0 });
    const lu1 = mockListUnit({ id: 'alu-1', sort_order: 1 });
    const lu2 = mockListUnit({ id: 'alu-2', sort_order: 2 });
    resetStore({ listUnits: [lu0, lu1, lu2] });

    // Move index 0 to index 2
    await useListEditorStore.getState().reorderUnits(0, 2);

    const ids = useListEditorStore.getState().listUnits.map(lu => lu.id);
    expect(ids).toEqual(['alu-1', 'alu-2', 'alu-0']);
  });

  it('does nothing when fromIndex equals toIndex', async () => {
    const lu0 = mockListUnit({ id: 'alu-0', sort_order: 0 });
    resetStore({ listUnits: [lu0] });

    await useListEditorStore.getState().reorderUnits(0, 0);

    expect(supabase.from).not.toHaveBeenCalled();
  });
});

describe('updateListName action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetStore();
  });

  it('optimistically updates list.name', async () => {
    await useListEditorStore.getState().updateListName('New Name');

    expect(useListEditorStore.getState().list!.name).toBe('New Name');
  });

  it('calls supabase update on army_lists', async () => {
    await useListEditorStore.getState().updateListName('New Name');

    expect(supabase.from).toHaveBeenCalledWith('army_lists');
  });

  it('does nothing when listId is null', async () => {
    resetStore({ listId: null });

    await useListEditorStore.getState().updateListName('New Name');

    expect(supabase.from).not.toHaveBeenCalled();
  });
});

describe('updatePointsLimit action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetStore();
  });

  it('optimistically updates list.points_limit', async () => {
    await useListEditorStore.getState().updatePointsLimit(1000);

    expect(useListEditorStore.getState().list!.points_limit).toBe(1000);
  });

  it('calls supabase update on army_lists', async () => {
    await useListEditorStore.getState().updatePointsLimit(1500);

    expect(supabase.from).toHaveBeenCalledWith('army_lists');
  });

  it('does nothing when listId is null', async () => {
    resetStore({ listId: null });

    await useListEditorStore.getState().updatePointsLimit(1500);

    expect(supabase.from).not.toHaveBeenCalled();
  });
});

describe('UI actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetStore();
  });

  it('setUnitPickerFilter updates the filter string', () => {
    useListEditorStore.getState().setUnitPickerFilter('captain');

    expect(useListEditorStore.getState().unitPickerFilter).toBe('captain');
  });

  it('setUnitPickerFilter clears the filter', () => {
    useListEditorStore.getState().setUnitPickerFilter('captain');
    useListEditorStore.getState().setUnitPickerFilter('');

    expect(useListEditorStore.getState().unitPickerFilter).toBe('');
  });

  it('toggleLegends flips showLegends from false to true', () => {
    resetStore({ showLegends: false });

    useListEditorStore.getState().toggleLegends();

    expect(useListEditorStore.getState().showLegends).toBe(true);
  });

  it('toggleLegends flips showLegends from true to false', () => {
    resetStore({ showLegends: true });

    useListEditorStore.getState().toggleLegends();

    expect(useListEditorStore.getState().showLegends).toBe(false);
  });

  it('setSelectedArmyListUnitId sets the selected unit', () => {
    useListEditorStore.getState().setSelectedArmyListUnitId('alu-5');

    expect(useListEditorStore.getState().selectedArmyListUnitId).toBe('alu-5');
  });

  it('setSelectedArmyListUnitId clears with null', () => {
    useListEditorStore.getState().setSelectedArmyListUnitId('alu-5');
    useListEditorStore.getState().setSelectedArmyListUnitId(null);

    expect(useListEditorStore.getState().selectedArmyListUnitId).toBeNull();
  });

  it('togglePickerRole adds a role to collapsedPickerRoles', () => {
    resetStore({ collapsedPickerRoles: new Set<string>() });

    useListEditorStore.getState().togglePickerRole('battleline');

    expect(useListEditorStore.getState().collapsedPickerRoles.has('battleline')).toBe(true);
  });

  it('togglePickerRole removes a role that is already collapsed', () => {
    resetStore({ collapsedPickerRoles: new Set<string>(['battleline']) });

    useListEditorStore.getState().togglePickerRole('battleline');

    expect(useListEditorStore.getState().collapsedPickerRoles.has('battleline')).toBe(false);
  });
});
