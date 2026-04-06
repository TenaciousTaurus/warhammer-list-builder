import { create } from 'zustand';
import { supabase } from '../../../shared/lib/supabase';
import type {
  ArmyList, Unit, UnitPointsTier, ArmyListUnit, Enhancement,
  Detachment, Ability, Weapon, ValidateArmyListResult, WargearOption,
  ModelVariant, ArmyListUnitComposition, LeaderTarget, LeaderAttachment,
} from '../../../shared/types/database';
import type { ParsedUnit } from '../components/ExportModal';

// ============================================================
// Types
// ============================================================

export type UnitWithRelations = Unit & {
  unit_points_tiers: UnitPointsTier[];
  abilities: Ability[];
  weapons: Weapon[];
};

export type ArmyListUnitWithDetails = ArmyListUnit & {
  units: UnitWithRelations;
};

export const ROLE_ORDER = [
  'epic_hero', 'character', 'battleline', 'infantry', 'mounted',
  'beast', 'vehicle', 'monster', 'fortification', 'dedicated_transport', 'allied',
] as const;

export const ROLE_LABELS: Record<string, string> = {
  epic_hero: 'Epic Hero',
  character: 'Character',
  battleline: 'Battleline',
  infantry: 'Infantry',
  mounted: 'Mounted',
  beast: 'Beast',
  vehicle: 'Vehicle',
  monster: 'Monster',
  fortification: 'Fortification',
  dedicated_transport: 'Dedicated Transport',
  allied: 'Allied',
};

// ============================================================
// Pure helpers (exported for testing)
// ============================================================

export function getUnitPoints(
  unit: Unit & { unit_points_tiers: UnitPointsTier[] },
  modelCount: number,
): number {
  const sorted = [...unit.unit_points_tiers].sort((a, b) => a.model_count - b.model_count);
  let pts = 0;
  for (const tier of sorted) {
    if (modelCount >= tier.model_count) pts = tier.points;
  }
  return pts;
}

// ============================================================
// Store shape
// ============================================================

interface ListEditorState {
  // Core data
  listId: string | null;
  list: (ArmyList & { detachments: Detachment }) | null;
  listUnits: ArmyListUnitWithDetails[];
  availableUnits: UnitWithRelations[];
  enhancements: Enhancement[];
  listEnhancements: { id: string; enhancement_id: string; army_list_unit_id: string }[];
  wargearOptions: WargearOption[];
  unitWargearSelections: Map<string, Map<string, string>>;
  modelVariants: ModelVariant[];
  unitCompositions: Map<string, Map<string, number>>;
  leaderTargets: LeaderTarget[];
  leaderAttachments: LeaderAttachment[];
  alliedUnitIds: Set<string>;
  availableDetachments: Detachment[];

  // Validation
  serverValidation: ValidateArmyListResult | null;
  serverValidationError: boolean;

  // UI state
  loading: boolean;
  saving: boolean;
  error: string | null;
  showExport: boolean;
  unitPickerFilter: string;
  selectedArmyListUnitId: string | null;
  collapsedPickerRoles: Set<string>;
  showLegends: boolean;

  // Actions
  init: (listId: string) => Promise<void>;
  reset: () => void;

  // Unit CRUD
  addUnit: (unit: UnitWithRelations) => Promise<void>;
  removeUnit: (armyListUnitId: string) => Promise<void>;
  updateModelCount: (armyListUnitId: string, modelCount: number) => Promise<void>;
  reorderUnits: (fromIndex: number, toIndex: number) => Promise<void>;

  // List settings
  updateListName: (name: string) => Promise<void>;
  updatePointsLimit: (limit: number) => Promise<void>;
  updateBattleSize: (battleSize: string, points: number) => Promise<void>;
  changeDetachment: (detachmentId: string) => Promise<void>;

  // Enhancements
  assignEnhancement: (armyListUnitId: string, enhancementId: string) => Promise<void>;

  // Wargear
  selectWargear: (armyListUnitId: string, groupName: string, optionId: string) => Promise<void>;

  // Model composition
  updateComposition: (armyListUnitId: string, variantId: string, count: number) => Promise<void>;

  // Leader attachment
  attachLeader: (leaderArmyListUnitId: string, targetArmyListUnitId: string) => Promise<void>;
  detachLeader: (leaderArmyListUnitId: string) => Promise<void>;

  // Import
  handleImport: (parsed: ParsedUnit[]) => Promise<{ success: boolean; matched: number; unmatched: string[] }>;

