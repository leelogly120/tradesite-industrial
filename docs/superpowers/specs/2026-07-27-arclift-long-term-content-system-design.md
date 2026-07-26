# ARCLIFT Long-Term Content System Design

## Objective

Publish six evidence-first English B2B technical articles as the first execution batch of a long-term keyword system. The system must map buyer intent to public pages, keep private research and monitoring data in the project Vault, and use Search Console observations supplied or reviewed by the owner to adjust future priorities.

## Public and Private Boundaries

- Public repository: finished articles, privacy-safe editorial assets, asset classifications, and non-sensitive implementation documentation.
- Private Vault: keyword map, evidence and claim ledgers, content queue, monitoring snapshots, query/page observations, and prioritization decisions.
- Never publish source-company, factory, manufacturer, customer, project, staff, address, original filename, local path, or private provenance information.
- ARCLIFT is described only as an integrated equipment supplier or technical selection and supply partner.

## First Six-Article Cluster

| Slug | Working title | Primary intent | Boundary |
| --- | --- | --- | --- |
| `crawler-under-ceiling-platform-buyers-guide` | How to Choose a Crawler Under-Ceiling Work Platform | Commercial investigation | Selection framework, not model approval |
| `crawler-platform-vs-spider-lift-vs-scaffolding` | Crawler Platform vs Spider Lift vs Scaffolding Guide | Comparative investigation | No universal safety, cost, or productivity winner |
| `indoor-aerial-platform-ground-pressure-guide` | Ground Pressure Guide for Indoor Aerial Work Platforms | Technical investigation | No project pressure or slab-capacity claim without signed data |
| `remote-control-aerial-platform-safety-planning` | Remote-Control Aerial Platform Safety Planning Guide | Risk and specification investigation | No unverified feature, certification, or safety-performance claim |
| `dual-power-crawler-platform-selection` | Dual-Power Crawler Platform Selection and Site Guide | Configuration investigation | No fixed runtime, emissions, charging, or fuel claim |
| `warehouse-ceiling-access-platform-planning` | Warehouse Ceiling Access Platform Project Planning Guide | Application investigation | Decision guide, not a disguised case study |

The six articles form a single internal-link cluster around crawler under-ceiling access. They link to the existing project-data article, relevant crawler ceiling-platform product pages, and warehouse, stadium, or airport solution pages where contextually useful.

## Article Contract

Each article must:

- contain 1,500–2,500 English words;
- use a 50–60 character title and a 150–160 character description;
- include a concise introduction, table of contents, six topic-specific H2 sections, a conclusion, and three to five FAQ questions;
- retain the six hidden `audit-section` markers required by the existing content gate;
- include two to three related blog links, two to three relevant product links, and one to two solution links;
- cite one or two current authoritative primary sources;
- use three to five unique visible image URLs, descriptive alt text, and visible captions;
- state that editorial visuals are not evidence of model identity, performance, certification, suitability, or a completed project;
- end with a project-data CTA that requests height/outreach, route, ground or slab data, load breakdown, power, destination, and documentation requirements.

## Evidence and Visual Design

- Reuse only assets already classified as `editorial` in the public asset manifest.
- Create one privacy-safe code-native SVG decision diagram per article.
- Classify every new SVG as `editorial`; it is decision support, not field evidence.
- Do not create new AI-assisted raster images for this batch.
- Record public asset classifications and bounded captions in the private evidence ledger.
- Record every technical claim as verified reference, conditional statement, or inference in the private claim ledger.

## Keyword and Monitoring System

The private keyword plan stores, for every topic:

- cluster, primary intent, target page, supporting questions, current status, internal-link parents, and evidence readiness;
- Search Console query, page, clicks, impressions, CTR, and average position when the owner provides or reviews those values;
- comparison windows of recent 28 days versus the preceding 28 days, without inventing minimum traffic thresholds;
- the next action: hold, improve title/description, expand a section, strengthen internal links, create a supporting article, or retire cannibalizing intent.

Prioritization uses observable signals:

1. queries with impressions but weak CTR receive title and description review;
2. queries ranking near the first page receive content-depth and internal-link review;
3. multiple pages receiving the same intent trigger cannibalization review;
4. pages with no impressions remain unchanged until crawl/index status and topic fit are checked;
5. new articles are selected from uncovered buyer questions, not from fabricated volume estimates.

## Verification and Release

- Work from an isolated branch based on `origin/main` so the unrelated local `e82c8e8` commit is never pushed.
- Do not modify Contact styling, inquiry routing, or product parameters.
- Run explicit audits for all six new article paths and the asset manifest.
- Run `npm run audit:content` and `npm run verify`; every command must exit successfully.
- Commit the long-term system records and six articles in reviewable content batches.
- Push the isolated branch head to `origin/main` only if it is a fast-forward from the current remote main.
- Poll the six production URLs, sitemap, canonical tags, and Cloudflare-served deployment until all are healthy.
- Do not claim Search Console submission or indexing; the owner will review Search Console manually.

## Shutdown Condition

Automatic shutdown is permitted only after all of these are true:

1. all local verification commands pass;
2. the intended commits are pushed successfully to `origin/main`;
3. all six production URLs return HTTP 200 with exact self-canonicals;
4. all six URLs appear in the live sitemap;
5. the private Vault and automation memory contain the final release record.

Any failed verification, push, deployment, or production check blocks shutdown.
