import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import { useAuth } from '../../../shared/hooks/useAuth';
import type { Faction, Detachment, BattleSize } from '../../../shared/types/database';

interface CreateListModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateListModal({ onClose, onCreated }: CreateListModalProps) {
  const { user } = useAuth();
  const [factions, setFactions] = useState<Faction[]>([]);
  const [detachments, setDetachments] = useState<Detachment[]>([]);
  const [battleSizes, setBattleSizes] = useState<BattleSize[]>([]);
  const [name, setName] = useState('');
  const [factionId, setFactionId] = useState('');
  const [detachmentId, setDetachmentId] = useState('');
  const [battleSizeId, setBattleSizeId] = useState('strike_force');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from('factions')
      .select('*')
      .order('name')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setFactions(data);
          setFactionId(data[0].id);
        }
      });

    supabase
      .from('battle_sizes')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setBattleSizes(data);
      });
  }, []);

  useEffect(() => {
    if (!factionId) return;
    supabase
      .from('detachments')
      .select('*')
      .eq('faction_id', factionId)
      .order('name')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setDetachments(data);
          setDetachmentId(data[0].id);
        } else {
          setDetachments([]);
          setDetachmentId('');
        }
      });
  }, [factionId]);

  const selectedBattleSize = battleSizes.find(bs => bs.id === battleSizeId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !factionId || !detachmentId) return;
    setSaving(true);

    const { error } = await supabase.from('army_lists').insert({
      name,
      faction_id: factionId,
      detachment_id: detachmentId,
      points_limit: selectedBattleSize?.max_points ?? 2000,
      battle_size: battleSizeId,
      user_id: user!.id,
    });

    if (!error) {
      onCreated();
    }
    setSaving(false);
  }

  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        className="modal-panel modal-panel--sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-list-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="create-list-title" className="modal-panel__title">New Army List</h2>
        <form onSubmit={handleSubmit} className="create-list-form">
          <div className="form-group">
            <label>List Name</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Army List"
              required
            />
          </div>

          <div className="form-group">
            <label>Faction</label>
            <select
              className="form-select"
              value={factionId}
              onChange={(e) => setFactionId(e.target.value)}
            >
              {factions.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Detachment</label>
            <select
              className="form-select"
              value={detachmentId}
              onChange={(e) => setDetachmentId(e.target.value)}
            >
              {detachments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Battle Size</label>
            <div className="battle-size-picker">
              {battleSizes.map((bs) => (
                <button
                  key={bs.id}
                  type="button"
                  className={`battle-size-picker__option${bs.id === battleSizeId ? ' battle-size-picker__option--active' : ''}`}
                  onClick={() => setBattleSizeId(bs.id)}
                >
                  <span className="battle-size-picker__name">{bs.name}</span>
                  <span className="battle-size-picker__points">{bs.max_points} pts</span>
                </button>
              ))}
            </div>
          </div>

          <div className="modal-panel__actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving || !name || !detachmentId}>
              {saving ? 'Creating...' : 'Create List'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
