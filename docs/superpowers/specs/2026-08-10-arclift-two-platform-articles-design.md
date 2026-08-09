# ARCLIFT Two Platform Articles — Design

Date: 2026-08-10

## Outcome

Publish exactly two English B2B technical articles that extend the protected 43-page blog library without deleting, renaming, redirecting, or weakening an existing route. Release them together with the previously completed mobile PageSpeed improvements on the reviewed feature branch.

## Selected buyer decisions

1. **Aerial Platform Familiarization and Handover Guide** — help a buyer define the people, controlled information, machine-specific familiarization, authorization evidence, limitations, and handover record needed before named users work with a particular aerial platform.
2. **Transport Data Package for Large Crawler Platforms** — help a buyer coordinate machine, carrier, route, stowage, handling, role, and handover information before a large crawler platform moves between sites or transport stages.

## Non-overlap boundaries

- The familiarization article is not a training course, training certificate, operating instruction, pre-use inspection checklist, site-acceptance record, or rescue plan. It connects those separate controls without claiming to replace them.
- The transport-data article is not a 40HQ fit study, carrier recommendation, restraint design, road-permit decision, loading/unloading method statement, or destination-receipt procedure. It defines the information handoffs that let the responsible specialists make those decisions.
- Existing site-planning, work-zone, maintenance, route, chassis, shipping, and acceptance pages remain the deeper internal-link destinations for their own decisions.

## Evidence design

- OSHA aerial-lift guidance provides U.S. regulatory context on trained/authorized workers, retraining triggers, pre-start inspection, and manufacturer instructions.
- HSE MEWP guidance provides UK context distinguishing formal training from familiarization on a specific make and model and emphasizing equipment-specific checks and instructions.
- IPAF F1 familiarization guidance supplies current industry-practice context for machine-specific features, limitations, controls, emergency lowering, warnings, and records. It is not presented as law or certification.
- IPAF transportation guidance supplies industry-practice context for planning, competent roles, vehicle compatibility, route, loading, unloading, and transport risk assessment.
- HSE workplace-transport loading guidance supplies UK context for loading areas, traffic separation, stability, securing, and role control.
- The IMO/ILO/UNECE CTU Code supplies non-mandatory intermodal-chain context. It does not approve equipment, local road movement, restraint, or a project-specific transport method.

## Identity and claim boundaries

- ARCLIFT is described only as an integrated equipment supplier and technical selection and supply partner.
- Public copy contains no source-factory, manufacturer, customer, project, or private-path identity.
- No universal model specification, capacity, dimension, center of gravity, tie-down value, price, delivery, certification, acceptance, performance, or outcome claim is introduced.
- Every technical value and released instruction remains machine-, carrier-, route-, destination-, and project-specific.
- Every editorial or AI-assisted visual is individually disclosed and explicitly excluded from evidence.

## Page contract

Each article has a 50–60 character title, a 150–160 character description, 1,500–3,000 visible English words, 4–6 H2 sections, at least 12 H3/H4 headings, four real FAQs, exactly three body visuals plus a distinct cover, at least two internal links, at least one authoritative external link with the required safe-link attributes, all six audit markers, and a 100/100 content-audit result.

## Visual design

- Familiarization cover: `ceiling-platform-underside.webp`.
- Familiarization body: a new `aerial-platform-familiarization-handover.svg`, the existing `remote-control-safety-loop.svg`, and `large-deck-steel-structure.webp`.
- Transport cover: `port-loading-logistics.webp`.
- Transport body: a new `large-crawler-platform-transport-data-package.svg`, the existing `crawler-platform-selection-path.svg`, and `crawler-roll-forming-lift-access-route-survey.svg`.
- Each new SVG is an accessible 1600×900 editorial diagram with three to five decision labels readable at a 390 px viewport.

## Release design

- Protect all 43 existing blog slugs and add two dated registry entries.
- Extend executable content-audit coverage from 43 to 45 pages.
- Add the two new SVGs to the public asset manifest with editorial classification and exact non-evidence disclosure.
- Run focused tests, the 100/100 content audit, full verification, privacy scans, and desktop/mobile visual checks.
- Push the complete reviewed branch to `main` only if remote `main` still matches the reviewed baseline, then monitor the deployment and verify both new canonical URLs, sitemap inclusion, assets, and responsive rendering.
- Record the claim ledger, visual ledger, self-review, deployment result, and any indexing limitation in the private Vault only.
