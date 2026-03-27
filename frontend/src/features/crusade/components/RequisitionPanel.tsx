import { useState } from 'react';

interface RequisitionPanelProps {
  currentRP: number;
  onSpend: (type: string, amount: number, description: string) => void;
}

interface RequisitionOption {
  type: string;
  name: string;
  cost: number;
  description: string;
}

const REQUISITION_OPTIONS: RequisitionOption[] = [
  {
    type: 'increase_supply',
    name: 'Increase Supply',
    cost: 1,
    description: 'Increase your Supply Limit by 100 points, allowing you to field more units.',
  },
  {
    type: 'fresh_recruits',
    name: 'Fresh Recruits',
    cost: 1,
    description: 'Replace a destroyed unit in your roster, restoring it with 0 XP and no honours or scars.',
  },
  {
    type: 'refit',
    name: 'Refit',
    cost: 1,
    description: 'Remove all battle scars from one unit in your roster.',
  },
];

export function RequisitionPanel({ currentRP, onSpend }: RequisitionPanelProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customDesc, setCustomDesc] = useState('');
  const [customCost, setCustomCost] = useState(1);

  const handleSpend = (option: RequisitionOption) => {
    if (currentRP < option.cost) return;
    onSpend(option.type, option.cost, option.description);
  };

  const handleCustomSpend = () => {
    if (currentRP < customCost || !customDesc.trim()) return;
    onSpend('other', customCost, customDesc.trim());
    setCustomDesc('');
    setCustomCost(1);
    setShowCustom(false);
  };

  return (
    <div className="requisition-panel">
      <div className="requisition-panel__balance">
        <span className="requisition-panel__balance-value">{currentRP}</span>
        <span className="requisition-panel__balance-label">Requisition Points</span>
      </div>

      <div className="requisition-panel__options">
        {REQUISITION_OPTIONS.map((option) => (
          <button
            key={option.type}
            className={`requisition-panel__option${currentRP < option.cost ? ' requisition-panel__option--disabled' : ''}`}
            onClick={() => handleSpend(option)}
            disabled={currentRP < option.cost}
            type="button"
          >
            <div className="requisition-panel__option-header">
              <span className="requisition-panel__option-name">{option.name}</span>
              <span className="requisition-panel__option-cost">{option.cost} RP</span>
            </div>
            <span className="requisition-panel__option-desc">{option.description}</span>
          </button>
        ))}

        {!showCustom ? (
          <button
            className={`requisition-panel__option${currentRP < 1 ? ' requisition-panel__option--disabled' : ''}`}
            onClick={() => setShowCustom(true)}
            disabled={currentRP < 1}
            type="button"
          >
            <div className="requisition-panel__option-header">
              <span className="requisition-panel__option-name">Other</span>
              <span className="requisition-panel__option-cost">Variable RP</span>
            </div>
            <span className="requisition-panel__option-desc">
              Spend RP on a custom requisition with your own description.
            </span>
          </button>
        ) : (
          <div className="requisition-panel__option">
            <div className="requisition-panel__option-header">
              <span className="requisition-panel__option-name">Custom Requisition</span>
            </div>
            <div className="battle-log__field">
              <label className="battle-log__label" htmlFor="custom-rp-desc">Description</label>
              <input
                id="custom-rp-desc"
                className="battle-log__vp-input"
                type="text"
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="What are you spending RP on?"
                style={{ textAlign: 'left' }}
                autoFocus
              />
            </div>
            <div className="battle-log__field">
              <label className="battle-log__label" htmlFor="custom-rp-cost">RP Cost</label>
              <input
                id="custom-rp-cost"
                className="battle-log__vp-input"
                type="number"
                min={1}
                max={currentRP}
                value={customCost}
                onChange={(e) => setCustomCost(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <div className="join-modal__actions">
              <button
                className="join-modal__cancel-btn"
                onClick={() => { setShowCustom(false); setCustomDesc(''); setCustomCost(1); }}
                type="button"
              >
                Cancel
              </button>
              <button
                className="join-modal__submit-btn"
                onClick={handleCustomSpend}
                disabled={!customDesc.trim() || currentRP < customCost}
                type="button"
              >
                Spend {customCost} RP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
