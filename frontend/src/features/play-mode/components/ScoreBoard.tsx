import type { GameSessionScore } from '../../../shared/types/database';

interface ScoreBoardProps {
  myVP: number;
  opponentVP: number;
  scores: GameSessionScore[];
  currentRound: number;
}

export function ScoreBoard({ myVP, opponentVP, scores, currentRound }: ScoreBoardProps) {
  const diff = myVP - opponentVP;

  const scoresByRound = new Map<number, GameSessionScore[]>();
  for (const score of scores) {
    const existing = scoresByRound.get(score.round) ?? [];
    existing.push(score);
    scoresByRound.set(score.round, existing);
  }

  return (
    <div className="scoreboard">
      <div className="scoreboard__totals">
        <div className="scoreboard__player">
          <span className="scoreboard__player-label">You</span>
          <span className="scoreboard__player-score">{myVP}</span>
        </div>
        <div className="scoreboard__vs">
          <span className="scoreboard__vs-text">VS</span>
          <span
            className={`scoreboard__diff ${
              diff > 0
                ? 'scoreboard__diff--ahead'
                : diff < 0
                  ? 'scoreboard__diff--behind'
                  : 'scoreboard__diff--tied'
            }`}
          >
            {diff > 0 ? `+${diff}` : diff === 0 ? 'TIED' : `${diff}`}
          </span>
        </div>
        <div className="scoreboard__player">
          <span className="scoreboard__player-label">Opponent</span>
          <span className="scoreboard__player-score">{opponentVP}</span>
        </div>
      </div>

      {scores.length > 0 && (
        <div className="scoreboard__breakdown">
          <table className="scoreboard__table">
            <thead>
              <tr>
                <th className="scoreboard__th">Round</th>
                <th className="scoreboard__th">Objective</th>
                <th className="scoreboard__th">VP</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: currentRound }, (_, i) => i + 1).map((round) => {
                const roundScores = scoresByRound.get(round) ?? [];
                if (roundScores.length === 0) return null;
                return roundScores.map((score, idx) => (
                  <tr key={score.id ?? `${round}-${idx}`} className="scoreboard__row">
                    {idx === 0 && (
                      <td className="scoreboard__td scoreboard__td--round" rowSpan={roundScores.length}>
                        {round}
                      </td>
                    )}
                    <td className="scoreboard__td">{score.objective_name}</td>
                    <td className="scoreboard__td scoreboard__td--vp">{score.vp_scored}</td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
