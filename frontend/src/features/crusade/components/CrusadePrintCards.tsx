import type { CrusadeUnitWithDetails, CrusadeRoster } from '../../../shared/types/database';

const RANK_LABELS: Record<string, string> = {
  battle_ready: 'Battle Ready',
  blooded: 'Blooded',
  battle_hardened: 'Battle Hardened',
  heroic: 'Heroic',
  legendary: 'Legendary',
};

const RANK_XP_RANGES: Record<string, string> = {
  battle_ready: '0–5 XP',
  blooded: '6–15 XP',
  battle_hardened: '16–30 XP',
  heroic: '31–50 XP',
  legendary: '51+ XP',
};

interface CrusadePrintCardsProps {
  roster: CrusadeRoster;
  units: CrusadeUnitWithDetails[];
  factionName: string;
}

export function CrusadePrintCards({ roster, units, factionName }: CrusadePrintCardsProps) {
  return (
    <div className="crusade-print-cards">
      <div className="crusade-print-cards__roster-title">
        {roster.name} — {factionName}
      </div>
      <div className="crusade-print-cards__grid">
        {units.map(unit => {
          const name = unit.custom_name || unit.units?.name || 'Unknown Unit';
          const rank = unit.rank;
          return (
            <div
              key={unit.id}
              className={`crusade-print-card${unit.is_destroyed ? ' crusade-print-card--destroyed' : ''}`}
            >
              {/* Header */}
              <div className="crusade-print-card__header">
                <div className="crusade-print-card__name">{name}</div>
                <div className="crusade-print-card__rank">{RANK_LABELS[rank] ?? rank}</div>
              </div>

              {/* Stat line */}
              <div className="crusade-print-card__stats">
                <div className="crusade-print-card__stat">
                  <div className="crusade-print-card__stat-value">{unit.xp}</div>
                  <div className="crusade-print-card__stat-label">XP</div>
                </div>
                <div className="crusade-print-card__stat">
                  <div className="crusade-print-card__stat-value">{unit.battles_played}</div>
                  <div className="crusade-print-card__stat-label">Battles</div>
                </div>
                <div className="crusade-print-card__stat">
                  <div className="crusade-print-card__stat-value">{unit.battles_survived}</div>
                  <div className="crusade-print-card__stat-label">Survived</div>
                </div>
                <div className="crusade-print-card__stat">
                  <div className="crusade-print-card__stat-value">{unit.kills}</div>
                  <div className="crusade-print-card__stat-label">Kills</div>
                </div>
                <div className="crusade-print-card__stat">
                  <div className="crusade-print-card__stat-value">{unit.points_cost}</div>
                  <div className="crusade-print-card__stat-label">Pts</div>
                </div>
                <div className="crusade-print-card__stat">
                  <div className="crusade-print-card__stat-value">{unit.model_count}</div>
                  <div className="crusade-print-card__stat-label">Models</div>
                </div>
              </div>

              {/* XP progress note */}
              <div className="crusade-print-card__xp-note">
                {RANK_XP_RANGES[rank]} range
                {rank !== 'legendary' && ` — next rank at ${
                  { battle_ready: 6, blooded: 16, battle_hardened: 31, heroic: 51 }[rank] ?? '?'
                } XP`}
              </div>

              {/* Honours */}
              {unit.honours.length > 0 && (
                <div className="crusade-print-card__section">
                  <div className="crusade-print-card__section-label">Battle Honours</div>
                  {unit.honours.map((h, i) => (
                    <div key={i} className="crusade-print-card__honour">
                      <span className="crusade-print-card__honour-name">{h.name}</span>
                      {h.description && (
                        <span className="crusade-print-card__honour-desc"> — {h.description}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Scars */}
              {unit.scars.length > 0 && (
                <div className="crusade-print-card__section">
                  <div className="crusade-print-card__section-label">Battle Scars</div>
                  {unit.scars.map((s, i) => (
                    <div key={i} className="crusade-print-card__scar">
                      <span className="crusade-print-card__scar-name">{s.name}</span>
                      {s.description && (
                        <span className="crusade-print-card__scar-desc"> — {s.description}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              {unit.notes && (
                <div className="crusade-print-card__section">
                  <div className="crusade-print-card__section-label">Notes</div>
                  <div className="crusade-print-card__notes">{unit.notes}</div>
                </div>
              )}

              {/* Destroyed banner */}
              {unit.is_destroyed && (
                <div className="crusade-print-card__destroyed">DESTROYED</div>
              )}

              {/* Checkboxes for XP tracking */}
              <div className="crusade-print-card__footer">
                <span className="crusade-print-card__footer-label">XP gained this battle:</span>
                <div className="crusade-print-card__xp-boxes">
                  {[1, 2, 3, 4, 5].map(n => (
                    <div key={n} className="crusade-print-card__xp-box" />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
