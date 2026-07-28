import { describe, expect, it } from 'vitest';
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

const disclosure = 'Representative editorial image — not model-specific evidence. Final configuration requires the signed technical schedule and approved drawings.';

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

describe('ARCLIFT evidence-safe product selection domain', () => {
  it('has four stable families and fifteen explicit reference mappings', () => {
    expect(PRODUCT_FAMILIES.map(({ id, models }) => [id, models])).toEqual(expectedFamilies);
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
    expect(buildProductView({ id: 'arc-c17-crawler-roll-forming-lift', data: { specifications: {} } })?.orientation.value).toBeUndefined();
  });

  it('uses authored related references before a deterministic family-order fallback', () => {
    expect(getRelatedProductSlugs('arc-c17-crawler-roll-forming-lift')).toEqual(['arc-c21-crawler-roll-forming-lift', 'arc-c25-crawler-roll-forming-lift', 'arc-rf8-roll-forming-machine']);
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
