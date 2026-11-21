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

// Campaign day2 adds twenty further URLs without refreshing the prior ninety.
export const OCTOBER_25_CAMPAIGN_DAY2_ARTICLES = Object.freeze([
  {"slug":"roll-forming-lift-coated-coil-surface-evidence","title":"Roll-Forming Lift Enquiries for Coated Coil Materials","cluster":"forming-material-brief"},
  {"slug":"roll-forming-lift-standing-seam-profile-inputs","title":"Roll-Forming Lift Inputs for Standing-Seam Roof Profiles","cluster":"forming-material-brief"},
  {"slug":"roll-forming-lift-trapezoidal-profile-width","title":"Roll-Forming Lift Inputs for Trapezoidal Panel Widths","cluster":"forming-material-brief"},
  {"slug":"roll-forming-lift-coil-feed-handedness","title":"Roll-Forming Lift Layout: Specify Coil Feed Handedness","cluster":"forming-material-brief"},
  {"slug":"roll-forming-lift-standard-versus-custom-tooling","title":"Roll-Forming Lift Tooling: Existing Design or Custom Scope","cluster":"forming-material-brief"},
  {"slug":"roll-forming-lift-coil-change-supply-boundary","title":"Roll-Forming Lift Coil Changes: Define the Supply Boundary","cluster":"forming-material-brief"},
  {"slug":"roll-forming-lift-material-strength-identification","title":"Roll-Forming Lift Enquiries: Identify the Coil Material","cluster":"forming-material-brief"},
  {"slug":"roll-forming-lift-cut-length-measurement-basis","title":"Roll-Forming Lift Offers: Define the Panel Length Basis","cluster":"forming-material-brief"},
  {"slug":"roll-forming-lift-tooling-ownership-custody","title":"Roll-Forming Lift Tooling: Agree Ownership and Custody","cluster":"forming-material-brief"},
  {"slug":"roll-forming-lift-profile-tolerance-documents","title":"Roll-Forming Lift Enquiries: Record Profile Tolerances","cluster":"forming-material-brief"},
  {"slug":"roll-forming-lift-protective-film-interface","title":"Roll-Forming Lift Enquiries for Film-Covered Coil Stock","cluster":"forming-material-brief"},
  {"slug":"roll-forming-lift-panel-bundle-staging-scope","title":"Roll-Forming Lift Projects: Define Panel Staging Scope","cluster":"forming-material-brief"},
  {"slug":"roll-forming-lift-variable-panel-length-schedule","title":"Roll-Forming Lift Enquiries with Mixed Panel Lengths","cluster":"forming-material-brief"},
  {"slug":"roll-forming-lift-nominated-former-tender","title":"Roll-Forming Lift Tenders with a Nominated Roll Former","cluster":"forming-material-brief"},
  {"slug":"wall-panel-platform-panel-orientation-inputs","title":"Wall-Panel Work Platforms: Describe Panel Orientation","cluster":"platform-task-brief"},
  {"slug":"ceiling-platform-long-panels-versus-small-units","title":"Ceiling Platforms for Long Panels or Small Tile Units","cluster":"platform-task-brief"},
  {"slug":"ceiling-platform-lighting-workface-access","title":"Ceiling Platforms for Lighting Work: Describe the Task","cluster":"platform-task-brief"},
  {"slug":"ceiling-platform-ductwork-access-positions","title":"Ceiling Platforms Near Ductwork: Define Access Positions","cluster":"platform-task-brief"},
  {"slug":"ceiling-platform-noise-evidence-enquiry","title":"Ceiling Platform Noise Data: Ask What Was Actually Measured","cluster":"platform-task-brief"},
  {"slug":"ceiling-platform-training-service-purchase","title":"Ceiling Platform Training Services: Define the Purchase","cluster":"platform-task-brief"},
].map(article => Object.freeze(article)));

export const OCTOBER_25_CAMPAIGN_DAY2_ARTICLE_SLUGS = Object.freeze(OCTOBER_25_CAMPAIGN_DAY2_ARTICLES.map(({ slug }) => slug));

// Campaign day3 adds twenty further URLs while preserving all110 published articles.
export const OCTOBER_26_CAMPAIGN_DAY3_ARTICLES = Object.freeze([
  {"slug":"roll-forming-lift-site-power-enquiry","title":"Roll-Forming Lift Site Power: Prepare a Supply Enquiry","cluster":"forming-power-control-brief"},
  {"slug":"roll-forming-lift-generator-package-boundary","title":"Roll-Forming Lifts with Generators: Define Package Scope","cluster":"forming-power-control-brief"},
  {"slug":"roll-forming-lift-site-cable-supply-scope","title":"Roll-Forming Lift Power Cables: Define the Supply Scope","cluster":"forming-power-control-brief"},
  {"slug":"roll-forming-lift-separate-former-power","title":"Roll-Forming Lift Power: Separate Lift and Former Loads","cluster":"forming-power-control-brief"},
  {"slug":"roll-forming-lift-supply-frequency-mismatch","title":"Roll-Forming Lift Offers: Check Supply Frequency Data","cluster":"forming-power-control-brief"},
  {"slug":"roll-forming-lift-control-language-request","title":"Roll-Forming Lift Controls: Specify Language Requirements","cluster":"forming-power-control-brief"},
  {"slug":"roll-forming-lift-radio-control-market-enquiry","title":"Roll-Forming Lift Radio Controls: Destination Questions","cluster":"forming-power-control-brief"},
  {"slug":"roll-forming-lift-local-versus-remote-controls","title":"Roll-Forming Lift Controls: Local and Remote Scope Data","cluster":"forming-power-control-brief"},
  {"slug":"roll-forming-lift-former-emergency-stop-boundary","title":"Roll-Forming Lift Systems: Clarify Stop-Control Boundaries","cluster":"forming-power-control-brief"},
  {"slug":"roll-forming-lift-cutting-signal-interface","title":"Roll-Forming Lifts: Define the Former's Cutting Signals","cluster":"forming-power-control-brief"},
  {"slug":"roll-forming-lift-order-before-former-selection","title":"Ordering a Roll-Forming Lift Before the Former Is Final","cluster":"forming-power-control-brief"},
  {"slug":"roll-forming-lift-hydraulic-power-package","title":"Roll-Forming Lift Offers: Identify Hydraulic Power Scope","cluster":"forming-power-control-brief"},
  {"slug":"roll-forming-lift-remote-support-access-scope","title":"Roll-Forming Lift Remote Support: Define Access Scope","cluster":"forming-power-control-brief"},
  {"slug":"roll-forming-lift-control-cabinet-site-conditions","title":"Roll-Forming Lift Control Cabinets: Describe Site Exposure","cluster":"forming-power-control-brief"},
  {"slug":"ceiling-platform-dual-power-task-boundary","title":"Ceiling Platform Dual Power: Match Each Intended Task","cluster":"platform-power-control-brief"},
  {"slug":"ceiling-platform-charging-and-parking-brief","title":"Ceiling Platforms: Include Charging and Parking in the Brief","cluster":"platform-power-control-brief"},
  {"slug":"ceiling-platform-independent-inspection-purchase","title":"Ceiling Platform Inspection Services: Agree the Scope","cluster":"platform-power-control-brief"},
  {"slug":"ceiling-platform-indoor-emissions-enquiry","title":"Ceiling Platform Power: Record Indoor Air Constraints","cluster":"platform-power-control-brief"},
  {"slug":"ceiling-platform-occupied-building-work-hours","title":"Ceiling Platforms in Occupied Buildings: Work-Hour Inputs","cluster":"platform-power-control-brief"},
  {"slug":"ceiling-platform-control-view-between-workfaces","title":"Ceiling Platform Controls: Define Each Workface View","cluster":"platform-power-control-brief"},
].map(article => Object.freeze(article)));

export const OCTOBER_26_CAMPAIGN_DAY3_ARTICLE_SLUGS = Object.freeze(OCTOBER_26_CAMPAIGN_DAY3_ARTICLES.map(({ slug }) => slug));

// The buyer standard adds ten complete decisions, with varied article structures.
export const OCTOBER_27_BUYER_ARTICLES = Object.freeze([
  ["factory-made-roof-panels-vs-on-site-roll-forming","Factory-Made Roof Panels or On-Site Roll Forming? A Contractor's Buying Guide","forming-buyer-decision"],
  ["roof-panel-roll-forming-production-bottleneck-planning","Roof-Panel Roll Forming: Size the Package Around the Real Bottleneck","forming-buyer-decision"],
  ["multi-profile-roof-panel-roll-former-vs-dedicated-lines","One Roof-Panel Former for Multiple Profiles or Separate Lines?","forming-buyer-decision"],
  ["one-roll-forming-lift-vs-two-concurrent-projects","One Roll-Forming Lift or Two? Plan for Overlapping Roofing Projects","forming-buyer-decision"],
  ["peb-roof-forming-and-cladding-access-equipment-package","PEB Roofing and Cladding: Choose the Right Forming and Access Package","forming-buyer-decision"],
  ["occupied-factory-reroofing-roll-forming-lift-selection","Roll-Forming Lifts for Re-Roofing an Occupied Factory","forming-buyer-decision"],
  ["aircraft-hangar-ceiling-installation-platform-selection","Ceiling Platforms for Aircraft Hangar Installation Work","platform-buyer-decision"],
  ["roll-forming-lift-distributor-demo-unit-vs-project-orders","Roll-Forming Lift Distributors: Stock a Demo or Order to Project?","forming-buyer-decision"],
  ["roof-panel-roll-forming-material-yield-cost","Roof-Panel Roll Forming: Compare Cost per Accepted Panel","forming-buyer-decision"],
  ["shared-ceiling-platform-multitrade-fitout-sequence","One Shared Ceiling Platform or Separate Access for Each Trade?","platform-buyer-decision"],
].map(([slug, title, cluster]) => Object.freeze({ slug, title, cluster })));
export const OCTOBER_27_BUYER_ARTICLE_SLUGS = Object.freeze(OCTOBER_27_BUYER_ARTICLES.map(({ slug }) => slug));

