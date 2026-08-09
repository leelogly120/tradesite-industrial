import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

const derivatives = [
  {
    path: 'public/images/editorial/large-deck-steel-structure-800.webp',
    width: 800,
    height: 450,
    manifestGroup: 'editorial',
    slug: 'large-deck-steel-structure-800',
    url: '/images/editorial/large-deck-steel-structure-800.webp',
    disclosure: 'AI-assisted editorial composite',
    requiresAiXmp: true,
  },
  {
    path: 'public/images/home/under-ceiling-field-v2-800.webp',
    width: 800,
    height: 533,
    manifestGroup: 'home',
    slug: 'under-ceiling-platform-800',
    url: '/images/home/under-ceiling-field-v2-800.webp',
    disclosure: undefined,
    requiresAiXmp: false,
  },
];

describe('homepage responsive image derivatives', () => {
  it.each(derivatives)('$path is a compact, metadata-safe WebP', async (asset) => {
    const absolute = resolve(root, asset.path);
    const [metadata, file] = await Promise.all([sharp(absolute).metadata(), stat(absolute)]);

    expect(metadata.format).toBe('webp');
    expect(metadata.width).toBe(asset.width);
    expect(metadata.height).toBe(asset.height);
    expect(file.size).toBeLessThanOrEqual(100 * 1024);
    expect(metadata.exif).toBeUndefined();
    expect(metadata.icc).toBeUndefined();
    expect(metadata.iptc).toBeUndefined();

    const xmp = metadata.xmp?.toString('utf8') ?? '';
    if (asset.requiresAiXmp) {
      expect(xmp).toContain('trainedAlgorithmicMedia');
      expect(xmp).toContain('ARCLIFT Editorial');
    } else {
      expect(xmp).toBe('');
    }
  });

  it.each(derivatives)('$url is classified in the asset manifest', async (asset) => {
    const manifest = JSON.parse(await readFile(
      resolve(root, 'public/images/asset-manifest.json'),
      'utf8',
    ));
    const record = manifest.campaigns[asset.manifestGroup].find(
      (candidate) => candidate.url === asset.url,
    );

    expect(record).toMatchObject({
      slug: asset.slug,
      url: asset.url,
      use: 'homepage responsive derivative',
      classification: 'editorial',
    });
    expect(record?.disclosure).toBe(asset.disclosure);
  });
});
