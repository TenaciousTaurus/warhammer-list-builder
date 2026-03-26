import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { ArmyList, Faction } from '../types/database';
import { CreateListModal } from '../components/CreateListModal';

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffMonth > 0) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  if (diffHr > 0) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  if (diffMin > 0) return `${diffMin} min ago`;
  return 'just now';
}

type SortOption = 'updated' | 'name' | 'created';

export function ListsPage() {
  const [lists, setLists] = useState<(ArmyList & { factions: Faction })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('updated');
  const [groupByFaction, setGroupByFaction] = useState(true);

  async function fetchLists() {
    setLoading(true);
    const { data } = await supabase
      .from('army_lists')
      .select('*, factions(*)')
      .order('updated_at', { ascending: false });
    if (data) setLists(data as (ArmyList & { factions: Faction })[]);
    setLoading(false);
  }

  useEffect(() => {
    fetchLists();
  }, []);

  async function handleDelete(id: string) {
    await supabase.from('army_lists').delete().eq('id', id);
    fetchLists();
  }

  async function handleDuplicate(id: string) {
    const { error } = await supabase.rpc('duplicate_army_list', { source_list_id: id });
    if (!error) fetchLists();
  }

  const filteredAndSorted = useMemo(() => {
    let result = lists;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l => l.name.toLowerCase().includes(q) || l.factions?.name.toLowerCase().includes(q));
    }
    result = [...result].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'created') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
    return result;
  }, [lists, search, sort]);

  const groupedLists = useMemo(() => {
    if (!groupByFaction) return null;
    const groups: Record<string, (ArmyList & { factions: Faction })[]> = {};
    for (const list of filteredAndSorted) {
      const faction = list.factions?.name ?? 'Unknown';
      if (!groups[faction]) groups[faction] = [];
      groups[faction].push(list);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredAndSorted, groupByFaction]);

  if (loading) {
    return <div className="empty-state"><p>Loading...</p></div>;
  }

  function renderListCard(list: ArmyList & { factions: Faction }) {
    return (
      <div key={list.id} className="list-card">
        <Link to={`/list/${list.id}`} className="list-card__link">
          <div className="list-card__info">
            <h3 className="list-card__name">{list.name}</h3>
            <span className="list-card__meta">
              {list.factions?.name} &middot; {list.points_limit} pts
            </span>
          </div>
          <span className="list-card__time">{relativeTime(list.updated_at)}</span>
        </Link>
        <div className="list-card__actions">
          <button
            className="btn btn--icon list-card__dup"
            onClick={() => handleDuplicate(list.id)}
            title="Duplicate list"
          >
            &#128203;
          </button>
          <button
            className="btn btn--danger btn--icon list-card__delete"
            onClick={() => handleDelete(list.id)}
            title="Delete list"
          >
            &#128465;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="lists-page__header">
        <h2 className="lists-page__title">My Army Lists</h2>
        <button className="btn btn--primary" onClick={() => setShowCreate(true)}>
          + New List
        </button>
      </div>

      {lists.length > 0 && (
        <div className="lists-page__controls">
          <input
            className="form-input lists-page__search"
            type="text"
            placeholder="Search lists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-select lists-page__sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="updated">Last Modified</option>
            <option value="name">Name A-Z</option>
            <option value="created">Date Created</option>
          </select>
          <label className="lists-page__toggle">
            <input
              type="checkbox"
              checked={groupByFaction}
              onChange={(e) => setGroupByFaction(e.target.checked)}
            />
            <span>Group by Faction</span>
          </label>
        </div>
      )}

      {filteredAndSorted.length === 0 && lists.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state__icon">&#9876;</div>
          <div className="empty-state__title">No Army Lists Yet</div>
          <p>Create your first army list to get started.</p>
          <button
            className="btn btn--primary"
            style={{ marginTop: 'var(--space-md)' }}
            onClick={() => setShowCreate(true)}
          >
            + Create Army List
          </button>
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state__title">No lists match your search</div>
        </div>
      ) : groupedLists ? (
        <div className="lists-page__grouped">
          {groupedLists.map(([faction, factionLists]) => (
            <div key={faction} className="lists-page__faction-group">
              <div className="lists-page__faction-header">{faction}</div>
              <div className="lists-page__grid">
                {factionLists.map(renderListCard)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="lists-page__grid">
          {filteredAndSorted.map(renderListCard)}
        </div>
      )}

      {showCreate && (
        <CreateListModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            fetchLists();
          }}
        />
      )}
    </div>
  );
}
