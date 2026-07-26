# ARCLIFT Six-Article Backfill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish six evidence-first crawler under-ceiling technical articles as the first batch of a long-term keyword and monitoring system.

**Architecture:** Add two articles at a time, with one new code-native editorial SVG per article and incremental inclusion in the existing content-audit contracts. Keep keyword strategy, claims, evidence, and release monitoring in the private project Vault; keep the public repository free of private provenance and identity information.

**Tech Stack:** Astro 7 content collections, Markdown, code-native SVG, Vitest content gates, Playwright E2E, Git, Cloudflare production hosting.

## Global Constraints

- Every article is 1,500–2,500 English words with a 50–60 character title and 150–160 character description.
- Every article contains a table of contents, six topic-specific H2 sections, three to five FAQ questions, and all six hidden `audit-section` markers.
- Every article contains three to five visible body-image URLs; all images are classified `editorial`.
- Every reused AI-assisted raster receives an explicit visible per-image disclosure.
- Every new SVG is a privacy-safe ARCLIFT editorial diagram and is not evidence of model identity, performance, certification, suitability, or a project result.
- Cite current primary or authoritative sources; do not invent search volume, project outcomes, prices, efficiencies, certifications, or parameters.
- Describe ARCLIFT only as an integrated equipment supplier or technical selection and supply partner.
- Do not modify Contact styling, inquiry routing, or product parameters.
- Do not push the unrelated local `e82c8e8` commit.
- Do not shut down unless verification, push, production URL, canonical, sitemap, private release record, and automation-memory checks all succeed.

---

## File Structure

- Create six article files under `src/content/blog/`.
- Create six diagrams under `public/images/editorial/`.
- Modify `public/images/asset-manifest.json` to classify the diagrams.
- Modify `tests/task-5b.test.mjs` and `scripts/audit-content.mjs` incrementally so all eleven published articles are release-gated.
- Update private keyword, claim, evidence, and release records outside the public repository.

### Task 1: Establish the Private Keyword and Monitoring System

**Files:**
- Create outside repository: private project Vault `04-Content/2026-07-27-ARCLIFT-Long-Term-Keyword-Content-System.md`
- Modify outside repository: private project Vault `04-Content/ARCLIFT-Blog-Claim-Ledger.md`
- Modify outside repository: private project Vault `04-Content/ARCLIFT-Blog-Evidence-Ledger.md`

**Interfaces:**
- Consumes: existing five-article SEO baseline, keyword map, product reference matrix, and verified product knowledge base.
- Produces: six-topic queue, page-intent map, evidence readiness, internal-link parents, and Search Console adjustment rules.

- [ ] **Step 1: Record the six-topic cluster**

Create rows for the six approved slugs with primary intent, supporting questions, target product/solution pages, current status, and evidence readiness.

- [ ] **Step 2: Define the monitoring fields**

Record query, page, clicks, impressions, CTR, average position, recent 28 days, previous 28 days, owner review date, and next action. Leave unavailable metrics explicitly unavailable; do not synthesize values.

- [ ] **Step 3: Define the adjustment rules**

Use the rules from the approved design: CTR review, near-first-page depth/internal-link review, cannibalization review, crawl/index prerequisite, and uncovered-question prioritization.

- [ ] **Step 4: Record preliminary claim boundaries**

Classify planned claims as verified reference, conditional statement, or inference. Mark project-specific loads, pressure, runtime, emissions, certification, and productivity outcomes as unavailable until signed evidence exists.

### Task 2: Buyer Guide and Access-Method Comparison

**Files:**
- Create: `src/content/blog/crawler-under-ceiling-platform-buyers-guide.md`
- Create: `src/content/blog/crawler-platform-vs-spider-lift-vs-scaffolding.md`
- Create: `public/images/editorial/crawler-platform-selection-path.svg`
- Create: `public/images/editorial/ceiling-access-method-matrix.svg`
- Modify: `public/images/asset-manifest.json`
- Modify: `tests/task-5b.test.mjs`
- Modify: `scripts/audit-content.mjs`

