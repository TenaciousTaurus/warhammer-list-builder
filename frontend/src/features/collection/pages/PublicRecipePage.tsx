import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../collection.css';
import { supabase } from '../../../shared/lib/supabase';
import { useAuth } from '../../../shared/hooks/useAuth';

interface RecipeStep {
  id: string;
  step_order: number;
  technique: string;
  area_description: string | null;
  notes: string | null;
  photo_url: string | null;
  paint_library: {
    paint_name: string;
    brand: string;
    hex_color: string | null;
  } | null;
}

interface PublicRecipe {
  id: string;
  name: string;
  description: string | null;
  scheme_code: string;
  faction_id: string | null;
  updated_at: string;
  paint_recipe_steps: RecipeStep[];
  factions: { name: string } | null;
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

export function PublicRecipePage() {
  const { schemeCode } = useParams<{ schemeCode: string }>();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<PublicRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!schemeCode) return;

    async function fetchRecipe() {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('paint_recipes')
        .select(`
          id,
          name,
          description,
          scheme_code,
          faction_id,
          updated_at,
          paint_recipe_steps(
            id,
            step_order,
            technique,
            area_description,
            notes,
            photo_url,
            paint_library(paint_name, brand, hex_color)
          ),
          factions(name)
        `)
        .eq('scheme_code', schemeCode)
        .eq('is_public', true)
        .single();

      if (fetchError || !data) {
        setError('Recipe not found or no longer public.');
      } else {
        const sorted = { ...data, paint_recipe_steps: [...data.paint_recipe_steps].sort((a, b) => a.step_order - b.step_order) };
        setRecipe(sorted as unknown as PublicRecipe);
      }
      setLoading(false);
    }

    fetchRecipe();
  }, [schemeCode]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="public-recipe-page">
        <div className="skeleton-list" style={{ padding: 'var(--space-lg)' }}>
          <div className="skeleton skeleton--header" />
          <div className="skeleton skeleton--bar" />
          <div className="skeleton skeleton--bar" />
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="public-recipe-page">
        <div className="empty-state card">
          <div className="empty-state__icon">&#128247;</div>
          <div className="empty-state__title">Recipe Not Found</div>
          <p className="empty-state__description">
            This recipe may have been made private or the link is incorrect.
          </p>
          <div className="empty-state__action">
            <Link to="/recipes/community" className="btn btn--primary">Browse Community</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-recipe-page">
      {/* Breadcrumb */}
      <nav className="public-recipe-page__breadcrumb">
        <Link to="/recipes/community" className="public-recipe-page__breadcrumb-link">
          Community Recipes
        </Link>
        <span className="public-recipe-page__breadcrumb-sep">/</span>
        <span>{recipe.name}</span>
      </nav>

      {/* Header */}
      <div className="public-recipe-page__header">
        <div className="public-recipe-page__title-block">
          <h1 className="public-recipe-page__title">{recipe.name}</h1>
          {recipe.factions && (
            <span className="public-recipe-page__faction">{recipe.factions.name}</span>
          )}
        </div>
        <button className="btn btn--ghost btn--sm" onClick={handleCopyLink}>
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>

      {recipe.description && (
        <p className="public-recipe-page__description">{recipe.description}</p>
      )}

      {/* Color swatch strip */}
      <div className="public-recipe-page__swatches">
        {recipe.paint_recipe_steps.slice(0, 8).map((step) => (
          <span
            key={step.id}
            className="recipe-card__swatch recipe-card__swatch--lg"
            style={{ background: step.paint_library?.hex_color ?? '#555' }}
            title={step.paint_library?.paint_name}
          />
        ))}
      </div>

      {/* Steps */}
      <div className="public-recipe-page__steps">
        {recipe.paint_recipe_steps.map((step, idx) => (
          <div key={step.id} className="public-recipe-page__step">
            <div className="public-recipe-page__step-num">{idx + 1}</div>
            <div
              className="public-recipe-page__step-swatch"
              style={{ background: step.paint_library?.hex_color ?? '#555' }}
            />
            <div className="public-recipe-page__step-body">
              <div className="public-recipe-page__step-paint">
                {step.paint_library
                  ? `${step.paint_library.brand} — ${step.paint_library.paint_name}`
                  : 'No paint specified'}
              </div>
              <div className="public-recipe-page__step-technique">
                {TECHNIQUE_LABELS[step.technique] ?? step.technique}
                {step.area_description && ` · ${step.area_description}`}
              </div>
              {step.notes && (
                <p className="public-recipe-page__step-notes">{step.notes}</p>
              )}
            </div>
            {step.photo_url && (
              <img
                src={step.photo_url}
                alt={`Step ${idx + 1}`}
                className="public-recipe-page__step-photo"
              />
            )}
          </div>
        ))}
      </div>

      {/* CTA for non-users */}
      {!user && (
        <div className="public-recipe-page__cta card">
          <p className="public-recipe-page__cta-text">
            Track your paint collection, build army lists, and run games — all in one place.
          </p>
          <Link to="/auth" className="btn btn--primary">
            Join WarForge — It's Free
          </Link>
        </div>
      )}

      <div className="public-recipe-page__footer">
        <Link to="/recipes/community" className="public-recipe-page__breadcrumb-link">
          ← Back to Community Recipes
        </Link>
      </div>
    </div>
  );
}
