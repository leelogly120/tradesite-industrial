import { REVISED_BUYER_ARTICLE_SLUGS } from '../scripts/revised-buyer-articles.mjs';
import { retainedPhotoArticle } from './helpers/retained-production-content.mjs';
import { CURRENT_ARTICLE_COUNT, CURRENT_SITEMAP_COUNT, CURRENT_PAGE_SIZES, laterSlugsThan, currentSitemapUrls } from './helpers/current-release.mjs';
import { precedingReleaseBytes } from './helpers/october-27-release.mjs';
import { readFile, readdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { parse, parseFragment } from 'parse5';
import { createMarkdownProcessor, parseFrontmatter } from '@astrojs/markdown-remark';
import { describe, expect, it } from 'vitest';
import * as registry from '../scripts/lift-platform-article-registry.mjs';
import { EXTENDED_LAUNCH_SLUGS, auditArticle } from '../scripts/audit-lift-platform-content.mjs';
import { REFERENCE_PHOTO_ARTICLES } from '../scripts/reference-photo-articles.mjs';
import { GUIDE_TOPICS, getGuideTopic, getRelatedGuides } from '../src/lib/guide-navigation.ts';
import { retainedRedirectBytes } from './helpers/retained-redirects.mjs';

const root = resolve(import.meta.dirname, '..');
const baseline = JSON.parse(await readFile(resolve(root, 'tests/fixtures/october-26-campaign-day3-baseline.json'), 'utf8'));
const planned = baseline.plannedArticles;
const oldSlugs = baseline.articles.map(a => a.slug);
const newSlugs = planned.map(a => a.slug);
const allSlugs = [...oldSlugs, ...newSlugs]; // Frozen day3 result.
const laterSlugs = laterSlugsThan(allSlugs);
const currentSlugs = [...allSlugs, ...laterSlugs];
const origin = 'https://www.arclifteq.com';
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const nodes = n => n ? [n, ...(n.childNodes ?? []).flatMap(nodes)] : [];
const attr = (n, key) => n.attrs?.find(a => a.name === key)?.value;
const hasClass = (n, name) => (attr(n, 'class') ?? '').split(/\s+/).includes(name);
const hidden = n => ['script', 'style', 'template', 'noscript'].includes(n.tagName)
  || n.attrs?.some(a => a.name === 'hidden') || /display\s*:\s*none|visibility\s*:\s*hidden/i.test(attr(n, 'style') ?? '');
const text = n => !n || hidden(n) ? '' : n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(text).join(' ');
const words = n => (text(n).match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? []).length;
const builtPages = new Map();
const built = route => {
  if (!builtPages.has(route)) builtPages.set(route, readFile(resolve(root, 'dist', `.${route}`, 'index.html'), 'utf8').then(html => nodes(parse(html))));
  return builtPages.get(route);
};
const processor = await createMarkdownProcessor();
const readArticle = slug => readFile(resolve(root, 'src/content/blog', slug + '.md'), 'utf8');
const markers = ['buyer-intent', 'conditions', 'evidence-tradeoffs', 'limitations-not-fit', 'project-checklist', 'cta-editorial-note'];
const revisedArticles = new Set(REVISED_BUYER_ARTICLE_SLUGS);
const remediated = new Set([
  ...revisedArticles,
  'ceiling-platform-dual-power-task-boundary',
  'ceiling-platform-occupied-building-work-hours',
  'ceiling-platform-indoor-emissions-enquiry',
  'roll-forming-lift-hydraulic-power-package',
  'roll-forming-lift-order-before-former-selection',
  'roll-forming-lift-former-emergency-stop-boundary',
  'roll-forming-lift-site-power-enquiry',
  'roll-forming-lift-generator-package-boundary',
  'roll-forming-lift-site-cable-supply-scope',
  'roll-forming-lift-separate-former-power',
  'roll-forming-lift-supply-frequency-mismatch',
  'roll-forming-lift-control-language-request',
  'roll-forming-lift-radio-control-market-enquiry',
  'roll-forming-lift-local-versus-remote-controls',
  'roll-forming-lift-remote-support-access-scope',
  'ceiling-platform-independent-inspection-purchase',
]);

describe('2026-10-26 campaign day3: twenty new URLs after the published one hundred ten', () => {
  it('registers exactly the approved twenty unused slugs with fourteen forming and six platform subjects', () => {
    expect(baseline.articles).toHaveLength(110);
    expect(planned).toHaveLength(20);
    expect(planned.map(a => a.articleId)).toEqual(Array.from({ length: 20 }, (_, i) => i + 41));
    expect(new Set(newSlugs).size).toBe(20);
    expect(newSlugs.filter(slug => oldSlugs.includes(slug))).toEqual([]);
    expect(planned.filter(a => a.family === 'forming')).toHaveLength(14);
    expect(planned.filter(a => a.family === 'platform')).toHaveLength(6);
    expect(registry.OCTOBER_26_CAMPAIGN_DAY3_ARTICLES ?? []).toEqual(planned.map(({ slug, title, cluster }) => ({ slug, title, cluster })));
    expect([...EXTENDED_LAUNCH_SLUGS].sort()).toEqual([...currentSlugs].sort());
  });

  it('retains the full published one hundred ten, all public assets and the inquiry/WhatsApp implementation', async () => {
    expect(baseline.articles).toHaveLength(110);
    expect(baseline.preservedFiles).toHaveLength(139);
    // Raw workspace hashes are verified in private release evidence; canonical/Git checks stay portable across line endings.
    for (const article of baseline.articles) {
      const source = await readArticle(article.slug);
      const canonical = Buffer.from(source.replace(/\r\n/g, '\n'));
      expect(sha256(canonical), article.slug).toBe(article.sha256);
      expect(sha256(canonical), article.slug + ': committed Git bytes').toBe(article.gitSha256);
      const blob = createHash('sha1').update(Buffer.from(`blob ${canonical.length}\0`)).update(canonical).digest('hex');
      expect(blob, article.slug + ': baseline Git object').toBe(article.gitBlobSha1);
      const front = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
      for (const key of ['title', 'date', 'updated']) {
        const raw = front.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1]?.trim() ?? null;
        expect(raw, `${article.slug}:${key}`).toBe(article[key]);
      }
    }
    for (const file of baseline.preservedFiles) {
      const bytes = precedingReleaseBytes(file.path, await readFile(resolve(root, file.path)));
      const comparable = file.path === 'public/_redirects' ? retainedRedirectBytes(bytes)
        : file.normalizeNewlines ? bytes.toString().replace(/\r\n/g, '\n') : bytes;
      expect(sha256(comparable), file.path).toBe(file.sha256);
      expect(sha256(comparable), file.path + ': committed Git bytes').toBe(file.gitSha256);
      const canonical = Buffer.from(comparable);
      expect(createHash('sha1').update(Buffer.from(`blob ${canonical.length}\0`)).update(canonical).digest('hex'), file.path + ': Git object').toBe(file.gitBlobSha1);
    }
  });

  it('has exactly the current article files and executable audit targets without replacements', async () => {
    const actual = (await readdir(resolve(root, 'src/content/blog'))).filter(p => p.endsWith('.md')).map(p => p.slice(0, -3));
    expect(actual).toHaveLength(CURRENT_ARTICLE_COUNT);
    expect(actual.sort()).toEqual([...currentSlugs].sort());
    expect(new Set(EXTENDED_LAUNCH_SLUGS).size).toBe(CURRENT_ARTICLE_COUNT);
    expect([...EXTENDED_LAUNCH_SLUGS].sort()).toEqual([...currentSlugs].sort());
  });

  it('preserves every prior photo mapping and appends the four exact ordered references for the new cohort', async () => {
    expect(baseline.referencePhotoArticles).toHaveLength(107);
    expect(REFERENCE_PHOTO_ARTICLES.filter(article => allSlugs.includes(article.slug))).toEqual([...baseline.referencePhotoArticles, ...planned.map(({ slug, photos }) => ({
      slug, cover: [photos[0].url], body: photos.slice(1).map(p => p.url),
    }))].map(retainedPhotoArticle));
    for (const article of planned) {
      expect(new Set(article.photos.map(p => p.url)).size, article.slug).toBe(4);
      for (const photo of article.photos) expect(sha256(await readFile(resolve(root, 'public', photo.url.slice(1))))).toBe(photo.sha256);
    }
  });

  it('keeps all original topic memberships and gives each new guide a contextual incoming link', () => {
    expect(GUIDE_TOPICS.map(t => ({ name: t.name, slugs: t.slugs.filter(s => oldSlugs.includes(s)) }))).toEqual(baseline.guideTopics);
    const assigned = GUIDE_TOPICS.flatMap(t => t.slugs);
    expect(assigned).toHaveLength(CURRENT_ARTICLE_COUNT);
    expect([...assigned].sort()).toEqual([...currentSlugs].sort());
    const posts = currentSlugs.map(id => ({ id, data: { title: id, description: 'Guide.', draft: false } }));
    for (const article of planned) {
      expect(getGuideTopic(article.slug)?.name, article.slug).toBe(article.topic);
      expect(getRelatedGuides(article.nearestExisting70, posts).map(link => link.href), article.slug).toContain(`/blog/${article.slug}/`);
      expect(getRelatedGuides(article.slug, posts).some(link => link.href === `/blog/${article.slug}/`)).toBe(false);
      const unpublished = posts.map(post => post.id === article.slug ? { ...post, data: { ...post.data, draft: true } } : post);
      expect(getRelatedGuides(article.nearestExisting70, unpublished).map(link => link.href)).not.toContain(`/blog/${article.slug}/`);
    }
  });

  it.each(planned)('$slug publishes the approved metadata, complete rendered manuscript and bounded real photos', async article => {
    const source = await readArticle(article.slug);
    const { frontmatter: fm, content } = parseFrontmatter(source);
    expect(fm.title).toBe(article.title);
    expect(fm.title.length).toBeGreaterThanOrEqual(50);
    expect(fm.title.length).toBeLessThanOrEqual(60);
    expect(fm.description.length).toBeGreaterThanOrEqual(150);
    expect(fm.description.length).toBeLessThanOrEqual(160);
    expect(new Date(fm.date).toISOString()).toBe('2026-10-26T00:00:00.000Z');
    if (revisedArticles.has(article.slug)) expect(new Date(fm.updated).toISOString()).toBe('2026-11-02T00:00:00.000Z');
    else if (remediated.has(article.slug)) expect(new Date(fm.updated).toISOString()).toBe('2026-10-28T00:00:00.000Z');
    else expect(fm).not.toHaveProperty('updated');
    expect(fm.draft).toBe(false);
    expect(fm.author).toBe('ARCLIFT Technical Editorial');
    const tree = parseFragment((await processor.render(content)).code), all = nodes(tree);
    if (remediated.has(article.slug)) expect(source).not.toMatch(/does not establish/i);
    if (revisedArticles.has(article.slug)) {
      expect(auditArticle(source)).toMatchObject({ fatal: false, failures: [], publishable: true, score: 100 });
      for (const marker of markers) expect(source).toContain(`<!-- audit-section: ${marker} -->`);
    } else {
      expect(words(tree)).toBeGreaterThanOrEqual(1500);
      expect(words(tree)).toBeLessThanOrEqual(3000);
      const h2 = all.filter(n => n.tagName === 'h2');
      expect(h2).toHaveLength(5);
      expect(text(h2.at(-1)).trim()).toBe('FAQ');
      const contents = all.find(n => n.tagName === 'ul');
      expect(nodes(contents).filter(n => n.tagName === 'li').map(n => text(n).trim()))
        .toEqual(h2.map(n => text(n).trim()));
      expect(all.filter(n => n.tagName === 'h3').length).toBeGreaterThanOrEqual(12);
      expect(all.filter(n => n.tagName === 'h4').length).toBeGreaterThanOrEqual(4);
      expect(all.filter(n => n.tagName === 'h4').length).toBeLessThanOrEqual(6);
      for (const marker of markers) expect(source).toContain(`<!-- audit-section: ${marker} -->`);
      expect(auditArticle(source)).toMatchObject({ fatal: false, publishable: true, score: 100 });
    }
    const images = all.filter(n => n.tagName === 'img');
    const photoMapping = retainedPhotoArticle({ slug: article.slug, cover: [article.photos[0].url], body: article.photos.slice(1).map(photo => photo.url) });
    expect([fm.coverImage, ...images.map(n => attr(n, 'src'))]).toEqual([...photoMapping.cover, ...photoMapping.body]);
    expect(images).toHaveLength(photoMapping.body.length);
    expect(fm.coverAlt.length).toBeGreaterThanOrEqual(20);
    if (!revisedArticles.has(article.slug)) {
      expect(fm.coverCaption).toMatch(/reference photograph/i);
      expect(fm.coverCaption).toMatch(/does not|cannot|not evidence/i);
    } else expect(fm.coverCaption.length).toBeGreaterThanOrEqual(20);
    for (const image of images) {
      expect(attr(image, 'alt').length).toBeGreaterThanOrEqual(20);
      const siblings = image.parentNode.parentNode.childNodes;
      const next = siblings.slice(siblings.indexOf(image.parentNode) + 1).find(n => n.nodeName !== '#text' || n.value.trim());
      if (!revisedArticles.has(article.slug)) {
        expect(text(next)).toMatch(/reference photograph/i);
        expect(text(next)).toMatch(/does not|cannot|not evidence/i);
      } else expect(text(next).length).toBeGreaterThanOrEqual(20);
    }
    expect(all.filter(n => n.tagName === 'tbody').some(n => nodes(n).filter(x => x.tagName === 'tr').length >= 4)).toBe(true);
    const links = all.filter(n => n.tagName === 'a');
    expect(links.map(n => attr(n, 'href'))).toContain(`/blog/${article.nearestExisting70}/`);
    const ctas = links.map(n => attr(n, 'href')).filter(href => href?.startsWith('/contact/?'));
    expect(ctas.length).toBeGreaterThanOrEqual(1);
    for (const href of ctas) expect(['quote', 'datasheet', 'advice']).toContain(new URL(href, origin).searchParams.get('request'));
    // Source relevance is independently reviewed; this permanent gate requires its public anchor.
    const externalReferences = links.filter(n => attr(n, 'href')?.startsWith('https://')
      && new URL(attr(n, 'href')).hostname !== new URL(origin).hostname && text(n).trim().length > 0
      && ((revisedArticles.has(article.slug) && !attr(n, 'target')) || (attr(n, 'target') === '_blank'
        && ['noopener', 'noreferrer'].every(rel => (attr(n, 'rel') ?? '').split(/\s+/).includes(rel)))));
    expect(externalReferences.length, `${article.slug}: relevant primary-source anchor must be present with safe external-link attributes`)
      .toBeGreaterThanOrEqual(1);
  });

  it('discovers all current articles once across all pages while preserving the Oct26 cohort', async () => {
    const first = await built('/blog/');
    const directory = first.find(n => n.attrs?.some(a => a.name === 'data-guide-directory'));
    expect(directory).toBeDefined();
    const directoryLinks = nodes(directory).filter(n => n.tagName === 'a').map(n => attr(n, 'href'));
    expect(directoryLinks.sort()).toEqual(currentSlugs.map(s => `/blog/${s}/`).sort());
    const cards = [];
    for (const [index, count] of CURRENT_PAGE_SIZES.entries()) {
      const page = index === 0 ? first : await built(`/blog/page/${index + 1}/`);
      const links = page.filter(n => n.tagName === 'a' && hasClass(n, 'blog-card')).map(n => attr(n, 'href'));
      expect(links, `page ${index + 1}`).toHaveLength(count);
      cards.push(...links);
    }
    expect(cards.sort()).toEqual(currentSlugs.map(s => `/blog/${s}/`).sort());
    expect(new Set(cards).size).toBe(CURRENT_ARTICLE_COUNT);
  });

  it('preserves day3 content URLs and adds registered later articles while excluding pagination', async () => {
    expect(baseline.sitemapUrls).toHaveLength(139);
    const xml = await readFile(resolve(root, 'dist/sitemap-0.xml'), 'utf8');
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    const expected = [...baseline.sitemapUrls, ...newSlugs.map(s => `${origin}/blog/${s}/`), `${origin}/blog/page/7/`];
    expect(urls).toHaveLength(CURRENT_SITEMAP_COUNT);
    expect(new Set(urls).size).toBe(CURRENT_SITEMAP_COUNT);
    expect(new Set(expected).size).toBe(160);
    expect([...urls].sort()).toEqual(currentSitemapUrls(expected).sort());
    expect(urls.filter(url => /^\/blog\/page(?:\/|$)/.test(new URL(url).pathname))).toEqual([]);
    for (const slug of newSlugs) {
      const page = await built(`/blog/${slug}/`);
      expect(page.filter(n => n.tagName === 'link' && attr(n, 'rel') === 'canonical').map(n => attr(n, 'href'))).toEqual([`${origin}/blog/${slug}/`]);
      const schema = page.filter(n => n.tagName === 'script' && attr(n, 'type') === 'application/ld+json')
        .map(n => JSON.parse((n.childNodes ?? []).map(c => c.value ?? '').join(''))).find(s => s['@type'] === 'BlogPosting');
      expect(schema).toMatchObject({
        headline: planned.find(a => a.slug === slug).title,
        datePublished: '2026-10-26T00:00:00.000Z',
        dateModified: revisedArticles.has(slug) ? '2026-11-02T00:00:00.000Z' : remediated.has(slug) ? '2026-10-28T00:00:00.000Z' : '2026-10-26T00:00:00.000Z',
      });
      const body = page.find(n => hasClass(n, 'article-content'));
      expect(body, slug).toBeDefined();
      if (remediated.has(slug)) expect(text(body), slug).not.toMatch(/does not establish/i);
      if (revisedArticles.has(slug)) {
        expect(page.some(node => hasClass(node, 'article__buyer-lead')), slug).toBe(true);
      } else {
        expect(words(body), slug).toBeGreaterThanOrEqual(1500);
        expect(words(body), slug).toBeLessThanOrEqual(3000);
      }
      const internal = page.filter(n => n.tagName === 'a' && attr(n, 'href')?.startsWith('/')).map(n => attr(n, 'href'));
      for (const target of internal) {
        const url = new URL(target, origin);
        const targetPage = await built(url.pathname);
        if (url.hash) expect(targetPage.some(n => attr(n, 'id') === decodeURIComponent(url.hash.slice(1))), `${slug}: ${target}`).toBe(true);
      }
      for (const image of page.filter(n => n.tagName === 'img' && attr(n, 'src')?.startsWith('/images/equipment/'))) {
        await access(resolve(root, 'dist', attr(image, 'src').slice(1)));
      }
    }
  });

  it('runs the new cohort contract through the permanent content and release gates', async () => {
    const { scripts } = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
    expect(scripts['test:content'].split(/\s+/)).toContain('tests/new-articles-20261026-campaign-day3.test.mjs');
    expect(scripts.verify.split(' && ')).toContain('npm run test:content');
  });
});
