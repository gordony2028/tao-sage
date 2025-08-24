'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { usePerformanceMonitoring } from '@/lib/monitoring/performance';
import type {
  PerformanceMetrics,
  WebVitalsMetrics,
} from '@/lib/monitoring/performance';

interface PerformanceGrade {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  score: number;
  issues: string[];
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [webVitals, setWebVitals] = useState<WebVitalsMetrics | null>(null);
  const [performanceGrade, setPerformanceGrade] =
    useState<PerformanceGrade | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const {
    getCurrentMetrics,
    getWebVitals,
    getPerformanceGrade,
    trackInteraction,
  } = usePerformanceMonitoring();

  useEffect(() => {
    // Initial load
    updateMetrics();

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateMetrics = () => {
    const currentMetrics = getCurrentMetrics();
    const currentWebVitals = getWebVitals();
    const currentGrade = getPerformanceGrade();

    setMetrics(currentMetrics);
    setWebVitals(currentWebVitals);
    setPerformanceGrade(currentGrade);
  };

  const handleToggleVisibility = () => {
    trackInteraction('performance-dashboard-toggle');
    setIsVisible(!isVisible);
  };

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'A':
        return 'text-green-600';
      case 'B':
        return 'text-blue-600';
      case 'C':
        return 'text-yellow-600';
      case 'D':
        return 'text-orange-600';
      case 'F':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getMetricColor = (
    value: number,
    thresholds: { good: number; poor: number }
  ): string => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.poor) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!metrics || !webVitals || !performanceGrade) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleToggleVisibility}
          className="rounded-full bg-gentle-silver p-2 text-mountain-stone shadow-lg transition-colors hover:bg-stone-gray/20"
          title="Performance Metrics Loading..."
        >
          ⏱️
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={handleToggleVisibility}
        className={`rounded-full bg-white p-2 shadow-lg transition-all hover:shadow-xl ${getGradeColor(
          performanceGrade.grade
        )} border-2 ${
          performanceGrade.grade === 'A'
            ? 'border-green-200'
            : performanceGrade.grade === 'B'
              ? 'border-blue-200'
              : performanceGrade.grade === 'C'
                ? 'border-yellow-200'
                : performanceGrade.grade === 'D'
                  ? 'border-orange-200'
                  : 'border-red-200'
        }`}
        title={`Performance Grade: ${performanceGrade.grade} (${performanceGrade.score})`}
      >
        <div className="flex items-center gap-1">
          <span className="text-lg">⚡</span>
          <span className="text-sm font-bold">{performanceGrade.grade}</span>
        </div>
      </button>

      {/* Performance Dashboard */}
      {isVisible && (
        <div className="absolute bottom-16 right-0 max-h-96 w-80 overflow-y-auto">
          <Card variant="elevated" className="bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  Performance Metrics
                </div>
                <div
                  className={`text-xl font-bold ${getGradeColor(
                    performanceGrade.grade
                  )}`}
                >
                  {performanceGrade.grade}
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              {/* Performance Score */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-soft-gray">
                  Performance Score
                </span>
                <span
                  className={`text-sm font-medium ${getGradeColor(
                    performanceGrade.grade
                  )}`}
                >
                  {performanceGrade.score}/100
                </span>
              </div>

              {/* Web Vitals */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-mountain-stone">
                  Web Vitals
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-soft-gray">LCP:</span>
                    <span
                      className={getMetricColor(webVitals.lcp, {
                        good: 2500,
                        poor: 4000,
                      })}
                    >
                      {formatTime(webVitals.lcp)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-gray">FID:</span>
                    <span
                      className={getMetricColor(webVitals.fid, {
                        good: 100,
                        poor: 300,
                      })}
                    >
                      {formatTime(webVitals.fid)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-gray">CLS:</span>
                    <span
                      className={getMetricColor(webVitals.cls, {
                        good: 0.1,
                        poor: 0.25,
                      })}
                    >
                      {webVitals.cls.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-gray">FCP:</span>
                    <span
                      className={getMetricColor(webVitals.fcp, {
                        good: 1800,
                        poor: 3000,
                      })}
                    >
                      {formatTime(webVitals.fcp)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-mountain-stone">
                  System Metrics
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-soft-gray">Page Load:</span>
                    <span
                      className={getMetricColor(metrics.pageLoadTime, {
                        good: 3000,
                        poor: 5000,
                      })}
                    >
                      {formatTime(metrics.pageLoadTime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-gray">API Response:</span>
                    <span
                      className={getMetricColor(metrics.apiResponseTime, {
                        good: 200,
                        poor: 500,
                      })}
                    >
                      {formatTime(metrics.apiResponseTime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-gray">Memory:</span>
                    <span
                      className={getMetricColor(metrics.memoryUsage, {
                        good: 50,
                        poor: 80,
                      })}
                    >
                      {metrics.memoryUsage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-gray">Bundle Size:</span>
                    <span
                      className={getMetricColor(metrics.bundleSize, {
                        good: 500000,
                        poor: 1000000,
                      })}
                    >
                      {formatBytes(metrics.bundleSize)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Issues */}
              {performanceGrade.issues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-mountain-stone">
                    Issues to Address
                  </h4>
                  <div className="space-y-1">
                    {performanceGrade.issues.slice(0, 3).map((issue, index) => (
                      <div
                        key={index}
                        className="rounded bg-red-50 p-2 text-xs text-red-600"
                      >
                        {issue}
                      </div>
                    ))}
                    {performanceGrade.issues.length > 3 && (
                      <div className="text-xs text-soft-gray">
                        +{performanceGrade.issues.length - 3} more issues
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Last Updated */}
              <div className="border-t border-stone-gray/20 pt-2 text-center text-xs text-soft-gray">
                Last updated: {new Date(metrics.timestamp).toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
