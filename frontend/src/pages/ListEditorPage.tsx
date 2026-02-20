import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { ArmyList, Unit, UnitPointsTier, ArmyListUnit, Enhancement, Detachment, Ability } from '../types/database';
import { UnitCard } from '../components/UnitCard';
import { PointsBar } from '../components/PointsBar';
import { ExportModal } from '../components/ExportModal';

type UnitWithRelations = Unit & { unit_points_tiers: UnitPointsTier[]; abilities: Ability[] };

type ArmyListUnitWithDetails = ArmyListUnit & {
  units: UnitWithRelations;
};

export function ListEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [list, setList] = useState<(ArmyList & { detachments: Detachment }) | null>(null);
  const [listUnits, setListUnits] = useState<ArmyListUnitWithDetails[]>([]);
  const [availableUnits, setAvailableUnits] = useState<UnitWithRelations[]>([]);
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [listEnhancements, setListEnhancements] = useState<{ id: string; enhancement_id: string; army_list_unit_id: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [unitPickerFilter, setUnitPickerFilter] = useState('');

  async function fetchList() {
    if (!id) return;
    const { data: listData } = await supabase
      .from('army_lists')
      .select('*, detachments(*)')
      .eq('id', id)
      .single();

    if (!listData) {
      navigate('/');
      return;
    }
    setList(listData as ArmyList & { detachments: Detachment });

    const { data: unitData } = await supabase
      .from('army_list_units')
      .select('*, units(*, unit_points_tiers(*), abilities(*))')
      .eq('army_list_id', id)
      .order('sort_order');

    if (unitData) setListUnits(unitData as ArmyListUnitWithDetails[]);

    const { data: available } = await supabase
      .from('units')
      .select('*, unit_points_tiers(*), abilities(*)')
      .eq('faction_id', listData.faction_id)
      .order('name');

    if (available) setAvailableUnits(available as UnitWithRelations[]);

    // Fetch enhancements for the detachment
    const { data: enhData } = await supabase
      .from('enhancements')
      .select('*')
      .eq('detachment_id', listData.detachment_id)
      .order('points');

    if (enhData) setEnhancements(enhData);

    // Fetch assigned enhancements for this list
    const { data: listEnhData } = await supabase
      .from('army_list_enhancements')
      .select('*')
      .eq('army_list_id', id);

    if (listEnhData) setListEnhancements(listEnhData);

    setLoading(false);
  }

  useEffect(() => {
    fetchList();
  }, [id]);

  function getUnitPoints(unit: Unit & { unit_points_tiers: UnitPointsTier[] }, modelCount: number): number {
    const sorted = [...unit.unit_points_tiers].sort((a, b) => a.model_count - b.model_count);
    let pts = 0;
    for (const tier of sorted) {
      if (modelCount >= tier.model_count) pts = tier.points;
    }
    return pts;
  }

  const enhancementPoints = listEnhancements.reduce((sum, le) => {
    const enh = enhancements.find(e => e.id === le.enhancement_id);
    return sum + (enh?.points ?? 0);
  }, 0);

  const totalPoints = listUnits.reduce((sum, lu) => {
    return sum + getUnitPoints(lu.units, lu.model_count);
  }, 0) + enhancementPoints;

  const overLimit = list ? totalPoints > list.points_limit : false;

  // Validation: detect duplicate unique units
  const duplicateUniqueWarnings = useMemo(() => {
    const uniqueUnitCounts = new Map<string, number>();
    for (const lu of listUnits) {
      if (lu.units.is_unique) {
        uniqueUnitCounts.set(lu.units.name, (uniqueUnitCounts.get(lu.units.name) ?? 0) + 1);
      }
    }
    const warnings: string[] = [];
    for (const [name, count] of uniqueUnitCounts) {
      if (count > 1) warnings.push(`${name} is unique and appears ${count} times`);
    }
    return warnings;
  }, [listUnits]);

  // Check which unique units are already in the list
  const uniqueUnitIdsInList = useMemo(() => {
    const ids = new Set<string>();
    for (const lu of listUnits) {
      if (lu.units.is_unique) ids.add(lu.unit_id);
    }
    return ids;
  }, [listUnits]);

  // Character units for enhancement assignment
  const characterUnits = useMemo(() => {
    return listUnits.filter(lu =>
      lu.units.role === 'character' || lu.units.role === 'epic_hero'
    );
  }, [listUnits]);

  // Enhancement assignment helpers
  const assignedEnhancementIds = useMemo(() => {
    return new Set(listEnhancements.map(le => le.enhancement_id));
  }, [listEnhancements]);

  const unitEnhancementMap = useMemo(() => {
    const map = new Map<string, { enhancementId: string; listEnhancementId: string }>();
    for (const le of listEnhancements) {
      map.set(le.army_list_unit_id, { enhancementId: le.enhancement_id, listEnhancementId: le.id });
    }
    return map;
  }, [listEnhancements]);

  async function addUnit(unit: UnitWithRelations) {
    if (!id) return;
    // Block adding duplicate unique units
    if (unit.is_unique && uniqueUnitIdsInList.has(unit.id)) return;

    const minModels = unit.unit_points_tiers.length > 0
      ? Math.min(...unit.unit_points_tiers.map(t => t.model_count))
      : 1;

    await supabase.from('army_list_units').insert({
      army_list_id: id,
      unit_id: unit.id,
      model_count: minModels,
      sort_order: listUnits.length,
    });
    setShowUnitPicker(false);
    fetchList();
  }

  async function removeUnit(armyListUnitId: string) {
    await supabase.from('army_list_units').delete().eq('id', armyListUnitId);
    fetchList();
  }

  async function updateModelCount(armyListUnitId: string, modelCount: number) {
    await supabase
      .from('army_list_units')
      .update({ model_count: modelCount })
      .eq('id', armyListUnitId);
    fetchList();
  }

  async function assignEnhancement(armyListUnitId: string, enhancementId: string) {
    if (!id) return;
    // Remove existing enhancement on this unit first
    const existing = unitEnhancementMap.get(armyListUnitId);
    if (existing) {
      await supabase.from('army_list_enhancements').delete().eq('id', existing.listEnhancementId);
    }
    if (enhancementId) {
      await supabase.from('army_list_enhancements').insert({
        army_list_id: id,
        enhancement_id: enhancementId,
        army_list_unit_id: armyListUnitId,
      });
    }
    fetchList();
  }

  const filteredUnits = availableUnits.filter(u =>
    u.name.toLowerCase().includes(unitPickerFilter.toLowerCase())
  );

  if (loading || !list) {
    return <div className="empty-state"><p>Loading...</p></div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <button className="btn" onClick={() => navigate('/')}>
            &larr; Back to Lists
          </button>
          <button className="btn" onClick={() => setShowExport(true)}>
            Export List
          </button>
        </div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xs)' }}>{list.name}</h2>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)' }}>
          {list.detachments?.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
          <span style={{
            fontSize: '1.5rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: overLimit ? 'var(--color-red-bright)' : undefined,
          }}>
            {totalPoints}
            <span style={{ fontSize: '0.9rem', color: overLimit ? 'var(--color-red-bright)' : 'var(--color-text-secondary)' }}>
              {' '}/ {list.points_limit} pts
            </span>
          </span>
        </div>
        <PointsBar current={totalPoints} limit={list.points_limit} />

        {overLimit && (
          <div className="validation-banner validation-banner--error" style={{ marginTop: 'var(--space-md)' }}>
            Over limit by {totalPoints - list.points_limit} points! Remove units or reduce model counts.
          </div>
        )}

        {duplicateUniqueWarnings.length > 0 && (
          <div className="validation-banner validation-banner--error" style={{ marginTop: 'var(--space-sm)' }}>
            {duplicateUniqueWarnings.map((w, i) => <div key={i}>{w}</div>)}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        {listUnits.map((lu) => {
          const isCharacter = lu.units.role === 'character' || lu.units.role === 'epic_hero';
          const unitEnh = unitEnhancementMap.get(lu.id);
          return (
            <UnitCard
              key={lu.id}
              unit={lu.units}
              modelCount={lu.model_count}
              points={getUnitPoints(lu.units, lu.model_count)}
              availableTiers={lu.units.unit_points_tiers}
              abilities={lu.units.abilities}
              onModelCountChange={(count) => updateModelCount(lu.id, count)}
              onRemove={() => removeUnit(lu.id)}
              enhancement={isCharacter ? {
                assigned: unitEnh ? enhancements.find(e => e.id === unitEnh.enhancementId) ?? null : null,
                available: enhancements.filter(e => !assignedEnhancementIds.has(e.id) || e.id === unitEnh?.enhancementId),
                onAssign: (enhId) => assignEnhancement(lu.id, enhId),
              } : undefined}
            />
          );
        })}
      </div>

      {listUnits.length === 0 && (
        <div className="empty-state card" style={{ marginBottom: 'var(--space-lg)' }}>
          <div className="empty-state__icon">&#9876;</div>
          <div className="empty-state__title">No Units Added</div>
          <p>Add units from the panel below to build your army.</p>
        </div>
      )}

      <div>
        <button
          className="btn btn--primary"
          onClick={() => setShowUnitPicker(!showUnitPicker)}
          style={{ marginBottom: 'var(--space-md)' }}
        >
          {showUnitPicker ? 'Close Unit Picker' : '+ Add Unit'}
        </button>

        {showUnitPicker && (
          <div className="card" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <input
              className="form-input"
              type="text"
              placeholder="Filter units..."
              value={unitPickerFilter}
              onChange={(e) => setUnitPickerFilter(e.target.value)}
              style={{ width: '100%', marginBottom: 'var(--space-md)' }}
            />
            <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
              {filteredUnits.map((unit) => {
                const minTier = unit.unit_points_tiers.length > 0
                  ? Math.min(...unit.unit_points_tiers.map(t => t.points))
                  : 0;
                const isUniqueAlreadyAdded = unit.is_unique && uniqueUnitIdsInList.has(unit.id);
                return (
                  <div
                    key={unit.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 'var(--space-sm) var(--space-md)',
                      backgroundColor: 'var(--color-bg-tertiary)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: isUniqueAlreadyAdded ? 'not-allowed' : 'pointer',
                      opacity: isUniqueAlreadyAdded ? 0.4 : 1,
                    }}
                    onClick={() => !isUniqueAlreadyAdded && addUnit(unit)}
                  >
                    <div>
                      <span style={{ fontWeight: 600 }}>{unit.name}</span>
                      <span className={`role-badge role-badge--${unit.role}`} style={{ marginLeft: 'var(--space-sm)' }}>
                        {unit.role.replace('_', ' ')}
                      </span>
                      {isUniqueAlreadyAdded && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginLeft: 'var(--space-sm)' }}>
                          (already in list)
                        </span>
                      )}
                    </div>
                    <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                      {minTier} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showExport && (
        <ExportModal
          list={list}
          listUnits={listUnits}
          enhancements={enhancements}
          listEnhancements={listEnhancements}
          totalPoints={totalPoints}
          getUnitPoints={getUnitPoints}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
