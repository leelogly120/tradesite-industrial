# ARCLIFT Twenty Lift-Platform Articles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 20 evidence-first English B2B lift-platform articles, 20 accessible editorial diagrams, complete audit coverage, private claim/visual records, and one verified publication attempt.

**Architecture:** Keep public articles and privacy-safe assets in the Astro repository, while claim sources, visual provenance, review notes and release evidence remain in the private TradeSite Vault. A dedicated regression test owns the 20-slug contract and is permanently wired into `npm run verify`; existing content and build baselines are extended rather than replaced.

**Tech Stack:** Astro 7 content collections, Markdown, code-native SVG, Vitest, Playwright, Node.js content/build audits, Git.

## Global Constraints

- Apply `docs/content-quality-standards.md` and `docs/superpowers/specs/2026-08-06-arclift-twenty-lift-platform-articles-design.md` without weakening either layer.
- ARCLIFT is described only as an integrated equipment supplier or technical selection and supply partner.
- Preserve all 21 existing blog files, all 15 product routes and all four legacy redirects.
- Do not modify Contact styling, inquiry routing, Worker behavior or product parameters.
- Each new article has 1,500–3,000 visible English words, a 50–60 character title, a 150–160 character description, four to six H2 sections, at least twelve H3 subsections and at least four FAQs.
- Each new article has one disclosed cover plus exactly three disclosed body images, including one unique code-native SVG.
- No unsupported specification, customer, project, manufacturer, certification, legal approval, price, stock, lead time, capacity, performance, saving, ROI, guarantee or suitability claim.
- No public private path, source filename, source identity, customer identity, project identity or credential.
- Do not push until every local gate passes. Make one normal non-force push attempt. If Git push or Cloudflare deployment fails, stop without troubleshooting or retrying.
- Do not operate Search Console and do not shut down the computer.

---

## File structure

**Create**

- `tests/twenty-lift-platform-articles.test.mjs` — permanent 20-article, SVG and manifest coverage contract.
- `src/content/blog/<20 approved slugs>.md` — public articles from the approved design table.
- `public/images/editorial/<20 approved diagram slugs>.svg` — one decision diagram per article.
- `docs/operations/2026-08-07-arclift-twenty-article-local-review.md` — non-private local verification summary without machine paths or credentials.

**Modify**

- `package.json` — wire the new focused test into `test:content`.
- `tests/verification-wiring.test.mjs` — require permanent wiring.
- `scripts/audit-content.mjs` — append all 20 slugs to `LAUNCH_SLUGS`.
- `tests/task-5b.test.mjs` — extend the exact launch-slug contract.
- `scripts/lib/build-output-audit.mjs` — extend `BASELINE_BLOG_SLUGS` from 21 to 41.
- `tests/build-output-audit.test.mjs` — mirror the 41-page frozen baseline.
- `public/images/asset-manifest.json` — append 20 privacy-safe editorial diagram records.
- `tests/public-asset-hygiene.test.mjs` — include the 20 SVGs in accessible/mobile-readable hygiene checks.

**Private Vault updates**

- `04-Content/ARCLIFT-Blog-Claim-Ledger.md` — append a 20-row claim boundary register.
- `04-Content/ARCLIFT-Blog-Evidence-Ledger.md` — append a 20-article visual allocation register.
- `04-Content/2026-07-27-ARCLIFT-Long-Term-Keyword-Content-System.md` — append the approved cluster map and measurement-pending state.
- `03-Operations/2026-08-07-ARCLIFT-Twenty-Lift-Platform-Article-Release.md` — local and, only if successful, production evidence.

---

### Task 1: Freeze the 20-article coverage contract

**Files:**
- Create: `tests/twenty-lift-platform-articles.test.mjs`
- Modify: `package.json`
- Modify: `tests/verification-wiring.test.mjs`
- Modify: `scripts/audit-content.mjs`
- Modify: `tests/task-5b.test.mjs`
- Modify: `scripts/lib/build-output-audit.mjs`
- Modify: `tests/build-output-audit.test.mjs`

**Interfaces:**
- Consumes: the exact 20 slugs and titles from the approved design.
- Produces: `TWENTY_LIFT_ARTICLE_SLUGS`, an exact test-owned array used to assert source files, SVGs, manifest records and audit inclusion.

- [ ] **Step 1: Create the failing coverage test**

The test declares these slugs exactly:

