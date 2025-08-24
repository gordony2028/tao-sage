/**
 * Offline Status Hook
 * 
 * Manages online/offline state and provides utilities for handling
 * offline scenarios with graceful user experience.
 */

import { useState, useEffect, useCallback } from 'react';
import { syncOfflineConsultations } from '@/lib/consultation/offline-service';

export interface OfflineStatusHook {
  /** Current online status */
  isOnline: boolean;
  /** Whether app is currently in offline mode */
  isOffline: boolean;
  /** Last time the connection status changed */
  lastStatusChange: Date | null;
  /** Whether sync is currently in progress */
  isSyncing: boolean;
  /** Manually trigger sync when connection is restored */
  triggerSync: () => Promise<void>;
  /** Get offline status with connection quality info */
  getConnectionInfo: () => {
    online: boolean;
    connectionType: string;
    effectiveType: string;
  };
}

/**
 * Hook for managing offline status and sync operations
 */
export function useOfflineStatus(): OfflineStatusHook {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [lastStatusChange, setLastStatusChange] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const triggerSync = useCallback(async () => {
    if (!navigator.onLine || isSyncing) {
      return;
    }

    setIsSyncing(true);
    try {
      await syncOfflineConsultations();
    } catch (error) {
      console.warn('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  const updateOnlineStatus = useCallback(() => {
    const online = navigator.onLine;
    setIsOnline(online);
    setLastStatusChange(new Date());
    
    // Auto-sync when coming back online
    if (online && !isSyncing) {
      triggerSync();
    }
  }, [isSyncing, triggerSync]);

  const getConnectionInfo = useCallback(() => {
    const nav = navigator as any;
    
    return {
      online: navigator.onLine,
      connectionType: nav.connection?.type || 'unknown',
      effectiveType: nav.connection?.effectiveType || 'unknown',
    };
  }, []);

  // Set up event listeners for online/offline detection
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleOnline = () => updateOnlineStatus();
    const handleOffline = () => updateOnlineStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Also listen for visibility change to check connection when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateOnlineStatus();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateOnlineStatus]);

  // Periodic connection check (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      // Only check if we think we're online but want to verify
      if (isOnline) {
        // Try a lightweight network request to verify connectivity
        fetch('/api/health', {
          method: 'HEAD',
          cache: 'no-cache',
        }).catch(() => {
          // If fetch fails, we might be offline despite navigator.onLine
          setIsOnline(false);
          setLastStatusChange(new Date());
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOnline]);

  return {
    isOnline,
    isOffline: !isOnline,
    lastStatusChange,
    isSyncing,
    triggerSync,
    getConnectionInfo,
  };
}