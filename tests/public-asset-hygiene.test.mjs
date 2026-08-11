import { access, readdir, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { basename, extname, resolve } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const blogRoot = resolve(root, 'src/content/blog');
const productRoot = resolve(root, 'src/content/products');
const productManifestPath = resolve(root, 'public/images/asset-manifest.json');

const prohibitedPublicDirectories = [
  'public/images/products/local',
  'public/images/blog',
];

const trainedAlgorithmicMediaUri = 'http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia';
const task4WebpAssets = [
  'truck-site-roll-forming-lift.webp',
  'port-loading-logistics.webp',
  'ceiling-platform-underside.webp',
  'large-deck-steel-structure.webp',
];
const task4SvgAssets = [
  'roof-level-workflow.svg',
  'crawler-truck-selection-matrix.svg',
  '40hq-logistics-checkpoints.svg',
  'roll-forming-input-map.svg',
  'ceiling-platform-project-data.svg',
  'crawler-platform-selection-path.svg',
  'ceiling-access-method-matrix.svg',
  'indoor-floor-load-review.svg',
  'remote-control-safety-loop.svg',
  'dual-power-duty-cycle.svg',
  'warehouse-ceiling-access-map.svg',
];
const task4MobileReadableSvgs = [
  '40hq-logistics-checkpoints.svg',
  'crawler-truck-selection-matrix.svg',
  'roll-forming-input-map.svg',
  'ceiling-platform-project-data.svg',
  'crawler-platform-selection-path.svg',
  'ceiling-access-method-matrix.svg',
  'indoor-floor-load-review.svg',
  'remote-control-safety-loop.svg',
  'dual-power-duty-cycle.svg',
  'warehouse-ceiling-access-map.svg',
];

const quarantinedLegacyArticles = [
  'aerial-platform-maintenance-tips.md',
  'aerial-platform-rental-guide.md',
  'airport-terminal-maintenance.md',
  'arclift-product-comparison.md',
  'ceiling-installation-cost-comparison.md',
  'ceiling-panel-installation-guide.md',
  'ceiling-work-beginners-guide.md',
  'ceiling-work-business-growth.md',
  'ceiling-work-client-relationships.md',
  'ceiling-work-cost-estimation.md',
  'ceiling-work-emergency-procedures.md',
  'ceiling-work-fall-protection.md',
  'ceiling-work-marketing-guide.md',
  'ceiling-work-project-management.md',
  'ceiling-work-quality-control.md',
  'ceiling-work-safety-checklist.md',
  'ceiling-work-safety-training.md',
  'ceiling-work-seasonal-guide.md',
  'crawler-lift-vs-scaffolding-cost.md',
  'dual-power-aerial-lift-guide.md',
  'factory-ceiling-installation.md',
  'how-to-choose-aerial-platform.md',
  'low-ground-pressure-aerial-lift.md',
  'roll-forming-vs-pre-formed-panels.md',
  'shopping-mall-ceiling-renovation.md',
  'stadium-ceiling-maintenance-guide.md',
  'warehouse-ceiling-installation-guide.md',
];

async function pathExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function listMarkdownFiles(directory) {
  if (!(await pathExists(directory))) return [];

  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return listMarkdownFiles(path);
    return extname(entry.name).toLowerCase() === '.md' ? [path] : [];
  }));

  return nested.flat();
}

async function largestConeLikeWhiteComponentArea(bytes) {
  const { data, info } = await sharp(bytes)
    .extract({ left: 780, top: 70, width: 180, height: 220 })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixelCount = info.width * info.height;
  const mask = new Uint8Array(pixelCount);
  const visited = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);

  for (let index = 0; index < pixelCount; index += 1) {
    const red = data[index * 3];
    const green = data[index * 3 + 1];
    const blue = data[index * 3 + 2];
    const spread = Math.max(red, green, blue) - Math.min(red, green, blue);
    if (red > 210 && green > 210 && blue > 210 && spread < 24) mask[index] = 1;
  }

  let largestArea = 0;
  for (let seed = 0; seed < pixelCount; seed += 1) {
    if (!mask[seed] || visited[seed]) continue;
    let head = 0;
    let tail = 0;
    let area = 0;
    let minX = info.width;
    let minY = info.height;
    let maxX = 0;
    let maxY = 0;
    queue[tail++] = seed;
    visited[seed] = 1;

    while (head < tail) {
      const pixel = queue[head++];
      const x = pixel % info.width;
      const y = Math.floor(pixel / info.width);
      area += 1;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);

      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          if (offsetX === 0 && offsetY === 0) continue;
          const nextX = x + offsetX;
          const nextY = y + offsetY;
          if (nextX < 0 || nextY < 0 || nextX >= info.width || nextY >= info.height) continue;
          const next = nextY * info.width + nextX;
          if (mask[next] && !visited[next]) {
            visited[next] = 1;
            queue[tail++] = next;
          }
        }
      }
    }

    const componentWidth = maxX - minX + 1;
    const componentHeight = maxY - minY + 1;
    const aspectRatio = componentHeight / componentWidth;
    const fillRatio = area / (componentWidth * componentHeight);
    if (aspectRatio >= 2 && fillRatio <= 0.7) largestArea = Math.max(largestArea, area);
  }

  return largestArea;
}