```js
export const TWENTY_LIFT_ARTICLE_SLUGS = [
  'high-altitude-roll-forming-lift-rfq-data',
  'roof-zone-survey-roll-forming-lift-selection',
  'crawler-roll-forming-lift-access-route-survey',
  'crawler-roll-forming-lift-ground-support-review',
  'crawler-roll-forming-lift-work-zone-relocation',
  'truck-mounted-forming-lift-jobsite-setup-review',
  'truck-mounted-lift-destination-chassis-sourcing',
  'truck-mounted-forming-lift-road-transport-documents',
  'lifted-roll-forming-line-mounting-interface-review',
  'roof-level-roll-forming-lift-coil-loading-plan',
  'elevated-roll-forming-roof-panel-handover-zones',
  'roof-level-roll-forming-weather-hold-points',
  'lift-roll-forming-system-commissioning-plan',
  'roll-forming-lift-technical-document-package',
  'large-deck-crawler-platform-vs-basket-lift',
  'large-crawler-work-platform-building-entry-survey',
  'large-deck-crawler-platform-work-zone-layout',
  'large-deck-platform-wall-panel-access-planning',
  'crawler-ceiling-platform-site-acceptance-records',
  'crawler-platform-maintenance-spares-handover',
];
```

For every slug, assert that the Markdown file exists, `LAUNCH_SLUGS` includes it, a same-slug SVG exists, a matching manifest record is `editorial`, and the article references that SVG. Assert 41 total public blog Markdown files and no deletion of the frozen 21-slug baseline.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npx vitest run tests/twenty-lift-platform-articles.test.mjs`

Expected: FAIL because the 20 article and SVG files and audit entries do not exist.

- [ ] **Step 3: Extend audit and build baselines without creating content**

Append the 20 slugs to `LAUNCH_SLUGS`, the exact `launchSlugs` expectation in `tests/task-5b.test.mjs`, `BASELINE_BLOG_SLUGS`, and `baselineBlogSlugs`. Add the new focused test path to `package.json` and require that path in `tests/verification-wiring.test.mjs`.

- [ ] **Step 4: Verify the test still fails for missing deliverables**

Run: `npx vitest run tests/twenty-lift-platform-articles.test.mjs tests/verification-wiring.test.mjs`

Expected: wiring checks PASS; coverage test FAILS only for missing Markdown, SVG and manifest records.

- [ ] **Step 5: Commit the RED contract**

```text
git add package.json scripts/audit-content.mjs scripts/lib/build-output-audit.mjs tests/twenty-lift-platform-articles.test.mjs tests/verification-wiring.test.mjs tests/task-5b.test.mjs tests/build-output-audit.test.mjs
git commit -m "test: require twenty lift-platform articles"
```

### Task 2: Build the private source and claim matrix

**Files:**
- Modify: private `ARCLIFT-Blog-Claim-Ledger.md`
- Modify: private long-term keyword system

**Interfaces:**
- Consumes: product reference matrix, verified product knowledge, HSE GEIS6, HSE MEWP guidance, OSHA aerial-lift guidance, UNECE CTU Code and current destination-specific authority pages where relevant.
- Produces: one private row per article containing buyer decision, source URL, access date, source scope, allowed wording, conditional inference, project inputs, unknowns and prohibited statements.

- [ ] **Step 1: Record source scope before drafting**

Use official primary pages only. Treat HSE/OSHA wording as jurisdiction-specific safety guidance, UNECE CTU material as non-mandatory transport guidance, and destination vehicle pages as examples rather than global law.

- [ ] **Step 2: Record the claim boundary for all 20 pages**

Every row must explicitly prohibit model performance, current configuration, project result, compliance, price, availability and manufacturer identity. ARC-F25/F31/F35 remain reference concepts.

- [ ] **Step 3: Review the matrix against the design**

Confirm one unique buyer decision per slug and no overlap with the frozen 21-page baseline.

### Task 3: Add 20 accessible editorial diagrams and manifest records

**Files:**
- Create: `public/images/editorial/<slug>.svg` for every approved slug.
- Modify: `public/images/asset-manifest.json`
- Modify: `tests/public-asset-hygiene.test.mjs`

**Interfaces:**
- Consumes: each article's private decision sequence.
- Produces: 20 accessible 1600 × 900 SVGs and 20 manifest records with `classification: "editorial"` and `disclosure: "ARCLIFT editorial diagram"`.

- [ ] **Step 1: Extend the SVG hygiene list before adding assets**

Add the 20 `<slug>.svg` filenames to the accessible and mobile-readable arrays. Keep the existing requirements: three to five `data-role="decision-label"` nodes, every text node with explicit font size, 16:9 viewBox, `<title>`, `<desc>`, ARCLIFT label, no local path, private identity, specification number or prohibited promise.

- [ ] **Step 2: Run the asset tests and verify RED**

Run: `npx vitest run tests/public-asset-hygiene.test.mjs tests/twenty-lift-platform-articles.test.mjs`

Expected: FAIL because the 20 SVGs and manifest records are missing.

- [ ] **Step 3: Create diagrams in four groups**

Create five diagrams per group using distinct labels that match the article decision: inputs, review states, responsibility boundaries or evidence handoffs. Do not include model numbers, dimensions, loads, voltage, compliance marks or customer/site identifiers.

- [ ] **Step 4: Append manifest records**

Each record uses the article slug, `/images/editorial/<slug>.svg`, a topic-specific theme, `classification: "editorial"`, and `disclosure: "ARCLIFT editorial diagram"`.

- [ ] **Step 5: Run the asset tests and verify the asset portion GREEN**

Run: `npx vitest run tests/public-asset-hygiene.test.mjs tests/twenty-lift-platform-articles.test.mjs`

Expected: SVG and manifest assertions PASS; article assertions remain RED.

- [ ] **Step 6: Commit the visual system**

```text
git add public/images/editorial public/images/asset-manifest.json tests/public-asset-hygiene.test.mjs
git commit -m "feat: add lift-platform editorial diagrams"
```

### Task 4: Draft ARC-C site-fit articles 1–5

**Files:**
- Create: the Markdown files for approved slugs 1–5.
- Modify: private claim and visual ledgers.

**Interfaces:**
- Consumes: Tasks 2–3 claim rows and SVGs.
- Produces: five complete articles about RFQ data, roof zones, access route, ground support and relocation.

- [ ] **Step 1: Draft each direct answer and six hidden audit sections**

Use different public headings and paragraph rhythms. Keep height, reaction, travel state, weather limit and suitability unresolved until signed project records exist.

- [ ] **Step 2: Add the image and link package**

Each article uses its same-slug SVG plus two existing editorial body assets and one existing editorial cover, all four URLs different within the page. Add adjacent per-image disclosures and at least two decision-relevant internal links.

- [ ] **Step 3: Add four or more substantive FAQs and bounded CTA**

FAQs must answer different procurement questions. CTA requests only the controlled project inputs needed for review.

- [ ] **Step 4: Run focused audit**

Run: `node scripts/audit-content.mjs`

Expected: the five new articles score 100/100 with zero fatal findings; the remaining 15 missing launch slugs keep the overall batch incomplete.

- [ ] **Step 5: Commit batch 1**

```text
git add src/content/blog
git commit -m "content: add crawler lift site-fit guides"
```

### Task 5: Draft ARC-T and combined-interface articles 6–10

**Files:**
- Create: the Markdown files for approved slugs 6–10.
- Modify: private ledgers.

**Interfaces:**
- Produces: five articles covering truck setup, chassis sourcing, road documents, mounting interface and coil loading.

- [ ] **Step 1: Draft articles with jurisdiction and responsibility boundaries**

Road and chassis pages distinguish public-road, controlled-road and site-only assumptions without giving legal advice. Mounting and coil pages distinguish visible architecture, project inputs and final engineering documents.

- [ ] **Step 2: Add four-image, link, source and FAQ packages**

Use current official pages only for the adjacent general principle. Keep all vehicle identifiers, project addresses and private drawings out of public content.

- [ ] **Step 3: Run focused audit and Unicode scan**

Run: `node scripts/audit-content.mjs`

Run: `rg -n "�|Ã|Â|â€™|â€“|â€”" src/content/blog`

Expected: ten completed new articles score 100/100 and contain no mojibake.

- [ ] **Step 4: Commit batch 2**

```text
git add src/content/blog
git commit -m "content: add truck and interface review guides"
```

### Task 6: Draft roof handover and documentation articles 11–14

**Files:**
- Create: the Markdown files for approved slugs 11–14.
- Modify: private ledgers.

**Interfaces:**
- Produces: four articles covering roof-panel handover, weather hold points, combined commissioning and controlled technical documents.

- [ ] **Step 1: Draft with method-statement and evidence boundaries**

Do not publish weather limits, commissioning results or claim that a document exists. Explain who must supply or approve each input.

- [ ] **Step 2: Complete images, sources, internal links and FAQs**

- [ ] **Step 3: Run the content audit**

Run: `node scripts/audit-content.mjs`

Expected: fourteen completed new articles score 100/100 with zero fatal findings.

- [ ] **Step 4: Commit batch 3**

```text
git add src/content/blog
git commit -m "content: add roof handover and document guides"
```

### Task 7: Draft large-deck crawler platform articles 15–20

**Files:**
- Create: the Markdown files for approved slugs 15–20.
- Modify: private ledgers.

**Interfaces:**
- Produces: six articles covering access-method comparison, building entry, work-zone layout, wall-panel access, site acceptance and lifecycle handover.

- [ ] **Step 1: Draft with ARC-F evidence limits**

Do not imply ARC-F25/F31/F35 are delivered current models. Do not state deck size, payload, travel state, floor pressure, performance, stock, service interval or parts availability.

- [ ] **Step 2: Complete images, sources, internal links and FAQs**

- [ ] **Step 3: Run the full focused test and audit**

Run: `npx vitest run tests/twenty-lift-platform-articles.test.mjs tests/task-5b.test.mjs tests/public-asset-hygiene.test.mjs`

Run: `npm run audit:content`

Expected: all 20 deliverables exist; all 41 articles score 100/100 with zero fatal findings.

- [ ] **Step 4: Commit batch 4**

```text
git add src/content/blog
git commit -m "content: add large-deck crawler platform guides"
```

### Task 8: Perform human editing and private ledger closure

**Files:**
- Modify: all 20 new Markdown files as required by review.
- Modify: private claim, evidence and keyword records.

**Interfaces:**
- Produces: a closed Layer A review and natural English copy.

- [ ] **Step 1: Read every article completely**

Remove repeated openings, rubric language, template transitions, empty cautions, vague pronouns and duplicated FAQ cadence. Verify that each paragraph answers its article's unique buyer decision.

- [ ] **Step 2: Reconcile public copy to private ledgers**

Every material claim must fit its recorded source or condition. Every image URL, alt, caption, classification and disclosure must match the visual ledger.

- [ ] **Step 3: Run overlap, identity and privacy scans**

Search changed source and built output for local paths, source identity, customer/project clues, factory/manufacturer implications, prohibited claims and mojibake.

- [ ] **Step 4: Update the keyword system and local review record**

Mark all 20 as locally ready, with Search Console and indexing still pending/owner-operated. Do not fabricate performance data.

### Task 9: Run full local verification and visual review

**Files:**
- Create: `docs/operations/2026-08-07-arclift-twenty-article-local-review.md`

**Interfaces:**
- Produces: evidence that the committed local tree is reviewable and publishable.

- [ ] **Step 1: Run the complete mechanical gates**

Run: `npm run audit:content`

Run: `npm run verify`

Run: `git diff --check`

Expected: 41 articles at 100/100, zero fatal findings, full verify exit 0 and clean diff check.

- [ ] **Step 2: Build and inspect representative routes**

Start the local server using the repository's background mode. Inspect desktop and 390px mobile for one article from each of the four content batches plus the blog index and page 2. Check headings, disclosures, images, tables, links, focus order and horizontal overflow.

- [ ] **Step 3: Verify no deletion and exact route coverage**

Confirm 41 Markdown articles, 20 new sitemap routes, all existing product/blog routes retained, all 20 new SVGs present and no principal asset missing.

- [ ] **Step 4: Write the local review record and commit final fixes**

```text
git add docs/operations src/content/blog public/images tests scripts package.json
git commit -m "docs: record twenty-article local verification"
```

### Task 10: Make one publication attempt and obey stop conditions

**Files:**
- Modify: private release record only.

**Interfaces:**
- Consumes: clean verified commit, remote-main SHA and existing GitHub authentication.
- Produces: either verified production deployment or an immediate failure record and stop.

- [ ] **Step 1: Re-run fresh verification on the exact HEAD to be pushed**

Run `npm run audit:content`, `npm run verify`, `git diff --check`, `git status --short` and `git rev-parse HEAD`. Stop before push if any local result is not clean.

- [ ] **Step 2: Read remote main and verify fast-forward ancestry**

Use a read-only direct GitHub request. If remote main moved, stop and report; do not merge, rebase or force-push in this task.

- [ ] **Step 3: Make one normal push attempt**

Push `HEAD:main` without force. If the command fails or the remote SHA cannot be verified, record the exact error and stop immediately without retry.

- [ ] **Step 4: Observe Cloudflare once GitHub accepts the commit**

If the Cloudflare build fails, record the build/check URL and stop without debugging or retrying. If it succeeds, verify the 20 production URLs, exact self-canonicals, image responses, sitemap inclusion, blog pagination and representative desktop/mobile reading paths.

- [ ] **Step 5: Close the private release record**

Record only observed results. Leave Search Console indexing as pending/owner-operated. Restore the default local-only/no-push boundary for future tasks.

