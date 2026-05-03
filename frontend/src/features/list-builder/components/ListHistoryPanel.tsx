import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../shared/lib/supabase';
import type { ArmyListVersion } from '../../../shared/types/database';

interface ListHistoryPanelProps {
  listId: string;
  onClose: () => void;
}

export function ListHistoryPanel({ listId, onClose }: ListHistoryPanelProps) {
  const navigate = useNavigate();
  const [versions, setVersions] = useState<ArmyListVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('army_list_versions')
      .select('*')
      .eq('list_id', listId)
      .order('changed_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setVersions((data as ArmyListVersion[]) ?? []);
        setLoading(false);
      });
  }, [listId]);

  const handleRestore = async (versionId: string) => {
    setRestoring(versionId);
    setError(null);

    const { data: newListId, error: rpcError } = await supabase.rpc(
      'restore_army_list_version',
      { p_version_id: versionId },
    );

    if (rpcError || !newListId) {
      setError(rpcError?.message ?? 'Restore failed.');
      setRestoring(null);
      return;
    }

    navigate(`/list/${newListId}`);
  };

  return (
    <div className="list-history-panel">
      <div className="list-history-panel__backdrop" onClick={onClose} />
      <div className="list-history-panel__drawer">
        <div className="list-history-panel__header">
          <h2 className="list-history-panel__title">Version History</h2>
          <button className="list-history-panel__close" onClick={onClose} aria-label="Close history panel">
            ✕
          </button>
        </div>

        {error && <div className="list-history-panel__error">{error}</div>}

        {loading ? (
          <div className="list-history-panel__loading">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: '60px', marginBottom: '8px' }} />
            ))}
          </div>
        ) : versions.length === 0 ? (
          <div className="list-history-panel__empty">
            No saved versions yet. Versions are created automatically as you edit your list.
          </div>
        ) : (
          <ul className="list-history-panel__list">
            {versions.map((v) => (
              <li key={v.id} className="list-history-panel__item">
                <div className="list-history-panel__item-meta">
                  <span className="list-history-panel__item-date">
                    {new Date(v.changed_at).toLocaleString()}
                  </span>
                  {v.change_note && (
                    <span className="list-history-panel__item-note">{v.change_note}</span>
                  )}
                </div>
                <div className="list-history-panel__item-snapshot">
                  {(() => {
                    const snap = v.snapshot as { list?: { name?: string; points_limit?: number }; units?: unknown[] };
                    const name = snap?.list?.name ?? 'Unnamed';
                    const pts = snap?.list?.points_limit ?? '?';
                    const unitCount = snap?.units?.length ?? 0;
                    return `${name} · ${pts}pts · ${unitCount} unit${unitCount !== 1 ? 's' : ''}`;
                  })()}
                </div>
                <button
                  className="list-history-panel__restore-btn"
                  onClick={() => handleRestore(v.id)}
                  disabled={restoring === v.id}
                >
                  {restoring === v.id ? 'Restoring…' : 'Restore as new list'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
