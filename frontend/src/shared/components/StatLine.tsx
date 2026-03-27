import type { Unit } from '../types/database';

export function StatLine({ unit }: { unit: Unit }) {
  const stats = [
    { label: 'M', value: unit.movement },
    { label: 'T', value: unit.toughness },
    { label: 'Sv', value: unit.save },
    { label: 'W', value: unit.wounds },
    { label: 'Ld', value: `${unit.leadership}+` },
    { label: 'OC', value: unit.objective_control },
  ];

  return (
    <div className="stat-line">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-line__item">
          <span className="stat-line__label">{stat.label}</span>
          <span className="stat-line__value">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}
