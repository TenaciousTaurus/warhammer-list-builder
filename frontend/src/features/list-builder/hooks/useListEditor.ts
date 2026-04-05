/**
 * @deprecated This hook is a backward-compatible wrapper around the new
 * listEditorStore (Zustand). New code should import from
 * '../stores/listEditorStore' directly. This file will be removed in a future
 * refactor once all consumers have migrated.
 */
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useListEditorStore,
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
  getWargearSummary as _getWargearSummary,
  getEnhancementForUnit as _getEnhancementForUnit,
  getModelVariantsForUnit as _getModelVariantsForUnit,
  getCompositionForUnit as _getCompositionForUnit,
  getCompositionSummary as _getCompositionSummary,
  getEligibleLeaders as _getEligibleLeaders,
  getAttachmentForTarget as _getAttachmentForTarget,
  isLeaderAttachedElsewhere as _isLeaderAttachedElsewhere,
  ROLE_ORDER,
  ROLE_LABELS,
} from '../stores/listEditorStore';
import type { UnitWithRelations, ArmyListUnitWithDetails } from '../stores/listEditorStore';

// Re-export types and constants so existing imports still work
export { ROLE_ORDER, ROLE_LABELS, getUnitPoints };
export type { UnitWithRelations, ArmyListUnitWithDetails };

export function useListEditor(id: string | undefined) {
  const navigate = useNavigate();
  const store = useListEditorStore();

  // Initialize store when id changes
  useEffect(() => {
    if (id) {
      store.init(id);
    }
    return () => {
      store.reset();
    };
    // Only re-init when the list ID changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Navigate away if list not found after loading
  useEffect(() => {
    if (!store.loading && !store.list && store.error) {
      navigate('/lists');
    }
  }, [store.loading, store.list, store.error, navigate]);

  // Compute derived state using selectors
  const totalPoints = useMemo(() => selectTotalPoints(store), [store]);
  const overLimit = useMemo(() => selectOverLimit(store), [store]);
  const unitCountsInList = useMemo(() => selectUnitCountsInList(store), [store]);
  const unitEnhancementMap = useMemo(() => selectUnitEnhancementMap(store), [store]);
  const assignedEnhancementIds = useMemo(() => selectAssignedEnhancementIds(store), [store]);
  const enhancementLimitReached = useMemo(() => selectEnhancementLimitReached(store), [store]);
  const unitLimitWarnings = useMemo(() => selectUnitLimitWarnings(store), [store]);
  const enhancementWarnings = useMemo(() => selectEnhancementWarnings(store), [store]);
  const battleSizeWarnings = useMemo(() => selectBattleSizeWarnings(store), [store]);
  const transportWarnings = useMemo(() => selectTransportWarnings(store), [store]);
  const pointsMismatch = useMemo(() => selectPointsMismatch(store), [store]);
  const filteredUnits = useMemo(() => selectFilteredUnits(store), [store]);
  const unitsByRole = useMemo(() => selectUnitsByRole(store), [store]);
  const filteredAlliedUnits = useMemo(() => selectFilteredAlliedUnits(store), [store]);
  const rosterByRole = useMemo(() => selectRosterByRole(store), [store]);
  const rosterAlliedUnits = useMemo(() => selectRosterAlliedUnits(store), [store]);
  const rosterSectionPoints = useMemo(() => selectRosterSectionPoints(store), [store]);
  const rosterAlliedPoints = useMemo(() => selectRosterAlliedPoints(store), [store]);
  const selectedLu = useMemo(() => selectSelectedLu(store), [store]);

  return {
    // State
    list: store.list,
    listUnits: store.listUnits,
    availableUnits: store.availableUnits,
    enhancements: store.enhancements,
    listEnhancements: store.listEnhancements,
    loading: store.loading,
    showExport: store.showExport,
    setShowExport: store.setShowExport,
    unitPickerFilter: store.unitPickerFilter,
    setUnitPickerFilter: store.setUnitPickerFilter,
    serverValidation: store.serverValidation,
    serverValidationError: store.serverValidationError,
    wargearOptions: store.wargearOptions,
    unitWargearSelections: store.unitWargearSelections,
    selectedArmyListUnitId: store.selectedArmyListUnitId,
    setSelectedArmyListUnitId: store.setSelectedArmyListUnitId,
    collapsedPickerRoles: store.collapsedPickerRoles,
    showLegends: store.showLegends,
    selectedLu,

    // Computed
    totalPoints,
    overLimit,
    unitLimitWarnings,
    enhancementWarnings,
    battleSizeWarnings,
    transportWarnings,
    pointsMismatch,
    unitCountsInList,
    assignedEnhancementIds,
    enhancementLimitReached,
    unitEnhancementMap,
    filteredUnits,
    filteredAlliedUnits,
    unitsByRole,
    rosterByRole,
    rosterAlliedUnits,
    rosterSectionPoints,
    rosterAlliedPoints,
    alliedUnitIds: store.alliedUnitIds,
    availableDetachments: store.availableDetachments,

    // Actions
    addUnit: store.addUnit,
    removeUnit: store.removeUnit,
    updateListName: store.updateListName,
    updatePointsLimit: store.updatePointsLimit,
    updateBattleSize: store.updateBattleSize,
    changeDetachment: store.changeDetachment,
    updateModelCount: store.updateModelCount,
    assignEnhancement: store.assignEnhancement,
    selectWargear: store.selectWargear,
    handleImport: store.handleImport,
    reorderUnits: store.reorderUnits,
    togglePickerRole: store.togglePickerRole,
    toggleLegends: store.toggleLegends,

    // Helpers (bound to current state)
    getWargearSummary: (armyListUnitId: string, unitId: string) =>
      _getWargearSummary(useListEditorStore.getState(), armyListUnitId, unitId),
    getEnhancementForUnit: (armyListUnitId: string) =>
      _getEnhancementForUnit(useListEditorStore.getState(), armyListUnitId),

    // Model variants
    modelVariants: store.modelVariants,
    unitCompositions: store.unitCompositions,
    updateComposition: store.updateComposition,
    getModelVariantsForUnit: (unitId: string) =>
      _getModelVariantsForUnit(useListEditorStore.getState(), unitId),
    getCompositionForUnit: (armyListUnitId: string) =>
      _getCompositionForUnit(useListEditorStore.getState(), armyListUnitId),
    getCompositionSummary: (armyListUnitId: string, unitId: string) =>
      _getCompositionSummary(useListEditorStore.getState(), armyListUnitId, unitId),

    // Leader attachment
    leaderTargets: store.leaderTargets,
    leaderAttachments: store.leaderAttachments,
    attachLeader: store.attachLeader,
    detachLeader: store.detachLeader,
    getEligibleLeaders: (unitId: string) =>
      _getEligibleLeaders(useListEditorStore.getState(), unitId),
    getAttachmentForTarget: (targetArmyListUnitId: string) =>
      _getAttachmentForTarget(useListEditorStore.getState(), targetArmyListUnitId),
    isLeaderAttachedElsewhere: (leaderArmyListUnitId: string, targetArmyListUnitId: string) =>
      _isLeaderAttachedElsewhere(useListEditorStore.getState(), leaderArmyListUnitId, targetArmyListUnitId),
  };
}
