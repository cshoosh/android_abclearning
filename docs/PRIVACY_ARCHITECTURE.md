# Privacy architecture

## MVP behavior

- Child accounts are never requested. A nickname is not required; an optional avatar and all activity progress stay in local SQLite.
- No location, contacts, microphone recordings, camera, social features, chat, ad identifier, behavioral profile, analytics SDK, or child-facing external links.
- Speech uses the operating system text-to-speech engine. No audio is recorded or uploaded.
- Supabase is optional and parent-only. Email code authentication is available only when configured. No child progress backup is currently sent.
- Advertising is disabled; no advertising SDK is bundled.
- Purchase mock is development-only and has no billing effect.

## Supabase controls

Use only the project URL and anon key in the app. Do not put the service-role key in a client build. RLS limits parent rows and backup rows to `auth.uid()`. Clients cannot create or change entitlement records. A future server must validate store receipts before writing entitlements.

## Before release

Have counsel review age, regions, data flows and the privacy-policy draft. Verify COPPA, GDPR-K, Google Play Families, and Apple Kids Category requirements for the actual distribution and SDK choices. Publish real privacy/support/terms URLs, add data retention and account deletion where applicable, complete store disclosures, and repeat review after adding any analytics, ads, auth, billing or cloud sync SDK.
