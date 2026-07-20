const { readFileSync, readdirSync } = require('fs');
const { join } = require('path');

function deepReview(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const body = content.replace(/^---[\s\S]*?---\n/, '');
  const words = body.split(/\s+/).filter(w => w.length > 0);
  
  let score = 100;
  const issues = [];
  
  // 1. Content depth
  if (words.length < 500) { score -= 30; issues.push('Too short (<500 words)'); }
  else if (words.length < 1000) { score -= 15; issues.push('Short (<1000 words)'); }
  
  // 2. Template detection
  if (body.includes('In this article') || body.includes('In this guide')) { score -= 15; issues.push('Template opening'); }
  if (body.includes('Whether you are')) { score -= 10; issues.push('Template phrase'); }
  
  // 3. Cliche detection
  if (body.includes('game-changer') || body.includes('cutting-edge') || body.includes('world-class')) { score -= 15; issues.push('Cliche detected'); }
  
  // 4. Real data
  const numbers = body.match(/\d+/g) || [];
  if (numbers.length < 5) { score -= 20; issues.push('Insufficient data'); }
  
  // 5. Case studies
  if (!body.includes('case study') && !body.includes('tested') && !body.includes('real-world')) { score -= 15; issues.push('No case study'); }
  
  // 6. CTA
  if (!body.includes('contact') && !body.includes('whatsapp') && !body.includes('quote')) { score -= 25; issues.push('No CTA'); }
  
  // 7. Internal links
  const linkCount = (body.match(/\]\(/g) || []).length;
  if (linkCount < 3) { score -= 15; issues.push('Too few links: ' + linkCount); }
  
  // 8. Personal perspective
  if (!body.includes("I've") && !body.includes('we tested') && !body.includes('our experience')) { score -= 10; issues.push('No personal perspective'); }
  
  score = Math.max(0, Math.min(100, score));
  return { score, issues, words: words.length };
}

const blogDir = 'D:/TradeSite/site/src/content/blog';
const files = readdirSync(blogDir).filter(f => f.endsWith('.md'));

console.log('=== STRICT CONTENT REVIEW ===');
console.log('Total articles:', files.length);
console.log('');

let totalScore = 0;
const results = [];

for (const file of files.slice(0, 30)) {
  const result = deepReview(join(blogDir, file));
  results.push({ file, ...result });
  totalScore += result.score;
}

const avgScore = Math.round(totalScore / results.length);

console.log('Average Score:', avgScore);
console.log('');

console.log('=== WORST ARTICLES (Need Rewrite) ===');
results.sort((a, b) => a.score - b.score);
results.slice(0, 10).forEach(r => {
  console.log(r.score + ' pts (' + r.words + ' words) - ' + r.file);
  if (r.issues.length > 0) console.log('  Issues: ' + r.issues.join(', '));
});

console.log('');
console.log('=== BEST ARTICLES (Can Keep) ===');
results.sort((a, b) => b.score - a.score);
results.slice(0, 5).forEach(r => {
  console.log(r.score + ' pts (' + r.words + ' words) - ' + r.file);
});
