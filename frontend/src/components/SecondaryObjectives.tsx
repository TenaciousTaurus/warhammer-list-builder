import { useState, useEffect } from 'react';

interface SecondaryObjectivesProps {
  listId: string;
}

interface ObjectiveState {
  name: string;
  scored: number[];  // VP scored per round (index 0 = round 1)
}

const FIXED_SECONDARIES = [
  'Bring it Down',
  'Assassination',
  'Behind Enemy Lines',
  'Engage on All Fronts',
  'Deploy Teleport Homer',
  'Investigate Signals',
  'Area Denial',
  'A Tempting Target',
  'Secure No Man\'s Land',
  'Storm Hostile Objective',
  'Extend Battle Lines',
  'Cleanse',
];

export function SecondaryObjectives({ listId }: SecondaryObjectivesProps) {
  const storageKey = `secondaries-${listId}`;

  function getStored(): { objectives: ObjectiveState[]; customName: string } {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return { objectives: [], customName: '' };
  }

  const initial = getStored();
  const [objectives, setObjectives] = useState<ObjectiveState[]>(initial.objectives);
  const [showPicker, setShowPicker] = useState(false);
  const [customName, setCustomName] = useState(initial.customName);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ objectives, customName }));
  }, [objectives, customName, storageKey]);

  function addObjective(name: string) {
    if (objectives.some(o => o.name === name)) return;
    setObjectives([...objectives, { name, scored: [0, 0, 0, 0, 0] }]);
    setShowPicker(false);
    setCustomName('');
  }

  function removeObjective(idx: number) {
    setObjectives(objectives.filter((_, i) => i !== idx));
  }

  function updateScore(objIdx: number, round: number, delta: number) {
    setObjectives(prev => prev.map((obj, i) => {
      if (i !== objIdx) return obj;
      const scored = [...obj.scored];
      scored[round] = Math.max(0, Math.min(15, scored[round] + delta));
      return { ...obj, scored };
    }));
  }

  const totalVP = objectives.reduce((sum, obj) => sum + obj.scored.reduce((s, v) => s + v, 0), 0);

  return (
    <div className="secondary-objectives">
      <div className="secondary-objectives__header">
        <span className="secondary-objectives__title">Secondary Objectives</span>
        <span className="secondary-objectives__total">{totalVP} VP</span>
      </div>

      {objectives.length === 0 && !showPicker && (
        <div className="secondary-objectives__empty">
          No secondaries selected.
        </div>
      )}

      {objectives.map((obj, idx) => (
        <div key={obj.name} className="secondary-objectives__card">
          <div className="secondary-objectives__card-header">
            <span className="secondary-objectives__card-name">{obj.name}</span>
            <div className="secondary-objectives__card-right">
              <span className="secondary-objectives__card-total">
                {obj.scored.reduce((s, v) => s + v, 0)} VP
              </span>
              <button
                className="secondary-objectives__remove"
                onClick={() => removeObjective(idx)}
                title="Remove"
              >&times;</button>
            </div>
          </div>
          <div className="secondary-objectives__rounds">
            {[0, 1, 2, 3, 4].map(round => (
              <div key={round} className="secondary-objectives__round">
                <span className="secondary-objectives__round-label">R{round + 1}</span>
                <div className="secondary-objectives__round-controls">
                  <button
                    className="secondary-objectives__score-btn"
                    onClick={() => updateScore(idx, round, -1)}
                    disabled={obj.scored[round] === 0}
                  >-</button>
                  <span className="secondary-objectives__score-value">{obj.scored[round]}</span>
                  <button
                    className="secondary-objectives__score-btn"
                    onClick={() => updateScore(idx, round, 1)}
                    disabled={obj.scored[round] >= 15}
                  >+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showPicker ? (
        <div className="secondary-objectives__picker">
          <div className="secondary-objectives__picker-list">
            {FIXED_SECONDARIES.filter(s => !objectives.some(o => o.name === s)).map(s => (
              <button
                key={s}
                className="secondary-objectives__picker-item"
                onClick={() => addObjective(s)}
              >{s}</button>
            ))}
          </div>
          <div className="secondary-objectives__custom">
            <input
              className="form-input"
              type="text"
              placeholder="Custom objective name..."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && customName.trim()) addObjective(customName.trim()); }}
            />
            <button
              className="btn btn--primary"
              disabled={!customName.trim()}
              onClick={() => addObjective(customName.trim())}
            >Add</button>
          </div>
          <button className="btn" onClick={() => setShowPicker(false)}>Cancel</button>
        </div>
      ) : (
        <button
          className="secondary-objectives__add-btn"
          onClick={() => setShowPicker(true)}
        >+ Add Secondary</button>
      )}
    </div>
  );
}