describe('public source-asset quarantine', () => {
  it.each(prohibitedPublicDirectories)('%s is not deployable from public', async (relativePath) => {
    expect(await pathExists(resolve(root, relativePath))).toBe(false);
  });

  it('publishes no local-product, Chinese source-directory, or raw DJI image path from blog content', async () => {
    const files = await listMarkdownFiles(blogRoot);
    const failures = [];

    for (const file of files) {
      const text = await readFile(file, 'utf8');
      if (/\/images\/products\/local\//i.test(text)) failures.push(`${file}: local product asset path`);
      if (/\/images\/[^\s)"']*[\u3400-\u9fff][^\s)"']*/u.test(text)) failures.push(`${file}: Chinese source directory`);
      if (/(?:^|[\\/])DJI_\d+\.(?:jpe?g|png|webp|gif)\b/imu.test(text)) failures.push(`${file}: raw DJI filename`);
    }

    expect(failures).toEqual([]);
  });

  it('does not publish the quarantined 30-article legacy batch', async () => {
    const remaining = [];

    for (const article of quarantinedLegacyArticles) {
      if (await pathExists(resolve(blogRoot, article))) remaining.push(article);
    }

    expect(remaining).toEqual([]);
  });

  it('blocks the raw local product archive without blocking editorial assets', async () => {
    const gitignore = await readFile(resolve(root, '.gitignore'), 'utf8');

    expect(gitignore).toMatch(/^public\/images\/products\/local\/$/m);
    expect(gitignore).not.toMatch(/^public\/images\/editorial\/$/m);
  });

  it('keeps source product photographs out of the public tree and product manifest', async () => {
    const manifest = JSON.parse(await readFile(productManifestPath, 'utf8'));

    expect(await pathExists(resolve(root, 'public/images/products'))).toBe(false);
    for (const record of manifest.products) {
      for (const url of record.urls) {
        expect(url, record.slug).not.toMatch(/^\/images\/products\//);
      }
    }
  });

  it('publishes no private source path, raw capture name, or source identity in product surfaces', async () => {
    const templatePaths = [
      resolve(root, 'src/lib/product-selection.ts'),
      resolve(root, 'src/pages/products/index.astro'),
      resolve(root, 'src/pages/products/[slug].astro'),
      resolve(root, 'src/pages/compare.astro'),
      productManifestPath,
    ];
    const productMarkdown = await listMarkdownFiles(productRoot);
    const failures = [];
    const privatePath = /(?:^|[\s"'(>])(?:[A-Za-z]:[\\/]|\/(?:Users|home)\/)|\/images\/[^\s)"']*[\u3400-\u9fff][^\s)"']*/u;
    const rawCapture = /(?:^|[\\/])(?:DJI|IMG|DSC)[_-]?\d+\.(?:jpe?g|png|webp|gif)\b/imu;
    const sourceIdentity = /Henan\s+Huaying|河南华鹰|source\s+(?:factory|manufacturer)|customer\s+project\s+(?:name|identity)/iu;

    for (const file of [...templatePaths, ...productMarkdown]) {
      const text = await readFile(file, 'utf8');
      if (privatePath.test(text)) failures.push(`${file}: private or Chinese source path`);
      if (rawCapture.test(text)) failures.push(`${file}: raw camera or DJI filename`);
      if (sourceIdentity.test(text)) failures.push(`${file}: source identity marker`);
    }

    expect(failures).toEqual([]);
  });

  it('strips EXIF, GPS, private paths, raw capture names, and source identities from product visual assets', async () => {
    const manifest = JSON.parse(await readFile(productManifestPath, 'utf8'));
    const urls = [...new Set(manifest.products.flatMap(record => record.urls))];
    const leaks = /(?:^|[\s"'(>])(?:[A-Za-z]:[\\/]|\/(?:Users|home)\/)|GPS(?:Latitude|Longitude|Altitude)?|Henan\s+Huaying|河南华鹰|DJI[_-]?\d+|source\s+(?:factory|manufacturer)/iu;

    for (const url of urls) {
      const path = resolve(root, 'public', url.replace(/^\//, ''));
      const extension = extname(path).toLowerCase();
      expect(await pathExists(path), url).toBe(true);

      if (extension === '.svg') {
        expect(await readFile(path, 'utf8'), url).not.toMatch(leaks);
        continue;
      }

      const metadata = await sharp(path).metadata();
      const metadataText = [metadata.xmp, metadata.exif, metadata.iptc]
        .filter(Boolean)
        .map(bytes => bytes.toString('utf8'))
        .join('\n');
      expect(metadata.exif, url).toBeUndefined();
      expect(metadataText, url).not.toMatch(leaks);
    }
  });
});


describe('Task 4 editorial asset hygiene', () => {
  it('removes the cone-like neutral-white hanging component from the truck composite', async () => {
    const bytes = await readFile(resolve(root, 'public/images/editorial/truck-site-roll-forming-lift.webp'));
    expect(await largestConeLikeWhiteComponentArea(bytes)).toBeLessThan(500);
  });

  it.each(task4WebpAssets)('%s is a clean 1600x900 WebP with explicit AI source metadata', async (filename) => {
    const path = resolve(root, 'public/images/editorial', filename);
    expect(await pathExists(path)).toBe(true);

    const bytes = await readFile(path);
    const metadata = await sharp(bytes).metadata();
    const xmp = metadata.xmp?.toString('utf8') ?? '';

    expect(basename(filename)).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*\.webp$/);
    expect(metadata.format).toBe('webp');
    expect(metadata.width).toBe(1600);
    expect(metadata.height).toBe(900);
    expect(metadata.xmp).toBeDefined();
    expect(xmp).toContain(trainedAlgorithmicMediaUri);
    expect(xmp).toMatch(/dc:creator[^>]*>[\s\S]*ARCLIFT Editorial/i);
    expect(metadata.exif).toBeUndefined();
    expect(xmp).not.toMatch(/\bGPS(?:Latitude|Longitude|Altitude)?\b/i);
    expect(xmp).not.toMatch(/(?:^|[\s\"'>(])(?:[A-Za-z]:[\\/]|\/(?:Users|home)\/)/i);
    expect(xmp).not.toMatch(/call_[A-Za-z0-9]+|generated_images|factory|manufacturer|Henan\s+Huaying|DJI_\d+/i);
  });

  it.each(task4SvgAssets)('%s is an accessible 16:9 ARCLIFT editorial decision diagram', async (filename) => {
    const path = resolve(root, 'public/images/editorial', filename);
    expect(await pathExists(path)).toBe(true);

    const svg = await readFile(path, 'utf8');

    expect(basename(filename)).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*\.svg$/);
    expect(svg).toMatch(/<svg\b[^>]*viewBox="0 0 1600 900"/i);
    expect(svg).toMatch(/<title>[^<]+<\/title>/i);
    expect(svg).toMatch(/<desc>[^<]+<\/desc>/i);
    expect(svg).toMatch(/ARCLIFT/);
    expect(svg).not.toMatch(/manufacturer|factory|certification|guarantee/i);
    expect(svg).not.toMatch(/\b\d+(?:\.\d+)?\s*(?:mm|cm|m|kg|t|tonnes?|volts?|v)\b/i);
    expect(svg).not.toMatch(/(?:^|[\s\"'>(])(?:[A-Za-z]:[\\/]|\/(?:Users|home)\/)/i);
  });
  it.each(task4MobileReadableSvgs)('%s keeps its decision labels readable at a 390px rendered width', async (filename) => {
    const svg = await readFile(resolve(root, 'public/images/editorial', filename), 'utf8');
    const textNodes = [...svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi)].map((match) => ({
      attributes: match[1],
      text: match[2]
        .replace(/<\/?tspan\b[^>]*>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
    }));
    const decisionLabels = textNodes.filter(({ attributes }) => /\bdata-role="decision-label"/i.test(attributes));
    const equivalentCssPixels = textNodes.map(({ attributes, text }) => {
      const fontSize = Number(attributes.match(/\bfont-size="(\d+(?:\.\d+)?)"/i)?.[1]);
      expect(fontSize, `${filename}: missing explicit font-size on "${text}"`).toBeGreaterThan(0);
      return fontSize * 390 / 1600;
    });

    expect(decisionLabels.length).toBeGreaterThanOrEqual(3);
    expect(decisionLabels.length).toBeLessThanOrEqual(5);
    expect(decisionLabels.every(({ text }) => text.length <= 28)).toBe(true);
    expect(Math.min(...equivalentCssPixels)).toBeGreaterThanOrEqual(10);
  });

});
