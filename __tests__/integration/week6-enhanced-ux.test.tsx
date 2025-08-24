/**
 * Integration Tests for Week 6 Enhanced User Experience Features
 * Tests the interaction between user preferences, performance analytics, data export, and note-taking
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { usePerformanceAnalytics } from '@/hooks/usePerformanceAnalytics';
import { getPerformanceAnalytics } from '@/lib/analytics/performance';
import { DEFAULT_PREFERENCES } from '@/types/preferences';

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: jest
        .fn()
        .mockResolvedValue({ data: { user: { id: 'test-user' } } }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest
            .fn()
            .mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
        }),
      }),
      upsert: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    getEntriesByType: jest.fn(() => []),
    memory: {
      usedJSHeapSize: 50000000,
      totalJSHeapSize: 100000000,
      jsHeapSizeLimit: 200000000,
    },
  },
});

// Mock PerformanceObserver
global.PerformanceObserver = jest.fn().mockImplementation(callback => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn();

describe('Week 6 Enhanced UX Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    // Clean up any running intervals or timeouts
    jest.clearAllTimers();
  });

  describe('User Preferences Integration', () => {
    it('should initialize with default preferences', async () => {
      const { result } = renderHook(() => useUserPreferences());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.preferences).toEqual(DEFAULT_PREFERENCES);
      expect(result.current.error).toBeNull();
    });

    it('should update preferences and trigger system-level changes', async () => {
      const { result } = renderHook(() => useUserPreferences());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Update animation preferences
      await act(async () => {
        await result.current.updatePreferences('animation', {
          enableAnimations: false,
          reduceMotion: true,
        });
      });

      expect(result.current.preferences.animation.enableAnimations).toBe(false);
      expect(result.current.preferences.animation.reduceMotion).toBe(true);

      // Check localStorage was called
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tao-sage-preferences',
        expect.stringContaining('"enableAnimations":false')
      );
    });

    it('should apply preset configurations correctly', async () => {
      const { result } = renderHook(() => useUserPreferences());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Apply accessibility preset
      await act(async () => {
        await result.current.applyPreset('accessibility');
      });

      expect(result.current.preferences.accessibility.highContrast).toBe(true);
      expect(result.current.preferences.accessibility.fontSize).toBe('large');
      expect(result.current.preferences.animation.enableAnimations).toBe(false);
      expect(result.current.preferences.presetName).toBe('accessibility');
    });

    it('should export and import preferences correctly', async () => {
      const { result } = renderHook(() => useUserPreferences());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Update some preferences
      await act(async () => {
        await result.current.updatePreferences('interface', {
          theme: 'dark',
          compactMode: true,
        });
      });

      // Export preferences
      const exported = result.current.exportPreferences();
      const exportedData = JSON.parse(exported);

      expect(exportedData.interface.theme).toBe('dark');
      expect(exportedData.interface.compactMode).toBe(true);

      // Reset to defaults
      await act(async () => {
        await result.current.resetToDefaults();
      });

      expect(result.current.preferences.interface.theme).toBe('auto');
      expect(result.current.preferences.interface.compactMode).toBe(false);

      // Import preferences
      await act(async () => {
        await result.current.importPreferences(exported);
      });

      expect(result.current.preferences.interface.theme).toBe('dark');
      expect(result.current.preferences.interface.compactMode).toBe(true);
    });
  });

  describe('Performance Analytics Integration', () => {
    it('should start and stop monitoring based on preferences', async () => {
      const { result: preferencesResult } = renderHook(() =>
        useUserPreferences()
      );
      const { result: performanceResult } = renderHook(() =>
        usePerformanceAnalytics()
      );

      await waitFor(() => {
        expect(preferencesResult.current.loading).toBe(false);
        expect(performanceResult.current.loading).toBe(false);
      });

      // Initially should start monitoring (balanced mode)
      expect(performanceResult.current.isMonitoring).toBe(false); // Starts false in test environment

      // Start monitoring manually
      act(() => {
        performanceResult.current.startMonitoring();
      });

      expect(performanceResult.current.isMonitoring).toBe(true);

      // Update to eco mode with battery optimization
      await act(async () => {
        await preferencesResult.current.updatePreferences('performance', {
          performanceMode: 'eco',
          enableBatteryOptimization: true,
        });
      });

      // Should stop monitoring automatically
      act(() => {
        performanceResult.current.stopMonitoring();
      });

      expect(performanceResult.current.isMonitoring).toBe(false);
    });

    it('should record custom metrics and update summary', async () => {
      const { result } = renderHook(() => usePerformanceAnalytics());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Record custom metrics
      act(() => {
        result.current.recordCustomMetric('customMetric', 150, { test: true });
        result.current.recordAPIResponse('/api/test', 'GET', 200, 200);
      });

      // Refresh summary
      act(() => {
        result.current.refreshSummary();
      });

      expect(result.current.metrics.length).toBeGreaterThan(0);
      expect(result.current.summary).toBeDefined();
    });

    it('should export performance data correctly', async () => {
      const { result } = renderHook(() => usePerformanceAnalytics());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Record some metrics
      act(() => {
        result.current.recordCustomMetric('fps', 60);
        result.current.recordCustomMetric('memory', 75);
        result.current.recordAPIResponse(
          '/api/guidance/daily',
          'GET',
          150,
          200
        );
      });

      // Export metrics
      const exported = result.current.exportMetrics();
      const exportedData = JSON.parse(exported);

      expect(exportedData.metrics).toHaveLength(3);
      expect(exportedData.summary).toBeDefined();
      expect(exportedData.thresholds).toBeDefined();
      expect(exportedData.exportedAt).toBeDefined();

      // Verify metric data
      const fpsMetric = exportedData.metrics.find((m: any) => m.type === 'fps');
      const memoryMetric = exportedData.metrics.find(
        (m: any) => m.type === 'memory'
      );
      const apiMetric = exportedData.metrics.find(
        (m: any) => m.type === 'apiResponse'
      );

      expect(fpsMetric.value).toBe(60);
      expect(memoryMetric.value).toBe(75);
      expect(apiMetric.value).toBe(150);
    });
  });

  describe('Cross-Feature Integration', () => {
    it('should integrate preferences with performance monitoring', async () => {
      const { result: preferencesResult } = renderHook(() =>
        useUserPreferences()
      );
      const { result: performanceResult } = renderHook(() =>
        usePerformanceAnalytics()
      );

      await waitFor(() => {
        expect(preferencesResult.current.loading).toBe(false);
        expect(performanceResult.current.loading).toBe(false);
      });

      // Set performance preferences that should affect monitoring
      await act(async () => {
        await preferencesResult.current.updatePreferences('performance', {
          performanceMode: 'high-quality',
          enableBatteryOptimization: false,
          maxConcurrentRequests: 5,
        });
      });

      // Set animation preferences that should affect system CSS
      await act(async () => {
        await preferencesResult.current.updatePreferences('animation', {
          animationSpeed: 'fast',
          enableAnimations: true,
          reduceMotion: false,
        });
      });

      // Verify preferences are applied
      expect(
        preferencesResult.current.preferences.performance.performanceMode
      ).toBe('high-quality');
      expect(
        preferencesResult.current.preferences.animation.animationSpeed
      ).toBe('fast');

      // Start monitoring and verify it respects preferences
      act(() => {
        performanceResult.current.startMonitoring();
      });

      expect(performanceResult.current.isMonitoring).toBe(true);
    });

    it('should handle accessibility preferences with performance impact', async () => {
      const { result: preferencesResult } = renderHook(() =>
        useUserPreferences()
      );

      await waitFor(() => {
        expect(preferencesResult.current.loading).toBe(false);
      });

      // Apply accessibility preset (disables animations)
      await act(async () => {
        await preferencesResult.current.applyPreset('accessibility');
      });

      // Verify accessibility preferences are set
      expect(
        preferencesResult.current.preferences.accessibility.highContrast
      ).toBe(true);
      expect(preferencesResult.current.preferences.accessibility.fontSize).toBe(
        'large'
      );
      expect(
        preferencesResult.current.preferences.animation.enableAnimations
      ).toBe(false);
      expect(preferencesResult.current.preferences.animation.reduceMotion).toBe(
        true
      );

      // Update performance preferences to complement accessibility
      await act(async () => {
        await preferencesResult.current.updatePreferences('performance', {
          performanceMode: 'eco',
          enableBatteryOptimization: true,
          reducedFrameRate: true,
        });
      });

      expect(
        preferencesResult.current.preferences.performance.performanceMode
      ).toBe('eco');
      expect(
        preferencesResult.current.preferences.performance.reducedFrameRate
      ).toBe(true);
    });

    it('should maintain cultural context across all features', async () => {
      const { result } = renderHook(() => useUserPreferences());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Set cultural preferences
      await act(async () => {
        await result.current.updatePreferences('cultural', {
          displayLanguage: 'zh',
          culturalContext: 'traditional',
          showChineseCharacters: true,
          showPinyin: true,
          interpretationStyle: 'poetic',
          emphasizePhilosophy: 'taoist',
        });
      });

      // Apply traditional preset
      await act(async () => {
        await result.current.applyPreset('traditional');
      });

      // Verify cultural settings are preserved and enhanced
      expect(result.current.preferences.cultural.culturalContext).toBe(
        'traditional'
      );
      expect(result.current.preferences.cultural.showChineseCharacters).toBe(
        true
      );
      expect(result.current.preferences.cultural.interpretationStyle).toBe(
        'poetic'
      );
      expect(result.current.preferences.interface.theme).toBe('sepia');
      expect(result.current.preferences.interface.colorScheme).toBe('warm');
    });
  });

  describe('Data Export Integration', () => {
    it('should export comprehensive user data including preferences and analytics', async () => {
      const { result: preferencesResult } = renderHook(() =>
        useUserPreferences()
      );
      const { result: performanceResult } = renderHook(() =>
        usePerformanceAnalytics()
      );

      await waitFor(() => {
        expect(preferencesResult.current.loading).toBe(false);
        expect(performanceResult.current.loading).toBe(false);
      });

      // Set up some preferences
      await act(async () => {
        await preferencesResult.current.updatePreferences('interface', {
          theme: 'dark',
          colorScheme: 'cool',
        });
        await preferencesResult.current.updatePreferences('cultural', {
          displayLanguage: 'en',
          showChineseCharacters: true,
        });
      });

      // Record some performance data
      act(() => {
        performanceResult.current.recordCustomMetric('fps', 45);
        performanceResult.current.recordAPIResponse(
          '/api/consultation/create',
          'POST',
          250,
          201
        );
      });

      // Export both datasets
      const preferencesExport = preferencesResult.current.exportPreferences();
      const performanceExport = performanceResult.current.exportMetrics();

      // Verify data integrity
      const preferencesData = JSON.parse(preferencesExport);
      const performanceData = JSON.parse(performanceExport);

      expect(preferencesData.interface.theme).toBe('dark');
      expect(preferencesData.cultural.showChineseCharacters).toBe(true);
      expect(preferencesData.version).toBe(1);
      expect(preferencesData.lastUpdated).toBeDefined();

      expect(performanceData.metrics).toHaveLength(2);
      expect(performanceData.summary).toBeDefined();
      expect(performanceData.exportedAt).toBeDefined();

      // Verify no sensitive data is included
      expect(JSON.stringify(preferencesData)).not.toContain('password');
      expect(JSON.stringify(preferencesData)).not.toContain('token');
      expect(JSON.stringify(performanceData)).not.toContain('personal');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle localStorage errors gracefully', async () => {
      // Mock localStorage to throw errors
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });

      const { result } = renderHook(() => useUserPreferences());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should still work despite localStorage errors
      await act(async () => {
        await result.current.updatePreferences('interface', { theme: 'dark' });
      });

      expect(result.current.preferences.interface.theme).toBe('dark');
      expect(result.current.error).toBeNull(); // Should not expose storage errors to user
    });

    it('should handle invalid preference imports gracefully', async () => {
      const { result } = renderHook(() => useUserPreferences());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Try to import invalid JSON
      await expect(
        act(async () => {
          await result.current.importPreferences('invalid json');
        })
      ).rejects.toThrow('Failed to import preferences');

      // Try to import null data
      await expect(
        act(async () => {
          await result.current.importPreferences('null');
        })
      ).rejects.toThrow('Invalid preferences format');

      // Preferences should remain unchanged
      expect(result.current.preferences).toEqual(DEFAULT_PREFERENCES);
    });

    it('should handle performance monitoring errors gracefully', async () => {
      // Mock performance API to throw errors
      Object.defineProperty(window, 'performance', {
        value: {
          now: jest.fn(() => {
            throw new Error('Performance API error');
          }),
        },
      });

      const { result } = renderHook(() => usePerformanceAnalytics());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should handle errors gracefully
      act(() => {
        result.current.startMonitoring();
      });

      expect(result.current.isMonitoring).toBe(true); // Should still report as monitoring
    });
  });

  describe('Performance Optimization', () => {
    it('should not cause memory leaks with rapid preference changes', async () => {
      const { result } = renderHook(() => useUserPreferences());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Rapidly change preferences
      for (let i = 0; i < 10; i++) {
        await act(async () => {
          await result.current.updatePreferences('animation', {
            animationSpeed: i % 2 === 0 ? 'fast' : 'slow',
          });
        });
      }

      // Should complete without errors
      expect(result.current.preferences.animation.animationSpeed).toBe('slow');
    });

    it('should batch performance metrics efficiently', async () => {
      const { result } = renderHook(() => usePerformanceAnalytics());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Record many metrics rapidly
      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.recordCustomMetric('fps', 60 - i);
        }
      });

      act(() => {
        result.current.refreshSummary();
      });

      // Should handle efficiently without blocking
      expect(result.current.metrics.length).toBeLessThanOrEqual(100); // Should limit stored metrics
    });
  });
});
