import { useState, useRef } from 'react';
import { ROLE_ORDER, ROLE_LABELS, getUnitPoints, type ArmyListUnitWithDetails } from '../hooks/useListEditor';
import type { Enhancement } from '../types/database';
import { RosterItem } from './RosterItem';

interface ArmyRosterProps {
  listUnits: ArmyListUnitWithDetails[];
  rosterByRole: Record<string, ArmyListUnitWithDetails[]>;
  rosterSectionPoints: Record<string, number>;
  selectedArmyListUnitId: string | null;
  getEnhancementForUnit: (armyListUnitId: string) => Enhancement | null;
  getWargearSummary: (armyListUnitId: string, unitId: string) => string;
  onSelectUnit: (armyListUnitId: string) => void;
  onRemoveUnit: (armyListUnitId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function ArmyRoster({
  listUnits, rosterByRole, rosterSectionPoints, selectedArmyListUnitId,
  getEnhancementForUnit, getWargearSummary, onSelectUnit, onRemoveUnit, onReorder,
}: ArmyRosterProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  if (listUnits.length === 0) {
    return (
      <div className="empty-state card" style={{ margin: 'var(--space-md)' }}>
        <div className="empty-state__icon">&#9876;</div>
        <div className="empty-state__title">No Units Added</div>
        <p>Select units from the left panel to build your army.</p>
      </div>
    );
  }

  function getGlobalIndex(armyListUnitId: string): number {
    return listUnits.findIndex(lu => lu.id === armyListUnitId);
  }

  function handleDragStart(armyListUnitId: string) {
    dragIndexRef.current = getGlobalIndex(armyListUnitId);
  }

  function handleDragOver(e: React.DragEvent, armyListUnitId: string) {
    e.preventDefault();
    const idx = getGlobalIndex(armyListUnitId);
    if (idx !== dragOverIndex) setDragOverIndex(idx);
  }

  function handleDrop(armyListUnitId: string) {
    const fromIndex = dragIndexRef.current;
    const toIndex = getGlobalIndex(armyListUnitId);
    if (fromIndex !== null && fromIndex !== toIndex) {
      onReorder(fromIndex, toIndex);
    }
    dragIndexRef.current = null;
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  }

  function handleMoveUp(armyListUnitId: string) {
    const idx = getGlobalIndex(armyListUnitId);
    if (idx > 0) onReorder(idx, idx - 1);
  }

  function handleMoveDown(armyListUnitId: string) {
    const idx = getGlobalIndex(armyListUnitId);
    if (idx < listUnits.length - 1) onReorder(idx, idx + 1);
  }

  return (
    <>
      {ROLE_ORDER.map((role) => {
        const roleUnits = rosterByRole[role];
        if (!roleUnits || roleUnits.length === 0) return null;
        return (
          <div key={role} className="roster-section">
            <div className={`roster-section__header roster-section__header--${role}`}>
              <span>{ROLE_LABELS[role]}</span>
              <span className="roster-section__points">{rosterSectionPoints[role] ?? 0} pts</span>
            </div>
            {roleUnits.map((lu) => {
              const unitPts = getUnitPoints(lu.units, lu.model_count);
              const enh = getEnhancementForUnit(lu.id);
              const wargearSummary = getWargearSummary(lu.id, lu.unit_id);
              const globalIdx = getGlobalIndex(lu.id);
              const isDragOver = dragOverIndex === globalIdx;

              return (
                <div
                  key={lu.id}
                  draggable
                  onDragStart={() => handleDragStart(lu.id)}
                  onDragOver={(e) => handleDragOver(e, lu.id)}
                  onDrop={() => handleDrop(lu.id)}
                  onDragEnd={handleDragEnd}
                  className={isDragOver ? 'roster-item__drag-over' : ''}
                >
                  <RosterItem
                    unitName={lu.units.name}
                    modelCount={lu.model_count}
                    points={unitPts}
                    enhancementName={enh?.name}
                    enhancementPoints={enh?.points}
                    wargearSummary={wargearSummary}
                    isSelected={lu.id === selectedArmyListUnitId}
                    onClick={() => onSelectUnit(lu.id)}
                    onRemove={() => onRemoveUnit(lu.id)}
                    onMoveUp={globalIdx > 0 ? () => handleMoveUp(lu.id) : undefined}
                    onMoveDown={globalIdx < listUnits.length - 1 ? () => handleMoveDown(lu.id) : undefined}
                    unit={lu.units}
                    weapons={lu.units.weapons ?? []}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
