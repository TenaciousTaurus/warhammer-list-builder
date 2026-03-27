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
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
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
        <div style={{ color: 'var(--color-red-bright)', background: 'rgba(192,64,64,0.1)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(192,64,64,0.3)' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</div>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', textTransform: 'capitalize' }}>{activeCampaign.status}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Points Limit</div>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{activeCampaign.points_limit} pts</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Players</div>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{members.length} / {activeCampaign.max_players}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Created</div>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{formatDate(activeCampaign.created_at)}</div>
            </div>
          </div>

          <h3 className="campaign-detail__section-title">Members</h3>
          {members.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No members yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              {members.map((member) => (
                <div
                  key={member.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--space-sm) var(--space-md)',
                    background: 'var(--glass-bg-light)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{member.display_name}</span>
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: member.role === 'owner' ? 'var(--color-gold)' : 'var(--color-text-muted)',
                  }}>
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
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-lg)' }}>
              You are not a member of this campaign.
            </p>
          ) : !roster ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>
                You haven&apos;t created a roster yet. Go to roster management to set up your Crusade force.
              </p>
              <button
                className="campaigns-page__create-btn"
                onClick={() => navigate(`/campaign/${id}/roster/${myMember.id}`)}
                type="button"
              >
                Manage Roster
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <h3 className="campaign-detail__section-title" style={{ margin: 0 }}>{roster.name}</h3>
                <button
                  className="campaigns-page__join-btn"
                  onClick={() => navigate(`/campaign/${id}/roster/${myMember.id}`)}
                  type="button"
                >
                  Manage Roster
                </button>
              </div>
              {units.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-md)' }}>
                  No units in your roster yet.
                </p>
              ) : (
                <div className="crusade-roster__unit-list">
                  {units.map((unit) => (
                    <CrusadeUnitCard
                      key={unit.id}
                      unit={unit}
                      unitName={unit.unit_id}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <h3 className="campaign-detail__section-title" style={{ margin: 0 }}>Battle History</h3>
            <button
              className="campaigns-page__create-btn"
              onClick={() => navigate(`/campaign/${id}/battle/new`)}
              type="button"
            >
              Log Battle
            </button>
          </div>
          {battles.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-lg)' }}>
              No battles recorded yet. Log your first battle to start tracking your campaign progress.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {battles.map((battle) => {
                const p1 = members.find((m) => m.id === battle.player1_member_id);
                const p2 = members.find((m) => m.id === battle.player2_member_id);
                const winner = battle.is_draw
                  ? null
                  : members.find((m) => m.id === battle.winner_member_id);

                return (
                  <div
                    key={battle.id}
                    className="campaign-leaderboard__row"
                    style={{ gridTemplateColumns: '1fr auto', cursor: 'pointer' }}
                    onClick={() => navigate(`/campaign/${id}/battle/${battle.id}`)}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {p1?.display_name ?? 'Unknown'} vs {p2?.display_name ?? 'Unknown'}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        {formatDate(battle.played_at)}
                        {battle.is_draw ? ' - Draw' : winner ? ` - ${winner.display_name} won` : ''}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-gold)' }}>
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
