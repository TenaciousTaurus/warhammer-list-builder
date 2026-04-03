import { useState, useEffect } from 'react';
import { useGameSessionStore } from '../stores/gameSessionStore';

interface GameSetupProps {
  armyListId: string;
  userId: string;
  onGameCreated: (sessionId: string) => void;
}

export function GameSetup({ armyListId, userId, onGameCreated }: GameSetupProps) {
  const createSession = useGameSessionStore((s) => s.createSession);
  const loadMissions = useGameSessionStore((s) => s.loadMissions);
  const missions = useGameSessionStore((s) => s.missions);
  const loading = useGameSessionStore((s) => s.loading);
  const error = useGameSessionStore((s) => s.error);

  const [opponentName, setOpponentName] = useState('');
  const [opponentFaction, setOpponentFaction] = useState('');
  const [missionId, setMissionId] = useState('');

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sessionId = await createSession(
      armyListId,
      userId,
      opponentName.trim() || undefined,
      opponentFaction.trim() || undefined,
      missionId || undefined,
    );
    if (sessionId) {
      onGameCreated(sessionId);
    }
  };

  return (
    <form className="game-setup" onSubmit={handleSubmit}>
      <h2 className="game-setup__title">New Game</h2>

      <div className="game-setup__field">
        <label className="game-setup__label" htmlFor="opponent-name">
          Opponent Name
        </label>
        <input
          id="opponent-name"
          className="game-setup__input"
          type="text"
          placeholder="Enter opponent name"
          value={opponentName}
          onChange={(e) => setOpponentName(e.target.value)}
        />
      </div>

      <div className="game-setup__field">
        <label className="game-setup__label" htmlFor="opponent-faction">
          Opponent Faction
        </label>
        <input
          id="opponent-faction"
          className="game-setup__input"
          type="text"
          placeholder="Enter opponent faction"
          value={opponentFaction}
          onChange={(e) => setOpponentFaction(e.target.value)}
        />
      </div>

      {missions.length > 0 && (
        <div className="game-setup__field">
          <label className="game-setup__label" htmlFor="mission-select">
            Mission
          </label>
          <select
            id="mission-select"
            className="game-setup__select"
            value={missionId}
            onChange={(e) => setMissionId(e.target.value)}
          >
            <option value="">-- No Mission --</option>
            {missions.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="game-setup__error">{error}</p>}

      <button
        className="game-setup__btn"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Start Game'}
      </button>
    </form>
  );
}
