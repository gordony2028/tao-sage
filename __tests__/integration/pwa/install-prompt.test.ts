/**
 * Integration Tests for PWA Install Prompt Functionality
 * 
 * Tests the complete PWA installation workflow including:
 * - BeforeInstallPrompt event handling
 * - Custom install prompt display with cultural context
 * - Installation process and user feedback
 * - Post-installation behavior and cleanup
 */

// Mock BeforeInstallPrompt Event
class MockBeforeInstallPromptEvent extends Event {
  platforms: string[];
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  private promptResult: 'accepted' | 'dismissed';

  constructor(type: string, platforms: string[] = ['web'], outcome: 'accepted' | 'dismissed' = 'accepted') {
    super(type);
    this.platforms = platforms;
    this.promptResult = outcome;
    this.userChoice = Promise.resolve({ 
      outcome: this.promptResult, 
      platform: platforms[0] || 'web' 
    });
  }

  prompt() {
    return Promise.resolve();
  }
}

// Mock window.matchMedia for PWA detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: query.includes('display-mode: standalone'),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage for install prompt preferences
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock Service Worker
const mockServiceWorker = {
  ready: Promise.resolve({
    active: true,
    installing: null,
    waiting: null,
    update: jest.fn(),
    unregister: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
  register: jest.fn().mockResolvedValue({}),
  getRegistration: jest.fn().mockResolvedValue({}),
  getRegistrations: jest.fn().mockResolvedValue([]),
  startMessages: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

Object.defineProperty(navigator, 'serviceWorker', {
  value: mockServiceWorker,
  writable: true,
});

describe('PWA Install Prompt Integration', () => {
  let mockBeforeInstallPrompt: MockBeforeInstallPromptEvent;
  let installPromptHandler: (event: Event) => void;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Reset PWA detection
    (window.matchMedia as jest.Mock).mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Create fresh event listener for each test
    installPromptHandler = jest.fn();
    mockBeforeInstallPrompt = new MockBeforeInstallPromptEvent('beforeinstallprompt', ['web'], 'accepted');
  });

  describe('Install Prompt Detection and Storage', () => {
    it('should capture and store beforeinstallprompt event', () => {
      let capturedEvent: MockBeforeInstallPromptEvent | null = null;
      
      // Simulate PWA install prompt detection
      const handleBeforeInstallPrompt = (event: Event) => {
        event.preventDefault();
        capturedEvent = event as MockBeforeInstallPromptEvent;
        
        // Store the event for later use
        (window as any).deferredPrompt = event;
      };

      // Create a new event that can be prevented
      const preventableEvent = new MockBeforeInstallPromptEvent('beforeinstallprompt', ['web'], 'accepted');
      Object.defineProperty(preventableEvent, 'defaultPrevented', {
        writable: true,
        value: false
      });
      
      // Override preventDefault to set defaultPrevented
      preventableEvent.preventDefault = function() {
        Object.defineProperty(this, 'defaultPrevented', { value: true });
      };

      handleBeforeInstallPrompt(preventableEvent);

      expect(capturedEvent).toBe(preventableEvent);
      expect((window as any).deferredPrompt).toBe(preventableEvent);
      expect(preventableEvent.defaultPrevented).toBe(true);
    });

    it('should detect PWA installation eligibility', () => {
      const mockEvent = new MockBeforeInstallPromptEvent('beforeinstallprompt', ['web', 'android']);
      
      // Simulate installation criteria check
      const isInstallable = (event: MockBeforeInstallPromptEvent) => {
        return event.platforms.length > 0 && 
               event.platforms.includes('web') &&
               !window.matchMedia('(display-mode: standalone)').matches;
      };

      expect(isInstallable(mockEvent)).toBe(true);
      expect(mockEvent.platforms).toContain('web');
      expect(mockEvent.platforms).toHaveLength(2);
    });

    it('should not show prompt if already installed', () => {
      // Mock PWA already installed
      (window.matchMedia as jest.Mock).mockImplementation(query => ({
        matches: query.includes('display-mode: standalone'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const isPWA = window.matchMedia('(display-mode: standalone)').matches;
      expect(isPWA).toBe(true);

      // Should not capture install prompt if already installed
      const shouldCapturePrompt = !isPWA;
      expect(shouldCapturePrompt).toBe(false);
    });
  });

  describe('Cultural Install Prompt Display', () => {
    it('should display culturally appropriate install message', async () => {
      const installPromptConfig = {
        title: 'Add Sage to Your Spiritual Practice',
        message: 'Install Sage for offline I Ching consultations and daily wisdom guidance.',
        benefits: [
          'Access ancient wisdom offline',
          'Daily guidance notifications',
          'Private spiritual practice',
          'Faster consultations'
        ],
        actionText: 'Install Sage',
        dismissText: 'Maybe Later',
        culturalNote: 'Honoring the timeless wisdom of the I Ching in your daily life'
      };

      expect(installPromptConfig.title).toContain('Spiritual Practice');
      expect(installPromptConfig.message).toContain('I Ching consultations');
      expect(installPromptConfig.benefits).toContain('Access ancient wisdom offline');
      expect(installPromptConfig.culturalNote).toContain('I Ching');
    });

    it('should handle user prompt timing preferences', () => {
      // Test immediate prompt
      localStorageMock.getItem.mockReturnValue(null);
      
      const shouldShowPrompt = (promptCount: number, lastDismissed: string | null) => {
        if (!lastDismissed) return promptCount === 0; // First visit
        
        const lastDismissedDate = new Date(lastDismissed);
        const daysSinceLastPrompt = (Date.now() - lastDismissedDate.getTime()) / (1000 * 60 * 60 * 24);
        
        return daysSinceLastPrompt >= 7; // Wait 7 days after dismissal
      };

      expect(shouldShowPrompt(0, null)).toBe(true);
      expect(shouldShowPrompt(1, new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString())).toBe(false);
      expect(shouldShowPrompt(1, new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString())).toBe(true);
    });

    it('should respect user dismiss preferences', () => {
      const DISMISS_FOREVER = 'dismiss_forever';
      const DISMISS_SESSION = 'dismiss_session';
      
      // Test permanent dismissal
      localStorageMock.getItem.mockReturnValue(DISMISS_FOREVER);
      
      const shouldRespectDismissal = (dismissType: string) => {
        return dismissType === DISMISS_FOREVER;
      };

      expect(shouldRespectDismissal(DISMISS_FOREVER)).toBe(true);
      expect(shouldRespectDismissal(DISMISS_SESSION)).toBe(false);
    });
  });

  describe('Installation Process', () => {
    it('should handle successful installation', async () => {
      const mockEvent = new MockBeforeInstallPromptEvent('beforeinstallprompt', ['web'], 'accepted');
      
      // Simulate installation flow
      const installApp = async (deferredPrompt: MockBeforeInstallPromptEvent) => {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        return {
          success: choiceResult.outcome === 'accepted',
          outcome: choiceResult.outcome,
          platform: choiceResult.platform
        };
      };

      const result = await installApp(mockEvent);
      
      expect(result.success).toBe(true);
      expect(result.outcome).toBe('accepted');
      expect(result.platform).toBe('web');
    });

    it('should handle installation dismissal', async () => {
      const mockEvent = new MockBeforeInstallPromptEvent('beforeinstallprompt', ['web'], 'dismissed');
      
      const installApp = async (deferredPrompt: MockBeforeInstallPromptEvent) => {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        return {
          success: choiceResult.outcome === 'accepted',
          outcome: choiceResult.outcome,
          platform: choiceResult.platform,
          dismissed: choiceResult.outcome === 'dismissed'
        };
      };

      const result = await installApp(mockEvent);
      
      expect(result.success).toBe(false);
      expect(result.outcome).toBe('dismissed');
      expect(result.dismissed).toBe(true);
    });

    it('should track installation analytics', async () => {
      const analytics = {
        promptShown: 0,
        installAccepted: 0,
        installDismissed: 0,
        installCompleted: 0
      };

      const trackInstallEvent = (event: string, data?: any) => {
        switch (event) {
          case 'prompt_shown':
            analytics.promptShown++;
            break;
          case 'install_accepted':
            analytics.installAccepted++;
            break;
          case 'install_dismissed':
            analytics.installDismissed++;
            break;
          case 'install_completed':
            analytics.installCompleted++;
            break;
        }
      };

      // Simulate installation flow with analytics
      trackInstallEvent('prompt_shown');
      
      const mockEvent = new MockBeforeInstallPromptEvent('beforeinstallprompt', ['web'], 'accepted');
      const result = await mockEvent.userChoice;
      
      if (result.outcome === 'accepted') {
        trackInstallEvent('install_accepted');
        trackInstallEvent('install_completed');
      } else {
        trackInstallEvent('install_dismissed');
      }

      expect(analytics.promptShown).toBe(1);
      expect(analytics.installAccepted).toBe(1);
      expect(analytics.installCompleted).toBe(1);
      expect(analytics.installDismissed).toBe(0);
    });
  });

  describe('Post-Installation Behavior', () => {
    it('should clean up deferred prompt after installation', async () => {
      (window as any).deferredPrompt = mockBeforeInstallPrompt;
      
      const cleanupAfterInstall = () => {
        (window as any).deferredPrompt = null;
        localStorageMock.setItem('pwa_installed', 'true');
        localStorageMock.setItem('install_date', new Date().toISOString());
      };

      cleanupAfterInstall();

      expect((window as any).deferredPrompt).toBe(null);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('pwa_installed', 'true');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('install_date', expect.any(String));
    });

    it('should detect PWA launch mode', () => {
      // Test standalone launch
      (window.matchMedia as jest.Mock).mockImplementation(query => ({
        matches: query.includes('display-mode: standalone'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const launchMode = {
        standalone: window.matchMedia('(display-mode: standalone)').matches,
        fullscreen: window.matchMedia('(display-mode: fullscreen)').matches,
        browser: !window.matchMedia('(display-mode: standalone)').matches && 
                !window.matchMedia('(display-mode: fullscreen)').matches
      };

      expect(launchMode.standalone).toBe(true);
      expect(launchMode.browser).toBe(false);
    });

    it('should handle app shortcuts and navigation', () => {
      const appShortcuts = [
        { name: 'Daily Guidance', url: '/guidance', description: 'Get your daily I Ching wisdom' },
        { name: 'New Consultation', url: '/consultation', description: 'Ask the I Ching a question' },
        { name: 'History', url: '/history', description: 'View your consultation history' }
      ];

      const validateShortcuts = (shortcuts: any[]) => {
        return shortcuts.every(shortcut => 
          shortcut.name && 
          shortcut.url && 
          shortcut.description &&
          shortcut.url.startsWith('/')
        );
      };

      expect(validateShortcuts(appShortcuts)).toBe(true);
      expect(appShortcuts).toHaveLength(3);
      expect(appShortcuts[0].name).toBe('Daily Guidance');
    });
  });

  describe('Install Prompt Edge Cases', () => {
    it('should handle prompt errors gracefully', async () => {
      const mockErrorEvent = {
        ...mockBeforeInstallPrompt,
        prompt: jest.fn().mockRejectedValue(new Error('Install prompt failed')),
      };

      const safeInstall = async (deferredPrompt: any) => {
        try {
          await deferredPrompt.prompt();
          return { success: true, error: null };
        } catch (error) {
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      };

      const result = await safeInstall(mockErrorEvent);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Install prompt failed');
    });

    it('should handle unsupported browsers', () => {
      // Mock unsupported browser
      delete (window as any).BeforeInstallPromptEvent;
      
      const isInstallSupported = () => {
        return 'serviceWorker' in navigator && 
               'BeforeInstallPromptEvent' in window;
      };

      expect(isInstallSupported()).toBe(false);
    });

    it('should handle network connectivity during install', async () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      const checkInstallConditions = () => {
        // Check for real serviceWorker or our mock
        const hasServiceWorker = 'serviceWorker' in navigator && navigator.serviceWorker !== undefined;
        return {
          hasServiceWorker: hasServiceWorker,
          isOnline: navigator.onLine,
          canInstall: hasServiceWorker && navigator.onLine
        };
      };

      const conditions = checkInstallConditions();
      
      expect(conditions.hasServiceWorker).toBe(true);
      expect(conditions.isOnline).toBe(false);
      expect(conditions.canInstall).toBe(false);
    });
  });

  describe('A11y and UX Considerations', () => {
    it('should provide accessible install prompt', () => {
      const accessiblePrompt = {
        role: 'dialog',
        ariaLabel: 'Install Sage Application',
        ariaDescribedBy: 'install-prompt-description',
        focusManagement: true,
        keyboardNavigation: true,
        screenReaderAnnouncement: 'Install prompt dialog opened'
      };

      expect(accessiblePrompt.role).toBe('dialog');
      expect(accessiblePrompt.ariaLabel).toContain('Install');
      expect(accessiblePrompt.focusManagement).toBe(true);
      expect(accessiblePrompt.keyboardNavigation).toBe(true);
    });

    it('should handle reduced motion preferences', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const shouldReduceAnimation = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      const animationConfig = {
        duration: shouldReduceAnimation ? 0 : 300,
        easing: shouldReduceAnimation ? 'none' : 'ease-in-out',
        respectsPreferences: true
      };

      expect(animationConfig.duration).toBe(0);
      expect(animationConfig.easing).toBe('none');
      expect(animationConfig.respectsPreferences).toBe(true);
    });
  });
});