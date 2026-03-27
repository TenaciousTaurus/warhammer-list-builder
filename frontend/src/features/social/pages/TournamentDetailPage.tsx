import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useTournamentStore } from '../stores/tournamentStore';
import { useTournamentRealtime } from '../hooks/useTournamentRealtime';
import { SwissStandings } from '../components/SwissStandings';
import { TournamentBracket } from '../components/TournamentBracket';
import { RoundRobinGrid } from '../components/RoundRobinGrid';
import { PairingCard } from '../components/PairingCard';
import '../social.css';

type DetailTab = 'standings' | 'rounds' | 'bracket';

const FORMAT_LABELS: Record<string, string> = {
  swiss: 'Swiss',
  single_elimination: 'Single Elimination',
  round_robin: 'Round Robin',
};

const STATUS_LABELS: Record<string, string> = {
  registration: 'Registration',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    activeTournament,
    participants,
    rounds,
    pairings,
    standings,
    loading,
    error,
    loadTournament,
    startTournament,
    generatePairings,
    submitResult,
    loadStandings,
    completeTournament,
  } = useTournamentStore();

  const [activeTab, setActiveTab] = useState<DetailTab>('standings');
  const [expandedRound, setExpandedRound] = useState<string | null>(null);

  useTournamentRealtime(id ?? '');

  useEffect(() => {
    if (id) {
      loadTournament(id);
      loadStandings(id);
    }
  }, [id, loadTournament, loadStandings]);

  const isOrganizer = activeTournament?.organizer_id === user?.id;
  const nextRoundNumber = rounds.length > 0 ? Math.max(...rounds.map((r) => r.round_number)) + 1 : 1;

  const handleStart = async () => {
    if (id) await startTournament(id);
  };

  const handleGeneratePairings = async () => {
    if (id) await generatePairings(id, nextRoundNumber);
  };

  const handleComplete = async () => {
    if (id) await completeTournament(id);
  };

  const handleSubmitResult = async (pairingId: string, p1VP: number, p2VP: number) => {
    await submitResult(pairingId, p1VP, p2VP);
    if (id) await loadStandings(id);
  };

  if (loading) {
    return (
      <div className="tournament-detail">
        <div className="tournament-detail__skeleton">
          <div className="tournament-detail__skeleton-header" />
          <div className="tournament-detail__skeleton-body" />
        </div>
      </div>
    );
  }

  if (!activeTournament) {
    return (
      <div className="tournament-detail">
        <div className="tournament-detail__empty">Tournament not found.</div>
      </div>
    );
  }

  const showBracketTab = activeTournament.format === 'single_elimination';

  return (
    <div className="tournament-detail">
      <div className="tournament-detail__header">
        <button className="tournament-detail__back-btn" onClick={() => navigate('/tournaments')}>
          Back
        </button>
        <div className="tournament-detail__title-row">
          <h1 className="tournament-detail__name">{activeTournament.name}</h1>
          <span className={`tournament-detail__status tournament-detail__status--${activeTournament.status}`}>
            {STATUS_LABELS[activeTournament.status]}
          </span>
        </div>
        <div className="tournament-detail__meta">
          <span className="tournament-detail__format-badge">
            {FORMAT_LABELS[activeTournament.format]}
          </span>
          <span className="tournament-detail__info">
            {participants.length}/{activeTournament.max_players} players
          </span>
          <span className="tournament-detail__info">
            {activeTournament.points_limit}pts
          </span>
          <span className="tournament-detail__info">
            Code: {activeTournament.share_code}
          </span>
        </div>
        {activeTournament.description && (
          <p className="tournament-detail__description">{activeTournament.description}</p>
        )}
      </div>

      {error && <div className="tournament-detail__error">{error}</div>}

      {isOrganizer && (
        <div className="tournament-detail__controls">
          {activeTournament.status === 'registration' && participants.length >= 2 && (
            <button className="tournament-detail__action-btn" onClick={handleStart}>
              Start Tournament
            </button>
          )}
          {activeTournament.status === 'active' && (
            <>
              <button
                className="tournament-detail__action-btn"
                onClick={handleGeneratePairings}
              >
                Generate Round {nextRoundNumber} Pairings
              </button>
              <button
                className="tournament-detail__action-btn tournament-detail__action-btn--complete"
                onClick={handleComplete}
              >
                Complete Tournament
              </button>
            </>
          )}
        </div>
      )}

      <div className="tournament-detail__tabs">
        <button
          className={`tournament-detail__tab ${activeTab === 'standings' ? 'tournament-detail__tab--active' : ''}`}
          onClick={() => setActiveTab('standings')}
        >
          Standings
        </button>
        <button
          className={`tournament-detail__tab ${activeTab === 'rounds' ? 'tournament-detail__tab--active' : ''}`}
          onClick={() => setActiveTab('rounds')}
        >
          Rounds
        </button>
        {showBracketTab && (
          <button
            className={`tournament-detail__tab ${activeTab === 'bracket' ? 'tournament-detail__tab--active' : ''}`}
            onClick={() => setActiveTab('bracket')}
          >
            Bracket
          </button>
        )}
      </div>

      <div className="tournament-detail__content">
        {activeTab === 'standings' && (
          <>
            {activeTournament.format === 'round_robin' ? (
              <RoundRobinGrid participants={participants} pairings={pairings} />
            ) : (
              <SwissStandings standings={standings} />
            )}
          </>
        )}

        {activeTab === 'rounds' && (
          <div className="tournament-detail__rounds">
            {rounds.length === 0 ? (
              <div className="tournament-detail__rounds-empty">
                No rounds generated yet.
              </div>
            ) : (
              rounds.map((round) => {
                const roundPairings = pairings.filter((p) => p.round_id === round.id);
                const isExpanded = expandedRound === round.id;

                return (
                  <div key={round.id} className="tournament-round">
                    <button
                      className="tournament-round__header"
                      onClick={() => setExpandedRound(isExpanded ? null : round.id)}
                    >
                      <span className="tournament-round__label">
                        Round {round.round_number}
                      </span>
                      <span className={`tournament-round__status tournament-round__status--${round.status}`}>
                        {round.status}
                      </span>
                      <span className="tournament-round__toggle">
                        {isExpanded ? '\u25B2' : '\u25BC'}
                      </span>
                    </button>
                    {isExpanded && (
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
              })
            )}
          </div>
        )}

        {activeTab === 'bracket' && showBracketTab && (
          <TournamentBracket
            rounds={rounds}
            pairings={pairings}
            participants={participants}
          />
        )}
      </div>
    </div>
  );
}
