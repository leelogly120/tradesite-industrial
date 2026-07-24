# Contact Form Visual Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the contact page form to the current production appearance without changing product inquiry forms or the delivery pipeline.

**Architecture:** Add a contact-only rendering mode to the shared inquiry component. Identify the compact payload to the Worker so its validation can preserve the production contact form requirements while product inquiries retain their richer validation.

**Tech Stack:** Astro 7, TypeScript, Playwright, Cloudflare Worker, Vitest

## Global Constraints

- Modify only the contact form rendering, the minimum shared submission code, tests, and Worker validation required by that rendering.
- Do not change product-page form presentation.
- Do not push or deploy.

---

### Task 1: Lock the contact-page contract

**Files:**
- Modify: `tests/inquiry-form.spec.ts`

**Interfaces:**
- Consumes: `/contact/?product=ARC-C25`
- Produces: assertions for production field order, required state, button copy, payload, layout, and product-form isolation

- [ ] Write failing Playwright assertions for the five production fields and `Submit Quote Request →`.
- [ ] Run `npm run test:e2e -- --project=chromium` and confirm failure against the current unified form.
- [ ] Add mobile overflow and desktop control-size assertions.

### Task 2: Restore the contact variant

**Files:**
- Modify: `src/components/InquiryForm.astro`
- Modify: `src/pages/contact.astro`

**Interfaces:**
- Consumes: `variant="contact"`
- Produces: the production contact form and JSON payload containing `formVariant: "contact"`

- [ ] Add the minimal conditional markup for the production field set.
- [ ] Reuse the global `.fg` and `.submit` styles already matching production.
- [ ] Keep product-page markup unchanged.
- [ ] Run the focused Playwright tests and confirm they pass.

### Task 3: Preserve Worker delivery

**Files:**
- Modify: `workers/inquiry-router/src/index.ts`
- Modify: `workers/inquiry-router/test/index.test.ts`

**Interfaces:**
- Consumes: `formVariant: "contact"`
- Produces: contact-specific validation while preserving existing product validation and forwarding

- [ ] Write a failing Worker test for a valid compact contact submission.
- [ ] Add contact-specific validation for required name, email, and phone.
- [ ] Run `npm run test:worker` and confirm all Worker tests pass.

### Task 4: Verify locally

**Files:**
- No production files beyond Tasks 1–3

**Interfaces:**
- Consumes: local Astro site and mocked inquiry endpoint
- Produces: verified desktop/mobile rendering and build

- [ ] Run `npm run verify`.
- [ ] Compare local `/contact/` with production at desktop width.
- [ ] Check mobile layout for overflow and broken controls.
- [ ] Leave the local page open for user review; do not push or deploy.
