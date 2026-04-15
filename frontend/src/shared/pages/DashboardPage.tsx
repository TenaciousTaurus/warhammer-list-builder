import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { WelcomeModal } from '../components/WelcomeModal';
import type { ArmyList, Faction, GameSession } from '../types/database';

export function DashboardPage() {
  const { user } = useAuth();
  const [recentLists, setRecentLists] = useState<(ArmyList & { factions: Faction })[]>([]);
  const [activeGame, setActiveGame] = useState<(GameSession & { army_lists: ArmyList }) | null>(null);
  const [completedGames, setCompletedGames] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Show welcome modal once per user per browser
    if (!localStorage.getItem(`warforge_welcomed_${user.id}`)) {
      setShowWelcome(true);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [listsRes, activeRes, completedRes] = await Promise.all([
        supabase
          .from('army_lists')
          .select('*, factions(*)')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(5),
        supabase
          .from('game_sessions')
          .select('*, army_lists(*)')
          .eq('user_id', user.id)
          .in('status', ['active', 'paused'])
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('game_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false })
          .limit(20),
      ]);

      if (listsRes.data) setRecentLists(listsRes.data as (ArmyList & { factions: Faction })[]);
      if (activeRes.data) setActiveGame(activeRes.data as GameSession & { army_lists: ArmyList });
      if (completedRes.data) setCompletedGames(completedRes.data as GameSession[]);
      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="skeleton skeleton--header" />
        <div className="dashboard__grid">
          {[1, 2, 3].map(i => <div key={i} className="skeleton skeleton--card" />)}
        </div>
      </div>
    );
  }

  const wins = completedGames.filter(g => g.result === 'win').length;
  const losses = completedGames.filter(g => g.result === 'loss').length;
  const draws = completedGames.filter(g => g.result === 'draw').length;
  const totalGames = completedGames.length;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  return (
    <div className="dashboard">
      {showWelcome && user && (
        <WelcomeModal userId={user.id} onDone={() => setShowWelcome(false)} />
      )}
      <h2 className="dashboard__title">Command Center</h2>

      <div className="dashboard__grid">
        {/* Active Game Widget */}
        {activeGame && (
          <div className="dashboard__card dashboard__card--active-game">
            <div className="dashboard__card-header">
              <span className="dashboard__card-icon">&#9876;</span>
              <h3 className="dashboard__card-title">Active Game</h3>
            </div>
            <div className="dashboard__card-body">
              <p className="dashboard__game-name">
                {(activeGame.army_lists as ArmyList)?.name ?? 'Game in progress'}
              </p>
              {activeGame.opponent_name && (
                <p className="dashboard__game-opponent">vs {activeGame.opponent_name}</p>
              )}
              <p className="dashboard__game-status">
                Round {activeGame.current_round} &middot;{' '}
                {activeGame.status === 'paused' ? 'Paused' : 'In Progress'}
              </p>
              <Link
                to={`/play/${activeGame.army_list_id}`}
                className="btn btn--primary dashboard__resume-btn"
              >
                Resume Game
              </Link>
            </div>
          </div>
        )}

        {/* Quick Stats Widget */}
        <div className="dashboard__card dashboard__card--stats">
          <div className="dashboard__card-header">
            <span className="dashboard__card-icon">&#128200;</span>
            <h3 className="dashboard__card-title">Battle Record</h3>
          </div>
          <div className="dashboard__card-body">
            {totalGames === 0 ? (
              <p className="dashboard__empty">No games played yet. Build a list, then start a game from the list editor.</p>
            ) : (
              <div className="dashboard__stats-grid">
                <div className="dashboard__stat">
                  <span className="dashboard__stat-value dashboard__stat-value--win">{wins}</span>
                  <span className="dashboard__stat-label">Wins</span>
                </div>
                <div className="dashboard__stat">
                  <span className="dashboard__stat-value dashboard__stat-value--loss">{losses}</span>
                  <span className="dashboard__stat-label">Losses</span>
                </div>
                <div className="dashboard__stat">
                  <span className="dashboard__stat-value dashboard__stat-value--draw">{draws}</span>
                  <span className="dashboard__stat-label">Draws</span>
                </div>
                <div className="dashboard__stat">
                  <span className="dashboard__stat-value">{winRate}%</span>
                  <span className="dashboard__stat-label">Win Rate</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Lists Widget */}
        <div className="dashboard__card dashboard__card--lists">
          <div className="dashboard__card-header">
            <span className="dashboard__card-icon">&#128221;</span>
            <h3 className="dashboard__card-title">Recent Lists</h3>
            <Link to="/lists" className="dashboard__card-link">View All</Link>
          </div>
          <div className="dashboard__card-body">
            {recentLists.length === 0 ? (
              <p className="dashboard__empty">
                No army lists yet. <Link to="/lists">Create one</Link> to get started.
              </p>
            ) : (
              <div className="dashboard__list-items">
                {recentLists.map(list => (
                  <Link key={list.id} to={`/list/${list.id}`} className="dashboard__list-item">
                    <span className="dashboard__list-name">{list.name}</span>
                    <span className="dashboard__list-meta">
                      {list.factions?.name} &middot; {list.points_limit} pts
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Collection & Hobby */}
        <div className="dashboard__card dashboard__card--hobby">
          <div className="dashboard__card-header">
            <span className="dashboard__card-icon">&#127912;</span>
            <h3 className="dashboard__card-title">Collection &amp; Hobby</h3>
            <Link to="/collection" className="dashboard__card-link">Open</Link>
          </div>
          <div className="dashboard__card-body">
            <p className="dashboard__empty-hint">
              Track your miniatures, painting progress, and paint recipes.
            </p>
            <div className="dashboard__quick-links">
              <Link to="/collection" className="dashboard__quick-link">My Collection</Link>
              <Link to="/collection/recipes" className="dashboard__quick-link">Paint Recipes</Link>
              <Link to="/collection/paints" className="dashboard__quick-link">Paint Inventory</Link>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="dashboard__card dashboard__card--explore">
          <div className="dashboard__card-header">
            <span className="dashboard__card-icon">&#128269;</span>
            <h3 className="dashboard__card-title">Explore</h3>
          </div>
          <div className="dashboard__card-body">
            <div className="dashboard__quick-links">
              <Link to="/units" className="dashboard__quick-link">Browse All Units</Link>
              <Link to="/campaigns" className="dashboard__quick-link">Crusade Campaigns</Link>
              <Link to="/tournaments" className="dashboard__quick-link">Tournaments</Link>
              <Link to="/leagues" className="dashboard__quick-link">Leagues</Link>
              <Link to="/friends" className="dashboard__quick-link">Friends &amp; Stats</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
