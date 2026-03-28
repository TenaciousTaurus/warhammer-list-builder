import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChessTimer, formatTime } from './useChessTimer';

describe('formatTime', () => {
  it('formats seconds only', () => {
    expect(formatTime(45)).toBe('0:45');
  });

  it('formats minutes and seconds', () => {
    expect(formatTime(125)).toBe('2:05');
  });

  it('formats hours, minutes, and seconds', () => {
    expect(formatTime(3661)).toBe('1:01:01');
  });

  it('formats zero', () => {
    expect(formatTime(0)).toBe('0:00');
  });

  it('pads seconds with leading zero', () => {
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(63)).toBe('1:03');
  });

  it('pads minutes in hours format', () => {
    expect(formatTime(3605)).toBe('1:00:05');
  });
});

describe('useChessTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useChessTimer());
    expect(result.current.playerSeconds).toBe(0);
    expect(result.current.opponentSeconds).toBe(0);
    expect(result.current.activeTimer).toBeNull();
    expect(result.current.isRunning).toBe(false);
  });

  it('initializes with custom values', () => {
    const { result } = renderHook(() => useChessTimer(60, 120));
    expect(result.current.playerSeconds).toBe(60);
    expect(result.current.opponentSeconds).toBe(120);
  });

  it('starts player timer and increments', () => {
    const { result } = renderHook(() => useChessTimer());

    act(() => {
      result.current.startPlayer();
    });

    expect(result.current.isRunning).toBe(true);
    expect(result.current.activeTimer).toBe('player');

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.playerSeconds).toBe(3);
    expect(result.current.opponentSeconds).toBe(0);
  });

  it('starts opponent timer and increments', () => {
    const { result } = renderHook(() => useChessTimer());

    act(() => {
      result.current.startOpponent();
    });

    expect(result.current.activeTimer).toBe('opponent');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.opponentSeconds).toBe(2);
    expect(result.current.playerSeconds).toBe(0);
  });

  it('toggles between player and opponent', () => {
    const { result } = renderHook(() => useChessTimer());

    act(() => {
      result.current.startPlayer();
    });
    expect(result.current.activeTimer).toBe('player');

    act(() => {
      result.current.toggle();
    });
    expect(result.current.activeTimer).toBe('opponent');

    act(() => {
      result.current.toggle();
    });
    expect(result.current.activeTimer).toBe('player');
  });

  it('stops the timer', () => {
    const { result } = renderHook(() => useChessTimer());

    act(() => {
      result.current.startPlayer();
      vi.advanceTimersByTime(2000);
    });

    act(() => {
      result.current.stop();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.activeTimer).toBeNull();

    const secondsAfterStop = result.current.playerSeconds;
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.playerSeconds).toBe(secondsAfterStop);
  });

  it('resets the timer', () => {
    const { result } = renderHook(() => useChessTimer());

    act(() => {
      result.current.startPlayer();
      vi.advanceTimersByTime(5000);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.playerSeconds).toBe(0);
    expect(result.current.opponentSeconds).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.activeTimer).toBeNull();
  });

  it('calls onTick callback', () => {
    const onTick = vi.fn();
    const { result } = renderHook(() => useChessTimer(0, 0, onTick));

    act(() => {
      result.current.startPlayer();
      vi.advanceTimersByTime(1000);
    });

    expect(onTick).toHaveBeenCalledWith(1, 0);
  });
});
