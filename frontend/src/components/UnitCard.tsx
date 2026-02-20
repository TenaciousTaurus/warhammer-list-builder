import type { Unit, UnitPointsTier, Ability, Enhancement } from '../types/database';
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
}

export function UnitCard({
  unit, modelCount, points, availableTiers, abilities,
  onModelCountChange, onRemove, enhancement,
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
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
            <h3 style={{ fontSize: '0.95rem' }}>{unit.name}</h3>
            <span className={`role-badge role-badge--${unit.role}`}>
              {unit.role.replace('_', ' ')}
            </span>
            {unit.is_unique && (
              <span style={{ fontSize: '0.7rem', color: 'var(--color-role-epic-hero)', fontStyle: 'italic' }}>
                Unique
              </span>
            )}
          </div>
          <StatLine unit={unit} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-sm)' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'var(--font-display)' }}>
            {points + enhancementPoints} pts
          </span>
          {enhancementPoints > 0 && (
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
              ({points} + {enhancementPoints} enh.)
            </span>
          )}
          {sortedTiers.length > 1 && (
            <select
              className="form-select"
              value={modelCount}
              onChange={(e) => onModelCountChange(Number(e.target.value))}
              style={{ fontSize: '0.8rem', padding: '4px 8px' }}
            >
              {sortedTiers.map((tier) => (
                <option key={tier.id} value={tier.model_count}>
                  {tier.model_count} models ({tier.points} pts)
                </option>
              ))}
            </select>
          )}
          <button className="btn btn--danger" onClick={onRemove} style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
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

      {/* Enhancement picker for character units */}
      {enhancement && (
        <div style={{ marginTop: 'var(--space-sm)', paddingTop: 'var(--space-sm)', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Enhancement
            </span>
            <select
              className="form-select"
              value={enhancement.assigned?.id ?? ''}
              onChange={(e) => enhancement.onAssign(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '4px 8px', flex: 1 }}
            >
              <option value="">None</option>
              {enhancement.available.map(e => (
                <option key={e.id} value={e.id}>{e.name} (+{e.points} pts)</option>
              ))}
            </select>
          </div>
          {enhancement.assigned && (
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
              {enhancement.assigned.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
