import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as registry from '../scripts/lift-platform-article-registry.mjs';

const root = resolve(import.meta.dirname, '..');
const editorialDisclosure = 'AI-assisted editorial diagram; not evidence of ARCLIFT equipment, configuration, project, capability or result';
const auditMarkers = ['buyer-intent', 'conditions', 'evidence-tradeoffs', 'limitations-not-fit', 'project-checklist', 'cta-editorial-note'];
const recoveredArticles = [
  {
    slug: 'pick-and-carry-vs-spider-lift',
    title: 'Pick-and-Carry Crane vs Spider Lift: Task Boundaries',
    description: 'Compare pick-and-carry cranes with spider lifts by task boundary, load handling, personnel access, site interfaces, and evidence required before selection.',
    cover: '/images/editorial/crawler-platform-selection-path.svg',
    bodyImages: [
      '/images/editorial/pick-and-carry-vs-spider-lift.svg',
      '/images/editorial/ceiling-access-method-matrix.svg',
      '/images/editorial/indoor-floor-load-review.svg',
    ],
    requiredLinks: [
      '/blog/crawler-platform-vs-spider-lift-vs-scaffolding/',
      '/blog/aerial-platform-worker-tool-material-load-planning/',
    ],
  },
  {
    slug: 'ceiling-maintenance-safety-checklist',
    title: 'Ceiling Maintenance Safety Checklist for Access Work',
    description: 'Use this ceiling maintenance safety checklist to collect access, floor, clearance, route, rescue, and task evidence before equipment selection begins.',
    cover: '/images/editorial/ceiling-platform-underside.webp',
    bodyImages: [
      '/images/editorial/ceiling-maintenance-safety-checklist.svg',
      '/images/editorial/clearance-four-state-section.svg',
      '/images/editorial/rescue-readiness-loop.svg',
    ],
    requiredLinks: [
      '/blog/indoor-aerial-platform-ground-pressure-guide/',
      '/blog/ceiling-platform-overhead-clearance-survey/',
      '/blog/large-crawler-work-platform-building-entry-survey/',
      '/blog/aerial-platform-emergency-lowering-rescue-plan/',
      '/blog/crawler-ceiling-wall-panel-platform-project-data/',
    ],
  },
  {
    slug: 'ceiling-work-technology-trends',
    title: 'Ceiling Work Technology Trends: Evidence to Verify',
    description: 'Review ceiling work technology trends through verifiable controls, power systems, access interfaces, and site data—not forecasts or marketing claims alone.',
    cover: '/images/editorial/large-deck-steel-structure.webp',
    bodyImages: [
      '/images/editorial/ceiling-work-technology-trends.svg',
      '/images/editorial/dual-power-duty-cycle.svg',
      '/images/editorial/remote-control-safety-loop.svg',
    ],
    requiredLinks: [
      '/blog/remote-control-aerial-platform-safety-planning/',
      '/blog/dual-power-crawler-platform-selection/',
      '/blog/ceiling-platform-overhead-clearance-survey/',
      '/blog/crawler-ceiling-wall-panel-platform-project-data/',
    ],
  },
];

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function frontmatterValue(markdown, key) {
  const block = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  return block.match(new RegExp(`^${key}:\\s*["']?([^"'\\r\\n]+)`, 'm'))?.[1]?.trim() ?? '';
}

