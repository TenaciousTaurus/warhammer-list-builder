import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useCrusadeStore } from '../stores/crusadeStore';
import { PostBattleSequence } from '../components/PostBattleSequence';
import '../crusade.css';

export function BattleLogPage() {
  const { id: campaignId, battleId } = useParams<{ id: string; battleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    members,
    units,
    battles,
    error,
    loadCampaign,
    loadRoster,
    logBattle,
  } = useCrusadeStore();

  const isNew = battleId === 'new';

  // Form state for new battle
  const [opponentId, setOpponentId] = useState('');
  const [missionName, setMissionName] = useState('');
  const [myVP, setMyVP] = useState(0);
  const [opponentVP, setOpponentVP] = useState(0);
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
  const [battleNotes, setBattleNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdBattleId, setCreatedBattleId] = useState<string | null>(null);

  const myMember = members.find((m) => m.user_id === user?.id);
  const opponents = members.filter((m) => m.user_id !== user?.id);

  useEffect(() => {
    if (campaignId) {
      loadCampaign(campaignId);
    }
  }, [campaignId, loadCampaign]);

  // Load roster for unit selection
  useEffect(() => {
    if (myMember) {
      loadRoster(myMember.id);
    }
  }, [myMember, loadRoster]);

  const toggleUnit = (unitId: string) => {
    setSelectedUnits((prev) => {
      const next = new Set(prev);
      if (next.has(unitId)) {
        next.delete(unitId);
      } else {
        next.add(unitId);
      }
      return next;
    });
  };

  const handleSubmit = useCallback(async () => {
    if (!myMember || !opponentId || !campaignId) return;
    setSubmitting(true);

    const isDraw = myVP === opponentVP;
    const winnerId = isDraw ? null : (myVP > opponentVP ? myMember.id : opponentId);

    const newBattleId = await logBattle({
      campaign_id: campaignId,
      player1_member_id: myMember.id,
      player2_member_id: opponentId,
      player1_vp: myVP,
      player2_vp: opponentVP,
      winner_member_id: winnerId,
      is_draw: isDraw,
      mission_id: null,
      notes: battleNotes.trim() || null,
    });

    setSubmitting(false);

    if (newBattleId) {
      setCreatedBattleId(newBattleId);
    }
  }, [myMember, opponentId, campaignId, myVP, opponentVP, battleNotes, logBattle]);

  const handlePostBattleComplete = useCallback(() => {
    navigate(`/campaign/${campaignId}`);
  }, [campaignId, navigate]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show post-battle sequence after logging
  if (createdBattleId) {
    return (
      <div className="crusade-roster">
        <h1 className="crusade-roster__name">Post-Battle Sequence</h1>
        <PostBattleSequence
          battleId={createdBattleId}
          campaignId={campaignId ?? ''}
          onComplete={handlePostBattleComplete}
        />
      </div>
    );
  }

  // Show existing battle details
  if (!isNew && battleId) {
    const battle = battles.find((b) => b.id === battleId);

    if (!battle) {
      return (
        <div className="crusade-roster">
          <div className="campaigns-page__empty">
            <div className="campaigns-page__empty-icon">&#10067;</div>
            <p className="campaigns-page__empty-text">Battle not found.</p>
            <button
              className="campaigns-page__join-btn"
              onClick={() => navigate(`/campaign/${campaignId}`)}
              type="button"
            >
              Back to Campaign
            </button>
          </div>
        </div>
      );
    }

    const p1 = members.find((m) => m.id === battle.player1_member_id);
    const p2 = members.find((m) => m.id === battle.player2_member_id);
    const winner = battle.is_draw ? null : members.find((m) => m.id === battle.winner_member_id);

    return (
      <div className="crusade-roster">
        <h1 className="crusade-roster__name">Battle Details</h1>

        <div className="campaign-detail__section">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 'var(--space-lg)', alignItems: 'center', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-xs)' }}>Player 1</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-text-primary)', fontSize: 'var(--text-md)' }}>
                {p1?.display_name ?? 'Unknown'}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-gold)', fontSize: 'var(--text-2xl)', marginTop: 'var(--space-xs)' }}>
                {battle.player1_vp}
              </div>
            </div>

            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-text-muted)', fontSize: 'var(--text-lg)' }}>
              VS
            </div>

            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-xs)' }}>Player 2</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-text-primary)', fontSize: 'var(--text-md)' }}>
                {p2?.display_name ?? 'Unknown'}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-gold)', fontSize: 'var(--text-2xl)', marginTop: 'var(--space-xs)' }}>
                {battle.player2_vp}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--glass-bg-light)', borderRadius: 'var(--radius-md)' }}>
            {battle.is_draw ? (
              <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>Draw</span>
            ) : (
              <span style={{ color: 'var(--color-green-bright)', fontWeight: 600 }}>
                {winner?.display_name ?? 'Unknown'} wins
              </span>
            )}
          </div>

          <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            Played: {formatDate(battle.played_at)}
          </div>

          {battle.notes && (
            <div style={{ marginTop: 'var(--space-md)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-xs)' }}>Notes</div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', whiteSpace: 'pre-wrap' }}>{battle.notes}</p>
            </div>
          )}
        </div>

        <button
          className="campaigns-page__join-btn"
          onClick={() => navigate(`/campaign/${campaignId}`)}
          type="button"
        >
          Back to Campaign
        </button>
      </div>
    );
  }

  // New battle form
  return (
    <div className="crusade-roster">
      <h1 className="crusade-roster__name">Log Battle</h1>

      {error && (
        <div style={{ color: 'var(--color-red-bright)', background: 'rgba(192,64,64,0.1)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(192,64,64,0.3)' }}>
          {error}
        </div>
      )}

      <div className="battle-log">
        {/* Opponent Selection */}
        <div className="battle-log__field">
          <label className="battle-log__label" htmlFor="battle-opponent">Opponent</label>
          <select
            id="battle-opponent"
            className="battle-log__opponent-select"
            value={opponentId}
            onChange={(e) => setOpponentId(e.target.value)}
          >
            <option value="">-- Select opponent --</option>
            {opponents.map((member) => (
              <option key={member.id} value={member.id}>{member.display_name}</option>
            ))}
          </select>
        </div>

        {/* Mission */}
        <div className="battle-log__field">
          <label className="battle-log__label" htmlFor="battle-mission">Mission (optional)</label>
          <input
            id="battle-mission"
            className="battle-log__vp-input"
            type="text"
            value={missionName}
            onChange={(e) => setMissionName(e.target.value)}
            placeholder="Enter mission name"
            style={{ textAlign: 'left' }}
          />
        </div>

        {/* Participating Units */}
        <div className="battle-log__field">
          <label className="battle-log__label">Participating Units</label>
          <div className="battle-log__unit-select">
            {units.filter((u) => !u.is_destroyed).map((unit) => (
              <label key={unit.id} className="battle-log__unit-option">
                <input
                  type="checkbox"
                  checked={selectedUnits.has(unit.id)}
                  onChange={() => toggleUnit(unit.id)}
                />
                <span className="battle-log__unit-option-label">
                  {unit.custom_name || unit.unit_id}
                </span>
              </label>
            ))}
            {units.filter((u) => !u.is_destroyed).length === 0 && (
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-md)' }}>
                No active units in your roster.
              </p>
            )}
          </div>
        </div>

        {/* VP Scores */}
        <div className="battle-log__vp-inputs">
          <div className="battle-log__vp-field">
            <label className="battle-log__vp-label" htmlFor="my-vp">Your VP</label>
            <input
              id="my-vp"
              className="battle-log__vp-input"
              type="number"
              min={0}
              max={100}
              value={myVP}
              onChange={(e) => setMyVP(Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>
          <div className="battle-log__vp-field">
            <label className="battle-log__vp-label" htmlFor="opponent-vp">Opponent VP</label>
            <input
              id="opponent-vp"
              className="battle-log__vp-input"
              type="number"
              min={0}
              max={100}
              value={opponentVP}
              onChange={(e) => setOpponentVP(Math.max(0, parseInt(e.target.value) || 0))}
            />
          </div>
        </div>

        {/* Result Preview */}
        {opponentId && (
          <div className="battle-log__result">
            <div className={`battle-log__result-option battle-log__result-option--win${myVP > opponentVP ? ' battle-log__result-option--selected' : ''}`}>
              Win
            </div>
            <div className={`battle-log__result-option battle-log__result-option--draw${myVP === opponentVP ? ' battle-log__result-option--selected' : ''}`}>
              Draw
            </div>
            <div className={`battle-log__result-option battle-log__result-option--loss${myVP < opponentVP ? ' battle-log__result-option--selected' : ''}`}>
              Loss
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="battle-log__field">
          <label className="battle-log__label" htmlFor="battle-notes">Notes (optional)</label>
          <textarea
            id="battle-notes"
            className="battle-log__vp-input"
            value={battleNotes}
            onChange={(e) => setBattleNotes(e.target.value)}
            rows={3}
            placeholder="Battle highlights, memorable moments..."
            style={{ textAlign: 'left', resize: 'vertical', fontFamily: 'inherit', fontSize: 'var(--text-sm)' }}
          />
        </div>

        {/* Actions */}
        <div className="post-battle__actions">
          <button
            className="post-battle__prev-btn"
            onClick={() => navigate(`/campaign/${campaignId}`)}
            type="button"
          >
            Cancel
          </button>
          <button
            className="post-battle__next-btn"
            onClick={handleSubmit}
            disabled={!opponentId || submitting}
            type="button"
          >
            {submitting ? 'Logging...' : 'Log Battle'}
          </button>
        </div>
      </div>
    </div>
  );
}
