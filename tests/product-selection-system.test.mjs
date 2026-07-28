import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import * as productSelectionDomain from '../src/lib/product-selection';
import {
  DEFAULT_COMPARE_SLUGS,
  PRODUCT_FAMILIES,
  PRODUCT_REFERENCES,
  buildProductView,
  getCompareMode,
  getProductReference,
  getRelatedProductSlugs,
  parseCompareItems,
} from '../src/lib/product-selection';

const disclosure = 'Editorial planning visual — not model-specific evidence';
const productListSource = await readFile(new URL('../src/pages/products/index.astro', import.meta.url), 'utf8');
const productDetailSource = await readFile(new URL('../src/pages/products/[slug].astro', import.meta.url), 'utf8');

const expectedFamilies = [
  ['crawler-roll-forming-lifts', ['ARC-C17', 'ARC-C21', 'ARC-C25', 'ARC-C28', 'ARC-C32']],
  ['truck-mounted-roll-forming-lifts', ['ARC-T12', 'ARC-T18', 'ARC-T25', 'ARC-T25HQ', 'ARC-T31']],
  ['crawler-ceiling-platforms', ['ARC-F20', 'ARC-F25', 'ARC-F31', 'ARC-F35']],
  ['roll-forming-machines', ['ARC-RF8']],
];

const expectedMappings = [
  'arc-c17-crawler-roll-forming-lift', 'arc-c21-crawler-roll-forming-lift',
  'arc-c25-crawler-roll-forming-lift', 'arc-c28-crawler-roll-forming-lift',
  'arc-c32-crawler-roll-forming-lift', 'arc-t12-truck-mounted-roll-forming-lift',
  'arc-t18-truck-mounted-roll-forming-lift', 'arc-t25-truck-mounted-roll-forming-lift',
  'arc-t25hq-truck-mounted-roll-forming-lift-40hq', 'arc-t31-truck-mounted-roll-forming-lift',
  'arc-f20-crawler-ceiling-platform', 'arc-f25-crawler-ceiling-platform',
  'arc-f31-crawler-ceiling-platform', 'arc-f35-crawler-ceiling-platform',
  'arc-rf8-roll-forming-machine',
];
const expectedReferenceMappings = [
  ['arc-c17-crawler-roll-forming-lift', 'ARC-C17', 'crawler-roll-forming-lifts'],
  ['arc-c21-crawler-roll-forming-lift', 'ARC-C21', 'crawler-roll-forming-lifts'],
  ['arc-c25-crawler-roll-forming-lift', 'ARC-C25', 'crawler-roll-forming-lifts'],
  ['arc-c28-crawler-roll-forming-lift', 'ARC-C28', 'crawler-roll-forming-lifts'],
  ['arc-c32-crawler-roll-forming-lift', 'ARC-C32', 'crawler-roll-forming-lifts'],
  ['arc-t12-truck-mounted-roll-forming-lift', 'ARC-T12', 'truck-mounted-roll-forming-lifts'],
  ['arc-t18-truck-mounted-roll-forming-lift', 'ARC-T18', 'truck-mounted-roll-forming-lifts'],
  ['arc-t25-truck-mounted-roll-forming-lift', 'ARC-T25', 'truck-mounted-roll-forming-lifts'],
  ['arc-t25hq-truck-mounted-roll-forming-lift-40hq', 'ARC-T25HQ', 'truck-mounted-roll-forming-lifts'],
  ['arc-t31-truck-mounted-roll-forming-lift', 'ARC-T31', 'truck-mounted-roll-forming-lifts'],
  ['arc-f20-crawler-ceiling-platform', 'ARC-F20', 'crawler-ceiling-platforms'],
  ['arc-f25-crawler-ceiling-platform', 'ARC-F25', 'crawler-ceiling-platforms'],
  ['arc-f31-crawler-ceiling-platform', 'ARC-F31', 'crawler-ceiling-platforms'],
  ['arc-f35-crawler-ceiling-platform', 'ARC-F35', 'crawler-ceiling-platforms'],
  ['arc-rf8-roll-forming-machine', 'ARC-RF8', 'roll-forming-machines'],
];

