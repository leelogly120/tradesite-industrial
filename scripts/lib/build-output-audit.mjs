import { readdir, readFile } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';

const SITE = 'https://www.arclifteq.com';
const AI_ASSISTED_VISUAL = 'AI-assisted editorial visual';
const AI_ASSISTED_COMPOSITE = 'AI-assisted editorial composite';
const DISCLOSURE = 'Editorial planning visual — not model-specific evidence';
const PRODUCT_VISUAL_DISCLOSURE = `${AI_ASSISTED_VISUAL}. ${DISCLOSURE}`;
const COMPARE_VISUAL_DISCLOSURE = `${AI_ASSISTED_COMPOSITE}. ${DISCLOSURE}`;
const PRODUCT_SLUGS = [
  'arc-c17-crawler-roll-forming-lift',
  'arc-c21-crawler-roll-forming-lift',
  'arc-c25-crawler-roll-forming-lift',
  'arc-c28-crawler-roll-forming-lift',
  'arc-c32-crawler-roll-forming-lift',
  'arc-t12-truck-mounted-roll-forming-lift',
  'arc-t18-truck-mounted-roll-forming-lift',
  'arc-t25-truck-mounted-roll-forming-lift',
  'arc-t25hq-truck-mounted-roll-forming-lift-40hq',
  'arc-t31-truck-mounted-roll-forming-lift',
  'arc-f20-crawler-ceiling-platform',
  'arc-f25-crawler-ceiling-platform',
  'arc-f31-crawler-ceiling-platform',
  'arc-f35-crawler-ceiling-platform',
  'arc-rf8-roll-forming-machine',
];
const BASELINE_BLOG_SLUGS = Object.freeze([
  '40hq-shipping-truck-mounted-roll-forming-lift',
  'aerial-platform-emergency-lowering-rescue-plan',
  'aerial-platform-worker-tool-material-load-planning',
  'airport-terminal-maintenance-access-planning',
  'ceiling-platform-overhead-clearance-survey',
  'coil-handling-roll-forming-line-feeding-plan',
  'crawler-ceiling-wall-panel-platform-project-data',
  'crawler-platform-vs-spider-lift-vs-scaffolding',
  'crawler-under-ceiling-platform-buyers-guide',
  'crawler-vs-truck-mounted-roll-forming-system',
  'dual-power-crawler-platform-selection',
  'indoor-aerial-platform-ground-pressure-guide',
  'remote-control-aerial-platform-safety-planning',
  'roll-forming-line-electrical-control-interfaces',
  'roll-forming-line-fat-sat-acceptance-checklist',
  'roll-forming-line-specification-long-span-roof-panels',
  'roof-level-roll-forming-long-panels',
  'roof-panel-profile-material-tooling-data',
  'stadium-ceiling-access-platform-planning',
  'truck-mounted-roll-forming-chassis-interface-review',
  'warehouse-ceiling-access-platform-planning',
]);
const LEGACY_REDIRECTS = new Map([
  ['fddpt-20m-crawler-ceiling-platform', 'arc-f20-crawler-ceiling-platform'],
  ['fddpt-25m-crawler-ceiling-platform', 'arc-f25-crawler-ceiling-platform'],
  ['fddpt-31m-crawler-ceiling-platform', 'arc-f31-crawler-ceiling-platform'],
  ['fddpt-35m-crawler-ceiling-platform', 'arc-f35-crawler-ceiling-platform'],
]);
const COMPARE_KEYS = [
  'buyerQuestion',
  'confirmationGate',
  'familyId',
  'familyName',
  'model',
  'orientation',
  'scopeStatement',
  'slug',
  'status',
  'statusNote',
];
const ORIENTATION_KEYS = ['label', 'scope', 'value'];
const PROHIBITED_SCHEMA_TYPES = new Set(['Product', 'Offer', 'Review', 'AggregateRating', 'Rating']);

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  }));
  return nested.flat();
}

function routeFromIndexFile(distDir, file) {
  const path = relative(distDir, file).split(sep).join('/');
  if (path === 'index.html') return '/';
  if (!path.endsWith('/index.html')) return undefined;
  return `/${path.slice(0, -'index.html'.length)}`;
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'));
  return match?.[1] ?? match?.[2];
}

function canonicalValues(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)]
    .filter(match => (attribute(match[0], 'rel') ?? '').split(/\s+/).includes('canonical'))
    .map(match => attribute(match[0], 'href'))
    .filter(Boolean);
}

