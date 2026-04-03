import { useState, useEffect, useCallback } from 'react';
import { useGameSessionStore } from '../stores/gameSessionStore';

interface CasualtyTrackerProps {
  armyListUnitId: string;
  modelCount: number;
  wounds: number;
  isMultiWound: boolean;
}

export function CasualtyTracker({ armyListUnitId, modelCount, wounds, isMultiWound }: CasualtyTrackerProps) {
  const session = useGameSessionStore((s) => s.session);
  const storeUnitStates = useGameSessionStore((s) => s.unitStates);
  const updateUnitState = useGameSessionStore((s) => s.updateUnitState);

  // Initialize from store state (DB-backed) or defaults
  const [modelStates, setModelStates] = useState<number[]>(() => {
    const fromStore = storeUnitStates.find((us) => us.armyListUnitId === armyListUnitId);
    if (fromStore) return fromStore.modelStates;
    if (isMultiWound) return Array(modelCount).fill(wounds);
    return Array(modelCount).fill(0);
  });

  // Sync from store when remote updates arrive via Realtime
  useEffect(() => {
    const fromStore = storeUnitStates.find((us) => us.armyListUnitId === armyListUnitId);
    if (fromStore) {
      setModelStates(fromStore.modelStates);
    }
  }, [storeUnitStates, armyListUnitId]);

  // Persist to store + DB when local state changes
  const handleStateChange = useCallback((newStates: number[]) => {
    setModelStates(newStates);
    if (session) {
      updateUnitState(armyListUnitId, newStates);
    }
  }, [session, armyListUnitId, updateUnitState]);

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
                  handleStateChange(next);
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
                  handleStateChange(next);
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
              handleStateChange(next);
            }}
            title={dead ? 'Mark alive' : 'Mark dead'}
          />
        ))}
      </div>
      <span className="casualty-tracker__count">{alive}/{modelCount} alive</span>
    </div>
  );
}
