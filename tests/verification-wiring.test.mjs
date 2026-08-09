import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

describe('permanent verification wiring', () => {
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
    expect(packageJson.scripts['audit:content']).toBe('node scripts/audit-lift-platform-content.mjs');
  });

  it('runs the Cloudflare static deployment contract test permanently', () => {
    expect(packageJson.scripts['test:content']).toContain('tests/cloudflare-static-deploy.test.mjs');
  });

  it('runs the built-output audit after Astro emits dist', () => {
    expect(packageJson.scripts.build).toMatch(/^astro build && npm run audit:build$/);
    expect(packageJson.scripts['audit:build']).toBe('node scripts/audit-build.mjs');
  });
});
