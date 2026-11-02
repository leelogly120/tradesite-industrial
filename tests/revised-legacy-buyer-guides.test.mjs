import { retainedArticleSha256 } from './helpers/retained-production-content.mjs';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { parse } from 'parse5';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { describe, expect, it } from 'vitest';
import { auditFiles } from '../scripts/audit-lift-platform-content.mjs';
import { buyerArticleFailures } from '../scripts/lib/buyer-article-audit.mjs';
import { buyerCohortForSlug } from '../scripts/lift-platform-article-registry.mjs';

const root = resolve(import.meta.dirname, '..');
const slugs = [
  'ceiling-platform-charging-and-parking-brief',
  'ceiling-platform-control-view-between-workfaces',
  'roll-forming-lift-control-cabinet-site-conditions',
  'roll-forming-lift-cutting-signal-interface',
];
const source = slug => readFile(resolve(root, 'src/content/blog', slug + '.md'), 'utf8');
const sha256 = value => createHash('sha256').update(value.replace(/\r\n/g, '\n')).digest('hex');
const fixture = async () => JSON.parse(await readFile(resolve(root, 'tests/fixtures/november-02-legacy-revisions.json'), 'utf8'));
const nodes = node => node ? [node, ...(node.childNodes ?? []).flatMap(nodes)] : [];
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const text = node => !node ? '' : node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join(' ');
const hasClass = (node, name) => (attr(node, 'class') ?? '').split(/\s+/).includes(name);

describe('four authorized November 2 legacy article revisions', () => {
  it.each(slugs)('%s passes the legacy audit and current buyer quality without changing its publication date or cohort', async slug => {
    const path = resolve(root, 'src/content/blog', slug + '.md');
    const report = await auditFiles([path]);
    expect(report.files[path], slug).toMatchObject({ fatal: false, failures: [], publishable: true, score: 100 });
    expect(buyerCohortForSlug(slug)).toBeUndefined();
    const markdown = await source(slug);
    const { frontmatter } = parseFrontmatter(markdown);
    expect(new Date(frontmatter.date).toISOString()).toBe('2026-10-26T00:00:00.000Z');
    expect(new Date(frontmatter.updated).toISOString()).toBe('2026-11-02T00:00:00.000Z');
    // Apply current copy/photo checks to an older publication, without rerouting its real audit.
    const normalized = markdown.replace(/^(---\r?\n[\s\S]*?\r?\n)date: 2026-10-26(?=\r?\n)/, '$1date: 2026-11-02');
    expect(buyerArticleFailures(normalized, '2026-11-02'), slug).toEqual([]);
  });

  it('pins exactly four reviewed revisions and rejects unknown manuscript or photo predecessors', async () => {
    const revisions = await fixture();
    const { REVISED_BUYER_ARTICLE_SLUGS } = await import('../scripts/revised-buyer-articles.mjs');
    const { retainedArticleSha256, retainedPhotoArticle } = await import('./helpers/retained-production-content.mjs');
    const historical = JSON.parse(await readFile(resolve(root, 'tests/fixtures/november-02-buyer-baseline.json'), 'utf8'));
    expect([...REVISED_BUYER_ARTICLE_SLUGS].sort()).toEqual(slugs);
    expect(Object.isFrozen(REVISED_BUYER_ARTICLE_SLUGS)).toBe(true);
    expect(revisions.articles.map(article => article.slug).sort()).toEqual(slugs);
    for (const revision of revisions.articles) {
      const old = historical.articles.find(article => article.slug === revision.slug);
      const oldPhotos = historical.referencePhotoArticles.find(article => article.slug === revision.slug);
      expect(revision.beforeSha256).toBe(old.sha256);
      expect(revision.beforePhotos).toEqual(oldPhotos);
      expect(revision.sha256).not.toBe(revision.beforeSha256);
      expect(sha256(await source(revision.slug))).toBe(revision.sha256);
      expect(retainedArticleSha256(old)).toBe(revision.sha256);
      expect(retainedArticleSha256({ slug: revision.slug, sha256: revision.sha256 })).toBe(revision.sha256);
      expect(() => retainedArticleSha256({ slug: revision.slug, sha256: '0'.repeat(64) })).toThrow(/Unknown/);
      expect(retainedPhotoArticle(oldPhotos)).toEqual(revision.photos);
      expect(retainedPhotoArticle(revision.photos)).toEqual(revision.photos);
      expect(() => retainedPhotoArticle({ ...oldPhotos, body: ['/images/equipment/unreviewed.webp'] })).toThrow(/Unknown/);
    }
  });

  it('preserves the other 196 articles, including all ten new November 2 manuscripts', async () => {
    const historical = JSON.parse(await readFile(resolve(root, 'tests/fixtures/november-02-buyer-baseline.json'), 'utf8'));
    const revisions = await fixture();
    const retained = [...historical.articles.filter(article => !slugs.includes(article.slug)), ...revisions.retainedNovember02Articles];
    expect(retained).toHaveLength(196);
    expect(new Set(retained.map(article => article.slug)).size).toBe(196);
    expect(revisions.retainedNovember02Articles).toHaveLength(10);
    for (const article of retained) expect(sha256(await source(article.slug)), article.slug).toBe(retainedArticleSha256(article));
  });

  it.each(slugs)('%s renders its conclusion first and publishes truthful modification metadata', async slug => {
    const html = nodes(parse(await readFile(resolve(root, 'dist/blog', slug, 'index.html'), 'utf8')));
    const lead = html.find(node => hasClass(node, 'article__buyer-lead'));
    expect(lead, slug).toBeDefined();
    const { content } = parseFrontmatter(await source(slug));
    const opening = content.replace(/<!--[\s\S]*?-->/g, '').trim().split(/\n\s*\n/)[0].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
    expect(text(lead).replace(/\s+/g, ' ').trim()).toBe(opening);
    expect(html.some(node => hasClass(node, 'article__hero--buyer'))).toBe(true);
    expect(html.some(node => node.tagName === 'h4' && text(node).trim() === 'Editorial & Technical Note')).toBe(false);
    const schema = html.filter(node => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json').map(node => JSON.parse((node.childNodes ?? []).map(child => child.value ?? '').join(''))).find(data => data['@type'] === 'BlogPosting');
    expect(schema).toMatchObject({ datePublished: '2026-10-26T00:00:00.000Z', dateModified: '2026-11-02T00:00:00.000Z' });
    const sitemap = await readFile(resolve(root, 'dist/sitemap-0.xml'), 'utf8');
    const entry = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].find(match => match[1].includes(`/blog/${slug}/</loc>`))?.[1];
    expect(entry).toMatch(/<lastmod>2026-11-02(?:T[^<]*)?<\/lastmod>/);
  });
});
