import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { auditFiles } from '../scripts/audit-content.mjs';

describe('Public asset URL path audit', () => {
  it('allows a site-relative /images/home/ URL', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'arclift-manifest-'));
    const path = join(dir, 'asset-manifest.json');
    try {
      await writeFile(path, JSON.stringify({
        campaigns: { home: [{ url: '/images/home/roof-panel-output.webp' }] },
      }));
      const report = await auditFiles([path]);
      expect(report.files[path].failures).not.toContain('public-local-path');
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('still rejects an absolute operating-system home path', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'arclift-manifest-'));
    const path = join(dir, 'asset-manifest.json');
    try {
      await writeFile(path, JSON.stringify({ url: '/home/private-user/source.webp' }));
      const report = await auditFiles([path]);
      expect(report.files[path].failures).toContain('public-local-path');
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
