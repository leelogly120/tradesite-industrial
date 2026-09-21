import { expect, test } from '@playwright/test';

async function openHomepage(page, width = 1440) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
}

test('shows a static real-equipment hero and two primary lifting routes', async ({ page }) => {
  await openHomepage(page);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Lift the roll former.');
  await expect(page.locator('.hero__carousel, .hero__slide, .hero__dot')).toHaveCount(0);
  await expect(page.locator('.a2-route')).toHaveCount(2);
  await expect(page.locator('.a2-route a[href="/products/#truck-mounted-roll-forming-lifts"]')).toBeVisible();
  await expect(page.locator('.a2-route a[href="/products/#crawler-roll-forming-lifts"]')).toBeVisible();
  await expect(page.locator('#ceiling')).toContainText('A separate product line');
});

test('preserves contact destinations and loads fonts locally', async ({ page }) => {
  const remoteFonts: string[] = [];
  page.on('request', request => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(new URL(request.url()).hostname)) remoteFonts.push(request.url());
  });
  await openHomepage(page, 390);
  expect(remoteFonts).toEqual([]);
  await expect(page.getByRole('link', { name: 'Explore lifting systems', exact: true })).toHaveAttribute('href', '/products/');
  await expect(page.getByRole('link', { name: 'Send your equipment brief', exact: true })).toHaveAttribute('href', '/contact/');
  await expect(page.locator('.a2-contact-links a').first()).toHaveAttribute('href', 'https://wa.me/8615617687185');
  await expect(page.locator('.a2-contact-links a').last()).toHaveAttribute('href', 'mailto:leelogly120@gmail.com');
  await expect(page.locator('#matching')).toContainText('Height alone is not a complete selection brief');
});

test('desktop keeps the real machine beside the message without enlarging source photos', async ({ page }) => {
  await openHomepage(page);
  const heading = await page.getByRole('heading', { level: 1 }).boundingBox();
  const machine = await page.locator('.a2-equipment-main img').boundingBox();
  expect(machine!.x).toBeGreaterThan(heading!.x + heading!.width);
  for(const image of await page.locator('main img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    expect(await image.evaluate((img: HTMLImageElement) => img.getBoundingClientRect().width <= img.naturalWidth + 1)).toBe(true);
  }
});

test('mobile real photos keep their full proportions and scoped captions', async ({ page }) => {
  await openHomepage(page, 390);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const images = page.locator('main img');
  await expect(images).toHaveCount(5);
  for(const image of await images.all()) {
    if(!await image.isVisible()) continue;
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    const ratio = await image.evaluate((img: HTMLImageElement) => Math.abs(img.getBoundingClientRect().width/img.getBoundingClientRect().height-img.naturalWidth/img.naturalHeight));
    expect(ratio).toBeLessThan(.02);
    await expect(image).toHaveCSS('object-fit', 'contain');
  }
  await expect(page.locator('.a2-hero-media')).toContainText('Equipment reference views');
  await expect(page.locator('.a2-route').first()).toContainText('not roof-panel production');
  await expect(page.locator('.a2-route').last()).toContainText('not an operating setup');
  await expect(page.locator('#ceiling')).toContainText('loads need separate confirmation');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('mobile menu stays inert when closed, traps focus when open and restores focus on Escape', async ({ page }) => {
  await openHomepage(page, 390);
  const drawer = page.locator('#mobile-drawer');
  const toggle = page.getByRole('button', { name: 'Toggle navigation' });
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

test('does not download obsolete carousel or synthetic homepage imagery', async ({ page }) => {
  const requested = new Set<string>();
  page.on('request', request => requested.add(new URL(request.url()).pathname));
  await openHomepage(page, 390);
  for(const image of await page.locator('main img').all()) if(await image.isVisible()) await image.scrollIntoViewIfNeeded();
  for(const path of requested) {
    expect(path.startsWith('/images/hero/')).toBe(false);
    expect(path.startsWith('/images/home/')).toBe(false);
  }
});
