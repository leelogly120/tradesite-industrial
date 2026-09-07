import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

async function datePolicy() {
  expect(existsSync(resolve('scripts/lib/article-updated-dates.mjs')), 'sitemap needs explicit article update dates').toBe(true);
  return import('../scripts/lib/article-updated-dates.mjs');
}

describe('sitemap article modification dates', () => {
  it('uses an explicit update date, not the date of the build or original publication', async () => {
    const { articleUpdatedDate } = await datePolicy();
    expect(articleUpdatedDate('---\ndate: 2026-07-25\nupdated: 2026-09-07\n---\nBody')).toBe('2026-09-07');
    expect(articleUpdatedDate('---\ndate: 2026-07-25\n---\nBody')).toBeUndefined();
  });

  it('does not accept invalid calendar dates or dates mentioned only in body examples', async () => {
    const { articleUpdatedDate } = await datePolicy();
    expect(articleUpdatedDate('---\nupdated: 2026-02-30\n---\nBody')).toBeUndefined();
    expect(articleUpdatedDate('---\ntitle: A guide\n---\nupdated: 2026-09-07')).toBeUndefined();
  });

  it('attaches lastmod only to a matching article and leaves other sitemap properties alone', async () => {
    const { applyArticleLastmod } = await datePolicy();
    const dates = new Map([['/blog/roof-level-roll-forming-long-panels/', '2026-09-07']]);
    const item = { url: 'https://www.arclifteq.com/blog/roof-level-roll-forming-long-panels/', links: [{ lang: 'en-US', url: 'https://www.arclifteq.com/blog/roof-level-roll-forming-long-panels/' }] };
    expect(applyArticleLastmod(item, dates)).toEqual({ ...item, lastmod: '2026-09-07' });
    expect(item).not.toHaveProperty('lastmod');
    expect(applyArticleLastmod({ url: 'https://www.arclifteq.com/products/' }, dates)).toEqual({ url: 'https://www.arclifteq.com/products/' });
  });
});
