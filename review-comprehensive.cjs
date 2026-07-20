const { readFileSync, readdirSync } = require('fs');
const { join } = require('path');

const blogDir = 'D:/TradeSite/site/src/content/blog';
const files = readdirSync(blogDir).filter(f => f.endsWith('.md'));

console.log('=== COMPREHENSIVE CONTENT REVIEW ===');
console.log('Total articles:', files.length);
console.log('');

let totalIssues = 0;
const allIssues = [];

for (const file of files) {
  const filePath = join(blogDir, file);
  const content = readFileSync(filePath, 'utf-8');
  const issues = [];
  
  // 1. ENCODING/GARBLED TEXT CHECK
  if (content.includes('\ufffd') || content.includes('â') || content.includes('ã')) {
    issues.push('ENCODING: Contains garbled characters');
  }
  
  // 2. GRAMMAR/SPELLING (basic patterns)
  if (content.includes('  ')) issues.push('FORMATTING: Double spaces detected');
  if (content.includes('\t')) issues.push('FORMATTING: Tab characters detected');
  
  // 3. FORMATTING CHECK
  const lines = content.split('\n');
  const emptyLines = lines.filter(l => l.trim() === '').length;
  if (emptyLines > 20) issues.push('FORMATTING: Too many empty lines');
  
  // 4. IMAGE ALT TAG CHECK
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    issues.push('STRUCTURE: Missing frontmatter');
  } else {
    const fm = frontmatterMatch[1];
    if (!fm.includes('title:')) issues.push('FRONTMATTER: Missing title');
    if (!fm.includes('description:')) issues.push('FRONTMATTER: Missing description');
    if (!fm.includes('date:')) issues.push('FRONTMATTER: Missing date');
    if (!fm.includes('image:')) issues.push('FRONTMATTER: Missing image');
    if (!fm.includes('tags:')) issues.push('FRONTMATTER: Missing tags');
    
    // Check image path
    if (fm.includes('image:')) {
      const imgMatch = fm.match(/image:\s*["']([^"']+)["']/);
      if (imgMatch) {
        const imgPath = imgMatch[1];
        if (imgPath.includes('local')) issues.push('IMAGE: Using local images (may have manufacturer info)');
        if (!imgPath.includes('arc-') && !imgPath.includes('hero')) issues.push('IMAGE: Not using branded product images');
      }
    }
  }
  
  // 5. KEYWORD DENSITY CHECK
  const body = content.replace(/^---[\s\S]*?---\n/, '');
  const words = body.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  if (wordCount < 1000) issues.push('QUALITY: Content too short (' + wordCount + ' words, need 1000+)');
  
  // 6. INTERNAL LINKS CHECK
  const linkPattern = /\]\(/g;
  const linkCount = (body.match(linkPattern) || []).length;
  if (linkCount < 3) issues.push('LINKS: Too few internal links (' + linkCount + ', need 3+)');
  
  // 7. CTA CHECK
  const hasCTA = /(?:contact|call|email|whatsapp|quote|consultation)/i.test(body);
  if (!hasCTA) issues.push('CONVERSION: Missing CTA');
  
  // 8. AI PATTERNS CHECK
  const aiPatterns = [
    /In this (?:article|guide)/gi,
    /Whether you are (?:a|an)/gi,
    /It is important to/gi,
    /In today's world/gi,
    /game[- ]?changer/gi,
    /cutting[- ]?edge/gi,
    /world[- ]class/gi,
  ];
  for (const pattern of aiPatterns) {
    const matches = body.match(pattern);
    if (matches) issues.push('AI PATTERN: "' + matches[0] + '"');
  }
  
  // 9. PERSONAL PERSPECTIVE CHECK
  if (!body.includes("I've") && !body.includes('we tested') && !body.includes('our experience') && !body.includes('I learned')) {
    issues.push('QUALITY: Missing personal perspective');
  }
  
  // 10. DATA/EVIDENCE CHECK
  const numbers = body.match(/\d+/g) || [];
  if (numbers.length < 10) issues.push('QUALITY: Insufficient data/evidence');
  
  // 11. HEADING STRUCTURE
  const h1Count = (body.match(/^# .+$/gm) || []).length;
  const h2Count = (body.match(/^## .+$/gm) || []).length;
  if (h1Count !== 1) issues.push('STRUCTURE: H1 count should be 1, found ' + h1Count);
  if (h2Count < 3) issues.push('STRUCTURE: Too few H2 headings (' + h2Count + ')');
  
  // 12. TABLE USAGE
  const tableCount = (body.match(/\|/g) || []).length / 5;
  if (tableCount < 1) issues.push('FORMAT: No tables found (consider adding)');
  
  // 13. LIST USAGE
  const listCount = (body.match(/^[-*] .+$/gm) || []).length;
  if (listCount < 3) issues.push('FORMAT: Few lists found');
  
  // 14. BOLD USAGE
  const boldCount = (body.match(/\*\*[^*]+\*\*/g) || []).length;
  if (boldCount < 3) issues.push('FORMAT: Few bold text found');
  
  // Report
  if (issues.length > 0) {
    console.log('\n' + file);
    console.log('  Words: ' + wordCount + ' | Links: ' + linkCount);
    issues.forEach(i => console.log('  - ' + i));
    totalIssues += issues.length;
    allIssues.push({ file, issues, wordCount, linkCount });
  }
}

console.log('\n=== SUMMARY ===');
console.log('Total articles reviewed:', files.length);
console.log('Articles with issues:', allIssues.length);
console.log('Total issues found:', totalIssues);
console.log('');

// Severity breakdown
const critical = allIssues.filter(a => a.issues.some(i => i.includes('ENCODING') || i.includes('FRONTMATTER')));
const warning = allIssues.filter(a => a.issues.some(i => i.includes('QUALITY') || i.includes('AI PATTERN')));
const info = allIssues.filter(a => a.issues.some(i => i.includes('FORMAT') || i.includes('LINKS')));

console.log('CRITICAL (must fix):', critical.length, 'articles');
console.log('WARNING (should fix):', warning.length, 'articles');
console.log('INFO (consider fixing):', info.length, 'articles');
