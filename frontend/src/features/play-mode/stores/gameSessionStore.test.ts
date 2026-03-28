import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameSessionStore, PHASES } from './gameSessionStore';
import type { GameSession, GameSessionEvent } from '../../../shared/types/database';

// Reset store between tests
beforeEach(() => {
  useGameSessionStore.setState({
    session: null,
    events: [],
    scores: [],
    unitStates: [],
    stratagems: [],
    secondaryObjectives: [],
    loading: false,
    error: null,
  });
  vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-0000-0000-000000000001' as `${string}-${string}-${string}-${string}-${string}`);
});

function createMockSession(overrides?: Partial<GameSession>): GameSession {
  return {
    id: 'session-1',
    user_id: 'user-1',
    army_list_id: 'list-1',
    status: 'active',
    current_round: 1,
    current_phase: 0,
    cp: 0,
    my_vp: 0,
    opponent_vp: 0,
    opponent_name: 'Test Opponent',
    opponent_faction: null,
    started_at: '2025-01-01T00:00:00Z',
    completed_at: null,
    result: null,
    notes: null,
    updated_at: '2025-01-01T00:00:00Z',
    player_seconds: 0,
    opponent_seconds: 0,
    ...overrides,
  } as GameSession;
}

describe('PHASES', () => {
  it('has the 5 standard Warhammer 40K phases', () => {
    expect(PHASES).toEqual(['Command', 'Movement', 'Shooting', 'Charge', 'Fight']);
  });
});

describe('advancePhase', () => {
  it('advances to the next phase', () => {
    const session = createMockSession({ current_phase: 0, current_round: 1 });
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().advancePhase();

    expect(useGameSessionStore.getState().session!.current_phase).toBe(1);
    expect(useGameSessionStore.getState().session!.current_round).toBe(1);
  });

  it('wraps to next round after last phase', () => {
    const session = createMockSession({ current_phase: PHASES.length - 1, current_round: 2 });
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().advancePhase();

    expect(useGameSessionStore.getState().session!.current_phase).toBe(0);
    expect(useGameSessionStore.getState().session!.current_round).toBe(3);
  });

  it('does not advance past round 5', () => {
    const session = createMockSession({ current_phase: PHASES.length - 1, current_round: 5 });
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().advancePhase();

    expect(useGameSessionStore.getState().session!.current_phase).toBe(0);
    expect(useGameSessionStore.getState().session!.current_round).toBe(5);
  });

  it('auto-grants +1 CP on Command Phase', () => {
    // Start on Fight phase (index 4) so advancing wraps to Command (index 0)
    const session = createMockSession({ current_phase: PHASES.length - 1, current_round: 1, cp: 2 });
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().advancePhase();

    expect(useGameSessionStore.getState().session!.cp).toBe(3);
  });

  it('does nothing without a session', () => {
    useGameSessionStore.getState().advancePhase();
    expect(useGameSessionStore.getState().session).toBeNull();
  });
});

describe('previousPhase', () => {
  it('goes back one phase', () => {
    const session = createMockSession({ current_phase: 2, current_round: 1 });
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().previousPhase();

    expect(useGameSessionStore.getState().session!.current_phase).toBe(1);
  });

  it('wraps to previous round at phase 0', () => {
    const session = createMockSession({ current_phase: 0, current_round: 3 });
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().previousPhase();

    expect(useGameSessionStore.getState().session!.current_phase).toBe(PHASES.length - 1);
    expect(useGameSessionStore.getState().session!.current_round).toBe(2);
  });

  it('does not go before round 1', () => {
    const session = createMockSession({ current_phase: 0, current_round: 1 });
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().previousPhase();

    expect(useGameSessionStore.getState().session!.current_phase).toBe(0);
    expect(useGameSessionStore.getState().session!.current_round).toBe(1);
  });
});

describe('adjustCP', () => {
  it('increases CP', () => {
    const session = createMockSession({ cp: 3 });
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().adjustCP(2);

    expect(useGameSessionStore.getState().session!.cp).toBe(5);
  });

  it('decreases CP', () => {
    const session = createMockSession({ cp: 3 });
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().adjustCP(-1);

    expect(useGameSessionStore.getState().session!.cp).toBe(2);
  });

  it('does not go below 0', () => {
    const session = createMockSession({ cp: 1 });
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().adjustCP(-5);

    expect(useGameSessionStore.getState().session!.cp).toBe(0);
  });

  it('logs a CP event', () => {
    const session = createMockSession({ cp: 3 });
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().adjustCP(-1);

    const events = useGameSessionStore.getState().events;
    expect(events.some(e => e.event_type === 'cp_spent')).toBe(true);
  });
});

describe('adjustMyVP / adjustOpponentVP', () => {
  it('adjusts my VP', () => {
    const session = createMockSession({ my_vp: 10 });
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().adjustMyVP(5);

    expect(useGameSessionStore.getState().session!.my_vp).toBe(15);
  });

  it('adjusts opponent VP', () => {
    const session = createMockSession({ opponent_vp: 0 });
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().adjustOpponentVP(3);

    expect(useGameSessionStore.getState().session!.opponent_vp).toBe(3);
  });

  it('does not allow negative VP', () => {
    const session = createMockSession({ my_vp: 2 });
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().adjustMyVP(-10);

    expect(useGameSessionStore.getState().session!.my_vp).toBe(0);
  });
});

describe('setRound', () => {
  it('sets the round', () => {
    const session = createMockSession({ current_round: 1 });
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().setRound(3);

    expect(useGameSessionStore.getState().session!.current_round).toBe(3);
  });

  it('clamps to valid range', () => {
    const session = createMockSession({ current_round: 3 });
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().setRound(0);
    expect(useGameSessionStore.getState().session!.current_round).toBe(1);

    useGameSessionStore.getState().setRound(10);
    expect(useGameSessionStore.getState().session!.current_round).toBe(5);
  });
});

describe('updateUnitState', () => {
  it('adds a new unit state', () => {
    const session = createMockSession();
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().updateUnitState('alu-1', [1, 1, 0, 1]);

    const unitStates = useGameSessionStore.getState().unitStates;
    expect(unitStates).toHaveLength(1);
    expect(unitStates[0]).toEqual({
      armyListUnitId: 'alu-1',
      modelStates: [1, 1, 0, 1],
    });
  });

  it('updates an existing unit state', () => {
    const session = createMockSession();
    useGameSessionStore.setState({
      session,
      unitStates: [{ armyListUnitId: 'alu-1', modelStates: [1, 1, 1] }],
    });

    useGameSessionStore.getState().updateUnitState('alu-1', [1, 0, 0]);

    const unitStates = useGameSessionStore.getState().unitStates;
    expect(unitStates).toHaveLength(1);
    expect(unitStates[0].modelStates).toEqual([1, 0, 0]);
  });
});

describe('resetGame', () => {
  it('clears all game state', () => {
    const session = createMockSession({ cp: 5, my_vp: 10 });
    useGameSessionStore.setState({
      session,
      events: [{ id: 'e1', game_session_id: 'session-1', event_type: 'test', description: 'test' } as GameSessionEvent],
      scores: [],
      unitStates: [{ armyListUnitId: 'alu-1', modelStates: [1, 0] }],
    });

    useGameSessionStore.getState().resetGame();

    const state = useGameSessionStore.getState();
    expect(state.session).toBeNull();
    expect(state.events).toEqual([]);
    expect(state.scores).toEqual([]);
    expect(state.unitStates).toEqual([]);
  });
});
