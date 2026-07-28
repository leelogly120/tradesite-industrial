import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');

describe('Task 8B family-aware product card specifications', () => {
  it('uses the shared evidence-safe presentation mapping on both card surfaces', async () => {
    const list = await readFile(resolve(root, 'src/pages/products/index.astro'), 'utf8');
    const detail = await readFile(resolve(root, 'src/pages/products/[slug].astro'), 'utf8');

    for (const source of [list, detail]) {
      expect(source).toContain("from '../../lib/product-selection'");
      expect(source).toContain('buildProductView');
      expect(source).not.toContain('function getProductCardSpecs');
      expect(source).not.toMatch(
        /\b(?:Lift Height \(to shear exit\)|Max Working Height|Lifting Capacity|Safe Working Load)\b|['"]Sheet Thickness['"]/,
      );
      expect(source).not.toMatch(/\|\|\s*['"]—['"]/);
    }
  });

  it('uses shared orientation labels instead of generic Height and Capacity suffixes', async () => {
    const list = await readFile(resolve(root, 'src/pages/products/index.astro'), 'utf8');
    const detail = await readFile(resolve(root, 'src/pages/products/[slug].astro'), 'utf8');
    const sources = `${list}\n${detail}`;

    expect(sources).toContain('orientation.label');
    expect(sources).not.toMatch(/\{[^}]+\}\s+(?:Height|Capacity)\b/);
  });

  it('sorts the listing with the shared orientation and leaves unknown items last', async () => {
    const list = await readFile(resolve(root, 'src/pages/products/index.astro'), 'utf8');
    expect(list).toContain('orientation.value');
    expect(list).toContain('Number.POSITIVE_INFINITY');
    expect(list).not.toContain("specs['Max Working Height']");
  });
  it('fails fast instead of silently removing an unmapped published product', async () => {
    const list = await readFile(resolve(root, 'src/pages/products/index.astro'), 'utf8');
    expect(list).toContain('throw new Error(`Unknown product reference: ${p.id}`)');
    expect(list).not.toContain('if (!view) return null');
  });
});
