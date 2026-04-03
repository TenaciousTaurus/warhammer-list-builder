import type { Tournament } from '../../../shared/types/database';

type TournamentFormat = Tournament['format'];
type TournamentStatus = Tournament['status'];

interface TournamentFiltersProps {
  nameQuery: string;
  formatFilter: TournamentFormat | '';
  statusFilter: TournamentStatus | '';
  sortBy: 'newest' | 'oldest' | 'name';
  onNameChange: (name: string) => void;
  onFormatChange: (format: TournamentFormat | '') => void;
  onStatusChange: (status: TournamentStatus | '') => void;
  onSortChange: (sort: 'newest' | 'oldest' | 'name') => void;
}

export function TournamentFilters({
  nameQuery,
  formatFilter,
  statusFilter,
  sortBy,
  onNameChange,
  onFormatChange,
  onStatusChange,
  onSortChange,
}: TournamentFiltersProps) {
  return (
    <div className="tournament-filters">
      <input
        className="tournament-filters__search"
        type="text"
        placeholder="Search tournaments..."
        value={nameQuery}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <select
        className="tournament-filters__select"
        value={formatFilter}
        onChange={(e) => onFormatChange(e.target.value as TournamentFormat | '')}
      >
        <option value="">All Formats</option>
        <option value="swiss">Swiss</option>
        <option value="single_elimination">Single Elimination</option>
        <option value="round_robin">Round Robin</option>
      </select>
      <select
        className="tournament-filters__select"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as TournamentStatus | '')}
      >
        <option value="">All Statuses</option>
        <option value="registration">Registration</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
      <select
        className="tournament-filters__select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest' | 'name')}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="name">Name A-Z</option>
      </select>
    </div>
  );
}
