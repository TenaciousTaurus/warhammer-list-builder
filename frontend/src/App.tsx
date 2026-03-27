import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './shared/css/base.css';
import './shared/css/pages.css';
import './features/list-builder/list-builder.css';
import './features/play-mode/play-mode.css';
import './features/collection/collection.css';
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
import type { ReactNode } from 'react';

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

  return (
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
        {user ? (
          <div className="app-header__user">
            <span className="app-header__email">{user.email}</span>
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
            <Route path="/units" element={<UnitsPage />} />
            <Route path="/shared/:code" element={<SharedListPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
