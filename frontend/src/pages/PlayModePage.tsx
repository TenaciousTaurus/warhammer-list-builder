import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { ArmyList, Unit, UnitPointsTier, ArmyListUnit, Enhancement, Detachment, Ability, Weapon } from '../types/database';
import { DatasheetView } from '../components/DatasheetView';
import { CasualtyTracker } from '../components/CasualtyTracker';
import { GameTracker } from '../components/GameTracker';
import { getUnitPoints, ROLE_ORDER, ROLE_LABELS } from '../hooks/useListEditor';

type UnitWithRelations = Unit & { unit_points_tiers: UnitPointsTier[]; abilities: Ability[]; weapons: Weapon[] };
type ArmyListUnitWithDetails = ArmyListUnit & { units: UnitWithRelations };

export function PlayModePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [list, setList] = useState<(ArmyList & { detachments: Detachment }) | null>(null);
  const [listUnits, setListUnits] = useState<ArmyListUnitWithDetails[]>([]);
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [listEnhancements, setListEnhancements] = useState<{ id: string; enhancement_id: string; army_list_unit_id: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: listData } = await supabase
        .from('army_lists')
        .select('*, detachments(*)')
        .eq('id', id)
        .single();

      if (!listData) { navigate('/'); return; }
      setList(listData as ArmyList & { detachments: Detachment });

      const { data: unitData } = await supabase
        .from('army_list_units')
        .select('*, units(*, unit_points_tiers(*), abilities(*), weapons(*))')
        .eq('army_list_id', id)
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
        .eq('army_list_id', id);
      if (listEnhData) setListEnhancements(listEnhData);

      setLoading(false);
    })();
  }, [id, navigate]);

  if (loading || !list || !id) return <div className="empty-state"><p>Loading...</p></div>;

  const totalPoints = listUnits.reduce((sum, lu) => sum + getUnitPoints(lu.units, lu.model_count), 0)
    + listEnhancements.reduce((sum, le) => {
      const enh = enhancements.find(e => e.id === le.enhancement_id);
      return sum + (enh?.points ?? 0);
    }, 0);

  const rosterByRole: Record<string, ArmyListUnitWithDetails[]> = {};
  for (const lu of listUnits) {
    if (!rosterByRole[lu.units.role]) rosterByRole[lu.units.role] = [];
    rosterByRole[lu.units.role].push(lu);
  }

  function toggleExpand(unitId: string) {
    setExpandedUnits(prev => {
      const next = new Set(prev);
      if (next.has(unitId)) next.delete(unitId);
      else next.add(unitId);
      return next;
    });
  }

  return (
    <div className="play-mode">
      {/* Header */}
      <div className="play-mode__header">
        <div>
          <h2 className="play-mode__title">{list.name}</h2>
          <span className="play-mode__subtitle">
            {list.detachments?.name} &middot; {totalPoints}/{list.points_limit} pts
          </span>
        </div>
        <div className="play-mode__header-actions">
          <span className="play-mode__lock-badge">&#128274; Play Mode</span>
          <button className="btn" onClick={() => navigate(`/list/${id}`)}>
            Edit List
          </button>
        </div>
      </div>

      {/* Game Tracker */}
      <GameTracker listId={id} />

      {/* Unit Cards */}
      <div className="play-mode__units">
        {ROLE_ORDER.map(role => {
          const roleUnits = rosterByRole[role];
          if (!roleUnits || roleUnits.length === 0) return null;
          return (
            <div key={role}>
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
                const isMultiWound = lu.units.wounds > 1 && lu.model_count <= 3;

                return (
                  <div key={lu.id} className={`play-mode__unit-card${isExpanded ? ' play-mode__unit-card--expanded' : ''}`}>
                    <div className="play-mode__unit-header" onClick={() => toggleExpand(lu.id)}>
                      <div>
                        <span className="play-mode__unit-name">{displayName}</span>
                        {enh && <span className="play-mode__unit-enh"> &middot; {enh.name}</span>}
                      </div>
                      <div className="play-mode__unit-right">
                        <span className="play-mode__unit-pts">{totalPts} pts</span>
                        <span className="play-mode__expand-arrow">{isExpanded ? '\u25B2' : '\u25BC'}</span>
                      </div>
                    </div>

                    {/* Casualty tracker always visible */}
                    <CasualtyTracker
                      armyListUnitId={lu.id}
                      listId={id}
                      modelCount={lu.model_count}
                      wounds={lu.units.wounds}
                      isMultiWound={isMultiWound}
                    />

                    {/* Expandable datasheet */}
                    {isExpanded && (
                      <div className="play-mode__datasheet">
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
    </div>
  );
}
