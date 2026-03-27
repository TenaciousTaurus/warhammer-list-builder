import type { Weapon } from '../../types/database';

interface LoadoutWeapon extends Weapon {
  count: number;
}

interface LoadoutDatasheetProps {
  weapons: LoadoutWeapon[];
}

export function LoadoutDatasheet({ weapons }: LoadoutDatasheetProps) {
  const ranged = weapons.filter(w => w.type === 'ranged');
  const melee = weapons.filter(w => w.type === 'melee');

  if (ranged.length === 0 && melee.length === 0) return null;

  function renderRows(weaponList: LoadoutWeapon[], isRanged: boolean) {
    if (weaponList.length === 0) return null;
    const label = isRanged ? 'Ranged' : 'Melee';

    return (
      <>
        <tr className="weapons-table__section-header">
          <td colSpan={7}>{label}</td>
        </tr>
        {weaponList.map((w, i) => (
          <tr key={`${w.id}-${i}`}>
            <td>
              <span className="loadout__weapon-name">
                {w.name}
                {w.count > 1 && (
                  <span className="loadout__weapon-count">×{w.count}</span>
                )}
              </span>
              {w.keywords.length > 0 && (
                <div className="detail-panel__weapon-keywords">
                  {w.keywords.join(', ')}
                </div>
              )}
            </td>
            <td>{isRanged ? (w.range ?? '-') : 'M'}</td>
            <td>{w.attacks}</td>
            <td>{w.skill}</td>
            <td>{w.strength}</td>
            <td>{w.ap}</td>
            <td>{w.damage}</td>
          </tr>
        ))}
      </>
    );
  }

  return (
    <div className="detail-section detail-section--loadout">
      <div className="detail-section__header">
        <span className="detail-section__icon">&#128481;</span>
        <span className="detail-section__title">Loadout</span>
      </div>
      <div className="detail-section__content">
        <table className="weapons-table weapons-table--compact weapons-table--loadout">
          <thead>
            <tr>
              <th>Weapon</th>
              <th>Range</th>
              <th>A</th>
              <th>BS/WS</th>
              <th>S</th>
              <th>AP</th>
              <th>D</th>
            </tr>
          </thead>
          <tbody>
            {renderRows(ranged, true)}
            {renderRows(melee, false)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
