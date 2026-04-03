import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useOrgStore } from '../stores/orgStore';
import '../social.css';

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
};

export function OrganisationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    activeOrg, members, loading, error,
    loadOrganisation, updateMemberRole, removeMember, leaveOrganisation, clearError,
  } = useOrgStore();

  useEffect(() => {
    if (id) loadOrganisation(id);
  }, [id, loadOrganisation]);

  const currentMember = members.find((m) => m.user_id === user?.id);
  const isOwner = activeOrg?.owner_id === user?.id;
  const isAdmin = isOwner || currentMember?.role === 'admin';

  const handleLeave = async () => {
    if (!currentMember || isOwner) return;
    await leaveOrganisation(currentMember.id);
    navigate('/organisations');
  };

  if (loading || !activeOrg) {
    return (
      <div className="org-detail">
        <div className="skeleton" style={{ height: '200px', width: '100%' }} />
      </div>
    );
  }

  return (
    <div className="org-detail">
      <div className="org-detail__header">
        <button className="btn" onClick={() => navigate('/organisations')}>&larr; Back</button>
        <div className="org-detail__info">
          <h1 className="org-detail__name">{activeOrg.name}</h1>
          {activeOrg.is_public && <span className="org-detail__public">Public</span>}
        </div>
        {activeOrg.description && (
          <p className="org-detail__description">{activeOrg.description}</p>
        )}
        <div className="org-detail__meta">
          <span>Share code: <strong>{activeOrg.share_code}</strong></span>
          <span>{members.length} member{members.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {error && (
        <div className="org-detail__error">
          {error}
          <button onClick={clearError}>&times;</button>
        </div>
      )}

      {currentMember && !isOwner && (
        <div className="org-detail__controls">
          <button className="org-detail__leave-btn" onClick={handleLeave}>
            Leave Organisation
          </button>
        </div>
      )}

      <div className="org-detail__section">
        <h2 className="org-detail__section-title">Members ({members.length})</h2>
        <div className="org-detail__members">
          {members.map((m) => (
            <div key={m.id} className="org-member">
              <div className="org-member__info">
                <span className="org-member__name">{m.display_name}</span>
                <span className={`org-member__role org-member__role--${m.role}`}>
                  {ROLE_LABELS[m.role] ?? m.role}
                </span>
              </div>
              {isAdmin && m.user_id !== user?.id && m.role !== 'owner' && (
                <div className="org-member__actions">
                  <select
                    className="org-member__role-select"
                    value={m.role}
                    onChange={(e) => updateMemberRole(m.id, e.target.value as 'admin' | 'member')}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    className="org-member__remove"
                    onClick={() => removeMember(m.id)}
                    title="Remove member"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
