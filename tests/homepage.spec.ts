import { expect, test } from '@playwright/test';

const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };

async function openHomepage(page, viewport = desktop, reducedMotion = 'no-preference') {
  await page.setViewportSize(viewport);
  await page.emulateMedia({ reducedMotion });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
}

test('uses a static product-first hero and four linked equipment architectures', async ({ page }) => {
  await openHomepage(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Roll-forming lifts for roof-level panel production');
  await expect(page.locator('.hero__carousel, .hero__slide, .hero__dot')).toHaveCount(0);
  await expect(page.locator('[data-equipment-family="crawler"]')).toHaveCount(2);
  await expect(page.locator('.family-path')).toHaveCount(4);
  for (const family of ['crawler', 'truck', 'ceiling', 'former']) {
    await expect(page.locator(`[data-equipment-family="${family}"]`).last()).toBeVisible();
  }
  await expect(page.getByText('AI-assisted editorial schematic — not to scale; not model-specific evidence.')).toHaveCount(5);
});

test('preserves CTA destinations, historical parameter boundaries, and local fonts', async ({ page }) => {
  const remoteFontRequests: string[] = [];
  page.on('request', (request) => {
    const hostname = new URL(request.url()).hostname;
    if (hostname === 'fonts.googleapis.com' || hostname === 'fonts.gstatic.com') remoteFontRequests.push(request.url());
  });
  await openHomepage(page, mobile);
  expect(remoteFontRequests).toEqual([]);
  await expect(page.getByRole('link', { name: 'Explore Products' }).first()).toHaveAttribute('href', '/products/');
  await expect(page.getByRole('link', { name: /Get a Quote/ }).first()).toHaveAttribute('href', '/contact/');
  await expect(page.locator('#key-specifications')).toContainText('Historical lift-height reference');
  await expect(page.locator('#key-specifications')).toContainText('Not platform or personnel payload');
  await expect(page.locator('#key-specifications')).toContainText('Destination and project specific');
});

test.describe('product-first homepage at 1440 × 900', () => {
  test.beforeEach(async ({}, testInfo) => test.skip(testInfo.project.name !== 'desktop-chromium'));

  test('keeps the hero split and all key specifications readable', async ({ page }) => {
    await openHomepage(page);
    const heroColumns = await page.locator('.hero__inner').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
    expect(heroColumns).toBe(2);
    const stats = page.locator('#key-specifications .stats');
    expect(await stats.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(4);
    for (const number of await page.locator('#key-specifications .stat__num').all()) {
      await expect(number).toHaveCSS('white-space', 'nowrap');
    }
  });
});

test.describe('product-first homepage at 390 × 844', () => {
  test.beforeEach(async ({}, testInfo) => test.skip(testInfo.project.name !== 'mobile-chromium'));

  test('has no horizontal overflow and keeps every schematic visible with reduced motion', async ({ page }) => {
    await openHomepage(page, mobile, 'reduce');
    const size = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    expect(size.documentWidth).toBeLessThanOrEqual(size.viewportWidth);
    await expect(page.locator('.equipment-diagram')).toHaveCount(5);
    await expect(page.locator('.equipment-diagram').first()).toBeVisible();
    expect(await page.locator('#key-specifications .stats').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(2);
  });

  test('loads the five editorial content images without tall cropping', async ({ page }) => {
    await openHomepage(page, mobile);
    const images = page.locator('.split__visual img, .app__image');
    await expect(images).toHaveCount(5);
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
      await expect(image).toHaveCSS('object-fit', 'contain');
    }
    await expect(page.getByText('AI-assisted editorial visual — representative only; not model-specific evidence.')).toHaveCount(5);
  });

  test('keeps the mobile drawer out of focus order when closed and traps focus when open', async ({ page }) => {
    await openHomepage(page, mobile);
    const drawer = page.locator('#mobile-drawer');
    const toggle = page.getByRole('button', { name: 'Toggle navigation' });
    await expect(drawer).toHaveAttribute('role', 'dialog');
    await expect(drawer).toHaveAttribute('aria-modal', 'true');
    await expect(drawer).toHaveAttribute('inert', '');
    await toggle.click();
    await expect(drawer).not.toHaveAttribute('inert', '');
    await expect(page.getByRole('button', { name: 'Close navigation' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(drawer.getByRole('link', { name: 'Get a Quote' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Close navigation' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(drawer).toHaveAttribute('inert', '');
    await expect(toggle).toBeFocused();
  });

  test('selects the compact under-ceiling image source', async ({ page }) => {
    await openHomepage(page, mobile);
    const images = [
      page.getByAltText('ARCLIFT-branded large crawler under-ceiling platform working inside a steel structure'),
      page.getByAltText('Representative under-ceiling platform visual in a steel structure'),
    ];
    for (const image of images) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) =>
        new URL(element.currentSrc || element.src, document.baseURI).pathname,
      ))
        .toBe('/images/home/under-ceiling-field-v2-800.webp');
    }
  });
});

test('does not request obsolete carousel imagery', async ({ page }) => {
  const requested = new Set<string>();
  page.on('request', (request) => requested.add(new URL(request.url()).pathname));
  await openHomepage(page, mobile);
  await expect(page.locator('.hero__carousel, .hero__slide, .hero__dot')).toHaveCount(0);
  for (const pathname of [
    '/images/hero/hero-1-arclift.webp',
    '/images/hero/hero-2.webp',
    '/images/editorial/port-loading-logistics.webp',
    '/images/hero/hero-5.webp',
  ]) {
    expect(requested.has(pathname), pathname).toBe(false);
  }
});
