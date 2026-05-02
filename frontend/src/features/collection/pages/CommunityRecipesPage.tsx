import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../collection.css';
import { supabase } from '../../../shared/lib/supabase';
import { CollectionSubNav } from '../components/CollectionSubNav';

// ── Color family helpers ─────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

function getColorFamily(hex: string | null | undefined): string {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return 'neutral';
  const [h, s, l] = hexToHsl(hex);
  if (l < 12) return 'neutral';
  if (l > 88) return 'neutral';
  if (s < 18) return 'neutral';
  if (h < 30 || h >= 330) return 'red';
  if (h < 60) return 'orange';
  if (h < 90) return 'yellow';
  if (h < 165) return 'green';
  if (h < 255) return 'blue';
  return 'purple';
}

const COLOR_FAMILIES = [
  { value: '', label: 'All colors' },
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue / Teal' },
  { value: 'purple', label: 'Purple / Pink' },
  { value: 'neutral', label: 'Neutral / Grey' },
];

// ── Types ────────────────────────────────────────────────────────────────────

interface CommunityStep {
  step_order: number;
  paint_library: { hex_color: string | null; paint_name: string; brand: string } | null;
}

interface CommunityRecipe {
  id: string;
  name: string;
  description: string | null;
  scheme_code: string;
  faction_id: string | null;
  is_public: boolean;
  updated_at: string;
  paint_recipe_steps: CommunityStep[];
  factions: { name: string } | null;
}

interface Faction {
  id: string;
  name: string;
}

// ── Component ────────────────────────────────────────────────────────────────

export function CommunityRecipesPage() {
  const [recipes, setRecipes] = useState<CommunityRecipe[]>([]);
  const [factions, setFactions] = useState<Faction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFactionId, setSelectedFactionId] = useState('');
  const [selectedColorFamily, setSelectedColorFamily] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [recipesRes, factionsRes] = await Promise.all([
          supabase
            .from('paint_recipes')
            .select(`
              id,
              name,
              description,
              scheme_code,
              faction_id,
              is_public,
              updated_at,
              paint_recipe_steps(step_order, paint_library(hex_color, paint_name, brand)),
              factions(name)
            `)
            .eq('is_public', true)
            .not('scheme_code', 'is', null)
            .order('updated_at', { ascending: false })
            .limit(200),
          supabase
            .from('factions')
            .select('id, name')
            .is('parent_faction_id', null)
            .order('name'),
        ]);

        if (recipesRes.error) throw recipesRes.error;
        if (factionsRes.error) throw factionsRes.error;

        setRecipes(recipesRes.data as unknown as CommunityRecipe[]);
        setFactions(factionsRes.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load community recipes');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (selectedFactionId && r.faction_id !== selectedFactionId) return false;

      if (selectedColorFamily) {
        const sorted = [...r.paint_recipe_steps].sort((a, b) => a.step_order - b.step_order);
        const firstHex = sorted.find((s) => s.paint_library?.hex_color)?.paint_library?.hex_color;
        if (getColorFamily(firstHex) !== selectedColorFamily) return false;
      }

      if (searchQuery) {
        const lower = searchQuery.toLowerCase();
        if (
          !r.name.toLowerCase().includes(lower) &&
          !(r.description ?? '').toLowerCase().includes(lower) &&
          !(r.factions?.name ?? '').toLowerCase().includes(lower)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [recipes, selectedFactionId, selectedColorFamily, searchQuery]);

  return (
    <div className="recipes-page">
      <CollectionSubNav />

      <div className="recipes-page__header">
        <h1 className="recipes-page__title">Community Recipes</h1>
        <Link to="/collection/recipes" className="btn btn--ghost btn--sm">
          My Recipes
        </Link>
      </div>

      <div className="community-recipes__filters">
        <input
          className="recipes-page__search"
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="community-recipes__filter-select"
          value={selectedFactionId}
          onChange={(e) => setSelectedFactionId(e.target.value)}
          aria-label="Filter by faction"
        >
          <option value="">All factions</option>
          {factions.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        <select
          className="community-recipes__filter-select"
          value={selectedColorFamily}
          onChange={(e) => setSelectedColorFamily(e.target.value)}
          aria-label="Filter by color family"
        >
          {COLOR_FAMILIES.map((cf) => (
            <option key={cf.value} value={cf.value}>{cf.label}</option>
          ))}
        </select>
      </div>

      {error && <div className="recipes-page__error">{error}</div>}

      {loading && (
        <div className="recipes-page__loading">
          <div className="skeleton skeleton--text" style={{ width: '60%', height: '20px' }} />
          <div className="skeleton skeleton--text" style={{ width: '80%', height: '20px' }} />
          <div className="skeleton skeleton--text" style={{ width: '40%', height: '20px' }} />
        </div>
      )}

      {!loading && recipes.length === 0 && (
        <div className="empty-state card">
          <div className="empty-state__icon">&#127912;</div>
          <div className="empty-state__title">No Public Recipes Yet</div>
          <p className="empty-state__description">
            Be the first to share a paint scheme with the community. Create a recipe and mark it public.
          </p>
          <div className="empty-state__action">
            <Link to="/collection/recipes" className="btn btn--primary">Create a Recipe</Link>
          </div>
        </div>
      )}

      {!loading && recipes.length > 0 && filtered.length === 0 && (
        <div className="recipes-page__empty">No recipes match your filters.</div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="recipes-page__grid">
          {filtered.map((recipe) => {
            const isExpanded = expandedId === recipe.id;
            const sortedSteps = [...recipe.paint_recipe_steps].sort(
              (a, b) => a.step_order - b.step_order
            );

            return (
              <div
                key={recipe.id}
                className={`recipe-card ${isExpanded ? 'recipe-card--expanded' : ''}`}
              >
                <div
                  className="recipe-card__summary"
                  onClick={() => setExpandedId(isExpanded ? null : recipe.id)}
                >
                  <div className="recipe-card__swatches">
                    {sortedSteps.slice(0, 6).map((step, i) => (
                      <span
                        key={i}
                        className="recipe-card__swatch"
                        style={{ background: step.paint_library?.hex_color ?? '#555' }}
                        title={step.paint_library?.paint_name ?? 'No paint'}
                      />
                    ))}
                  </div>

                  <h3 className="recipe-card__name">{recipe.name}</h3>
                  {recipe.description && (
                    <p className="recipe-card__desc">{recipe.description}</p>
                  )}
                  <div className="recipe-card__meta">
                    {recipe.factions && (
                      <span className="recipe-card__faction">{recipe.factions.name}</span>
                    )}
                    <span className="recipe-card__step-count">
                      {sortedSteps.length} step{sortedSteps.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="recipe-card__detail">
                    <div className="recipe-card__steps">
                      {sortedSteps.map((step, idx) => (
                        <div key={idx} className="recipe-card__step">
                          <span className="recipe-card__step-num">{idx + 1}</span>
                          <span
                            className="recipe-card__step-swatch"
                            style={{ background: step.paint_library?.hex_color ?? '#555' }}
                          />
                          <div className="recipe-card__step-info">
                            <span className="recipe-card__step-paint">
                              {step.paint_library
                                ? `${step.paint_library.brand} - ${step.paint_library.paint_name}`
                                : 'No paint selected'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="recipe-card__actions">
                      <Link
                        to={`/recipes/${recipe.scheme_code}`}
                        className="recipe-card__edit-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Full Recipe
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="community-recipes__count">
          Showing {filtered.length} of {recipes.length} public recipe{recipes.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
