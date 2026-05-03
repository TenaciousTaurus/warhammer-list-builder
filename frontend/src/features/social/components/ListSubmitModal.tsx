import { useEffect, useState } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import type { ArmyList } from '../../../shared/types/database';

interface ListSubmitModalProps {
  participantId: string;
  tournamentPointsLimit: number;
  onClose: () => void;
  onSubmitted: () => void;
}

export function ListSubmitModal({
  participantId,
  tournamentPointsLimit,
  onClose,
  onSubmitted,
}: ListSubmitModalProps) {
  const [lists, setLists] = useState<ArmyList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('army_lists')
      .select('*')
      .order('updated_at', { ascending: false })
      .then(({ data }) => {
        setLists((data as ArmyList[]) ?? []);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async () => {
    if (!selectedListId) return;
    setSubmitting(true);
    setError(null);

    const { data, error: rpcError } = await supabase.rpc('submit_tournament_list', {
      p_participant_id: participantId,
      p_list_id: selectedListId,
    });

    if (rpcError || !data?.success) {
      setError(data?.error ?? rpcError?.message ?? 'Submission failed.');
      setSubmitting(false);
      return;
    }

    onSubmitted();
    onClose();
  };

  return (
    <div className="list-submit-modal" role="dialog" aria-modal="true" aria-labelledby="list-submit-title">
      <div className="list-submit-modal__backdrop" onClick={onClose} />
      <div className="list-submit-modal__content">
        <h2 id="list-submit-title" className="list-submit-modal__title">Submit Army List</h2>
        <p className="list-submit-modal__hint">
          Select an army list to submit for this tournament ({tournamentPointsLimit} pts).
          The list will be validated before submission.
        </p>

        {loading ? (
          <div className="list-submit-modal__loading">Loading lists…</div>
        ) : lists.length === 0 ? (
          <div className="list-submit-modal__empty">
            You have no army lists. Create one in the List Builder first.
          </div>
        ) : (
          <ul className="list-submit-modal__list">
            {lists.map((list) => (
              <li key={list.id}>
                <button
                  type="button"
                  className={`list-submit-modal__option${selectedListId === list.id ? ' list-submit-modal__option--selected' : ''}`}
                  onClick={() => setSelectedListId(list.id)}
                >
                  <span className="list-submit-modal__option-name">{list.name}</span>
                  <span className="list-submit-modal__option-pts">{list.points_limit} pts</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && <div className="list-submit-modal__error">{error}</div>}

        <div className="list-submit-modal__actions">
          <button
            className="list-submit-modal__submit-btn"
            onClick={handleSubmit}
            disabled={!selectedListId || submitting}
          >
            {submitting ? 'Submitting…' : 'Submit List'}
          </button>
          <button className="list-submit-modal__cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
