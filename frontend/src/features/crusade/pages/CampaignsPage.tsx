import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useCrusadeStore } from '../stores/crusadeStore';
import { CampaignCard } from '../components/CampaignCard';
import { JoinCampaignModal } from '../components/JoinCampaignModal';
import type { CampaignMember } from '../../../shared/types/database';
import { supabase } from '../../../shared/lib/supabase';
import '../crusade.css';

export function CampaignsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { campaigns, loading, error, loadMyCampaigns, createCampaign, joinCampaign } = useCrusadeStore();

  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createMaxPlayers, setCreateMaxPlayers] = useState(8);
  const [createPointsLimit, setCreatePointsLimit] = useState(1000);
  const [creating, setCreating] = useState(false);
  const [memberCounts, setMemberCounts] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (user) {
      loadMyCampaigns(user.id);
    }
  }, [user, loadMyCampaigns]);

  // Load member counts for each campaign
  useEffect(() => {
    if (campaigns.length === 0) return;

    const loadCounts = async () => {
      const ids = campaigns.map((c) => c.id);
      const { data } = await supabase
        .from('campaign_members')
        .select('campaign_id')
        .in('campaign_id', ids);

      if (data) {
        const counts = new Map<string, number>();
        for (const row of data as Pick<CampaignMember, 'campaign_id'>[]) {
          counts.set(row.campaign_id, (counts.get(row.campaign_id) ?? 0) + 1);
        }
        setMemberCounts(counts);
      }
    };

    loadCounts();
  }, [campaigns]);

  const handleCreate = useCallback(async () => {
    if (!user || !createName.trim()) return;
    setCreating(true);
    const campaignId = await createCampaign(createName.trim(), user.id, {
      description: createDescription.trim() || undefined,
      max_players: createMaxPlayers,
      points_limit: createPointsLimit,
    });
    setCreating(false);
    if (campaignId) {
      setShowCreate(false);
      setCreateName('');
      setCreateDescription('');
      navigate(`/campaign/${campaignId}`);
    }
  }, [user, createName, createDescription, createMaxPlayers, createPointsLimit, createCampaign, navigate]);

  const handleJoin = useCallback(async (shareCode: string, displayName: string) => {
    if (!user) return;
    const success = await joinCampaign(shareCode, user.id, displayName);
    if (success) {
      setShowJoin(false);
    }
  }, [user, joinCampaign]);

  if (authLoading) {
    return (
      <div className="campaigns-page">
        <div className="campaigns-page__header">
          <div className="campaigns-page__title" style={{ opacity: 0.3 }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="campaigns-page">
        <div className="campaigns-page__empty">
          <div className="campaigns-page__empty-icon">&#9876;</div>
          <p className="campaigns-page__empty-text">Sign in to manage your Crusade campaigns.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="campaigns-page">
      <div className="campaigns-page__header">
        <h1 className="campaigns-page__title">Crusade Campaigns</h1>
        <div className="campaigns-page__actions">
          <button
            className="campaigns-page__create-btn"
            onClick={() => setShowCreate(!showCreate)}
            type="button"
          >
            + Create Campaign
          </button>
          <button
            className="campaigns-page__join-btn"
            onClick={() => setShowJoin(true)}
            type="button"
          >
            Join Campaign
          </button>
        </div>
      </div>

      {error && (
        <div style={{ color: 'var(--color-red-bright)', background: 'rgba(192,64,64,0.1)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(192,64,64,0.3)' }}>
          {error}
        </div>
      )}

      {/* Inline Create Form */}
      {showCreate && (
        <div className="campaign-detail__section">
          <h3 className="campaign-detail__section-title">New Campaign</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="battle-log__field">
              <label className="battle-log__label" htmlFor="campaign-name">Campaign Name</label>
              <input
                id="campaign-name"
                className="battle-log__vp-input"
                type="text"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Enter campaign name"
                style={{ textAlign: 'left' }}
                autoFocus
              />
            </div>
            <div className="battle-log__field">
              <label className="battle-log__label" htmlFor="campaign-desc">Description (optional)</label>
              <input
                id="campaign-desc"
                className="battle-log__vp-input"
                type="text"
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                placeholder="What is this campaign about?"
                style={{ textAlign: 'left' }}
              />
            </div>
            <div className="battle-log__vp-inputs">
              <div className="battle-log__vp-field">
                <label className="battle-log__vp-label" htmlFor="campaign-max-players">Max Players</label>
                <input
                  id="campaign-max-players"
                  className="battle-log__vp-input"
                  type="number"
                  min={2}
                  max={32}
                  value={createMaxPlayers}
                  onChange={(e) => setCreateMaxPlayers(Math.max(2, parseInt(e.target.value) || 2))}
                />
              </div>
              <div className="battle-log__vp-field">
                <label className="battle-log__vp-label" htmlFor="campaign-points-limit">Points Limit</label>
                <input
                  id="campaign-points-limit"
                  className="battle-log__vp-input"
                  type="number"
                  min={500}
                  max={3000}
                  step={100}
                  value={createPointsLimit}
                  onChange={(e) => setCreatePointsLimit(Math.max(500, parseInt(e.target.value) || 500))}
                />
              </div>
            </div>
            <div className="join-modal__actions">
              <button
                className="join-modal__cancel-btn"
                onClick={() => setShowCreate(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="join-modal__submit-btn"
                onClick={handleCreate}
                disabled={!createName.trim() || creating}
                type="button"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Grid */}
      {loading ? (
        <div className="campaigns-page__grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="campaign-card" style={{ opacity: 0.3, minHeight: 140, animation: 'none' }}>
              <div className="campaign-card__header">
                <div style={{ width: '60%', height: 20, background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-sm)' }} />
                <div style={{ width: 60, height: 18, background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-full)' }} />
              </div>
              <div style={{ width: '80%', height: 14, background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-sm)' }} />
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="campaigns-page__empty">
          <div className="campaigns-page__empty-icon">&#9876;</div>
          <p className="campaigns-page__empty-text">
            No campaigns yet. Create one to start your Crusade, or join an existing campaign with a share code.
          </p>
        </div>
      ) : (
        <div className="campaigns-page__grid">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              memberCount={memberCounts.get(campaign.id) ?? 0}
              onClick={() => navigate(`/campaign/${campaign.id}`)}
            />
          ))}
        </div>
      )}

      {/* Join Modal */}
      {showJoin && (
        <JoinCampaignModal
          onClose={() => setShowJoin(false)}
          onJoin={handleJoin}
        />
      )}
    </div>
  );
}
