import type { UserProfile } from '../../../shared/types/database';

interface ProfileCardProps {
  profile: UserProfile;
  record?: { wins: number; losses: number; draws: number };
  onClick?: () => void;
}

export function ProfileCard({ profile, record, onClick }: ProfileCardProps) {
  const initial = profile.display_name?.charAt(0)?.toUpperCase() ?? '?';
  const recordText = record
    ? `${record.wins}W - ${record.losses}L - ${record.draws}D`
    : null;

  return (
    <div
      className={`profile-card profile-card--compact ${onClick ? 'profile-card--clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className="profile-card__avatar">{initial}</div>
      <div className="profile-card__details">
        <span className="profile-card__display-name">{profile.display_name}</span>
        {recordText && (
          <span className="profile-card__record">{recordText}</span>
        )}
      </div>
    </div>
  );
}
