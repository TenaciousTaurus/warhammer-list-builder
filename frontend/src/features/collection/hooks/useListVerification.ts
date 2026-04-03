import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import type { CollectionEntry } from '../../../shared/types/database';

interface UnitVerification {
  unitId: string;
  unitName: string;
  required: number;
  available: number;
  shortage: number;
}

interface ListVerificationResult {
  loading: boolean;
  verified: boolean;
  missingUnits: UnitVerification[];
  matchedUnits: UnitVerification[];
  totalShortages: number;
  status: 'full' | 'partial' | 'none';
}

interface ListUnit {
  unit_id: string;
  model_count: number;
  units: { name: string };
}

export function useListVerification(
  listUnits: ListUnit[],
  userId: string | undefined,
): ListVerificationResult {
  const [collectionEntries, setCollectionEntries] = useState<CollectionEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  // Get unique unit IDs from the list
  const unitIds = useMemo(
    () => [...new Set(listUnits.map((lu) => lu.unit_id))],
    [listUnits]
  );

  useEffect(() => {
    if (!userId || unitIds.length === 0) {
      setCollectionEntries([]);
      setVerified(false);
      return;
    }

    let cancelled = false;

    async function fetchCollection() {
      setLoading(true);
      const { data, error } = await supabase
        .from('collection_entries')
        .select('*')
        .eq('user_id', userId!)
        .in('unit_id', unitIds);

      if (!cancelled) {
        if (!error && data) {
          setCollectionEntries(data as CollectionEntry[]);
        }
        setVerified(true);
        setLoading(false);
      }
    }

    fetchCollection();
    return () => { cancelled = true; };
  }, [userId, unitIds]);

  return useMemo(() => {
    if (!verified || !userId) {
      return { loading, verified: false, missingUnits: [], matchedUnits: [], totalShortages: 0, status: 'none' as const };
    }

    // Aggregate required counts per unit_id
    const requiredByUnit = new Map<string, { name: string; count: number }>();
    for (const lu of listUnits) {
      const existing = requiredByUnit.get(lu.unit_id);
      if (existing) {
        existing.count += lu.model_count;
      } else {
        requiredByUnit.set(lu.unit_id, { name: lu.units.name, count: lu.model_count });
      }
    }

    // Aggregate available counts per unit_id from collection
    const availableByUnit = new Map<string, number>();
    for (const ce of collectionEntries) {
      if (ce.unit_id) {
        availableByUnit.set(ce.unit_id, (availableByUnit.get(ce.unit_id) ?? 0) + ce.quantity);
      }
    }

    const missingUnits: UnitVerification[] = [];
    const matchedUnits: UnitVerification[] = [];

    for (const [unitId, { name, count }] of requiredByUnit) {
      const available = availableByUnit.get(unitId) ?? 0;
      const shortage = Math.max(0, count - available);
      const entry: UnitVerification = {
        unitId,
        unitName: name,
        required: count,
        available,
        shortage,
      };
      if (shortage > 0) {
        missingUnits.push(entry);
      } else {
        matchedUnits.push(entry);
      }
    }

    const totalShortages = missingUnits.reduce((sum, u) => sum + u.shortage, 0);
    const status = missingUnits.length === 0 ? 'full' : matchedUnits.length === 0 ? 'none' : 'partial';

    return { loading, verified: true, missingUnits, matchedUnits, totalShortages, status };
  }, [loading, verified, userId, listUnits, collectionEntries]);
}
