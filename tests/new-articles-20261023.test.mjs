import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { parse } from 'parse5';
import { describe, expect, it } from 'vitest';
import * as registry from '../scripts/lift-platform-article-registry.mjs';
import { EXTENDED_LAUNCH_SLUGS } from '../scripts/audit-lift-platform-content.mjs';
import { REFERENCE_PHOTO_ARTICLES } from '../scripts/reference-photo-articles.mjs';
import { GUIDE_TOPICS, getRelatedGuides } from '../src/lib/guide-navigation.ts';

const root = resolve(import.meta.dirname, '..');
const baseline = JSON.parse(await readFile(resolve(root, 'tests/fixtures/october-23-baseline.json'), 'utf8'));
const oldSlugs = baseline.articles.map(a => a.slug);
const newArticles = registry.OCTOBER_23_LIFT_PLATFORM_ARTICLES ?? [];
const newSlugs = newArticles.map(a => a.slug);
const allSlugs = [...oldSlugs, ...newSlugs];
const origin = 'https://www.arclifteq.com';
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const nodes = n => [n, ...(n.childNodes ?? []).flatMap(nodes)];
const attr = (n, key) => n.attrs?.find(a => a.name === key)?.value;
const built = async route => nodes(parse(await readFile(resolve(root, 'dist', `.${route}`, 'index.html'), 'utf8')));
const front = (source, key) => source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1].match(new RegExp(`^${key}:\\s*["']?([^"'\\r\\n]+)`, 'm'))?.[1]?.trim();

describe('2026-10-23 twenty genuinely new article URLs', () => {
  it('adds twenty distinct approved slugs outside the frozen fifty and audits all seventy', async () => {
    expect(baseline.articles).toHaveLength(50);
    expect(newArticles).toHaveLength(20);
    expect(new Set(newSlugs).size).toBe(20);
    expect(newSlugs.filter(slug => oldSlugs.includes(slug))).toEqual([]);
    expect([...EXTENDED_LAUNCH_SLUGS].sort()).toEqual([...allSlugs].sort());
    expect(new Set(EXTENDED_LAUNCH_SLUGS).size).toBe(70);
    const actual = (await readdir(resolve(root, 'src/content/blog'))).filter(p => p.endsWith('.md')).map(p => p.slice(0, -3));
    expect(actual.sort()).toEqual([...allSlugs].sort());
    expect(actual).toHaveLength(70);
  });

  it('preserves every prior article source and all twelve approved photo files', async () => {
    expect(baseline.photos).toHaveLength(12);
    for (const article of baseline.articles) {
      const source = await readFile(resolve(root, 'src/content/blog', article.slug + '.md'), 'utf8');
      expect(sha256(source.replace(/\r\n/g, '\n')), article.slug).toBe(article.sha256);
    }
    for (const photo of baseline.photos) expect(sha256(await readFile(resolve(root, 'public', photo.url.slice(1)))), photo.url).toBe(photo.sha256);
  });

  it('uses four distinct existing real photos and an honest new publication date for every added article', async () => {
    expect(newArticles).toHaveLength(20);
    const approvedPhotos = baseline.photos.map(p => p.url);
    for (const { slug, title } of newArticles) {
      const source = await readFile(resolve(root, 'src/content/blog', slug + '.md'), 'utf8');
      expect(front(source, 'title'), slug).toBe(title);
      expect(front(source, 'date'), slug).toBe('2026-10-24');
      expect(front(source, 'draft'), slug).toBe('false');
      const cover = front(source, 'coverImage');
      const body = [...source.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(m => m[1]);
      expect(body, slug).toHaveLength(3);
      expect(new Set([cover, ...body]).size, slug).toBe(4);
      for (const url of [cover, ...body]) expect(approvedPhotos, slug).toContain(url);
      expect(REFERENCE_PHOTO_ARTICLES.find(a => a.slug === slug), slug).toEqual({ slug, cover: [cover], body });
      expect(source, slug).not.toMatch(/!\[[^\]]*\]\(\/images\/editorial\//);
    }
  });

  it('assigns every guide once and supplies an incoming contextual link to every new guide', () => {
    expect(newArticles).toHaveLength(20);
    const assigned = GUIDE_TOPICS.flatMap(t => t.slugs);
    expect(assigned).toHaveLength(70);
    expect([...assigned].sort()).toEqual([...allSlugs].sort());
    const posts = allSlugs.map(id => ({ id, data: { title: id, description: 'Guide.', draft: false } }));
    const incoming = new Set(allSlugs.flatMap(slug => getRelatedGuides(slug, posts).map(link => link.href)));
    for (const slug of newSlugs) expect(incoming.has(`/blog/${slug}/`), slug).toBe(true);
  });

  it('discovers all seventy through the built topic directory and four complete pagination pages', async () => {
    expect(newArticles).toHaveLength(20);
    const first = await built('/blog/');
    const directory = first.find(n => n.attrs?.some(a => a.name === 'data-guide-directory'));
    const directoryLinks = nodes(directory).filter(n => n.tagName === 'a').map(n => attr(n, 'href'));
    expect(directoryLinks.sort()).toEqual(allSlugs.map(s => `/blog/${s}/`).sort());
    const cards = [];
    for (const [index, count] of [20, 20, 20, 10].entries()) {
      const page = index === 0 ? first : await built(`/blog/page/${index + 1}/`);
      const links = page.filter(n => n.tagName === 'a' && (attr(n, 'class') ?? '').split(/\s+/).includes('blog-card')).map(n => attr(n, 'href'));
      expect(links, `page ${index + 1}`).toHaveLength(count);
      if (index === 0) expect([...links].sort()).toEqual(newSlugs.map(s => `/blog/${s}/`).sort());
      cards.push(...links);
    }
    expect(cards.sort()).toEqual(allSlugs.map(s => `/blog/${s}/`).sort());
  });

  it('adds exactly twenty article sitemap URLs plus page four, preserving all seventy-six prior URLs', async () => {
    expect(newArticles).toHaveLength(20);
    const xml = await readFile(resolve(root, 'dist/sitemap-0.xml'), 'utf8');
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    const expected = [...baseline.sitemapUrls, ...newSlugs.map(s => `${origin}/blog/${s}/`), `${origin}/blog/page/4/`];
    expect(urls).toHaveLength(97);
    expect(new Set(urls).size).toBe(97);
    expect([...urls].sort()).toEqual(expected.sort());
    for (const slug of newSlugs) {
      const page = await built(`/blog/${slug}/`);
      expect(page.filter(n => n.tagName === 'link' && attr(n, 'rel') === 'canonical').map(n => attr(n, 'href')), slug).toEqual([`${origin}/blog/${slug}/`]);
      const articleSchema = page.filter(n => n.tagName === 'script' && attr(n, 'type') === 'application/ld+json').map(n => JSON.parse((n.childNodes ?? []).map(c => c.value ?? '').join(''))).find(s => s['@type'] === 'BlogPosting');
      expect(articleSchema?.datePublished, slug).toBe('2026-10-24T00:00:00.000Z');
      const internal = page.filter(n => n.tagName === 'a' && attr(n, 'href')?.startsWith('/')).map(n => attr(n, 'href'));
      for (const target of internal) {
        const url = new URL(target, origin);
        const targetPage = await built(url.pathname);
        if (url.hash) expect(targetPage.some(n => attr(n, 'id') === decodeURIComponent(url.hash.slice(1))), `${slug}: ${target}`).toBe(true);
      }
    }
  });
});
