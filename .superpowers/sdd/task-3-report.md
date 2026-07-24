# Task 3 Report — Contact Style Compatibility and Inquiry Loop

Date: 2026-07-25

## Scope

- Added `InquiryForm` variants: default `product` and explicit `contact`.
- Kept the existing product field set and product validation threshold.
- Restored the compact Contact field set and dimensions without changing the product form branch.
- Added Contact-aware Worker validation and local preview CORS support for both local hostnames.
- No push and no deployment.

## TDD evidence

RED was observed before implementation:

- Worker suite: 3 expected failures:
  - preview config omitted `http://127.0.0.1:4321`
  - minimal Contact payload was rejected
  - Contact did not require phone
- Form variant suite: 3 expected failures:
  - variant API/default absent
  - Contact page did not opt into `contact`
  - compact Contact labels/copy absent
- Product client regression: 1 expected failure confirmed that a new phone-format check had entered the product branch; it was removed before completion.

## Implementation

- Contact visible fields:
  - Name (required)
  - Email (required and format checked)
  - WhatsApp / Phone (required)
  - Company (optional)
  - Message (optional)
- Contact layout:
  - one column
  - maximum form width 434px
  - 54px inputs
  - 100px textarea
  - 58px blue submit button
- Contact payload includes `formVariant: "contact"`, query-string product context, `sourcePage`, and `submittedAt`.
- Failed delivery does not reset entered values.
- Worker defaults missing `formVariant` to `product` for backward compatibility.
- Contact validation requires name, valid email, and phone while leaving company, country, and message optional.
- Product validation still requires company, country, message, and at least one contact channel.
- Fixed submit progress markup to `Submitting…`.
- Preview CORS now allows:
  - `http://localhost:4321`
  - `http://127.0.0.1:4321`
- Production origins are unchanged.

## Verification

- Worker tests: 21/21 passed.
- Content/form contract tests: 89/89 passed.
- Astro build: passed, 51 pages generated.
- Playwright desktop: 4 passed, mobile-only case skipped as designed.
- Playwright mobile (390×844): 5/5 passed, including no page-level horizontal overflow.

## Environment note

The project already had an Astro development server running on port 4321. Astro therefore refused to start the separate Playwright server on 4322. The test configuration now supports an explicit `PLAYWRIGHT_BASE_URL` override, and verification reused the existing 4321 server without stopping or altering the user's process. An additional in-app-browser connection attempt was blocked by the Windows sandbox, but the actual Playwright Chromium desktop and mobile rendering checks completed successfully.
