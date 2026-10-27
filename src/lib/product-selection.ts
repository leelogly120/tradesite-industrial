import { parseCompareItems as parseBrowserCompareItems } from './product-compare';
import type { CompareView } from './product-compare';

export { renderCompareQuery, renderCompareRegion } from './product-compare';
export type { CompareView } from './product-compare';

export type ProductFamily = {
  id: string;
  category: string;
  name: string;
  shortName: string;
  anchor: string;
  workflow: string;
  projectInputs: readonly string[];
  workflowsToAssess: readonly string[];
  requiredDocuments: readonly string[];
  editorialImage: string;
  editorialAlt: string;
  order: number;
  models: readonly string[];
};

type Orientation = {
  sourceKey: string;
  label: string;
  scope: string;
};

export type CatalogSpecRow = {
  field: string;
  value: string;
  notes: string;
};

export type ProductReference = {
  slug: string;
  model: string;
  familyId: ProductFamily['id'];
  status: string;
  statusNote: string;
  scopeStatement: string;
  buyerQuestion: string;
  orientation: Orientation;
  confirmationGate: string;
  prohibitedInferences: readonly string[];
  imageRole: 'editorial';
  imageDisclosure: string;
  editorialImages: readonly string[];
  authoredRelatedSlugs: readonly string[];
  headline?: string;
  catalogSpecs?: readonly CatalogSpecRow[];
};

type ProductLike = {
  id: string;
  data?: { specifications?: Record<string, unknown> };
};

const IMAGE_DISCLOSURE = 'Editorial planning visual — not model-specific evidence';
const ORIENTATION_FALLBACK = 'Not established for this reference';
const CONFIRMATION_GATE = 'Signed technical schedule, approved drawings and approved load chart';
const COMMON_INFERENCES = [
  'Current-model performance',
  'Project suitability without review',
  'Procurement authorization without signed documents',
] as const;

export const PRODUCT_FAMILIES = [
  {
    id: 'crawler-roll-forming-lifts',
    category: 'Crawler Roll Forming Lifts',
    name: 'Crawler Roll Forming Lifts',
    shortName: 'Crawler lifts',
    anchor: 'crawler-roll-forming-lifts',
    workflow: 'Raise a reviewed roll-forming workflow toward the installation elevation.',
    projectInputs: ['Work zones and roof geometry', 'Panel profile and forming-line data', 'Access route and support conditions'],
    workflowsToAssess: ['Support reactions and travel route', 'Forming-line interface and material path', 'Weather and rescue planning'],
    requiredDocuments: ['Signed technical schedule', 'Approved drawings', 'Approved load chart'],
    editorialImage: '/images/hero/hero-2.webp',
    editorialAlt: 'Editorial roof-level panel-forming workflow in an industrial building',
    order: 0,
    models: ['ARC-C17', 'ARC-C21', 'ARC-C25', 'ARC-C28', 'ARC-C32'],
  },
  {
    id: 'truck-mounted-roll-forming-lifts',
    category: 'Truck-Mounted Roll Forming Lifts',
    name: 'Truck-Mounted Roll Forming Lifts',
    shortName: 'Truck-mounted lifts',
    anchor: 'truck-mounted-roll-forming-lifts',
    workflow: 'Review the equipment module, destination chassis, road route and site setup together.',
    projectInputs: ['Destination chassis and axle data', 'Road-route and registration constraints', 'Work zones and setup geometry'],
    workflowsToAssess: ['Vehicle and chassis interface', 'Route, permits and site entry', 'Packing and handling route where applicable'],
    requiredDocuments: ['Signed technical schedule', 'Approved drawings', 'Approved chassis interface schedule'],
    editorialImage: '/images/editorial/truck-site-roll-forming-lift.webp',
    editorialAlt: 'Editorial truck-mounted equipment arrangement at a project site',
    order: 1,
    models: ['ARC-T12', 'ARC-T18', 'ARC-T25', 'ARC-T25HQ', 'ARC-T31'],
  },
  {
    id: 'crawler-ceiling-platforms',
    category: 'Crawler Ceiling Platforms',
    name: 'Crawler Ceiling Platforms',
    shortName: 'Ceiling platforms',
    anchor: 'crawler-ceiling-platforms',
    workflow: 'Assess under-ceiling or wall-panel access as a project-specific platform concept.',
    projectInputs: ['Ceiling geometry and work zones', 'Floor bearing and access route', 'Crew, tool and material workflow'],
    workflowsToAssess: ['Platform envelope and clearance', 'Floor loading and travel route', 'Local documentation and rescue planning'],
    requiredDocuments: ['Signed technical schedule', 'Approved drawings', 'Project-specific compliance review'],
    editorialImage: '/images/editorial/large-deck-steel-structure.webp',
    editorialAlt: 'Editorial large-deck platform arrangement in a steel structure',
    order: 2,
    models: ['ARC-F20', 'ARC-F25', 'ARC-F31', 'ARC-F35'],
  },
  {
    id: 'roll-forming-machines',
    category: 'Roll Forming Machines',
    name: 'Roll Forming Machines',
    shortName: 'Roll formers',
    anchor: 'roll-forming-machines',
    workflow: 'Match a profile-specific line to approved drawings and a reviewed material path.',
    projectInputs: ['Approved panel profile', 'Material and tooling requirements', 'Selected lift-platform interface'],
    workflowsToAssess: ['Profile and tooling interface', 'Material feed and run-out path', 'Power and controls for the destination'],
    requiredDocuments: ['Signed technical schedule', 'Approved profile drawings', 'Approved interface list'],
    editorialImage: '/images/editorial/roll-forming-input-map.svg',
    editorialAlt: 'Editorial roll-forming project input diagram',
    order: 3,
    models: ['ARC-RF8'],
  },
] as const satisfies readonly ProductFamily[];

