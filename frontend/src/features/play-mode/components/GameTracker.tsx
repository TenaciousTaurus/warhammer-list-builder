/** @deprecated Use gameSessionStore instead. Kept for backward compatibility with non-authenticated sessions. */

import { useState, useEffect } from 'react';

interface GameTrackerProps {
  listId: string;
}

const PHASES = ['Command', 'Movement', 'Shooting', 'Charge', 'Fight'] as const;

export function GameTracker({ listId }: GameTrackerProps) {
  const storageKey = `game-${listId}`;

  function getStored() {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  const initial = getStored() || { round: 1, cp: 0, vp: 0, phase: 0 };
  const [round, setRound] = useState<number>(initial.round);
  const [cp, setCp] = useState<number>(initial.cp);
  const [vp, setVp] = useState<number>(initial.vp);
  const [phase, setPhase] = useState<number>(initial.phase);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ round, cp, vp, phase }));
  }, [round, cp, vp, phase]);

  function nextPhase() {
    if (phase >= PHASES.length - 1) {
      setPhase(0);
      if (round < 5) setRound(round + 1);
    } else {
      setPhase(phase + 1);
    }
  }

  function prevPhase() {
    if (phase <= 0) {
      if (round > 1) {
        setRound(round - 1);
        setPhase(PHASES.length - 1);
      }
    } else {
      setPhase(phase - 1);
    }
  }

  function resetGame() {
    setRound(1);
    setCp(0);
    setVp(0);
    setPhase(0);
    localStorage.removeItem(`play-${listId}`);
  }

  return (
    <div className="game-tracker">
      <div className="game-tracker__section">
        <span className="game-tracker__label">Round</span>
        <div className="game-tracker__controls">
          <button className="game-tracker__btn" onClick={() => setRound(Math.max(1, round - 1))} disabled={round <= 1}>-</button>
          <span className="game-tracker__value">{round}/5</span>
          <button className="game-tracker__btn" onClick={() => setRound(Math.min(5, round + 1))} disabled={round >= 5}>+</button>
        </div>
      </div>

      <div className="game-tracker__section">
        <span className="game-tracker__label">Phase</span>
        <div className="game-tracker__controls">
          <button className="game-tracker__btn" onClick={prevPhase}>&larr;</button>
          <span className="game-tracker__value game-tracker__value--phase">{PHASES[phase]}</span>
          <button className="game-tracker__btn" onClick={nextPhase}>&rarr;</button>
        </div>
      </div>

      <div className="game-tracker__section">
        <span className="game-tracker__label">CP</span>
        <div className="game-tracker__controls">
          <button className="game-tracker__btn" onClick={() => setCp(Math.max(0, cp - 1))} disabled={cp <= 0}>-</button>
          <span className="game-tracker__value">{cp}</span>
          <button className="game-tracker__btn" onClick={() => setCp(cp + 1)}>+</button>
        </div>
      </div>

      <div className="game-tracker__section">
        <span className="game-tracker__label">VP</span>
        <div className="game-tracker__controls">
          <button className="game-tracker__btn" onClick={() => setVp(Math.max(0, vp - 1))} disabled={vp <= 0}>-</button>
          <span className="game-tracker__value">{vp}</span>
          <button className="game-tracker__btn" onClick={() => setVp(vp + 1)}>+</button>
        </div>
      </div>

      <button className="game-tracker__reset" onClick={resetGame}>Reset Game</button>
    </div>
  );
}
