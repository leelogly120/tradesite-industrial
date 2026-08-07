# ARCLIFT Cloudflare Static Deployment Design

**Date:** 2026-08-07

## Goal

Restore the existing GitHub-to-Cloudflare production pipeline for the ARCLIFT Astro site without changing site content, inquiry handling, product data, or the separate inquiry Worker.

## Confirmed root cause

The supplied Cloudflare build log shows that dependency installation, `npm run build`, Astro static generation, and `npm run audit:build` all completed successfully. The failure begins only when the configured deploy command runs `npx wrangler deploy`.

Because the repository has no root Wrangler configuration for the static site, Wrangler enters framework auto-configuration, runs `astro add cloudflare`, and attempts to install `@astrojs/cloudflare` plus a newer Wrangler version during the production deployment. That runtime dependency installation exits with code 1, so no new Cloudflare version is created.

## Selected design

Add one root `wrangler.jsonc` that names the existing Worker and declares `./dist` as its static-assets directory:

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

The project remains an Astro static build. No Cloudflare Astro adapter, Worker entry point, assets binding, SPA fallback, or new runtime dependency is required. The existing Cloudflare deploy command remains `npx wrangler deploy`; Wrangler reads the committed configuration and uploads the already-built `dist` directory directly.

## Scope boundaries

- Do not edit or remove any published article or route.
- Do not change Contact styling, inquiry behavior, the inquiry Worker, or product parameters.
- Do not alter the Astro output mode or add `@astrojs/cloudflare`.
- Do not change Cloudflare dashboard settings unless the committed configuration fails its documented contract.
- Do not perform Search Console work; the operator handles it manually.
- Do not shut down the computer.

## Regression protection

Add a focused test that parses the root Wrangler configuration and verifies the observable deploy contract: the production Worker name is `tradesite-industrial` and the static asset directory is `./dist`. Wire the test into `npm run test:content`, which is already part of `npm run verify`.

Use the required red-green sequence:

1. Add and run the focused test while the root configuration is absent; it must fail for the missing deployment contract.
2. Add the minimal configuration above; the focused test must pass.
3. Build the site and run `npx wrangler deploy --dry-run`; the command must complete without launching `astro add cloudflare` or installing dependencies.
4. Run `npm run audit:content` and `npm run verify` in full.

## Release and production verification

After all local checks pass, commit the deployment fix and push the current HEAD to `main`. Monitor the GitHub/Cloudflare build result. A successful release must then satisfy all of the following:

- Cloudflare reports a successful production deployment for the pushed commit.
- Each of the 20 new article URLs returns HTTP 200.
- Each article emits its exact self-referencing canonical URL.
- `https://www.arclifteq.com/sitemap-index.xml` returns HTTP 200.
- The child sitemap contains all 20 article URLs.

If the push fails, stop. If the Cloudflare build fails after this single fix, do not stack speculative changes; preserve the local commit, record the new evidence, and return to root-cause analysis.

## Rollback

The change is isolated to one root configuration file, one focused test, and test-script wiring. If it causes an unexpected deployment regression, revert only the deployment-fix commit. Existing content commits and published routes remain intact.
