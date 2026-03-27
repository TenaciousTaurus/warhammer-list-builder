import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrusadeStore } from '../stores/crusadeStore';
import { XPProgressBar } from '../components/XPProgressBar';
import { HonourScarEditor } from '../components/HonourScarEditor';
import type { BattleHonour, BattleScar } from '../../../shared/types/database';
import '../crusade.css';

const RANK_LABELS: Record<string, string> = {
  battle_ready: 'Battle Ready',
  blooded: 'Blooded',
  battle_hardened: 'Battle Hardened',
  heroic: 'Heroic',
  legendary: 'Legendary',
};

export function CrusadeUnitDetailPage() {
  const { id: campaignId, unitId } = useParams<{ id: string; unitId: string }>();
  const navigate = useNavigate();
  const { units, updateUnit, addHonour, addScar, removeScar, removeUnit, error } = useCrusadeStore();

  const unit = units.find((u) => u.id === unitId);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (unit) {
      setNotes(unit.notes ?? '');
    }
  }, [unit]);

  const handleSaveNotes = useCallback(async () => {
    if (!unitId) return;
    await updateUnit(unitId, { notes: notes.trim() || null });
    setEditingNotes(false);
  }, [unitId, notes, updateUnit]);

  const handleAddHonour = useCallback(async (honour: BattleHonour) => {
    if (!unitId) return;
    await addHonour(unitId, honour);
  }, [unitId, addHonour]);

  const handleAddScar = useCallback(async (scar: BattleScar) => {
    if (!unitId) return;
    await addScar(unitId, scar);
  }, [unitId, addScar]);

  const handleRemoveScar = useCallback(async (scarIndex: number) => {
    if (!unitId) return;
    await removeScar(unitId, scarIndex);
  }, [unitId, removeScar]);

  const handleDelete = useCallback(async () => {
    if (!unitId) return;
    await removeUnit(unitId);
    navigate(`/campaign/${campaignId}`);
  }, [unitId, campaignId, removeUnit, navigate]);

  if (!unit) {
    return (
      <div className="crusade-roster">
        <div className="campaigns-page__empty">
          <div className="campaigns-page__empty-icon">&#10067;</div>
          <p className="campaigns-page__empty-text">Unit not found.</p>
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

  const displayName = unit.custom_name || unit.unit_id;

  return (
    <div className="crusade-roster">
      {/* Destroyed Banner */}
      {unit.is_destroyed && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-md)',
          background: 'rgba(192,64,64,0.15)',
          border: '1px solid rgba(192,64,64,0.3)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--color-red-bright)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'var(--text-md)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          Unit Destroyed
        </div>
      )}

      {/* Header */}
      <div className="crusade-roster__header">
        <h1 className="crusade-roster__name" style={unit.is_destroyed ? { textDecoration: 'line-through', opacity: 0.6 } : undefined}>
          {displayName}
        </h1>
        <span className={`crusade-unit-card__rank-badge crusade-unit-card__rank-badge--${unit.rank}`}>
          {RANK_LABELS[unit.rank] ?? unit.rank}
        </span>
      </div>

      {error && (
        <div style={{ color: 'var(--color-red-bright)', background: 'rgba(192,64,64,0.1)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(192,64,64,0.3)' }}>
          {error}
        </div>
      )}

      {/* XP Bar */}
      <div className="campaign-detail__section">
        <h3 className="campaign-detail__section-title">Experience</h3>
        <XPProgressBar xp={unit.xp} rank={unit.rank} />
      </div>

      {/* Stats */}
      <div className="campaign-detail__section">
        <h3 className="campaign-detail__section-title">Combat Record</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--space-md)' }}>
          <div className="crusade-unit-card__stat">
            <span className="crusade-unit-card__stat-value">{unit.battles_played}</span>
            <span className="crusade-unit-card__stat-label">Battles Played</span>
          </div>
          <div className="crusade-unit-card__stat">
            <span className="crusade-unit-card__stat-value">{unit.battles_survived}</span>
            <span className="crusade-unit-card__stat-label">Survived</span>
          </div>
          <div className="crusade-unit-card__stat">
            <span className="crusade-unit-card__stat-value">{unit.kills}</span>
            <span className="crusade-unit-card__stat-label">Total Kills</span>
          </div>
          <div className="crusade-unit-card__stat">
            <span className="crusade-unit-card__stat-value">{unit.points_cost}</span>
            <span className="crusade-unit-card__stat-label">Points</span>
          </div>
          <div className="crusade-unit-card__stat">
            <span className="crusade-unit-card__stat-value">{unit.model_count}</span>
            <span className="crusade-unit-card__stat-label">Models</span>
          </div>
        </div>
      </div>

      {/* Honours & Scars */}
      <div className="campaign-detail__section">
        <HonourScarEditor
          honours={unit.honours}
          scars={unit.scars}
          onAddHonour={handleAddHonour}
          onAddScar={handleAddScar}
          onRemoveScar={handleRemoveScar}
        />
      </div>

      {/* Notes */}
      <div className="campaign-detail__section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <h3 className="campaign-detail__section-title" style={{ margin: 0 }}>Notes</h3>
          {!editingNotes && (
            <button
              className="campaigns-page__join-btn"
              onClick={() => setEditingNotes(true)}
              type="button"
              style={{ fontSize: 'var(--text-xs)' }}
            >
              Edit
            </button>
          )}
        </div>
        {editingNotes ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <textarea
              className="battle-log__vp-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add notes about this unit..."
              style={{ textAlign: 'left', resize: 'vertical', fontFamily: 'inherit', fontSize: 'var(--text-sm)' }}
              autoFocus
            />
            <div className="join-modal__actions">
              <button className="join-modal__cancel-btn" onClick={() => { setEditingNotes(false); setNotes(unit.notes ?? ''); }} type="button">
                Cancel
              </button>
              <button className="join-modal__submit-btn" onClick={handleSaveNotes} type="button">
                Save
              </button>
            </div>
          </div>
        ) : (
          <p style={{ color: unit.notes ? 'var(--color-text-secondary)' : 'var(--color-text-muted)', fontSize: 'var(--text-sm)', whiteSpace: 'pre-wrap' }}>
            {unit.notes || 'No notes yet.'}
          </p>
        )}
      </div>

      {/* Danger Zone */}
      <div className="campaign-detail__section" style={{ borderColor: 'rgba(192,64,64,0.2)' }}>
        <h3 className="campaign-detail__section-title" style={{ color: 'var(--color-red-bright)' }}>Danger Zone</h3>
        {!confirmDelete ? (
          <button
            className="campaigns-page__join-btn"
            onClick={() => setConfirmDelete(true)}
            type="button"
            style={{ borderColor: 'rgba(192,64,64,0.3)', color: 'var(--color-red-bright)' }}
          >
            Remove Unit from Roster
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Are you sure?</span>
            <button className="join-modal__cancel-btn" onClick={() => setConfirmDelete(false)} type="button">
              Cancel
            </button>
            <button
              className="join-modal__submit-btn"
              onClick={handleDelete}
              type="button"
              style={{ background: 'linear-gradient(135deg, var(--color-red) 0%, var(--color-red-bright) 100%)' }}
            >
              Confirm Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
