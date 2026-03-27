import { useState, useCallback } from 'react';

interface DiceRoll {
  id: string;
  dice: number[];
  total: number;
  timestamp: number;
  label?: string;
}

export function useDiceRoller() {
  const [history, setHistory] = useState<DiceRoll[]>([]);
  const [lastRoll, setLastRoll] = useState<DiceRoll | null>(null);

  const roll = useCallback((count: number, label?: string): DiceRoll => {
    const dice = Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
    const result: DiceRoll = {
      id: crypto.randomUUID(),
      dice,
      total: dice.reduce((a, b) => a + b, 0),
      timestamp: Date.now(),
      label,
    };
    setLastRoll(result);
    setHistory(prev => [result, ...prev].slice(0, 50));
    return result;
  }, []);

  const reroll = useCallback((original: DiceRoll, keepIndices: number[]): DiceRoll => {
    const dice = original.dice.map((d, i) =>
      keepIndices.includes(i) ? d : Math.floor(Math.random() * 6) + 1
    );
    const result: DiceRoll = {
      id: crypto.randomUUID(),
      dice,
      total: dice.reduce((a, b) => a + b, 0),
      timestamp: Date.now(),
      label: original.label ? `${original.label} (reroll)` : 'Reroll',
    };
    setLastRoll(result);
    setHistory(prev => [result, ...prev].slice(0, 50));
    return result;
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setLastRoll(null);
  }, []);

  return { lastRoll, history, roll, reroll, clearHistory };
}
