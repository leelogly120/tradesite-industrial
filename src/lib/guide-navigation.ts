type GuidePost = {
  id: string;
  data: { title: string; description: string; draft?: boolean };
};

export type GuideLink = { href: string; title: string; description: string };

// Editorial topic boundaries, not keyword matching or automatic recommendations.
export const GUIDE_TOPICS = [
  { name: 'Roof-level system selection', slugs: [
    'roof-level-roll-forming-long-panels',
    'roof-panel-roll-forming-production-route-cost-comparison',
    'crawler-vs-truck-mounted-roll-forming-system',
    'roll-forming-lift-buy-vs-rent-project-decision',
    'high-altitude-roll-forming-lift-rfq-data',
    'roll-forming-lift-importer-distributor-supply-package',
    'roof-zone-survey-roll-forming-lift-selection',
    'roll-forming-lift-height-specification-datum',
    'roof-level-roll-forming-weather-hold-points',
    'roof-forming-lift-setback-from-roof-edge',
    'roll-forming-lift-stepped-roof-levels',
    'roll-forming-lift-roof-pitch-outlet-datum',
    'roll-forming-lift-supplier-identity-evidence',
    'roll-forming-lift-tender-base-bid-alternatives',
    'roll-forming-lift-first-panel-output-space',
    'roll-forming-lift-intermediate-obstruction-data',
    'roll-forming-lift-rental-fleet-purchase-brief',
  ] },
  { name: 'Crawler routes and ground support', slugs: [
    'crawler-roll-forming-lift-access-route-survey',
    'crawler-roll-forming-lift-ground-support-review',
    'crawler-roll-forming-lift-work-zone-relocation',
    'roll-forming-lift-multiple-project-fleet-fit',
    'roll-forming-lift-courtyard-output-route',
    'roll-forming-lift-opposite-building-faces',
    'roll-forming-lift-folded-versus-working-envelope',
  ] },
  { name: 'Forming-line specification and interfaces', slugs: [
    'roll-forming-line-specification-long-span-roof-panels',
    'roof-panel-profile-material-tooling-data',
    'roll-forming-line-electrical-control-interfaces',
    'lifted-roll-forming-line-mounting-interface-review',
    'existing-roof-panel-former-lift-retrofit-purchase',
    'roll-forming-line-fat-sat-acceptance-checklist',
    'roll-forming-lift-supplier-demonstration-request',
    'roll-forming-lift-panel-output-direction',
    'roll-forming-lift-operator-view-requirements',
    'roll-forming-lift-coated-coil-surface-evidence',
    'roll-forming-lift-standing-seam-profile-inputs',
    'roll-forming-lift-trapezoidal-profile-width',
    'roll-forming-lift-standard-versus-custom-tooling',
    'roll-forming-lift-material-strength-identification',
    'roll-forming-lift-cut-length-measurement-basis',
    'roll-forming-lift-tooling-ownership-custody',
    'roll-forming-lift-profile-tolerance-documents',
    'roll-forming-lift-protective-film-interface',
    'roll-forming-lift-variable-panel-length-schedule',
    'roll-forming-lift-nominated-former-tender',
    'roll-forming-lift-site-power-enquiry',
    'roll-forming-lift-generator-package-boundary',
    'roll-forming-lift-site-cable-supply-scope',
    'roll-forming-lift-separate-former-power',
    'roll-forming-lift-supply-frequency-mismatch',
    'roll-forming-lift-local-versus-remote-controls',
    'roll-forming-lift-former-emergency-stop-boundary',
    'roll-forming-lift-cutting-signal-interface',
    'roll-forming-lift-hydraulic-power-package',
    'roll-forming-lift-control-cabinet-site-conditions',
  ] },
  { name: 'Coil and roof-panel routes', slugs: [
    'coil-handling-roll-forming-line-feeding-plan',
    'roof-level-roll-forming-lift-coil-loading-plan',
    'roll-forming-lift-coil-handling-option-vs-separate-equipment',
    'elevated-roll-forming-roof-panel-handover-zones',
    'roll-forming-lift-parapet-panel-clearance',
    'roll-forming-lift-coil-feed-handedness',
    'roll-forming-lift-coil-change-supply-boundary',
    'roll-forming-lift-panel-bundle-staging-scope',
  ] },
  { name: 'Truck integration and transport boundaries', slugs: [
    'truck-mounted-roll-forming-chassis-interface-review',
    'truck-mounted-roll-forming-payload-allocation-review',
    'roll-forming-lift-capacity-load-scope-questions',
    'truck-mounted-lift-destination-chassis-sourcing',
    'truck-mounted-forming-lift-road-transport-documents',
    'crawler-roll-forming-lift-carrier-supply-scope',
    'truck-mounted-forming-lift-jobsite-setup-review',
  ] },
  { name: 'Shipping, documents and equipment handover', slugs: [
    '40hq-shipping-truck-mounted-roll-forming-lift',
    'large-crawler-platform-transport-data-package',
    'roll-forming-lift-destination-receipt-plan',
    'used-roll-forming-lift-purchase-records',
    'roll-forming-lift-procurement-delivery-dependencies',
    'roll-forming-lift-technical-document-package',
    'roll-forming-lift-price-quotation-cost-scope',
    'lift-roll-forming-system-commissioning-plan',
    'roll-forming-lift-configuration-change-control',
    'roll-forming-lift-control-language-request',
    'roll-forming-lift-order-before-former-selection',
  ] },
  { name: 'Choosing a ceiling-access method', slugs: [
    'crawler-under-ceiling-platform-buyers-guide',
    'crawler-ceiling-platform-rental-enquiry-scope',
    'crawler-ceiling-wall-panel-platform-project-data',
    'large-deck-crawler-platform-vs-basket-lift',
    'crawler-platform-vs-spider-lift-vs-scaffolding',
    'truck-vs-crawler-ceiling-work-platform-purchase',
    'pick-and-carry-vs-spider-lift',
    'ceiling-platform-equipment-versus-access-service',
  ] },
  { name: 'Indoor routes, floors and work areas', slugs: [
    'indoor-aerial-platform-ground-pressure-guide',
    'large-crawler-work-platform-building-entry-survey',
    'large-deck-crawler-platform-work-zone-layout',
    'ceiling-platform-material-replenishment-supply',
    'large-deck-platform-wall-panel-access-planning',
    'ceiling-platform-overhead-clearance-survey',
    'aerial-platform-worker-tool-material-load-planning',
    'ceiling-work-platform-deck-extension-option',
    'ceiling-platform-beam-depth-workface',
    'ceiling-platform-sloping-workface-brief',
    'ceiling-platform-interrupted-beam-grid',
    'ceiling-platform-wall-to-roof-junction',
    'ceiling-platform-service-pipe-obstructions',
    'wall-panel-platform-panel-orientation-inputs',
    'ceiling-platform-long-panels-versus-small-units',
    'ceiling-platform-ductwork-access-positions',
  ] },
  { name: 'Controls, maintenance and handover responsibilities', slugs: [
    'dual-power-crawler-platform-selection',
    'remote-control-aerial-platform-safety-planning',
    'aerial-platform-emergency-lowering-rescue-plan',
    'aerial-platform-familiarization-handover',
    'crawler-platform-maintenance-spares-handover',
    'roll-forming-lift-maintenance-spares-supply',
    'ceiling-platform-purchase-service-support-package',
    'crawler-ceiling-platform-site-acceptance-records',
    'ceiling-work-technology-trends',
    'ceiling-maintenance-safety-checklist',
    'ceiling-platform-refurbishment-vs-new-installation',
    'ceiling-platform-lighting-workface-access',
    'ceiling-platform-noise-evidence-enquiry',
    'ceiling-platform-training-service-purchase',
    'roll-forming-lift-radio-control-market-enquiry',
    'roll-forming-lift-remote-support-access-scope',
    'ceiling-platform-dual-power-task-boundary',
    'ceiling-platform-charging-and-parking-brief',
    'ceiling-platform-independent-inspection-purchase',
    'ceiling-platform-indoor-emissions-enquiry',
    'ceiling-platform-control-view-between-workfaces',
  ] },
  { name: 'Planning access around building use', slugs: [
    'airport-terminal-maintenance-access-planning',
    'airport-terminal-ceiling-access-route-survey-guide',
    'stadium-ceiling-access-platform-planning',
    'warehouse-ceiling-access-platform-planning',
    'ceiling-platform-occupied-building-work-hours',
  ] },
] as const;

