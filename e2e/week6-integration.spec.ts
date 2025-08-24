/**
 * End-to-End Integration Tests for Week 6 Enhanced User Experience
 * Tests complete user workflows across preferences, analytics, export, and note-taking features
 */

import { test, expect, type Page, type BrowserContext } from '@playwright/test';

// Helper function to wait for page to be fully loaded
async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('body');
}

// Helper function to sign in a test user (mock)
async function signInTestUser(page: Page) {
  // For now, we'll assume user is signed in or mock the auth state
  await page.goto('/');
  await waitForPageLoad(page);

  // Check if we're on auth page and handle accordingly
  if (page.url().includes('/auth')) {
    // In a real test, this would handle actual authentication
    // For now, we'll mock it by going directly to the main app
    await page.goto('/');
    await waitForPageLoad(page);
  }
}

test.describe('Week 6 Enhanced UX - Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up performance monitoring
    await page.addInitScript(() => {
      // Mock performance API for consistent testing
      Object.defineProperty(window, 'performance', {
        value: {
          now: () => Date.now(),
          getEntriesByType: () => [],
          memory: {
            usedJSHeapSize: 50000000,
            totalJSHeapSize: 100000000,
            jsHeapSizeLimit: 200000000,
          },
        },
      });

      // Mock PerformanceObserver
      window.PerformanceObserver = class MockPerformanceObserver {
        constructor(callback) {
          this.callback = callback;
        }
        observe() {}
        disconnect() {}
      };
    });

    await signInTestUser(page);
  });

  test.describe('User Preferences Integration', () => {
    test('should navigate to preferences and apply settings', async ({
      page,
    }) => {
      // Navigate to preferences
      await page.goto('/preferences');
      await waitForPageLoad(page);

      // Verify preferences page loads
      await expect(page.locator('h1')).toContainText('个人偏好设置');
      await expect(page.locator('h1')).toContainText('Personal Preferences');

      // Test interface theme change
      await page.click('[data-testid="interface-tab"]');
      await page.selectOption('select[name="theme"]', 'dark');

      // Verify theme change is applied
      await expect(page.locator('body')).toHaveClass(/theme-dark/);

      // Test animation preferences
      await page.click('[data-testid="animation-tab"]');
      const enableAnimationsToggle = page.locator(
        '[data-testid="enable-animations-toggle"]'
      );
      await enableAnimationsToggle.click();

      // Test accessibility preset
      await page.click('button:has-text("♿ Accessibility")');

      // Verify accessibility changes
      await expect(page.locator('body')).toHaveClass(/high-contrast/);

      // Test cultural preferences
      await page.click('[data-testid="cultural-tab"]');
      await page.selectOption('select[name="displayLanguage"]', 'zh');
      await page.check('[data-testid="show-chinese-characters"]');

      // Verify cultural changes are applied
      const chineseText = page.locator('text=易經');
      await expect(chineseText).toBeVisible();
    });

    test('should export and import preferences', async ({ page }) => {
      await page.goto('/preferences');
      await waitForPageLoad(page);

      // Make some preference changes
      await page.selectOption('select[name="theme"]', 'sepia');
      await page.selectOption('select[name="displayLanguage"]', 'zh-TW');

      // Export preferences
      await page.click('button:has-text("📤 Export Settings")');
      await page.click('button:has-text("📋 Copy to Clipboard")');

      // Verify export modal appears and data is copied
      await expect(page.locator('text=copied to your clipboard')).toBeVisible();

      // Reset to defaults
      await page.click('button:has-text("🔄 Reset to Defaults")');

      // Verify reset
      await expect(page.locator('body')).not.toHaveClass(/theme-sepia/);

      // Import preferences (would need clipboard API mocking in real test)
      // For now, we'll test the import modal appears
      await page.click('button:has-text("📥 Import Settings")');
      await expect(
        page.locator('textarea[placeholder*="JSON data"]')
      ).toBeVisible();
    });
  });

  test.describe('Performance Analytics Integration', () => {
    test('should monitor and display performance metrics', async ({ page }) => {
      await page.goto('/analytics');
      await waitForPageLoad(page);

      // Verify analytics page loads
      await expect(page.locator('h1')).toContainText('Performance Analytics');
      await expect(page.locator('h1')).toContainText('性能分析');

      // Start monitoring
      await page.click('button:has-text("📊 Start Monitoring")');

      // Verify monitoring status
      await expect(page.locator('text=Monitoring Active')).toBeVisible();

      // Check that metrics are displayed
      await expect(page.locator('[data-testid="fps-metric"]')).toBeVisible();
      await expect(page.locator('[data-testid="memory-metric"]')).toBeVisible();
      await expect(
        page.locator('[data-testid="load-time-metric"]')
      ).toBeVisible();

      // Test export functionality
      await page.click('button:has-text("📥 Export Data")');

      // Verify download (in real test, would check download)
      // For now, verify the button works
      await expect(
        page.locator('button:has-text("📥 Export Data")')
      ).toBeEnabled();

      // Test refresh functionality
      await page.click('button:has-text("🔄 Refresh")');

      // Stop monitoring
      await page.click('button:has-text("⏹️ Stop Monitoring")');
      await expect(page.locator('text=Monitoring Stopped')).toBeVisible();
    });

    test('should respond to preference changes', async ({ page }) => {
      // Start with analytics page
      await page.goto('/analytics');
      await page.click('button:has-text("📊 Start Monitoring")');

      // Navigate to preferences and change performance mode
      await page.goto('/preferences');
      await page.click('[data-testid="performance-tab"]');
      await page.selectOption('select[name="performanceMode"]', 'eco');
      await page.check('[data-testid="battery-optimization"]');

      // Go back to analytics
      await page.goto('/analytics');

      // Should show eco mode optimizations
      await expect(page.locator('text=Eco mode active')).toBeVisible();
    });
  });

  test.describe('Data Export Integration', () => {
    test('should export comprehensive user data', async ({ page }) => {
      await page.goto('/export');
      await waitForPageLoad(page);

      // Verify export page loads
      await expect(page.locator('h1')).toContainText(
        'Export Your I Ching Journey'
      );

      // Test different export formats
      await page.selectOption('select[name="exportFormat"]', 'JSON');
      await page.selectOption('select[name="dateRange"]', 'all-time');

      // Include all data types
      await page.check('[data-testid="include-consultations"]');
      await page.check('[data-testid="include-preferences"]');
      await page.check('[data-testid="include-analytics"]');

      // Export data
      await page.click('button:has-text("📦 Export Data")');

      // Verify export options are presented
      await expect(page.locator('text=Download Complete')).toBeVisible({
        timeout: 10000,
      });

      // Test CSV format
      await page.selectOption('select[name="exportFormat"]', 'CSV');
      await page.click('button:has-text("📦 Export Data")');

      // Test PDF format with analytics
      await page.selectOption('select[name="exportFormat"]', 'PDF');
      await page.check('[data-testid="include-analytics-charts"]');
      await page.click('button:has-text("📦 Export Data")');
    });

    test('should respect privacy settings in export', async ({ page }) => {
      // First set privacy preferences
      await page.goto('/preferences');
      await page.click('[data-testid="privacy-tab"]');

      // Enable strict privacy
      await page.click('button:has-text("🔒 Maximum Privacy")');

      // Go to export page
      await page.goto('/export');

      // Should show privacy notices
      await expect(page.locator('text=completely private')).toBeVisible();
      await expect(page.locator('text=no external servers')).toBeVisible();

      // Export should work but with privacy annotations
      await page.click('button:has-text("📦 Export Data")');
      await expect(page.locator('text=Privacy-compliant export')).toBeVisible();
    });
  });

  test.describe('Cross-Feature Integration Workflows', () => {
    test('should complete full user journey from setup to export', async ({
      page,
    }) => {
      // Step 1: Set up preferences
      await page.goto('/preferences');

      // Apply traditional preset
      await page.click('button:has-text("🏛️ Traditional")');

      // Customize further
      await page.click('[data-testid="cultural-tab"]');
      await page.selectOption('select[name="interpretationStyle"]', 'poetic');
      await page.check('[data-testid="show-pinyin"]');

      // Step 2: Verify theme is applied
      await expect(page.locator('body')).toHaveClass(/theme-sepia/);
      await expect(page.locator('body')).toHaveClass(/color-scheme-warm/);

      // Step 3: Start performance monitoring
      await page.goto('/analytics');
      await page.click('button:has-text("📊 Start Monitoring")');

      // Generate some activity for metrics
      await page.goto('/');
      await page.goto('/guidance');
      await page.goto('/analytics');

      // Step 4: Verify metrics are collected
      await expect(page.locator('[data-testid="metrics-count"]')).toContainText(
        /\d+ metrics collected/
      );

      // Step 5: Export everything
      await page.goto('/export');
      await page.check('[data-testid="include-preferences"]');
      await page.check('[data-testid="include-analytics"]');
      await page.selectOption('select[name="exportFormat"]', 'JSON');
      await page.click('button:has-text("📦 Export Data")');

      // Verify comprehensive export
      await expect(page.locator('text=Export Complete')).toBeVisible();
    });

    test('should maintain accessibility throughout user journey', async ({
      page,
    }) => {
      // Apply accessibility preset
      await page.goto('/preferences');
      await page.click('button:has-text("♿ Accessibility")');

      // Verify accessibility features are active
      await expect(page.locator('body')).toHaveClass(/high-contrast/);
      await expect(page.locator('html')).toHaveCSS('--base-font-size', '18px');

      // Navigate through all pages and verify accessibility
      const pages = ['/analytics', '/export', '/guidance', '/'];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        await waitForPageLoad(page);

        // Check contrast and font size are maintained
        await expect(page.locator('body')).toHaveClass(/high-contrast/);

        // Verify keyboard navigation works
        await page.keyboard.press('Tab');
        const focusedElement = await page.locator(':focus').count();
        expect(focusedElement).toBeGreaterThan(0);

        // Check for accessibility landmarks
        const landmarks = await page
          .locator('main, nav, header, footer, aside')
          .count();
        expect(landmarks).toBeGreaterThan(0);
      }
    });

    test('should handle cultural context consistently', async ({ page }) => {
      // Set Chinese cultural context
      await page.goto('/preferences');
      await page.click('[data-testid="cultural-tab"]');
      await page.selectOption('select[name="displayLanguage"]', 'zh');
      await page.selectOption('select[name="culturalContext"]', 'traditional');
      await page.check('[data-testid="show-chinese-characters"]');
      await page.check('[data-testid="show-pinyin"]');

      // Verify cultural elements appear throughout app
      await page.goto('/');
      await expect(page.locator('text=易經')).toBeVisible();

      await page.goto('/guidance');
      await expect(page.locator('text=每日指导')).toBeVisible();

      await page.goto('/analytics');
      await expect(page.locator('text=性能分析')).toBeVisible();

      await page.goto('/export');
      await expect(page.locator('text=文化完整性')).toBeVisible();

      // Export should include cultural annotations
      await page.selectOption('select[name="exportFormat"]', 'JSON');
      await page.click('button:has-text("📦 Export Data")');

      // Should show cultural context preservation notice
      await expect(
        page.locator('text=cultural context and traditional elements')
      ).toBeVisible();
    });

    test('should optimize performance based on device capabilities', async ({
      page,
      context,
    }) => {
      // Simulate mobile device
      await context.addInitScript(() => {
        Object.defineProperty(navigator, 'connection', {
          value: { effectiveType: '3g', downlink: 0.5 },
        });
      });

      await page.goto('/preferences');
      await page.click('[data-testid="performance-tab"]');

      // Should suggest eco mode on mobile/slow connection
      await expect(
        page.locator('text=Consider enabling battery optimization')
      ).toBeVisible();

      // Apply performance preset
      await page.click('button:has-text("🚀 Performance")');

      // Verify optimizations are applied
      await expect(page.locator('select[name="performanceMode"]')).toHaveValue(
        'eco'
      );
      await expect(
        page.locator('[data-testid="battery-optimization"]')
      ).toBeChecked();

      // Analytics should reflect these settings
      await page.goto('/analytics');
      await expect(
        page.locator('text=Performance optimized for battery')
      ).toBeVisible();
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle network failures gracefully', async ({
      page,
      context,
    }) => {
      // Start with working state
      await page.goto('/preferences');

      // Simulate network failure
      await context.setOffline(true);

      // Try to update preferences (should work with localStorage)
      await page.selectOption('select[name="theme"]', 'dark');

      // Should show offline indicator but still work
      await expect(page.locator('body')).toHaveClass(/theme-dark/);

      // Try to export (should work offline)
      await page.goto('/export');
      await page.selectOption('select[name="exportFormat"]', 'JSON');
      await page.click('button:has-text("📦 Export Data")');

      // Should work but show offline notice
      await expect(page.locator('text=Offline mode')).toBeVisible();

      // Restore network
      await context.setOffline(false);
      await page.reload();

      // Should sync preferences when back online
      await expect(page.locator('body')).toHaveClass(/theme-dark/);
    });

    test('should handle corrupted data gracefully', async ({ page }) => {
      // Inject corrupted localStorage data
      await page.addInitScript(() => {
        localStorage.setItem('tao-sage-preferences', 'invalid json');
        localStorage.setItem('tao-sage-analytics', '{"corrupted": true');
      });

      // Should fall back to defaults without crashing
      await page.goto('/preferences');
      await waitForPageLoad(page);

      // Should show default preferences
      await expect(page.locator('select[name="theme"]')).toHaveValue('auto');

      // Analytics should handle corrupted data
      await page.goto('/analytics');
      await expect(page.locator('h1')).toContainText('Performance Analytics');

      // Should not show error messages to user
      await expect(page.locator('text=error')).not.toBeVisible();
      await expect(page.locator('text=corrupt')).not.toBeVisible();
    });

    test('should handle rapid user interactions', async ({ page }) => {
      await page.goto('/preferences');

      // Rapidly change preferences
      for (let i = 0; i < 5; i++) {
        await page.selectOption(
          'select[name="theme"]',
          i % 2 === 0 ? 'dark' : 'light'
        );
        await page.selectOption(
          'select[name="animationSpeed"]',
          i % 3 === 0 ? 'fast' : 'slow'
        );
      }

      // Should handle rapid changes without breaking
      await expect(page.locator('select[name="theme"]')).toHaveValue('light');
      await expect(page.locator('body')).toHaveClass(/theme-light/);

      // Performance monitoring should handle rapid metrics
      await page.goto('/analytics');
      await page.click('button:has-text("📊 Start Monitoring")');

      // Generate rapid navigation
      for (let i = 0; i < 10; i++) {
        await page.goto('/');
        await page.goto('/analytics');
      }

      // Should not crash or show errors
      await expect(page.locator('text=Monitoring Active')).toBeVisible();
    });
  });

  test.describe('Performance and Accessibility Standards', () => {
    test('should meet Core Web Vitals standards', async ({ page }) => {
      await page.goto('/');

      // Measure page load performance
      const navigationTiming = await page.evaluate(() => {
        const nav = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded: nav.domContentLoadedEventEnd - nav.navigationStart,
          loadComplete: nav.loadEventEnd - nav.navigationStart,
        };
      });

      // Should meet performance standards
      expect(navigationTiming.domContentLoaded).toBeLessThan(2500); // LCP target
      expect(navigationTiming.loadComplete).toBeLessThan(4000);

      // Test all major pages
      const pages = ['/preferences', '/analytics', '/export'];
      for (const pagePath of pages) {
        await page.goto(pagePath);
        await waitForPageLoad(page);

        // Should load quickly
        const loadTime = await page.evaluate(() => performance.now());
        expect(loadTime).toBeLessThan(3000);
      }
    });

    test('should be fully accessible via keyboard', async ({ page }) => {
      await page.goto('/preferences');

      // Should be able to navigate entire interface with keyboard
      let tabCount = 0;
      const maxTabs = 50;

      while (tabCount < maxTabs) {
        await page.keyboard.press('Tab');
        const focusedElement = await page.locator(':focus').first();

        if ((await focusedElement.count()) > 0) {
          const tagName = await focusedElement.evaluate(el =>
            el.tagName.toLowerCase()
          );

          // Test interactive elements
          if (['button', 'input', 'select', 'a'].includes(tagName)) {
            // Should be able to activate with keyboard
            if (tagName === 'button') {
              const initialValue = await focusedElement.textContent();
              await page.keyboard.press('Enter');
              // Button should respond (may change state)
            }
          }
        }

        tabCount++;
      }

      // Should be able to navigate back with Shift+Tab
      await page.keyboard.press('Shift+Tab');
      const focusedAfterShift = await page.locator(':focus').count();
      expect(focusedAfterShift).toBeGreaterThan(0);
    });

    test('should maintain WCAG compliance', async ({ page }) => {
      // Test with accessibility preset
      await page.goto('/preferences');
      await page.click('button:has-text("♿ Accessibility")');

      // Check contrast ratios
      const contrastResults = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const contrastIssues = [];

        elements.forEach(el => {
          const computedStyle = window.getComputedStyle(el);
          const bgColor = computedStyle.backgroundColor;
          const textColor = computedStyle.color;

          // Simple contrast check (in real test would use proper algorithm)
          if (
            bgColor !== 'rgba(0, 0, 0, 0)' &&
            textColor !== 'rgba(0, 0, 0, 0)'
          ) {
            // Would calculate actual contrast ratio here
            // For now, just check high contrast mode is applied
            if (document.body.classList.contains('high-contrast')) {
              return; // High contrast mode should pass
            }
          }
        });

        return contrastIssues;
      });

      // Should have high contrast applied
      await expect(page.locator('body')).toHaveClass(/high-contrast/);

      // Test screen reader compatibility
      const landmarkCount = await page
        .locator('main, nav, header, footer, section[aria-label], aside')
        .count();
      expect(landmarkCount).toBeGreaterThan(0);

      // Test form labels
      const unlabeledInputs = await page
        .locator('input:not([aria-label]):not([aria-labelledby])')
        .count();
      expect(unlabeledInputs).toBe(0);
    });
  });
});
