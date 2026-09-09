import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const readProjectFile = (path) => readFile(resolve(root, path), 'utf8');

describe('homepage claims and decision language', () => {
  it('keeps the supplier role and avoids manufacturing, guarantee-like, and absolute wording', async () => {
    const homepage = await readProjectFile('src/pages/index.astro');
    const footer = await readProjectFile('src/layouts/BaseLayout.astro');
    const publicCopy = `${homepage}\n${footer}`;

    expect(publicCopy).toMatch(/Integrated equipment supplier supporting technical selection/i);
    expect(publicCopy).toMatch(/destination requirement review/i);
    expect(publicCopy).toMatch(/identify items requiring local confirmation/i);
    for (const phrase of [
      'confirmed before production',
      '40HQ-compatible configurations are available',
      'Project-Specific Compliance',
      'confirm compliance path',
      'Purpose-built platforms for steel-building ceilings, installation crews and material handling',
      '>PICK & CARRY<',
    ]) {
      expect(publicCopy).not.toContain(phrase);
    }
  });

  it('states each key specification as a historical reference with its boundary', async () => {
    const homepage = await readProjectFile('src/pages/index.astro');
    expect(homepage).toMatch(/12–32[\s\S]{0,180}Historical lift-height reference/i);
    expect(homepage).toMatch(/8\s*\/\s*11\s*\/\s*20[\s\S]{0,180}Historical equipment classes[\s\S]{0,120}Not platform or personnel payload/i);
    expect(homepage).toMatch(/0\.3–1\.0[\s\S]{0,180}Historical sheet-thickness reference[\s\S]{0,120}Material and profile dependent/i);
    expect(homepage).toMatch(/380[\s\S]{0,180}Common line-voltage reference[\s\S]{0,120}Destination and project specific/i);
    expect(homepage).not.toMatch(/20m\s*[–-]\s*35m/i);
  });
});

describe('static product-first homepage structure', () => {
  it('leads with roof-level forming and four family architecture paths without a carousel', async () => {
    const homepage = await readProjectFile('src/pages/index.astro');
    expect(homepage).toContain("import EquipmentDiagram from '../components/EquipmentDiagram.astro'");
    expect(homepage).toContain('Roll-forming lifts for roof-level panel production');
    for (const family of ['crawler', 'truck', 'ceiling', 'former']) {
      expect(homepage).toContain(`family: '${family}'`);
    }
    expect(homepage).not.toMatch(/hero__slide|hero__dot|hero__carousel|data-autoplay/);
    expect(homepage).not.toMatch(/\/images\/hero\//);
    expect(homepage).not.toContain('/images/editorial/port-loading-logistics.webp');
  });

  it('renders accessible self-contained schematics and truthful per-image disclosures', async () => {
    const homepage = await readProjectFile('src/pages/index.astro');
    const diagram = await readProjectFile('src/components/EquipmentDiagram.astro');
    expect(diagram).toContain("family: 'crawler' | 'truck' | 'ceiling' | 'former'");
    expect(diagram).toContain('viewBox="0 0 640 400"');
    expect(diagram).toContain('role="img"');
    expect(diagram).toContain('AI-assisted editorial schematic — not to scale; not model-specific evidence.');
    expect(homepage).toContain('AI-assisted editorial visual — representative only; not model-specific evidence.');
    expect(homepage.match(/class="app__image"/g)).toHaveLength(1);
    expect(homepage).toContain("const editorialDisclosure = 'AI-assisted editorial visual — representative only; not model-specific evidence.'");
  });

  it('preserves all homepage family and inquiry destinations', async () => {
    const homepage = await readProjectFile('src/pages/index.astro');
    for (const destination of [
      "id: 'crawler-roll-forming-lifts'",
      "id: 'truck-mounted-roll-forming-lifts'",
      "id: 'crawler-ceiling-platforms'",
      "id: 'roll-forming-machines'",
      'href={`/products/#${category.id}`}',
      '/products/',
      '/compare/',
      '/contact/',
      'https://wa.me/8615617687185',
      'mailto:leelogly120@gmail.com',
    ]) {
      expect(homepage).toContain(destination);
    }
  });
});

describe('homepage responsive and no-JavaScript contract', () => {
  it('keeps content visible without JavaScript and provides responsive grids', async () => {
    const styles = await readProjectFile('src/styles/global.css');
    expect(styles).toMatch(/\.reveal\s*\{[^}]*opacity:\s*1[^}]*transform:\s*none/s);
    expect(styles).toMatch(/\.hero__inner[\s\S]{0,220}grid-template-columns:/i);
    expect(styles).toMatch(/\.family-paths[\s\S]{0,180}grid-template-columns:/i);
    expect(styles).toMatch(/\.split__visual[\s\S]{0,220}aspect-ratio:\s*3\s*\/\s*2/i);
    expect(styles).toMatch(/\.split__visual img[\s\S]{0,220}object-fit:\s*contain/i);
    expect(styles).toMatch(/\.app__media[\s\S]{0,220}aspect-ratio:\s*3\s*\/\s*2/i);
    expect(styles).not.toMatch(/\.app\s*\{[^}]*height:\s*480px/s);
    expect(styles).toMatch(/\.spec-band \.stat__label[\s\S]{0,180}min-height:/i);
  });

  it('uses a dialog drawer, focus trap, resize cleanup, and persistent solid inner-page navigation', async () => {
    const layout = await readProjectFile('src/layouts/BaseLayout.astro');
    expect(layout).toContain('role="dialog"');
    expect(layout).toContain('aria-modal="true"');
    expect(layout).toContain('aria-controls="mobile-drawer"');
    expect(layout).toContain("e.key === 'Tab'");
    expect(layout).toContain("window.matchMedia('(min-width: 769px)')");
    expect(layout).toContain("nav.dataset.transparent !== 'true' || window.scrollY > 80");
    expect(layout).not.toContain('IntersectionObserver');
  });
});
