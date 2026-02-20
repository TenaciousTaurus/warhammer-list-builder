import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Faction, Unit, UnitPointsTier, Weapon, Ability } from '../types/database';
import { StatLine } from '../components/StatLine';

type UnitWithDetails = Unit & {
  unit_points_tiers: UnitPointsTier[];
  weapons: Weapon[];
  abilities: Ability[];
};

export function UnitsPage() {
  const [factions, setFactions] = useState<Faction[]>([]);
  const [selectedFaction, setSelectedFaction] = useState<string>('');
  const [units, setUnits] = useState<UnitWithDetails[]>([]);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

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

  const filteredUnits = units.filter(u =>
    u.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div className="units-page__header">
        <h2>Unit Browser</h2>
      </div>

      <div className="units-page__filters">
        <div className="form-group" style={{ maxWidth: '300px' }}>
          <label>Faction</label>
          <select
            className="form-select"
            value={selectedFaction}
            onChange={(e) => setSelectedFaction(e.target.value)}
          >
            {factions.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
          <label>Search</label>
          <input
            className="form-input"
            type="text"
            placeholder="Filter units by name..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Loading units...</p>
      ) : filteredUnits.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state__title">No units found</div>
          <p>{filter ? 'No units match your search.' : 'No units available for this faction yet.'}</p>
        </div>
      ) : (
        <div className="units-page__grid">
          {filteredUnits.map((unit) => {
            const isExpanded = expandedUnit === unit.id;
            const coreAbilities = unit.abilities.filter(a => a.type === 'core');
            const factionAbilities = unit.abilities.filter(a => a.type === 'faction');
            const uniqueAbilities = unit.abilities.filter(a => a.type === 'unique');
            const invulnAbilities = unit.abilities.filter(a => a.type === 'invulnerable');

            return (
              <div
                key={unit.id}
                className={`unit-browser-card${isExpanded ? ' unit-browser-card--expanded' : ''}`}
                onClick={() => setExpandedUnit(isExpanded ? null : unit.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: 'var(--text-base)', margin: 0 }}>{unit.name}</h3>
                      <span className={`role-badge role-badge--${unit.role}`}>
                        {unit.role.replace('_', ' ')}
                      </span>
                      {unit.is_unique && (
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-role-epic-hero)', fontStyle: 'italic' }}>
                          Unique
                        </span>
                      )}
                    </div>
                    <StatLine unit={unit} />
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 'var(--space-md)' }}>
                    {unit.unit_points_tiers
                      .sort((a, b) => a.model_count - b.model_count)
                      .map((tier) => (
                        <div key={tier.id} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gold)', fontVariantNumeric: 'tabular-nums' }}>
                          {tier.model_count} model{tier.model_count !== 1 ? 's' : ''}: {tier.points} pts
                        </div>
                      ))}
                  </div>
                </div>

                {/* Ability tags (always visible) */}
                {unit.abilities.length > 0 && (
                  <div style={{ marginTop: 'var(--space-sm)', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {invulnAbilities.map(a => (
                      <span key={a.id} className="ability-tag ability-tag--invuln" title={a.description}>
                        {a.name}
                      </span>
                    ))}
                    {coreAbilities.map(a => (
                      <span key={a.id} className="ability-tag ability-tag--core" title={a.description}>
                        {a.name}
                      </span>
                    ))}
                    {factionAbilities.map(a => (
                      <span key={a.id} className="ability-tag ability-tag--faction" title={a.description}>
                        {a.name}
                      </span>
                    ))}
                    {uniqueAbilities.map(a => (
                      <span key={a.id} className="ability-tag ability-tag--unique" title={a.description}>
                        {a.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expanded: ability descriptions */}
                {isExpanded && unit.abilities.length > 0 && (
                  <div style={{ marginTop: 'var(--space-md)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 'var(--space-md)' }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
                      Abilities
                    </h4>
                    <div style={{ display: 'grid', gap: 'var(--space-xs)' }}>
                      {unit.abilities.map(a => (
                        <div key={a.id} style={{ fontSize: 'var(--text-sm)' }}>
                          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{a.name}</span>
                          <span style={{ color: 'var(--color-text-muted)', marginLeft: 4 }}>
                            ({a.type})
                          </span>
                          <div style={{ color: 'var(--color-text-secondary)', marginLeft: 'var(--space-md)', fontSize: 'var(--text-xs)' }}>
                            {a.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expanded: weapons */}
                {isExpanded && unit.weapons.length > 0 && (
                  <div style={{ marginTop: 'var(--space-md)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 'var(--space-md)' }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
                      Weapons
                    </h4>
                    <table className="weapons-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Range</th>
                          <th>A</th>
                          <th>BS/WS</th>
                          <th>S</th>
                          <th>AP</th>
                          <th>D</th>
                        </tr>
                      </thead>
                      <tbody>
                        {unit.weapons.map((w) => (
                          <tr key={w.id}>
                            <td style={{ fontWeight: 600 }}>
                              {w.name}
                              {w.keywords.length > 0 && (
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginLeft: 4 }}>
                                  [{w.keywords.join(', ')}]
                                </span>
                              )}
                            </td>
                            <td>{w.range || 'Melee'}</td>
                            <td>{w.attacks}</td>
                            <td>{w.skill}</td>
                            <td>{w.strength}</td>
                            <td>{w.ap}</td>
                            <td>{w.damage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {isExpanded && unit.keywords.length > 0 && (
                  <div style={{ marginTop: 'var(--space-sm)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      Keywords: {unit.keywords.join(', ')}
                    </span>
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
