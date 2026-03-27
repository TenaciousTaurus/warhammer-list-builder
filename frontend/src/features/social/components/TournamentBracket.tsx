import { useMemo } from 'react';
import type {
  TournamentRound,
  TournamentPairing,
  TournamentParticipant,
} from '../../../shared/types/database';

interface TournamentBracketProps {
  rounds: TournamentRound[];
  pairings: TournamentPairing[];
  participants: TournamentParticipant[];
}

export function TournamentBracket({ rounds, pairings, participants }: TournamentBracketProps) {
  const participantMap = useMemo(() => {
    const map = new Map<string, TournamentParticipant>();
    for (const p of participants) {
      map.set(p.id, p);
    }
    return map;
  }, [participants]);

  const sortedRounds = useMemo(
    () => [...rounds].sort((a, b) => a.round_number - b.round_number),
    [rounds]
  );

  const getPlayerName = (participantId: string | null): string => {
    if (!participantId) return 'TBD';
    return participantMap.get(participantId)?.display_name ?? 'Unknown';
  };

  if (sortedRounds.length === 0) {
    return (
      <div className="tournament-bracket tournament-bracket--empty">
        No bracket data available yet.
      </div>
    );
  }

  return (
    <div
      className="tournament-bracket"
      style={{
        '--bracket-rounds': sortedRounds.length,
      } as React.CSSProperties}
    >
      {sortedRounds.map((round) => {
        const roundPairings = pairings.filter((p) => p.round_id === round.id);

        return (
          <div key={round.id} className="tournament-bracket__round">
            <h3 className="tournament-bracket__round-title">
              Round {round.round_number}
            </h3>
            <div className="tournament-bracket__matches">
              {roundPairings.map((pairing) => {
                const p1Name = getPlayerName(pairing.player1_id);
                const p2Name = pairing.is_bye ? 'BYE' : getPlayerName(pairing.player2_id);
                const isCompleted = pairing.completed_at !== null;
                const p1IsWinner = pairing.winner_id === pairing.player1_id;
                const p2IsWinner = pairing.winner_id === pairing.player2_id;

                return (
                  <div key={pairing.id} className="tournament-bracket__match">
                    <div
                      className={`tournament-bracket__player ${
                        p1IsWinner ? 'tournament-bracket__player--winner' : ''
                      }`}
                    >
                      <span className="tournament-bracket__player-name">{p1Name}</span>
                      {isCompleted && (
                        <span className="tournament-bracket__score">
                          {pairing.player1_vp}
                        </span>
                      )}
                    </div>
                    <div className="tournament-bracket__connector" />
                    <div
                      className={`tournament-bracket__player ${
                        p2IsWinner ? 'tournament-bracket__player--winner' : ''
                      } ${pairing.is_bye ? 'tournament-bracket__player--bye' : ''}`}
                    >
                      <span className="tournament-bracket__player-name">{p2Name}</span>
                      {isCompleted && !pairing.is_bye && (
                        <span className="tournament-bracket__score">
                          {pairing.player2_vp}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
