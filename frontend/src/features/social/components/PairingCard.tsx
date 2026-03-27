import { useState, useMemo } from 'react';
import type {
  TournamentPairing,
  TournamentParticipant,
} from '../../../shared/types/database';

interface PairingCardProps {
  pairing: TournamentPairing;
  participants: TournamentParticipant[];
  currentUserId: string;
  onSubmitResult?: (pairingId: string, p1VP: number, p2VP: number) => void;
}

export function PairingCard({
  pairing,
  participants,
  currentUserId,
  onSubmitResult,
}: PairingCardProps) {
  const [p1VP, setP1VP] = useState('');
  const [p2VP, setP2VP] = useState('');

  const participantMap = useMemo(() => {
    const map = new Map<string, TournamentParticipant>();
    for (const p of participants) {
      map.set(p.id, p);
    }
    return map;
  }, [participants]);

  const player1 = participantMap.get(pairing.player1_id);
  const player2 = pairing.player2_id ? participantMap.get(pairing.player2_id) : null;

  const p1Name = player1?.display_name ?? 'Unknown';
  const p2Name = pairing.is_bye ? 'BYE' : (player2?.display_name ?? 'Unknown');

  const isCompleted = pairing.completed_at !== null;
  const isUserInPairing =
    player1?.user_id === currentUserId || player2?.user_id === currentUserId;
  const canSubmit = !isCompleted && isUserInPairing && onSubmitResult && !pairing.is_bye;

  const p1IsWinner = pairing.winner_id === pairing.player1_id;
  const p2IsWinner = pairing.winner_id === pairing.player2_id;

  const handleSubmit = () => {
    if (!onSubmitResult) return;
    const vp1 = parseInt(p1VP, 10);
    const vp2 = parseInt(p2VP, 10);
    if (isNaN(vp1) || isNaN(vp2) || vp1 < 0 || vp2 < 0) return;
    onSubmitResult(pairing.id, vp1, vp2);
  };

  return (
    <div className={`pairing-card ${isCompleted ? 'pairing-card--completed' : ''}`}>
      {pairing.table_number !== null && (
        <span className="pairing-card__table">Table {pairing.table_number}</span>
      )}

      <div className="pairing-card__matchup">
        <div
          className={`pairing-card__player ${
            p1IsWinner ? 'pairing-card__player--winner' : ''
          }`}
        >
          <span className="pairing-card__name">{p1Name}</span>
          {isCompleted && (
            <span className="pairing-card__vp">{pairing.player1_vp} VP</span>
          )}
        </div>

        <span className="pairing-card__vs">vs</span>

        <div
          className={`pairing-card__player ${
            p2IsWinner ? 'pairing-card__player--winner' : ''
          } ${pairing.is_bye ? 'pairing-card__player--bye' : ''}`}
        >
          <span className="pairing-card__name">{p2Name}</span>
          {isCompleted && !pairing.is_bye && (
            <span className="pairing-card__vp">{pairing.player2_vp} VP</span>
          )}
        </div>
      </div>

      {isCompleted && (
        <div className="pairing-card__result">
          {pairing.is_draw
            ? 'Draw'
            : p1IsWinner
              ? `${p1Name} wins`
              : `${p2Name} wins`}
        </div>
      )}

      {canSubmit && (
        <div className="pairing-card__submit">
          <div className="pairing-card__vp-inputs">
            <div className="pairing-card__vp-field">
              <label className="pairing-card__vp-label">{p1Name} VP</label>
              <input
                className="pairing-card__vp-input"
                type="number"
                min={0}
                max={100}
                value={p1VP}
                onChange={(e) => setP1VP(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="pairing-card__vp-field">
              <label className="pairing-card__vp-label">{p2Name} VP</label>
              <input
                className="pairing-card__vp-input"
                type="number"
                min={0}
                max={100}
                value={p2VP}
                onChange={(e) => setP2VP(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <button className="pairing-card__submit-btn" onClick={handleSubmit}>
            Submit Result
          </button>
        </div>
      )}
    </div>
  );
}
