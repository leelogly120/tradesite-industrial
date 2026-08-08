import { createHash } from 'node:crypto';
import { access, readdir, readFile } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DAILY_LIFT_PLATFORM_ARTICLES, LIFT_PLATFORM_ARTICLES } from '../scripts/lift-platform-article-registry.mjs';

const root = resolve(import.meta.dirname, '..');
const publicSourceRoots = ['src', 'public'];
const routeSourceRoots = [
  'src/pages',
  'src/layouts',
  'src/components',
  'src/content/products',
  'src/content/case-studies',
  'src/content/blog',
];
const publicTextExtensions = new Set([
  '.astro', '.cjs', '.css', '.html', '.js', '.json', '.jsx', '.map', '.md', '.mdx', '.mjs',
  '.scss', '.svg', '.ts', '.tsx', '.txt', '.webmanifest', '.xml', '.yaml', '.yml',
]);
const excludedPublicDirectories = new Set(['.astro', '.git', 'build', 'coverage', 'dist', 'node_modules']);

const prohibitedPublicPatterns = [
  ['source company name', /Henan\s+Huaying/i],
  ['factory-backed positioning', /factory[-\s]?backed/i],
  ['factory material', /factory\s+material/i],
  ['manufacturer positioning', /professional\s+manufacturer/i],
  ['manufacturing roots', /manufacturing\s+roots/i],
  ['factory documents', /factory\s+documents?/i],
  ['factory-direct positioning', /factory[-\s]?direct/i],
  ['ARCLIFT source-factory claim', /\bARCLIFT\b.{0,40}\bsource\s+factory\b/i],
  ['our factory claim', /\bour\s+factory\b/i],
  ['manufactured by ARCLIFT', /\bmanufactured\s+by\s+ARCLIFT\b/i],
  ['ARCLIFT factory-operation claim', /\bARCLIFT\b.{0,80}\b(?:owns?|operates?|runs?)\s+(?:a|the|its)\s+factory\b/i],
  ['ARCLIFT manufacturer claim', /\bARCLIFT\b.{0,80}\bmanufacturer\b/i],
  ['ARCLIFT manufactures claim', /\bARCLIFT\b.{0,80}\bmanufactures?\b/i],
  ['ARCLIFT plant-operation claim', /\bARCLIFT\b.{0,100}\b(?:owns?|operates?|runs?)\b.{0,60}\b(?:manufacturing|production)\s+(?:plant|facility|line|site)\b/i],
  ['Windows absolute path', /(?:^|["'\s])(?:[A-Za-z]:\\|[A-Za-z]:\/)/m],
  ['Windows user directory', /C:\\Users\\/i],
  ['Unix user directory', /(?:^|["'\s])\/(?:Users|home)\/[^/"'\s]+\//im],
  ['raw camera filename', /\b(?:DJI|IMG|DSC|PXL|VID|MVIMG)[_-]?\d{3,}\.(?:jpe?g|png|webp|gif|mov|mp4)\b/i],
  ['file URL', /file:\/\//i],
  ['private source directory', /举升机/i],
];

const namedCaseIdentities = [
  'Zhengzhou Steel Products', 'Zhengzhou Heavy Industries', 'Modern Agricultural Development',
  'Henan Industrial Development Zone', 'Guangzhou Distribution Center', 'Shanghai Logistics Group',
  'Guangzhou Baiyun International Airport', 'BYD Manufacturing', 'Hangzhou MixC Mall',
  'National Stadium Authority', 'JD Logistics', 'Zaha Hadid Architects', 'Henan Zhongyuan Steel',
  'China Construction Third Bureau', 'Shandong Weihai Steel', 'Shandong Transportation Department',
  'Henan Highway Authority', 'Beijing Office Properties', 'Henan Electric Power Company',
  'Zhengzhou Central Plaza',
];

const allowedAnonymousClients = new Set([
  'An agricultural construction project',
  'An architectural-profile project',
  'An airport-terminal ceiling project',
  'An industrial ceiling project',
  'An industrial roofing project',
  'An office-tower maintenance project',
  'A bridge-inspection project',
  'A high-volume roll-forming project',
  'A highway-signage project',
  'A logistics-center roofing project',
  'A multi-building industrial project',
  'A remote-site roofing project',
  'A retail-atrium maintenance project',
  'A retail-facade project',
  'A roll-forming quality-improvement project',
  'A stadium renovation project',
  'A transmission-line maintenance project',
  'A warehouse ceiling project',
  'A warehouse roofing project',
]);
const allowedAnonymousAttributions = new Set(['Archived project note', 'Project representative']);
const companyShapedClientPattern = /\b(?:[A-Z][A-Za-z0-9&.'-]*\s+){0,5}(?:Corporation|Company|Co\.?|Ltd\.?|LLC|Group)\b/;
const prohibitedManifestKey = /(?:^|[^a-z0-9])(?:source|original)(?:[^a-z0-9]|$)|^(?:rawpath|rawfilepath|filename)$/i;

async function readProjectFile(relativePath) {
  return readFile(resolve(root, relativePath), 'utf8');
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function listFiles(directory) {
  if (!(await pathExists(directory))) return [];
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return excludedPublicDirectories.has(entry.name) ? [] : listFiles(path);
    return publicTextExtensions.has(extname(entry.name).toLowerCase()) ? [path] : [];
  }));
  return nested.flat();
}

async function listPublicTextFiles() {
  const nested = await Promise.all(publicSourceRoots.map((directory) => listFiles(resolve(root, directory))));
  return nested.flat();
}

async function listRouteSourceFiles() {
  const nested = await Promise.all(routeSourceRoots.map((directory) => listFiles(resolve(root, directory))));
  return nested.flat();
}

function displayPath(path) {
  return relative(root, path).replaceAll('\\', '/');
}

function isAllowedAnonymousClient(value) {
  const normalized = value.trim();
  return allowedAnonymousClients.has(normalized) && !companyShapedClientPattern.test(normalized);
}

function isAllowedAnonymousAttribution(line) {
  const attribution = line.match(/\s+[-\u2014]\s+([^-\u2014]+?)\s*$/)?.[1];
  return Boolean(attribution && allowedAnonymousAttributions.has(attribution));
}

function collectUnsafeManifestEntries(value, trail = '$', failures = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectUnsafeManifestEntries(item, `${trail}[${index}]`, failures));
    return failures;
  }

  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      const normalizedKey = key.replace(/[^a-z0-9]/gi, '').toLowerCase();
      if (prohibitedManifestKey.test(key) || /^(?:rawpath|rawfilepath|filename)$/.test(normalizedKey)) {
        failures.push(`${trail}.${key}: prohibited provenance key`);
      }
      collectUnsafeManifestEntries(child, `${trail}.${key}`, failures);
    }
    return failures;
  }

  if (typeof value === 'string') {
    for (const [label, pattern] of prohibitedPublicPatterns) {
      if (pattern.test(value)) failures.push(`${trail}: ${label}`);
    }
  }

  return failures;
}

describe('public ARCLIFT identity', () => {
  it('recursively scans every public text source for private provenance, named identities, and manufacturer positioning', async () => {
    const files = await listPublicTextFiles();
    const failures = [];

    for (const file of files) {
      const text = await readFile(file, 'utf8');
      for (const [label, pattern] of prohibitedPublicPatterns) {
        if (pattern.test(text)) failures.push(`${displayPath(file)}: ${label}`);
      }
      for (const identity of namedCaseIdentities) {
        if (text.toLowerCase().includes(identity.toLowerCase())) {
          failures.push(`${displayPath(file)}: named case identity ${identity}`);
        }
      }
    }

    expect(files.length).toBeGreaterThan(0);
    expect(failures).toEqual([]);
  });

  it('covers deployable text sources across src and public', () => {
    expect(publicSourceRoots).toEqual(['src', 'public']);
    expect(excludedPublicDirectories).toEqual(expect.objectContaining({ size: 6 }));
    expect([...excludedPublicDirectories]).toEqual(expect.arrayContaining(['build', 'dist', 'node_modules']));
    expect(publicTextExtensions.has('.webp')).toBe(false);
    expect(publicTextExtensions).toEqual(new Set([
      '.astro', '.cjs', '.css', '.html', '.js', '.json', '.jsx', '.map', '.md', '.mdx', '.mjs',
  '.scss', '.svg', '.ts', '.tsx', '.txt', '.webmanifest', '.xml', '.yaml', '.yml',
    ]));
  });

  it('uses anonymous project identities and non-identifying quote attributions in every case study', async () => {
    const files = await listFiles(resolve(root, 'src/content/case-studies'));
    const failures = [];

    for (const file of files) {
      const text = await readFile(file, 'utf8');
      const client = text.match(/^client:\s*["']?(.+?)["']?\s*$/m)?.[1];
      const location = text.match(/^location:\s*["']?(.+?)["']?\s*$/m)?.[1];
      const attributions = text.split(/\r?\n/).filter((line) => /^>\s*(?:.*["\u201d]\s*)?[-\u2014]\s*/.test(line));

      if (client && !isAllowedAnonymousClient(client)) {
        failures.push(`${displayPath(file)}: identifiable client field "${client}"`);
      }
      if (location && !/^undisclosed$/i.test(location)) {
        failures.push(`${displayPath(file)}: identifiable project location "${location}"`);
      }
      for (const line of attributions) {
        if (!isAllowedAnonymousAttribution(line)) {
          failures.push(`${displayPath(file)}: identifiable quote attribution "${line.trim()}"`);
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it('rejects company-shaped and unknown client-field values', () => {
    expect(isAllowedAnonymousClient('An ACME Corporation project')).toBe(false);
    expect(isAllowedAnonymousClient('A Beta Company project')).toBe(false);
    expect(isAllowedAnonymousClient('An unknown project category')).toBe(false);
  });

  it.each([
    'ARCLIFT is the source factory.',
    'ARCLIFT owns a factory.',
    'ARCLIFT owns the factory.',
    'ARCLIFT operates the factory.',
    'ARCLIFT runs its factory.',
    'Factory-direct supply is available.',
    'Our factory prepares the equipment.',
    'This system is manufactured by ARCLIFT.',
  ])('explicitly blocks prohibited supplier-identity wording: %s', (claim) => {
    const failures = prohibitedPublicPatterns
      .filter(([, pattern]) => pattern.test(claim))
      .map(([label]) => label);

    expect(failures.length).toBeGreaterThan(0);
  });

  it('uses the approved supplier positioning on the About page', async () => {
    const about = await readProjectFile('src/pages/about.astro');

    expect(about).toMatch(/integrated equipment supplier/i);
    expect(about).toMatch(/equipment solutions supplier/i);
    expect(about).not.toMatch(/100%\s*<\/div>\s*<div[^>]*>\s*Project-Specific Review/i);
    expect(about).toMatch(/technical selection and supply partner/i);
  });

  it('uses supplier-oriented schema and project-data guidance on shared public pages', async () => {
    const contact = await readProjectFile('src/pages/contact.astro');
    const blogLayout = await readProjectFile('src/layouts/BlogLayout.astro');

    expect(contact).toMatch(/['"]@type['"]:\s*['"]Organization['"]/);
    expect(contact).toMatch(/Configuration Documentation/i);
    expect(blogLayout).toMatch(/evidence files/i);
    expect(blogLayout).toMatch(/working height/i);
    expect(blogLayout).toMatch(/destination market/i);
  });
});

describe('public asset manifest', () => {
  it('is valid JSON with recursively safe keys and values', async () => {
    const text = await readProjectFile('public/images/asset-manifest.json');
    const manifest = JSON.parse(text);

    expect(collectUnsafeManifestEntries(manifest)).toEqual([]);
  });

  it('blocks normalized raw path and filename provenance keys', () => {
    const unsafe = { Source_File: 'a', 'ORIGINAL-name': 'b', rawPath: 'c', raw_file_path: 'd', filename: 'e' };

    expect(collectUnsafeManifestEntries(unsafe)).toHaveLength(5);
  });

  it('contains only public-facing asset records with URLs, slugs, uses, or themes', async () => {
    const manifest = JSON.parse(await readProjectFile('public/images/asset-manifest.json'));
    const serialized = JSON.stringify(manifest);

    expect(serialized).toMatch(/\/images\//);
    expect(serialized).toMatch(/(?:slug|use|theme)/i);
  });

  it('conservatively classifies all current product and campaign images as editorial', async () => {
    const manifest = JSON.parse(await readProjectFile('public/images/asset-manifest.json'));
    const allowed = new Set(['evidence', 'editorial']);
    const productRecords = manifest.products ?? [];
    const campaignRecords = [
      ...(manifest.campaigns?.hero ?? []),
      ...(manifest.campaigns?.banners ?? []),
      ...(manifest.campaigns?.editorial ?? []),
    ];

    expect(productRecords.length).toBeGreaterThan(0);
    expect(campaignRecords.length).toBeGreaterThan(0);
    expect(productRecords.every((record) => allowed.has(record.classification))).toBe(true);
    expect(campaignRecords.every((record) => allowed.has(record.classification))).toBe(true);
    expect(productRecords.every((record) => record.classification === 'editorial')).toBe(true);
    expect(campaignRecords.every((record) => record.classification === 'editorial')).toBe(true);
  });

  it('preserves the original 15 editorial assets and publishes the 52 approved long-form assets', async () => {
    const manifest = JSON.parse(await readProjectFile('public/images/asset-manifest.json'));
    const records = manifest.campaigns?.editorial ?? [];
    const originalExpectedSlugs = [
      'truck-site-roll-forming-lift',
      'port-loading-logistics',
      'ceiling-platform-underside',
      'large-deck-steel-structure',
      'roof-level-workflow',
      'crawler-truck-selection-matrix',
      '40hq-logistics-checkpoints',
      'roll-forming-input-map',
      'ceiling-platform-project-data',
      'crawler-platform-selection-path',
      'ceiling-access-method-matrix',
      'indoor-floor-load-review',
      'remote-control-safety-loop',
      'dual-power-duty-cycle',
      'warehouse-ceiling-access-map',
    ];
    const expectedTask7Assets = [
      ['profile-input-sheet', '/images/editorial/profile-input-sheet.svg'],
      ['profile-tooling-decision-map', '/images/editorial/profile-tooling-decision-map.svg'],
      ['roof-system-tooling-boundary', '/images/editorial/roof-system-tooling-boundary.svg'],
      ['coil-route-journey-map', '/images/editorial/coil-route-journey-map.svg'],
      ['blank-coil-data-card', '/images/editorial/blank-coil-data-card.svg'],
      ['coil-zone-responsibility-overlay', '/images/editorial/coil-zone-responsibility-overlay.svg'],
      ['electrical-interface-boundary', '/images/editorial/electrical-interface-boundary.svg'],
      ['electrical-state-responsibility-matrix', '/images/editorial/electrical-state-responsibility-matrix.svg'],
      ['electrical-document-stack', '/images/editorial/electrical-document-stack.svg'],
      ['fat-sat-evidence-chain', '/images/editorial/fat-sat-evidence-chain.svg'],
      ['blank-fat-sat-record', '/images/editorial/blank-fat-sat-record.svg'],
      ['fat-sat-boundary-comparison', '/images/editorial/fat-sat-boundary-comparison.svg'],
      ['chassis-interface-stack', '/images/editorial/chassis-interface-stack.svg'],
      ['chassis-responsibility-swimlane', '/images/editorial/chassis-responsibility-swimlane.svg'],
      ['road-workface-route-map', '/images/editorial/road-workface-route-map.svg'],
    ];
    const expectedTask8Assets = [
      ['stadium-zone-governance-map', '/images/editorial/stadium-zone-governance-map.svg'],
      ['stadium-work-window-timeline', '/images/editorial/stadium-work-window-timeline.svg'],
      ['stadium-ceiling-service-overlay', '/images/editorial/stadium-ceiling-service-overlay.svg'],
      ['airport-terminal-phasing-map', '/images/editorial/airport-terminal-phasing-map.svg'],
      ['airport-approval-handover-swimlane', '/images/editorial/airport-approval-handover-swimlane.svg'],
      ['airport-gate-workface-checklist', '/images/editorial/airport-gate-workface-checklist.svg'],
      ['clearance-four-state-section', '/images/editorial/clearance-four-state-section.svg'],
      ['clearance-obstruction-survey-sheet', '/images/editorial/clearance-obstruction-survey-sheet.svg'],
      ['clearance-escalation-tree', '/images/editorial/clearance-escalation-tree.svg'],
      ['task-load-schedule', '/images/editorial/task-load-schedule.svg'],
      ['task-load-path', '/images/editorial/task-load-path.svg'],
      ['task-load-red-flag-matrix', '/images/editorial/task-load-red-flag-matrix.svg'],
      ['rescue-readiness-loop', '/images/editorial/rescue-readiness-loop.svg'],
      ['rescue-role-communications-card', '/images/editorial/rescue-role-communications-card.svg'],
      ['rescue-scenario-decision-matrix', '/images/editorial/rescue-scenario-decision-matrix.svg'],
    ];
    const expectedLiftPlatformAssets = [...LIFT_PLATFORM_ARTICLES, ...DAILY_LIFT_PLATFORM_ARTICLES].map(({ slug, diagram }) => [
      slug,
      `/images/editorial/${diagram}`,
    ]);
    const expectedNewAssets = [...expectedTask7Assets, ...expectedTask8Assets, ...expectedLiftPlatformAssets];
    const originalRecords = records.slice(0, 15);
    const newRecords = records.slice(15);
    const allowedKeys = ['classification', 'disclosure', 'slug', 'theme', 'url', 'use'];
    const failures = [];

    expect(records).toHaveLength(67);
    expect(originalRecords.map((record) => record.slug)).toEqual(originalExpectedSlugs);
    expect(createHash('sha256').update(JSON.stringify(originalRecords)).digest('hex')).toBe(
      'e23d452213c0d7159db2048a70773714987a4e9c74b07fb0d9ab3bec0a5af7df',
    );
    expect(newRecords.map(({ slug, url }) => [slug, url])).toEqual(expectedNewAssets);
    expect(new Set(records.map((record) => record.slug)).size).toBe(67);
    expect(new Set(records.map((record) => record.url)).size).toBe(67);

    for (const record of records) {
      const keys = Object.keys(record).sort();
      if (JSON.stringify(keys) !== JSON.stringify(allowedKeys)) {
        failures.push(`${record.slug}: unexpected fields ${keys.join(', ')}`);
      }
      if (record.classification !== 'editorial') failures.push(`${record.slug}: not editorial`);
      if (!record.url?.startsWith('/images/editorial/')) failures.push(`${record.slug}: unsafe URL`);
      if (!(await pathExists(resolve(root, 'public', record.url?.replace(/^\/+/, '') ?? '')))) {
        failures.push(`${record.slug}: missing public asset`);
      }
    }

    for (const record of originalRecords) {
      const expectedDisclosure = record.url?.endsWith('.svg')
        ? 'ARCLIFT editorial diagram'
        : 'AI-assisted editorial composite';
      if (record.disclosure !== expectedDisclosure) failures.push(`${record.slug}: incorrect original disclosure`);
    }

    for (const record of newRecords) {
      if (!record.url?.endsWith('.svg')) failures.push(`${record.slug}: new asset is not SVG`);
      if (!record.disclosure?.includes('AI-assisted editorial diagram')) {
        failures.push(`${record.slug}: missing AI-assisted editorial diagram disclosure`);
      }
      if (!record.disclosure?.includes('not evidence')) {
        failures.push(`${record.slug}: missing not-evidence disclosure`);
      }
    }

    expect(failures).toEqual([]);
  });

  it('never classifies a binary image reused across product slugs as evidence', async () => {
    const manifest = JSON.parse(await readProjectFile('public/images/asset-manifest.json'));
    const hashes = new Map();
    const failures = [];

    for (const record of manifest.products ?? []) {
      for (const url of record.urls ?? []) {
        const bytes = await readFile(resolve(root, 'public', url.replace(/^\/+/, '')));
        const hash = createHash('sha256').update(bytes).digest('hex');
        const prior = hashes.get(hash) ?? [];
        hashes.set(hash, [...prior, { slug: record.slug, classification: record.classification, url }]);
      }
    }

    for (const records of hashes.values()) {
      if (new Set(records.map((record) => record.slug)).size < 2) continue;
      for (const record of records) {
        if (record.classification === 'evidence') {
          failures.push(`${record.slug}: ${record.url} reuses a cross-slug binary`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});

async function collectPublishedRoutes() {
  const routes = new Set(['/']);
  const pageFiles = await listFiles(resolve(root, 'src/pages'));

  for (const file of pageFiles) {
    if (extname(file) !== '.astro') continue;
    const page = displayPath(file).replace(/^src\/pages\//, '').replace(/\.astro$/, '');
    if (page.includes('[') || page === '404') continue;
    const route = page === 'index' ? '/' : `/${page.replace(/\/index$/, '')}/`;
    routes.add(route.replace(/\/{2,}/g, '/'));
  }

  for (const [directory, prefix] of [
    ['src/content/products', '/products/'],
    ['src/content/case-studies', '/case-studies/'],
    ['src/content/blog', '/blog/'],
  ]) {
    for (const file of await listFiles(resolve(root, directory))) {
      if (!['.md', '.mdx'].includes(extname(file))) continue;
      const slug = displayPath(file).split('/').at(-1).replace(/\.(?:md|mdx)$/, '');
      routes.add(`${prefix}${slug}/`);
    }
  }

  routes.add('/blog/page/');
  return routes;
}

function literalInternalLinks(text) {
  const links = [];
  for (const pattern of [/href\s*=\s*["'](\/[^"']*)["']/g, /\]\((\/[^)\s]+)\)/g]) {
    for (const match of text.matchAll(pattern)) links.push(match[1]);
  }
  return links;
}

describe('public route integrity', () => {
  it('contains no unresolved /solutions/ links in public source', async () => {
    const files = await listRouteSourceFiles();
    const failures = [];

    for (const file of files) {
      const text = await readFile(file, 'utf8');
      if (/\/solutions\//i.test(text)) failures.push(displayPath(file));
    }

    expect(failures).toEqual([]);
  });

  it('resolves literal internal page links to published routes', async () => {
    const files = await listRouteSourceFiles();
    const routes = await collectPublishedRoutes();
    const failures = [];

    for (const file of files) {
      const text = await readFile(file, 'utf8');
      for (const href of literalInternalLinks(text)) {
        const target = href.split(/[?#]/, 1)[0] || '/';
        if (/\.(?:avif|gif|ico|jpe?g|pdf|png|svg|webp)$/i.test(target)) continue;
        const normalized = target === '/' ? '/' : `${target.replace(/\/+$/, '')}/`;
        if (!routes.has(normalized)) failures.push(`${displayPath(file)} -> ${href}`);
      }
    }

    expect(failures).toEqual([]);
  });

  it('publishes the blog content directory without placeholder article files', async () => {
    const directory = resolve(root, 'src/content/blog');
    const articles = (await listFiles(directory)).filter((file) => ['.md', '.mdx'].includes(extname(file)));
    const placeholders = articles.filter((file) => /(?:placeholder|dummy|sample|test-article)/i.test(displayPath(file)));

    expect(await pathExists(directory)).toBe(true);
    expect(placeholders).toEqual([]);
  });

  it('renders the 404 page as noindex without a canonical or hreflang URL', async () => {
    const notFoundPage = await readProjectFile('src/pages/404.astro');
    const baseLayout = await readProjectFile('src/layouts/BaseLayout.astro');
    const seoHead = await readProjectFile('src/components/SEOHead.astro');

    expect(notFoundPage).toMatch(/noindex=\{true\}/);
    expect(notFoundPage).toMatch(/canonical=\{false\}/);
    expect(baseLayout).toMatch(/canonical\?:\s*string\s*\|\s*false/);
    expect(seoHead).toMatch(/canonical\?:\s*string\s*\|\s*false/);
    expect(seoHead).toMatch(/canonical\s*===\s*false/);
    expect(seoHead).toMatch(/\{pageUrl\s*&&\s*<link\s+rel="canonical"/);
    expect(seoHead).toMatch(/\{pageUrl\s*&&\s*<link\s+rel="alternate"/);
  });
});
