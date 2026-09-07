// Only an explicit editorial update date is evidence of a body refresh.
export function articleUpdatedDate(markdown) {
  const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  const value = frontmatter?.match(/^updated:\s*['"]?(\d{4}-\d{2}-\d{2})['"]?\s*$/m)?.[1];
  if (!value) return undefined;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value ? value : undefined;
}

export function applyArticleLastmod(item, updatedByPath) {
  const updated = updatedByPath.get(new URL(item.url).pathname);
  return updated ? { ...item, lastmod: updated } : item;
}
