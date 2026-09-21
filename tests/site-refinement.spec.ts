import { expect, test } from '@playwright/test';

const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };

test('content remains visible when scripts are unavailable', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: 'no-preference',
    viewport: desktop,
  });
  const page = await context.newPage();

  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('[data-equipment-hero]')).toBeVisible();
  await expect(page.locator('.a2-route')).toHaveCount(2);
  await context.close();
});

test('solid product navigation remains solid after returning to the top', async ({ page }) => {
  await page.setViewportSize(desktop);
  await page.goto('/products/');
  const nav = page.locator('#nav');

  await expect(nav).toHaveClass(/nav--solid/);
  await page.evaluate(() => window.scrollTo(0, 300));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(80);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(nav).toHaveClass(/nav--solid/);
});

test('mobile navigation has ordinary links when scripts are unavailable', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: mobile });
  const page = await context.newPage();
  await page.goto('/');
  const fallback = page.getByRole('navigation', { name: 'Navigation without JavaScript' });
  await expect(fallback.getByRole('link', { name: 'Products', exact: true })).toBeVisible();
  await expect(fallback.getByRole('link')).toHaveCount(5);
  await fallback.getByRole('link', { name: 'Products', exact: true }).click();
  await expect(page).toHaveURL(/\/products\/$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(mobile.width);
  await context.close();
});

test('mobile navigation traps focus and restores the menu trigger', async ({ page }) => {
  await page.setViewportSize(mobile);
  await page.goto('/');

  const trigger = page.locator('#hamburger');
  const drawer = page.locator('#mobile-drawer');
  const close = page.getByRole('button', { name: 'Close navigation' });

  await trigger.click();
  await expect(drawer).toHaveAttribute('role', 'dialog');
  await expect(drawer).toHaveAttribute('aria-modal', 'true');
  await expect(close).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(drawer.getByRole('link', { name: 'Get a Quote' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(drawer).toHaveAttribute('aria-hidden', 'true');
  await expect(trigger).toBeFocused();
});

test('resizing an open mobile menu to desktop clears its locked state', async ({ page }) => {
  await page.setViewportSize(mobile);
  await page.goto('/');

  const trigger = page.locator('#hamburger');
  const drawer = page.locator('#mobile-drawer');
  await trigger.click();
  await expect(drawer).toHaveClass(/open/);
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

  await page.setViewportSize(desktop);

  await expect(drawer).not.toHaveClass(/open/);
  await expect(drawer).toHaveAttribute('aria-hidden', 'true');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await expect(page.locator('#nav .nav__logo')).toBeFocused();
});
