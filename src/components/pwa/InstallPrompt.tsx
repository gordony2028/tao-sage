'use client';

/**
 * PWA Install Prompt with Cultural Context
 * 
 * Provides contextual prompts for installing the app with
 * culturally appropriate messaging that emphasizes the
 * contemplative and spiritual nature of the I Ching practice.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallPromptProps {
  /** Custom class name for styling */
  className?: string;
  /** Whether to show as a banner (true) or button (false) */
  asBanner?: boolean;
  /** Callback when user accepts installation */
  onInstallAccepted?: () => void;
  /** Callback when user dismisses installation */
  onInstallDismissed?: () => void;
}

export default function InstallPrompt({
  className = '',
  asBanner = false,
  onInstallAccepted,
  onInstallDismissed,
}: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { isOffline } = useOfflineStatus();

  // Check if already dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('sage-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Re-show after 7 days
      if (daysSinceDismissed < 7) {
        setIsDismissed(true);
      }
    }
  }, []);

  // Listen for install prompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      onInstallAccepted?.();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [onInstallAccepted]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        onInstallAccepted?.();
      } else {
        onInstallDismissed?.();
      }

      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Install prompt error:', error);
    } finally {
      setIsInstalling(false);
    }
  }, [deferredPrompt, onInstallAccepted, onInstallDismissed]);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    localStorage.setItem('sage-install-dismissed', new Date().toISOString());
    onInstallDismissed?.();
  }, [onInstallDismissed]);

  // Don't show if not installable or already dismissed
  if (!isInstallable || isDismissed) {
    return null;
  }

  if (asBanner) {
    return (
      <BannerPrompt
        isOffline={isOffline}
        isInstalling={isInstalling}
        onInstall={handleInstall}
        onDismiss={handleDismiss}
        className={className}
      />
    );
  }

  return (
    <ButtonPrompt
      isOffline={isOffline}
      isInstalling={isInstalling}
      onInstall={handleInstall}
      className={className}
    />
  );
}

/**
 * Banner-style install prompt
 */
function BannerPrompt({
  isOffline,
  isInstalling,
  onInstall,
  onDismiss,
  className,
}: {
  isOffline: boolean;
  isInstalling: boolean;
  onInstall: () => void;
  onDismiss: () => void;
  className: string;
}) {
  return (
    <div className={`rounded-lg bg-gradient-to-r from-jade-green to-bamboo-green p-4 text-cloud-white shadow-lg ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">📱</div>
          <div>
            <div className="font-medium text-lg">
              Install Sage for Your Daily Practice
            </div>
            <div className="text-sm opacity-90 mt-1">
              Access ancient wisdom anytime with our native app experience
            </div>
          </div>
        </div>
        
        <button
          onClick={onDismiss}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close install prompt"
        >
          ✕
        </button>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <div className="text-base">☯</div>
          <span>Offline wisdom access</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-base">⚡</div>
          <span>Faster app performance</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-base">🔔</div>
          <span>Daily guidance notifications</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs opacity-75">
          Join thousands in their daily spiritual practice
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onDismiss}
            className="px-4 py-2 text-sm bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            Not now
          </button>
          <button
            onClick={onInstall}
            disabled={isInstalling}
            className="px-6 py-2 text-sm bg-white text-jade-green hover:bg-cloud-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isInstalling ? 'Installing...' : 'Install App'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Button-style install prompt
 */
function ButtonPrompt({
  isOffline,
  isInstalling,
  onInstall,
  className,
}: {
  isOffline: boolean;
  isInstalling: boolean;
  onInstall: () => void;
  className: string;
}) {
  return (
    <button
      onClick={onInstall}
      disabled={isInstalling}
      className={`flex items-center space-x-2 rounded-lg bg-gradient-to-r from-jade-green to-bamboo-green px-4 py-2 text-sm font-medium text-cloud-white shadow-sm transition-all hover:shadow-md disabled:opacity-50 ${className}`}
    >
      <span className="text-base">📱</span>
      <span>{isInstalling ? 'Installing...' : 'Install App'}</span>
      {isOffline && (
        <div className="ml-2 flex items-center space-x-1 text-xs opacity-75">
          <span>•</span>
          <span>Works offline</span>
        </div>
      )}
    </button>
  );
}

/**
 * Hook to detect if app is installable
 */
export function useInstallable() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  (window.navigator as any).standalone ||
                  document.referrer.includes('android-app://');
    
    setIsInstalled(isPWA);

    const handleBeforeInstallPrompt = () => {
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return {
    isInstallable,
    isInstalled,
  };
}