import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { auditBuildOutput } from '../scripts/lib/build-output-audit.mjs';
import { shouldIncludeInSitemap } from '../scripts/lib/sitemap-policy.mjs';

const SITE = 'https://www.arclifteq.com';
const AI_ASSISTED_VISUAL = 'AI-assisted editorial visual';
const AI_ASSISTED_COMPOSITE = 'AI-assisted editorial composite';
const DISCLOSURE = 'Editorial planning visual — not model-specific evidence';
const PRODUCT_VISUAL_DISCLOSURE = `${AI_ASSISTED_VISUAL}. ${DISCLOSURE}`;
const COMPARE_VISUAL_DISCLOSURE = `${AI_ASSISTED_COMPOSITE}. ${DISCLOSURE}`;
const baselineBlogSlugs = [
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
];
const additionalBlogSlug = 'future-additional-route';
const productSlugs = [
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
const baselineStaticRoutes = [
  '/about/', '/contact/', '/applications/', '/applications/airport/', '/applications/stadium/', '/applications/warehouse/',
];
const redirects = new Map([
  ['fddpt-20m-crawler-ceiling-platform', 'arc-f20-crawler-ceiling-platform'],
  ['fddpt-25m-crawler-ceiling-platform', 'arc-f25-crawler-ceiling-platform'],
  ['fddpt-31m-crawler-ceiling-platform', 'arc-f31-crawler-ceiling-platform'],
  ['fddpt-35m-crawler-ceiling-platform', 'arc-f35-crawler-ceiling-platform'],
]);
const scratchDirs = [];

async function write(root, relativePath, body) {
  const path = join(root, relativePath);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, body, 'utf8');
}

function page(route, body = '', { robots } = {}) {
  const canonical = `${SITE}${route}`;
  return [
    '<!doctype html><html><head>',
    `<link rel="canonical" href="${canonical}">`,
    robots ? `<meta name="robots" content="${robots}">` : '',
    '</head><body>',
    body,
    '</body></html>',
  ].join('');
}

function productPage(slug) {
  return page(`/products/${slug}/`, [
    '<main>',
    '<figure class="decision-gallery__figure">',
    '<img src="/images/editorial/example.svg" alt="Editorial example">',
    `<figcaption>${PRODUCT_VISUAL_DISCLOSURE}</figcaption>`,
    '</figure>',
    '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage"}</script>',
  ].join('') + '</main>');
}

function comparePage() {
  const views = productSlugs.map((slug, index) => ({
    slug,
    model: `ARC-${index + 1}`,
    familyId: index < 10 ? 'lift' : 'platform',
    familyName: index < 10 ? 'Lift references' : 'Platform references',
    status: 'Archived reference',
    statusNote: 'Reference only',
    scopeStatement: 'Project review scope',
    buyerQuestion: 'Which project inputs control the review?',
    orientation: { label: 'Archived height class', scope: 'reference only', value: `${index + 1}m class` },
    confirmationGate: 'Confirm against signed project documents',
    imageDisclosure: 'Editorial planning visual — not model-specific evidence',
    imageRole: 'Editorial planning visual',
    primaryProjectInputs: ['Project input'],
    requiredDocuments: ['Signed technical schedule'],
  }));
  return page('/compare/', [
    `<section class="hero-banner" style="--banner-image:url('/images/banners/compare.webp')"><p class="hero-disclosure">${COMPARE_VISUAL_DISCLOSURE}</p></section>`,
    '<div data-compare-region>',
    '<table class="comparison-table">',
    '<caption>Archived references and project-review boundaries</caption>',
    '<thead><tr><th scope="col">Review field</th>',
    ...productSlugs.slice(10, 14).map(slug => `<th scope="col"><a href="/products/${slug}/">${slug}</a></th>`),
    '</tr></thead><tbody><tr data-compare-field="family"><th scope="row">Family</th>',
    '<td>Platform references</td><td>Platform references</td><td>Platform references</td><td>Platform references</td>',
    '</tr></tbody></table></div>',
    `<script id="compare-reference-data" type="application/json">${JSON.stringify(views)}</script>`,
    '<script type="module">const region=document.querySelector("[data-compare-region]");const params=new URLSearchParams(window.location.search);if(region&&params.has("items"))region.dataset.enhanced="true";</script>',
  ].join(''), { robots: 'noindex,follow' });
}