export const OCTOBER_28_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "fixed-roof-panel-factory-line-vs-mobile-site-production",
    "title": "Fixed Roof-Panel Factory or Mobile Site Production? Where to Put Your First Line",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-forming-lift-main-height-vs-occasional-high-projects",
    "title": "Roof-Forming Lift: Buy for Regular Work or Higher Projects?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-forming-machine-hire-vs-operated-service",
    "title": "Roof-Panel Roll-Forming Hire or an Operated Service? Buy the Missing Capability",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roll-forming-lift-container-vs-out-of-gauge-shipping",
    "title": "Container Modules or Out-of-Gauge Shipping for a Roll-Forming Lift?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roll-forming-lift-fleet-standardization-vs-project-configurations",
    "title": "Standardize Your Roll-Forming Lift Fleet or Keep Project-Specific Machines?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-forming-buy-slit-coil-vs-slitting-line",
    "title": "Roof-Panel Roll Forming: Buy Slit Coil or Add a Slitting Line?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-forming-line-flashing-trim-production",
    "title": "Roof-Panel Roll Forming and Flashings: What Should You Make?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "crawler-roll-forming-lift-own-transporter-vs-hired-haulage",
    "title": "Crawler Roll-Forming Lift Transport: Own a Carrier or Hire Haulage?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "repair-or-replace-roof-panel-roll-forming-lift",
    "title": "Repair or Replace an Existing Roof-Panel Roll-Forming Lift?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-forming-coil-vs-finished-panel-inventory",
    "title": "Roof-Panel Roll Forming: Stock Coil or Finished Panels?",
    "cluster": "forming-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const OCTOBER_28_BUYER_ARTICLE_SLUGS = Object.freeze(OCTOBER_28_BUYER_ARTICLES.map(({ slug }) => slug));

export const OCTOBER_29_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "ceiling-contractor-labour-only-vs-supply-and-install-platform-purchase",
    "title": "Ceiling Contracts: Labour Only or Supply and Install Before Buying a Platform?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "ceiling-platform-ground-preassembly-vs-overhead-assembly",
    "title": "Ceiling Platform Planning: Ground Preassembly or Assembly at Height?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "warehouse-ceiling-platform-before-racking-installation",
    "title": "Warehouse Ceiling Platforms: Finish Overhead Work Before Installing Racking?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "factory-ceiling-maintenance-permanent-access-vs-mobile-platform",
    "title": "Factory Ceiling Maintenance: Permanent Access or a Mobile Platform?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "ceiling-platform-direct-import-vs-local-equipment-supplier",
    "title": "Import a Ceiling Platform Directly or Buy Through a Local Supplier?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "large-deck-crawler-platform-vs-mast-climbing-work-platform",
    "title": "Large-Deck Crawler Platform or Mast-Climbing Work Platform?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-forming-toll-service-vs-own-material-sales",
    "title": "Roof-Panel Roll Forming: Toll Service or Own-Material Panel Sales?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "ceiling-platform-in-house-maintenance-vs-service-contractor",
    "title": "Ceiling Platform Maintenance: In-House Team or Service Contractor?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "ceiling-platform-fixed-price-installation-vs-daywork",
    "title": "Ceiling Installation with a Platform: Fixed Price or Daywork?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "multi-storey-building-ceiling-platform-access-packages",
    "title": "Multi-Storey Ceiling Work: One Platform or Floor-by-Floor Access?",
    "cluster": "ceiling-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const OCTOBER_29_BUYER_ARTICLE_SLUGS = Object.freeze(OCTOBER_29_BUYER_ARTICLES.map(({ slug }) => slug));

export const OCTOBER_30_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "roof-panel-roll-forming-pre-cut-vs-post-cut-line",
    "title": "Roof-Panel Roll Forming: Pre-Cut or Post-Cut Line?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-forming-runout-table-vs-automatic-stacker",
    "title": "Roof-Panel Roll Forming: Runout Tables or an Automatic Stacker?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-forming-inline-punching-vs-secondary-fabrication",
    "title": "Roof-Panel Lines: Inline Punching or Separate Fabrication?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "full-length-roof-panels-vs-designed-end-laps-forming-package",
    "title": "Full-Length Roof Panels or Designed End Laps: Which Production Package?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "condensation-control-roof-panels-buy-finished-vs-add-application",
    "title": "Condensation-Control Roof Panels: Buy Finished Panels or Add Application?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "ceiling-platform-vs-suspended-access-deck",
    "title": "Ceiling Platform or Suspended Access Deck for a Large Hall?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "roof-panel-curving-machine-vs-specialist-panel-supply",
    "title": "Roof-Panel Curving Machine or Specialist Curved-Panel Supply?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "standing-seam-vs-exposed-fastener-roofing-production-package",
    "title": "Standing-Seam or Exposed-Fastener Roofing Production Package?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "built-up-insulated-roof-own-sheets-vs-system-package",
    "title": "Built-Up Insulated Roof: Make the Sheets or Buy the System?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-factory-buy-prepainted-coil-vs-coating-line",
    "title": "Roof-Panel Factory: Buy Prepainted Coil or Add a Coating Line?",
    "cluster": "forming-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const OCTOBER_30_BUYER_ARTICLE_SLUGS = Object.freeze(OCTOBER_30_BUYER_ARTICLES.map(({ slug }) => slug));

export const OCTOBER_31_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "roof-forming-lift-vs-crane-supported-roll-former",
    "title": "Roof-Forming Lift or a Crane-Supported Roll-Former System?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-forming-lift-before-vs-after-wall-enclosure",
    "title": "Roof-Forming Lift Procurement: Before or After Wall Enclosure?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "cold-store-ceiling-platform-before-cooldown-vs-operating-store",
    "title": "Cold-Store Ceiling Platforms: Before Cooldown or During Operation?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "metal-roof-overcladding-vs-tear-off-forming-lift-package",
    "title": "Metal Roof Overcladding or Tear-Off: Which Forming-Lift Package?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "standby-roll-forming-lift-vs-backup-panel-supply",
    "title": "Standby Roll-Forming Lift or Backup Panel Supply?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-forming-lift-vs-inclined-ground-forming-system",
    "title": "Roof-Forming Lift vs Ground-to-Eaves Forming",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roll-forming-lift-temporary-export-vs-destination-fleet",
    "title": "Roll-Forming Lift: Temporary Export or Destination Fleet?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roll-forming-lift-ground-improvement-vs-offsite-panels",
    "title": "Roll-Forming Lift Ground Works or Offsite Roof Panels?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "large-deck-ceiling-platform-vs-rope-access-contractor",
    "title": "Large-Deck Ceiling Platform or Rope-Access Contractor?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "industrial-ceiling-camera-survey-vs-platform-inspection",
    "title": "Industrial Ceiling: Camera Survey or Platform Inspection?",
    "cluster": "ceiling-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const OCTOBER_31_BUYER_ARTICLE_SLUGS = Object.freeze(OCTOBER_31_BUYER_ARTICLES.map(({ slug }) => slug));

export const NOVEMBER_01_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "standing-seam-roof-seaming-tools-vs-specialist-crew",
    "title": "Standing-Seam Roofing: Own the Seaming Tools or Hire a Specialist Crew?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-former-steel-vs-aluminium-production",
    "title": "Roof-Panel Roll Former: Stay with Steel or Add Aluminium Production?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-forming-second-shift-vs-second-line",
    "title": "Roof-Panel Roll Forming: Add a Second Shift or a Second Line?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roll-forming-lift-joint-ownership-vs-single-contractor",
    "title": "Roll-Forming Lift: Joint Ownership or One Contractor's Asset?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-forming-batch-inspection-vs-inline-measurement",
    "title": "Roof-Panel Roll Forming: Batch Inspection or Inline Measurement?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "sandwich-panel-production-line-vs-roof-sheet-roll-former",
    "title": "Sandwich-Panel Production Line or Roof-Sheet Roll Former?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "cleanroom-ceiling-platform-before-vs-after-clean-handover",
    "title": "Cleanroom Ceiling Platforms: Before or After Clean Handover?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "tapered-standing-seam-roll-former-vs-specialist-panels",
    "title": "Tapered Standing-Seam Roll Former or Specialist Panel Supply?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "ceiling-platform-continuous-shutdown-vs-short-outages",
    "title": "Ceiling Platforms: One Shutdown or Repeated Short Outages?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "roll-forming-lift-regional-depot-vs-central-dispatch",
    "title": "Roll-Forming Lift Fleet: Regional Depot or Central Dispatch?",
    "cluster": "forming-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const NOVEMBER_01_BUYER_ARTICLE_SLUGS = Object.freeze(NOVEMBER_01_BUYER_ARTICLES.map(({ slug }) => slug));