  // UI actions
  setShowExport: (show: boolean) => void;
  setUnitPickerFilter: (filter: string) => void;
  setSelectedArmyListUnitId: (id: string | null) => void;
  togglePickerRole: (role: string) => void;
  toggleLegends: () => void;

  // Internal (prefixed with _ to indicate private)
  _fetchAll: (listId: string) => Promise<void>;
  _fetchServerValidation: () => Promise<void>;
  _refetch: () => Promise<void>;
}

// ============================================================
// Internal helpers
// ============================================================

function getInitialState() {
  return {
    listId: null as string | null,
    list: null as (ArmyList & { detachments: Detachment }) | null,
    listUnits: [] as ArmyListUnitWithDetails[],
    availableUnits: [] as UnitWithRelations[],
    enhancements: [] as Enhancement[],
    listEnhancements: [] as { id: string; enhancement_id: string; army_list_unit_id: string }[],
    wargearOptions: [] as WargearOption[],
    unitWargearSelections: new Map<string, Map<string, string>>(),
    modelVariants: [] as ModelVariant[],
    unitCompositions: new Map<string, Map<string, number>>(),
    leaderTargets: [] as LeaderTarget[],
    leaderAttachments: [] as LeaderAttachment[],
    alliedUnitIds: new Set<string>(),
    availableDetachments: [] as Detachment[],
    serverValidation: null as ValidateArmyListResult | null,
    serverValidationError: false,
    loading: true,
    saving: false,
    error: null as string | null,
    showExport: false,
    unitPickerFilter: '',
    selectedArmyListUnitId: null as string | null,
    collapsedPickerRoles: new Set<string>(),
    showLegends: false,
  };
}

// ============================================================
// Store
// ============================================================

