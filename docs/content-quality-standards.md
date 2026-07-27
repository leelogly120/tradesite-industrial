# ARCLIFT Evidence-First Blog Content Quality Standards

## Evidence-first boundary

Publication begins with a defensible buyer decision, not a request to fill a template. Every material statement must be classified in a private **claim ledger** as a verified fact, a conditional inference, a project input, an unknown, or a prohibited claim. Every visual must be classified in a private **visual ledger** as an evidence image or an editorial image, with its source, intended use, disclosure, and privacy review recorded.

Numbers, specifications, measurements, product capabilities, certifications, availability, price, cost, ROI, savings, case studies, customer results, competitive advantages, and suitability statements are optional. They may appear only when supported by **current, traceable evidence** that is authoritative for the exact claim, date, configuration, jurisdiction, and project scope. When that chain is missing, narrow the statement, mark the item **Hold**, or omit it. Never invent a value, example, project, result, or advantage to satisfy length, SEO, or brand requirements.

Official standards records and scope records may locate a topic and define a source's scope. They are **not implementation guides or compliance proof**. Obtain the controlled text, destination requirements, project documents, and competent review before stating applicability or conformity. Keep the source jurisdiction visible beside regulatory claims.

## Layer A: semantic and evidence review

Layer A is the release authority. It cannot be overridden by word count, keyword placement, audit score, or any other mechanical result.

Before drafting:

- Define one buyer decision and a narrow non-overlap boundary.
- Open the claim ledger and record the evidence owner, source, access date, scope, wording limit, and unresolved items.
- Open the visual ledger and record classification, provenance, disclosure, privacy result, and whether the visual can support a claim.
- Separate verified facts from conditional reasoning, requested project inputs, unknowns, and prohibited statements.
- Confirm that citations support the adjacent wording rather than only the general topic.

Before release, a human reviewer must verify the claim ledger against the article, challenge high-risk statements, inspect every visual and caption, and confirm that limitations and not-fit conditions are useful to a buyer. Any unresolved identity, privacy, product-capability, compliance, or evidence issue is a **Hold**, even if Layer B passes.

## Identity and privacy boundary

ARCLIFT may be described only as an **integrated equipment supplier** or a **technical selection and supply partner**. Do not state or imply that ARCLIFT is the source factory, manufacturer, project designer, certifier, customer, site owner, or operator. Do not expose or imply a source factory, manufacturer, customer or project identity.

Collect the minimum information needed for technical review through a secure project channel. Sensitive project data must not be published or placed in public forms, analytics, diagrams, filenames, captions, or examples. Redact or anonymise customer and site names, contact details, event calendars, security or access boundaries, emergency contacts, drawings, identifiers, vehicle identifiers, local file paths, and other traceable project records. Publication requires written and scope-specific authority for any non-public project information.

Product references are optional and must never be forced. A product link may be used only when it helps the stated buyer decision and the surrounding claim is supported by a current approved record. Do not infer configuration, capacity, reach, load, clearance, travel state, control function, certification, availability, performance, or suitability from a photograph, an archival range page, a generic standard, or another project.

## Visual evidence and disclosure

An **evidence image** is a current, approved record that directly supports a limited claim. Its ledger entry must identify its authoritative source, configuration or project scope, date, permitted claim, publication authority, and privacy result.

An **editorial image** explains a workflow, comparison, or planning concept. It must be captioned as illustrative or representative and **must not be treated as evidence** of product identity, configuration, performance, compliance, customer use, or project result.

Every AI-assisted or AI-edited visual is editorial. It requires **per-image disclosure** in the adjacent public caption, including the cover caption. The disclosure must identify it as AI-assisted and explain that it is illustrative and not evidence. A general site notice does not replace disclosure for each image.

## Layer B: mechanical SEO and presentation gate

Layer B checks completeness after Layer A passes. It does not repair unsupported claims or authorize publication.

Each release article must satisfy all of these machine-checkable requirements:

- Visible body length: 1,500–3,000 English words.
- Title: 50–60 characters and no more than 70 characters with the ` | ARCLIFT` suffix.
- Meta description: 150–160 characters.
- A visible `**Contents**` block.
- Four to six H2 sections and at least twelve H3 subsections.
- At least four substantive FAQ questions.
- Exactly three body images, plus a disclosed cover image.
- At least two useful internal links to existing blog or product routes.
- At least one authoritative external link using `https://`, `target="_blank"`, and `rel="noopener noreferrer"`.
- Descriptive alternative text and an adjacent caption/disclosure for every image.
- All six hidden audit markers: `buyer-intent`, `conditions`, `evidence-tradeoffs`, `limitations-not-fit`, `project-checklist`, and `cta-editorial-note`.
- Natural public headings; hidden audit labels must not be exposed as a mechanical outline.
- `npm run audit:content` result of **100/100** with **zero fatal** findings for every launch article.
- `npm run verify`, build, internal-link checks, canonical checks, and sitemap checks all pass before publication.

Keywords describe the buyer's question; they do not set a density target. Use one primary intent and only related terms that improve clarity. Internal links must exist in the same release or already be live. Never create a link solely to satisfy a quota, and never assume a route that the repository does not provide.

## Buyer-facing structure

Within the Layer B envelope, choose a natural structure that serves the decision:

1. Give a direct answer and define what the article does not decide.
2. Explain the conditions and project inputs that change the answer.
3. Compare evidence, interfaces, and trade-offs without turning inference into fact.
4. State limitations, not-fit conditions, escalation points, and unresolved risks.
5. Provide a practical project checklist or review artifact.
6. End with a scoped next step and an editorial/evidence boundary note.

Tables, examples, calculations, anecdotes, product references, and comparisons are used only when they are supported and genuinely clarify the decision. Generic filler, fabricated specificity, keyword stuffing, unsupported step-by-step operating instructions, and mechanical repetition are release blockers.

## Release contract

Publication is allowed only when all nine gates pass:

1. Topic and search-intent boundary.
2. Claim ledger and evidence scope.
3. Identity and privacy review.
4. Visual ledger and per-image disclosure.
5. Automated content audit.
6. Layer B SEO, metadata, links, canonical, sitemap, and structured-data alignment.
7. Human de-AI and technical editorial review.
8. Committed-tree production build and URL verification.
9. Search Console handoff or an explicit recorded operator-owned pending state.

If any gate fails, the article remains **Hold**. A 100/100 automated score is necessary but never sufficient: Layer A semantic truth, identity, privacy, and evidence boundaries remain controlling.

## Reviewer checklist

- [ ] One buyer decision and a non-overlap boundary are explicit.
- [ ] Every material statement is present in the claim ledger with a current source and scope.
- [ ] Unsupported numbers, specifications, capabilities, cases, ROI, savings, advantages, and suitability claims are omitted or held.
- [ ] Standards and regulatory sources retain edition, jurisdiction, and scope limits.
- [ ] ARCLIFT identity uses only an approved supplier/selection-partner description.
- [ ] Sensitive project data and identity clues are removed or redacted.
- [ ] The visual ledger distinguishes evidence images from editorial images.
- [ ] Every AI-assisted visual has adjacent per-image disclosure and is never used as evidence.
- [ ] Limitations, unknowns, not-fit conditions, and competent-review handoffs are clear.
- [ ] The article passes every Layer B mechanical requirement and all six audit markers.
- [ ] `npm run audit:content` reports 100/100 and zero fatal findings.
- [ ] `npm run verify`, production build, links, canonical, and sitemap checks pass.
- [ ] A human reviewer confirms natural English, varied rhythm, useful specificity, and no unsupported certainty.
