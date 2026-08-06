import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { LAUNCH_SLUGS, auditArticle, auditFiles } from './audit-content.mjs';
import { LIFT_PLATFORM_ARTICLE_SLUGS } from './lift-platform-article-registry.mjs';

export { auditArticle, auditFiles };
export const EXTENDED_LAUNCH_SLUGS = Object.freeze([...new Set([...LAUNCH_SLUGS, ...LIFT_PLATFORM_ARTICLE_SLUGS])]);

function defaultPaths(root) {
  return [
    ...EXTENDED_LAUNCH_SLUGS.map((slug) => resolve(root, 'src', 'content', 'blog', `${slug}.md`)),
    resolve(root, 'public', 'images', 'asset-manifest.json'),
  ];
}

function isDirectExecution() {
  if (!process.argv[1]) return false;
  return import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
}

if (isDirectExecution()) {
  const explicitPaths = process.argv.slice(2).map((path) => resolve(path));
  const report = await auditFiles(explicitPaths.length ? explicitPaths : defaultPaths(process.cwd()));
  console.log(JSON.stringify(report, null, 2));
  if (report.fatal) process.exitCode = 1;
}