export const useListEditorStore = create<ListEditorState>()((set, get) => ({
  // Initial state
  ...getInitialState(),

  // ============================================================
  // Init / Reset
  // ============================================================

  init: async (listId: string) => {
    set({ listId, loading: true, error: null });

    try {
      await get()._fetchAll(listId);
    } catch (err) {
      set({ loading: false, error: String(err) });
    }
  },

  reset: () => {
    set(getInitialState());
  },

  // ============================================================
  // Data fetching (internal)
  // ============================================================

  _fetchAll: async (listId: string) => {
    // 1. Fetch the list itself
    const { data: listData, error: listError } = await supabase
      .from('army_lists')
      .select('*, detachments(*)')
      .eq('id', listId)
      .single();

    if (listError || !listData) {
      set({ loading: false, error: listError?.message ?? 'List not found' });
      return;
    }

    const list = listData as ArmyList & { detachments: Detachment };

    // 2. Fetch list units
    const { data: unitData } = await supabase
      .from('army_list_units')
      .select('*, units(*, unit_points_tiers(*), abilities(*), weapons(*))')
      .eq('army_list_id', listId)
      .order('sort_order');

    const listUnits = (unitData ?? []) as ArmyListUnitWithDetails[];

    // 3. Fetch available units (main faction + parent faction + allied)
    const { data: factionMeta } = await supabase
      .from('factions')
      .select('alignment, parent_faction_id')
      .eq('id', list.faction_id)
      .single();

    // Build list of faction IDs to fetch units from (self + parent if exists)
    const unitFactionIds = [list.faction_id];
    if (factionMeta?.parent_faction_id) {
      unitFactionIds.push(factionMeta.parent_faction_id);
    }

    // Fetch available detachments for this faction (own + parent's generic ones)
    const { data: detachmentData } = await supabase
      .from('detachments')
      .select('*')
      .in('faction_id', unitFactionIds)
      .order('name');
    const availableDetachments = (detachmentData ?? []) as Detachment[];

    const { data: mainUnits } = await supabase
      .from('units')
      .select('*, unit_points_tiers(*), abilities(*), weapons(*)')
      .in('faction_id', unitFactionIds)
      .order('name');

    const alliedFactionNames = ['Unaligned Forces'];
    if (factionMeta?.alignment === 'imperium') {
      alliedFactionNames.push('Agents of the Imperium', 'Imperial Knights');
    } else if (factionMeta?.alignment === 'chaos') {
      alliedFactionNames.push('Chaos Knights');
    }

    const { data: alliedFactionRows } = await supabase
      .from('factions')
      .select('id')
      .in('name', alliedFactionNames);

    const alliedFactionIds = (alliedFactionRows || []).map(f => f.id as string);

    let alliedUnits: UnitWithRelations[] = [];
    if (alliedFactionIds.length > 0) {
      const { data: allied } = await supabase
        .from('units')
        .select('*, unit_points_tiers(*), abilities(*), weapons(*)')
        .in('faction_id', alliedFactionIds)
        .order('name');
      if (allied) alliedUnits = allied as UnitWithRelations[];
    }

    const availableUnits = [...(mainUnits || []), ...alliedUnits] as UnitWithRelations[];
    const alliedUnitIds = new Set(alliedUnits.map(u => u.id));

    // 4. Fetch enhancements
    const { data: enhData } = await supabase
      .from('enhancements')
      .select('*')
      .eq('detachment_id', list.detachment_id)
      .order('points');

    const { data: listEnhData } = await supabase
      .from('army_list_enhancements')
      .select('*')
      .eq('army_list_id', listId);

    // 5. Fetch wargear
    const unitIds = availableUnits.map(u => u.id);
    const { data: wargearData } = await supabase
      .from('wargear_options')
      .select('*')
      .in('unit_id', unitIds)
      .order('group_name')
      .order('is_default', { ascending: false });

    // 6. Fetch model variants
    const { data: variantData } = await supabase
      .from('unit_model_variants')
      .select('*')
      .in('unit_id', unitIds)
      .order('sort_order');

    // 7. Fetch leader targets
    const { data: leaderTargetData } = await supabase
      .from('unit_leader_targets')
      .select('*')
      .or(`leader_unit_id.in.(${unitIds.join(',')}),target_unit_id.in.(${unitIds.join(',')})`);

    // 8. Fetch leader attachments
    const { data: attachmentData } = await supabase
      .from('army_list_leader_attachments')
      .select('*')
      .eq('army_list_id', listId);

    // 9. Fetch wargear selections & compositions for list units
    let unitWargearSelections = new Map<string, Map<string, string>>();
    let unitCompositions = new Map<string, Map<string, number>>();

    if (listUnits.length > 0) {
      const listUnitIds = listUnits.map(u => u.id);

      const { data: wargearSelData } = await supabase
        .from('army_list_unit_wargear')
        .select('*')
        .in('army_list_unit_id', listUnitIds);

      if (wargearSelData) {
        const selMap = new Map<string, Map<string, string>>();
        for (const sel of wargearSelData) {
          const opt = (wargearData ?? []).find((w: WargearOption) => w.id === sel.wargear_option_id);
          if (!opt) continue;
          if (!selMap.has(sel.army_list_unit_id)) selMap.set(sel.army_list_unit_id, new Map());
          selMap.get(sel.army_list_unit_id)!.set(opt.group_name, sel.wargear_option_id);
        }
        unitWargearSelections = selMap;
      }

      const { data: compData } = await supabase
        .from('army_list_unit_composition')
        .select('*')
        .in('army_list_unit_id', listUnitIds);

      if (compData) {
        const compMap = new Map<string, Map<string, number>>();
        for (const comp of compData as ArmyListUnitComposition[]) {
          if (!compMap.has(comp.army_list_unit_id)) compMap.set(comp.army_list_unit_id, new Map());
          compMap.get(comp.army_list_unit_id)!.set(comp.model_variant_id, comp.count);
        }
        unitCompositions = compMap;
      }
    }

    // 10. Server validation
    const { data: valData, error: valError } = await supabase.rpc('validate_army_list', { list_id: listId });

    // Set all state at once
    set({
      list,
      listUnits,
      availableUnits,
      alliedUnitIds,
      availableDetachments,
      enhancements: enhData ?? [],
      listEnhancements: listEnhData ?? [],
      wargearOptions: (wargearData ?? []) as WargearOption[],
      unitWargearSelections,
      modelVariants: (variantData ?? []) as ModelVariant[],
      unitCompositions,
      leaderTargets: (leaderTargetData ?? []) as LeaderTarget[],
      leaderAttachments: (attachmentData ?? []) as LeaderAttachment[],
      serverValidation: valError ? null : (valData as unknown as ValidateArmyListResult),
      serverValidationError: !!valError,
      loading: false,
    });
  },

  _fetchServerValidation: async () => {
    const { listId } = get();
    if (!listId) return;
    const { data, error } = await supabase.rpc('validate_army_list', { list_id: listId });
    if (error) {
      set({ serverValidationError: true });
      console.error('Server validation failed:', error);
    } else {
      set({
        serverValidation: data as unknown as ValidateArmyListResult,
        serverValidationError: false,
      });
    }
  },

  _refetch: async () => {
    const { listId } = get();
    set({ saving: true });
    if (listId) await get()._fetchAll(listId);
    set({ saving: false });
  },

  // ============================================================
  // Unit CRUD
  // ============================================================

  addUnit: async (unit: UnitWithRelations) => {
    const { listId, listUnits } = get();
    if (!listId) return;

    // Check limit
    const currentCount = listUnits.filter(lu => lu.unit_id === unit.id).length;
    if (currentCount >= unit.max_per_list) return;

    const minModels = unit.unit_points_tiers.length > 0
      ? Math.min(...unit.unit_points_tiers.map(t => t.model_count))
      : 1;

    const { error } = await supabase.from('army_list_units').insert({
      army_list_id: listId,
      unit_id: unit.id,
      model_count: minModels,
      sort_order: listUnits.length,
    });

    if (error) {
      console.error('Failed to add unit:', error);
      set({ error: error.message });
      return;
    }

    await get()._refetch();
  },

  removeUnit: async (armyListUnitId: string) => {
    const { selectedArmyListUnitId } = get();
    if (selectedArmyListUnitId === armyListUnitId) {
      set({ selectedArmyListUnitId: null });
    }

    const { error } = await supabase.from('army_list_units').delete().eq('id', armyListUnitId);
    if (error) {
      console.error('Failed to remove unit:', error);
      set({ error: error.message });
      return;
    }

    await get()._refetch();
  },

  updateModelCount: async (armyListUnitId: string, modelCount: number) => {
    const { error } = await supabase
      .from('army_list_units')
      .update({ model_count: modelCount })
      .eq('id', armyListUnitId);

    if (error) {
      console.error('Failed to update model count:', error);
      set({ error: error.message });
      return;
    }

    await get()._refetch();
  },

  reorderUnits: async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const { listUnits } = get();

    const reordered = [...listUnits];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    // Optimistic update
    set({ listUnits: reordered });

    // Persist
    for (let i = 0; i < reordered.length; i++) {
      await supabase.from('army_list_units')
        .update({ sort_order: i })
        .eq('id', reordered[i].id);
    }
  },

  // ============================================================
  // List settings
  // ============================================================

  updateListName: async (name: string) => {
    const { listId, list } = get();
    if (!listId || !list) return;
    set({ saving: true, list: { ...list, name } });
    await supabase.from('army_lists').update({ name }).eq('id', listId);
    set({ saving: false });
  },

  updatePointsLimit: async (limit: number) => {
    const { listId, list } = get();
    if (!listId || !list) return;
    set({ saving: true, list: { ...list, points_limit: limit } });
    await supabase.from('army_lists').update({ points_limit: limit }).eq('id', listId);
    set({ saving: false });
    get()._fetchServerValidation();
  },

  updateBattleSize: async (battleSize: string, points: number) => {
    const { listId, list } = get();
    if (!listId || !list) return;
    await supabase.from('army_lists').update({ battle_size: battleSize, points_limit: points }).eq('id', listId);
    set({ list: { ...list, battle_size: battleSize, points_limit: points } });
    get()._fetchServerValidation();
  },

  changeDetachment: async (detachmentId: string) => {
    const { listId, list, availableDetachments } = get();
    if (!listId || !list) return;

    const newDetachment = availableDetachments.find(d => d.id === detachmentId);
    if (!newDetachment) return;

    // Update DB
    await supabase.from('army_lists').update({ detachment_id: detachmentId }).eq('id', listId);

    // Clear existing enhancements (they belong to the old detachment)
    await supabase.from('army_list_enhancements').delete().eq('army_list_id', listId);

    // Fetch new enhancements for the new detachment
    const { data: enhData } = await supabase
      .from('enhancements')
      .select('*')
      .eq('detachment_id', detachmentId)
      .order('points');

    set({
      list: { ...list, detachment_id: detachmentId, detachments: newDetachment },
      enhancements: enhData ?? [],
      listEnhancements: [],
    });

    get()._fetchServerValidation();
  },

  // ============================================================
  // Enhancements
  // ============================================================

  assignEnhancement: async (armyListUnitId: string, enhancementId: string) => {
    const { listId, listEnhancements } = get();
    if (!listId) return;

    // Find existing enhancement for this unit
    const existing = listEnhancements.find(le => le.army_list_unit_id === armyListUnitId);
    if (existing) {
      await supabase.from('army_list_enhancements').delete().eq('id', existing.id);
    }
    if (enhancementId) {
      await supabase.from('army_list_enhancements').insert({
        army_list_id: listId,
        enhancement_id: enhancementId,
        army_list_unit_id: armyListUnitId,
      });
    }
    await get()._refetch();
  },

  // ============================================================
  // Wargear
  // ============================================================

  selectWargear: async (armyListUnitId: string, groupName: string, optionId: string) => {
    const { unitWargearSelections } = get();
    const existing = unitWargearSelections.get(armyListUnitId);

    if (existing) {
      const currentOptionId = existing.get(groupName);
      if (currentOptionId) {
        await supabase.from('army_list_unit_wargear').delete()
          .eq('army_list_unit_id', armyListUnitId)
          .eq('wargear_option_id', currentOptionId);
      }
    }
    if (optionId) {
      await supabase.from('army_list_unit_wargear').insert({
        army_list_unit_id: armyListUnitId,
        wargear_option_id: optionId,
      });
    }

    // Optimistic local update
    set((state) => {
      const next = new Map(state.unitWargearSelections);
      if (!next.has(armyListUnitId)) next.set(armyListUnitId, new Map());
      next.get(armyListUnitId)!.set(groupName, optionId);
      return { unitWargearSelections: next };
    });
  },

  // ============================================================
  // Model composition
  // ============================================================

  updateComposition: async (armyListUnitId: string, variantId: string, count: number) => {
    const { modelVariants, unitCompositions } = get();

    // Optimistic update
    set((state) => {
      const next = new Map(state.unitCompositions);
      if (!next.has(armyListUnitId)) next.set(armyListUnitId, new Map());
      next.get(armyListUnitId)!.set(variantId, count);
      return { unitCompositions: next };
    });

    // Upsert to DB
    if (count > 0) {
      await supabase
        .from('army_list_unit_composition')
        .upsert({
          army_list_unit_id: armyListUnitId,
          model_variant_id: variantId,
          count,
        }, { onConflict: 'army_list_unit_id,model_variant_id' });
    } else {
      await supabase
        .from('army_list_unit_composition')
        .delete()
        .eq('army_list_unit_id', armyListUnitId)
        .eq('model_variant_id', variantId);
    }

    // Recalculate total model count
    const comp = unitCompositions.get(armyListUnitId) ?? new Map();
    comp.set(variantId, count);
    const variants = modelVariants.filter(
      v => comp.has(v.id) || v.unit_id === modelVariants.find(mv => mv.id === variantId)?.unit_id
    );
    let totalModels = 0;
    for (const v of variants) {
      totalModels += v.is_leader ? v.min_count : (comp.get(v.id) ?? 0);
    }
    if (totalModels > 0) {
      await supabase.from('army_list_units').update({ model_count: totalModels }).eq('id', armyListUnitId);
      set((state) => ({
        listUnits: state.listUnits.map(lu =>
          lu.id === armyListUnitId ? { ...lu, model_count: totalModels } : lu
        ),
      }));
    }
  },

  // ============================================================
  // Leader attachment
  // ============================================================

  attachLeader: async (leaderArmyListUnitId: string, targetArmyListUnitId: string) => {
    const { listId } = get();
    if (!listId) return;

    await supabase.from('army_list_leader_attachments')
      .delete()
      .eq('leader_army_list_unit_id', leaderArmyListUnitId);

    await supabase.from('army_list_leader_attachments').insert({
      army_list_id: listId,
      leader_army_list_unit_id: leaderArmyListUnitId,
      target_army_list_unit_id: targetArmyListUnitId,
    });

    await get()._refetch();
  },

  detachLeader: async (leaderArmyListUnitId: string) => {
    await supabase.from('army_list_leader_attachments')
      .delete()
      .eq('leader_army_list_unit_id', leaderArmyListUnitId);

    await get()._refetch();
  },

  // ============================================================
  // Import
  // ============================================================

  handleImport: async (parsed: ParsedUnit[]) => {
    const { listId, availableUnits, enhancements } = get();
    if (!listId) return { success: false, matched: 0, unmatched: [] };

    const matched: { unit: UnitWithRelations; modelCount: number; enhancementName: string | null }[] = [];
    const unmatched: string[] = [];

    for (const p of parsed) {
      const unit = availableUnits.find(u => u.name.toLowerCase() === p.name.toLowerCase());
      if (unit) {
        matched.push({ unit, modelCount: p.modelCount, enhancementName: p.enhancementName });
      } else {
        unmatched.push(p.name);
      }
    }

    if (matched.length === 0) {
      return { success: false, matched: 0, unmatched };
    }

    // Clear existing
    await supabase.from('army_list_enhancements').delete().eq('army_list_id', listId);
    await supabase.from('army_list_units').delete().eq('army_list_id', listId);

    // Insert matched
    for (let i = 0; i < matched.length; i++) {
      const m = matched[i];
      const { data: inserted } = await supabase.from('army_list_units').insert({
        army_list_id: listId,
        unit_id: m.unit.id,
        model_count: m.modelCount,
        sort_order: i,
      }).select().single();

      if (inserted && m.enhancementName) {
        const enh = enhancements.find(e => e.name.toLowerCase() === m.enhancementName!.toLowerCase());
        if (enh) {
          await supabase.from('army_list_enhancements').insert({
            army_list_id: listId,
            enhancement_id: enh.id,
            army_list_unit_id: inserted.id,
          });
        }
      }
    }

    set({ selectedArmyListUnitId: null });
    await get()._refetch();
    return { success: true, matched: matched.length, unmatched };
  },

  // ============================================================
  // UI actions
  // ============================================================

  setShowExport: (show: boolean) => set({ showExport: show }),
  setUnitPickerFilter: (filter: string) => set({ unitPickerFilter: filter }),
  setSelectedArmyListUnitId: (id: string | null) => set({ selectedArmyListUnitId: id }),

  togglePickerRole: (role: string) => {
    set((state) => {
      const next = new Set(state.collapsedPickerRoles);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return { collapsedPickerRoles: next };
    });
  },

  toggleLegends: () => set((state) => ({ showLegends: !state.showLegends })),
}));

