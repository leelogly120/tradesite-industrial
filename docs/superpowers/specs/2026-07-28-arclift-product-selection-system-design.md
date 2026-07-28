# ARCLIFT Evidence-First Product Selection System Design

**Date:** 2026-07-28
**Status:** Approved for implementation after evidence and UI review
**Scope:** `/products/`, all 15 existing product routes, and `/compare/`

## 1. Objective

Turn the product section from a visually repetitive model catalogue into a credible B2B selection system. The system must help a buyer identify the relevant equipment family, understand which project inputs control configuration, compare reference classes without mistaking archive data for a current offer, and send a bounded technical-review request.

This work is a UI, content, image, accessibility, and structured-data improvement. It is not an authorization to delete or unpublish any existing page, invent specifications, publish source identities, or alter the inquiry-routing infrastructure.

## 2. Evidence basis

The design follows a cross-check of:

- the 15 current product entries and active Astro templates;
- the private verified-product knowledge base and product reference matrix;
- the private image-asset index and public-asset quarantine record;
- the private index of 301 image/GIF assets; every candidate subset still requires an enumerated private visual-ledger record;
- current public image manifests and product evidence tests;
- the historical removal of unsafe raw product folders from the public repository.

The evidence supports four buyer-facing product families:

1. crawler roof-level roll-forming systems;
2. truck-mounted roof-level roll-forming systems;
3. crawler ceiling and wall-panel work platforms;
4. profile-specific roll-forming lines.

Evidence is stronger at family and archived-reference level than at exact-model level. In particular:

- ARC-C and ARC-T have useful family-level archive material, but an archived height, load, electrical, chassis, road, or transport value is not a current per-model commitment.
- ARC-T25HQ is a historical 40HQ planning route, not proof that a current configuration fits a container or represents the lowest-cost shipment.
- ARC-F20 has private real-image coverage at family/reference level. ARC-F25, ARC-F31, and ARC-F35 lack exact-model photos, drawings, load tests, certifications, and delivery evidence.
- ARC-RF has private real-line imagery. Profile, material, tooling, output, interface, and power remain project-specific.

Therefore the public information architecture must lead with families and project inputs, not with a grid that presents all 15 archive labels as equally documented sale models.

## 3. Non-negotiable boundaries

- Preserve all 15 existing product routes and every already-published blog route.
- Describe ARCLIFT only as an `integrated equipment supplier` or `technical selection and supply partner`.
- Do not imply that ARCLIFT is the source factory, manufacturer, designer, certifier, customer, site owner, or operator.
- Do not publish price, stock, lead time, certification, performance, savings, customer identity, project identity, or exact suitability without current traceable evidence.
- Do not restore quarantined raw asset directories.
- Do not expose local paths, source filenames, metadata, people, faces, plates, signage, customer marks, or source-manufacturer identity.
- Do not alter Contact styling, the inquiry Worker, product-routing behavior, or product parameters unless separately evidenced and authorized.
- Do not add `Product`, `Offer`, `AggregateOffer`, review, or rating schema. Conservative `WebPage`, `ItemList`, `BreadcrumbList`, and evidence-safe FAQ markup are allowed.

The user has authorized comparison-page selection parameters as part of this scope. They are front-end view state only and must not alter product specifications, inquiry routing, or the Contact implementation. The existing `request=datasheet` link intent may remain, but this project must not claim the Contact page or Worker performs a new request-type workflow.

## 4. Selected approach

Use an evidence-first family selector while retaining all reference routes.

The selection flow is:

`Product family -> project inputs -> reference classes -> evidence-safe comparison -> technical review`

This is preferred over:

- a model-first visual catalogue, which would preserve the current evidence ambiguity; and
- four large independent SEO landing pages, which would add duplication before the core selection path is repaired.

Family landing pages may be a later growth phase. This implementation should leave clear family anchors and reusable family data so future routes can be added without another redesign.

## 5. Product-list page

### 5.1 Hero and trust boundary

The hero introduces the four families and the page's decision purpose. It states that pages contain archived planning references and that the signed technical schedule, approved drawings, and applicable project documents control procurement.

Primary actions:

- `Explore equipment families`
- `Compare reference classes`

Do not use `Price on Request` as a trust shortcut. The first screen should explain what can be selected before it asks for contact.

### 5.2 Family selector

Replace decorative category-banner repetition with four decision cards. Each card contains:

- family name;
- one buyer workflow;
- three project inputs that materially change configuration;
- the number of retained reference pages;
- an approved editorial family-workflow visual with the adjacent label `Editorial planning visual — not model-specific evidence`;
- an anchor action to the family's reference classes.

Family cards must not display archive numbers as current family-wide capabilities.

### 5.3 Selection-input strip

Add a compact “Prepare these inputs” module between the family selector and model references. The four input groups are:

