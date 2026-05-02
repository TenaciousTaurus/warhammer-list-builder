import { useParams } from 'react-router-dom';
import '../play-mode.css';
import { useSpectateSession } from '../hooks/useSpectateSession';
import { ScoreBoard } from '../components/ScoreBoard';
import { EventLog } from '../components/EventLog';
import { PHASES } from '../stores/gameSessionStore';

export function SpectateGamePage() {
  const { code } = useParams<{ code: string }>();
  const { session, events, scores, loading, error, realtimeStatus } = useSpectateSession(code);

  if (loading) {
    return (
      <div className="skeleton-list" style={{ padding: 'var(--space-lg)', maxWidth: '900px', margin: '0 auto' }}>
        <div className="skeleton skeleton--header" />
        <div className="skeleton skeleton--bar" />
        {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '56px', width: '100%' }} />)}
      </div>
    );
  }

  if (error || !session) {
    return (
      <div style={{ padding: 'var(--space-lg)', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ color: 'var(--color-red-bright)', background: 'rgba(192,64,64,0.1)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(192,64,64,0.3)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)', marginBottom: 'var(--space-sm)' }}>Game Not Found</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>{error ?? 'This game is not available for spectating.'}</p>
        </div>
      </div>
    );
  }

  const currentPhaseName = PHASES[session.current_phase] ?? PHASES[0];

  return (
    <div className="play-mode">
      {/* Header */}
      <div className="play-mode__header">
        <div>
          <h2 className="play-mode__title">
            {session.opponent_name ? `vs ${session.opponent_name}` : 'Live Game'}
          </h2>
          <span className="play-mode__subtitle">
            {session.opponent_faction ?? 'Unknown faction'}
            {' '}&middot; Spectating
          </span>
        </div>
        <div className="play-mode__header-actions">
          <span
            className={`play-mode__sync-status play-mode__sync-status--${realtimeStatus}`}
            title={`Live connection: ${realtimeStatus}`}
          >
            <span className="play-mode__sync-dot" />
            {realtimeStatus === 'connected' ? 'Live' : realtimeStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
          </span>
          <span className="play-mode__lock-badge">&#128065; Spectating</span>
        </div>
      </div>

      {/* Read-only phase/round display */}
      <div className="phase-tracker">
        <div className="phase-tracker__section">
          <span className="phase-tracker__label">Round</span>
          <div className="phase-tracker__controls">
            <span className="phase-tracker__value">{session.current_round}</span>
          </div>
        </div>
        <div className="phase-tracker__section">
          <span className="phase-tracker__label">Phase</span>
          <div className="phase-tracker__controls">
            <span className="phase-tracker__value phase-tracker__value--phase">{currentPhaseName}</span>
          </div>
        </div>
        <div className="phase-tracker__section">
          <span className="phase-tracker__label">CP</span>
          <div className="phase-tracker__controls">
            <span className="phase-tracker__value">{session.cp}</span>
          </div>
        </div>
        <div className="phase-tracker__section">
          <span className="phase-tracker__label">My VP</span>
          <div className="phase-tracker__controls">
            <span className="phase-tracker__value">{session.my_vp}</span>
          </div>
        </div>
        <div className="phase-tracker__section">
          <span className="phase-tracker__label">Opp VP</span>
          <div className="phase-tracker__controls">
            <span className="phase-tracker__value">{session.opponent_vp}</span>
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="play-mode__score-tab" style={{ marginTop: 'var(--space-md)' }}>
        <ScoreBoard
          myVP={session.my_vp}
          opponentVP={session.opponent_vp}
          scores={scores}
          currentRound={session.current_round}
        />
      </div>

      {/* Event log */}
      <div className="play-mode__log-tab" style={{ marginTop: 'var(--space-md)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-sm)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Battle Log
        </h3>
        <EventLog events={events} />
      </div>
    </div>
  );
}
