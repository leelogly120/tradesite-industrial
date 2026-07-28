# ARCLIFT Product Selection System Implementation Plan

> **Execution note:** Follow the approved design in `docs/superpowers/specs/2026-07-28-arclift-product-selection-system-design.md`. Use test-driven development and verify after every bounded task.

**Goal:** Rebuild the product list, all 15 retained product detail pages, and the comparison page as an evidence-first B2B selection system without publishing unsupported model claims or new unreviewed source imagery.

**Architecture:** A typed `src/lib/product-selection.ts` module is the only presentation mapping for product family, reference status, public orientation field, evidence boundary, image disclosure, project inputs, workflows, related references, and comparison behavior. Astro pages consume that module; Markdown retains evidence-controlled archive records but templates render only the public whitelist.

**Stack:** Astro 7, TypeScript, Vitest, Playwright, existing CSS, static output.

## Global safety contract

- Preserve every existing product and blog route.
- Do not delete content pages.
- Do not add source-folder photographs in this release.
- Use only existing approved `editorial` product assets.
- Do not change Contact styling, inquiry Worker behavior, or product specification values.
- Do not add Product/Offer/review/rating schema.
- Stop publication on evidence, identity, privacy, route, or verification failure.

---

## Task 1: Lock the evidence-safe product domain in tests

**Files:**

- Create: `tests/product-selection-system.test.mjs`
- Modify: `tests/product-card-specs.test.mjs`
- Create: `src/lib/product-selection.ts`

### Step 1: Write failing domain tests

Cover:

- exactly four families and 15 explicit reference mappings;
- stable family and model ordering;
- ARC-T25HQ status and `40HQ planning route only`;
- ARC-F25/F31/F35 `Reference concept` status;
- ARC-C/T public fields expose height only;
- ARC-F fields expose height as reference only;
- ARC-RF8 exposes archived sheet class only;
- prohibited inference lists exist for all references;
- every visual role is `editorial` with the exact disclosure;
- no silent fallback for an unknown slug;
- deterministic authored-related and family-order fallback;
- compare parser drops invalid/duplicate slugs and caps at four;
- zero, one, same-family, and cross-family comparison modes.

### Step 2: Run tests to verify RED

Run:

```powershell
npx vitest run tests/product-selection-system.test.mjs tests/product-card-specs.test.mjs
```

Expected: fail because the shared domain module does not exist and legacy tests expect duplicated page helpers.

### Step 3: Implement the typed domain module

Export typed constants and helpers:

- `PRODUCT_FAMILIES`
- `PRODUCT_REFERENCES`
- `DEFAULT_COMPARE_SLUGS`
- `getProductReference`
- `buildProductView`
- `getRelatedProductSlugs`
- `parseCompareItems`
- `getCompareMode`

Do not copy historical payload/thickness/power fields into public view models.

### Step 4: Replace legacy duplicated-helper assertions

Update `tests/product-card-specs.test.mjs` to require pages to import the shared module and prohibit the old `getProductCardSpecs` implementation.

### Step 5: Run tests to verify GREEN

Run the same Vitest command and confirm both files pass.

### Step 6: Commit

```powershell
git add src/lib/product-selection.ts tests/product-selection-system.test.mjs tests/product-card-specs.test.mjs
git commit -m "test: lock evidence-safe product selection model"
```

---

## Task 2: Rebuild the product list as a family-first selector

**Files:**

- Modify: `src/pages/products/index.astro`
- Modify: `tests/product-selection-system.test.mjs`

### Step 1: Add failing source/HTML contract tests

Require:

- four family decision cards;
- approved identity wording;
- buyer-input module;
- 15 retained reference links;
- visible `Editorial planning visual — not model-specific evidence`;
- status badges from the domain;
- no payload, sheet-thickness, or power field on C/T cards;
- an ItemList of WebPage links, not Product/Offer schema;
- progressive comparison controls and ordinary detail links;
- no nested interactive elements.

### Step 2: Verify RED

```powershell
npx vitest run tests/product-selection-system.test.mjs
```

### Step 3: Rewrite the list page

Implement:

- decision hero;
- four family cards;
- “Prepare these inputs” strip;
- compact reference sections;
- explicit editorial role/disclosure;
- compare checkboxes/buttons with an inline summary;
- client-side URL generation for `/compare/?items=...`;
- conservative ItemList JSON-LD.

