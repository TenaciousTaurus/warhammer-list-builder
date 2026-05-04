import { useState, useEffect } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import type { GameSession } from '../../../shared/types/database';
import { useGameSessionStore } from '../stores/gameSessionStore';

interface BattleReportProps {
  listId: string;
  listName: string;
}

export function BattleReport({ listId, listName }: BattleReportProps) {
  const [games, setGames] = useState<GameSession[]>([]);
  const [expandedGame, setExpandedGame] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const generateReportCode = useGameSessionStore(s => s.generateReportCode);
  const sessionInStore = useGameSessionStore(s => s.session);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('army_list_id', listId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (data) setGames(data as GameSession[]);
      setLoading(false);
    })();
  }, [listId]);

  async function handleShareReport(game: GameSession) {
    setSharingId(game.id);
    let code = game.report_code;
    if (!code) {
      // If this is the active session in the store, use the store's generateReportCode
      if (sessionInStore?.id === game.id) {
        code = await generateReportCode();
      } else {
        // Otherwise call the RPC directly and patch local state
        const { data } = await supabase.rpc('generate_battle_report_code', { p_session_id: game.id });
        code = data as string | null;
      }
      if (code) {
        setGames(prev => prev.map(g => g.id === game.id ? { ...g, report_code: code! } : g));
      }
    }
    setSharingId(null);
    if (code) {
      const url = `${window.location.origin}/report/${code}`;
      void navigator.clipboard.writeText(url).then(() => {
        setCopiedId(game.id);
        setTimeout(() => setCopiedId(id => id === game.id ? null : id), 2000);
      });
    }
  }

  if (loading) return <div className="skeleton" style={{ height: '80px' }} />;
  if (games.length === 0) return null;

  const wins = games.filter(g => g.result === 'win').length;
  const losses = games.filter(g => g.result === 'loss').length;
  const draws = games.filter(g => g.result === 'draw').length;
  const winRate = Math.round((wins / games.length) * 100);

  return (
    <div className="battle-report">
      <h4 className="battle-report__section-title">Battle History — {listName}</h4>

      <div className="battle-report__stats">
        <div className="battle-report__stat">
          <span className="battle-report__stat-value battle-report__stat-value--win">{wins}</span>
          <span className="battle-report__stat-label">Wins</span>
        </div>
        <div className="battle-report__stat">
          <span className="battle-report__stat-value battle-report__stat-value--loss">{losses}</span>
          <span className="battle-report__stat-label">Losses</span>
        </div>
        <div className="battle-report__stat">
          <span className="battle-report__stat-value battle-report__stat-value--draw">{draws}</span>
          <span className="battle-report__stat-label">Draws</span>
        </div>
        <div className="battle-report__stat">
          <span className="battle-report__stat-value">{winRate}%</span>
          <span className="battle-report__stat-label">Win Rate</span>
        </div>
      </div>

      {games.map(game => {
        const result = game.result ?? 'draw';
        const isExpanded = expandedGame === game.id;
        const dateStr = game.completed_at
          ? new Date(game.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : '';

        return (
          <div
            key={game.id}
            className={`battle-report__card battle-report__card--${result}`}
            onClick={() => setExpandedGame(isExpanded ? null : game.id)}
          >
            <div className="battle-report__card-header">
              <div className="battle-report__card-left">
                <span className={`battle-report__result-badge battle-report__result-badge--${result}`}>
                  {result.toUpperCase()}
                </span>
                <span className="battle-report__card-opponent">
                  vs {game.opponent_name || 'Unknown'}
                  {game.opponent_faction && <span className="battle-report__card-faction"> ({game.opponent_faction})</span>}
                </span>
              </div>
              <div className="battle-report__card-right">
                <span className="battle-report__card-score">{game.my_vp} - {game.opponent_vp}</span>
                <span className="battle-report__card-date">{dateStr}</span>
              </div>
            </div>
            {isExpanded && (
              <div className="battle-report__card-body" onClick={e => e.stopPropagation()}>
                {game.notes && <div><strong>Notes:</strong> {game.notes}</div>}
                <div><strong>Rounds:</strong> {game.current_round}</div>
                <div className="battle-report__card-share">
                  <button
                    className="btn btn--sm btn--ghost"
                    onClick={() => void handleShareReport(game)}
                    disabled={sharingId === game.id}
                  >
                    {sharingId === game.id
                      ? 'Generating...'
                      : copiedId === game.id
                        ? '✓ Link Copied!'
                        : game.report_code
                          ? 'Copy Report Link'
                          : 'Share Report'}
                  </button>
                  {game.report_code && (
                    <a
                      href={`/report/${game.report_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="battle-report__card-view-link"
                    >
                      View public report ↗
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
