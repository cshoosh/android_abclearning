# ABC Friends API

Cloudflare Worker deployed at `https://api.abcfriends.021labs.online`.

## Endpoints

- `GET /health` reports service health and whether RevenueCat webhook signing has been configured.
- `POST /webhooks/revenuecat` accepts RevenueCat subscription events only after validating the `X-RevenueCat-Webhook-Signature` HMAC-SHA256 header and its five-minute timestamp window. The endpoint does not store or log subscriber payloads.

The mobile app continues to use RevenueCat's verified `premium_access` entitlement directly. The webhook is for secure server-to-server notifications; it does not grant premium access on the client.

## Local setup

From this folder, install the API development dependencies and run `npm test`. For local webhook testing, put `REVENUECAT_WEBHOOK_HMAC_SECRET` in `.dev.vars` (never commit it).

## Production webhook setup

1. In RevenueCat, create a webhook for `https://api.abcfriends.021labs.online/webhooks/revenuecat`, enable HMAC signing, and copy the one-time signing secret.
2. Add that same signing secret to this Worker using `npx wrangler secret put REVENUECAT_WEBHOOK_HMAC_SECRET` from this folder.
3. Send a RevenueCat test event and confirm it returns HTTP 200. A wrong/missing signature returns 401; stale signatures return 401.

RevenueCat currently gates webhooks to its Pro plan. Confirm that the project's plan includes webhooks before configuring one; do not enable a paid upgrade without the account owner's approval.
