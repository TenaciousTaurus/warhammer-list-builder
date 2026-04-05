import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './shared/css/base.css';
import './shared/css/pages.css';
import './features/list-builder/list-builder.css';
import './shared/css/settings.css';
import { useAuth } from './shared/hooks/useAuth';
import { AuthPage } from './shared/pages/AuthPage';
import { DashboardPage } from './shared/pages/DashboardPage';
import { ListsPage } from './features/list-builder/pages/ListsPage';
import { ListEditorPage } from './features/list-builder/pages/ListEditorPage';
import { lazy, Suspense, useState, type ReactNode } from 'react';
import { FeedbackModal } from './shared/components/FeedbackModal';
import { ThemePicker } from './shared/components/ThemePicker';

// Lazy-loaded routes (code-split into separate chunks)
const UnitsPage = lazy(() => import('./shared/pages/UnitsPage').then(m => ({ default: m.UnitsPage })));
const SharedListPage = lazy(() => import('./shared/pages/SharedListPage').then(m => ({ default: m.SharedListPage })));
const PlayModePage = lazy(() => import('./features/play-mode/pages/PlayModePage').then(m => ({ default: m.PlayModePage })));
const CollectionPage = lazy(() => import('./features/collection/pages/CollectionPage').then(m => ({ default: m.CollectionPage })));
const PaintRecipesPage = lazy(() => import('./features/collection/pages/PaintRecipesPage').then(m => ({ default: m.PaintRecipesPage })));
const PaintInventoryPage = lazy(() => import('./features/collection/pages/PaintInventoryPage').then(m => ({ default: m.PaintInventoryPage })));
const CampaignsPage = lazy(() => import('./features/crusade/pages/CampaignsPage').then(m => ({ default: m.CampaignsPage })));
const CampaignDetailPage = lazy(() => import('./features/crusade/pages/CampaignDetailPage').then(m => ({ default: m.CampaignDetailPage })));
const CrusadeRosterPage = lazy(() => import('./features/crusade/pages/CrusadeRosterPage').then(m => ({ default: m.CrusadeRosterPage })));
const CrusadeUnitDetailPage = lazy(() => import('./features/crusade/pages/CrusadeUnitDetailPage').then(m => ({ default: m.CrusadeUnitDetailPage })));
const BattleLogPage = lazy(() => import('./features/crusade/pages/BattleLogPage').then(m => ({ default: m.BattleLogPage })));
const ProfilePage = lazy(() => import('./features/social/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const FriendsPage = lazy(() => import('./features/social/pages/FriendsPage').then(m => ({ default: m.FriendsPage })));
const StatsPage = lazy(() => import('./features/social/pages/StatsPage').then(m => ({ default: m.StatsPage })));
const TournamentsPage = lazy(() => import('./features/social/pages/TournamentsPage').then(m => ({ default: m.TournamentsPage })));
const TournamentDetailPage = lazy(() => import('./features/social/pages/TournamentDetailPage').then(m => ({ default: m.TournamentDetailPage })));
const TournamentRoundPage = lazy(() => import('./features/social/pages/TournamentRoundPage').then(m => ({ default: m.TournamentRoundPage })));
const LeaguesPage = lazy(() => import('./features/social/pages/LeaguesPage').then(m => ({ default: m.LeaguesPage })));
const LeagueDetailPage = lazy(() => import('./features/social/pages/LeagueDetailPage').then(m => ({ default: m.LeagueDetailPage })));
const OrganisationsPage = lazy(() => import('./features/social/pages/OrganisationsPage').then(m => ({ default: m.OrganisationsPage })));
const OrganisationDetailPage = lazy(() => import('./features/social/pages/OrganisationDetailPage').then(m => ({ default: m.OrganisationDetailPage })));
const SettingsPage = lazy(() => import('./shared/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

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
        {user && (
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `app-header__icon-link${isActive ? ' app-header__icon-link--active' : ''}`
            }
            title="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </NavLink>
        )}
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

function RouteLoadingFallback() {
  return (
    <div className="skeleton-list" style={{ padding: 'var(--space-lg)' }}>
      <div className="skeleton skeleton--header" />
      <div className="skeleton skeleton--bar" />
      <div className="skeleton skeleton--bar" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <AppHeader />
        <main className="app-main">
          <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/lists" element={<ProtectedRoute><ListsPage /></ProtectedRoute>} />
            <Route path="/list/:id" element={<ProtectedRoute><ListEditorPage /></ProtectedRoute>} />
            <Route path="/play/:id" element={<ProtectedRoute><PlayModePage /></ProtectedRoute>} />
            <Route path="/collection" element={<ProtectedRoute><CollectionPage /></ProtectedRoute>} />
            <Route path="/collection/recipes" element={<ProtectedRoute><PaintRecipesPage /></ProtectedRoute>} />
            <Route path="/collection/paints" element={<ProtectedRoute><PaintInventoryPage /></ProtectedRoute>} />
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
            <Route path="/leagues" element={<ProtectedRoute><LeaguesPage /></ProtectedRoute>} />
            <Route path="/league/:id" element={<ProtectedRoute><LeagueDetailPage /></ProtectedRoute>} />
            <Route path="/organisations" element={<ProtectedRoute><OrganisationsPage /></ProtectedRoute>} />
            <Route path="/organisation/:id" element={<ProtectedRoute><OrganisationDetailPage /></ProtectedRoute>} />
            {/* Settings */}
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            {/* Public routes */}
            <Route path="/units" element={<UnitsPage />} />
            <Route path="/shared/:code" element={<SharedListPage />} />
          </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