describe('ARCLIFT evidence-safe product selection domain', () => {
  it('has four stable families and fifteen explicit reference mappings', () => {
    expect(PRODUCT_FAMILIES.map(({ id, models }) => [id, models])).toEqual(expectedFamilies);
    expect(PRODUCT_REFERENCES.map(({ slug, model, familyId }) => [slug, model, familyId])).toEqual(expectedReferenceMappings);
    expect(PRODUCT_REFERENCES.map(({ slug }) => slug)).toEqual(expectedMappings);
  });

  it('preserves special reference statuses and the 40HQ planning boundary', () => {
    expect(getProductReference('arc-t25hq-truck-mounted-roll-forming-lift-40hq')).toMatchObject({ status: 'Planning route', statusNote: '40HQ planning route only' });
    for (const model of ['ARC-F25', 'ARC-F31', 'ARC-F35']) {
      expect(PRODUCT_REFERENCES.find(reference => reference.model === model)?.status).toBe('Reference concept');
    }
  });

  it('maps public orientation fields by family without payload, thickness, or power leakage', () => {
    const product = (slug, specifications) => ({ id: slug, data: { specifications } });
    const crawler = buildProductView(product('arc-c17-crawler-roll-forming-lift', { 'Archived Height Class': '17m class', 'Archived Payload Class': '8t class', 'Archived Sheet Thickness': '0.3–1.0mm', 'Archived Power Basis': '380V-class' }));
    const truck = buildProductView(product('arc-t12-truck-mounted-roll-forming-lift', { 'Archived Height Class': '12m class', 'Archived Payload Class': '8t class', 'Archived Sheet Thickness': '0.3–1.0mm', 'Archived Power Basis': '380V-class' }));
    const ceiling = buildProductView(product('arc-f25-crawler-ceiling-platform', { 'Archived Height Class': '25m class', 'Load Basis': 'unsafe payload', 'Archived Power Basis': 'unsafe power' }));
    const rollFormer = buildProductView(product('arc-rf8-roll-forming-machine', { 'Archived Sheet Thickness': '0.3–1.0mm', 'Archived Power Basis': '380V-class' }));

    expect(crawler.orientation).toEqual({ sourceKey: 'Archived Height Class', label: 'Archived height', scope: 'Archived reference only', value: '17m class' });
    expect(truck.orientation).toEqual({ sourceKey: 'Archived Height Class', label: 'Archived height', scope: 'Archived reference only', value: '12m class' });
    expect(ceiling.orientation).toEqual({ sourceKey: 'Archived Height Class', label: 'Reference height', scope: 'Reference concept only', value: '25m class' });
    expect(rollFormer.orientation).toEqual({ sourceKey: 'Archived Sheet Thickness', label: 'Archived sheet class', scope: 'Archived reference only', value: '0.3–1.0mm' });
    for (const view of [crawler, truck, ceiling, rollFormer]) expect(JSON.stringify(view.orientation)).not.toMatch(/Payload|Power/);
    for (const view of [crawler, truck, ceiling]) expect(JSON.stringify(view.orientation)).not.toMatch(/Thickness/);
  });

  it('defines an inference boundary and an editorial disclosure for every reference', () => {
    for (const reference of PRODUCT_REFERENCES) {
      expect(reference.prohibitedInferences.length).toBeGreaterThan(0);
      expect(reference.imageRole).toBe('editorial');
      expect(reference.imageDisclosure).toBe(disclosure);
    }
  });

  it('does not silently fall back for an unknown slug or missing orientation input', () => {
    expect(getProductReference('not-a-reference')).toBeUndefined();
    expect(buildProductView({ id: 'not-a-reference', data: { specifications: {} } })).toBeUndefined();
    expect(buildProductView({ id: 'arc-c17-crawler-roll-forming-lift', data: { specifications: {} } })?.orientation.value).toBe('Not established for this reference');
  });

  it('uses authored related references before a deterministic family-order fallback', () => {
    expect(getRelatedProductSlugs('arc-c17-crawler-roll-forming-lift')).toEqual(['arc-c21-crawler-roll-forming-lift', 'arc-c25-crawler-roll-forming-lift', 'arc-c28-crawler-roll-forming-lift']);
    expect(getRelatedProductSlugs('arc-f20-crawler-ceiling-platform')).toEqual(['arc-f25-crawler-ceiling-platform', 'arc-f31-crawler-ceiling-platform', 'arc-f35-crawler-ceiling-platform']);
  });

  it('parses comparison slugs deterministically, drops invalid or duplicate entries, and caps at four', () => {
    expect(DEFAULT_COMPARE_SLUGS).toHaveLength(4);
    expect(parseCompareItems('arc-f31-crawler-ceiling-platform,not-real,arc-f20-crawler-ceiling-platform,arc-f31-crawler-ceiling-platform,arc-f25-crawler-ceiling-platform,arc-f35-crawler-ceiling-platform,arc-c17-crawler-roll-forming-lift')).toEqual(['arc-f31-crawler-ceiling-platform', 'arc-f20-crawler-ceiling-platform', 'arc-f25-crawler-ceiling-platform', 'arc-f35-crawler-ceiling-platform']);
  });

  it('reports comparison modes for zero, one, same-family, and cross-family selections', () => {
    expect(getCompareMode([])).toBe('empty');
    expect(getCompareMode(['arc-f20-crawler-ceiling-platform'])).toBe('single');
    expect(getCompareMode(['arc-f20-crawler-ceiling-platform', 'arc-f25-crawler-ceiling-platform'])).toBe('same-family');
    expect(getCompareMode(['arc-f20-crawler-ceiling-platform', 'arc-c17-crawler-roll-forming-lift'])).toBe('cross-family');
  });
});

