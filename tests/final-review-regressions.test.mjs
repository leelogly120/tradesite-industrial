import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import {
  DEFAULT_COMPARE_SLUGS,
  buildCompareView,
  buildProductView,
  getRelatedProductSlugs,
  renderCompareQuery,
  renderCompareRegion,
} from '../src/lib/product-selection';

const disclosure = 'Editorial planning visual — not model-specific evidence';
const product = (id, specifications = {}) => ({ id, data: { specifications } });

describe('final ARCLIFT review regressions', () => {
  it('uses one stable reference per family as its cross-family default', () => {
    expect(DEFAULT_COMPARE_SLUGS).toEqual([
      'arc-c25-crawler-roll-forming-lift',
      'arc-t25-truck-mounted-roll-forming-lift',
      'arc-f20-crawler-ceiling-platform',
      'arc-rf8-roll-forming-machine',
    ]);
  });

  it('uses the exact safe orientation fallback in detail and comparison views', () => {
    const view = buildProductView(product('arc-c25-crawler-roll-forming-lift'));
    expect(view?.orientation.value).toBe('Not established for this reference');
    const compare = buildCompareView(product('arc-c25-crawler-roll-forming-lift'));
    expect(renderCompareRegion(compare ? [compare] : [])).toContain('Not established for this reference');
  });

  it('carries safe project inputs, required documents, and editorial role into the browser comparison view', () => {
    const view = buildCompareView(product('arc-f20-crawler-ceiling-platform', { 'Archived Height Class': '20m class' }));
    expect(view).toMatchObject({
      primaryProjectInputs: ['Ceiling geometry and work zones', 'Floor bearing and access route', 'Crew, tool and material workflow'],
      requiredDocuments: ['Signed technical schedule', 'Approved drawings', 'Project-specific compliance review'],
      imageRole: 'Editorial planning visual',
      imageDisclosure: disclosure,
    });
    const html = renderCompareRegion(view ? [view] : []);
    expect(html).toContain('data-compare-field="primary-project-inputs"');
    expect(html).toContain('data-compare-field="required-documents"');
    expect(html).toContain('data-compare-field="editorial-visual-role"');
  });

  it('visibly explains that only the first four valid query references are shown', () => {
    const views = [
      buildCompareView(product('arc-c17-crawler-roll-forming-lift', { 'Archived Height Class': '17m class' })),
      buildCompareView(product('arc-t12-truck-mounted-roll-forming-lift', { 'Archived Height Class': '12m class' })),
      buildCompareView(product('arc-f20-crawler-ceiling-platform', { 'Archived Height Class': '20m class' })),
      buildCompareView(product('arc-rf8-roll-forming-machine', { 'Archived Sheet Thickness': '0.3鈥?.0mm' })),
      buildCompareView(product('arc-f25-crawler-ceiling-platform', { 'Archived Height Class': '25m class' })),
    ].filter(Boolean);
    expect(renderCompareQuery(views.map(view => view.slug).join(','), views)).toContain('Only the first four valid references are shown.');
  });

  it('takes related references from authored frontmatter order and uses a family-only fallback when none are valid', () => {
    expect(getRelatedProductSlugs('arc-c17-crawler-roll-forming-lift', [
      'arc-rf8-roll-forming-machine',
      'arc-c17-crawler-roll-forming-lift',
      'not-real',
      'arc-rf8-roll-forming-machine',
      'arc-c21-crawler-roll-forming-lift',
    ])).toEqual(['arc-rf8-roll-forming-machine', 'arc-c21-crawler-roll-forming-lift']);
    expect(getRelatedProductSlugs('arc-c17-crawler-roll-forming-lift', [])).toEqual([
      'arc-c21-crawler-roll-forming-lift',
      'arc-c25-crawler-roll-forming-lift',
      'arc-c28-crawler-roll-forming-lift',
    ]);
  });

  it('uses shared card views, frontmatter-related links, adjacent disclosures, and only one main landmark', async () => {
    const [list, detail] = await Promise.all([
      readFile(new URL('../src/pages/products/index.astro', import.meta.url), 'utf8'),
      readFile(new URL('../src/pages/products/[slug].astro', import.meta.url), 'utf8'),
    ]);
    expect(list).toMatch(/buildProductView\(product\)/);
    expect(list).toMatch(/reference-card__visual/);
    expect(list).toMatch(/reference-card__disclosure/);
    expect(list).toMatch(/reference\.orientation\.value/);
    expect(list).toMatch(/reference\.confirmationGate/);
    expect(detail).toMatch(/getRelatedProductSlugs\(product\.id, data\.relatedProducts\)/);
    expect(detail).toMatch(/related-card__disclosure/);
    expect(detail).not.toMatch(/<main class="decision-page">/);
  });
});
