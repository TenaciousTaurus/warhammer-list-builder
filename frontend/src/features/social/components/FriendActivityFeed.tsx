import { useEffect, useState } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import type { FriendActivityItem } from '../../../shared/types/database';

interface FriendActivityFeedProps {
  userId: string;
}

function relativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

const ACTIVITY_ICON: Record<string, string> = {
  game: '⚔',
  painted: '🎨',
};

export function FriendActivityFeed({ userId }: FriendActivityFeedProps) {
  const [items, setItems] = useState<FriendActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [noFriends, setNoFriends] = useState(false);

  useEffect(() => {
    (async () => {
      // Check if user has any friends first
      const { count } = await supabase
        .from('friendships')
        .select('id', { count: 'exact', head: true })
        .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
        .eq('status', 'accepted');

      if (!count) {
        setNoFriends(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc('get_friend_activity', {
        p_user_id: userId,
        p_limit: 15,
      });

      if (!error && data) {
        setItems(data as FriendActivityItem[]);
      }
      setLoading(false);
    })();
  }, [userId]);

  if (loading) {
    return (
      <div className="friend-feed__loading">
        {[1, 2, 3].map(i => <div key={i} className="skeleton skeleton--bar" style={{ marginBottom: 'var(--space-xs)' }} />)}
      </div>
    );
  }

  if (noFriends) {
    return (
      <p className="dashboard__empty">
        Add friends to see their activity here.{' '}
        <a href="/friends" style={{ color: 'var(--gold)' }}>Find players</a>
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="dashboard__empty">
        No recent activity from your friends in the last 30 days.
      </p>
    );
  }

  return (
    <div className="friend-feed">
      {items.map((item, i) => (
        <div key={i} className={`friend-feed__item friend-feed__item--${item.activity_type}`}>
          <span className="friend-feed__icon" aria-hidden="true">
            {ACTIVITY_ICON[item.activity_type] ?? '●'}
          </span>
          <div className="friend-feed__content">
            <span className="friend-feed__actor">{item.actor_name}</span>
            {' '}
            <span className="friend-feed__desc">{item.description}</span>
          </div>
          <span className="friend-feed__time">{relativeTime(item.activity_at)}</span>
        </div>
      ))}
    </div>
  );
}
