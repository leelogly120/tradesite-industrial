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

const root = resolve(import.meta.dirname, '..');
const baseline = JSON.parse(await readFile(resolve(root, 'tests/fixtures/october-24-campaign-day1-baseline.json'), 'utf8'));
const planned = baseline.plannedArticles;
const oldSlugs = baseline.articles.map(a => a.slug);
const newSlugs = planned.map(a => a.slug);
const allSlugs = [...oldSlugs, ...newSlugs]; // Fixed day1 result: ninety articles.
const laterSlugs = [...registry.OCTOBER_25_CAMPAIGN_DAY2_ARTICLE_SLUGS, ...registry.OCTOBER_26_CAMPAIGN_DAY3_ARTICLE_SLUGS];
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
const built = async route => nodes(parse(await readFile(resolve(root, 'dist', `.${route}`, 'index.html'), 'utf8')));
const processor = await createMarkdownProcessor();
const readArticle = slug => readFile(resolve(root, 'src/content/blog', slug + '.md'), 'utf8');
const markers = ['buyer-intent', 'conditions', 'evidence-tradeoffs', 'limitations-not-fit', 'project-checklist', 'cta-editorial-note'];

describe('2026-10-24 campaign day1: twenty new URLs after the published seventy', () => {
  it('registers exactly the approved twenty unused slugs with fourteen forming and six platform subjects', () => {
    expect(baseline.articles).toHaveLength(70);
    expect(planned).toHaveLength(20);
    expect(planned.map(a => a.articleId)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
    expect(new Set(newSlugs).size).toBe(20);
    expect(newSlugs.filter(slug => oldSlugs.includes(slug))).toEqual([]);
    expect(planned.filter(a => a.family === 'forming')).toHaveLength(14);
    expect(planned.filter(a => a.family === 'platform')).toHaveLength(6);
    expect(registry.OCTOBER_24_CAMPAIGN_DAY1_ARTICLES ?? []).toEqual(planned.map(({ slug, title, cluster }) => ({ slug, title, cluster })));
    expect(new Set(allSlugs).size).toBe(90);
    expect([...EXTENDED_LAUNCH_SLUGS].sort()).toEqual([...currentSlugs].sort());
  });

  it('retains the full published seventy, all public assets and the inquiry/WhatsApp implementation', async () => {
    for (const article of baseline.articles) {
      const source = await readArticle(article.slug);
      expect(sha256(source.replace(/\r\n/g, '\n')), article.slug).toBe(article.sha256);
      const front = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
      for (const key of ['title', 'date', 'updated']) {
        const raw = front.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1]?.trim() ?? null;
        expect(raw, `${article.slug}:${key}`).toBe(article[key]);
      }
    }
    for (const file of baseline.preservedFiles) {
      const bytes = await readFile(resolve(root, file.path));
      const comparable = file.normalizeNewlines ? bytes.toString().replace(/\r\n/g, '\n') : bytes;
      expect(sha256(comparable), file.path).toBe(file.sha256);
    }
  });

  it('retains the fixed ninety day1 articles within 130 current source files and audit targets', async () => {
    const actual = (await readdir(resolve(root, 'src/content/blog'))).filter(p => p.endsWith('.md')).map(p => p.slice(0, -3));
    expect(actual).toHaveLength(130);
    expect(actual.sort()).toEqual([...currentSlugs].sort());
    expect(new Set(EXTENDED_LAUNCH_SLUGS).size).toBe(130);
    expect(new Set(allSlugs).size).toBe(90);
    expect([...EXTENDED_LAUNCH_SLUGS].sort()).toEqual([...currentSlugs].sort());
  });

  it('preserves every prior photo mapping and appends the four exact ordered references for the new cohort', async () => {
    expect(baseline.referencePhotoArticles).toHaveLength(67);
    expect(REFERENCE_PHOTO_ARTICLES.filter(a => allSlugs.includes(a.slug))).toEqual([...baseline.referencePhotoArticles, ...planned.map(({ slug, photos }) => ({
      slug, cover: [photos[0].url], body: photos.slice(1).map(p => p.url),
    }))]);
    for (const article of planned) {
      expect(new Set(article.photos.map(p => p.url)).size, article.slug).toBe(4);
      for (const photo of article.photos) expect(sha256(await readFile(resolve(root, 'public', photo.url.slice(1))))).toBe(photo.sha256);
    }
  });

  it('keeps all original topic memberships and gives each new guide a contextual incoming link', () => {
    expect(GUIDE_TOPICS.map(t => ({ name: t.name, slugs: t.slugs.filter(s => oldSlugs.includes(s)) }))).toEqual(baseline.guideTopics);
    const assigned = GUIDE_TOPICS.flatMap(t => t.slugs);
    expect(assigned).toHaveLength(130);
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
    expect(new Date(fm.date).toISOString()).toBe('2026-10-24T00:00:00.000Z');
    expect(fm).not.toHaveProperty('updated');
    expect(fm.draft).toBe(false);
    expect(fm.author).toBe('ARCLIFT Technical Editorial');
    const tree = parseFragment((await processor.render(content)).code), all = nodes(tree);
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
    const images = all.filter(n => n.tagName === 'img');
    expect([fm.coverImage, ...images.map(n => attr(n, 'src'))]).toEqual(article.photos.map(p => p.url));
    expect(images).toHaveLength(3);
    expect(fm.coverAlt.length).toBeGreaterThanOrEqual(20);
    expect(fm.coverCaption).toMatch(/reference photograph/i);
    expect(fm.coverCaption).toMatch(/does not|cannot|not evidence/i);
    for (const image of images) {
      expect(attr(image, 'alt').length).toBeGreaterThanOrEqual(20);
      const siblings = image.parentNode.parentNode.childNodes;
      const next = siblings.slice(siblings.indexOf(image.parentNode) + 1).find(n => n.nodeName !== '#text' || n.value.trim());
      expect(text(next)).toMatch(/reference photograph/i);
      expect(text(next)).toMatch(/does not|cannot|not evidence/i);
    }
    expect(all.filter(n => n.tagName === 'tbody').some(n => nodes(n).filter(x => x.tagName === 'tr').length >= 4)).toBe(true);
    const links = all.filter(n => n.tagName === 'a');
    expect(links.map(n => attr(n, 'href'))).toContain(`/blog/${article.nearestExisting70}/`);
    const ctas = links.map(n => attr(n, 'href')).filter(href => href?.startsWith('/contact/?'));
    expect(ctas.length).toBeGreaterThanOrEqual(1);
    for (const href of ctas) expect(['quote', 'datasheet', 'advice']).toContain(new URL(href, origin).searchParams.get('request'));
    expect(links.some(n => attr(n, 'href')?.startsWith('https://') && attr(n, 'target') === '_blank'
      && ['noopener', 'noreferrer'].every(rel => (attr(n, 'rel') ?? '').split(/\s+/).includes(rel)))).toBe(true);
  });

  it('retains day1 discovery within 130 guides and seven pagination pages without imposing Oct24 tie ordering', async () => {
    const first = await built('/blog/');
    const directory = first.find(n => n.attrs?.some(a => a.name === 'data-guide-directory'));
    expect(directory).toBeDefined();
    const directoryLinks = nodes(directory).filter(n => n.tagName === 'a').map(n => attr(n, 'href'));
    expect(directoryLinks.sort()).toEqual(currentSlugs.map(s => `/blog/${s}/`).sort());
    const cards = [];
    for (const [index, count] of [20, 20, 20, 20, 20, 20, 10].entries()) {
      const page = index === 0 ? first : await built(`/blog/page/${index + 1}/`);
      const links = page.filter(n => n.tagName === 'a' && hasClass(n, 'blog-card')).map(n => attr(n, 'href'));
      expect(links, `page ${index + 1}`).toHaveLength(count);
      cards.push(...links);
    }
    expect(cards.sort()).toEqual(currentSlugs.map(s => `/blog/${s}/`).sort());
    expect(new Set(cards).size).toBe(130);
  });

  it('preserves the fixed day1 result of 118 URLs within the current 160 URL sitemap', async () => {
    expect(baseline.sitemapUrls).toHaveLength(97);
    const xml = await readFile(resolve(root, 'dist/sitemap-0.xml'), 'utf8');
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    const articleUrls = (list) => list.filter(url => !/\/blog\/page\/\d+\/$/.test(url));
    const expected = articleUrls([...baseline.sitemapUrls, ...newSlugs.map(s => `${origin}/blog/${s}/`)]);
    const currentExpected = articleUrls([...expected, ...laterSlugs.map(s => `${origin}/blog/${s}/`)]);
    expect(xml).not.toMatch(/\/blog\/page\/\d+\//);
    expect([...articleUrls(urls)].sort()).toEqual(currentExpected.sort());
    for (const slug of newSlugs) {
      const page = await built(`/blog/${slug}/`);
      expect(page.filter(n => n.tagName === 'link' && attr(n, 'rel') === 'canonical').map(n => attr(n, 'href'))).toEqual([`${origin}/blog/${slug}/`]);
      const schema = page.filter(n => n.tagName === 'script' && attr(n, 'type') === 'application/ld+json')
        .map(n => JSON.parse((n.childNodes ?? []).map(c => c.value ?? '').join(''))).find(s => s['@type'] === 'BlogPosting');
      expect(schema).toMatchObject({ headline: planned.find(a => a.slug === slug).title, datePublished: '2026-10-24T00:00:00.000Z', dateModified: '2026-10-24T00:00:00.000Z' });
      const body = page.find(n => hasClass(n, 'article-content'));
      expect(body, slug).toBeDefined();
      expect(words(body), slug).toBeGreaterThanOrEqual(1500);
      expect(words(body), slug).toBeLessThanOrEqual(3000);
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
    expect(scripts['test:content'].split(/\s+/)).toContain('tests/new-articles-20261024-campaign-day1.test.mjs');
    expect(scripts.verify.split(' && ')).toContain('npm run test:content');
  });
});
