'use client';

import { useEffect } from 'react';
import { getPerformanceAnalytics } from '@/lib/analytics/performance';

/**
 * Performance monitoring component that automatically starts analytics
 * and integrates with the global performance monitoring system
 */
export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const analytics = getPerformanceAnalytics();

    // Auto-start monitoring in development or when explicitly enabled
    if (process.env.NODE_ENV === 'development') {
      analytics.startMonitoring();
    }

    // Listen for preference changes to enable/disable monitoring
    const handlePreferencesChange = (event: CustomEvent) => {
      const preferences = event.detail;
      if (
        preferences?.performance?.performanceMode === 'eco' &&
        preferences?.performance?.enableBatteryOptimization
      ) {
        analytics.stopMonitoring();
      } else {
        analytics.startMonitoring();
      }
    };

    window.addEventListener(
      'preferencesChanged',
      handlePreferencesChange as EventListener
    );

    // Enhanced API monitoring by intercepting fetch calls
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url =
        typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;

      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const responseTime = endTime - startTime;

        // Record API response time
        analytics.recordAPIResponse(
          url,
          args[1]?.method || 'GET',
          responseTime,
          response.status
        );

        // Log API response time in development
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `${url.split('?')[0]} API response time: ${responseTime.toFixed(
              2
            )}ms`
          );
        }

        return response;
      } catch (error) {
        const endTime = performance.now();
        const responseTime = endTime - startTime;

        // Record failed API call
        analytics.recordAPIResponse(
          url,
          args[1]?.method || 'GET',
          responseTime,
          0
        );

        throw error;
      }
    };

    return () => {
      window.removeEventListener(
        'preferencesChanged',
        handlePreferencesChange as EventListener
      );
      window.fetch = originalFetch;
    };
  }, []);

  // This component doesn't render anything
  return null;
}