export const NOVEMBER_02_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "roof-panel-oil-canning-roll-former-purchase",
    "title": "Roof-Panel Oil Canning: Find the Cause Before Buying a Former",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "metal-decking-vs-roof-panel-roll-forming-business",
    "title": "Metal Decking or Roof Panels: Choose the Production Business",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "tile-effect-metal-roof-panel-production-equipment",
    "title": "Tile-Effect Metal Roofing: What the Production Line Must Include",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "discontinued-roof-panel-profile-replacement-tooling",
    "title": "Discontinued Roof Panels: Matching Sheets or New Tooling?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "solar-ready-standing-seam-panel-tooling-selection",
    "title": "Solar-Ready Standing Seam: Choose the Seam Before the Former",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "ceiling-platform-floor-coating-work-sequence",
    "title": "Ceiling Platform Work: Finish Before the Floor Coating?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-forming-digital-job-transfer",
    "title": "Roof-Panel Roll Forming: When to Buy Digital Job Transfer",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roll-forming-lift-critical-spares-stock-decision",
    "title": "Roll-Forming Lift Spares: Which Parts Belong in Local Stock?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-forming-short-order-scheduling",
    "title": "Short Roof-Panel Orders: Group Production Without Delaying the Job",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "ceiling-platform-strip-out-and-reinstallation-package",
    "title": "Ceiling Replacement: Keep One Platform Through Both Work Phases?",
    "cluster": "ceiling-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const NOVEMBER_02_BUYER_ARTICLE_SLUGS = Object.freeze(NOVEMBER_02_BUYER_ARTICLES.map(({ slug }) => slug));

export const NOVEMBER_03_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "used-roof-panel-roll-former-vs-new-line",
    "title": "Used Roof-Panel Roll Former or New Line for Your First Orders?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-production-walk-in-orders-vs-project-contracts",
    "title": "Roof-Panel Production: Walk-In Orders or Scheduled Project Contracts?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "ceiling-platform-snagging-retain-vs-remobilize",
    "title": "Ceiling Snagging: Retain the Main Platform or Book a Closeout Return?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "wall-cladding-platform-and-vacuum-lifter-package",
    "title": "Wall-Cladding Platform and Vacuum Lifter: Buying the Complete Package",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "standing-seam-roof-system-approval-before-roll-former-purchase",
    "title": "Standing-Seam Production: Secure the Roof-System Route Before Buying the Former",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "self-supporting-arch-roof-machine-vs-roof-panel-line",
    "title": "Self-Supporting Arch Roof Machine or Conventional Roof-Panel Line?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-former-stop-to-cut-vs-flying-cut",
    "title": "Roof-Panel Roll Former: Stop-to-Cut or Flying Cut?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-forming-single-decoiler-vs-coil-change-system",
    "title": "Roof-Panel Roll Forming: Single Decoiler or Coil-Change System?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-level-former-dedicated-vs-shared-workshop-line",
    "title": "Dedicated Roof-Level Roll Former or One Line Shared with the Workshop?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-production-central-factory-vs-regional-lines",
    "title": "Roof-Panel Production: One Central Factory or Regional Lines?",
    "cluster": "forming-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const NOVEMBER_03_BUYER_ARTICLE_SLUGS = Object.freeze(NOVEMBER_03_BUYER_ARTICLES.map(({ slug }) => slug));

export const NOVEMBER_09_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "corrugated-vs-trapezoidal-roof-panel-roll-forming-business",
    "title": "Corrugated or Trapezoidal Roof-Panel Roll Forming for Your First Line?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "rooflight-compatible-roof-panel-roll-forming-package",
    "title": "Roof-Panel Roll Forming for Rooflight Projects: Buy the Matched Package",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-forming-line-vs-wall-cassette-fabrication",
    "title": "Roof-Panel Roll Forming or Wall-Cassette Fabrication: Which Business Fits?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-sheet-only-vs-complete-accessory-supply",
    "title": "Roof-Panel Business: Sell Sheets Only or a Coordinated Accessory Package?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-former-controls-retrofit-vs-new-line",
    "title": "Roof-Panel Roll Former: Retrofit Obsolete Controls or Buy a New Line?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "suspended-acoustic-ceiling-tiles-vs-open-baffle-platform-package",
    "title": "Ceiling Platforms for Acoustic Tiles or Open Baffles: Price Different Work",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "roof-insulation-retrofit-access-from-above-vs-ceiling-platform",
    "title": "Roof Insulation Retrofit: Work from Above or Use a Ceiling Platform?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "steel-roof-fire-protection-board-vs-spray-access-package",
    "title": "Steel-Roof Fire Protection: Board or Spray Access Packages?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "suspended-ceiling-grid-reuse-vs-complete-replacement-platform-scope",
    "title": "Ceiling Renewal: Reuse the Grid or Replace the Complete System?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "roof-panel-producer-supply-only-vs-supply-and-install",
    "title": "Roof-Panel Producer: Supply Only or Supply and Install?",
    "cluster": "forming-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const NOVEMBER_09_BUYER_ARTICLE_SLUGS = Object.freeze(NOVEMBER_09_BUYER_ARTICLES.map(({ slug }) => slug));

// Fifty backlog decisions written and published on the actual November 10 date.
// Missed quota dates are private accounting and never select public metadata.
export const NOVEMBER_10_CATCHUP_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "fixed-eaves-forming-station-vs-dedicated-roll-forming-lift",
    "title": "Fixed Eaves Forming Station or a Dedicated Roll-Forming Lift?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "interchangeable-forming-ceiling-modules-vs-dedicated-machines",
    "title": "One Interchangeable Forming-and-Ceiling System or Two Dedicated Machines?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "purlin-line-vs-roof-panel-roll-forming-investment",
    "title": "Purlin Production or Roof-Panel Roll Forming: Which Factory Investment?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "snap-lock-vs-mechanically-seamed-roof-panel-production",
    "title": "Snap-Lock or Mechanically Seamed Standing-Seam Panel Production?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "standing-seam-panel-brake-folding-vs-roll-forming-line",
    "title": "Short Standing-Seam Orders: Brake Folding or a Roll-Forming Line?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "fixed-width-vs-adjustable-width-standing-seam-roll-former",
    "title": "Fixed-Width or Adjustable-Width Standing-Seam Roll Former?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-former-driven-tooling-vs-separate-drive-rollers",
    "title": "Roof-Panel Former: Driven Forming Rolls or Separate Drive Rollers?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-former-cassette-tooling-vs-conventional-roll-changes",
    "title": "Roof-Panel Roll Former: Cassette Tooling or Conventional Roll Changes?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-line-powered-decoiler-vs-pull-through-feed",
    "title": "Roof-Panel Feed System: Powered Decoiler or Pull-Through Arrangement?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-forming-conditioned-coil-vs-entry-leveler",
    "title": "Roof-Panel Production: Buy Conditioned Coil or Add Entry Leveling?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "gutter-production-vs-roof-panel-roll-forming-business",
    "title": "Gutter Production or Roof-Panel Roll Forming: Which First Business?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "standing-seam-inline-sealant-vs-separate-application-process",
    "title": "Standing-Seam Production: Inline Sealant or a Separate Application Process?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "sawtooth-multispan-roof-elevated-forming-vs-central-production-yard",
    "title": "Sawtooth Roof Panels: Elevated Forming at Each Receiver or a Central Yard?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "solar-array-roof-renewal-forming-package-vs-local-panel-repairs",
    "title": "Solar-Array Roof Work: Continuous Re-Roofing Package or Local Panel Repairs?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-forming-before-vs-after-factory-floor-slab",
    "title": "Roof-Panel Forming Before or After the Factory Floor Slab?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "factory-reroof-single-shutdown-vs-phased-forming-campaign",
    "title": "Factory Re-Roofing: One Shutdown or a Phased Forming Campaign?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "logistics-park-roof-panels-central-project-yard-vs-roving-forming-lift",
    "title": "Logistics-Park Roofing: Central Project Yard or a Roving Forming Lift?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "standing-seam-production-open-framing-vs-deck-supported-roofs",
    "title": "Standing-Seam Production for Open Framing or Deck-Supported Roofs?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "mobile-roof-panel-production-job-sized-coils-vs-recoiling-line",
    "title": "Mobile Roof Production: Buy Job-Sized Coils or Add a Recoiling Line?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "new-roof-panel-profile-pilot-production-vs-full-line-investment",
    "title": "New Roof-Panel Profile: Pilot Production or a Full Line Investment?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "plasterboard-vs-demountable-metal-ceiling-access-package",
    "title": "Plasterboard or Demountable Metal Ceilings: Buy Different Access Packages",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "stretched-fabric-vs-rigid-panel-ceiling-platform-package",
    "title": "Stretched Fabric or Rigid Ceiling Panels: Compare the Complete Installation",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "radiant-heated-chilled-ceiling-vs-passive-ceiling-access",
    "title": "Heated and Chilled Ceilings: Price More Than Panel Installation",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "swimming-pool-ceiling-refurbishment-floor-release-vs-specialist-access",
    "title": "Pool-Hall Ceiling Refurbishment: Release the Floor or Buy Specialist Access?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "auditorium-ceiling-refit-seat-removal-vs-retained-seating",
    "title": "Auditorium Ceiling Refit: Remove Seats or Retain Them?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "sports-hall-impact-ceiling-repair-vs-system-replacement",
    "title": "Sports-Hall Ceilings: Matched System Repair or Complete Renewal?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "gym-divider-curtain-vs-fixed-partition-installation-access",
    "title": "Gym Divider Curtains or Fixed Partitions: Compare Installation Access",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "acoustic-wall-retrofit-direct-panels-vs-framed-lining",
    "title": "Acoustic Wall Retrofit: Direct Panels or a Framed Lining?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "insulated-wall-panel-vs-rainscreen-facade-access-package",
    "title": "Insulated Wall Panels or Rainscreen Facades: Price the Installation Package",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "industrial-wall-recladding-zoned-vs-whole-elevation-renewal",
    "title": "Industrial Wall Recladding: Replace Selected Bays or the Whole Elevation?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "high-bay-lighting-retrofit-vs-complete-lighting-renewal-access",
    "title": "High-Bay Lighting: Component Retrofit or Complete System Renewal?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "sprinkler-retrofit-vs-network-replacement-access-package",
    "title": "Sprinkler Retrofit or Network Replacement: Buy the Correct Access Scope",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "overhead-steel-coating-spot-repair-vs-full-recoat-access",
    "title": "Overhead Steel Coatings: Spot Repairs or a Full Recoat Campaign?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "industrial-ceiling-cleaning-ground-reach-vs-work-platform",
    "title": "Industrial Ceiling Cleaning: Ground-Reach Equipment or a Work Platform?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "warehouse-bird-exclusion-netting-vs-rigid-lining-access",
    "title": "Warehouse Bird Exclusion: Netting or Rigid Lining Access Packages?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "overhead-busbar-vs-cable-tray-installation-access-package",
    "title": "Busbar or Cable-Tray Distribution: Compare Overhead Access Packages",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "industrial-door-operator-retrofit-vs-complete-door-replacement-access",
    "title": "Industrial Doors: Operator Retrofit or Complete Replacement Access?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "large-led-video-wall-service-vs-complete-display-replacement-access",
    "title": "Large LED Video Walls: Service Existing Modules or Replace the Display?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "food-factory-wall-refurbishment-hygienic-lining-vs-refinish",
    "title": "Food-Factory Wall Refurbishment: New Hygienic Lining or Refinish?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "external-wall-insulation-render-vs-rainscreen-access-package",
    "title": "External Wall Insulation: Rendered System or Rainscreen Access Package?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "roof-panel-production-turnkey-cell-vs-owner-integrated-equipment",
    "title": "Roof-Panel Production: Turnkey Cell or Owner-Integrated Equipment?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "relocate-roof-panel-forming-line-vs-buy-new-for-new-workshop",
    "title": "Relocate Your Roof-Panel Line or Buy New for the Next Workshop?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-production-private-label-vs-own-brand",
    "title": "Roof-Panel Production: Private-Label Supply or Your Own Brand?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-forming-local-vs-imported-coil-supply",
    "title": "Roof-Panel Roll Forming: Local or Imported Coil Supply?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "first-roof-panel-line-experienced-crew-vs-new-team",
    "title": "First Roof-Panel Line: Hire an Experienced Crew or Train a New Team?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-forming-operator-assisted-vs-automated-cell",
    "title": "Roof-Panel Roll Forming: Operator-Assisted Line or Automated Cell?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "steel-service-centre-add-roof-panel-roll-forming-vs-buy-panels",
    "title": "Steel Service Centre: Add Roof-Panel Roll Forming or Buy Finished Panels?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-forming-lift-business-dealer-resale-vs-owned-rental-fleet",
    "title": "Roof-Forming Lift Business: Dealer Resale or an Owned Rental Fleet?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "buy-roof-panel-manufacturing-business-vs-start-new-cell",
    "title": "Buy a Roof-Panel Manufacturing Business or Start a New Production Cell?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-factory-lease-existing-workshop-vs-purpose-built-plant",
    "title": "Roof-Panel Factory: Lease an Existing Workshop or Build a Dedicated Plant?",
    "cluster": "forming-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const NOVEMBER_10_CATCHUP_BUYER_ARTICLE_SLUGS = Object.freeze(NOVEMBER_10_CATCHUP_BUYER_ARTICLES.map(({ slug }) => slug));

