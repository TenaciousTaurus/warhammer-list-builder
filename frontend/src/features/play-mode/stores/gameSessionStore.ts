import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../../../shared/lib/supabase';
import type {
  GameSession,
  GameSessionEvent,
  GameSessionScore,
  Mission,
  Stratagem,
  SecondaryObjective,
} from '../../../shared/types/database';

export const PHASES = ['Command', 'Movement', 'Shooting', 'Charge', 'Fight'] as const;
export type PhaseName = typeof PHASES[number];

export type SyncStatus = 'synced' | 'syncing' | 'error';

interface UnitCasualtyState {
  armyListUnitId: string;
  modelStates: number[];
}

interface GameSessionState {
  // Core session
  session: GameSession | null;
  events: GameSessionEvent[];
  scores: GameSessionScore[];
  unitStates: UnitCasualtyState[];

  // Reference data
  missions: Mission[];
  stratagems: Stratagem[];
  secondaryObjectives: SecondaryObjective[];

  // UI state
  loading: boolean;
  error: string | null;

  // Sync state (not persisted)
  syncStatus: SyncStatus;
  syncError: string | null;
  _pendingSyncs: number;

  // Session lifecycle
  createSession: (armyListId: string, userId: string, opponentName?: string, opponentFaction?: string, missionId?: string) => Promise<string | null>;
  loadMissions: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  resumeActiveSession: (userId: string) => Promise<GameSession | null>;

  // Game flow
  advancePhase: () => void;
  previousPhase: () => void;
  setRound: (round: number) => void;

  // CP / VP
  adjustCP: (delta: number) => void;
  adjustMyVP: (delta: number) => void;
  adjustOpponentVP: (delta: number) => void;

  // Timer
  updateTimerSeconds: (playerSeconds: number, opponentSeconds: number) => void;

  // Scoring
  updateScore: (round: number, objectiveName: string, vp: number) => void;
  selectObjective: (name: string) => void;
  deselectObjective: (name: string) => void;

  // Unit casualties
  updateUnitState: (armyListUnitId: string, modelStates: number[]) => void;

  // Events
  logEvent: (eventType: string, description: string, data?: Record<string, unknown>) => void;

  // Game completion
  completeGame: (result: 'win' | 'loss' | 'draw', notes?: string) => Promise<void>;
  pauseGame: () => Promise<void>;
  resumeGame: () => Promise<void>;
  resetGame: () => void;

  // Reference data loading
  loadStratagems: (factionId?: string, detachmentId?: string) => Promise<void>;
  loadSecondaryObjectives: () => Promise<void>;

  // Sync helpers
  clearSyncError: () => void;
  _syncSession: () => void;
  _syncSessionImmediate: () => Promise<void>;
  _dbSync: (label: string, operation: () => PromiseLike<{ error: { message: string } | null }> | { error: { message: string } | null }) => void;
}

// ── Debounce helper for _syncSession ──────────────────────────────────────────
let syncTimer: ReturnType<typeof setTimeout> | null = null;
const SYNC_DEBOUNCE_MS = 300;
const SYNC_RETRY_MS = 2000;

/**
 * Wraps a Supabase fire-and-forget call with sync status tracking and error handling.
 * Runs async — callers don't await it (optimistic UI stays fast).
 */
function runDbSync(
  get: () => GameSessionState,
  set: (partial: Partial<GameSessionState>) => void,
  label: string,
  operation: () => PromiseLike<{ error: { message: string } | null }> | { error: { message: string } | null },
) {
  const pending = get()._pendingSyncs + 1;
  set({ _pendingSyncs: pending, syncStatus: 'syncing' });

  Promise.resolve(operation()).then((result) => {
    const current = get()._pendingSyncs - 1;
    const error = result?.error ?? null;
    if (error) {
      console.error(`[Sync] ${label} failed:`, error.message);
      set({
        _pendingSyncs: current,
        syncStatus: 'error',
        syncError: `${label}: ${error.message}`,
      });
    } else {
      set({
        _pendingSyncs: current,
        // Only mark synced if no other operations are in flight
        syncStatus: current > 0 ? 'syncing' : 'synced',
        syncError: current > 0 ? get().syncError : null,
      });
    }
  }).catch((err: unknown) => {
    const current = get()._pendingSyncs - 1;
    const message = err instanceof Error ? err.message : 'Network error';
    console.error(`[Sync] ${label} threw:`, message);
    set({
      _pendingSyncs: current,
      syncStatus: 'error',
      syncError: `${label}: ${message}`,
    });
  });
}

