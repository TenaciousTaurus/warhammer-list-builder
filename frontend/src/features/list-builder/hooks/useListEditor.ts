import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../shared/lib/supabase';
import type { ArmyList, Unit, UnitPointsTier, ArmyListUnit, Enhancement, Detachment, Ability, Weapon, ValidateArmyListResult, WargearOption, ModelVariant, ArmyListUnitComposition, LeaderTarget, LeaderAttachment } from '../../../shared/types/database';
import type { ParsedUnit } from '../components/ExportModal';

export type UnitWithRelations = Unit & { unit_points_tiers: UnitPointsTier[]; abilities: Ability[]; weapons: Weapon[] };

export type ArmyListUnitWithDetails = ArmyListUnit & {
  units: UnitWithRelations;
};

export const ROLE_ORDER = [
  'epic_hero', 'character', 'battleline', 'infantry', 'mounted',
  'beast', 'vehicle', 'monster', 'fortification', 'dedicated_transport', 'allied',
] as const;

export const ROLE_LABELS: Record<string, string> = {
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

export function getUnitPoints(unit: Unit & { unit_points_tiers: UnitPointsTier[] }, modelCount: number): number {
  const sorted = [...unit.unit_points_tiers].sort((a, b) => a.model_count - b.model_count);
  let pts = 0;
  for (const tier of sorted) {
    if (modelCount >= tier.model_count) pts = tier.points;
  }
  return pts;
}

export function useListEditor(id: string | undefined) {
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
  const [showLegends, setShowLegends] = useState(false);
  const [modelVariants, setModelVariants] = useState<ModelVariant[]>([]);
  const [unitCompositions, setUnitCompositions] = useState<Map<string, Map<string, number>>>(new Map()); // armyListUnitId -> (variantId -> count)
  const [leaderTargets, setLeaderTargets] = useState<LeaderTarget[]>([]);
  const [leaderAttachments, setLeaderAttachments] = useState<LeaderAttachment[]>([]);

  // ============================================================
  // Data fetching
  // ============================================================

  const fetchServerValidation = useCallback(async () => {
    if (!id) return;
    const { data, error } = await supabase.rpc('validate_army_list', { list_id: id });
    if (error) {
      setServerValidationError(true);
      console.error('Server validation failed:', error);
    } else {
      setServerValidation(data as unknown as ValidateArmyListResult);
      setServerValidationError(false);
    }
  }, [id]);

  const fetchList = useCallback(async () => {
    if (!id) return;
    const { data: listData } = await supabase
      .from('army_lists')
      .select('*, detachments(*)')
      .eq('id', id)
      .single();

    if (!listData) {
      navigate('/lists');
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

    // Fetch model variants for all available units
    const { data: variantData } = await supabase
      .from('unit_model_variants')
      .select('*')
      .in('unit_id', (available || []).map(u => u.id))
      .order('sort_order');

    if (variantData) setModelVariants(variantData as ModelVariant[]);

    // Fetch leader targets for all available units
    const unitIds = (available || []).map(u => u.id);
    const { data: leaderTargetData } = await supabase
      .from('unit_leader_targets')
      .select('*')
      .or(`leader_unit_id.in.(${unitIds.join(',')}),target_unit_id.in.(${unitIds.join(',')})`);

    if (leaderTargetData) setLeaderTargets(leaderTargetData as LeaderTarget[]);

    // Fetch leader attachments for this list
    const { data: attachmentData } = await supabase
      .from('army_list_leader_attachments')
      .select('*')
      .eq('army_list_id', id);

    if (attachmentData) setLeaderAttachments(attachmentData as LeaderAttachment[]);

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

      // Fetch composition data
      const { data: compData } = await supabase
        .from('army_list_unit_composition')
        .select('*')
        .in('army_list_unit_id', unitData.map(u => u.id));

      if (compData) {
        const compMap = new Map<string, Map<string, number>>();
        for (const comp of compData as ArmyListUnitComposition[]) {
          if (!compMap.has(comp.army_list_unit_id)) compMap.set(comp.army_list_unit_id, new Map());
          compMap.get(comp.army_list_unit_id)!.set(comp.model_variant_id, comp.count);
        }
        setUnitCompositions(compMap);
      }
    }

    setLoading(false);
    fetchServerValidation();
  }, [id, navigate, fetchServerValidation]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // ============================================================
  // Points calculation
  // ============================================================

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

  // Battle size warnings
  const battleSizeWarnings = useMemo(() => {
    if (!list?.battle_size) return [];
    const warnings: string[] = [];
    const BATTLE_SIZES: Record<string, { name: string; max: number }> = {
      combat_patrol: { name: 'Combat Patrol', max: 500 },
      incursion: { name: 'Incursion', max: 1000 },
      strike_force: { name: 'Strike Force', max: 2000 },
      onslaught: { name: 'Onslaught', max: 3000 },
    };
    const bs = BATTLE_SIZES[list.battle_size];
    if (bs && list.points_limit !== bs.max) {
      warnings.push(`Points limit (${list.points_limit}) doesn't match ${bs.name} (${bs.max} pts)`);
    }
    return warnings;
  }, [list]);

  // Transport warnings (informational)
  const transportWarnings = useMemo(() => {
    const warnings: string[] = [];
    const transports = listUnits.filter(lu => lu.units.transport_capacity != null);
    for (const transport of transports) {
      const cap = transport.units.transport_capacity!;
      const allowed = transport.units.transport_keywords_allowed ?? [];
      const excluded = transport.units.transport_keywords_excluded ?? [];

      // Check which non-transport units could embark
      const eligible = listUnits.filter(lu => {
        if (lu.id === transport.id) return false;
        if (lu.units.role === 'dedicated_transport') return false;
        const kw = lu.units.keywords ?? [];
        const hasAll = allowed.every(a => kw.includes(a));
        const hasExcluded = excluded.some(e => kw.includes(e));
        return hasAll && !hasExcluded;
      });

      const totalModels = eligible.reduce((sum, lu) => sum + lu.model_count, 0);
      if (totalModels > cap) {
        warnings.push(
          `${transport.units.name} can carry ${cap} models — ${totalModels} eligible models in your list`
        );
      }
    }
    return warnings;
  }, [listUnits]);

  // ============================================================
  // Filtering & Role grouping
  // ============================================================

  const filteredUnits = availableUnits.filter(u => {
    if (!showLegends && u.is_legends) return false;
    return u.name.toLowerCase().includes(unitPickerFilter.toLowerCase());
  });

  const unitsByRole = useMemo(() => {
    const groups: Record<string, UnitWithRelations[]> = {};
    for (const unit of filteredUnits) {
      if (!groups[unit.role]) groups[unit.role] = [];
      groups[unit.role].push(unit);
    }
    return groups;
  }, [filteredUnits]);

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
  // Helpers
  // ============================================================

  function getWargearSummary(armyListUnitId: string, unitId: string): string {
    const selections = unitWargearSelections.get(armyListUnitId);
    if (!selections || selections.size === 0) {
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

  async function updateListName(name: string) {
    if (!id) return;
    await supabase.from('army_lists').update({ name }).eq('id', id);
    setList(prev => prev ? { ...prev, name } : prev);
  }

  async function updatePointsLimit(limit: number) {
    if (!id) return;
    await supabase.from('army_lists').update({ points_limit: limit }).eq('id', id);
    setList(prev => prev ? { ...prev, points_limit: limit } : prev);
    fetchServerValidation();
  }

  async function updateBattleSize(battleSize: string, points: number) {
    if (!id) return;
    await supabase.from('army_lists').update({ battle_size: battleSize, points_limit: points }).eq('id', id);
    setList(prev => prev ? { ...prev, battle_size: battleSize, points_limit: points } : prev);
    fetchServerValidation();
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

  async function updateComposition(armyListUnitId: string, variantId: string, count: number) {
    // Optimistic update
    setUnitCompositions(prev => {
      const next = new Map(prev);
      if (!next.has(armyListUnitId)) next.set(armyListUnitId, new Map());
      next.get(armyListUnitId)!.set(variantId, count);
      return next;
    });

    // Upsert to DB
    if (count > 0) {
      await supabase
        .from('army_list_unit_composition')
        .upsert({
          army_list_unit_id: armyListUnitId,
          model_variant_id: variantId,
          count,
        }, { onConflict: 'army_list_unit_id,model_variant_id' });
    } else {
      await supabase
        .from('army_list_unit_composition')
        .delete()
        .eq('army_list_unit_id', armyListUnitId)
        .eq('model_variant_id', variantId);
    }

    // Recalculate total model count from composition
    const comp = unitCompositions.get(armyListUnitId) ?? new Map();
    comp.set(variantId, count);
    const variants = modelVariants.filter(v => comp.has(v.id) || v.unit_id === modelVariants.find(mv => mv.id === variantId)?.unit_id);
    let totalModels = 0;
    for (const v of variants) {
      if (v.is_leader) {
        totalModels += v.min_count;
      } else {
        totalModels += comp.get(v.id) ?? 0;
      }
    }
    if (totalModels > 0) {
      await supabase.from('army_list_units').update({ model_count: totalModels }).eq('id', armyListUnitId);
      // Update local state
      setListUnits(prev => prev.map(lu =>
        lu.id === armyListUnitId ? { ...lu, model_count: totalModels } : lu
      ));
    }
  }

  function getModelVariantsForUnit(unitId: string): ModelVariant[] {
    return modelVariants.filter(v => v.unit_id === unitId);
  }

  function getCompositionForUnit(armyListUnitId: string): Map<string, number> {
    return unitCompositions.get(armyListUnitId) ?? new Map();
  }

  function getCompositionSummary(armyListUnitId: string, unitId: string): string {
    const variants = getModelVariantsForUnit(unitId);
    if (variants.length === 0) return '';
    const comp = getCompositionForUnit(armyListUnitId);
    const parts: string[] = [];
    for (const v of variants) {
      const count = v.is_leader ? v.min_count : (comp.get(v.id) ?? 0);
      if (count > 0) {
        parts.push(`${count}x ${v.name}`);
      }
    }
    return parts.join(', ');
  }

  async function attachLeader(leaderArmyListUnitId: string, targetArmyListUnitId: string) {
    if (!id) return;
    // Remove existing attachment for this leader
    await supabase.from('army_list_leader_attachments')
      .delete()
      .eq('leader_army_list_unit_id', leaderArmyListUnitId);
    // Create new attachment
    await supabase.from('army_list_leader_attachments').insert({
      army_list_id: id,
      leader_army_list_unit_id: leaderArmyListUnitId,
      target_army_list_unit_id: targetArmyListUnitId,
    });
    fetchList();
  }

  async function detachLeader(leaderArmyListUnitId: string) {
    await supabase.from('army_list_leader_attachments')
      .delete()
      .eq('leader_army_list_unit_id', leaderArmyListUnitId);
    fetchList();
  }

  function getEligibleLeaders(unitId: string): string[] {
    // Find all leader unit IDs that can lead this unit
    return leaderTargets
      .filter(lt => lt.target_unit_id === unitId)
      .map(lt => lt.leader_unit_id);
  }

  function getAttachmentForTarget(targetArmyListUnitId: string): LeaderAttachment | undefined {
    return leaderAttachments.find(la => la.target_army_list_unit_id === targetArmyListUnitId);
  }

  function isLeaderAttachedElsewhere(leaderArmyListUnitId: string, targetArmyListUnitId: string): boolean {
    return leaderAttachments.some(
      la => la.leader_army_list_unit_id === leaderArmyListUnitId
        && la.target_army_list_unit_id !== targetArmyListUnitId
    );
  }

  async function reorderUnits(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    const reordered = [...listUnits];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    // Optimistic update
    setListUnits(reordered);

    // Persist new sort_order values
    const updates = reordered.map((lu, i) => ({
      id: lu.id,
      sort_order: i,
    }));

    for (const u of updates) {
      await supabase.from('army_list_units').update({ sort_order: u.sort_order }).eq('id', u.id);
    }
  }

  function togglePickerRole(role: string) {
    setCollapsedPickerRoles(prev => {
      const next = new Set(prev);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return next;
    });
  }

  // Selected unit data
  const selectedLu = selectedArmyListUnitId
    ? listUnits.find(lu => lu.id === selectedArmyListUnitId) ?? null
    : null;

  return {
    // State
    list,
    listUnits,
    availableUnits,
    enhancements,
    listEnhancements,
    loading,
    showExport,
    setShowExport,
    unitPickerFilter,
    setUnitPickerFilter,
    serverValidation,
    serverValidationError,
    wargearOptions,
    unitWargearSelections,
    selectedArmyListUnitId,
    setSelectedArmyListUnitId,
    collapsedPickerRoles,
    showLegends,
    selectedLu,

    // Computed
    totalPoints,
    overLimit,
    unitLimitWarnings,
    enhancementWarnings,
    battleSizeWarnings,
    transportWarnings,
    pointsMismatch,
    unitCountsInList,
    assignedEnhancementIds,
    enhancementLimitReached,
    unitEnhancementMap,
    filteredUnits,
    unitsByRole,
    rosterByRole,
    rosterSectionPoints,

    // Actions
    addUnit,
    removeUnit,
    updateListName,
    updatePointsLimit,
    updateBattleSize,
    updateModelCount,
    assignEnhancement,
    selectWargear,
    handleImport,
    reorderUnits,
    togglePickerRole,
    toggleLegends: () => setShowLegends(prev => !prev),

    // Helpers
    getWargearSummary,
    getEnhancementForUnit,

    // Model variants
    modelVariants,
    unitCompositions,
    updateComposition,
    getModelVariantsForUnit,
    getCompositionForUnit,
    getCompositionSummary,

    // Leader attachment
    leaderTargets,
    leaderAttachments,
    attachLeader,
    detachLeader,
    getEligibleLeaders,
    getAttachmentForTarget,
    isLeaderAttachedElsewhere,
  };
}
