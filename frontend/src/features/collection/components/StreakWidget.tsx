import { useEffect, useState } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import type { HobbyStreak } from '../../../shared/types/database';

interface StreakWidgetProps {
  userId: string;
}

export function StreakWidget({ userId }: StreakWidgetProps) {
  const [streak, setStreak] = useState<HobbyStreak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('hobby_streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        setStreak(data as HobbyStreak | null);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <div className="streak-widget skeleton" style={{ height: '60px' }} />;
  }

  const days = streak?.current_streak_days ?? 0;
  const longest = streak?.longest_streak_days ?? 0;
  const total = streak?.total_active_days ?? 0;

  return (
    <div className="streak-widget">
      <div className="streak-widget__flame">🔥</div>
      <div className="streak-widget__body">
        <div className="streak-widget__current">
          <span className="streak-widget__days">{days}</span>
          <span className="streak-widget__label">day streak</span>
        </div>
        <div className="streak-widget__sub">
          Best: <strong>{longest}</strong> &middot; Total: <strong>{total}</strong>
        </div>
      </div>
    </div>
  );
}