// Ordinary November 10 daily quota, separate from the same-date catchup cohort.
export const NOVEMBER_10_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "ceiling-drilling-robot-vs-complete-platform-access-package",
    "title": "Ceiling Drilling Robot or Work Platform: Price the Complete Installation",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "used-vs-new-large-deck-ceiling-platform-purchase",
    "title": "Used or New Large-Deck Ceiling Platform: Compare the Ready-for-Work Purchase",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "naturally-curved-vs-mechanically-curved-roof-panel-production",
    "title": "Curved Metal Roofs: Straight-Panel Production or Mechanical Pre-Curving?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "integrated-roof-panel-forming-curving-vs-separate-machines",
    "title": "Curved Roof-Panel Production: One Integrated Machine or Separate Forming and Curving?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-coil-store-overhead-crane-vs-forklift-handling",
    "title": "Roof-Panel Coil Stores: Overhead Crane or Forklift Handling?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-forming-equipment-commission-agent-vs-stocking-distributor",
    "title": "Roof-Forming Equipment Sales: Commission Agent or Stocking Distributor?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-forming-equipment-cash-purchase-vs-hire-purchase-finance",
    "title": "Roof-Forming Equipment: Pay Cash or Use Hire-Purchase Finance?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "fabric-vs-metal-ductwork-personnel-access-package",
    "title": "Fabric or Metal Ductwork: Buy the Complete Overhead Access Package",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "unitized-vs-stick-curtain-wall-personnel-access-package",
    "title": "Unitized or Stick Curtain Wall: Price the Complete Access Package",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "insulated-roof-panel-production-continuous-line-vs-discontinuous-press",
    "title": "Insulated Roof-Panel Production: Continuous Line or Discontinuous Press?",
    "cluster": "forming-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const NOVEMBER_10_BUYER_ARTICLE_SLUGS = Object.freeze(NOVEMBER_10_BUYER_ARTICLES.map(({ slug }) => slug));

// November 11 ordinary daily quota.
export const NOVEMBER_11_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "steel-framing-roll-former-vs-roof-panel-production-line",
    "title": "Steel Framing or Roof Panels: Which Roll-Forming Business Should You Build?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "perforated-acoustic-roof-liner-vs-weather-sheet-production",
    "title": "Perforated Acoustic Roof Liners or Weather Sheets: Choose the Production Business",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-embossed-coil-supply-vs-own-embossing-line",
    "title": "Textured Roof Panels: Buy Embossed Coil or Add an Embossing Line?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "fire-curtain-vs-compartment-wall-access-package",
    "title": "Retractable Fire Curtain or Compartment Wall: Price the Complete Installation Access",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "roof-panel-site-production-temporary-workshop-vs-open-yard",
    "title": "Temporary Workshop or Open Yard for Site Roof-Panel Production?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-protective-film-buy-laminated-coil-vs-applicator",
    "title": "Roof-Panel Protective Film: Buy Laminated Coil or Add an Applicator?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "high-bay-light-lowering-system-vs-platform-maintenance",
    "title": "High-Bay Light Lowering System or Platform-Based Maintenance?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "acoustic-spray-vs-suspended-ceiling-installation-access",
    "title": "Acoustic Spray or Suspended Ceiling: Buy the Complete Access Package",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "cut-to-length-flat-sheet-business-vs-roof-panel-roll-forming",
    "title": "Flat-Sheet Cutting Business or Roof-Panel Roll Forming?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "walkable-cleanroom-ceiling-vs-access-from-below",
    "title": "Walkable Cleanroom Ceiling or Service Access from Below?",
    "cluster": "ceiling-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const NOVEMBER_11_BUYER_ARTICLE_SLUGS = Object.freeze(NOVEMBER_11_BUYER_ARTICLES.map(({ slug }) => slug));

// November 12 ordinary daily quota.
export const NOVEMBER_12_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "reclaimed-metal-roof-panels-vs-new-formed-sheets",
    "title": "Reclaimed Metal Roof Panels or New Formed Sheets?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "prefabricated-roof-cassettes-vs-site-built-roof-package",
    "title": "Prefabricated Roof Cassettes or a Site-Built Roof Package?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "metal-roof-forming-vs-single-ply-roofing-contractor-investment",
    "title": "Metal Roof Forming or Single-Ply Roofing: Where Should a Contractor Invest?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "metal-roof-restoration-coating-vs-new-panel-replacement",
    "title": "Restore the Metal Roof with a Coating or Replace Its Panels?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "polycarbonate-roof-sheet-extrusion-vs-metal-roll-forming",
    "title": "Polycarbonate Roof-Sheet Extrusion or Metal Roll Forming?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-post-form-powder-coating-vs-prepainted-coil",
    "title": "Roof-Panel Finishing: Post-Form Powder Coating or Prepainted Coil?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "concrete-roof-tile-plant-vs-metal-roof-panel-business",
    "title": "Concrete Roof Tiles or Metal Roof Panels: Choose the Complete Production Business",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "industrial-facade-bmu-vs-ground-platform-maintenance",
    "title": "Permanent Facade BMU or Ground-Based Platform: Buy the Complete Maintenance Route",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "fabric-hangar-door-vs-horizontal-sliding-door-access",
    "title": "Fabric-Lifting or Sliding Hangar Door: Price the Full Installation Access",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "hvls-vs-distributed-industrial-fans-installation-access",
    "title": "Large HVLS Fans or Distributed Fans: Buy the Complete Installation Access",
    "cluster": "ceiling-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const NOVEMBER_12_BUYER_ARTICLE_SLUGS = Object.freeze(NOVEMBER_12_BUYER_ARTICLES.map(({ slug }) => slug));

