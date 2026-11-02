import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { parse } from 'parse5';
import sharp from 'sharp';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { describe, expect, it } from 'vitest';
import { auditFiles, EXTENDED_LAUNCH_SLUGS } from '../scripts/audit-lift-platform-content.mjs';
import { buyerArticleFailures } from '../scripts/lib/buyer-article-audit.mjs';
import { REVISED_BUYER_ARTICLE_SLUGS } from '../scripts/revised-buyer-articles.mjs';
import { REFERENCE_PHOTO_ARTICLES } from '../scripts/reference-photo-articles.mjs';
import { BUYER_ARTICLE_SLUGS } from '../scripts/lift-platform-article-registry.mjs';
import { CURRENT_ARTICLE_COUNT, CURRENT_SITEMAP_COUNT, CURRENT_REFERENCE_PHOTO_COUNT } from './helpers/current-release.mjs';
import { fourArticleRelease as fixture, retainedPhotoArticle, precedingManifestBytes } from './helpers/four-article-release.mjs';

const root = resolve(import.meta.dirname, '..');
const source = slug => readFile(resolve(root, 'src/content/blog', slug + '.md'), 'utf8');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const sourceSha = text => sha256(text.replace(/\r\n/g, '\n'));
const nodes = node => node ? [node, ...(node.childNodes ?? []).flatMap(nodes)] : [];
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const text = node => !node ? '' : node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join(' ');
const hasClass = (node, name) => (attr(node, 'class') ?? '').split(/\s+/).includes(name);

