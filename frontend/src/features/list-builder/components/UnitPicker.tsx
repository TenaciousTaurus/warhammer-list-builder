import { ROLE_ORDER, ROLE_LABELS, type UnitWithRelations } from '../hooks/useListEditor';

interface UnitPickerProps {
  listName: string;
  totalPoints: number;
  filteredUnits: UnitWithRelations[];
  filteredAlliedUnits: UnitWithRelations[];
  unitsByRole: Record<string, UnitWithRelations[]>;
  unitCountsInList: Map<string, number>;
  collapsedPickerRoles: Set<string>;
  unitPickerFilter: string;
  showLegends: boolean;
  showOwnedOnly: boolean;
  ownedUnitCounts: Map<string, number>;
  onFilterChange: (filter: string) => void;
  onAddUnit: (unit: UnitWithRelations) => void;
  onToggleRole: (role: string) => void;
  onToggleLegends: () => void;
  onToggleOwnedOnly: () => void;
  className?: string;
}

export function UnitPicker({
  listName, totalPoints, filteredUnits, filteredAlliedUnits, unitsByRole, unitCountsInList,
  collapsedPickerRoles, unitPickerFilter, showLegends, showOwnedOnly, ownedUnitCounts,
  onFilterChange, onAddUnit, onToggleRole, onToggleLegends, onToggleOwnedOnly, className,
}: UnitPickerProps) {
  const isSearching = unitPickerFilter.length > 0;

  function renderUnitItem(unit: UnitWithRelations) {
    const minTier = unit.unit_points_tiers.length > 0
      ? Math.min(...unit.unit_points_tiers.map(t => t.points))
      : 0;
    const currentCount = unitCountsInList.get(unit.id) ?? 0;
    const atLimit = currentCount >= unit.max_per_list;
    const ownedCount = ownedUnitCounts.get(unit.id);
    return (
      <div
        key={unit.id}
        className={`unit-picker-item${atLimit ? ' unit-picker-item--disabled' : ''}`}
        onClick={() => !atLimit && onAddUnit(unit)}
      >
        <div className="unit-picker-item__info">
          <span className="unit-picker-item__points-inline">{minTier}</span>
          <span className="unit-picker-item__name">{unit.name}</span>
          {ownedCount !== undefined && (
            <span className="unit-picker-item__owned-badge">{ownedCount} owned</span>
          )}
          <span className="unit-picker-item__count">
            ({currentCount}/{unit.max_per_list})
          </span>
        </div>
        <button
          className="unit-picker-item__add"
          onClick={(e) => { e.stopPropagation(); if (!atLimit) onAddUnit(unit); }}
          disabled={atLimit}
        >+</button>
      </div>
    );
  }

  return (
    <div className={`list-editor__picker${className ? ` ${className}` : ''}`}>
      <div className="list-editor__picker-header">
        <div className="list-editor__picker-title">{listName}</div>
        <div className="list-editor__picker-points">{totalPoints} pts</div>
      </div>

      <div className="list-editor__picker-list">
        {showOwnedOnly && ownedUnitCounts.size === 0 ? (
          <div className="picker__empty-owned">
            Add models to your collection to use this filter.
          </div>
        ) : isSearching ? (
          <>
            {filteredUnits.map(renderUnitItem)}
            {filteredAlliedUnits.map(renderUnitItem)}
          </>
        ) : (
          <>
            {ROLE_ORDER.map((role) => {
              const roleUnits = unitsByRole[role];
              if (!roleUnits || roleUnits.length === 0) return null;
              const isCollapsed = collapsedPickerRoles.has(role);
              return (
                <div key={role} className="picker-section">
                  <div
                    className={`picker-section__header picker-section__header--${role}`}
                    onClick={() => onToggleRole(role)}
                  >
                    <span className="picker-section__arrow">{isCollapsed ? '\u25B6' : '\u25BC'}</span>
                    <span className="picker-section__label">{ROLE_LABELS[role]}</span>
                  </div>
                  {!isCollapsed && roleUnits.map(renderUnitItem)}
                </div>
              );
            })}
            {filteredAlliedUnits.length > 0 && (
              <div className="picker-section">
                <div
                  className="picker-section__header picker-section__header--allied"
                  onClick={() => onToggleRole('allied')}
                >
                  <span className="picker-section__arrow">
                    {collapsedPickerRoles.has('allied') ? '\u25B6' : '\u25BC'}
                  </span>
                  <span className="picker-section__label">Allied Units</span>
                </div>
                {!collapsedPickerRoles.has('allied') && filteredAlliedUnits.map(renderUnitItem)}
              </div>
            )}
          </>
        )}
      </div>

      <div className="list-editor__picker-footer">
        <input
          className="form-input list-editor__picker-search picker__search"
          type="text"
          placeholder="Search units..."
          value={unitPickerFilter}
          onChange={(e) => onFilterChange(e.target.value)}
        />
        <div className="picker__toggles">
          <label className="picker__legends-toggle">
            <input
              type="checkbox"
              checked={showLegends}
              onChange={onToggleLegends}
            />
            <span>Legends</span>
          </label>
          <label className="picker__owned-toggle">
            <input
              type="checkbox"
              checked={showOwnedOnly}
              onChange={onToggleOwnedOnly}
            />
            <span>Owned only</span>
          </label>
        </div>
      </div>
    </div>
  );
}
