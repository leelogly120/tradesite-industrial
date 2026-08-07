import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const configUrl = new URL('../wrangler.jsonc', import.meta.url);

describe('Cloudflare static deployment contract', () => {
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
