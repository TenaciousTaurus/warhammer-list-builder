import { create } from 'zustand';
import { supabase } from '../../../shared/lib/supabase';
import type { Paint } from '../../../shared/types/database';

export interface PaintInventoryItem {
  id: string;
  user_id: string;
  paint_id: string;
  in_stock: boolean;
  quantity: number;
  paint_library: Paint;
}

interface PaintInventoryState {
  inventory: PaintInventoryItem[];
  paints: Paint[];
  loading: boolean;
  error: string | null;

  loadInventory: (userId: string) => Promise<void>;
  loadPaints: () => Promise<void>;
  addPaint: (userId: string, paintId: string) => Promise<void>;
  removePaint: (inventoryId: string) => Promise<void>;
  updateQuantity: (inventoryId: string, quantity: number) => Promise<void>;
  toggleInStock: (inventoryId: string) => Promise<void>;
}

export const usePaintInventoryStore = create<PaintInventoryState>()((set, get) => ({
  inventory: [],
  paints: [],
  loading: false,
  error: null,

  loadInventory: async (userId: string) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('user_paint_inventory')
      .select('*, paint_library(*)')
      .eq('user_id', userId);

    if (error) {
      set({ loading: false, error: 'Failed to load paint inventory' });
      return;
    }

    set({
      inventory: (data as PaintInventoryItem[]) ?? [],
      loading: false,
    });
  },

  loadPaints: async () => {
    const { data } = await supabase
      .from('paint_library')
      .select('*')
      .order('brand')
      .order('paint_name');

    if (data) {
      set({ paints: data as Paint[] });
    }
  },

  addPaint: async (userId: string, paintId: string) => {
    set({ error: null });

    // Check if already in inventory
    const existing = get().inventory.find((i) => i.paint_id === paintId);
    if (existing) {
      // Increment quantity instead
      await get().updateQuantity(existing.id, existing.quantity + 1);
      return;
    }

    const { data, error } = await supabase
      .from('user_paint_inventory')
      .insert({ user_id: userId, paint_id: paintId, in_stock: true, quantity: 1 })
      .select('*, paint_library(*)')
      .single();

    if (error || !data) {
      set({ error: 'Failed to add paint' });
      return;
    }

    set((state) => ({
      inventory: [...state.inventory, data as PaintInventoryItem],
    }));
  },

  removePaint: async (inventoryId: string) => {
    const prev = get().inventory;
    set((state) => ({
      inventory: state.inventory.filter((i) => i.id !== inventoryId),
    }));

    const { error } = await supabase
      .from('user_paint_inventory')
      .delete()
      .eq('id', inventoryId);

    if (error) {
      set({ inventory: prev, error: 'Failed to remove paint' });
    }
  },

  updateQuantity: async (inventoryId: string, quantity: number) => {
    const prev = get().inventory;
    set((state) => ({
      inventory: state.inventory.map((i) =>
        i.id === inventoryId ? { ...i, quantity } : i
      ),
    }));

    const { error } = await supabase
      .from('user_paint_inventory')
      .update({ quantity })
      .eq('id', inventoryId);

    if (error) {
      set({ inventory: prev, error: 'Failed to update quantity' });
    }
  },

  toggleInStock: async (inventoryId: string) => {
    const item = get().inventory.find((i) => i.id === inventoryId);
    if (!item) return;

    const newValue = !item.in_stock;
    const prev = get().inventory;

    set((state) => ({
      inventory: state.inventory.map((i) =>
        i.id === inventoryId ? { ...i, in_stock: newValue } : i
      ),
    }));

    const { error } = await supabase
      .from('user_paint_inventory')
      .update({ in_stock: newValue })
      .eq('id', inventoryId);

    if (error) {
      set({ inventory: prev, error: 'Failed to update stock status' });
    }
  },
}));
