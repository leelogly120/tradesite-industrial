import { expect, test } from '@playwright/test';

const referenceLinkPattern = /^\/products\/(?:arc-[a-z0-9-]+)\/$/;

test.describe('family-first product discovery', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('keeps four family routes and all fifteen detail links visible without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto('/products/');

    const familyNavigation = page.getByRole('navigation', { name: 'Equipment families' });
    await expect(familyNavigation.getByRole('link')).toHaveCount(4);

    const familyTop = await familyNavigation.evaluate((navigation) => navigation.getBoundingClientRect().top + scrollY);
    const inputsTop = await page.locator('#product-inputs').evaluate((section) => section.getBoundingClientRect().top + scrollY);
    const firstFamilyHeading = page.getByRole('heading', { name: 'Crawler Roll Forming Lifts', exact: true }).first();
    const firstFamilyTop = await firstFamilyHeading.evaluate((heading) => heading.getBoundingClientRect().top + scrollY);

    expect(familyTop).toBeLessThan(inputsTop);
    expect(firstFamilyTop).toBeLessThan(inputsTop);
    const firstPrimaryRouteTop = (await page.locator('#equipment-routes .a2-route').first().boundingBox())!.y;
    expect(firstPrimaryRouteTop).toBeLessThan(844 * 1.75);
    await expect(page.locator('#equipment-routes a[href="#crawler-roll-forming-lifts"]')).toBeVisible();
    await expect(page.locator('#equipment-routes a[href="#truck-mounted-roll-forming-lifts"]')).toBeVisible();

    const hrefs = await page.locator('a[href^="/products/"]').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href') ?? '').filter((href) => /^\/products\/arc-[a-z0-9-]+\/$/.test(href)),
    );
    expect(new Set(hrefs).size).toBe(15);
    expect(hrefs.every((href) => referenceLinkPattern.test(href))).toBe(true);
    await context.close();
  });

  test('caps comparison at four, reports changes, and submits the exact same-family selection', async ({ page }) => {
    await page.goto('/products/');

    const choices = page.locator('[data-compare-item]');
    const summary = page.locator('#compare-summary');
    await expect(choices).toHaveCount(15);

    for (let index = 0; index < 4; index += 1) await choices.nth(index).check();
    await expect(summary).toContainText('4 references selected');
    await expect(choices.nth(4)).toBeDisabled();
    await expect(summary).toContainText(/maximum|up to four/i);

    await choices.nth(3).uncheck();
    await expect(summary).toContainText('3 references selected');
    await expect(choices.nth(4)).toBeEnabled();

    for (let index = 1; index < 4; index += 1) await choices.nth(index).uncheck();
    const firstSlug = await choices.nth(0).getAttribute('value');
    const secondSlug = await choices.nth(1).getAttribute('value');
    expect(firstSlug).toBeTruthy();
    expect(secondSlug).toBeTruthy();
    await choices.nth(1).check();
    await expect(summary).toContainText('2 references selected');

    await page.getByRole('button', { name: /Compare selected/ }).click();
    const query = new URL(page.url()).searchParams.get('items');
    expect(query?.split(',')).toEqual([firstSlug, secondSlug]);
  });

  test('keeps the selected comparison control in view without covering WhatsApp', async ({ page }) => {
    await page.goto('/products/');

    const lowerFamilyChoice = page.locator('[data-compare-item]').nth(10);
    await lowerFamilyChoice.scrollIntoViewIfNeeded();
    await lowerFamilyChoice.check();

    const placement = await page.evaluate(() => {
      const comparison = document.querySelector<HTMLElement>('.comparison');
      const whatsapp = document.querySelector<HTMLElement>('.wa');
      if (!comparison || !whatsapp) return null;
      const bar = comparison.getBoundingClientRect();
      const wa = whatsapp.getBoundingClientRect();
      return {
        barTop: bar.top,
        barBottom: bar.bottom,
        barHeight: bar.height,
        waTop: wa.top,
        viewportHeight: window.innerHeight,
      };
    });

    expect(placement).not.toBeNull();
    expect(placement!.barTop).toBeGreaterThanOrEqual(0);
    expect(placement!.barBottom).toBeLessThanOrEqual(placement!.viewportHeight);
    expect(placement!.barHeight).toBeLessThan(220);
    expect(placement!.barBottom).toBeLessThanOrEqual(placement!.waTop - 4);

    await page.getByRole('button', { name: 'Toggle navigation' }).click();
    await expect(page.getByRole('dialog', { name: 'Site navigation' })).toHaveAttribute('aria-hidden', 'false');
    const drawerOwnsBarPoint = await page.evaluate(() => {
      const comparison = document.querySelector<HTMLElement>('.comparison');
      if (!comparison) return false;
      const bar = comparison.getBoundingClientRect();
      const topElement = document.elementFromPoint(bar.left + bar.width / 2, bar.top + bar.height / 2);
      return Boolean(topElement?.closest('.mobile-drawer, .drawer-overlay'));
    });
    expect(drawerOwnsBarPoint).toBe(true);
  });
});

