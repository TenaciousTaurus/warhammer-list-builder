import { useState, useCallback } from 'react';
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
  const [notes, setNotes] = useState(unit?.notes ?? '');
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  const displayName = unit.custom_name || unit.units?.name || 'Unknown Unit';

  return (
    <div className="crusade-roster">
      {/* Destroyed Banner */}
      {unit.is_destroyed && (
        <div className="crusade-unit-detail__destroyed-banner">
          Unit Destroyed
        </div>
      )}

      {/* Header */}
      <div className="crusade-roster__header">
        <h1 className={`crusade-roster__name${unit.is_destroyed ? ' crusade-unit-detail__name--destroyed' : ''}`}>
          {displayName}
        </h1>
        <span className={`crusade-unit-card__rank-badge crusade-unit-card__rank-badge--${unit.rank}`}>
          {RANK_LABELS[unit.rank] ?? unit.rank}
        </span>
      </div>

      {error && (
        <div className="validation-banner validation-banner--error">
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
        <div className="crusade-unit-detail__stat-grid">
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
        <div className="campaign-detail__section-header">
          <h3 className="campaign-detail__section-title">Notes</h3>
          {!editingNotes && (
            <button
              className="btn"
              onClick={() => setEditingNotes(true)}
              type="button"
            >
              Edit
            </button>
          )}
        </div>
        {editingNotes ? (
          <div className="form-group">
            <textarea
              className="form-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add notes about this unit..."
              autoFocus
            />
            <div className="campaign-create__actions">
              <button className="btn" onClick={() => { setEditingNotes(false); setNotes(unit.notes ?? ''); }} type="button">
                Cancel
              </button>
              <button className="btn btn--primary" onClick={handleSaveNotes} type="button">
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className={`crusade-unit-detail__notes-text${!unit.notes ? ' crusade-unit-detail__notes-text--empty' : ''}`}>
            {unit.notes || 'No notes yet.'}
          </p>
        )}
      </div>

      {/* Danger Zone */}
      <div className="campaign-detail__section campaign-detail__section--danger">
        <h3 className="campaign-detail__section-title">Danger Zone</h3>
        {!confirmDelete ? (
          <button
            className="btn btn--danger"
            onClick={() => setConfirmDelete(true)}
            type="button"
          >
            Remove Unit from Roster
          </button>
        ) : (
          <div className="crusade-unit-detail__confirm-row">
            <span className="crusade-unit-detail__confirm-text">Are you sure?</span>
            <button className="btn" onClick={() => setConfirmDelete(false)} type="button">
              Cancel
            </button>
            <button
              className="btn btn--danger"
              onClick={handleDelete}
              type="button"
            >
              Confirm Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
