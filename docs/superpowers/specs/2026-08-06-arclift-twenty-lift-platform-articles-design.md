# ARCLIFT Twenty Lift-Platform Articles Design

- Approved: 2026-08-07
- Existing baseline: 21 blog articles and 15 retained product routes
- Scope: 20 new English B2B technical articles, local verification, one authorized publication attempt
- Identity: ARCLIFT is an integrated equipment supplier and technical selection and supply partner

## Objective and selected approach

Create a buyer-decision cluster around ARCLIFT's principal lift-platform equipment. Fourteen articles cover crawler and truck-mounted roof-level roll-forming lifts; six cover large-deck crawler platforms for ceiling and wall work.

The selected approach organizes pages by RFQ inputs, site fit, equipment interfaces, logistics, commissioning, acceptance and lifecycle handover. Model-by-model articles are rejected because public model labels are archived reference classes rather than current specifications. Case-study expansion is rejected because no publishable customer or project results support it.

## Article map

| # | Slug | Title | Decision boundary |
|---:|---|---|---|
| 1 | `high-altitude-roll-forming-lift-rfq-data` | RFQ Data Guide for High-Altitude Roll-Forming Lifts | Pre-quotation inputs; not machine selection or a signed schedule. |
| 2 | `roof-zone-survey-roll-forming-lift-selection` | Roof-Zone Survey Guide for Roll-Forming Lift Selection | Zone geometry; not reach or suitability approval. |
| 3 | `crawler-roll-forming-lift-access-route-survey` | Crawler Roll-Forming Lift Access Route Survey Guide | Gate-to-work-front inputs; not travel capability or route approval. |
| 4 | `crawler-roll-forming-lift-ground-support-review` | Ground Support Review for Crawler Roll-Forming Lifts | Support and ground data; not a bearing calculation. |
| 5 | `crawler-roll-forming-lift-work-zone-relocation` | Relocating Crawler Roll-Forming Lifts Between Work Zones | Relocation decisions; not permitted travel state or speed. |
| 6 | `truck-mounted-forming-lift-jobsite-setup-review` | Jobsite Setup Review for Truck-Mounted Forming Lifts | Arrival-to-setup space; not the existing chassis-interface decision. |
| 7 | `truck-mounted-lift-destination-chassis-sourcing` | Destination Chassis Sourcing for Truck-Mounted Lifts | Procurement information; not chassis or road approval. |
| 8 | `truck-mounted-forming-lift-road-transport-documents` | Road Transport Documents for Truck-Mounted Forming Lifts | Destination evidence questions; not legal advice or road-status proof. |
| 9 | `lifted-roll-forming-line-mounting-interface-review` | Mounting Interface Review for Lifted Roll-Forming Lines | Mechanical interfaces; not compatibility approval. |
| 10 | `roof-level-roll-forming-lift-coil-loading-plan` | Coil Loading Plan for Roof-Level Roll-Forming Lifts | On-lift transfer boundary; not general line feeding or capacity. |
| 11 | `elevated-roll-forming-roof-panel-handover-zones` | Roof Panel Handover Zones for Elevated Roll Forming | Discharge and receiving inputs; not handling performance or savings. |
| 12 | `roof-level-roll-forming-weather-hold-points` | Weather Hold-Point Planning for Roof-Level Roll Forming | Weather information and authority; not operating limits. |
| 13 | `lift-roll-forming-system-commissioning-plan` | Commissioning Plan for Lift-and-Roll-Forming Systems | Combined-system dependencies; not the existing FAT/SAT decision. |
| 14 | `roll-forming-lift-technical-document-package` | Technical Document Package Guide for Roll-Forming Lifts | Post-selection documents; not the pre-RFQ decision. |
| 15 | `large-deck-crawler-platform-vs-basket-lift` | Large-Deck Crawler Platform vs Basket Lift Selection | Workface and access comparison; no universal winner. |
| 16 | `large-crawler-work-platform-building-entry-survey` | Building Entry Survey for Large Crawler Work Platforms | Openings and movement inputs; not route or floor approval. |
| 17 | `large-deck-crawler-platform-work-zone-layout` | Work-Zone Layout Guide for Large-Deck Crawler Platforms | Deck-zone organization; no dimensions or payload claim. |
| 18 | `large-deck-platform-wall-panel-access-planning` | Wall-Panel Access Planning with Large-Deck Platforms | Wall-workface sequencing; not a case study. |
| 19 | `crawler-ceiling-platform-site-acceptance-records` | Site Acceptance Records for Crawler Ceiling Platforms | Acceptance evidence; not a test or acceptance result. |
| 20 | `crawler-platform-maintenance-spares-handover` | Maintenance and Spares Handover for Crawler Platforms | Lifecycle information; no stock, interval or service promise. |

