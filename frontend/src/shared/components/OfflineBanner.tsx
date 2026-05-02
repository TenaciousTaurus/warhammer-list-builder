import { useOfflineStatus } from '../hooks/useOfflineStatus';

function formatRelative(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return date.toLocaleDateString();
}

export function OfflineBanner() {
  const { isOnline, lastSyncedAt } = useOfflineStatus();

  if (isOnline) return null;

  return (
    <div className="offline-banner" role="status" aria-live="polite">
      <span className="offline-banner__icon" aria-hidden="true">⚡</span>
      <span className="offline-banner__text">
        You&apos;re offline
        {lastSyncedAt && (
          <span className="offline-banner__synced">
            {' '}· Last synced {formatRelative(lastSyncedAt)}
          </span>
        )}
      </span>
    </div>
  );
}
