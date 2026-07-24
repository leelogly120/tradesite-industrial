import { spawnSync } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { auditArticle, auditFiles } from '../scripts/audit-content.mjs';

const compliantArticle = `---
title: Evidence-led equipment planning
coverImage: /images/blog/evidence/cover.webp?campaign=launch#hero
---

# Evidence-led equipment planning

Direct answer: Begin by collecting the access route, working zones, floor condition, destination requirements, and transport constraints before selecting equipment. This creates a clear project brief and keeps the technical discussion focused on conditions that can be checked before a quotation is prepared.

<!-- audit-section: buyer-intent -->
## Define the buyer decision
The buyer needs a practical way to decide which project information affects equipment selection before asking for a quotation. This article helps procurement teams compare access, handling, and operating constraints without assuming that one configuration fits every job or destination market.

<!-- audit-section: conditions -->
## Map the project conditions
This decision matters when roof geometry, ground condition, handling routes, available staging area, and local work-at-height requirements vary between projects. The team should document site restrictions and destination rules before comparing a project-specific configuration or transport approach.

<!-- audit-section: evidence-tradeoffs -->
## Compare documented inputs and trade-offs
The evidence in this review is limited to visible platform layout, stated project inputs, and documented transport constraints. A crawler arrangement may improve movement on one prepared route, while a truck-mounted arrangement may simplify another transfer plan. The trade-off is that access clearance, floor condition, chassis rules, and support area must still be confirmed for the actual project.

<!-- audit-section: limitations-not-fit -->
## Know when the route does not fit
This approach may not fit a site with uncertain ground conditions, restricted access, unverified local requirements, or incomplete handling data. It is not a substitute for project review, destination-market confirmation, operator planning, or the checks required before equipment is selected for a specific work zone.

<!-- audit-section: project-checklist -->
## Assemble the project brief
- Required working height and reachable work zones
- Floor condition, surface protection, and load review
- Access route width, turning points, and staging area
- Roof geometry, panel handling route, and obstructions
- Destination market, applicable local requirements, and documentation needs
- Transport constraints, local chassis plan, and unloading method

<!-- audit-section: cta-editorial-note -->
## Send a reviewable brief
CTA: Send the project height, reachable zones, floor condition, access route, roof geometry, destination market, transport constraints, and required handling sequence. ARCLIFT can use those project inputs to coordinate a technical selection discussion and identify which configuration questions need confirmation before a project-specific quotation is considered.

Editorial note: Final configuration, destination-market requirements, work-at-height planning, documentation, and transport arrangements are confirmed per project. The visible information in this article supports an early discussion only and does not replace site review, local compliance checks, or the technical decisions required for a specific installation.

![Crawler platform access route](/images/blog/evidence/platform.webp?width=1600)
![Transport preparation detail](/images/blog/evidence/transport.webp)
`;

function articleWith(text) {
  return `${compliantArticle}\n${text}`;
}

