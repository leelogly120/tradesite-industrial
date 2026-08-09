# ARCLIFT Mobile PageSpeed Optimization Design

Date: 2026-08-09

## Outcome

Improve the ARCLIFT homepage's mobile lab performance and accessibility without changing public copy, inquiry behavior, product parameters, published routes, or desktop visual intent. Work remains local on an isolated branch based on the deployed `origin/main`; this task does not authorize a push or deployment.

## Evidence baseline

The 2026-08-09 PageSpeed Insights report for `https://arclifteq.com/` provides no field-data assessment, so this design uses Lighthouse lab evidence:

- Mobile: Performance 70, Accessibility 94, Best Practices 100, SEO 100.
- Mobile metrics: FCP 2.6 s, LCP 7.2 s, TBT 0 ms, CLS 0, Speed Index 4.3 s.
- Desktop: Performance 96, Accessibility 94, Best Practices 100, SEO 100.
- Desktop metrics: FCP 0.7 s, LCP 1.3 s, TBT 0 ms, CLS 0.002, Speed Index 0.7 s.
- The mobile LCP node is the homepage `h1.hero__title`; the report records 2.31 s of element render delay.
- The external Google Fonts stylesheet and the first-party stylesheet form a render-blocking path with an estimated mobile saving of 1.07 s. Google Fonts accounts for 750 ms in the report.
- Image delivery reports an estimated 410.9 KiB mobile saving. The two named sources are `large-deck-steel-structure.webp` and `under-ceiling-field-v2.webp`.
- Accessibility failures are low-contrast trust/footer text and a footer heading-level skip.
- Cloudflare's injected beacon has a one-day cache lifetime, but the reported saving is only about 5 KiB and it is not a scored bottleneck.

## Options considered

1. **Selected: targeted mobile-first optimization.** Disable mobile autoplay, defer inactive hero backgrounds, remove the external font dependency, add responsive variants only for images named by the report, and fix the two accessibility defects. This addresses measured causes while preserving the desktop experience.
2. **Minimal patch.** Disable mobile autoplay and remove Google Fonts only. Lower implementation risk, but it leaves approximately 411 KiB of known image waste and the Accessibility 94 defects.
3. **Full hero replacement.** Remove the carousel on every viewport, rebuild the hero around one responsive `<picture>`, inline critical CSS, and migrate broad site imagery to AVIF. This may yield a higher synthetic score but changes the approved desktop experience and expands the task beyond the measured bottlenecks.

## Selected design

### 1. Workspace and release boundary

- Use branch `codex/arclift-mobile-performance-20260809` in the isolated worktree created from deployed commit `229c43c`.
- Preserve the divergent local `main` commit `d15393e` and its product-content assets without rebasing, resetting, deleting, or merging it during this task.
- Commit locally after verification. Do not push, deploy, alter Cloudflare settings, submit Search Console actions, or shut down the computer.

### 2. Mobile carousel behavior

- Keep all five slides and all five accessible dot controls.
- Treat reduced motion and mobile/non-fine-pointer viewports as autoplay-disabled states.
- On mobile, set a visible state such as `data-autoplay="disabled-mobile"`, remain on slide 1 after the current six-second interval, and allow every dot to select its slide manually.
- On fine-pointer desktop viewports of at least 769 px, preserve the six-second autoplay, hover pause, focus pause, reduced-motion handling, and current accessible state changes.
- Keep the first slide's background available in the initial HTML so the no-JavaScript fallback remains useful.
- Store slides 2-5 as deferred background URLs. Load an inactive background only when a user selects that slide or when desktop idle-time preparation makes it the next autoplay candidate. A mobile first load must not request slides 2-5.
- If JavaScript does not run, slide 1, its title, description, and both CTA links remain visible and usable.

### 3. Font and render path

