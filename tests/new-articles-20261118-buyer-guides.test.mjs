import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { readFile, readdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parse } from 'parse5';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { NOVEMBER_18_BUYER_ARTICLES, BUYER_ARTICLE_COHORTS, buyerCohortForSlug } from '../scripts/lift-platform-article-registry.mjs';
import { auditFiles, EXTENDED_LAUNCH_SLUGS } from '../scripts/audit-lift-platform-content.mjs';
import { REFERENCE_PHOTO_ARTICLES } from '../scripts/reference-photo-articles.mjs';
import { GUIDE_TOPICS, getRelatedGuides } from '../src/lib/guide-navigation.ts';
import { CURRENT_ARTICLE_COUNT, CURRENT_SITEMAP_COUNT, CURRENT_REFERENCE_PHOTO_COUNT, CURRENT_PAGE_SIZES, CURRENT_SLUGS, laterSlugsThan, currentSitemapUrls } from './helpers/current-release.mjs';
import { manifestBeforeBuyerDate } from './helpers/buyer-photo-cohorts.mjs';
import { NEW_PHOTO_URLS } from './helpers/november-18-release.mjs';

const root = resolve(import.meta.dirname, '..');
const baseline = JSON.parse(await readFile(resolve(root, 'tests/fixtures/november-18-buyer-baseline.json'), 'utf8'));
const reviewedPhotos = JSON.parse(await readFile(resolve(root, 'tests/fixtures/november-18-buyer-photos.json'), 'utf8'));
const slugs = NOVEMBER_18_BUYER_ARTICLES.map(article => article.slug);
// Explicit release order preserves all prior ordinary, catch-up and overtime cohorts.
const releaseIndex = BUYER_ARTICLE_COHORTS.findIndex(cohort => cohort.id === 'daily-20261118');
if (releaseIndex < 0) throw new Error('Missing November 18 ordinary release');
const priorCohorts = BUYER_ARTICLE_COHORTS.slice(0, releaseIndex);
const additions = new Set(BUYER_ARTICLE_COHORTS.slice(releaseIndex).flatMap(cohort => cohort.slugs));
const blogFiles = (await readdir(resolve(root, 'src/content/blog'))).filter(file => file.endsWith('.md'));
const oldSlugs = blogFiles.map(file => file.slice(0, -3)).filter(slug => !additions.has(slug)).sort();
const frozenSlugs = [...oldSlugs, ...slugs];
const expectedSlugs = [...frozenSlugs, ...laterSlugsThan(frozenSlugs)];
const origin = 'https://www.arclifteq.com';
const source = slug => readFile(resolve(root, 'src/content/blog', slug + '.md'), 'utf8');
const nodes = node => node ? [node, ...(node.childNodes ?? []).flatMap(nodes)] : [];
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const hasClass = (node, name) => (attr(node, 'class') ?? '').split(/\s+/).includes(name);
const text = node => !node ? '' : node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join(' ');
const pages = new Map();
const built = route => {
  if (!pages.has(route)) pages.set(route, readFile(resolve(root, 'dist', '.' + route, 'index.html'), 'utf8').then(html => nodes(parse(html))));
  return pages.get(route);
};
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
// Canonical JSON sorts object keys and preserves array order. File lists use
// path order and Git's LF representation for text, keeping the test portable.
function digest(value) {
  const stable = (_key, item) => item && typeof item === 'object' && !Array.isArray(item)
    ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]]))
    : item;
  return sha256(JSON.stringify(value, stable));
}
async function publicFiles(directory) {
  const entries = await readdir(resolve(root, directory), { withFileTypes: true });
  const children = await Promise.all(entries.map(entry => {
    const file = directory + '/' + entry.name;
    return entry.isDirectory() ? publicFiles(file) : [file];
  }));
  return children.flat();
}
const privateIdentity = /\b[A-Za-z]:[\\/]|\bfile:[\\/]|DJI[_-]?\d+|(?:IMG|DSC)[_-]?\d+\.(?:jpe?g|png|webp)|Henan\s+Huaying|source-media|pdf-media|config-media|\.env\b/iu;
const containsPrivateIdentity = value => {
  if (privateIdentity.test(value)) return true;
  // A maker's HTTP pathname can contain /home/ or /Users/. Preserve URL
  // queries/fragments so a filesystem identity passed as a parameter still fails.
  const outsideWebPaths = value.replace(/\bhttps?:\/\/[^\s<>"']+/giu, candidate => {
    try { const url = new URL(candidate); return url.search + url.hash; }
    catch { return candidate; }
  });
  return /\/(?:Users|home)\//iu.test(outsideWebPaths);
};