export const STARTER_GUIDES = [
  'roof-level-roll-forming-long-panels',
  'truck-mounted-roll-forming-chassis-interface-review',
  'crawler-under-ceiling-platform-buyers-guide',
  'roll-forming-line-specification-long-span-roof-panels',
] as const;

const PRODUCT_GUIDES: Record<string, readonly string[]> = {
  'crawler-roll-forming-lifts': [
    'roof-level-roll-forming-long-panels',
    'crawler-vs-truck-mounted-roll-forming-system',
    'crawler-roll-forming-lift-access-route-survey',
    'crawler-roll-forming-lift-ground-support-review',
    'high-altitude-roll-forming-lift-rfq-data',
  ],
  'truck-mounted-roll-forming-lifts': [
    'truck-mounted-roll-forming-chassis-interface-review',
    '40hq-shipping-truck-mounted-roll-forming-lift',
    'truck-mounted-roll-forming-payload-allocation-review',
    'roll-forming-lift-technical-document-package',
  ],
  'crawler-ceiling-platforms': [
    'crawler-under-ceiling-platform-buyers-guide',
    'indoor-aerial-platform-ground-pressure-guide',
    'large-crawler-work-platform-building-entry-survey',
    'aerial-platform-worker-tool-material-load-planning',
  ],
  'roll-forming-machines': [
    'roll-forming-line-specification-long-span-roof-panels',
    'roof-panel-profile-material-tooling-data',
    'coil-handling-roll-forming-line-feeding-plan',
    'roll-forming-line-fat-sat-acceptance-checklist',
  ],
};

export function getGuideLinks(slugs: readonly string[], posts: readonly GuidePost[]): GuideLink[] {
  return [...new Set(slugs)].flatMap(slug => {
    const post = posts.find(candidate => candidate.id === slug && !candidate.data.draft);
    return post ? [{ href: `/blog/${post.id}/`, title: post.data.title, description: post.data.description }] : [];
  });
}

export function getGuideTopic(slug: string) {
  return GUIDE_TOPICS.find(topic => (topic.slugs as readonly string[]).includes(slug));
}

export function getRelatedGuides(slug: string, posts: readonly GuidePost[]): GuideLink[] {
  return getGuideLinks((getGuideTopic(slug)?.slugs ?? []).filter(id => id !== slug), posts);
}

export function getProductGuides(familyId: string, posts: readonly GuidePost[]): GuideLink[] {
  return getGuideLinks(PRODUCT_GUIDES[familyId] ?? [], posts);
}
