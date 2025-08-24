/**
 * Performance Analytics Library
 * Monitors FPS, load times, Core Web Vitals, and system performance
 */

export interface PerformanceMetric {
  type:
    | 'fps'
    | 'memory'
    | 'loadTime'
    | 'apiResponse'
    | 'LCP'
    | 'FID'
    | 'CLS'
    | 'customMetric';
  value: number;
  timestamp: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface PerformanceThresholds {
  fps: {
    excellent: number; // >= 60
    good: number; // >= 30
    poor: number; // < 30
  };
  loadTime: {
    excellent: number; // <= 1000ms
    good: number; // <= 3000ms
    poor: number; // > 3000ms
  };
  apiResponse: {
    excellent: number; // <= 200ms
    good: number; // <= 1000ms
    poor: number; // > 1000ms
  };
  memory: {
    excellent: number; // <= 50%
    good: number; // <= 80%
    poor: number; // > 80%
  };
  lcp: {
    excellent: number; // <= 2.5s
    good: number; // <= 4s
    poor: number; // > 4s
  };
  fid: {
    excellent: number; // <= 100ms
    good: number; // <= 300ms
    poor: number; // > 300ms
  };
  cls: {
    excellent: number; // <= 0.1
    good: number; // <= 0.25
    poor: number; // > 0.25
  };
}

export const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  fps: { excellent: 60, good: 30, poor: 30 },
  loadTime: { excellent: 1000, good: 3000, poor: 3000 },
  apiResponse: { excellent: 200, good: 1000, poor: 1000 },
  memory: { excellent: 50, good: 80, poor: 80 },
  lcp: { excellent: 2500, good: 4000, poor: 4000 },
  fid: { excellent: 100, good: 300, poor: 300 },
  cls: { excellent: 0.1, good: 0.25, poor: 0.25 },
};

class PerformanceAnalytics {
  private metrics: PerformanceMetric[] = [];
  private thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS;
  private isMonitoring = false;
  private fpsFrameCount = 0;
  private fpsLastTime = 0;
  private fpsAnimationFrame?: number;
  private memoryInterval?: NodeJS.Timeout;
  private observers: PerformanceObserver[] = [];

  constructor(customThresholds?: Partial<PerformanceThresholds>) {
    if (customThresholds) {
      this.thresholds = { ...DEFAULT_THRESHOLDS, ...customThresholds };
    }
  }

  /**
   * Start monitoring performance metrics
   */
  startMonitoring(): void {
    if (this.isMonitoring || typeof window === 'undefined') return;

    this.isMonitoring = true;

    // Start FPS monitoring
    this.startFPSMonitoring();

    // Start memory monitoring (every 5 seconds)
    this.startMemoryMonitoring();

    // Monitor Core Web Vitals
    this.startWebVitalsMonitoring();

    // Monitor navigation timing
    this.recordNavigationTiming();

    console.log('Performance monitoring started');
  }

