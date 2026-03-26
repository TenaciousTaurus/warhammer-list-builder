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

  const groupedAbilities = {
    invulnerable: unit.abilities.filter(a => a.type === 'invulnerable'),
    core: unit.abilities.filter(a => a.type === 'core'),
    faction: unit.abilities.filter(a => a.type === 'faction'),
    unique: unit.abilities.filter(a => a.type === 'unique'),
  };

  const hasAbilities = groupedAbilities.invulnerable.length > 0
    || groupedAbilities.core.length > 0
    || groupedAbilities.faction.length > 0
    || groupedAbilities.unique.length > 0;

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
    <div className={`datasheet${compact ? ' datasheet--compact' : ''}`}>
      {/* Stat Line */}
      <div className="datasheet__section">
        <StatLine unit={unit} />
      </div>

      {/* Abilities */}
      {hasAbilities && (
        <div className="datasheet__section">
          <div className="datasheet__section-label">Abilities</div>
          <div className="datasheet__ability-list">
            {[...groupedAbilities.invulnerable, ...groupedAbilities.core,
              ...groupedAbilities.faction, ...groupedAbilities.unique].map(a => (
              <div key={a.id} className="datasheet__ability-item">
                <div className="datasheet__ability-header">
                  <span className={`ability-tag ability-tag--${a.type === 'invulnerable' ? 'invuln' : a.type}`}>
                    {a.type === 'invulnerable' ? 'Invuln' : a.type}
                  </span>
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
