import type { CollectionEntry } from '../../../shared/types/database';
import { PAINTING_STATUSES } from '../stores/collectionStore';
import type { PaintingStatus } from '../stores/collectionStore';

interface PaintingPipelineProps {
  entries: CollectionEntry[];
  unitNames: Map<string, string>;
  factionNames: Map<string, string>;
  onEditEntry: (entry: CollectionEntry) => void;
  onStatusChange: (entryId: string, newStatus: string) => void;
}

const STATUS_LABELS: Record<PaintingStatus, string> = {
  unbuilt: 'Unbuilt',
  assembled: 'Assembled',
  primed: 'Primed',
  basecoated: 'Basecoated',
  detailed: 'Detailed',
  based: 'Based',
  finished: 'Finished',
};

export function PaintingPipeline({
  entries,
  unitNames,
  factionNames,
  onEditEntry,
  onStatusChange,
}: PaintingPipelineProps) {
  const grouped = new Map<string, CollectionEntry[]>();
  for (const status of PAINTING_STATUSES) {
    grouped.set(status, []);
  }
  for (const entry of entries) {
    const bucket = grouped.get(entry.painting_status);
    if (bucket) {
      bucket.push(entry);
    } else {
      grouped.get('unbuilt')!.push(entry);
    }
  }

  return (
    <div className="pipeline">
      {PAINTING_STATUSES.map((status) => {
        const columnEntries = grouped.get(status) ?? [];
        const nextIdx = PAINTING_STATUSES.indexOf(status) + 1;
        const nextStatus = nextIdx < PAINTING_STATUSES.length ? PAINTING_STATUSES[nextIdx] : null;

        return (
          <div key={status} className="pipeline__column" data-status={status}>
            <div className="pipeline__column-header">
              <span className="pipeline__column-dot" data-status={status} />
              <h3 className="pipeline__column-title">{STATUS_LABELS[status]}</h3>
              <span className="pipeline__column-count">{columnEntries.length}</span>
            </div>

            <div className="pipeline__column-body">
              {columnEntries.length === 0 && (
                <div className="pipeline__empty">No units</div>
              )}
              {columnEntries.map((entry) => {
                const name = entry.custom_name || unitNames.get(entry.unit_id ?? '') || 'Unknown';
                const faction = factionNames.get(entry.faction_id ?? '');

                return (
                  <div
                    key={entry.id}
                    className="pipeline__card"
                    onClick={() => onEditEntry(entry)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="pipeline__card-name">{name}</div>
                    {entry.quantity > 1 && (
                      <span className="pipeline__card-qty">{entry.quantity}</span>
                    )}
                    {faction && (
                      <span className="pipeline__card-faction">{faction}</span>
                    )}
                    {nextStatus && (
                      <button
                        className="pipeline__card-advance"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange(entry.id, nextStatus);
                        }}
                        title={`Move to ${STATUS_LABELS[nextStatus]}`}
                      >
                        &rarr;
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
