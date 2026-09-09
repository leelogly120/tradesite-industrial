import { realpath } from 'node:fs/promises';
import { isAbsolute, relative, resolve } from 'node:path';
import sharp from 'sharp';

const metadataCache = new Map();

function attributes(tag) {
  const values = new Map();
  const expression = /([^\s=<>/"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of tag.slice(4, -1).replace(/\/$/, '').matchAll(expression)) {
    values.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? '');
  }
  return values;
}

async function localDimensions(src, publicDirectory) {
  const pathname = decodeURIComponent(src.split(/[?#]/, 1)[0]);
  if (pathname.includes('\\') || pathname.includes('\0')) throw new Error('Unsafe public image path');
  const imageRoot = await realpath(resolve(publicDirectory, 'images'));
  const candidate = resolve(publicDirectory, `.${pathname}`);
  const lexical = relative(imageRoot, candidate);
  if (lexical.startsWith('..') || isAbsolute(lexical)) throw new Error('Image outside public media');
  const actual = await realpath(candidate);
  const physical = relative(imageRoot, actual);
  if (physical.startsWith('..') || isAbsolute(physical)) throw new Error('Image outside public media');
  if (!metadataCache.has(actual)) metadataCache.set(actual, sharp(actual).metadata());
  const { width, height } = await metadataCache.get(actual);
  if (!(width > 0 && height > 0)) throw new Error(`No intrinsic dimensions for ${src}`);
  return { width, height };
}

/** Enrich generated local image tags only; never fetch media or rewrite editorial copy. */
export async function optimizeImageMarkup(html, { publicDirectory }) {
  const tags = [...html.matchAll(/<img\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi)];
  let result = '';
  let cursor = 0;
  for (const match of tags) {
    const tag = match[0];
    const attrs = attributes(tag);
    const src = attrs.get('src');
    let updated = tag;
    if (src?.startsWith('/images/')) {
      const { width, height } = await localDimensions(src, publicDirectory);
      const additions = [];
      const authoredWidth = Number(attrs.get('width'));
      const authoredHeight = Number(attrs.get('height'));
      if (!attrs.has('width')) additions.push(`width="${authoredHeight > 0 ? Math.round(authoredHeight * width / height) : width}"`);
      if (!attrs.has('height')) additions.push(`height="${authoredWidth > 0 ? Math.round(authoredWidth * height / width) : height}"`);
      if (!attrs.has('loading')) additions.push('loading="lazy"');
      if (!attrs.has('decoding')) additions.push('decoding="async"');
      if (additions.length) updated = tag.replace(/\s*\/?\s*>$/, ` ${additions.join(' ')}>`);
    }
    result += html.slice(cursor, match.index) + updated;
    cursor = match.index + tag.length;
  }
  return result + html.slice(cursor);
}