// ============================================================
// Derived selectors (computed outside store for memoization)
// ============================================================

/** Compute total points for all units + enhancements */
export function selectTotalPoints(state: ListEditorState): number {
  const enhancementPointsTotal = state.listEnhancements.reduce((sum, le) => {
    const enh = state.enhancements.find(e => e.id === le.enhancement_id);
    return sum + (enh?.points ?? 0);
  }, 0);

  return state.listUnits.reduce((sum, lu) => {
    return sum + getUnitPoints(lu.units, lu.model_count);
  }, 0) + enhancementPointsTotal;
}

/** Check if points exceed limit */
export function selectOverLimit(state: ListEditorState): boolean {
  return state.list ? selectTotalPoints(state) > state.list.points_limit : false;
}

/** Map of unit_id -> count in list */
export function selectUnitCountsInList(state: ListEditorState): Map<string, number> {
  const counts = new Map<string, number>();
  for (const lu of state.listUnits) {
    counts.set(lu.unit_id, (counts.get(lu.unit_id) ?? 0) + 1);
  }
  return counts;
}

/** Enhancement assigned to each army list unit */
export function selectUnitEnhancementMap(state: ListEditorState): Map<string, { enhancementId: string; listEnhancementId: string }> {
  const map = new Map<string, { enhancementId: string; listEnhancementId: string }>();
  for (const le of state.listEnhancements) {
    map.set(le.army_list_unit_id, { enhancementId: le.enhancement_id, listEnhancementId: le.id });
  }
  return map;
}

