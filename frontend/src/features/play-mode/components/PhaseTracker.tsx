import { useGameSessionStore, PHASES } from '../stores/gameSessionStore';

export function PhaseTracker() {
  const session = useGameSessionStore((s) => s.session);
  const advancePhase = useGameSessionStore((s) => s.advancePhase);
  const previousPhase = useGameSessionStore((s) => s.previousPhase);
  const setRound = useGameSessionStore((s) => s.setRound);
  const adjustCP = useGameSessionStore((s) => s.adjustCP);
  const adjustMyVP = useGameSessionStore((s) => s.adjustMyVP);
  const adjustOpponentVP = useGameSessionStore((s) => s.adjustOpponentVP);

  if (!session) return null;

  const currentPhaseName = PHASES[session.current_phase] ?? PHASES[0];

  return (
    <div className="phase-tracker">
      <div className="phase-tracker__section">
        <span className="phase-tracker__label">Round</span>
        <div className="phase-tracker__controls">
          <button
            className="phase-tracker__btn"
            onClick={() => setRound(session.current_round - 1)}
            disabled={session.current_round <= 1}
            aria-label="Previous round"
          >
            -
          </button>
          <span className="phase-tracker__value">{session.current_round}</span>
          <button
            className="phase-tracker__btn"
            onClick={() => setRound(session.current_round + 1)}
            disabled={session.current_round >= 5}
            aria-label="Next round"
          >
            +
          </button>
        </div>
      </div>

      <div className="phase-tracker__section">
        <span className="phase-tracker__label">Phase</span>
        <div className="phase-tracker__controls">
          <button
            className="phase-tracker__btn"
            onClick={previousPhase}
            disabled={session.current_round <= 1 && session.current_phase <= 0}
            aria-label="Previous phase"
          >
            &#9664;
          </button>
          <span className="phase-tracker__value phase-tracker__value--phase">
            {currentPhaseName}
          </span>
          <button
            className="phase-tracker__btn"
            onClick={advancePhase}
            disabled={session.current_round >= 5 && session.current_phase >= PHASES.length - 1}
            aria-label="Next phase"
          >
            &#9654;
          </button>
        </div>
      </div>

      <div className="phase-tracker__section">
        <span className="phase-tracker__label">CP</span>
        <div className="phase-tracker__controls">
          <button
            className="phase-tracker__btn"
            onClick={() => adjustCP(-1)}
            disabled={session.cp <= 0}
            aria-label="Spend CP"
          >
            -
          </button>
          <span className="phase-tracker__value">{session.cp}</span>
          <button
            className="phase-tracker__btn"
            onClick={() => adjustCP(1)}
            aria-label="Gain CP"
          >
            +
          </button>
        </div>
      </div>

      <div className="phase-tracker__section">
        <span className="phase-tracker__label">My VP</span>
        <div className="phase-tracker__controls">
          <button
            className="phase-tracker__btn"
            onClick={() => adjustMyVP(-1)}
            disabled={session.my_vp <= 0}
            aria-label="Decrease my VP"
          >
            -
          </button>
          <span className="phase-tracker__value">{session.my_vp}</span>
          <button
            className="phase-tracker__btn"
            onClick={() => adjustMyVP(1)}
            aria-label="Increase my VP"
          >
            +
          </button>
        </div>
      </div>

      <div className="phase-tracker__section">
        <span className="phase-tracker__label">Opp VP</span>
        <div className="phase-tracker__controls">
          <button
            className="phase-tracker__btn"
            onClick={() => adjustOpponentVP(-1)}
            disabled={session.opponent_vp <= 0}
            aria-label="Decrease opponent VP"
          >
            -
          </button>
          <span className="phase-tracker__value">{session.opponent_vp}</span>
          <button
            className="phase-tracker__btn"
            onClick={() => adjustOpponentVP(1)}
            aria-label="Increase opponent VP"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