async function makeValidFixture() {
  const root = await mkdtemp(join(tmpdir(), 'arclift-build-audit-'));
  scratchDirs.push(root);
  for (const slug of [...baselineBlogSlugs, additionalBlogSlug]) {
    await write(root, `src/content/blog/${slug}.md`, `---\ntitle: ${slug}\n---\n`);
  }
  for (const slug of productSlugs) {
    await write(root, `src/content/products/${slug}.md`, `---\ntitle: ${slug}\n---\n`);
  }
  await write(root, 'dist/index.html', page('/'));
for (const route of baselineStaticRoutes) {
    await write(root, `dist${route}index.html`, page(route));
  }
  await write(root, 'src/pages/about.astro', '---\n---\n<h1>About</h1>');
  await write(root, 'dist/404.html', '<!doctype html><meta name="robots" content="noindex,nofollow"><h1>Not found</h1>');
  await write(root, 'dist/products/index.html', page('/products/', Array.from({ length: 4 }, (_, index) => [
    '<div class="family-card__image-wrap">',
    `<img class="family-card__image" src="/images/editorial/family-${index}.svg" alt="Editorial family visual">`,
    `<p class="image-disclosure">${PRODUCT_VISUAL_DISCLOSURE}</p>`,
    '</div>',
  ].join('')).join('')));
  for (const slug of productSlugs) {
    await write(root, `dist/products/${slug}/index.html`, productPage(slug));
  }
  await write(root, 'dist/blog/index.html', page('/blog/'));
  for (const slug of [...baselineBlogSlugs, additionalBlogSlug]) {
    await write(root, `dist/blog/${slug}/index.html`, page(`/blog/${slug}/`));
  }
  await write(root, 'dist/blog/page/2/index.html', page('/blog/page/2/'));
  await write(root, 'dist/compare/index.html', comparePage());

  for (const [legacy, target] of redirects) {
    await write(root, `dist/products/${legacy}/index.html`, [
      '<!doctype html>',
      `<meta http-equiv="refresh" content="0;url=/products/${target}/">`,
      '<meta name="robots" content="noindex">',
      `<link rel="canonical" href="${SITE}/products/${target}/">`,
      `<a href="/products/${target}/">Redirect</a>`,
    ].join(''));
  }

  const indexableRoutes = [
    '/',
    ...baselineStaticRoutes,
    '/products/',
    ...productSlugs.map(slug => `/products/${slug}/`),
    '/blog/',
    ...[...baselineBlogSlugs, additionalBlogSlug].map(slug => `/blog/${slug}/`),
    '/blog/page/2/',
  ];
  await write(root, 'dist/sitemap-index.xml', `<?xml version="1.0"?><sitemapindex><sitemap><loc>${SITE}/sitemap-0.xml</loc></sitemap></sitemapindex>`);
  await write(root, 'dist/sitemap-0.xml', `<?xml version="1.0"?><urlset>${indexableRoutes.map(route => `<url><loc>${SITE}${route}</loc></url>`).join('')}</urlset>`);
  return root;
}

afterEach(async () => {
  await Promise.all(scratchDirs.splice(0).map(path => rm(path, { recursive: true, force: true })));
});

describe('sitemap policy', () => {
  it('excludes the noindex comparison route without excluding indexable routes', () => {
    expect(shouldIncludeInSitemap(`${SITE}/compare/`)).toBe(false);
    expect(shouldIncludeInSitemap(`${SITE}/products/arc-c25-crawler-roll-forming-lift/`)).toBe(true);
    expect(shouldIncludeInSitemap(`${SITE}/blog/${baselineBlogSlugs[0]}/`)).toBe(true);
  });
});

