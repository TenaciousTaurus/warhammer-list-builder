import { useCallback } from 'react';
import { useChessTimer, formatTime } from '../hooks/useChessTimer';
import { useGameSessionStore } from '../stores/gameSessionStore';

export function ChessTimerDisplay() {
  const session = useGameSessionStore((s) => s.session);
  const updateTimerSeconds = useGameSessionStore((s) => s.updateTimerSeconds);

  const handleTick = useCallback((playerSec: number, opponentSec: number) => {
    // Sync to store every 5 seconds to avoid excessive DB writes
    if ((playerSec + opponentSec) % 5 === 0) {
      updateTimerSeconds(playerSec, opponentSec);
    }
  }, [updateTimerSeconds]);

  const {
    playerSeconds,
    opponentSeconds,
    activeTimer,
    isRunning,
    toggle,
    stop,
    reset,
  } = useChessTimer(
    session?.timer_player_seconds ?? 0,
    session?.timer_opponent_seconds ?? 0,
    handleTick,
  );

  const handleStop = () => {
    stop();
    updateTimerSeconds(playerSeconds, opponentSeconds);
  };

  const handleReset = () => {
    reset();
    updateTimerSeconds(0, 0);
  };

  return (
    <div className="chess-timer">
      <div
        className={`chess-timer__player ${
          activeTimer === 'player' ? 'chess-timer__active' : ''
        }`}
      >
        <span className="chess-timer__label">You</span>
        <span className="chess-timer__time">{formatTime(playerSeconds)}</span>
      </div>

      <div className="chess-timer__controls">
        <button
          className="chess-timer__btn chess-timer__btn--toggle"
          onClick={toggle}
          aria-label={
            !isRunning
              ? 'Start timer'
              : activeTimer === 'player'
                ? 'Switch to opponent'
                : 'Switch to player'
          }
        >
          {!isRunning ? 'Start' : 'Switch'}
        </button>
        <button
          className="chess-timer__btn chess-timer__btn--pause"
          onClick={handleStop}
          disabled={!isRunning}
          aria-label="Pause timer"
        >
          Pause
        </button>
        <button
          className="chess-timer__btn chess-timer__btn--reset"
          onClick={handleReset}
          aria-label="Reset timer"
        >
          Reset
        </button>
      </div>

      <div
        className={`chess-timer__player ${
          activeTimer === 'opponent' ? 'chess-timer__active' : ''
        }`}
      >
        <span className="chess-timer__label">Opponent</span>
        <span className="chess-timer__time">{formatTime(opponentSeconds)}</span>
      </div>
    </div>
  );
}
