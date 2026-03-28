import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDiceRoller } from './useDiceRoller';

// Mock crypto.randomUUID
beforeEach(() => {
  let counter = 0;
  vi.spyOn(crypto, 'randomUUID').mockImplementation(() => `00000000-0000-0000-0000-${String(++counter).padStart(12, '0')}` as `${string}-${string}-${string}-${string}-${string}`);
});

describe('useDiceRoller', () => {
  it('initializes with empty state', () => {
    const { result } = renderHook(() => useDiceRoller());
    expect(result.current.lastRoll).toBeNull();
    expect(result.current.history).toEqual([]);
  });

  it('rolls the correct number of dice', () => {
    const { result } = renderHook(() => useDiceRoller());

    let roll: ReturnType<typeof result.current.roll>;
    act(() => {
      roll = result.current.roll(5);
    });

    expect(roll!.dice).toHaveLength(5);
    expect(roll!.dice.every(d => d >= 1 && d <= 6)).toBe(true);
  });

  it('calculates the total correctly', () => {
    const { result } = renderHook(() => useDiceRoller());

    act(() => {
      result.current.roll(3);
    });

    const lastRoll = result.current.lastRoll!;
    const expectedTotal = lastRoll.dice.reduce((a, b) => a + b, 0);
    expect(lastRoll.total).toBe(expectedTotal);
  });

  it('adds rolls to history', () => {
    const { result } = renderHook(() => useDiceRoller());

    act(() => {
      result.current.roll(2, 'Hit roll');
    });

    act(() => {
      result.current.roll(3, 'Wound roll');
    });

    expect(result.current.history).toHaveLength(2);
    expect(result.current.history[0].label).toBe('Wound roll');
    expect(result.current.history[1].label).toBe('Hit roll');
  });

  it('limits history to 50 entries', () => {
    const { result } = renderHook(() => useDiceRoller());

    act(() => {
      for (let i = 0; i < 55; i++) {
        result.current.roll(1);
      }
    });

    expect(result.current.history).toHaveLength(50);
  });

  it('rerolls keeping specified dice', () => {
    const { result } = renderHook(() => useDiceRoller());

    let original: ReturnType<typeof result.current.roll>;
    act(() => {
      original = result.current.roll(4, 'Saves');
    });

    const keptIndices = [0, 2]; // Keep first and third dice
    act(() => {
      result.current.reroll(original!, keptIndices);
    });

    const rerolled = result.current.lastRoll!;
    expect(rerolled.dice[0]).toBe(original!.dice[0]);
    expect(rerolled.dice[2]).toBe(original!.dice[2]);
    expect(rerolled.label).toBe('Saves (reroll)');
  });

  it('clears history', () => {
    const { result } = renderHook(() => useDiceRoller());

    act(() => {
      result.current.roll(3);
      result.current.roll(3);
    });

    expect(result.current.history).toHaveLength(2);

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toHaveLength(0);
    expect(result.current.lastRoll).toBeNull();
  });
});
