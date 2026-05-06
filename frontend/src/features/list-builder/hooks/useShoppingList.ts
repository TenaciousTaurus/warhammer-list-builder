import { useState, useCallback } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import type { ShoppingListItem } from '../../../shared/types/database';

interface UseShoppingListResult {
  items: ShoppingListItem[];
  loading: boolean;
  error: string | null;
  fetch: (listId: string) => Promise<void>;
  addAllToWishlist: (userId: string, factionId: string) => Promise<{ added: number }>;
}

export function useShoppingList(): UseShoppingListResult {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (listId: string) => {
    setLoading(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc('shopping_list_for_army', {
      p_list_id: listId,
    });
    if (rpcError) {
      setError(rpcError.message);
    } else {
      setItems((data as ShoppingListItem[]) ?? []);
    }
    setLoading(false);
  }, []);

  const addAllToWishlist = useCallback(async (userId: string, factionId: string) => {
    let added = 0;
    for (const item of items) {
      const { error: insError } = await supabase.from('wishlist_items').insert({
        user_id: userId,
        unit_id: item.unit_id,
        faction_id: factionId,
        name: item.unit_name,
        priority: 2,
        estimated_price: item.est_cost_usd ?? null,
      });
      if (!insError) added++;
    }
    return { added };
  }, [items]);

  return { items, loading, error, fetch, addAllToWishlist };
}
