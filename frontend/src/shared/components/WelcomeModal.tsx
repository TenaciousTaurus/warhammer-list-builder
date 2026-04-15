import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface WelcomeModalProps {
  userId: string;
  onDone: () => void;
}

export function WelcomeModal({ userId, onDone }: WelcomeModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Pre-fill with whatever was auto-generated from email
    supabase
      .from('user_profiles')
      .select('display_name')
      .eq('id', userId)
      .single()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
      });
  }, [userId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const name = displayName.trim();
    if (!name) return;
    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ display_name: name })
      .eq('id', userId);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    markSeen();
    onDone();
  }

  function handleSkip() {
    markSeen();
    onDone();
  }

  function markSeen() {
    localStorage.setItem(`warforge_welcomed_${userId}`, '1');
  }

  return (
    <div className="modal-overlay" onClick={handleSkip}>
      <div
        className="modal-content card glass welcome-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="welcome-modal__icon">&#9876;</div>
        <h2 className="welcome-modal__title">Welcome to WarForge</h2>
        <p className="welcome-modal__subtitle">
          Set a display name so your friends and opponents can recognise you.
        </p>

        <form onSubmit={handleSave} className="welcome-modal__form">
          <div className="form-group">
            <label htmlFor="welcome-display-name">Display Name</label>
            <input
              id="welcome-display-name"
              className="form-input"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Commander name"
              maxLength={40}
              autoFocus
            />
          </div>

          {error && (
            <div className="validation-banner validation-banner--error">{error}</div>
          )}

          <div className="welcome-modal__actions">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={saving || !displayName.trim()}
            >
              {saving ? 'Saving…' : 'Save & Continue'}
            </button>
            <button
              type="button"
              className="btn welcome-modal__skip"
              onClick={handleSkip}
            >
              Skip for now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