**Interfaces:**
- Consumes: product reference matrix, existing crawler project-data article, product pages, warehouse/stadium/airport solution pages, official work-at-height and access-selection guidance.
- Produces: two public articles, two classified diagrams, and automated publication coverage.

- [ ] **Step 1: Add the two slugs to the test contract**

Append both slugs to `launchSlugs` in `tests/task-5b.test.mjs` and `LAUNCH_SLUGS` in `scripts/audit-content.mjs`.

- [ ] **Step 2: Run the focused test and confirm red**

Run: `npx vitest run tests/task-5b.test.mjs`

Expected: FAIL because the two article files do not yet exist.

- [ ] **Step 3: Research authoritative source support**

Verify current primary guidance for work-at-height planning, MEWP selection, scaffolding boundaries, training, rescue, and site assessment. Save source URLs and access dates in the private claim ledger.

- [ ] **Step 4: Create the buyer-selection diagram**

Create a 1600×900 SVG with labels `WORK ZONE`, `HEIGHT + REACH`, `ACCESS`, `FLOOR`, and `TASK PLAN`. Use explicit font sizes of at least 48 viewBox units, a title, a description, and the note `Image alone does not establish suitability.`

- [ ] **Step 5: Create the access-method matrix**

Create a 1600×900 SVG with labels `MOVE`, `SET UP`, `FLOOR`, `OBSTRUCTIONS`, and `WORK CYCLE`. Do not display rankings or a universal winner.

- [ ] **Step 6: Write the buyer guide**

Use title `How to Choose a Crawler Under-Ceiling Work Platform`. Sections cover task definition, reach geometry, access/floor/power, configuration trade-offs, non-fit conditions, and RFQ data. Use `category-ceiling.webp` as the disclosed cover plus the new selection SVG, `ceiling-platform-project-data.svg`, and one disclosed AI-assisted under-ceiling raster in the body.

- [ ] **Step 7: Write the comparison guide**

Use title `Crawler Platform vs Spider Lift vs Scaffolding Guide`. Compare access route, setup, contact/loading interfaces, obstruction envelope, relocation, rescue, and documentation. Use `compare.webp` as cover plus the new matrix, `ceiling-platform-project-data.svg`, and one disclosed AI-assisted large-deck raster.

- [ ] **Step 8: Add manifest records and run green checks**

Add both SVGs to `campaigns.editorial` as `classification: editorial` and `disclosure: ARCLIFT editorial diagram`.

Run:

```powershell
npx vitest run tests/task-5b.test.mjs
node scripts/audit-content.mjs src/content/blog/crawler-under-ceiling-platform-buyers-guide.md src/content/blog/crawler-platform-vs-spider-lift-vs-scaffolding.md public/images/asset-manifest.json
```

Expected: both commands exit 0; both articles score 100 and are publishable.

- [ ] **Step 9: Commit pair one**

Commit message: `content: add ceiling platform selection guides`

### Task 3: Ground Pressure and Remote-Control Planning

**Files:**
- Create: `src/content/blog/indoor-aerial-platform-ground-pressure-guide.md`
- Create: `src/content/blog/remote-control-aerial-platform-safety-planning.md`
- Create: `public/images/editorial/indoor-floor-load-review.svg`
- Create: `public/images/editorial/remote-control-safety-loop.svg`
- Modify: `public/images/asset-manifest.json`
- Modify: `tests/task-5b.test.mjs`
- Modify: `scripts/audit-content.mjs`

**Interfaces:**
- Consumes: official ground-condition, floor-capacity, pre-use, emergency, rescue, and operator guidance.
- Produces: two technical risk-control articles and two editorial diagrams.

- [ ] **Step 1: Add the two slugs and verify red**

Add both slugs to the test and audit arrays. Run `npx vitest run tests/task-5b.test.mjs`; expect missing-file failures.

- [ ] **Step 2: Research authoritative source support**