// November 13 ordinary daily quota.
export const NOVEMBER_13_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "ground-assembled-whole-roof-vs-roof-level-forming",
    "title": "Ground-Assembled Roof Lift or Roof-Level Panel Forming?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "integrated-solar-roof-vs-separate-pv-panel-production",
    "title": "Integrated Solar Roof or Separate PV: What Should the Panel Producer Supply?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "modular-building-factory-roofs-vs-site-overroof-forming",
    "title": "Modular Buildings: Factory-Finished Roofs or a Separate Site Overroof?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-flashing-cell-long-folder-vs-press-brake",
    "title": "Roof-Panel Flashing Cell: Long Folder or Press Brake?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "natural-roof-smoke-vents-vs-mechanical-extraction-access",
    "title": "Natural Smoke Vents or Mechanical Extraction: Buy the Complete Access Package",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "freestanding-inplant-room-vs-full-height-partition-access",
    "title": "In-Plant Rooms: Freestanding Enclosure or Full-Height Partitions?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "radiant-tube-vs-warm-air-heaters-platform-installation",
    "title": "Radiant Tube or Warm-Air Heaters: Buy the Complete Installation Access",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "warehouse-beam-vs-aspirating-smoke-detection-access",
    "title": "Beam or Aspirating Smoke Detection: Price Warehouse Access",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "overhead-crane-on-site-repair-vs-workshop-overhaul-access",
    "title": "Overhead Crane Repair: On-Site Work or Workshop Overhaul?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "overhead-vs-floor-conveyor-installation-access",
    "title": "Overhead or Floor Conveyors: Price Installation and Service Access",
    "cluster": "ceiling-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const NOVEMBER_13_BUYER_ARTICLE_SLUGS = Object.freeze(NOVEMBER_13_BUYER_ARTICLES.map(({ slug }) => slug));

// November 14 ordinary daily quota.
export const NOVEMBER_14_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "roof-supported-roll-former-vs-ground-supported-lift",
    "title": "Roof-Supported Roll Former or Ground-Supported Forming Lift?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "reroof-temporary-cover-vs-phased-weather-closures",
    "title": "Reroofing an Occupied Building: Temporary Roof or Phased Closures?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "flat-to-pitched-roof-conversion-vs-same-geometry-renewal",
    "title": "Flat-to-Pitched Metal Roof Conversion or Same-Geometry Renewal?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "containerized-roof-panel-plant-vs-open-trailer-roll-former",
    "title": "Containerized Roof Panel Plant or Open Trailer Roll Former?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "high-rack-order-picker-vs-ceiling-maintenance-platform",
    "title": "High-Rack Order Picker or Ceiling Maintenance Platform?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "workpiece-positioner-vs-mobile-platform-fabrication-access",
    "title": "Fabrication Access: Position the Workpiece or Raise the Crew?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "construction-hoist-vs-ceiling-work-platform-purchase",
    "title": "Construction Hoist or Ceiling Work Platform: Buy the Correct Duty",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "ceiling-platform-elevated-travel-vs-repositioning",
    "title": "Ceiling Platforms: Pay for Elevated Travel or Plan Repositioning?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "hazardous-area-ceiling-platform-vs-alternative-work-package",
    "title": "Hazardous-Area Ceiling Work: Specialist Platform or a Different Work Package?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "ceiling-platform-consolidated-rental-vs-trade-hire",
    "title": "Ceiling Access: Consolidated Site Rental or Separate Trade Hire?",
    "cluster": "ceiling-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const NOVEMBER_14_BUYER_ARTICLE_SLUGS = Object.freeze(NOVEMBER_14_BUYER_ARTICLES.map(({ slug }) => slug));

// November 15 ordinary daily quota.
export const NOVEMBER_15_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "directional-vs-symmetrical-standing-seam-roof-production",
    "title": "Standing-Seam Roof Production: Directional Panels or a Symmetrical System?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "portable-roof-roll-former-exclusive-coil-program-vs-independent-sourcing",
    "title": "Portable Roof Roll Formers: Accept Exclusive Coil Supply or Source Independently?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "existing-standing-seam-wind-retrofit-vs-new-roof-panel-package",
    "title": "Reinforce an Existing Standing-Seam Roof or Buy Replacement Panels?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "faceted-roof-redesign-vs-continuous-freeform-roof-panels",
    "title": "A Faceted Roof Redesign or a Continuous Freeform Metal Skin?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "ceiling-platform-temporary-floor-propping-vs-alternative-access",
    "title": "Ceiling Platforms on Suspended Floors: Fund Temporary Propping or Change Access?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "occupied-ceiling-refit-protection-deck-vs-vacating-work-area",
    "title": "Occupied Ceiling Refits: Buy Overhead Protection or Vacate the Work Area?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "overhead-telescopic-platform-vs-floor-based-large-deck",
    "title": "Overhead Telescopic Work Platform or a Floor-Based Large Deck?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "rough-terrain-scissor-vs-crawler-large-deck-platform",
    "title": "Rough-Terrain Scissor Lift or a Crawler Large-Deck Platform?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "platform-rental-fleet-cross-hire-vs-new-equipment-purchase",
    "title": "Rental Fleet Gaps: Cross-Hire a Platform or Buy Another Asset?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "under-bridge-inspection-truck-vs-ground-based-work-platform",
    "title": "Under-Bridge Inspection Truck or a Ground-Based Work Platform?",
    "cluster": "ceiling-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const NOVEMBER_15_BUYER_ARTICLE_SLUGS = Object.freeze(NOVEMBER_15_BUYER_ARTICLES.map(({ slug }) => slug));

// November 16 ordinary daily quota.
export const NOVEMBER_16_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "roof-panel-roll-tooling-recondition-vs-new-roll-set",
    "title": "Roof Panel Roll Tooling: Recut the Existing Set or Buy New Rolls?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "portable-roof-roll-former-fixed-drive-vs-modular-power-pack",
    "title": "Portable Roof Roll Formers: Choose a Fixed Drive or Modular Power Pack",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-deliveries-returnable-racks-vs-one-way-packaging",
    "title": "Roof Panel Deliveries: When Is a Returnable Rack Fleet Worth Buying?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "industrial-rooflights-vs-high-wall-glazing-panel-production",
    "title": "Rooflights or High Wall Glazing: Which Metal Roof Panels Must You Produce?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "atrium-platform-crane-in-vs-compact-doorway-access",
    "title": "Atrium Access: Bring a Compact Platform Through the Doors or Crane One In?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "inside-vs-outside-glazed-curtain-wall-replacement-access",
    "title": "Inside- or Outside-Glazed Curtain Walls: Buy a Usable Glass Replacement Route",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "rolling-steel-door-curtain-production-vs-roof-panel-line",
    "title": "Rolling Steel Door Curtains or Roof Panels: Which Production Business?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "asbestos-ceiling-refurbishment-managed-retention-vs-specialist-removal",
    "title": "Asbestos in a Factory Ceiling: Manage Retained Material or Fund Removal First?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "raised-access-floor-vs-overhead-services-platform-package",
    "title": "Raised Access Floor or Overhead Services: What Ceiling Access Should You Buy?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "factory-bay-overhead-crane-vs-freestanding-workstation-cranes",
    "title": "Factory Bay Crane or Freestanding Workstation Cranes: Price the Installation Access",
    "cluster": "ceiling-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const NOVEMBER_16_BUYER_ARTICLE_SLUGS = Object.freeze(NOVEMBER_16_BUYER_ARTICLES.map(({ slug }) => slug));