describe('November 18: fifty independently reviewed ordinary daily buyer articles', () => {
  it('rejects local filesystem identities while allowing legitimate maker HTTP paths', () => {
    expect(containsPrivateIdentity('https://customrollformproducts.com/home/products/coil-sheet-handling-equipment/decoilers/')).toBe(false);
    expect(containsPrivateIdentity('[Maker page](https://maker.example/Users/products/)')).toBe(false);
    for (const identity of ['C:/Users/u/photo.webp', 'C:\\Users\\u\\photo.webp', '/home/u/photo.webp', '/Users/u/photo.webp', '/HOME/u/photo.webp', '/users/u/photo.webp', 'file:///home/u/photo.webp', 'file:///tmp/photo.webp', 'https://maker.example/catalogue/?source=/home/u/photo.webp', 'https://maker.example/source-media/photo.webp', 'https://maker.example/IMG_1234.jpg', 'https://maker.example/catalogue/?source=C:/Users/u/photo.webp']) {
      expect(containsPrivateIdentity(identity), identity).toBe(true);
    }
  });

  it('adds exactly fifty URLs to the frozen 400 and binds the single ordinary daily cohort', async () => {
    expect(baseline.version).toBe(1);
    expect(baseline.sourceCommit).toBe('d077b92e1eae91dfed064d8de4bda8a1bd1f7496');
    expect(oldSlugs).toHaveLength(400);
    expect(baseline.counts.articles).toBe(oldSlugs.length);
    expect(slugs).toHaveLength(50);
    expect(slugs.filter(slug => oldSlugs.includes(slug))).toEqual([]);
    expect(new Set(frozenSlugs).size).toBe(450);
    expect(CURRENT_ARTICLE_COUNT).toBe(450);
    expect(CURRENT_SITEMAP_COUNT).toBe(474);
    expect(CURRENT_PAGE_SIZES).toEqual([20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 10]);
    expect(NOVEMBER_18_BUYER_ARTICLES.filter(article => article.cluster === 'ceiling-buyer-decision')).toHaveLength(20);
    expect(NOVEMBER_18_BUYER_ARTICLES.filter(article => article.cluster === 'forming-buyer-decision')).toHaveLength(30);
    expect(new Set(expectedSlugs).size).toBe(CURRENT_ARTICLE_COUNT);
    expect([...CURRENT_SLUGS].sort()).toEqual([...expectedSlugs].sort());
    const identities = priorCohorts.map(({ id, date, standard, slugs }) => ({ id, date, standard, slugs }));
    expect(priorCohorts).toHaveLength(19);
    expect(priorCohorts.length).toBe(baseline.counts.buyerCohorts);
    expect(digest(identities)).toBe(baseline.sha256.buyerCohorts);
    const priorBuyerSlugs = priorCohorts.flatMap(cohort => cohort.slugs);
    expect(priorBuyerSlugs).toHaveLength(270);
    expect(priorBuyerSlugs.length).toBe(baseline.counts.buyerArticles);
    const frozenBuyerSlugs = [...priorBuyerSlugs, ...slugs];
    expect(new Set(frozenBuyerSlugs).size).toBe(320);
    expect(BUYER_ARTICLE_COHORTS.find(cohort => cohort.id === 'daily-20261118')).toMatchObject({ date: '2026-11-18', standard: 'buyer-2026-11-18', slugs });
    expect(BUYER_ARTICLE_COHORTS.filter(cohort => ['2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08'].includes(cohort.date))).toEqual([]);
    const overtime = priorCohorts.find(cohort => cohort.id === 'overtime-20261116-50');
    expect(overtime.date).toBe('2026-11-17');
    expect(overtime.slugs).toHaveLength(50);
    for (const slug of overtime.slugs) expect(buyerCohortForSlug(slug).id).toBe('overtime-20261116-50');
    expect(new Set([...overtime.slugs, ...slugs]).size).toBe(100);
    for (const slug of slugs) expect(buyerCohortForSlug(slug)).toMatchObject({ id: 'daily-20261118', date: '2026-11-18', standard: 'buyer-2026-11-18' });
    expect(buyerCohortForSlug('invented-future-buyer-guide')).toBeUndefined();
    const articleHashes = await Promise.all(oldSlugs.map(async slug =>
      [slug, sha256((await source(slug)).replace(/\r\n/g, '\n'))]
    ));
    expect(digest(articleHashes)).toBe(baseline.sha256.articles);
    expect(blogFiles.map(file => file.slice(0, -3)).sort()).toEqual([...expectedSlugs].sort());
    expect([...EXTENDED_LAUNCH_SLUGS].sort()).toEqual([...expectedSlugs].sort());
  });

  it('retains all preceding public assets, manifest records, image mappings and topic memberships', async () => {
    const manifest = JSON.parse(await readFile(resolve(root, 'public/images/asset-manifest.json'), 'utf8'));
    const originalManifest = manifestBeforeBuyerDate(manifest, '2026-11-18');
    expect(originalManifest.referencePhotos).toHaveLength(113);
    expect(originalManifest.referencePhotos.length).toBe(baseline.counts.referencePhotos);
    expect(digest(originalManifest)).toBe(baseline.sha256.manifest);
    const oldPhotoUrls = new Set(originalManifest.referencePhotos.map(photo => photo.url));
    const laterPhotoPaths = new Set(manifest.referencePhotos.filter(photo => !oldPhotoUrls.has(photo.url)).map(photo => 'public' + photo.url));
    const assetPaths = (await publicFiles('public')).filter(file =>
      file !== 'public/images/asset-manifest.json' && !laterPhotoPaths.has(file)
    ).sort();
    expect(assetPaths).toHaveLength(232);
    expect(assetPaths.length).toBe(baseline.counts.assets);
    const textExtensions = new Set(['.svg', '.txt', '.json', '.webmanifest', '.xml', '.css', '.js', '.html']);
    const assetHashes = await Promise.all(assetPaths.map(async file => {
      const bytes = await readFile(resolve(root, file));
      const textFile = textExtensions.has(extname(file)) || ['_headers', '_redirects'].includes(basename(file));
      return [file, sha256(textFile ? bytes.toString().replace(/\r\n/g, '\n') : bytes)];
    }));
    expect(digest(assetHashes)).toBe(baseline.sha256.assets);
    const unknownAddition = { ...manifest, referencePhotos: [...manifest.referencePhotos, { url: '/images/equipment/unregistered-photo.webp', medium: 'reference-photograph' }] };
    expect(digest(manifestBeforeBuyerDate(unknownAddition, '2026-11-18'))).not.toBe(baseline.sha256.manifest);
    const alteredPrior = structuredClone(manifest);
    alteredPrior.referencePhotos[0].disclosure = 'Changed prior public description.';
    expect(digest(manifestBeforeBuyerDate(alteredPrior, '2026-11-18'))).not.toBe(baseline.sha256.manifest);
    expect(manifest.referencePhotos).toHaveLength(CURRENT_REFERENCE_PHOTO_COUNT);
    const priorMappings = REFERENCE_PHOTO_ARTICLES.filter(article => oldSlugs.includes(article.slug));
    expect(priorMappings).toHaveLength(397);
    expect(priorMappings.length).toBe(baseline.counts.photoMappings);
    expect(digest(priorMappings)).toBe(baseline.sha256.photoMappings);
    const priorTopics = GUIDE_TOPICS.map(topic => ({ name: topic.name, slugs: topic.slugs.filter(slug => oldSlugs.includes(slug)) }));
    expect(priorTopics.length).toBe(baseline.counts.topics);
    expect(priorTopics.flatMap(topic => topic.slugs)).toHaveLength(baseline.counts.topicMemberships);
    expect(digest(priorTopics)).toBe(baseline.sha256.guideTopics);
  });

  it.each(NOVEMBER_18_BUYER_ARTICLES)('$slug passes the real dated file audit and matches its registered title and photo sequence', async ({ slug, title }) => {
    const path = resolve(root, 'src/content/blog', slug + '.md');
    const report = await auditFiles([path]);
    expect(report.files[path], slug).toMatchObject({ fatal: false, failures: [], score: 100, publishable: true, standard: 'buyer-2026-11-18' });
    const markdown = await source(slug);
    expect(markdown, slug + ": reviewed sources must have exact LF bytes").not.toContain("\r");
    const { frontmatter: fm, content } = parseFrontmatter(markdown);
    expect(fm.title).toBe(title);
    const bodyPhotos = [...content.matchAll(/!\[[^\]]+\]\((\/images\/[^)]+)\)/g)].map(match => match[1]);
    expect(REFERENCE_PHOTO_ARTICLES.find(article => article.slug === slug)).toEqual({ slug, cover: [fm.coverImage], body: bodyPhotos });
    expect(containsPrivateIdentity(markdown)).toBe(false);
  });

  it('varies openings, section sequences and images rather than cloning a daily template', async () => {
    const articles = await Promise.all(slugs.map(source));
    const headings = articles.map(article => [...article.matchAll(/^## (.+)$/gm)].map(match => match[1].toLowerCase()).join('|'));
    const openings = articles.map(article => parseFrontmatter(article).content.trim().split(/\n\s*\n/)[0].toLowerCase());
    expect(new Set(headings).size).toBe(50);
    expect(new Set(openings).size).toBe(50);
    const imageSets = articles.map(article => [...article.matchAll(/(?:coverImage:\s*"|\]\()(\/images\/[^"\s)]+)/g)].map(match => match[1]));
    expect(new Set(imageSets.map(images => [...images].sort().join('|'))).size).toBe(50);
    expect(new Set(imageSets.flat()).size).toBeGreaterThanOrEqual(8);
  });

  it('keeps reviewed real photograph bytes, dimensions and privacy metadata intact', async () => {
    const actualPhotos = new Set((await Promise.all(slugs.map(source))).flatMap(markdown => [...markdown.matchAll(/(?:coverImage:\s*"|\]\()(\/images\/[^"\s)]+)/g)].map(match => match[1])));
    expect(reviewedPhotos.map(photo => photo.url).sort()).toEqual([...actualPhotos].sort());
    expect(reviewedPhotos.length).toBeGreaterThanOrEqual(8);
    expect(reviewedPhotos.filter(photo => photo.newPublicAsset).map(photo => photo.url).sort()).toEqual([...NEW_PHOTO_URLS].sort());
    const manifest = JSON.parse(await readFile(resolve(root, 'public/images/asset-manifest.json'), 'utf8'));
    const priorManifest = manifestBeforeBuyerDate(manifest, '2026-11-18');
    expect(digest(priorManifest)).toBe(baseline.sha256.manifest);
    expect(reviewedPhotos.filter(photo => !photo.newPublicAsset).every(photo => priorManifest.referencePhotos.some(record => record.url === photo.url))).toBe(true);
    const hashes = [];
    for (const reviewed of reviewedPhotos) {
      const photo = manifest.referencePhotos.find(record => record.url === reviewed.url);
      expect(photo, reviewed.url).toBeDefined();
      expect(photo.medium).toBe('reference-photograph');
      expect(photo.classification).toBe('editorial');
      expect(containsPrivateIdentity(JSON.stringify(photo))).toBe(false);
      expect(JSON.stringify(photo)).not.toMatch(/trainedAlgorithmicMedia|AI[- ]generated|(?:source|original)[_-]?(?:file|path|name)/i);
      const bytes = await readFile(resolve(root, 'public', photo.url.slice(1)));
      expect(sha256(bytes), photo.url).toBe(reviewed.sha256);
      const metadata = await sharp(bytes, { failOn: 'warning' }).metadata();
      expect(metadata.format).toBe('webp');
      expect([metadata.width, metadata.height]).toEqual([photo.width, photo.height]);
      for (const field of ['exif', 'xmp', 'iptc', 'icc']) expect(metadata[field]).toBeUndefined();
      const decoded = await sharp(bytes, { failOn: 'warning' }).raw().toBuffer({ resolveWithObject: true });
      expect(decoded.data.length).toBe(photo.width * photo.height * decoded.info.channels);
      hashes.push(sha256(bytes));
    }
    expect(new Set(hashes).size).toBe(reviewedPhotos.length);
  });

  it('gives every new article a contextual incoming link and excludes drafts', () => {
    expect(GUIDE_TOPICS.flatMap(topic => topic.slugs).sort()).toEqual([...expectedSlugs].sort());
    const posts = expectedSlugs.map(id => ({ id, data: { title: id, description: 'Buyer guide', draft: false } }));
    const incomingBySlug = new Map(slugs.map(slug => [slug, []]));
    for (const id of expectedSlugs) {
      for (const link of getRelatedGuides(id, posts)) {
        const target = link.href.split('/')[2];
        if (target !== id && incomingBySlug.has(target)) incomingBySlug.get(target).push(id);
      }
    }
    for (const slug of slugs) {
      const incoming = incomingBySlug.get(slug) ?? [];
      expect(incoming.length, slug).toBeGreaterThan(0);
      const drafts = posts.map(post => post.id === slug ? { ...post, data: { ...post.data, draft: true } } : post);
      expect(incoming.flatMap(id => getRelatedGuides(id, drafts).map(link => link.href))).not.toContain(`/blog/${slug}/`);
    }
  });

  it('keeps all 450 distinct cards, dated release groups, directory links and complete pagination', async () => {
    const cards = [];
    for (let index = 0; index < CURRENT_PAGE_SIZES.length; index++) {
      const html = await built(index === 0 ? '/blog/' : `/blog/page/${index + 1}/`);
      const links = html.filter(node => node.tagName === 'a' && hasClass(node, 'blog-card')).map(node => attr(node, 'href'));
      expect(links).toHaveLength(CURRENT_PAGE_SIZES[index]);
      const pagination = html.find(node => node.tagName === 'nav' && attr(node, 'aria-label') === 'Blog pagination');
      const expectedPageLinks = [index > 0 ? (index === 1 ? '/blog/' : `/blog/page/${index}/`) : undefined,
        index < CURRENT_PAGE_SIZES.length - 1 ? `/blog/page/${index + 2}/` : undefined].filter(Boolean);
      expect(nodes(pagination).filter(node => node.tagName === 'a').map(node => attr(node, 'href'))).toEqual(expectedPageLinks);
      if (index === 0) {
        const directory = html.find(node => node.attrs?.some(attribute => attribute.name === 'data-guide-directory'));
        expect(nodes(directory).filter(node => node.tagName === 'a').map(node => attr(node, 'href')).sort()).toEqual(expectedSlugs.map(slug => `/blog/${slug}/`).sort());
      }
      cards.push(...links);
    }
    const frozenCards = cards.filter(href => frozenSlugs.some(slug => href === `/blog/${slug}/`));
    // Dates determine directories. Campaigns may legitimately share one date.
    const byDate = new Map();
    const listed = [...priorCohorts, { date: '2026-11-18', slugs }];
    for (const cohort of listed) {
      const hrefs = byDate.get(cohort.date) ?? [];
      hrefs.push(...cohort.slugs.map(slug => '/blog/' + slug + '/'));
      byDate.set(cohort.date, hrefs);
    }
    let start = 0;
    for (const day of [...byDate.keys()].filter(day => day >= '2026-11-09').sort().reverse()) {
      const group = byDate.get(day);
      expect(frozenCards.slice(start, start + group.length).sort(), day).toEqual([...group].sort());
      start += group.length;
    }
    expect(cards.sort()).toEqual(expectedSlugs.map(slug => `/blog/${slug}/`).sort());
    expect(new Set(cards).size).toBe(CURRENT_ARTICLE_COUNT);
  });

  it('preserves 424 indexable URLs and adds fifty ordinary articles with pagination excluded', async () => {
    const sitemap = await readFile(resolve(root, 'dist/sitemap-0.xml'), 'utf8');
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
    expect(urls).toHaveLength(CURRENT_SITEMAP_COUNT);
    expect(new Set(urls).size).toBe(CURRENT_SITEMAP_COUNT);
    const newArticleUrls = new Set([...additions].map(slug => origin + '/blog/' + slug + '/'));
    const priorUrls = urls.filter(url => !newArticleUrls.has(url)).sort();
    expect(priorUrls).toHaveLength(424);
    expect(priorUrls.length).toBe(baseline.counts.sitemapUrls);
    expect(digest(priorUrls)).toBe(baseline.sha256.sitemapUrls);
    const frozenUrls = [...priorUrls, ...slugs.map(slug => origin + '/blog/' + slug + '/')];
    expect(frozenUrls).toHaveLength(474);
    expect([...urls].sort()).toEqual(currentSitemapUrls(frozenUrls).sort());
    expect(urls.filter(url => /^\/blog\/page(?:\/|$)/.test(new URL(url).pathname))).toEqual([]);
  });

  it.each(NOVEMBER_18_BUYER_ARTICLES)('$slug matches its live-bound canonical, dates, buyer lead, photos and linked targets', async article => {
      const sitemap = await readFile(resolve(root, 'dist/sitemap-0.xml'), 'utf8');
      const route = `/blog/${article.slug}/`;
      const entry = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].find(match => match[1].includes(`<loc>${origin}${route}</loc>`))?.[1];
      expect(entry.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.slice(0, 10)).toBe('2026-11-18');
      const html = await built(route);
      expect(html.filter(node => node.tagName === 'link' && attr(node, 'rel') === 'canonical').map(node => attr(node, 'href'))).toEqual([origin + route]);
      const schema = html.filter(node => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json').map(node => JSON.parse((node.childNodes ?? []).map(child => child.value ?? '').join(''))).find(data => data['@type'] === 'BlogPosting');
      expect(schema).toMatchObject({ headline: article.title, datePublished: '2026-11-18T00:00:00.000Z', dateModified: '2026-11-18' + 'T00:00:00.000Z' });
      const body = html.find(node => hasClass(node, 'article-content'));
      const lead = html.find(node => hasClass(node, 'article__buyer-lead'));
      expect(lead, article.slug).toBeDefined();
      const opening = parseFrontmatter(await source(article.slug)).content.trim().split(/\n\s*\n/)[0].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').trim();
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
  });
  it('binds the ordinary filename to its registered date and rejects metadata or copy downgrades', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'buyer-nov18-daily-gate-'));
    try {
      const registered = join(directory, slugs[0] + '.md');
      const markdown = await source(slugs[0]);
      await writeFile(registered, markdown);
      expect((await auditFiles([registered])).files[registered]).toMatchObject({ standard: 'buyer-2026-11-18', fatal: false, failures: [] });
      await writeFile(registered, markdown.replaceAll('2026-11-18', '2026-11-17'));
      expect((await auditFiles([registered])).files[registered].failures).toContain('missing-buyer-metadata');
      await writeFile(registered, markdown.replace('draft: false', 'draft: false\nauditStandard: buyer-2026-10-27') + '\n\nPending verification.');
      expect((await auditFiles([registered])).files[registered].failures).toContain('buyer-verification-placeholder');
      await writeFile(registered, markdown + '\n\nConfirm on RFQ.');
      expect((await auditFiles([registered])).files[registered].failures).toContain('buyer-empty-confirmation');
    } finally {
      const target = resolve(directory);
      expect(dirname(target)).toBe(resolve(tmpdir()));
      expect(basename(target)).toMatch(/^buyer-nov18-daily-gate-[a-zA-Z0-9]{6}$/);
      await rm(target, { recursive: true, force: true });
    }
  });
});
