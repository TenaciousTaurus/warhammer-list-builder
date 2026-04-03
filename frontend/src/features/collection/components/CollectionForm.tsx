import { useState, useEffect } from 'react';
import type { CollectionEntry, Faction, Unit } from '../../../shared/types/database';
import { PAINTING_STATUSES } from '../stores/collectionStore';
import type { PaintingStatus } from '../stores/collectionStore';
import { UnitMatchPicker } from './UnitMatchPicker';
import { PhotoUploader } from './PhotoUploader';

interface CollectionFormProps {
  entry?: CollectionEntry | null;
  factions: Faction[];
  units: Unit[];
  userId: string;
  onSave: (data: Partial<CollectionEntry>) => void;
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

export function CollectionForm({ entry, factions, units, userId, onSave, onClose }: CollectionFormProps) {
  const [customName, setCustomName] = useState('');
  const [factionId, setFactionId] = useState('');
  const [unitId, setUnitId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paintingStatus, setPaintingStatus] = useState<string>('unbuilt');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (entry) {
      setCustomName(entry.custom_name ?? '');
      setFactionId(entry.faction_id ?? '');
      setUnitId(entry.unit_id ?? null);
      setQuantity(entry.quantity);
      setPaintingStatus(entry.painting_status);
      setPurchasePrice(entry.purchase_price != null ? String(entry.purchase_price) : '');
      setPurchaseDate(entry.purchase_date ?? '');
      setNotes(entry.notes ?? '');
      setPhotos(entry.photos ?? []);
    }
  }, [entry]);

  const handleUnitSelect = (id: string | null) => {
    setUnitId(id);
    if (id) {
      const unit = units.find((u) => u.id === id);
      if (unit) {
        if (!customName) setCustomName(unit.name);
        if (!factionId) setFactionId(unit.faction_id);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      custom_name: customName || null,
      faction_id: factionId || null,
      unit_id: unitId,
      quantity,
      painting_status: paintingStatus,
      purchase_price: purchasePrice ? parseFloat(purchasePrice) : null,
      purchase_date: purchaseDate || null,
      notes: notes || null,
      photos,
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="collection-form__backdrop" onClick={handleBackdropClick}>
      <div className="collection-form">
        <div className="collection-form__header">
          <h2 className="collection-form__title">
            {entry ? 'Edit Entry' : 'Add to Collection'}
          </h2>
          <button className="collection-form__close" onClick={onClose}>
            &times;
          </button>
        </div>

        <form className="collection-form__body" onSubmit={handleSubmit}>
          <div className="collection-form__field">
            <label className="collection-form__label" htmlFor="cf-name">
              Name
            </label>
            <input
              id="cf-name"
              className="collection-form__input"
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Intercessors Squad Alpha"
            />
          </div>

          <div className="collection-form__field">
            <label className="collection-form__label" htmlFor="cf-faction">
              Faction
            </label>
            <select
              id="cf-faction"
              className="collection-form__select"
              value={factionId}
              onChange={(e) => setFactionId(e.target.value)}
            >
              <option value="">-- No Faction --</option>
              {factions.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="collection-form__field">
            <label className="collection-form__label">
              Link to Datasheet
            </label>
            <UnitMatchPicker
              units={units}
              selectedUnitId={unitId}
              factionId={factionId || null}
              onSelect={handleUnitSelect}
            />
          </div>

          <div className="collection-form__row">
            <div className="collection-form__field">
              <label className="collection-form__label" htmlFor="cf-qty">
                Quantity
              </label>
              <input
                id="cf-qty"
                className="collection-form__input"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
              />
            </div>

            <div className="collection-form__field">
              <label className="collection-form__label" htmlFor="cf-status">
                Painting Status
              </label>
              <select
                id="cf-status"
                className="collection-form__select"
                value={paintingStatus}
                onChange={(e) => setPaintingStatus(e.target.value)}
              >
                {PAINTING_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="collection-form__row">
            <div className="collection-form__field">
              <label className="collection-form__label" htmlFor="cf-price">
                Purchase Price
              </label>
              <input
                id="cf-price"
                className="collection-form__input"
                type="number"
                step="0.01"
                min="0"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="collection-form__field">
              <label className="collection-form__label" htmlFor="cf-date">
                Purchase Date
              </label>
              <input
                id="cf-date"
                className="collection-form__input"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>
          </div>

          <div className="collection-form__field">
            <label className="collection-form__label" htmlFor="cf-notes">
              Notes
            </label>
            <textarea
              id="cf-notes"
              className="collection-form__textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this unit..."
              rows={3}
            />
          </div>

          {entry && (
            <div className="collection-form__field">
              <label className="collection-form__label">Photos</label>
              <PhotoUploader
                userId={userId}
                entryId={entry.id}
                existingPhotos={photos}
                onPhotosChange={setPhotos}
              />
            </div>
          )}

          <div className="collection-form__actions">
            <button type="button" className="collection-form__btn--cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="collection-form__btn--save">
              {entry ? 'Save Changes' : 'Add to Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
