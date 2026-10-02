# Privacy architecture

## MVP behavior

- Child accounts are never requested. A nickname is not required; an optional avatar and all activity progress stay in local SQLite.
- No location, contacts, microphone recordings, camera, social features, chat, ad identifier, behavioral profile, analytics SDK, or child-facing external links.
- Speech uses the operating system text-to-speech engine. No audio is recorded or uploaded.
- The app has no online account or cloud progress backup. Families can use all learning activities without signing in.
- Google Mobile Ads is linked only into Android builds for a banner shown in the parent-gated dashboard while Premium is inactive. Requests are child-directed, under-age-of-consent, G-rated, and non-personalized; SDK and consent failures suppress ads. The Android Advertising ID permission is blocked. No child activity shows an ad and no ads SDK is linked into iOS builds.
- Google Play processes adult one-time purchase billing; RevenueCat verifies transactions and serves active entitlement status. Neither receives the child's nickname, profile, or learning progress. Premium status is never trusted from local storage.

## Before release

Have counsel review age, regions, data flows and the privacy-policy draft. Verify COPPA, GDPR-K, Google Play Families, and Apple Kids Category requirements for the actual distribution and SDK choices. Publish real privacy/support/terms URLs, explain how families can delete information saved on the device, complete store disclosures, and repeat review after adding any analytics, ads, billing or cloud sync feature.
