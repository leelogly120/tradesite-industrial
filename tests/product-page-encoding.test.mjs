import { isUtf8 } from 'node:buffer';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const productRoot = resolve(root, 'src/content/products');

const activeProductFiles = [
  'src/lib/product-selection.ts',
  'src/lib/product-compare.ts',
  'src/pages/products/index.astro',
  'src/pages/products/[slug].astro',
  'src/pages/compare.astro',
];

const knownMojibake = [
  /\uFFFD/u,
  /(?:Ã.|Â.)/u,
  /â(?:€|€”|€“|†|œ|„|€™|‡|€¦)/u,
  /ðŸ/u,
  /(?:鈥|鈫|馃|锟|璺|鎵|脙|漏|鈿|绔|娴|鏂|闃|浼|灏|寮|顸|聽)/u,
];

async function productFiles() {
  const markdown = (await readdir(productRoot))
    .filter(name => name.endsWith('.md'))
    .map(name => resolve(productRoot, name));
  return [...activeProductFiles.map(file => resolve(root, file)), ...markdown];
}

describe('product page encoding regression', () => {
  it('keeps every active product source valid UTF-8 without known mojibake', async () => {
    const failures = [];

    for (const file of await productFiles()) {
      const bytes = await readFile(file);
      const text = bytes.toString('utf8');
      if (!isUtf8(bytes)) failures.push(`${file}: invalid UTF-8 byte sequence`);
      for (const pattern of knownMojibake) {
        if (pattern.test(text)) failures.push(`${file}: ${pattern} matched`);
      }
    }

    expect(failures).toEqual([]);
  });

  it('preserves intentional punctuation used by the product UI', async () => {
    const [detail, compare, domain] = await Promise.all([
      readFile(resolve(root, 'src/pages/products/[slug].astro'), 'utf8'),
      readFile(resolve(root, 'src/lib/product-compare.ts'), 'utf8'),
      readFile(resolve(root, 'src/lib/product-selection.ts'), 'utf8'),
    ]);

    expect(detail).toContain("data.title.split(' — ')");
    expect(detail).toContain('Request a project review →');
    expect(compare).toContain(' — ${view.statusNote}');
    expect(domain).toContain('Editorial planning visual — not model-specific evidence');
  });
});
