import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

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
