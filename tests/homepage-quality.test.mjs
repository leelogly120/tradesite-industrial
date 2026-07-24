import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');

async function readProjectFile(path) {
  return readFile(resolve(root, path), 'utf8');
}

async function exists(path) {
  try {
    await access(resolve(root, path));
    return true;
  } catch {
    return false;
  }
}

describe('Task 6 homepage claims and decision language', () => {
  it('removes manufacturing, guarantee-like, and absolute workflow wording', async () => {
    const homepage = await readProjectFile('src/pages/index.astro');
    const footer = await readProjectFile('src/layouts/BaseLayout.astro');
    const publicCopy = `${homepage}\n${footer}`;

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

    expect(publicCopy).toMatch(/destination requirement review/i);
    expect(publicCopy).toMatch(/on-site repositioning review/i);
    expect(publicCopy).toMatch(/identify items requiring local confirmation/i);
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

describe('Task 6 homepage image routing and disclosure', () => {
  it('uses five safe hero slides and never references the workshop hero', async () => {
    const homepage = await readProjectFile('src/pages/index.astro');
    const slideMatches = homepage.match(/class="hero__slide[^"]*"/g) ?? [];

    expect(slideMatches).toHaveLength(5);
    expect(homepage).toContain('/images/hero/hero-1-arclift.webp');
    expect(homepage).toContain('/images/editorial/truck-site-roll-forming-lift.webp');
    expect(homepage).toContain('/images/editorial/port-loading-logistics.webp');
    expect(homepage).not.toContain('/images/hero/hero-4.webp');
    expect(homepage).not.toContain('/images/home/roll-forming-line.webp');
    expect(homepage.match(/role="img"/g)).toHaveLength(5);
    expect(homepage.match(/aria-label="[^"]+"/g)?.length ?? 0).toBeGreaterThanOrEqual(10);
  });

  it('maps homepage product categories to reviewed editorial assets', async () => {
    const homepage = await readProjectFile('src/pages/index.astro');

    expect(homepage).toContain("image: '/images/editorial/roll-forming-input-map.svg'");
    expect(homepage).not.toMatch(/cat\.items\[0\]\?\.data\.images/);
  });

  it('publishes homepage images in the public manifest as editorial', async () => {
    const manifest = JSON.parse(await readProjectFile('public/images/asset-manifest.json'));
    const records = [
      ...(manifest.campaigns?.hero ?? []),
      ...(manifest.campaigns?.home ?? []),
      ...(manifest.campaigns?.editorial ?? []),
    ];
    const required = [
      '/images/hero/hero-1-arclift.webp',
      '/images/home/under-ceiling-field-v2.webp',
      '/images/home/roof-panel-output.webp',
      '/images/home/wall-panel-platform.webp',
      '/images/editorial/truck-site-roll-forming-lift.webp',
      '/images/editorial/port-loading-logistics.webp',
      '/images/editorial/roll-forming-input-map.svg',
    ];

    for (const url of required) {
      const record = records.find((candidate) => candidate.url === url);
      expect(record, `${url} must have a manifest record`).toBeDefined();
      expect(record?.classification).toBe('editorial');
      expect(await exists(`public${url}`)).toBe(true);
    }

    const newHero = records.find((record) => record.url === '/images/hero/hero-1-arclift.webp');
    expect(newHero?.disclosure).toBe('AI-assisted editorial composite');
    expect(records.some((record) => record.url === '/images/hero/hero-4.webp')).toBe(false);
  });

  it('stores the new 16:9 hero with only trained-algorithmic-media XMP', async () => {
    const metadata = await sharp(resolve(root, 'public/images/hero/hero-1-arclift.webp')).metadata();
    const xmp = metadata.xmp?.toString('utf8') ?? '';

    expect(metadata.format).toBe('webp');
    expect(metadata.width).toBe(1600);
    expect(metadata.height).toBe(900);
    expect(metadata.exif).toBeUndefined();
    expect(metadata.icc).toBeUndefined();
    expect(metadata.iptc).toBeUndefined();
    expect(xmp).toContain('trainedAlgorithmicMedia');
    expect(xmp).not.toMatch(/(?:gps|camera|photoshop|creator|author|location)/i);
  });
});

describe('Task 6 homepage interaction hooks and responsive media', () => {
  it('exposes accessible carousel controls and reduced-motion behavior', async () => {
    const homepage = await readProjectFile('src/pages/index.astro');

    expect(homepage.match(/class="hero__dot(?:\s|")[^"]*"/g)).toHaveLength(5);
    expect(homepage.match(/aria-label="Show slide \d of 5"/g) ?? []).toHaveLength(5);
    expect(homepage).toContain('aria-current="true"');
    expect(homepage).toMatch(/setAttribute\(['"]aria-current['"]/);
    expect(homepage).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(homepage).toMatch(/focusin/);
    expect(homepage).toMatch(/focusout/);
  });

  it('uses non-cropping responsive media and representative application captions', async () => {
    const homepage = await readProjectFile('src/pages/index.astro');
    const styles = await readProjectFile('src/styles/global.css');

    expect(homepage.match(/<span class="app__caption">Representative application visual<\/span>/g) ?? []).toHaveLength(3);
    expect(homepage.match(/aria-label="[^"]*Representative application visual[^"]*"/g) ?? []).toHaveLength(3);
    expect(homepage.match(/class="app__image"/g)).toHaveLength(3);
    expect(styles).toMatch(/\.split__visual[\s\S]{0,220}aspect-ratio:\s*3\s*\/\s*2/i);
    expect(styles).toMatch(/\.split__visual img[\s\S]{0,220}object-fit:\s*contain/i);
    expect(styles).toMatch(/\.app__media[\s\S]{0,220}aspect-ratio:\s*3\s*\/\s*2/i);
    expect(styles).not.toMatch(/\.app\s*\{[^}]*height:\s*480px/s);
    expect(styles).toMatch(/\.hero__scroll[\s\S]{0,360}pointer-events:\s*none/i);
    expect(styles).toMatch(/\.spec-band \.stat__label[\s\S]{0,180}min-height:/i);
  });
});
