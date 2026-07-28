import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const productsDir = resolve(import.meta.dirname, '../src/content/products');
const controllingSentence = 'The signed technical schedule and approved drawings control the final configuration.';

const references = [
  {
    slug: 'arc-c17-crawler-roll-forming-lift',
    family: 'crawler',
    decision: /(?:lower archive-height|restricted setup areas)/i,
  },
  {
    slug: 'arc-c21-crawler-roll-forming-lift',
    family: 'crawler',
    decision: /(?:handover geometry|work-zone transitions)/i,
  },
  {
    slug: 'arc-c25-crawler-roll-forming-lift',
    family: 'crawler',
    decision: /(?:mid-range archive-height|multiple setup positions)/i,
  },
  {
    slug: 'arc-c28-crawler-roll-forming-lift',
    family: 'crawler',
    decision: /(?:added archive height|setup sequence)/i,
  },
  {
    slug: 'arc-c32-crawler-roll-forming-lift',
    family: 'crawler',
    decision: /(?:upper archive-height|high work zones)/i,
  },
  {
    slug: 'arc-t12-truck-mounted-roll-forming-lift',
    family: 'truck',
    decision: /(?:compact destination chassis|tight site access)/i,
  },
  {
    slug: 'arc-t18-truck-mounted-roll-forming-lift',
    family: 'truck',
    decision: /(?:road-route constraints|chassis-and-route)/i,
  },
  {
    slug: 'arc-t25-truck-mounted-roll-forming-lift',
    family: 'truck',
    decision: /working envelope and chassis envelope/i,
  },
  {
    slug: 'arc-t25hq-truck-mounted-roll-forming-lift-40hq',
    family: 'truck',
    decision: /packing-study route only/i,
  },
  {
    slug: 'arc-t31-truck-mounted-roll-forming-lift',
    family: 'truck',
    decision: /high work zones against the destination route/i,
  },
  {
    slug: 'arc-f20-crawler-ceiling-platform',
    family: 'platform',
    decision: /20m archived reference/i,
  },
  {
    slug: 'arc-f25-crawler-ceiling-platform',
    family: 'platform',
    decision: /25m reference concept/i,
  },
  {
    slug: 'arc-f31-crawler-ceiling-platform',
    family: 'platform',
    decision: /31m reference concept/i,
  },
  {
    slug: 'arc-f35-crawler-ceiling-platform',
    family: 'platform',
    decision: /35m reference concept/i,
  },
  {
    slug: 'arc-rf8-roll-forming-machine',
    family: 'roll-forming',
    decision: /profile, material, and tooling/i,
  },
];

const familyInputs = {
  crawler: [
    /access route/i,
    /ground bearing/i,
    /support geometry/i,
    /work elevation/i,
    /panel run-out/i,
    /weather and rescue controls/i,
  ],
  truck: [
    /destination road and chassis rules/i,
    /travel and working envelopes/i,
    /outriggers and ground/i,
    /transport route/i,
    /panel run-out/i,
    /approval documents/i,
  ],
  platform: [
    /floor or ground bearing/i,
    /indoor access/i,
    /clear height/i,
    /obstructions/i,
    /deck, crew, and tool basis/i,
    /rescue and local rules/i,
  ],
  'roll-forming': [
    /approved profile drawing/i,
    /material, yield, and coating/i,
    /thickness range/i,
    /seam and tooling/i,
    /output direction/i,
    /run-out/i,
    /power and lift interface/i,
  ],
};

function markdownBody(source) {
  const match = source.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error('Product Markdown must contain frontmatter');
  return match[1].trim();
}