// Separately authorized overtime campaign. Its date may match an ordinary release.
export const OVERTIME_20261116_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "roof-panel-coil-upender-vs-specified-delivery-orientation",
    "title": "Roof Panel Coil Supply: Buy an Upender or Specify Delivery Orientation?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-reception-individual-vacuum-picks-vs-bundle-delivery",
    "title": "Roof Panel Reception: Individual Vacuum Picks or Whole Bundles?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-roll-forming-strip-accumulator-vs-coil-batch-stops",
    "title": "Roof Roll Forming: Fund Continuous Strip Entry or Stop Between Coils?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-packing-automatic-unitizing-vs-staffed-packing-station",
    "title": "Roof Panel Dispatch: Buy Automatic Packaging or Staff a Packing Station?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "standing-seam-roof-clips-buy-approved-vs-in-house-stamping",
    "title": "Standing-Seam Roof Clips: Buy Approved Components or Invest in Stamping?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "metal-roof-assembly-testing-own-facility-vs-independent-lab",
    "title": "Metal Roof Assembly Testing: Build a Test Facility or Buy Laboratory Services?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "metal-roof-panels-project-cut-list-vs-site-length-trimming",
    "title": "Metal Roof Panels: Release a Cut-to-Length Kit or Allow Final Site Trimming?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-geometry-laser-scan-vs-measured-bay-survey",
    "title": "Roof Panel Orders: Buy a 3D Survey or Measure the Bays Directly?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-coil-store-automated-retrieval-vs-conventional-storage",
    "title": "Roof Panel Coil Stores: Automate Retrieval or Keep Conventional Storage?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-level-forming-public-street-occupation-vs-private-footprint",
    "title": "Roof-Level Forming: Pay for Street Occupation or Use a Private Production Site?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-forming-lift-overhead-line-diversion-vs-alternative-production-route",
    "title": "Overhead Lines at a Roof Project: Buy Utility Intervention or Change the Panel Route?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-forming-handover-permanent-vs-temporary-edge-protection",
    "title": "Roof Panel Handover: Buy Permanent Edge Protection or a Temporary Construction Package?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "welded-stainless-roof-vs-mechanically-jointed-panel-production",
    "title": "Welded Stainless Roofs or Mechanically Jointed Panels: Which Work Can Your Line Supply?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "rooftop-plant-nonpenetrating-supports-vs-structural-support-package",
    "title": "Rooftop Plant Supports: Surface Frames or Supports Connected to the Structure?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "metal-roof-snow-retention-vs-designed-shedding-zone",
    "title": "Metal Roof Procurement: Include Snow Retention or Reserve a Designed Shedding Zone?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-tooling-in-house-manufacture-vs-commissioned-toolsets",
    "title": "Roof Panel Roll Tooling: Build a Toolroom or Commission Complete Sets?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-weathertightness-program-vs-separate-material-and-installation-cover",
    "title": "Metal Roof Orders: Price a Weathertightness Program or Separate Product and Installation Cover?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-project-mockup-vs-retained-first-bay",
    "title": "Roof Panel Mockups: Build a Separate Assembly or Keep the Accepted First Bay?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-flashing-field-brake-vs-delivered-shop-formed-trim",
    "title": "Roof Flashings: Deploy a Field Brake or Deliver Finished Shop Trim?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "hydrostatic-vs-water-shedding-metal-roof-panel-production",
    "title": "Water-Barrier or Water-Shedding Metal Roof: Which Panel Orders Can You Produce?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "aircraft-maintenance-docking-vs-mobile-access-platform",
    "title": "Aircraft Maintenance Docks or Mobile Platforms for a Hangar?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "integrated-telehandler-work-platform-vs-dedicated-mewp",
    "title": "Integrated Telehandler Work Platform or Dedicated MEWP?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "cast-in-channels-vs-post-installed-overhead-service-supports",
    "title": "Overhead Service Supports: Cast-In Channels or Post-Installed Anchors?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "siphonic-vs-gravity-roof-drainage-installation-access",
    "title": "Siphonic or Gravity Roof Drainage: Price the High-Level Pipework",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "welding-fume-extraction-central-system-vs-mobile-units",
    "title": "Welding Fume Extraction: Central Ductwork or Mobile Units?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "data-centre-aisle-containment-rack-supported-vs-freestanding",
    "title": "Data Centre Aisle Containment: Rack-Supported or Freestanding?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "event-lighting-truss-ground-supported-vs-flown-access",
    "title": "Event Lighting Truss: Fly It or Buy Ground Support?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "concrete-soffit-patch-repair-vs-cathodic-protection-access",
    "title": "Concrete Soffit Repair: Price Patching and Cathodic Protection Access",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "external-vs-internal-solar-shading-facade-maintenance-access",
    "title": "Commercial Solar Shading: Exterior Screens or Interior Blinds?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "etfe-cushions-vs-single-layer-foil-facade-access",
    "title": "ETFE Facades: Air Cushions or Mechanically Tensioned Foil?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "roro-vs-lolo-shipping-large-work-platforms",
    "title": "Ship a Large Work Platform by RoRo or LoLo?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "articulating-vs-telescopic-boom-lifts-wall-access",
    "title": "Articulating or Telescopic Boom Lift for Wall Access?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "access-platform-fleet-telematics-vs-dispatch-records",
    "title": "Access Fleet Telematics or Dispatch Records: What Is Worth Buying?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "work-platform-field-repair-vs-workshop-return",
    "title": "Repair the Work Platform on Site or Return It to the Workshop?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "rail-depot-track-mounted-vs-floor-based-work-platform",
    "title": "Rail Depot Access: Rail-Mounted Plant or a Floor-Based Platform?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "facade-platform-access-temporary-trackway-vs-permanent-road",
    "title": "Facade Platform Access: Hire Trackway or Build the Service Road Early?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "mewp-training-centre-investment-vs-external-course-places",
    "title": "MEWP Training: Become an Approved Centre or Buy Course Places?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "temporary-hall-lighting-mobile-towers-vs-suspended-luminaires",
    "title": "Temporary Hall Lighting: Mobile Towers or Suspended Fixtures?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "portable-vs-ceiling-suspended-basketball-backstop-access",
    "title": "Basketball Backstops: Portable Floor Units or Ceiling Suspension?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "removable-valve-insulation-vs-fixed-cladding-high-level-access",
    "title": "High-Level Valve Insulation: Removable Covers or Fixed Cladding?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "roll-forming-equipment-letter-of-credit-vs-documentary-collection",
    "title": "Roll-Forming Equipment Imports: Letter of Credit or Documentary Collection?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roll-forming-lift-import-fca-vs-fob-delivery-point",
    "title": "FCA or FOB for a Roll-Forming Lift Import? Match the Actual Handover",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "packed-roll-forming-machine-lcl-vs-dedicated-container",
    "title": "Packed Roll-Forming Machines: LCL Consolidation or a Dedicated Container?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roll-forming-equipment-export-wood-vs-steel-packing",
    "title": "Roll-Forming Equipment Export Packing: Timber Crate or Engineered Steel Base?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roll-forming-machine-shipping-vci-vs-desiccant-barrier",
    "title": "Roll-Forming Machine Preservation: VCI Package or Desiccant Barrier?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roll-forming-lift-cargo-insurance-vs-carrier-liability",
    "title": "Imported Roll-Forming Lifts: Cargo Cover or Carrier Liability Alone?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roll-forming-equipment-spares-air-freight-vs-ocean-replenishment",
    "title": "Roll-Forming Equipment Spares: Urgent Air Freight or Planned Ocean Replenishment?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roll-forming-equipment-us-port-clearance-vs-inland-in-bond",
    "title": "US Roll-Forming Equipment Imports: Clear at the Seaport or Move In-Bond Inland?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roll-forming-lift-direct-ocean-service-vs-transshipment",
    "title": "Roll-Forming Lift Shipping: Direct Ocean Service or a Transshipment Route?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roll-forming-machine-container-live-unload-vs-drop-delivery",
    "title": "Roll-Forming Machine Container Delivery: Live Unload or Drop and Collect?",
    "cluster": "forming-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const OVERTIME_20261116_BUYER_ARTICLE_SLUGS = Object.freeze(OVERTIME_20261116_BUYER_ARTICLES.map(({ slug }) => slug));

// Ordinary daily guides on the same date as the separately authorized overtime campaign.
export const NOVEMBER_17_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "roof-panel-coil-consignment-vs-owned-stock",
    "title": "Roof-Panel Coil: Buy the Stock or Draw from Consignment?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "metal-shingle-production-contract-stamping-vs-owned-press-line",
    "title": "Metal Roofing Shingles: Contract the Stamping or Buy a Press Line?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "industrial-metal-roof-permanent-safety-mesh-vs-temporary-net-package",
    "title": "Metal Roof Installation: Permanent Safety Mesh or Temporary Safety Nets?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "metal-roof-replacement-equipment-hatch-vs-removable-roof-opening",
    "title": "Plant Replacement Through a Metal Roof: Equipment Hatch or Removable Roof Section?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "ventilated-vs-unventilated-standing-seam-roof-package",
    "title": "Standing-Seam Zinc Roofing: Price a Ventilated or Unventilated Assembly?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "large-deck-ceiling-platform-single-type-vs-mixed-fleet",
    "title": "Ceiling Platform Fleet: Standardize Large Decks or Buy a Mixed Fleet?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "industrial-crane-electrification-festoon-vs-conductor-bar-access",
    "title": "Crane Electrification: Festoon Cables or Conductor Rails—and What Access to Buy?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "grooved-vs-welded-overhead-pipework-platform-installation",
    "title": "Overhead Pipework: Grooved or Welded Joints—and the Full Access Cost?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "overhead-cable-support-ladder-vs-wire-basket-installation-access",
    "title": "Cable Ladder or Wire Basket: Buy the Support System and Installation Access",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "industrial-noise-control-machine-enclosure-vs-room-treatment-access",
    "title": "Factory Noise Control: Enclose the Machine or Treat the Room?",
    "cluster": "ceiling-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const NOVEMBER_17_BUYER_ARTICLE_SLUGS = Object.freeze(NOVEMBER_17_BUYER_ARTICLES.map(({ slug }) => slug));

