import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../shared/lib/supabase';
import { useAuth } from '../../../shared/hooks/useAuth';
import type { Faction, BattleSize } from '../../../shared/types/database';
import { SAMPLE_LISTS } from '../data/sampleLists';

interface CreateListModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateListModal({ onClose, onCreated }: CreateListModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [factions, setFactions] = useState<Faction[]>([]);
  const [battleSizes, setBattleSizes] = useState<BattleSize[]>([]);
  const [name, setName] = useState('');
  const [factionId, setFactionId] = useState('');
  const [battleSizeId, setBattleSizeId] = useState('strike_force');
  const [saving, setSaving] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const selectedBattleSize = battleSizes.find(bs => bs.id === battleSizeId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !factionId) return;
    setSaving(true);
    setError(null);

    // Auto-select the first available detachment for this faction
    const faction = factions.find(f => f.id === factionId);
    const detFactionIds = [factionId];
    if (faction?.parent_faction_id) {
      detFactionIds.push(faction.parent_faction_id);
    }

    const { data: detachments } = await supabase
      .from('detachments')
      .select('id')
      .in('faction_id', detFactionIds)
      .order('name')
      .limit(1);

    const detachmentId = detachments?.[0]?.id;
    if (!detachmentId) {
      setError('No detachments found for this faction. Please try a different faction.');
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase.from('army_lists').insert({
      name,
      faction_id: factionId,
      detachment_id: detachmentId,
      points_limit: selectedBattleSize?.max_points ?? 2000,
      battle_size: battleSizeId,
      user_id: user!.id,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      onCreated();
    }
    setSaving(false);
  }

  /**
   * Create a pre-populated demo list so brand-new users can see what a finished
   * list looks like. Ignores the form's name/faction/battle-size selections and
   * uses the values from SAMPLE_LISTS[0]. Units that fail to resolve by name are
   * silently skipped — the user lands on a list with whatever DID match.
   */
  async function handleLoadSample() {
    if (!user) return;
    setLoadingSample(true);
    setError(null);

    const sample = SAMPLE_LISTS[0];

    const faction = factions.find((f) => f.name === sample.factionName);
    if (!faction) {
      setError(`Sample list requires faction "${sample.factionName}" which isn't in the database.`);
      setLoadingSample(false);
      return;
    }

    const battleSize = battleSizes.find((bs) => bs.id === sample.battleSizeId);
    if (!battleSize) {
      setError(`Sample list requires battle size "${sample.battleSizeId}" which isn't available.`);
      setLoadingSample(false);
      return;
    }

    const detFactionIds = [faction.id];
    if (faction.parent_faction_id) detFactionIds.push(faction.parent_faction_id);

    const { data: detachments } = await supabase
      .from('detachments')
      .select('id')
      .in('faction_id', detFactionIds)
      .order('name')
      .limit(1);

    const detachmentId = detachments?.[0]?.id;
    if (!detachmentId) {
      setError('No detachments found for sample list faction.');
      setLoadingSample(false);
      return;
    }

    const { data: insertedList, error: listError } = await supabase
      .from('army_lists')
      .insert({
        name: sample.listName,
        faction_id: faction.id,
        detachment_id: detachmentId,
        points_limit: battleSize.max_points,
        battle_size: sample.battleSizeId,
        user_id: user.id,
      })
      .select('id')
      .single();

    if (listError || !insertedList) {
      setError(listError?.message ?? 'Failed to create sample list');
      setLoadingSample(false);
      return;
    }

    // Look up units by name within this faction (and parent faction if any)
    const { data: units } = await supabase
      .from('units')
      .select('id, name')
      .in('faction_id', detFactionIds);

    if (units) {
      const inserts = sample.units
        .map((s, idx) => {
          const unit = units.find((u) => u.name.toLowerCase() === s.name.toLowerCase());
          if (!unit) return null;
          return {
            army_list_id: insertedList.id,
            unit_id: unit.id,
            model_count: s.modelCount,
            sort_order: idx,
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);

      if (inserts.length > 0) {
        await supabase.from('army_list_units').insert(inserts);
      }
    }

    setLoadingSample(false);
    navigate(`/list/${insertedList.id}`);
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

          {error && (
            <div className="validation-banner validation-banner--error">
              {error}
            </div>
          )}

          <div className="modal-panel__actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving || loadingSample || !name}>
              {saving ? 'Creating...' : 'Create List'}
            </button>
          </div>

          <div className="create-list-form__demo">
            <span className="create-list-form__demo-label">Not sure where to start?</span>
            <button
              type="button"
              className="create-list-form__demo-btn"
              onClick={handleLoadSample}
              disabled={saving || loadingSample}
            >
              {loadingSample ? 'Loading demo...' : 'Load a demo list \u2192'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
