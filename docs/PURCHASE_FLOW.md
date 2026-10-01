# ABC Friends Premium subscriptions

The development mock has been removed. Android purchases use Google Play Billing through RevenueCat's native SDK and server-side receipt verification. Premium is granted only when RevenueCat reports the `premium_access` entitlement as active; a local boolean is never accepted as proof.

## Product decision

- Offer one monthly and one annual auto-renewing plan for ongoing access to the complete Premium learning library and removal of the parent-dashboard ad.
- Play internal-test prices currently configured for Pakistan: PKR 200/month and PKR 1,500/year (Play rounded the entered PKR 199 and PKR 1,499 amounts). Google Play is the source of the localized price shown to the parent. Other countries are not configured yet.
- The annual plan is equivalent to PKR 125/month, 37.5% below paying monthly for a full year at the current Pakistan prices.
- Illustrative revenue at a 15% Google Play service fee: about PKR 170 net per monthly renewal and PKR 1,275 net per annual renewal. Before taxes, refunds, withholding, chargebacks and FX. This is fee math, not a sales forecast; confirm the applicable fee in Play Console before launch.
- RevenueCat is currently free up to USD 2,500 in monthly tracked revenue, then charges 1% of tracked revenue under its current pricing. Recheck pricing before launch.

## Store and RevenueCat catalog

1. Create one Google Play subscription `abc_friends_premium` with auto-renewing base plans `monthly` (one month) and `annual` (one year); the internal-test base plans currently use PKR 200 and PKR 1,500 in Pakistan. Configure other countries intentionally before production.
2. Create a RevenueCat Android app for package `com.abckids.learning` and connect it to the Google Play app using the Play Developer API service account.
3. Add both Play base plans in RevenueCat and grant them the `premium_access` entitlement.
4. Create the `default` offering with packages `$rc_monthly` and `$rc_annual` linked to the corresponding base plans.
5. Put the RevenueCat Android public SDK key in `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY`. Do not put a Google service-account key or RevenueCat secret key in the app.
6. Set up RevenueCat webhook monitoring and verify app/package/product identifiers before opening a test track. The Cloudflare API health endpoint reports the webhook secret is configured, and RevenueCat's signed sandbox test event was delivered to the Worker and received HTTP 200.

## Client behavior

- The Premium purchase screen is behind the existing Parent Gate.
- Plans and localized prices are fetched from the live offering. The app does not invent a price or simulate a purchase when configuration is missing.
- Google Play presents the actual charge and confirms each purchase. RevenueCat verifies the transaction and entitlement before premium features unlock.
- Premium status is rechecked on launch and listens for entitlement changes; stored local progress cannot grant Premium.
- Restore checks the current Google Play account. Manage/cancel opens Google Play's subscription center. Cancellation leaves access active through the already-paid period, according to Play's subscription state.
- The paywall discloses the billing period, auto-renewal and cancellation path. No free trial is configured.
- Premium hides the Android parent-dashboard banner. Child activities remain ad-free.

## End-to-end verification

1. Configure the Play subscription, RevenueCat products/offering/entitlement, service account, and Android SDK key.
2. Build a custom Android development build; Expo Go cannot execute real billing.
3. Add license testers and use the Play internal testing track. Confirm the live monthly/yearly localized prices appear.
4. Exercise successful purchase, user cancellation, pending payment, already-owned purchase, restore after reinstall, renewal, cancellation, expiry, refund/revocation, offline launch and network recovery.
5. Confirm only an active verified entitlement unlocks Premium, the parent ad is hidden, and the app re-locks after expiration/revocation.
6. Verify the app privacy policy, Play Data Safety form, subscription listing and child/family declarations reflect RevenueCat and Google Play purchase processing.

RevenueCat dashboard, Play Console catalog/service-account setup, EAS account linking and a Play test purchase require owner account access. Do not treat app-side unit tests or an Expo Go mock as end-to-end billing verification.
