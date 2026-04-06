import { useState } from 'react';
import { useCrusadeStore } from '../stores/crusadeStore';
import { HonourScarEditor } from './HonourScarEditor';
import { RequisitionPanel } from './RequisitionPanel';
import type { BattleHonour, BattleScar } from '../../../shared/types/database';

interface PostBattleSequenceProps {
  battleId: string;
  campaignId: string;
  onComplete: () => void;
}

interface UnitParticipation {
  unitId: string;
  kills: number;
  survived: boolean;
}

const STEP_LABELS = ['Participants', 'Award XP', 'Honours & Scars', 'Requisitions'];

export function PostBattleSequence({ battleId, onComplete }: PostBattleSequenceProps) {
  const { units, roster, members, awardXP, addHonour, addScar, removeScar, spendRP, loadRoster } = useCrusadeStore();
  const [step, setStep] = useState(0);
  const [participations, setParticipations] = useState<Map<string, UnitParticipation>>(new Map());
  const [xpAwarded, setXpAwarded] = useState(false);
  const [awarding, setAwarding] = useState(false);
  const [selectedHonourUnit, setSelectedHonourUnit] = useState<string | null>(null);

  // Find the current user's member for RP
  const currentMember = members.find((m) => {
    if (!roster) return false;
    return m.id === roster.campaign_member_id;
  });

  const activeUnits = units.filter((u) => !u.is_destroyed);

  const toggleParticipant = (unitId: string) => {
    setParticipations((prev) => {
      const next = new Map(prev);
      if (next.has(unitId)) {
        next.delete(unitId);
      } else {
        next.set(unitId, { unitId, kills: 0, survived: true });
      }
      return next;
    });
  };

  const updateParticipation = (unitId: string, updates: Partial<UnitParticipation>) => {
    setParticipations((prev) => {
      const next = new Map(prev);
      const existing = next.get(unitId);
      if (existing) {
        next.set(unitId, { ...existing, ...updates });
      }
      return next;
    });
  };

  const handleAwardXP = async () => {
    setAwarding(true);
    await awardXP(battleId);
    // Reload roster to get updated XP values
    if (roster) {
      await loadRoster(roster.campaign_member_id);
    }
    setXpAwarded(true);
    setAwarding(false);
  };

  const handleAddHonour = async (unitId: string, honour: BattleHonour) => {
    await addHonour(unitId, { ...honour, acquired_battle_id: battleId });
  };

  const handleAddScar = async (unitId: string, scar: BattleScar) => {
    await addScar(unitId, { ...scar, acquired_battle_id: battleId });
  };

  const handleSpendRP = async (type: string, amount: number, description: string) => {
    if (!currentMember) return;
    await spendRP(currentMember.id, type as Parameters<typeof spendRP>[1], amount, description);
  };

  const canGoNext = (): boolean => {
    switch (step) {
      case 0: return participations.size > 0;
      case 1: return xpAwarded;
      case 2: return true;
      case 3: return true;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="post-battle__content">
            <h3 className="post-battle__content-title">Select Participating Units</h3>
            <p className="post-battle__description">
              Check the units that fought in this battle and record their kills and survival.
            </p>
            <div className="battle-log__unit-select">
              {activeUnits.map((unit) => {
                const isSelected = participations.has(unit.id);
                const participation = participations.get(unit.id);
                return (
                  <div key={unit.id}>
                    <label className="battle-log__unit-option">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleParticipant(unit.id)}
                      />
                      <span className="battle-log__unit-option-label">
                        {unit.custom_name || unit.units?.name || 'Unknown Unit'}
                      </span>
                    </label>
                    {isSelected && participation && (
                      <div className="post-battle__participation-detail">
                        <div className="post-battle__participation-field form-group">
                          <label>Kills</label>
                          <input
                            className="form-input"
                            type="number"
                            min={0}
                            value={participation.kills}
                            onChange={(e) => updateParticipation(unit.id, { kills: Math.max(0, parseInt(e.target.value) || 0) })}
                          />
                        </div>
                        <label className="battle-log__unit-option" style={{ flex: 1, alignSelf: 'flex-end' }}>
                          <input
                            type="checkbox"
                            checked={participation.survived}
                            onChange={(e) => updateParticipation(unit.id, { survived: e.target.checked })}
                          />
                          <span className="battle-log__unit-option-label">Survived</span>
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
              {activeUnits.length === 0 && (
                <p className="campaign-detail__empty">
                  No active units in roster.
                </p>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="post-battle__content">
            <h3 className="post-battle__content-title">Award Experience</h3>
            {!xpAwarded ? (
              <div className="post-battle__centered">
                <p className="post-battle__description">
                  Award XP to all participating units based on the battle results.
                  Units that participated earn XP, with bonus XP for surviving and scoring kills.
                </p>
                <button
                  className="post-battle__next-btn"
                  onClick={handleAwardXP}
                  disabled={awarding}
                  type="button"
                >
                  {awarding ? 'Awarding...' : 'Award XP'}
                </button>
              </div>
            ) : (
              <div className="post-battle__centered">
                <p className="post-battle__xp-success">
                  XP has been awarded to all participating units.
                </p>
                <div className="post-battle__xp-list">
                  {units.filter((u) => participations.has(u.id)).map((unit) => (
                    <div key={unit.id} className="post-battle__xp-row">
                      <span className="post-battle__xp-name">{unit.custom_name || unit.units?.name || 'Unknown Unit'}</span>
                      <span className="post-battle__xp-value">{unit.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="post-battle__content">
            <h3 className="post-battle__content-title">Honours & Scars</h3>
            <p className="post-battle__description">
              Award battle honours to units that crossed XP thresholds, and apply battle scars to units that were destroyed or performed poorly.
            </p>

            <div className="form-group">
              <label>Select Unit</label>
              <select
                className="form-select"
                value={selectedHonourUnit ?? ''}
                onChange={(e) => setSelectedHonourUnit(e.target.value || null)}
              >
                <option value="">-- Choose a unit --</option>
                {units.filter((u) => participations.has(u.id)).map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.custom_name || unit.units?.name || 'Unknown Unit'}
                  </option>
                ))}
              </select>
            </div>

            {selectedHonourUnit && (() => {
              const unit = units.find((u) => u.id === selectedHonourUnit);
              if (!unit) return null;
              return (
                <HonourScarEditor
                  honours={unit.honours}
                  scars={unit.scars}
                  onAddHonour={(h) => handleAddHonour(unit.id, h)}
                  onAddScar={(s) => handleAddScar(unit.id, s)}
                  onRemoveScar={(i) => removeScar(unit.id, i)}
                />
              );
            })()}
          </div>
        );

      case 3:
        return (
          <div className="post-battle__content">
            <h3 className="post-battle__content-title">Requisitions</h3>
            <p className="post-battle__description">
              Spend Requisition Points to upgrade your roster, replace destroyed units, or remove battle scars.
            </p>
            <RequisitionPanel
              currentRP={currentMember?.requisition_points ?? 0}
              onSpend={handleSpendRP}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="post-battle">
      {/* Step indicators */}
      <div className="post-battle__steps">
        {STEP_LABELS.map((label, index) => (
          <div key={label} style={{ display: 'contents' }}>
            {index > 0 && (
              <div className={`post-battle__step-connector${index <= step ? ' post-battle__step-connector--completed' : ''}`} />
            )}
            <div
              className={`post-battle__step${index === step ? ' post-battle__step--active' : ''}${index < step ? ' post-battle__step--completed' : ''}`}
              title={label}
            />
          </div>
        ))}
      </div>

      {/* Step content */}
      {renderStepContent()}

      {/* Navigation */}
      <div className="post-battle__actions">
        <button
          className="post-battle__prev-btn"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          type="button"
        >
          Previous
        </button>

        <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          Step {step + 1} of {STEP_LABELS.length}
        </span>

        {step < STEP_LABELS.length - 1 ? (
          <button
            className="post-battle__next-btn"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canGoNext()}
            type="button"
          >
            Next
          </button>
        ) : (
          <button
            className="post-battle__finish-btn"
            onClick={onComplete}
            type="button"
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
}
