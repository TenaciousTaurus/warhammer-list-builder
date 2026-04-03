import type { CollectionEntry } from '../../../shared/types/database';
import { PAINTING_STATUSES } from '../stores/collectionStore';
import type { PaintingStatus } from '../stores/collectionStore';
import { PhotoGallery } from './PhotoGallery';

interface CollectionCardProps {
  entry: CollectionEntry;
  unitName?: string;
  factionName?: string;
  onEdit: () => void;
  onStatusChange: (status: string) => void;
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

function getNextStatus(current: string): string | null {
  const idx = PAINTING_STATUSES.indexOf(current as PaintingStatus);
  if (idx < 0 || idx >= PAINTING_STATUSES.length - 1) return null;
  return PAINTING_STATUSES[idx + 1];
}

export function CollectionCard({
  entry,
  unitName,
  factionName,
  onEdit,
  onStatusChange,
}: CollectionCardProps) {
  const displayName = entry.custom_name || unitName || 'Unknown Unit';
  const status = entry.painting_status as PaintingStatus;
  const nextStatus = getNextStatus(status);

  const handleAdvance = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nextStatus) {
      onStatusChange(nextStatus);
    }
  };

  return (
    <div className="collection-card" onClick={onEdit} role="button" tabIndex={0}>
      <div className="collection-card__header">
        <div className="collection-card__status-dot" data-status={status} />
        <h3 className="collection-card__name">{displayName}</h3>
        {entry.quantity > 1 && (
          <span className="collection-card__quantity">{entry.quantity}</span>
        )}
      </div>

      <div className="collection-card__meta">
        {factionName && (
          <span className="collection-card__faction">{factionName}</span>
        )}
        <span className="collection-card__status-badge" data-status={status}>
          {STATUS_LABELS[status] ?? status}
        </span>
      </div>

      {entry.photos && entry.photos.length > 0 && (
        <PhotoGallery photos={entry.photos} />
      )}

      {nextStatus && (
        <button
          className="collection-card__advance-btn"
          onClick={handleAdvance}
          title={`Advance to ${STATUS_LABELS[nextStatus as PaintingStatus]}`}
        >
          &rarr; {STATUS_LABELS[nextStatus as PaintingStatus]}
        </button>
      )}
    </div>
  );
}
