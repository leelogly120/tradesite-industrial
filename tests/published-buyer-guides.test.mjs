import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {describe,it,expect} from 'vitest';
import {BUYER_ARTICLE_COHORTS} from '../scripts/lift-platform-article-registry.mjs';
import {REVIEWED_BUYER_UPDATES,reviewedUpdateForSlug} from '../scripts/reviewed-buyer-updates.mjs';
import {buyerArticleFailures} from '../scripts/lib/buyer-article-audit.mjs';
import {retainedArticleSha256} from './helpers/retained-production-content.mjs';
const root=resolve(import.meta.dirname,'..');
const fixture=JSON.parse(readFileSync(resolve(root,'tests/fixtures/november-02-published-buyer-guides.json'),'utf8'));
const publishedByNovember02=BUYER_ARTICLE_COHORTS.filter(cohort=>cohort.date<='2026-11-02').flatMap(cohort=>cohort.slugs);
const revisions=JSON.parse(readFileSync(resolve(root,'tests/fixtures/november-02-pending-publication-revisions.json'),'utf8'));
const text=slug=>readFileSync(resolve(root,'src/content/blog',slug+'.md'),'utf8').replace(/\r\n/g,'\n');
const sha=s=>createHash('sha256').update(s).digest('hex');
describe('seventy reviewed buyer articles entering the live corpus',()=>{
 it('publishes the exact seventy registered manuscripts and only the reviewed revision history',()=>{
  expect(fixture.articles).toHaveLength(70);
  expect(fixture.articles.map(a=>a.slug).sort()).toEqual([...publishedByNovember02].sort());
  expect(revisions.articles).toHaveLength(23);
  expect(REVIEWED_BUYER_UPDATES.map(a=>a.slug).sort()).toEqual(revisions.articles.map(a=>a.slug).sort());
  expect(reviewedUpdateForSlug('not-an-approved-guide','2026-10-27')).toBe('2026-10-27');
  for(const a of revisions.articles){
   expect(retainedArticleSha256({slug:a.slug,sha256:a.beforeSha256})).toBe(a.sha256);
   expect(()=>retainedArticleSha256({slug:a.slug,sha256:'0'.repeat(64)})).toThrow(/Unknown/);
  }
 });
 it.each(fixture.articles)('$slug matches its reviewed bytes, creation cohort and actual revision date',a=>{
  const source=text(a.slug);
  expect(sha(source)).toBe(a.sha256);
  expect(source.match(/^date: (.+)$/m)?.[1]).toBe(a.date);
  expect(source.match(/^updated: (.+)$/m)?.[1]).toBe(a.updated);
  expect(buyerArticleFailures(source,a.date,a.slug)).toEqual([]);
  const wrong=source.replace(/^updated: .+$/m,'updated: 2026-12-31');
  expect(buyerArticleFailures(wrong,a.date,a.slug)).toContain('missing-buyer-metadata');
 });
 it('cannot obtain a revised date by copying another manuscript title',()=>{
  const original='roof-panel-roll-forming-pre-cut-vs-post-cut-line';
  const approved='full-length-roof-panels-vs-designed-end-laps-forming-package';
  const copiedTitle=text(approved).match(/^title: .+$/m)[0];
  const spoof=text(original).replace(/^title: .+$/m,copiedTitle).replace(/^updated: .+$/m,'updated: 2026-11-02');
  expect(buyerArticleFailures(spoof,'2026-10-30',original)).toContain('missing-buyer-metadata');
  expect(buyerArticleFailures(text(approved),'2026-10-30')).toContain('missing-buyer-metadata');
 });
});
