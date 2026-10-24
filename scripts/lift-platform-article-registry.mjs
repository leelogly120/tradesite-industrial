export const RECOVERED_RANKED_ARTICLES = Object.freeze([
  {
    slug: 'pick-and-carry-vs-spider-lift',
    title: 'Pick-and-Carry Crane vs Spider Lift: Task Boundaries',
    cluster: 'access-method',
    diagram: 'pick-and-carry-vs-spider-lift.svg',
    cover: '/images/editorial/crawler-platform-selection-path.svg',
  },
  {
    slug: 'ceiling-maintenance-safety-checklist',
    title: 'Ceiling Maintenance Safety Checklist for Access Work',
    cluster: 'ceiling-access',
    diagram: 'ceiling-maintenance-safety-checklist.svg',
    cover: '/images/editorial/ceiling-platform-underside.webp',
  },
  {
    slug: 'ceiling-work-technology-trends',
    title: 'Ceiling Work Technology Trends: Evidence to Verify',
    cluster: 'ceiling-access',
    diagram: 'ceiling-work-technology-trends.svg',
    cover: '/images/editorial/large-deck-steel-structure.webp',
  },
].map((article) => Object.freeze(article)));

export const RECOVERED_RANKED_ARTICLE_SLUGS = Object.freeze(RECOVERED_RANKED_ARTICLES.map(({ slug }) => slug));

export const BASELINE_BLOG_SLUGS = Object.freeze([
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
  ...RECOVERED_RANKED_ARTICLE_SLUGS,
]);

export const LIFT_PLATFORM_ARTICLES = Object.freeze([
  ['high-altitude-roll-forming-lift-rfq-data', 'RFQ Data Guide for High-Altitude Roll-Forming Lifts', 'roof-level'],
  ['roof-zone-survey-roll-forming-lift-selection', 'Roof-Zone Survey Guide for Roll-Forming Lift Selection', 'roof-level'],
  ['crawler-roll-forming-lift-access-route-survey', 'Crawler Roll-Forming Lift Access Route Survey Guide', 'crawler'],
  ['crawler-roll-forming-lift-ground-support-review', 'Ground Support Review for Crawler Roll-Forming Lifts', 'crawler'],
  ['crawler-roll-forming-lift-work-zone-relocation', 'Relocating Crawler Roll-Forming Lifts Between Work Zones', 'crawler'],
  ['truck-mounted-forming-lift-jobsite-setup-review', 'Jobsite Setup Review for Truck-Mounted Forming Lifts', 'truck'],
  ['truck-mounted-lift-destination-chassis-sourcing', 'Destination Chassis Sourcing for Truck-Mounted Lifts', 'truck'],
  ['truck-mounted-forming-lift-road-transport-documents', 'Road Transport Review for Truck-Mounted Forming Lifts', 'truck'],
  ['lifted-roll-forming-line-mounting-interface-review', 'Mounting Interface Review for Lifted Roll-Forming Lines', 'interface'],
  ['roof-level-roll-forming-lift-coil-loading-plan', 'Coil Loading Plan for Roof-Level Roll-Forming Lifts', 'interface'],
  ['elevated-roll-forming-roof-panel-handover-zones', 'Roof Panel Handover Zones for Elevated Roll Forming', 'roof-level'],
  ['roof-level-roll-forming-weather-hold-points', 'Weather Hold-Point Planning for Roof-Level Roll Forming', 'roof-level'],
  ['lift-roll-forming-system-commissioning-plan', 'Roll-Forming Lift Commissioning: Prepare the Interfaces', 'interface'],
  ['roll-forming-lift-technical-document-package', 'Roll-Forming Lift Documents: Read and Compare Offers', 'interface'],
  ['large-deck-crawler-platform-vs-basket-lift', 'Large-Deck Crawler Platforms vs Basket Lifts for Work', 'large-deck'],
  ['large-crawler-work-platform-building-entry-survey', 'Building Entry Survey for Large Crawler Work Platforms', 'large-deck'],
  ['large-deck-crawler-platform-work-zone-layout', 'Work-Zone Layout Guide for Large-Deck Crawler Platforms', 'large-deck'],
  ['large-deck-platform-wall-panel-access-planning', 'Wall-Panel Access Planning with Large-Deck Platforms', 'large-deck'],
  ['crawler-ceiling-platform-site-acceptance-records', 'Site Acceptance Records for Crawler Ceiling Platforms', 'large-deck'],
  ['crawler-platform-maintenance-spares-handover', 'Maintenance and Spares Handover for Crawler Platforms', 'large-deck'],
].map(([slug, title, cluster]) => Object.freeze({ slug, title, cluster, diagram: `${slug}.svg` })));