describe('ARCLIFT family-first product selector', () => {
  it('renders the four selection families from the shared domain and retains every reference detail route', () => {
    expect(productListSource).toMatch(/PRODUCT_FAMILIES/);
    expect(productListSource).toMatch(/PRODUCT_REFERENCES/);
    expect(productListSource).toMatch(/family-card/);
    expect(productListSource).toMatch(/href=\{`\/products\/\$\{reference\.slug\}\/`\}/);
    expect(PRODUCT_REFERENCES).toHaveLength(15);
  });

  it('gives buyers project inputs and exposes the evidence boundary through visible family and reference content', () => {
    expect(productListSource).toMatch(/Prepare these inputs/);
    expect(productListSource).toMatch(/projectInputs/);
    expect(productListSource).toContain(disclosure);
    expect(productListSource).toMatch(/reference\.status/);
    expect(productListSource).toMatch(/reference\.statusNote/);
  });

  it('keeps comparison progressive and sends selected slugs to the existing compare route', () => {
    expect(productListSource).toMatch(/type="checkbox"/);
    expect(productListSource).toMatch(/data-compare-item/);
    expect(productListSource).toMatch(/\/compare\/\?items=/);
    expect(productListSource).toMatch(/Compare selected/);
  });

  it('uses an ItemList of WebPage detail links without Product or Offer structured data or unsafe card fields', () => {
    expect(productListSource).toMatch(/'@type': 'ItemList'/);
    expect(productListSource).toMatch(/'@type': 'WebPage'/);
    expect(productListSource).not.toMatch(/'@type': 'Product'/);
    expect(productListSource).not.toMatch(/'@type': 'Offer'/);
    const crawlerAndTruckCardSource = productListSource.slice(0, productListSource.indexOf('roll-forming-machines'));
    expect(crawlerAndTruckCardSource).not.toMatch(/Payload|Sheet Thickness|Power/);
  });

  it('does not place comparison controls inside detail links', () => {
    expect(productListSource).toMatch(/<a[^>]*class="detail-link"[^>]*>[\s\S]*?<\/a>\s*<label class="compare-choice">\s*<input/);
  });
});

