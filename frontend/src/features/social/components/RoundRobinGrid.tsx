import { useMemo } from 'react';
import type {
  TournamentParticipant,
  TournamentPairing,
} from '../../../shared/types/database';

interface RoundRobinGridProps {
  participants: TournamentParticipant[];
  pairings: TournamentPairing[];
}

type CellResult = 'W' | 'L' | 'D' | '-' | null;

export function RoundRobinGrid({ participants, pairings }: RoundRobinGridProps) {
  // Build a matrix of results: results[rowId][colId] = 'W' | 'L' | 'D' | '-' | null
  const resultMatrix = useMemo(() => {
    const matrix = new Map<string, Map<string, CellResult>>();

    for (const p of participants) {
      const row = new Map<string, CellResult>();
      for (const q of participants) {
        if (p.id === q.id) {
          row.set(q.id, '-');
        } else {
          row.set(q.id, null);
        }
      }
      matrix.set(p.id, row);
    }

    for (const pairing of pairings) {
      if (!pairing.completed_at) continue;

      const p1 = pairing.player1_id;
      const p2 = pairing.player2_id;
      if (!p2) continue;

      if (pairing.is_draw) {
        matrix.get(p1)?.set(p2, 'D');
        matrix.get(p2)?.set(p1, 'D');
      } else if (pairing.winner_id === p1) {
        matrix.get(p1)?.set(p2, 'W');
        matrix.get(p2)?.set(p1, 'L');
      } else if (pairing.winner_id === p2) {
        matrix.get(p1)?.set(p2, 'L');
        matrix.get(p2)?.set(p1, 'W');
      }
    }

    return matrix;
  }, [participants, pairings]);

  if (participants.length === 0) {
    return (
      <div className="round-robin-grid round-robin-grid--empty">
        No participants yet.
      </div>
    );
  }

  return (
    <div className="round-robin-grid">
      <table className="round-robin-grid__table">
        <thead>
          <tr>
            <th className="round-robin-grid__corner" />
            {participants.map((p) => (
              <th key={p.id} className="round-robin-grid__col-header" title={p.display_name}>
                {p.display_name.substring(0, 8)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {participants.map((rowPlayer) => (
            <tr key={rowPlayer.id} className="round-robin-grid__row">
              <td className="round-robin-grid__row-header">{rowPlayer.display_name}</td>
              {participants.map((colPlayer) => {
                const result = resultMatrix.get(rowPlayer.id)?.get(colPlayer.id);
                const isDiagonal = rowPlayer.id === colPlayer.id;

                return (
                  <td
                    key={colPlayer.id}
                    className={`round-robin-grid__cell ${
                      isDiagonal ? 'round-robin-grid__cell--diagonal' : ''
                    } ${result ? `round-robin-grid__cell--${result.toLowerCase()}` : ''}`}
                  >
                    {result === '-' ? '' : result ?? ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
