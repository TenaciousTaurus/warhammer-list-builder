import { useState, useRef, useCallback, useEffect } from 'react';

interface ChessTimerState {
  playerSeconds: number;
  opponentSeconds: number;
  activeTimer: 'player' | 'opponent' | null;
  isRunning: boolean;
}

export function useChessTimer(
  initialPlayerSeconds = 0,
  initialOpponentSeconds = 0,
  onTick?: (playerSeconds: number, opponentSeconds: number) => void,
) {
  const [state, setState] = useState<ChessTimerState>({
    playerSeconds: initialPlayerSeconds,
    opponentSeconds: initialOpponentSeconds,
    activeTimer: null,
    isRunning: false,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);
  // eslint-disable-next-line react-hooks/refs -- ref kept in sync for interval callback to read latest state without re-creating timer
  stateRef.current = state;

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState(prev => ({ ...prev, isRunning: false, activeTimer: null }));
  }, []);

  const startPlayer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState(prev => ({ ...prev, isRunning: true, activeTimer: 'player' }));
    intervalRef.current = setInterval(() => {
      setState(prev => {
        const next = { ...prev, playerSeconds: prev.playerSeconds + 1 };
        onTick?.(next.playerSeconds, next.opponentSeconds);
        return next;
      });
    }, 1000);
  }, [onTick]);

  const startOpponent = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState(prev => ({ ...prev, isRunning: true, activeTimer: 'opponent' }));
    intervalRef.current = setInterval(() => {
      setState(prev => {
        const next = { ...prev, opponentSeconds: prev.opponentSeconds + 1 };
        onTick?.(next.playerSeconds, next.opponentSeconds);
        return next;
      });
    }, 1000);
  }, [onTick]);

  const toggle = useCallback(() => {
    if (stateRef.current.activeTimer === 'player') {
      startOpponent();
    } else {
      startPlayer();
    }
  }, [startPlayer, startOpponent]);

  const reset = useCallback(() => {
    stop();
    setState({
      playerSeconds: 0,
      opponentSeconds: 0,
      activeTimer: null,
      isRunning: false,
    });
  }, [stop]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    ...state,
    startPlayer,
    startOpponent,
    toggle,
    stop,
    reset,
  };
}

export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
