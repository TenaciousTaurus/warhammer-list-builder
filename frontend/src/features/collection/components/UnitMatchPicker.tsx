import { useState, useRef, useEffect, useMemo } from 'react';
import type { Unit } from '../../../shared/types/database';

interface UnitMatchPickerProps {
  units: Unit[];
  selectedUnitId: string | null;
  factionId: string | null;
  onSelect: (unitId: string | null) => void;
}

export function UnitMatchPicker({ units, selectedUnitId, factionId, onSelect }: UnitMatchPickerProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedUnit = useMemo(
    () => units.find((u) => u.id === selectedUnitId) ?? null,
    [units, selectedUnitId]
  );

  // Filter by faction (if set) and search query
  const filtered = useMemo(() => {
    let result = units;
    if (factionId) {
      result = result.filter((u) => u.faction_id === factionId);
    }
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter((u) => u.name.toLowerCase().includes(lowerQuery));
    }
    return result.slice(0, 50);
  }, [units, factionId, query]);

  // Group by role
  const grouped = useMemo(() => {
    const groups = new Map<string, Unit[]>();
    for (const u of filtered) {
      const list = groups.get(u.role) ?? [];
      list.push(u);
      groups.set(u.role, list);
    }
    return groups;
  }, [filtered]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open]);

  return (
    <div className="unit-picker-match" ref={containerRef}>
      <button
        type="button"
        className="unit-picker-match__trigger"
        onClick={() => setOpen(!open)}
      >
        {selectedUnit ? (
          <span className="unit-picker-match__selected">
            <span className="unit-picker-match__role-dot" data-role={selectedUnit.role} />
            <span className="unit-picker-match__selected-name">{selectedUnit.name}</span>
          </span>
        ) : (
          <span className="unit-picker-match__placeholder">Link to datasheet...</span>
        )}
        <span className="unit-picker-match__arrow">{open ? '\u25B2' : '\u25BC'}</span>
      </button>

      {selectedUnit && (
        <button
          type="button"
          className="unit-picker-match__clear"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(null);
          }}
          title="Clear linked unit"
        >
          &times;
        </button>
      )}

      {open && (
        <div className="unit-picker-match__dropdown">
          <input
            className="unit-picker-match__search"
            type="text"
            placeholder="Search units..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="unit-picker-match__list">
            {grouped.size === 0 && (
              <div className="unit-picker-match__empty">
                {factionId ? 'No units found for this faction' : 'No units found'}
              </div>
            )}
            {Array.from(grouped.entries()).map(([role, roleUnits]) => (
              <div key={role} className="unit-picker-match__group">
                <div className="unit-picker-match__group-label">{role}</div>
                {roleUnits.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    className={`unit-picker-match__option ${u.id === selectedUnitId ? 'unit-picker-match__option--selected' : ''}`}
                    onClick={() => {
                      onSelect(u.id);
                      setOpen(false);
                      setQuery('');
                    }}
                  >
                    <span className="unit-picker-match__role-dot" data-role={u.role} />
                    <span className="unit-picker-match__option-name">{u.name}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
