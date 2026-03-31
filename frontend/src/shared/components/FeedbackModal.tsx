import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

const CATEGORIES = [
  'Bug Report',
  'Feature Request',
  'General Feedback',
  'UI/UX Issue',
] as const;

interface FeedbackModalProps {
  onClose: () => void;
}

export function FeedbackModal({ onClose }: FeedbackModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('General Feedback');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle) {
      setError('Please enter a title.');
      return;
    }
    if (!trimmedDesc) {
      setError('Please enter a description.');
      return;
    }

    setSubmitting(true);

    const { data, error: fnError } = await supabase.functions.invoke(
      'create-feedback',
      {
        body: {
          title: trimmedTitle,
          description: trimmedDesc,
          category,
        },
      },
    );

    setSubmitting(false);

    if (fnError || (data && !data.success)) {
      setError(
        data?.error ??
          fnError?.message ??
          'Failed to submit feedback. Please try again.',
      );
      return;
    }

    setSuccess(true);
    setTimeout(() => onClose(), 2000);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        className="modal-panel modal-panel--sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="feedback-modal-title" className="modal-panel__title">
          Submit Feedback
        </h3>

        {success ? (
          <p className="feedback-form__success">
            Feedback submitted! Thank you.
          </p>
        ) : (
          <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="feedback-title">Title</label>
              <input
                id="feedback-title"
                type="text"
                className="form-input"
                placeholder="Brief summary of your feedback"
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={submitting}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="feedback-category">Category</label>
              <select
                id="feedback-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={submitting}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="feedback-description">Description</label>
              <textarea
                id="feedback-description"
                className="form-input feedback-form__textarea"
                placeholder="Tell us more..."
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitting}
              />
            </div>

            {error && <p className="feedback-form__error">{error}</p>}

            <div className="modal-panel__actions">
              <button
                type="button"
                className="btn"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
