/**
 * Integration Tests for PWA Sync Functionality
 * 
 * Tests the complete online/offline sync workflow including:
 * - Background sync registration and execution
 * - Sync queue management and retry logic
 * - Online/offline state detection and transitions
 * - Conflict resolution and data integrity
 * - Periodic sync for proactive updates
 */

// Mock Background Sync API
let syncTags: string[] = [];

class MockSyncRegistration {
  async register(tag: string) {
    syncTags.push(tag);
    return Promise.resolve();
  }

  async getTags(): Promise<string[]> {
    return [...syncTags];
  }

  async unregister(tag: string): Promise<boolean> {
    const index = syncTags.indexOf(tag);
    if (index > -1) {
      syncTags.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Mock Service Worker Registration
class MockServiceWorkerRegistration {
  sync: MockSyncRegistration;
  active: any;

  constructor() {
    this.sync = new MockSyncRegistration();
    this.active = {
      postMessage: jest.fn(),
      addEventListener: jest.fn()
    };
  }
}

// Mock navigator.serviceWorker - will be updated in beforeEach
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    ready: Promise.resolve(new MockServiceWorkerRegistration()),
    register: jest.fn(),
    controller: null,
    addEventListener: jest.fn(),
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock fetch
global.fetch = jest.fn();

// Mock online/offline events
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
});

describe('PWA Sync Functionality Integration', () => {
  let originalAddEventListener: any;
  let registeredSyncTags: string[] = [];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    (navigator as any).onLine = true;
    (global.fetch as jest.Mock).mockClear();
    syncTags.splice(0); // Clear sync tags array
    registeredSyncTags.splice(0); // Clear registered sync tags

    // Store original addEventListener to restore later
    originalAddEventListener = window.addEventListener;
    
    // Create fresh service worker registration mock for each test
    navigator.serviceWorker.ready = Promise.resolve(new MockServiceWorkerRegistration());
    
    // Mock ServiceWorkerRegistration for sync API
    (global as any).ServiceWorkerRegistration = class ServiceWorkerRegistration {
      sync = {
        register: jest.fn().mockImplementation((tag: string) => {
          registeredSyncTags.push(tag);
          return Promise.resolve();
        }),
        getTags: jest.fn().mockImplementation(() => Promise.resolve([...registeredSyncTags]))
      };
    };
    
    // Add sync to the prototype
    Object.defineProperty(window, 'ServiceWorkerRegistration', {
      value: (global as any).ServiceWorkerRegistration,
      writable: true
    });
    
    // Make sure sync is available on the prototype using defineProperty
    Object.defineProperty((global as any).ServiceWorkerRegistration.prototype, 'sync', {
      value: {
        register: jest.fn(),
        getTags: jest.fn()
      },
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    // Restore original addEventListener
    window.addEventListener = originalAddEventListener;
  });

  describe('Background Sync Registration', () => {
    it('should register background sync for consultation uploads', async () => {
      const registration = await navigator.serviceWorker.ready;
      const syncTags: string[] = [];

      // Mock sync registration
      registration.sync.register = jest.fn().mockImplementation((tag: string) => {
        syncTags.push(tag);
        return Promise.resolve();
      });

      const registerBackgroundSync = async (tag: string) => {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
          const registration = await navigator.serviceWorker.ready;
          await registration.sync.register(tag);
          return true;
        }
        return false;
      };

      const success = await registerBackgroundSync('consultation-sync');
      
      expect(success).toBe(true);
      expect(registration.sync.register).toHaveBeenCalledWith('consultation-sync');
      expect(syncTags).toContain('consultation-sync');
    });

    it('should handle multiple sync tags', async () => {
      const registration = await navigator.serviceWorker.ready;
      const tags = ['consultation-sync', 'guidance-sync', 'user-preferences-sync'];

      for (const tag of tags) {
        await registration.sync.register(tag);
      }

      const registeredTags = await registration.sync.getTags();
      
      expect(registeredTags).toHaveLength(tags.length);
      tags.forEach(tag => {
        expect(registeredTags).toContain(tag);
      });
    });

    it('should fallback gracefully when background sync unavailable', async () => {
      // Mock unsupported environment
      const originalSync = window.ServiceWorkerRegistration?.prototype.sync;
      delete (window.ServiceWorkerRegistration as any)?.prototype.sync;

      const registerWithFallback = async (tag: string) => {
        try {
          if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            const registration = await navigator.serviceWorker.ready;
            await registration.sync.register(tag);
            return { success: true, method: 'background-sync' };
          }
        } catch (error) {
          // Fallback to immediate sync
          return { success: true, method: 'immediate-sync' };
        }
        
        return { success: true, method: 'immediate-sync' };
      };

      const result = await registerWithFallback('test-sync');
      
      expect(result.success).toBe(true);
      expect(result.method).toBe('immediate-sync');

      // Restore
      if (originalSync) {
        (window.ServiceWorkerRegistration as any).prototype.sync = originalSync;
      }
    });
  });

