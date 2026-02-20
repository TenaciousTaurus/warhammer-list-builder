import type { Unit, UnitPointsTier, Ability, Enhancement, WargearOption } from '../types/database';
import { StatLine } from './StatLine';

interface UnitCardProps {
  unit: Unit;
  modelCount: number;
  points: number;
  availableTiers: UnitPointsTier[];
  abilities?: Ability[];
  onModelCountChange: (count: number) => void;
  onRemove: () => void;
  enhancement?: {
    assigned: Enhancement | null;
    available: Enhancement[];
    onAssign: (enhancementId: string) => void;
  };
  wargear?: {
    options: WargearOption[];
    selected: Map<string, string>;
    onSelect: (groupName: string, optionId: string) => void;
  };
}

export function UnitCard({
  unit, modelCount, points, availableTiers, abilities,
  onModelCountChange, onRemove, enhancement, wargear,
}: UnitCardProps) {
  const sortedTiers = [...availableTiers].sort((a, b) => a.model_count - b.model_count);

  const groupedAbilities = abilities ? {
    core: abilities.filter(a => a.type === 'core'),
    faction: abilities.filter(a => a.type === 'faction'),
    unique: abilities.filter(a => a.type === 'unique'),
    invulnerable: abilities.filter(a => a.type === 'invulnerable'),
  } : null;

  const enhancementPoints = enhancement?.assigned?.points ?? 0;

  return (
    <div className="unit-card">
      <div className="unit-card__header">
        <div className="unit-card__info">
          <div className="unit-card__title-row">
            <h3 className="unit-card__name">{unit.name}</h3>
            <span className={`role-badge role-badge--${unit.role}`}>
              {unit.role.replace('_', ' ')}
            </span>
            {unit.is_unique && (
              <span className="unit-card__unique-tag">Unique</span>
            )}
          </div>
          <StatLine unit={unit} />
        </div>
        <div className="unit-card__actions">
          <span className="unit-card__points">
            {points + enhancementPoints} pts
          </span>
          {enhancementPoints > 0 && (
            <span className="unit-card__points-detail">
              ({points} + {enhancementPoints} enh.)
            </span>
          )}
          {sortedTiers.length > 1 && (
            <select
              className="form-select"
              value={modelCount}
              onChange={(e) => onModelCountChange(Number(e.target.value))}
              style={{ fontSize: 'var(--text-xs)', padding: '4px 8px' }}
            >
              {sortedTiers.map((tier) => (
                <option key={tier.id} value={tier.model_count}>
                  {tier.model_count} models ({tier.points} pts)
                </option>
              ))}
            </select>
          )}
          <button
            className="btn btn--danger unit-card__remove-btn"
            onClick={onRemove}
            style={{ padding: '4px 10px' }}
          >
            Remove
          </button>
        </div>
      </div>

      {/* Abilities */}
      {groupedAbilities && (groupedAbilities.core.length > 0 || groupedAbilities.unique.length > 0 || groupedAbilities.invulnerable.length > 0 || groupedAbilities.faction.length > 0) && (
        <div style={{ marginTop: 'var(--space-sm)', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {groupedAbilities.invulnerable.map(a => (
            <span key={a.id} className="ability-tag ability-tag--invuln" title={a.description}>
              {a.name}
            </span>
          ))}
          {groupedAbilities.core.map(a => (
            <span key={a.id} className="ability-tag ability-tag--core" title={a.description}>
              {a.name}
            </span>
          ))}
          {groupedAbilities.faction.map(a => (
            <span key={a.id} className="ability-tag ability-tag--faction" title={a.description}>
              {a.name}
            </span>
          ))}
          {groupedAbilities.unique.map(a => (
            <span key={a.id} className="ability-tag ability-tag--unique" title={a.description}>
              {a.name}
            </span>
          ))}
        </div>
      )}

      {/* Wargear options */}
      {wargear && wargear.options.length > 0 && (() => {
        const groups = new Map<string, WargearOption[]>();
        for (const opt of wargear.options) {
          if (!groups.has(opt.group_name)) groups.set(opt.group_name, []);
          groups.get(opt.group_name)!.push(opt);
        }
        const selectableGroups = [...groups.entries()].filter(([, opts]) => opts.length > 1);
        if (selectableGroups.length === 0) return null;
        return (
          <div className="unit-card__section">
            <span className="unit-card__section-label">Wargear</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
              {selectableGroups.map(([groupName, opts]) => (
                <div key={groupName} style={{ flex: '1 1 200px' }}>
                  <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '2px', display: 'block' }}>
                    {groupName}
                  </label>
                  <select
                    className="form-select"
                    value={wargear.selected.get(groupName) ?? opts.find(o => o.is_default)?.id ?? ''}
                    onChange={(e) => wargear.onSelect(groupName, e.target.value)}
                    style={{ fontSize: 'var(--text-xs)', padding: '4px 8px', width: '100%' }}
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
        );
      })()}

      {/* Enhancement picker for character units */}
      {enhancement && (
        <div className="unit-card__section">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <span className="unit-card__section-label" style={{ marginBottom: 0 }}>Enhancement</span>
            <select
              className="form-select"
              value={enhancement.assigned?.id ?? ''}
              onChange={(e) => enhancement.onAssign(e.target.value)}
              style={{ fontSize: 'var(--text-xs)', padding: '4px 8px', flex: 1 }}
            >
              <option value="">None</option>
              {enhancement.available.map(e => (
                <option key={e.id} value={e.id}>{e.name} (+{e.points} pts)</option>
              ))}
            </select>
          </div>
          {enhancement.assigned && (
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
              {enhancement.assigned.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
