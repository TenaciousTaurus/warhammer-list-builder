import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './shared/css/base.css';
import './shared/css/pages.css';
import './features/list-builder/list-builder.css';
import './features/play-mode/play-mode.css';
import './features/collection/collection.css';
import './features/crusade/crusade.css';
import './features/social/social.css';
import { useAuth } from './shared/hooks/useAuth';
import { AuthPage } from './shared/pages/AuthPage';
import { DashboardPage } from './shared/pages/DashboardPage';
import { ListsPage } from './features/list-builder/pages/ListsPage';
import { ListEditorPage } from './features/list-builder/pages/ListEditorPage';
import { UnitsPage } from './shared/pages/UnitsPage';
import { SharedListPage } from './shared/pages/SharedListPage';
import { PlayModePage } from './features/play-mode/pages/PlayModePage';
import { CollectionPage } from './features/collection/pages/CollectionPage';
import { PaintRecipesPage } from './features/collection/pages/PaintRecipesPage';
import { CampaignsPage } from './features/crusade/pages/CampaignsPage';
import { CampaignDetailPage } from './features/crusade/pages/CampaignDetailPage';
import { CrusadeRosterPage } from './features/crusade/pages/CrusadeRosterPage';
import { CrusadeUnitDetailPage } from './features/crusade/pages/CrusadeUnitDetailPage';
import { BattleLogPage } from './features/crusade/pages/BattleLogPage';
import { ProfilePage } from './features/social/pages/ProfilePage';
import { FriendsPage } from './features/social/pages/FriendsPage';
import { StatsPage } from './features/social/pages/StatsPage';
import { TournamentsPage } from './features/social/pages/TournamentsPage';
import { TournamentDetailPage } from './features/social/pages/TournamentDetailPage';
import { TournamentRoundPage } from './features/social/pages/TournamentRoundPage';
import { useState, type ReactNode } from 'react';
import { FeedbackModal } from './shared/components/FeedbackModal';
import { ThemePicker } from './shared/components/ThemePicker';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="skeleton-list" style={{ padding: 'var(--space-lg)' }}>
        <div className="skeleton skeleton--header" />
        <div className="skeleton skeleton--bar" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AppHeader() {
  const { user, signOut } = useAuth();
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <>
    <header className="app-header">
      <NavLink to="/" className="app-header__title">WarForge</NavLink>
      <nav className="app-header__nav">
        {user && (
          <>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `app-header__link${isActive ? ' app-header__link--active' : ''}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/lists"
              className={({ isActive }) =>
                `app-header__link${isActive ? ' app-header__link--active' : ''}`
              }
            >
              My Lists
            </NavLink>
            <NavLink
              to="/collection"
              className={({ isActive }) =>
                `app-header__link${isActive ? ' app-header__link--active' : ''}`
              }
            >
              Collection
            </NavLink>
            <NavLink
              to="/campaigns"
              className={({ isActive }) =>
                `app-header__link${isActive ? ' app-header__link--active' : ''}`
              }
            >
              Crusade
            </NavLink>
            <NavLink
              to="/tournaments"
              className={({ isActive }) =>
                `app-header__link${isActive ? ' app-header__link--active' : ''}`
              }
            >
              Compete
            </NavLink>
          </>
        )}
        <NavLink
          to="/units"
          className={({ isActive }) =>
            `app-header__link${isActive ? ' app-header__link--active' : ''}`
          }
        >
          Browse
        </NavLink>
        <ThemePicker />
        {user ? (
          <div className="app-header__user">
            <span className="app-header__email">{user.email}</span>
            <button
              className="app-header__feedback"
              onClick={() => setShowFeedback(true)}
            >
              Feedback
            </button>
            <button className="btn btn--sm app-header__signout" onClick={signOut}>
              Sign Out
            </button>
          </div>
        ) : (
          <NavLink
            to="/auth"
            className={({ isActive }) =>
              `app-header__link${isActive ? ' app-header__link--active' : ''}`
            }
          >
            Sign In
          </NavLink>
        )}
      </nav>
    </header>
    {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <AppHeader />
        <main className="app-main">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/lists" element={<ProtectedRoute><ListsPage /></ProtectedRoute>} />
            <Route path="/list/:id" element={<ProtectedRoute><ListEditorPage /></ProtectedRoute>} />
            <Route path="/play/:id" element={<ProtectedRoute><PlayModePage /></ProtectedRoute>} />
            <Route path="/collection" element={<ProtectedRoute><CollectionPage /></ProtectedRoute>} />
            <Route path="/collection/recipes" element={<ProtectedRoute><PaintRecipesPage /></ProtectedRoute>} />
            {/* Phase 4: Crusade & Campaign */}
            <Route path="/campaigns" element={<ProtectedRoute><CampaignsPage /></ProtectedRoute>} />
            <Route path="/campaign/:id" element={<ProtectedRoute><CampaignDetailPage /></ProtectedRoute>} />
            <Route path="/campaign/:id/roster/:memberId" element={<ProtectedRoute><CrusadeRosterPage /></ProtectedRoute>} />
            <Route path="/campaign/:id/unit/:unitId" element={<ProtectedRoute><CrusadeUnitDetailPage /></ProtectedRoute>} />
            <Route path="/campaign/:id/battle/new" element={<ProtectedRoute><BattleLogPage /></ProtectedRoute>} />
            <Route path="/campaign/:id/battle/:battleId" element={<ProtectedRoute><BattleLogPage /></ProtectedRoute>} />
            {/* Phase 5: Social, Stats & Tournaments */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
            <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
            <Route path="/tournaments" element={<ProtectedRoute><TournamentsPage /></ProtectedRoute>} />
            <Route path="/tournament/:id" element={<ProtectedRoute><TournamentDetailPage /></ProtectedRoute>} />
            <Route path="/tournament/:id/round/:roundNumber" element={<ProtectedRoute><TournamentRoundPage /></ProtectedRoute>} />
            {/* Public routes */}
            <Route path="/units" element={<UnitsPage />} />
            <Route path="/shared/:code" element={<SharedListPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
