import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse } from 'parse5';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const html = await readFile(resolve(root, 'dist/index.html'), 'utf8');
const dom = parse(html);
function nodes(node) { return [node, ...(node.childNodes || []).flatMap(nodes)]; }
function attr(node, key) { return node.attrs?.find(a => a.name === key)?.value; }
function words(node) {
  if (['style','script','noscript'].includes(node.tagName)) return '';
  return node.nodeName === '#text' ? node.value : (node.childNodes || []).map(words).join(' ');
}
const all = nodes(dom);
const main = all.find(n => n.tagName === 'main');
const content = words(main).replace(/\s+/g, ' ');
const hasClass = (node, name) => (attr(node, 'class') || '').split(/\s+/).includes(name);

describe('equipment-led homepage publishable claims', () => {
  it('makes the supplier role visible without manufacturing or guarantee-like promises', () => {
    expect(content).toMatch(/integrated equipment supplier and technical selection and supply partner/i);
    expect(words(dom)).toContain('Catalog figures are for selection only. Ordered configuration is confirmed by quotation, drawings, and load chart.');
    for (const phrase of ['confirmed before production','40HQ-compatible configurations are available','Project-Specific Compliance','confirm compliance path','our factory','our manufacturing','guaranteed capacity']) expect(content.toLowerCase()).not.toContain(phrase.toLowerCase());
  });
  it('explains the selection inputs without using archival numbers as a current sales promise', () => {
    for(const phrase of ['forming machine','mounting','outlet','panel handover','support conditions','destination']) expect(content.toLowerCase()).toContain(phrase);
    expect(content).not.toMatch(/20m\s*[–-]\s*35m|12–32|8\s*\/\s*11\s*\/\s*20|0\.3–1\.0/);
  });
});

describe('equipment-led homepage discovery and media', () => {
  it('offers four application families without treating forming machines as truck work platforms', () => {
    const catalog=all.find(n=>attr(n,'id')==='equipment-series');
    expect(catalog).toBeDefined();
    expect(nodes(catalog).filter(n=>n.tagName==='article')).toHaveLength(4);
    expect(content).toMatch(/roof-panel roll formers/i);
    expect(words(catalog)).toMatch(/Truck-Mounted Work Platforms/);
    expect(words(catalog)).toMatch(/Crawler Large-Deck Work Platforms/);
    expect(nodes(main).some(n=>['hero__carousel','hero__slide','hero__dot'].some(c=>hasClass(n,c)))).toBe(false);
  });
  it('uses local authentic equipment photos with descriptive alternatives, dimensions and scene captions', async () => {
    const photos=nodes(main).filter(n=>n.tagName==='img');
    expect(photos.length).toBeGreaterThanOrEqual(5);
    let totalBytes=0;
    for(const photo of photos) {
      expect(attr(photo,'alt').length).toBeGreaterThan(30);
      expect(Number(attr(photo,'width'))).toBeGreaterThan(0);
      expect(Number(attr(photo,'height'))).toBeGreaterThan(0);
      expect(attr(photo,'src')).toMatch(/^\/images\/equipment\//);
      const bytes=(await stat(resolve(root,'public',attr(photo,'src').slice(1)))).size;
      // Approved authentic photos retain their reviewed privacy processing and useful detail.
      expect(bytes).toBeLessThan(150*1024);
      totalBytes+=bytes;
    }
    expect(totalBytes).toBeLessThan(600*1024);
    const hero=all.find(n=>attr(n,'data-equipment-hero')!==undefined);
    expect(nodes(hero).filter(n=>n.tagName==='img')).toHaveLength(1);
    expect(words(hero)).toMatch(/roof-panel forming equipment/i);
    expect(content).not.toContain('AI-assisted');
  });
  it('preserves all family, comparison and inquiry destinations as actual HTML links', () => {
    const links=new Set(all.filter(n=>n.tagName==='a').map(n=>attr(n,'href')));
    for(const destination of ['/products/#crawler-roll-forming-lifts','/products/#truck-mounted-roll-forming-lifts','/products/#crawler-ceiling-platforms','/products/#truck-mounted-work-platforms','/products/#roll-forming-machines','/products/','/compare/','/contact/','https://wa.me/8615515922444','mailto:leelogly120@gmail.com']) expect(links.has(destination),destination).toBe(true);
  });
  it('provides a normal Contact navigation entry and direct desktop contact links', () => {
    const nav=all.find(n=>attr(n,'aria-label')==='Primary navigation');
    expect(nodes(nav).some(n=>n.tagName==='a'&&words(n)==='Contact'&&attr(n,'href')==='/contact/')).toBe(true);
    const contacts=all.find(n=>attr(n,'aria-label')==='Direct contact');
    expect(nodes(contacts).filter(n=>n.tagName==='a').map(n=>attr(n,'href'))).toEqual(expect.arrayContaining(['mailto:leelogly120@gmail.com','https://wa.me/8615515922444']));
  });
  it('retains accessible, truthfully disclosed schematics for the protected detail pages', async () => {
    const diagram=await readFile(resolve(root,'src/components/EquipmentDiagram.astro'),'utf8');
    expect(diagram).toContain('role="img"');
    expect(diagram).toContain('AI-assisted editorial schematic — not to scale; not model-specific evidence.');
  });
});
