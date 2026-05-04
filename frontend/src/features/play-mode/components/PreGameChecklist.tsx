import { useState } from 'react';

const SKIP_KEY = 'warforge-skip-pregame-checklist';

const CHECKLIST_ITEMS = [
  { id: 'terrain', label: 'Set up battlefield and terrain' },
  { id: 'objectives', label: 'Place objective markers' },
  { id: 'deployment', label: 'Determine deployment zones' },
  { id: 'warlord', label: 'Declare your Warlord' },
  { id: 'first-turn', label: 'Roll for first turn' },
  { id: 'deploy', label: 'Deploy armies' },
];

interface PreGameChecklistProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function PreGameChecklist({ onConfirm, onCancel }: PreGameChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [skipFuture, setSkipFuture] = useState(false);

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleConfirm() {
    if (skipFuture) localStorage.setItem(SKIP_KEY, '1');
    onConfirm();
  }

  const allChecked = CHECKLIST_ITEMS.every(item => checked.has(item.id));

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="pregame-title">
      <div className="modal pregame-checklist-modal">
        <div className="modal__header">
          <h2 className="modal__title" id="pregame-title">Pre-Game Checklist</h2>
        </div>

        <p className="pregame-checklist__subtitle">
          Before rolling dice, confirm you've completed setup:
        </p>

        <ul className="pregame-checklist__list">
          {CHECKLIST_ITEMS.map(item => {
            const isChecked = checked.has(item.id);
            return (
              <li key={item.id} className={`pregame-checklist__item${isChecked ? ' pregame-checklist__item--done' : ''}`}>
                <label className="pregame-checklist__label">
                  <input
                    type="checkbox"
                    className="pregame-checklist__checkbox"
                    checked={isChecked}
                    onChange={() => toggle(item.id)}
                  />
                  <span className="pregame-checklist__text">{item.label}</span>
                </label>
              </li>
            );
          })}
        </ul>

        <label className="pregame-checklist__skip-label">
          <input
            type="checkbox"
            checked={skipFuture}
            onChange={e => setSkipFuture(e.target.checked)}
          />
          <span>Don't show this again</span>
        </label>

        <div className="pregame-checklist__actions">
          <button className="btn btn--ghost" onClick={onCancel}>
            Back
          </button>
          <button
            className="btn btn--primary"
            onClick={handleConfirm}
          >
            {allChecked ? 'Start Game' : 'Start Anyway'}
          </button>
        </div>
      </div>
    </div>
  );
}

