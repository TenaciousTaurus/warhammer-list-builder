import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useSocialStore } from '../stores/socialStore';
import { StatsDashboard } from '../components/StatsDashboard';
import '../social.css';

export function StatsPage() {
  const { user, loading: authLoading } = useAuth();
  const { stats, loading, error, loadStats } = useSocialStore();

  useEffect(() => {
    if (user?.id) {
      loadStats(user.id);
    }
  }, [user?.id, loadStats]);

  if (authLoading || loading) {
    return (
      <div className="stats-page">
        <div className="stats-page__skeleton">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="stats-page__skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-page">
        <div className="stats-page__error">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="stats-page">
        <div className="empty-state card">
          <div className="empty-state__icon">&#128200;</div>
          <div className="empty-state__title">No Stats Yet</div>
          <p className="empty-state__description">
            Your battle record, win rate, and head-to-head matchups will appear
            here once you've played a few games. Start a game from one of your
            army lists to begin tracking.
          </p>
          <div className="empty-state__action">
            <Link to="/lists" className="btn btn--primary">
              Go to My Lists
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <h1 className="stats-page__title">My Stats</h1>
      <StatsDashboard stats={stats} />
    </div>
  );
}