/** Set of already-assigned enhancement IDs */
export function selectAssignedEnhancementIds(state: ListEditorState): Set<string> {
  return new Set(state.listEnhancements.map(le => le.enhancement_id));
}

/** Whether the 3-enhancement limit is reached */
export function selectEnhancementLimitReached(state: ListEditorState): boolean {
  return state.listEnhancements.length >= 3;
}

/** Unit limit warnings */
export function selectUnitLimitWarnings(state: ListEditorState): string[] {
  const unitCounts = new Map<string, { name: string; count: number; maxPerList: number }>();
  for (const lu of state.listUnits) {
    const existing = unitCounts.get(lu.unit_id);
    if (existing) {
      existing.count += 1;
    } else {
      unitCounts.set(lu.unit_id, { name: lu.units.name, count: 1, maxPerList: lu.units.max_per_list });
    }
  }
  const warnings: string[] = [];
  for (const [, info] of unitCounts) {
    if (info.count > info.maxPerList) {
      warnings.push(`${info.name} exceeds its limit (${info.count}/${info.maxPerList} allowed)`);
    }
  }
  return warnings;
}

/** Enhancement warnings */
export function selectEnhancementWarnings(state: ListEditorState): string[] {
  const warnings: string[] = [];
  if (state.listEnhancements.length > 3) {
    warnings.push(`Too many enhancements: ${state.listEnhancements.length}/3 allowed`);
  }
  const enhIds = state.listEnhancements.map(le => le.enhancement_id);
  const dupes = enhIds.filter((eid, i) => enhIds.indexOf(eid) !== i);
  if (dupes.length > 0) {
    const dupeNames = [...new Set(dupes)].map(eid =>
      state.enhancements.find(e => e.id === eid)?.name ?? 'Unknown'
    );
    warnings.push(`Duplicate enhancements: ${dupeNames.join(', ')}`);
  }
  for (const le of state.listEnhancements) {
    const lu = state.listUnits.find(u => u.id === le.army_list_unit_id);
    if (lu && lu.units.role === 'epic_hero') {
      warnings.push(`${lu.units.name} is an Epic Hero and cannot take enhancements`);
    }
  }
  return warnings;
}