function proseUnits(body) {
  return body
    .replace(/^#{1,6}\s+.*$/gm, '')
    .split(/\r?\n\s*\r?\n/)
    .flatMap(block => {
      const lines = block.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
      if (lines.every(line => /^[-*+]\s+/.test(line))) {
        return lines.map(line => line.replace(/^[-*+]\s+/, ''));
      }
      return lines.join(' ').split(/(?<=[.!?])\s+/);
    })
    .map(unit => unit.trim())
    .filter(Boolean);
}

function hasEvidenceBoundary(unit) {
  return /\b(?:archived|historical|reference concept|reference only|unknown|unconfirmed|not confirmed|not evidence|does not|do not|cannot|may not fit|no current|requested inputs?|send|provide|prepare|review|may change|changes with|project-specific confirmation|confirmed per project|to be confirmed|approved|signed|must|requires?)\b/i.test(unit);
}

function referenceRoleViolations(slug, body) {
  const violations = [];
  const conceptSlugs = new Set([
    'arc-f25-crawler-ceiling-platform',
    'arc-f31-crawler-ceiling-platform',
    'arc-f35-crawler-ceiling-platform',
  ]);
  const positiveVerb = /\b(?:accommodates?|accepts?|carries?|contains?|delivers?|features?|fits?|forms?|handles?|has|holds?|includes?|operates?|offers?|packs?|produces?|provides?|reaches?|runs?(?![- ]out)|ships?|supports?|uses?)\b/i;

  for (const unit of proseUnits(body)) {
    if (hasEvidenceBoundary(unit)) continue;

    let forbidden;
    if (/^arc-c\d+/i.test(slug)) {
      forbidden = /\b(?:payload|deck load|load capacity|sheet thickness|material (?:window|range|grade)|power(?: package| supply| demand)?|voltage|output|performance|stability|working height|work envelope|outreach)\b/i;
    } else if (conceptSlugs.has(slug)) {
      forbidden = /\b(?:deck(?: size| load)?|load(?: capacity)?|power|voltage|travel(?: mode| speed)?|working height|reach|use case|capacity|performance|suitab(?:ility|le))\b/i;
    } else if (slug === 'arc-rf8-roll-forming-machine') {
      forbidden = /\b(?:profile|material|tooling|output|line rate|speed|power|voltage|capacity|performance)\b/i;
    } else if (slug === 'arc-t25hq-truck-mounted-roll-forming-lift-40hq') {
      forbidden = /\b(?:40HQ|container|package|quantity|fit|freight|shipping|shipment|transit|delivery)\b/i;
    } else if (/^arc-t\d+/i.test(slug)) {
      forbidden = /\b(?:road legal|registration|registered|chassis|axle load|payload|power|transport status|working envelope|performance)\b/i;
    }

    const hasTechnicalMetric = /\b\d+(?:\.\d+)?\s*(?:m\/min|mm\/s|v|kw|kg|t(?:onnes?)?)\b/i.test(unit);
    const hasForbiddenClaim = forbidden?.test(unit)
      || (slug === 'arc-rf8-roll-forming-machine' && hasTechnicalMetric);
    if (hasForbiddenClaim && positiveVerb.test(unit)) {
      violations.push(unit);
    }
  }
  return violations;
}

function normalizedCopyUnit(unit) {
  return unit
    .replace(/\barc[- ]?(?:rf|c|t|f)\s*[- ]?\d+(?:hq)?\b/gi, ' <model> ')
    .replace(/\b\d+(?:\.\d+)?(?:\s*[-–]\s*\d+(?:\.\d+)?)?\s*(?:m\/min|mm\/s|mm|kg|kw|v|m|t)?\b/gi, ' <number> ')
    .replace(/[*_`[\]()]/g, '')
    .replace(/[^\p{L}\p{N}<>]+/gu, ' ')
    .trim()
    .toLowerCase();
}

function isAllowedBoilerplate(unit) {
  const normalized = normalizedCopyUnit(unit);
  return normalized === normalizedCopyUnit(controllingSentence)
    || /^\s*\*{0,2}image disclosure:/i.test(unit)
    || /representative editorial image\s+not model specific evidence/i.test(normalized)
    || /ai assisted editorial composite/i.test(normalized);
}

function shingles(tokens, size = 4) {
  const values = new Set();
  for (let index = 0; index <= tokens.length - size; index += 1) {
    values.add(tokens.slice(index, index + size).join(' '));
  }
  return values;
}

function jaccard(left, right) {
  const intersection = [...left].filter(value => right.has(value)).length;
  const union = new Set([...left, ...right]).size;
  return union === 0 ? 0 : intersection / union;
}

function duplicateCopyViolations(items) {
  const units = items.flatMap(item => proseUnits(item.body)
    .filter(unit => !isAllowedBoilerplate(unit))
    .map(unit => ({
      slug: item.slug,
      raw: unit,
      normalized: normalizedCopyUnit(unit),
    }))
    .filter(unit => unit.normalized.split(/\s+/).length >= 8));
  const violations = [];

  for (let leftIndex = 0; leftIndex < units.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < units.length; rightIndex += 1) {
      const left = units[leftIndex];
      const right = units[rightIndex];
      if (left.slug === right.slug) continue;
      const leftTokens = left.normalized.split(/\s+/);
      const rightTokens = right.normalized.split(/\s+/);
      const similarity = left.normalized === right.normalized
        ? 1
        : jaccard(shingles(leftTokens), shingles(rightTokens));
      if (similarity >= 0.84) {
        violations.push({
          slugs: [left.slug, right.slug],
          similarity,
          units: [left.raw, right.raw],
        });
      }
    }
  }
  return violations;
}

const referenceRoleMutations = [
  ['arc-f31-crawler-ceiling-platform', 'ARC-F31 carries a 500 kg deck load.'],
  ['arc-rf8-roll-forming-machine', 'ARC-RF8 produces 20 m/min on 380V.'],
  ['arc-t25hq-truck-mounted-roll-forming-lift-40hq', 'The 40HQ container accommodates one ARC-T25HQ package.'],
  ['arc-c25-crawler-roll-forming-lift', 'ARC-C25 uses a 380V power package.'],
];

async function loadReference(reference) {
  const source = await readFile(resolve(productsDir, `${reference.slug}.md`), 'utf8');
  return { ...reference, source, body: markdownBody(source) };
}

describe('Product copy distinctiveness', () => {
  it.each(references)('$slug frames its own buyer decision and evidence boundary', async (reference) => {
    const { body } = await loadReference(reference);
    expect(body).toMatch(reference.decision);
    expect(body).toMatch(/configuration (?:review )?(?:changes|may change|depends)|can change the configuration/i);
    expect(body).toMatch(/may not fit|not a fit|stop the review|another method|another route|do not proceed/i);
    expect(body).toContain(controllingSentence);
    expect(body).toMatch(/\*\*Image disclosure:\*\*\s*Representative editorial/i);
    expect(body).toMatch(/not model-specific evidence/i);
    expect(body).toMatch(/ARCLIFT (?:acts|works|participates) as (?:an integrated equipment supplier|a technical selection and supply partner)/i);
    expect(body).toMatch(/Ask ARCLIFT to review|Request a configuration review/i);
  });

  it.each(references)('$slug requests the inputs that control its family review', async (reference) => {
    const { body } = await loadReference(reference);
    for (const pattern of familyInputs[reference.family]) {
      expect(body, `${reference.slug} must request ${pattern}`).toMatch(pattern);
    }
  });

  it.each(referenceRoleMutations)('rejects an injected current capability claim for %s', (slug, body) => {
    expect(referenceRoleViolations(slug, body)).not.toEqual([]);
  });

  it('allows archived, unknown, requested-input, and confirmation language', () => {
    const safeFixtures = [
      ['arc-c25-crawler-roll-forming-lift', 'The 380V class is an archived reference only and requires project-specific confirmation.'],
      ['arc-f31-crawler-ceiling-platform', 'Deck load is unknown; send the deck, crew, and tool basis for review.'],
      ['arc-rf8-roll-forming-machine', 'Requested inputs include output direction and the destination power interface.'],
      ['arc-t25hq-truck-mounted-roll-forming-lift-40hq', 'Container fit is not confirmed; approved packing data controls booking.'],
    ];
    for (const [slug, body] of safeFixtures) {
      expect(referenceRoleViolations(slug, body), `${slug}: ${body}`).toEqual([]);
    }
  });

  it('keeps stronger reference-role boundaries visible in the authored body', async () => {
    const bySlug = Object.fromEntries(await Promise.all(references.map(async reference => {
      const loaded = await loadReference(reference);
      return [reference.slug, loaded.body];
    })));
    expect(bySlug['arc-t25hq-truck-mounted-roll-forming-lift-40hq']).toMatch(/40HQ packing-study route only/i);
    expect(bySlug['arc-f20-crawler-ceiling-platform']).toMatch(/archived reference class/i);
    for (const slug of ['arc-f25-crawler-ceiling-platform', 'arc-f31-crawler-ceiling-platform', 'arc-f35-crawler-ceiling-platform']) {
      expect(bySlug[slug]).toMatch(/reference concept/i);
    }
    for (const [slug, body] of Object.entries(bySlug)) {
      expect(referenceRoleViolations(slug, body), slug).toEqual([]);
    }
  });

  it('rejects copied copy after model/number masking, appended text, and list reuse', () => {
    const mutations = [
      {
        slug: 'arc-f25-crawler-ceiling-platform',
        body: 'ARC-F25 frames the 25m review by mapping indoor access, floor bearing, obstructions, task loads, and rescue controls before any configuration is discussed.',
      },
      {
        slug: 'arc-f31-crawler-ceiling-platform',
        body: 'ARC-F31 frames the 31m review by mapping indoor access, floor bearing, obstructions, task loads, and rescue controls before any configuration is discussed. An extra sentence is appended.',
      },
      {
        slug: 'arc-f25-list-copy',
        body: '- ARC-F25 needs a 25m zone map, floor bearing records, indoor access dimensions, obstructions, and rescue controls.',
      },
      {
        slug: 'arc-f31-list-copy',
        body: '- ARC-F31 needs a 31m zone map, floor bearing records, indoor access dimensions, obstructions, and rescue controls.',
      },
    ];
    expect(duplicateCopyViolations(mutations)).toHaveLength(2);
  });

  it('does not clone normalized copy within a product family', async () => {
    const loaded = await Promise.all(references.map(loadReference));
    for (const family of new Set(loaded.map(item => item.family))) {
      const duplicates = duplicateCopyViolations(loaded.filter(item => item.family === family));
      expect(duplicates, `${family} contains cloned body paragraphs`).toEqual([]);
    }
  });
});
