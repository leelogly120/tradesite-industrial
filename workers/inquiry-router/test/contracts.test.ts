import { describe, expect, it } from 'vitest';
import { FIELD_LIMITS, MAX_BODY_BYTES, validateInquiry } from '../src/contracts';

const valid = {
  name: 'Jane Buyer',
  company: 'Roof Systems Ltd.',
  country: 'Canada',
  email: 'jane@roof.test',
  phone: '',
  model: 'ARC-C25',
  product: 'ARC-C25 High-Altitude Roll Forming System',
  productSlug: 'arc-c25-high-altitude-roll-forming-system',
  application: 'Industrial roofing',
  message: 'Eave height 22 m, 0.8 mm steel sheet, project in Ontario.',
  sourcePage: '/products/arc-c25-high-altitude-roll-forming-system/',
  submittedAt: '2026-07-24T10:00:00.000Z',
};

describe('inquiry contract', () => {
  it('accepts email without phone and adds server time', () => {
    const result = validateInquiry(valid, new Date('2026-07-24T10:01:00.000Z'));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.receivedAt).toBe('2026-07-24T10:01:00.000Z');
  });

  it('accepts phone without email', () => {
    const result = validateInquiry({ ...valid, email: '', phone: '+1 416 555 0182' }, new Date());
    expect(result.ok).toBe(true);
  });

  it('rejects missing contact channels', () => {
    const result = validateInquiry({ ...valid, email: '', phone: '' }, new Date());
    expect(result).toMatchObject({ ok: false, fields: { contact: expect.any(String) } });
  });

  it('rejects invalid email, placeholder country and invalid source path', () => {
    const result = validateInquiry(
      { ...valid, email: 'invalid', country: 'Select...', sourcePage: 'https://evil.test/' },
      new Date(),
    );
    expect(result).toMatchObject({
      ok: false,
      fields: {
        email: expect.any(String),
        country: expect.any(String),
        sourcePage: expect.any(String),
      },
    });
  });

  it('enforces every published limit', () => {
    expect(FIELD_LIMITS).toEqual({
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
    });
    expect(MAX_BODY_BYTES).toBe(16 * 1024);
    const result = validateInquiry({ ...valid, message: 'x'.repeat(5001) }, new Date());
    expect(result).toMatchObject({ ok: false, fields: { message: expect.any(String) } });
  });

  it('drops unknown fields from the normalized value', () => {
    const result = validateInquiry({ ...valid, admin: true }, new Date());
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).not.toHaveProperty('admin');
  });
});
