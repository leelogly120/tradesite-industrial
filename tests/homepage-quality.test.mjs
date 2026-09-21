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
    expect(words(dom)).toMatch(/identif(?:y|ies) items requiring local confirmation/i);
    for (const phrase of ['confirmed before production','40HQ-compatible configurations are available','Project-Specific Compliance','confirm compliance path','our factory','our manufacturing','guaranteed capacity']) expect(content.toLowerCase()).not.toContain(phrase.toLowerCase());
  });
  it('explains the selection inputs without using archival numbers as a current sales promise', () => {
    for(const phrase of ['Roll-former weight, dimensions','mounting arrangement','Target outlet height','panel handover','support conditions','destination']) expect(content).toContain(phrase);
    expect(content).not.toMatch(/20m\s*[–-]\s*35m|12–32|8\s*\/\s*11\s*\/\s*20|0\.3–1\.0/);
  });
});

describe('equipment-led homepage discovery and media', () => {
  it('offers two primary lifting arrangements and a distinct ceiling route without a carousel', () => {
    expect(nodes(main).filter(n=>hasClass(n,'a2-route'))).toHaveLength(2);
    expect(content).toMatch(/roof-panel roll formers/i);
    const ceiling=all.find(n=>attr(n,'id')==='ceiling');
    expect(words(ceiling)).toMatch(/A separate product line/);
    expect(nodes(main).some(n=>['hero__carousel','hero__slide','hero__dot'].some(c=>hasClass(n,c)))).toBe(false);
  });
  it('ships five real reference photos with descriptive alternatives, dimensions and scope captions', async () => {
    const photos=nodes(main).filter(n=>n.tagName==='img');
    expect(photos).toHaveLength(5);
    for(const photo of photos) {
      expect(attr(photo,'alt').length).toBeGreaterThan(30);
      expect(Number(attr(photo,'width'))).toBeGreaterThan(0);
      expect(Number(attr(photo,'height'))).toBeGreaterThan(0);
      expect(attr(photo,'src')).toMatch(/^\/images\/equipment\//);
      expect((await stat(resolve(root,'public',attr(photo,'src').slice(1)))).size).toBeLessThan(100*1024);
    }
    for(const phrase of ['Equipment reference views','not roof-panel production','not an operating setup','loads need separate confirmation']) expect(content).toContain(phrase);
    expect(content).not.toContain('AI-assisted');
  });
  it('preserves all family, comparison and inquiry destinations as actual HTML links', () => {
    const links=new Set(all.filter(n=>n.tagName==='a').map(n=>attr(n,'href')));
    for(const destination of ['/products/#crawler-roll-forming-lifts','/products/#truck-mounted-roll-forming-lifts','/products/#crawler-ceiling-platforms','/products/#roll-forming-machines','/products/','/compare/','/contact/','https://wa.me/8615617687185','mailto:leelogly120@gmail.com']) expect(links.has(destination),destination).toBe(true);
  });
  it('retains accessible, truthfully disclosed schematics for the protected detail pages', async () => {
    const diagram=await readFile(resolve(root,'src/components/EquipmentDiagram.astro'),'utf8');
    expect(diagram).toContain('role="img"');
    expect(diagram).toContain('AI-assisted editorial schematic — not to scale; not model-specific evidence.');
  });
});
