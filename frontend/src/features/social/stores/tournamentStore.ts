import { create } from 'zustand';
import { supabase } from '../../../shared/lib/supabase';
import type {
  Tournament,
  TournamentParticipant,
  TournamentRound,
  TournamentPairing,
  TournamentStanding,
} from '../../../shared/types/database';

interface TournamentState {
  tournaments: Tournament[];
  publicTournaments: Tournament[];
  activeTournament: Tournament | null;
  participants: TournamentParticipant[];
  rounds: TournamentRound[];
  pairings: TournamentPairing[];
  standings: TournamentStanding[];
  loading: boolean;
  error: string | null;

  loadMyTournaments: (userId: string) => Promise<void>;
  loadPublicTournaments: () => Promise<void>;
  createTournament: (data: {
    name: string;
    description?: string;
    format: Tournament['format'];
    max_players: number;
    points_limit: number;
    num_rounds: number;
    organizer_id: string;
    is_public?: boolean;
  }) => Promise<string | null>;
  joinTournament: (
    shareCode: string,
    userId: string,
    displayName: string,
    armyListId?: string,
  ) => Promise<void>;
  loadTournament: (tournamentId: string) => Promise<void>;
  startTournament: (tournamentId: string) => Promise<void>;
  generatePairings: (tournamentId: string, roundNumber: number) => Promise<void>;
  submitResult: (
    pairingId: string,
    p1VP: number,
    p2VP: number,
  ) => Promise<void>;
  loadStandings: (tournamentId: string) => Promise<void>;
  completeTournament: (tournamentId: string) => Promise<void>;
}

