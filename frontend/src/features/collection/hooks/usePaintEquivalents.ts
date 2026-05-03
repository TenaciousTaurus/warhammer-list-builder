import { useState, useCallback } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import type { PaintEquivalentResult } from '../../../shared/types/database';

interface UsePaintEquivalentsResult {
  equivalents: PaintEquivalentResult[];
  loading: boolean;
  fetch: (paintId: string) => Promise<void>;
  clear: () => void;
}

export function usePaintEquivalents(): UsePaintEquivalentsResult {
  const [equivalents, setEquivalents] = useState<PaintEquivalentResult[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async (paintId: string) => {
    setLoading(true);
    const { data } = await supabase.rpc('get_paint_equivalents', { p_paint_id: paintId });
    setEquivalents((data as PaintEquivalentResult[]) ?? []);
    setLoading(false);
  }, []);

  const clear = useCallback(() => {
    setEquivalents([]);
  }, []);

  return { equivalents, loading, fetch, clear };
}
