import { useState } from 'react';
import { useGameSessionStore } from '../stores/gameSessionStore';

export function SecondaryObjectives() {
  const { scores, secondaryObjectives, updateScore, selectObjective, deselectObjective } = useGameSessionStore();
  const [showPicker, setShowPicker] = useState(false);
  const [customName, setCustomName] = useState('');

  // Derive selected objectives from score entries
  const selectedNames = [...new Set(scores.map(s => s.objective_name))];

  function getVP(name: string, round: number): number {
    return scores.find(s => s.objective_name === name && s.round === round)?.vp_scored ?? 0;
  }

  function handleScoreChange(name: string, round: number, delta: number) {
    const current = getVP(name, round);
    const next = Math.max(0, Math.min(15, current + delta));
    updateScore(round, name, next);
  }

  function handleAdd(name: string) {
    if (!name.trim() || selectedNames.includes(name)) return;
    selectObjective(name.trim());
    setShowPicker(false);
    setCustomName('');
  }

  const totalVP = scores.reduce((sum, s) => sum + s.vp_scored, 0);

  // Available objectives from DB, excluding already selected
  const availableObjectives = secondaryObjectives
    .filter(o => !selectedNames.includes(o.name));

  return (
    <div className="secondary-objectives">
      <div className="secondary-objectives__header">
        <span className="secondary-objectives__title">Secondary Objectives</span>
        <span className="secondary-objectives__total">{totalVP} VP</span>
      </div>

      {selectedNames.length === 0 && !showPicker && (
        <div className="secondary-objectives__empty">
          No secondaries selected.
        </div>
      )}

      {selectedNames.map(name => {
        const objTotal = [1, 2, 3, 4, 5].reduce((sum, r) => sum + getVP(name, r), 0);
        return (
          <div key={name} className="secondary-objectives__card">
            <div className="secondary-objectives__card-header">
              <span className="secondary-objectives__card-name">{name}</span>
              <div className="secondary-objectives__card-right">
                <span className="secondary-objectives__card-total">{objTotal} VP</span>
                <button
                  className="secondary-objectives__remove"
                  onClick={() => deselectObjective(name)}
                  title="Remove"
                >&times;</button>
              </div>
            </div>
            <div className="secondary-objectives__rounds">
              {[1, 2, 3, 4, 5].map(round => (
                <div key={round} className="secondary-objectives__round">
                  <span className="secondary-objectives__round-label">R{round}</span>
                  <div className="secondary-objectives__round-controls">
                    <button
                      className="secondary-objectives__score-btn"
                      onClick={() => handleScoreChange(name, round, -1)}
                      disabled={getVP(name, round) === 0}
                    >-</button>
                    <span className="secondary-objectives__score-value">{getVP(name, round)}</span>
                    <button
                      className="secondary-objectives__score-btn"
                      onClick={() => handleScoreChange(name, round, 1)}
                      disabled={getVP(name, round) >= 15}
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {showPicker ? (
        <div className="secondary-objectives__picker">
          <div className="secondary-objectives__picker-list">
            {availableObjectives.map(o => (
              <button
                key={o.id}
                className="secondary-objectives__picker-item"
                onClick={() => handleAdd(o.name)}
              >{o.name}</button>
            ))}
          </div>
          <div className="secondary-objectives__custom">
            <input
              className="form-input"
              type="text"
              placeholder="Custom objective name..."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && customName.trim()) handleAdd(customName.trim()); }}
            />
            <button
              className="btn btn--primary"
              disabled={!customName.trim()}
              onClick={() => handleAdd(customName.trim())}
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