const crawlers = ['arc-c17-crawler-roll-forming-lift', 'arc-c21-crawler-roll-forming-lift', 'arc-c25-crawler-roll-forming-lift', 'arc-c28-crawler-roll-forming-lift', 'arc-c32-crawler-roll-forming-lift'];
const trucks = ['arc-t12-truck-mounted-roll-forming-lift', 'arc-t18-truck-mounted-roll-forming-lift', 'arc-t25-truck-mounted-roll-forming-lift', 'arc-t25hq-truck-mounted-roll-forming-lift-40hq', 'arc-t31-truck-mounted-roll-forming-lift'];
const ceilings = ['arc-f20-crawler-ceiling-platform', 'arc-f25-crawler-ceiling-platform', 'arc-f31-crawler-ceiling-platform', 'arc-f35-crawler-ceiling-platform'];

const catalogHeight: Orientation = { sourceKey: 'Archived Height Class', label: 'Catalog height class', scope: 'Catalog reference — confirm on RFQ' };
const catalogSheet: Orientation = { sourceKey: 'Archived Sheet Thickness', label: 'Catalog sheet class', scope: 'Catalog reference — confirm on RFQ' };

const loadTransportNotes = 'Depends on the approved load chart, fold state, and destination packing';
const chassisNotes = 'State whether the chassis or carrier is included, local, or unsure';

function catalogLiftSpecs(height: string, base: string): readonly CatalogSpecRow[] {
  return [
    { field: 'Height class', value: height, notes: 'Published catalog height class on this site' },
    { field: 'Platform / machine load', value: 'Confirm on RFQ', notes: 'Depends on former mass, options, and the approved load chart' },
    { field: 'Transport size', value: 'Confirm on RFQ', notes: loadTransportNotes },
    { field: 'Chassis included', value: 'Confirm on RFQ', notes: chassisNotes },
    { field: 'Base type', value: base, notes: 'Road rules, ground bearing, and registration are destination-specific' },
  ];
}

function reference(
  slug: string,
  model: string,
  familyId: ProductFamily['id'],
  orientation: Orientation,
  authoredRelatedSlugs: readonly string[],
  options: Partial<Pick<ProductReference, 'status' | 'statusNote' | 'scopeStatement' | 'buyerQuestion' | 'confirmationGate' | 'editorialImages' | 'headline' | 'catalogSpecs'>> = {},
): ProductReference {
  return {
    slug,
    model,
    familyId,
    status: options.status ?? 'Catalog model',
    statusNote: options.statusNote ?? 'Catalog reference — confirm on RFQ',
    scopeStatement: options.scopeStatement ?? 'This catalog model is a selection reference for RFQ. Platform load, transport size, and chassis inclusion are confirmed on RFQ.',
    headline: options.headline,
    catalogSpecs: options.catalogSpecs,
    buyerQuestion: options.buyerQuestion ?? 'What project data is needed before configuration review?',
    orientation,
    confirmationGate: options.confirmationGate ?? CONFIRMATION_GATE,
    prohibitedInferences: COMMON_INFERENCES,
    imageRole: 'editorial',
    imageDisclosure: IMAGE_DISCLOSURE,
    editorialImages: options.editorialImages ?? [],
    authoredRelatedSlugs,
  };
}

