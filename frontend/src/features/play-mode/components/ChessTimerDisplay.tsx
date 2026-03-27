import { useChessTimer, formatTime } from '../hooks/useChessTimer';

export function ChessTimerDisplay() {
  const {
    playerSeconds,
    opponentSeconds,
    activeTimer,
    isRunning,
    toggle,
    stop,
    reset,
  } = useChessTimer();

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
          onClick={stop}
          disabled={!isRunning}
          aria-label="Pause timer"
        >
          Pause
        </button>
        <button
          className="chess-timer__btn chess-timer__btn--reset"
          onClick={reset}
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
