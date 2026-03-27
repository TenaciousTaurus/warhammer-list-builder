import type { UserProfile, HeadToHeadStats } from '../../../shared/types/database';

interface HeadToHeadCardProps {
  user1: UserProfile;
  user2: UserProfile;
  stats: HeadToHeadStats;
}

export function HeadToHeadCard({ user1, user2, stats }: HeadToHeadCardProps) {
  const initial1 = user1.display_name?.charAt(0)?.toUpperCase() ?? '?';
  const initial2 = user2.display_name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <div className="head-to-head">
      <div className="head-to-head__header">
        <div className="head-to-head__player">
          <div className="head-to-head__avatar">{initial1}</div>
          <span className="head-to-head__name">{user1.display_name}</span>
          <span className="head-to-head__wins">{stats.user1_wins}</span>
        </div>

        <div className="head-to-head__separator">
          <span className="head-to-head__vs">VS</span>
          <span className="head-to-head__total">{stats.total_games} games</span>
          {stats.draws > 0 && (
            <span className="head-to-head__draws">{stats.draws} draws</span>
          )}
        </div>

        <div className="head-to-head__player head-to-head__player--right">
          <span className="head-to-head__wins">{stats.user2_wins}</span>
          <span className="head-to-head__name">{user2.display_name}</span>
          <div className="head-to-head__avatar">{initial2}</div>
        </div>
      </div>

      {stats.recent_battles.length > 0 && (
        <div className="head-to-head__recent">
          <h3 className="head-to-head__recent-title">Recent Battles</h3>
          <ul className="head-to-head__battle-list">
            {stats.recent_battles.map((battle, idx) => (
              <li key={idx} className="head-to-head__battle">
                <span className="head-to-head__battle-date">
                  {new Date(battle.played_at).toLocaleDateString()}
                </span>
                <span className="head-to-head__battle-score">
                  {battle.player1_vp} - {battle.player2_vp}
                </span>
                <span
                  className={`head-to-head__battle-result head-to-head__battle-result--${battle.winner}`}
                >
                  {battle.winner === 'draw'
                    ? 'Draw'
                    : battle.winner === 'user1'
                      ? user1.display_name
                      : user2.display_name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
