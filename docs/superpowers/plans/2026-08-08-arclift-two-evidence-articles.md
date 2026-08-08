# ARCLIFT Two Evidence-First Articles — Implementation Plan

> Execute in the isolated `codex/arclift-two-articles-20260808` worktree. Do not modify Contact, inquiry routing, product parameters, or any existing blog route.

## Task 1: Freeze the release contract with a failing test

- Add a focused test containing the two approved slugs, titles, diagram names, word/structure rules, audit coverage, and manifest requirements.
- Update `package.json` verification wiring to include the test.
- Run the focused test and confirm it fails because the two articles are absent.

## Task 2: Extend the protected registry and audit scope

- Add a two-item daily article registry and combined slug export.
- Extend the executable content-audit slug set to 43.
- Update the existing 41-page preservation assertions to require exactly 43 pages while retaining the frozen 21+20 baseline.
- Keep build-output route accounting dynamic and update any literal fixture expectations only when a test proves it necessary.

## Task 3: Create evidence and visual assets

- Create one accessible 1600×900 SVG decision diagram per article with three to five mobile-readable decision labels.
- Add both manifest records with editorial classification and exact non-evidence disclosure.
- Use existing, distinct editorial visuals for the remaining body images and covers.

## Task 4: Write the two articles

- Write the configuration-change article around baseline, change request, impact review, release, status accounting, limitations, and buyer inputs.
- Write the destination-receipt article around pre-arrival ownership, safe receipt boundary, identity/condition evidence, discrepancy quarantine, storage, and staged release.
- Keep claims conditional and project-specific; use only authoritative external sources for technical context.

## Task 5: Run focused and full content gates

- Run the focused two-article test.
- Run `npm run audit:content` and require 100/100 with zero fatal issues.
- Run `npm run verify` and require all tests, build audit, sitemap generation, and E2E checks to pass.

## Task 6: Visual QA

- Serve the production build locally.
- Inspect both pages at 1440×900 and 390×844.
- Confirm title, Contents, images, captions, links, FAQ, no horizontal overflow, and no broken assets.

## Task 7: Publish and verify

- Review the diff for privacy, identity, claims, deletions, and out-of-scope changes.
- Commit the complete release.
- Push the feature branch commit to `origin/main` only if remote `main` still matches the reviewed baseline.
- Monitor the GitHub/Cloudflare deployment path and verify both live URLs return 200, self-canonicalize, and appear in the live sitemap.

## Task 8: Record private operational knowledge

- Add the claim/visual ledger, test evidence, deployment result, and indexing/ranking observations to the private Vault.
- Do not write Search Console assertions unless URL Inspection or the Performance report was actually accessible.
