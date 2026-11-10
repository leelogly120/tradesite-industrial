// Only explicit, independently reviewed photo URLs may extend historical manifests.
export const BUYER_PHOTO_COHORTS = Object.freeze([
  Object.freeze({ date: '2026-10-27', urls: Object.freeze([
    'forming-line', 'twin-lines', 'rollers', 'tooling', 'truck-roof', 'roof-interface',
    'crawler-roof', 'ceiling-wide', 'ceiling-side', 'wall-frame', 'transport', 'loading',
    'coil-transfer', 'module-transfer', 'material-interface',
  ].map(name => `/images/equipment/buyer-20261027-${name}.webp`)) }),
  Object.freeze({ date: '2026-10-28', urls: Object.freeze([
    'wrapped-line', 'profile-cutter', 'truck-loading', 'truck-dispatch',
    'coil-feed', 'panel-outlet', 'long-panel', 'crawler-base',
  ].map(name => `/images/equipment/buyer-20261028-${name}.webp`)) }),
  Object.freeze({ date: '2026-10-29', urls: Object.freeze([
    'deck-yard', 'wall-corridor', 'wall-installation', 'wall-yard',
    'deck-folded', 'deck-hall', 'ceiling-interface', 'port-handling',
  ].map(name => `/images/equipment/buyer-20261029-${name}.webp`)) }),
  Object.freeze({ date: '2026-10-30', urls: Object.freeze([
    'crawler-forming-site', 'line-frame', 'panel-samples', 'feed-entry',
    'stored-line-frames', 'deck-site-wide', 'wall-site', 'vertical-deck',
  ].map(name => `/images/equipment/buyer-20261030-${name}.webp`)) }),
  Object.freeze({ date: '2026-10-31', urls: Object.freeze([
    'crawler-roof-side', 'crawler-line-low', 'roof-framing', 'container-rear',
    'port-handling', 'deck-top', 'deck-raised-yard', 'hall-construction',
  ].map(name => `/images/equipment/buyer-20261031-${name}.webp`)) }),
  Object.freeze({ date: '2026-11-01', urls: Object.freeze([
    "/images/equipment/buyer-20261101-former-entry.webp",
    "/images/equipment/buyer-20261101-roller-components.webp",
    "/images/equipment/buyer-20261101-profiled-sheet.webp",
    "/images/equipment/buyer-20261101-roller-line-detail.webp",
    "/images/equipment/buyer-20261101-roof-panels.webp",
    "/images/equipment/buyer-20261101-crawler-former-yard.webp",
    "/images/equipment/buyer-20261101-deck-underside.webp",
    "/images/equipment/buyer-20261101-deck-hall-low.webp"
]) }),
  Object.freeze({ date: '2026-11-02', urls: Object.freeze([
    "/images/equipment/buyer-20261102-profile-tooling-closeup.webp",
    "/images/equipment/buyer-20261102-roller-row.webp",
    "/images/equipment/buyer-20261102-wrapped-former.webp",
    "/images/equipment/buyer-20261102-embossed-panel-outlet.webp",
    "/images/equipment/buyer-20261102-embossed-sheet-sample.webp",
    "/images/equipment/buyer-20261102-workshop-low-deck.webp",
    "/images/equipment/buyer-20261102-hall-ground-route.webp",
    "/images/equipment/buyer-20261102-elevated-former-coils.webp"
]) }),
  Object.freeze({ date: '2026-11-03', urls: Object.freeze([
  "/images/equipment/buyer-20261103-wide-deck-yard.webp",
  "/images/equipment/buyer-20261103-low-deck-workshop.webp",
  "/images/equipment/buyer-20261103-raised-deck-hall.webp",
  "/images/equipment/buyer-20261103-wall-access-frame.webp",
  "/images/equipment/buyer-20261103-roof-level-former-v2.webp",
  "/images/equipment/buyer-20261103-roof-edge-interface.webp",
  "/images/equipment/buyer-20261103-long-roof-panels.webp",
  "/images/equipment/buyer-20261103-forming-lines-workshop.webp",
  "/images/equipment/buyer-20261103-roller-tooling-parts.webp",
  "/images/equipment/buyer-20261103-roller-bed-perspective.webp",
  "/images/equipment/buyer-20261103-forming-line-truck.webp",
  "/images/equipment/buyer-20261103-coil-workshop-context.webp",
  "/images/equipment/buyer-20261103-sheet-roller-bed.webp",
  "/images/equipment/buyer-20261103-panel-edge-sample.webp"
]) }),
  Object.freeze({ date: '2026-11-09', urls: Object.freeze([
  "/images/equipment/buyer-20261109-wide-deck-yard.webp",
  "/images/equipment/buyer-20261109-low-deck-workshop.webp",
  "/images/equipment/buyer-20261109-raised-deck-hall.webp",
  "/images/equipment/buyer-20261109-hall-ground-route.webp",
  "/images/equipment/buyer-20261109-elevated-former-coils.webp",
  "/images/equipment/buyer-20261109-roof-edge-interface.webp",
  "/images/equipment/buyer-20261109-long-roof-panels.webp",
  "/images/equipment/buyer-20261109-forming-lines-workshop.webp",
  "/images/equipment/buyer-20261109-roller-bed-perspective.webp",
  "/images/equipment/buyer-20261109-forming-line-truck.webp",
  "/images/equipment/buyer-20261109-panel-edge-sample.webp"
]) }),
  Object.freeze({ date: '2026-11-10', urls: Object.freeze([
  "/images/equipment/buyer-20261110-broad-deck-yard.webp",
  "/images/equipment/buyer-20261110-coil-processing-workshop.webp",
  "/images/equipment/buyer-20261110-elevated-former-material-area.webp",
  "/images/equipment/buyer-20261110-former-truck-workshop.webp",
  "/images/equipment/buyer-20261110-forming-lines-workshop.webp",
  "/images/equipment/buyer-20261110-profiled-sheet-machine-outlet.webp",
  "/images/equipment/buyer-20261110-profiled-sheet-tooling-detail.webp",
  "/images/equipment/buyer-20261110-raised-deck-hall.webp",
  "/images/equipment/buyer-20261110-roller-train-detail.webp",
  "/images/equipment/buyer-20261110-roof-edge-interface.webp",
  "/images/equipment/buyer-20261110-unfinished-hall-route.webp",
  "/images/equipment/buyer-20261110-vehicle-lift-building-interface.webp",
  "/images/equipment/buyer-20261110-vertical-wall-access-frame.webp"
]) }),
]);
export const BUYER_PHOTO_URLS = Object.freeze(BUYER_PHOTO_COHORTS.flatMap(cohort => cohort.urls));
export const buyerPhotoUrlsForDate = date => BUYER_PHOTO_COHORTS.find(cohort => cohort.date === date)?.urls ?? [];

export function manifestBeforeBuyerDate(manifest, date) {
  const additions = BUYER_PHOTO_COHORTS.filter(cohort => cohort.date >= date).flatMap(cohort => cohort.urls);
  return { ...manifest, referencePhotos: manifest.referencePhotos.filter(photo => !additions.includes(photo.url)) };
}
