import { useEffect } from 'react';
import { changelog } from '../data/changelog';

const LAST_SEEN_KEY = 'warforge-last-seen-changelog';

export function ChangelogPage() {
  useEffect(() => {
    // Mark this version as seen
    localStorage.setItem(LAST_SEEN_KEY, changelog[0].date);
  }, []);

  return (
    <div className="page-container" style={{ maxWidth: '720px', margin: '0 auto', padding: 'var(--space-lg)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)', marginBottom: 'var(--space-xs)', fontSize: 'var(--text-2xl)' }}>
        Changelog
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)', fontSize: 'var(--text-sm)' }}>
        What's new in WarForge — newest changes first.
      </p>

      <div className="changelog">
        {changelog.map((entry) => (
          <div key={entry.version} className="changelog__entry">
            <div className="changelog__header">
              <span className="changelog__version">v{entry.version}</span>
              <span className="changelog__date">{new Date(entry.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <ul className="changelog__items">
              {entry.items.map((item, i) => (
                <li key={i} className="changelog__item">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
