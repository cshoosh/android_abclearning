# ABC Kids

An offline-first, toddler-friendly alphabet and animal learning app for Android phones/tablets, with Expo Router and a path kept compatible with a future iOS build. Children never need an account. Parent settings, optional authentication and purchase controls sit behind a three-second hold gate.

## Stack

- Expo SDK 57 / React Native 0.86 / TypeScript strict mode
- Expo Router, Reanimated runtime, Expo SQLite, Expo Speech, Zustand
- Supabase Auth (optional parent email code) and an RLS-protected migration
- Development-only purchase mock; no billing or ads SDK is included
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

ABC lessons A–Z, generous finger tracing, 16 animal cards, find-the-letter, letter/animal matching, colors and shapes, three mini-game modes, Count & Feed, Animal Homes, Memory Match, local stars/stickers, and parent progress/settings. The three new short activities are available offline; the existing free/premium limits still apply to alphabet, tracing, animals, mini-game modes, and stickers. The Premium mock opens locked content on this device. See [the interactivity research note](docs/INTERACTIVITY_RESEARCH.md) for the design rationale.

## Android and tablet

The route layout supports portrait and landscape. The home activities flow into two columns on phones, three on smaller tablets and four on larger displays, with content centered at a comfortable maximum width. Test on device sizes around 360×800, 412×915, 600×960, 800×1280 and 1280×800. Use Android Studio emulators or real low-cost tablets and verify touch, speech, rotation, TalkBack and offline behavior.

## Environment configuration

Copy `.env.example` to `.env` if you want optional parent sign-in. Leave values empty for offline mode:

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_MOCK_PURCHASES=true
EXPO_PUBLIC_ADS_ENABLED=false
```

Only public Supabase project values belong in the mobile app. Never add the service-role key. `EXPO_PUBLIC_MOCK_PURCHASES` defaults to true for local development; remove/disable the mock for release only after wiring verified store billing. Ads default to off.

## Supabase setup

1. Create a Supabase project and configure email OTP delivery.
2. Copy its project URL and anon key to `.env`.
3. Apply `supabase/migrations/202609300001_parent_sync.sql` using the Supabase CLI or SQL editor.
4. Restart Expo after changing environment values.

Parent email-code authentication is optional. Child play remains local. The migration has owner-based RLS; entitlement rows are client read-only by design. Google/Apple parent sign-in and cloud progress backup are not implemented in this MVP.

## Purchases

The development premium flow is a local mock. It does not connect to Google Play, charge money, or create a verified entitlement. Before Play launch, configure `premium_lifetime` in Play Console, implement Google Play Billing in a supported native build, validate receipts on a trusted backend, show localized prices, and verify purchase/restore/cancel/refund behavior. Review [docs/PURCHASE_FLOW.md](docs/PURCHASE_FLOW.md).

## Advertising

Ads are disabled and no ad SDK is present. Do not enable child-directed ads without checking current Google Play Families / Apple Kids requirements, SDK eligibility, privacy disclosures and accidental-tap safeguards. No ads belong in learning or tracing interactions; no ad-watched rewards are used. Premium should remove all ads if a compliant ad product is ever added.

## Audio and graphics

The UI uses scalable emoji artwork and native text-to-speech for letters, words and animal names. Speech availability depends on voices installed on the device. There are no bundled animal sound effects or background music assets, so the corresponding settings are saved but those tracks are not played. Add only original or properly licensed assets before advertising them as included features.

## Privacy

No child registration, camera, recording, location, contacts, social features, behavioral analytics or ads. Child progress stays on-device. Parent email is used only if the optional Supabase sign-in is configured. See [docs/PRIVACY_ARCHITECTURE.md](docs/PRIVACY_ARCHITECTURE.md) and the clearly incomplete [draft policy](docs/PRIVACY_POLICY_DRAFT.md). Get legal review and complete publisher/contact/store disclosures before release.

## Production launch checklist

See [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md) before submission. Remaining production work includes a verified billing backend, production store configuration, final legal/privacy review, real sound/illustration assets if desired, on-device accessibility/performance QA, and store listing materials.
