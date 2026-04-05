import { useEffect, useState, useMemo, useCallback } from 'react';
import '../collection.css';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useCollectionStore, PAINTING_STATUSES } from '../stores/collectionStore';
import type { PaintingStatus } from '../stores/collectionStore';
import type { CollectionEntry } from '../../../shared/types/database';
import { CollectionCard } from '../components/CollectionCard';
import { CollectionForm } from '../components/CollectionForm';
import { CollectionStats } from '../components/CollectionStats';
import { PaintingPipeline } from '../components/PaintingPipeline';
import { WishlistPanel } from '../components/WishlistPanel';

type ViewMode = 'grid' | 'pipeline';

const STATUS_LABELS: Record<PaintingStatus, string> = {
  unbuilt: 'Unbuilt',
  assembled: 'Assembled',
  primed: 'Primed',
  basecoated: 'Basecoated',
  detailed: 'Detailed',
  based: 'Based',
  finished: 'Finished',
};

export function CollectionPage() {
  const { user } = useAuth();
  const {
    entries,
    wishlist,
    factions,
    units,
    loading,
    error,
    loadCollection,
    addEntry,
    updateEntry,
    updatePaintingStatus,
    addWishlistItem,
    removeWishlistItem,
    clearError,
  } = useCollectionStore();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [factionFilter, setFactionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<CollectionEntry | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadCollection(user.id);
    }
  }, [user?.id, loadCollection]);

  // Build lookup maps for unit/faction names
  const factionNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const f of factions) {
      map.set(f.id, f.name);
    }
    return map;
  }, [factions]);

  const unitNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const u of units) {
      map.set(u.id, u.name);
    }
    return map;
  }, [units]);

  // Filter entries
  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (factionFilter && e.faction_id !== factionFilter) return false;
      if (statusFilter && e.painting_status !== statusFilter) return false;
      if (searchQuery) {
        const name = (e.custom_name ?? '').toLowerCase();
        if (!name.includes(searchQuery.toLowerCase())) return false;
      }
      return true;
    });
  }, [entries, factionFilter, statusFilter, searchQuery]);

  const handleSave = useCallback(
    (data: Partial<CollectionEntry>) => {
      if (!user?.id) return;
      if (editingEntry) {
        updateEntry(editingEntry.id, data);
      } else {
        addEntry({ ...data, user_id: user.id });
      }
      setShowForm(false);
      setEditingEntry(null);
    },
    [user, editingEntry, addEntry, updateEntry]
  );

  const handleEdit = useCallback((entry: CollectionEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  }, []);

  const handleStatusChange = useCallback(
    (id: string, status: string) => {
      updatePaintingStatus(id, status);
    },
    [updatePaintingStatus]
  );

  const handleAddWishlist = useCallback(
    (name: string, priority: number) => {
      if (!user?.id) return;
      addWishlistItem({ user_id: user.id, name, priority });
    },
    [user, addWishlistItem]
  );

  if (!user) {
    return (
      <div className="collection-page">
        <div className="collection-page__empty">
          Sign in to track your collection.
        </div>
      </div>
    );
  }

  return (
    <div className="collection-page">
      {/* Header */}
      <div className="collection-page__header">
        <h1 className="collection-page__title">My Collection</h1>
        <button
          className="collection-page__add-btn"
          onClick={() => {
            setEditingEntry(null);
            setShowForm(true);
          }}
        >
          + Add Unit
        </button>
      </div>

      {/* Stats */}
      <CollectionStats entries={entries} factions={factions} factionNames={factionNames} />

      {/* Error Banner */}
      {error && (
        <div className="error-banner" style={{ color: 'var(--color-red-bright)', background: 'rgba(192,64,64,0.1)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(192,64,64,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <span>{error}</span>
          <button onClick={clearError} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: 'var(--text-lg)' }}>&#10005;</button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="collection-page__filters">
        <select
          className="collection-page__filter-select"
          value={factionFilter}
          onChange={(e) => setFactionFilter(e.target.value)}
        >
          <option value="">All Factions</option>
          {factions.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        <div className="collection-page__status-chips">
          <button
            className={`collection-page__chip ${statusFilter === null ? 'collection-page__chip--active' : ''}`}
            onClick={() => setStatusFilter(null)}
          >
            All
          </button>
          {PAINTING_STATUSES.map((s) => (
            <button
              key={s}
              className={`collection-page__chip ${statusFilter === s ? 'collection-page__chip--active' : ''}`}
              data-status={s}
              onClick={() => setStatusFilter(statusFilter === s ? null : s)}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <input
          className="collection-page__search"
          type="text"
          placeholder="Search collection..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* View Toggle */}
      <div className="collection-page__view-toggle">
        <button
          className={`collection-page__view-btn ${viewMode === 'grid' ? 'collection-page__view-btn--active' : ''}`}
          onClick={() => setViewMode('grid')}
        >
          Grid
        </button>
        <button
          className={`collection-page__view-btn ${viewMode === 'pipeline' ? 'collection-page__view-btn--active' : ''}`}
          onClick={() => setViewMode('pipeline')}
        >
          Pipeline
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="collection-page__loading">
          <div className="skeleton skeleton--text" style={{ width: '60%', height: '20px' }} />
          <div className="skeleton skeleton--text" style={{ width: '80%', height: '20px' }} />
          <div className="skeleton skeleton--text" style={{ width: '40%', height: '20px' }} />
        </div>
      )}

      {/* Content */}
      {!loading && filtered.length === 0 && (
        <div className="collection-page__empty">
          {entries.length === 0
            ? 'Your collection is empty. Add your first unit to start tracking!'
            : 'No units match your filters.'}
        </div>
      )}

      {!loading && filtered.length > 0 && viewMode === 'grid' && (
        <div className="collection-page__grid">
          {filtered.map((entry) => (
            <CollectionCard
              key={entry.id}
              entry={entry}
              unitName={unitNames.get(entry.unit_id ?? '')}
              factionName={factionNames.get(entry.faction_id ?? '')}
              onEdit={() => handleEdit(entry)}
              onStatusChange={(status) => handleStatusChange(entry.id, status)}
            />
          ))}
        </div>
      )}

      {!loading && filtered.length > 0 && viewMode === 'pipeline' && (
        <PaintingPipeline
          entries={filtered}
          unitNames={unitNames}
          factionNames={factionNames}
          onEditEntry={handleEdit}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Wishlist */}
      <WishlistPanel
        items={wishlist}
        onAdd={handleAddWishlist}
        onRemove={removeWishlistItem}
      />

      {/* Form Modal */}
      {showForm && (
        <CollectionForm
          entry={editingEntry}
          factions={factions}
          units={units}
          userId={user.id}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingEntry(null);
          }}
        />
      )}
    </div>
  );
}
