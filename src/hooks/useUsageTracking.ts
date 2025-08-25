/**
 * React hook for usage tracking and freemium limits
 */

import { useState, useEffect, useCallback } from 'react';
import type { UsageData } from '@/lib/subscription/usage-tracking';

interface UseUsageTrackingProps {
  userId?: string;
  autoRefresh?: boolean;
}

interface UseUsageTrackingReturn {
  usageData: UsageData | null;
  isLoading: boolean;
  error: string | null;
  refreshUsage: () => Promise<void>;
  canCreateConsultation: boolean;
  isUnlimited: boolean;
}

export function useUsageTracking({
  userId,
  autoRefresh = false,
}: UseUsageTrackingProps = {}): UseUsageTrackingReturn {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsageData = useCallback(async () => {
    if (!userId) {
      setUsageData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/usage?userId=${encodeURIComponent(userId)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch usage data');
      }

      const data = await response.json();
      setUsageData(data.usageData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Usage data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    fetchUsageData();
  }, [fetchUsageData]);

  // Auto-refresh if enabled
  useEffect(() => {
    if (!autoRefresh || !userId) return;

    const interval = setInterval(fetchUsageData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh, userId, fetchUsageData]);

  const refreshUsage = useCallback(async () => {
    await fetchUsageData();
  }, [fetchUsageData]);

  return {
    usageData,
    isLoading,
    error,
    refreshUsage,
    canCreateConsultation: usageData?.canCreateConsultation ?? false,
    isUnlimited: usageData?.isUnlimited ?? false,
  };
}
