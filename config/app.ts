export const appConfig = {
  environment: __DEV__ ? 'development' : 'production',
  mockPurchases: process.env.EXPO_PUBLIC_MOCK_PURCHASES !== 'false',
  adsEnabled: process.env.EXPO_PUBLIC_ADS_ENABLED === 'true',
  supabaseEnabled: Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
  debugTools: __DEV__,
} as const;
