export function PointsBar({ current, limit }: { current: number; limit: number }) {
  const percentage = Math.min((current / limit) * 100, 100);
  const overLimit = current > limit;
  const nearLimit = current > limit * 0.9;

  let fillClass = 'points-bar__fill';
  if (overLimit) fillClass += ' points-bar__fill--over';
  else if (nearLimit) fillClass += ' points-bar__fill--warning';

  return (
    <div className="points-bar-container">
      <div className="points-bar">
        <div
          className={fillClass}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="points-bar-labels">
        <span>{current} pts</span>
        <span>{limit} pts</span>
      </div>
    </div>
  );
}
