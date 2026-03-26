import type { Unit, Ability, Weapon } from '../types/database';
import { StatLine } from './StatLine';

interface DatasheetViewProps {
  unit: Unit & { abilities: Ability[] };
  weapons: Weapon[];
  compact?: boolean;
}

export function DatasheetView({ unit, weapons, compact }: DatasheetViewProps) {
  const rangedWeapons = weapons.filter(w => w.type === 'ranged');
  const meleeWeapons = weapons.filter(w => w.type === 'melee');

  const invuln = unit.abilities.find(a => a.type === 'invulnerable');
  const coreAbilities = unit.abilities.filter(a => a.type === 'core');
  const factionAbilities = unit.abilities.filter(a => a.type === 'faction');
  const uniqueAbilities = unit.abilities.filter(a => a.type === 'unique');

  // Extract invuln save value (e.g. "4+" from "This model has a 4+ invulnerable save.")
  const invulnValue = invuln?.description?.match(/(\d\+)/)?.[1] ?? null;

  function renderWeaponTable(weaponList: Weapon[], label: string) {
    if (weaponList.length === 0) return null;
    return (
      <div className="datasheet__weapons-group">
        <div className="datasheet__weapons-label">{label}</div>
        <table className={`weapons-table${compact ? ' weapons-table--compact' : ''}`}>
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
                  <span className="datasheet__weapon-name">{w.name}</span>
                  {w.keywords.length > 0 && (
                    <div className="datasheet__weapon-keywords">
                      {w.keywords.map((kw, i) => (
                        <span key={i} className="datasheet__weapon-kw-chip">{kw}</span>
                      ))}
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
    <div className={`datasheet${compact ? ' datasheet--compact' : ''}`}>
      {/* Stat Line + Invuln Shield */}
      <div className="datasheet__stats-row">
        <div className="datasheet__section" style={{ flex: 1 }}>
          <StatLine unit={unit} />
        </div>
        {invulnValue && (
          <div className="datasheet__invuln-shield" title={invuln?.description ?? ''}>
            <span className="datasheet__invuln-value">{invulnValue}</span>
            <span className="datasheet__invuln-label">Invuln</span>
          </div>
        )}
      </div>

      {/* Core & Faction abilities as chips */}
      {(coreAbilities.length > 0 || factionAbilities.length > 0) && (
        <div className="datasheet__section">
          <div className="datasheet__core-abilities">
            {coreAbilities.map(a => (
              <span key={a.id} className="datasheet__core-chip datasheet__core-chip--core">{a.name}</span>
            ))}
            {factionAbilities.map(a => (
              <span key={a.id} className="datasheet__core-chip datasheet__core-chip--faction">{a.name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Unique abilities with descriptions */}
      {uniqueAbilities.length > 0 && (
        <div className="datasheet__section">
          <div className="datasheet__section-label">Abilities</div>
          <div className="datasheet__ability-list">
            {uniqueAbilities.map(a => (
              <div key={a.id} className="datasheet__ability-item">
                <div className="datasheet__ability-header">
                  <span className="datasheet__ability-name">{a.name}</span>
                </div>
                {!compact && a.description && (
                  <div className="datasheet__ability-desc">{a.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weapons */}
      {(rangedWeapons.length > 0 || meleeWeapons.length > 0) && (
        <div className="datasheet__section">
          <div className="datasheet__section-label">Weapons</div>
          {renderWeaponTable(rangedWeapons, 'Ranged')}
          {renderWeaponTable(meleeWeapons, 'Melee')}
        </div>
      )}

      {/* Keywords */}
      {!compact && unit.keywords.length > 0 && (
        <div className="datasheet__section">
          <div className="datasheet__section-label">Keywords</div>
          <div className="datasheet__keywords">
            {unit.keywords.map((kw, i) => (
              <span key={i} className="datasheet__keyword">{kw}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
