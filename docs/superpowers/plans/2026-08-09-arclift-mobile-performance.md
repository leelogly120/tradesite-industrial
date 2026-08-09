# ARCLIFT Mobile PageSpeed Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise the ARCLIFT homepage's measured mobile performance without changing its inquiry route, product claims, public URLs, desktop carousel experience, or visual identity.

**Architecture:** Keep the existing Astro-rendered homepage and progressive-enhancement script. Stabilize the mobile LCP candidate by limiting automatic carousel behavior to desktop pointer devices, expose inactive slide backgrounds only when needed, remove the third-party font dependency, serve audited responsive image derivatives, and correct the two accessibility findings with semantic HTML and contrast-safe CSS. Protect every change with browser-level behavior tests plus asset metadata tests before running the project's complete verification gate.

**Tech Stack:** Astro 7, TypeScript, CSS, Playwright 1.61, Vitest 4, Sharp 0.35, Lighthouse 13

## Global Constraints

- Work only on the isolated branch created from deployed `origin/main` at commit `229c43c`.
- Preserve the existing local `main` branch and its unpublished product-content commit.
- Do not push, deploy, request indexing, alter DNS/Cloudflare settings, or change the public sitemap in this implementation.
- Do not delete or redirect any existing article, product, solution, or case-study URL.
- Do not change Contact styling, inquiry routing, form behavior, product parameters, or externally visible technical claims.
- Preserve all existing ARCLIFT identity and evidence rules. New image derivatives inherit the source asset's classification and disclosure; do not invent or remove disclosures.
- Keep the original image files. Add responsive derivatives rather than replacing the evidence-bearing source assets.
- Treat the captured PageSpeed run as a production baseline, not a promise of an identical local Lighthouse score: mobile Performance 70, Accessibility 94, FCP 2.6 s, LCP 7.2 s, TBT 0 ms, CLS 0; desktop Performance 96.
- Leave Cloudflare beacon/RUM code unchanged because the report attributes only a small non-scoring cache opportunity to it.
- Record final evidence in the private project Vault only; do not put machine paths, private operational notes, or login details in this repository.

---

## Task 1: Freeze the mobile LCP candidate and defer inactive hero backgrounds

**Files:**

- Modify: `tests/homepage.spec.ts`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add a failing mobile behavior test**

Add this test inside the existing mobile homepage group in `tests/homepage.spec.ts`:

```ts
test('keeps the mobile hero stable and defers inactive slide backgrounds', async ({ page }) => {
  const requestedHeroPaths = new Set<string>();

  page.on('request', (request) => {
    const pathname = new URL(request.url()).pathname;
    if (pathname.startsWith('/images/hero/') || pathname.startsWith('/images/editorial/')) {
      requestedHeroPaths.add(pathname);
    }
  });

  await openHomepage(page, mobile);

  const hero = page.locator('.hero');
  const slides = hero.locator('.hero__slide');
  const dots = hero.locator('.hero__dot');
  const inactiveBackgrounds = [
    '/images/hero/hero-2.webp',
    '/images/editorial/port-loading-logistics.webp',
    '/images/editorial/truck-site-roll-forming-lift.webp',
    '/images/hero/hero-5.webp',
  ];

  await expect(hero).toHaveAttribute('data-autoplay', 'disabled-mobile');
  await expect(slides.nth(0)).toHaveClass(/hero__slide--active/);
  expect(requestedHeroPaths.has('/images/hero/hero-1-arclift.webp')).toBe(true);
  for (const pathname of inactiveBackgrounds) {
    expect(requestedHeroPaths.has(pathname), `${pathname} should be deferred`).toBe(false);
  }

  await page.waitForTimeout(6_500);
  await expect(slides.nth(0)).toHaveClass(/hero__slide--active/);

  await dots.nth(1).click();
  await expect(slides.nth(1)).toHaveClass(/hero__slide--active/);
  await expect.poll(() => requestedHeroPaths.has('/images/hero/hero-2.webp')).toBe(true);
});
```

Use the existing mobile viewport helper/name from the file rather than creating a duplicate configuration if its identifier differs.

- [ ] **Step 2: Prove the test fails for the intended reasons**

Run:

```powershell
npx playwright test tests/homepage.spec.ts --project=mobile-chromium --grep "keeps the mobile hero stable"
```

Expected failure: the carousel reports `running`, advances after six seconds, and the browser requests inactive inline background images during initial load.

