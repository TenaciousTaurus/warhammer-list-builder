import { useState, useEffect } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import type { GameSession, GameSessionEvent, GameSessionScore } from '../../../shared/types/database';
import type { RealtimeStatus } from './useGameRealtime';

interface SpectateState {
  session: GameSession | null;
  events: GameSessionEvent[];
  scores: GameSessionScore[];
  loading: boolean;
  error: string | null;
  realtimeStatus: RealtimeStatus;
}

export function useSpectateSession(inviteCode: string | undefined): SpectateState {
  const [state, setState] = useState<SpectateState>({
    session: null,
    events: [],
    scores: [],
    loading: true,
    error: null,
    realtimeStatus: 'disconnected',
  });

  useEffect(() => {
    if (!inviteCode) {
      setState(s => ({ ...s, loading: false, error: 'No invite code provided' }));
      return;
    }

    let cancelled = false;

    async function load() {
      const { data: sessionData, error: sessionError } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('invite_code', inviteCode)
        .eq('is_spectatable', true)
        .single();

      if (cancelled) return;

      if (sessionError || !sessionData) {
        setState(s => ({
          ...s,
          loading: false,
          error: 'Game not found or not available for spectating.',
        }));
        return;
      }

      const session = sessionData as GameSession;

      const [eventsRes, scoresRes] = await Promise.all([
        supabase
          .from('game_session_events')
          .select('*')
          .eq('game_session_id', session.id)
          .order('created_at'),
        supabase
          .from('game_session_scores')
          .select('*')
          .eq('game_session_id', session.id),
      ]);

      if (cancelled) return;

      setState(s => ({
        ...s,
        session,
        events: (eventsRes.data ?? []) as GameSessionEvent[],
        scores: (scoresRes.data ?? []) as GameSessionScore[],
        loading: false,
        realtimeStatus: 'connecting',
      }));

      // Subscribe to realtime updates
      const channel = supabase
        .channel(`spectate:${session.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'game_sessions', filter: `id=eq.${session.id}` },
          (payload) => {
            if (cancelled) return;
            const updated = payload.new as GameSession;
            setState(s => ({
              ...s,
              session: s.session ? { ...s.session, ...updated } : s.session,
            }));
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'game_session_events', filter: `game_session_id=eq.${session.id}` },
          (payload) => {
            if (cancelled) return;
            const newEvent = payload.new as GameSessionEvent;
            setState(s => {
              if (s.events.some(e => e.id === newEvent.id)) return s;
              return { ...s, events: [...s.events, newEvent] };
            });
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'game_session_scores', filter: `game_session_id=eq.${session.id}` },
          (payload) => {
            if (cancelled) return;
            setState(s => {
              if (payload.eventType === 'INSERT') {
                const newScore = payload.new as GameSessionScore;
                if (s.scores.some(sc => sc.id === newScore.id)) return s;
                return { ...s, scores: [...s.scores, newScore] };
              }
              if (payload.eventType === 'UPDATE') {
                const updated = payload.new as GameSessionScore;
                return { ...s, scores: s.scores.map(sc => sc.id === updated.id ? { ...sc, ...updated } : sc) };
              }
              if (payload.eventType === 'DELETE') {
                const deleted = payload.old as { id?: string };
                if (deleted.id) return { ...s, scores: s.scores.filter(sc => sc.id !== deleted.id) };
              }
              return s;
            });
          }
        )
        .subscribe((status) => {
          if (cancelled) return;
          setState(s => ({
            ...s,
            realtimeStatus:
              status === 'SUBSCRIBED' ? 'connected'
              : status === 'CLOSED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' ? 'disconnected'
              : s.realtimeStatus,
          }));
        });

      return () => {
        cancelled = true;
        supabase.removeChannel(channel);
      };
    }

    const cleanup = load();
    return () => {
      cancelled = true;
      cleanup.then(fn => fn?.());
    };
  }, [inviteCode]);

  return state;
}
