import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { ArmyList, Enhancement, Detachment } from '../types/database';
import { DatasheetView } from '../components/DatasheetView';
import { PointsBar } from '../components/PointsBar';
import { getUnitPoints, ROLE_ORDER, ROLE_LABELS, type ArmyListUnitWithDetails } from '../hooks/useListEditor';

export function SharedListPage() {
  const { code } = useParams<{ code: string }>();
  const [list, setList] = useState<(ArmyList & { detachments: Detachment; factions: { name: string } }) | null>(null);
  const [listUnits, setListUnits] = useState<ArmyListUnitWithDetails[]>([]);
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [listEnhancements, setListEnhancements] = useState<{ id: string; enhancement_id: string; army_list_unit_id: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!code) return;
    (async () => {
      const { data: listData } = await supabase
        .from('army_lists')
        .select('*, detachments(*), factions(name)')
        .eq('share_code', code)
        .single();

      if (!listData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setList(listData as ArmyList & { detachments: Detachment; factions: { name: string } });

      const { data: unitData } = await supabase
        .from('army_list_units')
        .select('*, units(*, unit_points_tiers(*), abilities(*), weapons(*))')
        .eq('army_list_id', listData.id)
        .order('sort_order');

      if (unitData) setListUnits(unitData as ArmyListUnitWithDetails[]);

      const { data: enhData } = await supabase
        .from('enhancements')
        .select('*')
        .eq('detachment_id', listData.detachment_id);

      if (enhData) setEnhancements(enhData);

      const { data: listEnhData } = await supabase
        .from('army_list_enhancements')
        .select('*')
        .eq('army_list_id', listData.id);

      if (listEnhData) setListEnhancements(listEnhData);

      setLoading(false);
    })();
  }, [code]);

  if (loading) return (
    <div className="shared-list">
      <div className="skeleton-list">
        <div className="skeleton skeleton--header" />
        <div className="skeleton skeleton--bar" />
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton" style={{ height: '48px', width: '100%' }} />
        ))}
      </div>
    </div>
  );
  if (notFound || !list) {
    return (
      <div className="empty-state card">
        <div className="empty-state__title">List Not Found</div>
        <p>This shared list link is invalid or has been removed.</p>
        <Link to="/" className="btn btn--primary shared-list__home-link">Go Home</Link>
      </div>
    );
  }

  const totalPoints = listUnits.reduce((sum, lu) => sum + getUnitPoints(lu.units, lu.model_count), 0)
    + listEnhancements.reduce((sum, le) => {
      const enh = enhancements.find(e => e.id === le.enhancement_id);
      return sum + (enh?.points ?? 0);
    }, 0);

  const rosterByRole: Record<string, ArmyListUnitWithDetails[]> = {};
  for (const lu of listUnits) {
    const role = lu.units.role;
    if (!rosterByRole[role]) rosterByRole[role] = [];
    rosterByRole[role].push(lu);
  }

  function toggleExpand(id: string) {
    setExpandedUnits(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="shared-list">
      <div className="shared-list__header">
        <div>
          <h2 className="list-editor__army-name">{list.name}</h2>
          <span className="list-editor__detachment">
            {(list.factions as { name: string })?.name} &middot; {list.detachments?.name}
          </span>
        </div>
        <div className={`list-editor__points-display${totalPoints > list.points_limit ? ' list-editor__points-display--over' : ''}`}>
          {totalPoints}
          <span className="list-editor__points-limit"> / {list.points_limit} pts</span>
        </div>
      </div>

      <PointsBar current={totalPoints} limit={list.points_limit} />

      <div className="shared-list__roster">
        {ROLE_ORDER.map(role => {
          const roleUnits = rosterByRole[role];
          if (!roleUnits || roleUnits.length === 0) return null;
          return (
            <div key={role} className="roster-section">
              <div className={`roster-section__header roster-section__header--${role}`}>
                <span>{ROLE_LABELS[role]}</span>
              </div>
              {roleUnits.map(lu => {
                const pts = getUnitPoints(lu.units, lu.model_count);
                const enhAssignment = listEnhancements.find(le => le.army_list_unit_id === lu.id);
                const enh = enhAssignment ? enhancements.find(e => e.id === enhAssignment.enhancement_id) : null;
                const totalPts = pts + (enh?.points ?? 0);
                const isExpanded = expandedUnits.has(lu.id);
                const displayName = lu.model_count > 1 ? `${lu.model_count} ${lu.units.name}` : lu.units.name;

                return (
                  <div
                    key={lu.id}
                    className={`roster-item${isExpanded ? ' roster-item--expanded' : ''}`}
                    onClick={() => toggleExpand(lu.id)}
                    role="button"
                  >
                    <div className="roster-item__row1">
                      <span className="roster-item__name">{displayName}</span>
                      <div className="roster-item__right">
                        <span className="roster-item__points">{totalPts} pts</span>
                        <button className="roster-item__expand" onClick={(e) => { e.stopPropagation(); toggleExpand(lu.id); }}>
                          {isExpanded ? '\u25B2' : '\u25BC'}
                        </button>
                      </div>
                    </div>
                    {enh && (
                      <div className="roster-item__row2">
                        <span className="roster-item__enhancement">
                          {enh.name} (+{enh.points} pts)
                        </span>
                      </div>
                    )}
                    {isExpanded && (
                      <div className="roster-item__datasheet">
                        <DatasheetView unit={lu.units} weapons={lu.units.weapons ?? []} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="shared-list__footer">
        <Link to="/" className="btn">Build Your Own List</Link>
      </div>
    </div>
  );
}
