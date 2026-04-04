import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import { useAuth } from '../../../shared/hooks/useAuth';
import type { Paint, PaintRecipe, PaintRecipeStep } from '../../../shared/types/database';
import { PaintPicker } from './PaintPicker';

const MAX_PHOTO_SIZE_MB = 5;

interface RecipeEditorProps {
  recipe?: PaintRecipe | null;
  existingSteps?: PaintRecipeStep[];
  paints: Paint[];
  onSave: () => void;
  onClose: () => void;
}

const TECHNIQUES = [
  'base',
  'layer',
  'shade',
  'drybrush',
  'edge_highlight',
  'wash',
  'contrast',
  'airbrush',
  'glaze',
  'stipple',
  'wetblend',
  'other',
] as const;

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

interface StepDraft {
  paintId: string | null;
  technique: string;
  areaDescription: string;
  notes: string;
  photoUrl: string | null;
}

function createEmptyStep(): StepDraft {
  return { paintId: null, technique: 'base', areaDescription: '', notes: '', photoUrl: null };
}

export function RecipeEditor({ recipe, existingSteps, paints, onSave, onClose }: RecipeEditorProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [steps, setSteps] = useState<StepDraft[]>([createEmptyStep()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingStep, setUploadingStep] = useState<number | null>(null);
  const photoInputRefs = useRef<Map<number, HTMLInputElement>>(new Map());

  const handleStepPhoto = async (index: number, file: File) => {
    if (!user?.id) return;
    if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
      setError(`Photo exceeds ${MAX_PHOTO_SIZE_MB}MB limit`);
      return;
    }

    setUploadingStep(index);
    setError(null);

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const filename = `${user.id}/recipes/${recipe?.id ?? 'new'}/${index + 1}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('collection-photos')
      .upload(filename, file, { upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploadingStep(null);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('collection-photos')
      .getPublicUrl(filename);

    updateStep(index, { photoUrl: urlData.publicUrl });
    setUploadingStep(null);
  };

  const removeStepPhoto = async (index: number) => {
    const url = steps[index].photoUrl;
    if (!url) return;

    const bucketPath = url.split('/collection-photos/')[1];
    if (bucketPath) {
      await supabase.storage.from('collection-photos').remove([bucketPath]);
    }
    updateStep(index, { photoUrl: null });
  };

  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setDescription(recipe.description ?? '');
      setIsPublic(recipe.is_public);
    }
    if (existingSteps && existingSteps.length > 0) {
      const sorted = [...existingSteps].sort((a, b) => a.step_order - b.step_order);
      setSteps(
        sorted.map((s) => ({
          paintId: s.paint_id,
          technique: s.technique,
          areaDescription: s.area_description ?? '',
          notes: s.notes ?? '',
          photoUrl: s.photo_url ?? null,
        }))
      );
    }
  }, [recipe, existingSteps]);

  const updateStep = (index: number, patch: Partial<StepDraft>) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const moveStep = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= steps.length) return;
    setSteps((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !name.trim()) return;

    setSaving(true);
    setError(null);

    try {
      let recipeId = recipe?.id;

      if (recipeId) {
        // Update existing recipe
        const { error: updateErr } = await supabase
          .from('paint_recipes')
          .update({
            name: name.trim(),
            description: description.trim() || null,
            is_public: isPublic,
          })
          .eq('id', recipeId);
        if (updateErr) throw updateErr;

        // Delete existing steps
        const { error: delErr } = await supabase
          .from('paint_recipe_steps')
          .delete()
          .eq('recipe_id', recipeId);
        if (delErr) throw delErr;
      } else {
        // Create new recipe
        const { data, error: insertErr } = await supabase
          .from('paint_recipes')
          .insert({
            user_id: user.id,
            name: name.trim(),
            description: description.trim() || null,
            is_public: isPublic,
          })
          .select('id')
          .single();
        if (insertErr) throw insertErr;
        recipeId = data.id;
      }

      // Insert steps
      if (steps.length > 0) {
        const stepRows = steps.map((s, i) => ({
          recipe_id: recipeId!,
          step_order: i + 1,
          paint_id: s.paintId || null,
          technique: s.technique,
          area_description: s.areaDescription.trim() || null,
          notes: s.notes.trim() || null,
          photo_url: s.photoUrl || null,
        }));
        const { error: stepsErr } = await supabase.from('paint_recipe_steps').insert(stepRows);
        if (stepsErr) throw stepsErr;
      }

      onSave();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save recipe';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-panel recipe-editor">
        <div className="recipe-editor__header">
          <h2 className="recipe-editor__title">
            {recipe ? 'Edit Recipe' : 'New Paint Recipe'}
          </h2>
          <button className="recipe-editor__close" onClick={onClose}>
            &times;
          </button>
        </div>

        <form className="recipe-editor__body" onSubmit={handleSubmit}>
          {error && <div className="recipe-editor__error">{error}</div>}

          <div className="recipe-editor__field">
            <label className="recipe-editor__label" htmlFor="re-name">
              Recipe Name
            </label>
            <input
              id="re-name"
              className="recipe-editor__input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ultramarines Armour"
              required
            />
          </div>

          <div className="recipe-editor__field">
            <label className="recipe-editor__label" htmlFor="re-desc">
              Description
            </label>
            <textarea
              id="re-desc"
              className="recipe-editor__textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of this recipe..."
              rows={2}
            />
          </div>

          <label className="recipe-editor__checkbox-label">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span>Share publicly</span>
          </label>

          {/* Steps */}
          <div className="recipe-editor__steps-header">
            <span className="recipe-editor__label">Steps</span>
            <span className="recipe-editor__step-count">{steps.length} step{steps.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="recipe-editor__steps">
            {steps.map((step, index) => (
              <div key={index} className="recipe-editor__step">
                <div className="recipe-editor__step-number">{index + 1}</div>
                <div className="recipe-editor__step-fields">
                  <div className="recipe-editor__step-row">
                    <div className="recipe-editor__step-field recipe-editor__step-field--paint">
                      <label className="recipe-editor__label">Paint</label>
                      <PaintPicker
                        paints={paints}
                        selectedPaintId={step.paintId}
                        onSelect={(id) => updateStep(index, { paintId: id })}
                      />
                    </div>
                    <div className="recipe-editor__step-field">
                      <label className="recipe-editor__label">Technique</label>
                      <select
                        className="recipe-editor__select"
                        value={step.technique}
                        onChange={(e) => updateStep(index, { technique: e.target.value })}
                      >
                        {TECHNIQUES.map((t) => (
                          <option key={t} value={t}>
                            {TECHNIQUE_LABELS[t]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="recipe-editor__step-row">
                    <div className="recipe-editor__step-field">
                      <label className="recipe-editor__label">Area</label>
                      <input
                        className="recipe-editor__input"
                        type="text"
                        value={step.areaDescription}
                        onChange={(e) => updateStep(index, { areaDescription: e.target.value })}
                        placeholder="e.g. armour panels"
                      />
                    </div>
                    <div className="recipe-editor__step-field">
                      <label className="recipe-editor__label">Notes</label>
                      <input
                        className="recipe-editor__input"
                        type="text"
                        value={step.notes}
                        onChange={(e) => updateStep(index, { notes: e.target.value })}
                        placeholder="Optional notes"
                      />
                    </div>
                  </div>
                  {/* Step Photo */}
                  <div className="recipe-editor__step-photo">
                    {step.photoUrl ? (
                      <div className="recipe-editor__step-photo-preview">
                        <img src={step.photoUrl} alt={`Step ${index + 1}`} className="recipe-editor__step-photo-img" />
                        <button
                          type="button"
                          className="recipe-editor__step-photo-remove"
                          onClick={() => removeStepPhoto(index)}
                          title="Remove photo"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <label className="recipe-editor__step-photo-add">
                        <input
                          ref={(el) => { if (el) photoInputRefs.current.set(index, el); }}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleStepPhoto(index, file);
                            e.target.value = '';
                          }}
                          className="recipe-editor__step-photo-input"
                          disabled={uploadingStep === index}
                        />
                        <span className="recipe-editor__step-photo-btn">
                          {uploadingStep === index ? 'Uploading...' : '+ Photo'}
                        </span>
                      </label>
                    )}
                  </div>
                </div>
                <div className="recipe-editor__step-actions">
                  <button
                    type="button"
                    className="recipe-editor__step-move"
                    disabled={index === 0}
                    onClick={() => moveStep(index, -1)}
                    title="Move up"
                  >
                    &#9650;
                  </button>
                  <button
                    type="button"
                    className="recipe-editor__step-move"
                    disabled={index === steps.length - 1}
                    onClick={() => moveStep(index, 1)}
                    title="Move down"
                  >
                    &#9660;
                  </button>
                  <button
                    type="button"
                    className="recipe-editor__step-remove"
                    onClick={() => removeStep(index)}
                    title="Remove step"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="recipe-editor__add-step"
            onClick={() => setSteps((prev) => [...prev, createEmptyStep()])}
          >
            + Add Step
          </button>

          <div className="recipe-editor__actions">
            <button type="button" className="recipe-editor__btn--cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="recipe-editor__btn--save" disabled={saving}>
              {saving ? 'Saving...' : recipe ? 'Save Changes' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
