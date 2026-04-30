import type { WargearSubOption } from '../../../../shared/types/database';

interface WargearSubPickerProps {
  groupName: string;
  poolMax: number;
  subOptions: WargearSubOption[];
  // Map<wargear_sub_option_id, quantity>
  selected: Map<string, number>;
  onChangeQuantity: (subOptionId: string, quantity: number) => void;
}

export function WargearSubPicker({
  groupName,
  poolMax,
  subOptions,
  selected,
  onChangeQuantity,
}: WargearSubPickerProps) {
  const totalSelected = [...selected.values()].reduce((s, q) => s + q, 0);
  const remaining = poolMax - totalSelected;

  return (
    <div className="wargear-sub-picker">
      <div className="wargear-sub-picker__header">
        <span className="wargear-sub-picker__label">{groupName}</span>
        <span className={`wargear-sub-picker__pool${remaining === 0 ? ' wargear-sub-picker__pool--full' : ''}`}>
          {totalSelected}/{poolMax}
        </span>
      </div>
      <div className="wargear-sub-picker__rows">
        {subOptions.map(sub => {
          const qty = selected.get(sub.id) ?? 0;
          const canIncrease = qty < sub.max_count && remaining > 0;

          return (
            <div key={sub.id} className="wargear-sub-picker__row">
              <span className="wargear-sub-picker__name">{sub.name}</span>
              {sub.points > 0 && (
                <span className="wargear-sub-picker__pts">+{sub.points} pts</span>
              )}
              <div className="wargear-sub-picker__counter">
                <button
                  className="wargear-sub-picker__btn"
                  onClick={() => onChangeQuantity(sub.id, qty - 1)}
                  disabled={qty === 0}
                  aria-label={`Remove ${sub.name}`}
                >
                  −
                </button>
                <span className="wargear-sub-picker__qty">{qty}</span>
                <button
                  className="wargear-sub-picker__btn"
                  onClick={() => onChangeQuantity(sub.id, qty + 1)}
                  disabled={!canIncrease}
                  aria-label={`Add ${sub.name}`}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