export const LIFT_PLATFORM_ARTICLE_SLUGS = Object.freeze(LIFT_PLATFORM_ARTICLES.map(({ slug }) => slug));

export const DAILY_LIFT_PLATFORM_ARTICLES = Object.freeze([
  ['roll-forming-lift-configuration-change-control', 'Roll-Forming Lift Changes: Recheck the Right Interfaces', 'interface'],
  ['roll-forming-lift-destination-receipt-plan', 'Roll-Forming Lift Delivery: Receipt and Assembly Readiness', 'logistics'],
].map(([slug, title, cluster]) => Object.freeze({ slug, title, cluster, diagram: `${slug}.svg` })));

export const DAILY_LIFT_PLATFORM_ARTICLE_SLUGS = Object.freeze(DAILY_LIFT_PLATFORM_ARTICLES.map(({ slug }) => slug));

export const AUGUST_10_LIFT_PLATFORM_ARTICLES = Object.freeze([
  ['aerial-platform-familiarization-handover', 'Aerial Platform Familiarization and Handover Guide', 'large-deck'],
  ['large-crawler-platform-transport-data-package', 'Transport Data Package for Large Crawler Platforms', 'logistics'],
].map(([slug, title, cluster]) => Object.freeze({ slug, title, cluster, diagram: `${slug}.svg` })));

export const AUGUST_10_LIFT_PLATFORM_ARTICLE_SLUGS = Object.freeze(AUGUST_10_LIFT_PLATFORM_ARTICLES.map(({ slug }) => slug));

export const AUGUST_13_LIFT_PLATFORM_ARTICLES = Object.freeze([
  ['truck-mounted-roll-forming-payload-allocation-review', 'Truck-Mounted Roll-Forming Payload Allocation Review', 'truck'],
  ['airport-terminal-ceiling-access-route-survey-guide', 'Airport Terminal Ceiling Access Route Survey Guide', 'large-deck'],
].map(([slug, title, cluster]) => Object.freeze({ slug, title, cluster, diagram: `${slug}.svg` })));

export const AUGUST_13_LIFT_PLATFORM_ARTICLE_SLUGS = Object.freeze(AUGUST_13_LIFT_PLATFORM_ARTICLES.map(({ slug }) => slug));

