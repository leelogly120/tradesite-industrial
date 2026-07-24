import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const publicSourceRoots = [
  'src/pages',
  'src/layouts',
  'src/components',
  'src/content/blog',
  'src/content/products',
  'src/content/solutions',
  'public',
];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await filesUnder(path));
    } else {
      files.push(path);
    }
  }

  return files;
}

async function publicSourceFiles() {
  return (await Promise.all(
    publicSourceRoots.map(directory => filesUnder(resolve(root, directory))),
  )).flat().filter(path => /\.(?:astro|md|mdx|ts|js|json|xml|txt)$/i.test(path));
}

describe('Unverified case-study depublication', () => {
  it('removes the case-study collection, content, routes, and public manifest entry', async () => {
    expect(await exists(resolve(root, 'src/content/case-studies'))).toBe(false);
    expect(await exists(resolve(root, 'src/pages/case-studies'))).toBe(false);

    const config = await readFile(resolve(root, 'src/content.config.ts'), 'utf8');
    const manifest = await readFile(resolve(root, 'public/images/asset-manifest.json'), 'utf8');
    expect(config).not.toMatch(/\bcaseStudies\b|content\/case-studies/);
    expect(manifest).not.toMatch(/"slug":\s*"case-studies"|\/images\/banners\/case-studies\./);
  });

  it('removes every public /case-studies/ reference from source', async () => {
    for (const path of await publicSourceFiles()) {
      const body = await readFile(path, 'utf8');
      expect(body, path).not.toContain('/case-studies/');
    }
  });

  it('replaces fabricated solution proof blocks with buyer input checklists', async () => {
    const solutionDir = resolve(root, 'src/content/solutions');
    const solutions = (await readdir(solutionDir))
      .filter(name => name.endsWith('.md'));

    expect(solutions.length).toBeGreaterThan(0);

    for (const name of solutions) {
      const body = await readFile(resolve(solutionDir, name), 'utf8');
      expect(body, name).toMatch(/^## Project inputs to prepare$/m);
      expect(body, name).not.toMatch(/^relatedCases:/m);
      expect(body, name).not.toMatch(/^## Case Studies$/m);
      expect(body, name).not.toMatch(
        /\b\d+(?:\.\d+)?%\s+(?:faster|saving)|\b(?:complete|completed|delivered)\b.{0,80}\bin\s+\d+\s*(?:days?|weeks?|months?)\b|\b(?:reduced|saved)\b.{0,80}\b\d+(?:\.\d+)?%|\bzero[- ](?:incident|downtime)\b/i,
      );
    }
  });

  it('does not retain testimonial or delivered-result claims in public source', async () => {
    for (const path of await publicSourceFiles()) {
      const body = await readFile(path, 'utf8');
      expect(body, path).not.toMatch(/\btestimonial\b|customer quote|delivered results?/i);
    }
  });
});
