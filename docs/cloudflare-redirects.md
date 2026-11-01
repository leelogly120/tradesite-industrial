# Cloudflare redirects for arclifteq.com

Canonical origin: `https://www.arclifteq.com`. Page paths end in `/`, including before query strings and fragments. Astro explicitly sets `trailingSlash: 'always'`. File assets and external API endpoints retain their own URL contracts.

`public/_redirects` keeps the four legacy product-slug 301s and exact `/blog/page` and `/blog/page/` redirects to `/blog/`. Host, scheme and general trailing-slash redirects remain Cloudflare edge rules. Preserve the existing rules; do not add broad path wildcards that affect `/_astro/*` or files.

Pagination pages remain accessible and self-canonical with `noindex,follow`. The sitemap excludes `/blog/page`, `/blog/page/` and every descendant, while normal articles such as `/blog/page-speed/` remain eligible. Do not request GSC indexing for pagination.

## Existing edge behavior to preserve

1. `http://arclifteq.com/*` → `https://www.arclifteq.com/$1` (301)
2. `https://arclifteq.com/*` → `https://www.arclifteq.com/$1` (301)
3. `http://www.arclifteq.com/*` → `https://www.arclifteq.com/$1` (301)

Preserve the path and query string. Do not redirect `https://www.arclifteq.com/` itself. Unrelated HTTP availability and missing-page remediation are outside this change.

## Production static deploy

Build the reviewed source and run applicable content, site and browser checks. Verify the active hosting target before delivery; keep account details and deployment receipts outside public repository documentation. Do not migrate domains or change edge rules during a URL-source correction. The repository's static Worker command is:

```bash
npx wrangler deploy
```

`wrangler.jsonc` publishes the Worker `tradesite-industrial` with `assets.directory` set to `./dist`. Do not run `astro add cloudflare`.

When Pages delivery is requested, use the checked static output and the authorized project and branch:

```bash
npx wrangler pages deploy dist --project-name <project> --branch <production-branch> --commit-hash <reviewed-commit>
```

Do not change Worker configuration, the separate inquiry service, DNS or edge rules for this task.

## Verify after deployment

```bash
curl -sI https://www.arclifteq.com/blog
curl -sI https://www.arclifteq.com/blog/
curl -sI https://www.arclifteq.com/blog/page/
```

Expect 301 to `https://www.arclifteq.com/blog/`, 200, and 301 to the blog root respectively. Check product and article paths, query preservation, static assets, every sitemap URL and all pagination robots directives. The sitemap index's `.xml` links are file URLs and do not receive a trailing slash. Astro's static setting alone is not proof of an HTTP 301; verify hosting responses.

## 中文

页面路径统一使用尾斜杠，分页保留访问能力但不进入 sitemap。上线前核对托管目标，账户信息和部署回执保留在非公开记录中；本任务不迁移域名，也不部署独立询盘服务。