function visibleWordCount(markdown) {
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
  const visible = body
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  return visible.match(/\b[A-Za-z0-9][A-Za-z0-9'-]*\b/g)?.length ?? 0;
}

describe('ranked URL recovery contract', () => {
  it('registers exactly the three search-visible routes that need recovery', () => {
    expect(registry.RECOVERED_RANKED_ARTICLES).toBeDefined();
    expect(registry.RECOVERED_RANKED_ARTICLES?.map(({ slug }) => slug)).toEqual(recoveredArticles.map(({ slug }) => slug));
    expect(registry.RECOVERED_RANKED_ARTICLE_SLUGS).toEqual(recoveredArticles.map(({ slug }) => slug));
  });

  it.each(recoveredArticles)('keeps /blog/$slug/ as a substantial evidence-first source page', async (article) => {
    const sourcePath = resolve(root, 'src/content/blog', `${article.slug}.md`);
    expect(await exists(sourcePath), sourcePath).toBe(true);
    if (!(await exists(sourcePath))) return;

    const markdown = await readFile(sourcePath, 'utf8');
    const images = [...markdown.matchAll(/!\[[^\]]+\]\((\/images\/[^)]+)\)/g)].map((match) => match[1]);
    const links = [...markdown.matchAll(/\]\((\/blog\/[^)]+)\)/g)].map((match) => match[1]);

    expect(frontmatterValue(markdown, 'title')).toBe(article.title);
    expect(frontmatterValue(markdown, 'description')).toBe(article.description);
    expect(article.title.length).toBeGreaterThanOrEqual(50);
    expect(article.title.length).toBeLessThanOrEqual(60);
    expect(article.description.length).toBeGreaterThanOrEqual(150);
    expect(article.description.length).toBeLessThanOrEqual(160);
    expect(frontmatterValue(markdown, 'coverImage')).toBe(article.cover);
    expect(images).toEqual(article.bodyImages);
    expect(new Set([article.cover, ...images]).size).toBe(4);
    expect(visibleWordCount(markdown)).toBeGreaterThanOrEqual(1500);
    expect(visibleWordCount(markdown)).toBeLessThanOrEqual(3000);
    expect((markdown.match(/^##\s+\S.+$/gm) ?? []).length).toBeGreaterThanOrEqual(4);
    expect((markdown.match(/^##\s+\S.+$/gm) ?? []).length).toBeLessThanOrEqual(6);
    expect((markdown.match(/^#{3,4}\s+\S.+$/gm) ?? []).length).toBeGreaterThanOrEqual(12);
    expect((markdown.match(/^####\s+.+\?$/gm) ?? []).length).toBeGreaterThanOrEqual(4);
    for (const marker of auditMarkers) expect(markdown).toContain(`<!-- audit-section: ${marker} -->`);
    for (const image of images) expect(markdown).toMatch(new RegExp(`${image.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}[\\s\\S]{0,500}${editorialDisclosure.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}`));
    for (const link of article.requiredLinks) expect(links).toContain(link);
    expect(markdown).toMatch(/<a href="https:\/\/[^"\s]+" target="_blank" rel="noopener noreferrer">/);
    expect(markdown).not.toMatch(/(?:^|[\s"'(>])(?:[A-Za-z]:[\\/]|\/(?:Users|home)\/)|source factory|customer project identity/imu);
  });

  it.each(recoveredArticles)('builds /blog/$slug/ with a self-canonical instead of a 404', async ({ slug }) => {
    const outputPath = resolve(root, 'dist/blog', slug, 'index.html');
    expect(await exists(outputPath), outputPath).toBe(true);
    if (!(await exists(outputPath))) return;
    const html = await readFile(outputPath, 'utf8');
    expect(html).toContain(`<link rel="canonical" href="https://www.arclifteq.com/blog/${slug}/">`);
    expect(html).not.toMatch(/<meta\s+name="robots"\s+content="noindex/i);
  });

  it.each(recoveredArticles)('keeps the $slug editorial diagram accessible and private-source free', async ({ slug }) => {
    const path = resolve(root, 'public/images/editorial', `${slug}.svg`);
    expect(await exists(path), path).toBe(true);
    if (!(await exists(path))) return;
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
      const fontSize = Number(`${node[1]} ${node[2]}`.match(/font-size="(\d+(?:\.\d+)?)"/i)?.[1]);
      expect(fontSize * 390 / 1600).toBeGreaterThanOrEqual(10);
    }
    expect(svg).not.toMatch(/<image\b|data:image|(?:href|src)=["']https?:\/\/|(?:^|[\s"'(>])(?:[A-Za-z]:[\\/]|\/(?:Users|home)\/)|manufacturer|factory|customer|project identity/imu);
  });

  it('registers every recovered editorial diagram with the non-evidence disclosure', async () => {
    const manifest = JSON.parse(await readFile(resolve(root, 'public/images/asset-manifest.json'), 'utf8'));
    for (const { slug } of recoveredArticles) {
      expect(manifest.campaigns.editorial).toContainEqual(expect.objectContaining({
        slug,
        url: `/images/editorial/${slug}.svg`,
        classification: 'editorial',
        disclosure: editorialDisclosure,
      }));
    }
  });

  it('aligns the chassis page with integration intent without changing its evidence boundary', async () => {
    const markdown = await readFile(resolve(root, 'src/content/blog/truck-mounted-roll-forming-chassis-interface-review.md'), 'utf8');
    expect(frontmatterValue(markdown, 'title')).toBe('Truck Chassis Integration Review for Roll-Forming Lines');
    expect(frontmatterValue(markdown, 'description')).toBe('Review truck chassis integration for mobile roll-forming lines, including interfaces, payload allocation, stability inputs, utilities, and verification records.');
    expect(markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').slice(0, 900)).toMatch(/truck chassis integration/i);
    expect(markdown).toMatch(/loads, stability, road use, registration, compliance, final architecture and chassis fit remain undecided/i);
  });

  it.each([
    ['crawler-platform-vs-spider-lift-vs-scaffolding', '/blog/pick-and-carry-vs-spider-lift/'],
    ['ceiling-platform-overhead-clearance-survey', '/blog/ceiling-maintenance-safety-checklist/'],
    ['aerial-platform-emergency-lowering-rescue-plan', '/blog/ceiling-maintenance-safety-checklist/'],
    ['crawler-ceiling-wall-panel-platform-project-data', '/blog/ceiling-work-technology-trends/'],
    ['remote-control-aerial-platform-safety-planning', '/blog/ceiling-work-technology-trends/'],
    ['dual-power-crawler-platform-selection', '/blog/ceiling-work-technology-trends/'],
  ])('keeps a contextual link from %s to %s', async (sourceSlug, target) => {
    const markdown = await readFile(resolve(root, 'src/content/blog', `${sourceSlug}.md`), 'utf8');
    expect(markdown).toContain(`](${target})`);
  });
});
