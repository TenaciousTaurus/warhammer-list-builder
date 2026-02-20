import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { ArmyList, Faction } from '../types/database';
import { CreateListModal } from '../components/CreateListModal';

export function ListsPage() {
  const [lists, setLists] = useState<(ArmyList & { factions: Faction })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

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

  if (loading) {
    return <div className="empty-state"><p>Loading...</p></div>;
  }

  return (
    <div>
      <div className="lists-page__header">
        <h2 className="lists-page__title">My Army Lists</h2>
        <button className="btn btn--primary" onClick={() => setShowCreate(true)}>
          + New List
        </button>
      </div>

      {lists.length === 0 ? (
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
      ) : (
        <div className="lists-page__grid">
          {lists.map((list) => (
            <Link
              key={list.id}
              to={`/list/${list.id}`}
              className="list-card"
            >
              <div>
                <h3 className="list-card__name">{list.name}</h3>
                <span className="list-card__meta">
                  {list.factions?.name} &middot; {list.points_limit} pts
                </span>
              </div>
              <button
                className="btn btn--danger list-card__delete"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete(list.id);
                }}
              >
                Delete
              </button>
            </Link>
          ))}
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
