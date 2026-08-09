import { access, readdir, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EXTENDED_LAUNCH_SLUGS } from '../scripts/audit-lift-platform-content.mjs';
import {
  ALL_LIFT_PLATFORM_ARTICLES,
  BASELINE_BLOG_SLUGS,
} from '../scripts/lift-platform-article-registry.mjs';

const root = resolve(import.meta.dirname, '..');
const blogRoot = resolve(root, 'src/content/blog');
const editorialRoot = resolve(root, 'public/images/editorial');
const manifestPath = resolve(root, 'public/images/asset-manifest.json');
const markers = ['buyer-intent', 'conditions', 'evidence-tradeoffs', 'limitations-not-fit', 'project-checklist', 'cta-editorial-note'];

const AUGUST_10_ARTICLES = Object.freeze([
  {
    slug: 'aerial-platform-familiarization-handover',
    title: 'Aerial Platform Familiarization and Handover Guide',
    cover: '/images/editorial/ceiling-platform-underside.webp',
    diagram: 'aerial-platform-familiarization-handover.svg',
  },
  {
    slug: 'large-crawler-platform-transport-data-package',
    title: 'Transport Data Package for Large Crawler Platforms',
    cover: '/images/editorial/port-loading-logistics.webp',
    diagram: 'large-crawler-platform-transport-data-package.svg',
  },
]);

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function frontmatterValue(markdown, key) {
  const block = markdown.split('---', 3)[1] ?? '';
  return block.match(new RegExp(`^${key}:\\s*["']?([^"'\\r\\n]+)`, 'm'))?.[1]?.trim() ?? '';
}

