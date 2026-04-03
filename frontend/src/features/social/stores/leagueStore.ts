import { create } from 'zustand';
import { supabase } from '../../../shared/lib/supabase';
import type { League, LeagueTournament, Tournament } from '../../../shared/types/database';

interface LeagueWithTournaments extends League {
  tournaments: (LeagueTournament & { tournament: Tournament })[];
}

interface LeagueState {
  leagues: League[];
  activeLeague: LeagueWithTournaments | null;
  loading: boolean;
  error: string | null;

  loadMyLeagues: (userId: string) => Promise<void>;
  loadLeague: (leagueId: string) => Promise<void>;
  createLeague: (data: {
    name: string;
    description?: string;
    is_public?: boolean;
    owner_id: string;
  }) => Promise<string | null>;
  updateLeague: (leagueId: string, updates: Partial<League>) => Promise<void>;
  addTournament: (leagueId: string, tournamentId: string) => Promise<void>;
  removeTournament: (leagueTournamentId: string) => Promise<void>;
  clearError: () => void;
}

export const useLeagueStore = create<LeagueState>()((set, get) => ({
  leagues: [],
  activeLeague: null,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  loadMyLeagues: async (userId: string) => {
    set({ loading: true, error: null });

    const { data, error } = await supabase
      .from('leagues')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      set({ loading: false, error: error.message });
      return;
    }

    set({ leagues: (data as League[]) ?? [], loading: false });
  },

  loadLeague: async (leagueId: string) => {
    set({ loading: true, error: null });

    const [leagueRes, tournamentsRes] = await Promise.all([
      supabase.from('leagues').select('*').eq('id', leagueId).single(),
      supabase
        .from('league_tournaments')
        .select('*, tournament:tournaments(*)')
        .eq('league_id', leagueId)
        .order('sort_order', { ascending: true }),
    ]);

    if (leagueRes.error) {
      set({ loading: false, error: leagueRes.error.message });
      return;
    }

    const league = leagueRes.data as League;
    const tournaments = (tournamentsRes.data ?? []) as (LeagueTournament & { tournament: Tournament })[];

    set({
      activeLeague: { ...league, tournaments },
      loading: false,
    });
  },

  createLeague: async (data) => {
    set({ error: null });

    const { data: created, error } = await supabase
      .from('leagues')
      .insert({
        owner_id: data.owner_id,
        name: data.name,
        description: data.description,
        is_public: data.is_public ?? false,
      })
      .select()
      .single();

    if (error || !created) {
      set({ error: error?.message ?? 'Failed to create league' });
      return null;
    }

    const league = created as League;
    set((state) => ({ leagues: [league, ...state.leagues] }));
    return league.id;
  },

  updateLeague: async (leagueId, updates) => {
    set({ error: null });

    const { error } = await supabase
      .from('leagues')
      .update(updates)
      .eq('id', leagueId);

    if (error) {
      set({ error: error.message });
      return;
    }

    set((state) => ({
      leagues: state.leagues.map((l) =>
        l.id === leagueId ? { ...l, ...updates } : l
      ),
      activeLeague: state.activeLeague?.id === leagueId
        ? { ...state.activeLeague, ...updates }
        : state.activeLeague,
    }));
  },

  addTournament: async (leagueId, tournamentId) => {
    set({ error: null });

    const { error } = await supabase
      .from('league_tournaments')
      .insert({ league_id: leagueId, tournament_id: tournamentId });

    if (error) {
      set({ error: error.message });
      return;
    }

    await get().loadLeague(leagueId);
  },

  removeTournament: async (leagueTournamentId) => {
    set({ error: null });

    const { error } = await supabase
      .from('league_tournaments')
      .delete()
      .eq('id', leagueTournamentId);

    if (error) {
      set({ error: error.message });
      return;
    }

    const activeLeague = get().activeLeague;
    if (activeLeague) {
      set({
        activeLeague: {
          ...activeLeague,
          tournaments: activeLeague.tournaments.filter((t) => t.id !== leagueTournamentId),
        },
      });
    }
  },
}));
