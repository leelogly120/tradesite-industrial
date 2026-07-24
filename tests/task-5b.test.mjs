import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { auditArticle } from '../scripts/audit-content.mjs';

const root = resolve(import.meta.dirname, '..');
const launchSlugs = [
  'roof-level-roll-forming-long-panels',
  'crawler-vs-truck-mounted-roll-forming-system',
  '40hq-shipping-truck-mounted-roll-forming-lift',
  'roll-forming-line-specification-long-span-roof-panels',
  'crawler-ceiling-wall-panel-platform-project-data',
];
const markers = [
  'buyer-intent',
  'conditions',
  'evidence-tradeoffs',
  'limitations-not-fit',
  'project-checklist',
  'cta-editorial-note',
];

const naturalArticle = `---
title: A Natural Equipment Planning Guide
coverImage: /images/editorial/cover.webp
---

Start with the work zones, material route, support conditions, destination requirements, and transport boundary. A model comparison is useful only after those project inputs are available, because the same nominal height can hide different access, handling, and integration constraints.

<!-- audit-section: buyer-intent -->
## Decide what the project must accomplish

The procurement team needs a practical brief that connects the work face, material flow, access route, support area, and destination duties. The purpose is to expose unresolved interfaces before a quotation, not to select a machine from a headline dimension.

![Representative crawler arrangement](/images/editorial/crawler.webp)

*Representative editorial image. It illustrates a planning context and does not prove model identity or performance.*

<!-- audit-section: conditions -->
## Map the conditions that control selection

Review roof geometry, working height, outreach, ground or floor conditions, wind limits, handling routes, staging space, available power, local work-at-height requirements, and destination transport rules. Each condition must be tied to the actual site and intended operating sequence.

<!-- audit-section: evidence-tradeoffs -->
## Compare interfaces, not slogans

Available records can define visible architecture and documented project inputs, while final reactions and operating limits remain configuration-specific. The trade-off is between movement, setup space, handling effort, transport integration, and the amount of destination work still required.

![Editorial decision diagram](/images/editorial/decision-map.svg)

*Editorial diagram. It helps explain the review sequence and is not proof of suitability.*

<!-- audit-section: limitations-not-fit -->
## Know when this route does not fit

This route may not fit when the ground condition is unknown, access is restricted, support reactions are unavailable, weather limits cannot be controlled, or destination requirements remain unresolved. It is not a substitute for a site method, local review, or signed technical data.

<!-- audit-section: project-checklist -->
## Build the review package

- Required working height, outreach, and reachable work zones
- Roof slope, geometry, obstructions, and handover points
- Panel profile, material, thickness, length, coil, and feed path
- Wind limits and the planned weather decision process
- Ground or floor data, access route, and outrigger restrictions
- Destination market, chassis route, transport plan, and container boundary
- Available voltage, power, controls, documentation, and local requirements

<!-- audit-section: cta-editorial-note -->
## Send a brief that can be checked

Send ARCLIFT the project height, site plan, destination, transport route, material data, work zones, floor or ground information, and power conditions. The team can organize the unresolved interfaces before a project-specific quotation and identify which signed documents are still required.

This guide supports early planning only. Final configuration, destination-market requirements, work-at-height planning, documentation, transport arrangements, and operating limits require project review and signed technical schedules; the editorial visuals cannot establish suitability or performance.

![Representative transport arrangement](/images/editorial/transport.webp)
`;

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