export const OCTOBER_23_LIFT_PLATFORM_ARTICLES = Object.freeze([
  {"slug": "roll-forming-lift-price-quotation-cost-scope", "title": "Roll-Forming Lift Price: Compare the Complete Purchase Scope", "cluster": "forming-procurement"},
  {"slug": "roll-forming-lift-buy-vs-rent-project-decision", "title": "Buy or Rent a Roll-Forming Lift? Compare the Project Need", "cluster": "forming-procurement"},
  {"slug": "existing-roof-panel-former-lift-retrofit-purchase", "title": "Adding a Lift to an Existing Roof-Panel Roll Former", "cluster": "forming-procurement"},
  {"slug": "used-roll-forming-lift-purchase-records", "title": "Buying a Used Roll-Forming Lift: Evidence Before a Deposit", "cluster": "forming-procurement"},
  {"slug": "roll-forming-lift-importer-distributor-supply-package", "title": "Roll-Forming Lifts for Importers: Define the Supply Package", "cluster": "forming-procurement"},
  {"slug": "roll-forming-lift-maintenance-spares-supply", "title": "Roll-Forming Lift Spares and Support: Buyer Questions", "cluster": "forming-procurement"},
  {"slug": "roll-forming-lift-procurement-delivery-dependencies", "title": "Roll-Forming Lift Lead Time: Plan the Purchase Dependencies", "cluster": "forming-procurement"},
  {"slug": "roll-forming-lift-supplier-demonstration-request", "title": "Requesting a Roll-Forming Lift Demonstration Before Purchase", "cluster": "forming-procurement"},
  {"slug": "roof-panel-roll-forming-production-route-cost-comparison", "title": "Roof-Level or Ground Forming? Compare the Full Cost Scope", "cluster": "forming-procurement"},
  {"slug": "roll-forming-lift-multiple-project-fleet-fit", "title": "Choosing a Roll-Forming Lift for Several Roofing Projects", "cluster": "forming-procurement"},
  {"slug": "crawler-roll-forming-lift-carrier-supply-scope", "title": "Crawler Roll-Forming Lift Transport: Carrier Quote Scope", "cluster": "forming-procurement"},
  {"slug": "roll-forming-lift-coil-handling-option-vs-separate-equipment", "title": "Coil Handling for Forming Lifts: Compare the Supply Scope", "cluster": "forming-procurement"},
  {"slug": "roll-forming-lift-height-specification-datum", "title": "Roll-Forming Lift Height: Read the Datum Before Shortlisting", "cluster": "forming-procurement"},
  {"slug": "roll-forming-lift-capacity-load-scope-questions", "title": "Roll-Forming Lift Capacity: Read the Quoted Load Scope", "cluster": "forming-procurement"},
  {"slug": "truck-vs-crawler-ceiling-work-platform-purchase", "title": "Truck vs Crawler Ceiling Platforms: Compare Supply Scope", "cluster": "platform-procurement"},
  {"slug": "crawler-ceiling-platform-rental-enquiry-scope", "title": "Crawler Ceiling Platform Rental: Define the Hire Scope", "cluster": "platform-procurement"},
  {"slug": "ceiling-work-platform-deck-extension-option", "title": "Ceiling Platform Deck Options: Main and Extension Scope", "cluster": "platform-procurement"},
  {"slug": "ceiling-platform-material-replenishment-supply", "title": "Ceiling Platform Materials: Plan the Replenishment Scope", "cluster": "platform-procurement"},
  {"slug": "ceiling-platform-refurbishment-vs-new-installation", "title": "Ceiling Platforms for Refurbishment and New Installation", "cluster": "platform-procurement"},
  {"slug": "ceiling-platform-purchase-service-support-package", "title": "Ceiling Platform Purchase: Compare Local Support Commitments", "cluster": "platform-procurement"},
].map(article => Object.freeze(article)));

export const OCTOBER_23_LIFT_PLATFORM_ARTICLE_SLUGS = Object.freeze(OCTOBER_23_LIFT_PLATFORM_ARTICLES.map(({ slug }) => slug));

