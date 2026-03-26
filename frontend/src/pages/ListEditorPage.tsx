import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListEditor, getUnitPoints } from '../hooks/useListEditor';
import { UnitPicker } from '../components/UnitPicker';
import { ListSummary } from '../components/ListSummary';
import { ArmyRoster } from '../components/ArmyRoster';
import { UnitDetailPanel } from '../components/UnitDetailPanel';
import { ExportModal } from '../components/ExportModal';

export function ListEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const editor = useListEditor(id);

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
    return <div className="empty-state"><p>Loading...</p></div>;
  }

  const selectedLu = editor.selectedLu;

  return (
    <div className="list-editor">
      {/* LEFT PANEL: Unit Picker */}
      <UnitPicker
        listName={editor.list.name}
        totalPoints={editor.totalPoints}
        filteredUnits={editor.filteredUnits}
        unitsByRole={editor.unitsByRole}
        unitCountsInList={editor.unitCountsInList}
        collapsedPickerRoles={editor.collapsedPickerRoles}
        unitPickerFilter={editor.unitPickerFilter}
        onFilterChange={editor.setUnitPickerFilter}
        onAddUnit={editor.addUnit}
        onToggleRole={editor.togglePickerRole}
      />

      {/* CENTER PANEL: Army Roster */}
      <div className="list-editor__roster">
        <ListSummary
          list={editor.list}
          totalPoints={editor.totalPoints}
          overLimit={editor.overLimit}
          unitLimitWarnings={editor.unitLimitWarnings}
          enhancementWarnings={editor.enhancementWarnings}
          pointsMismatch={editor.pointsMismatch}
          serverValidation={editor.serverValidation}
          serverValidationError={editor.serverValidationError}
          onBack={() => navigate('/')}
          onExport={() => editor.setShowExport(true)}
          onPlay={() => navigate(`/play/${id}`)}
          onUpdateName={editor.updateListName}
          onUpdatePointsLimit={editor.updatePointsLimit}
        />

        <div className="list-editor__roster-list">
          <ArmyRoster
            listUnits={editor.listUnits}
            rosterByRole={editor.rosterByRole}
            rosterSectionPoints={editor.rosterSectionPoints}
            selectedArmyListUnitId={editor.selectedArmyListUnitId}
            getEnhancementForUnit={editor.getEnhancementForUnit}
            getWargearSummary={editor.getWargearSummary}
            onSelectUnit={editor.setSelectedArmyListUnitId}
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
      <div className="list-editor__detail">
        {selectedLu ? (() => {
          const isCharacter = selectedLu.units.role === 'character';
          const unitEnh = editor.unitEnhancementMap.get(selectedLu.id);
          const unitOpts = editor.wargearOptions.filter(w => w.unit_id === selectedLu.unit_id);

          return (
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
            />
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
          getUnitPoints={getUnitPoints}
          onClose={() => editor.setShowExport(false)}
          onImport={editor.handleImport}
        />
      )}
    </div>
  );
}