export const PRODUCT_REFERENCES = [
  reference(crawlers[0], 'ARC-C17', 'crawler-roll-forming-lifts', catalogHeight, [crawlers[1], crawlers[2], 'arc-rf8-roll-forming-machine']),
  reference(crawlers[1], 'ARC-C21', 'crawler-roll-forming-lifts', catalogHeight, [crawlers[0], crawlers[2], 'arc-rf8-roll-forming-machine']),
  reference(crawlers[2], 'ARC-C25', 'crawler-roll-forming-lifts', catalogHeight, [crawlers[1], crawlers[3], 'arc-rf8-roll-forming-machine'], {
    headline: 'ARC-C25 crawler roof panel roll former lift — 25m class',
    catalogSpecs: catalogLiftSpecs('25m', 'Crawler'),
  }),
  reference(crawlers[3], 'ARC-C28', 'crawler-roll-forming-lifts', catalogHeight, [crawlers[2], crawlers[4], 'arc-rf8-roll-forming-machine']),
  reference(crawlers[4], 'ARC-C32', 'crawler-roll-forming-lifts', catalogHeight, [crawlers[3], crawlers[2], 'arc-rf8-roll-forming-machine']),
  reference(trucks[0], 'ARC-T12', 'truck-mounted-roll-forming-lifts', catalogHeight, [trucks[1], trucks[2], 'arc-rf8-roll-forming-machine']),
  reference(trucks[1], 'ARC-T18', 'truck-mounted-roll-forming-lifts', catalogHeight, [trucks[0], trucks[2], 'arc-rf8-roll-forming-machine'], {
    headline: 'ARC-T18 vehicle-mounted roof panel roll former lift — 18.5m class',
    catalogSpecs: catalogLiftSpecs('18.5m', 'Truck-mounted'),
  }),
  reference(trucks[2], 'ARC-T25', 'truck-mounted-roll-forming-lifts', catalogHeight, [trucks[1], trucks[4], trucks[3]], {
    headline: 'ARC-T25 vehicle-mounted roof panel roll former lift — 25m class',
    catalogSpecs: catalogLiftSpecs('25m', 'Truck-mounted'),
  }),
  reference(trucks[3], 'ARC-T25HQ', 'truck-mounted-roll-forming-lifts', catalogHeight, [trucks[2], trucks[4], 'arc-rf8-roll-forming-machine'], {
    status: 'Catalog model — packing route',
    statusNote: '40HQ packing route — confirm on RFQ',
    scopeStatement: 'A catalog model for 40HQ packing-route discussion. Packing confirmation remains project-specific.',
    confirmationGate: 'Signed technical schedule, approved drawings, approved load chart and approved packing plan',
  }),
  reference(trucks[4], 'ARC-T31', 'truck-mounted-roll-forming-lifts', catalogHeight, [trucks[1], trucks[2], trucks[3]]),
  reference(ceilings[0], 'ARC-F20', 'crawler-ceiling-platforms', catalogHeight, []),
  reference(ceilings[1], 'ARC-F25', 'crawler-ceiling-platforms', catalogHeight, [], {
    headline: 'ARC-F25 crawler large-deck ceiling work platform — 25m class',
    catalogSpecs: [
      { field: 'Height class', value: '25m', notes: 'Published catalog height class on this site' },
      { field: 'Deck / platform load', value: 'Confirm on RFQ', notes: 'Crew, tools, and material loads against the approved load chart' },
      { field: 'Transport size', value: 'Confirm on RFQ', notes: 'Building entry, doors, ramps, and packing basis' },
      { field: 'Chassis included', value: 'Confirm on RFQ', notes: chassisNotes },
      { field: 'Base type', value: 'Crawler large-deck', notes: 'Floor bearing and indoor route are reviewed per site' },
    ],
  }),
  reference(ceilings[2], 'ARC-F31', 'crawler-ceiling-platforms', catalogHeight, []),
  reference(ceilings[3], 'ARC-F35', 'crawler-ceiling-platforms', catalogHeight, []),
  reference('arc-rf8-roll-forming-machine', 'ARC-RF8', 'roll-forming-machines', catalogSheet, [crawlers[0], crawlers[2], trucks[2]], {
    headline: 'ARC-RF8 roof panel and standing-seam roll forming line',
    catalogSpecs: [
      { field: 'Sheet thickness class', value: '0.3–1.0mm', notes: 'Catalog reference — feasibility depends on profile, grade, and coating' },
      { field: 'Machine mass / mounting', value: 'Confirm on RFQ', notes: 'Required for the lift load chart and interface' },
      { field: 'Transport size', value: 'Confirm on RFQ', notes: 'Line footprint, run-out, and packing basis' },
      { field: 'Chassis included', value: 'N/A — machine module', notes: 'Lift chassis is covered on the ARC-T and ARC-C models' },
      { field: 'Base type', value: 'Roll forming line', notes: 'Specify with the matching lift platform' },
    ],
  }),
] as const satisfies readonly ProductReference[];

