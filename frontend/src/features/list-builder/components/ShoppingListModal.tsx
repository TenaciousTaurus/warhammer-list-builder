import { useEffect, useState } from 'react';
import { useShoppingList } from '../hooks/useShoppingList';
import type { ShoppingListItem } from '../../../shared/types/database';

interface ShoppingListModalProps {
  listId: string;
  userId: string;
  factionId: string;
  onClose: () => void;
}

export function ShoppingListModal({ listId, userId, factionId, onClose }: ShoppingListModalProps) {
  const { items, loading, error, fetch, addAllToWishlist } = useShoppingList();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [addedCount, setAddedCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(listId);
  }, [fetch, listId]);

  function toggleChecked(unitId: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(unitId)) next.delete(unitId);
      else next.add(unitId);
      return next;
    });
  }

  async function handleAddAllToWishlist() {
    setAddingToWishlist(true);
    const { added } = await addAllToWishlist(userId, factionId);
    setAddedCount(added);
    setAddingToWishlist(false);
  }

  const totalEstimated = items.reduce(
    (sum, item) => (item.est_cost_usd != null ? sum + item.est_cost_usd : sum),
    0,
  );
  const hasAnyCost = items.some((i) => i.est_cost_usd != null);
  const uncheckedItems = items.filter((i) => !checked.has(i.unit_id));

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shopping-list-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="shopping-list-modal">
        <div className="shopping-list-modal__header">
          <h2 className="shopping-list-modal__title" id="shopping-list-title">
            What Do I Need?
          </h2>
          <button
            className="shopping-list-modal__close"
            onClick={onClose}
            aria-label="Close shopping list"
          >
            &times;
          </button>
        </div>

        <div className="shopping-list-modal__body">
          {loading && (
            <div className="shopping-list-modal__loading">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: '44px', width: '100%' }} />
              ))}
            </div>
          )}

          {error && (
            <div className="shopping-list-modal__error">
              Failed to load shopping list: {error}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="shopping-list-modal__empty">
              <span className="shopping-list-modal__empty-icon">&#10003;</span>
              <p>You own everything needed for this list!</p>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <>
              <p className="shopping-list-modal__subtitle">
                {uncheckedItems.length} unit{uncheckedItems.length !== 1 ? 's' : ''} still needed
              </p>
              <ul className="shopping-list-modal__list">
                {items.map((item) => (
                  <ShoppingListRow
                    key={item.unit_id}
                    item={item}
                    checked={checked.has(item.unit_id)}
                    onToggle={() => toggleChecked(item.unit_id)}
                  />
                ))}
              </ul>
            </>
          )}
        </div>

        {!loading && !error && items.length > 0 && (
          <div className="shopping-list-modal__footer">
            {hasAnyCost && (
              <div className="shopping-list-modal__total">
                Est. total:&nbsp;
                <strong>${totalEstimated.toFixed(2)}</strong>
                <span className="shopping-list-modal__total-note"> (items with known price)</span>
              </div>
            )}

            <div className="shopping-list-modal__footer-actions">
              {addedCount !== null ? (
                <span className="shopping-list-modal__added-confirm">
                  &#10003; Added {addedCount} item{addedCount !== 1 ? 's' : ''} to wishlist
                </span>
              ) : (
                <button
                  className="btn btn--primary"
                  onClick={handleAddAllToWishlist}
                  disabled={addingToWishlist}
                >
                  {addingToWishlist ? 'Adding...' : 'Add all to wishlist'}
                </button>
              )}
              <button className="btn" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ShoppingListRowProps {
  item: ShoppingListItem;
  checked: boolean;
  onToggle: () => void;
}

function ShoppingListRow({ item, checked, onToggle }: ShoppingListRowProps) {
  const shortage = item.count_needed - item.count_owned;

  return (
    <li
      className={`shopping-list-modal__item${checked ? ' shopping-list-modal__item--checked' : ''}`}
    >
      <label className="shopping-list-modal__item-label">
        <input
          type="checkbox"
          className="shopping-list-modal__checkbox"
          checked={checked}
          onChange={onToggle}
        />
        <span className="shopping-list-modal__item-name">{item.unit_name}</span>
        <span className="shopping-list-modal__item-counts">
          <span className="shopping-list-modal__item-shortage">Need {shortage} more</span>
          {item.count_owned > 0 && (
            <span className="shopping-list-modal__item-owned">({item.count_owned} owned)</span>
          )}
        </span>
        {item.est_cost_usd != null && (
          <span className="shopping-list-modal__item-cost">
            ${item.est_cost_usd.toFixed(2)}
          </span>
        )}
      </label>
    </li>
  );
}
