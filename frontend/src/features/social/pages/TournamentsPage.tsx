import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useTournamentStore } from '../stores/tournamentStore';
import { TournamentCard } from '../components/TournamentCard';
import { TournamentFilters } from '../components/TournamentFilters';
import { WelcomeBanner } from '../../../shared/components/WelcomeBanner';
import type { Tournament } from '../../../shared/types/database';
import '../social.css';

type TournamentFormat = Tournament['format'];
type TournamentStatus = Tournament['status'];
type Tab = 'mine' | 'browse';

export function TournamentsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const {
    tournaments,
    publicTournaments,
    participants,
    loading,
    error,
    loadMyTournaments,
    loadPublicTournaments,
    createTournament,
    joinTournament,
    loadTournament,
  } = useTournamentStore();

  const [tab, setTab] = useState<Tab>('mine');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    format: 'swiss' as TournamentFormat,
    max_players: 8,
    points_limit: 2000,
    num_rounds: 3,
    is_public: false,
  });

  // Filters
  const [nameQuery, setNameQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState<TournamentFormat | ''>('');
  const [statusFilter, setStatusFilter] = useState<TournamentStatus | ''>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  useEffect(() => {
    if (user?.id) {
      loadMyTournaments(user.id);
    }
  }, [user?.id, loadMyTournaments]);

  useEffect(() => {
    if (tab === 'browse') {
      loadPublicTournaments();
    }
  }, [tab, loadPublicTournaments]);

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
        description: '',
        format: 'swiss',
        max_players: 8,
        points_limit: 2000,
        num_rounds: 3,
        is_public: false,
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

  const getParticipantCount = (tournamentId: string): number => {
    return participants.filter((p) => p.tournament_id === tournamentId).length;
  };

  // Apply filters and sorting
  const sourceList = tab === 'mine' ? tournaments : publicTournaments;

  const filteredTournaments = useMemo(() => {
    let result = sourceList;

    if (nameQuery) {
      const q = nameQuery.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }
    if (formatFilter) {
      result = result.filter((t) => t.format === formatFilter);
    }
    if (statusFilter) {
      result = result.filter((t) => t.status === statusFilter);
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [sourceList, nameQuery, formatFilter, statusFilter, sortBy]);

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
      <WelcomeBanner bannerKey="tournaments-intro" title="What are Tournaments?">
        Run Swiss, Single Elimination, or Round Robin events with automated
        pairings and standings. Create your own and invite players with a share
        code, or browse public tournaments to enter one.
      </WelcomeBanner>

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

      {/* Tabs */}
      <div className="tournaments-page__tabs">
        <button
          className={`tournaments-page__tab ${tab === 'mine' ? 'tournaments-page__tab--active' : ''}`}
          onClick={() => setTab('mine')}
        >
          My Tournaments
        </button>
        <button
          className={`tournaments-page__tab ${tab === 'browse' ? 'tournaments-page__tab--active' : ''}`}
          onClick={() => setTab('browse')}
        >
          Browse All
        </button>
      </div>

      {/* Filters */}
      <TournamentFilters
        nameQuery={nameQuery}
        formatFilter={formatFilter}
        statusFilter={statusFilter}
        sortBy={sortBy}
        onNameChange={setNameQuery}
        onFormatChange={setFormatFilter}
        onStatusChange={setStatusFilter}
        onSortChange={setSortBy}
      />

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
            <label className="tournaments-page__label">Description (optional)</label>
            <textarea
              className="tournaments-page__textarea"
              value={createForm.description}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Tournament description..."
              rows={2}
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
          <div className="tournaments-page__form-field">
            <label className="tournaments-page__checkbox-label">
              <input
                type="checkbox"
                checked={createForm.is_public}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, is_public: e.target.checked }))
                }
              />
              Make tournament publicly visible
            </label>
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

      {filteredTournaments.length === 0 ? (
        <div className="tournaments-page__empty">
          <h2 className="tournaments-page__empty-title">
            {tab === 'mine' ? 'No Tournaments' : 'No Public Tournaments'}
          </h2>
          <p className="tournaments-page__empty-text">
            {tab === 'mine'
              ? 'Create a new tournament or join one with a share code.'
              : 'No public tournaments are available right now.'}
          </p>
        </div>
      ) : (
        <div className="tournaments-page__grid">
          {filteredTournaments.map((t) => (
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
