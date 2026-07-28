import { expect, test } from '@playwright/test';

const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };

async function openHomepage(page, viewport = desktop, reducedMotion = 'no-preference') {
  await page.setViewportSize(viewport);
  await page.emulateMedia({ reducedMotion });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
}

test.describe('Task 6 homepage at 1440 × 900', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium');
  });

  test('all five carousel controls are clickable and update accessible state', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    await openHomepage(page);

    const hero = page.locator('.hero');
    const dots = page.getByRole('button', { name: /Show slide \d of 5/ });
    await expect(dots).toHaveCount(5);
    await expect(hero).toHaveAttribute('data-autoplay', 'running');
    await expect.poll(
      () => page.locator('.hero__slide--active').getAttribute('data-index'),
      { timeout: 7_500 },
    ).toBe('1');

    for (let index = 0; index < 5; index += 1) {
      const dot = dots.nth(index);
      await dot.click();
      await expect(dot).toHaveAttribute('aria-current', 'true');
      await expect(page.locator('.hero__slide--active')).toHaveAttribute('data-index', String(index));
    }

    await dots.first().click();
    const trustedFirstTitle = page.locator('#hero-title');
    await expect(trustedFirstTitle.locator('br')).toHaveCount(1);
    await expect(trustedFirstTitle.locator('em')).toHaveText('HEIGHT');

    await hero.hover();
    await expect(hero).toHaveAttribute('data-autoplay', 'paused');
    await dots.first().focus();
    await expect(hero).toHaveAttribute('data-autoplay', 'paused');
    await expect(page.locator('.hero__slide')).toHaveCount(5);
    expect(consoleErrors).toEqual([]);
  });

  test('key specifications stay in four aligned columns with unbroken values', async ({ page }) => {
    await openHomepage(page);
    const stats = page.locator('#key-specifications .stats');
    const numbers = page.locator('#key-specifications .stat__num');
    const labels = page.locator('#key-specifications .stat__label');
    const columns = await stats.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
    const numberTops = await numbers.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().top));
    const labelHeights = await labels.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).minHeight));

    expect(columns).toBe(4);
    expect(Math.max(...numberTops) - Math.min(...numberTops)).toBeLessThanOrEqual(2);
    expect(labelHeights.every((height) => Number.parseFloat(height) > 0)).toBe(true);
    for (const number of await numbers.all()) {
      await expect(number).toHaveCSS('white-space', 'nowrap');
      const metrics = await number.evaluate((element) => ({
        width: element.getBoundingClientRect().width,
        scrollWidth: element.scrollWidth,
      }));
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.width + 1);
    }
  });
});

test.describe('Task 6 homepage at 390 × 844', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chromium');
  });

  test('uses a 2 × 2 specification grid with no overflow', async ({ page }) => {
    await openHomepage(page, mobile);
    const sizes = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    const stats = page.locator('#key-specifications .stats');
    const columns = await stats.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
    const numberTops = await page.locator('#key-specifications .stat__num').evaluateAll(
      (elements) => elements.map((element) => element.getBoundingClientRect().top),
    );

    expect(sizes.documentWidth).toBeLessThanOrEqual(sizes.viewportWidth);
    expect(columns).toBe(2);
    expect(Math.abs(numberTops[0] - numberTops[1])).toBeLessThanOrEqual(2);
    expect(Math.abs(numberTops[2] - numberTops[3])).toBeLessThanOrEqual(2);
  });

  test('loads complete content and application images without tall cropping', async ({ page }) => {
    await openHomepage(page, mobile);
    const images = page.locator('.split__visual img, .app__image');
    await expect(images).toHaveCount(5);
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    }
    const metrics = await images.evaluateAll((elements) => elements.map((image) => {
      const element = image as HTMLImageElement;
      const rect = element.getBoundingClientRect();
      return {
        complete: element.complete,
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight,
        renderedRatio: rect.width / rect.height,
        naturalRatio: element.naturalWidth / element.naturalHeight,
        objectFit: getComputedStyle(element).objectFit,
      };
    }));

    for (const image of metrics) {
      expect(image.complete).toBe(true);
      expect(image.naturalWidth).toBeGreaterThan(0);
      expect(image.renderedRatio).toBeGreaterThanOrEqual(1.45);
      expect(Math.abs(image.renderedRatio - image.naturalRatio)).toBeLessThanOrEqual(0.1);
      expect(image.objectFit).toBe('contain');
    }
  });

  test('keeps five usable dots and disables autoplay for reduced motion', async ({ page }) => {
    await openHomepage(page, mobile, 'reduce');
    const hero = page.locator('.hero');
    const dots = page.getByRole('button', { name: /Show slide \d of 5/ });

    await expect(dots).toHaveCount(5);
    await expect(hero).toHaveAttribute('data-autoplay', 'disabled');
    for (let index = 0; index < 5; index += 1) {
      await dots.nth(index).click();
      await expect(dots.nth(index)).toHaveAttribute('aria-current', 'true');
    }
    await expect(page.locator('.hero__slide--active')).toHaveAttribute('data-index', '4');
  });

  test('keeps the ARCLIFT hero subject visible and preserves CTA anchors', async ({ page }) => {
    await openHomepage(page, mobile);
    const firstSlide = page.locator('.hero__slide').first();
    const background = await firstSlide.evaluate((element) => getComputedStyle(element).backgroundImage);

    expect(background).toContain('hero-1-arclift.webp');
    await expect(page.getByRole('link', { name: 'Get a Quote' }).first()).toHaveAttribute('href', '/contact/');
    await expect(page.getByRole('link', { name: 'Explore Products' })).toHaveAttribute('href', '/products/');
    await expect(page.locator('#key-specifications')).toBeVisible();
  });

  test('keeps the closed mobile drawer out of the keyboard focus order', async ({ page }) => {
    await openHomepage(page, mobile);
    const drawer = page.locator('#mobile-drawer');
    const toggle = page.getByRole('button', { name: 'Toggle navigation' });

    await expect(drawer).toHaveAttribute('inert', '');
    await expect(drawer).toHaveAttribute('aria-hidden', 'true');
    await toggle.focus();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.querySelector('#mobile-drawer')?.contains(document.activeElement))).toBe(false);

    await toggle.click();
    await expect(drawer).not.toHaveAttribute('inert', '');
    await expect(drawer).toHaveAttribute('aria-hidden', 'false');
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.querySelector('#mobile-drawer')?.contains(document.activeElement))).toBe(true);

    await page.keyboard.press('Escape');
    await expect(drawer).toHaveAttribute('inert', '');
    await expect(drawer).toHaveAttribute('aria-hidden', 'true');
    await expect(toggle).toBeFocused();
  });
});
