import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameSessionStore, PHASES } from './gameSessionStore';
import type { GameSession, GameSessionEvent } from '../../../shared/types/database';
import { supabase } from '../../../shared/lib/supabase';

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
    syncStatus: 'synced',
    syncError: null,
    _pendingSyncs: 0,
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

  it('resets sync status', () => {
    useGameSessionStore.setState({
      session: createMockSession(),
      syncStatus: 'error',
      syncError: 'Some error',
      _pendingSyncs: 3,
    });

    useGameSessionStore.getState().resetGame();

    const state = useGameSessionStore.getState();
    expect(state.syncStatus).toBe('synced');
    expect(state.syncError).toBeNull();
    expect(state._pendingSyncs).toBe(0);
  });
});

describe('sync status', () => {
  it('starts in synced state', () => {
    const state = useGameSessionStore.getState();
    expect(state.syncStatus).toBe('synced');
    expect(state.syncError).toBeNull();
    expect(state._pendingSyncs).toBe(0);
  });

  it('clearSyncError resets sync state', () => {
    useGameSessionStore.setState({
      syncStatus: 'error',
      syncError: 'Failed to sync',
    });

    useGameSessionStore.getState().clearSyncError();

    expect(useGameSessionStore.getState().syncStatus).toBe('synced');
    expect(useGameSessionStore.getState().syncError).toBeNull();
  });

  it('_dbSync sets syncing status when called with a session', () => {
    const session = createMockSession();
    useGameSessionStore.setState({ session });

    // Call _dbSync with a mock operation that never resolves (to test intermediate state)
    useGameSessionStore.getState()._dbSync('Test op', () =>
      new Promise(() => {
        // never resolves — we just want to test the intermediate state
      }) as Promise<{ error: { message: string } | null }>
    );

    expect(useGameSessionStore.getState().syncStatus).toBe('syncing');
    expect(useGameSessionStore.getState()._pendingSyncs).toBe(1);
  });
});

describe('updateScore', () => {
  it('inserts a new score entry when none exists for that round/objective', () => {
    const session = createMockSession();
    useGameSessionStore.setState({ session, scores: [] });

    useGameSessionStore.getState().updateScore(2, 'Engage on All Fronts', 4);

    const scores = useGameSessionStore.getState().scores;
    expect(scores).toHaveLength(1);
    expect(scores[0]).toMatchObject({
      round: 2,
      objective_name: 'Engage on All Fronts',
      vp_scored: 4,
    });
  });

  it('updates an existing score entry instead of duplicating', () => {
    const session = createMockSession();
    useGameSessionStore.setState({
      session,
      scores: [
        { id: 's1', game_session_id: 'session-1', round: 1, objective_name: 'Behind Enemy Lines', vp_scored: 2 },
      ],
    });

    useGameSessionStore.getState().updateScore(1, 'Behind Enemy Lines', 5);

    const scores = useGameSessionStore.getState().scores;
    expect(scores).toHaveLength(1);
    expect(scores[0].vp_scored).toBe(5);
  });

  it('does nothing without a session', () => {
    useGameSessionStore.setState({ session: null });
    useGameSessionStore.getState().updateScore(1, 'Anything', 3);
    expect(useGameSessionStore.getState().scores).toEqual([]);
  });
});

describe('selectObjective', () => {
  it('creates 5 score entries (one per round) at 0 VP', () => {
    const session = createMockSession();
    useGameSessionStore.setState({ session, scores: [] });

    useGameSessionStore.getState().selectObjective('Cleanse');

    const scores = useGameSessionStore.getState().scores;
    expect(scores).toHaveLength(5);
    expect(scores.map(s => s.round).sort()).toEqual([1, 2, 3, 4, 5]);
    expect(scores.every(s => s.objective_name === 'Cleanse')).toBe(true);
    expect(scores.every(s => s.vp_scored === 0)).toBe(true);
  });

  it('is a no-op when the objective is already selected', () => {
    const session = createMockSession();
    useGameSessionStore.setState({
      session,
      scores: [
        { id: 's1', game_session_id: 'session-1', round: 1, objective_name: 'Cleanse', vp_scored: 0 },
      ],
    });

    useGameSessionStore.getState().selectObjective('Cleanse');

    expect(useGameSessionStore.getState().scores).toHaveLength(1);
  });

  it('does nothing without a session', () => {
    useGameSessionStore.setState({ session: null });
    useGameSessionStore.getState().selectObjective('Cleanse');
    expect(useGameSessionStore.getState().scores).toEqual([]);
  });
});

describe('deselectObjective', () => {
  it('removes all score entries for the named objective', () => {
    const session = createMockSession();
    useGameSessionStore.setState({
      session,
      scores: [
        { id: 's1', game_session_id: 'session-1', round: 1, objective_name: 'Cleanse', vp_scored: 0 },
        { id: 's2', game_session_id: 'session-1', round: 2, objective_name: 'Cleanse', vp_scored: 3 },
        { id: 's3', game_session_id: 'session-1', round: 1, objective_name: 'Engage', vp_scored: 2 },
      ],
    });

    useGameSessionStore.getState().deselectObjective('Cleanse');

    const scores = useGameSessionStore.getState().scores;
    expect(scores).toHaveLength(1);
    expect(scores[0].objective_name).toBe('Engage');
  });

  it('does nothing without a session', () => {
    useGameSessionStore.setState({ session: null, scores: [] });
    useGameSessionStore.getState().deselectObjective('Cleanse');
    expect(useGameSessionStore.getState().scores).toEqual([]);
  });
});

