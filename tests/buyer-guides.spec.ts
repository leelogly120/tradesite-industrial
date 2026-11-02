import { test, expect } from '@playwright/test';
import { BUYER_ARTICLES } from '../scripts/lift-platform-article-registry.mjs';

for (const article of BUYER_ARTICLES) {
  test(`buyer guide: ${article.slug} presents its decision, photographs and quotation route`, async ({ page }) => {
    await page.goto(`/blog/${article.slug}/`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(article.title);
    const lead = page.locator('.article__buyer-lead');
    await expect(lead).toBeVisible();
    const leadBox = await lead.boundingBox();
    expect(leadBox).not.toBeNull();
    expect(leadBox!.y + leadBox!.height).toBeLessThanOrEqual(page.viewportSize()!.height + 2);
    await expect(page.getByText('Editorial & Technical Note', { exact: true })).toHaveCount(0);
    await expect(page.locator('.article__hero--buyer')).toBeVisible();

    const body = page.locator('.article-content');
    const images = page.locator('.article__hero img, .article-content img');
    expect(await images.count()).toBeGreaterThanOrEqual(3);
    expect(await images.count()).toBeLessThanOrEqual(5);
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
      await expect(image).toHaveAttribute('alt', /\S.{19,}/);
    }
    for (const table of await body.locator('table').all()) {
      await table.scrollIntoViewIfNeeded();
      await expect(table).toBeVisible();
      expect(await table.evaluate(element => element.clientWidth <= element.parentElement!.clientWidth + 1)).toBe(true);
    }
    const contact = body.locator('a[href^="/contact/"]').first();
    await contact.scrollIntoViewIfNeeded();
    await expect(contact).toBeVisible();
    await expect(body.locator('a[href="https://wa.me/8615515922444"]')).toBeVisible();
    await expect(body.locator('a[href="mailto:leelogly120@gmail.com"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });
}