- [ ] **Step 3: Change inactive slide markup from eager style URLs to deferred data URLs**

In `src/pages/index.astro`, keep the first slide's `background-image` in the initial HTML and mark it loaded. Replace each later slide's inline background declaration with `data-background`:

```astro
<div
  class="hero__slide hero__slide--brand hero__slide--active"
  role="img"
  aria-label="AI-assisted editorial visual of an ARCLIFT-branded red crawler platform in a steel structure"
  aria-hidden="false"
  data-index="0"
  data-background-loaded="true"
  style="background-image: url('/images/hero/hero-1-arclift.webp');"
  ...
></div>

<div
  class="hero__slide"
  role="img"
  aria-label="Editorial visual of roof-level roll forming and long-panel feed direction"
  aria-hidden="true"
  data-index="1"
  data-background="/images/hero/hero-2.webp"
  ...
></div>
```

Apply the same `data-background` pattern to slides 2 through 5 without changing their text, labels, or image URLs.

- [ ] **Step 4: Load a slide background only when it becomes relevant**

Add this helper before `goToSlide` and call it at the start of `goToSlide(index)`:

```ts
function ensureSlideBackground(slide: Element | undefined) {
  if (!(slide instanceof HTMLElement) || slide.dataset.backgroundLoaded === 'true') return;

  const background = slide.dataset.background;
  if (!background) return;

  slide.style.backgroundImage = `url("${background}")`;
  slide.dataset.backgroundLoaded = 'true';
}

function goToSlide(index: number) {
  const nextIndex = (index + slides.length) % slides.length;
  ensureSlideBackground(slides[nextIndex]);
  currentSlide = nextIndex;
  // Preserve the existing class, aria-hidden, dot, text, and live-region updates.
}
```

- [ ] **Step 5: Restrict autoplay to desktop pointer devices while keeping manual mobile controls**

Introduce the desktop autoplay query and a background warm-up timer alongside the existing reduced-motion query:

```ts
const heroDesktopAutoplay = window.matchMedia('(min-width: 769px) and (pointer: fine)');
let backgroundWarmupTimer: number | undefined;

function scheduleNextBackground() {
  if (!heroDesktopAutoplay.matches || heroReducedMotion.matches) return;
  if (backgroundWarmupTimer) window.clearTimeout(backgroundWarmupTimer);

  backgroundWarmupTimer = window.setTimeout(() => {
    ensureSlideBackground(slides[(currentSlide + 1) % slides.length]);
  }, 1_500);
}
```

Update `stopAutoplay` so it clears both the interval and the warm-up timer. Update `startAutoplay` in this order:

```ts
function startAutoplay() {
  if (heroReducedMotion.matches) {
    stopAutoplay('disabled');
    return;
  }

  if (!heroDesktopAutoplay.matches) {
    stopAutoplay(window.matchMedia('(max-width: 768px)').matches ? 'disabled-mobile' : 'disabled-input');
    return;
  }

  if (heroHovered || heroFocused) {
    stopAutoplay('paused');
    return;
  }

  stopAutoplay('paused');
  scheduleNextBackground();
  carouselTimer = window.setInterval(() => {
    nextSlide();
    scheduleNextBackground();
  }, slideInterval);
  hero.dataset.autoplay = 'running';
}
```

Listen for `heroDesktopAutoplay` changes in addition to the current reduced-motion listener. Preserve all dot click handlers, keyboard navigation, hover/focus pause behavior, aria attributes, and the existing six-second desktop timing.

- [ ] **Step 6: Run the new mobile test and the existing desktop carousel test**

Run:

```powershell
npx playwright test tests/homepage.spec.ts --project=mobile-chromium --grep "keeps the mobile hero stable"
npx playwright test tests/homepage.spec.ts --project=desktop-chromium --grep "carousel"
```

Expected: both pass. The mobile test proves no automatic LCP text replacement or inactive hero downloads; the existing desktop test proves autoplay and pause/resume behavior remain intact.

- [ ] **Step 7: Commit the isolated carousel change**

```powershell
git add src/pages/index.astro tests/homepage.spec.ts
git commit -m "perf: stabilize mobile homepage hero"
```

---

## Task 2: Remove third-party font blocking and fix reported accessibility issues

**Files:**

