import type { Unit, UnitPointsTier, Ability, Enhancement, Weapon, WargearOption } from '../types/database';
import { StatLine } from './StatLine';

interface UnitDetailPanelProps {
  unit: Unit & { abilities: Ability[] };
  weapons: Weapon[];
  modelCount: number;
  points: number;
  availableTiers: UnitPointsTier[];
  onModelCountChange: (count: number) => void;
  onRemove: () => void;
  onClose: () => void;
  enhancement?: {
    assigned: Enhancement | null;
    available: Enhancement[];
    onAssign: (enhancementId: string) => void;
    limitReached?: boolean;
  };
  wargear?: {
    options: WargearOption[];
    selected: Map<string, string>;
    onSelect: (groupName: string, optionId: string) => void;
  };
}

export function UnitDetailPanel({
  unit, weapons, modelCount, points, availableTiers,
  onModelCountChange, onRemove, onClose,
  enhancement, wargear,
}: UnitDetailPanelProps) {
  const sortedTiers = [...availableTiers].sort((a, b) => a.model_count - b.model_count);
  const enhancementPoints = enhancement?.assigned?.points ?? 0;
  const totalPoints = points + enhancementPoints;

  const groupedAbilities = {
    core: unit.abilities.filter(a => a.type === 'core'),
    faction: unit.abilities.filter(a => a.type === 'faction'),
    unique: unit.abilities.filter(a => a.type === 'unique'),
    invulnerable: unit.abilities.filter(a => a.type === 'invulnerable'),
  };

  const hasAbilities = groupedAbilities.core.length > 0
    || groupedAbilities.faction.length > 0
    || groupedAbilities.unique.length > 0
    || groupedAbilities.invulnerable.length > 0;

  // Weapon groups
  const rangedWeapons = weapons.filter(w => w.type === 'ranged');
  const meleeWeapons = weapons.filter(w => w.type === 'melee');

  // Wargear groups
  const wargearGroups = (() => {
    if (!wargear || wargear.options.length === 0) return [];
    const groups = new Map<string, WargearOption[]>();
    for (const opt of wargear.options) {
      if (!groups.has(opt.group_name)) groups.set(opt.group_name, []);
      groups.get(opt.group_name)!.push(opt);
    }
    return [...groups.entries()].filter(([, opts]) => opts.length > 1);
  })();

  // Render a single ability with full description
  function renderAbility(ability: Ability) {
    return (
      <div key={ability.id} className="detail-panel__ability-item">
        <div className="detail-panel__ability-header">
          <span className={`ability-tag ability-tag--${ability.type === 'invulnerable' ? 'invuln' : ability.type}`}>
            {ability.type === 'invulnerable' ? 'Invuln' : ability.type}
          </span>
          <span className="detail-panel__ability-name">{ability.name}</span>
        </div>
        {ability.description && (
          <div className="detail-panel__ability-desc">{ability.description}</div>
        )}
      </div>
    );
  }

  // Render a weapon table
  function renderWeaponTable(weaponList: Weapon[], label: string) {
    if (weaponList.length === 0) return null;
    return (
      <div className="detail-panel__weapons-group">
        <div className="detail-panel__weapons-group-label">{label}</div>
        <table className="weapons-table weapons-table--compact">
          <thead>
            <tr>
              <th>Weapon</th>
              {label === 'Ranged' && <th>Range</th>}
              <th>A</th>
              <th>{label === 'Ranged' ? 'BS' : 'WS'}</th>
              <th>S</th>
              <th>AP</th>
              <th>D</th>
            </tr>
          </thead>
          <tbody>
            {weaponList.map(w => (
              <tr key={w.id}>
                <td>
                  <span className="detail-panel__weapon-name">{w.name}</span>
                  {w.keywords.length > 0 && (
                    <div className="detail-panel__weapon-keywords">
                      {w.keywords.join(', ')}
                    </div>
                  )}
                </td>
                {label === 'Ranged' && <td>{w.range ?? '-'}</td>}
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
    );
  }

  return (
    <div className="detail-panel">
      {/* Header */}
      <div className="detail-panel__header">
        <div>
          <h3 className="detail-panel__name">{unit.name}</h3>
          <div className="detail-panel__meta">
            <span className={`role-badge role-badge--${unit.role}`}>
              {unit.role.replace('_', ' ')}
            </span>
            {unit.max_per_list === 1 && (
              <span className="unit-card__unique-tag">Unique</span>
            )}
          </div>
        </div>
        <div className="detail-panel__header-right">
          <span className="detail-panel__points">{totalPoints} pts</span>
          <button className="detail-panel__close" onClick={onClose} title="Close">
            &times;
          </button>
        </div>
      </div>

      {/* Stat Line */}
      <div className="detail-panel__section">
        <StatLine unit={unit} />
      </div>

      {/* Abilities — full descriptions */}
      {hasAbilities && (
        <div className="detail-panel__section">
          <div className="detail-panel__section-label">Abilities</div>
          <div className="detail-panel__ability-list">
            {groupedAbilities.invulnerable.map(renderAbility)}
            {groupedAbilities.core.map(renderAbility)}
            {groupedAbilities.faction.map(renderAbility)}
            {groupedAbilities.unique.map(renderAbility)}
          </div>
        </div>
      )}

      {/* Weapons */}
      {(rangedWeapons.length > 0 || meleeWeapons.length > 0) && (
        <div className="detail-panel__section">
          <div className="detail-panel__section-label">Weapons</div>
          {renderWeaponTable(rangedWeapons, 'Ranged')}
          {renderWeaponTable(meleeWeapons, 'Melee')}
        </div>
      )}

      {/* Keywords */}
      {unit.keywords.length > 0 && (
        <div className="detail-panel__section">
          <div className="detail-panel__section-label">Keywords</div>
          <div className="detail-panel__keywords">
            {unit.keywords.map((kw, i) => (
              <span key={i} className="detail-panel__keyword">{kw}</span>
            ))}
          </div>
        </div>
      )}

      {/* Model Count Selector */}
      {sortedTiers.length > 1 && (
        <div className="detail-panel__section">
          <div className="detail-panel__section-label">Models</div>
          <select
            className="form-select"
            value={modelCount}
            onChange={(e) => onModelCountChange(Number(e.target.value))}
            style={{ width: '100%' }}
          >
            {sortedTiers.map((tier) => (
              <option key={tier.id} value={tier.model_count}>
                {tier.model_count} models ({tier.points} pts)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Wargear Options */}
      {wargearGroups.length > 0 && wargear && (
        <div className="detail-panel__section">
          <div className="detail-panel__section-label">Wargear</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {wargearGroups.map(([groupName, opts]) => (
              <div key={groupName}>
                <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '2px', display: 'block' }}>
                  {groupName}
                </label>
                <select
                  className="form-select"
                  value={wargear.selected.get(groupName) ?? opts.find(o => o.is_default)?.id ?? ''}
                  onChange={(e) => wargear.onSelect(groupName, e.target.value)}
                  style={{ width: '100%' }}
                >
                  {opts.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}{opt.points > 0 ? ` (+${opt.points} pts)` : ''}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhancement */}
      {enhancement && (
        <div className="detail-panel__section">
          <div className="detail-panel__section-label">Enhancement</div>
          <select
            className="form-select"
            value={enhancement.assigned?.id ?? ''}
            onChange={(e) => enhancement.onAssign(e.target.value)}
            disabled={enhancement.limitReached}
            style={{ width: '100%' }}
          >
            <option value="">{enhancement.limitReached ? 'Max 3 enhancements reached' : 'None'}</option>
            {enhancement.available.map(e => (
              <option key={e.id} value={e.id}>{e.name} (+{e.points} pts)</option>
            ))}
          </select>
          {enhancement.assigned && (
            <div className="detail-panel__enhancement-detail">
              <div className="detail-panel__enhancement-name">
                <span>{enhancement.assigned.name}</span>
                <span>+{enhancement.assigned.points} pts</span>
              </div>
              <div className="detail-panel__enhancement-desc">
                {enhancement.assigned.description}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Remove Button */}
      <div className="detail-panel__section" style={{ borderTop: 'none', paddingTop: 'var(--space-sm)' }}>
        <button
          className="btn btn--danger"
          onClick={onRemove}
          style={{ width: '100%' }}
        >
          Remove Unit
        </button>
      </div>
    </div>
  );
}