export const DEFAULT_COMPARE_SLUGS = [
  crawlers[2],
  trucks[2],
  ceilings[0],
  'arc-rf8-roll-forming-machine',
] as const;

const familiesById = new Map(PRODUCT_FAMILIES.map(family => [family.id, family]));
const referencesBySlug = new Map(PRODUCT_REFERENCES.map(item => [item.slug, item]));

export function getProductReference(slug: string | undefined | null): ProductReference | undefined {
  return slug ? referencesBySlug.get(slug.replace(/\.md$/, '')) : undefined;
}

export function getRelatedProductSlugs(
  slug: string | undefined | null,
  authoredRelatedSlugs: readonly string[] = [],
  limit = 3,
): string[] {
  const item = getProductReference(slug);
  if (!item) return [];
  const seen = new Set<string>();
  const authored = authoredRelatedSlugs.filter(candidate => {
    if (candidate === item.slug || seen.has(candidate) || !referencesBySlug.has(candidate)) return false;
    seen.add(candidate);
    return true;
  });
  if (authored.length) return authored.slice(0, limit);
  return PRODUCT_REFERENCES
    .filter(candidate => candidate.familyId === item.familyId && candidate.slug !== item.slug)
    .map(candidate => candidate.slug)
    .slice(0, limit);
}

export function buildProductView(product: ProductLike) {
  const reference = getProductReference(product.id);
  if (!reference) return undefined;
  const family = familiesById.get(reference.familyId);
  if (!family) return undefined;
  const rawValue = product.data?.specifications?.[reference.orientation.sourceKey];
  const value = typeof rawValue === 'string' && rawValue.trim() ? rawValue : ORIENTATION_FALLBACK;
  return {
    ...reference,
    family,
    orientation: { ...reference.orientation, value },
    relatedSlugs: getRelatedProductSlugs(reference.slug),
  };
}

export function buildCompareView(product: ProductLike): CompareView | undefined {
  const view = buildProductView(product);
  if (!view) return undefined;

  return {
    slug: view.slug,
    model: view.model,
    familyId: view.familyId,
    familyName: view.family.name,
    status: view.status,
    statusNote: view.statusNote,
    scopeStatement: view.scopeStatement,
    buyerQuestion: view.buyerQuestion,
    orientation: {
      label: view.orientation.label,
      scope: view.orientation.scope,
      value: view.orientation.value,
    },
    confirmationGate: view.confirmationGate,
    primaryProjectInputs: view.family.projectInputs,
    requiredDocuments: view.family.requiredDocuments,
    imageRole: 'Editorial planning visual',
    imageDisclosure: view.imageDisclosure,
  };
}

export function parseCompareItems(input: string | undefined | null): string[] {
  return parseBrowserCompareItems(input, PRODUCT_REFERENCES);
}

export function getCompareMode(slugs: readonly string[]): 'empty' | 'single' | 'same-family' | 'cross-family' {
  const references = slugs.map(getProductReference).filter((reference): reference is ProductReference => Boolean(reference));
  if (references.length === 0) return 'empty';
  if (references.length === 1) return 'single';
  return new Set(references.map(reference => reference.familyId)).size === 1 ? 'same-family' : 'cross-family';
}
