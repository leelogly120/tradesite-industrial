import { REVIEWED_BUYER_UPDATES } from '../reviewed-buyer-updates.mjs';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { parseFragment } from 'parse5';

const root = fileURLToPath(new URL('../../', import.meta.url));
const wordCount = text => (text.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g) ?? []).length;
const disclaimer = /does not establish|cannot prove|reference only|does not verify|not evidence|supplies no|contains no|does not prescribe|does not select|does not interpret/i;
const visible = text => text.replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\s*\1\s*$/gm, '');

function sections(body) {
  const matches = [...body.matchAll(/^(#{2,3})\s+(.+)$/gm)];
  return matches.map((match, index) => {
    const end = matches.slice(index + 1).find(next => next[1].length <= match[1].length)?.index ?? body.length;
    return { title: match[2], body: body.slice(match.index + match[0].length, end) };
  });
}

function isRealPhoto(url) {
  if (!/^\/images\/[a-zA-Z0-9/_-]+\.(?:webp|png|jpe?g)$/.test(url ?? '')) return false;
  const path = resolve(root, 'public', url.slice(1));
  if (!path.startsWith(resolve(root, 'public', 'images') + sep) || !existsSync(path)) return false;
  const manifest = JSON.parse(readFileSync(resolve(root, 'public/images/asset-manifest.json'), 'utf8'));
  return (manifest.referencePhotos ?? []).some(photo => photo.url === url && photo.medium === 'reference-photograph');
}

function publicCopy(value) {
  const markdown = String(value ?? '').replace(/!?\[([^\]]*)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '');
  const text = node => node.nodeName === '#text' ? node.value
    : (node.childNodes ?? []).map(text).join('') + (/^(?:p|div|li|td|th|br|h[1-6])$/.test(node.tagName ?? '') ? '\n\n' : '');
  return text(parseFragment(markdown));
}

function clarityFailures(content, frontmatter) {
  // Inspect written metadata, captions and visible copy, including code examples.
  // HTML parsing decodes entities and omits comments; Markdown link targets are not copy.
  const copy = [content, frontmatter.title, frontmatter.description, frontmatter.coverAlt, frontmatter.coverCaption, frontmatter.author, ...(Array.isArray(frontmatter.tags) ? frontmatter.tags : [])].map(publicCopy).join('\n');
  const failures = [];
  if (/\b(?:waiting\s+for\s+verification|pending\s+verification|to\s+be\s+verified|TBD)\b|待核实|等待验证/i.test(copy)) failures.push('buyer-verification-placeholder');
  const fragments = copy.split(/(?:\|+|\r?\n\s*\r?\n|\r?\n(?=\s*(?:[-+]|\d+[.)])\s)|[.!?;:]+(?:\s+|$))/).map(fragment => fragment.replace(/\s+/g, ' ').trim()
    .replace(/^(?:[-+]|\d+[.)])\s+/, '').replace(/^[>#\s"'“”]+|[\s"'“”]+$/g, ''));
  if (fragments.some(fragment => /^(?:confirm\s+on\s+(?:the\s+)?RFQ|ask\s+the\s+supplier)$/i.test(fragment))) failures.push('buyer-empty-confirmation');
  return failures;
}

// Mechanical checks support editorial review; they do not score originality or engineering suitability.
export function buyerArticleFailures(markdown, expectedDate, registeredSlug) {
  const failures = new Set();
  let fm, content;
  try { ({ frontmatter: fm, content } = parseFrontmatter(markdown)); }
  catch { return ['missing-buyer-metadata']; }
  const body = visible(content);
  // expectedDate comes from the registered cohort, never manuscript frontmatter.
  // New buyer cohorts inherit this policy; earlier reviewed manuscripts retain their contract.
  const expectedUpdatedDate = REVIEWED_BUYER_UPDATES.find(article => article.slug === registeredSlug && article.date === expectedDate)?.updated ?? expectedDate;
  if (expectedUpdatedDate >= '2026-10-29') clarityFailures(content, fm).forEach(failure => failures.add(failure));
  const date = value => { const parsed = new Date(value); return Number.isFinite(parsed.getTime()) ? parsed.toISOString().slice(0, 10) : ''; };
  if (typeof fm.title !== 'string' || fm.title.length < 20 || typeof fm.description !== 'string' || fm.description.length < 50 || fm.description.length > 160
    || !expectedDate || date(fm.date) !== expectedDate || date(fm.updated) !== expectedUpdatedDate || fm.author !== 'ARCLIFT Technical Editorial' || fm.draft !== false
    || !Array.isArray(fm.tags) || fm.tags.length < 3 || fm.tags.length > 5 || fm.tags.some(tag => typeof tag !== 'string' || tag.trim().length < 2)) failures.add('missing-buyer-metadata');

  const first = body.split(/\r?\n\s*\r?\n/).map(text => text.replace(/^#\s+.*$/m, '').trim()).find(Boolean) ?? '';
  if (wordCount(first) < 25 || !/\b(?:choose|use|shortlist|prefer|start|buy|keep|select|order|rent|route|recommend|default|reserve)\b/i.test(first)
    || !/\b(?:if|when|for|unless|before)\b/i.test(first)) failures.add('missing-buyer-opening');

  const images = [...body.matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)];
  // This cohort is Markdown: raw image components must not bypass its photo checks.
  if (/<(?:img|image|picture|svg)\b/i.test(body)) failures.add('invalid-buyer-photo-markup');
  if ([...body.matchAll(/!\[[^\]]*\]/g)].length !== images.length) failures.add('invalid-buyer-photo-markup');
  if (images.length < 2 || images.length > 4) failures.add('invalid-buyer-photo-count');
  if (!isRealPhoto(fm.coverImage) || images.some(image => !isRealPhoto(image[2]))) failures.add('invalid-buyer-photo');
  const descriptions = [{ alt: fm.coverAlt, caption: fm.coverCaption }];
  for (const image of images) {
    const after = body.slice(image.index + image[0].length);
    const caption = after.match(/^\s*\r?\n\s*\*([^*\r\n]+)\*/)?.[1];
    descriptions.push({ alt: image[1], caption });
  }
  if (descriptions.some(({ alt, caption }) => typeof alt !== 'string' || alt.length < 20 || wordCount(alt) < 4
    || typeof caption !== 'string' || caption.length < 20 || wordCount(caption) < 4)) failures.add('invalid-buyer-photo-caption');
  if (descriptions.some(({ caption }) => disclaimer.test(caption ?? '')) || (body.match(new RegExp(disclaimer.source, 'gi')) ?? []).length > 1) failures.add('buyer-disclaimer-spam');

  const tables = body.match(/(?:^\|[^\n]+\|\s*\r?\n){3,}/gm) ?? [];
  if (!tables.some(table => /^\|\s*:?-{3,}/m.test(table) && table.trim().split(/\r?\n/).length >= 5
    && table.trim().split(/\r?\n/)[0].split('|').length >= 5
    && /measure|confirm|scope|include|exclude|record|buyer|site|supplier|input|cost|quantity|length|dimension|duty|schedule/i.test(table))) failures.add('missing-buyer-table');

  const parts = sections(body);
  const failureSections = parts.filter(section => /fail|mistake|avoid|go(?:es)? wrong|trap|reject|stop|walk away/i.test(section.title));
  const cases = failureSections.flatMap(section => section.body.split(/\r?\n\s*\r?\n/).filter(paragraph => wordCount(paragraph) >= 15 && !/^\s*!|^\s*\|/.test(paragraph)));
  const labeledCases = body.split(/\r?\n\s*\r?\n/).filter(paragraph => /^\s*(?:\*\*|#{2,4}\s+)(?:Failure|Mistake)\b/i.test(paragraph) && wordCount(paragraph) >= 15);
  if (new Set([...cases, ...labeledCases].map(paragraph => paragraph.trim())).size < 2) failures.add('missing-buyer-failure-modes');
  const rfq = parts.filter(section => /rfq|attachment|quotation|request.*quote|send.*brief/i.test(section.title)).map(section => section.body);
  // A clearly introduced attachment list is equally useful inside a section
  // with a topic-specific title; do not impose identical RFQ headings.
  const blocks = body.split(/\r?\n\s*\r?\n/);
  for (let index = 0; index < blocks.length - 1; index++) {
    if (!/\b(?:rfq|quotation|quote)\b[^\n]*:\s*$/i.test(blocks[index])) continue;
    const listBlocks = [];
    for (let next = index + 1; next < blocks.length && /^\s*(?:[-*]|\d+[.)])\s+\S/.test(blocks[next]); next++) listBlocks.push(blocks[next]);
    if (listBlocks.length) rfq.push(listBlocks.join('\n'));
  }
  const validRfq = rfq.some(block => {
    const items = block.split(/\r?\n/).filter(line => /^\s*(?:[-*]|\d+[.)])\s+\S/.test(line));
    return items.length >= 6 && items.length <= 10 && items.every(item => wordCount(item) >= 4) && new Set(items.map(item => item.replace(/^\s*(?:[-*]|\d+[.)])\s+/, '').toLowerCase())).size === items.length;
  });
  if (!validRfq) failures.add('missing-buyer-rfq');

  const productLinks = [...new Set([...body.matchAll(/\]\((\/products\/[^)\s?#]+\/)(?:[?#][^)]*)?\)/g)].map(match => match[1]))];
  if (productLinks.length < 1 || productLinks.length > 3 || productLinks.some(url => !/^\/products\/[a-z0-9-]+\/$/.test(url)
    || !existsSync(resolve(root, 'src/content/products', url.split('/')[2] + '.md')))) failures.add('missing-buyer-shortlist');
  if (!/\]\(\/contact\/(?:\?[^)]*)?\)/.test(body) || !/https:\/\/wa\.me\/8615515922444(?:[?)\s]|$)/.test(body)
    || !body.includes('leelogly120@gmail.com')) failures.add('missing-buyer-contact');
  if (/\b(?:Archived Reference|Reference Concept)\b/i.test(body)) failures.add('buyer-archived-product-posture');
  const publicText = [body, fm.title, fm.description, fm.coverAlt, fm.coverCaption, fm.author, ...(Array.isArray(fm.tags) ? fm.tags : [])].join('\n');
  if (/\b\d+(?:[.,]\d+)?\s*(?:kg|kilograms?|tonnes?|tons?|t)\b/i.test(publicText)) failures.add('buyer-unsupported-load-claim');
  return [...failures];
}
