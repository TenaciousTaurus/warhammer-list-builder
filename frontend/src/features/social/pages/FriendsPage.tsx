import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useSocialStore } from '../stores/socialStore';
import { ProfileCard } from '../components/ProfileCard';
import { FriendRequestCard } from '../components/FriendRequestCard';
import { PlayerSearchBar } from '../components/PlayerSearchBar';
import '../social.css';

type Tab = 'friends' | 'pending';

export function FriendsPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    friends,
    pendingRequests,
    loading,
    error,
    loadFriends,
    loadPendingRequests,
    sendFriendRequest,
    respondToRequest,
    removeFriend,
  } = useSocialStore();

  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadFriends(user.id);
      loadPendingRequests(user.id);
    }
  }, [user?.id, loadFriends, loadPendingRequests]);

  const handleSendRequest = useCallback(
    async (addresseeId: string) => {
      if (!user?.id) return;
      await sendFriendRequest(user.id, addresseeId);
    },
    [user?.id, sendFriendRequest]
  );

  const handleAccept = useCallback(
    async (friendshipId: string) => {
      await respondToRequest(friendshipId, true);
      if (user?.id) {
        loadFriends(user.id);
      }
    },
    [respondToRequest, loadFriends, user?.id]
  );

  const handleDecline = useCallback(
    async (friendshipId: string) => {
      await respondToRequest(friendshipId, false);
    },
    [respondToRequest]
  );

  const handleRemoveFriend = useCallback(
    async (friendshipId: string) => {
      await removeFriend(friendshipId);
    },
    [removeFriend]
  );

  const filteredFriends = searchQuery
    ? friends.filter((f) =>
        f.profile.display_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : friends;

  if (authLoading || loading) {
    return (
      <div className="friends-page">
        <div className="friends-page__skeleton">
          {[1, 2, 3].map((i) => (
            <div key={i} className="friends-page__skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="friends-page">
      <div className="friends-page__header">
        <h1 className="friends-page__title">Friends</h1>
        <PlayerSearchBar
          onSendRequest={handleSendRequest}
          currentUserId={user?.id ?? ''}
        />
      </div>

      {error && <div className="friends-page__error">{error}</div>}

      <div className="friends-page__tabs">
        <button
          className={`friends-page__tab ${activeTab === 'friends' ? 'friends-page__tab--active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          Friends ({friends.length})
        </button>
        <button
          className={`friends-page__tab ${activeTab === 'pending' ? 'friends-page__tab--active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({pendingRequests.length})
        </button>
      </div>

      {activeTab === 'friends' && (
        <div className="friends-page__content">
          <div className="friends-page__search">
            <input
              className="friends-page__search-input"
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredFriends.length === 0 ? (
            <div className="friends-page__empty">
              <p className="friends-page__empty-text">
                {searchQuery
                  ? 'No friends match your search.'
                  : 'No friends yet. Use the search bar above to find and add players.'}
              </p>
            </div>
          ) : (
            <div className="friends-page__list">
              {filteredFriends.map((friend) => (
                <div key={friend.id} className="friend-card">
                  <ProfileCard profile={friend.profile} />
                  <button
                    className="friend-card__remove-btn"
                    onClick={() => handleRemoveFriend(friend.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="friends-page__content">
          {pendingRequests.length === 0 ? (
            <div className="friends-page__empty">
              <p className="friends-page__empty-text">No pending friend requests.</p>
            </div>
          ) : (
            <div className="friends-page__list">
              {pendingRequests.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  friendship={request}
                  onAccept={() => handleAccept(request.id)}
                  onDecline={() => handleDecline(request.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