Verify current primary guidance for support surfaces, structural review, operating routes, pre-use inspection, control zones, emergency lowering, rescue planning, and training. Record exact source URLs and dates privately.

- [ ] **Step 3: Create the floor-load diagram**

Create a 1600×900 SVG with labels `MACHINE`, `CONTACT AREA`, `ROUTE`, `FLOOR`, and `PROTECTION`. Do not show a pressure result or slab rating.

- [ ] **Step 4: Create the control-safety diagram**

Create a 1600×900 SVG with labels `PRE-USE`, `CONTROL ZONE`, `STOP`, `LOWER`, and `RESCUE`. Do not claim that any feature exists on a quoted machine.

- [ ] **Step 5: Write the ground-pressure guide**

Use title `Ground Pressure Guide for Indoor Aerial Work Platforms`. Explain input data, static versus movement/turning interfaces, route review, floor protection, structural sign-off, limitations, and RFQ documentation. Use `under-ceiling-field-v2.webp` as cover plus the new floor-load SVG, `ceiling-platform-project-data.svg`, and one disclosed AI-assisted ceiling-context raster.

- [ ] **Step 6: Write the remote-control guide**

Use title `Remote-Control Aerial Platform Safety Planning Guide`. Cover task/control-zone definition, control functions to verify, pre-use checks, communication, stop and emergency lowering, rescue, training, limitations, and signed documentation. Use `hero-1-arclift.webp` as an explicitly AI-assisted cover plus the new control SVG, `ceiling-platform-project-data.svg`, and one disclosed AI-assisted large-deck raster.

- [ ] **Step 7: Add manifest records, audit, and commit**

Run the focused Vitest command and explicit audit for both article paths plus the manifest. Require score 100 and no fatal failures.

Commit message: `content: add floor and control planning guides`

### Task 4: Dual-Power and Warehouse Access Planning

**Files:**
- Create: `src/content/blog/dual-power-crawler-platform-selection.md`
- Create: `src/content/blog/warehouse-ceiling-access-platform-planning.md`
- Create: `public/images/editorial/dual-power-duty-cycle.svg`
- Create: `public/images/editorial/warehouse-ceiling-access-map.svg`
- Modify: `public/images/asset-manifest.json`
- Modify: `tests/task-5b.test.mjs`
- Modify: `scripts/audit-content.mjs`

**Interfaces:**
- Consumes: official indoor engine-exhaust, electrical, charging, warehouse-route, work-zone, and rescue guidance.
- Produces: two configuration/application articles and two editorial diagrams.

- [ ] **Step 1: Add the two slugs and verify red**

Add both slugs to the test and audit arrays. Run `npx vitest run tests/task-5b.test.mjs`; expect missing-file failures.

- [ ] **Step 2: Research authoritative source support**

Verify current primary guidance for indoor combustion hazards, ventilation, electrical supply, charging, cable routing, warehouse traffic separation, overhead hazards, and emergency access. Record source URLs and dates privately.

- [ ] **Step 3: Create the duty-cycle diagram**

Create a 1600×900 SVG with labels `WORK ZONE`, `POWER MODE`, `CHARGE / FUEL`, `VENTILATION`, and `BACKUP`. Do not show runtime, fuel use, charging time, or emissions values.

- [ ] **Step 4: Create the warehouse route diagram**

Create a 1600×900 SVG with labels `GATE`, `AISLE`, `TURN`, `OVERHEAD`, and `RESCUE`. Do not imply that a route has been surveyed or approved.

- [ ] **Step 5: Write the dual-power guide**

Use title `Dual-Power Crawler Platform Selection and Site Guide`. Cover work zones, duty cycle, ventilation, charging/fueling, cables, destination supply, redundancy, limitations, and RFQ documents. Use `stadium.webp` as cover plus the new duty-cycle SVG, `ceiling-platform-project-data.svg`, and one disclosed AI-assisted platform raster.

- [ ] **Step 6: Write the warehouse guide**

