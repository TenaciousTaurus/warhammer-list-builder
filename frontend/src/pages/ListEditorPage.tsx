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
