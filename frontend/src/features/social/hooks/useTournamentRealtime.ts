import { useEffect } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import { useTournamentStore } from '../stores/tournamentStore';

export function useTournamentRealtime(tournamentId: string) {
  const { loadTournament, loadStandings } = useTournamentStore();

  useEffect(() => {
    if (!tournamentId) return;

    const channel = supabase
      .channel(`tournament-${tournamentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tournament_rounds',
          filter: `tournament_id=eq.${tournamentId}`,
        },
        () => {
          loadTournament(tournamentId);
          loadStandings(tournamentId);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tournament_pairings',
        },
        (payload) => {
          // Pairings are linked to rounds, not directly to tournaments.
          // Reload on any pairing change and let the store filter by round IDs.
          // We could be more precise, but reloading the full tournament is cheap.
          void payload;
          loadTournament(tournamentId);
          loadStandings(tournamentId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tournamentId, loadTournament, loadStandings]);
}
