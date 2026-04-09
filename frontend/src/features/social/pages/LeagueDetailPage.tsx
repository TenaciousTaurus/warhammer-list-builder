import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useLeagueStore } from '../stores/leagueStore';
import { useTournamentStore } from '../stores/tournamentStore';
import { TournamentCard } from '../components/TournamentCard';
import '../social.css';

export function LeagueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeLeague, loading, error, loadLeague, addTournament, removeTournament, updateLeague, clearError } = useLeagueStore();
  const { tournaments, loadMyTournaments, loadTournament } = useTournamentStore();

  const [showAddTournament, setShowAddTournament] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState('');

  useEffect(() => {
    if (id) loadLeague(id);
  }, [id, loadLeague]);

  useEffect(() => {
    if (user?.id && showAddTournament) loadMyTournaments(user.id);
  }, [user?.id, showAddTournament, loadMyTournaments]);

  const isOwner = activeLeague?.owner_id === user?.id;

  // Filter out tournaments already in the league
  const linkedTournamentIds = new Set(activeLeague?.tournaments.map((t) => t.tournament_id) ?? []);
  const availableTournaments = tournaments.filter((t) => !linkedTournamentIds.has(t.id));

  const handleAddTournament = async () => {
    if (!id || !selectedTournamentId) return;
    await addTournament(id, selectedTournamentId);
    setSelectedTournamentId('');
    setShowAddTournament(false);
  };

  const handleTournamentClick = async (tournamentId: string) => {
    await loadTournament(tournamentId);
    navigate(`/tournament/${tournamentId}`);
  };

  if (loading || !activeLeague) {
    return (
      <div className="league-detail">
        <div className="skeleton" style={{ height: '200px', width: '100%' }} />
      </div>
    );
  }

  return (
    <div className="league-detail">
      <div className="league-detail__header">
        <button className="btn" onClick={() => navigate('/leagues')}>&larr; Back</button>
        <div className="league-detail__info">
          <h1 className="league-detail__name">{activeLeague.name}</h1>
          <span className={`league-detail__status league-detail__status--${activeLeague.status}`}>
            {activeLeague.status}
          </span>
        </div>
        {activeLeague.description && (
          <p className="league-detail__description">{activeLeague.description}</p>
        )}
        <div className="league-detail__meta">
          <span>Share code: <strong>{activeLeague.share_code}</strong></span>
          {activeLeague.is_public && <span className="league-detail__public">Public</span>}
        </div>
      </div>

      {error && (
        <div className="league-detail__error">
          {error}
          <button onClick={clearError}>&times;</button>
        </div>
      )}

      {/* Owner controls */}
      {isOwner && (
        <div className="league-detail__controls">
          <button
            className="league-detail__add-btn"
            onClick={() => setShowAddTournament(true)}
          >
            + Add Tournament
          </button>
          {activeLeague.status === 'active' && (
            <button
              className="league-detail__complete-btn"
              onClick={() => id && updateLeague(id, { status: 'completed' })}
            >
              Complete League
            </button>
          )}
        </div>
      )}

      {showAddTournament && (
        <div className="league-detail__add-form">
          <select
            className="league-detail__select"
            value={selectedTournamentId}
            onChange={(e) => setSelectedTournamentId(e.target.value)}
          >
            <option value="">Select a tournament...</option>
            {availableTournaments.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button className="league-detail__confirm-btn" onClick={handleAddTournament}>
            Add
          </button>
          <button className="league-detail__cancel-btn" onClick={() => setShowAddTournament(false)}>
            Cancel
          </button>
        </div>
      )}

      {/* Tournament list */}
      <div className="league-detail__section">
        <h2 className="league-detail__section-title">
          Tournaments ({activeLeague.tournaments.length})
        </h2>

        {activeLeague.tournaments.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-state__icon">&#127942;</div>
            <div className="empty-state__title">No Tournaments Linked</div>
            <p className="empty-state__description">
              {isOwner
                ? 'Link tournaments to this league to track standings across the season.'
                : 'The league owner has not linked any tournaments to this league yet.'}
            </p>
            {isOwner && (
              <div className="empty-state__action">
                <button className="btn btn--primary" onClick={() => setShowAddTournament(true)}>
                  + Add Tournament
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="league-detail__grid">
            {activeLeague.tournaments.map((lt) => (
              <div key={lt.id} className="league-detail__tournament-wrapper">
                <TournamentCard
                  tournament={lt.tournament}
                  participantCount={0}
                  onClick={() => handleTournamentClick(lt.tournament_id)}
                />
                {isOwner && (
                  <button
                    className="league-detail__remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTournament(lt.id);
                    }}
                    title="Remove from league"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