  /**
   * Stop monitoring performance metrics
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;

    // Stop FPS monitoring
    if (this.fpsAnimationFrame) {
      cancelAnimationFrame(this.fpsAnimationFrame);
      this.fpsAnimationFrame = undefined;
    }

    // Stop memory monitoring
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
      this.memoryInterval = undefined;
    }

    // Disconnect performance observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];

    console.log('Performance monitoring stopped');
  }

  /**
   * Record a custom performance metric
   */
  recordMetric(
    type: PerformanceMetric['type'],
    value: number,
    metadata?: Record<string, any>
  ): void {
    const metric: PerformanceMetric = {
      type,
      value,
      timestamp: new Date().toISOString(),
      userAgent:
        typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      metadata,
    };

    this.metrics.push(metric);

    // Log significant metrics in development
    if (process.env.NODE_ENV === 'development') {
      // Only log in development for critical metrics or errors
      if (
        process.env.NODE_ENV === 'development' &&
        metric.type === 'fps' &&
        metric.value < 30
      ) {
        console.log('Performance Analytics - Low FPS:', metric);
      }
    }

    // Keep only recent metrics (last 1000)
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  /**
   * Start FPS monitoring
   */
  private startFPSMonitoring(): void {
    if (typeof window === 'undefined') return;

    const measureFPS = (currentTime: number) => {
      if (this.fpsLastTime === 0) {
        this.fpsLastTime = currentTime;
        this.fpsFrameCount = 0;
      }

      this.fpsFrameCount++;

      // Measure FPS every second
      if (currentTime - this.fpsLastTime >= 1000) {
        const fps = Math.round(
          (this.fpsFrameCount * 1000) / (currentTime - this.fpsLastTime)
        );

        this.recordMetric('fps', fps, {
          measurement_duration: currentTime - this.fpsLastTime,
          frame_count: this.fpsFrameCount,
        });

        this.fpsFrameCount = 0;
        this.fpsLastTime = currentTime;
      }

      if (this.isMonitoring) {
        this.fpsAnimationFrame = requestAnimationFrame(measureFPS);
      }
    };

    this.fpsAnimationFrame = requestAnimationFrame(measureFPS);
  }

  /**
   * Start memory monitoring
   */
  private startMemoryMonitoring(): void {
    if (typeof window === 'undefined' || !(performance as any).memory) return;

    this.memoryInterval = setInterval(() => {
      const memory = (performance as any).memory;
      if (memory) {
        const usedPercent =
          (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

        this.recordMetric('memory', usedPercent, {
          used_mb: Math.round(memory.usedJSHeapSize / 1048576),
          total_mb: Math.round(memory.totalJSHeapSize / 1048576),
          limit_mb: Math.round(memory.jsHeapSizeLimit / 1048576),
        });
      }
    }, 5000);
  }

  /**
   * Monitor Core Web Vitals
   */
  private startWebVitalsMonitoring(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window))
      return;

    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          startTime: number;
          element?: Element;
        };

