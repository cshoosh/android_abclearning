# ABC Friends

An offline-first, toddler-friendly alphabet and animal learning app for Android phones/tablets, with a path kept compatible with a future iOS build. Children never need an account. Parent settings and purchase controls sit behind a three-second hold gate.

## Stack

- Expo SDK 57 / React Native 0.86 / TypeScript strict mode
- Expo Router, Reanimated runtime, Expo SQLite, Expo Speech, Zustand
- A one-time Google Play Premium unlock through RevenueCat; Google Mobile Ads is limited to an Android parent-dashboard banner
- ESLint, Prettier and Jest

## Run the app

```sh
npm install
npm start
```

Install Expo Go on a device and scan the development QR code, or run `npm run android` with Android tooling available. `npm run ios` is for an iOS simulator with Xcode. The first screen is a three-step optional onboarding flow. Progress is stored in SQLite and remains after app restarts.

## Quality checks

```sh
npm run lint
npm run typecheck
npm test
```

## Activities

ABC lessons A–Z, generous finger tracing, 26 animal cards, find-the-letter, letter/animal matching, colors and shapes, three mini-game modes, Count & Feed, Animal Homes, Memory Match, local stars/stickers, and parent progress/settings. The free/premium limits apply to alphabet, tracing, animals, mini-game modes, and stickers. A one-time Premium purchase unlocks the full learning library and removes the parent-dashboard ad. See [the interactivity research note](docs/INTERACTIVITY_RESEARCH.md) for the design rationale.

## Android and tablet

The route layout supports portrait and landscape. The home activities flow into two columns on phones, three on smaller tablets and four on larger displays, with content centered at a comfortable maximum width. Test on device sizes around 360×800, 412×915, 600×960, 800×1280 and 1280×800. Use Android Studio emulators or real low-cost tablets and verify touch, speech, rotation, TalkBack and offline behavior.

## Environment configuration

Copy `.env.example` to `.env` to configure production purchases and advertising:

```env
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=
EXPO_PUBLIC_ADS_ENABLED=true
```

Only the RevenueCat public Android SDK key belongs in the mobile app. Never add a RevenueCat secret key or Google Play service-account key. Leave the RevenueCat key empty until the Play products and RevenueCat offering are configured; the purchase screen will not fake or grant access. Set `EXPO_PUBLIC_ADS_ENABLED=false` to disable ads.

## Purchases

The app reads the active lifetime product from Google Play through RevenueCat, displays the localized launch price and regular price, verifies entitlement, restores purchases, and removes the parent-dashboard ad after Premium is active. The launch and standard products are configured in Play and attached to the same RevenueCat entitlement. The Play Console's Pakistan price charming currently sets the entered PKR 999/1,299 amounts to PKR 1,000/1,300 at checkout. Real billing requires a custom Android development build or Play test build; Expo Go cannot make purchases. The app always shows Google Play's configured localized price.

## Advertising

Google Mobile Ads is limited to Android, with a single banner shown only after the Parent Gate in the Parent Dashboard. Child learning, tracing and gameplay remain ad-free; no ad-watched rewards or full-screen formats are used. Development and preview builds use Google's test banner unit; production builds use the configured AdMob banner unit. Requests use child-directed / under-age-of-consent treatment, G content rating and non-personalized settings, and fail closed when consent is unavailable. The Android Advertising ID permission is blocked; Google may still process IP address, ad interactions, diagnostics and other device/account identifiers. Complete AdMob consent-message and ad-review controls, confirm ad blocking categories, update store disclosures and finish legal review before release. A native development build is required; Expo Go cannot load the ads SDK.

## Audio and graphics

The app uses the device’s text-to-speech voices for letters, words and animal names; available voices depend on the device. It bundles animal sounds and short learning cues for all 26 A–Z animals, two original AI-generated interface effects (a gentle pop and a success chime), and an original 30-second AI-generated instrumental loop. Audio plays offline. Animal sounds stop after about 3.5 seconds; the background loop stays quiet, and interface sounds play for taps, bubble/balloon pops and activity rewards. Parents can control music and sound effects separately in Settings. Animal-sound credits, cue prompts and audio attribution notes are in [assets/sounds/README.md](assets/sounds/README.md), [assets/music/README.md](assets/music/README.md) and [docs/THIRD_PARTY_NOTICES.md](docs/THIRD_PARTY_NOTICES.md).

## Privacy

No child registration, camera, recording, location, contacts, social features or behavioral analytics. Child progress stays on-device. Google Mobile Ads receives Android ad requests only in the parent dashboard while Premium is inactive. Google Play and RevenueCat process adult one-time purchases, verification and restore; they receive no child nickname, profile or learning progress. See [docs/PRIVACY_ARCHITECTURE.md](docs/PRIVACY_ARCHITECTURE.md) and the [ABC Friends Privacy Policy](docs/PRIVACY_POLICY.md). Add the publisher’s legal name, postal address and telephone contact, confirm provider settings, and complete legal review and store disclosures before release.

## Production launch checklist

See [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md) before submission. Remaining production work includes the Android service-account connection, public SDK key configuration in release builds, end-to-end license tester verification, final legal/privacy review, on-device accessibility/performance QA, and store listing materials.
