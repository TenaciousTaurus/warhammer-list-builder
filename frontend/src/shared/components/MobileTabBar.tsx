import { useState, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ThemePicker } from './ThemePicker';
import { FeedbackModal } from './FeedbackModal';
import { changelog } from '../data/changelog';

const LAST_SEEN_KEY = 'warforge-last-seen-changelog';

type IconProps = { className?: string };

function HomeIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" />
    </svg>
  );
}
function ListsIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}
function CollectionIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function CrusadeIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2M15 5l4-4 2 2-4 4M16 8l-2-2" />
    </svg>
  );
}
function BrowseIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function MetaIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m7 14 4-4 3 3 5-6" />
    </svg>
  );
}
function NewIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 13L2 9z" />
      <path d="M11 3 8 9l4 13 4-13-3-6" />
      <path d="M2 9h20" />
    </svg>
  );
}
function SignInIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
    </svg>
  );
}
function MoreIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

type TabDef = {
  to: string;
  label: string;
  icon: (p: IconProps) => React.ReactElement;
  end?: boolean;
  badge?: boolean;
};

export function MobileTabBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const hasNewChangelog = useMemo(() => {
    const lastSeen = localStorage.getItem(LAST_SEEN_KEY);
    if (!lastSeen) return true;
    return changelog[0].date > lastSeen;
  }, []);

  const primaryTabs: TabDef[] = user
    ? [
        { to: '/', label: 'Home', icon: HomeIcon, end: true },
        { to: '/lists', label: 'Lists', icon: ListsIcon },
        { to: '/collection', label: 'Collection', icon: CollectionIcon },
        { to: '/campaigns', label: 'Crusade', icon: CrusadeIcon },
      ]
    : [
        { to: '/units', label: 'Browse', icon: BrowseIcon },
        { to: '/meta', label: 'Meta', icon: MetaIcon },
        { to: '/changelog', label: "What's New", icon: NewIcon, badge: hasNewChangelog },
        { to: '/auth', label: 'Sign In', icon: SignInIcon },
      ];

  const handleSignOut = async () => {
    setMoreOpen(false);
    await signOut();
    navigate('/');
  };

  return (
    <>
      <nav className="mobile-tab-bar" aria-label="Primary navigation">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `mobile-tab-bar__item${isActive ? ' mobile-tab-bar__item--active' : ''}`
              }
            >
              <span className="mobile-tab-bar__icon-wrap">
                <Icon />
                {tab.badge && <span className="mobile-tab-bar__dot" aria-hidden="true" />}
              </span>
              <span className="mobile-tab-bar__label">{tab.label}</span>
            </NavLink>
          );
        })}
        <button
          type="button"
          className={`mobile-tab-bar__item${moreOpen ? ' mobile-tab-bar__item--active' : ''}`}
          onClick={() => setMoreOpen(true)}
          aria-label="More options"
          aria-expanded={moreOpen}
        >
          <MoreIcon />
          <span className="mobile-tab-bar__label">More</span>
        </button>
      </nav>

      {moreOpen && (
        <div
          className="mobile-more-sheet__backdrop"
          onClick={() => setMoreOpen(false)}
          role="presentation"
        >
          <div
            className="mobile-more-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="More options"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-more-sheet__handle" aria-hidden="true" />
            <div className="mobile-more-sheet__content">
              {user && (
                <>
                  <div className="mobile-more-sheet__user">
                    <span className="mobile-more-sheet__user-email">{user.email}</span>
                  </div>
                  <div className="mobile-more-sheet__section">
                    <SheetLink to="/tournaments" onClick={() => setMoreOpen(false)} label="Compete" />
                    <SheetLink to="/profile" onClick={() => setMoreOpen(false)} label="Profile" />
                    <SheetLink to="/friends" onClick={() => setMoreOpen(false)} label="Friends" />
                    <SheetLink to="/stats" onClick={() => setMoreOpen(false)} label="Stats" />
                    <SheetLink to="/leagues" onClick={() => setMoreOpen(false)} label="Leagues" />
                    <SheetLink to="/organisations" onClick={() => setMoreOpen(false)} label="Organisations" />
                  </div>
                </>
              )}
              <div className="mobile-more-sheet__section">
                <SheetLink to="/units" onClick={() => setMoreOpen(false)} label="Browse Units" />
                <SheetLink to="/meta" onClick={() => setMoreOpen(false)} label="Meta" />
                <SheetLink to="/roadmap" onClick={() => setMoreOpen(false)} label="Roadmap" />
                <SheetLink
                  to="/changelog"
                  onClick={() => setMoreOpen(false)}
                  label="What's New"
                  badge={hasNewChangelog ? 'NEW' : undefined}
                />
                <SheetLink to="/api" onClick={() => setMoreOpen(false)} label="API Reference" />
              </div>
              <div className="mobile-more-sheet__section mobile-more-sheet__section--theme">
                <span className="mobile-more-sheet__row-label">Theme</span>
                <ThemePicker />
              </div>
              {user && (
                <div className="mobile-more-sheet__section">
                  <SheetLink to="/settings" onClick={() => setMoreOpen(false)} label="Settings" />
                  <button
                    type="button"
                    className="mobile-more-sheet__row mobile-more-sheet__row--button"
                    onClick={() => {
                      setMoreOpen(false);
                      setShowFeedback(true);
                    }}
                  >
                    Feedback
                  </button>
                  <button
                    type="button"
                    className="mobile-more-sheet__row mobile-more-sheet__row--button mobile-more-sheet__row--danger"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              className="mobile-more-sheet__close"
              onClick={() => setMoreOpen(false)}
              aria-label="Close"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </>
  );
}

function SheetLink({
  to,
  label,
  onClick,
  badge,
}: {
  to: string;
  label: string;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `mobile-more-sheet__row${isActive ? ' mobile-more-sheet__row--active' : ''}`
      }
    >
      <span>{label}</span>
      {badge && <span className="mobile-more-sheet__badge">{badge}</span>}
    </NavLink>
  );
}
