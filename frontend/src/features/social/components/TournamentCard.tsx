import type { Tournament } from '../../../shared/types/database';

interface TournamentCardProps {
  tournament: Tournament;
  participantCount: number;
  onClick: () => void;
}

const FORMAT_LABELS: Record<string, string> = {
  swiss: 'Swiss',
  single_elimination: 'Single Elim',
  round_robin: 'Round Robin',
};

const STATUS_LABELS: Record<string, string> = {
  registration: 'Registration',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function TournamentCard({ tournament, participantCount, onClick }: TournamentCardProps) {
  return (
    <div
      className="tournament-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="tournament-card__header">
        <h3 className="tournament-card__name">{tournament.name}</h3>
        <span
          className={`tournament-card__status tournament-card__status--${tournament.status}`}
        >
          {STATUS_LABELS[tournament.status]}
        </span>
      </div>

      <div className="tournament-card__meta">
        <span className="tournament-card__format-badge">
          {FORMAT_LABELS[tournament.format]}
        </span>
        <span className="tournament-card__info">
          {participantCount}/{tournament.max_players} players
        </span>
        <span className="tournament-card__info">
          {tournament.points_limit}pts
        </span>
        <span className="tournament-card__info">
          {tournament.num_rounds} rounds
        </span>
      </div>

      {tournament.description && (
        <p className="tournament-card__description">{tournament.description}</p>
      )}

      <div className="tournament-card__footer">
        <span className="tournament-card__date">
          {new Date(tournament.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
