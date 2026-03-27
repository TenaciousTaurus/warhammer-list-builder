import { create } from 'zustand';
import { supabase } from '../../../shared/lib/supabase';
import type {
  CollectionEntry,
  WishlistItem,
  Faction,
} from '../../../shared/types/database';

export const PAINTING_STATUSES = [
  'unbuilt',
  'assembled',
  'primed',
  'basecoated',
  'detailed',
  'based',
  'finished',
] as const;

export type PaintingStatus = typeof PAINTING_STATUSES[number];

interface CollectionState {
  entries: CollectionEntry[];
  wishlist: WishlistItem[];
  factions: Faction[];
  loading: boolean;

  loadCollection: (userId: string) => Promise<void>;
  addEntry: (entry: Partial<CollectionEntry> & { user_id: string }) => Promise<void>;
  updateEntry: (id: string, updates: Partial<CollectionEntry>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  updatePaintingStatus: (id: string, status: string) => Promise<void>;
  addWishlistItem: (item: Partial<WishlistItem> & { user_id: string; name: string }) => Promise<void>;
  removeWishlistItem: (id: string) => Promise<void>;
}

export const useCollectionStore = create<CollectionState>()((set, get) => ({
  entries: [],
  wishlist: [],
  factions: [],
  loading: false,

  loadCollection: async (userId: string) => {
    set({ loading: true });
    try {
      const [entriesRes, wishlistRes, factionsRes] = await Promise.all([
        supabase
          .from('collection_entries')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false }),
        supabase
          .from('wishlist_items')
          .select('*')
          .eq('user_id', userId)
          .order('priority', { ascending: true }),
        supabase
          .from('factions')
          .select('*')
          .order('name', { ascending: true }),
      ]);

      set({
        entries: (entriesRes.data as CollectionEntry[]) ?? [],
        wishlist: (wishlistRes.data as WishlistItem[]) ?? [],
        factions: (factionsRes.data as Faction[]) ?? [],
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  addEntry: async (entry) => {
    const optimisticId = crypto.randomUUID();
    const now = new Date().toISOString();
    const optimistic: CollectionEntry = {
      id: optimisticId,
      user_id: entry.user_id,
      unit_id: entry.unit_id ?? null,
      faction_id: entry.faction_id ?? null,
      custom_name: entry.custom_name ?? null,
      quantity: entry.quantity ?? 1,
      painting_status: entry.painting_status ?? 'unbuilt',
      purchase_price: entry.purchase_price ?? null,
      purchase_date: entry.purchase_date ?? null,
      finished_date: entry.finished_date ?? null,
      notes: entry.notes ?? null,
      photos: entry.photos ?? [],
      created_at: now,
      updated_at: now,
    };

    set((state) => ({ entries: [optimistic, ...state.entries] }));

    const { data, error } = await supabase
      .from('collection_entries')
      .insert({
        user_id: entry.user_id,
        unit_id: entry.unit_id,
        faction_id: entry.faction_id,
        custom_name: entry.custom_name,
        quantity: entry.quantity ?? 1,
        painting_status: entry.painting_status ?? 'unbuilt',
        purchase_price: entry.purchase_price,
        purchase_date: entry.purchase_date,
        notes: entry.notes,
        photos: entry.photos ?? [],
      })
      .select()
      .single();

    if (error || !data) {
      set((state) => ({
        entries: state.entries.filter((e) => e.id !== optimisticId),
      }));
      return;
    }

    set((state) => ({
      entries: state.entries.map((e) =>
        e.id === optimisticId ? (data as CollectionEntry) : e
      ),
    }));
  },

  updateEntry: async (id, updates) => {
    const prev = get().entries.find((e) => e.id === id);
    if (!prev) return;

    set((state) => ({
      entries: state.entries.map((e) =>
        e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e
      ),
    }));

    const { error } = await supabase
      .from('collection_entries')
      .update(updates)
      .eq('id', id);

    if (error) {
      set((state) => ({
        entries: state.entries.map((e) => (e.id === id ? prev : e)),
      }));
    }
  },

  removeEntry: async (id) => {
    const prev = get().entries;
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    }));

    const { error } = await supabase
      .from('collection_entries')
      .delete()
      .eq('id', id);

    if (error) {
      set({ entries: prev });
    }
  },

  updatePaintingStatus: async (id, status) => {
    const updates: Partial<CollectionEntry> = { painting_status: status };
    if (status === 'finished') {
      updates.finished_date = new Date().toISOString().split('T')[0];
    }
    await get().updateEntry(id, updates);
  },

  addWishlistItem: async (item) => {
    const optimisticId = crypto.randomUUID();
    const optimistic: WishlistItem = {
      id: optimisticId,
      user_id: item.user_id,
      unit_id: item.unit_id ?? null,
      faction_id: item.faction_id ?? null,
      name: item.name,
      estimated_price: item.estimated_price ?? null,
      priority: item.priority ?? 3,
      notes: item.notes ?? null,
      created_at: new Date().toISOString(),
    };

    set((state) => ({ wishlist: [...state.wishlist, optimistic] }));

    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: item.user_id,
        name: item.name,
        priority: item.priority ?? 3,
        unit_id: item.unit_id,
        faction_id: item.faction_id,
        estimated_price: item.estimated_price,
        notes: item.notes,
      })
      .select()
      .single();

    if (error || !data) {
      set((state) => ({
        wishlist: state.wishlist.filter((w) => w.id !== optimisticId),
      }));
      return;
    }

    set((state) => ({
      wishlist: state.wishlist.map((w) =>
        w.id === optimisticId ? (data as WishlistItem) : w
      ),
    }));
  },

  removeWishlistItem: async (id) => {
    const prev = get().wishlist;
    set((state) => ({
      wishlist: state.wishlist.filter((w) => w.id !== id),
    }));

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('id', id);

    if (error) {
      set({ wishlist: prev });
    }
  },
}));