describe('ARCLIFT buyer-decision product detail template', () => {
  it('presents shared reference status, scope, one public orientation row, and the confirmation gate', () => {
    expect(productDetailSource).toContain('productView.status');
    expect(productDetailSource).toContain('productView.statusNote');
    expect(productDetailSource).toContain('productView.scopeStatement');
    expect(productDetailSource).toMatch(/const archiveReferenceRows = \[\s*\{\s*label: productView\.orientation\.label,\s*scope: productView\.orientation\.scope,\s*value: productView\.orientation\.value \?\? productView\.statusNote,\s*\},?\s*\];/);
    expect(productDetailSource).toContain('productView.confirmationGate');
    expect(productDetailSource).toMatch(/archiveReferenceRows\.map/);
    expect(productDetailSource).not.toMatch(/Object\.entries\(\s*(?:data\.)?specifications|Object\.entries\(\s*specs/);
    expect(productDetailSource).not.toMatch(/data\.specifications/);
  });

  it('uses five visible anchor sections and keeps the authored Markdown body visible', () => {
    const sectionIds = [
      'selection-overview',
      'archive-reference',
      'project-inputs',
      'workflows-to-assess',
      'questions-and-documents',
    ];

    for (const id of sectionIds) {
      expect(productDetailSource).toContain(`href="#${id}"`);
      expect(productDetailSource).toContain(`id="${id}"`);
    }
    expect(productDetailSource).toMatch(/id="selection-overview"[\s\S]*?<Content \/>/);
    expect(productDetailSource).not.toMatch(/role="tablist"|data-tab=|class="tab-panel/);
    expect(productDetailSource).not.toMatch(/querySelectorAll\(['"]\.tab['"]\)/);
  });

  it('renders family-specific project inputs and workflows from the shared family mapping', () => {
    expect(productDetailSource).toMatch(/productView\.family\.projectInputs\.map/);
    expect(productDetailSource).toMatch(/productView\.family\.workflowsToAssess\.map/);
    expect(productDetailSource).toContain('Workflows to assess');
    expect(productDetailSource).not.toContain('Typical applications');
  });

  it('uses available-reference-document wording and the shared authored related order', () => {
    expect(productDetailSource).toContain('Request available reference documents');
    expect(productDetailSource).toMatch(/productView\.family\.requiredDocuments\.map/);
    expect(productDetailSource).toContain('getRelatedProductSlugs(product.id, data.relatedProducts)');
    expect(productDetailSource).toMatch(/related-card__disclosure/);
  });

  it('limits top-level structured data to WebPage, FAQPage, and BreadcrumbList', () => {
    expect(productDetailSource).toMatch(/'@type': 'WebPage'/);
    expect(productDetailSource).toMatch(/'@type': 'FAQPage'/);
    expect(productDetailSource).toMatch(/'@type': 'BreadcrumbList'/);
    expect(productDetailSource).not.toMatch(/'@type': 'Product'/);
    expect(productDetailSource).not.toMatch(/'@type': 'Offer'/);
  });
});

describe('ARCLIFT evidence-safe comparison page', () => {
  const buildCompareView = productSelectionDomain.buildCompareView;
  const renderCompareRegion = productSelectionDomain.renderCompareRegion;
  const renderCompareQuery = productSelectionDomain.renderCompareQuery;
  const product = (slug, orientationValue) => ({
    id: slug,
    data: { specifications: { 'Archived Height Class': orientationValue } },
  });

  it('derives the four-reference default from one explicit shared source', () => {
    expect(PRODUCT_REFERENCES.some(reference => Object.hasOwn(reference, 'defaultCompare'))).toBe(false);
    expect(DEFAULT_COMPARE_SLUGS).toEqual([
      'arc-c25-crawler-roll-forming-lift',
      'arc-t25-truck-mounted-roll-forming-lift',
      'arc-f20-crawler-ceiling-platform',
      'arc-rf8-roll-forming-machine',
    ]);
  });

  it('builds a comparison-only public view model without internal or legacy fields', () => {
    expect(buildCompareView).toBeTypeOf('function');
    const view = buildCompareView?.(product('arc-f20-crawler-ceiling-platform', 'Archived reference – 20m class'));

    expect(view).toMatchObject({
      slug: 'arc-f20-crawler-ceiling-platform',
      model: 'ARC-F20',
      familyId: 'crawler-ceiling-platforms',
      familyName: 'Crawler Ceiling Platforms',
      status: 'Archived reference',
      statusNote: 'Project-specific confirmation required',
      scopeStatement: 'This is an archived reference configuration for early project discussions.',
      buyerQuestion: 'What project data is needed before configuration review?',
      orientation: {
        label: 'Reference height',
        scope: 'Reference concept only',
        value: 'Archived reference – 20m class',
      },
      confirmationGate: 'Signed technical schedule, approved drawings and approved load chart',
    });
    expect(JSON.stringify(view)).not.toMatch(/sourceKey|specifications|Payload|Power|Machine Weight/);
  });

  it('renders a complete same-family table with semantic headers and direct reference links', () => {
    expect(renderCompareRegion).toBeTypeOf('function');
    const views = [
      buildCompareView?.(product('arc-f20-crawler-ceiling-platform', 'Archived reference – 20m class')),
      buildCompareView?.(product('arc-f25-crawler-ceiling-platform', 'Archived reference – 25m class')),
      buildCompareView?.(product('arc-f31-crawler-ceiling-platform', 'Archived reference – 31m class')),
      buildCompareView?.(product('arc-f35-crawler-ceiling-platform', 'Archived reference – 35m class')),
    ].filter(Boolean);
    const html = renderCompareRegion?.(views) ?? '';

    expect(html).toContain('<caption>Archived references and project-review boundaries</caption>');
    expect(html).toMatch(/<th scope="col">Review field<\/th>/);
    expect(html).toMatch(/<th scope="row"[^>]*>Family<\/th>/);
    expect(html).toContain('data-compare-field="orientation"');
    expect(html).toContain('Reference height');
    for (const slug of ['arc-f20-crawler-ceiling-platform', 'arc-f25-crawler-ceiling-platform', 'arc-f31-crawler-ceiling-platform', 'arc-f35-crawler-ceiling-platform']) {
      expect(html).toContain(`href="/products/${slug}/"`);
    }
    expect(html).not.toMatch(/<(?:td|th)[^>]*>\s*<\/(?:td|th)>/);
    expect(html).not.toMatch(/Max Working Height|Safe Working Load|Platform Extension|Machine Weight|Diesel Engine|Electric Motor|Gradeability|Travel Speed|Min Ground Clearance/);
  });

  it('omits orientation across families and explains why without ranking performance', () => {
    const views = [
      buildCompareView?.(product('arc-c17-crawler-roll-forming-lift', 'Archived reference – 17m class')),
      buildCompareView?.(product('arc-f20-crawler-ceiling-platform', 'Archived reference – 20m class')),
    ].filter(Boolean);
    const html = renderCompareRegion?.(views) ?? '';

    expect(getCompareMode(views.map(view => view.slug))).toBe('cross-family');
    expect(html).not.toContain('data-compare-field="orientation"');
    expect(html).toContain('Orientation is omitted for cross-family comparisons');
    expect(html).not.toMatch(/\b(?:best|better|higher|lower|top-performing|performance rank)\b/i);
    for (const view of views) expect(html).toContain(`href="/products/${view.slug}/"`);
  });

  it('keeps one selected reference visible and asks the buyer to add another', () => {
    const view = buildCompareView?.(product('arc-f20-crawler-ceiling-platform', 'Archived reference – 20m class'));
    const html = renderCompareRegion?.(view ? [view] : []) ?? '';

    expect(html).toContain('href="/products/arc-f20-crawler-ceiling-platform/"');
    expect(html).toContain('Add at least one more reference');
    expect(html).toContain('data-compare-field="orientation"');
    expect(html).not.toMatch(/<(?:td|th)[^>]*>\s*<\/(?:td|th)>/);
  });

  it('uses the shared parser for invalid, duplicate, empty, and over-limit query selections', () => {
    expect(parseCompareItems(null)).toEqual([]);
    expect(parseCompareItems('not-real,not-real')).toEqual([]);
    expect(parseCompareItems([
      'arc-c17-crawler-roll-forming-lift',
      'arc-c17-crawler-roll-forming-lift',
      'arc-t12-truck-mounted-roll-forming-lift',
      'not-real',
      'arc-f20-crawler-ceiling-platform',
      'arc-rf8-roll-forming-machine',
      'arc-f25-crawler-ceiling-platform',
    ].join(','))).toEqual([
      'arc-c17-crawler-roll-forming-lift',
      'arc-t12-truck-mounted-roll-forming-lift',
      'arc-f20-crawler-ceiling-platform',
      'arc-rf8-roll-forming-machine',
    ]);
  });

  it('declares static progressive enhancement, canonical metadata, and no unsupported schema', async () => {
    const comparePageSource = await readFile(new URL('../src/pages/compare.astro', import.meta.url), 'utf8');
    const seoHeadSource = await readFile(new URL('../src/components/SEOHead.astro', import.meta.url), 'utf8');

    expect(comparePageSource).toMatch(/canonical="https:\/\/www\.arclifteq\.com\/compare\/"/);
    expect(comparePageSource).toMatch(/noindex=\{true\}/);
    expect(comparePageSource).toMatch(/data-compare-region/);
    expect(comparePageSource).toMatch(/URLSearchParams/);
    expect(comparePageSource).toMatch(/renderCompareQuery/);
    expect(comparePageSource).not.toMatch(/'@type':\s*['"](?:Product|Offer)['"]/);
    expect(seoHeadSource).toContain("'noindex,follow'");
    expect(seoHeadSource).toContain("'noindex,nofollow'");
  });

  it('keeps the static default for empty or invalid-only queries and enhances one to four valid selections', () => {
    expect(renderCompareQuery).toBeTypeOf('function');
    const views = [
      buildCompareView?.(product('arc-f20-crawler-ceiling-platform', 'Archived reference – 20m class')),
      buildCompareView?.(product('arc-f25-crawler-ceiling-platform', 'Archived reference – 25m class')),
      buildCompareView?.(product('arc-f31-crawler-ceiling-platform', 'Archived reference – 31m class')),
      buildCompareView?.(product('arc-f35-crawler-ceiling-platform', 'Archived reference – 35m class')),
      buildCompareView?.(product('arc-c17-crawler-roll-forming-lift', 'Archived reference – 17m class')),
    ].filter(Boolean);

    expect(renderCompareQuery?.(null, views)).toBeUndefined();
    expect(renderCompareQuery?.('', views)).toBeUndefined();
    expect(renderCompareQuery?.('not-real,also-not-real', views)).toBeUndefined();

    const one = renderCompareQuery?.('not-real,arc-f20-crawler-ceiling-platform', views);
    expect(one).toContain('href="/products/arc-f20-crawler-ceiling-platform/"');
    expect(one).toContain('Add at least one more reference');

    const capped = renderCompareQuery?.(views.map(view => view.slug).join(','), views);
    expect(capped).toContain('href="/products/arc-f20-crawler-ceiling-platform/"');
    expect(capped).toContain('href="/products/arc-f35-crawler-ceiling-platform/"');
    expect(capped).not.toContain('href="/products/arc-c17-crawler-roll-forming-lift/"');
  });

  it('keeps browser comparison code isolated from the full product-selection domain', async () => {
    const comparePageSource = await readFile(new URL('../src/pages/compare.astro', import.meta.url), 'utf8');
    const browserSafeSource = await readFile(new URL('../src/lib/product-compare.ts', import.meta.url), 'utf8').catch(() => '');

    expect(comparePageSource).toMatch(/<script>[\s\S]*?from '\.\.\/lib\/product-compare'/);
    expect(comparePageSource).not.toMatch(/<script>[\s\S]*?from '\.\.\/lib\/product-selection'/);
    expect(browserSafeSource).toContain('export function renderCompareQuery');
    expect(browserSafeSource).not.toMatch(/from ['"].*product-selection|PRODUCT_REFERENCES|PRODUCT_FAMILIES|sourceKey|prohibitedInferences|editorialImages|\/images\//);
  });

  it('opts compare into follow without changing the shared 404 noindex default', async () => {
    const comparePageSource = await readFile(new URL('../src/pages/compare.astro', import.meta.url), 'utf8');
    const baseLayoutSource = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
    const seoHeadSource = await readFile(new URL('../src/components/SEOHead.astro', import.meta.url), 'utf8');
    const notFoundSource = await readFile(new URL('../src/pages/404.astro', import.meta.url), 'utf8');

    expect(comparePageSource).toMatch(/follow=\{true\}/);
    expect(baseLayoutSource).toMatch(/follow\?: boolean/);
    expect(baseLayoutSource).toMatch(/follow=\{follow\}/);
    expect(seoHeadSource).toMatch(/follow\?: boolean/);
    expect(seoHeadSource).toContain("'noindex,follow'");
    expect(seoHeadSource).toContain("'noindex,nofollow'");
    expect(notFoundSource).not.toMatch(/follow=\{true\}/);
  });
});