Use title `Warehouse Ceiling Access Platform Project Planning Guide`. Cover work-window definition, gate/aisle/turning geometry, racks and MEP obstacles, floor route, traffic separation, rescue, limitations, and zone-by-zone data. Use `warehouse.webp` as cover plus the new route SVG, `ceiling-platform-project-data.svg`, and one disclosed AI-assisted large-deck raster.

- [ ] **Step 7: Add manifest records, audit, and commit**

Run the focused Vitest command and explicit audit for both article paths plus the manifest. Require score 100 and no fatal failures.

Commit message: `content: add power and warehouse access guides`

### Task 5: Full Quality, Privacy, and Visual Verification

**Files:**
- Verify all files created or modified in Tasks 2–4.
- Update outside repository: private claim and evidence ledgers.

**Interfaces:**
- Consumes: six completed articles, diagrams, source records, and manifest entries.
- Produces: a release candidate that satisfies all automated and human-review gates.

- [ ] **Step 1: Run private-content and identity scans**

Search the six articles, six SVGs, and manifest for local paths, source/factory/manufacturer/customer/project identities, original filenames, unsupported certifications, fabricated parameters, and prohibited ARCLIFT identity wording.

- [ ] **Step 2: Verify metadata and article structure**

Check title and description lengths, dates, cover captions, audit markers, table of contents, H2/H3 hierarchy, FAQ count, word count, internal links, external sources, image count, alt text, and per-image disclosure.

- [ ] **Step 3: Verify SVGs**

Parse all six SVGs as XML, confirm 1600×900 viewBox, title/description, five decision labels, minimum visible font size, public filenames, and absence of local/private data.

- [ ] **Step 4: Run the complete gates**

Run:

```powershell
npm run audit:content
npm run verify
```

Expected: content audit publishable with score 100; worker 25/25; content suite passes; Astro builds 37 pages; E2E has 15 passes and 7 expected skips.

- [ ] **Step 5: Render and inspect representative pages**

Inspect at least one desktop and one mobile rendering from each article pair. Confirm cover crop, diagram readability, table overflow, captions, links, and CTA layout.

- [ ] **Step 6: Update private ledgers**

Add claim classes, source dates, public asset URLs, editorial classifications, caption boundaries, and verification results for all six articles.

### Task 6: Push, Production Verification, Monitoring Record, and Shutdown

**Files:**
- Create outside repository: private project Vault `03-Operations/2026-07-27-ARCLIFT-Six-Article-Backfill-Release.md`
- Update outside repository: private keyword system and automation memory.

**Interfaces:**
- Consumes: verified release candidate and current remote-main state.
- Produces: production release, six healthy URLs, sitemap inclusion, private release record, and conditional shutdown.

- [ ] **Step 1: Verify remote fast-forward safety**

Fetch `origin/main`, confirm the isolated branch contains the current remote tip, and confirm no `e82c8e8` ancestry.

- [ ] **Step 2: Push the isolated branch to main**

Run `git push origin HEAD:main`. Require exit 0 and confirm `git ls-remote origin refs/heads/main` equals the pushed commit.

- [ ] **Step 3: Monitor deployment**

Poll production until the deployed sitemap or HTML identifies the new commit state. Treat non-200 responses or stale output as incomplete deployment.

- [ ] **Step 4: Verify all six production URLs**

Require HTTP 200, exact self-canonical, inclusion in the live child sitemap, and expected article title for all six.

- [ ] **Step 5: Write the private release record**

Record commit SHA, push result, deployment timestamps, six production URLs, canonical and sitemap results, verification command summaries, image classifications, and the owner-managed Search Console boundary.

- [ ] **Step 6: Update the long-term queue**

Mark the six articles published. Leave GSC fields unavailable until the owner supplies or reviews query/page data. Queue the next supporting topics by uncovered buyer intent.

- [ ] **Step 7: Verify shutdown gate**

Re-read the release record and automation memory. Confirm all five shutdown conditions from the design are true.

- [ ] **Step 8: Shut down Windows**

Only after Step 7 passes, execute a normal Windows shutdown. If any prior step fails, do not shut down.
