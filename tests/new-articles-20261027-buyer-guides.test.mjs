import { reviewedUpdateForSlug } from '../scripts/reviewed-buyer-updates.mjs';
import { retainedArticleSha256 } from './helpers/retained-production-content.mjs';
import { retainedRedirectBytes } from './helpers/retained-redirects.mjs';
import { readFile, readdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { parse } from 'parse5';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { OCTOBER_27_BUYER_ARTICLES, OCTOBER_26_CAMPAIGN_DAY3_ARTICLE_SLUGS } from '../scripts/lift-platform-article-registry.mjs';
import { auditFiles, EXTENDED_LAUNCH_SLUGS } from '../scripts/audit-lift-platform-content.mjs';
import { REFERENCE_PHOTO_ARTICLES } from '../scripts/reference-photo-articles.mjs';
import { GUIDE_TOPICS, getRelatedGuides } from '../src/lib/guide-navigation.ts';
import { NEW_PHOTO_URLS } from './helpers/october-27-release.mjs';
import { CURRENT_ARTICLE_COUNT, CURRENT_SITEMAP_COUNT, CURRENT_REFERENCE_PHOTO_COUNT, CURRENT_PAGE_SIZES, laterSlugsThan } from './helpers/current-release.mjs';

const root = resolve(import.meta.dirname, '..');
const baseline = JSON.parse(await readFile(resolve(root, 'tests/fixtures/october-27-buyer-baseline.json'), 'utf8'));
const slugs = OCTOBER_27_BUYER_ARTICLES.map(article => article.slug);
const frozenSlugs = [...baseline.articles.map(article => article.slug), ...slugs];
const expectedSlugs = [...frozenSlugs, ...laterSlugsThan(frozenSlugs)];
const origin = 'https://www.arclifteq.com';
const source = slug => readFile(resolve(root, 'src/content/blog', slug + '.md'), 'utf8');
const nodes = node => node ? [node, ...(node.childNodes ?? []).flatMap(nodes)] : [];
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const hasClass = (node, name) => (attr(node, 'class') ?? '').split(/\s+/).includes(name);
const text = node => !node ? '' : node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join(' ');
const built = async route => nodes(parse(await readFile(resolve(root, 'dist', '.' + route, 'index.html'), 'utf8')));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const privateIdentity = /\b[A-Za-z]:[\\/]|\/(?:Users|home)\/|DJI[_-]?\d+|(?:IMG|DSC)[_-]?\d+\.(?:jpe?g|png|webp)|Henan\s+Huaying|source-media|pdf-media|config-media|\.env\b/iu;

describe('October27: ten practical illustrated buyer decisions', () => {
  it('adds ten unused URLs and retains every byte of the preceding130 manuscripts', async () => {
    expect(baseline.articles).toHaveLength(130);
    expect(slugs).toHaveLength(10);
    expect(new Set(frozenSlugs).size).toBe(140);
    expect(new Set(expectedSlugs).size).toBe(CURRENT_ARTICLE_COUNT);
    for (const article of baseline.articles) expect(sha256((await source(article.slug)).replace(/\r\n/g, '\n')), article.slug).toBe(retainedArticleSha256(article));
    const files = (await readdir(resolve(root, 'src/content/blog'))).filter(name => name.endsWith('.md')).map(name => name.slice(0, -3));
    expect(files.sort()).toEqual([...expectedSlugs].sort());
    expect([...EXTENDED_LAUNCH_SLUGS].sort()).toEqual([...expectedSlugs].sort());
  });

  it.each(OCTOBER_27_BUYER_ARTICLES)('$slug passes the explicit buyer standard through the real file-audit entry point', async ({ slug, title }) => {
    const path = resolve(root, 'src/content/blog', slug + '.md');
    const report = await auditFiles([path]);
    expect(report.files[path], slug).toMatchObject({ fatal: false, failures: [], score: 100, publishable: true, standard: 'buyer-2026-10-27' });
    const markdown = await source(slug);
    const { frontmatter: fm, content } = parseFrontmatter(markdown);
    expect(fm.title).toBe(title);
    const images = [...content.matchAll(/!\[[^\]]+\]\((\/images\/[^)]+)\)/g)].map(match => match[1]);
    expect(REFERENCE_PHOTO_ARTICLES.find(article => article.slug === slug)).toEqual({ slug, cover: [fm.coverImage], body: images });
    expect(markdown).not.toMatch(privateIdentity);
  });

  it('varies the opening, heading order and image set across the ten decisions', async () => {
    const articles = await Promise.all(slugs.map(source));
    const headings = articles.map(article => [...article.matchAll(/^## (.+)$/gm)].map(match => match[1].toLowerCase()).join('|'));
    const openings = articles.map(article => parseFrontmatter(article).content.trim().split(/\n\s*\n/)[0].toLowerCase());
    expect(new Set(headings).size).toBe(10);
    expect(new Set(openings).size).toBe(10);
    const imageSets = articles.map(article => [...article.matchAll(/(?:coverImage:\s*"|\]\()(\/images\/[^"\s)]+)/g)].map(match => match[1]));
    expect(new Set(imageSets.map(images => images.join('|'))).size).toBe(10);
    expect(new Set(imageSets.flat()).size).toBeGreaterThanOrEqual(8);
  });

  it('registers fifteen actual decodable photographs without leaking provenance', async () => {
    const manifest = JSON.parse(await readFile(resolve(root, 'public/images/asset-manifest.json'), 'utf8'));
    const photos = manifest.referencePhotos.filter(photo => NEW_PHOTO_URLS.includes(photo.url));
    expect(photos.map(photo => photo.url).sort()).toEqual([...NEW_PHOTO_URLS].sort());
    expect(manifest.referencePhotos).toHaveLength(CURRENT_REFERENCE_PHOTO_COUNT);
    const hashes = [];
    for (const photo of photos) {
      expect(photo.medium).toBe('reference-photograph');
      expect(photo.classification).toBe('editorial');
      expect(JSON.stringify(photo)).not.toMatch(privateIdentity);
      expect(JSON.stringify(photo)).not.toMatch(/trainedAlgorithmicMedia|AI[- ]generated|(?:source|original)[_-]?(?:file|path|name)/i);
      const bytes = await readFile(resolve(root, 'public', photo.url.slice(1)));
      expect(sha256(bytes), photo.url + ': reviewed photograph bytes').toBe(baseline.photos.find(record => record.url === photo.url)?.sha256);
      const metadata = await sharp(bytes, { failOn: 'warning' }).metadata();
      expect(metadata.format).toBe('webp');
      expect([metadata.width, metadata.height]).toEqual([photo.width, photo.height]);
      for (const field of ['exif', 'xmp', 'iptc', 'icc']) expect(metadata[field]).toBeUndefined();
      const decoded = await sharp(bytes, { failOn: 'warning' }).raw().toBuffer({ resolveWithObject: true });
      expect(decoded.data.length).toBe(photo.width * photo.height * decoded.info.channels);
      hashes.push(sha256(bytes));
    }
    expect(new Set(hashes).size).toBe(15);
  });

  it('provides each new guide a published contextual incoming route and excludes drafts', () => {
    const assigned = GUIDE_TOPICS.flatMap(topic => topic.slugs);
    expect([...assigned].sort()).toEqual([...expectedSlugs].sort());
    const posts = expectedSlugs.map(id => ({ id, data: { title: id, description: 'Buyer guide', draft: false } }));
    for (const slug of slugs) {
      const incoming = expectedSlugs.filter(id => id !== slug && getRelatedGuides(id, posts).some(link => link.href === `/blog/${slug}/`));
      expect(incoming.length, slug).toBeGreaterThan(0);
      const drafts = posts.map(post => post.id === slug ? { ...post, data: { ...post.data, draft: true } } : post);
      expect(incoming.flatMap(id => getRelatedGuides(id, drafts).map(link => link.href))).not.toContain(`/blog/${slug}/`);
    }
  });

  it('retains the cohort order within complete current pagination and the guide directory', async () => {
    const cards = [];
    for (let page = 1; page <= CURRENT_PAGE_SIZES.length; page++) {
      const html = await built(page === 1 ? '/blog/' : `/blog/page/${page}/`);
      const links = html.filter(node => node.tagName === 'a' && hasClass(node, 'blog-card')).map(node => attr(node, 'href'));
      expect(links).toHaveLength(CURRENT_PAGE_SIZES[page - 1]);
      if (page === 1) {
        const directory = html.find(node => node.attrs?.some(attribute => attribute.name === 'data-guide-directory'));
        expect(nodes(directory).filter(node => node.tagName === 'a').map(node => attr(node, 'href')).sort()).toEqual(expectedSlugs.map(slug => `/blog/${slug}/`).sort());
      }
      cards.push(...links);
    }
    const frozenCards = cards.filter(href => frozenSlugs.some(slug => href === `/blog/${slug}/`));
    expect(frozenCards.slice(0, 10).sort()).toEqual(slugs.map(slug => `/blog/${slug}/`).sort());
    expect(frozenCards.slice(10, 20).every(href => OCTOBER_26_CAMPAIGN_DAY3_ARTICLE_SLUGS.some(slug => href === `/blog/${slug}/`))).toBe(true);
    expect(cards.sort()).toEqual(expectedSlugs.map(slug => `/blog/${slug}/`).sort());
    expect(new Set(cards).size).toBe(CURRENT_ARTICLE_COUNT);
  });

  it('retains correct article dates, real assets and working internal routes in the current sitemap', async () => {
    const sitemap = await readFile(resolve(root, 'dist/sitemap-0.xml'), 'utf8');
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
    expect(urls).toHaveLength(CURRENT_SITEMAP_COUNT);
    expect(new Set(urls).size).toBe(CURRENT_SITEMAP_COUNT);
    for (const article of OCTOBER_27_BUYER_ARTICLES) {
      const route = `/blog/${article.slug}/`;
      expect(urls).toContain(origin + route);
      const entry = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].find(match => match[1].includes(`<loc>${origin}${route}</loc>`))?.[1];
      expect(entry.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.slice(0, 10)).toBe(reviewedUpdateForSlug(article.slug, '2026-10-27'));
      const html = await built(route);
      expect(html.filter(node => node.tagName === 'link' && attr(node, 'rel') === 'canonical').map(node => attr(node, 'href'))).toEqual([origin + route]);
      const schema = html.filter(node => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json').map(node => JSON.parse((node.childNodes ?? []).map(child => child.value ?? '').join(''))).find(data => data['@type'] === 'BlogPosting');
      expect(schema).toMatchObject({ headline: article.title, datePublished: '2026-10-27T00:00:00.000Z', dateModified: reviewedUpdateForSlug(article.slug, '2026-10-27') + 'T00:00:00.000Z' });
      const body = html.find(node => hasClass(node, 'article-content'));
      const lead = html.find(node => hasClass(node, 'article__buyer-lead'));
      expect(lead, article.slug + ': first-screen recommendation').toBeDefined();
      const opening = parseFrontmatter(await source(article.slug)).content.trim().split(/\n\s*\n/)[0].replace(/\*\*/g, '').trim();
      expect(text(lead).replace(/\s+/g, ' ').trim()).toBe(opening.replace(/\s+/g, ' '));
      expect(html.some(node => hasClass(node, 'article__hero--buyer'))).toBe(true);
      expect(html.some(node => node.tagName === 'h4' && text(node).trim() === 'Editorial & Technical Note')).toBe(false);
      expect(nodes(body).filter(node => node.tagName === 'table').length).toBeGreaterThanOrEqual(1);
      for (const img of html.filter(node => node.tagName === 'img' && attr(node, 'src')?.startsWith('/images/'))) await access(resolve(root, 'dist', attr(img, 'src').slice(1)));
      for (const href of html.filter(node => node.tagName === 'a' && attr(node, 'href')?.startsWith('/')).map(node => attr(node, 'href'))) {
        const url = new URL(href, origin);
        const target = await built(url.pathname);
        if (url.hash) expect(target.some(node => attr(node, 'id') === decodeURIComponent(url.hash.slice(1))), href).toBe(true);
      }
    }
  });
});
