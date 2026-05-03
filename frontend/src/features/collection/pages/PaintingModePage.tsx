import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../shared/lib/supabase';
import { useAuth } from '../../../shared/hooks/useAuth';
import type { Paint, PaintRecipe, PaintRecipeStep } from '../../../shared/types/database';

const STEP_KEY = (recipeId: string) => `warforge_painting_step_${recipeId}`;

interface StepWithPaint extends PaintRecipeStep {
  paint_library: Paint | null;
}

interface RecipeWithSteps extends PaintRecipe {
  paint_recipe_steps: StepWithPaint[];
}

const TECHNIQUE_LABELS: Record<string, string> = {
  base: 'Base', layer: 'Layer', shade: 'Shade', drybrush: 'Drybrush',
  edge_highlight: 'Edge Highlight', wash: 'Wash', contrast: 'Contrast',
  airbrush: 'Airbrush', glaze: 'Glaze', stipple: 'Stipple', wetblend: 'Wet Blend', other: 'Other',
};

export function PaintingModePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<RecipeWithSteps | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!id || !user) return;
    supabase
      .from('paint_recipes')
      .select('*, paint_recipe_steps(*, paint_library(*))')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          const r = data as RecipeWithSteps;
          r.paint_recipe_steps.sort((a, b) => a.step_order - b.step_order);
          setRecipe(r);
          const saved = localStorage.getItem(STEP_KEY(id));
          if (saved !== null) {
            const idx = parseInt(saved, 10);
            if (idx >= 0 && idx < r.paint_recipe_steps.length) setCurrentStep(idx);
          }
        }
        setLoading(false);
      });
  }, [id, user]);

  // Persist step index
  useEffect(() => {
    if (id) localStorage.setItem(STEP_KEY(id), String(currentStep));
  }, [id, currentStep]);

  // Timer
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive]);

  const resetTimer = useCallback(() => {
    setTimerSeconds(0);
    setTimerActive(false);
  }, []);

  const vibrateComplete = useCallback(() => {
    if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
  }, []);

  function formatTime(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  const steps = recipe?.paint_recipe_steps ?? [];
  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  function goNext() {
    if (!isLast) { setCurrentStep(i => i + 1); resetTimer(); }
    else vibrateComplete();
  }

  function goPrev() {
    if (!isFirst) { setCurrentStep(i => i - 1); resetTimer(); }
  }

  // Swipe support
  const touchStartX = useRef<number | null>(null);
  function handleTouchStart(e: React.TouchEvent) { touchStartX.current = e.touches[0].clientX; }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { if (dx < 0) goNext(); else goPrev(); }
    touchStartX.current = null;
  }

  if (loading) return (
    <div className="painting-mode painting-mode--loading">
      <div className="skeleton" style={{ width: '80%', height: '200px', margin: 'auto' }} />
    </div>
  );

  if (!recipe || steps.length === 0) return (
    <div className="painting-mode painting-mode--empty">
      <p>Recipe not found or has no steps.</p>
      <button className="btn" onClick={() => navigate(-1)}>Back</button>
    </div>
  );

  return (
    <div
      className="painting-mode"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="painting-mode__header">
        <button className="painting-mode__back" onClick={() => navigate(-1)} aria-label="Exit painting mode">
          ✕
        </button>
        <div className="painting-mode__title">{recipe.name}</div>
        <div className="painting-mode__progress">
          {currentStep + 1} / {steps.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="painting-mode__progress-bar">
        <div
          className="painting-mode__progress-fill"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Step content */}
      <div className="painting-mode__step">
        {step.photo_url && (
          <img
            className="painting-mode__step-photo"
            src={step.photo_url}
            alt={`Step ${currentStep + 1}`}
          />
        )}

        <div className="painting-mode__step-technique">
          {TECHNIQUE_LABELS[step.technique] ?? step.technique}
        </div>

        {step.paint_library && (
          <div className="painting-mode__step-paint">
            <span
              className="painting-mode__paint-swatch"
              style={{ background: step.paint_library.hex_color ?? '#888' }}
            />
            <span className="painting-mode__paint-name">
              {step.paint_library.brand} — {step.paint_library.paint_name}
            </span>
          </div>
        )}

        {step.area_description && (
          <div className="painting-mode__step-area">{step.area_description}</div>
        )}

        {step.notes && (
          <div className="painting-mode__step-notes">{step.notes}</div>
        )}
      </div>

      {/* Timer */}
      <div className="painting-mode__timer">
        <span className="painting-mode__timer-display">{formatTime(timerSeconds)}</span>
        <button
          className={`painting-mode__timer-btn${timerActive ? ' painting-mode__timer-btn--active' : ''}`}
          onClick={() => setTimerActive(a => !a)}
        >
          {timerActive ? '⏸' : '▶'}
        </button>
        <button className="painting-mode__timer-reset" onClick={resetTimer} aria-label="Reset timer">↺</button>
      </div>

      {/* Navigation */}
      <div className="painting-mode__nav">
        <button
          className="painting-mode__nav-btn painting-mode__nav-btn--prev"
          onClick={goPrev}
          disabled={isFirst}
          aria-label="Previous step"
        >
          ← Prev
        </button>

        <div className="painting-mode__dots">
          {steps.map((_, i) => (
            <button
              key={i}
              className={`painting-mode__dot${i === currentStep ? ' painting-mode__dot--active' : ''}`}
              onClick={() => { setCurrentStep(i); resetTimer(); }}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        <button
          className={`painting-mode__nav-btn painting-mode__nav-btn--next${isLast ? ' painting-mode__nav-btn--done' : ''}`}
          onClick={goNext}
          aria-label={isLast ? 'Complete recipe' : 'Next step'}
        >
          {isLast ? 'Done ✓' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
