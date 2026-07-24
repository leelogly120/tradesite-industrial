# Contact Form Visual Parity Design

## Scope

Restore only `/contact/` to the form structure and visual treatment currently published at `https://arclifteq.com/contact/`. Product-page inquiry forms, page hero content, sidebar content, analytics, deployment, and unrelated site code remain unchanged.

## Contact Form

The contact page uses the production field order and required state: `Name *`, `Email *`, `WhatsApp / Phone *`, `Company`, and `Message`. It remains a single-column form with the production placeholders, control dimensions, spacing, blue `Submit Quote Request →` button, and success treatment.

## Submission

The form continues to submit JSON to the configured inquiry Worker. A `formVariant: "contact"` value distinguishes this compact form from product-page inquiries. Contact submissions validate name, email, and phone; company and message remain optional. The Worker continues forwarding accepted inquiries to Formspree/email and DingTalk.

## Verification

Automated checks cover field order, required fields, button text, payload mapping, failure preservation, desktop dimensions, mobile overflow, unchanged product forms, Worker validation, and the production build. No production push or deployment occurs before explicit approval.
