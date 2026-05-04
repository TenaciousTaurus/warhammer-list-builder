import { useState, useEffect } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import type { ArmyList, Faction, Detachment } from '../../../shared/types/database';
import { getUnitPoints } from '../stores/listEditorStore';
import type { ArmyListUnitWithDetails } from '../stores/listEditorStore';

interface ListCompareModalProps {
  listA: ArmyList & { factions: Faction };
  listB: ArmyList & { factions: Faction };
  onClose: () => void;
}

interface UnitRow {
  unitId: string;
  unitName: string;
  role: string;
  totalPtsA: number | null;
  totalPtsB: number | null;
  totalModelsA: number | null;
  totalModelsB: number | null;
  entryCountA: number;
  entryCountB: number;
}

async function fetchListData(listId: string) {
  const [unitsRes, listRes] = await Promise.all([
    supabase
      .from('army_list_units')
      .select('*, units(*, unit_points_tiers(*))')
      .eq('army_list_id', listId)
      .order('sort_order'),
    supabase.from('army_lists').select('*, detachments(*)').eq('id', listId).single(),
  ]);
  return {
    units: (unitsRes.data ?? []) as ArmyListUnitWithDetails[],
    detachment: (listRes.data as (ArmyList & { detachments: Detachment }) | null)?.detachments ?? null,
  };
}

function aggregateByUnit(units: ArmyListUnitWithDetails[]): Map<string, UnitRow> {
  const map = new Map<string, UnitRow>();
  for (const u of units) {
    const pts = getUnitPoints(u.units, u.model_count);
    const existing = map.get(u.unit_id);
    if (existing) {
      existing.totalPtsA = (existing.totalPtsA ?? 0) + pts;
      existing.totalModelsA = (existing.totalModelsA ?? 0) + u.model_count;
      existing.entryCountA += 1;
    } else {
      map.set(u.unit_id, {
        unitId: u.unit_id,
        unitName: u.units.name,
        role: u.units.role ?? '',
        totalPtsA: pts,
        totalPtsB: null,
        totalModelsA: u.model_count,
        totalModelsB: null,
        entryCountA: 1,
        entryCountB: 0,
      });
    }
  }
  return map;
}

