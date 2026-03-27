import { create } from 'zustand';
import { supabase } from '../../../shared/lib/supabase';
import type {
  UserProfile,
  Friendship,
  PlayerStats,
  HeadToHeadStats,
} from '../../../shared/types/database';

export interface FriendWithProfile extends Friendship {
  profile: UserProfile;
}

interface SocialState {
  profile: UserProfile | null;
  friends: FriendWithProfile[];
  pendingRequests: FriendWithProfile[];
  stats: PlayerStats | null;
  loading: boolean;
  error: string | null;

  loadProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  loadFriends: (userId: string) => Promise<void>;
  loadPendingRequests: (userId: string) => Promise<void>;
  sendFriendRequest: (requesterId: string, addresseeId: string) => Promise<void>;
  respondToRequest: (friendshipId: string, accept: boolean) => Promise<void>;
  removeFriend: (friendshipId: string) => Promise<void>;
  loadStats: (userId: string) => Promise<void>;
  loadHeadToHead: (user1Id: string, user2Id: string) => Promise<HeadToHeadStats | null>;
  searchPlayers: (query: string) => Promise<UserProfile[]>;
}

export const useSocialStore = create<SocialState>()((set, get) => ({
  profile: null,
  friends: [],
  pendingRequests: [],
  stats: null,
  loading: false,
  error: null,

  loadProfile: async (userId: string) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    set({ profile: data as UserProfile, loading: false });
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const prev = get().profile;
    if (!prev) return;

    // Optimistic update
    set({ profile: { ...prev, ...updates, updated_at: new Date().toISOString() } });

    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', prev.id);

    if (error) {
      // Rollback
      set({ profile: prev, error: error.message });
    }
  },

  loadFriends: async (userId: string) => {
    set({ loading: true, error: null });

    // Fetch accepted friendships where user is either requester or addressee
    const { data: friendships, error } = await supabase
      .from('friendships')
      .select('*')
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (error) {
      set({ loading: false, error: error.message });
      return;
    }

    if (!friendships || friendships.length === 0) {
      set({ friends: [], loading: false });
      return;
    }

    // Collect friend user IDs (the other person in each friendship)
    const friendUserIds = friendships.map((f) =>
      f.requester_id === userId ? f.addressee_id : f.requester_id
    );

    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .in('id', friendUserIds);

    if (profileError) {
      set({ loading: false, error: profileError.message });
      return;
    }

    const profileMap = new Map<string, UserProfile>();
    for (const p of (profiles as UserProfile[]) ?? []) {
      profileMap.set(p.id, p);
    }

    const friends: FriendWithProfile[] = friendships
      .map((f) => {
        const friendId = f.requester_id === userId ? f.addressee_id : f.requester_id;
        const profile = profileMap.get(friendId);
        if (!profile) return null;
        return { ...(f as Friendship), profile };
      })
      .filter((f): f is FriendWithProfile => f !== null);

    set({ friends, loading: false });
  },

  loadPendingRequests: async (userId: string) => {
    set({ loading: true, error: null });

    const { data: friendships, error } = await supabase
      .from('friendships')
      .select('*')
      .eq('addressee_id', userId)
      .eq('status', 'pending');

    if (error) {
      set({ loading: false, error: error.message });
      return;
    }

    if (!friendships || friendships.length === 0) {
      set({ pendingRequests: [], loading: false });
      return;
    }

    const requesterIds = friendships.map((f) => f.requester_id);

    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .in('id', requesterIds);

    if (profileError) {
      set({ loading: false, error: profileError.message });
      return;
    }

    const profileMap = new Map<string, UserProfile>();
    for (const p of (profiles as UserProfile[]) ?? []) {
      profileMap.set(p.id, p);
    }

    const pendingRequests: FriendWithProfile[] = friendships
      .map((f) => {
        const profile = profileMap.get(f.requester_id);
        if (!profile) return null;
        return { ...(f as Friendship), profile };
      })
      .filter((f): f is FriendWithProfile => f !== null);

    set({ pendingRequests, loading: false });
  },

  sendFriendRequest: async (requesterId: string, addresseeId: string) => {
    set({ error: null });

    const { error } = await supabase
      .from('friendships')
      .insert({ requester_id: requesterId, addressee_id: addresseeId, status: 'pending' });

    if (error) {
      set({ error: error.message });
    }
  },

  respondToRequest: async (friendshipId: string, accept: boolean) => {
    const prev = get().pendingRequests;
    const status = accept ? 'accepted' : 'declined';

    // Optimistic: remove from pending
    set((state) => ({
      pendingRequests: state.pendingRequests.filter((r) => r.id !== friendshipId),
    }));

    const { error } = await supabase
      .from('friendships')
      .update({ status })
      .eq('id', friendshipId);

    if (error) {
      // Rollback
      set({ pendingRequests: prev, error: error.message });
      return;
    }

    // If accepted, add to friends list
    if (accept) {
      const accepted = prev.find((r) => r.id === friendshipId);
      if (accepted) {
        set((state) => ({
          friends: [...state.friends, { ...accepted, status: 'accepted' }],
        }));
      }
    }
  },

  removeFriend: async (friendshipId: string) => {
    const prev = get().friends;

    // Optimistic removal
    set((state) => ({
      friends: state.friends.filter((f) => f.id !== friendshipId),
    }));

    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', friendshipId);

    if (error) {
      set({ friends: prev, error: error.message });
    }
  },

  loadStats: async (userId: string) => {
    set({ loading: true, error: null });

    const { data, error } = await supabase
      .rpc('get_player_stats', { target_user_id: userId });

    if (error) {
      set({ loading: false, error: error.message });
      return;
    }

    set({ stats: data as PlayerStats, loading: false });
  },

  loadHeadToHead: async (user1Id: string, user2Id: string) => {
    const { data, error } = await supabase
      .rpc('get_head_to_head', { user1_id: user1Id, user2_id: user2Id });

    if (error) {
      set({ error: error.message });
      return null;
    }

    return data as HeadToHeadStats;
  },

  searchPlayers: async (query: string) => {
    if (!query.trim()) return [];

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .ilike('display_name', `%${query}%`)
      .limit(20);

    if (error) {
      set({ error: error.message });
      return [];
    }

    return (data as UserProfile[]) ?? [];
  },
}));
