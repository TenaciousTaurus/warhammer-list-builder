import { useState, useRef, useEffect, useMemo } from 'react';
import type { Paint } from '../../../shared/types/database';

interface PaintPickerProps {
  paints: Paint[];
  selectedPaintId: string | null;
  onSelect: (paintId: string) => void;
}

export function PaintPicker({ paints, selectedPaintId, onSelect }: PaintPickerProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedPaint = useMemo(
    () => paints.find((p) => p.id === selectedPaintId) ?? null,
    [paints, selectedPaintId]
  );

  // Group and filter paints
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
          </span>
        ) : (
          <span className="paint-picker__placeholder">Select paint...</span>
        )}
        <span className="paint-picker__arrow">{open ? '\u25B2' : '\u25BC'}</span>
      </button>

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
                    className={`paint-picker__option ${p.id === selectedPaintId ? 'paint-picker__option--selected' : ''}`}
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