describe('updateTimerSeconds', () => {
  it('writes both player and opponent seconds onto the session', () => {
    const session = createMockSession();
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().updateTimerSeconds(120, 90);

    const updated = useGameSessionStore.getState().session!;
    expect(updated.timer_player_seconds).toBe(120);
    expect(updated.timer_opponent_seconds).toBe(90);
  });

  it('does nothing without a session', () => {
    useGameSessionStore.setState({ session: null });
    useGameSessionStore.getState().updateTimerSeconds(60, 60);
    expect(useGameSessionStore.getState().session).toBeNull();
  });
});

describe('logEvent', () => {
  it('tags the event with the session current_round and current_phase', () => {
    const session = createMockSession({ current_round: 3, current_phase: 2 });
    useGameSessionStore.setState({ session });

    useGameSessionStore.getState().logEvent('test_event', 'something happened');

    const events = useGameSessionStore.getState().events;
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      round: 3,
      phase: 2,
      event_type: 'test_event',
      description: 'something happened',
    });
  });

  it('does nothing without a session', () => {
    useGameSessionStore.setState({ session: null, events: [] });
    useGameSessionStore.getState().logEvent('orphan', 'no session');
    expect(useGameSessionStore.getState().events).toEqual([]);
  });
});

describe('previousPhase edge cases', () => {
  it('does nothing without a session', () => {
    useGameSessionStore.setState({ session: null });
    useGameSessionStore.getState().previousPhase();
    expect(useGameSessionStore.getState().session).toBeNull();
  });
});

// ============================================================
// Lifecycle actions — these await supabase, so we override
// the mock locally to return a chain that resolves immediately.
// ============================================================
describe('game lifecycle actions', () => {
  beforeEach(() => {
    function makeOkChain() {
      const chain: Record<string, unknown> = {};
      const methods = ['select', 'insert', 'update', 'delete', 'upsert', 'eq', 'in', 'or', 'order', 'limit', 'single'];
      for (const m of methods) chain[m] = vi.fn(() => chain);
      // Make the chain a proper thenable that resolves with { data: null, error: null }
      chain.then = (resolve: (v: unknown) => unknown) => Promise.resolve({ data: null, error: null }).then(resolve);
      return chain;
    }
    vi.mocked(supabase.from).mockImplementation(() => makeOkChain() as never);
  });

  describe('completeGame', () => {
    it('sets status to completed, stores result and completion timestamp, and logs a game_end event', async () => {
      const session = createMockSession({ status: 'active' });
      useGameSessionStore.setState({ session });

      await useGameSessionStore.getState().completeGame('win', 'Pulled it out in round 5');

      const updated = useGameSessionStore.getState().session!;
      expect(updated.status).toBe('completed');
      expect(updated.result).toBe('win');
      expect(updated.notes).toBe('Pulled it out in round 5');
      expect(updated.completed_at).not.toBeNull();

      const events = useGameSessionStore.getState().events;
      expect(events.some(e => e.event_type === 'game_end' && e.description.includes('win'))).toBe(true);
    });

    it('preserves existing notes when no notes argument is supplied', async () => {
      const session = createMockSession({ status: 'active', notes: 'Pre-game prep' });
      useGameSessionStore.setState({ session });

      await useGameSessionStore.getState().completeGame('loss');

      expect(useGameSessionStore.getState().session!.notes).toBe('Pre-game prep');
    });

    it('does nothing without a session', async () => {
      useGameSessionStore.setState({ session: null });
      await useGameSessionStore.getState().completeGame('draw');
      expect(useGameSessionStore.getState().session).toBeNull();
    });
  });

  describe('pauseGame', () => {
    it('sets session.status to paused', async () => {
      const session = createMockSession({ status: 'active' });
      useGameSessionStore.setState({ session });

      await useGameSessionStore.getState().pauseGame();

      expect(useGameSessionStore.getState().session!.status).toBe('paused');
    });

    it('does nothing without a session', async () => {
      useGameSessionStore.setState({ session: null });
      await useGameSessionStore.getState().pauseGame();
      expect(useGameSessionStore.getState().session).toBeNull();
    });
  });

  describe('resumeGame', () => {
    it('sets session.status back to active', async () => {
      const session = createMockSession({ status: 'paused' });
      useGameSessionStore.setState({ session });

      await useGameSessionStore.getState().resumeGame();

      expect(useGameSessionStore.getState().session!.status).toBe('active');
    });

    it('does nothing without a session', async () => {
      useGameSessionStore.setState({ session: null });
      await useGameSessionStore.getState().resumeGame();
      expect(useGameSessionStore.getState().session).toBeNull();
    });
  });
});