- work zone and access;
- panel/profile and material;
- transport/chassis/container constraints;
- destination documents and approval gates.

The module is educational, not a form, and does not collect private project data.

### 5.4 Reference-class cards

Keep all 15 cards but change their anatomy:

- neutral image surface;
- explicit visual-role badge: `Editorial planning visual`;
- model/reference label;
- status badge: `Archived reference class`, `Planning route`, or `Reference concept`;
- one supported orientation field;
- one `Project confirmation required` field;
- `View reference` action;
- evidence-safe `Compare` action.

ARC-T25HQ receives a visible planning-route notice. ARC-F25, ARC-F31, and ARC-F35 receive the stronger `Reference concept` status. No exact-model photograph is assigned where the evidence does not support one.

### 5.5 Responsive behavior

Desktop uses a four-card family grid and compact two- or three-column reference grid. Mobile uses a single column, scroll-safe family anchors, non-overlapping actions, and a comparison tray that never covers the primary navigation or contact action.

Use semantic headings, ordinary links for navigation, and buttons only for interaction.

### 5.6 Structured data

Add an `ItemList` for the 15 retained public reference pages. Each item is a `ListItem` pointing to a public `WebPage`, not a `Product` or offer.

## 6. Product-detail page

### 6.1 Replace generic sales hero with a decision header

The detail hero contains:

- family and reference-status badges;
- page title and concise orientation statement;
- one safe orientation field;
- one confirmation-gate field;
- gallery with visible per-image role/disclosure;
- `Request configuration review` and `Request available reference documents` actions.

The existing datasheet-intent URL may remain, but adjacent wording states that document availability, scope, and configuration match are confirmed per request. Public wording must not promise an approved final datasheet before configuration review.

### 6.2 Persistent evidence boundary

Immediately below the title, state:

- what the page can orient;
- what it cannot confirm;
- which signed documents control the final configuration.

This replaces four generic mini-spec tiles that currently give archive fields too much visual authority.

### 6.3 Accessible section navigation

Replace JavaScript-only hidden tab panels with visible anchor sections and a sticky in-page navigation:

1. Selection overview
2. Archive reference
3. Project inputs
4. Workflows to assess
5. Questions and documents

All content remains available without JavaScript, searchable, linkable, and keyboard accessible. On mobile the navigation scrolls horizontally with clear focus states.

### 6.4 Selection overview

Render authored Markdown as the page's family-specific buyer guidance. Rewrite duplicate pages so each reference class explains:

- the buyer decision it can help frame;
- variables that may change the configuration;
- limits and not-fit conditions;
- the next evidence/documents required.

Avoid generic promotional filler and avoid claiming a project outcome.

### 6.5 Archive-reference table

Render only the fields allowed by the public table whitelist; do not loop over all frontmatter specifications. If family-level archive history is useful, place it in a separate module labelled `Family archive context — no model-specific mapping`, never in the model reference table. Every table includes a visible controlling note. Mobile rendering changes from a fragile two-column table to stacked rows.

Fields remain content-owned. The template must not remap one family's fields into another family's commercial labels. C/T detail tables must not expose archived payload, sheet-thickness, or power values as per-model fields. ARC-F detail tables must not expose deck, load, power, travel, or use as exact-model fields.

### 6.6 Project-input checklist

Each family gets a tailored checklist:

- ARC-C: access route, ground bearing, support geometry, work elevation, panel run-out, weather/rescue controls.
- ARC-T: destination road/chassis rules, travel and working envelopes, outriggers/ground, transport route, panel run-out, approval documents.
- ARC-F: floor/ground bearing, indoor access, clear height, obstructions, deck/crew/tool basis, rescue and local rules.
- ARC-RF: approved profile drawing, coil/material basis, thickness range, seam/tooling, output direction, run-out, power and lift interface.

Checklists communicate requested inputs, not product capabilities.

### 6.7 Workflows to assess

Rename `Typical applications` to `Workflows to assess`. Generic application cards become family-specific evaluation contexts and always include conditions. They must not say a model is suitable merely because a category matches.

### 6.8 Required documents and bounded CTA

End with the records needed for configuration review, followed by a scoped CTA. The CTA states what ARCLIFT can review as a technical selection and supply partner and what still needs competent/local approval.

### 6.9 Related references

Use authored `relatedProducts` when valid. Fall back deterministically to the nearest reference classes in the same family. Never use arbitrary collection order.

`Nearest` means the fixed, tested order defined for each family in the shared product-selection module. The implementation does not calculate a performance distance. Invalid authored routes are ignored, duplicates are removed, and no cross-family fallback is added merely to fill three positions.

## 7. Image system

### 7.1 Public image roles

Every product visual is assigned one of:

- `editorial`: explains a workflow or input and is not evidence;
- `evidence`: exact, current, approved, privacy-cleared evidence for a narrow claim.

