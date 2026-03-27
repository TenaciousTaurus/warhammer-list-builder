import { useEffect } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import { useGameSessionStore } from '../stores/gameSessionStore';
import type { GameSession } from '../../../shared/types/database';

/**
 * Subscribes to Supabase Realtime for the current game session.
 * When another device updates the game_sessions row, this merges
 * the changes into the local Zustand store.
 */
export function useGameRealtime(sessionId: string | null) {
  const store = useGameSessionStore();

  useEffect(() => {
    if (!sessionId) return;

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
          const current = store.session;
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
            store.updateUnitState(row.army_list_unit_id, row.model_states);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);
}
