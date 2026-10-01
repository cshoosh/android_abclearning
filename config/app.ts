export const appConfig = {
  environment: __DEV__ ? 'development' : 'production',
  adsEnabled: process.env.EXPO_PUBLIC_ADS_ENABLED !== 'false',
  // Internal and preview builds use Google's safe sample inventory by default.
  adsMode: !__DEV__ && process.env.EXPO_PUBLIC_ADS_MODE === 'production' ? 'production' : 'test',
  debugTools: __DEV__,
} as const;
