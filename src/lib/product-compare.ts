export type CompareView = {
  slug: string;
  model: string;
  familyId: string;
  familyName: string;
  status: string;
  statusNote: string;
  scopeStatement: string;
  buyerQuestion: string;
  orientation: {
    label: string;
    scope: string;
    value: string;
  };
  confirmationGate: string;
  primaryProjectInputs: readonly string[];
  requiredDocuments: readonly string[];
  imageRole: 'Editorial planning visual';
  imageDisclosure: string;
};

type CompareSlug = Pick<CompareView, 'slug'>;

export function parseCompareItems(
  input: string | undefined | null,
  availableViews: readonly CompareSlug[],
): string[] {
  if (!input) return [];
  const availableSlugs = new Set(availableViews.map(view => view.slug));
  const seen = new Set<string>();
  return input.split(',').map(item => item.trim()).filter((slug) => {
    if (!slug || seen.has(slug) || !availableSlugs.has(slug)) return false;
    seen.add(slug);
    return true;
  }).slice(0, 4);
}

function getCompareMode(views: readonly CompareView[]): 'empty' | 'single' | 'same-family' | 'cross-family' {
  if (views.length === 0) return 'empty';
  if (views.length === 1) return 'single';
  return new Set(views.map(view => view.familyId)).size === 1 ? 'same-family' : 'cross-family';
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

  const mode = getCompareMode(views);
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
    rows.push(row(orientationLabel, 'orientation', views.map(view => view.orientation.value)));
  }

  rows.push(
    row('Reference scope', 'scope', views.map(view => view.scopeStatement)),
    row('Buyer question', 'buyer-question', views.map(view => view.buyerQuestion)),
    row('Confirmation gate', 'confirmation-gate', views.map(view => view.confirmationGate)),
    row('Primary project inputs', 'primary-project-inputs', views.map(view => view.primaryProjectInputs.join('; '))),
    row('Evidence and documents still required', 'required-documents', views.map(view => view.requiredDocuments.join('; '))),
    row('Editorial visual role', 'editorial-visual-role', views.map(view => `${view.imageRole}. ${view.imageDisclosure}`)),
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

export function renderCompareQuery(
  input: string | undefined | null,
  availableViews: readonly CompareView[],
): string | undefined {
  const selectedSlugs = parseCompareItems(input, availableViews);
  if (selectedSlugs.length === 0) return undefined;

  const viewsBySlug = new Map(availableViews.map(view => [view.slug, view]));
  const selectedViews = selectedSlugs.flatMap((slug) => {
    const view = viewsBySlug.get(slug);
    return view ? [view] : [];
  });
  const validUniqueCount = new Set((input ?? '').split(',').map(item => item.trim()).filter(slug => viewsBySlug.has(slug))).size;
  const limitNotice = validUniqueCount > 4
    ? '<p class="comparison-notice" role="status">Only the first four valid references are shown.</p>'
    : '';
  return `${limitNotice}${renderCompareRegion(selectedViews)}`;
}
