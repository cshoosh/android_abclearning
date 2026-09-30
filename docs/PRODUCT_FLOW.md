# Product flow

## Child flow

Launch → optional child onboarding → Home → Learning Activity → Reward → Sticker/Progress → Home.

Onboarding has three short steps: welcome, optional animal buddy, and voice setting. No account or child name is required.

## Parent flow

Home → Parent Gate (press and hold for 3 seconds) → Parent Dashboard → optional authentication → Premium → Purchase / Restore → entitlement sync → Settings / Progress.

Parent-only routes also check the in-memory gate state. Leaving the parent area locks it again. The current purchase provider is a local development mock; there is no production entitlement sync yet.

## Purchase flow

Parent Gate → Premium Screen → Store Product → Purchase → verification → entitlement enabled → app content unlocked.

For development, the Store Product and verification steps are simulated locally. Production must replace them with Google Play Billing and trusted receipt validation. The UI must use localized Play prices when available.

## Restore flow

Parent Gate → Restore Purchase → verify existing purchase → update entitlement → unlock Premium.

In development, restore simulates an owned purchase so the screens can be exercised. It must not be treated as a real purchase.

## Activity loop

Activities work offline. A completed play action adds one star, a local activity completion and (when available) an animal sticker. Repeated taps in a completed challenge do not repeatedly award stars until the next round.
