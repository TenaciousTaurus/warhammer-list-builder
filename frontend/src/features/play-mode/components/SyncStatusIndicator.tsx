import { useGameSessionStore } from '../stores/gameSessionStore';

export function SyncStatusIndicator() {
  const syncStatus = useGameSessionStore((s) => s.syncStatus);
  const syncError = useGameSessionStore((s) => s.syncError);
  const clearSyncError = useGameSessionStore((s) => s.clearSyncError);
  const retrySyncSession = useGameSessionStore((s) => s._syncSessionImmediate);

  if (syncStatus === 'synced') return null;

  return (
    <div className={`sync-status sync-status--${syncStatus}`}>
      {syncStatus === 'syncing' && (
        <div className="sync-status__syncing">
          <span className="sync-status__dot" />
          <span className="sync-status__label">Syncing...</span>
        </div>
      )}
      {syncStatus === 'error' && (
        <div className="sync-status__error">
          <span className="sync-status__icon">&#9888;</span>
          <span className="sync-status__message">
            {syncError ?? 'Sync failed'}
          </span>
          <button
            className="sync-status__retry"
            onClick={() => {
              clearSyncError();
              retrySyncSession();
            }}
          >
            Retry
          </button>
          <button
            className="sync-status__dismiss"
            onClick={clearSyncError}
            aria-label="Dismiss"
          >
            &#10005;
          </button>
        </div>
      )}
    </div>
  );
}
