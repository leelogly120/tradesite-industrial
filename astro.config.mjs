import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { shouldIncludeInSitemap } from './scripts/lib/sitemap-policy.mjs';
import { readdirSync, readFileSync } from 'node:fs';
import { articleUpdatedDate, applyArticleLastmod } from './scripts/lib/article-updated-dates.mjs';

const blogDirectory = new URL('./src/content/blog/', import.meta.url);
const articleUpdates = new Map(readdirSync(blogDirectory).filter(name => name.endsWith('.md')).flatMap(name => {
  const updated = articleUpdatedDate(readFileSync(new URL(name, blogDirectory), 'utf8'));
  return updated ? [[`/blog/${name.slice(0, -3)}/`, updated]] : [];
}));

export default defineConfig({
  site: 'https://www.arclifteq.com',
  redirects: {
    '/products/fddpt-20m-crawler-ceiling-platform/': '/products/arc-f20-crawler-ceiling-platform/',
    '/products/fddpt-25m-crawler-ceiling-platform/': '/products/arc-f25-crawler-ceiling-platform/',
    '/products/fddpt-31m-crawler-ceiling-platform/': '/products/arc-f31-crawler-ceiling-platform/',
    '/products/fddpt-35m-crawler-ceiling-platform/': '/products/arc-f35-crawler-ceiling-platform/',
  },
  integrations: [
    sitemap({
      filter: shouldIncludeInSitemap,
      serialize: item => applyArticleLastmod(item, articleUpdates),
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', zh: 'zh-CN' },
      },
    }),
    mdx(),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
});