// Fifty ordinary daily guides under the one-day quota override; prior cohorts retained.
export const NOVEMBER_18_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "roof-panel-coil-pvdf-vs-smp-finish",
    "title": "Roof-Panel Coil: PVDF or SMP Finish for Your Product Range?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-coil-galvanized-vs-aluminium-zinc-coated-steel",
    "title": "Roof-Panel Coil: Galvanized Steel or an Aluminium-Zinc Alloy Coating?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "titanium-zinc-roof-panel-production-vs-coated-steel-range",
    "title": "Titanium-Zinc Roof Panels or Coated-Steel Roofing: Which Production Range?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "copper-standing-seam-roof-production-vs-coated-steel",
    "title": "Copper Standing-Seam Roof Production or a Coated-Steel Product Range?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "cool-roof-rated-coil-finish-vs-standard-colour-range",
    "title": "Cool-Roof Coil: A Rated Reflective Finish or Your Standard Colour Range?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "zinc-roof-panels-natural-vs-preweathered-surface",
    "title": "Zinc Roof Panels: Natural Weathering or a Factory-Preweathered Surface?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "soffit-panel-roll-forming-vs-roof-weather-sheet-line",
    "title": "Soffit Panels or Roof Weather Sheets: Which Roll-Forming Product to Add?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "aluminium-roof-panel-alloy-temper-material-qualification",
    "title": "Aluminium Roof-Panel Coil: Qualify Alloy and Temper Before Substitution",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "cap-seam-vs-folded-standing-seam-roof-production",
    "title": "Separate-Cap or Folded Standing-Seam Roofing: Buy the Complete Product Route",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-high-strength-thin-vs-thicker-ductile-steel",
    "title": "Roof-Panel Coil: High-Strength Thin Steel or a Thicker Ductile Grade?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-supply-epd-backed-projects-vs-commodity-orders",
    "title": "Roof-Panel Supply: Build an EPD-Backed Project Range or Serve Commodity Orders?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-profile-depth-vs-support-spacing-production",
    "title": "Roof-Panel Production: Deeper Profiles or More Roof Supports?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-production-scrap-loose-collection-vs-baler",
    "title": "Roof-Panel Production Scrap: Loose Collection or an Owned Metal Baler?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "metal-roof-panel-fire-performance-product-supply-scope",
    "title": "Fire-Specified Metal Roof Orders: Sell Sheets or a Defined Roof Assembly?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "hail-resistant-metal-roof-panel-production-tested-assembly",
    "title": "Hail-Resistant Roof-Panel Orders: Qualify the Assembly Before Buying Heavier Coil",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "acoustic-metal-roof-perforated-liner-vs-separate-absorption",
    "title": "Acoustic Metal Roofs: Perforated Liners or Separate Room Absorption?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "metal-roof-rain-noise-tested-assembly-vs-heavy-roof",
    "title": "Rain Noise: Buy a Tested Metal Roof Assembly or a Heavier Roof?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "coastal-industrial-roof-aluminium-vs-coated-steel-package",
    "title": "Coastal Industrial Roofs: Aluminium or Coated-Steel Supply Packages?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "industrial-metal-roof-external-gutters-vs-internal-box-gutters",
    "title": "Industrial Metal Roofs: External Eaves Gutters or Internal Box Gutters?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "metal-roof-building-movement-joint-vs-continuous-panel-fields",
    "title": "Long Metal Roofs: Building-Movement Joints or Continuous Panel Fields?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "metal-roof-service-penetrations-grouped-zone-vs-distributed-curbs",
    "title": "Metal Roof Services: Grouped Penetration Zones or Distributed Curbs?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "industrial-roof-structural-liner-trays-vs-purlins-liner-sheets",
    "title": "Industrial Roof Packages: Structural Liner Trays or Purlins and Liner Sheets?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "loading-bay-metal-roof-freestanding-canopy-vs-building-extension",
    "title": "Loading-Bay Metal Roofs: Freestanding Canopy or Building-Attached Extension?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "livestock-metal-roof-covered-ridge-vs-controlled-envelope",
    "title": "Livestock Metal Roofs: Covered Open Ridge or a Mechanically Controlled Envelope?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "industrial-metal-roof-rainwater-reuse-vs-discharge-only",
    "title": "Industrial Metal Roofs: Rainwater Reuse Package or Discharge Only?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "standing-seam-roof-permanent-walkways-vs-temporary-maintenance-access",
    "title": "Standing-Seam Roofs: Permanent Walkways or Recurring Temporary Access?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "standing-seam-roof-lightning-protection-mounted-vs-isolated-system",
    "title": "Standing-Seam Roofs: Roof-Mounted or Isolated Lightning Protection Packages?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "industrial-storage-fabric-hall-vs-metal-roof-warehouse",
    "title": "Industrial Storage: Fabric Hall or Metal-Roof Warehouse Package?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "industrial-rooflights-continuous-strips-vs-distributed-units",
    "title": "Industrial Roof Daylight: Continuous Rooflight Strips or Distributed Units?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "metal-roof-curbs-prefabricated-vs-site-fabricated-package",
    "title": "Metal Roof Curbs: Prefabricated Assemblies or Site-Fabricated Details?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "industrial-entry-air-curtain-vs-entrance-vestibule",
    "title": "Industrial Entrances: Air Curtain or Physical Vestibule?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "high-bay-public-address-distributed-speakers-vs-suspended-array",
    "title": "High-Bay Public Address: Distributed Speakers or Suspended Arrays?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "compressed-air-aluminium-modular-vs-steel-header-installation",
    "title": "Compressed-Air Headers: Modular Aluminium or Steel Pipe?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "preinsulated-duct-panels-vs-metal-duct-site-insulation",
    "title": "HVAC Ducts: Preinsulated Panels or Metal with Site Insulation?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "high-speed-industrial-door-fabric-vs-rigid-rolling-installation",
    "title": "High-Speed Industrial Doors: Fabric or Rigid Rolling Construction?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "industrial-wall-louvres-stationary-vs-operable-installation",
    "title": "Industrial Wall Louvres: Stationary Blades or Operable Control?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "overhead-duct-cleaning-access-doors-vs-section-removal",
    "title": "Overhead Duct Cleaning: Add Access Doors or Remove Duct Sections?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "fire-rated-duct-protection-wrap-vs-board-enclosure",
    "title": "Fire-Rated Duct Protection: Flexible Wrap or Board Enclosure?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "warehouse-wifi-directional-vs-omnidirectional-high-bay-access",
    "title": "Warehouse Wi-Fi: Directional Aisle Coverage or Ceiling Omnidirectional Access Points?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "high-wall-daylighting-diffuse-panels-vs-transparent-glazing",
    "title": "High Wall Daylighting: Diffuse Panels or Transparent Glazing?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "industrial-humidification-direct-room-nozzles-vs-duct-steam",
    "title": "Industrial Humidification: Direct-Room Nozzles or Duct Steam?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "industrial-wall-movement-joints-sealant-vs-cover-system",
    "title": "Industrial Wall Movement Joints: Sealant Detail or Cover System?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "large-hall-projection-vs-led-display-installation-access",
    "title": "Large-Hall Displays: Projection or Direct-View LED Installation?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "overhead-cable-installation-manual-vs-powered-pulling-package",
    "title": "Overhead Cable Installation: Manual Handling or Powered Pulling Package?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "precast-wall-connections-bolted-vs-site-welded-access-package",
    "title": "Precast Wall Connections: Bolted System or Site-Welded Package?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "overhead-pipe-expansion-loops-vs-bellows-platform-access",
    "title": "Overhead Pipe Expansion: Loops or Bellows—and the Access Package?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "mep-supports-modular-channel-vs-welded-steel-platform-access",
    "title": "MEP Support Racks: Modular Channels or Welded Steel?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "compressed-air-ring-main-vs-branch-layout-platform-installation",
    "title": "Compressed-Air Pipework: Ring Main or Branched Layout—and Access?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "high-level-cable-penetrations-modular-transits-vs-sealant",
    "title": "High-Level Cable Penetrations: Modular Transits or Sealed Openings?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "indoor-drone-inspection-own-team-vs-contracted-surveys",
    "title": "Indoor Drone Inspection: Own the Team or Contract the Surveys?",
    "cluster": "ceiling-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const NOVEMBER_18_BUYER_ARTICLE_SLUGS = Object.freeze(NOVEMBER_18_BUYER_ARTICLES.map(({ slug }) => slug));

// Ten ordinary daily guides; preceding cohorts and the fulfilled one-day override retained.
export const NOVEMBER_19_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "roof-panel-roll-former-chain-vs-geared-transmission",
    "title": "Roof-Panel Roll Formers: Chain Drive or Geared Transmission?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-former-profile-shear-vs-saw-cutoff",
    "title": "Roof-Panel Cutoff: Profile Shear or Saw?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-former-cantilever-vs-through-shaft-stands",
    "title": "Roll-Former Stands: Cantilever or Through-Shaft Support?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-tooling-segmented-vs-one-piece-rolls",
    "title": "Roof-Panel Roll Tooling: Segmented Rolls or One-Piece Rolls?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-former-dry-forming-vs-lubrication-package",
    "title": "Roof-Panel Roll Formers: Dry Forming or a Lubrication Package?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-panel-roll-tooling-coated-vs-uncoated-working-surfaces",
    "title": "Roof-Panel Roll Tooling: Coated Working Surfaces or Uncoated Tool Steel?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "battery-electric-ceiling-platform-lithium-ion-vs-lead-acid",
    "title": "Battery-Electric Ceiling Platforms: Lithium-Ion or Lead-Acid?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "hydraulic-forming-lift-fleet-offline-filtration-vs-oil-replacement",
    "title": "Hydraulic Forming-Lift Fleets: Add Offline Filtration or Replace the Oil?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "containerized-forming-equipment-shipper-owned-vs-carrier-container",
    "title": "Containerized Forming Equipment: Shipper-Owned or Carrier-Owned Container?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "forming-lift-fleet-import-one-shipment-vs-staged-complete-units",
    "title": "Importing a Forming-Lift Fleet: One Shipment or Staged Complete Units?",
    "cluster": "forming-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const NOVEMBER_19_BUYER_ARTICLE_SLUGS = Object.freeze(NOVEMBER_19_BUYER_ARTICLES.map(({ slug }) => slug));

