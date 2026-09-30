# Purchase flow

Current MVP uses a local mock behind the Parent Gate. It simulates purchase success and restore to exercise parent screens. It does not charge money and does not verify a transaction.

## Production provider

1. Register `premium_lifetime` in Google Play Console and use Play Billing through a supported native provider.
2. Read and show the store's localized product price and availability.
3. Submit the purchase token to a trusted backend.
4. Verify the token and product with Google Play Developer API on the server. Never unlock from a client boolean alone.
5. Store verified transaction references in `public.entitlements`; keep client policies read-only.
6. Restore by querying store-owned purchases and asking the backend to verify them again.
7. Test pending, canceled, already-owned, network-loss, refund, and restore cases with license testers.

Do not list the suggested `$3.99` as a fixed price. Configure price and tax in Play Console. iOS can use a future StoreKit provider and server verification under the same interface.
