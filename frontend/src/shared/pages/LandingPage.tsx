import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '&#9876;',
    title: 'List Builder',
    description: 'Build and validate army lists with live points tracking, wargear options, enhancements, and leader attachments.',
  },
  {
    icon: '&#127918;',
    title: 'Play Mode',
    description: 'Track games turn by turn — CP, VP, stratagems, casualties, a chess timer, and a dice roller. Multi-device sync via Realtime.',
  },
  {
    icon: '&#127912;',
    title: 'Collection',
    description: 'Log your painted miniatures, track hobby progress, manage paint recipes, and verify lists against what you own.',
  },
  {
    icon: '&#128128;',
    title: 'Crusade',
    description: 'Run narrative campaigns with unit XP, battle honours, crusade scars, requisition points, and a full battle log.',
  },
  {
    icon: '&#127942;',
    title: 'Compete',
    description: 'Organise and run tournaments, join leagues, track head-to-head records, and manage your gaming club.',
  },
];

export function LandingPage() {
  return (
    <div className="landing">
      <section className="landing__hero">
        <h1 className="landing__title">WarForge</h1>
        <p className="landing__tagline">
          The all-in-one companion for Warhammer 40,000
        </p>
        <p className="landing__sub">
          List building, in-game tracking, collection management, Crusade campaigns,
          and competitive play — consolidated into one app.
        </p>
        <div className="landing__ctas">
          <Link to="/auth?mode=signup" className="btn btn--primary landing__cta-primary">
            Create Free Account
          </Link>
          <Link to="/auth" className="btn landing__cta-secondary">
            Sign In
          </Link>
        </div>
        <p className="landing__browse-hint">
          Just browsing?{' '}
          <Link to="/units" className="landing__browse-link">
            Browse all units — no account needed
          </Link>
        </p>
      </section>

      <section className="landing__features">
        <h2 className="landing__features-title">Everything in one place</h2>
        <div className="landing__features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="landing__feature-card card glass">
              <span
                className="landing__feature-icon"
                dangerouslySetInnerHTML={{ __html: f.icon }}
              />
              <h3 className="landing__feature-name">{f.title}</h3>
              <p className="landing__feature-desc">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing__footer-cta">
        <Link to="/auth?mode=signup" className="btn btn--primary landing__cta-primary">
          Get Started — It's Free
        </Link>
      </section>
    </div>
  );
}