// Campaign day1 is a new URL cohort, separate from the preceding October23 batch.
export const OCTOBER_24_CAMPAIGN_DAY1_ARTICLES = Object.freeze([
  {"slug":"roof-forming-lift-setback-from-roof-edge","title":"Roof-Forming Lift Setback: Describe the Output Position","cluster":"forming-site-brief"},
  {"slug":"roll-forming-lift-stepped-roof-levels","title":"Roll-Forming Lifts for Roofs with Several Eave Levels","cluster":"forming-site-brief"},
  {"slug":"roll-forming-lift-courtyard-output-route","title":"Roll-Forming Lifts in Courtyards: Map the Panel Route","cluster":"forming-site-brief"},
  {"slug":"roll-forming-lift-parapet-panel-clearance","title":"Roll-Forming Lifts and Parapets: Define Panel Clearance","cluster":"forming-site-brief"},
  {"slug":"roll-forming-lift-panel-output-direction","title":"Roll-Forming Lift Layout: Confirm Panel Output Direction","cluster":"forming-site-brief"},
  {"slug":"roll-forming-lift-roof-pitch-outlet-datum","title":"Roll-Forming Lift Outlet Data for a Pitched Roof Brief","cluster":"forming-site-brief"},
  {"slug":"roll-forming-lift-supplier-identity-evidence","title":"Roll-Forming Lift Suppliers: Check Identity and Scope","cluster":"forming-site-brief"},
  {"slug":"roll-forming-lift-opposite-building-faces","title":"Roll-Forming Lifts for Opposite Faces of One Building","cluster":"forming-site-brief"},
  {"slug":"roll-forming-lift-tender-base-bid-alternatives","title":"Roll-Forming Lift Tenders: Base Bid and Priced Options","cluster":"forming-site-brief"},
  {"slug":"roll-forming-lift-folded-versus-working-envelope","title":"Roll-Forming Lift Space: Folded and Working Envelopes","cluster":"forming-site-brief"},
  {"slug":"roll-forming-lift-operator-view-requirements","title":"Roll-Forming Lift Enquiries: Describe Operator Visibility","cluster":"forming-site-brief"},
  {"slug":"roll-forming-lift-first-panel-output-space","title":"Roll-Forming Lift Layout: Space for the First Panel","cluster":"forming-site-brief"},
  {"slug":"roll-forming-lift-intermediate-obstruction-data","title":"Roll-Forming Lift Layouts: Record Intermediate Obstacles","cluster":"forming-site-brief"},
  {"slug":"roll-forming-lift-rental-fleet-purchase-brief","title":"Roll-Forming Lifts for Hire Fleets: Define the Purchase","cluster":"forming-site-brief"},
  {"slug":"ceiling-platform-beam-depth-workface","title":"Ceiling Platform Planning: Beam Depth and Workface Access","cluster":"platform-workface-brief"},
  {"slug":"ceiling-platform-sloping-workface-brief","title":"Ceiling Platforms for Sloping Workfaces: Buyer Inputs","cluster":"platform-workface-brief"},
  {"slug":"ceiling-platform-interrupted-beam-grid","title":"Ceiling Platform Coverage Around an Interrupted Beam Grid","cluster":"platform-workface-brief"},
  {"slug":"ceiling-platform-wall-to-roof-junction","title":"Ceiling Platforms at Wall-to-Roof Junctions: Scope Data","cluster":"platform-workface-brief"},
  {"slug":"ceiling-platform-service-pipe-obstructions","title":"Ceiling Platforms Around Existing Pipes and Services","cluster":"platform-workface-brief"},
  {"slug":"ceiling-platform-equipment-versus-access-service","title":"Ceiling Platform Purchase or Access Service: Compare Scope","cluster":"platform-workface-brief"},
].map(article => Object.freeze(article)));

export const OCTOBER_24_CAMPAIGN_DAY1_ARTICLE_SLUGS = Object.freeze(OCTOBER_24_CAMPAIGN_DAY1_ARTICLES.map(({ slug }) => slug));

export const ALL_LIFT_PLATFORM_ARTICLES = Object.freeze([
  ...LIFT_PLATFORM_ARTICLES,
  ...DAILY_LIFT_PLATFORM_ARTICLES,
  ...AUGUST_10_LIFT_PLATFORM_ARTICLES,
  ...AUGUST_13_LIFT_PLATFORM_ARTICLES,
  ...OCTOBER_23_LIFT_PLATFORM_ARTICLES,
  ...OCTOBER_24_CAMPAIGN_DAY1_ARTICLES,
]);

export const ALL_LIFT_PLATFORM_ARTICLE_SLUGS = Object.freeze(ALL_LIFT_PLATFORM_ARTICLES.map(({ slug }) => slug));
