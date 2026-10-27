const NOINDEX_ROUTES = new Set(['/compare/']);

export function shouldIncludeInSitemap(page) {
  const pathname = new URL(page).pathname;
  if (NOINDEX_ROUTES.has(pathname)) return false;
  return !/^\/blog\/page\/\d+\/$/.test(pathname);
}
