import type { PlayerStats } from '../../../shared/types/database';

interface StatsDashboardProps {
  stats: PlayerStats;
}

export function StatsDashboard({ stats }: StatsDashboardProps) {
  const winPct = Math.round(stats.win_rate * 100);

  // Find max games for faction breakdown bar scaling
  const maxFactionGames = stats.games_by_faction.length > 0
    ? Math.max(...stats.games_by_faction.map((f) => f.games))
    : 1;

  return (
    <div className="stats-page__dashboard">
      <div className="stats-page__cards">
        <div className="stat-card">
          <span className="stat-card__value">{stats.total_games}</span>
          <span className="stat-card__label">Total Games</span>
        </div>

        <div className="stat-card stat-card--featured">
          <div
            className="win-rate-ring"
            style={{ '--win-pct': `${winPct}%` } as React.CSSProperties}
          >
            <span className="win-rate-ring__value">{winPct}%</span>
          </div>
          <span className="stat-card__label">Win Rate</span>
        </div>

        <div className="stat-card">
          <span className="stat-card__value stat-card__value--win">{stats.wins}</span>
          <span className="stat-card__label">Wins</span>
        </div>

        <div className="stat-card">
          <span className="stat-card__value stat-card__value--loss">{stats.losses}</span>
          <span className="stat-card__label">Losses</span>
        </div>

        <div className="stat-card">
          <span className="stat-card__value stat-card__value--draw">{stats.draws}</span>
          <span className="stat-card__label">Draws</span>
        </div>

        <div className="stat-card">
          <span className="stat-card__value">{stats.avg_vp.toFixed(1)}</span>
          <span className="stat-card__label">Avg VP</span>
        </div>
      </div>

      {stats.games_by_faction.length > 0 && (
        <div className="faction-breakdown">
          <h2 className="faction-breakdown__title">Faction Breakdown</h2>
          <div className="faction-breakdown__list">
            {stats.games_by_faction.map((faction) => {
              const barWidth = (faction.games / maxFactionGames) * 100;
              const factionWinRate =
                faction.games > 0
                  ? Math.round((faction.wins / faction.games) * 100)
                  : 0;

              return (
                <div key={faction.faction_id} className="faction-breakdown__item">
                  <div className="faction-breakdown__header">
                    <span className="faction-breakdown__name">{faction.faction_name}</span>
                    <span className="faction-breakdown__stats">
                      {faction.games} games &middot; {factionWinRate}% WR
                    </span>
                  </div>
                  <div className="faction-breakdown__bar-track">
                    <div
                      className="faction-breakdown__bar-fill"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
