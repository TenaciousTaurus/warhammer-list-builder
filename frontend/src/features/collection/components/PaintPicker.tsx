import { useState, useRef, useEffect, useMemo } from 'react';
import type { Paint, PaintEquivalentResult } from '../../../shared/types/database';
import { usePaintEquivalents } from '../hooks/usePaintEquivalents';

interface PaintPickerProps {
  paints: Paint[];
  selectedPaintId: string | null;
  onSelect: (paintId: string) => void;
  ownedPaintIds?: Set<string>;
}

export function PaintPicker({ paints, selectedPaintId, onSelect, ownedPaintIds }: PaintPickerProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [showEquivs, setShowEquivs] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { equivalents, loading: equivLoading, fetch: fetchEquivs, clear: clearEquivs } = usePaintEquivalents();

  const selectedPaint = useMemo(
    () => paints.find((p) => p.id === selectedPaintId) ?? null,
    [paints, selectedPaintId]
  );

  const selectedNotOwned = !!selectedPaint && !!ownedPaintIds && !ownedPaintIds.has(selectedPaint.id);

  // Fetch equivalents when a paint is selected that the user doesn't own
  useEffect(() => {
    if (selectedNotOwned && selectedPaintId) {
      fetchEquivs(selectedPaintId);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- collapsing panel when selection changes is intentional UI reset
      setShowEquivs(false);
    } else {
      clearEquivs();
    }
  }, [selectedPaintId, selectedNotOwned, fetchEquivs, clearEquivs]);

  const groupedPaints = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    const filtered = paints.filter(
      (p) =>
        p.paint_name.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery)
    );
    const groups = new Map<string, Paint[]>();
    for (const p of filtered) {
      const list = groups.get(p.brand) ?? [];
      list.push(p);
      groups.set(p.brand, list);
    }
    return groups;
  }, [paints, query]);

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
    <div className="paint-picker" ref={containerRef}>
      <button
        type="button"
        className="paint-picker__trigger"
        onClick={() => setOpen(!open)}
      >
        {selectedPaint ? (
          <span className="paint-picker__selected">
            <span
              className="paint-picker__swatch"
              style={{ background: selectedPaint.hex_color ?? '#888' }}
            />
            <span className="paint-picker__selected-name">
              {selectedPaint.brand} &mdash; {selectedPaint.paint_name}
            </span>
            {selectedNotOwned && (
              <span className="paint-picker__not-owned" title="Not in your inventory">!</span>
            )}
          </span>
        ) : (
          <span className="paint-picker__placeholder">Select paint...</span>
        )}
        <span className="paint-picker__arrow">{open ? '▲' : '▼'}</span>
      </button>

      {/* Equivalents callout when paint not owned */}
      {selectedNotOwned && (
        <div className="paint-picker__equiv-callout">
          <button
            type="button"
            className="paint-picker__equiv-toggle"
            onClick={() => setShowEquivs(!showEquivs)}
          >
            {equivLoading ? 'Loading equivalents…' : (
              equivalents.length > 0
                ? `${showEquivs ? '▲' : '▼'} ${equivalents.length} equivalent${equivalents.length !== 1 ? 's' : ''} you may own`
                : 'Not in your inventory — no equivalents found'
            )}
          </button>
          {showEquivs && equivalents.length > 0 && (
            <EquivalentsList
              equivalents={equivalents}
              ownedPaintIds={ownedPaintIds}
              onSelect={(id) => { onSelect(id); setShowEquivs(false); }}
            />
          )}
        </div>
      )}

      {open && (
        <div className="paint-picker__dropdown">
          <input
            className="paint-picker__search"
            type="text"
            placeholder="Search paints..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="paint-picker__list">
            {groupedPaints.size === 0 && (
              <div className="paint-picker__empty">No paints found</div>
            )}
            {Array.from(groupedPaints.entries()).map(([brand, brandPaints]) => (
              <div key={brand} className="paint-picker__group">
                <div className="paint-picker__group-label">{brand}</div>
                {brandPaints.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`paint-picker__option${p.id === selectedPaintId ? ' paint-picker__option--selected' : ''}${ownedPaintIds && !ownedPaintIds.has(p.id) ? ' paint-picker__option--not-owned' : ''}`}
                    onClick={() => {
                      onSelect(p.id);
                      setOpen(false);
                      setQuery('');
                    }}
                  >
                    <span
                      className="paint-picker__swatch"
                      style={{ background: p.hex_color ?? '#888' }}
                    />
                    <span className="paint-picker__option-name">{p.paint_name}</span>
                    <span className="paint-picker__option-type">{p.paint_type}</span>
                    {p.is_metallic && <span className="paint-picker__metallic">M</span>}
                    {ownedPaintIds?.has(p.id) && <span className="paint-picker__owned-badge">✓</span>}
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

interface EquivalentsListProps {
  equivalents: PaintEquivalentResult[];
  ownedPaintIds?: Set<string>;
  onSelect: (paintId: string) => void;
}

function EquivalentsList({ equivalents, ownedPaintIds, onSelect }: EquivalentsListProps) {
  return (
    <ul className="paint-picker__equiv-list">
      {equivalents.map((eq) => {
        const owned = ownedPaintIds?.has(eq.equivalent_paint_id);
        return (
          <li key={eq.equivalent_paint_id} className={`paint-picker__equiv-item${owned ? ' paint-picker__equiv-item--owned' : ''}`}>
            <span className="paint-picker__swatch" style={{ background: eq.hex_color ?? '#888' }} />
            <span className="paint-picker__equiv-name">
              {eq.brand} — {eq.paint_name}
            </span>
            <span className="paint-picker__equiv-score">{eq.similarity_score}%</span>
            {owned && <span className="paint-picker__equiv-you-own">you own this</span>}
            <button
              type="button"
              className="paint-picker__equiv-use"
              onClick={() => onSelect(eq.equivalent_paint_id)}
            >
              Use
            </button>
          </li>
        );
      })}
    </ul>
  );
}
