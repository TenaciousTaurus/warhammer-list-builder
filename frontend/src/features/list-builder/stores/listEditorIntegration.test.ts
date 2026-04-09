import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  useListEditorStore,
  selectTotalPoints,
  selectOverLimit,
  selectUnitCountsInList,
  selectEnhancementLimitReached,
  selectUnitLimitWarnings,
  selectEnhancementWarnings,
  selectRosterByRole,
  selectRosterSectionPoints,
  type UnitWithRelations,
  type ArmyListUnitWithDetails,
} from './listEditorStore';
import type { Enhancement } from '../../../shared/types/database';
import { supabase } from '../../../shared/lib/supabase';

// ============================================================
// Shared mock factories
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

function mockChain(resolvedValue: Record<string, unknown> = { data: null, error: null }) {
  const chain: Record<string, unknown> = {};
  const methods = ['select', 'insert', 'update', 'delete', 'upsert', 'eq', 'in', 'or', 'order', 'single'];
  for (const m of methods) {
    chain[m] = vi.fn(() => chain);
  }
  chain.then = vi.fn((resolve: (v: unknown) => void) => {
    resolve(resolvedValue);
    return chain;
  });
  return chain;
}

function setupFullList() {
  const captain = mockUnit({
    id: 'u-captain',
    name: 'Captain in Terminator Armour',
    role: 'character',
    max_per_list: 1,
    unit_points_tiers: [{ id: 'tc1', unit_id: 'u-captain', model_count: 1, points: 95 }],
  });
  const intercessors = mockUnit({
    id: 'u-inter',
    name: 'Intercessors',
    role: 'battleline',
    max_per_list: 6,
    unit_points_tiers: [
      { id: 'ti1', unit_id: 'u-inter', model_count: 5, points: 90 },
      { id: 'ti2', unit_id: 'u-inter', model_count: 10, points: 180 },
    ],
  });
  const epicHero = mockUnit({
    id: 'u-hero',
    name: 'Roboute Guilliman',
    role: 'epic_hero',
    max_per_list: 1,
    unit_points_tiers: [{ id: 'th1', unit_id: 'u-hero', model_count: 1, points: 350 }],
  });
  const eradicators = mockUnit({
    id: 'u-erad',
    name: 'Eradicators',
    role: 'infantry',
    max_per_list: 3,
    unit_points_tiers: [
      { id: 'te1', unit_id: 'u-erad', model_count: 3, points: 95 },
      { id: 'te2', unit_id: 'u-erad', model_count: 6, points: 190 },
    ],
  });

  const listUnits: ArmyListUnitWithDetails[] = [
    mockListUnit({ id: 'alu-hero', unit_id: 'u-hero', model_count: 1, sort_order: 0, units: epicHero }),
    mockListUnit({ id: 'alu-cap', unit_id: 'u-captain', model_count: 1, sort_order: 1, units: captain }),
    mockListUnit({ id: 'alu-int1', unit_id: 'u-inter', model_count: 10, sort_order: 2, units: intercessors }),
    mockListUnit({ id: 'alu-int2', unit_id: 'u-inter', model_count: 5, sort_order: 3, units: intercessors }),
    mockListUnit({ id: 'alu-erad', unit_id: 'u-erad', model_count: 3, sort_order: 4, units: eradicators }),
  ];

  const enhancements: Enhancement[] = [
    { id: 'enh-1', detachment_id: 'det-1', name: 'Iron Resolve', points: 25, description: '' },
    { id: 'enh-2', detachment_id: 'det-1', name: 'Storm of Fire', points: 20, description: '' },
    { id: 'enh-3', detachment_id: 'det-1', name: 'Bolter Discipline', points: 15, description: '' },
  ];

  vi.mocked(supabase.from).mockImplementation(() => mockChain() as never);

  useListEditorStore.setState({
    listId: 'list-1',
    list: {
      id: 'list-1',
      faction_id: 'faction-1',
      detachment_id: 'det-1',
      name: 'Ultramarines Strike Force',
      points_limit: 2000,
      battle_size: 'strike_force',
      user_id: 'user-1',
      detachments: { id: 'det-1', faction_id: 'faction-1', name: 'Gladius Task Force' },
    },
    listUnits,
    availableUnits: [captain, intercessors, epicHero, eradicators],
    enhancements,
    listEnhancements: [],
    wargearOptions: [],
    unitWargearSelections: new Map(),
    modelVariants: [],
    unitCompositions: new Map(),
    leaderTargets: [],
    leaderAttachments: [],
    alliedUnitIds: new Set(),
    availableDetachments: [],
    serverValidation: null,
    serverValidationError: false,
    loading: false,
    error: null,
    showExport: false,
    unitPickerFilter: '',
    selectedArmyListUnitId: null,
    collapsedPickerRoles: new Set(),
    showLegends: false,
    _refetch: vi.fn().mockResolvedValue(undefined),
    _fetchServerValidation: vi.fn(),
  } as never);

  return { captain, intercessors, epicHero, eradicators, listUnits, enhancements };
}

