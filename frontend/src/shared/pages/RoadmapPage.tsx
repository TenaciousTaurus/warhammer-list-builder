import { useState } from 'react';

type Status = 'shipped' | 'in-progress' | 'planned';

interface RoadmapItem {
  title: string;
  description: string;
  status: Status;
  category: string;
}

const ROADMAP: RoadmapItem[] = [
  // Shipped
  { title: 'Army List Builder', description: 'Full 10th Edition list building with points validation, detachment rules, and enhancement filters.', status: 'shipped', category: 'List Building' },
  { title: 'Play Mode', description: 'Live game tracking — VP, command points, battle rounds, turn-by-turn event log.', status: 'shipped', category: 'Gaming' },
  { title: 'Collection Tracker', description: 'Track your models with painting status, wishlist, and inventory management.', status: 'shipped', category: 'Collection' },
  { title: 'Paint Recipes', description: 'Create and save step-by-step paint recipes with cross-brand equivalents.', status: 'shipped', category: 'Collection' },
  { title: 'Distraction-Free Painting Mode', description: 'Full-screen step-by-step painting guide with timer and swipe navigation.', status: 'shipped', category: 'Collection' },
  { title: 'Community Color Schemes', description: 'Browse and share public paint schemes with faction and color filters.', status: 'shipped', category: 'Community' },
  { title: 'Crusade & Campaigns', description: 'Narrative play campaigns with rosters, battle logs, honours, scars, and XP tracking.', status: 'shipped', category: 'Gaming' },
  { title: 'Tournament Management', description: 'Create and manage tournaments with rounds, pairings, list submission, and TO admin tools.', status: 'shipped', category: 'Competitive' },
  { title: 'Opponent Spectate View', description: 'Share a live read-only link so your opponent can follow along during a game.', status: 'shipped', category: 'Gaming' },
  { title: 'Meta Analysis Dashboard', description: 'Faction win rates and detachment play rates across tournament data.', status: 'shipped', category: 'Competitive' },
  { title: 'Collection-Aware List Filtering', description: 'Toggle "Owned only" in the list builder to see what you can actually field.', status: 'shipped', category: 'List Building' },
  { title: 'Shopping List', description: 'See exactly what models you need to buy to complete an army list.', status: 'shipped', category: 'Collection' },
  { title: 'Battle Report Export', description: 'Shareable public URLs for completed games with turn-by-turn timeline.', status: 'shipped', category: 'Gaming' },
  { title: 'List Versioning & History', description: 'Automatic snapshots of your lists with restore-as-new-list functionality.', status: 'shipped', category: 'List Building' },
  { title: 'Multi-List Comparison', description: 'Side-by-side diff of two army lists showing shared and unique units.', status: 'shipped', category: 'List Building' },
  { title: 'Hobby Streaks & Achievements', description: 'Track your daily hobby activity and earn milestone badges.', status: 'shipped', category: 'Community' },
  { title: 'Friend Activity Feed', description: 'See what your friends have been painting and playing on your dashboard.', status: 'shipped', category: 'Community' },
  { title: 'Player Rivalries', description: 'Head-to-head stats and match history between you and another player.', status: 'shipped', category: 'Community' },
  { title: 'PWA / Install to Home Screen', description: 'Install WarForge as an app on your phone with offline support.', status: 'shipped', category: 'Platform' },
  { title: 'Geographic Tournament Discovery', description: 'Find tournaments near you with distance-based search.', status: 'shipped', category: 'Competitive' },
  { title: 'Crusade Narrative Journal', description: 'Write narrative entries for your campaigns to tell your army\'s story.', status: 'shipped', category: 'Gaming' },
  { title: 'Printable Crusade Cards', description: 'Print-friendly unit cards with stats, honours, scars, and XP.', status: 'shipped', category: 'Gaming' },

  // In Progress
  { title: 'Discord Community', description: 'Join our beta community for feedback, bug reports, and feature discussion.', status: 'in-progress', category: 'Community' },

  // Planned
  { title: 'Cross-Brand Paint Equivalents Database', description: 'Expanded paint equivalent data sourced from community contributions.', status: 'planned', category: 'Collection' },
  { title: 'Weekly Changelog Updates', description: 'Regular updates posted to the changelog and announced in Discord.', status: 'planned', category: 'Platform' },
  { title: 'Content Creator Outreach', description: 'Partnerships with 40K content creators for reviews and coverage.', status: 'planned', category: 'Community' },
  { title: 'BCP Integration Exploration', description: 'Investigating how WarForge data could complement Best Coast Pairings.', status: 'planned', category: 'Competitive' },
];

const STATUS_LABELS: Record<Status, string> = {
  'shipped': 'Shipped',
  'in-progress': 'In Progress',
  'planned': 'Planned',
};

const CATEGORIES = [...new Set(ROADMAP.map(item => item.category))].sort();

export function RoadmapPage() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? ROADMAP : ROADMAP.filter(item => item.category === filter);

  const grouped: Record<Status, RoadmapItem[]> = {
    'shipped': filtered.filter(i => i.status === 'shipped'),
    'in-progress': filtered.filter(i => i.status === 'in-progress'),
    'planned': filtered.filter(i => i.status === 'planned'),
  };

  return (
    <div className="page-container" style={{ maxWidth: '820px', margin: '0 auto', padding: 'var(--space-lg)' }}>
      <h1 className="roadmap__title">Roadmap</h1>
      <p className="roadmap__subtitle">
        What we've built, what we're working on, and where we're headed.
        Have a suggestion? Use the Feedback button to let us know.
      </p>

      <div className="roadmap__filters">
        <button
          className={`roadmap__filter${filter === 'all' ? ' roadmap__filter--active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`roadmap__filter${filter === cat ? ' roadmap__filter--active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {(['in-progress', 'planned', 'shipped'] as Status[]).map(status => {
        const items = grouped[status];
        if (items.length === 0) return null;

        return (
          <section key={status} className="roadmap__section">
            <h2 className="roadmap__section-heading">
              <span className={`roadmap__status-dot roadmap__status-dot--${status}`} />
              {STATUS_LABELS[status]}
              <span className="roadmap__count">{items.length}</span>
            </h2>
            <div className="roadmap__items">
              {items.map((item, i) => (
                <div key={i} className="roadmap__card">
                  <div className="roadmap__card-header">
                    <span className="roadmap__card-title">{item.title}</span>
                    <span className="roadmap__card-category">{item.category}</span>
                  </div>
                  <p className="roadmap__card-desc">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
