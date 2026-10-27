# Cloudflare redirects for arclifteq.com

These host and scheme redirects are **not applied by this repository**. `public/_redirects` only keeps the four legacy product-slug 301s. Apex-to-www and HTTP-to-HTTPS belong in the Cloudflare dashboard (Bulk Redirects or Redirect Rules) for the zone that serves `arclifteq.com`.

## Rules to add in the dashboard

1. `http://arclifteq.com/*` → `https://www.arclifteq.com/$1` (301)
2. `https://arclifteq.com/*` → `https://www.arclifteq.com/$1` (301)
3. `http://www.arclifteq.com/*` → `https://www.arclifteq.com/$1` (301)

Preserve the path and query string. Do not redirect `https://www.arclifteq.com/` itself.

## Production static deploy

From a clean `dist/` (after `npm run build`):

```bash
npx wrangler deploy
```

`wrangler.jsonc` publishes the Worker `tradesite-industrial` with `assets.directory` set to `./dist`. Do not run `astro add cloudflare`.

## Verify after the dashboard rules exist

```bash
curl -sI http://arclifteq.com/ | head -n 20
curl -sI https://arclifteq.com/ | head -n 20
curl -sI http://www.arclifteq.com/ | head -n 20
curl -sI https://www.arclifteq.com/ | head -n 20
```

Expect 301 to `https://www.arclifteq.com/` for the first three, and 200 for the www HTTPS URL.

## 中文

本仓库没有写入域名跳转。`public/_redirects` 只保留四条旧产品路径 301。`arclifteq.com` → `www`，以及 `http` → `https`，需要在 Cloudflare 控制台为该域名单独配置 301。静态站上线命令是构建完成后执行 `npx wrangler deploy`（Worker 名称 `tradesite-industrial`）。
