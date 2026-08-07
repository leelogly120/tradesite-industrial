# ARCLIFT Cloudflare Static Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing Cloudflare production command deploy the Astro `dist` output directly instead of entering failing framework auto-configuration.

**Architecture:** Keep Astro in static-output mode and add one root Wrangler configuration that maps the existing `tradesite-industrial` Worker to `./dist`. Protect that deployment contract with a focused Vitest test wired into the repository's permanent verification command.

**Tech Stack:** Astro 7, Vitest 4, Wrangler 4, Cloudflare Workers Static Assets, GitHub.

## Global Constraints

- Do not edit or remove any published article or route.
- Do not change Contact styling, inquiry behavior, the inquiry Worker, or product parameters.
- Do not alter the Astro output mode or add `@astrojs/cloudflare`.
- Do not change Cloudflare dashboard settings unless the committed configuration fails its documented contract.
- Do not perform Search Console work; the operator handles it manually.
- Do not shut down the computer.
- Stop if the Git push fails.
- If Cloudflare still fails after this fix, preserve the local commit, record the new evidence, and return to root-cause analysis without stacking speculative changes.

---

### Task 1: Define and protect the static deployment contract

**Files:**
- Create: `tests/cloudflare-static-deploy.test.mjs`
- Create: `wrangler.jsonc`

**Interfaces:**
- Consumes: Wrangler's root JSON configuration contract.
- Produces: A root configuration with Worker name `tradesite-industrial` and `assets.directory` equal to `./dist`.

- [ ] **Step 1: Write the failing contract test**

```js
import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const configUrl = new URL('../wrangler.jsonc', import.meta.url);

describe('Cloudflare static deployment contract', () => {
  it('deploys the built Astro output to the production Worker', async () => {
    const config = JSON.parse(await readFile(configUrl, 'utf8'));

    expect(config).toMatchObject({
      name: 'tradesite-industrial',
      assets: {
        directory: './dist',
      },
    });
  });
});
```

- [ ] **Step 2: Run the focused test and verify the red state**

Run: `npx vitest run tests/cloudflare-static-deploy.test.mjs`

Expected: FAIL with `ENOENT` for the absent root `wrangler.jsonc`.

- [ ] **Step 3: Add the minimal root Wrangler configuration**

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "tradesite-industrial",
  "compatibility_date": "2026-08-07",
  "assets": {
    "directory": "./dist"
  }
}
```

- [ ] **Step 4: Re-run the focused test and verify the green state**

Run: `npx vitest run tests/cloudflare-static-deploy.test.mjs`

Expected: PASS with one passing test and zero failures.

- [ ] **Step 5: Commit the deployment contract**

```powershell
git add tests/cloudflare-static-deploy.test.mjs wrangler.jsonc
git commit -m "fix: define Cloudflare static asset deployment"
```

### Task 2: Wire the regression test into permanent verification

**Files:**
- Modify: `tests/verification-wiring.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `package.json` script `test:content`.
- Produces: Every `npm run verify` invocation runs `tests/cloudflare-static-deploy.test.mjs`.

- [ ] **Step 1: Add the failing wiring assertion**

Append this assertion to the existing `permanent verification wiring` suite:

```js
it('runs the Cloudflare static deployment contract test permanently', () => {
  expect(packageJson.scripts['test:content']).toContain('tests/cloudflare-static-deploy.test.mjs');
});
```

- [ ] **Step 2: Run the wiring test and verify the red state**

Run: `npx vitest run tests/verification-wiring.test.mjs`

Expected: FAIL because `test:content` does not yet contain `tests/cloudflare-static-deploy.test.mjs`.

- [ ] **Step 3: Add the focused test to `test:content`**

Append `tests/cloudflare-static-deploy.test.mjs` to the existing `vitest run` file list without changing any existing test path.

- [ ] **Step 4: Re-run both focused tests**

Run: `npx vitest run tests/verification-wiring.test.mjs tests/cloudflare-static-deploy.test.mjs`

Expected: PASS with zero failures.

- [ ] **Step 5: Commit permanent verification wiring**

```powershell
git add package.json tests/verification-wiring.test.mjs
git commit -m "test: wire Cloudflare deploy regression check"
```

### Task 3: Prove the local deployment and site quality gates

**Files:**
- Verify only; no additional production files.

**Interfaces:**
- Consumes: root `wrangler.jsonc`, built `dist`, all existing repository gates.
- Produces: fresh evidence that Wrangler no longer invokes Astro auto-configuration and that the full site remains valid.

- [ ] **Step 1: Build a fresh static output**

Run: `npm run build`

Expected: Astro build and `audit:build` both exit 0.

- [ ] **Step 2: Exercise the real Wrangler boundary without publishing**

Run: `npx wrangler deploy --dry-run`

Expected: exit 0, static assets are prepared from `dist`, and output contains neither `astro add cloudflare` nor dependency-install prompts.

- [ ] **Step 3: Run the content release audit**

Run: `npm run audit:content`

Expected: exit 0, score 100, and publishable status true.

- [ ] **Step 4: Run the complete verification pipeline**

Run: `npm run verify`

Expected: Worker tests, all content tests, Astro build, build audit, and Playwright end-to-end tests exit 0.

- [ ] **Step 5: Inspect the final change set**

Run: `git status --short --branch`, `git diff 4577ec2 --check`, and `git diff 4577ec2 --stat`.

Expected: only the design/plan, root deployment configuration, focused tests, and script wiring are changed; no article, Contact, inquiry Worker, or product file is modified.

### Task 4: Release and verify production

**Files:**
- Update after successful release: private TradeSite Vault operations note and project work log.

**Interfaces:**
- Consumes: authenticated GitHub push route, Cloudflare GitHub integration, the 20 article URL manifest.
- Produces: a successful production deployment plus a private evidence record.

- [ ] **Step 1: Push the verified current HEAD to `main`**

Run: `git push origin HEAD:main`

Expected: push succeeds. If it fails, stop immediately and retain all local commits.

- [ ] **Step 2: Monitor the GitHub/Cloudflare build**

Use the pushed commit SHA to poll GitHub check runs until `Workers Builds: tradesite-industrial` reaches a terminal state.

Expected: conclusion `success`. On failure, record the check URL and new build evidence, then stop without another fix attempt.

- [ ] **Step 3: Verify the production release**

Run the existing 20-URL release checker at `C:\Users\Administrator\check-arclift-release-online.mjs`.

Expected: all 20 URLs return HTTP 200, all 20 exact canonicals match, the sitemap index returns HTTP 200, and the child sitemap contains all 20 URLs.

- [ ] **Step 4: Record the outcome privately**

Create or update a dated note under `D:\TradeSite\knowledge\vault\03-Operations\` with the supplied log evidence, root cause, commit SHA, local verification totals, Cloudflare result, production URL/canonical/sitemap totals, and a clear statement that Search Console remains pending/manual. Update the TradeSite project work log if one exists, then refresh the Vault catalog.

- [ ] **Step 5: Report only verified results**

Include local test totals, pushed commit SHA, Cloudflare check conclusion, live URL/canonical/sitemap totals, and any remaining manual Search Console action. Do not claim deployment or indexing success without the corresponding evidence.
