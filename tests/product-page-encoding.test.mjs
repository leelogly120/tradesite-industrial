import { isUtf8 } from 'node:buffer';
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
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
  /\u00E2(?:\u20AC.|\u201A\u00AC|\u201E\u00A2|\u2020.|\u2030.)/u,
  /ðŸ/u,
  /(?:鈥|鈫|馃|锟|璺|鎵|脙|漏|鈿|绔|娴|鏂|闃|浼|灏|寮|顸|聽)/u,
];

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const discovered = await Promise.all(
    entries.map(async entry => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return markdownFiles(path);
      return entry.isFile() && entry.name.endsWith('.md') ? [path] : [];
    }),
  );
  return discovered.flat();
}

async function productFiles(markdownRoot = productRoot) {
  const markdown = await markdownFiles(markdownRoot);
  return [...activeProductFiles.map(file => resolve(root, file)), ...markdown];
}

describe('product page encoding regression', () => {
  it.each([
    ['replacement character', '\uFFFD'],
    ['UTF-8 Latin letter decoded as Windows-1252', 'Fran\u00C3\u00A7ais'],
    ['UTF-8 non-breaking space decoded as Windows-1252', '20\u00C2\u00A0kg'],
    ['bullet decoded as Windows-1252', '\u00E2\u20AC\u00A2'],
    ['left single quote decoded as Windows-1252', '\u00E2\u20AC\u02DC'],
    ['right single quote decoded as Windows-1252', '\u00E2\u20AC\u2122'],
    ['en dash decoded as Windows-1252', '\u00E2\u20AC\u201C'],
    ['em dash decoded as Windows-1252', '\u00E2\u20AC\u201D'],
    ['ellipsis decoded as Windows-1252', '\u00E2\u20AC\u00A6'],
    ['euro sign decoded as Windows-1252', '\u00E2\u201A\u00AC'],
    ['emoji prefix decoded as Windows-1252', '\u00F0\u0178'],
    ['double-decoded punctuation', '\u9225'],
  ])('detects %s', (_label, sample) => {
    expect(knownMojibake.some(pattern => pattern.test(sample))).toBe(true);
  });

  it.each(['\u2022', '\u2018', '\u2019', '\u201C', '\u201D', '\u20AC', '\u2013', '\u2014', '\u2026', '\u2192'])(
    'does not flag intentional punctuation: %s',
    sample => {
      expect(knownMojibake.some(pattern => pattern.test(sample))).toBe(false);
    },
  );

  it('discovers product Markdown recursively', async () => {
    const fixtureRoot = await mkdtemp(join(tmpdir(), 'product-page-encoding-'));
    const nestedRoot = resolve(fixtureRoot, 'family', 'series');
    const nestedMarkdown = resolve(nestedRoot, 'nested-product.md');

    try {
      await mkdir(nestedRoot, { recursive: true });
      await writeFile(nestedMarkdown, '# Nested product fixture\n', 'utf8');

      expect(await productFiles(fixtureRoot)).toContain(nestedMarkdown);
    } finally {
      await rm(fixtureRoot, { recursive: true, force: true });
    }
  });

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
