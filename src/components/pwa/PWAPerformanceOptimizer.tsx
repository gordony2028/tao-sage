'use client';

/**
 * PWA Performance Optimizer
 * 
 * Enhances performance specifically for PWA use cases:
 * - Critical resource preloading
 * - Service worker coordination
 * - Cache management
 * - Core Web Vitals optimization
 * - Battery and network-aware optimizations
 */

import { useEffect, useCallback, useRef } from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

interface PWAPerformanceOptimizerProps {
  /** Whether to enable aggressive optimization (for slower devices) */
  aggressiveMode?: boolean;
  /** Callback for performance metrics */
  onMetricsUpdate?: (metrics: PWAMetrics) => void;
}

interface PWAMetrics {
  cacheHitRate: number;
  averageLoadTime: number;
  offlineCapability: boolean;
  installability: boolean;
  coreBitals: {
    lcp: number | null;
    fid: number | null;
    cls: number | null;
  };
}

export default function PWAPerformanceOptimizer({
  aggressiveMode = false,
  onMetricsUpdate,
}: PWAPerformanceOptimizerProps) {
  const { isOffline, getConnectionInfo } = useOfflineStatus();
  const metricsRef = useRef<PWAMetrics>({
    cacheHitRate: 0,
    averageLoadTime: 0,
    offlineCapability: true,
    installability: false,
    coreBitals: {
      lcp: null,
      fid: null,
      cls: null,
    },
  });

  // Preload critical resources
  const preloadCriticalResources = useCallback(() => {
    const criticalResources = [
      '/api/guidance/daily',
      '/manifest.json',
      '/icons/sage-icon.svg',
    ];

    criticalResources.forEach(resource => {
      // Use fetch to warm up the cache
      fetch(resource, { method: 'HEAD' }).catch(() => {
        // Ignore errors - just trying to warm cache
      });
    });
  }, []);

  // Optimize images based on network conditions
  const optimizeImageLoading = useCallback(() => {
    if (typeof window === 'undefined') return;

    const connection = getConnectionInfo();
    const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                           connection.effectiveType === '2g';

    if (isSlowConnection || aggressiveMode) {
      // Defer non-critical images
      const images = document.querySelectorAll('img[data-defer]');
      images.forEach(img => {
        if (img instanceof HTMLImageElement) {
          img.loading = 'lazy';
        }
      });

      // Reduce image quality for slow connections
      document.documentElement.classList.add('low-bandwidth');
    }
  }, [aggressiveMode, getConnectionInfo]);

  // Optimize for LCP issues
  const optimizeForLCP = useCallback(() => {
    // Preload hero images
    const heroImages = document.querySelectorAll('img[data-hero]');
    heroImages.forEach(img => {
      if (img instanceof HTMLImageElement && img.src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src;
        document.head.appendChild(link);
      }
    });

    // Remove non-critical CSS
    if (aggressiveMode) {
      const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][data-critical="false"]');
      nonCriticalCSS.forEach(link => {
        (link as HTMLLinkElement).media = 'print';
        (link as HTMLLinkElement).onload = function() {
          (this as HTMLLinkElement).media = 'all';
        };
      });
    }
  }, [aggressiveMode]);

  // Optimize for FID issues
  const optimizeForFID = useCallback(() => {
    // Defer non-critical JavaScript
    if (aggressiveMode) {
      requestIdleCallback(() => {
        // Load non-critical scripts
        const deferredScripts = document.querySelectorAll('script[data-defer]');
        deferredScripts.forEach(script => {
          const newScript = document.createElement('script');
          newScript.src = (script as HTMLScriptElement).src;
          newScript.async = true;
          document.head.appendChild(newScript);
        });
      });
    }

    // Break up long tasks
    if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
      // Use modern scheduler API when available
      console.log('Using modern task scheduler for FID optimization');
    }
  }, [aggressiveMode]);

  // Optimize for CLS issues
  const optimizeForCLS = useCallback(() => {
    // Set dimensions for images without size attributes
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
      if (img instanceof HTMLImageElement) {
        // Set aspect ratio to prevent layout shift
        img.style.aspectRatio = '16 / 9';
        img.style.objectFit = 'cover';
      }
    });

    // Reserve space for dynamic content
    const dynamicContents = document.querySelectorAll('[data-dynamic]');
    dynamicContents.forEach(element => {
      if (element instanceof HTMLElement && !element.style.minHeight) {
        element.style.minHeight = '200px';
      }
    });
  }, []);

  // Monitor and optimize Core Web Vitals
  const monitorCoreWebVitals = useCallback(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          metricsRef.current.coreBitals.lcp = lastEntry.startTime;
          onMetricsUpdate?.(metricsRef.current);

          // Optimize if LCP is poor
          if (lastEntry.startTime > 2500) {
            optimizeForLCP();
          }
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.warn('LCP monitoring not supported');
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          const fid = (entry as any).processingStart - entry.startTime;
          metricsRef.current.coreBitals.fid = fid;
          onMetricsUpdate?.(metricsRef.current);

          // Optimize if FID is poor
          if (fid > 100) {
            optimizeForFID();
          }
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.warn('FID monitoring not supported');
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            metricsRef.current.coreBitals.cls = clsValue;
            onMetricsUpdate?.(metricsRef.current);

            // Optimize if CLS is poor
            if (clsValue > 0.1) {
              optimizeForCLS();
            }
          }
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn('CLS monitoring not supported');
    }
  }, [onMetricsUpdate]);

  // Cache management and optimization
  const optimizeCaching = useCallback(async () => {
    if (!('caches' in window)) return;

    try {
      const cacheNames = await caches.keys();
      const totalCacheSize = await getCacheSize(cacheNames);
      
      // If cache is getting large (>100MB), clean up old entries
      if (totalCacheSize > 100 * 1024 * 1024) {
        await cleanupOldCaches();
      }

      // Pre-cache critical resources
      const cache = await caches.open('sage-critical-v1');
      const criticalUrls = [
        '/',
        '/consultation',
        '/guidance',
        '/manifest.json',
        '/icons/sage-icon.svg',
      ];

      await cache.addAll(criticalUrls.filter(url => !cache.match(url)));
    } catch (error) {
      console.warn('Cache optimization failed:', error);
    }
  }, []);

  // Get total cache size
  const getCacheSize = async (cacheNames: string[]): Promise<number> => {
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    return totalSize;
  };

  // Clean up old caches
  const cleanupOldCaches = async () => {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => name.includes('v0') || name.includes('old'));
    
    await Promise.all(
      oldCaches.map(cacheName => caches.delete(cacheName))
    );
  };

  // Battery-aware optimizations
  const applyBatteryOptimizations = useCallback(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        if (battery.charging === false && battery.level < 0.2) {
          // Low battery - apply aggressive optimizations
          document.documentElement.classList.add('low-battery');
          
          // Reduce animation frame rate
          const style = document.createElement('style');
          style.textContent = `
            *, *::before, *::after {
              animation-duration: 0.1s !important;
              transition-duration: 0.1s !important;
            }
          `;
          document.head.appendChild(style);
        }
      });
    }
  }, []);

  // Initialize optimizations
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initOptimizations = async () => {
      // Preload critical resources
      preloadCriticalResources();
      
      // Start monitoring
      monitorCoreWebVitals();
      
      // Optimize based on connection
      optimizeImageLoading();
      
      // Optimize caching
      await optimizeCaching();
      
      // Apply battery optimizations
      applyBatteryOptimizations();

      // Mark as installable if conditions are met
      metricsRef.current.installability = 'serviceWorker' in navigator;
      metricsRef.current.offlineCapability = !isOffline || localStorage.getItem('sage-offline-consultations') !== null;
    };

    // Delay to avoid blocking initial render
    requestIdleCallback(initOptimizations);
  }, [
    preloadCriticalResources,
    monitorCoreWebVitals,
    optimizeImageLoading,
    optimizeCaching,
    applyBatteryOptimizations,
    optimizeForLCP,
    optimizeForFID,
    optimizeForCLS,
    isOffline,
  ]);

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      onMetricsUpdate?.(metricsRef.current);
    }, 10000);

    return () => clearInterval(interval);
  }, [onMetricsUpdate]);

  // This component doesn't render anything - it's purely for side effects
  return null;
}

// Utility function to check if running in PWA mode
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone ||
         document.referrer.includes('android-app://');
}

// Utility to get PWA performance score (0-100)
export function getPWAScore(metrics: PWAMetrics): number {
  let score = 100;

  // LCP scoring
  if (metrics.coreBitals.lcp !== null) {
    if (metrics.coreBitals.lcp > 4000) score -= 30;
    else if (metrics.coreBitals.lcp > 2500) score -= 15;
  }

  // FID scoring
  if (metrics.coreBitals.fid !== null) {
    if (metrics.coreBitals.fid > 300) score -= 25;
    else if (metrics.coreBitals.fid > 100) score -= 10;
  }

  // CLS scoring
  if (metrics.coreBitals.cls !== null) {
    if (metrics.coreBitals.cls > 0.25) score -= 25;
    else if (metrics.coreBitals.cls > 0.1) score -= 10;
  }

  // Cache hit rate
  score += Math.min(20, metrics.cacheHitRate * 20);

  // Offline capability
  if (!metrics.offlineCapability) score -= 15;

  // Installability
  if (!metrics.installability) score -= 10;

  return Math.max(0, Math.min(100, Math.round(score)));
}