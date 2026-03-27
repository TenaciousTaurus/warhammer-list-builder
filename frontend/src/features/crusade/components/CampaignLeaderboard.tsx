import type { CampaignMember, CrusadeBattle } from '../../../shared/types/database';

interface CampaignLeaderboardProps {
  members: CampaignMember[];
  battles: CrusadeBattle[];
}

interface LeaderboardEntry {
  memberId: string;
  displayName: string;
  wins: number;
  losses: number;
  draws: number;
  totalVP: number;
  vpAgainst: number;
}

function computeLeaderboard(members: CampaignMember[], battles: CrusadeBattle[]): LeaderboardEntry[] {
  const map = new Map<string, LeaderboardEntry>();

  for (const member of members) {
    map.set(member.id, {
      memberId: member.id,
      displayName: member.display_name,
      wins: 0,
      losses: 0,
      draws: 0,
      totalVP: 0,
      vpAgainst: 0,
    });
  }

  for (const battle of battles) {
    const p1 = map.get(battle.player1_member_id);
    const p2 = map.get(battle.player2_member_id);

    if (p1) {
      p1.totalVP += battle.player1_vp;
      p1.vpAgainst += battle.player2_vp;
    }
    if (p2) {
      p2.totalVP += battle.player2_vp;
      p2.vpAgainst += battle.player1_vp;
    }

    if (battle.is_draw) {
      if (p1) p1.draws++;
      if (p2) p2.draws++;
    } else if (battle.winner_member_id) {
      const winner = map.get(battle.winner_member_id);
      const loserId = battle.winner_member_id === battle.player1_member_id
        ? battle.player2_member_id
        : battle.player1_member_id;
      const loser = map.get(loserId);
      if (winner) winner.wins++;
      if (loser) loser.losses++;
    }
  }

  const entries = Array.from(map.values());
  entries.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return (b.totalVP - b.vpAgainst) - (a.totalVP - a.vpAgainst);
  });

  return entries;
}

export function CampaignLeaderboard({ members, battles }: CampaignLeaderboardProps) {
  const leaderboard = computeLeaderboard(members, battles);

  if (leaderboard.length === 0) {
    return (
      <div className="campaign-leaderboard">
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-lg)' }}>
          No members yet. Share the campaign code to invite players.
        </p>
      </div>
    );
  }

  return (
    <div className="campaign-leaderboard">
      <div className="campaign-leaderboard__header-row">
        <span>#</span>
        <span>Player</span>
        <span style={{ textAlign: 'center' }}>W / L / D</span>
        <span style={{ textAlign: 'center' }}>VP</span>
      </div>

      {leaderboard.map((entry, index) => (
        <div
          key={entry.memberId}
          className={`campaign-leaderboard__row${index === 0 ? ' campaign-leaderboard__row--first' : ''}`}
        >
          <span className="campaign-leaderboard__rank">{index + 1}</span>
          <span className="campaign-leaderboard__player">{entry.displayName}</span>
          <span className="campaign-leaderboard__record">
            <span className="campaign-leaderboard__record-win">{entry.wins}</span>
            {' / '}
            <span className="campaign-leaderboard__record-loss">{entry.losses}</span>
            {' / '}
            <span className="campaign-leaderboard__record-draw">{entry.draws}</span>
          </span>
          <span className="campaign-leaderboard__vp">{entry.totalVP}</span>
        </div>
      ))}
    </div>
  );
}
