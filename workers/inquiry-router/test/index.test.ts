import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { handleRequest, type Env } from '../src/index';

const payload = {
  formVariant: 'product',
  name: 'Jane Buyer',
  company: 'Roof Systems Ltd.',
  country: 'Canada',
  email: 'jane@roof.test',
  phone: '',
  model: 'ARC-C25',
  product: 'ARC-C25 High-Altitude Roll Forming System',
  productSlug: 'arc-c25-high-altitude-roll-forming-system',
  application: 'Industrial roofing',
  message: 'Eave height 22 m and 0.8 mm sheet.',
  sourcePage: '/contact/?product=ARC-C25',
  submittedAt: '2026-07-24T10:00:00.000Z',
  _gotcha: '',
};
const contactPayload = {
  formVariant: 'contact',
  name: 'Jane Buyer',
  company: '',
  country: '',
  email: 'jane@roof.test',
  phone: '+1 416 555 0198',
  model: '',
  product: 'ARC-C25',
  productSlug: '',
  application: '',
  message: '',
  sourcePage: '/contact/?product=ARC-C25',
  submittedAt: '2026-07-24T10:00:00.000Z',
  _gotcha: '',
};
const request = (
  body: Record<string, unknown> = payload,
  origin = 'https://www.arclifteq.com',
  path = '/inquiry',
) =>
  new Request(`https://worker.test${path}`, {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

const env = (allowed = true): Env => ({
  ALLOWED_ORIGINS: allowed
    ? 'https://www.arclifteq.com,https://arclifteq.com'
    : 'https://arclifteq.com',
  FORMSPREE_ENDPOINT: 'https://formspree.test/submission',
  DINGTALK_WEBHOOK_URL: 'https://dingtalk.test/robot',
  RATE_LIMITER: { limit: vi.fn().mockResolvedValue({ success: true }) },
});

const deps = (fetchMock: ReturnType<typeof vi.fn>) => ({
  fetch: fetchMock as unknown as typeof fetch,
  now: () => new Date('2026-07-24T10:01:00.000Z'),
  randomUUID: () => 'request-test-1',
});

afterEach(() => vi.restoreAllMocks());

describe('inquiry worker', () => {
  it('rejects disallowed origins before downstream calls', async () => {
    const fetchMock = vi.fn();
    const response = await handleRequest(request(), env(false), deps(fetchMock));
    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('supports an allowed CORS preflight', async () => {
    const response = await handleRequest(
      new Request('https://worker.test/inquiry', {
        method: 'OPTIONS',
        headers: { Origin: 'https://www.arclifteq.com' },
      }),
      env(),
      deps(vi.fn()),
    );
    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-origin')).toBe(
      'https://www.arclifteq.com',
    );
  });

  it('allows 127.0.0.1 in the checked-in preview CORS configuration', async () => {
    const config = JSON.parse(
      readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8'),
    ) as {
      env: { preview: { vars: { ALLOWED_ORIGINS: string } } };
    };
    const previewOrigins = config.env.preview.vars.ALLOWED_ORIGINS;
    expect(previewOrigins.split(',')).toEqual(
      expect.arrayContaining([
        'http://localhost:4321',
        'http://127.0.0.1:4321',
      ]),
    );

    const response = await handleRequest(
      new Request('https://worker.test/inquiry', {
        method: 'OPTIONS',
        headers: { Origin: 'http://127.0.0.1:4321' },
      }),
      { ...env(), ALLOWED_ORIGINS: previewOrigins },
      deps(vi.fn()),
    );
    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-origin')).toBe(
      'http://127.0.0.1:4321',
    );
  });
  it('rejects unknown paths', async () => {
    const response = await handleRequest(request(payload, 'https://www.arclifteq.com', '/other'), env(), deps(vi.fn()));
    expect(response.status).toBe(404);
  });

  it('silently accepts honeypot submissions without forwarding', async () => {
    const fetchMock = vi.fn();
    const response = await handleRequest(
      request({ ...payload, _gotcha: 'spam' }),
      env(),
      deps(fetchMock),
    );
    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns validation errors without forwarding', async () => {
    const fetchMock = vi.fn();
    const response = await handleRequest(
      request({ ...payload, email: '', phone: '' }),
      env(),
      deps(fetchMock),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      ok: false,
      code: 'VALIDATION_ERROR',
      fields: { contact: expect.any(String) },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('accepts the minimal contact payload and forwards its variant', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(
        new Response('{"errcode":0}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    const response = await handleRequest(
      request(contactPayload),
      env(),
      deps(fetchMock),
    );

    expect(response.status).toBe(200);
    const forwarded = JSON.parse(
      String(fetchMock.mock.calls[0]?.[1]?.body),
    ) as Record<string, unknown>;
    expect(forwarded).toMatchObject({
      formVariant: 'contact',
      name: 'Jane Buyer',
      email: 'jane@roof.test',
      phone: '+1 416 555 0198',
      company: '',
      message: '',
    });
  });

  it('requires name, valid email and phone for contact submissions', async () => {
    const fetchMock = vi.fn();
    const response = await handleRequest(
      request({
        ...contactPayload,
        name: '',
        email: 'not-an-email',
        phone: '',
      }),
      env(),
      deps(fetchMock),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      ok: false,
      code: 'VALIDATION_ERROR',
      fields: {
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
      },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('keeps the full product-form validation threshold', async () => {
    const fetchMock = vi.fn();
    const response = await handleRequest(
      request({
        ...payload,
        company: '',
        country: '',
        email: '',
        phone: '',
        message: '',
      }),
      env(),
      deps(fetchMock),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      fields: {
        company: expect.any(String),
        country: expect.any(String),
        contact: expect.any(String),
        message: expect.any(String),
      },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('returns 429 when the rate binding rejects the client key', async () => {
    const rateEnv = env();
    vi.mocked(rateEnv.RATE_LIMITER.limit).mockResolvedValue({ success: false });
    const fetchMock = vi.fn();
    const response = await handleRequest(request(), rateEnv, deps(fetchMock));
    expect(response.status).toBe(429);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects unsupported media types', async () => {
    const response = await handleRequest(
      new Request('https://worker.test/inquiry', {
        method: 'POST',
        headers: { Origin: 'https://www.arclifteq.com', 'Content-Type': 'text/plain' },
        body: 'not accepted',
      }),
      env(),
      deps(vi.fn()),
    );
    expect(response.status).toBe(415);
  });

  it('returns 502 and skips DingTalk when Formspree fails', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response('', { status: 500 }));
    const response = await handleRequest(request(), env(), deps(fetchMock));
    expect(response.status).toBe(502);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('returns success when Formspree succeeds but DingTalk reports failure', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(
        new Response('{"errcode":310000}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    const response = await handleRequest(request(), env(), deps(fetchMock));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, requestId: 'request-test-1' });
  });

  it('uses the preview DingTalk webhook secret name when available', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(
        new Response('{"errcode":0}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

    const previewEnv = {
      ...env(),
      DINGTALK_WEBHOOK: 'https://dingtalk.test/legacy-robot',
    };
    const response = await handleRequest(request(), previewEnv, deps(fetchMock));

    expect(response.status).toBe(200);
    expect(fetchMock.mock.calls[1]?.[0]).toBe('https://dingtalk.test/robot');
  });

  it('falls back to the legacy production DingTalk webhook secret name', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(
        new Response('{"errcode":0}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    const legacyEnv = {
      ...env(),
      DINGTALK_WEBHOOK_URL: undefined,
      DINGTALK_WEBHOOK: 'https://dingtalk.test/legacy-robot',
    } as Env;

    const response = await handleRequest(request(), legacyEnv, deps(fetchMock));

    expect(response.status).toBe(200);
    expect(fetchMock.mock.calls[1]?.[0]).toBe('https://dingtalk.test/legacy-robot');
  });

  it('keeps Formspree success and logs missing_secret when no DingTalk secret exists', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response('{}', { status: 200 }));
    const missingSecretEnv = {
      ...env(),
      DINGTALK_WEBHOOK_URL: undefined,
      DINGTALK_WEBHOOK: undefined,
    } as Env;

    const response = await handleRequest(request(), missingSecretEnv, deps(fetchMock));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, requestId: 'request-test-1' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(
      JSON.stringify({
        event: 'dingtalk_failed',
        requestId: 'request-test-1',
        status: 'missing_secret',
      }),
    );
  });

  it('targets the existing production Worker and legacy secret metadata', () => {
    const config = JSON.parse(
      readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8'),
    ) as {
      env: {
        preview: { secrets: { required: string[] } };
        production: { name: string; secrets: { required: string[] } };
      };
    };

    expect(config.env.preview.secrets.required).toEqual([
      'FORMSPREE_ENDPOINT',
      'DINGTALK_WEBHOOK_URL',
    ]);
    expect(config.env.production.name).toBe('arclift-form');
    expect(config.env.production.secrets.required).toEqual([
      'FORMSPREE_ENDPOINT',
      'DINGTALK_WEBHOOK',
    ]);
  });

  it('forwards only after successful validation and returns stable JSON', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(
        new Response('{"errcode":0}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    const response = await handleRequest(request(), env(), deps(fetchMock));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, requestId: 'request-test-1' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not include customer data in failure logs', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response('', { status: 500 }));
    await handleRequest(request(), env(), deps(fetchMock));
    const output = log.mock.calls.flat().join(' ');
    expect(output).not.toContain('Jane Buyer');
    expect(output).not.toContain('jane@roof.test');
    expect(output).not.toContain('Roof Systems Ltd.');
  });
});
