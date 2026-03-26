import { useState, useEffect } from 'react';

interface CasualtyTrackerProps {
  armyListUnitId: string;
  listId: string;
  modelCount: number;
  wounds: number;
  isMultiWound: boolean;
}

export function CasualtyTracker({ armyListUnitId, listId, modelCount, wounds, isMultiWound }: CasualtyTrackerProps) {
  const storageKey = `play-${listId}`;

  function getStoredState(): Record<string, number[]> {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  function saveState(state: Record<string, number[]>) {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  // For multi-model units: array of 0 (alive) or 1 (dead)
  // For multi-wound: array of current wounds per model
  const [modelStates, setModelStates] = useState<number[]>(() => {
    const stored = getStoredState();
    if (stored[armyListUnitId]) return stored[armyListUnitId];
    if (isMultiWound) return Array(modelCount).fill(wounds);
    return Array(modelCount).fill(0);
  });

  useEffect(() => {
    const state = getStoredState();
    state[armyListUnitId] = modelStates;
    saveState(state);
  }, [modelStates]);

  if (isMultiWound) {
    // Wound tracker per model
    return (
      <div className="casualty-tracker">
        {modelStates.map((currentWounds, i) => (
          <div key={i} className="casualty-tracker__wound-model">
            <span className={`casualty-tracker__wound-label${currentWounds === 0 ? ' casualty-tracker__wound-label--dead' : ''}`}>
              {modelCount > 1 ? `#${i + 1}` : 'Wounds'}
            </span>
            <div className="casualty-tracker__wound-controls">
              <button
                className="casualty-tracker__wound-btn"
                onClick={() => {
                  const next = [...modelStates];
                  next[i] = Math.max(0, next[i] - 1);
                  setModelStates(next);
                }}
                disabled={currentWounds === 0}
              >-</button>
              <span className={`casualty-tracker__wound-count${currentWounds === 0 ? ' casualty-tracker__wound-count--dead' : ''}`}>
                {currentWounds}/{wounds}
              </span>
              <button
                className="casualty-tracker__wound-btn"
                onClick={() => {
                  const next = [...modelStates];
                  next[i] = Math.min(wounds, next[i] + 1);
                  setModelStates(next);
                }}
                disabled={currentWounds === wounds}
              >+</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Multi-model pip tracker
  const alive = modelStates.filter(s => s === 0).length;
  return (
    <div className="casualty-tracker">
      <div className="casualty-tracker__pips">
        {modelStates.map((dead, i) => (
          <button
            key={i}
            className={`casualty-tracker__pip${dead ? ' casualty-tracker__pip--dead' : ''}`}
            onClick={() => {
              const next = [...modelStates];
              next[i] = next[i] ? 0 : 1;
              setModelStates(next);
            }}
            title={dead ? 'Mark alive' : 'Mark dead'}
          />
        ))}
      </div>
      <span className="casualty-tracker__count">{alive}/{modelCount} alive</span>
    </div>
  );
}
