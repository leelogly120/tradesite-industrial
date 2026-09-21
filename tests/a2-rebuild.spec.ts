import { expect, test } from '@playwright/test';

test('product-family deep links clear both the site header and comparison bar', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/products/');
  await page.waitForLoadState('networkidle');
  await page.locator('#equipment-routes a[href="#crawler-roll-forming-lifts"]').click();
  await expect.poll(async () => {
    const heading = await page.locator('#crawler-roll-forming-lifts .family-card h2').boundingBox();
    const comparison = await page.locator('.comparison').boundingBox();
    return heading!.y >= comparison!.y + comparison!.height + 8;
  }).toBe(true);
  await page.goto('/products/#crawler-roll-forming-lifts');
  await expect.poll(async () => {
    const heading = await page.locator('#crawler-roll-forming-lifts .family-card h2').boundingBox();
    const comparison = await page.locator('.comparison').boundingBox();
    return heading!.y >= comparison!.y + comparison!.height + 8;
  }).toBe(true);
});

test('Contact keeps its legacy form styling with either pathname spelling', async ({ page }) => {
  for (const path of ['/contact', '/contact/']) {
    await page.goto(path);
    await expect(page.locator('body')).toHaveClass('design-contact');
    await expect(page.locator('#inquiry-form')).toBeVisible();
  }
});

test('mobile hero actions are not covered by the persistent WhatsApp control', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  for (const link of await page.locator('.a2-hero .a2-actions a').all()) {
    await link.scrollIntoViewIfNeeded();
    expect(await link.evaluate(el => {
      const box = el.getBoundingClientRect();
      return [[box.left + 3, box.top + 3], [box.right - 3, box.bottom - 3]].every(([x,y]) => el.contains(document.elementFromPoint(x,y)));
    })).toBe(true);
  }
});

test('retained article uses the new light reading surface instead of stale component styling', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/blog/roof-level-roll-forming-long-panels/');
  await expect(page.locator('.hero-banner')).toHaveCSS('background-image', 'none');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('color', 'rgb(18, 59, 80)');
  await expect(page.locator('.article-content')).toHaveCSS('font-size', '19px');
  await expect(page.locator('.article-content')).toBeVisible();
});

test('equipment-led home shows a real complete machine before its inquiry action on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const photo = page.locator('[data-equipment-hero] img').first();
  await expect(photo).toBeVisible();
  await expect.poll(() => photo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  const title = await page.getByRole('heading', { level: 1 }).boundingBox();
  const image = await photo.boundingBox();
  const action = await page.getByRole('link', { name: 'Explore lifting systems', exact: true }).boundingBox();
  expect(title!.y + title!.height).toBeLessThan(image!.y);
  expect(image!.y + image!.height).toBeLessThan(action!.y);
  await page.getByRole('link', { name: 'Explore lifting systems', exact: true }).click();
  await expect(page).toHaveURL(/\/products\/$/);
  await expect(page.locator('#truck-mounted-roll-forming-lifts')).toBeAttached();
  await expect(page.locator('#crawler-roll-forming-lifts')).toBeAttached();
});

for (const width of [320, 390, 768, 1440]) {
  test(`A2 entry pages remain readable without horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const route of ['/', '/products/', '/blog/', '/applications/']) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), route).toBe(true);
      expect(await page.locator('body').evaluate(el => getComputedStyle(el).fontFamily)).toContain('Barlow');
    }
  });
}

test('product overview keeps all fifteen references and guides reachable without scripts', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/products/');
  const links = await page.locator('main a[href^="/products/"]').evaluateAll(elements => [...new Set(elements.map(el => el.getAttribute('href')).filter(href => /^\/products\/[^/#]+\/$/.test(href!)))]);
  expect(links).toHaveLength(15);
  await page.goto('/blog/');
  const guides = await page.locator('[data-guide-directory] a').count();
  expect(guides).toBe(50);
  await context.close();
});
