import { useState } from 'react';
import type { NarrativeEntry } from '../../../shared/types/database';

interface NarrativeLogProps {
  entries: NarrativeEntry[];
  authorName: string;
  canEdit: boolean;
  onAddEntry: (entry: NarrativeEntry) => void;
  onDeleteEntry: (id: string) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function NarrativeLog({ entries, authorName, canEdit, onAddEntry, onDeleteEntry }: NarrativeLogProps) {
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const entry: NarrativeEntry = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      author: authorName,
      created_at: new Date().toISOString(),
    };

    onAddEntry(entry);
    setTitle('');
    setContent('');
    setComposing(false);
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="narrative-log">
      <div className="narrative-log__header">
        <h3 className="campaign-detail__section-title" style={{ margin: 0 }}>Narrative Journal</h3>
        {canEdit && !composing && (
          <button className="btn btn--sm btn--primary" onClick={() => setComposing(true)} type="button">
            + Add Entry
          </button>
        )}
      </div>

      {composing && (
        <form className="narrative-log__compose" onSubmit={handleSubmit}>
          <div className="narrative-log__compose-field">
            <label className="narrative-log__compose-label" htmlFor="narrative-title">
              Title
            </label>
            <input
              id="narrative-title"
              className="form-input"
              type="text"
              placeholder="Entry title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={120}
              autoFocus
            />
          </div>
          <div className="narrative-log__compose-field">
            <label className="narrative-log__compose-label" htmlFor="narrative-content">
              Entry
            </label>
            <textarea
              id="narrative-content"
              className="form-input narrative-log__textarea"
              placeholder="Write your narrative entry here. Newlines are preserved."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={6}
            />
          </div>
          <div className="narrative-log__compose-actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => { setComposing(false); setTitle(''); setContent(''); }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={!title.trim() || !content.trim()}
            >
              Save Entry
            </button>
          </div>
        </form>
      )}

      {sorted.length === 0 && !composing ? (
        <div className="narrative-log__empty">
          <p>No journal entries yet.</p>
          {canEdit && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              Record battle narratives, campaign lore, and memorable moments here.
            </p>
          )}
        </div>
      ) : (
        <div className="narrative-log__entries">
          {sorted.map(entry => (
            <div key={entry.id} className="narrative-log__entry">
              <div className="narrative-log__entry-header">
                <div>
                  <div className="narrative-log__entry-title">{entry.title}</div>
                  <div className="narrative-log__entry-meta">
                    {entry.author} &middot; {formatDate(entry.created_at)}
                  </div>
                </div>
                {canEdit && (
                  confirmDeleteId === entry.id ? (
                    <div className="narrative-log__delete-confirm">
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Delete?</span>
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => { onDeleteEntry(entry.id); setConfirmDeleteId(null); }}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn--icon btn--ghost narrative-log__delete-btn"
                      onClick={() => setConfirmDeleteId(entry.id)}
                      title="Delete entry"
                      aria-label="Delete entry"
                    >
                      &#128465;
                    </button>
                  )
                )}
              </div>
              <div className="narrative-log__entry-content">{entry.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
