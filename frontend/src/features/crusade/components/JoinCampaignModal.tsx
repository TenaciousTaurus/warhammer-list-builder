import { useState } from 'react';

interface JoinCampaignModalProps {
  onClose: () => void;
  onJoin: (shareCode: string, displayName: string) => void;
}

export function JoinCampaignModal({ onClose, onJoin }: JoinCampaignModalProps) {
  const [shareCode, setShareCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = shareCode.trim().length > 0 && displayName.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    onJoin(shareCode.trim().toUpperCase(), displayName.trim());
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="join-modal__backdrop" onClick={handleBackdropClick}>
      <div className="join-modal__content">
        <h2 className="join-modal__title">Join Campaign</h2>
        <p className="join-modal__description">
          Enter the share code from the campaign owner to join their crusade.
        </p>

        <div className="battle-log__field">
          <label className="battle-log__label" htmlFor="join-share-code">Share Code</label>
          <input
            id="join-share-code"
            className="join-modal__input"
            type="text"
            placeholder="XXXX-XXXX"
            value={shareCode}
            onChange={(e) => setShareCode(e.target.value.toUpperCase())}
            maxLength={20}
            autoFocus
          />
        </div>

        <div className="battle-log__field">
          <label className="battle-log__label" htmlFor="join-display-name">Display Name</label>
          <input
            id="join-display-name"
            className="join-modal__input"
            type="text"
            placeholder="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={50}
            style={{ letterSpacing: 'normal', textAlign: 'left', textTransform: 'none' }}
          />
        </div>

        <div className="join-modal__actions">
          <button className="join-modal__cancel-btn" onClick={onClose} type="button">
            Cancel
          </button>
          <button
            className="join-modal__submit-btn"
            onClick={handleSubmit}
            disabled={!canSubmit}
            type="button"
          >
            {submitting ? 'Joining...' : 'Join'}
          </button>
        </div>
      </div>
    </div>
  );
}