describe('Task 5b content-audit behavior', () => {
  it('accepts natural public headings when hidden markers define the audit sections', () => {
    expect(auditArticle(naturalArticle)).toMatchObject({
      fatal: false,
      score: 100,
      publishable: true,
    });
  });

  it('rejects five or more public rubric headings as mechanical-rubric-headings', () => {
    const mechanical = naturalArticle
      .replace('## Decide what the project must accomplish', '## Buyer Intent')
      .replace('## Map the conditions that control selection', '## Conditions')
      .replace('## Compare interfaces, not slogans', '## Evidence and Trade-offs')
      .replace('## Know when this route does not fit', '## Limitations and Not Fit')
      .replace('## Build the review package', '## Project Checklist');

    expect(auditArticle(mechanical).failures).toContain('mechanical-rubric-headings');
  });

  it.each([
    'This is useful visual evidence of the arrangement.',
    'These images provide evidence of the configuration.',
    'The images offer evidence of the handling route.',
    'This is evidence of the general arrangement.',
  ])('rejects an editorial image described as evidence: %s', (claim) => {
    const article = naturalArticle.replace(
      '*Representative editorial image. It illustrates a planning context and does not prove model identity or performance.*',
      `*Representative editorial image. ${claim}*`,
    );

    expect(auditArticle(article).failures).toContain('editorial-image-evidence-claim');
  });

  it('does not count hidden HTML-comment prose toward section length', () => {
    const hiddenPadding = naturalArticle.replace(
      /<!-- audit-section: buyer-intent -->[\s\S]*?<!-- audit-section: conditions -->/,
      `<!-- audit-section: buyer-intent -->
## Decide what the project must accomplish
<!-- hidden prose padding that repeats project planning words many times and must never satisfy public content scoring even though this sentence is deliberately long enough to fool a naive word counter -->
<!-- audit-section: conditions -->`,
    );

    expect(auditArticle(hiddenPadding).failures).toContain('missing-buyer-intent');
  });
});

describe('Task 5b article metadata and presentation contract', () => {
  it('requires coverAlt, coverCaption, and updated in the blog schema', async () => {
    const schema = await readFile(resolve(root, 'src/content.config.ts'), 'utf8');
    expect(schema).toMatch(/coverAlt:\s*z\.string\(\)/);
    expect(schema).toMatch(/coverCaption:\s*z\.string\(\)/);
    expect(schema).toMatch(/updated:\s*z\.coerce\.date\(\)\.optional\(\)/);
  });

  it.each(launchSlugs)('%s uses natural headings, audit markers, and disclosed cover metadata', async (slug) => {
    const article = await readFile(resolve(root, 'src/content/blog', `${slug}.md`), 'utf8');
    for (const marker of markers) expect(article).toContain(`<!-- audit-section: ${marker} -->`);
    expect(article).toMatch(/^coverAlt:\s*".{20,}"/m);
    expect(article).toMatch(/^coverCaption:\s*".{20,}"/m);
    expect(article).not.toMatch(/^##\s+(?:Buyer Intent|Conditions|Evidence and Trade-offs|Limitations and Not Fit|Project Checklist|CTA and Editorial Note)\s*$/mi);
    expect(article).not.toMatch(/^(?:Direct answer|CTA|Editorial note):/mi);
    expect(article).not.toMatch(/\b(?:visual evidence|images?\s+(?:provide|offer)\s+evidence|This is evidence of)\b/i);
    expect(auditArticle(article)).toMatchObject({ fatal: false, score: 100, publishable: true });

    const title = article.match(/^title:\s*"([^"]+)"/m)?.[1] ?? '';
    expect(`${title} | ARCLIFT`.length).toBeLessThanOrEqual(70);
  });

  it('gives each known AI-assisted asset an explicit per-image AI-assisted caption', async () => {
    const aiAssistedUses = [
      {
        slug: 'roof-level-roll-forming-long-panels',
        image: '/images/hero/hero-2.webp',
        placement: 'cover',
      },
      {
        slug: '40hq-shipping-truck-mounted-roll-forming-lift',
        image: '/images/hero/hero-3.webp',
        placement: 'body',
      },
      {
        slug: 'roll-forming-line-specification-long-span-roof-panels',
        image: '/images/hero/hero-4.webp',
        placement: 'cover',
      },
    ];

    for (const { slug, image, placement } of aiAssistedUses) {
      const article = await readFile(resolve(root, 'src/content/blog', `${slug}.md`), 'utf8');

      if (placement === 'cover') {
        expect(article).toContain(`coverImage: "${image}"`);
        const coverCaption = article.match(/^coverCaption:\s*"([^"]+)"/m)?.[1] ?? '';
        expect(coverCaption).toMatch(/\bAI-assisted\b/i);
        continue;
      }

      const escapedImage = image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const bodyCaption = article.match(
        new RegExp(`!\\[[^\\]]+\\]\\(${escapedImage}\\)\\s+\\*([^*]+)\\*`),
      )?.[1] ?? '';
      expect(bodyCaption).toMatch(/\bAI-assisted\b/i);
    }
  });

  it('renders the cover as a disclosed figure and receives calculated reading metadata', async () => {
    const layout = await readFile(resolve(root, 'src/layouts/BlogLayout.astro'), 'utf8');
    const slugPage = await readFile(resolve(root, 'src/pages/blog/[slug].astro'), 'utf8');
    expect(layout).toMatch(/<figure class="article__hero">/);
    expect(layout).toMatch(/alt=\{coverAlt\}/);
    expect(layout).toMatch(/<figcaption>\{coverCaption\}<\/figcaption>/);
    expect(layout).toMatch(/dateModified:\s*new Date\(updated \?\? date\)/);
    expect(layout).toMatch(/readTime:\s*number/);
    expect(layout).not.toMatch(/const readTime = '8 min read'/);
    expect(layout).toMatch(/aspect-ratio:\s*16\s*\/\s*9/);
    expect(layout).toMatch(/flex-wrap:\s*wrap/);
    expect(slugPage).toMatch(/Math\.ceil\([^)]*\/\s*200\)/);
    expect(slugPage).toMatch(/readTime=\{readTime\}/);
  });

  it('links every dense SVG to its full-size URL with a tap instruction', async () => {
    for (const slug of [
      'crawler-vs-truck-mounted-roll-forming-system',
      '40hq-shipping-truck-mounted-roll-forming-lift',
      'roll-forming-line-specification-long-span-roof-panels',
      'crawler-ceiling-wall-panel-platform-project-data',
    ]) {
      const article = await readFile(resolve(root, 'src/content/blog', `${slug}.md`), 'utf8');
      expect(article).toMatch(/\[!\[[^\]]+\]\((\/images\/editorial\/[^)]+\.svg)\)\]\(\1\)/);
      expect(article).toContain('Tap to open the full-size editorial diagram.');
    }
  });
});

