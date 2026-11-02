import { readFileSync } from 'node:fs';

export const fourArticleRelease = JSON.parse(readFileSync(new URL('../fixtures/november-02-four-article-release.json', import.meta.url), 'utf8'));
const revisions = new Map(fourArticleRelease.articles.map(article => [article.slug, article]));
const additions = new Map(fourArticleRelease.addedPhotos.map(photo => [photo.record.url, photo.record]));

export function retainedPhotoArticle(article) {
  const revision = revisions.get(article.slug);
  if (!revision) return article;
  if (![revision.beforePhotos, revision.photos].some(expected => JSON.stringify(expected) === JSON.stringify(article))) {
    throw new Error('Unknown photograph revision: ' + article.slug);
  }
  return revision.photos;
}

// Remove only the eight independently pinned additions before comparing an
// earlier manifest's bytes. Every original field and photo must still match.
export function precedingManifestBytes(bytes) {
  const manifest = JSON.parse(bytes.toString('utf8'));
  const added = manifest.referencePhotos.filter(photo => additions.has(photo.url));
  if (added.length !== additions.size || new Set(added.map(photo => photo.url)).size !== additions.size) {
    throw new Error('Expected exactly eight reviewed photograph additions');
  }
  for (const photo of added) {
    if (JSON.stringify(photo) !== JSON.stringify(additions.get(photo.url))) {
      throw new Error('Unknown photograph metadata revision: ' + photo.url);
    }
  }
  manifest.referencePhotos = manifest.referencePhotos.filter(photo => !additions.has(photo.url));
  return Buffer.from(JSON.stringify(manifest, null, 2) + '\n');
}
