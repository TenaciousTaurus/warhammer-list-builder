export interface ChangelogEntry {
  date: string;
  version: string;
  items: string[];
}

// Newest first. Add an entry here for every meaningful change shipped.
export const changelog: ChangelogEntry[] = [
  {
    date: '2026-05-02',
    version: '0.7.0',
    items: [
      'PWA: WarForge is now installable as a standalone app on mobile and desktop',
      'Offline banner shows when you lose connectivity, with last-synced timestamp',
      'Live spectate view: share a link so opponents or spectators can watch your game in real time',
      'Army list versioning: every save creates a full snapshot (history UI coming in W2-10)',
      'Edition discriminator: database now tracks 10th Edition data separately, ready for 11th Edition',
    ],
  },
  {
    date: '2026-04-06',
    version: '0.6.0',
    items: [
      'Wargear sub-options: drone type picker and other multi-level wargear choices now work',
      'Sample list loader: new players can start with a pre-built list to explore the app',
      'Empty state improvements across lists, collection, and campaigns',
      'Onboarding welcome banners guide new users through key features',
    ],
  },
  {
    date: '2026-03-15',
    version: '0.5.0',
    items: [
      'Organisations: create clubs and gaming groups with role-based member management',
      'Leagues: run round-robin or Swiss league seasons with live standings',
      'Tournaments: public browsing with filters, Swiss/Single-Elim/Round-Robin formats, real-time pairings',
      'Social profiles, friends, and head-to-head stats',
    ],
  },
  {
    date: '2026-02-28',
    version: '0.4.0',
    items: [
      'Crusade & Campaign mode: full Crusade roster management with XP, honours, and scars',
      'Battle log: post-battle sequence with XP awards and supply limit tracking',
      'Campaign leaderboard from real battle data',
      'Multi-device campaign sync via Supabase Realtime',
    ],
  },
  {
    date: '2026-02-10',
    version: '0.3.0',
    items: [
      'Collection tracker: manage your painted/unpainted models with pipeline and grid views',
      'Paint recipes: step-by-step painting guides with per-step photos',
      'Paint inventory: track your Citadel, Vallejo, and Army Painter paints',
      'Instant list verification: check if you own all models in a list',
    ],
  },
  {
    date: '2026-01-20',
    version: '0.2.0',
    items: [
      'Play mode: full in-game tracker with phase/CP/VP controls',
      'Chess timer with per-player clock, persisted to session',
      'Dice roller with history',
      'Casualty tracker synced across devices in real time',
      'Secondary objectives and scoring breakdown by round',
    ],
  },
  {
    date: '2026-01-01',
    version: '0.1.0',
    items: [
      'List builder: full 10th Edition support for 26 factions',
      'Wargear, enhancements, leader attachments, and model composition',
      'Points tracking with battle size limits',
      'QR code sharing and print-friendly view',
      'Legends toggle',
    ],
  },
];
