// The 2026-11-01 URL task authorizes only this exact append to the frozen
// legacy redirects. Callers still hash every byte of the retained prefix.
const APPROVED_APPEND = '/blog/page /blog/ 301\n/blog/page/ /blog/ 301\n';

export function retainedRedirectBytes(bytes) {
  const source = bytes.toString('utf8').replace(/\r\n/g, '\n');
  if (!source.endsWith(APPROVED_APPEND)) {
    throw new Error('public/_redirects must end with the two exact approved blog-root 301 rules');
  }
  const retained = source.slice(0, -APPROVED_APPEND.length);
  if (!retained.endsWith('\n')) {
    throw new Error('The approved blog-root redirects must follow the complete legacy rules');
  }
  return Buffer.from(retained, 'utf8');
}
