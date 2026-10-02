import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  PACKAGE_TYPE,
  PURCHASES_ERROR_CODE,
  type CustomerInfo,
  type PurchasesError,
  type PurchasesPackage,
} from 'react-native-purchases';

const premiumEntitlement = 'premium_access';
function getAndroidApiKey() {
  return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY?.trim();
}

export type LifetimePurchase = {
  product: PurchasesPackage;
  price: string;
  regularPrice?: string;
  promotional: boolean;
};

const standardLifetimeProductId = 'abc_friends_premium_lifetime';
const launchLifetimeProductId = 'abc_friends_premium_launch_999';

export type PurchaseResult = {
  active: boolean;
  cancelled?: boolean;
  message: string;
};

let configured = false;
let configurationAttempted = false;

export function isPurchaseConfigured() {
  return Platform.OS === 'android' && Boolean(getAndroidApiKey());
}

export async function initializePurchases(): Promise<boolean> {
  if (!isPurchaseConfigured()) return false;
  if (!configurationAttempted) {
    configurationAttempted = true;
    try {
      Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);
      Purchases.configure({ apiKey: getAndroidApiKey()! });
      configured = true;
    } catch {
      configured = false;
    }
  }
  return configured;
}

export function addPurchaseStatusListener(listener: (active: boolean) => void) {
  if (!configured) return () => undefined;
  const onCustomerInfo = (customerInfo: CustomerInfo) => listener(hasPremium(customerInfo));
  Purchases.addCustomerInfoUpdateListener(onCustomerInfo);
  return () => { Purchases.removeCustomerInfoUpdateListener(onCustomerInfo); };
}

export async function getPremiumStatus(): Promise<boolean | null> {
  if (!(await initializePurchases())) return null;
  try {
    return hasPremium(await Purchases.getCustomerInfo());
  } catch {
    // Keep the last verified in-memory state if the store cannot be reached.
    return null;
  }
}

export async function getLifetimePurchase(): Promise<LifetimePurchase | null> {
  if (!(await initializePurchases())) return null;
  const offerings = await Purchases.getOfferings();
  const lifetime = offerings.current?.availablePackages.find(item =>
    item.packageType === PACKAGE_TYPE.LIFETIME &&
    [standardLifetimeProductId, launchLifetimeProductId].includes(item.product.identifier),
  );
  if (!lifetime) return null;

  const promotional = lifetime.product.identifier === launchLifetimeProductId;
  const regularPrice = promotional
    ? offerings.all.premium_standard?.availablePackages.find(item =>
        item.packageType === PACKAGE_TYPE.LIFETIME && item.product.identifier === standardLifetimeProductId,
      )?.product.priceString
    : undefined;

  return {
    product: lifetime,
    price: lifetime.product.priceString,
    ...(regularPrice ? { regularPrice } : {}),
    promotional,
  };
}

export async function purchasePremium(product: PurchasesPackage): Promise<PurchaseResult> {
  if (!(await initializePurchases())) {
    return { active: false, message: 'The one-time purchase is not available in this build yet.' };
  }
  try {
    const { customerInfo } = await Purchases.purchasePackage(product);
    const active = hasPremium(customerInfo);
    return {
      active,
      message: active ? 'Premium is unlocked for your Google Play account. Enjoy the full learning library!' : 'The store did not confirm the purchase yet.',
    };
  } catch (error) {
    const purchaseError = error as PurchasesError;
    if (purchaseError.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR || purchaseError.userCancelled) {
      return { active: false, cancelled: true, message: 'Purchase canceled.' };
    }
    throw error;
  }
}

export async function restorePremium(): Promise<PurchaseResult> {
  if (!(await initializePurchases())) {
    return { active: false, message: 'Purchases are not available in this build yet.' };
  }
  const customerInfo = await Purchases.restorePurchases();
  const active = hasPremium(customerInfo);
  return {
    active,
    message: active ? 'Your ABC Friends purchase has been restored.' : 'No ABC Friends purchase was found for this Google Play account.',
  };
}

function hasPremium(customerInfo: CustomerInfo) {
  return Boolean(customerInfo.entitlements.active[premiumEntitlement]);
}