Use scoped CSS with 4:3 contained images, 44px controls, visible focus, single-column mobile behavior, and no fixed tray that obscures content.

### Step 4: Verify GREEN and build

```powershell
npx vitest run tests/product-selection-system.test.mjs
npm run build
```

### Step 5: Commit

```powershell
git add src/pages/products/index.astro tests/product-selection-system.test.mjs
git commit -m "feat: make product listing a family-first selector"
```

---

## Task 3: Rebuild product detail pages around buyer decisions

**Files:**

- Modify: `src/pages/products/[slug].astro`
- Modify: `tests/product-selection-system.test.mjs`
- Modify: `tests/product-evidence-integrity.test.mjs`

### Step 1: Add failing detail-page contract tests

Require:

- reference status and scope statement;
- one whitelisted orientation field and one confirmation gate;
- figure/figcaption association for every gallery image;
- exact editorial disclosure;
- no `Object.entries(specs)` public table loop;
- no C/T per-model payload/thickness/power output;
- visible anchor sections instead of hidden JS tabs;
- family-specific project input checklist;
- `Workflows to assess`, not `Typical applications`;
- available-reference-documents CTA wording;
- authored/validated related reference order;
- WebPage/FAQ/Breadcrumb schema only.

### Step 2: Verify RED

```powershell
npx vitest run tests/product-selection-system.test.mjs tests/product-evidence-integrity.test.mjs
```

### Step 3: Rewrite the active product template

Implement accessible sections:

1. selection overview;
2. archive reference;
3. project inputs;
4. workflows to assess;
5. questions and documents.

Use the shared mapping for every presentation field. Render only the public orientation whitelist in the archive table. Keep the Markdown body visible. Preserve the existing Contact URLs but change public wording only.

### Step 4: Verify GREEN and build

```powershell
npx vitest run tests/product-selection-system.test.mjs tests/product-evidence-integrity.test.mjs
npm run build
```

### Step 5: Commit

```powershell
git add src/pages/products/[slug].astro tests/product-selection-system.test.mjs tests/product-evidence-integrity.test.mjs
git commit -m "feat: turn product references into decision pages"
```

---

## Task 4: Rewrite all 15 product bodies within the evidence matrix

**Files:**

- Modify: `src/content/products/*.md` except `_template.md`
- Create: `tests/product-copy-distinctiveness.test.mjs`
- Modify: `tests/product-evidence-integrity.test.mjs`

### Step 1: Write failing content tests

Require each page to include:

- a distinct buyer decision;
- variables that change configuration;
- limitations/not-fit conditions;
- exact controlling-document language;
- family-specific requested inputs;
- image disclosure;
- no forbidden identity or unsupported outcome language.

Add duplicate detection for normalized body paragraphs so the four families do not contain cloned model copy.

### Step 2: Verify RED

```powershell
npx vitest run tests/product-copy-distinctiveness.test.mjs tests/product-evidence-integrity.test.mjs
```

### Step 3: Rewrite by family and reference role

Keep frontmatter specification values unchanged. Rewrite body copy so:

- ARC-C references differ by archive-height decision context without claiming payload, material, or power;
- ARC-T references differ by destination/chassis/access review context;
- ARC-T25HQ remains a packing-study route only;
- ARC-F20 is an archive reference while F25/F31/F35 are explicit reference concepts;
- ARC-RF8 starts from profile/material/tooling inputs and does not claim output.

Use natural English, buyer-facing headings, short paragraphs, and bounded CTAs. Do not turn the pages into blog-length articles.

### Step 4: Verify GREEN

```powershell
npx vitest run tests/product-copy-distinctiveness.test.mjs tests/product-evidence-integrity.test.mjs
npm run audit:content
```

### Step 5: Commit

```powershell
git add src/content/products tests/product-copy-distinctiveness.test.mjs tests/product-evidence-integrity.test.mjs
git commit -m "content: differentiate evidence-safe product references"
```

---

## Task 5: Repair the static comparison page

**Files:**

- Modify: `src/pages/compare.astro`
- Modify: `tests/product-selection-system.test.mjs`

### Step 1: Add failing comparison tests

