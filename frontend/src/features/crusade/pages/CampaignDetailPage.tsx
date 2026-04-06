import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useCrusadeStore } from '../stores/crusadeStore';
import { useCampaignRealtime } from '../hooks/useCampaignRealtime';
import { CampaignLeaderboard } from '../components/CampaignLeaderboard';
import { CrusadeUnitCard } from '../components/CrusadeUnitCard';
import type { CampaignMember } from '../../../shared/types/database';
import '../crusade.css';

type TabId = 'overview' | 'roster' | 'battles' | 'leaderboard';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'roster', label: 'Roster' },
  { id: 'battles', label: 'Battles' },
  { id: 'leaderboard', label: 'Leaderboard' },
];

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    activeCampaign,
    members,
    roster,
    units,
    battles,
    loading,
    error,
    loadCampaign,
    loadRoster,
  } = useCrusadeStore();

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [copied, setCopied] = useState(false);

  useCampaignRealtime(id ?? '');

  // Find current user's membership
  const myMember: CampaignMember | undefined = members.find((m) => m.user_id === user?.id);

  useEffect(() => {
    if (id) {
      loadCampaign(id);
    }
  }, [id, loadCampaign]);

  // Load roster when switching to roster tab or when myMember becomes available
  useEffect(() => {
    if (activeTab === 'roster' && myMember) {
      loadRoster(myMember.id);
    }
  }, [activeTab, myMember, loadRoster]);

  const handleCopyCode = useCallback(async () => {
    if (!activeCampaign) return;
    try {
      await navigator.clipboard.writeText(activeCampaign.share_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
    }
  }, [activeCampaign]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && !activeCampaign) {
    return (
      <div className="campaign-detail">
        <div className="campaign-detail__header">
          <div style={{ width: '40%', height: 32, background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-sm)', opacity: 0.3 }} />
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          {TABS.map((t) => (
            <div key={t.id} style={{ width: 80, height: 32, background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-sm)', opacity: 0.2 }} />
          ))}
        </div>
        <div className="campaign-detail__section" style={{ minHeight: 200, opacity: 0.3 }} />
      </div>
    );
  }

  if (!activeCampaign) {
    return (
      <div className="campaign-detail">
        <div className="campaigns-page__empty">
          <div className="campaigns-page__empty-icon">&#10067;</div>
          <p className="campaigns-page__empty-text">Campaign not found.</p>
          <button className="campaigns-page__join-btn" onClick={() => navigate('/campaigns')} type="button">
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="campaign-detail">
      {/* Header */}
      <div className="campaign-detail__header">
        <div>
          <h1 className="campaign-detail__title">{activeCampaign.name}</h1>
          {activeCampaign.description && (
            <p className="campaign-detail__description">
              {activeCampaign.description}
            </p>
          )}
        </div>
        <div className="campaign-detail__header-actions">
          <div className="campaign-detail__share-code">
            <span className="campaign-detail__share-code-text">{activeCampaign.share_code}</span>
            <button
              className="campaign-detail__share-code-copy"
              onClick={handleCopyCode}
              type="button"
              title="Copy share code"
            >
              {copied ? '&#10003;' : '&#9998;'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="validation-banner validation-banner--error">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="campaign-detail__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`campaign-detail__tab${activeTab === tab.id ? ' campaign-detail__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="campaign-detail__section">
          <h3 className="campaign-detail__section-title">Campaign Info</h3>
          <div className="campaign-detail__info-grid">
            <div>
              <div className="campaign-detail__stat-label">Status</div>
              <div className="campaign-detail__stat-value campaign-detail__stat-value--capitalize">{activeCampaign.status}</div>
            </div>
            <div>
              <div className="campaign-detail__stat-label">Points Limit</div>
              <div className="campaign-detail__stat-value">{activeCampaign.points_limit} pts</div>
            </div>
            <div>
              <div className="campaign-detail__stat-label">Players</div>
              <div className="campaign-detail__stat-value">{members.length} / {activeCampaign.max_players}</div>
            </div>
            <div>
              <div className="campaign-detail__stat-label">Created</div>
              <div className="campaign-detail__stat-value">{formatDate(activeCampaign.created_at)}</div>
            </div>
          </div>

          <h3 className="campaign-detail__section-title">Members</h3>
          {members.length === 0 ? (
            <p className="campaign-detail__empty">No members yet.</p>
          ) : (
            <div className="campaign-detail__member-list">
              {members.map((member) => (
                <div key={member.id} className="campaign-detail__member-row">
                  <span className="campaign-detail__member-name">{member.display_name}</span>
                  <span className={`campaign-detail__member-role${member.role === 'owner' ? ' campaign-detail__member-role--owner' : ''}`}>
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'roster' && (
        <div className="campaign-detail__section">
          {!myMember ? (
            <p className="campaign-detail__empty">
              You are not a member of this campaign.
            </p>
          ) : !roster ? (
            <div className="campaign-detail__empty">
              <p>
                You haven&apos;t created a roster yet. Go to roster management to set up your Crusade force.
              </p>
              <button
                className="btn btn--primary"
                onClick={() => navigate(`/campaign/${id}/roster/${myMember.id}`)}
                type="button"
              >
                Manage Roster
              </button>
            </div>
          ) : (
            <>
              <div className="campaign-detail__section-header">
                <h3 className="campaign-detail__section-title">{roster.name}</h3>
                <button
                  className="btn"
                  onClick={() => navigate(`/campaign/${id}/roster/${myMember.id}`)}
                  type="button"
                >
                  Manage Roster
                </button>
              </div>
              {units.length === 0 ? (
                <p className="campaign-detail__empty">
                  No units in your roster yet.
                </p>
              ) : (
                <div className="crusade-roster__unit-list">
                  {units.map((unit) => (
                    <CrusadeUnitCard
                      key={unit.id}
                      unit={unit}
                      unitName={unit.custom_name || unit.units?.name || 'Unknown Unit'}
                      onClick={() => navigate(`/campaign/${id}/unit/${unit.id}`)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'battles' && (
        <div className="campaign-detail__section">
          <div className="campaign-detail__section-header">
            <h3 className="campaign-detail__section-title">Battle History</h3>
            <button
              className="btn btn--primary"
              onClick={() => navigate(`/campaign/${id}/battle/new`)}
              type="button"
            >
              Log Battle
            </button>
          </div>
          {battles.length === 0 ? (
            <p className="campaign-detail__empty">
              No battles recorded yet. Log your first battle to start tracking your campaign progress.
            </p>
          ) : (
            <div className="campaign-detail__battle-list">
              {battles.map((battle) => {
                const p1 = members.find((m) => m.id === battle.player1_member_id);
                const p2 = members.find((m) => m.id === battle.player2_member_id);
                const winner = battle.is_draw
                  ? null
                  : members.find((m) => m.id === battle.winner_member_id);

                return (
                  <div
                    key={battle.id}
                    className="campaign-detail__battle-row"
                    onClick={() => navigate(`/campaign/${id}/battle/${battle.id}`)}
                  >
                    <div>
                      <div className="campaign-detail__battle-players">
                        {p1?.display_name ?? 'Unknown'} vs {p2?.display_name ?? 'Unknown'}
                      </div>
                      <div className="campaign-detail__battle-meta">
                        {formatDate(battle.played_at)}
                        {battle.is_draw ? ' - Draw' : winner ? ` - ${winner.display_name} won` : ''}
                      </div>
                    </div>
                    <div className="campaign-detail__battle-score">
                      {battle.player1_vp} - {battle.player2_vp}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="campaign-detail__section">
          <h3 className="campaign-detail__section-title">Leaderboard</h3>
          <CampaignLeaderboard members={members} battles={battles} />
        </div>
      )}
    </div>
  );
}
