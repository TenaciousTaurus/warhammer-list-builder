import { useEffect, useState } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import type { Achievement } from '../../../shared/types/database';

interface EarnedAchievement extends Achievement {
  earned_at: string;
}

interface AchievementsPanelProps {
  userId: string;
}

export function AchievementsPanel({ userId }: AchievementsPanelProps) {
  const [earned, setEarned] = useState<EarnedAchievement[]>([]);
  const [all, setAll] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase
        .from('user_achievements')
        .select('achievement_id, earned_at, achievements(*)')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false }),
      supabase
        .from('achievements')
        .select('*')
        .order('name'),
    ]).then(([earnedRes, allRes]) => {
      if (earnedRes.data) {
        setEarned(
          earnedRes.data.map((row) => ({
            ...(row.achievements as unknown as Achievement),
            earned_at: row.earned_at,
          }))
        );
      }
      if (allRes.data) setAll(allRes.data as Achievement[]);
      setLoading(false);
    });
  }, [userId]);

  if (loading) {
    return (
      <div className="achievements-panel">
        <div className="skeleton" style={{ height: '24px', width: '160px', marginBottom: '12px' }} />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ width: '64px', height: '64px', borderRadius: '8px' }} />
          ))}
        </div>
      </div>
    );
  }

  const earnedIds = new Set(earned.map(e => e.id));
  const locked = all.filter(a => !earnedIds.has(a.id));

  return (
    <div className="achievements-panel">
      <h3 className="achievements-panel__title">
        Achievements <span className="achievements-panel__count">{earned.length}/{all.length}</span>
      </h3>

      {earned.length > 0 && (
        <div className="achievements-panel__shelf">
          {earned.map(a => (
            <div key={a.id} className="achievement-badge achievement-badge--earned" title={`${a.name}: ${a.description}`}>
              <span className="achievement-badge__icon">{a.icon}</span>
              <span className="achievement-badge__name">{a.name}</span>
            </div>
          ))}
        </div>
      )}

      {locked.length > 0 && (
        <details className="achievements-panel__locked-details">
          <summary className="achievements-panel__locked-summary">
            {locked.length} locked
          </summary>
          <div className="achievements-panel__shelf achievements-panel__shelf--locked">
            {locked.map(a => (
              <div key={a.id} className="achievement-badge achievement-badge--locked" title={a.description}>
                <span className="achievement-badge__icon">🔒</span>
                <span className="achievement-badge__name">{a.name}</span>
              </div>
            ))}
          </div>
        </details>
      )}

      {earned.length === 0 && locked.length === 0 && (
        <p className="achievements-panel__empty">No achievements yet. Keep playing!</p>
      )}
    </div>
  );
}
