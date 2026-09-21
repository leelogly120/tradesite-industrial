import { expect, test, type Page } from '@playwright/test';

const mobileWidths = [360, 390] as const;

async function expectNoBrokenImages(page: Page) {
  const images = page.locator('img');
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(
      () => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0),
    ).toBe(true);
  }
}

async function expectVisibleFigureDisclosures(page: Page) {
  const figures = page.locator('figure[data-editorial-visual], figure[data-equipment-family]');
  await expect(figures).not.toHaveCount(0);
  for (const figure of await figures.all()) {
    await expect(figure.locator('figcaption')).toBeVisible();
  }
}

test.describe('About page mobile integrity', () => {
  for (const width of mobileWidths) {
    test('keeps the supplier story readable without horizontal overflow at ' + width + 'px', async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/about/');
      await page.waitForLoadState('networkidle');

      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByText('integrated equipment supplier', { exact: false }).first()).toBeVisible();
      await expect(page.getByText('technical selection and supply partner', { exact: false }).first()).toBeVisible();
      await expect(page.locator('.about-hero')).not.toContainText(/equipment solutions supplier/i);

      const story = page.locator('.story');
      const columns = await story.evaluate((element) => getComputedStyle(element).gridTemplateColumns);
      expect(columns.trim().split(/\s+/)).toHaveLength(1);

      const storyImage = story.locator('img');
      await expect.poll(
        () => storyImage.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0),
      ).toBe(true);
      const imagePresentation = await storyImage.evaluate((image: HTMLImageElement) => {
        const box = image.getBoundingClientRect();
        return {
          objectFit: getComputedStyle(image).objectFit,
          renderedRatio: box.width / box.height,
          naturalRatio: image.naturalWidth / image.naturalHeight,
        };
      });
      expect(imagePresentation.objectFit).toBe('contain');
      expect(Math.abs(imagePresentation.renderedRatio - imagePresentation.naturalRatio)).toBeLessThanOrEqual(0.1);
      await expect(story.locator('figcaption')).toBeVisible();
    });
  }
});

test('makes roof-level panel forming the primary application route without hiding the other tasks', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/applications/');
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('heading', { level: 1 })).toContainText(/roof-level forming/i);
  await expect(page.locator('[data-application-route="roof-forming"]')).toContainText(/Roof-level roll forming/);
  const routes = page.locator('[data-application-route]');
  await expect(routes).toHaveCount(3);
  await expect(routes.first()).toHaveAttribute('data-application-route', 'roof-forming');

  for (const href of ['/applications/warehouse/', '/applications/stadium/', '/applications/airport/']) {
    await expect(page.locator('a[href="' + href + '"]').first()).toBeVisible();
  }

  await expect(page.locator('body')).not.toContainText(/all-terrain tracks|our engineering team|approve final configuration|remote control/i);
  for (const figure of await page.locator('main figure').all()) {
    await expect(figure.locator('figcaption')).toBeVisible();
    await expect(figure.locator('figcaption')).toContainText(/reference/i);
  }
  await expectNoBrokenImages(page);

  const firstRouteLink = routes.first().getByRole('link', { name: /Warehouse & industrial roofs/i });
  await firstRouteLink.focus();
  await expect(firstRouteLink).toBeFocused();
});

test('keeps every application detail page task-specific, disclosed and connected to its guides', async ({ page }) => {
  const pages = [
    {
      path: '/applications/warehouse/',
      heading: /roof-level forming|industrial roof/i,
      guide: '/blog/roof-level-roll-forming-long-panels/',
    },
    {
      path: '/applications/stadium/',
      heading: /stadium.*ceiling/i,
      guide: '/blog/stadium-ceiling-access-platform-planning/',
    },
    {
      path: '/applications/airport/',
      heading: /airport.*ceiling/i,
      guide: '/blog/airport-terminal-maintenance-access-planning/',
    },
  ];

  for (const application of pages) {
    await page.goto(application.path);
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(application.heading);
    await expect(page.locator('a[href="' + application.guide + '"]').first()).toBeVisible();
    if (application.path === '/applications/warehouse/') {
      await expect(page.locator('.application-intro a[href="/products/#crawler-roll-forming-lifts"]')).toBeVisible();
      await expect(page.locator('.application-intro a[href="/products/#truck-mounted-roll-forming-lifts"]')).toBeVisible();
    }
    await expect(page.locator('body')).not.toContainText(/guaranteed|approved for|all-terrain|engineering team/i);
    await expectVisibleFigureDisclosures(page);
    await expectNoBrokenImages(page);
  }
});

test('publishes a compact first-page directory linking to all 50 existing guides', async ({ page }) => {
  await page.goto('/blog/');
  await page.waitForLoadState('networkidle');

  const directory = page.locator('[data-guide-directory]');
  await expect(directory).toBeVisible();
  await expect(directory.locator('details')).toHaveCount(10);
  const directoryLinks = directory.locator('a[href^="/blog/"]');
  await expect(directoryLinks).toHaveCount(50);
  const hrefs = await directoryLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(new Set(hrefs).size).toBe(50);
  await expect(directory).not.toContainText(/ordinary page link|does not create new article URLs/i);
  const firstTopic = directory.locator('details').first();
  const firstSummary = firstTopic.locator('summary');
  await firstSummary.focus();
  await expect(firstSummary).toBeFocused();
  await firstSummary.press('Enter');
  await expect(firstTopic).toHaveAttribute('open', '');
  await expect(firstTopic.locator('a').first()).toBeVisible();
  await expect(page.locator('.starter-guides')).toBeVisible();
  await expect(page.locator('.blog-grid .blog-card')).toHaveCount(20);
  expect(await page.locator('.hero-banner').evaluate((element) => getComputedStyle(element).backgroundImage))
    .not.toContain('url(');

  await page.goto('/blog/page/2/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('[data-guide-directory]')).toHaveCount(0);
  await expect(page.locator('.blog-grid .blog-card')).toHaveCount(20);
});
