import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const productsDir = resolve(root, 'src/content/products');
const publicDir = resolve(root, 'public');
const productSlugs = [
  'arc-c17-crawler-roll-forming-lift',
  'arc-c21-crawler-roll-forming-lift',
  'arc-c25-crawler-roll-forming-lift',
  'arc-c28-crawler-roll-forming-lift',
  'arc-c32-crawler-roll-forming-lift',
  'arc-t12-truck-mounted-roll-forming-lift',
  'arc-t18-truck-mounted-roll-forming-lift',
  'arc-t25-truck-mounted-roll-forming-lift',
  'arc-t25hq-truck-mounted-roll-forming-lift-40hq',
  'arc-t31-truck-mounted-roll-forming-lift',
  'arc-f20-crawler-ceiling-platform',
  'arc-f25-crawler-ceiling-platform',
  'arc-f31-crawler-ceiling-platform',
  'arc-f35-crawler-ceiling-platform',
  'arc-rf8-roll-forming-machine',
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) paths.push(...await walk(path));
    else paths.push(path);
  }
  return paths;
}

async function product(slug) {
  return readFile(resolve(productsDir, `${slug}.md`), 'utf8');
}

describe('Product evidence integrity', () => {
  it('keeps exactly fifteen publishable product reference pages', async () => {
    const files = (await readdir(productsDir))
      .filter(name => name.endsWith('.md') && name !== '_template.md')
      .map(name => name.replace(/\.md$/, ''))
      .sort();
    expect(files).toEqual([...productSlugs].sort());
  });

  it('removes unsafe model-gallery JPG files and every public reference to them', async () => {
    const productImageDir = resolve(publicDir, 'images/products');
    const productImageFiles = await readdir(productImageDir).catch((error) => {
      if (error?.code === 'ENOENT') return [];
      throw error;
    });
    const oldFiles = productImageFiles.filter(name => /^arc-.*\.jpg$/i);
    expect(oldFiles).toEqual([]);

    const textFiles = [
      ...await walk(resolve(root, 'src')),
      resolve(publicDir, 'images/asset-manifest.json'),
    ].filter(path => /\.(?:astro|json|md|mjs|ts|tsx|js|css)$/i.test(path));
    const references = [];
    for (const path of textFiles) {
      const body = await readFile(path, 'utf8');
      if (/\/images\/products\/arc-.*\.jpg/i.test(body)) references.push(path);
    }
    expect(references).toEqual([]);
  });

  it.each(productSlugs)('%s qualifies numeric data and requires signed confirmation', async (slug) => {
    const body = await product(slug);
    expect(body).toMatch(/\b(?:archived|historical)\s+(?:source\s+)?reference\b/i);
    expect(body).toMatch(/\breference configuration\b/i);
    expect(body).toMatch(/\bproject[- ]specific confirmation\b/i);
    expect(body).toMatch(/\bsigned technical schedule\b/i);
    expect(body).toMatch(/\bapproved drawings?\b/i);
    expect(body).toMatch(/\brepresentative editorial\b/i);
    expect(body).toMatch(/\bnot model-specific evidence\b/i);
    expect(body).not.toMatch(/\b(?:Field images|real operating scenarios)\b/i);
  });

  it.each(productSlugs)('%s does not present archived classes as unconditional current facts', async (slug) => {
    const body = await product(slug);
    expect(body).not.toMatch(/description:\s*"[^"]*\b(?:\d+(?:\.\d+)?m(?:\s+lift)?\s+height|\d+t\s+capacity|0\.3\s*[-–]\s*1\.0mm|380V)\b(?![^"]*(?:archived|historical|reference))/i);
    expect(body).not.toMatch(/^\s{2}"[^"]*(?:Height|Capacity|Thickness|Power)[^"]*":\s*"(?![^"]*(?:Archived|Historical|Reference|Project-specific|To be confirmed))[^"]*\d/im);
    expect(body).not.toMatch(/\b(?:within one hour|highway speed|no trailer needed|without (?:a )?crane|without scaffolding|no splices|no (?:second )?handling|no coating damage|factory-matched|pre-commissioned)\b/i);
  });

  it('does not promise unconditional 40HQ fit anywhere in product content or listing copy', async () => {
    const files = [
      ...await Promise.all(productSlugs.map(product)),
      await readFile(resolve(root, 'src/pages/products/index.astro'), 'utf8'),
    ];
    const body = files.join('\n');
    expect(body).not.toMatch(/\b(?:fits?|ships?|packs?|secured)\s+(?:inside|in|into)\s+(?:a\s+|the\s+)?(?:standard\s+)?40HQ\b/i);
    expect(body).toMatch(/40HQ[\s\S]{0,160}(?:project|packing|confirmation|review|container-door)/i);
  });

  it('uses only shared editorial assets and discloses AI-assisted raster composites', async () => {
    const allowed = /\/images\/(?:hero\/hero-2\.webp|editorial\/(?:truck-site-roll-forming-lift\.webp|crawler-truck-selection-matrix\.svg|roof-level-workflow\.svg|40hq-logistics-checkpoints\.svg|port-loading-logistics\.webp|large-deck-steel-structure\.webp|ceiling-platform-underside\.webp|ceiling-platform-project-data\.svg|roll-forming-input-map\.svg))/g;
    for (const slug of productSlugs) {
      const body = await product(slug);
      const imageBlock = body.match(/^images:[ \t]*\r?\n((?:[ \t]{2}-[ \t]+"[^"]+"[ \t]*\r?\n?)+)/m)?.[1] ?? '';
      const urls = [...imageBlock.matchAll(/"([^"]+)"/g)].map(match => match[1]);
      expect(urls.length).toBeGreaterThanOrEqual(2);
      for (const url of urls) expect(url).toMatch(allowed);
      if (urls.some(url => url.endsWith('.webp'))) {
        expect(body).toMatch(/\bAI-assisted editorial composite\b/i);
      }
    }
  });

  it('renders editorial galleries without verified-product schema implications', async () => {
    const detail = await readFile(resolve(root, 'src/pages/products/[slug].astro'), 'utf8');
    expect(detail).toMatch(/['"]@type['"]:\s*['"]WebPage['"]/);
    expect(detail).not.toMatch(/['"]@type['"]:\s*['"]Product['"]/);
    expect(detail).not.toMatch(/additionalProperty/);
    expect(detail).not.toMatch(/\bimage:\s*data\.images/);
    expect(detail).not.toMatch(/alt=\{data\.title\}/);
    expect(detail).toContain('productView.imageDisclosure');
    expect(detail).not.toContain('Representative editorial image — not model-specific evidence.');
    expect(detail).toMatch(/object-fit:\s*contain/);
    expect(detail).toMatch(/Swipe horizontally/i);
  });

  it('keeps the public manifest explicitly editorial and disclosed', async () => {
    const manifest = JSON.parse(await readFile(resolve(publicDir, 'images/asset-manifest.json'), 'utf8'));
    expect(manifest.products).toHaveLength(15);
    for (const item of manifest.products) {
      expect(item.classification).toBe('editorial');
      expect(item.disclosure).toMatch(/representative editorial/i);
      expect(item.urls.every(url => !/\/images\/products\/arc-.*\.jpg/i.test(url))).toBe(true);
    }
  });

  it('keeps public product copy free of source identity and manufacturer positioning', async () => {
    const body = (await Promise.all(productSlugs.map(product))).join('\n');
    expect(body).not.toMatch(/\b(?:source factory|our factory|factory[- ]direct|professional manufacturer|ARCLIFT.{0,80}manufacturer)\b/i);
  });

  it('removes exact-price assumptions and fixed delivery promises from legacy templates', async () => {
    const layout = await readFile(resolve(root, 'src/layouts/ProductLayout.astro'), 'utf8');
    const template = await readFile(resolve(productsDir, '_template.md'), 'utf8');
    expect(layout).not.toMatch(/priceMin|priceMax|toFixed|Price Range/);
    expect(layout).not.toMatch(/alt=\{title\}[^>]*object-cover/);
    expect(template).not.toMatch(/\b(?:15\s*[-–]\s*30 days|3\s*[-–]\s*7 days|free samples|ISO 9001 certified|comply with CE)\b/i);
    expect(template).toMatch(/signed technical schedule/i);
  });
});
