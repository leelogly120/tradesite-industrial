import { BASELINE_BLOG_SLUGS, ALL_LIFT_PLATFORM_ARTICLE_SLUGS, LIFT_PLATFORM_ARTICLE_SLUGS, DAILY_LIFT_PLATFORM_ARTICLE_SLUGS, AUGUST_10_LIFT_PLATFORM_ARTICLE_SLUGS, AUGUST_13_LIFT_PLATFORM_ARTICLE_SLUGS } from '../../scripts/lift-platform-article-registry.mjs';
export { BUYER_PHOTO_URLS } from './buyer-photo-cohorts.mjs';

// Current release size is explicit; frozen cohort fixtures remain independent.
export const CURRENT_ARTICLE_COUNT = 210;
export const CURRENT_SITEMAP_COUNT = 234;
export const CURRENT_REFERENCE_PHOTO_COUNT = 89;
export const CURRENT_SLUGS = Object.freeze([...BASELINE_BLOG_SLUGS, ...ALL_LIFT_PLATFORM_ARTICLE_SLUGS]);
export const HISTORICAL_50_SLUGS = Object.freeze([...BASELINE_BLOG_SLUGS, ...LIFT_PLATFORM_ARTICLE_SLUGS, ...DAILY_LIFT_PLATFORM_ARTICLE_SLUGS, ...AUGUST_10_LIFT_PLATFORM_ARTICLE_SLUGS, ...AUGUST_13_LIFT_PLATFORM_ARTICLE_SLUGS]);
export const CURRENT_PAGE_SIZES = Object.freeze(Array.from({ length: Math.ceil(CURRENT_ARTICLE_COUNT / 20) }, (_, index) => Math.min(20, CURRENT_ARTICLE_COUNT - index * 20)));
export const laterSlugsThan = frozenSlugs => CURRENT_SLUGS.filter(slug => !frozenSlugs.includes(slug));

// Retain every historical content URL and registered article; the current SEO
// policy excludes the entire blog pagination namespace from sitemap submissions.
export function currentSitemapUrls(frozenUrls) {
  const origin = 'https://www.arclifteq.com';
  return [...new Set([
    ...frozenUrls.filter(url => !/^\/blog\/page(?:\/|$)/.test(new URL(url).pathname)),
    ...CURRENT_SLUGS.map(slug => `${origin}/blog/${slug}/`),
  ])];
}
