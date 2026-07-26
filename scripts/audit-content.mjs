import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const LAUNCH_SLUGS = [
  'roof-level-roll-forming-long-panels',
  'crawler-vs-truck-mounted-roll-forming-system',
  '40hq-shipping-truck-mounted-roll-forming-lift',
  'roll-forming-line-specification-long-span-roof-panels',
  'crawler-ceiling-wall-panel-platform-project-data',
  'crawler-under-ceiling-platform-buyers-guide',
  'crawler-platform-vs-spider-lift-vs-scaffolding',
  'indoor-aerial-platform-ground-pressure-guide',
  'remote-control-aerial-platform-safety-planning',
  'dual-power-crawler-platform-selection',
  'warehouse-ceiling-access-platform-planning',
];

const PUBLISH_THRESHOLD = 95;
const CATEGORY_DEFINITIONS = [
  { key: 'buyerIntent', code: 'missing-buyer-intent', max: 25 },
  { key: 'conditions', code: 'missing-conditions', max: 20 },
  { key: 'evidenceTradeoffs', code: 'missing-evidence-tradeoffs', max: 15 },
  { key: 'limitationsNotFit', code: 'missing-limitations-not-fit', max: 15 },
  { key: 'projectChecklist', code: 'missing-project-checklist', max: 10 },
  { key: 'ctaEditorialNote', code: 'missing-cta-editorial-note', max: 10 },
  { key: 'visualQuality', code: 'missing-visual-quality', max: 5 },
];
const FATAL_DEDUCTION_POINTS = {
  'public-local-path': 25,
  'public-provenance-key': 25,
  'public-provenance-value': 20,
  'invalid-json': 25,
  'empty-audit': 25,
  'prohibited-identity-language': 20,
  'banned-ai-language': 10,
  'mechanical-rubric-headings': 15,
  'editorial-image-evidence-claim': 20,
  'missing-evidence-images': 20,
  'insufficient-article-images': 15,
  'too-many-article-images': 15,
  'unsupported-high-risk-claim': 10,
  'unreadable-file': 25,
  ...Object.fromEntries(CATEGORY_DEFINITIONS.map(({ code, max }) => [code, max])),
};

