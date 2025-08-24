/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import {
  getPerformanceAnalytics,
  PerformanceMetric,
  PerformanceThresholds,
} from '@/lib/analytics/performance';
import { useUserPreferences } from './useUserPreferences';

export interface PerformanceAnalyticsState {
  summary: ReturnType<
    ReturnType<typeof getPerformanceAnalytics>['getPerformanceSummary']
  >;
  metrics: PerformanceMetric[];
  isMonitoring: boolean;
  loading: boolean;
}

export interface UsePerformanceAnalyticsReturn
  extends PerformanceAnalyticsState {
  startMonitoring: () => void;
  stopMonitoring: () => void;
  recordCustomMetric: (
    type: PerformanceMetric['type'],
    value: number,
    metadata?: Record<string, any>
  ) => void;
  recordAPIResponse: (
    url: string,
    method: string,
    responseTime: number,
    statusCode?: number
  ) => void;
  exportMetrics: () => string;
  clearMetrics: () => void;
  refreshSummary: () => void;
}

export function usePerformanceAnalytics(): UsePerformanceAnalyticsReturn {
  const { preferences } = useUserPreferences();
  const [state, setState] = useState<PerformanceAnalyticsState>({
    summary: {
      fps: { current: 0, average: 0, rating: 'good' },
      memory: { current: 0, average: 0, rating: 'good' },
      loadTimes: { average: 0, rating: 'good' },
      webVitals: { lcp: null, fid: null, cls: null },
    },
    metrics: [],
    isMonitoring: false,
    loading: true,
  });

  const analytics = getPerformanceAnalytics();

  // Initialize monitoring based on user preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Auto-start monitoring based on performance preferences
    const shouldMonitor =
      preferences.performance.performanceMode !== 'eco' ||
      preferences.performance.enableBatteryOptimization === false;

    if (shouldMonitor) {
      startMonitoring();
    }

    // Update summary every 10 seconds
    const interval = setInterval(() => {
      refreshSummary();
    }, 10000);

    setState(prev => ({ ...prev, loading: false }));

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences.performance]);

  const startMonitoring = useCallback(() => {
    if (state.isMonitoring) return;

    analytics.startMonitoring();
    setState(prev => ({ ...prev, isMonitoring: true }));
  }, [state.isMonitoring]);

  const stopMonitoring = useCallback(() => {
    if (!state.isMonitoring) return;

    analytics.stopMonitoring();
    setState(prev => ({ ...prev, isMonitoring: false }));
  }, [state.isMonitoring]);

  const recordCustomMetric = useCallback(
    (
      type: PerformanceMetric['type'],
      value: number,
      metadata?: Record<string, any>
    ) => {
      analytics.recordMetric(type, value, metadata);
      refreshSummary();
    },
    []
  );

  const recordAPIResponse = useCallback(
    (
      url: string,
      method: string,
      responseTime: number,
      statusCode?: number
    ) => {
      analytics.recordAPIResponse(url, method, responseTime, statusCode);
      refreshSummary();
    },
    []
  );

  const exportMetrics = useCallback(() => {
    return analytics.exportMetrics();
  }, []);

  const clearMetrics = useCallback(() => {
    analytics.clearMetrics();
    refreshSummary();
  }, []);

  const refreshSummary = useCallback(() => {
    const summary = analytics.getPerformanceSummary();
    const metrics = analytics.getMetrics();

    setState(prev => ({
      ...prev,
      summary,
      metrics: metrics.slice(-100), // Keep only recent metrics for UI
    }));
  }, []);

  return {
    ...state,
    startMonitoring,
    stopMonitoring,
    recordCustomMetric,
    recordAPIResponse,
    exportMetrics,
    clearMetrics,
    refreshSummary,
  };
}