/** Battle size warnings */
export function selectBattleSizeWarnings(state: ListEditorState): string[] {
  if (!state.list?.battle_size) return [];
  const warnings: string[] = [];
  const BATTLE_SIZES: Record<string, { name: string; max: number }> = {
    combat_patrol: { name: 'Combat Patrol', max: 500 },
    incursion: { name: 'Incursion', max: 1000 },
    strike_force: { name: 'Strike Force', max: 2000 },
    onslaught: { name: 'Onslaught', max: 3000 },
  };
  const bs = BATTLE_SIZES[state.list.battle_size];
  if (bs && state.list.points_limit !== bs.max) {
    warnings.push(`Points limit (${state.list.points_limit}) doesn't match ${bs.name} (${bs.max} pts)`);
  }
  return warnings;
}

/** Transport warnings */
export function selectTransportWarnings(state: ListEditorState): string[] {
  const warnings: string[] = [];
  const transports = state.listUnits.filter(lu => lu.units.transport_capacity != null);
  for (const transport of transports) {
    const cap = transport.units.transport_capacity!;
    const allowed = transport.units.transport_keywords_allowed ?? [];
    const excluded = transport.units.transport_keywords_excluded ?? [];
    const eligible = state.listUnits.filter(lu => {
      if (lu.id === transport.id) return false;
      if (lu.units.role === 'dedicated_transport') return false;
      const kw = lu.units.keywords ?? [];
      return allowed.every(a => kw.includes(a)) && !excluded.some(e => kw.includes(e));
    });
    const totalModels = eligible.reduce((sum, lu) => sum + lu.model_count, 0);
    if (totalModels > cap) {
      warnings.push(
        `${transport.units.name} can carry ${cap} models — ${totalModels} eligible models in your list`
      );
    }
  }
  return warnings;
}

