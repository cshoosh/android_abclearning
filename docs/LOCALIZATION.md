# Adding app languages

The app keeps English source text and language-specific copy in one place so screen components do not contain duplicated translations. The selected language is saved with the local progress record, and a first-time install uses the device language when it is supported.

## Current languages

- English (`en`): left-to-right interface and `en-US` speech.
- Urdu (`ur`): right-to-left interface and `ur-PK` speech.

Parents can open the language bottom sheet from Home (also available during onboarding) or Parent Settings. Learning letters stay in English, with the example word shown in Urdu as well; activity labels and instructions are translated.

## Add another language

1. Add the locale to `languageMetadata` in `localization/index.ts`, including its display name, native name, text direction, and speech locale. `AppLanguage`, `supportedLanguages`, the Home language switcher, and first-run device-language selection derive from this registry.
2. Add a translation dictionary beside `urdu` in `localization/index.ts`, then route that locale through `translateText`. English remains the fallback for strings that have not been translated yet.
3. Add a content-word dictionary and dynamic phrase rules for the new locale where activities build prompts from animal names, counts, or letter names.
4. Add the locale code to the `expo-localization` `supportedLocales` list for iOS and Android in `app.json`.
5. Add translation and metadata cases to `localization/localization.test.ts`, then review the app screens in that language, including parent forms, alerts, accessibility labels, and narrow layouts. The same language switch is available from Home and onboarding.

New copy should go into the locale dictionary rather than being translated inline in a screen. Unknown strings intentionally fall back to English so an incomplete translation remains usable while it is being finished.
