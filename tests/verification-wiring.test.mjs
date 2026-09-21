import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

describe('permanent verification wiring', () => {
  it('rebuilds current HTML before tests inspect the generated pages', () => {
    const steps = packageJson.scripts.verify.split(' && ');
    expect(steps.indexOf('npm run build')).toBeLessThan(steps.indexOf('npm run test:content'));
    expect(packageJson.scripts['test:e2e']).toContain('tests/a2-rebuild.spec.ts');
  });
  it('runs all focused product selection, card, copy, and encoding tests in npm run verify', () => {
    const verifyCommand = packageJson.scripts.verify;
    const testContentCommand = packageJson.scripts['test:content'];
    expect(verifyCommand).toContain('npm run test:content');
    expect(testContentCommand).toContain('tests/product-selection-system.test.mjs');
    expect(testContentCommand).toContain('tests/product-card-specs.test.mjs');
    expect(testContentCommand).toContain('tests/product-copy-distinctiveness.test.mjs');
    expect(testContentCommand).toContain('tests/product-page-encoding.test.mjs');
    expect(testContentCommand).toContain('tests/final-review-regressions.test.mjs');
    expect(testContentCommand).toContain('tests/homepage-performance-assets.test.mjs');
  });

  it('runs the twenty-article coverage test and extended content audit permanently', () => {
    expect(packageJson.scripts['test:content']).toContain('tests/twenty-lift-platform-articles.test.mjs');
    expect(packageJson.scripts['test:content']).toContain('tests/two-daily-lift-platform-articles-20260810.test.mjs');
    expect(packageJson.scripts['audit:content']).toBe('node scripts/audit-lift-platform-content.mjs');
  });

  it('runs the Cloudflare static deployment contract test permanently', () => {
    expect(packageJson.scripts['test:content']).toContain('tests/cloudflare-static-deploy.test.mjs');
  });

  it('runs the built-output audit after Astro emits dist', () => {
    expect(packageJson.scripts.build.split(' && ')).toEqual(['astro build', 'node scripts/optimize-build-images.mjs', 'npm run audit:build']);
    expect(packageJson.scripts['audit:build']).toBe('node scripts/audit-build.mjs');
  });

  it('keeps static rules, image output and buyer-route regressions in the release gate', () => {
    expect(packageJson.scripts.verify).toContain('npm run test:site');
    expect(packageJson.scripts['test:site']).toContain('tests/static-asset-rules.test.mjs');
    expect(packageJson.scripts['test:site']).toContain('tests/build-image-markup.test.mjs');
    for (const file of ['site-refinement', 'product-discovery', 'application-refinement']) {
      expect(packageJson.scripts['test:e2e']).toContain(`tests/${file}.spec.ts`);
    }
  });
});