- Remove the two Google Fonts preconnects, the stylesheet preload, and the blocking Google Fonts stylesheet from `BaseLayout.astro`.
- Replace `'Inter'` with a stable system UI stack headed by `system-ui` and `-apple-system`; preserve existing sizes, weights, line heights, and letter spacing.
- Do not inline the complete global stylesheet or introduce a font package. The first-party stylesheet is small, cached, and necessary to prevent an unstyled first paint.

### 4. Responsive image delivery

- Create an approximately 800 px wide WebP derivative for each report-named image while retaining the original file as the high-resolution fallback.
- Add explicit `width`, `height`, and `srcset` attributes. Use card-width breakpoints for product cards and half-width/stacked breakpoints for split and application media through their `sizes` attributes.
- Keep `loading="lazy"` for all below-the-fold instances.
- Preserve the originals, editorial classification, disclosure, and non-evidentiary role. Register derivatives in the public asset manifest and strip private/camera/location metadata; AI-assisted derivatives retain the source disclosure classification.
- Target each derived asset at no more than 100 KiB without visible mobile artifacts. If that budget cannot be met without visible degradation, keep the smallest visually acceptable output and record its measured size.

### 5. Accessibility corrections

- Raise `.trust__text` from the failing light gray to the existing readable muted-text color.
- Raise the footer's default text and link color enough to pass WCAG AA contrast against `#0a0a0a`, while preserving the current dark-footer appearance.
- Replace footer group `h4` elements with semantic `h2` elements using a dedicated visual class, so the footer does not skip heading levels on pages whose main content starts at `h1`.
- Do not change link destinations, contact details, labels, or footer business claims.

### 6. Verification design

Use test-first changes for every behavior:

- A mobile E2E regression first proves that current autoplay advances after six seconds; after implementation it must prove the first slide remains selected and `data-autoplay="disabled-mobile"` is exposed.
- The same mobile test must prove all five dots remain operable.
- The desktop regression must continue proving autoplay advances and pauses on hover/focus.
- A request-level or source-level regression must prove mobile initial load does not eagerly expose background requests for slides 2-5.
- Content tests must fail before implementation when Google Fonts links remain, responsive derivatives/markup are absent, or the footer heading structure remains incorrect.
- Asset tests verify derivative existence, dimensions, format, size budget, manifest registration, and metadata/disclosure hygiene.
- Run focused red/green tests, then `npm run audit:content` and the full `npm run verify` gate.
- Inspect the built homepage at 390x844 and 1440x900 for overflow, hero readability, image quality, carousel controls, CTA targets, and footer layout.
- Run three mobile Lighthouse measurements against the same local production build and preset. Use the median; target Performance >= 90, LCP <= 2.5 s, TBT = 0 ms, and CLS <= 0.01. Treat these as local acceptance targets, not as claims about the undeployed production site.
- A new online PageSpeed result can only be measured after a separately authorized deployment. No exact production score is promised before that step.

### 7. Report artifact

Maintain a private project-Vault operations report containing the captured PageSpeed baseline, root-cause evidence, changed files, test output, local Lighthouse medians, unresolved Cloudflare-only observations, and the explicit no-push status. Do not add the private report or local paths to the public site repository.

## Out of scope

- Contact styling, inquiry routing, field requirements, Worker behavior, WhatsApp/email destinations, and conversion copy.
- Product specifications, product evidence, product images outside the two report-named homepage sources, and product-content branch integration.
- Blog copy, existing article routes, redirects, canonical rules, sitemap policy, and indexing requests.
- Cloudflare Web Analytics/Beacon settings, cache policy, DNS, deployment configuration, or production publishing.
- Broad CSS refactoring, framework migration, new dependencies, or a site-wide image-format migration.

## Failure handling

- If the clean baseline fails, stop before implementation and report the pre-existing failure.
- If a responsive derivative fails evidence or metadata gates, do not publish it in markup; correct the derivative pipeline first.
- If three local Lighthouse runs vary materially, report every score and the median instead of selecting the best run.
- If the target metrics are not met, return to the measured audit evidence and form one new hypothesis at a time; do not stack speculative optimizations.
