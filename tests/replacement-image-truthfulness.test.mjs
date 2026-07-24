import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const editorialDiagram = /\/images\/editorial\/(?:roof-level-workflow|crawler-truck-selection-matrix|40hq-logistics-checkpoints|ceiling-platform-project-data|roll-forming-input-map)\.svg/;

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
});
