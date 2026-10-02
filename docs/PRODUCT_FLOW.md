# Product flow

## Child flow

Launch → optional child onboarding → Home → Learning Activity → Reward → Sticker/Progress → Home.

Onboarding has three short steps: welcome, optional animal buddy, and voice setting. No account or child name is required.

## Parent flow

Home → Parent Gate (press and hold for 3 seconds) → Parent Dashboard → Premium → Purchase / Restore → Settings / Progress.

Parent-only routes also check the in-memory gate state. Leaving the parent area locks it again. Google Play purchases use RevenueCat server-side verification and entitlement sync; a missing or inactive entitlement never unlocks Premium.

## Purchase flow

Parent Gate → Premium Screen → One-time Store Product → Purchase → verification → lifetime entitlement enabled → app content unlocked.

The app loads the lifetime product and localized one-time price. Google Play Billing presents a single charge and RevenueCat verifies the transaction and entitlement before Premium unlocks.

## Restore flow

Parent Gate → Restore Purchase → verify existing purchase → update entitlement → unlock Premium.

Restore queries the current Google Play account through RevenueCat and enables Premium only when the `premium_access` entitlement is active. Previously purchased subscriptions continue to use this entitlement until their paid access ends.

## Activity loop

Activities work offline. A completed play action adds one star, a local activity completion and (when available) an animal sticker. Repeated taps in a completed challenge do not repeatedly award stars until the next round.