describe('built output audit', () => {
  it('accepts a complete safe static build and reports literal route totals', async () => {
    const root = await makeValidFixture();

    await expect(auditBuildOutput({ root })).resolves.toMatchObject({
      htmlFileCount: 53,
      indexableRouteCount: 47,
      sitemapUrlCount: 47,
      productRouteCount: 15,
      blogArticleRouteCount: 22,
      legacyRedirectCount: 4,
    });
  });

  it('rejects a noindex route in the sitemap and unsafe structured data', async () => {
    const root = await makeValidFixture();
    const sitemapPath = resolve(root, 'dist/sitemap-0.xml');
    const sitemap = await readFile(sitemapPath, 'utf8');
    await writeFile(sitemapPath, sitemap.replace('</urlset>', `<url><loc>${SITE}/compare/</loc></url></urlset>`), 'utf8');
    const productPath = resolve(root, 'dist/products/arc-c25-crawler-roll-forming-lift/index.html');
    const html = await readFile(productPath, 'utf8');
    await writeFile(productPath, html.replace('</body>', '<script type="application/ld+json">{"@type":"Product"}</script></body>'), 'utf8');

    const error = await auditBuildOutput({ root }).catch(reason => reason);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatch(/compare.*sitemap/i);
    expect(error.message).toMatch(/Product structured data/i);
  });

  it('rejects broken canonical, disclosure, compare-client, and redirect artifacts', async () => {
    const root = await makeValidFixture();
    const productPath = resolve(root, 'dist/products/arc-c25-crawler-roll-forming-lift/index.html');
    const productHtml = await readFile(productPath, 'utf8');
    await writeFile(productPath, productHtml
      .replace(`${SITE}/products/arc-c25-crawler-roll-forming-lift/`, `${SITE}/products/wrong/`)
      .replace(PRODUCT_VISUAL_DISCLOSURE, 'Undisclosed image'), 'utf8');
    const comparePath = resolve(root, 'dist/compare/index.html');
    const compareHtml = await readFile(comparePath, 'utf8');
    await writeFile(comparePath, compareHtml.replace('new URLSearchParams', 'new Map'), 'utf8');
    const redirectPath = resolve(root, 'dist/products/fddpt-25m-crawler-ceiling-platform/index.html');
    const redirectHtml = await readFile(redirectPath, 'utf8');
    await writeFile(redirectPath, redirectHtml.replace('content="noindex"', 'content="index"'), 'utf8');

    const error = await auditBuildOutput({ root }).catch(reason => reason);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatch(/wrong canonical/i);
    expect(error.message).toMatch(/disclosure/i);
    expect(error.message).toMatch(/URLSearchParams/i);
    expect(error.message).toMatch(/legacy redirect.*noindex/i);
  });

  it('rejects missing AI-assisted labels even when the evidence-boundary phrase remains', async () => {
    const root = await makeValidFixture();
    const productIndexPath = resolve(root, 'dist/products/index.html');
    const productIndexHtml = await readFile(productIndexPath, 'utf8');
    await writeFile(
      productIndexPath,
      productIndexHtml.replace(`${AI_ASSISTED_VISUAL}. `, ''),
      'utf8',
    );
    const comparePath = resolve(root, 'dist/compare/index.html');
    const compareHtml = await readFile(comparePath, 'utf8');
    await writeFile(
      comparePath,
      compareHtml.replace(`${AI_ASSISTED_COMPOSITE}. `, ''),
      'utf8',
    );

    const error = await auditBuildOutput({ root }).catch(reason => reason);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatch(/products.*AI-assisted editorial visual/i);
    expect(error.message).toMatch(/compare.*AI-assisted editorial composite/i);
  });

  it('rejects unsafe or incomplete compare data embedded for client enhancement', async () => {
    const root = await makeValidFixture();
    const comparePath = resolve(root, 'dist/compare/index.html');
    const compareHtml = await readFile(comparePath, 'utf8');
    await writeFile(comparePath, compareHtml
      .replace('"confirmationGate":"Confirm against signed project documents"', '"payload":"8t"')
      .replace(`"slug":"${productSlugs[14]}"`, '"slug":"not-a-canonical-reference"'), 'utf8');

    const error = await auditBuildOutput({ root }).catch(reason => reason);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatch(/compare client data[\s\S]*(?:confirmationGate|payload)/i);
    expect(error.message).toMatch(/15 canonical product references/i);
  });

  it('rejects deletion of a baseline published blog even when content, output, and sitemap agree', async () => {
    const root = await makeValidFixture();
    const slug = baselineBlogSlugs[0];
    await rm(resolve(root, `src/content/blog/${slug}.md`));
    await rm(resolve(root, `dist/blog/${slug}`), { recursive: true });
    const sitemapPath = resolve(root, 'dist/sitemap-0.xml');
    const sitemap = await readFile(sitemapPath, 'utf8');
    await writeFile(
      sitemapPath,
      sitemap.replace(`<url><loc>${SITE}/blog/${slug}/</loc></url>`, ''),
      'utf8',
    );

    const error = await auditBuildOutput({ root }).catch(reason => reason);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatch(new RegExp(`baseline published blog[\\s\\S]*${slug}`, 'i'));
    expect(error.message).toMatch(new RegExp(`missing built route /blog/${slug}/`, 'i'));
    expect(error.message).toMatch(new RegExp(`sitemap[\\s\\S]*${slug}`, 'i'));
  });


  it('rejects synchronized source, output, and sitemap deletion of a baseline indexable route', async () => {
    const root = await makeValidFixture();
    await rm(resolve(root, 'src/pages/about.astro'));
    await rm(resolve(root, 'dist/about'), { recursive: true });
    const sitemapPath = resolve(root, 'dist/sitemap-0.xml');
    await writeFile(sitemapPath, (await readFile(sitemapPath, 'utf8')).replace(`<url><loc>${SITE}/about/</loc></url>`, ''), 'utf8');

    const error = await auditBuildOutput({ root }).catch(reason => reason);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatch(/baseline indexable route is missing \/about\//i);
  });
  it('rejects deletion of the required second blog index from output and sitemap', async () => {
    const root = await makeValidFixture();
    await rm(resolve(root, 'dist/blog/page/2'), { recursive: true });
    const sitemapPath = resolve(root, 'dist/sitemap-0.xml');
    const sitemap = await readFile(sitemapPath, 'utf8');
    await writeFile(
      sitemapPath,
      sitemap.replace(`<url><loc>${SITE}/blog/page/2/</loc></url>`, ''),
      'utf8',
    );

    const error = await auditBuildOutput({ root }).catch(reason => reason);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatch(/missing built route \/blog\/page\/2\//i);
    expect(error.message).toMatch(/sitemap[\s\S]*\/blog\/page\/2\//i);
  });
});
