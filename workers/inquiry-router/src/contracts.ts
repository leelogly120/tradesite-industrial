export const MAX_BODY_BYTES = 16 * 1024;

export const FIELD_LIMITS = {
  name: 120,
  company: 160,
  country: 100,
  email: 254,
  phone: 50,
  model: 80,
  product: 160,
  productSlug: 160,
  application: 160,
  message: 5000,
  sourcePage: 500,
} as const;

export interface Inquiry {
  formVariant: 'product' | 'contact';
  name: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  model: string;
  product: string;
  productSlug: string;
  application: string;
  message: string;
  sourcePage: string;
  submittedAt: string;
  receivedAt: string;
}

export type ValidationResult =
  | { ok: true; value: Inquiry }
  | { ok: false; fields: Record<string, string> };

const clean = (value: unknown): string =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d\s.-]{7,50}$/;

export function validateInquiry(input: Record<string, unknown>, receivedAt: Date): ValidationResult {
  const requestedVariant = clean(input.formVariant);
  const formVariant = requestedVariant === 'contact' ? 'contact' : 'product';
  const value: Inquiry = {
    formVariant,
    name: clean(input.name),
    company: clean(input.company),
    country: clean(input.country),
    email: clean(input.email),
    phone: clean(input.phone),
    model: clean(input.model),
    product: clean(input.product),
    productSlug: clean(input.productSlug),
    application: clean(input.application),
    message: clean(input.message),
    sourcePage: clean(input.sourcePage),
    submittedAt: clean(input.submittedAt),
    receivedAt: receivedAt.toISOString(),
  };

  const fields: Record<string, string> = {};
  for (const [key, limit] of Object.entries(FIELD_LIMITS)) {
    const field = key as keyof typeof FIELD_LIMITS;
    if (value[field].length > limit) fields[key] = `Must be ${limit} characters or fewer.`;
  }

  if (requestedVariant && requestedVariant !== 'product' && requestedVariant !== 'contact') {
    fields.formVariant = 'Invalid form variant.';
  }
  if (!value.name) fields.name = 'Please enter your full name.';

  if (value.formVariant === 'contact') {
    if (!value.email) fields.email = 'Please enter your email address.';
    if (!value.phone) fields.phone = 'Please enter your WhatsApp/phone number.';
  } else {
    if (!value.company) fields.company = 'Please enter your company name.';
    if (!value.country || value.country === 'Select...') {
      fields.country = 'Please select your country.';
    }
    if (!value.message) fields.message = 'Please describe your project requirements.';
    if (!value.email && !value.phone) {
      fields.contact = 'Enter an email address or WhatsApp/phone number.';
    }
  }

  if (value.email && !emailPattern.test(value.email)) {
    fields.email = 'Enter a valid email address.';
  }
  if (value.phone && !phonePattern.test(value.phone)) {
    fields.phone = 'Enter a valid WhatsApp/phone number.';
  }
  if (!value.sourcePage.startsWith('/') || value.sourcePage.startsWith('//')) {
    fields.sourcePage = 'Invalid source page.';
  }

  return Object.keys(fields).length ? { ok: false, fields } : { ok: true, value };
}
