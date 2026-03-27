import { useState } from 'react';
import { useDiceRoller } from '../hooks/useDiceRoller';

export function DiceRollerPanel() {
  const { lastRoll, history, roll, clearHistory } = useDiceRoller();
  const [diceCount, setDiceCount] = useState(1);
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleRoll = () => {
    roll(diceCount);
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(30, Number(e.target.value) || 1));
    setDiceCount(value);
  };

  const recentHistory = history.slice(0, 10);

  return (
    <div className="dice-roller">
      <div className="dice-roller__controls">
        <label className="dice-roller__label" htmlFor="dice-count">
          D6
        </label>
        <input
          id="dice-count"
          className="dice-roller__input"
          type="number"
          min={1}
          max={30}
          value={diceCount}
          onChange={handleCountChange}
        />
        <button className="dice-roller__btn" onClick={handleRoll}>
          Roll
        </button>
      </div>

      {lastRoll && (
        <div className="dice-roller__results">
          <div className="dice-roller__dice">
            {lastRoll.dice.map((die, idx) => (
              <span
                key={idx}
                className={`dice-roller__die ${die === 6 ? 'dice-roller__die--six' : ''} ${
                  die === 1 ? 'dice-roller__die--one' : ''
                }`}
              >
                {die}
              </span>
            ))}
          </div>
          <div className="dice-roller__total">
            Total: {lastRoll.total}
          </div>
        </div>
      )}

      {recentHistory.length > 0 && (
        <div className="dice-roller__history">
          <button
            className="dice-roller__history-toggle"
            onClick={() => setHistoryOpen(!historyOpen)}
            aria-expanded={historyOpen}
          >
            History ({recentHistory.length})
            <span className={`dice-roller__chevron ${historyOpen ? 'dice-roller__chevron--open' : ''}`}>
              &#9660;
            </span>
          </button>

          {historyOpen && (
            <div className="dice-roller__history-list">
              {recentHistory.map((entry) => (
                <div key={entry.id} className="dice-roller__history-item">
                  <span className="dice-roller__history-dice">
                    [{entry.dice.join(', ')}]
                  </span>
                  <span className="dice-roller__history-total">
                    = {entry.total}
                  </span>
                </div>
              ))}
              <button
                className="dice-roller__clear-btn"
                onClick={clearHistory}
              >
                Clear History
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
