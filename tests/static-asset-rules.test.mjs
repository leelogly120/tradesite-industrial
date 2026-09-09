import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { cp, mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { Miniflare } from 'miniflare';

const moves = [
  ['/products/fddpt-20m-crawler-ceiling-platform/', '/products/arc-f20-crawler-ceiling-platform/'],
  ['/products/fddpt-25m-crawler-ceiling-platform/', '/products/arc-f25-crawler-ceiling-platform/'],
  ['/products/fddpt-31m-crawler-ceiling-platform/', '/products/arc-f31-crawler-ceiling-platform/'],
  ['/products/fddpt-35m-crawler-ceiling-platform/', '/products/arc-f35-crawler-ceiling-platform/'],
];
let runtime;

beforeAll(async () => {
  await mkdir(resolve('output'), { recursive: true });
  const directory = await mkdtemp(resolve('output/static-rule-test-'));
  for (const path of [...moves.flat(), '/']) {
    const destination = resolve(directory, `.${path}`, 'index.html');
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, `<html><body>${path}</body></html>`);
  }
  await mkdir(resolve(directory, '_astro'), { recursive: true });
  await writeFile(resolve(directory, '_astro/app.a1b2c3.css'), 'body{color:black}');
  for (const filename of ['_redirects', '_headers']) {
    await cp(resolve('public', filename), resolve(directory, filename)).catch(error => {
      if (error.code !== 'ENOENT') throw error;
    });
  }
  runtime = new Miniflare({
    modules: true,
    script: 'export default { fetch() { return new Response("Not found", { status: 404 }); } };',
    compatibilityDate: '2026-07-29',
    assets: { directory },
  });
  await runtime.ready;
}, 30_000);

afterAll(async () => { await runtime?.dispose(); });

describe('Cloudflare static asset rules', () => {
  it.each(moves)('permanently redirects %s to its existing replacement with query preserved', async (oldPath, newPath) => {
    const response = await runtime.dispatchFetch(`http://localhost${oldPath}?source=legacy`, { redirect: 'manual' });
    expect(response.status).toBe(301);
    expect(new URL(response.headers.get('location'), 'http://localhost').pathname).toBe(newPath);
    expect(new URL(response.headers.get('location'), 'http://localhost').search).toBe('?source=legacy');
    expect((await runtime.dispatchFetch(`http://localhost${newPath}`, { redirect: 'manual' })).status).toBe(200);
  });

  it('caches fingerprinted assets immutably but leaves HTML revalidated', async () => {
    const asset = await runtime.dispatchFetch('http://localhost/_astro/app.a1b2c3.css');
    expect(asset.headers.get('cache-control')).toBe('public, max-age=31536000, immutable');
    const page = await runtime.dispatchFetch('http://localhost/');
    expect(page.headers.get('cache-control')).not.toContain('immutable');
  });

  it('does not redirect unrelated missing pages to a product or homepage', async () => {
    const response = await runtime.dispatchFetch('http://localhost/products/not-a-product/', { redirect: 'manual' });
    expect(response.status).toBe(404);
    expect(response.headers.get('location')).toBeNull();
  });
});
