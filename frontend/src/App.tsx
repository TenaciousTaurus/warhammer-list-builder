import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AuthPage } from './pages/AuthPage';
import { ListsPage } from './pages/ListsPage';
import { ListEditorPage } from './pages/ListEditorPage';
import { UnitsPage } from './pages/UnitsPage';
import { SharedListPage } from './pages/SharedListPage';
import { PlayModePage } from './pages/PlayModePage';
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
      <span className="app-header__title">40K List Builder</span>
      <nav className="app-header__nav">
        {user && (
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `app-header__link${isActive ? ' app-header__link--active' : ''}`
            }
          >
            My Lists
          </NavLink>
        )}
        <NavLink
          to="/units"
          className={({ isActive }) =>
            `app-header__link${isActive ? ' app-header__link--active' : ''}`
          }
        >
          Unit Browser
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
      <AuthProvider>
        <div className="app-layout">
          <AppHeader />
          <main className="app-main">
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<ProtectedRoute><ListsPage /></ProtectedRoute>} />
              <Route path="/list/:id" element={<ProtectedRoute><ListEditorPage /></ProtectedRoute>} />
              <Route path="/play/:id" element={<ProtectedRoute><PlayModePage /></ProtectedRoute>} />
              <Route path="/units" element={<UnitsPage />} />
              <Route path="/shared/:code" element={<SharedListPage />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
