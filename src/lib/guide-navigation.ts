type GuidePost = {
  id: string;
  data: { title: string; description: string; draft?: boolean };
};

export type GuideLink = { href: string; title: string; description: string };

// Editorial topic boundaries, not keyword matching or automatic recommendations.
export const GUIDE_TOPICS = [
  { name: 'Roof-level system selection', slugs: [
    'roof-level-roll-forming-long-panels',
    'crawler-vs-truck-mounted-roll-forming-system',
    'high-altitude-roll-forming-lift-rfq-data',
    'roof-zone-survey-roll-forming-lift-selection',
    'roof-level-roll-forming-weather-hold-points',
  ] },
  { name: 'Crawler routes and ground support', slugs: [
    'crawler-roll-forming-lift-access-route-survey',
    'crawler-roll-forming-lift-ground-support-review',
    'crawler-roll-forming-lift-work-zone-relocation',
  ] },
  { name: 'Forming-line specification and interfaces', slugs: [
    'roll-forming-line-specification-long-span-roof-panels',
    'roof-panel-profile-material-tooling-data',
    'roll-forming-line-electrical-control-interfaces',
    'lifted-roll-forming-line-mounting-interface-review',
    'roll-forming-line-fat-sat-acceptance-checklist',
  ] },
  { name: 'Coil and roof-panel routes', slugs: [
    'coil-handling-roll-forming-line-feeding-plan',
    'roof-level-roll-forming-lift-coil-loading-plan',
    'elevated-roll-forming-roof-panel-handover-zones',
  ] },
  { name: 'Truck integration and transport boundaries', slugs: [
    'truck-mounted-roll-forming-chassis-interface-review',
    'truck-mounted-roll-forming-payload-allocation-review',
    'truck-mounted-lift-destination-chassis-sourcing',
    'truck-mounted-forming-lift-road-transport-documents',
    'truck-mounted-forming-lift-jobsite-setup-review',
  ] },
  { name: 'Shipping, documents and equipment handover', slugs: [
    '40hq-shipping-truck-mounted-roll-forming-lift',
    'large-crawler-platform-transport-data-package',
    'roll-forming-lift-destination-receipt-plan',
    'roll-forming-lift-technical-document-package',
    'lift-roll-forming-system-commissioning-plan',
    'roll-forming-lift-configuration-change-control',
  ] },
  { name: 'Choosing a ceiling-access method', slugs: [
    'crawler-under-ceiling-platform-buyers-guide',
    'crawler-ceiling-wall-panel-platform-project-data',
    'large-deck-crawler-platform-vs-basket-lift',
    'crawler-platform-vs-spider-lift-vs-scaffolding',
    'pick-and-carry-vs-spider-lift',
  ] },
  { name: 'Indoor routes, floors and work areas', slugs: [
    'indoor-aerial-platform-ground-pressure-guide',
    'large-crawler-work-platform-building-entry-survey',
    'large-deck-crawler-platform-work-zone-layout',
    'large-deck-platform-wall-panel-access-planning',
    'ceiling-platform-overhead-clearance-survey',
    'aerial-platform-worker-tool-material-load-planning',
  ] },
  { name: 'Controls, maintenance and handover responsibilities', slugs: [
    'dual-power-crawler-platform-selection',
    'remote-control-aerial-platform-safety-planning',
    'aerial-platform-emergency-lowering-rescue-plan',
    'aerial-platform-familiarization-handover',
    'crawler-platform-maintenance-spares-handover',
    'crawler-ceiling-platform-site-acceptance-records',
    'ceiling-work-technology-trends',
    'ceiling-maintenance-safety-checklist',
  ] },
  { name: 'Planning access around building use', slugs: [
    'airport-terminal-maintenance-access-planning',
    'airport-terminal-ceiling-access-route-survey-guide',
    'stadium-ceiling-access-platform-planning',
    'warehouse-ceiling-access-platform-planning',
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
