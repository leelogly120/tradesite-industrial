import { auditBuildOutput } from './lib/build-output-audit.mjs';

try {
  const report = await auditBuildOutput();
  console.log([
    'Build output audit passed:',
    `${report.htmlFileCount} HTML files;`,
    `${report.indexableRouteCount} indexable routes;`,
    `${report.sitemapUrlCount} sitemap URLs;`,
    `${report.productRouteCount} product references;`,
    `${report.blogArticleRouteCount} blog articles;`,
    `${report.legacyRedirectCount} legacy redirects.`,
  ].join(' '));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
