import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../shared/lib/supabase';
import { useAuth } from '../../../shared/hooks/useAuth';
import type { ArmyList, Enhancement, Detachment } from '../../../shared/types/database';
import { DatasheetView } from '../../../shared/components/DatasheetView';
import { CasualtyTracker } from '../components/CasualtyTracker';
import { PhaseTracker } from '../components/PhaseTracker';
import { ScoreBoard } from '../components/ScoreBoard';
import { ChessTimerDisplay } from '../components/ChessTimerDisplay';
import { DiceRollerPanel } from '../components/DiceRollerPanel';
import { EventLog } from '../components/EventLog';
import { StratagemPanel } from '../components/StratagemPanel';
import { GameSetup } from '../components/GameSetup';
import { SecondaryObjectives } from '../components/SecondaryObjectives';
import { BattleReport } from '../components/BattleReport';
import { useGameSessionStore } from '../stores/gameSessionStore';
import { useGameRealtime } from '../hooks/useGameRealtime';
import { getUnitPoints, ROLE_ORDER, ROLE_LABELS, type ArmyListUnitWithDetails } from '../../list-builder/hooks/useListEditor';

type PlayTab = 'army' | 'score' | 'stratagems' | 'tools' | 'log';

export function PlayModePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const gameStore = useGameSessionStore();

  // Subscribe to realtime updates for multi-device sync
  useGameRealtime(gameStore.session?.id ?? null);

  const [list, setList] = useState<(ArmyList & { detachments: Detachment }) | null>(null);
  const [listUnits, setListUnits] = useState<ArmyListUnitWithDetails[]>([]);
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [listEnhancements, setListEnhancements] = useState<{ id: string; enhancement_id: string; army_list_unit_id: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PlayTab>('army');
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [showEndGame, setShowEndGame] = useState(false);
  const [endGameResult, setEndGameResult] = useState<'win' | 'loss' | 'draw'>('win');
  const [endGameNotes, setEndGameNotes] = useState('');

  // Load army list data
  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: listData } = await supabase
        .from('army_lists')
        .select('*, detachments(*)')
        .eq('id', id)
        .single();

      if (!listData) { navigate('/lists'); return; }
      setList(listData as ArmyList & { detachments: Detachment });

      const { data: unitData } = await supabase
        .from('army_list_units')
        .select('*, units(*, unit_points_tiers(*), abilities(*), weapons(*))')
        .eq('army_list_id', id)
        .order('sort_order');

      if (unitData) setListUnits(unitData as ArmyListUnitWithDetails[]);

      const { data: enhData } = await supabase
        .from('enhancements')
        .select('*')
        .eq('detachment_id', listData.detachment_id);
      if (enhData) setEnhancements(enhData);

      const { data: listEnhData } = await supabase
        .from('army_list_enhancements')
        .select('*')
        .eq('army_list_id', id);
      if (listEnhData) setListEnhancements(listEnhData);

      // Load stratagems and secondary objectives
      gameStore.loadStratagems(listData.faction_id, listData.detachment_id);
      gameStore.loadSecondaryObjectives();

      setLoading(false);
    })();
  }, [id, navigate]);

  if (loading || !list || !id) return (
    <div className="skeleton-list" style={{ padding: 'var(--space-lg)', maxWidth: '900px', margin: '0 auto' }}>
      <div className="skeleton skeleton--header" />
      <div className="skeleton skeleton--bar" />
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="skeleton" style={{ height: '56px', width: '100%' }} />
      ))}
    </div>
  );

  const totalPoints = listUnits.reduce((sum, lu) => sum + getUnitPoints(lu.units, lu.model_count), 0)
    + listEnhancements.reduce((sum, le) => {
      const enh = enhancements.find(e => e.id === le.enhancement_id);
      return sum + (enh?.points ?? 0);
    }, 0);

  // If no active game session, show setup
  const hasActiveSession = gameStore.session && ['active', 'paused'].includes(gameStore.session.status);

  if (!hasActiveSession) {
    return (
      <div className="play-mode">
        <div className="play-mode__header">
          <div>
            <h2 className="play-mode__title">{list.name}</h2>
            <span className="play-mode__subtitle">
              {list.detachments?.name} &middot; {totalPoints}/{list.points_limit} pts
            </span>
          </div>
          <button className="btn" onClick={() => navigate(`/list/${id}`)}>
            Back to Editor
          </button>
        </div>

        <GameSetup
          armyListId={id}
          userId={user?.id ?? ''}
          onGameCreated={() => {
            // Session is now in the store, component will re-render
          }}
        />

        {/* Show battle history below setup */}
        <div className="play-mode__history-section">
          <BattleReport listId={id} listName={list.name} />
        </div>
      </div>
    );
  }

  // Active game session
  const rosterByRole: Record<string, ArmyListUnitWithDetails[]> = {};
  for (const lu of listUnits) {
    if (!rosterByRole[lu.units.role]) rosterByRole[lu.units.role] = [];
    rosterByRole[lu.units.role].push(lu);
  }

  function toggleExpand(unitId: string) {
    setExpandedUnits(prev => {
      const next = new Set(prev);
      if (next.has(unitId)) next.delete(unitId);
      else next.add(unitId);
      return next;
    });
  }

  async function handleEndGame() {
    await gameStore.completeGame(endGameResult, endGameNotes);
    setShowEndGame(false);
  }

  return (
    <div className="play-mode">
      {/* Header */}
      <div className="play-mode__header">
        <div>
          <h2 className="play-mode__title">{list.name}</h2>
          <span className="play-mode__subtitle">
            {gameStore.session?.opponent_name
              ? `vs ${gameStore.session.opponent_name}${gameStore.session.opponent_faction ? ` (${gameStore.session.opponent_faction})` : ''}`
              : list.detachments?.name
            }
            {' '}&middot; {totalPoints}/{list.points_limit} pts
          </span>
        </div>
        <div className="play-mode__header-actions">
          <span className="play-mode__lock-badge">&#9876; In Game</span>
          <button className="btn btn--sm" onClick={() => gameStore.pauseGame().then(() => navigate(`/list/${id}`))}>
            Pause
          </button>
          <button className="btn btn--danger btn--sm" onClick={() => setShowEndGame(true)}>
            End Game
          </button>
        </div>
      </div>

      {/* Phase Tracker */}
      <PhaseTracker />

      {/* Tabs */}
      <div className="play-mode__tabs">
        {(['army', 'score', 'stratagems', 'tools', 'log'] as PlayTab[]).map(tab => (
          <button
            key={tab}
            className={`play-mode__tab${activeTab === tab ? ' play-mode__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'army' ? 'Army' : tab === 'score' ? 'Score' : tab === 'stratagems' ? 'Stratagems' : tab === 'tools' ? 'Tools' : 'Log'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'army' && (
        <div className="play-mode__units">
          {ROLE_ORDER.map(role => {
            const roleUnits = rosterByRole[role];
            if (!roleUnits || roleUnits.length === 0) return null;
            return (
              <div key={role}>
                <div className={`roster-section__header roster-section__header--${role}`}>
                  <span>{ROLE_LABELS[role]}</span>
                </div>
                {roleUnits.map(lu => {
                  const pts = getUnitPoints(lu.units, lu.model_count);
                  const enhAssignment = listEnhancements.find(le => le.army_list_unit_id === lu.id);
                  const enh = enhAssignment ? enhancements.find(e => e.id === enhAssignment.enhancement_id) : null;
                  const totalPts = pts + (enh?.points ?? 0);
                  const isExpanded = expandedUnits.has(lu.id);
                  const displayName = lu.model_count > 1 ? `${lu.model_count} ${lu.units.name}` : lu.units.name;
                  const isMultiWound = lu.units.wounds > 1 && lu.model_count <= 3;

                  return (
                    <div key={lu.id} className={`play-mode__unit-card${isExpanded ? ' play-mode__unit-card--expanded' : ''}`}>
                      <div className="play-mode__unit-header" onClick={() => toggleExpand(lu.id)}>
                        <div>
                          <span className="play-mode__unit-name">{displayName}</span>
                          {enh && <span className="play-mode__unit-enh"> &middot; {enh.name}</span>}
                        </div>
                        <div className="play-mode__unit-right">
                          <span className="play-mode__unit-pts">{totalPts} pts</span>
                          <span className="play-mode__expand-arrow">{isExpanded ? '\u25B2' : '\u25BC'}</span>
                        </div>
                      </div>

                      <CasualtyTracker
                        armyListUnitId={lu.id}
                        listId={id}
                        modelCount={lu.model_count}
                        wounds={lu.units.wounds}
                        isMultiWound={isMultiWound}
                      />

                      {isExpanded && (
                        <div className="play-mode__datasheet">
                          <DatasheetView unit={lu.units} weapons={lu.units.weapons ?? []} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'score' && (
        <div className="play-mode__score-tab">
          <ScoreBoard
            myVP={gameStore.session?.my_vp ?? 0}
            opponentVP={gameStore.session?.opponent_vp ?? 0}
            scores={gameStore.scores}
            currentRound={gameStore.session?.current_round ?? 1}
          />
          <SecondaryObjectives />
        </div>
      )}

      {activeTab === 'stratagems' && (
        <StratagemPanel />
      )}

      {activeTab === 'tools' && (
        <div className="play-mode__tools-tab">
          <ChessTimerDisplay />
          <DiceRollerPanel />
        </div>
      )}

      {activeTab === 'log' && (
        <div className="play-mode__log-tab">
          <EventLog events={gameStore.events} />
          <div className="play-mode__history-section">
            <BattleReport listId={id} listName={list.name} />
          </div>
        </div>
      )}

      {/* End Game Modal */}
      {showEndGame && (
        <div className="modal-backdrop" onClick={() => setShowEndGame(false)}>
          <div className="modal-panel modal-panel--sm" onClick={e => e.stopPropagation()}>
            <h3 className="modal-panel__title">End Game</h3>
            <div className="game-setup__field">
              <label className="game-setup__label">Result</label>
              <select
                className="form-select"
                value={endGameResult}
                onChange={e => setEndGameResult(e.target.value as 'win' | 'loss' | 'draw')}
              >
                <option value="win">Victory</option>
                <option value="loss">Defeat</option>
                <option value="draw">Draw</option>
              </select>
            </div>
            <div className="game-setup__field">
              <label className="game-setup__label">Notes</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Key moments, lessons learned..."
                value={endGameNotes}
                onChange={e => setEndGameNotes(e.target.value)}
              />
            </div>
            <div className="modal-panel__actions">
              <button className="btn" onClick={() => setShowEndGame(false)}>Cancel</button>
              <button className="btn btn--primary" onClick={handleEndGame}>Complete Game</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
