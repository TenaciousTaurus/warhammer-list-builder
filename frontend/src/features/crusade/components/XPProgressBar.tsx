import type { CrusadeUnit } from '../../../shared/types/database';

interface XPProgressBarProps {
  xp: number;
  rank: CrusadeUnit['rank'];
}

const RANK_THRESHOLDS: { rank: CrusadeUnit['rank']; min: number; max: number }[] = [
  { rank: 'battle_ready', min: 0, max: 5 },
  { rank: 'blooded', min: 6, max: 15 },
  { rank: 'battle_hardened', min: 16, max: 30 },
  { rank: 'heroic', min: 31, max: 50 },
  { rank: 'legendary', min: 51, max: 100 },
];

const RANK_LABELS: Record<CrusadeUnit['rank'], string> = {
  battle_ready: 'Battle Ready',
  blooded: 'Blooded',
  battle_hardened: 'Battle Hardened',
  heroic: 'Heroic',
  legendary: 'Legendary',
};

const THRESHOLD_MARKERS = [6, 16, 31, 51];
const MAX_DISPLAY_XP = 70;

function getRankProgress(xp: number, rank: CrusadeUnit['rank']): number {
  const tier = RANK_THRESHOLDS.find((t) => t.rank === rank);
  if (!tier) return 0;
  if (rank === 'legendary') return 100;
  const range = tier.max - tier.min + 1;
  const progress = xp - tier.min;
  return Math.min(100, Math.max(0, (progress / range) * 100));
}

export function XPProgressBar({ xp, rank }: XPProgressBarProps) {
  const progress = getRankProgress(xp, rank);
  const globalPercent = Math.min(100, (xp / MAX_DISPLAY_XP) * 100);

  return (
    <div className="xp-bar">
      <div className="xp-bar__label">
        <span>{RANK_LABELS[rank]}</span>
        <span className="xp-bar__label-value">{xp} XP</span>
      </div>
      <div className="xp-bar__track">
        <div
          className={`xp-bar__fill xp-bar__fill--${rank}`}
          style={{ width: `${globalPercent}%` }}
        />
        {THRESHOLD_MARKERS.map((threshold) => (
          <div
            key={threshold}
            className="xp-bar__threshold"
            style={{ left: `${(threshold / MAX_DISPLAY_XP) * 100}%` }}
            data-xp={threshold}
          />
        ))}
      </div>
      <div className="xp-bar__label">
        <span>{rank !== 'legendary' ? `${Math.round(progress)}% to next rank` : 'Max rank'}</span>
      </div>
    </div>
  );
}
