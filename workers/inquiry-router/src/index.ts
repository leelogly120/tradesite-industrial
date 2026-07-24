import { MAX_BODY_BYTES, validateInquiry, type Inquiry } from './contracts';

interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  ALLOWED_ORIGINS: string;
  FORMSPREE_ENDPOINT: string;
  DINGTALK_WEBHOOK_URL?: string;
  DINGTALK_WEBHOOK?: string;
  RATE_LIMITER: RateLimiter;
}

interface Deps {
  fetch: typeof fetch;
  now: () => Date;
  randomUUID: () => string;
}

const defaultDeps: Deps = {
  fetch: globalThis.fetch.bind(globalThis),
  now: () => new Date(),
  randomUUID: () => crypto.randomUUID(),
};

class RequestProblem extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}

const allowedOrigins = (env: Env) =>
  new Set(
    env.ALLOWED_ORIGINS.split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  );

const cors = (origin: string) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Accept',
  'Access-Control-Max-Age': '86400',
  Vary: 'Origin',
});

const json = (status: number, body: unknown, origin: string) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors(origin) },
  });

async function parseBody(request: Request): Promise<Record<string, unknown>> {
  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > MAX_BODY_BYTES) throw new RequestProblem(413, 'BODY_TOO_LARGE');

  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
      throw new RequestProblem(413, 'BODY_TOO_LARGE');
    }
    try {
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      throw new RequestProblem(400, 'INVALID_JSON');
    }
  }

  if (
    contentType.includes('multipart/form-data') ||
    contentType.includes('application/x-www-form-urlencoded')
  ) {
    const form = await request.formData();
    const result: Record<string, unknown> = {};
    for (const [key, value] of form.entries()) {
      if (typeof value !== 'string') throw new RequestProblem(415, 'FILES_NOT_ALLOWED');
      result[key] = value;
    }
    if (new TextEncoder().encode(JSON.stringify(result)).byteLength > MAX_BODY_BYTES) {
      throw new RequestProblem(413, 'BODY_TOO_LARGE');
    }
    return result;
  }

  throw new RequestProblem(415, 'UNSUPPORTED_MEDIA_TYPE');
}

async function clientKey(request: Request): Promise<string> {
  const source = `${request.headers.get('cf-connecting-ip') || 'unknown'}|${
    request.headers.get('user-agent') || 'unknown'
  }`;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(source));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

const markdownCharacters = new Set('\\`*_[\\]()#+-.!>'.split(''));
const markdown = (value: string, max: number) =>
  [...value.slice(0, max)]
    .map((character) => (markdownCharacters.has(character) ? `\\${character}` : character))
    .join('');

const formspreePayload = (inquiry: Inquiry, requestId: string) => ({
  _subject: `ARCLIFT inquiry — ${inquiry.model || inquiry.product || 'Project review'}`,
  requestId,
  ...inquiry,
});

const dingTalkPayload = (inquiry: Inquiry, requestId: string) => {
  const title = inquiry.name === 'ARCLIFT TEST' ? 'ARCLIFT TEST' : 'ARCLIFT New Inquiry';
  const lines = [
    `### ${title}`,
    `- Request ID: ${markdown(requestId, 80)}`,
    `- Name: ${markdown(inquiry.name, 120)}`,
    `- Company: ${markdown(inquiry.company, 160)}`,
    `- Country: ${markdown(inquiry.country, 100)}`,
    `- Email: ${markdown(inquiry.email || 'Not supplied', 254)}`,
    `- WhatsApp / Phone: ${markdown(inquiry.phone || 'Not supplied', 50)}`,
    `- Model: ${markdown(inquiry.model || inquiry.product || 'Not sure', 160)}`,
    `- Application: ${markdown(inquiry.application || 'Not supplied', 160)}`,
    `- Source: ${markdown(inquiry.sourcePage, 500)}`,
    `- Requirements: ${markdown(inquiry.message, 800)}`,
    `- Received: ${markdown(inquiry.receivedAt, 40)}`,
  ];
  return { msgtype: 'markdown', markdown: { title, text: lines.join('\n') } };
};

export async function handleRequest(
  request: Request,
  env: Env,
  deps: Deps = defaultDeps,
): Promise<Response> {
  const origin = request.headers.get('origin') || '';
  if (!allowedOrigins(env).has(origin)) {
    return new Response(JSON.stringify({ ok: false, code: 'ORIGIN_NOT_ALLOWED' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const path = new URL(request.url).pathname;
  if (path !== '/' && path !== '/inquiry') {
    return json(404, { ok: false, code: 'NOT_FOUND' }, origin);
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors(origin) });
  }
  if (request.method !== 'POST') {
    return json(405, { ok: false, code: 'METHOD_NOT_ALLOWED' }, origin);
  }

  const requestId = deps.randomUUID();
  try {
    const raw = await parseBody(request);
    if (typeof raw._gotcha === 'string' && raw._gotcha.trim()) {
      return json(200, { ok: true, requestId }, origin);
    }

    const rate = await env.RATE_LIMITER.limit({ key: await clientKey(request) });
    if (!rate.success) return json(429, { ok: false, code: 'RATE_LIMITED' }, origin);

    const result = validateInquiry(raw, deps.now());
    if (!result.ok) {
      return json(
        400,
        { ok: false, code: 'VALIDATION_ERROR', fields: result.fields },
        origin,
      );
    }

    let formspree: Response;
    try {
      formspree = await deps.fetch(env.FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(formspreePayload(result.value, requestId)),
      });
    } catch {
      console.error(JSON.stringify({ event: 'formspree_failed', requestId, status: 'network' }));
      return json(502, { ok: false, code: 'PRIMARY_DELIVERY_FAILED' }, origin);
    }

    if (!formspree.ok) {
      console.error(
        JSON.stringify({ event: 'formspree_failed', requestId, status: formspree.status }),
      );
      return json(502, { ok: false, code: 'PRIMARY_DELIVERY_FAILED' }, origin);
    }

    const dingTalkWebhook = env.DINGTALK_WEBHOOK_URL || env.DINGTALK_WEBHOOK;
    if (!dingTalkWebhook) {
      console.error(
        JSON.stringify({ event: 'dingtalk_failed', requestId, status: 'missing_secret' }),
      );
    } else {
      try {
        const dingTalk = await deps.fetch(dingTalkWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dingTalkPayload(result.value, requestId)),
        });
        const dingTalkResult = (await dingTalk.json().catch(() => ({}))) as {
          errcode?: number;
        };
        const logicalFailure =
          typeof dingTalkResult.errcode === 'number' && dingTalkResult.errcode !== 0;
        if (!dingTalk.ok || logicalFailure) {
          const status = dingTalk.ok ? `errcode_${dingTalkResult.errcode}` : dingTalk.status;
          console.error(JSON.stringify({ event: 'dingtalk_failed', requestId, status }));
        }
      } catch {
        console.error(JSON.stringify({ event: 'dingtalk_failed', requestId, status: 'network' }));
      }
    }

    return json(200, { ok: true, requestId }, origin);
  } catch (error) {
    if (error instanceof RequestProblem) {
      return json(error.status, { ok: false, code: error.code }, origin);
    }
    console.error(JSON.stringify({ event: 'worker_failed', requestId, status: 'unexpected' }));
    return json(500, { ok: false, code: 'INTERNAL_ERROR' }, origin);
  }
}

export default {
  fetch(request: Request, env: Env) {
    return handleRequest(request, env);
  },
};
