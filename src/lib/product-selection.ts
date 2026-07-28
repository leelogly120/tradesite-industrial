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
};

type ProductLike = {
  id: string;
  data?: { specifications?: Record<string, unknown> };
};

const IMAGE_DISCLOSURE = 'Editorial planning visual — not model-specific evidence';
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

const archivedHeight: Orientation = { sourceKey: 'Archived Height Class', label: 'Archived height', scope: 'Archived reference only' };
const referenceHeight: Orientation = { sourceKey: 'Archived Height Class', label: 'Reference height', scope: 'Reference concept only' };
const archivedSheet: Orientation = { sourceKey: 'Archived Sheet Thickness', label: 'Archived sheet class', scope: 'Archived reference only' };

function reference(
  slug: string,
  model: string,
  familyId: ProductFamily['id'],
  orientation: Orientation,
  authoredRelatedSlugs: readonly string[],
  options: Partial<Pick<ProductReference, 'status' | 'statusNote' | 'scopeStatement' | 'buyerQuestion' | 'confirmationGate' | 'editorialImages'>> = {},
): ProductReference {
  return {
    slug,
    model,
    familyId,
    status: options.status ?? 'Archived reference',
    statusNote: options.statusNote ?? 'Project-specific confirmation required',
    scopeStatement: options.scopeStatement ?? 'This is an archived reference configuration for early project discussions.',
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
  reference(crawlers[0], 'ARC-C17', 'crawler-roll-forming-lifts', archivedHeight, [crawlers[1], crawlers[2], 'arc-rf8-roll-forming-machine']),
  reference(crawlers[1], 'ARC-C21', 'crawler-roll-forming-lifts', archivedHeight, [crawlers[0], crawlers[2], 'arc-rf8-roll-forming-machine']),
  reference(crawlers[2], 'ARC-C25', 'crawler-roll-forming-lifts', archivedHeight, [crawlers[1], crawlers[3], 'arc-rf8-roll-forming-machine']),
  reference(crawlers[3], 'ARC-C28', 'crawler-roll-forming-lifts', archivedHeight, [crawlers[2], crawlers[4], 'arc-rf8-roll-forming-machine']),
  reference(crawlers[4], 'ARC-C32', 'crawler-roll-forming-lifts', archivedHeight, [crawlers[3], crawlers[2], 'arc-rf8-roll-forming-machine']),
  reference(trucks[0], 'ARC-T12', 'truck-mounted-roll-forming-lifts', archivedHeight, [trucks[1], trucks[2], 'arc-rf8-roll-forming-machine']),
  reference(trucks[1], 'ARC-T18', 'truck-mounted-roll-forming-lifts', archivedHeight, [trucks[0], trucks[2], 'arc-rf8-roll-forming-machine']),
  reference(trucks[2], 'ARC-T25', 'truck-mounted-roll-forming-lifts', archivedHeight, [trucks[1], trucks[4], trucks[3]]),
  reference(trucks[3], 'ARC-T25HQ', 'truck-mounted-roll-forming-lifts', archivedHeight, [trucks[2], trucks[4], 'arc-rf8-roll-forming-machine'], {
    status: 'Planning route', statusNote: '40HQ planning route only', scopeStatement: 'A transport-oriented archived reference for early 40HQ route planning.',
    confirmationGate: 'Signed technical schedule, approved drawings, approved load chart and approved packing plan',
  }),
  reference(trucks[4], 'ARC-T31', 'truck-mounted-roll-forming-lifts', archivedHeight, [trucks[1], trucks[2], trucks[3]]),
  reference(ceilings[0], 'ARC-F20', 'crawler-ceiling-platforms', referenceHeight, []),
  reference(ceilings[1], 'ARC-F25', 'crawler-ceiling-platforms', referenceHeight, [], { status: 'Reference concept', statusNote: 'Model-specific engineering required' }),
  reference(ceilings[2], 'ARC-F31', 'crawler-ceiling-platforms', referenceHeight, [], { status: 'Reference concept', statusNote: 'Model-specific engineering required' }),
  reference(ceilings[3], 'ARC-F35', 'crawler-ceiling-platforms', referenceHeight, [], { status: 'Reference concept', statusNote: 'Model-specific engineering required' }),
  reference('arc-rf8-roll-forming-machine', 'ARC-RF8', 'roll-forming-machines', archivedSheet, [crawlers[0], crawlers[2], trucks[2]]),
] as const satisfies readonly ProductReference[];

export const DEFAULT_COMPARE_SLUGS = ceilings;

const familiesById = new Map(PRODUCT_FAMILIES.map(family => [family.id, family]));
const referencesBySlug = new Map(PRODUCT_REFERENCES.map(item => [item.slug, item]));

export function getProductReference(slug: string | undefined | null): ProductReference | undefined {
  return slug ? referencesBySlug.get(slug.replace(/\.md$/, '')) : undefined;
}

export function getRelatedProductSlugs(slug: string | undefined | null, limit = 3): string[] {
  const item = getProductReference(slug);
  if (!item) return [];
  const authored = item.authoredRelatedSlugs.filter(candidate => candidate !== item.slug && referencesBySlug.has(candidate));
  if (authored.length) return [...authored].slice(0, limit);
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
  const value = typeof rawValue === 'string' ? rawValue : undefined;
  return {
    ...reference,
    family,
    orientation: { ...reference.orientation, value },
    relatedSlugs: getRelatedProductSlugs(reference.slug),
  };
}

export type CompareView = {
  slug: string;
  model: string;
  familyId: ProductFamily['id'];
  familyName: string;
  status: string;
  statusNote: string;
  scopeStatement: string;
  buyerQuestion: string;
  orientation: {
    label: string;
    scope: string;
    value?: string;
  };
  confirmationGate: string;
};

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
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderCompareRegion(views: readonly CompareView[]): string {
  if (views.length === 0) {
    return [
      '<div class="comparison-notice comparison-notice--empty" role="status">',
      '<h2>No valid references selected</h2>',
      '<p>Return to the product selector and choose up to four archived references.</p>',
      '<a href="/products/">Choose references</a>',
      '</div>',
    ].join('');
  }

  const mode = getCompareMode(views.map(view => view.slug));
  const row = (label: string, field: string, values: readonly string[]) => [
    `<tr data-compare-field="${escapeHtml(field)}">`,
    `<th scope="row">${escapeHtml(label)}</th>`,
    ...values.map(value => `<td>${escapeHtml(value)}</td>`),
    '</tr>',
  ].join('');
  const rows = [
    row('Family', 'family', views.map(view => view.familyName)),
    row('Reference status', 'status', views.map(view => `${view.status} — ${view.statusNote}`)),
  ];

  if (mode !== 'cross-family') {
    const orientationLabel = `${views[0].orientation.label} (${views[0].orientation.scope})`;
    rows.push(row(orientationLabel, 'orientation', views.map(view => view.orientation.value ?? view.statusNote)));
  }

  rows.push(
    row('Reference scope', 'scope', views.map(view => view.scopeStatement)),
    row('Buyer question', 'buyer-question', views.map(view => view.buyerQuestion)),
    row('Confirmation gate', 'confirmation-gate', views.map(view => view.confirmationGate)),
  );

  const notice = mode === 'cross-family'
    ? '<p class="comparison-notice" role="note">Orientation is omitted for cross-family comparisons because each family uses a different archived reference basis.</p>'
    : mode === 'single'
      ? '<p class="comparison-notice" role="status">Add at least one more reference to compare project-review boundaries.</p>'
      : '';
  const columns = views.map(view => [
    '<th scope="col">',
    `<a href="/products/${escapeHtml(view.slug)}/">${escapeHtml(view.model)}</a>`,
    '</th>',
  ].join('')).join('');

  return [
    notice,
    '<div class="comparison-table-wrap">',
    '<table class="comparison-table">',
    '<caption>Archived references and project-review boundaries</caption>',
    `<thead><tr><th scope="col">Review field</th>${columns}</tr></thead>`,
    `<tbody>${rows.join('')}</tbody>`,
    '</table>',
    '</div>',
  ].join('');
}

export function parseCompareItems(input: string | undefined | null): string[] {
  if (!input) return [];
  const seen = new Set<string>();
  return input.split(',').map(item => item.trim()).filter((slug) => {
    if (!slug || seen.has(slug) || !referencesBySlug.has(slug)) return false;
    seen.add(slug);
    return true;
  }).slice(0, 4);
}

export function getCompareMode(slugs: readonly string[]): 'empty' | 'single' | 'same-family' | 'cross-family' {
  const references = slugs.map(getProductReference).filter((reference): reference is ProductReference => Boolean(reference));
  if (references.length === 0) return 'empty';
  if (references.length === 1) return 'single';
  return new Set(references.map(reference => reference.familyId)).size === 1 ? 'same-family' : 'cross-family';
}
