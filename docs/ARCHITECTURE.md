# Architecture

ABC Kids is a single Expo Router application. The child experience works without an account or a network connection.

## Layers

- `app/`: thin route screens for child activities and parent-only tools.
- `components/`: shared visual system, activity tiles, screen shells, and a guarded parent page.
- `data/`: shared alphabet, animal, color, shape, and activity content.
- `domain/`: content access, parent gate threshold, reward collection, and responsive grid rules.
- `store/`: Zustand state for local screen updates and user actions.
- `services/`: SQLite persistence, speech, optional parent authentication, purchase provider seam, and the disabled ads provider seam.
- `supabase/migrations/`: optional parent-owned account, purchase entitlement and backup schema with RLS.

## Data and privacy boundary

One SQLite row stores only local app progress and the optional nickname/avatar/settings. A child does not have a remote identity. Supabase authentication is only for an adult entering an email code. The anon key is public client configuration; service-role keys must stay on a trusted server. No cloud backup of child activity is turned on in this MVP.

## Platform and responsive layout

Expo SDK 57, React Native 0.86, TypeScript strict mode, Expo Router, SQLite, Reanimated runtime, Expo Speech, and Zustand. Shared grids switch from two columns on phones to three on small tablets and four on wide tablets. Screens use a centered content width on large displays and can rotate to landscape.

## Provider boundaries

- `services/purchases.ts` is a development mock seam. Production must call Play Billing and verify the receipt with a trusted service before enabling premium.
- `services/supabase.ts` is optional and only creates an auth client when both public environment values are present.
- `services/audio.ts` uses the device's text-to-speech engine; licensed animal audio and background music are not bundled.
- `services/ads.ts` is a centralized no-op seam. No ad SDK is installed, and the service cannot show an ad until a child-directed provider is reviewed and connected.
- `config/app.ts` centralizes environment flags. Advertising stays off.
