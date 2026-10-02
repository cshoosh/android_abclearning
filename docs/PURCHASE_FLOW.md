# ABC Friends Premium one-time purchase

Android purchases use Google Play Billing through RevenueCat's native SDK and server-side receipt verification. Premium is granted only when RevenueCat reports the `premium_access` entitlement as active; a local boolean is never accepted as proof.

## Product decision

- Sell one non-consumable, one-time Premium unlock for the full learning library and removal of the parent-dashboard ad. The product does not auto-renew.
- Standard Pakistan price is PKR 1,299 and launch price is PKR 999. Google Play price charming currently rounds these to PKR 1,300 and PKR 1,000 in the buyer-facing checkout. The app uses store-returned prices so it never advertises an amount different from checkout.
- RevenueCat does not apply Google Play discount offers to one-time products. Keep a regular product and a lower-priced launch product attached to the same entitlement, and switch the current offering when the promotion ends.
- Existing buyers of the previous subscription product keep access while RevenueCat reports the same entitlement as active. Do not remove or detach the legacy subscription product from `premium_access` while existing customers may still be active.

## Store and RevenueCat catalog

1. Create and activate the Google Play one-time, non-consumable products `abc_friends_premium_lifetime` (standard) and `abc_friends_premium_launch_999` (launch price). Both are Pakistan-only and have a single Buy purchase option. The existing subscription cannot be converted into a one-time product.
2. Keep the existing RevenueCat Android app for package `com.abckids.learning` and its Google Play Developer API connection.
3. Import both one-time products into RevenueCat as non-consumables and attach each to the existing `premium_access` entitlement. Keep legacy subscription products attached for already-active customers.
4. The active `default` offering has the launch product as its `Lifetime` package. The `premium_standard` offering retains the regular lifetime product as the comparison price and as the standard price to switch back to when the promotion ends.
5. Put the RevenueCat Android public SDK key in `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY`. Do not put a Google service-account key or RevenueCat secret key in the app.
6. Confirm the RevenueCat webhook continues to receive purchase, refund and revocation events. Verify the Play app/package/product identifiers before releasing.
7. After the one-time product is tested end to end, stop offering the old subscription plans to new customers. Keep their RevenueCat entitlement mapping so existing subscribers retain access through their paid period.

## Client behavior

- The purchase screen is behind the existing Parent Gate.
- The app loads the lifetime package and store-localized price. It does not invent a price or simulate a purchase when configuration is missing.
- Google Play presents one charge; RevenueCat verifies the transaction and entitlement before Premium features unlock.
- Premium status is checked on launch and listens for entitlement changes. Stored local progress cannot grant Premium.
- Restore checks the current Google Play account. It can restore the one-time purchase and recognizes any still-active legacy subscription entitlement.
- The paywall says “Pay once” and discloses that there is no renewal or recurring charge.
- Premium hides the Android parent-dashboard banner. Child activities remain ad-free.

## End-to-end verification

1. Configure the Play one-time product, RevenueCat product/entitlement/lifetime package, service account and Android SDK key.
2. Build a custom Android development build; Expo Go cannot execute real billing.
3. Add license testers and use the Play internal testing track. Confirm the one-time localized price appears.
4. Exercise purchase, user cancellation, pending payment, already-owned purchase, restore after reinstall, refund/revocation, offline launch and network recovery.
5. Confirm only an active verified entitlement unlocks Premium, the parent ad is hidden, and refunded/revoked purchases do not leave access active.
6. Verify the privacy policy, Play Data Safety form, purchase listing and child/family declarations reflect one-time adult purchase processing.

RevenueCat dashboard, Play Console product/catalog setup, service-account connection and a Play test purchase require owner account access. Do not treat app-side tests or an Expo Go mock as end-to-end billing verification.
