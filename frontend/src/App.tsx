import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import { ListsPage } from './pages/ListsPage';
import { ListEditorPage } from './pages/ListEditorPage';
import { UnitsPage } from './pages/UnitsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <header className="app-header">
          <span className="app-header__title">40K List Builder</span>
          <nav className="app-header__nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `app-header__link${isActive ? ' app-header__link--active' : ''}`
              }
            >
              My Lists
            </NavLink>
            <NavLink
              to="/units"
              className={({ isActive }) =>
                `app-header__link${isActive ? ' app-header__link--active' : ''}`
              }
            >
              Unit Browser
            </NavLink>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<ListsPage />} />
            <Route path="/list/:id" element={<ListEditorPage />} />
            <Route path="/units" element={<UnitsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
