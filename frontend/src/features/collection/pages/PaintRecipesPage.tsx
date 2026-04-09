import { useEffect, useState, useMemo, useCallback } from 'react';
import '../collection.css';
import { supabase } from '../../../shared/lib/supabase';
import { useAuth } from '../../../shared/hooks/useAuth';
import type { Paint, PaintRecipe, PaintRecipeStep } from '../../../shared/types/database';
import { RecipeEditor } from '../components/RecipeEditor';
import { CollectionSubNav } from '../components/CollectionSubNav';

interface RecipeWithSteps extends PaintRecipe {
  paint_recipe_steps: (PaintRecipeStep & {
    paint_library: Paint | null;
  })[];
}

const TECHNIQUE_LABELS: Record<string, string> = {
  base: 'Base',
  layer: 'Layer',
  shade: 'Shade',
  drybrush: 'Drybrush',
  edge_highlight: 'Edge Highlight',
  wash: 'Wash',
  contrast: 'Contrast',
  airbrush: 'Airbrush',
  glaze: 'Glaze',
  stipple: 'Stipple',
  wetblend: 'Wet Blend',
  other: 'Other',
};

export function PaintRecipesPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<RecipeWithSteps[]>([]);
  const [paints, setPaints] = useState<Paint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<RecipeWithSteps | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);

    try {
      const [recipesRes, paintsRes] = await Promise.all([
        supabase
          .from('paint_recipes')
          .select('*, paint_recipe_steps(*, paint_library(*))')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false }),
        supabase
          .from('paint_library')
          .select('*')
          .order('brand')
          .order('paint_name'),
      ]);

      if (recipesRes.error) throw recipesRes.error;
      if (paintsRes.error) throw paintsRes.error;

      setRecipes(recipesRes.data as RecipeWithSteps[]);
      setPaints(paintsRes.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    if (!searchQuery) return recipes;
    const lower = searchQuery.toLowerCase();
    return recipes.filter(
      (r) =>
        r.name.toLowerCase().includes(lower) ||
        (r.description ?? '').toLowerCase().includes(lower)
    );
  }, [recipes, searchQuery]);

  const handleEdit = useCallback((recipe: RecipeWithSteps) => {
    setEditingRecipe(recipe);
    setShowEditor(true);
  }, []);

  const handleDelete = useCallback(
    async (recipeId: string) => {
      // Delete steps first, then recipe
      const { error: stepsErr } = await supabase
        .from('paint_recipe_steps')
        .delete()
        .eq('recipe_id', recipeId);
      if (stepsErr) {
        setError(stepsErr.message);
        return;
      }
      const { error: recipeErr } = await supabase
        .from('paint_recipes')
        .delete()
        .eq('id', recipeId);
      if (recipeErr) {
        setError(recipeErr.message);
        return;
      }
      fetchData();
    },
    [fetchData]
  );

  const handleSave = useCallback(() => {
    setShowEditor(false);
    setEditingRecipe(null);
    fetchData();
  }, [fetchData]);

  if (!user) {
    return (
      <div className="recipes-page">
        <div className="recipes-page__empty">Sign in to manage your paint recipes.</div>
      </div>
    );
  }

  return (
    <div className="recipes-page">
      <CollectionSubNav />

      {/* Header */}
      <div className="recipes-page__header">
        <h1 className="recipes-page__title">Paint Recipes</h1>
        <button
          className="recipes-page__add-btn"
          onClick={() => {
            setEditingRecipe(null);
            setShowEditor(true);
          }}
        >
          + New Recipe
        </button>
      </div>

      {/* Search */}
      <input
        className="recipes-page__search"
        type="text"
        placeholder="Search recipes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {error && <div className="recipes-page__error">{error}</div>}

      {/* Loading */}
      {loading && (
        <div className="recipes-page__loading">
          <div className="skeleton skeleton--text" style={{ width: '60%', height: '20px' }} />
          <div className="skeleton skeleton--text" style={{ width: '80%', height: '20px' }} />
          <div className="skeleton skeleton--text" style={{ width: '40%', height: '20px' }} />
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && recipes.length === 0 && (
        <div className="empty-state card">
          <div className="empty-state__icon">&#127912;</div>
          <div className="empty-state__title">No Paint Recipes Yet</div>
          <p className="empty-state__description">
            Save the step-by-step paint schemes you use so you can match
            them across batches. Create your first recipe to get started.
          </p>
          <div className="empty-state__action">
            <button className="btn btn--primary" onClick={() => setShowEditor(true)}>
              + New Recipe
            </button>
          </div>
        </div>
      )}
      {!loading && filtered.length === 0 && recipes.length > 0 && (
        <div className="recipes-page__empty">No recipes match your search.</div>
      )}

      {/* Recipe Grid */}
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
                  {/* Color swatches preview */}
                  <div className="recipe-card__swatches">
                    {sortedSteps.slice(0, 6).map((step) => (
                      <span
                        key={step.id}
                        className="recipe-card__swatch"
                        style={{
                          background: step.paint_library?.hex_color ?? '#555',
                        }}
                        title={step.paint_library?.paint_name ?? 'No paint'}
                      />
                    ))}
                  </div>

                  <h3 className="recipe-card__name">{recipe.name}</h3>
                  {recipe.description && (
                    <p className="recipe-card__desc">{recipe.description}</p>
                  )}
                  <div className="recipe-card__meta">
                    <span className="recipe-card__step-count">
                      {sortedSteps.length} step{sortedSteps.length !== 1 ? 's' : ''}
                    </span>
                    {recipe.is_public && (
                      <span className="recipe-card__public-badge">Public</span>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="recipe-card__detail">
                    <div className="recipe-card__steps">
                      {sortedSteps.map((step, idx) => (
                        <div key={step.id} className="recipe-card__step">
                          <span className="recipe-card__step-num">{idx + 1}</span>
                          <span
                            className="recipe-card__step-swatch"
                            style={{
                              background: step.paint_library?.hex_color ?? '#555',
                            }}
                          />
                          <div className="recipe-card__step-info">
                            <span className="recipe-card__step-paint">
                              {step.paint_library
                                ? `${step.paint_library.brand} - ${step.paint_library.paint_name}`
                                : 'No paint selected'}
                            </span>
                            <span className="recipe-card__step-technique">
                              {TECHNIQUE_LABELS[step.technique] ?? step.technique}
                            </span>
                            {step.area_description && (
                              <span className="recipe-card__step-area">
                                {step.area_description}
                              </span>
                            )}
                            {step.notes && (
                              <span className="recipe-card__step-notes">{step.notes}</span>
                            )}
                          </div>
                          {step.photo_url && (
                            <img
                              src={step.photo_url}
                              alt={`Step ${idx + 1}`}
                              className="recipe-card__step-photo"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="recipe-card__actions">
                      <button
                        className="recipe-card__edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(recipe);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="recipe-card__delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(recipe.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <RecipeEditor
          recipe={editingRecipe}
          existingSteps={editingRecipe?.paint_recipe_steps}
          paints={paints}
          onSave={handleSave}
          onClose={() => {
            setShowEditor(false);
            setEditingRecipe(null);
          }}
        />
      )}
    </div>
  );
}
