import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const productManifestPath = resolve(root, 'public/images/asset-manifest.json');
const productListPath = resolve(root, 'src/pages/products/index.astro');
const productDetailPath = resolve(root, 'src/pages/products/[slug].astro');
const comparePagePath = resolve(root, 'src/pages/compare.astro');
const editorialDiagram = /\/images\/editorial\/(?:roof-level-workflow|crawler-truck-selection-matrix|40hq-logistics-checkpoints|ceiling-platform-project-data|roll-forming-input-map|crawler-platform-selection-path|ceiling-access-method-matrix|indoor-floor-load-review|remote-control-safety-loop|dual-power-duty-cycle|warehouse-ceiling-access-map)\.svg/;
const productDisclosure = 'Editorial planning visual — not model-specific evidence';
const productVisualDisclosure = `AI-assisted editorial visual. ${productDisclosure}`;
const compareVisualDisclosure = `AI-assisted editorial composite. ${productDisclosure}`;

async function markdown(dir) {
  const base = resolve(root, 'src/content', dir);
  return Promise.all(
    (await readdir(base))
      .filter(name => name.endsWith('.md'))
      .map(async name => ({
        name,
        body: await readFile(resolve(base, name), 'utf8'),
      })),
  );
}

describe('Replacement image truthfulness', () => {
  it('labels every substituted blog SVG as an editorial diagram', async () => {
    for (const { name, body } of await markdown('blog')) {
      const uses = [...body.matchAll(/!\[([^\]]+)\]\((\/images\/editorial\/[^)]+\.svg)\)(?:\]\([^)]+\))?\s*\n+\*([^*]+)\*/g)];
      for (const [, alt, url, caption] of uses) {
        if (!editorialDiagram.test(url)) continue;
        expect(alt, `${name}: ${url}`).toMatch(/^Editorial diagram\b/i);
        expect(caption, `${name}: ${url}`).toMatch(/^Editorial diagram\b/i);
        expect(caption, `${name}: ${url}`).not.toMatch(/\bconfiguration image\b/i);
      }
    }
  });

  it('does not attach editorial diagrams to solution planning pages as project images', async () => {
    for (const { name, body } of await markdown('solutions')) {
      expect(body, `solutions/${name}`).not.toMatch(/^image:\s*"\/images\/editorial\//m);
    }
  });

  it('does not retain case-study routes that could present editorial visuals as project evidence', async () => {
    await expect(readdir(resolve(root, 'src/pages/case-studies'))).rejects.toMatchObject({
      code: 'ENOENT',
    });
  });

  it('keeps all 15 product visual records editorial with one exact disclosure', async () => {
    const manifest = JSON.parse(await readFile(productManifestPath, 'utf8'));

    expect(manifest.products).toHaveLength(15);
    expect(new Set(manifest.products.map(record => record.slug)).size).toBe(15);
    for (const record of manifest.products) {
      expect(record.classification, record.slug).toBe('editorial');
      expect(record.disclosure, record.slug).toBe(productDisclosure);
      expect(record.urls.length, record.slug).toBeGreaterThan(0);
      for (const url of record.urls) {
        expect(url, record.slug).toMatch(/^\/images\/(?:editorial|hero)\//);
        expect(url, record.slug).not.toMatch(/^\/images\/products\//);
      }
    }
  });

  it('places an AI-assisted label and exact evidence boundary beside every scoped visual', async () => {
    const [selectionDomain, productList, productDetail, comparePage] = await Promise.all([
      readFile(resolve(root, 'src/lib/product-selection.ts'), 'utf8'),
      readFile(productListPath, 'utf8'),
      readFile(productDetailPath, 'utf8'),
      readFile(comparePagePath, 'utf8'),
    ]);

    expect(selectionDomain).toContain(`const IMAGE_DISCLOSURE = '${productDisclosure}'`);
    expect(productList).toMatch(
      new RegExp(`<img class="family-card__image"[\\s\\S]{0,500}<p class="image-disclosure">${productVisualDisclosure}<\\/p>`),
    );
    expect(productDetail).toMatch(
      /<figure class="decision-gallery__figure">[\s\S]{0,500}<figcaption>AI-assisted editorial visual\. \{productView\.imageDisclosure\}<\/figcaption>[\s\S]{0,100}<\/figure>/,
    );
    expect(comparePage).toMatch(
      new RegExp(`<section class="hero-banner"[\\s\\S]{0,700}compare\\.webp[\\s\\S]{0,700}<p class="hero-disclosure">${compareVisualDisclosure}<\\/p>[\\s\\S]{0,100}<\\/section>`),
    );
  });
});
