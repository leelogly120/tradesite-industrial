// Explicitly reviewed revisions; original creation cohorts remain unchanged.
export const REVIEWED_BUYER_UPDATES = Object.freeze([
  {
    "slug": "factory-made-roof-panels-vs-on-site-roll-forming",
    "title": "Factory-Made Roof Panels or On-Site Roll Forming? A Contractor's Buying Guide",
    "date": "2026-10-27",
    "updated": "2026-11-02"
  },
  {
    "slug": "roof-panel-roll-forming-production-bottleneck-planning",
    "title": "Roof-Panel Roll Forming: Size the Package Around the Real Bottleneck",
    "date": "2026-10-27",
    "updated": "2026-11-02"
  },
  {
    "slug": "multi-profile-roof-panel-roll-former-vs-dedicated-lines",
    "title": "One Roof-Panel Former for Multiple Profiles or Separate Lines?",
    "date": "2026-10-27",
    "updated": "2026-11-02"
  },
  {
    "slug": "one-roll-forming-lift-vs-two-concurrent-projects",
    "title": "One Roll-Forming Lift or Two? Plan for Overlapping Roofing Projects",
    "date": "2026-10-27",
    "updated": "2026-11-02"
  },
  {
    "slug": "peb-roof-forming-and-cladding-access-equipment-package",
    "title": "PEB Roofing and Cladding: Choose the Right Forming and Access Package",
    "date": "2026-10-27",
    "updated": "2026-11-02"
  },
  {
    "slug": "occupied-factory-reroofing-roll-forming-lift-selection",
    "title": "Roll-Forming Lifts for Re-Roofing an Occupied Factory",
    "date": "2026-10-27",
    "updated": "2026-11-02"
  },
  {
    "slug": "aircraft-hangar-ceiling-installation-platform-selection",
    "title": "Ceiling Platforms for Aircraft Hangar Installation Work",
    "date": "2026-10-27",
    "updated": "2026-11-02"
  },
  {
    "slug": "roll-forming-lift-distributor-demo-unit-vs-project-orders",
    "title": "Roll-Forming Lift Distributors: Stock a Demo or Order to Project?",
    "date": "2026-10-27",
    "updated": "2026-11-02"
  },
  {
    "slug": "roof-panel-roll-forming-material-yield-cost",
    "title": "Roof-Panel Roll Forming: Compare Cost per Accepted Panel",
    "date": "2026-10-27",
    "updated": "2026-11-02"
  },
  {
    "slug": "shared-ceiling-platform-multitrade-fitout-sequence",
    "title": "One Shared Ceiling Platform or Separate Access for Each Trade?",
    "date": "2026-10-27",
    "updated": "2026-11-02"
  },
  {
    "slug": "fixed-roof-panel-factory-line-vs-mobile-site-production",
    "title": "Fixed Roof-Panel Factory or Mobile Site Production? Where to Put Your First Line",
    "date": "2026-10-28",
    "updated": "2026-11-02"
  },
  {
    "slug": "roof-forming-lift-main-height-vs-occasional-high-projects",
    "title": "Roof-Forming Lift: Buy for Regular Work or Higher Projects?",
    "date": "2026-10-28",
    "updated": "2026-11-02"
  },
  {
    "slug": "roof-panel-roll-forming-machine-hire-vs-operated-service",
    "title": "Roof-Panel Roll-Forming Hire or an Operated Service? Buy the Missing Capability",
    "date": "2026-10-28",
    "updated": "2026-11-02"
  },
  {
    "slug": "roll-forming-lift-container-vs-out-of-gauge-shipping",
    "title": "Container Modules or Out-of-Gauge Shipping for a Roll-Forming Lift?",
    "date": "2026-10-28",
    "updated": "2026-11-02"
  },
  {
    "slug": "roll-forming-lift-fleet-standardization-vs-project-configurations",
    "title": "Standardize Your Roll-Forming Lift Fleet or Keep Project-Specific Machines?",
    "date": "2026-10-28",
    "updated": "2026-11-02"
  },
  {
    "slug": "roof-panel-roll-forming-buy-slit-coil-vs-slitting-line",
    "title": "Roof-Panel Roll Forming: Buy Slit Coil or Add a Slitting Line?",
    "date": "2026-10-28",
    "updated": "2026-11-02"
  },
  {
    "slug": "roof-panel-roll-forming-line-flashing-trim-production",
    "title": "Roof-Panel Roll Forming and Flashings: What Should You Make?",
    "date": "2026-10-28",
    "updated": "2026-11-02"
  },
  {
    "slug": "crawler-roll-forming-lift-own-transporter-vs-hired-haulage",
    "title": "Crawler Roll-Forming Lift Transport: Own a Carrier or Hire Haulage?",
    "date": "2026-10-28",
    "updated": "2026-11-02"
  },
  {
    "slug": "repair-or-replace-roof-panel-roll-forming-lift",
    "title": "Repair or Replace an Existing Roof-Panel Roll-Forming Lift?",
    "date": "2026-10-28",
    "updated": "2026-11-02"
  },
  {
    "slug": "roof-panel-roll-forming-coil-vs-finished-panel-inventory",
    "title": "Roof-Panel Roll Forming: Stock Coil or Finished Panels?",
    "date": "2026-10-28",
    "updated": "2026-11-02"
  },
  {
    "slug": "full-length-roof-panels-vs-designed-end-laps-forming-package",
    "title": "Full-Length Roof Panels or Designed End Laps: Which Production Package?",
    "date": "2026-10-30",
    "updated": "2026-11-02"
  },
  {
    "slug": "roll-forming-lift-ground-improvement-vs-offsite-panels",
    "title": "Roll-Forming Lift Ground Works or Offsite Roof Panels?",
    "date": "2026-10-31",
    "updated": "2026-11-02"
  },
  {
    "slug": "tile-effect-metal-roof-panel-production-equipment",
    "title": "Tile-Effect Metal Roofing: What the Production Line Must Include",
    "date": "2026-11-02",
    "updated": "2026-11-02"
  }
].map(Object.freeze));
export const reviewedUpdateForSlug = (slug, fallback) => REVIEWED_BUYER_UPDATES.find(article => article.slug === slug)?.updated ?? fallback;
