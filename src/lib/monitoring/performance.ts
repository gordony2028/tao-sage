/**
 * Performance Monitoring System
 * Real-time performance metrics tracking and analysis
 */

export interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  interactionLatency: number;
  memoryUsage: number;
  bundleSize: number;
  timestamp: string;
}

export interface WebVitalsMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private webVitals: Partial<WebVitalsMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private apiStartTimes = new Map<string, number>();

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Initialize Web Vitals monitoring
    this.initializeWebVitals();

    // Initialize navigation timing
    this.initializeNavigationTiming();

    // Initialize resource timing
    this.initializeResourceTiming();

    // Initialize memory monitoring
    this.initializeMemoryMonitoring();
  }

  private initializeWebVitals() {
    // LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.webVitals.lcp = lastEntry.startTime;
        this.reportWebVital('LCP', lastEntry.startTime);
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          this.webVitals.fid = entry.processingStart - entry.startTime;
          this.reportWebVital('FID', entry.processingStart - entry.startTime);
        });
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.webVitals.cls = clsValue;
        this.reportWebVital('CLS', clsValue);
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }
  }

  private initializeNavigationTiming() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType(
            'navigation'
          )[0] as PerformanceNavigationTiming;
          if (navigation) {
            this.webVitals.fcp =
              navigation.responseStart - navigation.requestStart;
            this.webVitals.ttfb =
              navigation.responseStart - navigation.requestStart;

            const pageLoadTime =
              navigation.loadEventEnd - navigation.navigationStart;
            this.reportMetric('pageLoad', pageLoadTime);
          }
        }, 0);
      });
    }
  }

  private initializeResourceTiming() {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if (entry.name.includes('/api/')) {
            const responseTime = entry.responseEnd - entry.requestStart;
            this.reportMetric('apiResponse', responseTime);
          }
        });
      });

      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (e) {
        console.warn('Resource observer not supported');
      }
    }
  }

  private initializeMemoryMonitoring() {
    if (
      typeof window !== 'undefined' &&
      'performance' in window &&
      (performance as any).memory
    ) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const memoryUsage =
          (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
        this.reportMetric('memory', memoryUsage);
      }, 5000); // Check every 5 seconds
    }
  }

  // Track API call start
  trackAPIStart(endpoint: string): void {
    this.apiStartTimes.set(endpoint, performance.now());
  }

  // Track API call end
  trackAPIEnd(endpoint: string): number {
    const startTime = this.apiStartTimes.get(endpoint);
    if (startTime) {
      const responseTime = performance.now() - startTime;
      this.apiStartTimes.delete(endpoint);
      this.reportMetric('apiResponse', responseTime);
      return responseTime;
    }
    return 0;
  }

  // Track user interactions
  trackInteraction(interactionType: string): void {
    const startTime = performance.now();

    // Use requestAnimationFrame to measure interaction latency
    requestAnimationFrame(() => {
      const latency = performance.now() - startTime;
      this.reportMetric('interaction', latency, { type: interactionType });
    });
  }

  private reportMetric(type: string, value: number, metadata?: any): void {
    const metric = {
      type,
      value,
      timestamp: new Date().toISOString(),
      metadata,
    };

    // Store locally for dashboard
    if (typeof window !== 'undefined' && window.localStorage) {
      const existingMetrics = JSON.parse(
        localStorage.getItem('performance_metrics') || '[]'
      );
      existingMetrics.push(metric);

      // Keep only last 100 metrics
      if (existingMetrics.length > 100) {
        existingMetrics.shift();
      }

      localStorage.setItem(
        'performance_metrics',
        JSON.stringify(existingMetrics)
      );
    }

    // Send to analytics (optional)
    this.sendToAnalytics(metric);
  }

  private reportWebVital(name: string, value: number): void {
    const vital = {
      name,
      value,
      timestamp: new Date().toISOString(),
    };

    // Store web vital
    if (typeof window !== 'undefined' && window.localStorage) {
      const existingVitals = JSON.parse(
        localStorage.getItem('web_vitals') || '[]'
      );
      existingVitals.push(vital);

      // Keep only last 50 vitals
      if (existingVitals.length > 50) {
        existingVitals.shift();
      }

      localStorage.setItem('web_vitals', JSON.stringify(existingVitals));
    }

    // Send to analytics
    this.sendToAnalytics(vital);
  }

  private async sendToAnalytics(data: any): Promise<void> {
    try {
      // Send to internal analytics endpoint
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.warn('Failed to send performance metric:', error);
    }
  }

  // Get current metrics
  getCurrentMetrics(): PerformanceMetrics | null {
    if (typeof window === 'undefined') return null;

    const memory = (performance as any).memory;
    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;

    return {
      pageLoadTime: navigation
        ? navigation.loadEventEnd - navigation.navigationStart
        : 0,
      apiResponseTime: this.getAverageAPIResponseTime(),
      interactionLatency: this.getAverageInteractionLatency(),
      memoryUsage: memory
        ? (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
        : 0,
      bundleSize: this.getBundleSize(),
      timestamp: new Date().toISOString(),
    };
  }

  // Get Web Vitals
  getWebVitals(): WebVitalsMetrics | null {
    if (typeof window === 'undefined') return null;

    return {
      lcp: this.webVitals.lcp || 0,
      fid: this.webVitals.fid || 0,
      cls: this.webVitals.cls || 0,
      fcp: this.webVitals.fcp || 0,
      ttfb: this.webVitals.ttfb || 0,
    };
  }

  private getAverageAPIResponseTime(): number {
    if (typeof window === 'undefined') return 0;

    const metrics = JSON.parse(
      localStorage.getItem('performance_metrics') || '[]'
    );
    const apiMetrics = metrics.filter((m: any) => m.type === 'apiResponse');

    if (apiMetrics.length === 0) return 0;

    const sum = apiMetrics.reduce((acc: number, m: any) => acc + m.value, 0);
    return sum / apiMetrics.length;
  }

  private getAverageInteractionLatency(): number {
    if (typeof window === 'undefined') return 0;

    const metrics = JSON.parse(
      localStorage.getItem('performance_metrics') || '[]'
    );
    const interactionMetrics = metrics.filter(
      (m: any) => m.type === 'interaction'
    );

    if (interactionMetrics.length === 0) return 0;

    const sum = interactionMetrics.reduce(
      (acc: number, m: any) => acc + m.value,
      0
    );
    return sum / interactionMetrics.length;
  }

  private getBundleSize(): number {
    if (typeof window === 'undefined') return 0;

    const resources = performance.getEntriesByType('resource');
    const jsResources = resources.filter(
      resource =>
        resource.name.includes('.js') && resource.name.includes('/_next/')
    );

    return jsResources.reduce(
      (acc, resource) => acc + (resource as any).transferSize || 0,
      0
    );
  }

  // Performance thresholds
  getPerformanceGrade(): {
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    score: number;
    issues: string[];
  } {
    const metrics = this.getCurrentMetrics();
    const webVitals = this.getWebVitals();

    if (!metrics || !webVitals) {
      return {
        grade: 'F',
        score: 0,
        issues: ['Performance monitoring not available'],
      };
    }

    let score = 100;
    const issues: string[] = [];

    // Page Load Time (target: <3s)
    if (metrics.pageLoadTime > 3000) {
      score -= 20;
      issues.push(
        `Page load time: ${(metrics.pageLoadTime / 1000).toFixed(
          1
        )}s (target: <3s)`
      );
    }

    // LCP (target: <2.5s)
    if (webVitals.lcp > 2500) {
      score -= 15;
      issues.push(`LCP: ${(webVitals.lcp / 1000).toFixed(1)}s (target: <2.5s)`);
    }

    // FID (target: <100ms)
    if (webVitals.fid > 100) {
      score -= 15;
      issues.push(`FID: ${webVitals.fid.toFixed(0)}ms (target: <100ms)`);
    }

    // CLS (target: <0.1)
    if (webVitals.cls > 0.1) {
      score -= 15;
      issues.push(`CLS: ${webVitals.cls.toFixed(3)} (target: <0.1)`);
    }

    // API Response Time (target: <200ms)
    if (metrics.apiResponseTime > 200) {
      score -= 10;
      issues.push(
        `API response: ${metrics.apiResponseTime.toFixed(0)}ms (target: <200ms)`
      );
    }

    // Memory Usage (target: <70%)
    if (metrics.memoryUsage > 70) {
      score -= 10;
      issues.push(
        `Memory usage: ${metrics.memoryUsage.toFixed(1)}% (target: <70%)`
      );
    }

    // Bundle Size (target: <500KB)
    if (metrics.bundleSize > 500000) {
      score -= 10;
      issues.push(
        `Bundle size: ${(metrics.bundleSize / 1000).toFixed(
          0
        )}KB (target: <500KB)`
      );
    }

    // Determine grade
    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';
    else grade = 'F';

    return { grade, score: Math.max(0, score), issues };
  }

  // Cleanup observers
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for React components
export const usePerformanceMonitoring = () => {
  return {
    trackAPIStart: (endpoint: string) =>
      performanceMonitor.trackAPIStart(endpoint),
    trackAPIEnd: (endpoint: string) => performanceMonitor.trackAPIEnd(endpoint),
    trackInteraction: (type: string) =>
      performanceMonitor.trackInteraction(type),
    getCurrentMetrics: () => performanceMonitor.getCurrentMetrics(),
    getWebVitals: () => performanceMonitor.getWebVitals(),
    getPerformanceGrade: () => performanceMonitor.getPerformanceGrade(),
  };
};
