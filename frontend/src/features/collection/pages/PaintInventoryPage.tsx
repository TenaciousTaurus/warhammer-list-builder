import { useEffect, useState, useMemo } from 'react';
import '../collection.css';
import { useAuth } from '../../../shared/hooks/useAuth';
import { usePaintInventoryStore } from '../stores/paintInventoryStore';
import type { PaintInventoryItem } from '../stores/paintInventoryStore';
import { PaintPicker } from '../components/PaintPicker';
import { CollectionSubNav } from '../components/CollectionSubNav';

type SortOption = 'name' | 'brand' | 'type' | 'quantity';
type FilterBrand = string | 'all';
type FilterType = string | 'all';

export function PaintInventoryPage() {
  const { user } = useAuth();
  const {
    inventory,
    paints,
    loading,
    error,
    loadInventory,
    loadPaints,
    addPaint,
    removePaint,
    updateQuantity,
    toggleInStock,
  } = usePaintInventoryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('brand');
  const [filterBrand, setFilterBrand] = useState<FilterBrand>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [addingPaint, setAddingPaint] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadInventory(user.id);
      loadPaints();
    }
  }, [user?.id, loadInventory, loadPaints]);

  const brands = useMemo(
    () => [...new Set(inventory.map((i) => i.paint_library.brand))].sort(),
    [inventory]
  );

  const paintTypes = useMemo(
    () => [...new Set(inventory.map((i) => i.paint_library.paint_type))].sort(),
    [inventory]
  );

  const filtered = useMemo(() => {
    let items = inventory;

    if (!showOutOfStock) {
      items = items.filter((i) => i.in_stock);
    }

    if (filterBrand !== 'all') {
      items = items.filter((i) => i.paint_library.brand === filterBrand);
    }

    if (filterType !== 'all') {
      items = items.filter((i) => i.paint_library.paint_type === filterType);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (i) =>
          i.paint_library.paint_name.toLowerCase().includes(q) ||
          i.paint_library.brand.toLowerCase().includes(q)
      );
    }

    const sortFns: Record<SortOption, (a: PaintInventoryItem, b: PaintInventoryItem) => number> = {
      name: (a, b) => a.paint_library.paint_name.localeCompare(b.paint_library.paint_name),
      brand: (a, b) =>
        a.paint_library.brand.localeCompare(b.paint_library.brand) ||
        a.paint_library.paint_name.localeCompare(b.paint_library.paint_name),
      type: (a, b) =>
        a.paint_library.paint_type.localeCompare(b.paint_library.paint_type) ||
        a.paint_library.paint_name.localeCompare(b.paint_library.paint_name),
      quantity: (a, b) => b.quantity - a.quantity,
    };

    return [...items].sort(sortFns[sortBy]);
  }, [inventory, searchQuery, sortBy, filterBrand, filterType, showOutOfStock]);

  const totalPaints = inventory.length;
  const inStockCount = inventory.filter((i) => i.in_stock).length;
  const outOfStockCount = totalPaints - inStockCount;

  const handleAddPaint = async (paintId: string) => {
    if (!user?.id) return;
    await addPaint(user.id, paintId);
    setAddingPaint(false);
  };

  if (!user) {
    return (
      <div className="collection-page">
        <div className="collection-page__empty">Sign in to track your paint inventory.</div>
      </div>
    );
  }

  return (
    <div className="collection-page">
      <CollectionSubNav />

      <div className="collection-page__header">
        <h1 className="collection-page__title">Paint Inventory</h1>
        <button
          className="collection-page__add-btn"
          onClick={() => setAddingPaint(true)}
        >
          + Add Paint
        </button>
      </div>

      {/* Stats Bar */}
      <div className="paint-inventory__stats">
        <span className="paint-inventory__stat">
          <strong>{totalPaints}</strong> paints
        </span>
        <span className="paint-inventory__stat paint-inventory__stat--in-stock">
          <strong>{inStockCount}</strong> in stock
        </span>
        {outOfStockCount > 0 && (
          <span className="paint-inventory__stat paint-inventory__stat--out">
            <strong>{outOfStockCount}</strong> out of stock
          </span>
        )}
      </div>

      {error && (
        <div style={{ color: 'var(--color-red-bright)', background: 'rgba(192,64,64,0.1)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(192,64,64,0.3)', marginBottom: 'var(--space-md)' }}>
          {error}
        </div>
      )}

      {/* Add Paint Picker */}
      {addingPaint && (
        <div className="paint-inventory__add-panel">
          <div className="paint-inventory__add-header">
            <span className="recipe-editor__label">Select paint to add</span>
            <button
              className="recipe-editor__step-remove"
              onClick={() => setAddingPaint(false)}
              type="button"
            >
              &times;
            </button>
          </div>
          <PaintPicker
            paints={paints}
            selectedPaintId={null}
            onSelect={handleAddPaint}
          />
        </div>
      )}

      {/* Filter Bar */}
      <div className="collection-page__filters">
        <input
          className="collection-page__search"
          type="text"
          placeholder="Search paints..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="collection-page__filter"
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
        >
          <option value="all">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select
          className="collection-page__filter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          {paintTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          className="collection-page__filter"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="brand">Sort: Brand</option>
          <option value="name">Sort: Name</option>
          <option value="type">Sort: Type</option>
          <option value="quantity">Sort: Quantity</option>
        </select>
        <label className="paint-inventory__stock-toggle">
          <input
            type="checkbox"
            checked={showOutOfStock}
            onChange={(e) => setShowOutOfStock(e.target.checked)}
          />
          <span>Show out of stock</span>
        </label>
      </div>

      {/* Inventory Grid */}
      {loading ? (
        <div className="skeleton-list">
          <div className="skeleton skeleton--bar" />
          <div className="skeleton skeleton--bar" />
          <div className="skeleton skeleton--bar" />
        </div>
      ) : filtered.length === 0 && totalPaints === 0 ? (
        <div className="empty-state card">
          <div className="empty-state__icon">&#127912;</div>
          <div className="empty-state__title">No Paints in Inventory</div>
          <p className="empty-state__description">
            Track which paints you own and which ones you're running low on.
            Add your first paint to start managing your hobby supplies.
          </p>
          <div className="empty-state__action">
            <button className="btn btn--primary" onClick={() => setAddingPaint(true)}>
              + Add Paint
            </button>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="collection-page__empty">No paints match your filters.</div>
      ) : (
        <div className="paint-inventory__grid">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`paint-inventory__card${!item.in_stock ? ' paint-inventory__card--out-of-stock' : ''}`}
            >
              <div className="paint-inventory__card-header">
                <span
                  className="paint-inventory__swatch"
                  style={{ background: item.paint_library.hex_color ?? '#555' }}
                />
                <div className="paint-inventory__card-info">
                  <span className="paint-inventory__paint-name">
                    {item.paint_library.paint_name}
                  </span>
                  <span className="paint-inventory__paint-brand">
                    {item.paint_library.brand}
                  </span>
                </div>
                <span className="paint-inventory__paint-type">
                  {item.paint_library.paint_type}
                  {item.paint_library.is_metallic && ' ✦'}
                </span>
              </div>

              <div className="paint-inventory__card-controls">
                <div className="paint-inventory__quantity">
                  <button
                    className="paint-inventory__qty-btn"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                    type="button"
                  >
                    -
                  </button>
                  <span className="paint-inventory__qty-value">{item.quantity}</span>
                  <button
                    className="paint-inventory__qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    type="button"
                  >
                    +
                  </button>
                </div>

                <button
                  className={`paint-inventory__stock-btn${item.in_stock ? ' paint-inventory__stock-btn--in' : ' paint-inventory__stock-btn--out'}`}
                  onClick={() => toggleInStock(item.id)}
                  type="button"
                >
                  {item.in_stock ? 'In Stock' : 'Out'}
                </button>

                <button
                  className="paint-inventory__remove-btn"
                  onClick={() => removePaint(item.id)}
                  title="Remove from inventory"
                  type="button"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
