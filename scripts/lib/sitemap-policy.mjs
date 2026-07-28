const NOINDEX_ROUTES = new Set(['/compare/']);

export function shouldIncludeInSitemap(page) {
  return !NOINDEX_ROUTES.has(new URL(page).pathname);
}