async function withTemporaryFile(name, content, callback) {
  const directory = await mkdtemp(join(tmpdir(), 'arclift-content-audit-'));
  const path = join(directory, name);

  try {
    await writeFile(path, content);
    await callback(path);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

describe('auditArticle identity and path gates', () => {
  it.each([
    'ARCLIFT is the source factory.',
    'Our factory can prepare the equipment.',
    'ARCLIFT is the manufacturer of the equipment.',
    'ARCLIFT manufactures the equipment.',
    'ARCLIFT is an equipment manufacturer.',
    'ARCLIFT is an OEM manufacturer.',
    'We manufacture every system.',
    'ARCLIFT-manufactured equipment is available.',
    'ARCLIFT designs, engineers, and manufactures each system.',
    'ARCLIFT owns a manufacturing plant.',
    'ARCLIFT operates a production facility.',
    'We run the manufacturing site.',
    'ARCLIFT owns a factory.',
    'ARCLIFT operates the factory.',
    'ARCLIFT runs its factory.',
    'Factory-direct supply is available.',
    'Our factory prepares the equipment.',
    'This system is manufactured by ARCLIFT.',
    'Factory-direct purchasing is available.',
  ])('rejects manufacturing identity: %s', (claim) => {
    const report = auditArticle(articleWith(claim));

    expect(report.fatal).toBe(true);
    expect(report.failures).toContain('prohibited-identity-language');
  });

  it.each([
    'factory roof installation',
    'factory ceiling application',
  ])('allows non-identity factory application wording: %s', (statement) => {
    expect(auditArticle(articleWith(statement))).toMatchObject({ fatal: false, score: 100, publishable: true });
  });

  it.each([
    'ARCLIFT is not a manufacturer.',
    'ARCLIFT is not the source factory or manufacturer.',
    'ARCLIFT is not a manufacturer or the source factory.',
    'ARCLIFT does not own or operate the source factory.',
    'ARCLIFT is a supplier, not a factory or manufacturer.',
    'ARCLIFT is an integrated equipment supplier, not a factory or manufacturer.',
  ])('allows a natural supplier-positioning negation: %s', (statement) => {
    expect(auditArticle(articleWith(statement))).toMatchObject({ fatal: false, score: 100, publishable: true });
  });

  it.each([
    'C:\\Users\\editor\\source.jpg',
    '/Users/editor/source.jpg',
    '/home/editor/source.jpg',
    'file:///private/source.jpg',
    '\u4e3e\u5347\u673a\u68b0',
  ])('rejects local-path leakage: %s', (value) => {
    expect(auditArticle(articleWith(value)).failures).toContain('public-local-path');
  });
});

describe('auditArticle first-release gates', () => {
  it('accepts an unquoted coverImage URL with query and fragment when two visible images complete the count', () => {
    const report = auditArticle(`\uFEFF${compliantArticle}`);

    expect(report).toMatchObject({ fatal: false, failures: [], score: 100, publishable: true });
  });

  it('does not count image references inside fenced code blocks', () => {
    const article = compliantArticle
      .replace('coverImage: /images/blog/evidence/cover.webp?campaign=launch#hero', 'coverImage: /images/blog/evidence/cover.webp')
      .replace('![Transport preparation detail](/images/blog/evidence/transport.webp)', '```md\n![Code-only image](/images/blog/evidence/code.webp)\n```');
    const report = auditArticle(article);

    expect(report.fatal).toBe(true);
    expect(report.failures).toContain('insufficient-article-images');
  });

  it('rejects more than five unique visible public image URLs', () => {
    const extraImages = Array.from({ length: 4 }, (_, index) => `![Extra visible image ${index}](/images/blog/evidence/extra-${index}.webp)`).join('\n');
    const report = auditArticle(articleWith(extraImages));

    expect(report.fatal).toBe(true);
    expect(report.failures).toContain('too-many-article-images');
  });

  it.each([
    'Quoted at USD 12,500.',
    'Quoted at EUR 12,500.',
    'Quoted at 12,500 USD.',
    'Quoted at 12,500 EUR.',
    'Quoted at $12,500.',
    'The system is CE certified.',
    'The configuration complies with EN 280.',
    'The design is patented.',
    'The equipment is in stock.',
    'Production capacity is 40 units per month.',
    'Delivery is available in three weeks.',
    'Ships within 48 hours.',
    'The workflow provides 20% savings.',
    'The workflow provides 20 percent labor savings.',
    'The arrangement reduces labor by 20%.',
    'This outcome is guaranteed.',
    'Quoted at USD 12,500. <!-- claim-reviewed -->',
  ])('rejects every unverified first-release high-risk claim: %s', (claim) => {
    const report = auditArticle(articleWith(claim));

    expect(report.fatal).toBe(true);
    expect(report.failures).toContain('unsupported-high-risk-claim');
  });

  it('rejects banned AI language', () => {
    expect(auditArticle(articleWith(`In today's fast-paced world, every project is different.`)).failures).toContain('banned-ai-language');
  });
});

describe('auditArticle weighted first-release categories', () => {
  it('returns the exact design-weighted category breakdown for a complete article', () => {
    const report = auditArticle(compliantArticle);

    expect(report).toMatchObject({ fatal: false, score: 100, publishable: true });
    expect(report.categories).toEqual({
      buyerIntent: { score: 25, max: 25, passed: true },
      conditions: { score: 20, max: 20, passed: true },
      evidenceTradeoffs: { score: 15, max: 15, passed: true },
      limitationsNotFit: { score: 15, max: 15, passed: true },
      projectChecklist: { score: 10, max: 10, passed: true },
      ctaEditorialNote: { score: 10, max: 10, passed: true },
      visualQuality: { score: 5, max: 5, passed: true },
    });
  });

  it('rejects an empty-heading pseudo article instead of awarding title-only points', () => {
    const pseudoArticle = `---\ncoverImage: /images/blog/evidence/cover.webp\n---\n\n# Empty evidence article\n\n## Buyer Intent\n\n## Conditions\n\n## Evidence and Trade-offs\n\n## Limitations and Not Fit\n\n## Project Checklist\n\n## CTA and Editorial Note\n\n![Visible platform image](/images/blog/evidence/platform.webp)\n![Visible transport image](/images/blog/evidence/transport.webp)`;
    const report = auditArticle(pseudoArticle);

    expect(report.fatal).toBe(true);
    expect(report.score).toBeLessThan(95);
    expect(report.categories.buyerIntent).toEqual({ score: 0, max: 25, passed: false });
    expect(report.categories.projectChecklist).toEqual({ score: 0, max: 10, passed: false });
  });

  it('rejects an article missing the Buyer Intent category', () => {
    const report = auditArticle(compliantArticle.replace(/<!-- audit-section: buyer-intent -->[\s\S]*?<!-- audit-section: conditions -->/, '<!-- audit-section: conditions -->'));

    expect(report.fatal).toBe(true);
    expect(report.failures).toContain('missing-buyer-intent');
    expect(report.categories.buyerIntent).toEqual({ score: 0, max: 25, passed: false });
  });
});

describe('auditFiles manifest and CLI gates', () => {
  it('rejects invalid JSON and normalized adversarial provenance keys', async () => {
    await withTemporaryFile('asset-manifest.json', '{invalid json', async (path) => {
      expect((await auditFiles([path])).files[path].failures).toContain('invalid-json');
    });

    const manifest = JSON.stringify({ Source_File: 'neutral.webp', 'ORIGINAL-name': 'camera.jpg', 'source/path': 'archive.jpg' });
    await withTemporaryFile('asset-manifest.json', manifest, async (path) => {
      expect((await auditFiles([path])).files[path].failures).toContain('public-provenance-key');
    });
  });

  it.each(['rawPath', 'rawFilePath', 'filename'])('rejects normalized manifest provenance key: %s', async (key) => {
    const manifest = JSON.stringify({ [key]: 'private-source-reference' });

    await withTemporaryFile('asset-manifest.json', manifest, async (path) => {
      const report = await auditFiles([path]);
      expect(report.files[path].failures).toContain('public-provenance-key');
    });
  });

  it('treats an empty audit set as fatal', async () => {
    expect(await auditFiles([])).toMatchObject({ fatal: true, publishable: false });
  });

  it('returns exit code 1 for an explicitly audited fatal violation on Windows-compatible paths', async () => {
    await withTemporaryFile('launch-article.md', articleWith('We run the manufacturing site.'), async (path) => {
      const result = spawnSync(process.execPath, ['scripts/audit-content.mjs', path], { cwd: process.cwd(), encoding: 'utf8' });

      expect(result.status).toBe(1);
      expect(result.stdout).toContain('prohibited-identity-language');
    });
  });
});
describe('final ownership and checklist adversarial regressions', () => {
  it.each([
    'ARCLIFT operates its manufacturing plant.',
    'ARCLIFT owns its production facility.',
    'We run our manufacturing site.',
  ])('rejects owned or operated manufacturing premises: %s', (claim) => {
    const report = auditArticle(articleWith(claim));

    expect(report.fatal).toBe(true);
    expect(report.failures).toContain('prohibited-identity-language');
  });

  it('rejects six placeholder checklist items', () => {
    const placeholders = ['- x', '- x', '- x', '- x', '- x', '- x'].join('\n');
    const report = auditArticle(compliantArticle.replace(/<!-- audit-section: project-checklist -->[\s\S]*?<!-- audit-section: cta-editorial-note -->/, `<!-- audit-section: project-checklist -->\n## Assemble the project brief\n${placeholders}\n\n<!-- audit-section: cta-editorial-note -->`));

    expect(report.fatal).toBe(true);
    expect(report.failures).toContain('missing-project-checklist');
  });

  it('rejects six duplicate checklist items from one project-information category', () => {
    const repeated = Array.from({ length: 6 }, () => '- Required working height for the full access route').join('\n');
    const report = auditArticle(compliantArticle.replace(/<!-- audit-section: project-checklist -->[\s\S]*?<!-- audit-section: cta-editorial-note -->/, `<!-- audit-section: project-checklist -->\n## Assemble the project brief\n${repeated}\n\n<!-- audit-section: cta-editorial-note -->`));

    expect(report.fatal).toBe(true);
    expect(report.failures).toContain('missing-project-checklist');
  });
});
