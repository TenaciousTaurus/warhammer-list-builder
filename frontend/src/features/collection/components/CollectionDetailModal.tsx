import type { CollectionEntry } from '../../../shared/types/database';
import type { PaintingStatus } from '../stores/collectionStore';

interface CollectionDetailModalProps {
  entry: CollectionEntry;
  unitName?: string;
  factionName?: string;
  onEdit: () => void;
  onClose: () => void;
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

export function CollectionDetailModal({
  entry,
  unitName,
  factionName,
  onEdit,
  onClose,
}: CollectionDetailModalProps) {
  const displayName = entry.custom_name || unitName || 'Unknown Unit';
  const status = entry.painting_status as PaintingStatus;
  const hasPhotos = entry.photos && entry.photos.length > 0;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="collection-detail__backdrop" onClick={handleBackdropClick}>
      <div className="collection-detail">
        {/* Header */}
        <div className="collection-detail__header">
          <h2 className="collection-detail__title">{displayName}</h2>
          <button className="collection-detail__close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="collection-detail__body">
          {/* Photo panel */}
          {hasPhotos && (
            <div className="collection-detail__photo-panel">
              <img
                src={entry.photos[0]}
                alt={displayName}
                className="collection-detail__photo-main"
              />
              {entry.photos.length > 1 && (
                <div className="collection-detail__photo-thumbs">
                  {entry.photos.slice(1).map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt=""
                      className="collection-detail__photo-thumb"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info panel */}
          <div className="collection-detail__info">
            <div className="collection-detail__row">
              <span className="collection-detail__label">Status</span>
              <span className="collection-detail__status-badge" data-status={status}>
                <span className="collection-detail__status-dot" data-status={status} />
                {STATUS_LABELS[status] ?? status}
              </span>
            </div>

            {factionName && (
              <div className="collection-detail__row">
                <span className="collection-detail__label">Faction</span>
                <span className="collection-detail__value">{factionName}</span>
              </div>
            )}

            {unitName && entry.custom_name && unitName !== entry.custom_name && (
              <div className="collection-detail__row">
                <span className="collection-detail__label">Datasheet</span>
                <span className="collection-detail__value">{unitName}</span>
              </div>
            )}

            <div className="collection-detail__row">
              <span className="collection-detail__label">Quantity</span>
              <span className="collection-detail__value">{entry.quantity}</span>
            </div>

            {entry.purchase_price != null && (
              <div className="collection-detail__row">
                <span className="collection-detail__label">Purchase Price</span>
                <span className="collection-detail__value">${entry.purchase_price.toFixed(2)}</span>
              </div>
            )}

            {entry.purchase_date && (
              <div className="collection-detail__row">
                <span className="collection-detail__label">Purchase Date</span>
                <span className="collection-detail__value">
                  {new Date(entry.purchase_date).toLocaleDateString()}
                </span>
              </div>
            )}

            {entry.notes && (
              <div className="collection-detail__notes-block">
                <span className="collection-detail__label">Notes</span>
                <p className="collection-detail__notes">{entry.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="collection-detail__footer">
          <button className="collection-detail__btn--cancel" onClick={onClose}>
            Close
          </button>
          <button className="collection-detail__btn--edit" onClick={onEdit}>
            Edit Entry
          </button>
        </div>
      </div>
    </div>
  );
}
