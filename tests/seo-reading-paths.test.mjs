import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

async function readingPaths() {
  expect(existsSync(resolve('src/lib/guide-navigation.ts')), 'published guides need a curated reading path').toBe(true);
  return import('../src/lib/guide-navigation.ts');
}

const post = (id, draft = false) => ({ id, data: { title: `Guide: ${id}`, description: 'A specific buyer decision.', draft } });

describe('published guide reading paths', () => {
  it('reserves fixed-navigation space for the product introduction and guide anchors', () => {
    const listing = readFileSync(resolve('src/pages/products/index.astro'), 'utf8');
    const guides = readFileSync(resolve('src/components/GuideLinks.astro'), 'utf8');
    expect(listing).toMatch(/\.selector-hero\s*\{[^}]*padding(?:-top)?:\s*calc\(var\(--nav-height\)\s*\+/);
    expect(guides).toMatch(/scroll-margin-top:\s*calc\(var\(--nav-height\)\s*\+/);
  });
  it('connects a route-survey reader to ground review and relocation without linking to itself', async () => {
    const { getRelatedGuides } = await readingPaths();
    const current = 'crawler-roll-forming-lift-access-route-survey';
    const posts = [current, 'crawler-roll-forming-lift-ground-support-review', 'crawler-roll-forming-lift-work-zone-relocation'].map(id => post(id));
    expect(getRelatedGuides(current, posts).map(link => link.href)).toEqual([
      '/blog/crawler-roll-forming-lift-ground-support-review/',
      '/blog/crawler-roll-forming-lift-work-zone-relocation/',
    ]);
  });

  it('never links readers to drafts, absent routes, or an unrelated fallback', async () => {
    const { getRelatedGuides } = await readingPaths();
    expect(getRelatedGuides('crawler-roll-forming-lift-access-route-survey', [
      post('crawler-roll-forming-lift-ground-support-review', true),
      post('airport-terminal-ceiling-access-route-survey-guide'),
    ])).toEqual([]);
    expect(getRelatedGuides('unknown-guide', [post('roof-level-roll-forming-long-panels')])).toEqual([]);
  });

  it('gives every retained article an incoming contextual route, not just a date-listing link', async () => {
    const { GUIDE_TOPICS, getRelatedGuides } = await readingPaths();
    const ids = readdirSync(resolve('src/content/blog')).filter(name => name.endsWith('.md')).map(name => name.slice(0, -3));
    const assigned = GUIDE_TOPICS.flatMap(topic => topic.slugs);
    expect([...new Set(assigned)].sort()).toEqual([...ids].sort());
    expect(assigned.length).toBe(new Set(assigned).size);
    const posts = ids.map(id => post(id));
    const incoming = new Set(ids.flatMap(id => getRelatedGuides(id, posts).map(link => link.href)));
    for (const id of ids) expect(incoming.has(`/blog/${id}/`), id).toBe(true);
  });

  it('connects a truck reference to chassis and packing decisions without implying a product capability', async () => {
    const { getProductGuides } = await readingPaths();
    const ids = ['truck-mounted-roll-forming-chassis-interface-review', '40hq-shipping-truck-mounted-roll-forming-lift'];
    expect(getProductGuides('truck-mounted-roll-forming-lifts', ids.map(id => post(id))).map(link => link.href)).toEqual([
      '/blog/truck-mounted-roll-forming-chassis-interface-review/',
      '/blog/40hq-shipping-truck-mounted-roll-forming-lift/',
    ]);
    expect(getProductGuides('unknown-family', ids.map(id => post(id)))).toEqual([]);
  });

  it('uses the article title and description instead of a separately maintained label', async () => {
    const { getRelatedGuides } = await readingPaths();
    const links = getRelatedGuides('crawler-roll-forming-lift-access-route-survey', [{
      id: 'crawler-roll-forming-lift-ground-support-review',
      data: { title: 'Ground evidence for selection', description: 'Identify the support questions.', draft: false },
    }]);
    expect(links).toEqual([{ href: '/blog/crawler-roll-forming-lift-ground-support-review/', title: 'Ground evidence for selection', description: 'Identify the support questions.' }]);
  });
});
