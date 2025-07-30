import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display main heading', async ({ page }) => {
    await page.goto('/');

    // Check that the main heading is visible
    await expect(
      page.getByRole('heading', { name: 'Sage - The Way of Wisdom' })
    ).toBeVisible();

    // Check that the subtitle is visible
    await expect(
      page.getByText('AI-powered I Ching guidance coming soon...')
    ).toBeVisible();
  });

  test('should have correct page title and meta description', async ({
    page,
  }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle('Sage - 道 The Way of Wisdom');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      'content',
      'AI-powered I Ching life guidance for the modern seeker'
    );
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that content is still visible on mobile
    await expect(
      page.getByRole('heading', { name: 'Sage - The Way of Wisdom' })
    ).toBeVisible();

    // Check that text is readable (not too small)
    const heading = page.getByRole('heading', {
      name: 'Sage - The Way of Wisdom',
    });
    const headingBox = await heading.boundingBox();
    expect(headingBox?.height).toBeGreaterThan(30); // Minimum readable height
  });

  test('should have accessible markup', async ({ page }) => {
    await page.goto('/');

    // Check for proper heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    // Check for proper semantic structure
    const main = page.getByRole('main');
    await expect(main).toBeVisible();

    // Basic accessibility check
    await expect(page.locator('body')).toHaveCSS('font-family', /Inter/);
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const consoleMessages: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    await page.goto('/');

    // Wait a bit for any async errors
    await page.waitForTimeout(1000);

    // Check that no console errors occurred
    expect(consoleMessages).toEqual([]);
  });

  test('should have proper color scheme and styling', async ({ page }) => {
    await page.goto('/');

    const heading = page.getByRole('heading', {
      name: 'Sage - The Way of Wisdom',
    });

    // Check that Taoist color palette is applied
    await expect(heading).toHaveCSS('color', 'rgb(74, 92, 106)'); // mountain-stone color

    // Check typography
    await expect(heading).toHaveCSS('font-weight', '700'); // font-bold
    await expect(heading).toHaveCSS('font-size', '36px'); // text-4xl equivalent
  });
});
