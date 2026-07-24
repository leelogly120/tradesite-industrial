import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');

describe('Task 8B family-aware product card specifications', () => {
  it('uses only evidence-safe keys and an explicit review fallback on both card surfaces', async () => {
    const list = await readFile(resolve(root, 'src/pages/products/index.astro'), 'utf8');
    const detail = await readFile(resolve(root, 'src/pages/products/[slug].astro'), 'utf8');

    for (const source of [list, detail]) {
      expect(source).toContain('getProductCardSpecs');
      expect(source).toContain("'Archived Height Class'");
      expect(source).toContain("'Archived Payload Class'");
      expect(source).toContain("'Archived Sheet Thickness'");
      expect(source).toContain("'Load Basis'");
      expect(source).toContain("'Project review'");
      expect(source).not.toMatch(
        /\b(?:Lift Height \(to shear exit\)|Max Working Height|Lifting Capacity|Safe Working Load)\b|['"]Sheet Thickness['"]/,
      );
      expect(source).not.toMatch(/\|\|\s*['"]—['"]/);
    }
  });

  it('renders family-appropriate honest labels instead of generic Height and Capacity suffixes', async () => {
    const list = await readFile(resolve(root, 'src/pages/products/index.astro'), 'utf8');
    const detail = await readFile(resolve(root, 'src/pages/products/[slug].astro'), 'utf8');
    const sources = `${list}\n${detail}`;

    for (const label of [
      'Archived height',
      'Archived payload',
      'Sheet thickness',
      'Load basis',
      'Platform envelope',
      'Material boundary',
      'Line interface',
      'Packing route',
      'Container checks',
    ]) {
      expect(sources).toContain(label);
    }
    expect(sources).not.toMatch(/\{[^}]+\}\s+(?:Height|Capacity)\b/);
  });

  it('sorts the listing only from Archived Height Class and leaves unknown items last', async () => {
    const list = await readFile(resolve(root, 'src/pages/products/index.astro'), 'utf8');
    expect(list).toContain("specs['Archived Height Class']");
    expect(list).toContain('Number.POSITIVE_INFINITY');
    expect(list).not.toContain("specs['Max Working Height']");
  });
});
