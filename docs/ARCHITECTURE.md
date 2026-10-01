# Architecture

ABC Friends is a single Expo Router application. The child experience works without an account or a network connection.

## Layers

- `app/`: thin route screens for child activities and parent-only tools.
- `components/`: shared visual system, activity tiles, screen shells, and a guarded parent page.
- `data/`: shared alphabet, animal, color, shape, and activity content.
- `domain/`: content access, parent gate threshold, reward collection, and responsive grid rules.
- `store/`: Zustand state for local screen updates and user actions.
- `services/`: local saving, speech, Google Play subscriptions, and parent-only ads.

## Data and privacy boundary

Child profiles, settings, and learning progress stay on the device. The app does not provide online accounts or cloud progress backup.

## Platform and responsive layout

Expo SDK 57, React Native 0.86, TypeScript strict mode, Expo Router, SQLite, Reanimated runtime, Expo Speech, and Zustand. Shared grids switch from two columns on phones to three on small tablets and four on wide tablets. Screens use a centered content width on large displays and can rotate to landscape.

## Provider boundaries

- `services/purchases.ts` uses Google Play Billing via RevenueCat. Premium access comes only from the RevenueCat-verified `premium_access` entitlement; local SQLite can never grant it.
- `services/audio.ts` uses the device's text-to-speech engine; licensed animal audio and background music are not bundled.
- `services/ads.ts` configures child-directed, G-rated, non-personalized Google Mobile Ads requests and gates initialization on consent. A banner is mounted only in the parent-gated Android dashboard.
- `config/app.ts` centralizes environment flags. Advertising stays off.