describe('Task 5b SEO and listing contract', () => {
  it('normalizes relative social images to absolute URLs without changing absolute URLs', async () => {
    const seo = await readFile(resolve(root, 'src/components/SEOHead.astro'), 'utf8');
    expect(seo).toMatch(/new URL\(ogImage,\s*siteUrl\)\.href/);
    expect(seo).toMatch(/https?:/);
    expect(seo).toMatch(/property="og:image"\s+content=\{socialImage\}/);
    expect(seo).toMatch(/name="twitter:image"\s+content=\{socialImage\}/);
  });

  it('serves a real canonical first page at /blog/ and reserves pagination for page 2+', async () => {
    const index = await readFile(resolve(root, 'src/pages/blog/index.astro'), 'utf8');
    const listing = await readFile(resolve(root, 'src/components/BlogListing.astro'), 'utf8');
    const pageRoute = await readFile(resolve(root, 'src/pages/blog/page/[page].astro'), 'utf8');
    expect(index).not.toMatch(/http-equiv="refresh"/i);
    expect(index).toMatch(/canonical="https:\/\/www\.arclifteq\.com\/blog\/"/);
    expect(index).toMatch(/<BlogListing/);
    expect(listing).toMatch(/roll-forming lift/i);
    expect(listing).toMatch(/large-deck platform/i);
    expect(listing).not.toMatch(/<form\b[^>]*newsletter/i);
    expect(listing).toMatch(/href="\/contact\/"/);
    expect(await exists(resolve(root, 'src/pages/blog/page/[...page].astro'))).toBe(false);
    expect(await exists(resolve(root, 'src/pages/blog/page/[page].astro'))).toBe(true);
    expect(pageRoute).toMatch(/getStaticPaths[\s\S]*?const pageSize = 20;/);
  });
});

describe('Task 5b ARC-T25HQ publication boundary', () => {
  it('does not promise unconditional 40HQ fit in title, description, features, body, or FAQ', async () => {
    const product = await readFile(
      resolve(root, 'src/content/products/arc-t25hq-truck-mounted-roll-forming-lift-40hq.md'),
      'utf8',
    );
    expect(product).not.toMatch(/\b(?:40HQ[- ]container[- ]shippable|container[- ]shippable|ships?\s+in\s+40HQ|pack(?:s|ed)?\s+inside\s+(?:standard\s+)?40HQ|secured\s+in\s+40HQ)\b/i);
    expect(product).toMatch(/module dimensions/i);
    expect(product).toMatch(/module mass/i);
    expect(product).toMatch(/container-door clearance/i);
    expect(product).toMatch(/lashing/i);
    expect(product).toMatch(/destination chassis interface/i);
    expect(product).toMatch(/confirmed per project/i);
  });
});
