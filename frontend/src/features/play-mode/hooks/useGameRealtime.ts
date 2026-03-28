import { useEffect, useState } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import { useGameSessionStore } from '../stores/gameSessionStore';
import type { GameSession, GameSessionEvent, GameSessionScore } from '../../../shared/types/database';

export type RealtimeStatus = 'connecting' | 'connected' | 'disconnected';

/**
 * Subscribes to Supabase Realtime for the current game session.
 * Syncs game_sessions, game_session_events, game_session_scores,
 * and game_session_unit_states across devices.
 *
 * Returns the current connection status.
 */
export function useGameRealtime(sessionId: string | null) {
  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeStatus>('disconnected');

  useEffect(() => {
    if (!sessionId) {
      setRealtimeStatus('disconnected');
      return;
    }

    setRealtimeStatus('connecting');

    const channel = supabase
      .channel(`game:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          const updated = payload.new as GameSession;
          const current = useGameSessionStore.getState().session;
          if (!current) return;

          // Only merge if the remote update is newer than local
          if (updated.updated_at > current.updated_at) {
            useGameSessionStore.setState({
              session: { ...current, ...updated },
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_session_unit_states',
          filter: `game_session_id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const row = payload.new as { army_list_unit_id: string; model_states: number[] };
            useGameSessionStore.getState().updateUnitState(row.army_list_unit_id, row.model_states);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_session_events',
          filter: `game_session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newEvent = payload.new as GameSessionEvent;
          const currentEvents = useGameSessionStore.getState().events;

          // Avoid duplicates (we optimistically add events locally)
          if (currentEvents.some((e) => e.id === newEvent.id)) return;

          useGameSessionStore.setState({
            events: [...currentEvents, newEvent],
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_session_scores',
          filter: `game_session_id=eq.${sessionId}`,
        },
        (payload) => {
          const currentScores = useGameSessionStore.getState().scores;

          if (payload.eventType === 'INSERT') {
            const newScore = payload.new as GameSessionScore;
            // Avoid duplicates
            if (currentScores.some((s) => s.id === newScore.id)) return;
            useGameSessionStore.setState({
              scores: [...currentScores, newScore],
            });
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as GameSessionScore;
            useGameSessionStore.setState({
              scores: currentScores.map((s) =>
                s.id === updated.id ? { ...s, ...updated } : s
              ),
            });
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as { id?: string; objective_name?: string };
            if (deleted.id) {
              useGameSessionStore.setState({
                scores: currentScores.filter((s) => s.id !== deleted.id),
              });
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('connected');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setRealtimeStatus('disconnected');
        } else if (status === 'TIMED_OUT') {
          setRealtimeStatus('disconnected');
        }
      });

    return () => {
      supabase.removeChannel(channel);
      setRealtimeStatus('disconnected');
    };
  }, [sessionId]);

  return { realtimeStatus };
}