export const useGameSessionStore = create<GameSessionState>()(
  persist(
    (set, get) => ({
      session: null,
      events: [],
      scores: [],
      unitStates: [],
      missions: [],
      stratagems: [],
      secondaryObjectives: [],
      loading: false,
      error: null,
      syncStatus: 'synced' as SyncStatus,
      syncError: null,
      _pendingSyncs: 0,

      clearSyncError: () => {
        set({ syncStatus: 'synced', syncError: null });
      },

      loadMissions: async () => {
        const { data } = await supabase
          .from('missions')
          .select('*')
          .order('name', { ascending: true });
        if (data) set({ missions: data as Mission[] });
      },

      createSession: async (armyListId, userId, opponentName, opponentFaction, missionId) => {
        set({ loading: true, error: null });
        const { data, error } = await supabase
          .from('game_sessions')
          .insert({
            user_id: userId,
            army_list_id: armyListId,
            opponent_name: opponentName || null,
            opponent_faction: opponentFaction || null,
            mission_id: missionId || null,
            status: 'active',
            started_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error || !data) {
          set({ loading: false, error: error?.message ?? 'Failed to create session' });
          return null;
        }

        set({
          session: data as GameSession,
          events: [],
          scores: [],
          unitStates: [],
          loading: false,
          syncStatus: 'synced',
          syncError: null,
          _pendingSyncs: 0,
        });

        // Log game start event
        get().logEvent('game_start', 'Game started');
        return data.id;
      },

      loadSession: async (sessionId) => {
        set({ loading: true, error: null });

        const [sessionRes, eventsRes, scoresRes, unitStatesRes] = await Promise.all([
          supabase.from('game_sessions').select('*').eq('id', sessionId).single(),
          supabase.from('game_session_events').select('*').eq('game_session_id', sessionId).order('created_at'),
          supabase.from('game_session_scores').select('*').eq('game_session_id', sessionId),
          supabase.from('game_session_unit_states').select('*').eq('game_session_id', sessionId),
        ]);

        if (sessionRes.error || !sessionRes.data) {
          set({ loading: false, error: sessionRes.error?.message ?? 'Session not found' });
          return;
        }

        set({
          session: sessionRes.data as GameSession,
          events: (eventsRes.data ?? []) as GameSessionEvent[],
          scores: (scoresRes.data ?? []) as GameSessionScore[],
          unitStates: ((unitStatesRes.data ?? []) as { army_list_unit_id: string; model_states: number[] }[]).map(us => ({
            armyListUnitId: us.army_list_unit_id,
            modelStates: us.model_states as number[],
          })),
          loading: false,
          syncStatus: 'synced',
          syncError: null,
          _pendingSyncs: 0,
        });
      },

      resumeActiveSession: async (userId) => {
        const { data } = await supabase
          .from('game_sessions')
          .select('*')
          .eq('user_id', userId)
          .in('status', ['active', 'paused'])
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (!data) return null;

        // Hydrate full session from DB (overrides any stale localStorage)
        await get().loadSession(data.id);
        return data as GameSession;
      },

      advancePhase: () => {
        const { session } = get();
        if (!session) return;

        let newPhase = session.current_phase;
        let newRound = session.current_round;

        if (newPhase >= PHASES.length - 1) {
          newPhase = 0;
          if (newRound < 5) newRound += 1;
        } else {
          newPhase += 1;
        }

        set({
          session: { ...session, current_phase: newPhase, current_round: newRound },
        });

        get().logEvent('phase_change', `${PHASES[newPhase]} phase, Round ${newRound}`);

        // Auto-grant +1 CP at the start of each Command Phase (standard 40K rule)
        if (PHASES[newPhase] === 'Command') {
          get().adjustCP(1);
        }

        get()._syncSession();
      },

      previousPhase: () => {
        const { session } = get();
        if (!session) return;

        let newPhase = session.current_phase;
        let newRound = session.current_round;

        if (newPhase <= 0) {
          if (newRound > 1) {
            newRound -= 1;
            newPhase = PHASES.length - 1;
          }
        } else {
          newPhase -= 1;
        }

        set({
          session: { ...session, current_phase: newPhase, current_round: newRound },
        });
        get()._syncSession();
      },

      setRound: (round) => {
        const { session } = get();
        if (!session) return;
        const clamped = Math.max(1, Math.min(5, round));
        set({ session: { ...session, current_round: clamped } });
        get()._syncSession();
      },

      adjustCP: (delta) => {
        const { session } = get();
        if (!session) return;
        const newCP = Math.max(0, session.cp + delta);
        set({ session: { ...session, cp: newCP } });
        if (delta !== 0) {
          get().logEvent(delta > 0 ? 'cp_gained' : 'cp_spent', `CP ${delta > 0 ? '+' : ''}${delta} (now ${newCP})`);
        }
        get()._syncSession();
      },

      adjustMyVP: (delta) => {
        const { session } = get();
        if (!session) return;
        const newVP = Math.max(0, session.my_vp + delta);
        set({ session: { ...session, my_vp: newVP } });
        get()._syncSession();
      },

      adjustOpponentVP: (delta) => {
        const { session } = get();
        if (!session) return;
        const newVP = Math.max(0, session.opponent_vp + delta);
        set({ session: { ...session, opponent_vp: newVP } });
        get()._syncSession();
      },

      updateTimerSeconds: (playerSeconds, opponentSeconds) => {
        const { session } = get();
        if (!session) return;
        set({
          session: {
            ...session,
            timer_player_seconds: playerSeconds,
            timer_opponent_seconds: opponentSeconds,
          },
        });
        get()._syncSession();
      },

      updateScore: (round, objectiveName, vp) => {
        const { session, scores } = get();
        if (!session) return;

        const existing = scores.findIndex(
          s => s.round === round && s.objective_name === objectiveName
        );

        let newScores: GameSessionScore[];
        if (existing >= 0) {
          newScores = scores.map((s, i) => i === existing ? { ...s, vp_scored: vp } : s);
        } else {
          newScores = [...scores, {
            id: crypto.randomUUID(),
            game_session_id: session.id,
            round,
            objective_name: objectiveName,
            vp_scored: vp,
          }];
        }

        set({ scores: newScores });

        // Upsert to DB with error handling
        get()._dbSync('Score update', () =>
          supabase.from('game_session_scores').upsert({
            game_session_id: session.id,
            round,
            objective_name: objectiveName,
            vp_scored: vp,
          }, { onConflict: 'game_session_id,round,objective_name' })
        );
      },

      selectObjective: (name) => {
        const { session, scores } = get();
        if (!session) return;

        // Already selected?
        if (scores.some(s => s.objective_name === name)) return;

        // Create entries for rounds 1-5 with 0 VP
        const newEntries: GameSessionScore[] = [];
        for (let round = 1; round <= 5; round++) {
          newEntries.push({
            id: crypto.randomUUID(),
            game_session_id: session.id,
            round,
            objective_name: name,
            vp_scored: 0,
          });
        }

        set({ scores: [...scores, ...newEntries] });

        // Bulk insert to DB with error handling
        get()._dbSync('Select objective', () =>
          supabase.from('game_session_scores').upsert(
            newEntries.map(e => ({
              game_session_id: session.id,
              round: e.round,
              objective_name: e.objective_name,
              vp_scored: 0,
            })),
            { onConflict: 'game_session_id,round,objective_name' }
          )
        );
      },

      deselectObjective: (name) => {
        const { session, scores } = get();
        if (!session) return;

        set({ scores: scores.filter(s => s.objective_name !== name) });

        // Delete from DB with error handling
        get()._dbSync('Deselect objective', () =>
          supabase.from('game_session_scores')
            .delete()
            .eq('game_session_id', session.id)
            .eq('objective_name', name)
        );
      },

      updateUnitState: (armyListUnitId, modelStates) => {
        const { session, unitStates } = get();
        if (!session) return;

        const existing = unitStates.findIndex(us => us.armyListUnitId === armyListUnitId);
        let newStates: UnitCasualtyState[];
        if (existing >= 0) {
          newStates = unitStates.map((us, i) =>
            i === existing ? { ...us, modelStates } : us
          );
        } else {
          newStates = [...unitStates, { armyListUnitId, modelStates }];
        }

        set({ unitStates: newStates });

        // Upsert to DB with error handling
        get()._dbSync('Unit state', () =>
          supabase.from('game_session_unit_states').upsert({
            game_session_id: session.id,
            army_list_unit_id: armyListUnitId,
            model_states: modelStates,
          }, { onConflict: 'game_session_id,army_list_unit_id' })
        );
      },

      logEvent: (eventType, description, data) => {
        const { session, events } = get();
        if (!session) return;

        const event: GameSessionEvent = {
          id: crypto.randomUUID(),
          game_session_id: session.id,
          round: session.current_round,
          phase: session.current_phase,
          event_type: eventType,
          description,
          data: data ?? null,
          created_at: new Date().toISOString(),
        };

        set({ events: [...events, event] });

        // Fire-and-forget to DB with error handling
        get()._dbSync('Event log', () =>
          supabase.from('game_session_events').insert({
            game_session_id: session.id,
            round: session.current_round,
            phase: session.current_phase,
            event_type: eventType,
            description,
            data: data ?? null,
          })
        );
      },

      completeGame: async (result, notes) => {
        const { session } = get();
        if (!session) return;

        const updated = {
          ...session,
          status: 'completed' as const,
          result,
          notes: notes ?? session.notes,
          completed_at: new Date().toISOString(),
        };

        set({ session: updated });

        const { error } = await supabase
          .from('game_sessions')
          .update({
            status: 'completed',
            result,
            notes: notes ?? session.notes,
            completed_at: updated.completed_at,
            my_vp: session.my_vp,
            opponent_vp: session.opponent_vp,
          })
          .eq('id', session.id);

        if (error) {
          set({ syncStatus: 'error', syncError: `Complete game: ${error.message}` });
        }

        get().logEvent('game_end', `Game completed: ${result}`);
      },

      pauseGame: async () => {
        const { session } = get();
        if (!session) return;

        set({ session: { ...session, status: 'paused' } });
        const { error } = await supabase
          .from('game_sessions')
          .update({ status: 'paused' })
          .eq('id', session.id);

        if (error) {
          set({ syncStatus: 'error', syncError: `Pause game: ${error.message}` });
        }
      },

      resumeGame: async () => {
        const { session } = get();
        if (!session) return;

        set({ session: { ...session, status: 'active' } });
        const { error } = await supabase
          .from('game_sessions')
          .update({ status: 'active' })
          .eq('id', session.id);

        if (error) {
          set({ syncStatus: 'error', syncError: `Resume game: ${error.message}` });
        }
      },

      resetGame: () => {
        // Clear any pending sync timer
        if (syncTimer) {
          clearTimeout(syncTimer);
          syncTimer = null;
        }
        set({
          session: null,
          events: [],
          scores: [],
          unitStates: [],
          error: null,
          syncStatus: 'synced',
          syncError: null,
          _pendingSyncs: 0,
        });
      },

      loadStratagems: async (factionId, detachmentId) => {
        let query = supabase.from('stratagems').select('*');

        // Always load core stratagems
        if (factionId || detachmentId) {
          // Build OR filter: core stratagems + faction/detachment specific
          const conditions = ['type.eq.core'];
          if (factionId) conditions.push(`faction_id.eq.${factionId}`);
          if (detachmentId) conditions.push(`detachment_id.eq.${detachmentId}`);
          query = query.or(conditions.join(','));
        } else {
          query = query.eq('type', 'core');
        }

        const { data, error } = await query.order('name');
        if (error) {
          console.error('Failed to load stratagems:', error);
          return;
        }
        if (data) set({ stratagems: data as Stratagem[] });
      },

      loadSecondaryObjectives: async () => {
        const { data, error } = await supabase
          .from('secondary_objectives')
          .select('*')
          .order('name');
        if (error) {
          console.error('Failed to load secondary objectives:', error);
          return;
        }
        if (data) set({ secondaryObjectives: data as SecondaryObjective[] });
      },

      // Debounced sync — batches rapid state changes (phase/CP/VP)
      _syncSession: () => {
        if (syncTimer) clearTimeout(syncTimer);
        syncTimer = setTimeout(() => {
          syncTimer = null;
          get()._syncSessionImmediate();
        }, SYNC_DEBOUNCE_MS);
      },

      // Immediate sync with retry
      _syncSessionImmediate: async () => {
        const { session } = get();
        if (!session) return;

        const doSync = async (): Promise<boolean> => {
          const pending = get()._pendingSyncs + 1;
          set({ _pendingSyncs: pending, syncStatus: 'syncing' });

          const { error } = await supabase
            .from('game_sessions')
            .update({
              current_round: session.current_round,
              current_phase: session.current_phase,
              cp: session.cp,
              my_vp: session.my_vp,
              opponent_vp: session.opponent_vp,
              timer_player_seconds: session.timer_player_seconds,
              timer_opponent_seconds: session.timer_opponent_seconds,
            })
            .eq('id', session.id);

          const current = get()._pendingSyncs - 1;

          if (error) {
            set({ _pendingSyncs: current });
            return false;
          }

          set({
            _pendingSyncs: current,
            syncStatus: current > 0 ? 'syncing' : 'synced',
            syncError: current > 0 ? get().syncError : null,
          });
          return true;
        };

        const ok = await doSync();
        if (!ok) {
          // Retry once after delay
          await new Promise(resolve => setTimeout(resolve, SYNC_RETRY_MS));
          const retryOk = await doSync();
          if (!retryOk) {
            set({
              syncStatus: 'error',
              syncError: 'Failed to sync game state to server',
            });
          }
        }
      },

      // Shared helper for fire-and-forget DB ops with status tracking
      _dbSync: (label, operation) => {
        runDbSync(get, set, label, operation);
      },
    }),
    {
      name: 'warforge-game-session',
      partialize: (state) => ({
        session: state.session,
        events: state.events,
        scores: state.scores,
        unitStates: state.unitStates,
      }),
    }
  )
);
