# ARCLIFT canonical URL alignment implementation plan

**Goal:** Make the repository enforce the existing www HTTPS trailing-slash page convention and exclude all blog pagination paths from the sitemap without changing content.

**Architecture:** Extend the existing Astro configuration, sitemap predicate and exact redirect rules. Preserve current main content and restrict changes to URL policy and its regression checks.

**Tech stack:** Astro static output, @astrojs/sitemap, Vitest, Cloudflare static hosting.

**Spec:** `ARCLIFT-Codex-trailing-slash-task.md` (2026-11-01).

## Constraints and review focus

- Preserve every current main article, product specification, marketing text, inquiry endpoint and existing edge rule.
- Page URLs include a trailing slash before query/fragment; external APIs, file assets and external sites retain their valid original URLs.
- Pagination remains accessible and self-canonical with `noindex,follow`, excluded from sitemap. `/blog/page-speed/` remains an eligible article.
- Keep the four legacy product redirects; append only `/blog/page` and `/blog/page/` to `/blog/` with 301.
- Verify the authorized hosting target before deployment. Do not alter DNS or route ownership; keep account-specific operational records outside the public repository.

## Tasks

- [ ] Capture current main and public production baseline, including content preservation and hosting identity.
- [ ] Add failing sitemap boundary tests in `tests/build-output-audit.test.mjs` for pagination root, descendants and query variants, with near-miss article controls; strengthen original internal-link path assertions in `tests/brand-identity.test.mjs` without changing API behavior.
- [ ] Add `trailingSlash: 'always'` in `astro.config.mjs`; broaden `scripts/lib/sitemap-policy.mjs`; append two exact rules in `public/_redirects`.
- [ ] Run targeted tests red/green, fresh build, content/site tests and relevant browser checks; audit all generated page links, canonical URLs, sitemap entries and pagination 2–7. Record any pre-existing failures explicitly.
- [ ] Independently review the diff and ensure no content or asset changes. Update `docs/cloudflare-redirects.md` with URL policy and generic deployment commands.
- [ ] Commit only task files; publish a reviewable PR or deployment record. Deploy only verified output to the authorized hosting target; verify public 301/200, sitemap and query/resource behavior.