Require:

- a complete, non-empty default comparison in built HTML;
- `noindex,follow` and canonical `/compare/`;
- only valid public view-model fields;
- no legacy keys or blank cells;
- same-family orientation row only;
- cross-family omission notice;
- one-item pending state;
- invalid/duplicate/capped query behavior in the client helper;
- table caption and scoped headers;
- direct links to all selected references.

### Step 2: Verify RED

```powershell
npx vitest run tests/product-selection-system.test.mjs
```

### Step 3: Rewrite `/compare/`

Render the four-reference default statically. Embed the 15 safe view models as JSON for progressive client enhancement. Parse the query in the browser, replace only the comparison region, and preserve the static default when JavaScript is unavailable.

The whole page is `noindex,follow`; do not promise query-dependent server metadata.

### Step 4: Verify GREEN and build output

```powershell
npx vitest run tests/product-selection-system.test.mjs
npm run build
```

Inspect `dist/compare/index.html` for populated cells, noindex, canonical, and no unsupported schema.

### Step 5: Commit

```powershell
git add src/pages/compare.astro tests/product-selection-system.test.mjs
git commit -m "fix: rebuild product comparison from safe reference data"
```

---

## Task 6: Align image manifest, UI disclosures, and encoding regression

**Files:**

- Modify: `public/images/asset-manifest.json`
- Modify: `tests/replacement-image-truthfulness.test.mjs`
- Modify: `tests/public-asset-hygiene.test.mjs`
- Create: `tests/product-page-encoding.test.mjs`

### Step 1: Write failing tests

Require:

- all 15 manifest records remain `editorial`;
- exact adjacent disclosure language in product UI;
- no new `/images/products/` source assets;
- no private paths, Chinese source paths, DJI names, identity markers, or EXIF/GPS leaks;
- no known mojibake sequences in active product/list/compare templates or product Markdown.

### Step 2: Verify RED

```powershell
npx vitest run tests/replacement-image-truthfulness.test.mjs tests/public-asset-hygiene.test.mjs tests/product-page-encoding.test.mjs
```

### Step 3: Align manifest and disclosure wording

Keep all existing public files. Update only classification/disclosure records and page captions as needed. Do not add or restore source photographs.

### Step 4: Verify GREEN

Run the same tests and `npm run build`.

### Step 5: Commit

```powershell
git add public/images/asset-manifest.json tests/replacement-image-truthfulness.test.mjs tests/public-asset-hygiene.test.mjs tests/product-page-encoding.test.mjs
git commit -m "test: enforce product visual and encoding boundaries"
```

---

## Task 7: Full verification and visual QA

### Step 1: Run all mandatory gates

```powershell
npm run verify
npm run audit:content
```

Both must pass with zero failures.

### Step 2: Run route/canonical/sitemap checks on the committed tree

Confirm:

- all 15 product routes;
- all existing blog routes;
- `/products/`;
- `/compare/`;
- sitemap parity;
- correct canonical and 200 response in local production preview.

### Step 3: Visual QA

Capture desktop and 390px screenshots for:

- `/products/`;
- ARC-C25;
- ARC-T25HQ;
- ARC-F25;
- ARC-RF8;
- `/compare/`.

Inspect hierarchy, image containment, disclosure visibility, focus order, table/card behavior, CTA clarity, and overflow.

### Step 4: Commit any verified corrections

Use a narrowly scoped commit and rerun the full gates.

---

## Task 8: Publish, monitor, and record the method

### Step 1: Push the verified commit chain to `main`

Use the available authenticated GitHub route. Do not force-push.

### Step 2: Monitor Cloudflare

Wait for a successful production build. Verify the six representative URLs plus the remaining product routes return 200 with correct canonical and disclosure.

### Step 3: Verify sitemap

Confirm the production sitemap retains every pre-existing blog and product URL.

### Step 4: Update private knowledge

Record in the private vault:

- final information architecture;
- public field whitelist;
- image release gate and current real-photo hold;
- comparison-page static/client contract;
- tests and verification results;
- commit and production URLs;
- reusable content and self-review method.

Update the automation memory with the same operational facts and the no-delete rule.

### Step 5: Final handoff

Report only verified results, remaining holds, commits, and production URLs. Do not claim new real product photography was published.
