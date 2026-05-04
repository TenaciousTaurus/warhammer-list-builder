import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../play-mode.css';
import { supabase } from '../../../shared/lib/supabase';
import { PHASES } from '../stores/gameSessionStore';
import type { GameSession, GameSessionEvent, GameSessionScore } from '../../../shared/types/database';

interface ReportData {
  session: GameSession;
  events: GameSessionEvent[];
  scores: GameSessionScore[];
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
}

function formatDuration(startedAt: string | null, completedAt: string | null) {
  if (!startedAt || !completedAt) return null;
  const diffMs = new Date(completedAt).getTime() - new Date(startedAt).getTime();
  const totalMin = Math.floor(diffMs / 60000);
  const hrs = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

export function BattleReportPage() {
  const { code } = useParams<{ code: string }>();
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) return;
    (async () => {
      const sessionRes = await supabase
        .from('game_sessions')
        .select('*')
        .eq('report_code', code)
        .single();

      if (sessionRes.error || !sessionRes.data) {
        setError(sessionRes.error?.message ?? 'Report not found');
        setLoading(false);
        return;
      }

      const session = sessionRes.data as GameSession;

      const [eventsRes, scoresRes] = await Promise.all([
        supabase.from('game_session_events').select('*').eq('game_session_id', session.id).order('created_at'),
        supabase.from('game_session_scores').select('*').eq('game_session_id', session.id).order('round'),
      ]);

      setData({
        session,
        events: (eventsRes.data ?? []) as GameSessionEvent[],
        scores: (scoresRes.data ?? []) as GameSessionScore[],
      });
      setLoading(false);
    })();
  }, [code]);

  function handleCopyLink() {
    void navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (loading) {
    return (
      <div className="skeleton-list" style={{ padding: 'var(--space-lg)', maxWidth: '900px', margin: '0 auto' }}>
        <div className="skeleton skeleton--header" />
        <div className="skeleton skeleton--bar" />
        {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '56px', width: '100%', marginBottom: 'var(--space-sm)' }} />)}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: 'var(--space-lg)', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ color: 'var(--color-red-bright)', background: 'rgba(192,64,64,0.1)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(192,64,64,0.3)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', marginBottom: 'var(--space-sm)' }}>Report Not Found</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{error ?? 'This battle report does not exist or has been removed.'}</p>
          <Link to="/" className="btn btn--primary" style={{ display: 'inline-block', marginTop: 'var(--space-md)' }}>Go Home</Link>
        </div>
      </div>
    );
  }

  const { session, events, scores } = data;
  const result = session.result ?? 'draw';
  const duration = formatDuration(session.started_at, session.completed_at);
  const completedDate = formatDate(session.completed_at);

  // Group events by round
  const eventsByRound = new Map<number, GameSessionEvent[]>();
  for (const ev of events) {
    const round = ev.round ?? 0;
    if (!eventsByRound.has(round)) eventsByRound.set(round, []);
    eventsByRound.get(round)!.push(ev);
  }

  // Group scores by objective
  const objectiveNames = [...new Set(scores.map(s => s.objective_name))];
  const rounds = [1, 2, 3, 4, 5];

  return (
    <div className="battle-report-page" style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--space-lg)' }}>

      {/* Hero header */}
      <div className={`battle-report-page__hero battle-report-page__hero--${result}`}>
        <div className="battle-report-page__result-badge">{result.toUpperCase()}</div>
        <div className="battle-report-page__score-row">
          <span className="battle-report-page__score battle-report-page__score--mine">{session.my_vp}</span>
          <span className="battle-report-page__score-sep">—</span>
          <span className="battle-report-page__score battle-report-page__score--theirs">{session.opponent_vp}</span>
        </div>
        <div className="battle-report-page__opponent">
          vs {session.opponent_name || 'Unknown'}
          {session.opponent_faction && <span className="battle-report-page__faction"> ({session.opponent_faction})</span>}
        </div>
        <div className="battle-report-page__meta">
          {completedDate}
          {duration && <span> &middot; {duration}</span>}
          <span> &middot; {session.current_round} round{session.current_round !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Share bar */}
      <div className="battle-report-page__share-bar">
        <span className="battle-report-page__share-label">Public battle report</span>
        <button className="btn btn--sm btn--ghost" onClick={handleCopyLink}>
          {copied ? '✓ Copied!' : 'Copy Link'}
        </button>
      </div>

      {/* Notes */}
      {session.notes && (
        <div className="battle-report-page__notes card">
          <strong>Notes</strong>
          <p style={{ margin: 'var(--space-xs) 0 0', color: 'var(--text-secondary)' }}>{session.notes}</p>
        </div>
      )}

      {/* Score table */}
      {objectiveNames.length > 0 && (
        <div className="battle-report-page__section">
          <h3 className="battle-report-page__section-title">Scoring by Objective</h3>
          <div className="battle-report-page__score-table-wrap">
            <table className="battle-report-page__score-table">
              <thead>
                <tr>
                  <th>Objective</th>
                  {rounds.map(r => <th key={r}>R{r}</th>)}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {objectiveNames.map(name => {
                  const rowScores = scores.filter(s => s.objective_name === name);
                  const total = rowScores.reduce((s, r) => s + (r.vp_scored ?? 0), 0);
                  return (
                    <tr key={name}>
                      <td className="battle-report-page__obj-name">{name}</td>
                      {rounds.map(r => {
                        const entry = rowScores.find(s => s.round === r);
                        return <td key={r}>{entry?.vp_scored ?? '—'}</td>;
                      })}
                      <td><strong>{total}</strong></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Turn-by-turn event timeline */}
      <div className="battle-report-page__section">
        <h3 className="battle-report-page__section-title">Turn-by-Turn Timeline</h3>
        {[...eventsByRound.entries()].sort(([a], [b]) => a - b).map(([round, roundEvents]) => (
          <div key={round} className="battle-report-page__round-block">
            <div className="battle-report-page__round-label">
              {round === 0 ? 'Pre-Game' : `Round ${round}`}
            </div>
            <div className="battle-report-page__event-list">
              {roundEvents.map(ev => (
                <div key={ev.id} className="battle-report-page__event">
                  <span className="battle-report-page__event-phase">
                    {ev.phase != null ? PHASES[ev.phase] ?? '' : ''}
                  </span>
                  <span className="battle-report-page__event-desc">{ev.description}</span>
                  <span className="battle-report-page__event-time">
                    {new Date(ev.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="battle-report-page__footer">
        <Link to="/" className="btn btn--ghost">← Back to WarForge</Link>
      </div>
    </div>
  );
}
