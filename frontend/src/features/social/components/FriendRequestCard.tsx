import type { FriendWithProfile } from '../stores/socialStore';

interface FriendRequestCardProps {
  friendship: FriendWithProfile;
  onAccept: () => void;
  onDecline: () => void;
}

export function FriendRequestCard({ friendship, onAccept, onDecline }: FriendRequestCardProps) {
  const { profile } = friendship;
  const initial = profile.display_name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <div className="friend-card friend-card--request">
      <div className="friend-card__info">
        <div className="friend-card__avatar">{initial}</div>
        <div className="friend-card__details">
          <span className="friend-card__name">{profile.display_name}</span>
          {profile.bio && (
            <span className="friend-card__bio">{profile.bio}</span>
          )}
        </div>
      </div>
      <div className="friend-card__actions">
        <button className="friend-card__accept-btn" onClick={onAccept}>
          Accept
        </button>
        <button className="friend-card__decline-btn" onClick={onDecline}>
          Decline
        </button>
      </div>
    </div>
  );
}