const PATH_PATTERNS = [
  /\b[a-z]:[\\/]/i,
  /(?:^|[\s"'(:=])[\\/]{1,2}Users[\\/]/i,
  /(?:^|[\s"'(:=])[\\/]home[\\/]/i,
  /file:\/\//i,
  /\u4e3e\u5347\u673a\u68b0|\u4e3e\u5347\u673a|\u6e90\u6587\u4ef6|\u6765\u6e90\u6839\u76ee\u5f55|\u6d93\u60e0\u5d4c/i,
];
const BANNED_AI_PATTERNS = [
  /\bin today's fast-paced world\b/i,
  /\bwhen it comes to\b/i,
  /\bin the ever-evolving landscape\b/i,
  /\brevolutionary\b/i,
  /\bgame-changing\b/i,
  /\bbest-in-class\b/i,
  /\bunmatched\b/i,
  /\bultimate\b/i,
];
const IDENTITY_PATTERNS = [
  /\bour factory\b/i,
  /\bfactory[- ]direct\b/i,
  /\bfactory price\b/i,
  /\b(?:arclift|we|our company)\b.{0,40}\bsource\s+factory\b/i,
  /\b(?:arclift|we)\s+(?:owns?|operates?|runs?)\s+(?:an?\s+|the\s+|its\s+|our\s+)?factory\b/i,
  /\bour production line\b/i,
  /\bmanufactured by arclift\b/i,
  /\barclift\s+manufactures?\b/i,
  /\barclift\s+is\s+(?:an?\s+|the\s+)?(?:equipment\s+|oem\s+)?manufacturer\b/i,
  /\barclift\s+(?:(?:designs?|engineers?)(?:,?\s*(?:and|&)\s+|,?\s+)?)+manufactures?\b/i,
  /\barclift[-\s]manufactured\b/i,
  /\bwe\s+manufacture\b/i,
  /\b(?:arclift|we)\s+(?:owns?|operates?|runs?)\s+(?:an?\s+|the\s+|its\s+|our\s+)?(?:manufacturing|production)\s+(?:plant|facility|site)\b/i,
];
const HIGH_RISK_PATTERNS = [
  /(?:\b(?:USD|EUR)\s*\d[\d,]*(?:\.\d+)?|\b\d[\d,]*(?:\.\d+)?\s*(?:USD|EUR)\b|(?:US\$|\u20ac|\$)\s?\d[\d,]*(?:\.\d+)?)/i,
  /\b(?:CE|ISO(?:\s*\d+)?|UL|CSA)\s+(?:certified|certification|approved|compliant)\b/i,
  /\b(?:complies?\s+with|compliance\s+with)\s+(?:EN|ISO|CE|UL|CSA)\b/i,
  /\bpatent(?:ed|\s+pending|\s+protection)?\b/i,
  /\b(?:in stock|available from stock)\b/i,
  /\b(?:production\s+)?capacity\b/i,
  /\b(?:delivery|lead(?:\s|-)?time|shipping|ships?)[^.\n]{0,60}?\b(?:in|within)\s+(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty[- ]four)\s+(?:hours?|days?|weeks?|months?)\b/i,
  /\b\d+(?:\.\d+)?%\s+(?:savings?|faster|improvement|increase|reduction|more productive|less)\b/i,
  /\b\d+(?:\.\d+)?\s+percent\s+(?:labor\s+)?(?:savings?|reduction|improvement)\b/i,
  /\b(?:reduces?|cuts?|lowers?)\s+(?:labor|costs?|time)\s+by\s+\d+(?:\.\d+)?(?:%|\s+percent)/i,
  /\b(?:guarantee|guaranteed|guarantees)\b/i,
];
const PROVENANCE_VALUE_PATTERN = /\b(?:original\s+(?:source|file(?:name)?|image)|source\s+(?:path|file|archive))\b/i;
const AUDIT_SECTION_HEADINGS = {
  'buyer-intent': 'Buyer Intent',
  conditions: 'Conditions',
  'evidence-tradeoffs': 'Evidence and Trade-offs',
  'limitations-not-fit': 'Limitations and Not Fit',
  'project-checklist': 'Project Checklist',
  'cta-editorial-note': 'CTA and Editorial Note',
};
const MECHANICAL_RUBRIC_HEADINGS = Object.values(AUDIT_SECTION_HEADINGS);
const EDITORIAL_IMAGE_EVIDENCE_PATTERNS = [
  /\bvisual evidence\b/i,
  /\bimages?\s+(?:provide|offer)\s+evidence\b/i,
  /\bthis is evidence of\b/i,
];

function createReport(fatalFailures = [], extra = {}) {
  const failures = [...new Set(fatalFailures)];
  const deductions = failures.map((code) => ({ code, points: FATAL_DEDUCTION_POINTS[code] ?? 10 }));
  const score = Math.max(0, 100 - deductions.reduce((total, deduction) => total + deduction.points, 0));
  const fatal = failures.length > 0;

  return { fatal, failures, deductions, score, publishable: !fatal && score >= PUBLISH_THRESHOLD, ...extra };
}

function stripBom(markdown) {
  return markdown.replace(/^\uFEFF/, '');
}

function frontmatter(markdown) {
  return markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? '';
}

function frontmatterValue(markdown, key) {
  const match = frontmatter(markdown).match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'mi'));
  if (!match) return null;
  const value = match[1].trim();
  return value.replace(/^['"]|['"]$/g, '');
}

function stripHtmlComments(markdown) {
  return markdown.replace(/<!--[\s\S]*?-->/g, '');
}

function stripFencedCodeBlocks(markdown) {
  let fenced = false;
  return markdown.split(/\r?\n/).filter((line) => {
    if (/^\s*```/.test(line)) {
      fenced = !fenced;
      return false;
    }
    return !fenced;
  }).join('\n');
}

function normalizePublicUrl(url) {
  return url.split(/[?#]/, 1)[0];
}

function visibleImageReferences(markdown) {
  const visibleMarkdown = stripFencedCodeBlocks(stripHtmlComments(markdown));
  return [...visibleMarkdown.matchAll(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+['"][^)]*['"])?\)/g)]
    .map((match) => ({ alt: match[1].trim(), url: match[2] }))
    .filter((image) => image.url.startsWith('/images/'));
}

function publicImages(markdown) {
  const references = visibleImageReferences(markdown);
  const coverImage = frontmatterValue(markdown, 'coverImage');
  const urls = new Set();

  if (coverImage?.startsWith('/images/')) urls.add(normalizePublicUrl(coverImage));
  references.forEach((image) => urls.add(normalizePublicUrl(image.url)));
  return { urls, references };
}

function removeSupplierNegations(text) {
  return text
    .replace(/\barclift\s+is\s+not\s+(?:an?\s+|the\s+)?(?:source\s+)?factory\s+or\s+manufacturer\b/gi, '')
    .replace(/\barclift\s+is\s+not\s+(?:an?\s+)?manufacturer\s+or\s+(?:the\s+)?source\s+factory\b/gi, '')
    .replace(/\barclift\s+is\s+not\s+(?:an?\s+|the\s+)?(?:equipment\s+|oem\s+)?(?:factory|manufacturer)\b/gi, '')
    .replace(/\barclift\s+does\s+not\s+(?:own|operate)(?:\s+or\s+(?:own|operate))?\s+(?:the\s+)?source\s+factory\b/gi, '')
    .replace(/\barclift\s+is\s+(?:an?\s+)?(?:integrated\s+equipment\s+)?supplier,?\s+not\s+(?:an?\s+)?factory\s+or\s+manufacturer\b/gi, '');
}

function textFailures(markdown) {
  const failures = new Set();
  const identityText = removeSupplierNegations(markdown);

  if (PATH_PATTERNS.some((pattern) => pattern.test(markdown))) failures.add('public-local-path');
  if (IDENTITY_PATTERNS.some((pattern) => pattern.test(identityText))) failures.add('prohibited-identity-language');
  if (BANNED_AI_PATTERNS.some((pattern) => pattern.test(markdown))) failures.add('banned-ai-language');
  if (HIGH_RISK_PATTERNS.some((pattern) => pattern.test(markdown))) failures.add('unsupported-high-risk-claim');
  return failures;
}

function wordCount(text) {
  return (text.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g) ?? []).length;
}

function sectionBody(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => line.trim().toLowerCase() === `## ${heading}`.toLowerCase());
  if (headingIndex === -1) return '';
  const body = [];
  for (let index = headingIndex + 1; index < lines.length && !lines[index].startsWith('## '); index += 1) body.push(lines[index]);
  return body.join('\n').trim();
}

function auditSectionBody(markdown, marker) {
  const markerPattern = new RegExp(`<!--\\s*audit-section:\\s*${marker}\\s*-->`, 'i');
  const markerMatch = markerPattern.exec(markdown);
  if (!markerMatch) return null;

  const start = markerMatch.index + markerMatch[0].length;
  const remainder = markdown.slice(start);
  const nextMarkerIndex = remainder.search(/<!--\s*audit-section:\s*[a-z-]+\s*-->/i);
  const section = nextMarkerIndex === -1 ? remainder : remainder.slice(0, nextMarkerIndex);
  return stripFencedCodeBlocks(stripHtmlComments(section)).trim();
}

function scoredSection(markdown, marker) {
  const marked = auditSectionBody(markdown, marker);
  if (marked !== null) return marked;
  return stripHtmlComments(sectionBody(markdown, AUDIT_SECTION_HEADINGS[marker]));
}

function openingParagraph(markdown) {
  const withoutFrontmatter = stripHtmlComments(markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, ''));
  const beforeFirstSection = withoutFrontmatter.split(/^##\s+/m)[0];
  return beforeFirstSection
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.replace(/^#\s+.*$/m, '').trim())
    .find((paragraph) => paragraph.length > 0) ?? '';
}

function hasMechanicalRubricHeadings(markdown) {
  const visibleMarkdown = stripFencedCodeBlocks(stripHtmlComments(markdown));
  const publicHeadings = visibleMarkdown
    .split(/\r?\n/)
    .map((line) => line.match(/^##\s+(.+?)\s*$/)?.[1]?.trim().toLowerCase())
    .filter(Boolean);
  const rubricCount = MECHANICAL_RUBRIC_HEADINGS
    .filter((heading) => publicHeadings.includes(heading.toLowerCase()))
    .length;
  return rubricCount >= 5;
}

function hasEditorialImageEvidenceClaim(markdown) {
  const visibleMarkdown = stripFencedCodeBlocks(stripHtmlComments(markdown));
  const imagePattern = /!\[[^\]]*\]\([^)]+\)/g;
  for (const match of visibleMarkdown.matchAll(imagePattern)) {
    const start = Math.max(0, match.index - 220);
    const end = Math.min(visibleMarkdown.length, match.index + match[0].length + 520);
    const nearbyText = visibleMarkdown.slice(start, end);
    if (EDITORIAL_IMAGE_EVIDENCE_PATTERNS.some((pattern) => pattern.test(nearbyText))) return true;
  }
  return false;
}

function evaluateCategories(markdown, images) {
  const buyerIntent = scoredSection(markdown, 'buyer-intent');
  const conditions = scoredSection(markdown, 'conditions');
  const evidence = scoredSection(markdown, 'evidence-tradeoffs');
  const limitations = scoredSection(markdown, 'limitations-not-fit');
  const checklist = scoredSection(markdown, 'project-checklist');
  const ctaNote = scoredSection(markdown, 'cta-editorial-note');
  const opening = openingParagraph(markdown);
  const checklistItems = checklist.split(/\r?\n/).filter((line) => /^\s*[-*]\s+\S/.test(line)).map((line) => line.replace(/^\s*[-*]\s+/, '').trim());
  const checklistCategories = [
    /\b(?:height|outreach)\b/i, /\b(?:slope|roof|geometry)\b/i, /\b(?:profile|material|thickness|length|coil|feed)\b/i,
    /\bwind\b/i, /\b(?:ground|floor)\b/i, /\b(?:access|route)\b/i, /\boutrigger\b/i, /\bdestination\b/i,
    /\b(?:chassis|transport)\b/i, /\bcontainer\b/i, /\b(?:voltage|power|control)\b/i, /\b(?:compliance|documentation|requirement)\b/i,
  ];
  const checklistCategoryCount = checklistCategories.filter((pattern) => checklistItems.some((item) => pattern.test(item))).length;
  const substantiveChecklist = checklistItems.length >= 6 && checklistItems.every((item) => wordCount(item) >= 4 || item.length >= 18) && checklistCategoryCount >= 6;
  const projectSignals = ['height', 'site', 'destination', 'transport', 'zone', 'floor'].filter((word) => new RegExp(`\\b${word}\\b`, 'i').test(ctaNote)).length;

  const passed = {
    buyerIntent: wordCount(opening) >= 20 && wordCount(buyerIntent) >= 25,
    conditions: wordCount(conditions) >= 20,
    evidenceTradeoffs: wordCount(evidence) >= 35 && /\btrade[- ]off\b|\blimitation|\bconstraint|\binterface/i.test(evidence),
    limitationsNotFit: wordCount(limitations) >= 25 && /\b(?:may )?not fit\b/i.test(limitations),
    projectChecklist: substantiveChecklist,
    ctaEditorialNote: wordCount(ctaNote) >= 50
      && projectSignals >= 3
      && /\b(?:final|signed|project-specific)\b/i.test(ctaNote)
      && /\b(?:editorial|visual|image)\b/i.test(ctaNote),
    visualQuality: images.urls.size >= 3 && images.urls.size <= 5 && images.references.every((image) => wordCount(image.alt) >= 2),
  };

  const categories = {};
  const missing = [];
  for (const { key, code, max } of CATEGORY_DEFINITIONS) {
    categories[key] = { score: passed[key] ? max : 0, max, passed: passed[key] };
    if (!passed[key]) missing.push(code);
  }
  return { categories, missing };
}

export function auditArticle(markdown, options = {}) {
  const cleanMarkdown = stripBom(markdown);
  const failures = textFailures(cleanMarkdown);
  const images = publicImages(cleanMarkdown);
  const minimumImages = options.minimumImages ?? 3;

  if (images.urls.size === 0) failures.add('missing-evidence-images');
  if (images.urls.size < minimumImages) failures.add('insufficient-article-images');
  if (images.urls.size > 5) failures.add('too-many-article-images');
  if (hasMechanicalRubricHeadings(cleanMarkdown)) failures.add('mechanical-rubric-headings');
  if (hasEditorialImageEvidenceClaim(cleanMarkdown)) failures.add('editorial-image-evidence-claim');

  const { categories, missing } = evaluateCategories(cleanMarkdown, images);
  return createReport([...failures, ...missing], { categories });
}

function normalizeKey(key) {
  return key.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function isProvenanceKey(key) {
  const normalized = normalizeKey(key);
  const explicitProvenanceKeys = new Set(['rawpath', 'rawfilepath', 'filename']);
  const hasOrigin = normalized.includes('source') || normalized.includes('original');
  const hasLocator = normalized.includes('file') || normalized.includes('path') || normalized.includes('name');
  return explicitProvenanceKeys.has(normalized) || normalized === 'source' || normalized === 'original' || (hasOrigin && hasLocator);
}

function auditManifest(manifestText) {
  let manifest;
  try {
    manifest = JSON.parse(manifestText);
  } catch {
    return createReport(['invalid-json']);
  }

  const failures = new Set();
  function scanText(value) {
    if (PATH_PATTERNS.some((pattern) => pattern.test(value))) failures.add('public-local-path');
    if (PROVENANCE_VALUE_PATTERN.test(value)) failures.add('public-provenance-value');
  }
  function visit(value) {
    if (typeof value === 'string') {
      scanText(value);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (value && typeof value === 'object') {
      for (const [key, nestedValue] of Object.entries(value)) {
        scanText(key);
        if (isProvenanceKey(key)) failures.add('public-provenance-key');
        visit(nestedValue);
      }
    }
  }
  visit(manifest);
  return createReport([...failures]);
}

export async function auditFiles(paths) {
  if (paths.length === 0) return createReport(['empty-audit'], { files: {} });

  const files = {};
  for (const path of paths) {
    try {
      const content = await readFile(path, 'utf8');
      files[path] = path.toLowerCase().endsWith('.json') ? auditManifest(content) : auditArticle(content);
    } catch (error) {
      files[path] = createReport(['unreadable-file'], { error: error.message });
    }
  }

  const reports = Object.values(files);
  const fatal = reports.some((report) => report.fatal);
  const score = Math.min(...reports.map((report) => report.score));
  const failures = [...new Set(reports.flatMap((report) => report.failures))];
  return { fatal, files, failures, score, publishable: !fatal && score >= PUBLISH_THRESHOLD };
}

function defaultPaths(root) {
  return [
    ...LAUNCH_SLUGS.map((slug) => resolve(root, 'src', 'content', 'blog', `${slug}.md`)),
    resolve(root, 'public', 'images', 'asset-manifest.json'),
  ];
}

function isDirectExecution() {
  if (!process.argv[1]) return false;
  try {
    return import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
  } catch {
    return false;
  }
}

if (isDirectExecution()) {
  const explicitPaths = process.argv.slice(2).map((path) => resolve(path));
  const report = await auditFiles(explicitPaths.length ? explicitPaths : defaultPaths(process.cwd()));
  console.log(JSON.stringify(report, null, 2));
  if (report.fatal) process.exitCode = 1;
}
