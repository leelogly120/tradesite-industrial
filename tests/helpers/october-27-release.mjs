import { buyerPhotoUrlsForDate, manifestBeforeBuyerDate } from './buyer-photo-cohorts.mjs';

export const NEW_PHOTO_URLS = buyerPhotoUrlsForDate('2026-10-27');

export function precedingReleaseBytes(path, bytes) {
  if (path !== 'public/images/asset-manifest.json') return bytes;
  const manifest = manifestBeforeBuyerDate(JSON.parse(bytes.toString('utf8')), '2026-10-27');
  return Buffer.from(JSON.stringify(manifest, null, 2) + '\n');
}
