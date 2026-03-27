import { useState } from 'react';
import { useGameSessionStore } from '../stores/gameSessionStore';

interface GameSetupProps {
  armyListId: string;
  userId: string;
  onGameCreated: (sessionId: string) => void;
}

export function GameSetup({ armyListId, userId, onGameCreated }: GameSetupProps) {
  const createSession = useGameSessionStore((s) => s.createSession);
  const loading = useGameSessionStore((s) => s.loading);
  const error = useGameSessionStore((s) => s.error);

  const [opponentName, setOpponentName] = useState('');
  const [opponentFaction, setOpponentFaction] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sessionId = await createSession(
      armyListId,
      userId,
      opponentName.trim() || undefined,
      opponentFaction.trim() || undefined,
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
