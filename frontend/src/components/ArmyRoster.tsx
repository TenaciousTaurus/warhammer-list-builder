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
}

export function ArmyRoster({
  listUnits, rosterByRole, rosterSectionPoints, selectedArmyListUnitId,
  getEnhancementForUnit, getWargearSummary, onSelectUnit, onRemoveUnit,
}: ArmyRosterProps) {
  if (listUnits.length === 0) {
    return (
      <div className="empty-state card" style={{ margin: 'var(--space-md)' }}>
        <div className="empty-state__icon">&#9876;</div>
        <div className="empty-state__title">No Units Added</div>
        <p>Select units from the left panel to build your army.</p>
      </div>
    );
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
              return (
                <RosterItem
                  key={lu.id}
                  unitName={lu.units.name}
                  modelCount={lu.model_count}
                  points={unitPts}
                  enhancementName={enh?.name}
                  enhancementPoints={enh?.points}
                  wargearSummary={wargearSummary}
                  isSelected={lu.id === selectedArmyListUnitId}
                  onClick={() => onSelectUnit(lu.id)}
                  onRemove={() => onRemoveUnit(lu.id)}
                  unit={lu.units}
                  weapons={lu.units.weapons ?? []}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}