This release uses only existing approved `editorial` product visuals. The candidate real-photo folders remain private and on hold because full-resolution visual approval is unavailable in the current execution environment. A future real-photo release must separately update the evidence standard, manifest, private visual ledger, and tests before any image can be classified as evidence. AI-assisted images remain editorial and require adjacent per-image disclosure.

### 7.2 Source processing gate

A source image may enter the public tree only after:

1. full-resolution visual inspection;
2. identity/privacy inspection;
3. removal of metadata;
4. crop and tonal correction without changing factual equipment geometry;
5. neutral ASCII public filename;
6. public derivative generation, never raw-source copying;
7. source hash, source location, classification, caption, scope, and reviewer result recorded in the private visual ledger;
8. adjacent public caption/disclosure.

The private ledger must also record a mandatory privacy disposition (`approved`, `redacted`, or `rejected`), publication authority, elements checked, any redaction performed, the derivative hash, and the exact public caption/alt boundary. A person, face, plate, site sign, customer mark, supplier mark, source-manufacturer mark, or other identity clue requires scope-specific publication authority, factual redaction, or rejection. Metadata removal alone never clears an image.

If full-resolution inspection is unavailable, the image remains on hold. No automation may infer exact-model identity from a folder name or photograph.

### 7.3 Initial family coverage

Candidate pools exist for ARC-C, ARC-T, ARC-F20, and ARC-RF, but none is pre-approved merely by being in a product folder. Because the current environment cannot complete full-resolution visual approval, this release adds no source-folder photographs. Product pages use the existing public editorial set with stronger disclosure and more purposeful family matching. Unsupported exact-model pages do not receive a fabricated unique image.

### 7.4 Layout treatment

Use consistent aspect ratios and object-fit behavior:

- family cards: landscape 4:3;
- reference cards: landscape 4:3 with neutral containment;
- detail main image: 4:3;
- thumbnails: 4:3;
- captions and role badges remain visible adjacent to the image.

Use `object-fit: contain` for equipment-like editorial composites and diagrams so cropping does not change visible geometry. Background treatment may unify the card surface, but it must not alter or hide factual visual content.

## 8. Compare page

The existing page is broken because it expects legacy specification keys; all 36 tested model cells are empty.

Replace its hard-coded performance matrix with an evidence-safe comparison generated from the active collection.

### 8.1 Selection and URL contract

- The canonical path is `/compare/`.
- A shareable client-enhanced selection uses `items=slug-a,slug-b` with one to four unique slugs.
- Slugs are accepted only when they match the 15 published product entries. Invalid values and duplicates are discarded.
- With no valid item, show the documented default set. With one valid item, keep that item and show `Add another reference to compare`; do not silently substitute unrelated defaults.
- If more than four valid values are supplied, keep the first four valid unique values and explain the limit in the selection UI.
- The default set contains one stable reference from each family and is owned by the shared module.
- Because Astro produces one static HTML response for every query variation, the entire comparison page is `noindex,follow` and canonicalizes to `/compare/`. No query-dependent server metadata is promised.
- The built HTML contains a complete default comparison and direct product links, so the page remains useful without JavaScript. Replaying a query-specific selection is a progressive client enhancement and requires JavaScript.

The product-list comparison control uses an inline or end-of-list summary, not an obstructive fixed overlay. It announces `n of 4 selected`, supports add/remove/clear by keyboard, gives a visible explanation when the limit is reached, and keeps touch targets at least 44 by 44 CSS pixels. With JavaScript unavailable, every card still offers its ordinary detail link and the comparison page still renders the complete default set.

### 8.2 Comparison semantics

Same-family references may show the one explicitly whitelisted archive orientation field. Cross-family selections switch to a workflow/input review, omit the orientation row entirely, and show no numeric performance matrix, ranking, or recommended winner.

Rows compare:

- reference class;
- equipment family;
- reference status;
- buyer question the reference can help frame;
- whitelisted archive orientation field in same-family mode only;
- primary project inputs;
- evidence and documents still required;
- editorial visual role;
- direct link to each reference page.

Within same-family mode, the missing-value phrase is `Not established for this reference`; a dash or blank cell is prohibited. Cross-family mode does not render an orientation row and instead states that archive orientation is intentionally not compared across equipment families. The table has a caption and scoped headers. On narrow screens it becomes labelled comparison cards without losing programmatic label/value association.

The page explicitly states that it compares planning references, not final configurations, price, performance, compliance, availability, or site suitability.

### 8.3 Field whitelist

The public card, hero, detail archive table, and compare orientation whitelist is:

