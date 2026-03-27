import { useState } from 'react';
import type { WishlistItem } from '../../../shared/types/database';

interface WishlistPanelProps {
  items: WishlistItem[];
  onAdd: (name: string, priority: number) => void;
  onRemove: (id: string) => void;
}

const PRIORITY_LABELS: Record<number, string> = {
  1: 'High',
  2: 'Medium',
  3: 'Low',
};

export function WishlistPanel({ items, onAdd, onRemove }: WishlistPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPriority, setNewPriority] = useState(2);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAdd(trimmed, newPriority);
    setNewName('');
    setNewPriority(2);
  };

  const sorted = [...items].sort((a, b) => a.priority - b.priority);

  return (
    <div className="wishlist-panel">
      <button
        className="wishlist-panel__toggle"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="wishlist-panel__toggle-icon">{collapsed ? '\u25B6' : '\u25BC'}</span>
        <h2 className="wishlist-panel__title">Wishlist</h2>
        <span className="wishlist-panel__count">{items.length}</span>
      </button>

      {!collapsed && (
        <div className="wishlist-panel__body">
          <form className="wishlist-panel__form" onSubmit={handleAdd}>
            <input
              className="wishlist-panel__input"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Add to wishlist..."
            />
            <select
              className="wishlist-panel__select"
              value={newPriority}
              onChange={(e) => setNewPriority(parseInt(e.target.value, 10))}
            >
              <option value={1}>High</option>
              <option value={2}>Medium</option>
              <option value={3}>Low</option>
            </select>
            <button className="wishlist-panel__add-btn" type="submit">
              +
            </button>
          </form>

          {sorted.length === 0 && (
            <div className="wishlist-panel__empty">
              Your wishlist is empty. Add units you want to buy next!
            </div>
          )}

          <ul className="wishlist-panel__list">
            {sorted.map((item) => (
              <li key={item.id} className="wishlist-panel__item" data-priority={item.priority}>
                <span className="wishlist-panel__item-priority">
                  {PRIORITY_LABELS[item.priority] ?? `P${item.priority}`}
                </span>
                <span className="wishlist-panel__item-name">{item.name}</span>
                <button
                  className="wishlist-panel__remove-btn"
                  onClick={() => onRemove(item.id)}
                  title="Remove from wishlist"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
