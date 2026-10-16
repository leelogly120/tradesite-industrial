import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { REFERENCE_PHOTO_ARTICLES } from '../scripts/reference-photo-articles.mjs';

const root = resolve(import.meta.dirname, '..');
const expectedArticles = [
  { slug: 'large-crawler-platform-transport-data-package', date: '2026-08-10', images: ['transport-real-cover', 'transport-real-carrier', 'transport-real-loading', 'transport-real-stowed'] },
  { slug: 'coil-handling-roll-forming-line-feeding-plan', date: '2026-07-27', images: ['coil-real-cover', 'coil-real-handling', 'coil-real-module', 'coil-real-panel'] },
  { slug: 'large-crawler-work-platform-building-entry-survey', date: '2026-08-07', images: ['entry-real-cover', 'entry-real-approach', 'entry-real-interior', 'entry-real-clearance'] },
  {"slug":"roof-level-roll-forming-long-panels","date":"2026-07-24","images":["entry-real-clearance","coil-real-handling","coil-real-panel","transport-real-stowed"]},
  {"slug":"crawler-vs-truck-mounted-roll-forming-system","date":"2026-07-24","images":["transport-real-cover","coil-real-cover","transport-real-stowed","entry-real-clearance"]},
  {"slug":"roll-forming-line-specification-long-span-roof-panels","date":"2026-07-24","images":["coil-real-handling","coil-real-module","coil-real-panel","entry-real-clearance"]},
  {"slug":"40hq-shipping-truck-mounted-roll-forming-lift","date":"2026-07-24","images":["transport-real-cover","transport-real-carrier","transport-real-stowed","coil-real-module"]},
  {"slug":"truck-mounted-roll-forming-chassis-interface-review","date":"2026-07-27","images":["coil-real-cover","coil-real-module","coil-real-handling","entry-real-clearance"]},
  {"slug":"truck-mounted-lift-destination-chassis-sourcing","date":"2026-08-07","images":["coil-real-module","coil-real-cover","transport-real-cover","transport-real-stowed"]},
  {"slug":"truck-mounted-forming-lift-jobsite-setup-review","date":"2026-08-07","images":["coil-real-cover","entry-real-clearance","coil-real-handling","coil-real-panel"]},
  {"slug":"crawler-roll-forming-lift-ground-support-review","date":"2026-08-07","images":["transport-real-stowed","entry-real-clearance","transport-real-carrier","coil-real-handling"]},
  {"slug":"elevated-roll-forming-roof-panel-handover-zones","date":"2026-08-07","images":["coil-real-panel","coil-real-handling","entry-real-clearance","coil-real-module"]},
  {"slug":"crawler-roll-forming-lift-access-route-survey","date":"2026-08-07","images":["entry-real-clearance","transport-real-stowed","transport-real-cover","transport-real-loading"]},
  {"slug":"roof-zone-survey-roll-forming-lift-selection","date":"2026-08-07","images":["entry-real-clearance","coil-real-handling","coil-real-panel","transport-real-stowed"]},
  {"slug":"lifted-roll-forming-line-mounting-interface-review","date":"2026-08-07","images":["coil-real-module","coil-real-cover","entry-real-clearance","coil-real-handling"]},
  {"slug":"truck-mounted-roll-forming-payload-allocation-review","date":"2026-08-13","images":["coil-real-cover","coil-real-module","transport-real-carrier","transport-real-stowed"]},
  {"slug":"lift-roll-forming-system-commissioning-plan","date":"2026-08-07","images":["coil-real-handling","coil-real-module","entry-real-clearance","coil-real-panel"]},
  {"slug":"roll-forming-lift-destination-receipt-plan","date":"2026-08-08","images":["transport-real-cover","transport-real-loading","coil-real-module","transport-real-carrier"]},
  {"slug":"roll-forming-lift-configuration-change-control","date":"2026-08-08","images":["entry-real-clearance","coil-real-module","coil-real-cover","coil-real-panel"]},
  {"slug":"roll-forming-lift-technical-document-package","date":"2026-08-07","images":["coil-real-module","entry-real-clearance","transport-real-cover","coil-real-panel"]},
  {"slug":"truck-mounted-forming-lift-road-transport-documents","date":"2026-08-07","images":["transport-real-carrier","transport-real-cover","transport-real-stowed","coil-real-cover"]},
  {"slug":"crawler-ceiling-wall-panel-platform-project-data","date":"2026-07-24","images":["entry-real-cover","entry-real-interior","entry-real-approach","transport-real-stowed"]},
  {"slug":"large-deck-crawler-platform-vs-basket-lift","date":"2026-08-07","images":["entry-real-approach","entry-real-cover","entry-real-interior","transport-real-stowed"]},
  {"slug":"roof-panel-profile-material-tooling-data","date":"2026-07-27","images":["coil-real-panel","coil-real-module","coil-real-handling","entry-real-clearance"]},
  {"slug":"roll-forming-line-electrical-control-interfaces","date":"2026-07-27","images":["coil-real-module","entry-real-clearance","coil-real-handling","transport-real-stowed"]},
  {"slug":"roof-level-roll-forming-lift-coil-loading-plan","date":"2026-08-07","images":["coil-real-cover","coil-real-module","coil-real-handling","entry-real-clearance"]},
  {"slug":"roof-level-roll-forming-weather-hold-points","date":"2026-08-07","images":["entry-real-clearance","coil-real-panel","coil-real-handling","transport-real-stowed"]},
  {"slug":"crawler-roll-forming-lift-work-zone-relocation","date":"2026-08-07","images":["transport-real-stowed","entry-real-clearance","transport-real-loading","transport-real-cover"]},
  {"slug":"high-altitude-roll-forming-lift-rfq-data","date":"2026-08-07","images":["coil-real-handling","coil-real-module","entry-real-clearance","transport-real-carrier"]},
  {"slug":"roll-forming-line-fat-sat-acceptance-checklist","date":"2026-07-27","images":["coil-real-module","coil-real-cover","entry-real-clearance","coil-real-panel"]},
  {"slug":"indoor-aerial-platform-ground-pressure-guide","date":"2026-07-27","images":["entry-real-cover","entry-real-interior","entry-real-approach","transport-real-stowed"]},
  {"slug":"large-deck-crawler-platform-work-zone-layout","date":"2026-08-07","images":["entry-real-interior","entry-real-cover","entry-real-approach","transport-real-stowed"]},
  {"slug":"large-deck-platform-wall-panel-access-planning","date":"2026-08-07","images":["entry-real-interior","entry-real-approach","entry-real-cover","transport-real-loading"]},
  {"slug":"warehouse-ceiling-access-platform-planning","date":"2026-07-27","images":["entry-real-cover","entry-real-interior","entry-real-approach","transport-real-cover"]},
  {"slug":"stadium-ceiling-access-platform-planning","date":"2026-07-27","images":["entry-real-approach","entry-real-cover","entry-real-interior","transport-real-stowed"]},
  {"slug":"dual-power-crawler-platform-selection","date":"2026-07-27","images":["entry-real-interior","entry-real-cover","entry-real-approach","transport-real-stowed"]},
  {"slug":"remote-control-aerial-platform-safety-planning","date":"2026-07-27","images":["entry-real-approach","entry-real-interior","entry-real-cover","transport-real-loading"]},
  {"slug":"aerial-platform-emergency-lowering-rescue-plan","date":"2026-07-27","images":["entry-real-cover","entry-real-interior","entry-real-approach","transport-real-stowed"]},
  {"slug":"aerial-platform-familiarization-handover","date":"2026-08-10","images":["entry-real-approach","entry-real-interior","entry-real-cover","transport-real-stowed"]},
  {"slug":"ceiling-maintenance-safety-checklist","date":"2026-08-11","images":["entry-real-cover","entry-real-interior","entry-real-approach","transport-real-stowed"]},
  {"slug":"ceiling-work-technology-trends","date":"2026-08-11","images":["entry-real-approach","entry-real-cover","entry-real-interior","transport-real-stowed"]},
  {"slug":"crawler-ceiling-platform-site-acceptance-records","date":"2026-08-07","images":["entry-real-cover","entry-real-interior","entry-real-approach","transport-real-loading"]},
  {"slug":"crawler-platform-maintenance-spares-handover","date":"2026-08-07","images":["transport-real-stowed","entry-real-cover","entry-real-interior","transport-real-loading"]},
];
const expectedDimensions = {
  'transport-real-cover': [744, 419],
  'transport-real-carrier': [502, 370],
  'transport-real-loading': [683, 370],
  'transport-real-stowed': [637, 374],
  'coil-real-cover': [680, 562],
  'coil-real-handling': [593, 411],
  'coil-real-module': [607, 563],
  'coil-real-panel': [638, 841],
  'entry-real-cover': [838, 622],
  'entry-real-approach': [570, 465],
  'entry-real-interior': [874, 656],
  'entry-real-clearance': [551, 730],
};
const photoUrl = (name) => `/images/equipment/${name}.webp`;
const privateIdentity = /(?:[A-Za-z]:[\\/]|\/(?:Users|home)\/|DJI[_-]?\d+|(?:IMG|DSC)[_-]?\d+\.(?:jpe?g|png|webp)|Henan\s+Huaying|河南华鹰|source-media|pdf-media|config-media|\.env\b)/iu;
const syntheticLabel = /AI[- ](?:assisted|generated|edited)|trainedAlgorithmicMedia|editorial (?:diagram|composite)|generative reconstruction/i;