## Evidence contract

Each page solves one buyer decision and gives a direct conditional answer. Material claims are recorded privately as fact, conditional inference, project input, unknown or prohibited. Every article includes useful trade-offs, limitations, not-fit conditions, escalation points and a project checklist.

Prohibited public claims include unsupported specifications, certification, legal approval, price, stock, delivery, capacity, performance, productivity, savings, customer or project results, source-manufacturer identity and suitability. Product model labels remain archived reference classes or reference concepts as defined by the private product matrix.

## Mechanical article contract

- 1,500–3,000 visible English words.
- Title 50–60 characters; title plus ` | ARCLIFT` no longer than 70 characters.
- Meta description 150–160 characters.
- Visible Contents block, four to six H2 sections and at least twelve useful H3 subsections.
- At least four substantive FAQs.
- Exactly one disclosed cover and three disclosed body images.
- At least two useful internal links and one current authoritative primary external source.
- All six hidden audit markers: `buyer-intent`, `conditions`, `evidence-tradeoffs`, `limitations-not-fit`, `project-checklist`, `cta-editorial-note`.
- Natural headings, varied rhythm and a bounded project-review CTA.

## Visual contract

Create one unique code-native 1600 × 900 SVG decision diagram per article. Reuse only public assets already classified `editorial`. Each page uses four different image URLs. AI-assisted raster captions state that the visual is editorial and not equipment, model, project, performance, compliance or suitability evidence. Code-native diagrams use accessible `<title>` and `<desc>`, a 16:9 viewBox, mobile-readable labels and an adjacent editorial disclosure.

Add the 20 SVG records to `public/images/asset-manifest.json` without private paths, source filenames or provenance. Record all allocations and boundaries in the private visual ledger.

## Internal links and retained content

The 14 ARC-C/ARC-T pages form one roof-level lift decision cluster. The six large-deck pages form one ARC-F planning cluster. Existing roof-level, crawler-versus-truck, 40HQ, roll-forming specification, ceiling-platform project-data and under-ceiling buyer guides remain the pillar parents.

No existing blog page, product page, canonical route or redirect may be deleted, unpublished or replaced. Contact styling, inquiry routing, Worker behavior and product parameters are outside scope.

## Verification

Use TDD: first extend coverage so missing articles and SVGs fail, then add content. Final evidence must include:

1. `npm run audit:content`: all 41 articles score 100/100 with zero fatal findings.
2. `npm run verify`: Worker, content tests, Astro build, build-output audit and Playwright checks pass.
3. `git diff --check`: clean.
4. Explicit coverage of all 20 new slugs and SVGs.
5. Privacy, identity, Unicode, link and no-deletion scans.
6. Human anti-AI read and representative desktop/mobile local review.

## One-time publication and stop rule

This batch has one-time authorization for the current Codex to push after every local gate passes. The default no-push boundary resumes after the batch.

- Confirm the remote base, then make one normal non-force push attempt.
- If Git push fails, is rejected, requests unavailable credentials or cannot be verified, stop immediately without troubleshooting or retrying.
- If GitHub accepts the push but Cloudflare build or deployment fails, report it and stop without debugging, retrying or changing Cloudflare.
- Search Console remains owner-operated unless separately authorized.
- Do not shut down the computer.

