import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useLeagueStore } from '../stores/leagueStore';
import '../social.css';

export function LeaguesPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { leagues, loading, error, loadMyLeagues, createLeague, clearError } = useLeagueStore();

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '', is_public: false });

  useEffect(() => {
    if (user?.id) loadMyLeagues(user.id);
  }, [user?.id, loadMyLeagues]);

  const handleCreate = async () => {
    if (!user?.id || !createForm.name.trim()) return;
    const id = await createLeague({ ...createForm, owner_id: user.id });
    if (id) {
      setShowCreate(false);
      setCreateForm({ name: '', description: '', is_public: false });
      navigate(`/league/${id}`);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="leagues-page">
        <div className="leagues-page__skeleton">
          {[1, 2, 3].map((i) => (
            <div key={i} className="leagues-page__skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="leagues-page">
      <div className="leagues-page__header">
        <h1 className="leagues-page__title">Leagues</h1>
        <button className="leagues-page__create-btn" onClick={() => setShowCreate(true)}>
          Create League
        </button>
      </div>

      {error && (
        <div className="leagues-page__error">
          {error}
          <button onClick={clearError} className="leagues-page__error-dismiss">&times;</button>
        </div>
      )}

      {showCreate && (
        <div className="leagues-page__create-form">
          <h2 className="leagues-page__form-title">New League</h2>
          <div className="leagues-page__form-field">
            <label className="leagues-page__label">Name</label>
            <input
              className="leagues-page__input"
              value={createForm.name}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="League name..."
            />
          </div>
          <div className="leagues-page__form-field">
            <label className="leagues-page__label">Description</label>
            <textarea
              className="leagues-page__textarea"
              value={createForm.description}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description..."
              rows={2}
            />
          </div>
          <div className="leagues-page__form-field">
            <label className="leagues-page__checkbox-label">
              <input
                type="checkbox"
                checked={createForm.is_public}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, is_public: e.target.checked }))}
              />
              Make league publicly visible
            </label>
          </div>
          <div className="leagues-page__form-actions">
            <button className="leagues-page__submit-btn" onClick={handleCreate}>Create</button>
            <button className="leagues-page__cancel-btn" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </div>
      )}

      {leagues.length === 0 ? (
        <div className="leagues-page__empty">
          <h2 className="leagues-page__empty-title">No Leagues</h2>
          <p className="leagues-page__empty-text">
            Create a league to group multiple tournaments into a season or series.
          </p>
        </div>
      ) : (
        <div className="leagues-page__grid">
          {leagues.map((league) => (
            <div
              key={league.id}
              className="league-card"
              onClick={() => navigate(`/league/${league.id}`)}
              role="button"
              tabIndex={0}
            >
              <div className="league-card__header">
                <h3 className="league-card__name">{league.name}</h3>
                <span className={`league-card__status league-card__status--${league.status}`}>
                  {league.status}
                </span>
              </div>
              {league.description && (
                <p className="league-card__description">{league.description}</p>
              )}
              <div className="league-card__meta">
                <span className="league-card__code">Code: {league.share_code}</span>
                {league.is_public && <span className="league-card__public">Public</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
