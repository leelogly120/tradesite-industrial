import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const configUrl = new URL('../wrangler.jsonc', import.meta.url);

describe('Cloudflare static deployment contract', () => {
  it('serves the existing branded 404 page without turning missing URLs into successful pages', async () => {
    const config = JSON.parse(await readFile(configUrl, 'utf8'));
    expect(config.assets.not_found_handling).toBe('404-page');
    const page = await readFile(new URL('../dist/404.html', import.meta.url), 'utf8');
    expect(page).toContain('Page Not Found');
    expect(page).toMatch(/name="robots" content="noindex/);
    expect(page).not.toContain('rel="canonical"');
  });

  it('deploys the built Astro output to the production Worker', async () => {
    const config = JSON.parse(await readFile(configUrl, 'utf8'));

    expect(config).toMatchObject({
      name: 'tradesite-industrial',
      assets: {
        directory: './dist',
      },
    });
  });
});