  describe('Sync Queue Management', () => {
    it('should manage consultation sync queue with priorities', () => {
      const syncQueue = {
        consultations: [
          { id: 'c1', priority: 'high', timestamp: Date.now() - 1000, attempts: 0 },
          { id: 'c2', priority: 'normal', timestamp: Date.now() - 500, attempts: 1 },
          { id: 'c3', priority: 'low', timestamp: Date.now(), attempts: 0 }
        ]
      };

      const sortSyncQueue = (queue: any[]) => {
        const priorityWeights = { high: 3, normal: 2, low: 1 };
        
        return queue.sort((a, b) => {
          // Priority first
          const priorityDiff = priorityWeights[b.priority as keyof typeof priorityWeights] - 
                              priorityWeights[a.priority as keyof typeof priorityWeights];
          if (priorityDiff !== 0) return priorityDiff;
          
          // Then by timestamp (older first)
          return a.timestamp - b.timestamp;
        });
      };

      const sortedQueue = sortSyncQueue([...syncQueue.consultations]);
      
      expect(sortedQueue[0].id).toBe('c1'); // High priority, oldest
      expect(sortedQueue[0].priority).toBe('high');
      expect(sortedQueue[sortedQueue.length - 1].priority).toBe('low');
    });

    it('should implement exponential backoff for failed syncs', () => {
      // Mock Math.random for predictable testing
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.5);
      
      const calculateRetryDelay = (attempts: number, baseDelay = 1000) => {
        const maxDelay = 5 * 60 * 1000; // 5 minutes max
        let delay = Math.min(baseDelay * Math.pow(2, attempts), maxDelay);
        const jitter = delay * 0.1 * Math.random(); // Add 10% jitter
        delay = Math.min(delay + jitter, maxDelay); // Ensure max limit is maintained
        
        return Math.round(delay);
      };

      expect(calculateRetryDelay(0)).toBeCloseTo(1050, -1); // ~1 second + 50ms jitter
      expect(calculateRetryDelay(1)).toBeCloseTo(2100, -1); // ~2 seconds + 100ms jitter
      expect(calculateRetryDelay(3)).toBeCloseTo(8400, -1); // ~8 seconds + 400ms jitter
      expect(calculateRetryDelay(10)).toBeLessThanOrEqual(5 * 60 * 1000); // Max 5 minutes
      
      // Restore original Math.random
      Math.random = originalRandom;
    });

    it('should remove failed items after max attempts', () => {
      const maxRetries = 5;
      const syncItems = [
        { id: 'item1', attempts: 3, lastAttempt: Date.now() - 60000 },
        { id: 'item2', attempts: 6, lastAttempt: Date.now() - 120000 },
        { id: 'item3', attempts: 1, lastAttempt: Date.now() - 30000 }
      ];

      const cleanupFailedItems = (items: any[], maxRetries: number) => {
        return items.filter(item => item.attempts < maxRetries);
      };

      const cleanedItems = cleanupFailedItems(syncItems, maxRetries);
      
      expect(cleanedItems).toHaveLength(2);
      expect(cleanedItems.find(item => item.id === 'item2')).toBeUndefined();
      expect(cleanedItems.find(item => item.id === 'item1')).toBeDefined();
    });

    it('should persist sync queue across sessions', () => {
      const syncQueue = [
        { id: 'consultation-1', data: { question: 'Test', hexagram: 1 }, timestamp: Date.now() }
      ];

      const persistSyncQueue = (queue: any[]) => {
        localStorageMock.setItem('sage-sync-queue', JSON.stringify(queue));
      };

      const loadSyncQueue = (): any[] => {
        const stored = localStorageMock.getItem('sage-sync-queue');
        return stored ? JSON.parse(stored) : [];
      };

      persistSyncQueue(syncQueue);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('sage-sync-queue', JSON.stringify(syncQueue));

      localStorageMock.getItem.mockReturnValue(JSON.stringify(syncQueue));
      const loadedQueue = loadSyncQueue();
      
      expect(loadedQueue).toHaveLength(1);
      expect(loadedQueue[0].id).toBe('consultation-1');
    });
  });

  describe('Online/Offline State Management', () => {
    it('should detect online/offline state changes', (done) => {
      const networkStates: boolean[] = [];
      let eventCount = 0;

      // Mock event listeners
      window.addEventListener = jest.fn().mockImplementation((event: string, callback: EventListener) => {
        if (event === 'online' || event === 'offline') {
          // Simulate network state changes
          setTimeout(() => {
            networkStates.push(event === 'online');
            callback(new Event(event));
            eventCount++;
            
            if (eventCount >= 2) {
              expect(networkStates).toContain(true);
              expect(networkStates).toContain(false);
              done();
            }
          }, 10 * eventCount);
        }
      });

      const setupNetworkListeners = () => {
        window.addEventListener('online', () => {
          console.log('Network: Online');
        });
        
        window.addEventListener('offline', () => {
          console.log('Network: Offline');
        });
      };

      setupNetworkListeners();
      expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
    });

    it('should trigger sync when coming online', async () => {
      const mockSyncQueue = [
        { id: 'offline-consultation-1', data: { question: 'Test', hexagram: 1 } }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSyncQueue));
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

      const syncOnlineHandler = async () => {
        if (!navigator.onLine) return;

        const queueData = localStorageMock.getItem('sage-sync-queue');
        if (!queueData) return;

        const queue = JSON.parse(queueData);
        const syncPromises = queue.map(async (item: any) => {
          try {
            const response = await fetch('/api/consultation/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item.data)
            });
            
            return response.ok ? { success: true, id: item.id } : { success: false, id: item.id };
          } catch (error) {
            return { success: false, id: item.id, error };
          }
        });

        const results = await Promise.allSettled(syncPromises);
        return results;
      };

      (navigator as any).onLine = true;
      const results = await syncOnlineHandler();
      
      expect(results).toHaveLength(1);
      expect(fetch).toHaveBeenCalledWith('/api/consultation/sync', expect.any(Object));
    });

    it('should handle partial sync failures', async () => {
      const syncItems = [
        { id: 'item1', data: { test: 'data1' } },
        { id: 'item2', data: { test: 'data2' } },
        { id: 'item3', data: { test: 'data3' } }
      ];

      // Mock partial failures
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ success: true }) })
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ success: true }) });

      const syncWithErrorHandling = async (items: any[]) => {
        const results = await Promise.allSettled(
          items.map(async (item) => {
            try {
              const response = await fetch('/api/sync', {
                method: 'POST',
                body: JSON.stringify(item)
              });
              
              if (response.ok) {
                return { id: item.id, status: 'success' };
              } else {
                return { id: item.id, status: 'failed', retry: true };
              }
            } catch (error) {
              return { id: item.id, status: 'failed', retry: true, error: error };
            }
          })
        );

        const successful = results.filter(r => r.status === 'fulfilled' && 
          (r.value as any).status === 'success').length;
        const failed = results.length - successful;

        return { successful, failed, results };
      };

      const syncResult = await syncWithErrorHandling(syncItems);
      
      expect(syncResult.successful).toBe(2);
      expect(syncResult.failed).toBe(1);
      expect(fetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('Conflict Resolution', () => {
    it('should detect and resolve data conflicts', () => {
      const serverData = {
        id: 'consultation-123',
        question: 'Server version of question',
        hexagram: 42,
        lastModified: new Date('2023-12-01T10:00:00Z').getTime()
      };

      const localData = {
        id: 'consultation-123',
        question: 'Local version of question',
        hexagram: 42,
        lastModified: new Date('2023-12-01T09:00:00Z').getTime()
      };

      const resolveConflict = (server: any, local: any) => {
        // Server wins if it's newer
        if (server.lastModified > local.lastModified) {
          return { resolved: server, source: 'server', conflictResolved: true };
        } 
        // Local wins if it's newer
        else if (local.lastModified > server.lastModified) {
          return { resolved: local, source: 'local', conflictResolved: true };
        }
        // Same timestamp - merge or prefer server
        else {
          return { resolved: server, source: 'server', conflictResolved: true, note: 'Same timestamp, preferred server' };
        }
      };

      const resolution = resolveConflict(serverData, localData);
      
      expect(resolution.source).toBe('server');
      expect(resolution.conflictResolved).toBe(true);
      expect(resolution.resolved.question).toBe('Server version of question');
    });

    it('should handle merge conflicts for consultation data', () => {
      const serverConsultation = {
        id: 'c1',
        question: 'What should I do?',
        hexagram: { number: 1, lines: [7,8,7,8,7,8] },
        tags: ['career'],
        notes: 'Server notes',
        lastModified: Date.now()
      };

      const localConsultation = {
        id: 'c1',
        question: 'What should I do?',
        hexagram: { number: 1, lines: [7,8,7,8,7,8] },
        tags: ['career', 'personal'],
        notes: 'Local notes with more detail',
        lastModified: Date.now() - 5000
      };

      const mergeConsultations = (server: any, local: any) => {
        return {
          ...server,
          tags: [...new Set([...server.tags, ...local.tags])], // Merge unique tags
          notes: local.notes.length > server.notes.length ? local.notes : server.notes, // Keep longer notes
          lastModified: Math.max(server.lastModified, local.lastModified),
          merged: true
        };
      };

      const merged = mergeConsultations(serverConsultation, localConsultation);
      
      expect(merged.tags).toHaveLength(2);
      expect(merged.tags).toContain('personal');
      expect(merged.notes).toBe('Local notes with more detail');
      expect(merged.merged).toBe(true);
    });

    it('should validate data integrity after conflict resolution', () => {
      const resolvedData = {
        id: 'consultation-456',
        question: 'Test question',
        hexagram: { number: 23, lines: [6,7,8,9,7,8] },
        interpretation: { guidance: 'Test guidance' },
        timestamp: Date.now(),
        userId: 'user123'
      };

      const validateConsultationIntegrity = (consultation: any) => {
        const errors = [];

        // Required fields
        if (!consultation.id) errors.push('Missing ID');
        if (!consultation.question) errors.push('Missing question');
        if (!consultation.userId) errors.push('Missing user ID');

        // Hexagram validation
        if (!consultation.hexagram || !consultation.hexagram.number) {
          errors.push('Missing hexagram');
        } else {
          if (consultation.hexagram.number < 1 || consultation.hexagram.number > 64) {
            errors.push('Invalid hexagram number');
          }
          if (!consultation.hexagram.lines || consultation.hexagram.lines.length !== 6) {
            errors.push('Invalid hexagram lines');
          }
        }

        // Timestamp validation
        if (!consultation.timestamp || consultation.timestamp > Date.now()) {
          errors.push('Invalid timestamp');
        }

        return {
          valid: errors.length === 0,
          errors
        };
      };

      const validation = validateConsultationIntegrity(resolvedData);
      
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  describe('Periodic Sync', () => {
    it('should implement periodic background sync', async () => {
      const syncConfig = {
        interval: 5 * 60 * 1000, // 5 minutes
        maxRetries: 3,
        tags: ['user-preferences', 'daily-guidance']
      };

      const periodicSyncResults: string[] = [];

      const schedulePeriodicSync = async (config: typeof syncConfig) => {
        for (const tag of config.tags) {
          try {
            const registration = await navigator.serviceWorker.ready;
            await registration.sync.register(`periodic-${tag}`);
            periodicSyncResults.push(tag);
          } catch (error) {
            console.warn(`Failed to schedule periodic sync for ${tag}:`, error);
          }
        }

        return periodicSyncResults;
      };

      const results = await schedulePeriodicSync(syncConfig);
      
      expect(results).toHaveLength(syncConfig.tags.length);
      expect(results).toContain('user-preferences');
      expect(results).toContain('daily-guidance');
    });

    it('should handle sync scheduling based on usage patterns', () => {
      const userActivity = {
        lastActive: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        avgSessionDuration: 15 * 60 * 1000, // 15 minutes
        dailyUsage: 3, // 3 times per day
        preferredSyncTime: '06:00'
      };

      const calculateSyncStrategy = (activity: typeof userActivity) => {
        const hoursInactive = (Date.now() - activity.lastActive) / (1000 * 60 * 60);
        
        let strategy = 'normal';
        let interval = 30 * 60 * 1000; // 30 minutes default

        if (hoursInactive > 24) {
          strategy = 'minimal';
          interval = 4 * 60 * 60 * 1000; // 4 hours
        } else if (hoursInactive < 1 && activity.dailyUsage > 5) {
          strategy = 'aggressive';
          interval = 10 * 60 * 1000; // 10 minutes
        }

        return { strategy, interval, hoursInactive };
      };

      const syncStrategy = calculateSyncStrategy(userActivity);
      
      expect(syncStrategy.strategy).toBe('normal');
      expect(syncStrategy.interval).toBe(30 * 60 * 1000);
      expect(syncStrategy.hoursInactive).toBeCloseTo(2, 1);
    });

    it('should respect user preferences for sync frequency', () => {
      const userPreferences = {
        syncEnabled: true,
        syncFrequency: 'balanced', // 'aggressive', 'balanced', 'conservative'
        syncOnWifiOnly: true,
        backgroundSync: true
      };

      const getSyncIntervalFromPreferences = (prefs: typeof userPreferences) => {
        if (!prefs.syncEnabled) return null;

        const intervals = {
          aggressive: 5 * 60 * 1000,   // 5 minutes
          balanced: 30 * 60 * 1000,    // 30 minutes  
          conservative: 2 * 60 * 60 * 1000 // 2 hours
        };

        return intervals[prefs.syncFrequency as keyof typeof intervals];
      };

      const interval = getSyncIntervalFromPreferences(userPreferences);
      
      expect(interval).toBe(30 * 60 * 1000); // 30 minutes for balanced
      expect(typeof interval).toBe('number');

      // Test disabled sync
      const disabledPrefs = { ...userPreferences, syncEnabled: false };
      const disabledInterval = getSyncIntervalFromPreferences(disabledPrefs);
      expect(disabledInterval).toBeNull();
    });
  });

  describe('Sync Error Handling and Recovery', () => {
    it('should handle network timeouts gracefully', async () => {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Network timeout')), 1000);
      });

      (global.fetch as jest.Mock).mockImplementation(() => timeoutPromise);

      const syncWithTimeout = async (data: any, timeoutMs = 5000) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
          const response = await fetch('/api/sync', {
            method: 'POST',
            body: JSON.stringify(data),
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          return { success: true, response };
        } catch (error) {
          clearTimeout(timeoutId);
          
          if (error instanceof Error && error.name === 'AbortError') {
            return { success: false, error: 'Timeout', retry: true };
          }
          
          return { success: false, error: error, retry: true };
        }
      };

      const result = await syncWithTimeout({ test: 'data' });
      
      expect(result.success).toBe(false);
      expect(result.retry).toBe(true);
    });

    it('should implement circuit breaker pattern', async () => {
      class SyncCircuitBreaker {
        private failures = 0;
        private lastFailureTime = 0;
        private readonly maxFailures = 5;
        private readonly resetTimeout = 60000; // 1 minute

        async execute(syncFn: () => Promise<any>) {
          if (this.isOpen()) {
            throw new Error('Circuit breaker is open');
          }

          try {
            const result = await syncFn();
            this.onSuccess();
            return result;
          } catch (error) {
            this.onFailure();
            throw error;
          }
        }

        private isOpen(): boolean {
          if (this.failures >= this.maxFailures) {
            if (Date.now() - this.lastFailureTime > this.resetTimeout) {
              this.reset();
              return false;
            }
            return true;
          }
          return false;
        }

        private onSuccess() {
          this.failures = 0;
        }

        private onFailure() {
          this.failures++;
          this.lastFailureTime = Date.now();
        }

        private reset() {
          this.failures = 0;
          this.lastFailureTime = 0;
        }

        getState() {
          return {
            failures: this.failures,
            isOpen: this.isOpen(),
            lastFailureTime: this.lastFailureTime
          };
        }
      }

      const circuitBreaker = new SyncCircuitBreaker();
      
      // Test initial state
      expect(circuitBreaker.getState().failures).toBe(0);
      expect(circuitBreaker.getState().isOpen).toBe(false);

      // Test failure tracking
      const executeWithFailure = async () => {
        for (let i = 0; i < 5; i++) {
          try {
            await circuitBreaker.execute(async () => {
              throw new Error('Sync failed');
            });
          } catch (error) {
            // Expected to fail
          }
        }
      };

      // Execute and wait for all failures to be processed
      await executeWithFailure();

      expect(circuitBreaker.getState().failures).toBe(5);
      expect(circuitBreaker.getState().isOpen).toBe(true);
    });
  });
});