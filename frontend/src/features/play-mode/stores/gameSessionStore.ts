import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../../../shared/lib/supabase';
import type {
  GameSession,
  GameSessionEvent,
  GameSessionScore,
  Stratagem,
  SecondaryObjective,
} from '../../../shared/types/database';

export const PHASES = ['Command', 'Movement', 'Shooting', 'Charge', 'Fight'] as const;
export type PhaseName = typeof PHASES[number];

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
  stratagems: Stratagem[];
  secondaryObjectives: SecondaryObjective[];

  // UI state
  loading: boolean;
  error: string | null;

  // Session lifecycle
  createSession: (armyListId: string, userId: string, opponentName?: string, opponentFaction?: string) => Promise<string | null>;
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

  // Persistence helper
  _syncSession: () => Promise<void>;
}

export const useGameSessionStore = create<GameSessionState>()(
  persist(
    (set, get) => ({
      session: null,
      events: [],
      scores: [],
      unitStates: [],
      stratagems: [],
      secondaryObjectives: [],
      loading: false,
      error: null,

      createSession: async (armyListId, userId, opponentName, opponentFaction) => {
        set({ loading: true, error: null });
        const { data, error } = await supabase
          .from('game_sessions')
          .insert({
            user_id: userId,
            army_list_id: armyListId,
            opponent_name: opponentName || null,
            opponent_faction: opponentFaction || null,
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

        return (data as GameSession) ?? null;
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

        // Upsert to DB
        supabase.from('game_session_scores').upsert({
          game_session_id: session.id,
          round,
          objective_name: objectiveName,
          vp_scored: vp,
        }, { onConflict: 'game_session_id,round,objective_name' });
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

        // Bulk insert to DB
        supabase.from('game_session_scores').upsert(
          newEntries.map(e => ({
            game_session_id: session.id,
            round: e.round,
            objective_name: e.objective_name,
            vp_scored: 0,
          })),
          { onConflict: 'game_session_id,round,objective_name' }
        );
      },

      deselectObjective: (name) => {
        const { session, scores } = get();
        if (!session) return;

        set({ scores: scores.filter(s => s.objective_name !== name) });

        // Delete from DB
        supabase.from('game_session_scores')
          .delete()
          .eq('game_session_id', session.id)
          .eq('objective_name', name)
          .then();
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

        // Upsert to DB
        supabase.from('game_session_unit_states').upsert({
          game_session_id: session.id,
          army_list_unit_id: armyListUnitId,
          model_states: modelStates,
        }, { onConflict: 'game_session_id,army_list_unit_id' });
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

        // Fire-and-forget to DB
        supabase.from('game_session_events').insert({
          game_session_id: session.id,
          round: session.current_round,
          phase: session.current_phase,
          event_type: eventType,
          description,
          data: data ?? null,
        });
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

        await supabase
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

        get().logEvent('game_end', `Game completed: ${result}`);
      },

      pauseGame: async () => {
        const { session } = get();
        if (!session) return;

        set({ session: { ...session, status: 'paused' } });
        await supabase
          .from('game_sessions')
          .update({ status: 'paused' })
          .eq('id', session.id);
      },

      resumeGame: async () => {
        const { session } = get();
        if (!session) return;

        set({ session: { ...session, status: 'active' } });
        await supabase
          .from('game_sessions')
          .update({ status: 'active' })
          .eq('id', session.id);
      },

      resetGame: () => {
        set({
          session: null,
          events: [],
          scores: [],
          unitStates: [],
          error: null,
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

        const { data } = await query.order('name');
        if (data) set({ stratagems: data as Stratagem[] });
      },

      loadSecondaryObjectives: async () => {
        const { data } = await supabase
          .from('secondary_objectives')
          .select('*')
          .order('name');
        if (data) set({ secondaryObjectives: data as SecondaryObjective[] });
      },

      _syncSession: async () => {
        const { session } = get();
        if (!session) return;

        await supabase
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