function visibleWordCount(markdown) {
  const body = markdown.split('---', 3)[2] ?? markdown;
  const visible = body
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]+\]\([^)]+\)/g, ' ');
  return visible.match(/\b[A-Za-z0-9][A-Za-z0-9'-]*\b/g)?.length ?? 0;
}

describe('2026-08-10 two-article release contract', () => {
  it('adds only the two approved pages while retaining all 43 published routes', async () => {
    const approvedSlugs = AUGUST_10_ARTICLES.map(({ slug }) => slug);
    const registrySlugs = ALL_LIFT_PLATFORM_ARTICLES.map(({ slug }) => slug);
    const expected = [...BASELINE_BLOG_SLUGS, ...registrySlugs];
    expect(ALL_LIFT_PLATFORM_ARTICLES).toEqual(expect.arrayContaining(AUGUST_10_ARTICLES.map(({ slug, title, diagram }) => ({ slug, title, diagram, cluster: expect.any(String) }))));
    expect(new Set(expected).size).toBe(45);
    expect(EXTENDED_LAUNCH_SLUGS).toEqual(expect.arrayContaining(approvedSlugs));
    expect(new Set(EXTENDED_LAUNCH_SLUGS).size).toBe(45);
    const actual = (await readdir(blogRoot)).filter((name) => name.endsWith('.md')).map((name) => name.slice(0, -3)).sort();
    expect(actual).toEqual(expected.sort());
  });

  it.each(AUGUST_10_ARTICLES)('$slug satisfies the evidence-first long-form contract', async ({ slug, title, cover, diagram }) => {
    const path = resolve(blogRoot, `${slug}.md`);
    expect(await exists(path), path).toBe(true);
    const markdown = await readFile(path, 'utf8');
    const description = frontmatterValue(markdown, 'description');
    const bodyImages = [...markdown.matchAll(/!\[[^\]]+\]\((\/images\/[^)]+)\)/g)].map((match) => match[1]);
    const h2 = [...markdown.matchAll(/^##\s+\S.+$/gm)];
    const h3Plus = [...markdown.matchAll(/^#{3,4}\s+\S.+$/gm)];
    const internalLinks = [...markdown.matchAll(/\]\((\/(?:blog|products)\/[^)]+)\)/g)].map((match) => match[1]);

    expect(frontmatterValue(markdown, 'title')).toBe(title);
    expect(frontmatterValue(markdown, 'date')).toBe('2026-08-10');
    expect(frontmatterValue(markdown, 'coverImage')).toBe(cover);
    expect(title.length).toBeGreaterThanOrEqual(50);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(`${title} | ARCLIFT`.length).toBeLessThanOrEqual(70);
    expect(description.length).toBeGreaterThanOrEqual(150);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(visibleWordCount(markdown)).toBeGreaterThanOrEqual(1500);
    expect(visibleWordCount(markdown)).toBeLessThanOrEqual(3000);
    expect(markdown).toContain('**Contents**');
    expect(h2.length).toBeGreaterThanOrEqual(4);
    expect(h2.length).toBeLessThanOrEqual(6);
    expect(h3Plus.length).toBeGreaterThanOrEqual(12);
    expect((markdown.match(/^####\s+.+\?$/gm) ?? []).length).toBe(4);
    expect(bodyImages).toHaveLength(3);
    expect(new Set([cover, ...bodyImages]).size).toBe(4);
    expect(bodyImages).toContain(`/images/editorial/${diagram}`);
    expect(new Set(internalLinks).size).toBeGreaterThanOrEqual(2);
    expect(markdown).toMatch(/<a href="https:\/\/[^"\s]+" target="_blank" rel="noopener noreferrer">/);
    expect((markdown.match(/not evidence of (?:ARCLIFT )?equipment, configuration, project, capability or result/gi) ?? []).length).toBeGreaterThanOrEqual(4);
    expect(markdown).not.toMatch(/(?:^|[\s"'(])(?:[A-Za-z]:[\\/])|Henan\s+Huaying|河南华鹰|source factory|our factory|we manufacture/imu);
    for (const marker of markers) expect(markdown).toContain(`<!-- audit-section: ${marker} -->`);
  });

  it.each(AUGUST_10_ARTICLES)('$diagram is accessible and mobile-readable', async ({ diagram }) => {
    const path = resolve(editorialRoot, diagram);
    expect(await exists(path), path).toBe(true);
    const svg = await readFile(path, 'utf8');
    const labels = [...svg.matchAll(/<text\b([^>]*)data-role="decision-label"([^>]*)>([^<]+)<\/text>/gi)];
    const textNodes = [...svg.matchAll(/<text\b([^>]*)>([^<]*)<\/text>/gi)];
    expect(svg).toMatch(/<svg\b[^>]*viewBox="0 0 1600 900"/i);
    expect(svg).toMatch(/<title\b[^>]*>[^<]+<\/title>/i);
    expect(svg).toMatch(/<desc\b[^>]*>[^<]+<\/desc>/i);
    expect(svg).toContain('ARCLIFT');
    expect(labels.length).toBeGreaterThanOrEqual(3);
    expect(labels.length).toBeLessThanOrEqual(5);
    for (const node of textNodes) {
      const fontSize = Number(node[1].match(/font-size="(\d+(?:\.\d+)?)"/i)?.[1]);
      expect(fontSize * 390 / 1600).toBeGreaterThanOrEqual(10);
    }
    expect(svg).not.toMatch(/(?:^|[\s"'(])(?:[A-Za-z]:[\\/])|Henan\s+Huaying|河南华鹰|manufacturer|factory|certification|guarantee/imu);
  });

  it('classifies both new diagrams without provenance fields', async () => {
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    const records = manifest.campaigns.editorial;
    for (const { slug, diagram } of AUGUST_10_ARTICLES) {
      const record = records.find((candidate) => candidate.slug === slug);
      expect(record).toEqual(expect.objectContaining({
        slug,
        url: `/images/editorial/${diagram}`,
        classification: 'editorial',
        disclosure: 'AI-assisted editorial diagram; not evidence of ARCLIFT equipment, configuration, project, capability or result',
      }));
      expect(record).not.toHaveProperty('sourceFactory');
      expect(record).not.toHaveProperty('localPath');
      expect(record).not.toHaveProperty('customer');
    }
  });
});
