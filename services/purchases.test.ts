import { Platform } from 'react-native';
import Purchases, { PACKAGE_TYPE, PURCHASES_ERROR_CODE } from 'react-native-purchases';
import {
  getPremiumStatus,
  getSubscriptionPlans,
  initializePurchases,
  purchasePremium,
  restorePremium,
} from './purchases';

jest.mock('react-native-purchases', () => ({
  __esModule: true,
  default: {
    setLogLevel: jest.fn(),
    configure: jest.fn(),
    getCustomerInfo: jest.fn(),
    getOfferings: jest.fn(),
    purchasePackage: jest.fn(),
    restorePurchases: jest.fn(),
  },
  LOG_LEVEL: { DEBUG: 'DEBUG', ERROR: 'ERROR' },
  PACKAGE_TYPE: { MONTHLY: 'MONTHLY', ANNUAL: 'ANNUAL' },
  PURCHASES_ERROR_CODE: { PURCHASE_CANCELLED_ERROR: '1' },
}));

const originalApiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
const originalPlatform = Platform.OS;

beforeEach(() => {
  jest.clearAllMocks();
  Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
  process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY = 'public_test_key';
});

afterAll(() => {
  Object.defineProperty(Platform, 'OS', { configurable: true, value: originalPlatform });
  if (originalApiKey === undefined) delete process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
  else process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY = originalApiKey;
});

describe('verified subscription provider', () => {
  test('initializes only for Android when a public SDK key is configured', async () => {
    await expect(initializePurchases()).resolves.toBe(true);
    expect(Purchases.configure).toHaveBeenCalledWith({ apiKey: 'public_test_key' });
  });

  test('returns store localized monthly and annual plans', async () => {
    const annual = { packageType: PACKAGE_TYPE.ANNUAL, product: { priceString: 'PKR 1,499.00' } };
    const monthly = { packageType: PACKAGE_TYPE.MONTHLY, product: { priceString: 'PKR 199.00' } };
    (Purchases.getOfferings as jest.Mock).mockResolvedValue({ current: { availablePackages: [monthly, annual] } });
    const plans = await getSubscriptionPlans();
    expect(plans.map(plan => [plan.id, plan.price])).toEqual([
      ['annual', 'PKR 1,499.00'],
      ['monthly', 'PKR 199.00'],
    ]);
  });

  test('unlocks only when the server-verified entitlement is active', async () => {
    (Purchases.getCustomerInfo as jest.Mock).mockResolvedValue({ entitlements: { active: { premium_access: {} } } });
    await expect(getPremiumStatus()).resolves.toBe(true);
    (Purchases.getCustomerInfo as jest.Mock).mockResolvedValue({ entitlements: { active: {} } });
    await expect(getPremiumStatus()).resolves.toBe(false);
  });

  test('handles successful subscription and restore from active entitlement', async () => {
    const activeInfo = { entitlements: { active: { premium_access: {} } } };
    (Purchases.purchasePackage as jest.Mock).mockResolvedValue({ customerInfo: activeInfo });
    (Purchases.restorePurchases as jest.Mock).mockResolvedValue(activeInfo);
    const product = { identifier: 'annual' } as never;
    await expect(purchasePremium(product)).resolves.toMatchObject({ active: true });
    await expect(restorePremium()).resolves.toMatchObject({ active: true });
  });

  test('treats a canceled purchase as a normal result', async () => {
    (Purchases.purchasePackage as jest.Mock).mockRejectedValue({ code: PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR });
    await expect(purchasePremium({ identifier: 'monthly' } as never)).resolves.toMatchObject({ active: false, cancelled: true });
  });
});