function frontmatterValue(markdown, key) {
  const block = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? '';
  return block.match(new RegExp(`^${key}:\\s*["']?([^"'\\r\\n]+)`, 'm'))?.[1]?.trim() ?? '';
}

function disclosedBodyImages(markdown) {
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '').replace(/<!--[\s\S]*?-->/g, '');
  return [...body.matchAll(/!\[([^\]]+)\]\((\/images\/[^)]+)\)(?:\]\([^)]+\))?\s*\r?\n\s*\*([^*\r\n]+)\*/g)]
    .map(([, alt, url, caption]) => ({ alt, url, caption }));
}

function assertPhotoDisclosure({ alt, caption }, context) {
  expect(alt.length, `${context}: descriptive alt`).toBeGreaterThanOrEqual(20);
  expect((alt.match(/[A-Za-z]+/g) ?? []).length, `${context}: meaningful alt`).toBeGreaterThanOrEqual(5);
  expect(alt, context).not.toMatch(/placeholder|image here|photo here|TBD|TODO/i);
  expect(caption, `${context}: photo medium`).toMatch(/\bphotograph\b/i);
  expect(caption, `${context}: reference scope`).toMatch(/\breference\b/i);
  expect(caption, `${context}: claim boundary`).toMatch(/\b(?:does not|cannot|not (?:an?|evidence|verification|a measured))\b/i);
  expect(`${alt}\n${caption}`, context).not.toMatch(syntheticLabel);
  expect(`${alt}\n${caption}`, context).not.toMatch(privateIdentity);
}

