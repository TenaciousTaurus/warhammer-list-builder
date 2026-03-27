import { useState } from 'react';
import type { BattleHonour, BattleScar } from '../../../shared/types/database';

interface HonourScarEditorProps {
  honours: BattleHonour[];
  scars: BattleScar[];
  onAddHonour: (honour: BattleHonour) => void;
  onAddScar: (scar: BattleScar) => void;
  onRemoveScar: (scarIndex: number) => void;
}

export function HonourScarEditor({
  honours,
  scars,
  onAddHonour,
  onAddScar,
  onRemoveScar,
}: HonourScarEditorProps) {
  const [addingHonour, setAddingHonour] = useState(false);
  const [addingScar, setAddingScar] = useState(false);
  const [honourName, setHonourName] = useState('');
  const [honourDesc, setHonourDesc] = useState('');
  const [scarName, setScarName] = useState('');
  const [scarDesc, setScarDesc] = useState('');

  const handleAddHonour = () => {
    if (!honourName.trim()) return;
    onAddHonour({
      name: honourName.trim(),
      description: honourDesc.trim(),
      type: 'battle_honour',
    });
    setHonourName('');
    setHonourDesc('');
    setAddingHonour(false);
  };

  const handleAddScar = () => {
    if (!scarName.trim()) return;
    onAddScar({
      name: scarName.trim(),
      description: scarDesc.trim(),
      type: 'battle_scar',
    });
    setScarName('');
    setScarDesc('');
    setAddingScar(false);
  };

  return (
    <div className="honour-scar-editor">
      {/* Honours Section */}
      <div className="honour-scar-editor__section">
        <div className="honour-scar-editor__section-header">
          <h4 className="campaign-detail__section-title">Battle Honours</h4>
          {!addingHonour && (
            <button
              className="campaigns-page__join-btn"
              onClick={() => setAddingHonour(true)}
              type="button"
            >
              + Add Honour
            </button>
          )}
        </div>

        {honours.length === 0 && !addingHonour && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            No battle honours earned yet.
          </p>
        )}

        <div className="crusade-unit-card__honours">
          {honours.map((honour, index) => (
            <span key={index} className="honour-badge" title={honour.description}>
              <span className="honour-badge__icon">&#9733;</span>
              {honour.name}
            </span>
          ))}
        </div>

        {addingHonour && (
          <div className="honour-scar-editor__form">
            <div className="battle-log__field">
              <label className="battle-log__label" htmlFor="honour-name">Honour Name</label>
              <input
                id="honour-name"
                className="battle-log__vp-input"
                type="text"
                value={honourName}
                onChange={(e) => setHonourName(e.target.value)}
                placeholder="e.g. Slayer of Champions"
                autoFocus
                style={{ textAlign: 'left' }}
              />
            </div>
            <div className="battle-log__field">
              <label className="battle-log__label" htmlFor="honour-desc">Description</label>
              <input
                id="honour-desc"
                className="battle-log__vp-input"
                type="text"
                value={honourDesc}
                onChange={(e) => setHonourDesc(e.target.value)}
                placeholder="Optional description"
                style={{ textAlign: 'left' }}
              />
            </div>
            <div className="join-modal__actions">
              <button
                className="join-modal__cancel-btn"
                onClick={() => { setAddingHonour(false); setHonourName(''); setHonourDesc(''); }}
                type="button"
              >
                Cancel
              </button>
              <button
                className="join-modal__submit-btn"
                onClick={handleAddHonour}
                disabled={!honourName.trim()}
                type="button"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scars Section */}
      <div className="honour-scar-editor__section">
        <div className="honour-scar-editor__section-header">
          <h4 className="campaign-detail__section-title">Battle Scars</h4>
          {!addingScar && (
            <button
              className="campaigns-page__join-btn"
              onClick={() => setAddingScar(true)}
              type="button"
            >
              + Add Scar
            </button>
          )}
        </div>

        {scars.length === 0 && !addingScar && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            No battle scars sustained.
          </p>
        )}

        <div className="crusade-unit-card__scars">
          {scars.map((scar, index) => (
            <span key={index} className="scar-badge" title={scar.description}>
              <span className="scar-badge__icon">&#10007;</span>
              {scar.name}
              <button
                className="scar-badge__remove"
                onClick={(e) => { e.stopPropagation(); onRemoveScar(index); }}
                type="button"
                title="Remove scar"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: '0 2px',
                  fontSize: 'inherit',
                  lineHeight: 1,
                  opacity: 0.7,
                }}
              >
                &#215;
              </button>
            </span>
          ))}
        </div>

        {addingScar && (
          <div className="honour-scar-editor__form">
            <div className="battle-log__field">
              <label className="battle-log__label" htmlFor="scar-name">Scar Name</label>
              <input
                id="scar-name"
                className="battle-log__vp-input"
                type="text"
                value={scarName}
                onChange={(e) => setScarName(e.target.value)}
                placeholder="e.g. Crippling Damage"
                autoFocus
                style={{ textAlign: 'left' }}
              />
            </div>
            <div className="battle-log__field">
              <label className="battle-log__label" htmlFor="scar-desc">Description</label>
              <input
                id="scar-desc"
                className="battle-log__vp-input"
                type="text"
                value={scarDesc}
                onChange={(e) => setScarDesc(e.target.value)}
                placeholder="Optional description"
                style={{ textAlign: 'left' }}
              />
            </div>
            <div className="join-modal__actions">
              <button
                className="join-modal__cancel-btn"
                onClick={() => { setAddingScar(false); setScarName(''); setScarDesc(''); }}
                type="button"
              >
                Cancel
              </button>
              <button
                className="join-modal__submit-btn"
                onClick={handleAddScar}
                disabled={!scarName.trim()}
                type="button"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
