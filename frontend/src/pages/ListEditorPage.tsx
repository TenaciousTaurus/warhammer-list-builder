import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { ArmyList, Unit, UnitPointsTier, ArmyListUnit, Enhancement, Detachment, Ability, Weapon, ValidateArmyListResult, WargearOption } from '../types/database';
import { RosterItem } from '../components/RosterItem';
import { UnitDetailPanel } from '../components/UnitDetailPanel';
import { PointsBar } from '../components/PointsBar';
import { ExportModal, type ParsedUnit } from '../components/ExportModal';

type UnitWithRelations = Unit & { unit_points_tiers: UnitPointsTier[]; abilities: Ability[]; weapons: Weapon[] };

type ArmyListUnitWithDetails = ArmyListUnit & {
  units: UnitWithRelations;
};

const ROLE_ORDER = [
  'epic_hero', 'character', 'battleline', 'infantry', 'mounted',
  'beast', 'vehicle', 'monster', 'fortification', 'dedicated_transport', 'allied',
] as const;

const ROLE_LABELS: Record<string, string> = {
  epic_hero: 'Epic Hero',
  character: 'Character',
  battleline: 'Battleline',
  infantry: 'Infantry',
  mounted: 'Mounted',
  beast: 'Beast',
  vehicle: 'Vehicle',
  monster: 'Monster',
  fortification: 'Fortification',
  dedicated_transport: 'Dedicated Transport',
  allied: 'Allied',
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
  const [selectedArmyListUnitId, setSelectedArmyListUnitId] = useState<string | null>(null);
  const [collapsedPickerRoles, setCollapsedPickerRoles] = useState<Set<string>>(new Set());

  // ============================================================
  // Data fetching
  // ============================================================

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
      .select('*, units(*, unit_points_tiers(*), abilities(*), weapons(*))')
      .eq('army_list_id', id)
      .order('sort_order');

    if (unitData) setListUnits(unitData as ArmyListUnitWithDetails[]);

    const { data: available } = await supabase
      .from('units')
      .select('*, unit_points_tiers(*), abilities(*), weapons(*)')
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

  // ============================================================
  // Points calculation
  // ============================================================

  function getUnitPoints(unit: Unit & { unit_points_tiers: UnitPointsTier[] }, modelCount: number): number {
    const sorted = [...unit.unit_points_tiers].sort((a, b) => a.model_count - b.model_count);
    let pts = 0;
    for (const tier of sorted) {
      if (modelCount >= tier.model_count) pts = tier.points;
    }
    return pts;
  }

  const enhancementPointsTotal = listEnhancements.reduce((sum, le) => {
    const enh = enhancements.find(e => e.id === le.enhancement_id);
    return sum + (enh?.points ?? 0);
  }, 0);

  const totalPoints = listUnits.reduce((sum, lu) => {
    return sum + getUnitPoints(lu.units, lu.model_count);
  }, 0) + enhancementPointsTotal;

  const overLimit = list ? totalPoints > list.points_limit : false;

  // ============================================================
  // Validation
  // ============================================================

  const unitLimitWarnings = useMemo(() => {
    const unitCounts = new Map<string, { name: string; count: number; maxPerList: number }>();
    for (const lu of listUnits) {
      const existing = unitCounts.get(lu.unit_id);
      if (existing) {
        existing.count += 1;
      } else {
        unitCounts.set(lu.unit_id, { name: lu.units.name, count: 1, maxPerList: lu.units.max_per_list });
      }
    }
    const warnings: string[] = [];
    for (const [, info] of unitCounts) {
      if (info.count > info.maxPerList) {
        warnings.push(`${info.name} exceeds its limit (${info.count}/${info.maxPerList} allowed)`);
      }
    }
    return warnings;
  }, [listUnits]);

  const pointsMismatch = serverValidation !== null && serverValidation.total_points !== totalPoints;

  const unitCountsInList = useMemo(() => {
    const counts = new Map<string, number>();
    for (const lu of listUnits) {
      counts.set(lu.unit_id, (counts.get(lu.unit_id) ?? 0) + 1);
    }
    return counts;
  }, [listUnits]);

  const assignedEnhancementIds = useMemo(() => {
    return new Set(listEnhancements.map(le => le.enhancement_id));
  }, [listEnhancements]);

  const enhancementLimitReached = listEnhancements.length >= 3;

  const enhancementWarnings = useMemo(() => {
    const warnings: string[] = [];
    if (listEnhancements.length > 3) {
      warnings.push(`Too many enhancements: ${listEnhancements.length}/3 allowed`);
    }
    const enhIds = listEnhancements.map(le => le.enhancement_id);
    const dupes = enhIds.filter((eid, i) => enhIds.indexOf(eid) !== i);
    if (dupes.length > 0) {
      const dupeNames = [...new Set(dupes)].map(eid =>
        enhancements.find(e => e.id === eid)?.name ?? 'Unknown'
      );
      warnings.push(`Duplicate enhancements: ${dupeNames.join(', ')}`);
    }
    for (const le of listEnhancements) {
      const lu = listUnits.find(u => u.id === le.army_list_unit_id);
      if (lu && lu.units.role === 'epic_hero') {
        warnings.push(`${lu.units.name} is an Epic Hero and cannot take enhancements`);
      }
    }
    return warnings;
  }, [listEnhancements, listUnits, enhancements]);

  const unitEnhancementMap = useMemo(() => {
    const map = new Map<string, { enhancementId: string; listEnhancementId: string }>();
    for (const le of listEnhancements) {
      map.set(le.army_list_unit_id, { enhancementId: le.enhancement_id, listEnhancementId: le.id });
    }
    return map;
  }, [listEnhancements]);

  // ============================================================
  // Filtering & Role grouping
  // ============================================================

  const filteredUnits = availableUnits.filter(u =>
    u.name.toLowerCase().includes(unitPickerFilter.toLowerCase())
  );

  const unitsByRole = useMemo(() => {
    const groups: Record<string, UnitWithRelations[]> = {};
    for (const unit of filteredUnits) {
      if (!groups[unit.role]) groups[unit.role] = [];
      groups[unit.role].push(unit);
    }
    return groups;
  }, [availableUnits, unitPickerFilter]);

  const rosterByRole = useMemo(() => {
    const groups: Record<string, ArmyListUnitWithDetails[]> = {};
    for (const lu of listUnits) {
      const role = lu.units.role;
      if (!groups[role]) groups[role] = [];
      groups[role].push(lu);
    }
    return groups;
  }, [listUnits]);

  const rosterSectionPoints = useMemo(() => {
    const points: Record<string, number> = {};
    for (const lu of listUnits) {
      const role = lu.units.role;
      const unitPts = getUnitPoints(lu.units, lu.model_count);
      const unitEnh = unitEnhancementMap.get(lu.id);
      const enhPts = unitEnh ? (enhancements.find(e => e.id === unitEnh.enhancementId)?.points ?? 0) : 0;
      points[role] = (points[role] ?? 0) + unitPts + enhPts;
    }
    return points;
  }, [listUnits, unitEnhancementMap, enhancements]);

  // ============================================================
  // Helpers for wargear/enhancement display
  // ============================================================

  function getWargearSummary(armyListUnitId: string, unitId: string): string {
    const selections = unitWargearSelections.get(armyListUnitId);
    if (!selections || selections.size === 0) {
      // Show default wargear
      const unitOpts = wargearOptions.filter(w => w.unit_id === unitId);
      const groups = new Map<string, WargearOption[]>();
      for (const opt of unitOpts) {
        if (!groups.has(opt.group_name)) groups.set(opt.group_name, []);
        groups.get(opt.group_name)!.push(opt);
      }
      const defaults: string[] = [];
      for (const [, opts] of groups) {
        if (opts.length > 1) {
          const def = opts.find(o => o.is_default);
          if (def) defaults.push(def.name);
        }
      }
      return defaults.join(', ');
    }
    const names: string[] = [];
    for (const [, optionId] of selections) {
      const opt = wargearOptions.find(w => w.id === optionId);
      if (opt) names.push(opt.name);
    }
    return names.join(', ');
  }

  function getEnhancementForUnit(armyListUnitId: string): Enhancement | null {
    const unitEnh = unitEnhancementMap.get(armyListUnitId);
    if (!unitEnh) return null;
    return enhancements.find(e => e.id === unitEnh.enhancementId) ?? null;
  }

  // ============================================================
  // Actions
  // ============================================================

  async function addUnit(unit: UnitWithRelations) {
    if (!id) return;
    const currentCount = unitCountsInList.get(unit.id) ?? 0;
    if (currentCount >= unit.max_per_list) return;

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
    if (selectedArmyListUnitId === armyListUnitId) {
      setSelectedArmyListUnitId(null);
    }
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

    setSelectedArmyListUnitId(null);
    fetchList();
    return { success: true, matched: matched.length, unmatched };
  }

  const isSearching = unitPickerFilter.length > 0;

  function togglePickerRole(role: string) {
    setCollapsedPickerRoles(prev => {
      const next = new Set(prev);
      if (next.has(role)) {
        next.delete(role);
      } else {
        next.add(role);
      }
      return next;
    });
  }

  // Selected unit data
  const selectedLu = selectedArmyListUnitId
    ? listUnits.find(lu => lu.id === selectedArmyListUnitId) ?? null
    : null;

  if (loading || !list) {
    return <div className="empty-state"><p>Loading...</p></div>;
  }

  return (
    <div className="list-editor">
      {/* ============================================================ */}
      {/* LEFT PANEL: Unit Picker */}
      {/* ============================================================ */}
      <div className="list-editor__picker">
        <div className="list-editor__picker-header">
          <div className="list-editor__picker-title">{list.name}</div>
          <div className="list-editor__picker-points">{totalPoints} pts</div>
        </div>

        <div className="list-editor__picker-list">
          {isSearching ? (
            // Flat list when searching
            filteredUnits.map((unit) => {
              const minTier = unit.unit_points_tiers.length > 0
                ? Math.min(...unit.unit_points_tiers.map(t => t.points))
                : 0;
              const currentCount = unitCountsInList.get(unit.id) ?? 0;
              const atLimit = currentCount >= unit.max_per_list;
              return (
                <div
                  key={unit.id}
                  className={`unit-picker-item${atLimit ? ' unit-picker-item--disabled' : ''}`}
                  onClick={() => !atLimit && addUnit(unit)}
                >
                  <div className="unit-picker-item__info">
                    <span className="unit-picker-item__points-inline">{minTier}</span>
                    <span className="unit-picker-item__name">{unit.name}</span>
                    <span className="unit-picker-item__count">
                      ({currentCount}/{unit.max_per_list})
                    </span>
                  </div>
                  <button
                    className="unit-picker-item__add"
                    onClick={(e) => { e.stopPropagation(); if (!atLimit) addUnit(unit); }}
                    disabled={atLimit}
                  >+</button>
                </div>
              );
            })
          ) : (
            // Grouped by role
            ROLE_ORDER.map((role) => {
              const roleUnits = unitsByRole[role];
              if (!roleUnits || roleUnits.length === 0) return null;
              const isCollapsed = collapsedPickerRoles.has(role);
              return (
                <div key={role} className="picker-section">
                  <div
                    className={`picker-section__header picker-section__header--${role}`}
                    onClick={() => togglePickerRole(role)}
                  >
                    <span className="picker-section__arrow">{isCollapsed ? '\u25B6' : '\u25BC'}</span>
                    <span className="picker-section__label">{ROLE_LABELS[role]}</span>
                  </div>
                  {!isCollapsed && roleUnits.map((unit) => {
                    const minTier = unit.unit_points_tiers.length > 0
                      ? Math.min(...unit.unit_points_tiers.map(t => t.points))
                      : 0;
                    const currentCount = unitCountsInList.get(unit.id) ?? 0;
                    const atLimit = currentCount >= unit.max_per_list;
                    return (
                      <div
                        key={unit.id}
                        className={`unit-picker-item${atLimit ? ' unit-picker-item--disabled' : ''}`}
                        onClick={() => !atLimit && addUnit(unit)}
                      >
                        <div className="unit-picker-item__info">
                          <span className="unit-picker-item__points-inline">{minTier}</span>
                          <span className="unit-picker-item__name">{unit.name}</span>
                          <span className="unit-picker-item__count">
                            ({currentCount}/{unit.max_per_list})
                          </span>
                        </div>
                        <button
                          className="unit-picker-item__add"
                          onClick={(e) => { e.stopPropagation(); if (!atLimit) addUnit(unit); }}
                          disabled={atLimit}
                        >+</button>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <div className="list-editor__picker-footer">
          <input
            className="form-input list-editor__picker-search"
            type="text"
            placeholder="Search units..."
            value={unitPickerFilter}
            onChange={(e) => setUnitPickerFilter(e.target.value)}
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* CENTER PANEL: Army Roster */}
      {/* ============================================================ */}
      <div className="list-editor__roster">
        {/* Sticky summary */}
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
            {overLimit && (
              <span className="list-editor__points-over"> ({totalPoints - list.points_limit})</span>
            )}
          </div>

          <PointsBar current={totalPoints} limit={list.points_limit} />

          {/* Validation banners */}
          {(overLimit || unitLimitWarnings.length > 0 || enhancementWarnings.length > 0 || pointsMismatch || serverValidationError || (serverValidation && !serverValidation.is_valid && !overLimit)) && (
            <div className="list-editor__validations">
              {overLimit && (
                <div className="validation-banner validation-banner--error">
                  Over limit by {totalPoints - list.points_limit} points!
                </div>
              )}
              {unitLimitWarnings.length > 0 && (
                <div className="validation-banner validation-banner--error">
                  {unitLimitWarnings.map((w, i) => <div key={i}>{w}</div>)}
                </div>
              )}
              {enhancementWarnings.length > 0 && (
                <div className="validation-banner validation-banner--warning">
                  {enhancementWarnings.map((w, i) => <div key={i}>{w}</div>)}
                </div>
              )}
              {pointsMismatch && (
                <div className="validation-banner validation-banner--warning">
                  Points mismatch: client {totalPoints} vs server {serverValidation!.total_points}
                </div>
              )}
              {serverValidationError && (
                <div className="validation-banner validation-banner--warning">
                  Server validation unavailable
                </div>
              )}
              {serverValidation && !serverValidation.is_valid && !overLimit && (
                <div className="validation-banner validation-banner--error">
                  Server: exceeds {serverValidation.points_limit} pts ({serverValidation.total_points} pts)
                </div>
              )}
            </div>
          )}
        </div>

        {/* Roster list grouped by role */}
        <div className="list-editor__roster-list">
          {listUnits.length > 0 ? (
            ROLE_ORDER.map((role) => {
              const roleUnits = rosterByRole[role];
              if (!roleUnits || roleUnits.length === 0) return null;
              return (
                <div key={role} className="roster-section">
                  <div className={`roster-section__header roster-section__header--${role}`}>
                    <span>{ROLE_LABELS[role]}</span>
                    <span className="roster-section__points">{rosterSectionPoints[role] ?? 0} pts</span>
                  </div>
                  {roleUnits.map((lu) => {
                    const unitPts = getUnitPoints(lu.units, lu.model_count);
                    const enh = getEnhancementForUnit(lu.id);
                    const wargearSummary = getWargearSummary(lu.id, lu.unit_id);
                    return (
                      <RosterItem
                        key={lu.id}
                        unitName={lu.units.name}
                        modelCount={lu.model_count}
                        points={unitPts}
                        enhancementName={enh?.name}
                        enhancementPoints={enh?.points}
                        wargearSummary={wargearSummary}
                        isSelected={lu.id === selectedArmyListUnitId}
                        onClick={() => setSelectedArmyListUnitId(lu.id)}
                        onRemove={() => removeUnit(lu.id)}
                      />
                    );
                  })}
                </div>
              );
            })
          ) : (
            <div className="empty-state card" style={{ margin: 'var(--space-md)' }}>
              <div className="empty-state__icon">&#9876;</div>
              <div className="empty-state__title">No Units Added</div>
              <p>Select units from the left panel to build your army.</p>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT PANEL: Unit Detail */}
      {/* ============================================================ */}
      <div className="list-editor__detail">
        {selectedLu ? (() => {
          const isCharacter = selectedLu.units.role === 'character';
          const unitEnh = unitEnhancementMap.get(selectedLu.id);
          const unitOpts = wargearOptions.filter(w => w.unit_id === selectedLu.unit_id);

          return (
            <UnitDetailPanel
              unit={selectedLu.units}
              weapons={selectedLu.units.weapons ?? []}
              modelCount={selectedLu.model_count}
              points={getUnitPoints(selectedLu.units, selectedLu.model_count)}
              availableTiers={selectedLu.units.unit_points_tiers}
              onModelCountChange={(count) => updateModelCount(selectedLu.id, count)}
              onRemove={() => removeUnit(selectedLu.id)}
              onClose={() => setSelectedArmyListUnitId(null)}
              enhancement={isCharacter ? {
                assigned: unitEnh ? enhancements.find(e => e.id === unitEnh.enhancementId) ?? null : null,
                available: enhancements.filter(e => !assignedEnhancementIds.has(e.id) || e.id === unitEnh?.enhancementId),
                onAssign: (enhId) => assignEnhancement(selectedLu.id, enhId),
                limitReached: enhancementLimitReached && !unitEnh,
              } : undefined}
              wargear={unitOpts.length > 0 ? {
                options: unitOpts,
                selected: unitWargearSelections.get(selectedLu.id) ?? new Map(),
                onSelect: (groupName: string, optionId: string) => selectWargear(selectedLu.id, groupName, optionId),
              } : undefined}
            />
          );
        })() : (
          <div className="detail-panel detail-panel--empty">
            <div className="detail-panel__empty-icon">&#9881;</div>
            <div className="detail-panel__empty-text">
              Select a unit from the roster to view its details
            </div>
          </div>
        )}
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
