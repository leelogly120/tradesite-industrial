import { describe, expect, it } from 'vitest';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { auditArticle, auditFiles } from '../scripts/audit-content.mjs';
import { buyerArticleFailures } from '../scripts/lib/buyer-article-audit.mjs';

const options = { standard: 'buyer-2026-10-27' };
const article = `---
title: "Roof-panel lift packages for a phased industrial building"
description: "Choose a truck or crawler package around the building route, form a practical shortlist and separate site measurements from the supplier quotation."
date: 2026-10-27
updated: 2026-10-27
author: "ARCLIFT Technical Editorial"
tags: [roof panels, procurement, site access]
coverImage: "/images/equipment/coil-real-cover.webp"
coverAlt: "A truck carries an elevated roof-panel forming assembly."
coverCaption: "The forming assembly occupies the truck bed above the carrier."
draft: false
---

Choose the truck package when each building has a reachable external setup zone and the project needs transfers between buildings. Use a crawler shortlist when its prepared route reaches the workface more directly, and walk away from an unmeasured outlet interface.

![Elevated forming equipment at a roof-side work zone](/images/equipment/coil-real-handling.webp)
*The raised assembly places the forming equipment beside the roof work zone.*

## A scope table for the two routes

| Buyer input | Site record | Quotation item |
| --- | --- | --- |
| Outlet position | Measure on site | Confirm on RFQ |
| Carrier | Photograph the access route | Include or exclude chassis |
| Coil | Record material and coil mass | Confirm on RFQ |

The coil module below belongs in the interface review alongside the access survey. Keep both with the quotation so the proposed package addresses the workface and the feed route.

![Roll-forming module and its supporting steel assembly](/images/equipment/coil-real-module.webp)
*The compact module shows the equipment interface to describe in the package.*

## Two failures that change the purchase

**Wrong chassis assumption.** An importer orders a lift assembly but budgets for a complete road vehicle. Put chassis inclusion in the priced scope before comparing totals.

**Missing outlet datum.** The building eave level is recorded while the panel delivery position is omitted. Add the roof section and required outlet position to the site drawing.

## RFQ attachments

- Building height and measured outlet position on a section drawing.
- Panel profile drawing and required finished panel lengths.
- Coil mass, material specification and planned feed direction.
- Access photographs, route width and turning restrictions.
- Ground or floor information for the proposed setup zone.
- Chassis included yes or no and the destination port.
- Available electrical supply and the required power package.
- Required delivery scope and commissioning responsibilities.

## Model shortlist and quotation

For the truck route, shortlist the [ARC-T18 catalog model](/products/arc-t18-truck-mounted-roll-forming-lift/). For the prepared crawler route, shortlist the [ARC-C25 catalog model](/products/arc-c25-crawler-roll-forming-lift/). Confirm on RFQ the model interfaces against the attachment set.

[Request a quotation](/contact/?request=quote), [WhatsApp +86 15515922444](https://wa.me/8615515922444), or email [leelogly120@gmail.com](mailto:leelogly120@gmail.com).

*Final configuration and site suitability require project review.*
`;

const check = source => auditArticle(source, options);
// The two named source paths below now have explicit November 2 revisions.
// Their fixtures must satisfy both that revision date and its clarity policy.
const reviewedArticle = article.replace('updated: 2026-10-27', 'updated: 2026-11-02')
  .replaceAll('| Confirm on RFQ |', '| Supplier lists the offered interface against the buyer drawing for package selection |');

