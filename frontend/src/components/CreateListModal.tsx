import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Faction, Detachment } from '../types/database';

interface CreateListModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateListModal({ onClose, onCreated }: CreateListModalProps) {
  const [factions, setFactions] = useState<Faction[]>([]);
  const [detachments, setDetachments] = useState<Detachment[]>([]);
  const [name, setName] = useState('');
  const [factionId, setFactionId] = useState('');
  const [detachmentId, setDetachmentId] = useState('');
  const [pointsLimit, setPointsLimit] = useState(2000);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !factionId || !detachmentId) return;
    setSaving(true);

    // For now, use a placeholder user ID since we haven't set up auth yet
    const { error } = await supabase.from('army_lists').insert({
      name,
      faction_id: factionId,
      detachment_id: detachmentId,
      points_limit: pointsLimit,
      user_id: '00000000-0000-0000-0000-000000000000',
    });

    if (!error) {
      onCreated();
    }
    setSaving(false);
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: '100%', maxWidth: '450px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-lg)', color: 'var(--color-gold)' }}>
          New Army List
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-md)' }}>
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
            <label>Points Limit</label>
            <select
              className="form-select"
              value={pointsLimit}
              onChange={(e) => setPointsLimit(Number(e.target.value))}
            >
              <option value={500}>500 (Combat Patrol)</option>
              <option value={1000}>1000 (Incursion)</option>
              <option value={2000}>2000 (Strike Force)</option>
              <option value={3000}>3000 (Onslaught)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
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
