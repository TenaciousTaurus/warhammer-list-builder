import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useOrgStore } from '../stores/orgStore';
import '../social.css';

export function OrganisationsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { organisations, loading, error, loadMyOrganisations, createOrganisation, joinOrganisation, clearError } = useOrgStore();

  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [createForm, setCreateForm] = useState({ name: '', description: '', is_public: false });

  useEffect(() => {
    if (user?.id) loadMyOrganisations(user.id);
  }, [user?.id, loadMyOrganisations]);

  const handleCreate = async () => {
    if (!user?.id || !createForm.name.trim()) return;
    const id = await createOrganisation({ ...createForm, owner_id: user.id });
    if (id) {
      setShowCreate(false);
      setCreateForm({ name: '', description: '', is_public: false });
      navigate(`/organisation/${id}`);
    }
  };

  const handleJoin = async () => {
    if (!user?.id || !joinCode.trim()) return;
    await joinOrganisation(joinCode.trim(), user.id, user.email ?? 'Member');
    setShowJoin(false);
    setJoinCode('');
  };

  if (authLoading || loading) {
    return (
      <div className="orgs-page">
        <div className="orgs-page__skeleton">
          {[1, 2, 3].map((i) => (
            <div key={i} className="orgs-page__skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="orgs-page">
      <div className="orgs-page__header">
        <h1 className="orgs-page__title">Organisations</h1>
        <div className="orgs-page__actions">
          <button className="orgs-page__create-btn" onClick={() => setShowCreate(true)}>
            Create Organisation
          </button>
          <button className="orgs-page__join-btn" onClick={() => setShowJoin(true)}>
            Join Organisation
          </button>
        </div>
      </div>

      {error && (
        <div className="orgs-page__error">
          {error}
          <button onClick={clearError} className="orgs-page__error-dismiss">&times;</button>
        </div>
      )}

      {showCreate && (
        <div className="orgs-page__create-form">
          <h2 className="orgs-page__form-title">New Organisation</h2>
          <div className="orgs-page__form-field">
            <label className="orgs-page__label">Name</label>
            <input
              className="orgs-page__input"
              value={createForm.name}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Organisation name..."
            />
          </div>
          <div className="orgs-page__form-field">
            <label className="orgs-page__label">Description</label>
            <textarea
              className="orgs-page__textarea"
              value={createForm.description}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description..."
              rows={2}
            />
          </div>
          <div className="orgs-page__form-field">
            <label className="orgs-page__checkbox-label">
              <input
                type="checkbox"
                checked={createForm.is_public}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, is_public: e.target.checked }))}
              />
              Make organisation publicly visible
            </label>
          </div>
          <div className="orgs-page__form-actions">
            <button className="orgs-page__submit-btn" onClick={handleCreate}>Create</button>
            <button className="orgs-page__cancel-btn" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showJoin && (
        <div className="join-modal">
          <div className="join-modal__backdrop" onClick={() => setShowJoin(false)} />
          <div className="join-modal__content">
            <h2 className="join-modal__title">Join Organisation</h2>
            <p className="join-modal__text">Enter the share code for the organisation.</p>
            <input
              className="join-modal__input"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Share code..."
              autoFocus
            />
            <div className="join-modal__actions">
              <button className="join-modal__join-btn" onClick={handleJoin}>Join</button>
              <button className="join-modal__cancel-btn" onClick={() => setShowJoin(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {organisations.length === 0 ? (
        <div className="orgs-page__empty">
          <h2 className="orgs-page__empty-title">No Organisations</h2>
          <p className="orgs-page__empty-text">
            Create an organisation for your gaming club, community, or group.
          </p>
        </div>
      ) : (
        <div className="orgs-page__grid">
          {organisations.map((org) => (
            <div
              key={org.id}
              className="org-card"
              onClick={() => navigate(`/organisation/${org.id}`)}
              role="button"
              tabIndex={0}
            >
              <div className="org-card__header">
                <h3 className="org-card__name">{org.name}</h3>
                {org.is_public && <span className="org-card__public">Public</span>}
              </div>
              {org.description && (
                <p className="org-card__description">{org.description}</p>
              )}
              <div className="org-card__meta">
                <span className="org-card__code">Code: {org.share_code}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