// ============================================================
// Integration Tests: Selector chains & cross-action flows
// ============================================================

describe('List Builder Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('full list → points calculation → validation chain', () => {
    it('calculates correct total points for a realistic army list', () => {
      setupFullList();
      const state = useListEditorStore.getState();

      // Guilliman(350) + Captain(95) + Intercessors x10(180) + Intercessors x5(90) + Eradicators x3(95) = 810
      expect(selectTotalPoints(state as never)).toBe(810);
    });

    it('reports under limit for a valid list', () => {
      setupFullList();
      const state = useListEditorStore.getState();

      expect(selectOverLimit(state as never)).toBe(false);
    });

    it('reports over limit when points exceed threshold', () => {
      setupFullList();
      useListEditorStore.setState({
        list: {
          ...useListEditorStore.getState().list!,
          points_limit: 500,
        },
      } as never);

      const state = useListEditorStore.getState();
      expect(selectOverLimit(state as never)).toBe(true);
    });
  });

  describe('unit counts + limit warnings', () => {
    it('correctly counts multiple copies of the same unit', () => {
      setupFullList();
      const state = useListEditorStore.getState();
      const counts = selectUnitCountsInList(state as never);

      expect(counts.get('u-inter')).toBe(2);
      expect(counts.get('u-hero')).toBe(1);
      expect(counts.get('u-captain')).toBe(1);
      expect(counts.get('u-erad')).toBe(1);
    });

    it('returns no warnings for a valid army', () => {
      setupFullList();
      const state = useListEditorStore.getState();
      expect(selectUnitLimitWarnings(state as never)).toEqual([]);
    });

    it('warns when a unit exceeds max_per_list', () => {
      const { captain } = setupFullList();

      // Add a second captain (max is 1)
      useListEditorStore.setState({
        listUnits: [
          ...useListEditorStore.getState().listUnits,
          mockListUnit({ id: 'alu-cap2', unit_id: 'u-captain', model_count: 1, sort_order: 5, units: captain }),
        ],
      } as never);

      const state = useListEditorStore.getState();
      const warnings = selectUnitLimitWarnings(state as never);
      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings[0]).toContain('Captain in Terminator Armour');
      expect(warnings[0]).toContain('2/1');
    });
  });

  describe('enhancement assignment flow', () => {
    it('starts with no enhancements and limit not reached', () => {
      setupFullList();
      const state = useListEditorStore.getState();

      expect(selectEnhancementLimitReached(state as never)).toBe(false);
      expect(selectEnhancementWarnings(state as never)).toEqual([]);
    });

    it('adding enhancements up to limit triggers limit reached', () => {
      setupFullList();

      useListEditorStore.setState({
        listEnhancements: [
          { id: 'le-1', enhancement_id: 'enh-1', army_list_unit_id: 'alu-cap' },
          { id: 'le-2', enhancement_id: 'enh-2', army_list_unit_id: 'alu-int1' },
          { id: 'le-3', enhancement_id: 'enh-3', army_list_unit_id: 'alu-int2' },
        ],
      } as never);

      const state = useListEditorStore.getState();
      expect(selectEnhancementLimitReached(state as never)).toBe(true);

      // Points should include enhancement costs: 810 + 25 + 20 + 15 = 870
      expect(selectTotalPoints(state as never)).toBe(870);
    });

    it('warns when epic hero is assigned an enhancement', () => {
      setupFullList();

      useListEditorStore.setState({
        listEnhancements: [
          { id: 'le-1', enhancement_id: 'enh-1', army_list_unit_id: 'alu-hero' },
        ],
      } as never);

      const state = useListEditorStore.getState();
      const warnings = selectEnhancementWarnings(state as never);
      expect(warnings.some(w => w.includes('Epic Hero'))).toBe(true);
    });

    it('exceeding 3 enhancements triggers a warning', () => {
      setupFullList();

      useListEditorStore.setState({
        listEnhancements: [
          { id: 'le-1', enhancement_id: 'enh-1', army_list_unit_id: 'alu-cap' },
          { id: 'le-2', enhancement_id: 'enh-2', army_list_unit_id: 'alu-int1' },
          { id: 'le-3', enhancement_id: 'enh-3', army_list_unit_id: 'alu-int2' },
          { id: 'le-4', enhancement_id: 'enh-1', army_list_unit_id: 'alu-erad' },
        ],
      } as never);

      const state = useListEditorStore.getState();
      const warnings = selectEnhancementWarnings(state as never);
      expect(warnings.some(w => w.includes('4/3'))).toBe(true);
    });
  });

  describe('roster grouping by role', () => {
    it('groups list units by role correctly', () => {
      setupFullList();
      const state = useListEditorStore.getState();
      const byRole = selectRosterByRole(state as never);

      expect(byRole['epic_hero']).toHaveLength(1);
      expect(byRole['epic_hero'][0].units.name).toBe('Roboute Guilliman');

      expect(byRole['character']).toHaveLength(1);
      expect(byRole['character'][0].units.name).toBe('Captain in Terminator Armour');

      expect(byRole['battleline']).toHaveLength(2);

      expect(byRole['infantry']).toHaveLength(1);
      expect(byRole['infantry'][0].units.name).toBe('Eradicators');
    });

    it('calculates per-section points correctly', () => {
      setupFullList();
      const state = useListEditorStore.getState();
      const sectionPts = selectRosterSectionPoints(state as never);

      expect(sectionPts['epic_hero']).toBe(350);
      expect(sectionPts['character']).toBe(95);
      expect(sectionPts['battleline']).toBe(270); // 180 + 90
      expect(sectionPts['infantry']).toBe(95);
    });
  });

  describe('action → selector chain', () => {
    it('updating points limit changes over-limit status', async () => {
      setupFullList();

      // Currently 810 pts, 2000 limit → under limit
      expect(selectOverLimit(useListEditorStore.getState() as never)).toBe(false);

      // Lower the limit to 500
      await useListEditorStore.getState().updatePointsLimit(500);

      expect(useListEditorStore.getState().list!.points_limit).toBe(500);
      expect(selectOverLimit(useListEditorStore.getState() as never)).toBe(true);
    });

    it('updating list name reflects in state', async () => {
      setupFullList();

      await useListEditorStore.getState().updateListName('Blood Angels Assault Force');

      expect(useListEditorStore.getState().list!.name).toBe('Blood Angels Assault Force');
    });

    it('selecting a unit updates selectedArmyListUnitId', () => {
      setupFullList();

      useListEditorStore.getState().setSelectedArmyListUnitId('alu-cap');

      expect(useListEditorStore.getState().selectedArmyListUnitId).toBe('alu-cap');
    });
  });

  describe('UI toggle actions', () => {
    it('toggleLegends flips the showLegends flag', () => {
      setupFullList();
      expect(useListEditorStore.getState().showLegends).toBe(false);

      useListEditorStore.getState().toggleLegends();
      expect(useListEditorStore.getState().showLegends).toBe(true);

      useListEditorStore.getState().toggleLegends();
      expect(useListEditorStore.getState().showLegends).toBe(false);
    });

    it('togglePickerRole adds the role on first call and removes it on second', () => {
      setupFullList();
      expect(useListEditorStore.getState().collapsedPickerRoles.has('character')).toBe(false);

      useListEditorStore.getState().togglePickerRole('character');
      expect(useListEditorStore.getState().collapsedPickerRoles.has('character')).toBe(true);

      useListEditorStore.getState().togglePickerRole('character');
      expect(useListEditorStore.getState().collapsedPickerRoles.has('character')).toBe(false);
    });

    it('togglePickerRole handles multiple roles independently', () => {
      setupFullList();

      useListEditorStore.getState().togglePickerRole('character');
      useListEditorStore.getState().togglePickerRole('battleline');

      const collapsed = useListEditorStore.getState().collapsedPickerRoles;
      expect(collapsed.has('character')).toBe(true);
      expect(collapsed.has('battleline')).toBe(true);
      expect(collapsed.has('vehicle')).toBe(false);
    });

    it('setShowExport updates the showExport flag', () => {
      setupFullList();
      expect(useListEditorStore.getState().showExport).toBe(false);

      useListEditorStore.getState().setShowExport(true);
      expect(useListEditorStore.getState().showExport).toBe(true);

      useListEditorStore.getState().setShowExport(false);
      expect(useListEditorStore.getState().showExport).toBe(false);
    });

    it('setUnitPickerFilter updates the filter string', () => {
      setupFullList();

      useListEditorStore.getState().setUnitPickerFilter('intercessor');
      expect(useListEditorStore.getState().unitPickerFilter).toBe('intercessor');

      useListEditorStore.getState().setUnitPickerFilter('');
      expect(useListEditorStore.getState().unitPickerFilter).toBe('');
    });
  });

  describe('reset', () => {
    it('clears all loaded state back to initial values', () => {
      setupFullList();

      // Sanity-check there is loaded state
      expect(useListEditorStore.getState().listUnits.length).toBeGreaterThan(0);
      expect(useListEditorStore.getState().list).not.toBeNull();

      useListEditorStore.getState().reset();

      const state = useListEditorStore.getState();
      expect(state.listId).toBeNull();
      expect(state.list).toBeNull();
      expect(state.listUnits).toEqual([]);
      expect(state.availableUnits).toEqual([]);
      expect(state.enhancements).toEqual([]);
      expect(state.listEnhancements).toEqual([]);
      expect(state.selectedArmyListUnitId).toBeNull();
      expect(state.showLegends).toBe(false);
    });
  });

  describe('removeUnit', () => {
    it('clears selectedArmyListUnitId when removing the currently-selected unit', async () => {
      setupFullList();
      useListEditorStore.setState({ selectedArmyListUnitId: 'alu-cap' } as never);

      await useListEditorStore.getState().removeUnit('alu-cap');

      expect(useListEditorStore.getState().selectedArmyListUnitId).toBeNull();
    });

    it('preserves selectedArmyListUnitId when removing a different unit', async () => {
      setupFullList();
      useListEditorStore.setState({ selectedArmyListUnitId: 'alu-cap' } as never);

      await useListEditorStore.getState().removeUnit('alu-int1');

      expect(useListEditorStore.getState().selectedArmyListUnitId).toBe('alu-cap');
    });
  });

  describe('reorderUnits', () => {
    it('moves a unit from one index to another in local state', async () => {
      setupFullList();
      const before = useListEditorStore.getState().listUnits.map(lu => lu.id);
      // Original order from setupFullList: hero, cap, int1, int2, erad
      expect(before).toEqual(['alu-hero', 'alu-cap', 'alu-int1', 'alu-int2', 'alu-erad']);

      // Move eradicators (index 4) to position 1
      await useListEditorStore.getState().reorderUnits(4, 1);

      const after = useListEditorStore.getState().listUnits.map(lu => lu.id);
      expect(after).toEqual(['alu-hero', 'alu-erad', 'alu-cap', 'alu-int1', 'alu-int2']);
    });

    it('is a no-op when fromIndex equals toIndex', async () => {
      setupFullList();
      const before = useListEditorStore.getState().listUnits.map(lu => lu.id);

      await useListEditorStore.getState().reorderUnits(2, 2);

      const after = useListEditorStore.getState().listUnits.map(lu => lu.id);
      expect(after).toEqual(before);
    });
  });
});
