import '../social.css';

interface Endpoint {
  method: 'GET' | 'POST';
  path: string;
  description: string;
  params?: { name: string; type: string; description: string }[];
  example?: string;
}

const BASE_URL = 'https://<project>.supabase.co/rest/v1';

const ENDPOINTS: { section: string; items: Endpoint[] }[] = [
  {
    section: 'Factions',
    items: [
      {
        method: 'GET',
        path: '/factions',
        description: 'List all factions. Supports PostgREST filtering.',
        params: [
          { name: 'select', type: 'string', description: 'Comma-separated column names to return' },
          { name: 'order', type: 'string', description: 'Column to sort by, e.g. name.asc' },
        ],
        example: 'GET /factions?select=id,name,description&order=name.asc',
      },
      {
        method: 'GET',
        path: '/factions?id=eq.<id>',
        description: 'Get a single faction by ID.',
        example: 'GET /factions?id=eq.00000000-0000-0000-0000-000000000001',
      },
    ],
  },
  {
    section: 'Units',
    items: [
      {
        method: 'GET',
        path: '/units',
        description: 'List all unit datasheets. Supports filtering by faction, role, and keywords.',
        params: [
          { name: 'faction_id', type: 'uuid', description: 'Filter by faction: faction_id=eq.<uuid>' },
          { name: 'role', type: 'string', description: 'Filter by battlefield role: Battleline, Character, Vehicle, etc.' },
          { name: 'select', type: 'string', description: 'Columns to return — e.g. id,name,move,toughness,save,wounds,leadership,oc' },
          { name: 'order', type: 'string', description: 'e.g. name.asc' },
          { name: 'limit', type: 'integer', description: 'Max rows to return' },
          { name: 'offset', type: 'integer', description: 'Pagination offset' },
        ],
        example: 'GET /units?faction_id=eq.<uuid>&role=eq.Battleline&select=id,name,move,toughness,save,wounds&order=name.asc&limit=20',
      },
      {
        method: 'GET',
        path: '/units?id=eq.<id>',
        description: 'Get a single unit by ID. Include weapons and abilities with select.',
        example: 'GET /units?id=eq.<uuid>&select=*,weapons(*),abilities(*)',
      },
    ],
  },
  {
    section: 'Weapons',
    items: [
      {
        method: 'GET',
        path: '/weapons',
        description: 'List weapon profiles. Filter by unit via the join table.',
        params: [
          { name: 'unit_id', type: 'uuid', description: 'Filter by unit_id=eq.<uuid>' },
          { name: 'weapon_type', type: 'string', description: '"ranged" or "melee"' },
        ],
        example: 'GET /weapons?unit_id=eq.<uuid>&weapon_type=eq.ranged&select=name,attacks,skill,strength,ap,damage,abilities',
      },
    ],
  },
  {
    section: 'Abilities',
    items: [
      {
        method: 'GET',
        path: '/abilities',
        description: 'List abilities. Filter by unit or ability type.',
        params: [
          { name: 'unit_id', type: 'uuid', description: 'Filter by unit_id=eq.<uuid>' },
          { name: 'ability_type', type: 'string', description: '"core", "faction", "unique", or "invulnerable"' },
        ],
        example: 'GET /abilities?unit_id=eq.<uuid>&select=name,description,ability_type',
      },
    ],
  },
  {
    section: 'Army Lists (Public)',
    items: [
      {
        method: 'GET',
        path: '/army_lists?is_public=eq.true',
        description: 'Browse publicly shared army lists.',
        params: [
          { name: 'faction_id', type: 'uuid', description: 'Filter by faction' },
          { name: 'points_limit', type: 'integer', description: 'Filter by points, e.g. points_limit=lte.2000' },
          { name: 'share_code', type: 'string', description: 'Look up by share code: share_code=eq.<code>' },
        ],
        example: 'GET /army_lists?is_public=eq.true&faction_id=eq.<uuid>&select=id,name,points_limit,share_code,created_at',
      },
    ],
  },
  {
    section: 'Tournaments (Public)',
    items: [
      {
        method: 'GET',
        path: '/tournaments?is_public=eq.true',
        description: 'Browse public tournaments.',
        params: [
          { name: 'status', type: 'string', description: '"registration", "active", or "completed"' },
          { name: 'format', type: 'string', description: '"swiss", "single_elimination", or "round_robin"' },
        ],
        example: 'GET /tournaments?is_public=eq.true&status=eq.active&select=id,name,format,status,max_players,event_date',
      },
    ],
  },
  {
    section: 'Paint Recipes (Public)',
    items: [
      {
        method: 'GET',
        path: '/paint_schemes?is_public=eq.true',
        description: 'Browse community paint recipes.',
        params: [
          { name: 'faction_name', type: 'string', description: 'Filter by faction name (ilike for partial match)' },
          { name: 'scheme_code', type: 'string', description: 'Look up by share code' },
        ],
        example: 'GET /paint_schemes?is_public=eq.true&select=id,name,faction_name,scheme_code,created_at&order=created_at.desc&limit=20',
      },
    ],
  },
];

