import type { CrusadeUnit } from '../../../shared/types/database';
import { XPProgressBar } from './XPProgressBar';

interface CrusadeUnitCardProps {
  unit: CrusadeUnit;
  unitName: string;
  onClick: () => void;
}

export function CrusadeUnitCard({ unit, unitName, onClick }: CrusadeUnitCardProps) {
  const displayName = unit.custom_name || unitName;
  const isDestroyed = unit.is_destroyed;
  const honourCount = unit.honours.length;
  const scarCount = unit.scars.length;

  return (
    <div
      className={`crusade-unit-card${isDestroyed ? ' crusade-unit-card--destroyed' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <div className="crusade-unit-card__header">
        <h4 className="crusade-unit-card__name">{displayName}</h4>
        <span className={`crusade-unit-card__rank-badge crusade-unit-card__rank-badge--${unit.rank}`}>
          {unit.rank.replace(/_/g, ' ')}
        </span>
      </div>

      <XPProgressBar xp={unit.xp} rank={unit.rank} />

      <div className="crusade-unit-card__stats">
        <div className="crusade-unit-card__stat">
          <span className="crusade-unit-card__stat-value">{unit.battles_played}</span>
          <span className="crusade-unit-card__stat-label">Battles</span>
        </div>
        <div className="crusade-unit-card__stat">
          <span className="crusade-unit-card__stat-value">{unit.battles_survived}</span>
          <span className="crusade-unit-card__stat-label">Survived</span>
        </div>
        <div className="crusade-unit-card__stat">
          <span className="crusade-unit-card__stat-value">{unit.kills}</span>
          <span className="crusade-unit-card__stat-label">Kills</span>
        </div>
        <div className="crusade-unit-card__stat">
          <span className="crusade-unit-card__stat-value">{unit.points_cost}</span>
          <span className="crusade-unit-card__stat-label">Pts</span>
        </div>
      </div>

      {(honourCount > 0 || scarCount > 0) && (
        <div className="crusade-unit-card__honours">
          {honourCount > 0 && (
            <span className="honour-badge">
              <span className="honour-badge__icon">&#9733;</span>
              {honourCount} {honourCount === 1 ? 'Honour' : 'Honours'}
            </span>
          )}
          {scarCount > 0 && (
            <span className="scar-badge">
              <span className="scar-badge__icon">&#10007;</span>
              {scarCount} {scarCount === 1 ? 'Scar' : 'Scars'}
            </span>
          )}
        </div>
      )}

      {isDestroyed && (
        <div className="crusade-unit-card__destroyed-banner" style={{
          textAlign: 'center',
          color: 'var(--color-red-bright)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'var(--text-sm)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          Destroyed
        </div>
      )}
    </div>
  );
}
