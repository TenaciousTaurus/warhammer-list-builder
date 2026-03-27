import type { TournamentStanding } from '../../../shared/types/database';

interface SwissStandingsProps {
  standings: TournamentStanding[];
}

export function SwissStandings({ standings }: SwissStandingsProps) {
  if (standings.length === 0) {
    return (
      <div className="standings-table standings-table--empty">
        No standings available yet.
      </div>
    );
  }

  // Sort by points desc, then VP diff desc
  const sorted = [...standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.vp_diff - a.vp_diff;
  });

  return (
    <div className="standings-table">
      <table className="standings-table__table">
        <thead>
          <tr className="standings-table__header-row">
            <th className="standings-table__th">#</th>
            <th className="standings-table__th standings-table__th--name">Player</th>
            <th className="standings-table__th">W</th>
            <th className="standings-table__th">L</th>
            <th className="standings-table__th">D</th>
            <th className="standings-table__th">VP For</th>
            <th className="standings-table__th">VP Against</th>
            <th className="standings-table__th">Diff</th>
            <th className="standings-table__th">Pts</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((standing, idx) => {
            const rank = idx + 1;
            const isLeader = rank === 1;
            const isDropped = standing.dropped;

            return (
              <tr
                key={standing.participant_id}
                className={`standings-table__row ${
                  isLeader ? 'standings-table__row--leader' : ''
                } ${isDropped ? 'standings-table__row--dropped' : ''}`}
              >
                <td className="standings-table__td">{rank}</td>
                <td className="standings-table__td standings-table__td--name">
                  {standing.display_name}
                  {isDropped && (
                    <span className="standings-table__dropped-badge">Dropped</span>
                  )}
                </td>
                <td className="standings-table__td">{standing.wins}</td>
                <td className="standings-table__td">{standing.losses}</td>
                <td className="standings-table__td">{standing.draws}</td>
                <td className="standings-table__td">{standing.vp_for}</td>
                <td className="standings-table__td">{standing.vp_against}</td>
                <td className="standings-table__td">
                  <span
                    className={`standings-table__diff ${
                      standing.vp_diff > 0
                        ? 'standings-table__diff--positive'
                        : standing.vp_diff < 0
                          ? 'standings-table__diff--negative'
                          : ''
                    }`}
                  >
                    {standing.vp_diff > 0 ? '+' : ''}
                    {standing.vp_diff}
                  </span>
                </td>
                <td className="standings-table__td standings-table__td--points">
                  {standing.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
