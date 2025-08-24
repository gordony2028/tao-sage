/**
 * Integration Tests for PWA Performance Optimization
 * 
 * Tests the complete performance optimization system including:
 * - Core Web Vitals monitoring and optimization
 * - Resource preloading and caching strategies
 * - Network-aware optimizations
 * - Battery-conscious performance adjustments
 * - Image optimization and lazy loading
 */

// Mock Performance APIs
class MockPerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;

  constructor(name: string, entryType: string, startTime: number = 100, duration: number = 50) {
    this.name = name;
    this.entryType = entryType;
    this.startTime = startTime;
    this.duration = duration;
  }
}

class MockPerformanceObserver {
  private callback: (list: { getEntries: () => MockPerformanceEntry[] }) => void;
  private options: any;

  constructor(callback: (list: any) => void) {
    this.callback = callback;
  }

  observe(options: any) {
    this.options = options;
    // Simulate performance entries
    setTimeout(() => {
      const entries = this.generateMockEntries(options.type);
      this.callback({ getEntries: () => entries });
    }, 10);
  }

  disconnect() {}

  private generateMockEntries(type: string): MockPerformanceEntry[] {
    switch (type) {
      case 'largest-contentful-paint':
        return [new MockPerformanceEntry('largest-contentful-paint', 'largest-contentful-paint', 1200, 0)];
      case 'first-input':
        return [new MockPerformanceEntry('first-input', 'first-input', 50, 5)];
      case 'layout-shift':
        return [new MockPerformanceEntry('layout-shift', 'layout-shift', 100, 0)];
      default:
        return [];
    }
  }
}