describe('four revised existing articles alongside the 70 newly published buyer guides', () => {
  it('retains all 126 other manuscripts and preserves all original routes alongside the 70 registered additions', async () => {
    expect(fixture.articles).toHaveLength(4);
    expect(fixture.retainedArticles).toHaveLength(126);
    const original = [...fixture.retainedArticles, ...fixture.articles].map(article => article.slug);
    expect(original).toHaveLength(130);
    expect(BUYER_ARTICLE_SLUGS).toHaveLength(70);
    expect(BUYER_ARTICLE_SLUGS.filter(slug => original.includes(slug))).toEqual([]);
    const expected = [...original, ...BUYER_ARTICLE_SLUGS].sort();
    expect(new Set(expected).size).toBe(CURRENT_ARTICLE_COUNT);
    const actual = (await readdir(resolve(root, 'src/content/blog'))).filter(name => name.endsWith('.md')).map(name => name.slice(0, -3)).sort();
    expect(actual).toEqual(expected);
    expect([...EXTENDED_LAUNCH_SLUGS].sort()).toEqual(expected);
    expect([...REVISED_BUYER_ARTICLE_SLUGS].sort()).toEqual(fixture.articles.map(article => article.slug).sort());
    expect(Object.isFrozen(REVISED_BUYER_ARTICLE_SLUGS)).toBe(true);
    for (const article of fixture.retainedArticles) expect(sourceSha(await source(article.slug)), article.slug).toBe(article.sha256);
  });

  it.each(fixture.articles)('$slug retains its publication date and passes both legacy and buyer quality checks', async article => {
    const markdown = await source(article.slug);
    expect(sourceSha(markdown)).toBe(article.sha256);
    const file = resolve(root, 'src/content/blog', article.slug + '.md');
    expect((await auditFiles([file])).files[file]).toMatchObject({ fatal: false, failures: [], publishable: true, score: 100 });
    const { frontmatter } = parseFrontmatter(markdown);
    expect(new Date(frontmatter.date).toISOString()).toBe('2026-10-26T00:00:00.000Z');
    expect(new Date(frontmatter.updated).toISOString()).toBe('2026-11-02T00:00:00.000Z');
    const qualityCopy = markdown.replace(/^(---\r?\n[\s\S]*?\r?\n)date: 2026-10-26(?=\r?\n)/, '$1date: 2026-11-02');
    expect(buyerArticleFailures(qualityCopy, '2026-11-02')).toEqual([]);
    expect(REFERENCE_PHOTO_ARTICLES.find(photo => photo.slug === article.slug)).toEqual(article.photos);
  });

  it.each(fixture.articles)('$slug renders its opening conclusion, photographs and accurate modification metadata', async article => {
    const html = nodes(parse(await readFile(resolve(root, 'dist/blog', article.slug, 'index.html'), 'utf8')));
    const lead = html.find(node => hasClass(node, 'article__buyer-lead'));
    expect(lead).toBeDefined();
    const { content } = parseFrontmatter(await source(article.slug));
    const opening = content.replace(/<!--[\s\S]*?-->/g, '').trim().split(/\n\s*\n/)[0].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
    expect(text(lead).replace(/\s+/g, ' ').trim()).toBe(opening);
    expect(html.some(node => hasClass(node, 'article__hero--buyer'))).toBe(true);
    expect(html.some(node => node.tagName === 'h4' && text(node).trim() === 'Editorial & Technical Note')).toBe(false);
    const hero = html.find(node => hasClass(node, 'article__hero'));
    const body = html.find(node => hasClass(node, 'article-content'));
    expect(nodes(hero).filter(node => node.tagName === 'img').map(node => attr(node, 'src'))).toEqual(article.photos.cover);
    expect(nodes(body).filter(node => node.tagName === 'img').map(node => attr(node, 'src'))).toEqual(article.photos.body);
    expect(html.filter(node => node.tagName === 'link' && attr(node, 'rel') === 'canonical').map(node => attr(node, 'href'))).toEqual([`https://www.arclifteq.com/blog/${article.slug}/`]);
    const schema = html.filter(node => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json').map(node => JSON.parse((node.childNodes ?? []).map(child => child.value ?? '').join(''))).find(data => data['@type'] === 'BlogPosting');
    expect(schema).toMatchObject({ datePublished: '2026-10-26T00:00:00.000Z', dateModified: '2026-11-02T00:00:00.000Z' });
    const sitemap = await readFile(resolve(root, 'dist/sitemap-0.xml'), 'utf8');
    expect([...sitemap.matchAll(/<loc>/g)]).toHaveLength(CURRENT_SITEMAP_COUNT);
    expect(sitemap).not.toMatch(/\/blog\/page(?:\/|<)/);
    const entry = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].find(match => match[1].includes(`/blog/${article.slug}/</loc>`))?.[1];
    expect(entry).toMatch(/<lastmod>2026-11-02(?:T[^<]*)?<\/lastmod>/);
  });

  it.each(fixture.addedPhotos)('$record.url preserves the reviewed pixels, dimensions and public metadata', async ({ record, sha256: expectedSha }) => {
    const manifest = JSON.parse(await readFile(resolve(root, 'public/images/asset-manifest.json'), 'utf8'));
    expect(manifest.referencePhotos).toHaveLength(CURRENT_REFERENCE_PHOTO_COUNT);
    expect(manifest.referencePhotos.find(photo => photo.url === record.url)).toEqual(record);
    const bytes = await readFile(resolve(root, 'public' + record.url));
    expect(sha256(bytes)).toBe(expectedSha);
    const image = sharp(bytes, { failOn: 'warning' });
    const metadata = await image.metadata();
    expect(metadata.format).toBe('webp');
    expect([metadata.width, metadata.height]).toEqual([record.width, record.height]);
    for (const field of ['exif', 'xmp', 'iptc', 'icc']) expect(metadata[field], record.url + ': ' + field).toBeUndefined();
    const decoded = await image.raw().toBuffer({ resolveWithObject: true });
    expect(decoded.data.length).toBe(record.width * record.height * decoded.info.channels);
  });

  it('limits compatibility to the exact reviewed four mappings and eight manifest additions', async () => {
    for (const article of fixture.articles) {
      expect(retainedPhotoArticle(article.beforePhotos)).toEqual(article.photos);
      expect(retainedPhotoArticle(article.photos)).toEqual(article.photos);
      expect(() => retainedPhotoArticle({ ...article.beforePhotos, body: ['/images/unreviewed.webp'] })).toThrow(/Unknown/);
    }
    const bytes = await readFile(resolve(root, 'public/images/asset-manifest.json'));
    expect(JSON.parse(precedingManifestBytes(bytes)).referencePhotos).toHaveLength(CURRENT_REFERENCE_PHOTO_COUNT - fixture.addedPhotos.length);
    const altered = JSON.parse(bytes);
    altered.referencePhotos.find(photo => photo.url === fixture.addedPhotos[0].record.url).width += 1;
    expect(() => precedingManifestBytes(Buffer.from(JSON.stringify(altered)))).toThrow(/Unknown/);
    altered.referencePhotos = altered.referencePhotos.filter(photo => photo.url !== fixture.addedPhotos[0].record.url);
    expect(() => precedingManifestBytes(Buffer.from(JSON.stringify(altered)))).toThrow(/exactly eight/);
  });

  it('runs the release regression in the permanent content gate', async () => {
    const { scripts } = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
    expect(scripts['test:content'].split(/\s+/)).toContain('tests/four-article-release.test.mjs');
  });
});