/** Points mismatch between local and server calculation */
export function selectPointsMismatch(state: ListEditorState): boolean {
  return state.serverValidation !== null && state.serverValidation.total_points !== selectTotalPoints(state);
}

/** Filtered units (respecting legends toggle and search) */
export function selectFilteredUnits(state: ListEditorState): UnitWithRelations[] {
  return state.availableUnits.filter(u => {
    if (!state.showLegends && u.is_legends) return false;
    return u.name.toLowerCase().includes(state.unitPickerFilter.toLowerCase());
  });
}

/** Units grouped by role (excluding allied) */
export function selectUnitsByRole(state: ListEditorState): Record<string, UnitWithRelations[]> {
  const filtered = selectFilteredUnits(state);
  const groups: Record<string, UnitWithRelations[]> = {};
  for (const unit of filtered) {
    if (state.alliedUnitIds.has(unit.id)) continue;
    if (!groups[unit.role]) groups[unit.role] = [];
    groups[unit.role].push(unit);
  }
  return groups;
}

/** Filtered allied units */
export function selectFilteredAlliedUnits(state: ListEditorState): UnitWithRelations[] {
  return selectFilteredUnits(state).filter(u => state.alliedUnitIds.has(u.id));
}

/** Roster grouped by role (excluding allied) */
export function selectRosterByRole(state: ListEditorState): Record<string, ArmyListUnitWithDetails[]> {
  const groups: Record<string, ArmyListUnitWithDetails[]> = {};
  for (const lu of state.listUnits) {
    if (state.alliedUnitIds.has(lu.unit_id)) continue;
    const role = lu.units.role;
    if (!groups[role]) groups[role] = [];
    groups[role].push(lu);
  }
  return groups;
}

/** Roster allied units */
export function selectRosterAlliedUnits(state: ListEditorState): ArmyListUnitWithDetails[] {
  return state.listUnits.filter(lu => state.alliedUnitIds.has(lu.unit_id));
}