function robotsValues(html) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)]
    .filter(match => (attribute(match[0], 'name') ?? '').toLowerCase() === 'robots')
    .map(match => (attribute(match[0], 'content') ?? '').toLowerCase().replace(/\s+/g, ''));
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function normalizedText(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function elementsWithClass(html, tagName, className) {
  const openingPattern = new RegExp(`<${tagName}\\b([^>]*)>`, 'gi');
  return [...html.matchAll(openingPattern)].flatMap(match => {
    if (!(attribute(match[1], 'class') ?? '').split(/\s+/).includes(className)) return [];
    const bodyStart = (match.index ?? 0) + match[0].length;
    const bodyEnd = html.indexOf(`</${tagName}>`, bodyStart);
    if (bodyEnd < 0) return [];
    return [{
      attributes: match[1],
      body: html.slice(bodyStart, bodyEnd),
    }];
  });
}

function exactTextInClass(html, tagName, className, expected) {
  return elementsWithClass(html, tagName, className)
    .some(element => normalizedText(element.body) === expected);
}

function collectSchemaTypes(value, types = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectSchemaTypes(item, types);
  } else if (value && typeof value === 'object') {
    const schemaType = value['@type'];
    if (Array.isArray(schemaType)) types.push(...schemaType);
    else if (typeof schemaType === 'string') types.push(schemaType);
    for (const child of Object.values(value)) collectSchemaTypes(child, types);
  }
  return types;
}

function auditSchemas(route, html, errors) {
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if ((attribute(match[1], 'type') ?? '').toLowerCase() !== 'application/ld+json') continue;
    try {
      const types = collectSchemaTypes(JSON.parse(match[2]));
      for (const type of types) {
        if (PROHIBITED_SCHEMA_TYPES.has(type)) {
          errors.push(`${route} contains prohibited ${type} structured data`);
        }
      }
    } catch (error) {
      errors.push(`${route} contains invalid JSON-LD: ${error.message}`);
    }
  }
}

function parseSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(match => match[1].trim());
}

function isDraftMarkdown(markdown) {
  const frontmatter = markdown.match(/^---\s*\n([\s\S]*?)\n---/);
  return frontmatter ? /^draft:\s*true\s*$/im.test(frontmatter[1]) : false;
}

async function publicMarkdownSlugs(directory, ignored = new Set()) {
  const files = (await readdir(directory)).filter(name => name.endsWith('.md') && !ignored.has(name));
  const records = await Promise.all(files.map(async name => ({
    name,
    markdown: await readFile(join(directory, name), 'utf8'),
  })));
  return records.filter(record => !isDraftMarkdown(record.markdown)).map(record => record.name.slice(0, -3)).sort();
}

function expectCanonical(route, html, errors, site) {
  const values = canonicalValues(html);
  const expected = `${site}${route}`;
  if (values.length !== 1 || values[0] !== expected) {
    errors.push(`${route} has wrong canonical; expected ${expected}, found ${values.join(', ') || 'none'}`);
  }
}

function compareClientData(html, errors) {
  const dataMatch = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .find(match => attribute(match[1], 'id') === 'compare-reference-data');
  let views = [];
  if (!dataMatch) {
    errors.push('/compare/ is missing compare client data');
  } else {
    try {
      views = JSON.parse(dataMatch[2]);
    } catch (error) {
      errors.push(`/compare/ contains invalid compare client data: ${error.message}`);
    }
  }

  if (!Array.isArray(views)) {
    errors.push('/compare/ compare client data must be an array');
    return;
  }
  const actualSlugs = views.map(view => view?.slug).sort();
  if (actualSlugs.length !== PRODUCT_SLUGS.length || actualSlugs.join('\n') !== [...PRODUCT_SLUGS].sort().join('\n')) {
    errors.push('/compare/ compare client data must contain all 15 canonical product references exactly once');
  }
  for (const view of views) {
    const keys = view && typeof view === 'object' ? Object.keys(view).sort() : [];
    if (keys.join('\n') !== COMPARE_KEYS.join('\n')) {
      errors.push(`/compare/ compare client data for ${view?.slug ?? 'unknown'} has unsafe or incomplete keys: ${keys.join(', ')}`);
      continue;
    }
    const orientationKeys = view.orientation && typeof view.orientation === 'object'
      ? Object.keys(view.orientation).sort()
      : [];
    if (orientationKeys.join('\n') !== ORIENTATION_KEYS.join('\n')) {
      errors.push(`/compare/ compare client data for ${view.slug} has unsafe or incomplete orientation keys: ${orientationKeys.join(', ')}`);
    }
    for (const key of COMPARE_KEYS.filter(key => key !== 'orientation')) {
      if (typeof view[key] !== 'string' || view[key].trim() === '') {
        errors.push(`/compare/ compare client data for ${view.slug ?? 'unknown'} has blank ${key}`);
      }
    }
  }
}

