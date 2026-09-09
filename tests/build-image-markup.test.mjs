import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';

const implementation = await import('../scripts/lib/build-image-markup.mjs').catch(() => ({}));
const publicDirectory = resolve('public');

async function optimize(html) {
  expect(implementation.optimizeImageMarkup, 'build image metadata transformation exists').toBeTypeOf('function');
  return implementation.optimizeImageMarkup(html, { publicDirectory });
}

describe('generated local image markup', () => {
  it('reserves measured SVG dimensions and lazy-loads a body image without changing its caption or alt', async () => {
    const result = await optimize('<figure><img src="/images/editorial/roof-level-workflow.svg" alt="Roof &amp; line" /><figcaption>AI-assisted editorial diagram.</figcaption></figure>');
    expect(result).toContain('width="1600"');
    expect(result).toContain('height="900"');
    expect(result).toContain('loading="lazy"');
    expect(result).toContain('decoding="async"');
    expect(result).toContain('alt="Roof &amp; line"');
    expect(result).toContain('<figcaption>AI-assisted editorial diagram.</figcaption>');
  });

  it('measures raster images and preserves existing priority and responsive sources', async () => {
    const result = await optimize('<img src="/images/home/roof-panel-output.webp" srcset="/images/home/roof-panel-output.webp 1200w" loading="eager" fetchpriority="high" alt="Panel route">');
    expect(result).toContain('width="1200"');
    expect(result).toContain('height="800"');
    expect(result).toContain('loading="eager"');
    expect(result).not.toContain('loading="lazy"');
    expect(result).toContain('fetchpriority="high"');
    expect(result).toContain('srcset="/images/home/roof-panel-output.webp 1200w"');
  });

  it('preserves explicitly authored geometry and is idempotent', async () => {
    const result = await optimize('<img src="/images/editorial/roof-level-workflow.svg" width="800" height="450" loading="lazy" decoding="async">');
    expect(result).toContain('width="800" height="450"');
    expect(await optimize(result)).toBe(result);
  });

  it('does not fetch external images or change data URLs and surrounding text', async () => {
    const input = '<p>Keep this text.</p><img src="https://example.invalid/image.jpg"><img src="//example.invalid/i.png"><img src="data:image/svg+xml;base64,AA==">';
    expect(await optimize(input)).toBe(input);
  });

  it('fails on a missing in-scope image rather than inventing a size', async () => {
    expect(implementation.optimizeImageMarkup).toBeTypeOf('function');
    await expect(implementation.optimizeImageMarkup('<img src="/images/not-a-real-asset.webp">', { publicDirectory })).rejects.toThrow();
  });

  it('rejects encoded filesystem traversal instead of reading outside public media', async () => {
    expect(implementation.optimizeImageMarkup).toBeTypeOf('function');
    await expect(implementation.optimizeImageMarkup('<img src="/images/%2e%2e/%2e%2e/package.json">', { publicDirectory })).rejects.toThrow(/outside|unsafe/i);
  });
});
