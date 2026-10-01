import { createHmac } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import worker from './index.js';

const secret = 'test-webhook-hmac-secret';
const eventPayload = { event: { id: 'evt_test_123', type: 'INITIAL_PURCHASE' } };

function signedRequest(payload = eventPayload, timestamp = String(Math.floor(Date.now() / 1000))) {
  const body = JSON.stringify(payload);
  const signature = createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');
  return new Request('https://api.abcfriends.021labs.online/webhooks/revenuecat', {
    method: 'POST',
    headers: { 'x-revenuecat-webhook-signature': `t=${timestamp},v1=${signature}` },
    body,
  });
}

describe('ABC Friends API', () => {
  afterEach(() => vi.restoreAllMocks());

  it('returns health without revealing secret values', async () => {
    const response = await worker.fetch(new Request('https://api.abcfriends.021labs.online/health'), {
      REVENUECAT_WEBHOOK_HMAC_SECRET: secret,
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      service: 'abc-friends-api',
      status: 'ok',
      revenueCatWebhook: 'configured',
    });
  });

  it('accepts a valid RevenueCat HMAC event without logging subscriber data', async () => {
    const log = vi.spyOn(console, 'log');
    const response = await worker.fetch(signedRequest(), { REVENUECAT_WEBHOOK_HMAC_SECRET: secret });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true, eventId: 'evt_test_123' });
    expect(log).not.toHaveBeenCalled();
  });

  it('rejects unsigned events and stale signed requests', async () => {
    const unsigned = await worker.fetch(
      new Request('https://api.abcfriends.021labs.online/webhooks/revenuecat', { method: 'POST', body: '{}' }),
      { REVENUECAT_WEBHOOK_HMAC_SECRET: secret },
    );
    const stale = await worker.fetch(
      signedRequest(eventPayload, String(Math.floor(Date.now() / 1000) - 600)),
      { REVENUECAT_WEBHOOK_HMAC_SECRET: secret },
    );
    expect(unsigned.status).toBe(401);
    expect(stale.status).toBe(401);
  });

  it('fails closed when webhook signing is not configured', async () => {
    const response = await worker.fetch(signedRequest(), {});
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'webhook_not_configured' });
  });
});
