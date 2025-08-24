'use client';

import { usePerformanceAnalytics } from '@/hooks/usePerformanceAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useState, useEffect } from 'react';

interface PerformanceDashboardProps {
  className?: string;
}

export default function PerformanceDashboard({
  className,
}: PerformanceDashboardProps) {
  const {
    summary,
    metrics,
    isMonitoring,
    loading,
    startMonitoring,
    stopMonitoring,
    exportMetrics,
    clearMetrics,
    refreshSummary,
  } = usePerformanceAnalytics();

  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh summary
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshSummary();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshSummary]);

  const getRatingColor = (rating: 'excellent' | 'good' | 'poor') => {
    switch (rating) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-soft-gray';
    }
  };

  const getRatingBg = (rating: 'excellent' | 'good' | 'poor') => {
    switch (rating) {
      case 'excellent':
        return 'bg-green-100';
      case 'good':
        return 'bg-yellow-100';
      case 'poor':
        return 'bg-red-100';
      default:
        return 'bg-gentle-silver/10';
    }
  };

  const handleExport = () => {
    const data = exportMetrics();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tao-sage-performance-${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-flowing-water"></div>
          <p className="text-soft-gray">Loading performance analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ink-black">
            Performance Analytics
          </h2>
          <p className="text-soft-gray">
            Monitor FPS, memory usage, load times, and Core Web Vitals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={
              autoRefresh
                ? () => setAutoRefresh(false)
                : () => setAutoRefresh(true)
            }
            variant={autoRefresh ? 'default' : 'outline'}
            className="text-sm"
          >
            {autoRefresh ? '⏸️ Pause' : '▶️ Auto Refresh'}
          </Button>
          <Button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            variant={isMonitoring ? 'outline' : 'default'}
            className="text-sm"
          >
            {isMonitoring ? '⏹️ Stop Monitoring' : '📊 Start Monitoring'}
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
            isMonitoring
              ? 'bg-green-100 text-green-700'
              : 'bg-gentle-silver/20 text-soft-gray'
          }`}
        >
          <div
            className={`h-2 w-2 rounded-full ${
              isMonitoring ? 'bg-green-500' : 'bg-soft-gray'
            }`}
          />
          {isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}
        </div>
        <div className="text-xs text-soft-gray">
          {metrics.length} metrics collected
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* FPS */}
        <Card variant="default">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <span className="mr-2">⚡</span>
              Frame Rate (FPS)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-ink-black">
                  {summary.fps.current}
                </span>
                <div
                  className={`rounded-md px-2 py-1 text-xs font-medium ${getRatingBg(
                    summary.fps.rating
                  )} ${getRatingColor(summary.fps.rating)}`}
                >
                  {summary.fps.rating}
                </div>
              </div>
              <div className="text-xs text-soft-gray">
                Avg: {summary.fps.average} fps
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-gentle-silver/20">
                <div
                  className={`h-full transition-all duration-300 ${
                    summary.fps.rating === 'excellent'
                      ? 'bg-green-500'
                      : summary.fps.rating === 'good'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      (summary.fps.current / 60) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card variant="default">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <span className="mr-2">💾</span>
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-ink-black">
                  {summary.memory.current}%
                </span>
                <div
                  className={`rounded-md px-2 py-1 text-xs font-medium ${getRatingBg(
                    summary.memory.rating
                  )} ${getRatingColor(summary.memory.rating)}`}
                >
                  {summary.memory.rating}
                </div>
              </div>
              <div className="text-xs text-soft-gray">
                Avg: {summary.memory.average}%
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-gentle-silver/20">
                <div
                  className={`h-full transition-all duration-300 ${
                    summary.memory.rating === 'excellent'
                      ? 'bg-green-500'
                      : summary.memory.rating === 'good'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(summary.memory.current, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Load Times */}
        <Card variant="default">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <span className="mr-2">⏱️</span>
              Load Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-ink-black">
                  {summary.loadTimes.average}
                  <span className="text-sm font-normal text-soft-gray">ms</span>
                </span>
                <div
                  className={`rounded-md px-2 py-1 text-xs font-medium ${getRatingBg(
                    summary.loadTimes.rating
                  )} ${getRatingColor(summary.loadTimes.rating)}`}
                >
                  {summary.loadTimes.rating}
                </div>
              </div>
              <div className="text-xs text-soft-gray">
                Average response time
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-gentle-silver/20">
                <div
                  className={`h-full transition-all duration-300 ${
                    summary.loadTimes.rating === 'excellent'
                      ? 'bg-green-500'
                      : summary.loadTimes.rating === 'good'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      ((3000 - summary.loadTimes.average) / 3000) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Score */}
        <Card variant="default">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <span className="mr-2">🎯</span>
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-ink-black">
                  {(() => {
                    const scores = [
                      summary.fps.rating === 'excellent'
                        ? 100
                        : summary.fps.rating === 'good'
                          ? 70
                          : 40,
                      summary.memory.rating === 'excellent'
                        ? 100
                        : summary.memory.rating === 'good'
                          ? 70
                          : 40,
                      summary.loadTimes.rating === 'excellent'
                        ? 100
                        : summary.loadTimes.rating === 'good'
                          ? 70
                          : 40,
                    ];
                    return Math.round(
                      scores.reduce((sum, score) => sum + score, 0) /
                        scores.length
                    );
                  })()}
                </span>
                <div className="text-xs text-soft-gray">/ 100</div>
              </div>
              <div className="text-xs text-soft-gray">Performance rating</div>
              <div className="h-1 overflow-hidden rounded-full bg-gentle-silver/20">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-300"
                  style={{
                    width: `${(() => {
                      const scores = [
                        summary.fps.rating === 'excellent'
                          ? 100
                          : summary.fps.rating === 'good'
                            ? 70
                            : 40,
                        summary.memory.rating === 'excellent'
                          ? 100
                          : summary.memory.rating === 'good'
                            ? 70
                            : 40,
                        summary.loadTimes.rating === 'excellent'
                          ? 100
                          : summary.loadTimes.rating === 'good'
                            ? 70
                            : 40,
                      ];
                      return Math.round(
                        scores.reduce((sum, score) => sum + score, 0) /
                          scores.length
                      );
                    })()}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Core Web Vitals */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🌐</span>
            Core Web Vitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Largest Contentful Paint */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-mountain-stone">
                  Largest Contentful Paint (LCP)
                </span>
                {summary.webVitals.lcp && (
                  <div
                    className={`rounded-md px-2 py-1 text-xs font-medium ${getRatingBg(
                      summary.webVitals.lcp.rating
                    )} ${getRatingColor(summary.webVitals.lcp.rating)}`}
                  >
                    {summary.webVitals.lcp.rating}
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-ink-black">
                {summary.webVitals.lcp?.value || '—'}
                {summary.webVitals.lcp && (
                  <span className="text-sm font-normal text-soft-gray">ms</span>
                )}
              </div>
            </div>

            {/* First Input Delay */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-mountain-stone">
                  First Input Delay (FID)
                </span>
                {summary.webVitals.fid && (
                  <div
                    className={`rounded-md px-2 py-1 text-xs font-medium ${getRatingBg(
                      summary.webVitals.fid.rating
                    )} ${getRatingColor(summary.webVitals.fid.rating)}`}
                  >
                    {summary.webVitals.fid.rating}
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-ink-black">
                {summary.webVitals.fid?.value || '—'}
                {summary.webVitals.fid && (
                  <span className="text-sm font-normal text-soft-gray">ms</span>
                )}
              </div>
            </div>

            {/* Cumulative Layout Shift */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-mountain-stone">
                  Cumulative Layout Shift (CLS)
                </span>
                {summary.webVitals.cls && (
                  <div
                    className={`rounded-md px-2 py-1 text-xs font-medium ${getRatingBg(
                      summary.webVitals.cls.rating
                    )} ${getRatingColor(summary.webVitals.cls.rating)}`}
                  >
                    {summary.webVitals.cls.rating}
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-ink-black">
                {summary.webVitals.cls?.value || '—'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🛠️</span>
            Actions & Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleExport} variant="outline">
              📥 Export Data
            </Button>
            <Button onClick={refreshSummary} variant="outline">
              🔄 Refresh
            </Button>
            <Button
              onClick={clearMetrics}
              variant="outline"
              className="text-red-600"
            >
              🗑️ Clear Data
            </Button>
          </div>
          <div className="mt-4 rounded-lg bg-gentle-silver/10 p-3">
            <h4 className="mb-2 text-sm font-medium text-mountain-stone">
              Performance Tips 性能提示
            </h4>
            <div className="space-y-1 text-sm text-soft-gray">
              {summary.fps.current < 30 && (
                <div className="flex items-start">
                  <span className="mr-2 mt-0.5">🐌</span>
                  <span>
                    Low frame rate detected. Consider enabling reduced motion in
                    accessibility settings.
                  </span>
                </div>
              )}
              {summary.memory.current > 80 && (
                <div className="flex items-start">
                  <span className="mr-2 mt-0.5">💾</span>
                  <span>
                    High memory usage. Try refreshing the page or closing unused
                    tabs.
                  </span>
                </div>
              )}
              {summary.loadTimes.average > 1000 && (
                <div className="flex items-start">
                  <span className="mr-2 mt-0.5">⏱️</span>
                  <span>
                    Slow load times detected. Check your internet connection or
                    enable caching.
                  </span>
                </div>
              )}
              {summary.webVitals.cls && summary.webVitals.cls.value > 0.25 && (
                <div className="flex items-start">
                  <span className="mr-2 mt-0.5">📐</span>
                  <span>
                    Layout shifts detected. This may affect user experience
                    during page load.
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