// Ten overdue November20 quota guides created November21; all preceding cohorts and fulfilled overrides retained.
export const NOVEMBER_20_BUYER_ARTICLES = Object.freeze([
  {
    "slug": "roof-flashing-folder-single-direction-vs-up-down",
    "title": "Roof-Flashing Folders: Single-Direction or Up-and-Down Bending?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roof-flashing-blanks-guillotine-vs-coil-cut-to-length",
    "title": "Roof-Flashing Blanks: Sheet Guillotine or Coil-Fed Cut-to-Length Cell?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "forming-lift-hydraulic-pump-new-vs-oem-reman-exchange",
    "title": "Forming-Lift Hydraulic Pumps: New OEM Unit or Remanufactured Exchange?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "retired-roof-forming-lift-auction-vs-negotiated-sale",
    "title": "Retiring a Roof-Forming Lift: Auction or Negotiated Sale?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "eu-forming-machinery-purchase-january-2027-transition",
    "title": "Buying Forming Machinery for the EU Across the January 2027 Change",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "us-forming-lift-import-diesel-engine-vs-engine-free-package",
    "title": "US Forming-Lift Imports: Diesel-Equipped or an Actual Engine-Free Package?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "forming-equipment-distributor-private-brand-vs-maker-brand",
    "title": "Forming-Equipment Distribution: Your Brand or the Manufacturer’s Name?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "large-deck-platform-extended-warranty-vs-funded-repair-risk",
    "title": "Large-Deck Platform Purchase: Extended Warranty or Funded Repair Risk?",
    "cluster": "ceiling-buyer-decision"
  },
  {
    "slug": "ontario-roll-forming-line-certification-vs-field-evaluation",
    "title": "Roll-Forming Lines for Ontario: Certification or Field Evaluation?",
    "cluster": "forming-buyer-decision"
  },
  {
    "slug": "roll-forming-lift-advance-payment-guarantee-vs-escrow",
    "title": "Roll-Forming Lift Advances: Bank Guarantee or Escrow?",
    "cluster": "forming-buyer-decision"
  }
].map(article => Object.freeze(article)));
export const NOVEMBER_20_BUYER_ARTICLE_SLUGS = Object.freeze(NOVEMBER_20_BUYER_ARTICLES.map(({ slug }) => slug));

// Only reviewed, explicitly registered cohorts select the buyer audit and layout.
// Publication metadata cannot grant itself a different content standard.
export const BUYER_ARTICLE_COHORTS = Object.freeze([
  Object.freeze({ date: '2026-10-27', standard: 'buyer-2026-10-27', articles: OCTOBER_27_BUYER_ARTICLES, slugs: OCTOBER_27_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ date: '2026-10-28', standard: 'buyer-2026-10-28', articles: OCTOBER_28_BUYER_ARTICLES, slugs: OCTOBER_28_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ date: '2026-10-29', standard: 'buyer-2026-10-29', articles: OCTOBER_29_BUYER_ARTICLES, slugs: OCTOBER_29_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ date: '2026-10-30', standard: 'buyer-2026-10-30', articles: OCTOBER_30_BUYER_ARTICLES, slugs: OCTOBER_30_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ date: '2026-10-31', standard: 'buyer-2026-10-31', articles: OCTOBER_31_BUYER_ARTICLES, slugs: OCTOBER_31_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ date: '2026-11-01', standard: 'buyer-2026-11-01', articles: NOVEMBER_01_BUYER_ARTICLES, slugs: NOVEMBER_01_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ date: '2026-11-02', standard: 'buyer-2026-11-02', articles: NOVEMBER_02_BUYER_ARTICLES, slugs: NOVEMBER_02_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ date: '2026-11-03', standard: 'buyer-2026-11-03', articles: NOVEMBER_03_BUYER_ARTICLES, slugs: NOVEMBER_03_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ date: '2026-11-09', standard: 'buyer-2026-11-09', articles: NOVEMBER_09_BUYER_ARTICLES, slugs: NOVEMBER_09_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ id: 'catchup-20261104-08', date: '2026-11-10', standard: 'buyer-2026-11-10', articles: NOVEMBER_10_CATCHUP_BUYER_ARTICLES, slugs: NOVEMBER_10_CATCHUP_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ id: 'daily-20261110', date: '2026-11-10', standard: 'buyer-2026-11-10', articles: NOVEMBER_10_BUYER_ARTICLES, slugs: NOVEMBER_10_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ id: 'daily-20261111', date: '2026-11-11', standard: 'buyer-2026-11-11', articles: NOVEMBER_11_BUYER_ARTICLES, slugs: NOVEMBER_11_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ id: 'daily-20261112', date: '2026-11-12', standard: 'buyer-2026-11-12', articles: NOVEMBER_12_BUYER_ARTICLES, slugs: NOVEMBER_12_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ id: 'daily-20261113', date: '2026-11-13', standard: 'buyer-2026-11-13', articles: NOVEMBER_13_BUYER_ARTICLES, slugs: NOVEMBER_13_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ id: 'daily-20261114', date: '2026-11-14', standard: 'buyer-2026-11-14', articles: NOVEMBER_14_BUYER_ARTICLES, slugs: NOVEMBER_14_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ id: 'daily-20261115', date: '2026-11-15', standard: 'buyer-2026-11-15', articles: NOVEMBER_15_BUYER_ARTICLES, slugs: NOVEMBER_15_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ id: 'daily-20261116', date: '2026-11-16', standard: 'buyer-2026-11-16', articles: NOVEMBER_16_BUYER_ARTICLES, slugs: NOVEMBER_16_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ id: 'overtime-20261116-50', date: '2026-11-17', standard: 'buyer-2026-11-17', articles: OVERTIME_20261116_BUYER_ARTICLES, slugs: OVERTIME_20261116_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ id: 'daily-20261117', date: '2026-11-17', standard: 'buyer-2026-11-17', articles: NOVEMBER_17_BUYER_ARTICLES, slugs: NOVEMBER_17_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ id: 'daily-20261118', date: '2026-11-18', standard: 'buyer-2026-11-18', articles: NOVEMBER_18_BUYER_ARTICLES, slugs: NOVEMBER_18_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ id: 'daily-20261119', date: '2026-11-19', standard: 'buyer-2026-11-19', articles: NOVEMBER_19_BUYER_ARTICLES, slugs: NOVEMBER_19_BUYER_ARTICLE_SLUGS }),
  Object.freeze({ id: 'daily-20261120', date: '2026-11-21', standard: 'buyer-2026-11-21', articles: NOVEMBER_20_BUYER_ARTICLES, slugs: NOVEMBER_20_BUYER_ARTICLE_SLUGS }),
]);
export const BUYER_ARTICLES = Object.freeze(BUYER_ARTICLE_COHORTS.flatMap(cohort => cohort.articles));
export const BUYER_ARTICLE_SLUGS = Object.freeze(BUYER_ARTICLES.map(article => article.slug));
export function buyerCohortForSlug(slug) {
  return BUYER_ARTICLE_COHORTS.find(cohort => cohort.slugs.includes(slug));
}

export const ALL_LIFT_PLATFORM_ARTICLES = Object.freeze([
  ...LIFT_PLATFORM_ARTICLES,
  ...DAILY_LIFT_PLATFORM_ARTICLES,
  ...AUGUST_10_LIFT_PLATFORM_ARTICLES,
  ...AUGUST_13_LIFT_PLATFORM_ARTICLES,
  ...OCTOBER_23_LIFT_PLATFORM_ARTICLES,
  ...OCTOBER_24_CAMPAIGN_DAY1_ARTICLES,
  ...OCTOBER_25_CAMPAIGN_DAY2_ARTICLES,
  ...OCTOBER_26_CAMPAIGN_DAY3_ARTICLES,
  ...OCTOBER_27_BUYER_ARTICLES,
  ...OCTOBER_28_BUYER_ARTICLES,
  ...OCTOBER_29_BUYER_ARTICLES,
  ...OCTOBER_30_BUYER_ARTICLES,
  ...OCTOBER_31_BUYER_ARTICLES,
  ...NOVEMBER_01_BUYER_ARTICLES,
  ...NOVEMBER_02_BUYER_ARTICLES,
  ...NOVEMBER_03_BUYER_ARTICLES,
  ...NOVEMBER_09_BUYER_ARTICLES,
  ...NOVEMBER_10_CATCHUP_BUYER_ARTICLES,
  ...NOVEMBER_10_BUYER_ARTICLES,
  ...NOVEMBER_11_BUYER_ARTICLES,
  ...NOVEMBER_12_BUYER_ARTICLES,
  ...NOVEMBER_13_BUYER_ARTICLES,
  ...NOVEMBER_14_BUYER_ARTICLES,
  ...NOVEMBER_15_BUYER_ARTICLES,
  ...NOVEMBER_16_BUYER_ARTICLES,
  ...OVERTIME_20261116_BUYER_ARTICLES,
  ...NOVEMBER_17_BUYER_ARTICLES,
  ...NOVEMBER_18_BUYER_ARTICLES,
  ...NOVEMBER_19_BUYER_ARTICLES,
  ...NOVEMBER_20_BUYER_ARTICLES,
]);

export const ALL_LIFT_PLATFORM_ARTICLE_SLUGS = Object.freeze(ALL_LIFT_PLATFORM_ARTICLES.map(({ slug }) => slug));
