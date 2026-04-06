import { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useListEditor, getUnitPoints } from '../hooks/useListEditor';
import { useListVerification } from '../../collection/hooks/useListVerification';
import { UnitPicker } from '../components/UnitPicker';
import { ListSummary } from '../components/ListSummary';
import { ArmyRoster } from '../components/ArmyRoster';
import { UnitDetailPanel } from '../components/UnitDetailPanel';
import { ExportModal } from '../components/ExportModal';
import { ListVerification } from '../../collection/components/ListVerification';
import type { UnitWithRelations } from '../stores/listEditorStore';

type MobileTab = 'roster' | 'picker' | 'detail';

export function ListEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const editor = useListEditor(id);
  const verification = useListVerification(editor.listUnits, user?.id);
  const [mobileTab, setMobileTab] = useState<MobileTab>('roster');

  // On mobile, selecting a unit switches to detail tab
  const handleSelectUnit = useCallback((unitId: string | null) => {
    editor.setSelectedArmyListUnitId(unitId);
    if (unitId) setMobileTab('detail');
  }, [editor]);

  // On mobile, adding a unit switches back to roster
  const handleAddUnit = useCallback((unit: UnitWithRelations) => {
    editor.addUnit(unit);
    setMobileTab('roster');
  }, [editor]);

  // Back from detail → roster
  const handleBackToRoster = useCallback(() => {
    editor.setSelectedArmyListUnitId(null);
    setMobileTab('roster');
  }, [editor]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't handle shortcuts when typing in inputs
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    // Escape: close detail panel or export modal
    if (e.key === 'Escape') {
      if (editor.showExport) {
        editor.setShowExport(false);
      } else if (editor.selectedArmyListUnitId) {
        editor.setSelectedArmyListUnitId(null);
      }
      return;
    }

    // E: open export
    if (e.key === 'e' && !e.ctrlKey && !e.metaKey) {
      editor.setShowExport(true);
      return;
    }

    // P: go to play mode
    if (e.key === 'p' && !e.ctrlKey && !e.metaKey) {
      navigate(`/play/${id}`);
      return;
    }

    // /: focus search
    if (e.key === '/') {
      e.preventDefault();
      const searchInput = document.querySelector('.picker__search') as HTMLInputElement;
      if (searchInput) searchInput.focus();
      return;
    }

    // Delete/Backspace: remove selected unit
    if ((e.key === 'Delete' || e.key === 'Backspace') && editor.selectedArmyListUnitId) {
      editor.removeUnit(editor.selectedArmyListUnitId);
      return;
    }

    // Arrow Up/Down: navigate roster selection
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (editor.listUnits.length === 0) return;
      e.preventDefault();
      const currentIdx = editor.selectedArmyListUnitId
        ? editor.listUnits.findIndex(lu => lu.id === editor.selectedArmyListUnitId)
        : -1;
      let nextIdx: number;
      if (e.key === 'ArrowDown') {
        nextIdx = currentIdx < editor.listUnits.length - 1 ? currentIdx + 1 : 0;
      } else {
        nextIdx = currentIdx > 0 ? currentIdx - 1 : editor.listUnits.length - 1;
      }
      editor.setSelectedArmyListUnitId(editor.listUnits[nextIdx].id);
      return;
    }
  }, [editor, id, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (editor.loading || !editor.list) {
    return (
      <div className="list-editor" style={{ gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
        <div className="skeleton" style={{ width: '260px', height: '400px' }} />
        <div className="skeleton-list" style={{ flex: 1 }}>
          <div className="skeleton skeleton--header" />
          <div className="skeleton skeleton--bar" />
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: '48px', width: '100%' }} />
          ))}
        </div>
      </div>
    );
  }

  const selectedLu = editor.selectedLu;

  return (
    <div className="list-editor">
      {/* Mobile tab bar — hidden on desktop via CSS */}
      <div className="list-editor__mobile-tabs">
        <button
          className={`list-editor__mobile-tab${mobileTab === 'roster' || mobileTab === 'detail' ? ' list-editor__mobile-tab--active' : ''}`}
          onClick={() => { handleBackToRoster(); }}
        >
          Roster ({editor.totalPoints} pts)
        </button>
        <button
          className={`list-editor__mobile-tab${mobileTab === 'picker' ? ' list-editor__mobile-tab--active' : ''}`}
          onClick={() => setMobileTab('picker')}
        >
          + Add Units
        </button>
      </div>

      {/* LEFT PANEL: Unit Picker */}
      <UnitPicker
        listName={editor.list.name}
        totalPoints={editor.totalPoints}
        filteredUnits={editor.filteredUnits}
        filteredAlliedUnits={editor.filteredAlliedUnits}
        unitsByRole={editor.unitsByRole}
        unitCountsInList={editor.unitCountsInList}
        collapsedPickerRoles={editor.collapsedPickerRoles}
        unitPickerFilter={editor.unitPickerFilter}
        showLegends={editor.showLegends}
        onFilterChange={editor.setUnitPickerFilter}
        onAddUnit={handleAddUnit}
        onToggleRole={editor.togglePickerRole}
        onToggleLegends={editor.toggleLegends}
        className={mobileTab === 'picker' ? 'list-editor__picker--mobile-visible' : ''}
      />

      {/* CENTER PANEL: Army Roster */}
      <div className={`list-editor__roster${mobileTab === 'roster' ? ' list-editor__roster--mobile-visible' : ''}`}>
        <ListSummary
          list={editor.list}
          totalPoints={editor.totalPoints}
          overLimit={editor.overLimit}
          unitLimitWarnings={editor.unitLimitWarnings}
          enhancementWarnings={editor.enhancementWarnings}
          battleSizeWarnings={editor.battleSizeWarnings}
          transportWarnings={editor.transportWarnings}
          pointsMismatch={editor.pointsMismatch}
          serverValidation={editor.serverValidation}
          serverValidationError={editor.serverValidationError}
          onBack={() => navigate('/lists')}
          onExport={() => editor.setShowExport(true)}
          onPlay={() => navigate(`/play/${id}`)}
          availableDetachments={editor.availableDetachments}
          onUpdateName={editor.updateListName}
          onUpdatePointsLimit={editor.updatePointsLimit}
          onUpdateBattleSize={editor.updateBattleSize}
          onChangeDetachment={editor.changeDetachment}
        />

        <ListVerification {...verification} />

        <div className="list-editor__roster-list">
          <ArmyRoster
            listUnits={editor.listUnits}
            rosterByRole={editor.rosterByRole}
            rosterAlliedUnits={editor.rosterAlliedUnits}
            rosterSectionPoints={editor.rosterSectionPoints}
            rosterAlliedPoints={editor.rosterAlliedPoints}
            selectedArmyListUnitId={editor.selectedArmyListUnitId}
            getEnhancementForUnit={editor.getEnhancementForUnit}
            getWargearSummary={editor.getWargearSummary}
            onSelectUnit={handleSelectUnit}
            onRemoveUnit={editor.removeUnit}
            onReorder={editor.reorderUnits}
          />
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="list-editor__shortcuts-hint">
          <span>/</span> search &nbsp;
          <span>&#8593;&#8595;</span> navigate &nbsp;
          <span>Del</span> remove &nbsp;
          <span>E</span> export &nbsp;
          <span>P</span> play &nbsp;
          <span>Esc</span> close
        </div>
      </div>

      {/* RIGHT PANEL: Unit Detail */}
      <div className={`list-editor__detail${mobileTab === 'detail' && selectedLu ? ' list-editor__detail--mobile-visible' : ''}`}>
        {selectedLu ? (() => {
          const isCharacter = selectedLu.units.role === 'character';
          const unitEnh = editor.unitEnhancementMap.get(selectedLu.id);
          const unitOpts = editor.wargearOptions.filter(w => w.unit_id === selectedLu.unit_id);

          return (
            <>
            <button
              className="list-editor__detail-close"
              onClick={handleBackToRoster}
            >
              &larr; Back to roster
            </button>
            <UnitDetailPanel
              unit={selectedLu.units}
              weapons={selectedLu.units.weapons ?? []}
              modelCount={selectedLu.model_count}
              points={getUnitPoints(selectedLu.units, selectedLu.model_count)}
              availableTiers={selectedLu.units.unit_points_tiers}
              onModelCountChange={(count) => editor.updateModelCount(selectedLu.id, count)}
              onRemove={() => editor.removeUnit(selectedLu.id)}
              onClose={() => editor.setSelectedArmyListUnitId(null)}
              enhancement={isCharacter ? {
                assigned: unitEnh ? editor.enhancements.find(e => e.id === unitEnh.enhancementId) ?? null : null,
                available: editor.enhancements.filter(e => !editor.assignedEnhancementIds.has(e.id) || e.id === unitEnh?.enhancementId),
                onAssign: (enhId) => editor.assignEnhancement(selectedLu.id, enhId),
                limitReached: editor.enhancementLimitReached && !unitEnh,
              } : undefined}
              wargear={unitOpts.length > 0 ? {
                options: unitOpts,
                selected: editor.unitWargearSelections.get(selectedLu.id) ?? new Map(),
                onSelect: (groupName: string, optionId: string) => editor.selectWargear(selectedLu.id, groupName, optionId),
              } : undefined}
              composition={(() => {
                const variants = editor.getModelVariantsForUnit(selectedLu.unit_id);
                if (variants.length === 0) return undefined;
                return {
                  variants,
                  counts: editor.getCompositionForUnit(selectedLu.id),
                  onUpdateCount: (variantId: string, count: number) => editor.updateComposition(selectedLu.id, variantId, count),
                };
              })()}
              leaderAttachment={(() => {
                // Find eligible leaders in the list for this unit
                const eligibleLeaderUnitIds = editor.getEligibleLeaders(selectedLu.unit_id);
                if (eligibleLeaderUnitIds.length === 0) return undefined;

                const eligibleLeaders = editor.listUnits
                  .filter(lu => eligibleLeaderUnitIds.includes(lu.unit_id))
                  .map(lu => ({
                    armyListUnitId: lu.id,
                    unit: lu.units,
                    points: getUnitPoints(lu.units, lu.model_count),
                    isAttachedHere: editor.leaderAttachments.some(
                      la => la.leader_army_list_unit_id === lu.id && la.target_army_list_unit_id === selectedLu.id
                    ),
                    isAttachedElsewhere: editor.isLeaderAttachedElsewhere(lu.id, selectedLu.id),
                  }));

                if (eligibleLeaders.length === 0) return undefined;

                return {
                  eligibleLeaders,
                  onAttach: (leaderALUId: string) => editor.attachLeader(leaderALUId, selectedLu.id),
                  onDetach: (leaderALUId: string) => editor.detachLeader(leaderALUId),
                };
              })()}
            />
            </>
          );
        })() : (
          <div className="detail-panel detail-panel--empty">
            <div className="detail-panel__empty-icon">&#9881;</div>
            <div className="detail-panel__empty-text">
              Select a unit from the roster to view its details
            </div>
          </div>
        )}
      </div>

      {/* Export modal */}
      {editor.showExport && (
        <ExportModal
          list={editor.list}
          listUnits={editor.listUnits}
          enhancements={editor.enhancements}
          listEnhancements={editor.listEnhancements}
          totalPoints={editor.totalPoints}
          wargearOptions={editor.wargearOptions}
          unitWargearSelections={editor.unitWargearSelections}
          onClose={() => editor.setShowExport(false)}
          onImport={editor.handleImport}
        />
      )}
    </div>
  );
}