        if (lastEntry) {
          this.recordMetric('LCP', lastEntry.startTime, {
            element: lastEntry.element?.tagName,
          });
        }
      });

      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP monitoring not supported:', e);
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordMetric(
            'FID',
            (entry as any).processingStart - entry.startTime,
            {
              input_type: (entry as any).name,
            }
          );
        });
      });

      fidObserver.observe({ type: 'first-input', buffered: true });
      this.observers.push(fidObserver);
    } catch (e) {
      console.warn('FID monitoring not supported:', e);
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.recordMetric('CLS', clsValue, {
              individual_shift: (entry as any).value,
              cumulative_shift: clsValue,
            });
          }
        });
      });

      clsObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(clsObserver);
    } catch (e) {
      console.warn('CLS monitoring not supported:', e);
    }
  }

  /**
   * Record navigation timing metrics
   */
  private recordNavigationTiming(): void {
    if (typeof window === 'undefined') return;

    // Wait for page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const nav = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;
        if (nav) {
          // DNS lookup time
          this.recordMetric(
            'loadTime',
            nav.domainLookupEnd - nav.domainLookupStart,
            {
              type: 'dns_lookup',
            }
          );

          // TCP connection time
          this.recordMetric('loadTime', nav.connectEnd - nav.connectStart, {
            type: 'tcp_connection',
          });

          // Time to first byte
          this.recordMetric('loadTime', nav.responseStart - nav.requestStart, {
            type: 'time_to_first_byte',
          });

          // DOM content loaded
          this.recordMetric(
            'loadTime',
            nav.domContentLoadedEventEnd - nav.fetchStart,
            {
              type: 'dom_content_loaded',
            }
          );

          // Full page load
          this.recordMetric('loadTime', nav.loadEventEnd - nav.fetchStart, {
            type: 'full_page_load',
          });
        }
      }, 100);
    });
  }

  /**
   * Record API response time
   */
  recordAPIResponse(
    url: string,
    method: string,
    responseTime: number,
    statusCode?: number
  ): void {
    this.recordMetric('apiResponse', responseTime, {
      url,
      method,
      status_code: statusCode,
    });
  }

  /**
   * Get performance metrics
   */
  getMetrics(type?: PerformanceMetric['type']): PerformanceMetric[] {
    if (type) {
      return this.metrics.filter(metric => metric.type === type);
    }
    return [...this.metrics];
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    fps: {
      current: number;
      average: number;
      rating: 'excellent' | 'good' | 'poor';
    };
    memory: {
      current: number;
      average: number;
      rating: 'excellent' | 'good' | 'poor';
    };
    loadTimes: { average: number; rating: 'excellent' | 'good' | 'poor' };
    webVitals: {
      lcp: { value: number; rating: 'excellent' | 'good' | 'poor' } | null;
      fid: { value: number; rating: 'excellent' | 'good' | 'poor' } | null;
      cls: { value: number; rating: 'excellent' | 'good' | 'poor' } | null;
    };
  } {
    const fpsMetrics = this.getMetrics('fps');
    const memoryMetrics = this.getMetrics('memory');
    const loadTimeMetrics = this.getMetrics('loadTime');
    const lcpMetrics = this.getMetrics('LCP');
    const fidMetrics = this.getMetrics('FID');
    const clsMetrics = this.getMetrics('CLS');

    const calculateRating = (value: number, thresholds: any) => {
      if (value <= thresholds.excellent) return 'excellent';
      if (value <= thresholds.good) return 'good';
      return 'poor';
    };

    const average = (values: number[]) =>
      values.length
        ? values.reduce((sum, val) => sum + val, 0) / values.length
        : 0;

    return {
      fps: {
        current: fpsMetrics[fpsMetrics.length - 1]?.value || 0,
        average: Math.round(average(fpsMetrics.map(m => m.value))),
        rating: calculateRating(
          fpsMetrics[fpsMetrics.length - 1]?.value || 0,
          this.thresholds.fps
        ),
      },
      memory: {
        current: Math.round(
          memoryMetrics[memoryMetrics.length - 1]?.value || 0
        ),
        average: Math.round(average(memoryMetrics.map(m => m.value))),
        rating: calculateRating(
          memoryMetrics[memoryMetrics.length - 1]?.value || 0,
          this.thresholds.memory
        ),
      },
      loadTimes: {
        average: Math.round(average(loadTimeMetrics.map(m => m.value))),
        rating: calculateRating(
          average(loadTimeMetrics.map(m => m.value)),
          this.thresholds.loadTime
        ),
      },
      webVitals: {
        lcp: lcpMetrics.length
          ? {
              value: Math.round(lcpMetrics[lcpMetrics.length - 1].value),
              rating: calculateRating(
                lcpMetrics[lcpMetrics.length - 1].value,
                this.thresholds.lcp
              ),
            }
          : null,
        fid: fidMetrics.length
          ? {
              value: Math.round(fidMetrics[fidMetrics.length - 1].value),
              rating: calculateRating(
                fidMetrics[fidMetrics.length - 1].value,
                this.thresholds.fid
              ),
            }
          : null,
        cls: clsMetrics.length
          ? {
              value:
                Math.round(clsMetrics[clsMetrics.length - 1].value * 1000) /
                1000,
              rating: calculateRating(
                clsMetrics[clsMetrics.length - 1].value,
                this.thresholds.cls
              ),
            }
          : null,
      },
    };
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): string {
    return JSON.stringify(
      {
        metrics: this.metrics,
        thresholds: this.thresholds,
        summary: this.getPerformanceSummary(),
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }
}

// Global instance
let performanceAnalytics: PerformanceAnalytics;

export function getPerformanceAnalytics(
  customThresholds?: Partial<PerformanceThresholds>
): PerformanceAnalytics {
  if (!performanceAnalytics) {
    performanceAnalytics = new PerformanceAnalytics(customThresholds);
  }
  return performanceAnalytics;
}
