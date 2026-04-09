import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrusadeStore } from '../stores/crusadeStore';
import { CrusadeUnitCard } from '../components/CrusadeUnitCard';
import { supabase } from '../../../shared/lib/supabase';
import type { Unit } from '../../../shared/types/database';
import '../crusade.css';

export function CrusadeRosterPage() {
  const { id: campaignId, memberId } = useParams<{ id: string; memberId: string }>();
  const navigate = useNavigate();
  const { roster, units, members, factions, loading, error, loadRoster, addUnit } = useCrusadeStore();

  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
  const [unitSearch, setUnitSearch] = useState('');
  const [loadingUnits, setLoadingUnits] = useState(false);

  useEffect(() => {
    if (memberId) {
      loadRoster(memberId);
    }
  }, [memberId, loadRoster]);

  // Load available units when unit picker opens
  const openUnitPicker = useCallback(async () => {
    if (!roster) return;
    setShowUnitPicker(true);
    setLoadingUnits(true);

    // Include parent faction units for subfactions (e.g. Ultramarines -> Space Marines)
    const { data: factionData } = await supabase
      .from('factions')
      .select('parent_faction_id')
      .eq('id', roster.faction_id)
      .single();

    const factionIds = [roster.faction_id];
    if (factionData?.parent_faction_id) {
      factionIds.push(factionData.parent_faction_id);
    }

    const { data, error: fetchError } = await supabase
      .from('units')
      .select('*')
      .in('faction_id', factionIds)
      .order('name', { ascending: true });

    if (fetchError) {
      console.error('Failed to load available units:', fetchError);
    }
    setAvailableUnits((data as Unit[]) ?? []);
    setLoadingUnits(false);
  }, [roster]);

  const handleAddUnit = useCallback(async (unit: Unit) => {
    if (!roster) return;
    await addUnit({
      crusade_roster_id: roster.id,
      unit_id: unit.id,
      custom_name: null,
      model_count: 1,
      points_cost: 0,
      unit_name: unit.name,
      unit_role: unit.role,
    });
    setShowUnitPicker(false);
    setUnitSearch('');
  }, [roster, addUnit]);

  const totalPoints = units.reduce((sum, u) => sum + u.points_cost, 0);
  const currentMember = members.find((m) => m.id === memberId);
  const supplyLimit = currentMember?.supply_limit ?? 1000;

  const filteredUnits = availableUnits.filter((u) =>
    u.name.toLowerCase().includes(unitSearch.toLowerCase())
  );

  if (loading && !roster) {
    return (
      <div className="crusade-roster">
        <div className="crusade-roster__header">
          <div style={{ width: '50%', height: 28, background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-sm)', opacity: 0.3 }} />
          <div style={{ width: '30%', height: 16, background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-sm)', opacity: 0.2, marginTop: 'var(--space-xs)' }} />
        </div>
      </div>
    );
  }

  if (!roster) {
    return (
      <div className="crusade-roster">
        <div className="campaigns-page__empty">
          <div className="campaigns-page__empty-icon">&#9876;</div>
          <p className="campaigns-page__empty-text">
            No roster found. This member may not have created a roster yet.
          </p>
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

  const pointsPercent = supplyLimit > 0 ? Math.min(100, (totalPoints / supplyLimit) * 100) : 0;
  const isOverSupply = totalPoints > supplyLimit;

  return (
    <div className="crusade-roster">
      <div className="crusade-roster__header">
        <h1 className="crusade-roster__name">{roster.name}</h1>
        <span className="crusade-roster__faction">{factions.find((f) => f.id === roster.faction_id)?.name ?? roster.faction_id}</span>
      </div>

      {error && (
        <div style={{ color: 'var(--color-red-bright)', background: 'rgba(192,64,64,0.1)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(192,64,64,0.3)' }}>
          {error}
        </div>
      )}

      {/* Supply Bar */}
      <div className="crusade-roster__supply-bar">
        <div className="crusade-roster__supply-label">
          <span>Supply Used</span>
          <span className={`crusade-roster__supply-value${isOverSupply ? ' crusade-roster__supply-value--over' : ''}`}>
            {totalPoints} / {supplyLimit} pts
          </span>
        </div>
        <div className="crusade-roster__supply-track">
          <div
            className={`crusade-roster__supply-fill${isOverSupply ? ' crusade-roster__supply-fill--over' : ''}`}
            style={{ width: `${pointsPercent}%` }}
          />
        </div>
      </div>

      {/* Unit List */}
      <div className="crusade-roster__unit-list">
        {units.length === 0 && (
          <div className="empty-state card">
            <div className="empty-state__icon">&#9876;</div>
            <div className="empty-state__title">Empty Roster</div>
            <p className="empty-state__description">
              Your Crusade force begins here. Add your first unit to start
              tracking its battle honours, scars, and experience as your
              campaign unfolds.
            </p>
            <div className="empty-state__action">
              <button className="btn btn--primary" type="button" onClick={openUnitPicker}>
                + Add First Unit
              </button>
            </div>
          </div>
        )}
        {units.map((unit) => (
          <CrusadeUnitCard
            key={unit.id}
            unit={unit}
            unitName={unit.custom_name || unit.units?.name || 'Unknown Unit'}
            onClick={() => navigate(`/campaign/${campaignId}/unit/${unit.id}`)}
          />
        ))}
      </div>

      {/* Add Unit */}
      {!showUnitPicker ? (
        <div className="crusade-roster__add-unit" onClick={openUnitPicker}>
          <button className="crusade-roster__add-unit-btn" type="button">
            + Add Unit
          </button>
        </div>
      ) : (
        <div className="campaign-detail__section">
          <h3 className="campaign-detail__section-title">Add Unit to Roster</h3>
          <div className="battle-log__field">
            <label className="battle-log__label" htmlFor="unit-search">Search Units</label>
            <input
              id="unit-search"
              className="battle-log__vp-input"
              type="text"
              value={unitSearch}
              onChange={(e) => setUnitSearch(e.target.value)}
              placeholder="Filter by name..."
              style={{ textAlign: 'left' }}
              autoFocus
            />
          </div>

          {loadingUnits ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-md)' }}>
              Loading units...
            </p>
          ) : (
            <div className="battle-log__unit-select" style={{ maxHeight: 360 }}>
              {filteredUnits.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-md)' }}>
                  {unitSearch ? 'No units match your search.' : 'No units available for this faction.'}
                </p>
              ) : (
                filteredUnits.map((unit) => (
                  <div
                    key={unit.id}
                    className="battle-log__unit-option"
                    onClick={() => handleAddUnit(unit)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddUnit(unit); }}
                  >
                    <span className="battle-log__unit-option-label">{unit.name}</span>
                    {unit.role && (
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        marginLeft: 'auto',
                      }}>
                        {unit.role}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          <div className="join-modal__actions" style={{ marginTop: 'var(--space-md)' }}>
            <button
              className="join-modal__cancel-btn"
              onClick={() => { setShowUnitPicker(false); setUnitSearch(''); }}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
