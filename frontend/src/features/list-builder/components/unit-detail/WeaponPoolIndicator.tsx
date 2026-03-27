interface WeaponPoolIndicatorProps {
  poolName: string;
  used: number;
  max: number;
}

export function WeaponPoolIndicator({ poolName, used, max }: WeaponPoolIndicatorProps) {
  const pct = Math.min((used / max) * 100, 100);
  const isOver = used > max;
  const isFull = used === max;

  let colorClass = 'pool--available';
  if (isOver) colorClass = 'pool--over';
  else if (isFull) colorClass = 'pool--full';
  else if (pct >= 50) colorClass = 'pool--partial';

  return (
    <div className={`weapon-pool ${colorClass}`}>
      <div className="weapon-pool__bar">
        <div
          className="weapon-pool__fill"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="weapon-pool__label">
        {poolName} ({used}/{max})
      </span>
    </div>
  );
}
