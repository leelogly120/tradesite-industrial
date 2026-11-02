import { readFileSync } from 'node:fs';
const baseline = JSON.parse(readFileSync(new URL('../fixtures/november-01-production-remediation.json', import.meta.url), 'utf8'));
const remediated = new Map(baseline.articles.map(article => [article.slug, article]));
const revisions = JSON.parse(readFileSync(new URL('../fixtures/november-02-legacy-revisions.json', import.meta.url), 'utf8'));
const revised = new Map(revisions.articles.map(article => [article.slug, article]));

// Known production edits have their own exact hashes; historical fixture files
// remain unchanged, and all previously unpublished daily drafts retain their hashes.
const pendingRevisions = JSON.parse(readFileSync(new URL('../fixtures/november-02-pending-publication-revisions.json', import.meta.url), 'utf8'));
const pendingBySlug = new Map(pendingRevisions.articles.map(article => [article.slug, article]));
export function retainedArticleSha256(article) {
  const pending = pendingBySlug.get(article.slug);
  if (pending) {
    if (![pending.beforeSha256, pending.sha256].includes(article.sha256)) throw new Error('Unknown pending manuscript predecessor: ' + article.slug);
    return pending.sha256;
  }
  const revision = revised.get(article.slug);
  if (revision && article.sha256 === revision.sha256) return revision.sha256;
  const current = remediated.get(article.slug);
  if (current && article.sha256 !== current.beforeSha256 && article.sha256 !== current.sha256) {
    throw new Error('Unknown manuscript revision in retained fixture: ' + article.slug);
  }
  const retained = current?.sha256 ?? article.sha256;
  if (!revision) return retained;
  if (retained !== revision.beforeSha256) throw new Error('Unknown manuscript predecessor in retained fixture: ' + article.slug);
  return revision.sha256;
}

// Resolve only the four explicitly reviewed photo substitutions. Historical
// fixtures retain the old mapping; an unrecognized mapping must still fail.
export function retainedPhotoArticle(article) {
  const revision = revised.get(article.slug);
  if (!revision) return article;
  const equal = expected => article.slug === expected.slug
    && JSON.stringify(article.cover) === JSON.stringify(expected.cover)
    && JSON.stringify(article.body) === JSON.stringify(expected.body);
  if (!equal(revision.beforePhotos) && !equal(revision.photos)) {
    throw new Error('Unknown photo revision in retained fixture: ' + article.slug);
  }
  return revision.photos;
}
