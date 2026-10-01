const MAX_BODY_BYTES = 1_048_576;
const MAX_SIGNATURE_AGE_SECONDS = 300;

const headers = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers });
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function verifyRevenueCatSignature(rawBody, signatureHeader, secret) {
  const values = Object.fromEntries(
    signatureHeader.split(',').map((part) => {
      const separator = part.indexOf('=');
      return separator === -1
        ? ['', '']
        : [part.slice(0, separator).trim(), part.slice(separator + 1).trim()];
    }),
  );
  const timestamp = values.t;
  const suppliedSignature = values.v1;
  if (!timestamp || !/^\d+$/.test(timestamp) || !suppliedSignature || !/^[a-f\d]{64}$/i.test(suppliedSignature)) {
    return false;
  }

  const timestampSeconds = Number(timestamp);
  if (!Number.isSafeInteger(timestampSeconds) || Math.abs(Date.now() / 1000 - timestampSeconds) > MAX_SIGNATURE_AGE_SECONDS) {
    return false;
  }

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${timestamp}.${rawBody}`),
  );
  const expectedSignature = Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('');
  return constantTimeEqual(expectedSignature, suppliedSignature.toLowerCase());
}

function isRevenueCatEvent(payload) {
  return Boolean(
    payload
    && typeof payload === 'object'
    && !Array.isArray(payload)
    && payload.event
    && typeof payload.event === 'object'
    && typeof payload.event.id === 'string'
    && payload.event.id.length > 0
    && typeof payload.event.type === 'string'
    && payload.event.type.length > 0,
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405);
      return json({
        service: 'abc-friends-api',
        status: 'ok',
        revenueCatWebhook: env.REVENUECAT_WEBHOOK_HMAC_SECRET ? 'configured' : 'setup_required',
      });
    }

    if (url.pathname === '/webhooks/revenuecat') {
      if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
      if (!env.REVENUECAT_WEBHOOK_HMAC_SECRET) return json({ error: 'webhook_not_configured' }, 503);

      const declaredLength = Number(request.headers.get('content-length') ?? 0);
      if (declaredLength > MAX_BODY_BYTES) return json({ error: 'payload_too_large' }, 413);

      const rawBody = await request.text();
      if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
        return json({ error: 'payload_too_large' }, 413);
      }

      const signatureHeader = request.headers.get('x-revenuecat-webhook-signature');
      if (!signatureHeader || !(await verifyRevenueCatSignature(rawBody, signatureHeader, env.REVENUECAT_WEBHOOK_HMAC_SECRET))) {
        return json({ error: 'unauthorized' }, 401);
      }

      let payload;
      try {
        payload = JSON.parse(rawBody);
      } catch {
        return json({ error: 'invalid_json' }, 400);
      }
      if (!isRevenueCatEvent(payload)) return json({ error: 'invalid_event' }, 400);

      // Keep this endpoint privacy-preserving: don't persist or log subscriber payloads.
      return json({ received: true, eventId: payload.event.id });
    }

    if (url.pathname === '/' && request.method === 'GET') {
      return json({ service: 'abc-friends-api', endpoints: ['/health', '/webhooks/revenuecat'] });
    }

    return json({ error: 'not_found' }, 404);
  },
};
