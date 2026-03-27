import type { WargearOption } from '../../../../shared/types/database';

interface WargearToggleProps {
  groupName: string;
  options: WargearOption[];
  selectedId: string;
  onSelect: (optionId: string) => void;
}

export function WargearToggle({ groupName, options, selectedId, onSelect }: WargearToggleProps) {
  if (options.length === 0) return null;

  // Single optional wargear → checkbox
  if (options.length === 1) {
    const opt = options[0];
    return (
      <div className="wargear-toggle wargear-toggle--checkbox">
        <label className="wargear-toggle__check-label">
          <input
            type="checkbox"
            checked={selectedId === opt.id}
            onChange={() => onSelect(selectedId === opt.id ? '' : opt.id)}
          />
          <span className="wargear-toggle__check-indicator" />
          <span className="wargear-toggle__name">{opt.name}</span>
          {opt.points > 0 && (
            <span className="wargear-toggle__pts">+{opt.points} pts</span>
          )}
        </label>
      </div>
    );
  }

  // 2 options → toggle switch
  if (options.length === 2) {
    return (
      <div className="wargear-toggle wargear-toggle--switch">
        <div className="wargear-toggle__group-label">{groupName}</div>
        <div className="wargear-toggle__switch-row">
          {options.map(opt => (
            <button
              key={opt.id}
              className={`wargear-toggle__switch-btn${selectedId === opt.id ? ' wargear-toggle__switch-btn--active' : ''}`}
              onClick={() => onSelect(opt.id)}
            >
              <span className="wargear-toggle__name">{opt.name}</span>
              {opt.points > 0 && (
                <span className="wargear-toggle__pts">+{opt.points}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 3+ options → radio card group
  return (
    <div className="wargear-toggle wargear-toggle--radio">
      <div className="wargear-toggle__group-label">{groupName}</div>
      <div className="wargear-toggle__radio-group">
        {options.map(opt => (
          <label
            key={opt.id}
            className={`wargear-toggle__radio-card${selectedId === opt.id ? ' wargear-toggle__radio-card--active' : ''}`}
          >
            <input
              type="radio"
              name={`wg-${groupName}`}
              checked={selectedId === opt.id}
              onChange={() => onSelect(opt.id)}
              className="wargear-toggle__radio-input"
            />
            <span className="wargear-toggle__radio-indicator" />
            <span className="wargear-toggle__name">{opt.name}</span>
            {opt.points > 0 && (
              <span className="wargear-toggle__pts">+{opt.points}</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
