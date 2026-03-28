import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { Faction, Unit, UnitPointsTier, Weapon, Ability } from '../types/database';
import { DatasheetView } from '../components/DatasheetView';
import { ROLE_ORDER, ROLE_LABELS } from '../../features/list-builder/hooks/useListEditor';

type UnitWithDetails = Unit & {
  unit_points_tiers: UnitPointsTier[];
  weapons: Weapon[];
  abilities: Ability[];
};

type SortOption = 'name' | 'points_asc' | 'points_desc' | 'wounds' | 'toughness';

export function UnitsPage() {
  const [factions, setFactions] = useState<Faction[]>([]);
  const [selectedFaction, setSelectedFaction] = useState<string>('');
  const [units, setUnits] = useState<UnitWithDetails[]>([]);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sort, setSort] = useState<SortOption>('name');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [showLegends, setShowLegends] = useState(false);

  useEffect(() => {
    supabase
      .from('factions')
      .select('*')
      .order('name')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setFactions(data);
          setSelectedFaction(data[0].id);
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedFaction) return;
    setLoading(true);
    setExpandedUnit(null);
    supabase
      .from('units')
      .select('*, unit_points_tiers(*), weapons(*), abilities(*)')
      .eq('faction_id', selectedFaction)
      .order('name')
      .then(({ data }) => {
        if (data) setUnits(data as UnitWithDetails[]);
        setLoading(false);
      });
  }, [selectedFaction]);

  // Available roles for this faction
  const availableRoles = useMemo(() => {
    const roles = new Set(units.map(u => u.role));
    return ROLE_ORDER.filter(r => roles.has(r));
  }, [units]);

  // Get base points for sorting
  function getBasePoints(unit: UnitWithDetails): number {
    if (unit.unit_points_tiers.length === 0) return 0;
    const sorted = [...unit.unit_points_tiers].sort((a, b) => a.model_count - b.model_count);
    return sorted[0].points;
  }

  const filteredAndSorted = useMemo(() => {
    let result = units;

    // Legends filter
    if (!showLegends) {
      result = result.filter(u => !u.is_legends);
    }

    // Name filter
    if (filter) {
      const q = filter.toLowerCase();
      result = result.filter(u => u.name.toLowerCase().includes(q));
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter(u => u.role === roleFilter);
    }

    // Keyword filter
    if (keywordFilter) {
      const q = keywordFilter.toLowerCase();
      result = result.filter(u =>
        u.keywords.some(kw => kw.toLowerCase().includes(q)) ||
        u.abilities.some(a => a.name.toLowerCase().includes(q))
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'name': return a.name.localeCompare(b.name);
        case 'points_asc': return getBasePoints(a) - getBasePoints(b);
        case 'points_desc': return getBasePoints(b) - getBasePoints(a);
        case 'wounds': return b.wounds - a.wounds;
        case 'toughness': return b.toughness - a.toughness;
        default: return 0;
      }
    });

    return result;
  }, [units, filter, roleFilter, keywordFilter, sort, showLegends]);

  // Stats summary
  const statsSummary = useMemo(() => {
    return {
      total: units.length,
      filtered: filteredAndSorted.length,
    };
  }, [units, filteredAndSorted]);

  const invulnValue = (unit: UnitWithDetails) => {
    const invuln = unit.abilities.find(a => a.type === 'invulnerable');
    return invuln?.description?.match(/(\d\+)/)?.[1] ?? null;
  };

  return (
    <div>
      <div className="units-page__header">
        <h2>Unit Browser</h2>
        <span className="units-page__count">
          {statsSummary.filtered === statsSummary.total
            ? `${statsSummary.total} units`
            : `${statsSummary.filtered} / ${statsSummary.total} units`}
        </span>
      </div>

      <div className="units-page__filters">
        <div className="form-group" style={{ minWidth: '200px' }}>
          <label>Faction</label>
          <select
            className="form-select"
            value={selectedFaction}
            onChange={(e) => { setSelectedFaction(e.target.value); setRoleFilter('all'); }}
          >
            {factions.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
          <label>Search Name</label>
          <input
            className="form-input"
            type="text"
            placeholder="Unit name..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ minWidth: '130px' }}>
          <label>Keyword / Ability</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Fly, Psyker..."
            value={keywordFilter}
            onChange={(e) => setKeywordFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Role filter chips + Sort */}
      <div className="units-page__controls">
        <div className="units-page__role-chips">
          <button
            className={`units-page__role-chip${roleFilter === 'all' ? ' units-page__role-chip--active' : ''}`}
            onClick={() => setRoleFilter('all')}
          >
            All
          </button>
          {availableRoles.map(role => (
            <button
              key={role}
              className={`units-page__role-chip units-page__role-chip--${role}${roleFilter === role ? ' units-page__role-chip--active' : ''}`}
              onClick={() => setRoleFilter(roleFilter === role ? 'all' : role)}
            >
              {ROLE_LABELS[role]}
            </button>
          ))}
        </div>
        <label className="picker__legends-toggle">
          <input
            type="checkbox"
            checked={showLegends}
            onChange={() => setShowLegends(prev => !prev)}
          />
          <span>Legends</span>
        </label>
        <select
          className="form-select units-page__sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
        >
          <option value="name">Sort: Name A-Z</option>
          <option value="points_asc">Sort: Points Low-High</option>
          <option value="points_desc">Sort: Points High-Low</option>
          <option value="wounds">Sort: Most Wounds</option>
          <option value="toughness">Sort: Most Tough</option>
        </select>
      </div>

      {loading ? (
        <div className="skeleton-list" style={{ padding: 'var(--space-md)' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: '64px', width: '100%' }} />
          ))}
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state__icon">&#128269;</div>
          <div className="empty-state__title">No units found</div>
          <p className="empty-state__description">
            {filter || keywordFilter
              ? 'No units match your current filters. Try adjusting your search or clearing filters.'
              : 'No units available for this faction yet.'}
          </p>
        </div>
      ) : (
        <div className="units-page__list">
          {filteredAndSorted.map((unit) => {
            const isExpanded = expandedUnit === unit.id;
            const inv = invulnValue(unit);
            const basePoints = getBasePoints(unit);

            return (
              <div
                key={unit.id}
                className={`unit-browser-card${isExpanded ? ' unit-browser-card--expanded' : ''}`}
                onClick={() => setExpandedUnit(isExpanded ? null : unit.id)}
              >
                {/* Collapsed view */}
                <div className="unit-browser-card__header">
                  <div className="unit-browser-card__left">
                    <div className="unit-browser-card__title-row">
                      <h3 className="unit-browser-card__name">{unit.name}</h3>
                      <span className={`role-badge role-badge--${unit.role}`}>
                        {unit.role.replace('_', ' ')}
                      </span>
                      {unit.max_per_list === 1 && (
                        <span className="unit-browser-card__unique">Unique</span>
                      )}
                    </div>
                    <div className="unit-browser-card__quick-stats">
                      <span>T{unit.toughness}</span>
                      <span>W{unit.wounds}</span>
                      <span>Sv{unit.save}</span>
                      {inv && <span className="unit-browser-card__invuln">{inv}++</span>}
                    </div>
                  </div>
                  <div className="unit-browser-card__right">
                    <span className="unit-browser-card__points">{basePoints} pts</span>
                    {unit.unit_points_tiers.length > 1 && (
                      <span className="unit-browser-card__tiers">
                        {unit.unit_points_tiers
                          .sort((a, b) => a.model_count - b.model_count)
                          .map(t => `${t.model_count}@${t.points}`)
                          .join(' / ')}
                      </span>
                    )}
                    <span className="unit-browser-card__expand">
                      {isExpanded ? '\u25B2' : '\u25BC'}
                    </span>
                  </div>
                </div>

                {/* Core ability chips (always visible) */}
                {unit.abilities.length > 0 && (
                  <div className="unit-browser-card__abilities">
                    {unit.abilities.filter(a => a.type === 'core').map(a => (
                      <span key={a.id} className="datasheet__core-chip datasheet__core-chip--core">{a.name}</span>
                    ))}
                    {unit.abilities.filter(a => a.type === 'faction').map(a => (
                      <span key={a.id} className="datasheet__core-chip datasheet__core-chip--faction">{a.name}</span>
                    ))}
                  </div>
                )}

                {/* Expanded: full datasheet */}
                {isExpanded && (
                  <div className="unit-browser-card__datasheet" onClick={(e) => e.stopPropagation()}>
                    <DatasheetView unit={unit} weapons={unit.weapons} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