function EndpointBadge({ method }: { method: 'GET' | 'POST' }) {
  return (
    <span className={`api-ref__badge api-ref__badge--${method.toLowerCase()}`}>
      {method}
    </span>
  );
}

export function ApiReferencePage() {
  return (
    <div className="api-ref">
      <div className="api-ref__header">
        <h1 className="api-ref__title">Public API Reference</h1>
        <p className="api-ref__subtitle">
          WarForge exposes game data via the{' '}
          <a
            href="https://postgrest.org/en/stable/references/api.html"
            target="_blank"
            rel="noopener noreferrer"
            className="api-ref__link"
          >
            PostgREST
          </a>{' '}
          auto-generated REST API. All public endpoints are read-only and require no authentication.
        </p>
      </div>

      <div className="api-ref__auth card">
        <h3 className="api-ref__section-title">Authentication</h3>
        <p>Public endpoints require the <code className="api-ref__code">apikey</code> header with the project's anonymous key:</p>
        <pre className="api-ref__pre">{`GET ${BASE_URL}/factions
apikey: <anon-key>
Content-Type: application/json`}</pre>
        <p style={{ marginTop: 'var(--space-sm)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          The anonymous key is safe to expose in client-side code — Row Level Security enforces access control.
        </p>
      </div>

      {ENDPOINTS.map(({ section, items }) => (
        <div key={section} className="api-ref__section">
          <h2 className="api-ref__section-heading">{section}</h2>
          {items.map((ep, i) => (
            <div key={i} className="api-ref__endpoint card">
              <div className="api-ref__endpoint-header">
                <EndpointBadge method={ep.method} />
                <code className="api-ref__path">{ep.path}</code>
              </div>
              <p className="api-ref__desc">{ep.description}</p>
              {ep.params && ep.params.length > 0 && (
                <div className="api-ref__params">
                  <div className="api-ref__params-label">Query Parameters</div>
                  <table className="api-ref__table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ep.params.map((p) => (
                        <tr key={p.name}>
                          <td><code className="api-ref__code">{p.name}</code></td>
                          <td><span className="api-ref__type">{p.type}</span></td>
                          <td>{p.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {ep.example && (
                <div className="api-ref__example">
                  <div className="api-ref__params-label">Example</div>
                  <pre className="api-ref__pre">{ep.example}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="api-ref__footer card">
        <h3 className="api-ref__section-title">PostgREST Filtering</h3>
        <p>All list endpoints support the full PostgREST filter syntax:</p>
        <table className="api-ref__table">
          <thead>
            <tr><th>Operator</th><th>Meaning</th><th>Example</th></tr>
          </thead>
          <tbody>
            {[
              ['eq', 'Equals', 'role=eq.Character'],
              ['neq', 'Not equals', 'role=neq.Vehicle'],
              ['lt / lte', 'Less than / or equal', 'points_limit=lte.2000'],
              ['gt / gte', 'Greater than / or equal', 'wounds=gte.10'],
              ['like', 'Pattern match (case-sensitive)', 'name=like.Space*'],
              ['ilike', 'Pattern match (case-insensitive)', 'name=ilike.*marines*'],
              ['in', 'In list', 'role=in.(Character,Vehicle)'],
            ].map(([op, meaning, example]) => (
              <tr key={op}>
                <td><code className="api-ref__code">{op}</code></td>
                <td>{meaning}</td>
                <td><code className="api-ref__code">{example}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