export async function auditBuildOutput({
  root = process.cwd(),
  distDir = resolve(root, 'dist'),
  site = SITE,
} = {}) {
  const errors = [];
  const files = await listFiles(distDir);
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  const pages = new Map();
  for (const file of htmlFiles) {
    const route = routeFromIndexFile(distDir, file);
    if (route) pages.set(route, { file, html: await readFile(file, 'utf8') });
  }

  const productContentSlugs = await publicMarkdownSlugs(resolve(root, 'src/content/products'), new Set(['_template.md']));
  if (productContentSlugs.join('\n') !== [...PRODUCT_SLUGS].sort().join('\n')) {
    errors.push(`public product content must match the 15 canonical product references; found ${productContentSlugs.length}`);
  }
  const blogSlugs = await publicMarkdownSlugs(resolve(root, 'src/content/blog'));
  for (const slug of BASELINE_BLOG_SLUGS) {
    if (!blogSlugs.includes(slug)) {
      errors.push(`baseline published blog content is missing ${slug}`);
    }
  }
  const requiredBlogSlugs = [...new Set([...BASELINE_BLOG_SLUGS, ...blogSlugs])];

  const requiredRoutes = [
    '/products/',
    '/compare/',
    '/blog/',
    '/blog/page/2/',
    ...PRODUCT_SLUGS.map(slug => `/products/${slug}/`),
    ...requiredBlogSlugs.map(slug => `/blog/${slug}/`),
  ];
  for (const route of requiredRoutes) {
    if (!pages.has(route)) errors.push(`missing built route ${route}`);
  }

  const redirectRoutes = new Set([...LEGACY_REDIRECTS.keys()].map(slug => `/products/${slug}/`));
  const contentPages = [...pages.entries()].filter(([route]) => !redirectRoutes.has(route));
  for (const [route, { html }] of contentPages) {
    expectCanonical(route, html, errors, site);
    auditSchemas(route, html, errors);
    const robots = robotsValues(html);
    if (route === '/compare/') {
      if (robots.length !== 1 || robots[0] !== 'noindex,follow') {
        errors.push('/compare/ must emit exactly one noindex,follow robots directive');
      }
    } else if (robots.some(value => value.includes('noindex'))) {
      errors.push(`${route} is indexable but emits noindex`);
    }
  }

  const productIndex = pages.get('/products/')?.html ?? '';
  const disclosedFamilyVisuals = elementsWithClass(productIndex, 'div', 'family-card__image-wrap')
    .filter(element => /<img\b[^>]*class=(?:"[^"]*\bfamily-card__image\b[^"]*"|'[^']*\bfamily-card__image\b[^']*')/i.test(element.body))
    .filter(element => exactTextInClass(element.body, 'p', 'image-disclosure', PRODUCT_VISUAL_DISCLOSURE));
  if (disclosedFamilyVisuals.length !== 4) {
    errors.push(`/products/ must place four adjacent ${AI_ASSISTED_VISUAL} disclosures with the exact evidence boundary`);
  }
  for (const slug of PRODUCT_SLUGS) {
    const route = `/products/${slug}/`;
    const html = pages.get(route)?.html ?? '';
    const figures = elementsWithClass(html, 'figure', 'decision-gallery__figure');
    const disclosedFigures = figures
      .filter(figure => /<img\b/i.test(figure.body))
      .filter(figure => exactTextInClass(figure.body, 'figcaption', '', PRODUCT_VISUAL_DISCLOSURE));
    if (figures.length === 0 || disclosedFigures.length !== figures.length) {
      errors.push(`${route} has ${disclosedFigures.length} adjacent ${AI_ASSISTED_VISUAL} disclosures for ${figures.length} decision gallery figures`);
    }
  }

  const compareHtml = pages.get('/compare/')?.html ?? '';
  const compareHeroDisclosure = elementsWithClass(compareHtml, 'section', 'hero-banner')
    .some(hero => hero.attributes.includes('/images/banners/compare.webp')
      && exactTextInClass(hero.body, 'p', 'hero-disclosure', COMPARE_VISUAL_DISCLOSURE));
  if (!compareHeroDisclosure) {
    errors.push(`/compare/ hero must place an adjacent ${AI_ASSISTED_COMPOSITE} disclosure with the exact evidence boundary`);
  }
  if (!/data-compare-region/.test(compareHtml)
      || !/<caption>Archived references and project-review boundaries<\/caption>/.test(compareHtml)
      || !/<tbody>[\s\S]*?<td>[^<]+<\/td>[\s\S]*?<\/tbody>/.test(compareHtml)) {
    errors.push('/compare/ must contain a non-empty static comparison table');
  }
  const staticCompare = compareHtml.split(/<script\b[^>]*id=["']compare-reference-data["']/i)[0];
  const staticProductLinks = new Set([...staticCompare.matchAll(/href=["']\/products\/([^/"']+)\/["']/gi)].map(match => match[1]));
  if (staticProductLinks.size !== 4 || [...staticProductLinks].some(slug => !PRODUCT_SLUGS.includes(slug))) {
    errors.push('/compare/ static output must link four canonical product references');
  }
  compareClientData(compareHtml, errors);
  const moduleScripts = [...compareHtml.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(match => (attribute(match[1], 'type') ?? '').toLowerCase() === 'module')
    .map(match => match[2])
    .join('\n');
  if (!moduleScripts.includes('URLSearchParams') || !moduleScripts.includes('items') || !moduleScripts.includes('data-compare-region')) {
    errors.push('/compare/ client output must use URLSearchParams items to enhance data-compare-region');
  }

  for (const [legacySlug, targetSlug] of LEGACY_REDIRECTS) {
    const route = `/products/${legacySlug}/`;
    const html = pages.get(route)?.html ?? '';
    const targetRoute = `/products/${targetSlug}/`;
    if (!html.includes(`url=${targetRoute}`) || !html.includes(`href="${targetRoute}"`)) {
      errors.push(`legacy redirect ${route} must preserve its ${targetRoute} output`);
    }
    if (!robotsValues(html).includes('noindex')) {
      errors.push(`legacy redirect ${route} must remain noindex`);
    }
    const canonical = canonicalValues(html);
    if (canonical.length !== 1 || canonical[0] !== `${site}${targetRoute}`) {
      errors.push(`legacy redirect ${route} must canonicalize to ${site}${targetRoute}`);
    }
  }

  const notFound = await readFile(resolve(distDir, '404.html'), 'utf8').catch(() => '');
  if (!notFound) {
    errors.push('missing dist/404.html');
  } else {
    if (canonicalValues(notFound).length !== 0) errors.push('404.html must not emit a canonical');
    if (!robotsValues(notFound).includes('noindex,nofollow')) errors.push('404.html must emit noindex,nofollow');
  }

  const sitemapFiles = files.filter(file => /sitemap-\d+\.xml$/i.test(file));
  const sitemapUrls = new Set((await Promise.all(sitemapFiles.map(file => readFile(file, 'utf8')))).flatMap(parseSitemapUrls));
  if (sitemapFiles.length === 0) errors.push('missing generated sitemap shard');
  if (sitemapUrls.has(`${site}/compare/`)) errors.push('/compare/ is noindex and must not remain in the sitemap');
  const requiredBlogSitemapRoutes = [
    '/blog/page/2/',
    ...BASELINE_BLOG_SLUGS.map(slug => `/blog/${slug}/`),
  ];
  for (const route of requiredBlogSitemapRoutes) {
    if (!sitemapUrls.has(`${site}${route}`)) errors.push(`sitemap is missing required baseline blog route ${site}${route}`);
  }
  const indexableRoutes = contentPages.map(([route]) => route).filter(route => route !== '/compare/');
  const expectedSitemapUrls = new Set(indexableRoutes.map(route => `${site}${route}`));
  for (const url of expectedSitemapUrls) {
    if (!sitemapUrls.has(url)) errors.push(`sitemap is missing indexable canonical ${url}`);
  }
  for (const url of sitemapUrls) {
    if (!expectedSitemapUrls.has(url)) errors.push(`sitemap contains non-indexable or missing route ${url}`);
  }

  if (errors.length) {
    throw new Error(`Build output audit failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  }
  return {
    htmlFileCount: htmlFiles.length,
    indexableRouteCount: indexableRoutes.length,
    sitemapUrlCount: sitemapUrls.size,
    productRouteCount: PRODUCT_SLUGS.length,
    blogArticleRouteCount: blogSlugs.length,
    legacyRedirectCount: LEGACY_REDIRECTS.size,
  };
}