describe('approved reference photographs', () => {
  it('limits the photo replacement to forty-three fixed articles and twelve distinct photograph URLs', async () => {
    expect(REFERENCE_PHOTO_ARTICLES).toEqual(expectedArticles.map(({ slug, images }) => ({
      slug,
      cover: [photoUrl(images[0])],
      body: images.slice(1).map(photoUrl),
    })));
    const urls = REFERENCE_PHOTO_ARTICLES.flatMap(({ cover, body }) => [...cover, ...body]);
    expect(new Set(urls).size).toBe(12);
    const registry = await readFile(resolve(root, 'scripts/reference-photo-articles.mjs'), 'utf8');
    expect(registry).not.toMatch(privateIdentity);
    expect(registry).not.toMatch(/(?:source|original)[_-]?(?:file|name|path)|raw[_-]?path/i);

    for (const name of await readdir(resolve(root, 'src/content/blog'))) {
      if (!name.endsWith('.md') || expectedArticles.some(({ slug }) => name === `${slug}.md`)) continue;
      const article = await readFile(resolve(root, 'src/content/blog', name), 'utf8');
      for (const url of urls) expect(article, `${name}: unapproved photo migration`).not.toContain(url);
    }
  });

  it('registers exactly twelve real reference photographs separately from synthetic editorial assets', async () => {
    const manifest = JSON.parse(await readFile(resolve(root, 'public/images/asset-manifest.json'), 'utf8'));
    expect(manifest.referencePhotos ?? []).toHaveLength(12);
    const expectedUrls = Object.keys(expectedDimensions).map(photoUrl).sort();
    expect(manifest.referencePhotos.map(({ url }) => url).sort()).toEqual(expectedUrls);
    for (const record of manifest.referencePhotos ?? []) {
      expect(Object.keys(record).sort()).toEqual(['classification', 'disclosure', 'height', 'medium', 'url', 'width']);
      expect(record.classification).toBe('editorial');
      expect(record.medium).toBe('reference-photograph');
      expect(record.disclosure).toMatch(/reference photograph/i);
      expect(record.disclosure).toMatch(/does not verify|not evidence|cannot establish/i);
      expect(record.disclosure).not.toMatch(syntheticLabel);
      expect(JSON.stringify(record)).not.toMatch(privateIdentity);
      expect((manifest.campaigns.editorial ?? []).some(({ url }) => url === record.url)).toBe(false);
      expect(manifest.products.some(({ urls }) => urls.includes(record.url))).toBe(false);
    }
  });

  it.each(Object.entries(expectedDimensions))('%s fully decodes at its approved dimensions without embedded metadata', async (name, dimensions) => {
    const url = photoUrl(name);
    const manifest = JSON.parse(await readFile(resolve(root, 'public/images/asset-manifest.json'), 'utf8'));
    const record = manifest.referencePhotos.find((entry) => entry.url === url);
    expect(record, `${url}: manifest record`).toBeDefined();
    expect([record.width, record.height]).toEqual(dimensions);
    const bytes = await readFile(resolve(root, 'public', url.slice(1)));
    const image = sharp(bytes, { failOn: 'warning' });
    const metadata = await image.metadata();
    expect(metadata.format).toBe('webp');
    expect([metadata.width, metadata.height]).toEqual(dimensions);
    for (const field of ['exif', 'xmp', 'iptc', 'icc']) expect(metadata[field], `${url}: ${field}`).toBeUndefined();
    const decoded = await image.raw().toBuffer({ resolveWithObject: true });
    expect([decoded.info.width, decoded.info.height]).toEqual(dimensions);
    expect(decoded.data.length).toBe(dimensions[0] * dimensions[1] * decoded.info.channels);
    // Full decode and metadata checks cannot replace the separate private provenance and pixel review.
    expect(bytes.toString('latin1')).not.toMatch(/trainedAlgorithmicMedia|<x:xmpmeta|Exif\x00\x00|GPSLatitude|GPSLongitude/i);
  });

  it('does not fill the twelve-photo set with byte-identical duplicates', async () => {
    const hashes = await Promise.all(Object.keys(expectedDimensions).map(async (name) => {
      const bytes = await readFile(resolve(root, 'public', photoUrl(name).slice(1)));
      return createHash('sha256').update(bytes).digest('hex');
    }));
    expect(new Set(hashes).size).toBe(12);
  });

  it.each(expectedArticles)('$slug retains its publication date and discloses every exact photo use', async ({ slug, date, images }) => {
    const markdown = await readFile(resolve(root, 'src/content/blog', `${slug}.md`), 'utf8');
    expect(frontmatterValue(markdown, 'date')).toBe(date);
    expect(frontmatterValue(markdown, 'coverImage')).toBe(photoUrl(images[0]));
    assertPhotoDisclosure({ alt: frontmatterValue(markdown, 'coverAlt'), caption: frontmatterValue(markdown, 'coverCaption') }, `${slug}: cover`);
    const bodyImages = disclosedBodyImages(markdown);
    expect(bodyImages.map(({ url }) => url)).toEqual(images.slice(1).map(photoUrl));
    for (const image of bodyImages) assertPhotoDisclosure(image, `${slug}: ${image.url}`);
  });

  it('runs this contract through the permanent content verification entry point', async () => {
    const { scripts } = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
    expect(scripts['test:content'].split(/\s+/)).toContain('tests/reference-photo-articles.test.mjs');
    expect(scripts.verify).toContain('npm run test:content');
  });
});
