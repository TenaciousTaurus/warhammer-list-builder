import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { ArmyList, Unit, UnitPointsTier, ArmyListUnit, Enhancement, Detachment, Ability, ValidateArmyListResult, WargearOption } from '../types/database';
import { UnitCard } from '../components/UnitCard';
import { PointsBar } from '../components/PointsBar';
import { ExportModal, type ParsedUnit } from '../components/ExportModal';

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
  const [showExport, setShowExport] = useState(false);
  const [unitPickerFilter, setUnitPickerFilter] = useState('');
  const [serverValidation, setServerValidation] = useState<ValidateArmyListResult | null>(null);
  const [serverValidationError, setServerValidationError] = useState(false);
  const [wargearOptions, setWargearOptions] = useState<WargearOption[]>([]);
  const [unitWargearSelections, setUnitWargearSelections] = useState<Map<string, Map<string, string>>>(new Map());

  async function fetchServerValidation() {
    if (!id) return;
    const { data, error } = await supabase.rpc('validate_army_list', { list_id: id });
    if (error) {
      setServerValidationError(true);
      console.error('Server validation failed:', error);
    } else {
      setServerValidation(data as unknown as ValidateArmyListResult);
      setServerValidationError(false);
    }
  }

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

    const { data: enhData } = await supabase
      .from('enhancements')
      .select('*')
      .eq('detachment_id', listData.detachment_id)
      .order('points');

    if (enhData) setEnhancements(enhData);

    const { data: listEnhData } = await supabase
      .from('army_list_enhancements')
      .select('*')
      .eq('army_list_id', id);

    if (listEnhData) setListEnhancements(listEnhData);

    const { data: wargearData } = await supabase
      .from('wargear_options')
      .select('*')
      .in('unit_id', (available || []).map(u => u.id))
      .order('group_name')
      .order('is_default', { ascending: false });

    if (wargearData) setWargearOptions(wargearData);

    if (unitData && unitData.length > 0) {
      const { data: wargearSelData } = await supabase
        .from('army_list_unit_wargear')
        .select('*')
        .in('army_list_unit_id', unitData.map(u => u.id));

      if (wargearSelData) {
        const selMap = new Map<string, Map<string, string>>();
        for (const sel of wargearSelData) {
          const opt = wargearData?.find(w => w.id === sel.wargear_option_id);
          if (!opt) continue;
          if (!selMap.has(sel.army_list_unit_id)) selMap.set(sel.army_list_unit_id, new Map());
          selMap.get(sel.army_list_unit_id)!.set(opt.group_name, sel.wargear_option_id);
        }
        setUnitWargearSelections(selMap);
      }
    }

    setLoading(false);
    fetchServerValidation();
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

  const pointsMismatch = serverValidation !== null && serverValidation.total_points !== totalPoints;

  const uniqueUnitIdsInList = useMemo(() => {
    const ids = new Set<string>();
    for (const lu of listUnits) {
      if (lu.units.is_unique) ids.add(lu.unit_id);
    }
    return ids;
  }, [listUnits]);

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

  async function selectWargear(armyListUnitId: string, groupName: string, optionId: string) {
    const existing = unitWargearSelections.get(armyListUnitId);
    if (existing) {
      const currentOptionId = existing.get(groupName);
      if (currentOptionId) {
        await supabase.from('army_list_unit_wargear').delete()
          .eq('army_list_unit_id', armyListUnitId)
          .eq('wargear_option_id', currentOptionId);
      }
    }
    if (optionId) {
      await supabase.from('army_list_unit_wargear').insert({
        army_list_unit_id: armyListUnitId,
        wargear_option_id: optionId,
      });
    }
    setUnitWargearSelections(prev => {
      const next = new Map(prev);
      if (!next.has(armyListUnitId)) next.set(armyListUnitId, new Map());
      next.get(armyListUnitId)!.set(groupName, optionId);
      return next;
    });
  }

  async function handleImport(parsed: ParsedUnit[]): Promise<{ success: boolean; matched: number; unmatched: string[] }> {
    if (!id) return { success: false, matched: 0, unmatched: [] };

    const matched: { unit: UnitWithRelations; modelCount: number; enhancementName: string | null }[] = [];
    const unmatched: string[] = [];

    for (const p of parsed) {
      const unit = availableUnits.find(u => u.name.toLowerCase() === p.name.toLowerCase());
      if (unit) {
        matched.push({ unit, modelCount: p.modelCount, enhancementName: p.enhancementName });
      } else {
        unmatched.push(p.name);
      }
    }

    if (matched.length === 0) {
      return { success: false, matched: 0, unmatched: unmatched };
    }

    await supabase.from('army_list_enhancements').delete().eq('army_list_id', id);
    await supabase.from('army_list_units').delete().eq('army_list_id', id);

    for (let i = 0; i < matched.length; i++) {
      const m = matched[i];
      const { data: inserted } = await supabase.from('army_list_units').insert({
        army_list_id: id,
        unit_id: m.unit.id,
        model_count: m.modelCount,
        sort_order: i,
      }).select().single();

      if (inserted && m.enhancementName) {
        const enh = enhancements.find(e => e.name.toLowerCase() === m.enhancementName!.toLowerCase());
        if (enh) {
          await supabase.from('army_list_enhancements').insert({
            army_list_id: id,
            enhancement_id: enh.id,
            army_list_unit_id: inserted.id,
          });
        }
      }
    }

    fetchList();
    return { success: true, matched: matched.length, unmatched };
  }

  const filteredUnits = availableUnits.filter(u =>
    u.name.toLowerCase().includes(unitPickerFilter.toLowerCase())
  );

  if (loading || !list) {
    return <div className="empty-state"><p>Loading...</p></div>;
  }

  return (
    <div className="list-editor">
      {/* Main area: summary + unit cards */}
      <div className="list-editor__main">
        {/* Sticky summary panel */}
        <div className="list-editor__summary">
          <div className="list-editor__summary-header">
            <div>
              <h2 className="list-editor__army-name">{list.name}</h2>
              <span className="list-editor__detachment">{list.detachments?.name}</span>
            </div>
            <div className="list-editor__summary-actions">
              <button className="btn" onClick={() => navigate('/')}>
                &larr; Back
              </button>
              <button className="btn" onClick={() => setShowExport(true)}>
                Export
              </button>
            </div>
          </div>

          <div className={`list-editor__points-display${overLimit ? ' list-editor__points-display--over' : ''}`}>
            {totalPoints}
            <span className="list-editor__points-limit"> / {list.points_limit} pts</span>
          </div>

          <PointsBar current={totalPoints} limit={list.points_limit} />

          {/* Validation banners */}
          {(overLimit || duplicateUniqueWarnings.length > 0 || pointsMismatch || serverValidationError || (serverValidation && !serverValidation.is_valid && !overLimit)) && (
            <div className="list-editor__validations">
              {overLimit && (
                <div className="validation-banner validation-banner--error">
                  Over limit by {totalPoints - list.points_limit} points! Remove units or reduce model counts.
                </div>
              )}

              {duplicateUniqueWarnings.length > 0 && (
                <div className="validation-banner validation-banner--error">
                  {duplicateUniqueWarnings.map((w, i) => <div key={i}>{w}</div>)}
                </div>
              )}

              {pointsMismatch && (
                <div className="validation-banner validation-banner--warning">
                  Points mismatch: client shows {totalPoints} pts but server calculated {serverValidation!.total_points} pts. Try refreshing.
                </div>
              )}

              {serverValidationError && (
                <div className="validation-banner validation-banner--warning">
                  Server-side validation unavailable. Points shown are calculated locally.
                </div>
              )}

              {serverValidation && !serverValidation.is_valid && !overLimit && (
                <div className="validation-banner validation-banner--error">
                  Server validation: list exceeds {serverValidation.points_limit} point limit (server total: {serverValidation.total_points} pts).
                </div>
              )}
            </div>
          )}
        </div>

        {/* Unit cards */}
        {listUnits.length > 0 ? (
          <div className="list-editor__units-grid">
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
                  wargear={(() => {
                    const unitOpts = wargearOptions.filter(w => w.unit_id === lu.unit_id);
                    if (unitOpts.length === 0) return undefined;
                    return {
                      options: unitOpts,
                      selected: unitWargearSelections.get(lu.id) ?? new Map(),
                      onSelect: (groupName: string, optionId: string) => selectWargear(lu.id, groupName, optionId),
                    };
                  })()}
                />
              );
            })}
          </div>
        ) : (
          <div className="empty-state card">
            <div className="empty-state__icon">&#9876;</div>
            <div className="empty-state__title">No Units Added</div>
            <p>Select units from the sidebar to build your army.</p>
          </div>
        )}
      </div>

      {/* Sidebar: unit picker (always visible) */}
      <div className="list-editor__sidebar">
        <div className="list-editor__sidebar-header">
          <div className="list-editor__sidebar-title">Add Units</div>
          <input
            className="form-input list-editor__sidebar-search"
            type="text"
            placeholder="Search units..."
            value={unitPickerFilter}
            onChange={(e) => setUnitPickerFilter(e.target.value)}
          />
        </div>
        <div className="list-editor__sidebar-list">
          {filteredUnits.map((unit) => {
            const minTier = unit.unit_points_tiers.length > 0
              ? Math.min(...unit.unit_points_tiers.map(t => t.points))
              : 0;
            const isUniqueAlreadyAdded = unit.is_unique && uniqueUnitIdsInList.has(unit.id);
            return (
              <div
                key={unit.id}
                className={`unit-picker-item${isUniqueAlreadyAdded ? ' unit-picker-item--disabled' : ''}`}
                onClick={() => !isUniqueAlreadyAdded && addUnit(unit)}
              >
                <div className="unit-picker-item__info">
                  <span className="unit-picker-item__name">{unit.name}</span>
                  <span className={`role-badge role-badge--${unit.role}`}>
                    {unit.role.replace('_', ' ')}
                  </span>
                </div>
                <span className="unit-picker-item__points">{minTier} pts</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export modal */}
      {showExport && (
        <ExportModal
          list={list}
          listUnits={listUnits}
          enhancements={enhancements}
          listEnhancements={listEnhancements}
          totalPoints={totalPoints}
          getUnitPoints={getUnitPoints}
          onClose={() => setShowExport(false)}
          onImport={handleImport}
        />
      )}
    </div>
  );
}