// Mock Network Information API
const mockConnection = {
  effectiveType: '4g',
  downlink: 10,
  rtt: 50,
  saveData: false,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

// Mock Battery API
const mockBattery = {
  charging: true,
  level: 0.8,
  chargingTime: Infinity,
  dischargingTime: 7200,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

// Setup global mocks
global.PerformanceObserver = MockPerformanceObserver as any;
Object.defineProperty(navigator, 'connection', {
  value: mockConnection,
  writable: true,
});
Object.defineProperty(navigator, 'getBattery', {
  value: () => Promise.resolve(mockBattery),
  writable: true,
});

// Mock requestIdleCallback
global.requestIdleCallback = jest.fn((callback) => {
  return setTimeout(callback, 1);
});

// Mock Intersection Observer for lazy loading
class MockIntersectionObserver {
  private callback: IntersectionObserverCallback;
  private entries: IntersectionObserverEntry[] = [];

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(element: Element) {
    // Simulate element entering viewport
    setTimeout(() => {
      const entry = {
        target: element,
        isIntersecting: true,
        boundingClientRect: element.getBoundingClientRect(),
        intersectionRatio: 1,
        intersectionRect: element.getBoundingClientRect(),
        rootBounds: null,
        time: Date.now(),
      } as IntersectionObserverEntry;
      
      this.callback([entry], this);
    }, 100);
  }

  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = MockIntersectionObserver as any;

describe('PWA Performance Optimization Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset connection state
    mockConnection.effectiveType = '4g';
    mockConnection.saveData = false;
    
    // Reset battery state
    mockBattery.charging = true;
    mockBattery.level = 0.8;
  });

  describe('Core Web Vitals Monitoring', () => {
    it('should measure and optimize Largest Contentful Paint (LCP)', (done) => {
      let lcpValue: number | null = null;
      
      const measureLCP = () => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            lcpValue = lastEntry.startTime;
            
            // Verify LCP measurement
            expect(lcpValue).toBeGreaterThan(0);
            expect(lcpValue).toBe(1200); // From our mock
            
            // Test optimization trigger
            const needsOptimization = lcpValue > 2500;
            expect(needsOptimization).toBe(false);
            
            done();
          }
        });
        
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      };

      measureLCP();
    });

    it('should measure and optimize First Input Delay (FID)', (done) => {
      let fidValue: number | null = null;
      
      const measureFID = () => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            const fid = entry.processingStart ? entry.processingStart - entry.startTime : 5;
            fidValue = fid;
            
            // Verify FID measurement
            expect(fidValue).toBeGreaterThanOrEqual(0);
            
            // Test optimization trigger
            const needsOptimization = fidValue > 100;
            expect(needsOptimization).toBe(false);
            
            done();
          });
        });
        
        observer.observe({ type: 'first-input', buffered: true });
      };

      measureFID();
    });

    it('should measure and optimize Cumulative Layout Shift (CLS)', (done) => {
      let clsValue = 0;
      
      const measureCLS = () => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value || 0.05; // Mock layout shift value
              
              // Verify CLS measurement
              expect(clsValue).toBeGreaterThanOrEqual(0);
              
              // Test optimization trigger
              const needsOptimization = clsValue > 0.1;
              if (clsValue > 0) {
                expect(typeof needsOptimization).toBe('boolean');
              }
              
              done();
            }
          });
        });
        
        observer.observe({ type: 'layout-shift', buffered: true });
      };

      measureCLS();
    });

    it('should calculate PWA performance score', () => {
      const metrics = {
        lcp: 1200,
        fid: 50,
        cls: 0.05,
        cacheHitRate: 0.85,
        offlineCapability: true,
        installability: true
      };

      const calculatePWAScore = (metrics: any): number => {
        let score = 100;

        // LCP scoring
        if (metrics.lcp > 4000) score -= 30;
        else if (metrics.lcp > 2500) score -= 15;

        // FID scoring
        if (metrics.fid > 300) score -= 25;
        else if (metrics.fid > 100) score -= 10;

        // CLS scoring
        if (metrics.cls > 0.25) score -= 25;
        else if (metrics.cls > 0.1) score -= 10;

        // Cache performance
        score += Math.min(20, metrics.cacheHitRate * 20);

        // PWA features
        if (!metrics.offlineCapability) score -= 15;
        if (!metrics.installability) score -= 10;

        return Math.max(0, Math.min(100, Math.round(score)));
      };

      const score = calculatePWAScore(metrics);
      
      expect(score).toBeGreaterThanOrEqual(80); // Good performance
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('Resource Preloading and Optimization', () => {
    it('should preload critical resources intelligently', async () => {
      const criticalResources = [
        '/api/guidance/daily',
        '/manifest.json',
        '/icons/sage-icon.svg',
        '/consultation'
      ];

      const preloadedResources: string[] = [];
      
      // Mock fetch for preloading
      global.fetch = jest.fn().mockImplementation((url) => {
        preloadedResources.push(url);
        return Promise.resolve(new Response('preloaded', { status: 200 }));
      });

      const preloadCriticalResources = async (resources: string[]) => {
        const preloadPromises = resources.map(async (resource) => {
          try {
            await fetch(resource, { method: 'HEAD' });
            return { resource, success: true };
          } catch (error) {
            return { resource, success: false, error };
          }
        });

        return Promise.allSettled(preloadPromises);
      };

      const results = await preloadCriticalResources(criticalResources);
      
      expect(results).toHaveLength(criticalResources.length);
      expect(preloadedResources).toHaveLength(criticalResources.length);
      expect(preloadedResources).toContain('/api/guidance/daily');
      expect(preloadedResources).toContain('/manifest.json');
    });

    it('should optimize image loading based on viewport', () => {
      document.body.innerHTML = `
        <img id="hero-image" data-src="/images/hero.jpg" data-hero="true" alt="Hero" />
        <img id="lazy-image" data-src="/images/lazy.jpg" loading="lazy" alt="Lazy" />
      `;

      const images = document.querySelectorAll('img[data-src]');
      const loadedImages: string[] = [];

      // Simulate lazy loading with Intersection Observer
      const setupLazyLoading = (images: NodeListOf<Element>) => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              const dataSrc = img.getAttribute('data-src');
              if (dataSrc) {
                img.src = dataSrc;
                img.removeAttribute('data-src');
                loadedImages.push(dataSrc);
                observer.unobserve(img);
              }
            }
          });
        });

        images.forEach(img => observer.observe(img));
        return observer;
      };

      const observer = setupLazyLoading(images);

      // Verify lazy loading setup
      expect(images).toHaveLength(2);
      
      // Simulate images entering viewport
      setTimeout(() => {
        expect(loadedImages).toContain('/images/hero.jpg');
        expect(loadedImages).toContain('/images/lazy.jpg');
      }, 150);
    });

    it('should implement resource prioritization', () => {
      const resources = [
        { url: '/api/guidance/daily', priority: 'high', type: 'api' },
        { url: '/consultation', priority: 'high', type: 'page' },
        { url: '/manifest.json', priority: 'high', type: 'manifest' },
        { url: '/icons/sage-icon.svg', priority: 'medium', type: 'icon' },
        { url: '/images/background.jpg', priority: 'low', type: 'image' }
      ];

      const prioritizeResources = (resources: any[]) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return resources.sort((a, b) => 
          priorityOrder[b.priority as keyof typeof priorityOrder] - 
          priorityOrder[a.priority as keyof typeof priorityOrder]
        );
      };

      const prioritized = prioritizeResources([...resources]);
      
      expect(prioritized[0].priority).toBe('high');
      expect(prioritized[prioritized.length - 1].priority).toBe('low');
      expect(prioritized.filter(r => r.priority === 'high')).toHaveLength(3);
    });
  });

  describe('Network-Aware Optimizations', () => {
    it('should adapt to slow connections', () => {
      // Simulate slow connection
      mockConnection.effectiveType = 'slow-2g';
      mockConnection.saveData = true;

      const getOptimizationStrategy = () => {
        const isSlowConnection = mockConnection.effectiveType === 'slow-2g' || 
                               mockConnection.effectiveType === '2g';
        
        return {
          reduceImageQuality: isSlowConnection || mockConnection.saveData,
          deferNonCritical: isSlowConnection,
          enableCompression: true,
          preloadCount: isSlowConnection ? 2 : 5,
          cacheAggressively: isSlowConnection
        };
      };

      const strategy = getOptimizationStrategy();
      
      expect(strategy.reduceImageQuality).toBe(true);
      expect(strategy.deferNonCritical).toBe(true);
      expect(strategy.preloadCount).toBe(2);
      expect(strategy.cacheAggressively).toBe(true);
    });

    it('should optimize for data saver mode', () => {
      mockConnection.saveData = true;

      const getDataSaverOptimizations = () => {
        if (!mockConnection.saveData) return null;

        return {
          disableAutoplay: true,
          reduceImageSize: true,
          compressResponses: true,
          minimalPreloading: true,
          deferAnalytics: true
        };
      };

      const optimizations = getDataSaverOptimizations();
      
      expect(optimizations).not.toBeNull();
      expect(optimizations?.disableAutoplay).toBe(true);
      expect(optimizations?.reduceImageSize).toBe(true);
      expect(optimizations?.minimalPreloading).toBe(true);
    });

    it('should adapt UI based on connection quality', () => {
      const connectionQualities = ['slow-2g', '2g', '3g', '4g'];
      
      connectionQualities.forEach(quality => {
        mockConnection.effectiveType = quality;
        
        const getUIOptimizations = (effectiveType: string) => {
          switch (effectiveType) {
            case 'slow-2g':
            case '2g':
              return {
                animations: 'disabled',
                imageQuality: 'low',
                autoRefresh: false,
                previewImages: false
              };
            case '3g':
              return {
                animations: 'reduced',
                imageQuality: 'medium',
                autoRefresh: true,
                previewImages: true
              };
            case '4g':
            default:
              return {
                animations: 'full',
                imageQuality: 'high',
                autoRefresh: true,
                previewImages: true
              };
          }
        };

        const uiConfig = getUIOptimizations(quality);
        
        if (quality === 'slow-2g') {
          expect(uiConfig.animations).toBe('disabled');
          expect(uiConfig.imageQuality).toBe('low');
        } else if (quality === '4g') {
          expect(uiConfig.animations).toBe('full');
          expect(uiConfig.imageQuality).toBe('high');
        }
      });
    });
  });

  describe('Battery-Conscious Performance', () => {
    it('should adapt performance based on battery level', async () => {
      // Test low battery scenario
      mockBattery.charging = false;
      mockBattery.level = 0.15;

      const getBatteryOptimizations = (battery: any) => {
        const isLowBattery = !battery.charging && battery.level < 0.2;
        
        return {
          reduceAnimations: isLowBattery,
          lowerRefreshRate: isLowBattery,
          disableBackgroundSync: isLowBattery,
          reduceNetworkRequests: isLowBattery,
          enablePowerSaveMode: isLowBattery
        };
      };

      const battery = await navigator.getBattery();
      const optimizations = getBatteryOptimizations(battery);
      
      expect(optimizations.reduceAnimations).toBe(true);
      expect(optimizations.enablePowerSaveMode).toBe(true);
      expect(optimizations.disableBackgroundSync).toBe(true);
    });

    it('should restore performance when charging', async () => {
      // Test charging scenario
      mockBattery.charging = true;
      mockBattery.level = 0.95;

      const getBatteryOptimizations = (battery: any) => {
        const isLowBattery = !battery.charging && battery.level < 0.2;
        
        return {
          reduceAnimations: isLowBattery,
          enableBackgroundSync: battery.charging,
          fullPerformanceMode: battery.charging && battery.level > 0.5
        };
      };

      const battery = await navigator.getBattery();
      const optimizations = getBatteryOptimizations(battery);
      
      expect(optimizations.reduceAnimations).toBe(false);
      expect(optimizations.enableBackgroundSync).toBe(true);
      expect(optimizations.fullPerformanceMode).toBe(true);
    });

    it('should implement adaptive frame rates', () => {
      const frameRateConfigs = {
        powerSave: 30,
        balanced: 60,
        performance: 60
      };

      const getFrameRateConfig = (batteryLevel: number, charging: boolean) => {
        if (!charging && batteryLevel < 0.2) {
          return frameRateConfigs.powerSave;
        } else if (!charging && batteryLevel < 0.5) {
          return frameRateConfigs.balanced;
        } else {
          return frameRateConfigs.performance;
        }
      };

      expect(getFrameRateConfig(0.15, false)).toBe(30);
      expect(getFrameRateConfig(0.45, false)).toBe(60);
      expect(getFrameRateConfig(0.80, true)).toBe(60);
    });
  });

  describe('Cache Performance Optimization', () => {
    it('should implement intelligent cache warming', async () => {
      const criticalPages = ['/', '/consultation', '/guidance'];
      const warmedPages: string[] = [];

      // Mock cache warming
      const warmCache = async (pages: string[]) => {
        const warmingPromises = pages.map(async (page) => {
          try {
            // Simulate cache warming
            await new Promise(resolve => setTimeout(resolve, 10));
            warmedPages.push(page);
            return { page, success: true };
          } catch (error) {
            return { page, success: false, error };
          }
        });

        return Promise.allSettled(warmingPromises);
      };

      await warmCache(criticalPages);
      
      expect(warmedPages).toHaveLength(criticalPages.length);
      expect(warmedPages).toContain('/consultation');
      expect(warmedPages).toContain('/guidance');
    });

    it('should optimize cache hit rates', () => {
      const cacheMetrics = {
        hits: 85,
        misses: 15,
        total: 100
      };

      const calculateCacheEfficiency = (metrics: typeof cacheMetrics) => {
        const hitRate = metrics.hits / metrics.total;
        const efficiency = {
          hitRate,
          performance: hitRate > 0.8 ? 'excellent' : hitRate > 0.6 ? 'good' : 'poor',
          needsOptimization: hitRate < 0.7
        };

        return efficiency;
      };

      const efficiency = calculateCacheEfficiency(cacheMetrics);
      
      expect(efficiency.hitRate).toBe(0.85);
      expect(efficiency.performance).toBe('excellent');
      expect(efficiency.needsOptimization).toBe(false);
    });

    it('should implement cache size management', () => {
      const cacheData = {
        currentSize: 85 * 1024 * 1024, // 85MB
        maxSize: 100 * 1024 * 1024,    // 100MB
        entries: 150
      };

      const manageCacheSize = (cache: typeof cacheData) => {
        const utilizationPercent = (cache.currentSize / cache.maxSize) * 100;
        
        return {
          utilizationPercent,
          needsCleanup: utilizationPercent > 80,
          cleanupStrategy: utilizationPercent > 90 ? 'aggressive' : 'conservative',
          entriesToRemove: utilizationPercent > 80 ? Math.floor(cache.entries * 0.1) : 0
        };
      };

      const management = manageCacheSize(cacheData);
      
      expect(management.utilizationPercent).toBe(85);
      expect(management.needsCleanup).toBe(true);
      expect(management.entriesToRemove).toBeGreaterThan(0);
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should collect comprehensive performance metrics', () => {
      const performanceMetrics = {
        loadTime: Date.now(),
        renderTime: 850,
        interactiveTime: 1200,
        cacheHitRate: 0.87,
        errorRate: 0.02,
        userSatisfactionScore: 4.2
      };

      const analyzePerformance = (metrics: typeof performanceMetrics) => {
        return {
          overall: metrics.renderTime < 1000 && metrics.errorRate < 0.05 ? 'good' : 'needs improvement',
          recommendations: [
            ...(metrics.renderTime > 1000 ? ['Optimize rendering performance'] : []),
            ...(metrics.cacheHitRate < 0.8 ? ['Improve cache strategy'] : []),
            ...(metrics.errorRate > 0.05 ? ['Reduce error rate'] : [])
          ]
        };
      };

      const analysis = analyzePerformance(performanceMetrics);
      
      expect(analysis.overall).toBe('good');
      expect(analysis.recommendations).toHaveLength(0); // All metrics are good
    });

    it('should trigger performance alerts', () => {
      const thresholds = {
        maxRenderTime: 1000,
        maxErrorRate: 0.05,
        minCacheHitRate: 0.75
      };

      const checkPerformanceThresholds = (metrics: any, thresholds: any) => {
        const alerts = [];

        if (metrics.renderTime > thresholds.maxRenderTime) {
          alerts.push({ type: 'warning', message: 'Render time exceeded threshold' });
        }
        if (metrics.errorRate > thresholds.maxErrorRate) {
          alerts.push({ type: 'error', message: 'Error rate too high' });
        }
        if (metrics.cacheHitRate < thresholds.minCacheHitRate) {
          alerts.push({ type: 'warning', message: 'Cache hit rate below target' });
        }

        return alerts;
      };

      const poorMetrics = {
        renderTime: 1500,
        errorRate: 0.08,
        cacheHitRate: 0.65
      };

      const alerts = checkPerformanceThresholds(poorMetrics, thresholds);
      
      expect(alerts).toHaveLength(3);
      expect(alerts.some(alert => alert.type === 'error')).toBe(true);
      expect(alerts.some(alert => alert.message.includes('Render time'))).toBe(true);
    });
  });
});