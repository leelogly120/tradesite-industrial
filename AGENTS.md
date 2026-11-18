## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Cursor Cloud specific instructions

- Node.js 22.12 or newer is required (`engines` in `package.json`). Install with `npm ci`. `npm run test:e2e` needs Playwright Chromium: `npx playwright install chromium`. The default Cloud Agent image already has Chromium’s shared libraries.
- Environment start serves the site at `http://127.0.0.1:4321` via `npx astro dev --host 0.0.0.0 --port 4321`. When that URL already responds, leave the existing server running. For a server you launch yourself, use `astro dev --background`, then `astro dev status`, `astro dev logs`, and `astro dev stop`.
- Repository checks are `npm run test:worker`, `npm run build` (static build, image optimization, and `audit:build`), `npm run test:site`, `npm run test:content`, and `npm run test:e2e`. `npm run verify` runs all of them. `npm run test:e2e` builds its own preview on port 4322.
- `npm run test:content` fails two pinned SHA-256 checks of `public/_headers` in `tests/new-articles-20261024-campaign-day1.test.mjs` and `tests/new-articles-20261025-campaign-day2.test.mjs`. The rest of that suite passes. Those hashes are already out of date in the committed tree.
- The static site, Vitest suites, and contact-form client validation run without secrets. `npm run worker:dev` needs the Cloudflare secrets `FORMSPREE_ENDPOINT` and `DINGTALK_WEBHOOK_URL`. Leave the production inquiry endpoint unused during local checks; empty-form validation stays in the browser.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
