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

function normalizedParagraphs(body) {
  return body
    .split(/\r?\n\s*\r?\n/)
    .map(block => block.trim())
    .filter(block => block.length >= 120)
    .filter(block => !/^(?:#|- |\d+\. )/m.test(block))
    .map(block => block
      .replace(/[*_`[\]()]/g, '')
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .trim()
      .toLowerCase());
}

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

  it('keeps stronger reference-role boundaries visible in the authored body', async () => {
    const bySlug = Object.fromEntries(await Promise.all(references.map(async reference => {
      const loaded = await loadReference(reference);
      return [reference.slug, loaded.body];
    })));
    expect(bySlug['arc-t25hq-truck-mounted-roll-forming-lift-40hq']).toMatch(/40HQ packing-study route only/i);
    expect(bySlug['arc-t25hq-truck-mounted-roll-forming-lift-40hq']).not.toMatch(/\b(?:fits?|ships?|packs?)\s+(?:in|into|inside)\s+(?:a\s+|the\s+)?40HQ\b/i);
    expect(bySlug['arc-f20-crawler-ceiling-platform']).toMatch(/archived reference class/i);
    for (const slug of ['arc-f25-crawler-ceiling-platform', 'arc-f31-crawler-ceiling-platform', 'arc-f35-crawler-ceiling-platform']) {
      expect(bySlug[slug]).toMatch(/reference concept/i);
      expect(bySlug[slug]).not.toMatch(/\b(?:verified|current)\s+(?:model|configuration)\b/i);
    }
    expect(bySlug['arc-rf8-roll-forming-machine']).not.toMatch(/\b(?:guaranteed|rated|standard)\s+(?:output|speed|capacity|power)\b/i);
  });

  it('does not clone normalized body paragraphs within a product family', async () => {
    const loaded = await Promise.all(references.map(loadReference));
    for (const family of new Set(loaded.map(item => item.family))) {
      const owners = new Map();
      for (const reference of loaded.filter(item => item.family === family)) {
        for (const paragraph of normalizedParagraphs(reference.body)) {
          const slugs = owners.get(paragraph) ?? [];
          slugs.push(reference.slug);
          owners.set(paragraph, slugs);
        }
      }
      const duplicates = [...owners.values()].filter(slugs => new Set(slugs).size > 1);
      expect(duplicates, `${family} contains cloned body paragraphs`).toEqual([]);
    }
  });
});