- Modify: `tests/homepage.spec.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add a browser-level font, heading, and contrast regression test**

Add the following helper and test to `tests/homepage.spec.ts`:

```ts
function rgbToLuminance(rgb: string) {
  const channels = rgb.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
  if (channels.length !== 3) return 0;
  const linear = channels.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

test('uses local fonts and preserves accessible homepage text hierarchy', async ({ page }) => {
  const fontRequests: string[] = [];
  page.on('request', (request) => {
    const hostname = new URL(request.url()).hostname;
    if (hostname === 'fonts.googleapis.com' || hostname === 'fonts.gstatic.com') {
      fontRequests.push(request.url());
    }
  });

  await openHomepage(page, mobile);
  expect.soft(fontRequests).toEqual([]);
  await expect.soft(page.locator('.footer').getByRole('heading', { level: 2 })).toHaveCount(4);

  const samples = await page.locator(
    '.trust__text, .footer__brand-desc, .footer a, .footer__bottom span',
  ).evaluateAll((elements) => elements.map((element) => {
    const foreground = getComputedStyle(element).color;
    let current: Element | null = element;
    let background = 'rgb(255, 255, 255)';

    while (current) {
      const candidate = getComputedStyle(current).backgroundColor;
      const alpha = candidate.match(/[\d.]+/g)?.map(Number)[3] ?? 1;
      if (alpha > 0) {
        background = candidate;
        break;
      }
      current = current.parentElement;
    }

    return { foreground, background, text: element.textContent?.trim() };
  }));

  for (const sample of samples) {
    const foreground = rgbToLuminance(sample.foreground);
    const background = rgbToLuminance(sample.background);
    const ratio = (Math.max(foreground, background) + 0.05) /
      (Math.min(foreground, background) + 0.05);
    expect.soft(ratio, sample.text).toBeGreaterThanOrEqual(4.5);
  }
});
```

If the file already has an equivalent color helper, reuse it. Keep this as a computed-style test so a future CSS regression fails even if class names remain present.

- [ ] **Step 2: Prove the new test fails on all three current findings**

Run:

```powershell
npx playwright test tests/homepage.spec.ts --project=mobile-chromium --grep "uses local fonts"
```

Expected failure evidence: requests to Google Fonts, zero footer level-2 headings, and contrast below 4.5 for the trust/footer samples named by PageSpeed.

- [ ] **Step 3: Remove Google Fonts from the document head**

Delete only these external font links from `src/layouts/BaseLayout.astro`:

```astro
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" as="style" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" />
```

Do not add a replacement network font. Update the global body stack to:

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

- [ ] **Step 4: Correct the footer heading hierarchy without changing its appearance or links**

Replace the four footer `<h4>` elements with:

```astro
<h2 class="footer__heading">Products</h2>
```

Use the same pattern for Solutions, Company, and Contact. Rename the CSS selector from `.footer h4` to `.footer__heading` and preserve every existing visual declaration. Do not edit footer destinations, link labels, email, phone, WhatsApp, or Contact calls to action.

- [ ] **Step 5: Apply contrast-safe colors to the exact reported elements**

Use these values in `src/styles/global.css`:

```css
.trust__text {
  color: #64748b;
}

.footer {
  color: #94a3b8;
}

.footer a {
  color: #94a3b8;
}
```

Retain existing hover/focus colors. The trust text remains visually secondary on white, and footer body text/links meet the 4.5:1 body-text threshold against the existing dark footer background.

- [ ] **Step 6: Run the focused test and verify the head has no font dependency**

Run:

```powershell
npx playwright test tests/homepage.spec.ts --project=mobile-chromium --grep "uses local fonts"
rg -n "fonts\.(googleapis|gstatic)\.com|font-family:.*Inter" src
```

Expected: Playwright passes and `rg` returns no matches.

- [ ] **Step 7: Commit the font and accessibility change**

```powershell
git add src/layouts/BaseLayout.astro src/styles/global.css tests/homepage.spec.ts
git commit -m "perf: remove font blocking and fix homepage contrast"
```

---

## Task 3: Add audited responsive derivatives for the two oversized homepage images

**Files:**

- Create: `tests/homepage-performance-assets.test.mjs`
- Modify: `tests/homepage.spec.ts`
- Modify: `tests/verification-wiring.test.mjs`
- Modify: `package.json`
- Create: `public/images/editorial/large-deck-steel-structure-800.webp`
- Create: `public/images/home/under-ceiling-field-v2-800.webp`
- Modify: `public/images/asset-manifest.json`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add a permanent asset integrity test**

Create `tests/homepage-performance-assets.test.mjs`:

```js
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

const derivatives = [
  {
    path: 'public/images/editorial/large-deck-steel-structure-800.webp',
    width: 800,
    height: 450,
    manifestGroup: 'editorial',
    slug: 'large-deck-steel-structure-800',
    url: '/images/editorial/large-deck-steel-structure-800.webp',
    disclosure: 'AI-assisted editorial composite',
    requiresAiXmp: true,
  },
  {
    path: 'public/images/home/under-ceiling-field-v2-800.webp',
    width: 800,
    height: 533,
    manifestGroup: 'home',
    slug: 'under-ceiling-platform-800',
    url: '/images/home/under-ceiling-field-v2-800.webp',
    disclosure: undefined,
    requiresAiXmp: false,
  },
];

describe('homepage responsive image derivatives', () => {
  it.each(derivatives)('$path is a compact, metadata-safe WebP', async (asset) => {
    const absolute = resolve(root, asset.path);
    const [metadata, file] = await Promise.all([sharp(absolute).metadata(), stat(absolute)]);

    expect(metadata.format).toBe('webp');
    expect(metadata.width).toBe(asset.width);
    expect(metadata.height).toBe(asset.height);
    expect(file.size).toBeLessThanOrEqual(100 * 1024);
    expect(metadata.exif).toBeUndefined();
    expect(metadata.icc).toBeUndefined();
    expect(metadata.iptc).toBeUndefined();

    const xmp = metadata.xmp?.toString('utf8') ?? '';
    if (asset.requiresAiXmp) {
      expect(xmp).toContain('trainedAlgorithmicMedia');
      expect(xmp).toContain('ARCLIFT Editorial');
    } else {
      expect(xmp).toBe('');
    }
  });

  it.each(derivatives)('$url is classified in the asset manifest', async (asset) => {
    const manifest = JSON.parse(await readFile(
      resolve(root, 'public/images/asset-manifest.json'),
      'utf8',
    ));
    const record = manifest.campaigns[asset.manifestGroup].find(
      (candidate) => candidate.url === asset.url,
    );

    expect(record).toMatchObject({
      slug: asset.slug,
      url: asset.url,
      use: 'homepage responsive derivative',
      classification: 'editorial',
    });
    expect(record?.disclosure).toBe(asset.disclosure);
  });
});
```

- [ ] **Step 2: Wire the new test into the permanent content gate**

Add `tests/homepage-performance-assets.test.mjs` immediately after `tests/homepage-quality.test.mjs` in `package.json`'s `test:content` script.

In `tests/verification-wiring.test.mjs`, add the new filename to the list of mandatory permanent tests. Follow the existing assertion structure so removing the test from `test:content` fails verification.

- [ ] **Step 3: Add a failing browser test for the selected responsive sources**

Add this test to the mobile homepage group in `tests/homepage.spec.ts`:

```ts
test('selects compact homepage image sources on mobile', async ({ page }) => {
  await openHomepage(page, mobile);

  const images = [
    {
      image: page.getByAltText('Crawler Ceiling Platforms representative editorial visual'),
      expected: '/images/editorial/large-deck-steel-structure-800.webp',
    },
    {
      image: page.getByAltText('ARCLIFT-branded large crawler under-ceiling platform working inside a steel structure'),
      expected: '/images/home/under-ceiling-field-v2-800.webp',
    },
    {
      image: page.getByAltText('Representative under-ceiling platform visual in a steel structure'),
      expected: '/images/home/under-ceiling-field-v2-800.webp',
    },
  ];

  for (const item of images) {
    await item.image.scrollIntoViewIfNeeded();
    await expect.poll(async () => {
      const currentSrc = await item.image.evaluate((image: HTMLImageElement) => image.currentSrc);
      return new URL(currentSrc).pathname;
    }).toBe(item.expected);
  }
});
```

Confirm the exact existing alt text before applying the test; do not change public copy merely to satisfy a locator.

- [ ] **Step 4: Prove the asset and browser tests fail before implementation**

Run:

```powershell
npx vitest run tests/homepage-performance-assets.test.mjs tests/verification-wiring.test.mjs
npx playwright test tests/homepage.spec.ts --project=mobile-chromium --grep "selects compact homepage image sources"
```

Expected failures: the derivative files and manifest records are absent, and mobile `currentSrc` points to the original 1200/1600-pixel files.

- [ ] **Step 5: Generate both deterministic 800-pixel WebP derivatives**

Run these commands from the repository root. Sharp strips private metadata by default; `keepXmp()` is used only for the source whose public AI classification must be retained.

```powershell
node --input-type=module -e "import sharp from 'sharp'; const source='public/images/editorial/large-deck-steel-structure.webp'; const metadata=await sharp(source).metadata(); let output=sharp(source).resize({width:800,withoutEnlargement:true}).webp({quality:72,effort:6}); if(metadata.xmp) output=output.keepXmp(); await output.toFile('public/images/editorial/large-deck-steel-structure-800.webp');"
node --input-type=module -e "import sharp from 'sharp'; await sharp('public/images/home/under-ceiling-field-v2.webp').resize({width:800,withoutEnlargement:true}).webp({quality:72,effort:6}).toFile('public/images/home/under-ceiling-field-v2-800.webp');"
```

Do not modify the two original files. If either derivative exceeds 100 KiB, regenerate only that derivative at WebP quality 68 and rerun the metadata test.

- [ ] **Step 6: Register the derivative provenance in the public asset manifest**

Add these records beside their source records in `public/images/asset-manifest.json`:

```json
{
  "slug": "large-deck-steel-structure-800",
  "url": "/images/editorial/large-deck-steel-structure-800.webp",
  "use": "homepage responsive derivative",
  "theme": "large-deck platform in a steel structure",
  "classification": "editorial",
  "disclosure": "AI-assisted editorial composite"
}
```

```json
{
  "slug": "under-ceiling-platform-800",
  "url": "/images/home/under-ceiling-field-v2-800.webp",
  "use": "homepage responsive derivative",
  "theme": "large-deck platform in a steel structure",
  "classification": "editorial"
}
```

Do not add the derivatives to product evidence galleries; they are delivery variants of the same homepage visuals, not new evidence.

- [ ] **Step 7: Add responsive candidates and intrinsic dimensions to homepage markup**

Extend only the `Crawler Ceiling Platforms` category data with an 800-pixel candidate and intrinsic dimensions. Render category images with `srcset`, `sizes`, `width`, and `height` when these fields are present:

```astro
<img
  src={cat.image}
  srcset={cat.imageSmall ? `${cat.imageSmall} 800w, ${cat.image} ${cat.imageWidth}w` : undefined}
  sizes={cat.imageSmall ? '(max-width: 768px) calc(100vw - 48px), (max-width: 1024px) calc(50vw - 34px), calc(25vw - 35px)' : undefined}
  width={cat.imageWidth}
  height={cat.imageHeight}
  alt={cat.alt}
  loading="lazy"
/>
```

For both existing `under-ceiling-field-v2.webp` occurrences, keep the original `src` fallback and add:

```astro
srcset="/images/home/under-ceiling-field-v2-800.webp 800w, /images/home/under-ceiling-field-v2.webp 1200w"
```

Use these `sizes` values:

- Split feature image: `(max-width: 1024px) calc(100vw - 48px), 50vw`
- Application card image: `(max-width: 1024px) calc(100vw - 48px), 33vw`

Keep all current alt text, lazy-loading behavior, aspect ratios, and original fallbacks.

- [ ] **Step 8: Run the focused asset, browser, and existing evidence tests**

Run:

```powershell
npx vitest run tests/homepage-performance-assets.test.mjs tests/public-asset-hygiene.test.mjs tests/homepage-quality.test.mjs tests/verification-wiring.test.mjs
npx playwright test tests/homepage.spec.ts --project=mobile-chromium --grep "selects compact homepage image sources"
npm run audit:content
```

Expected: all pass. The original large-deck file remains 1600×900 with its public AI XMP; the source under-ceiling file remains unchanged; both new files meet the 100 KiB cap and mobile selects them.

- [ ] **Step 9: Commit responsive image delivery and its permanent gate**

```powershell
git add package.json tests/homepage-performance-assets.test.mjs tests/homepage.spec.ts tests/verification-wiring.test.mjs public/images/asset-manifest.json public/images/editorial/large-deck-steel-structure-800.webp public/images/home/under-ceiling-field-v2-800.webp src/pages/index.astro
git commit -m "perf: serve responsive homepage imagery"
```

---

## Task 4: Run full regression, visual, and local Lighthouse verification

**Files:**

- Verify only: all tracked project files
- Create outside repository: private Vault report for 2026-08-09

- [ ] **Step 1: Run formatting and content gates**

Run:

```powershell
git diff --check
npm run audit:content
```

Expected: no whitespace errors and the content audit passes without changing article, product, Contact, or inquiry data.

- [ ] **Step 2: Run the complete repository verification gate**

Run:

```powershell
npm run verify
```

Expected: Worker tests, all permanent content tests, 71-page build and build audit, then Playwright desktop/mobile suites pass. Existing intentional skips may remain; no new skips are allowed.

- [ ] **Step 3: Inspect the homepage at mobile and desktop viewports**

Build and start the local preview:

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 4322
```

At 390×844 and 1440×1000, inspect and capture the homepage with a real browser. Confirm:

- Mobile slide 1 remains selected for more than 6.5 seconds; dots remain clickable.
- Desktop still advances automatically and pauses on hover/focus.
- Headline wrapping, button placement, trust bar, category cards, split image, applications, and footer have no clipping or horizontal overflow.
- The system font change does not obscure labels or alter the inquiry/contact controls.
- Responsive images remain sharp at their rendered sizes.

If a visual issue is found, add a failing focused test before changing code, then rerun Tasks 1–3 tests that cover the affected area.

- [ ] **Step 4: Run three mobile Lighthouse measurements against the production preview build**

With the preview server running, use one PowerShell session:

```powershell
$reportRoot = Join-Path ([IO.Path]::GetTempPath()) 'arclift-lighthouse-20260809'
New-Item -ItemType Directory -Force -Path $reportRoot | Out-Null

1..3 | ForEach-Object {
  npx --yes lighthouse@13.4.1 http://127.0.0.1:4322/ `
    --form-factor=mobile `
    --screenEmulation.mobile `
    --throttling-method=simulate `
    --only-categories=performance,accessibility,best-practices,seo `
    --output=json `
    --output-path=(Join-Path $reportRoot "mobile-$_.json") `
    --chrome-flags="--headless --no-sandbox"
}
```

Parse the three reports:

```powershell
$results = 1..3 | ForEach-Object {
  $report = Get-Content -Raw (Join-Path $reportRoot "mobile-$_.json") | ConvertFrom-Json
  [pscustomobject]@{
    Run = $_
    Performance = [math]::Round($report.categories.performance.score * 100)
    Accessibility = [math]::Round($report.categories.accessibility.score * 100)
    LCP = [math]::Round($report.audits.'largest-contentful-paint'.numericValue)
    TBT = [math]::Round($report.audits.'total-blocking-time'.numericValue)
    CLS = [math]::Round($report.audits.'cumulative-layout-shift'.numericValue, 3)
  }
}
$results | Format-Table
```

Acceptance target uses the median of three local runs:

- Performance at least 90
- LCP at most 2,500 ms
- TBT 0 ms
- CLS at most 0.01
- Accessibility findings for trust/footer contrast and skipped footer heading levels are absent

Record all three runs and the median. Do not describe local results as production PageSpeed results. If the target is missed, inspect the relevant Lighthouse audit, add a test for the remaining first-party cause, and iterate only inside the approved homepage scope.

- [ ] **Step 5: Write the private operational report**

Create or update `03-Operations/2026-08-09-ARCLIFT-Mobile-PageSpeed-Optimization.md` in the private project Vault with:

- Captured production PageSpeed baseline and timestamp.
- Mobile/desktop score and metric comparison.
- Root-cause evidence: changing text LCP candidate, eager inactive hero backgrounds, Google Font stylesheet, two oversized images, contrast, and heading hierarchy.
- Exact changed repository files and commits.
- Focused-test, `npm run audit:content`, `npm run verify`, build, visual, and three-run Lighthouse results.
- Asset derivative dimensions, byte sizes, classifications, and disclosure inheritance.
- Explicit state: local branch only, not pushed or deployed.
- Rollback boundary: revert the three feature commits; originals and public routes remain intact.
- Reusable rule: diagnose a mobile score through individual audits and LCP subparts; do not optimize low-value Cloudflare cache notices before first-party LCP causes.

Do not copy credentials, browser session data, or machine paths into the report.

- [ ] **Step 6: Perform the final clean-tree and scope check**

Run:

```powershell
git status --short --branch
git diff origin/main...HEAD --stat
git diff origin/main...HEAD -- src/pages/index.astro src/layouts/BaseLayout.astro src/styles/global.css package.json tests public/images/asset-manifest.json
```

Expected: only the design, plan, three scoped performance commits, tests, two derivative assets, and declared homepage/layout/CSS changes appear. There must be no Contact, Worker, product parameter, article, sitemap, deployment, or Cloudflare configuration change. Do not push the branch.