export function ListCompareModal({ listA, listB, onClose }: ListCompareModalProps) {
  const [detachmentA, setDetachmentA] = useState<Detachment | null>(null);
  const [detachmentB, setDetachmentB] = useState<Detachment | null>(null);
  const [rows, setRows] = useState<UnitRow[]>([]);
  const [totalPtsA, setTotalPtsA] = useState(0);
  const [totalPtsB, setTotalPtsB] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [dataA, dataB] = await Promise.all([
        fetchListData(listA.id),
        fetchListData(listB.id),
      ]);

      setDetachmentA(dataA.detachment);
      setDetachmentB(dataB.detachment);

      const ptsA = dataA.units.reduce((s, u) => s + getUnitPoints(u.units, u.model_count), 0);
      const ptsB = dataB.units.reduce((s, u) => s + getUnitPoints(u.units, u.model_count), 0);
      setTotalPtsA(ptsA);
      setTotalPtsB(ptsB);

      // Build comparison map: start with A's units, then merge B
      const mapA = aggregateByUnit(dataA.units);

      for (const u of dataB.units) {
        const pts = getUnitPoints(u.units, u.model_count);
        const existing = mapA.get(u.unit_id);
        if (existing) {
          existing.totalPtsB = (existing.totalPtsB ?? 0) + pts;
          existing.totalModelsB = (existing.totalModelsB ?? 0) + u.model_count;
          existing.entryCountB += 1;
        } else {
          mapA.set(u.unit_id, {
            unitId: u.unit_id,
            unitName: u.units.name,
            role: u.units.role ?? '',
            totalPtsA: null,
            totalPtsB: pts,
            totalModelsA: null,
            totalModelsB: u.model_count,
            entryCountA: 0,
            entryCountB: 1,
          });
        }
      }

      // Sort: shared first, then only-A, then only-B; alpha within each group
      const sorted = [...mapA.values()].sort((a, b) => {
        const aShared = a.totalPtsA !== null && a.totalPtsB !== null;
        const bShared = b.totalPtsA !== null && b.totalPtsB !== null;
        const aOnlyA = a.totalPtsA !== null && a.totalPtsB === null;
        const bOnlyA = b.totalPtsA !== null && b.totalPtsB === null;
        if (aShared && !bShared) return -1;
        if (!aShared && bShared) return 1;
        if (aOnlyA && !bOnlyA) return -1;
        if (!aOnlyA && bOnlyA) return 1;
        return a.unitName.localeCompare(b.unitName);
      });

      setRows(sorted);
      setLoading(false);
    })();
  }, [listA.id, listB.id]);

  const shared = rows.filter(r => r.totalPtsA !== null && r.totalPtsB !== null);
  const onlyA = rows.filter(r => r.totalPtsA !== null && r.totalPtsB === null);
  const onlyB = rows.filter(r => r.totalPtsA === null && r.totalPtsB !== null);
  const ptsDelta = totalPtsA - totalPtsB;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="compare-modal-title">
      <div className="modal list-compare-modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title" id="compare-modal-title">Compare Lists</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">&#10005;</button>
        </div>

        {/* List headers */}
        <div className="list-compare__headers">
          <div className="list-compare__list-col list-compare__list-col--a">
            <div className="list-compare__list-name">{listA.name}</div>
            <div className="list-compare__list-sub">{listA.factions?.name}</div>
            {detachmentA && <div className="list-compare__list-detachment">{detachmentA.name}</div>}
            <div className="list-compare__list-pts">{totalPtsA} / {listA.points_limit} pts</div>
          </div>
          <div className="list-compare__vs">VS</div>
          <div className="list-compare__list-col list-compare__list-col--b">
            <div className="list-compare__list-name">{listB.name}</div>
            <div className="list-compare__list-sub">{listB.factions?.name}</div>
            {detachmentB && <div className="list-compare__list-detachment">{detachmentB.name}</div>}
            <div className="list-compare__list-pts">{totalPtsB} / {listB.points_limit} pts</div>
          </div>
        </div>

        {/* Delta summary bar */}
        <div className="list-compare__delta-bar">
          <span className="list-compare__delta-label">Points delta:</span>
          <span className={`list-compare__delta-value ${ptsDelta > 0 ? 'list-compare__delta-value--pos' : ptsDelta < 0 ? 'list-compare__delta-value--neg' : 'list-compare__delta-value--zero'}`}>
            {ptsDelta > 0 ? `+${ptsDelta}` : ptsDelta < 0 ? `${ptsDelta}` : 'Equal'}
            {ptsDelta !== 0 && ' pts (A vs B)'}
          </span>
          <span className="list-compare__delta-pill">{shared.length} shared · {onlyA.length} only A · {onlyB.length} only B</span>
        </div>

        {loading ? (
          <div style={{ padding: 'var(--space-lg)' }}>
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton skeleton--bar" style={{ marginBottom: 'var(--space-sm)' }} />)}
          </div>
        ) : (
          <div className="list-compare__body">
            {shared.length > 0 && (
              <div className="list-compare__section">
                <div className="list-compare__section-label">In both lists</div>
                {shared.map(row => (
                  <div key={row.unitId} className="list-compare__row list-compare__row--shared">
                    <div className="list-compare__cell list-compare__cell--a">
                      <span className="list-compare__unit-count">{row.totalModelsA}×</span>
                      <span className="list-compare__unit-name">{row.unitName}</span>
                      <span className="list-compare__unit-pts">{row.totalPtsA} pts</span>
                    </div>
                    <div className="list-compare__cell list-compare__cell--b">
                      <span className="list-compare__unit-count">{row.totalModelsB}×</span>
                      <span className="list-compare__unit-name">{row.unitName}</span>
                      <span className="list-compare__unit-pts">{row.totalPtsB} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {onlyA.length > 0 && (
              <div className="list-compare__section">
                <div className="list-compare__section-label list-compare__section-label--a">Only in {listA.name}</div>
                {onlyA.map(row => (
                  <div key={row.unitId} className="list-compare__row list-compare__row--only-a">
                    <div className="list-compare__cell list-compare__cell--a">
                      <span className="list-compare__unit-count">{row.totalModelsA}×</span>
                      <span className="list-compare__unit-name">{row.unitName}</span>
                      <span className="list-compare__unit-pts">{row.totalPtsA} pts</span>
                    </div>
                    <div className="list-compare__cell list-compare__cell--absent">—</div>
                  </div>
                ))}
              </div>
            )}

            {onlyB.length > 0 && (
              <div className="list-compare__section">
                <div className="list-compare__section-label list-compare__section-label--b">Only in {listB.name}</div>
                {onlyB.map(row => (
                  <div key={row.unitId} className="list-compare__row list-compare__row--only-b">
                    <div className="list-compare__cell list-compare__cell--absent">—</div>
                    <div className="list-compare__cell list-compare__cell--b">
                      <span className="list-compare__unit-count">{row.totalModelsB}×</span>
                      <span className="list-compare__unit-name">{row.unitName}</span>
                      <span className="list-compare__unit-pts">{row.totalPtsB} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
