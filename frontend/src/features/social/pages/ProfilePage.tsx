import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useSocialStore } from '../stores/socialStore';
import type { UserProfile } from '../../../shared/types/database';
import '../social.css';

export function ProfilePage() {
  const { id } = useParams<{ id?: string }>();
  const { user, loading: authLoading } = useAuth();
  const { profile, stats, loading, error, loadProfile, updateProfile, loadStats } =
    useSocialStore();

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<{
    display_name: string;
    bio: string;
    preferred_factions: string[];
  }>({ display_name: '', bio: '', preferred_factions: [] });

  const viewedUserId = id ?? user?.id;
  const isOwnProfile = !id || id === user?.id;

  useEffect(() => {
    if (viewedUserId) {
      loadProfile(viewedUserId);
      loadStats(viewedUserId);
    }
  }, [viewedUserId, loadProfile, loadStats]);

  useEffect(() => {
    if (profile && editing) {
      setEditForm({
        display_name: profile.display_name,
        bio: profile.bio ?? '',
        preferred_factions: profile.preferred_factions ?? [],
      });
    }
  }, [profile, editing]);

  const handleSave = async () => {
    const updates: Partial<UserProfile> = {
      display_name: editForm.display_name,
      bio: editForm.bio || null,
      preferred_factions: editForm.preferred_factions,
    };
    await updateProfile(updates);
    setEditing(false);
  };

  const handleFactionInput = (value: string) => {
    const factions = value.split(',').map((f) => f.trim()).filter(Boolean);
    setEditForm((prev) => ({ ...prev, preferred_factions: factions }));
  };

  if (authLoading || loading) {
    return (
      <div className="profile-page">
        <div className="profile-page__skeleton">
          <div className="profile-page__skeleton-avatar" />
          <div className="profile-page__skeleton-line" />
          <div className="profile-page__skeleton-line profile-page__skeleton-line--short" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-page__error">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-page__empty">Profile not found.</div>
      </div>
    );
  }

  const initial = profile.display_name?.charAt(0)?.toUpperCase() ?? '?';
  const winRate = stats ? stats.win_rate : 0;
  const record = stats
    ? `${stats.wins}W - ${stats.losses}L - ${stats.draws}D`
    : '0W - 0L - 0D';

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-card__header">
          <div className="profile-card__avatar">{initial}</div>
          <div className="profile-card__info">
            {editing ? (
              <input
                className="profile-card__edit-input"
                value={editForm.display_name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, display_name: e.target.value }))
                }
                placeholder="Display Name"
              />
            ) : (
              <h1 className="profile-card__name">{profile.display_name}</h1>
            )}
            {editing ? (
              <textarea
                className="profile-card__edit-textarea"
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="Write a bio..."
                rows={3}
              />
            ) : (
              <p className="profile-card__bio">{profile.bio ?? 'No bio yet.'}</p>
            )}
          </div>
          {isOwnProfile && !editing && (
            <button className="profile-card__edit-btn" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          )}
          {editing && (
            <div className="profile-card__edit-actions">
              <button className="profile-card__save-btn" onClick={handleSave}>
                Save
              </button>
              <button className="profile-card__cancel-btn" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>

        {editing && (
          <div className="profile-card__factions-edit">
            <label className="profile-card__label">Preferred Factions (comma-separated)</label>
            <input
              className="profile-card__edit-input"
              value={editForm.preferred_factions.join(', ')}
              onChange={(e) => handleFactionInput(e.target.value)}
              placeholder="Space Marines, Orks, Necrons"
            />
          </div>
        )}

        {!editing && profile.preferred_factions.length > 0 && (
          <div className="profile-card__factions">
            {profile.preferred_factions.map((faction) => (
              <span key={faction} className="profile-card__faction-badge">
                {faction}
              </span>
            ))}
          </div>
        )}

        <div className="profile-card__stats-row">
          <div className="profile-card__stat">
            <span className="profile-card__stat-value">{stats?.total_games ?? 0}</span>
            <span className="profile-card__stat-label">Games</span>
          </div>
          <div className="profile-card__stat">
            <span className="profile-card__stat-value">{Math.round(winRate * 100)}%</span>
            <span className="profile-card__stat-label">Win Rate</span>
          </div>
          <div className="profile-card__stat">
            <span className="profile-card__stat-value">{record}</span>
            <span className="profile-card__stat-label">Record</span>
          </div>
        </div>
      </div>
    </div>
  );
}