test.describe('product detail decision order', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('puts the functional model-family introduction and project CTA before editorial imagery', async ({ page }) => {
    await page.goto('/products/arc-c21-crawler-roll-forming-lift/');

    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toContainText('ARC-C21');
    await expect(heading).toContainText(/Crawler Roll Forming Lift/i);
    await expect(page.locator('[data-product-workflow]')).toBeVisible();

    const order = await page.locator('main').evaluate((main) => {
      const nodes = [...main.querySelectorAll('h1, [data-product-workflow], [data-product-primary-cta], [data-product-diagram], .product-hero__gallery, #archive-reference')];
      return nodes.map((node) => {
        if (node.matches('h1')) return 'h1';
        if (node.matches('[data-product-workflow]')) return 'workflow';
        if (node.matches('[data-product-primary-cta]')) return 'cta';
        if (node.matches('[data-product-diagram]')) return 'diagram';
        if (node.matches('.product-hero__gallery')) return 'gallery';
        return 'archive';
      });
    });

    expect(order.indexOf('h1')).toBeLessThan(order.indexOf('workflow'));
    expect(order.indexOf('workflow')).toBeLessThan(order.indexOf('diagram'));
    expect(order.indexOf('cta')).toBeLessThan(order.indexOf('gallery'));
    expect(order.indexOf('gallery')).toBeLessThan(order.indexOf('archive'));
  });

  test('keeps the sticky decision navigation and its anchor target below the shared header', async ({ page }) => {
    await page.goto('/products/arc-c21-crawler-roll-forming-lift/');
    await page.getByRole('navigation', { name: 'Product decision sections' }).getByRole('link', { name: 'Archive reference' }).click();
    await page.waitForTimeout(700);

    await expect.poll(async () => page.evaluate(() => {
      const shared = document.querySelector<HTMLElement>('#nav');
      const decision = document.querySelector<HTMLElement>('.decision-nav');
      const target = document.querySelector<HTMLElement>('#archive-reference');
      if (!shared || !decision || !target) return false;
      const sharedBottom = shared.getBoundingClientRect().bottom;
      const decisionRect = decision.getBoundingClientRect();
      const targetTop = target.getBoundingClientRect().top;
      return decisionRect.top >= sharedBottom - 2 && targetTop >= decisionRect.bottom - 2;
    })).toBe(true);
  });
});

test.describe('comparison orientation', () => {
  test('explains the four unlike equipment architectures while preserving direct and selected views', async ({ page }) => {
    await page.goto('/compare/');

    const familyNavigation = page.getByRole('navigation', { name: 'Compare equipment families' });
    await expect(familyNavigation.getByRole('link')).toHaveCount(4);
    await expect(page.getByRole('heading', { name: 'Crawler raised forming line' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Truck-mounted raised forming line' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Separate ceiling work-deck concept' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Panel-forming line' })).toBeVisible();
    await expect(page.locator('.compare-intro > p').filter({ hasText: /C25.*T25.*F20.*RF8/i })).toBeVisible();

    await page.goto('/compare/?items=arc-c17-crawler-roll-forming-lift,arc-c21-crawler-roll-forming-lift');
    const selectedTable = page.getByRole('table', { name: 'Archived references and project-review boundaries' });
    await expect(selectedTable.getByRole('link', { name: 'ARC-C17' })).toBeVisible();
    await expect(selectedTable.getByRole('link', { name: 'ARC-C21' })).toBeVisible();
    await expect(selectedTable.getByRole('link', { name: 'ARC-T25' })).toHaveCount(0);
  });
});