export const useTournamentStore = create<TournamentState>()((set, get) => ({
  tournaments: [],
  publicTournaments: [],
  activeTournament: null,
  participants: [],
  rounds: [],
  pairings: [],
  standings: [],
  loading: false,
  error: null,

  loadMyTournaments: async (userId: string) => {
    set({ loading: true, error: null });

    // Tournaments I organize
    const { data: organized, error: orgError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('organizer_id', userId);

    if (orgError) {
      set({ loading: false, error: orgError.message });
      return;
    }

    // Tournaments I participate in
    const { data: participations, error: partError } = await supabase
      .from('tournament_participants')
      .select('tournament_id')
      .eq('user_id', userId);

    if (partError) {
      set({ loading: false, error: partError.message });
      return;
    }

    const participatedIds = (participations ?? [])
      .map((p) => p.tournament_id)
      .filter((id) => !(organized ?? []).some((t) => t.id === id));

    let participated: Tournament[] = [];
    if (participatedIds.length > 0) {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .in('id', participatedIds);

      if (error) {
        set({ loading: false, error: error.message });
        return;
      }
      participated = (data as Tournament[]) ?? [];
    }

    const all = [...((organized as Tournament[]) ?? []), ...participated];
    all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    set({ tournaments: all, loading: false });
  },

  loadPublicTournaments: async () => {
    set({ error: null });

    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      set({ error: error.message });
      return;
    }

    set({ publicTournaments: (data as Tournament[]) ?? [] });
  },

  createTournament: async (data) => {
    set({ error: null });

    const { data: created, error } = await supabase
      .from('tournaments')
      .insert({
        organizer_id: data.organizer_id,
        name: data.name,
        description: data.description,
        format: data.format,
        max_players: data.max_players,
        points_limit: data.points_limit,
        num_rounds: data.num_rounds,
        is_public: data.is_public ?? false,
      })
      .select()
      .single();

    if (error || !created) {
      set({ error: error?.message ?? 'Failed to create tournament' });
      return null;
    }

    const tournament = created as Tournament;
    set((state) => ({
      tournaments: [tournament, ...state.tournaments],
    }));

    return tournament.id;
  },

  joinTournament: async (shareCode, userId, displayName, armyListId?) => {
    set({ error: null });

    // Find tournament by share code
    const { data: tournament, error: findError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('share_code', shareCode)
      .single();

    if (findError || !tournament) {
      set({ error: 'Tournament not found with that code' });
      return;
    }

    const { error: joinError } = await supabase
      .from('tournament_participants')
      .insert({
        tournament_id: tournament.id,
        user_id: userId,
        display_name: displayName,
        army_list_id: armyListId,
      });

    if (joinError) {
      set({ error: joinError.message });
      return;
    }

    // Reload tournaments
    await get().loadMyTournaments(userId);
  },

  loadTournament: async (tournamentId: string) => {
    set({ loading: true, error: null });

    const [tournamentRes, participantsRes, roundsRes] = await Promise.all([
      supabase.from('tournaments').select('*').eq('id', tournamentId).single(),
      supabase
        .from('tournament_participants')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('seed', { ascending: true }),
      supabase
        .from('tournament_rounds')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('round_number', { ascending: true }),
    ]);

    if (tournamentRes.error) {
      set({ loading: false, error: tournamentRes.error.message });
      return;
    }

    const rounds = (roundsRes.data as TournamentRound[]) ?? [];

    // Load pairings for all rounds
    let allPairings: TournamentPairing[] = [];
    if (rounds.length > 0) {
      const roundIds = rounds.map((r) => r.id);
      const { data: pairingsData } = await supabase
        .from('tournament_pairings')
        .select('*')
        .in('round_id', roundIds)
        .order('table_number', { ascending: true });
      allPairings = (pairingsData as TournamentPairing[]) ?? [];
    }

    set({
      activeTournament: tournamentRes.data as Tournament,
      participants: (participantsRes.data as TournamentParticipant[]) ?? [],
      rounds,
      pairings: allPairings,
      loading: false,
    });
  },

  startTournament: async (tournamentId: string) => {
    set({ error: null });

    const { error } = await supabase
      .from('tournaments')
      .update({ status: 'active', started_at: new Date().toISOString() })
      .eq('id', tournamentId);

    if (error) {
      set({ error: error.message });
      return;
    }

    // Reload tournament
    await get().loadTournament(tournamentId);
  },

  generatePairings: async (tournamentId: string, roundNumber: number) => {
    set({ error: null });

    const { error } = await supabase
      .rpc('generate_swiss_pairings', {
        p_tournament_id: tournamentId,
        p_round_number: roundNumber,
      });

    if (error) {
      set({ error: error.message });
      return;
    }

    // Reload tournament data
    await get().loadTournament(tournamentId);
  },

  submitResult: async (pairingId: string, p1VP: number, p2VP: number) => {
    set({ error: null });

    let winnerId: string | null = null;
    let isDraw = false;

    // Find the pairing to determine winner
    const pairing = get().pairings.find((p) => p.id === pairingId);
    if (!pairing) {
      set({ error: 'Pairing not found' });
      return;
    }

    if (p1VP > p2VP) {
      winnerId = pairing.player1_id;
    } else if (p2VP > p1VP) {
      winnerId = pairing.player2_id;
    } else {
      isDraw = true;
    }

    const { error } = await supabase
      .from('tournament_pairings')
      .update({
        player1_vp: p1VP,
        player2_vp: p2VP,
        winner_id: winnerId,
        is_draw: isDraw,
        completed_at: new Date().toISOString(),
      })
      .eq('id', pairingId);

    if (error) {
      set({ error: error.message });
      return;
    }

    // Optimistic update in local state
    set((state) => ({
      pairings: state.pairings.map((p) =>
        p.id === pairingId
          ? {
              ...p,
              player1_vp: p1VP,
              player2_vp: p2VP,
              winner_id: winnerId,
              is_draw: isDraw,
              completed_at: new Date().toISOString(),
            }
          : p
      ),
    }));
  },

  loadStandings: async (tournamentId: string) => {
    set({ error: null });

    const { data, error } = await supabase
      .rpc('get_tournament_standings', { p_tournament_id: tournamentId });

    if (error) {
      set({ error: error.message });
      return;
    }

    set({ standings: (data as TournamentStanding[]) ?? [] });
  },

  completeTournament: async (tournamentId: string) => {
    set({ error: null });

    const { error } = await supabase
      .from('tournaments')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', tournamentId);

    if (error) {
      set({ error: error.message });
      return;
    }

    await get().loadTournament(tournamentId);
  },
}));
