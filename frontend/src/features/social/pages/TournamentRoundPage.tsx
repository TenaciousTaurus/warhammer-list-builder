import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useTournamentStore } from '../stores/tournamentStore';
import { useTournamentRealtime } from '../hooks/useTournamentRealtime';
import { PairingCard } from '../components/PairingCard';
import '../social.css';

export function TournamentRoundPage() {
  const { id, roundNumber } = useParams<{ id: string; roundNumber: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    activeTournament,
    participants,
    rounds,
    pairings,
    loading,
    error,
    loadTournament,
    submitResult,
    loadStandings,
  } = useTournamentStore();

  useTournamentRealtime(id ?? '');

  useEffect(() => {
    if (id && !activeTournament) {
      loadTournament(id);
    }
  }, [id, activeTournament, loadTournament]);

  const parsedRoundNumber = parseInt(roundNumber ?? '1', 10);

  const currentRound = useMemo(
    () => rounds.find((r) => r.round_number === parsedRoundNumber),
    [rounds, parsedRoundNumber]
  );

  const roundPairings = useMemo(
    () => (currentRound ? pairings.filter((p) => p.round_id === currentRound.id) : []),
    [currentRound, pairings]
  );

  const handleSubmitResult = async (pairingId: string, p1VP: number, p2VP: number) => {
    await submitResult(pairingId, p1VP, p2VP);
    if (id) await loadStandings(id);
  };

  if (loading) {
    return (
      <div className="tournament-round">
        <div className="tournament-round__skeleton">
          {[1, 2, 3].map((i) => (
            <div key={i} className="tournament-round__skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  if (!activeTournament) {
    return (
      <div className="tournament-round">
        <div className="tournament-round__empty">Tournament not found.</div>
      </div>
    );
  }

  if (!currentRound) {
    return (
      <div className="tournament-round">
        <div className="tournament-round__empty">Round {parsedRoundNumber} not found.</div>
      </div>
    );
  }

  return (
    <div className="tournament-round">
      <div className="tournament-round__page-header">
        <button
          className="tournament-round__back-btn"
          onClick={() => navigate(`/tournament/${id}`)}
        >
          Back to Tournament
        </button>
        <h1 className="tournament-round__page-title">
          {activeTournament.name} &mdash; Round {parsedRoundNumber}
        </h1>
        <span
          className={`tournament-round__status tournament-round__status--${currentRound.status}`}
        >
          {currentRound.status}
        </span>
      </div>

      {error && <div className="tournament-round__error">{error}</div>}

      {roundPairings.length === 0 ? (
        <div className="tournament-round__empty">
          No pairings for this round yet.
        </div>
      ) : (
        <div className="tournament-round__pairings">
          {roundPairings.map((pairing) => (
            <PairingCard
              key={pairing.id}
              pairing={pairing}
              participants={participants}
              currentUserId={user?.id ?? ''}
              onSubmitResult={handleSubmitResult}
            />
          ))}
        </div>
      )}
    </div>
  );
}
