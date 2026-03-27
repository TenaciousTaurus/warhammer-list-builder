import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useTournamentStore } from '../stores/tournamentStore';
import { TournamentCard } from '../components/TournamentCard';
import type { Tournament } from '../../../shared/types/database';
import '../social.css';

type TournamentFormat = Tournament['format'];

export function TournamentsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const {
    tournaments,
    participants,
    loading,
    error,
    loadMyTournaments,
    createTournament,
    joinTournament,
    loadTournament,
  } = useTournamentStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [createForm, setCreateForm] = useState({
    name: '',
    format: 'swiss' as TournamentFormat,
    max_players: 8,
    points_limit: 2000,
    num_rounds: 3,
  });

  useEffect(() => {
    if (user?.id) {
      loadMyTournaments(user.id);
    }
  }, [user?.id, loadMyTournaments]);

  const handleCreate = async () => {
    if (!user?.id || !createForm.name.trim()) return;

    const id = await createTournament({
      ...createForm,
      organizer_id: user.id,
    });

    if (id) {
      setShowCreateForm(false);
      setCreateForm({
        name: '',
        format: 'swiss',
        max_players: 8,
        points_limit: 2000,
        num_rounds: 3,
      });
      navigate(`/tournament/${id}`);
    }
  };

  const handleJoin = async () => {
    if (!user?.id || !joinCode.trim()) return;

    await joinTournament(joinCode.trim(), user.id, user.email ?? 'Player');
    setShowJoinModal(false);
    setJoinCode('');
  };

  const handleTournamentClick = async (tournamentId: string) => {
    await loadTournament(tournamentId);
    navigate(`/tournament/${tournamentId}`);
  };

  // Get participant counts per tournament
  const getParticipantCount = (tournamentId: string): number => {
    return participants.filter((p) => p.tournament_id === tournamentId).length;
  };

  if (authLoading || loading) {
    return (
      <div className="tournaments-page">
        <div className="tournaments-page__skeleton">
          {[1, 2, 3].map((i) => (
            <div key={i} className="tournaments-page__skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tournaments-page">
      <div className="tournaments-page__header">
        <h1 className="tournaments-page__title">Tournaments</h1>
        <div className="tournaments-page__actions">
          <button
            className="tournaments-page__create-btn"
            onClick={() => setShowCreateForm(true)}
          >
            Create Tournament
          </button>
          <button
            className="tournaments-page__join-btn"
            onClick={() => setShowJoinModal(true)}
          >
            Join Tournament
          </button>
        </div>
      </div>

      {error && <div className="tournaments-page__error">{error}</div>}

      {showCreateForm && (
        <div className="tournaments-page__create-form">
          <h2 className="tournaments-page__form-title">New Tournament</h2>
          <div className="tournaments-page__form-field">
            <label className="tournaments-page__label">Name</label>
            <input
              className="tournaments-page__input"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Tournament name..."
            />
          </div>
          <div className="tournaments-page__form-field">
            <label className="tournaments-page__label">Format</label>
            <select
              className="tournaments-page__select"
              value={createForm.format}
              onChange={(e) =>
                setCreateForm((prev) => ({
                  ...prev,
                  format: e.target.value as TournamentFormat,
                }))
              }
            >
              <option value="swiss">Swiss</option>
              <option value="single_elimination">Single Elimination</option>
              <option value="round_robin">Round Robin</option>
            </select>
          </div>
          <div className="tournaments-page__form-row">
            <div className="tournaments-page__form-field">
              <label className="tournaments-page__label">Max Players</label>
              <input
                className="tournaments-page__input"
                type="number"
                min={2}
                max={64}
                value={createForm.max_players}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    max_players: parseInt(e.target.value, 10) || 8,
                  }))
                }
              />
            </div>
            <div className="tournaments-page__form-field">
              <label className="tournaments-page__label">Points Limit</label>
              <input
                className="tournaments-page__input"
                type="number"
                min={500}
                max={3000}
                step={250}
                value={createForm.points_limit}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    points_limit: parseInt(e.target.value, 10) || 2000,
                  }))
                }
              />
            </div>
            <div className="tournaments-page__form-field">
              <label className="tournaments-page__label">Rounds</label>
              <input
                className="tournaments-page__input"
                type="number"
                min={1}
                max={10}
                value={createForm.num_rounds}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    num_rounds: parseInt(e.target.value, 10) || 3,
                  }))
                }
              />
            </div>
          </div>
          <div className="tournaments-page__form-actions">
            <button className="tournaments-page__submit-btn" onClick={handleCreate}>
              Create
            </button>
            <button
              className="tournaments-page__cancel-btn"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div className="join-modal">
          <div className="join-modal__backdrop" onClick={() => setShowJoinModal(false)} />
          <div className="join-modal__content">
            <h2 className="join-modal__title">Join Tournament</h2>
            <p className="join-modal__text">
              Enter the share code provided by the tournament organizer.
            </p>
            <input
              className="join-modal__input"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Share code..."
              autoFocus
            />
            <div className="join-modal__actions">
              <button className="join-modal__join-btn" onClick={handleJoin}>
                Join
              </button>
              <button
                className="join-modal__cancel-btn"
                onClick={() => setShowJoinModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {tournaments.length === 0 ? (
        <div className="tournaments-page__empty">
          <h2 className="tournaments-page__empty-title">No Tournaments</h2>
          <p className="tournaments-page__empty-text">
            Create a new tournament or join one with a share code.
          </p>
        </div>
      ) : (
        <div className="tournaments-page__grid">
          {tournaments.map((t) => (
            <TournamentCard
              key={t.id}
              tournament={t}
              participantCount={getParticipantCount(t.id)}
              onClick={() => handleTournamentClick(t.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
