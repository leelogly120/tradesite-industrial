# ARCLIFT Two Platform Articles — Implementation Plan

> Execute in the existing isolated `codex/arclift-mobile-performance-20260809` worktree. Do not modify Contact, inquiry routing, product parameters, or any existing blog route. Publish the already-reviewed mobile PageSpeed work in the same release.

## Task 1: Freeze the 45-page release contract with a failing test

- Add `tests/two-daily-lift-platform-articles-20260810.test.mjs` containing the two approved slugs, titles, diagram names, word/structure rules, audit coverage, SVG accessibility rules, and manifest disclosure requirements.
- Add the test to `package.json` and `tests/verification-wiring.test.mjs`.
- Run only the new test and confirm RED because the new pages, registry entries, SVGs, and manifest records are absent.

## Task 2: Extend the protected registry and audit scope

- Add `AUGUST_10_LIFT_PLATFORM_ARTICLES` and its slug export to `scripts/lift-platform-article-registry.mjs`.
- Extend `ALL_LIFT_PLATFORM_ARTICLES` and the executable audit scope to 45 pages.
- Update earlier preservation tests to retain their frozen subsets while requiring the combined 45-page library.
- Do not change or remove any of the 43 existing Markdown routes.

## Task 3: Create evidence-safe visual assets

- Create `public/images/editorial/aerial-platform-familiarization-handover.svg`.
- Create `public/images/editorial/large-crawler-platform-transport-data-package.svg`.
- Give each SVG a `viewBox="0 0 1600 900"`, accessible title and description, ARCLIFT label, and three to five `data-role="decision-label"` nodes with a minimum 42 px source font size.
- Add both records to `public/images/asset-manifest.json` with editorial classification and the exact disclosure: `AI-assisted editorial diagram; not evidence of ARCLIFT equipment, configuration, project, capability or result`.

## Task 4: Write the familiarization and handover article

- Create `src/content/blog/aerial-platform-familiarization-handover.md`.
- Define the boundary between formal training, machine-specific familiarization, site briefing, authorization, pre-use checks, and rescue arrangements.
- Cover role ownership, controlled manuals/instructions, feature and limitation review, normal and emergency controls, supervised demonstration, knowledge gaps, authorization record, change triggers, and handover evidence.
- Cite OSHA, HSE, and IPAF only within their stated jurisdictions and guidance roles.
- Use the planned cover and exactly three distinct body images with adjacent non-evidence disclosures.

## Task 5: Write the large crawler platform transport-data article

- Create `src/content/blog/large-crawler-platform-transport-data-package.md`.
- Cover data ownership, machine identity/state, mass and geometry placeholders, center-of-gravity and approved interface boundaries, carrier inputs, route/site interface, stowage/restraint responsibility, loading/unloading roles, staged handover, changes, and holds.
- State explicitly that the article does not design restraint, approve a carrier, determine permits, or prescribe equipment-specific loading/unloading.
- Cite IPAF, HSE, and IMO guidance only as planning context.
- Use the planned cover and exactly three distinct body images with adjacent non-evidence disclosures.

## Task 6: Complete private evidence and editorial ledgers

- Add source-to-claim entries for both articles in the private claim ledger.
- Add each cover/body visual, classification, disclosure, and evidence limitation to the private visual ledger.
- Update the long-term keyword/content register with intent, cluster, non-overlap boundary, and publication state.
- Create the dated private release report and record the full self-review outcome.

## Task 7: Run focused and full gates

- Run the new focused test and all directly affected registry/wiring tests.
- Run `npm run audit:content`; require 100/100, zero fatal issues, and 45 audited pages.
- Run privacy/identity scans and a manual anti-AI prose review.
- Run `npm run verify`; require worker tests, all content tests, the 73-page build/audit, and Playwright to pass.

## Task 8: Visual QA

- Serve the production build locally.
- Inspect both new pages at 1440×900 and 390×844.
- Confirm title, Contents, all image/caption pairs, links, FAQ, no horizontal overflow, and no broken assets.
- Recheck the homepage at mobile and desktop widths so the previous PageSpeed changes are covered by the final release evidence.

## Task 9: Publish the combined branch and verify production

- Fetch `origin`, confirm remote `main` still matches the reviewed baseline, and inspect the complete `origin/main...HEAD` diff.
- Commit the two-article release and push `HEAD:main` without force.
- Monitor the GitHub/Cloudflare deployment path until the new commit is live or a real external blocker is identified.
- Verify the homepage and both new article URLs return 200, self-canonicalize, appear in the live sitemap, load key assets, and render correctly on mobile and desktop.
- Do not claim Search Console inspection or indexing unless that interface was actually used.

## Task 10: Close the operational record

- Add commit, push, deployment, live-URL, sitemap, test, and known-limit results to the private release report.
- Update the private work log with reusable lessons from this release.
- Leave the machine running; no shutdown action is authorized.
