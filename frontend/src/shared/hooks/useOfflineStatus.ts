import { useState, useEffect, useMemo } from 'react';

const LAST_SYNCED_KEY = 'warforge-last-synced';

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Stamp last-synced whenever we transition to online
  useEffect(() => {
    if (isOnline) {
      localStorage.setItem(LAST_SYNCED_KEY, new Date().toISOString());
    }
  }, [isOnline]);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Re-read from localStorage whenever connectivity changes
  const lastSyncedAt = useMemo(() => {
    const stored = localStorage.getItem(LAST_SYNCED_KEY);
    return stored ? new Date(stored) : null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  return { isOnline, lastSyncedAt };
}
