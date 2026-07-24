import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

describe('InquiryForm variant wiring', () => {
  const component = read('../src/components/InquiryForm.astro');
  const contactPage = read('../src/pages/contact.astro');
  const productLayout = read('../src/layouts/ProductLayout.astro');

  it('defaults to the complete product variant', () => {
    expect(component).toMatch(/variant\??:\s*['"]product['"]\s*\|\s*['"]contact['"]/);
    expect(component).toMatch(/variant\s*=\s*['"]product['"]/);
    for (const label of [
      'Company',
      'Country / Region',
      'Product / Model',
      'Application',
      'Project Requirements',
    ]) {
      expect(component).toContain(label);
    }
    expect(productLayout).toMatch(/<InquiryForm[\s\S]*productName=/);
    expect(productLayout).not.toContain('variant="contact"');
  });

  it('does not add new phone-format validation to the product client branch', () => {
    const validationStart = component.indexOf("if (formVariant === 'contact')");
    const validationEnd = component.indexOf(
      'if (Object.keys(errors).length)',
      validationStart,
    );
    expect(validationStart).toBeGreaterThanOrEqual(0);
    expect(validationEnd).toBeGreaterThan(validationStart);

    const validationChunk = component.slice(validationStart, validationEnd);
    const productBranchStart = validationChunk.lastIndexOf('} else {');
    expect(productBranchStart).toBeGreaterThanOrEqual(0);

    const productValidation = validationChunk
      .slice(productBranchStart + '} else {'.length)
      .trim();
    expect(productValidation).not.toBe('');
    expect(productValidation).not.toContain('phonePattern.test');
  });

  it('opts only the contact page into the contact variant', () => {
    expect(contactPage).toContain('<InquiryForm variant="contact" />');
  });

  it('contains the contact-only labels and submit copy', () => {
    for (const label of ['Name', 'Email', 'WhatsApp / Phone', 'Company', 'Message']) {
      expect(component).toContain(label);
    }
    expect(component).toContain('Submit Quote Request');
    expect(component).toContain('Submitting' + String.fromCodePoint(0x2026));
  });
});