- ARC-C: the matching archived height class only. Do not surface payload, thickness, or power as per-model card/hero/compare facts.
- ARC-T: the matching archived height class only. Do not surface payload, thickness, power, chassis, road, or transport status as per-model facts.
- ARC-T25HQ: archived height class plus the text `40HQ planning route only`; do not state fit, quantity, freight cost, transit time, shipment, or delivery.
- ARC-F20: archived height as a reference class only; deck, load, power, travel, and use remain project inputs.
- ARC-F25, ARC-F31, ARC-F35: archived height as a reference concept only and a mandatory `Reference concept` status; no exact-model deck, load, power, travel, image, or suitability claim.
- ARC-RF8: archived sheet class only; profile, material, tooling, output, power, and lift interface remain project inputs.

Each mapping in the shared module records the source frontmatter key, public label, public scope statement, confirmation gate, and prohibited inference. Tests fail if a template tries to expose a non-whitelisted field in a card, hero, detail archive table, or comparison row.

## 9. Content/data architecture

Create a shared product-selection module rather than duplicating card-field logic in list and detail templates. The module owns:

- canonical family metadata;
- status mapping by route;
- orientation and confirmation-field selection;
- visual-role labels and default disclosures;
- family input checklists;
- workflow-to-assess cards;
- deterministic related-reference ordering;
- compare-page rows.

Do not bulk add speculative frontmatter. Existing evidence-controlled fields remain the source of archive values. Add only presentation metadata that is directly auditable, such as reference status or visual classification.

The shared, typed reference view model contains:

- `slug`, `model`, `familyId`, and stable family order;
- `status`, `statusNote`, and `scopeStatement`;
- whitelisted `orientation` with source key and public label;
- `confirmationGate` and `prohibitedInferences`;
- `imageRole`, `imageDisclosure`, and approved editorial paths;
- family `projectInputs`, `workflowsToAssess`, and `requiredDocuments`;
- validated `relatedProducts`;
- compare labels and default-selection membership.

All 15 entries have an explicit mapping. There is no silent generic fallback for status, orientation, or image disclosure; missing mappings fail the content test and build verification.

## 10. Accessibility and quality

- All interactive controls work by keyboard.
- Focus states are visible.
- No product content is hidden behind an inaccessible tab implementation.
- Reduced-motion preferences are respected.
- Images have meaningful alt text appropriate to their role.
- This release labels every product visual as `Editorial planning visual — not model-specific evidence`; future evidence imagery requires the separate evidence, privacy, manifest, and test gate.
- Cards have one clear link target; nested interactive controls are avoided.
- Tables stack on narrow screens.
- No mojibake, broken arrows, or decorative symbols are used as semantic icons.

In addition:

- sticky in-page navigation and anchor targets use a tested scroll offset;
- anchor targets can receive programmatic focus and do not require IntersectionObserver to communicate current context;
- horizontal overflow has a visible cue and does not hide keyboard focus;
- archive and comparison tables use `<caption>` and `<th scope>`;
- mobile label/value layouts preserve semantic association;
- every gallery image is associated with its adjacent disclosure through `<figure>/<figcaption>` or `aria-describedby`.

## 11. Test and release contract

Before publishing:

- add tests for all 15 preserved routes;
- add tests for family/status mapping;
- add tests that ARC-T25HQ and ARC-F25/F31/F35 retain their stronger limitations;
- add tests prohibiting unsupported `Product`/`Offer` schema;
- add tests for image-role disclosure and public-asset hygiene;
- add tests for non-empty compare output;
- add tests for the 15-entry typed mapping, field whitelist, invalid/duplicate compare slugs, default selection, query canonical/noindex behavior, and deterministic related-reference order;
- add tests that every existing blog and product route in the committed sitemap remains present;
- run `npm run verify`;
- run `npm run audit:content`;
- inspect committed-tree production build;
- inspect list, representative detail pages, and compare page at desktop and mobile widths;
- verify all public routes return 200 with correct canonical and sitemap inclusion;
- push to `main`, monitor Cloudflare production, and update the private vault and automation memory.

A test pass does not override evidence, identity, privacy, or visual-review holds.

## 12. Success criteria

The work is complete when:

- the product list leads with four buyer-relevant families;
- all 15 product URLs remain live;
- every product card and gallery communicates visual and evidence status;
- duplicate generic detail sections are replaced by family-specific selection guidance;
- the compare page contains meaningful, non-empty, evidence-safe rows;
- no unsupported exact-model capability, photograph, identity, or structured-data claim is introduced;
- mobile, keyboard, build, content, inquiry, asset-hygiene, canonical, and sitemap checks pass;
- production is verified and the private knowledge base records the decisions and reusable method.

The image portion is successful when the existing approved editorial set is better matched, contained, captioned, and disclosed. Publishing a new real product photograph is not a completion requirement for this release and is prohibited until the separate full-resolution privacy/evidence gate is completed.

No empty comparison cell, generic parameter remapping, private path, source identity, customer identity, unsupported image classification, or inaccessible hidden product section may remain.