describe('buyer article audit without a prescribed editorial skeleton', () => {
  it('accepts the explicitly registered October28 date without changing the October27 gate', () => {
    const today = article.replaceAll('2026-10-27', '2026-10-28');
    expect(auditArticle(today, { standard: 'buyer-2026-10-28' })).toMatchObject({ fatal: false, failures: [], publishable: true, score: 100 });
    expect(check(today).failures).toContain('missing-buyer-metadata');
    expect(auditArticle(article, { standard: 'buyer-2026-10-28' }).failures).toContain('missing-buyer-metadata');
  });

  it('cannot invent a future buyer cohort through options or manuscript frontmatter', () => {
    const future = article.replaceAll('2026-10-27', '2099-12-31').replace('draft: false', 'draft: false\nauditStandard: buyer-2099-12-31');
    expect(auditArticle(future, { standard: 'buyer-2099-12-31' }).failures).toContain('missing-buyer-intent');
    expect(auditArticle(future).failures).toContain('missing-buyer-intent');
  });

  it('accepts a useful illustrated decision with plain factual captions and no legacy markers', () => {
    expect(check(article)).toMatchObject({ fatal: false, failures: [], publishable: true, score: 100 });
  });

  it('accepts concrete failure cases within an original section order', () => {
    const varied = article.replace('## Two failures that change the purchase', '## Read the purchase scope in sequence')
      .replace('**Wrong chassis assumption.**', '**Failure case: wrong chassis assumption.**')
      .replace('**Missing outlet datum.**', '**Failure case: missing outlet datum.**');
    expect(check(varied)).toMatchObject({ fatal: false, failures: [] });
  });

  it('accepts a concrete reserve recommendation with a buyer condition', () => {
    const varied = article.replace(/Choose the truck package[^\n]+/, 'Reserve an open-floor phase for released overhead installation in a new warehouse, and complete the required checks before racking occupies that zone. Install racks first only when early rack handover has a defined project benefit and a complete later overhead-access arrangement is included in the comparison.');
    expect(check(varied)).toMatchObject({ fatal: false, failures: [] });
  });

  it('recognizes two concrete mistake cases without requiring a template heading', () => {
    const varied = article.replace('## Two failures that change the purchase', '## Read the purchase scope in sequence')
      .replace('**Wrong chassis assumption.**', '**Mistake: wrong chassis assumption.**')
      .replace('**Missing outlet datum.**', '**Mistake: missing outlet datum.**');
    expect(check(varied)).toMatchObject({ fatal: false, failures: [] });
    expect(check(varied.replace(/\*\*Mistake: missing outlet datum[\s\S]*?(?=## RFQ)/, '')).failures).toContain('missing-buyer-failure-modes');
  });

  it('accepts an explicitly introduced RFQ list without imposing a dedicated section title', () => {
    const varied = article.replace('## RFQ attachments', '## Prepare the purchase scope\n\nAttach these eight inputs to the RFQ:');
    expect(check(varied)).toMatchObject({ fatal: false, failures: [] });
    expect(check(varied.replace(/^- (?:Available|Required|Chassis).*\n/gm, '')).failures).toContain('missing-buyer-rfq');
    expect(check(varied.replace('Attach these eight inputs to the RFQ:', 'Read these background points:')).failures).toContain('missing-buyer-rfq');
    const tooMany = varied.replace('## Model shortlist and quotation', '- Additional packaging identification and receiving details.\n\n- Additional transport restrictions and arrival photographs.\n\n- Additional nominated interface data and contact details.\n\n## Model shortlist and quotation');
    expect(check(tooMany).failures).toContain('missing-buyer-rfq');
  });

  it.each([
    ['missing-buyer-metadata', source => source.replace('updated: 2026-10-27\n', '')],
    ['missing-buyer-metadata', source => source.replace('draft: false', 'draft: true')],
    ['missing-buyer-metadata', source => source.replace('ARCLIFT Technical Editorial', 'Someone else')],
    ['missing-buyer-opening', source => source.replace(/Choose the truck package[^\n]+/, 'This article lists some questions.')],
    ['missing-buyer-table', source => source.replace(/^\|.*\n/gm, '')],
    ['missing-buyer-failure-modes', source => source.replace(/\*\*Missing outlet datum[\s\S]*?(?=## RFQ)/, '')],
    ['missing-buyer-rfq', source => source.replace(/^- (?:Available|Required).*\n/gm, '').replace(/^- Chassis.*\n/gm, '')],
    ['missing-buyer-shortlist', source => source.replaceAll('/products/arc-t18-truck-mounted-roll-forming-lift/', '/products/invented-lift/').replaceAll('/products/arc-c25-crawler-roll-forming-lift/', '/products/invented-lift/')],
    ['missing-buyer-contact', source => source.replaceAll('leelogly120@gmail.com', 'sales@example.com')],
    ['invalid-buyer-photo', source => source.replaceAll('/images/equipment/coil-real-module.webp', '/images/equipment/invented.webp')],
    ['invalid-buyer-photo', source => source.replaceAll('/images/equipment/coil-real-module.webp', '/images/editorial/crawler-platform-selection-path.svg')],
    ['invalid-buyer-photo-caption', source => source.replace('*The compact module shows the equipment interface to describe in the package.*', '')],
    ['buyer-disclaimer-spam', source => source.replace('The compact module shows the equipment interface to describe in the package.', 'Reference photograph. It does not establish capacity or model identity.')],
    ['buyer-unsupported-load-claim', source => source + '\nThe platform has a 5000 kg rated load.'],
    ['buyer-unsupported-load-claim', source => source.replace(/^coverCaption: .*$/m, 'coverCaption: "This platform carries a 5000 kg rated load."')],
    ['invalid-buyer-photo-markup', source => source + '\n<img src="/images/editorial/truck-site-roll-forming-lift.webp" alt="A truck-mounted lift beside the building." />'],
    ['invalid-buyer-photo-markup', source => source + '\n![A machine at the roof-side work zone][unapproved]\n\n[unapproved]: /images/editorial/truck-site-roll-forming-lift.webp'],
    ['buyer-archived-product-posture', source => source.replace('ARC-T18 catalog model', 'ARC-T18 Archived Reference')],
  ])('rejects %s after a real manuscript mutation', (failure, mutate) => {
    expect(check(mutate(article)).failures).toContain(failure);
  });

  it.each(['We manufacture this equipment.', 'The unit is CE certified.', 'Delivered within two weeks.', 'Quoted at USD 12,500.'])('retains the shared claim protection: %s', claim => {
    expect(check(article + '\n' + claim).fatal).toBe(true);
  });

  it('cannot select the new standard through manuscript frontmatter alone', () => {
    expect(auditArticle(article.replace('draft: false', 'draft: false\nauditStandard: buyer-2026-10-27')).failures).toContain('missing-buyer-intent');
  });

  it('uses the buyer audit only for a registered source path, leaving other files on the legacy gate', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'buyer-article-gate-'));
    try {
      const registered = join(directory, 'factory-made-roof-panels-vs-on-site-roll-forming.md');
      const other = join(directory, 'unregistered.md');
      await writeFile(registered, reviewedArticle);
      await writeFile(other, reviewedArticle);
      const report = await auditFiles([registered, other]);
      expect(report.files[registered]).toMatchObject({ fatal: false, failures: [], standard: 'buyer-2026-10-27' });
      expect(report.files[other].failures).toContain('missing-buyer-intent');
      await writeFile(registered, reviewedArticle.replace('updated: 2026-11-02', 'updated: 2026-10-27'));
      expect((await auditFiles([registered])).files[registered].failures).toContain('missing-buyer-metadata');
      await writeFile(registered, reviewedArticle + '\n\nConfirm on RFQ.');
      expect((await auditFiles([registered])).files[registered].failures).toContain('buyer-empty-confirmation');
    } finally { await rm(directory, { recursive: true, force: true }); }
  });

  it('uses the registered October28 file cohort rather than a forged frontmatter date or standard', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'buyer-october28-gate-'));
    try {
      const registered = join(directory, 'fixed-roof-panel-factory-line-vs-mobile-site-production.md');
      const other = join(directory, 'unregistered-october28.md');
      const today = reviewedArticle.replaceAll('2026-10-27', '2026-10-28');
      await writeFile(registered, today);
      await writeFile(other, today.replace('draft: false', 'draft: false\nauditStandard: buyer-2026-10-28'));
      const report = await auditFiles([registered, other]);
      expect(report.files[registered]).toMatchObject({ fatal: false, failures: [], standard: 'buyer-2026-10-28' });
      expect(report.files[other].failures).toContain('missing-buyer-intent');
      await writeFile(registered, today.replace('updated: 2026-11-02', 'updated: 2026-10-28'));
      expect((await auditFiles([registered])).files[registered].failures).toContain('missing-buyer-metadata');
      await writeFile(registered, today + '\n\nConfirm on RFQ.');
      expect((await auditFiles([registered])).files[registered].failures).toContain('buyer-empty-confirmation');
      await writeFile(registered, article.replace('draft: false', 'draft: false\nauditStandard: buyer-2026-10-27'));
      const wrongDate = await auditFiles([registered]);
      expect(wrongDate.files[registered].failures).toContain('missing-buyer-metadata');
      expect(wrongDate.files[registered].standard).toBe('buyer-2026-10-28');
    } finally { await rm(directory, { recursive: true, force: true }); }
  });

  it('counts only visible body photographs, not fenced examples or HTML comments', () => {
    const image = '![Roll-forming module and its supporting steel assembly](/images/equipment/coil-real-module.webp)';
    expect(check(article.replace(image, '<!-- ' + image + ' -->')).failures).toContain('invalid-buyer-photo-count');
    expect(check(article.replace(image, '```md\n' + image + '\n```')).failures).toContain('invalid-buyer-photo-count');
  });
});

describe('October29 and later buyer copy states complete inputs instead of verification placeholders', () => {
  const clearArticle = article.replaceAll('2026-10-27', '2026-10-29')
    .replaceAll('| Confirm on RFQ |', '| Supplier lists the offered interface against the buyer drawing for package selection |')
    .replace('Confirm on RFQ the model interfaces against the attachment set.', 'Ask the supplier to identify the offered model interfaces against the buyer attachment set before choosing the package.');
  const current = source => auditArticle(source, { standard: 'buyer-2026-10-29' });

  it('accepts a complete dated article with specific supplier inputs and preserves earlier cohorts', () => {
    expect(current(clearArticle)).toMatchObject({ fatal: false, failures: [], score: 100 });
    expect(check(article)).toMatchObject({ fatal: false, failures: [], score: 100 });
    expect(auditArticle(article.replaceAll('2026-10-27', '2026-10-28'), { standard: 'buyer-2026-10-28' })).toMatchObject({ fatal: false, failures: [] });
    expect(current(clearArticle.replace('updated: 2026-10-29', 'updated: 2026-10-28')).failures).toContain('missing-buyer-metadata');
  });

  it.each(['waiting for verification', 'pending verification', 'to be verified', 'TBD', '待核实', '等待验证', 'pending **verification**', 'pending&#32;verification'])('rejects the public verification placeholder %s', phrase => {
    expect(current(clearArticle + '\n\n' + phrase + '.').failures).toContain('buyer-verification-placeholder');
  });

  it.each(['title', 'description', 'coverAlt', 'coverCaption'])('checks the public %s field for undelivered verification wording', field => {
    const changed = clearArticle.replace(new RegExp('^' + field + ':.*$', 'm'), field + ': "This roof-panel equipment package is pending verification before its intended project use."');
    expect(current(changed).failures).toContain('buyer-verification-placeholder');
  });

  it.each(['Confirm on RFQ', '**Confirm on RFQ.**', 'Ask the supplier', '[Ask the supplier](/contact/)'])('rejects the bare buyer table cell %s', value => {
    const changed = clearArticle.replace('| Supplier lists the offered interface against the buyer drawing for package selection |', '| ' + value + ' |');
    expect(current(changed).failures).toContain('buyer-empty-confirmation');
  });

  it.each(['Confirm on RFQ.', 'Confirm on\nRFQ.', '- Ask the supplier.', 'Dimensions: confirm on RFQ.', '<p>Confirm on RFQ.</p>'])('rejects standalone placeholder prose %s', value => {
    expect(current(clearArticle + '\n\n' + value).failures).toContain('buyer-empty-confirmation');
  });

  it('keeps concrete conditions and ordinary modal grammar valid', () => {
    const conditions = 'The buyer may choose the truck when its measured route reaches every setup area. A separate carrier might be required when the crawler needs road transfer; the buyer obtains the route and vehicle scope before purchasing. The supplier could offer a different interface if the submitted former drawing requires it; compare the proposed mounting arrangement before selecting the package.';
    expect(current(clearArticle + '\n\n' + conditions)).toMatchObject({ fatal: false, failures: [] });
  });

  it('applies the same clarity policy to future explicitly dated buyer checks without registering future slugs', () => {
    const future = clearArticle.replaceAll('2026-10-29', '2099-12-31') + '\n\nTBD';
    expect(buyerArticleFailures(future, '2099-12-31')).toContain('buyer-verification-placeholder');
    expect(auditArticle(future, { standard: 'buyer-2099-12-31' }).failures).toContain('missing-buyer-intent');
  });

  it('accepts only the explicit October30 date and inherits its existing clear-copy rules', () => {
    const today = clearArticle.replaceAll('2026-10-29', '2026-10-30');
    const options = { standard: 'buyer-2026-10-30' };
    expect(auditArticle(today, options)).toMatchObject({ fatal: false, failures: [], score: 100 });
    expect(current(today).failures).toContain('missing-buyer-metadata');
    expect(auditArticle(clearArticle, options).failures).toContain('missing-buyer-metadata');
    expect(auditArticle(today + '\n\nPending verification.', options).failures).toContain('buyer-verification-placeholder');
    expect(auditArticle(today + '\n\nConfirm on RFQ.', options).failures).toContain('buyer-empty-confirmation');
  });

  it('binds an October30 source filename to its approved cohort even with forged manuscript options', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'buyer-october30-gate-'));
    try {
      const registered = join(directory, 'roof-panel-roll-forming-pre-cut-vs-post-cut-line.md');
      const today = clearArticle.replaceAll('2026-10-29', '2026-10-30');
      await writeFile(registered, today);
      expect((await auditFiles([registered])).files[registered]).toMatchObject({ standard: 'buyer-2026-10-30', fatal: false, failures: [] });
      await writeFile(registered, today.replace('draft: false', 'draft: false\nauditStandard: buyer-2026-10-27') + '\n\nTBD');
      expect((await auditFiles([registered])).files[registered].failures).toContain('buyer-verification-placeholder');
      await writeFile(registered, today.replaceAll('2026-10-30', '2026-10-29'));
      expect((await auditFiles([registered])).files[registered].failures).toContain('missing-buyer-metadata');
    } finally { await rm(directory, { recursive: true, force: true }); }
  });

  it('accepts the explicit October31 date while rejecting wrong metadata and inherited copy placeholders', () => {
    const today = clearArticle.replaceAll('2026-10-29', '2026-10-31');
    const options = { standard: 'buyer-2026-10-31' };
    expect(auditArticle(today, options)).toMatchObject({ fatal: false, failures: [], score: 100 });
    expect(auditArticle(today, { standard: 'buyer-2026-10-30' }).failures).toContain('missing-buyer-metadata');
    expect(auditArticle(clearArticle, options).failures).toContain('missing-buyer-metadata');
    expect(auditArticle(today + '\n\nPending verification.', options).failures).toContain('buyer-verification-placeholder');
    expect(auditArticle(today + '\n\nAsk the supplier.', options).failures).toContain('buyer-empty-confirmation');
  });

  it('binds an October31 filename to its reviewed cohort despite forged manuscript options', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'buyer-october31-gate-'));
    try {
      const registered = join(directory, 'roof-forming-lift-vs-crane-supported-roll-former.md');
      const today = clearArticle.replaceAll('2026-10-29', '2026-10-31');
      await writeFile(registered, today);
      expect((await auditFiles([registered])).files[registered]).toMatchObject({ standard: 'buyer-2026-10-31', fatal: false, failures: [] });
      await writeFile(registered, today.replace('draft: false', 'draft: false\nauditStandard: buyer-2026-10-27') + '\n\nTBD');
      expect((await auditFiles([registered])).files[registered].failures).toContain('buyer-verification-placeholder');
      await writeFile(registered, today.replaceAll('2026-10-31', '2026-10-30'));
      expect((await auditFiles([registered])).files[registered].failures).toContain('missing-buyer-metadata');
    } finally { await rm(directory, { recursive: true, force: true }); }
  });

  it('selects the new clarity gate from the registered filename, which frontmatter cannot downgrade', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'buyer-october29-gate-'));
    try {
      const registered = join(directory, 'ceiling-contractor-labour-only-vs-supply-and-install-platform-purchase.md');
      await writeFile(registered, clearArticle);
      expect((await auditFiles([registered])).files[registered]).toMatchObject({ standard: 'buyer-2026-10-29', fatal: false, failures: [] });
      await writeFile(registered, clearArticle.replace('draft: false', 'draft: false\nauditStandard: buyer-2026-10-27') + '\n\nTBD');
      expect((await auditFiles([registered])).files[registered].failures).toContain('buyer-verification-placeholder');
      await writeFile(registered, clearArticle.replaceAll('2026-10-29', '2026-10-28'));
      expect((await auditFiles([registered])).files[registered].failures).toContain('missing-buyer-metadata');
    } finally { await rm(directory, { recursive: true, force: true }); }
  });
});
