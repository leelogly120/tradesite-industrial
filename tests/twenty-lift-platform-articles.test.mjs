import { access, readdir, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EXTENDED_LAUNCH_SLUGS } from '../scripts/audit-lift-platform-content.mjs';
import {
  AUGUST_10_LIFT_PLATFORM_ARTICLE_SLUGS,
  BASELINE_BLOG_SLUGS,
  DAILY_LIFT_PLATFORM_ARTICLE_SLUGS,
  LIFT_PLATFORM_ARTICLES,
  LIFT_PLATFORM_ARTICLE_SLUGS,
} from '../scripts/lift-platform-article-registry.mjs';

const root = resolve(import.meta.dirname, '..');
const blogRoot = resolve(root, 'src/content/blog');
const editorialRoot = resolve(root, 'public/images/editorial');
const manifestPath = resolve(root, 'public/images/asset-manifest.json');
const markers = ['buyer-intent', 'conditions', 'evidence-tradeoffs', 'limitations-not-fit', 'project-checklist', 'cta-editorial-note'];

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
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]+\]\([^)]*\)/g, ' ');
  return visible.match(/\b[A-Za-z0-9][A-Za-z0-9'-]*\b/g)?.length ?? 0;
}

describe('twenty lift-platform article release contract', () => {
  it('keeps 20 unique approved articles and the protected 24-page baseline', () => {
    expect(LIFT_PLATFORM_ARTICLES).toHaveLength(20);
    expect(new Set(LIFT_PLATFORM_ARTICLE_SLUGS).size).toBe(20);
    expect(BASELINE_BLOG_SLUGS).toHaveLength(24);
    expect(new Set([...BASELINE_BLOG_SLUGS, ...LIFT_PLATFORM_ARTICLE_SLUGS, ...DAILY_LIFT_PLATFORM_ARTICLE_SLUGS, ...AUGUST_10_LIFT_PLATFORM_ARTICLE_SLUGS]).size).toBe(48);
  });

  it('includes every approved article in the executable content audit', () => {
    expect(EXTENDED_LAUNCH_SLUGS).toEqual(expect.arrayContaining(LIFT_PLATFORM_ARTICLE_SLUGS));
    expect(new Set(EXTENDED_LAUNCH_SLUGS).size).toBe(48);
  });

  it('retains the protected baseline plus 20 pages and the approved daily pages', async () => {
    const slugs = (await readdir(blogRoot)).filter((name) => name.endsWith('.md')).map((name) => name.slice(0, -3)).sort();
    expect(slugs).toEqual([...BASELINE_BLOG_SLUGS, ...LIFT_PLATFORM_ARTICLE_SLUGS, ...DAILY_LIFT_PLATFORM_ARTICLE_SLUGS, ...AUGUST_10_LIFT_PLATFORM_ARTICLE_SLUGS].sort());
  });

  it.each(LIFT_PLATFORM_ARTICLES)('$slug satisfies the long-form article contract', async ({ slug, title, diagram }) => {
    const path = resolve(blogRoot, `${slug}.md`);
    expect(await exists(path), path).toBe(true);
    const markdown = await readFile(path, 'utf8');
    const description = frontmatterValue(markdown, 'description');
    const cover = frontmatterValue(markdown, 'coverImage');
    const bodyImages = [...markdown.matchAll(/!\[[^\]]+\]\((\/images\/[^)]+)\)/g)].map((match) => match[1]);
    const h2 = [...markdown.matchAll(/^##\s+\S.+$/gm)];
    const h3Plus = [...markdown.matchAll(/^#{3,4}\s+\S.+$/gm)];
    const internalLinks = [...markdown.matchAll(/\]\((\/(?:blog|products)\/[^)]+)\)/g)].map((match) => match[1]);

    expect(frontmatterValue(markdown, 'title')).toBe(title);
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
    expect((markdown.match(/^####\s+.+\?$/gm) ?? []).length).toBeGreaterThanOrEqual(4);
    expect(bodyImages).toHaveLength(3);
    expect(new Set([cover, ...bodyImages]).size).toBe(4);
    expect(bodyImages).toContain(`/images/editorial/${diagram}`);
    expect(new Set(internalLinks).size).toBeGreaterThanOrEqual(2);
    expect(markdown).toMatch(/<a href="https:\/\/[^"\s]+" target="_blank" rel="noopener noreferrer">/);
    for (const marker of markers) expect(markdown).toContain(`<!-- audit-section: ${marker} -->`);
  });

  it.each(LIFT_PLATFORM_ARTICLES)('$diagram is an accessible mobile-readable editorial SVG', async ({ diagram }) => {
    const path = resolve(editorialRoot, diagram);
    expect(await exists(path), path).toBe(true);
    const svg = await readFile(path, 'utf8');
    const labels = [...svg.matchAll(/<text\b([^>]*)data-role="decision-label"([^>]*)>([^<]+)<\/text>/gi)];
    const textNodes = [...svg.matchAll(/<text\b([^>]*)>([^<]*)<\/text>/gi)];
    expect(svg).toMatch(/<svg\b[^>]*viewBox="0 0 1600 900"/i);
    expect(svg).toMatch(/<title>[^<]+<\/title>/i);
    expect(svg).toMatch(/<desc>[^<]+<\/desc>/i);
    expect(svg).toContain('ARCLIFT');
    expect(labels.length).toBeGreaterThanOrEqual(3);
    expect(labels.length).toBeLessThanOrEqual(5);
    for (const node of textNodes) {
      const fontSize = Number(node[1].match(/font-size="(\d+(?:\.\d+)?)"/i)?.[1]);
      expect(fontSize * 390 / 1600).toBeGreaterThanOrEqual(10);
    }
    expect(svg).not.toMatch(/(?:^|[\s"'(])(?:[A-Za-z]:[\\/])|Henan\s+Huaying|\u6cb3\u5357\u534e\u9e70|manufacturer|factory|certification|guarantee/imu);
  });

  it('classifies all 20 diagrams in the public manifest without provenance fields', async () => {
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    const records = manifest.campaigns.editorial;
    for (const { slug, diagram } of LIFT_PLATFORM_ARTICLES) {
      expect(records).toContainEqual(expect.objectContaining({
        slug,
        url: `/images/editorial/${diagram}`,
        classification: 'editorial',
        disclosure: 'AI-assisted editorial diagram; not evidence of ARCLIFT equipment, configuration, project, capability or result',
      }));
    }
  });
});