/** Points by roster section */
export function selectRosterSectionPoints(state: ListEditorState): Record<string, number> {
  const enhMap = selectUnitEnhancementMap(state);
  const points: Record<string, number> = {};
  for (const lu of state.listUnits) {
    if (state.alliedUnitIds.has(lu.unit_id)) continue;
    const role = lu.units.role;
    const unitPts = getUnitPoints(lu.units, lu.model_count);
    const unitEnh = enhMap.get(lu.id);
    const enhPts = unitEnh ? (state.enhancements.find(e => e.id === unitEnh.enhancementId)?.points ?? 0) : 0;
    points[role] = (points[role] ?? 0) + unitPts + enhPts;
  }
  return points;
}

/** Allied units total points */
export function selectRosterAlliedPoints(state: ListEditorState): number {
  const enhMap = selectUnitEnhancementMap(state);
  let pts = 0;
  for (const lu of selectRosterAlliedUnits(state)) {
    pts += getUnitPoints(lu.units, lu.model_count);
    const unitEnh = enhMap.get(lu.id);
    if (unitEnh) pts += state.enhancements.find(e => e.id === unitEnh.enhancementId)?.points ?? 0;
  }
  return pts;
}

/** Selected unit from list */
export function selectSelectedLu(state: ListEditorState): ArmyListUnitWithDetails | null {
  if (!state.selectedArmyListUnitId) return null;
  return state.listUnits.find(lu => lu.id === state.selectedArmyListUnitId) ?? null;
}

// ============================================================
// Helper functions (used by components)
// ============================================================

export function getWargearSummary(state: ListEditorState, armyListUnitId: string, unitId: string): string {
  const selections = state.unitWargearSelections.get(armyListUnitId);
  if (!selections || selections.size === 0) {
    const unitOpts = state.wargearOptions.filter(w => w.unit_id === unitId);
    const groups = new Map<string, WargearOption[]>();
    for (const opt of unitOpts) {
      if (!groups.has(opt.group_name)) groups.set(opt.group_name, []);
      groups.get(opt.group_name)!.push(opt);
    }
    const defaults: string[] = [];
    for (const [, opts] of groups) {
      if (opts.length > 1) {
        const def = opts.find(o => o.is_default);
        if (def) defaults.push(def.name);
      }
    }
    return defaults.join(', ');
  }
  const names: string[] = [];
  for (const [, optionId] of selections) {
    const opt = state.wargearOptions.find(w => w.id === optionId);
    if (opt) names.push(opt.name);
  }
  return names.join(', ');
}

export function getEnhancementForUnit(state: ListEditorState, armyListUnitId: string): Enhancement | null {
  const enhMap = selectUnitEnhancementMap(state);
  const unitEnh = enhMap.get(armyListUnitId);
  if (!unitEnh) return null;
  return state.enhancements.find(e => e.id === unitEnh.enhancementId) ?? null;
}

export function getModelVariantsForUnit(state: ListEditorState, unitId: string): ModelVariant[] {
  return state.modelVariants.filter(v => v.unit_id === unitId);
}

export function getCompositionForUnit(state: ListEditorState, armyListUnitId: string): Map<string, number> {
  return state.unitCompositions.get(armyListUnitId) ?? new Map();
}

export function getCompositionSummary(state: ListEditorState, armyListUnitId: string, unitId: string): string {
  const variants = getModelVariantsForUnit(state, unitId);
  if (variants.length === 0) return '';
  const comp = getCompositionForUnit(state, armyListUnitId);
  const parts: string[] = [];
  for (const v of variants) {
    const count = v.is_leader ? v.min_count : (comp.get(v.id) ?? 0);
    if (count > 0) parts.push(`${count}x ${v.name}`);
  }
  return parts.join(', ');
}

export function getEligibleLeaders(state: ListEditorState, unitId: string): string[] {
  return state.leaderTargets
    .filter(lt => lt.target_unit_id === unitId)
    .map(lt => lt.leader_unit_id);
}

export function getAttachmentForTarget(state: ListEditorState, targetArmyListUnitId: string): LeaderAttachment | undefined {
  return state.leaderAttachments.find(la => la.target_army_list_unit_id === targetArmyListUnitId);
}

export function isLeaderAttachedElsewhere(state: ListEditorState, leaderArmyListUnitId: string, targetArmyListUnitId: string): boolean {
  return state.leaderAttachments.some(
    la => la.leader_army_list_unit_id === leaderArmyListUnitId
      && la.target_army_list_unit_id !== targetArmyListUnitId
  );
}
