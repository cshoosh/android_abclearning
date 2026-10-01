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

export type SubscriptionPlan = {
  id: 'monthly' | 'annual';
  product: PurchasesPackage;
  price: string;
};

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

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  if (!(await initializePurchases())) return [];
  const { current } = await Purchases.getOfferings();
  if (!current) return [];

  const plans: SubscriptionPlan[] = [];
  for (const product of current.availablePackages) {
    if (product.packageType === PACKAGE_TYPE.MONTHLY) {
      plans.push({ id: 'monthly', product, price: product.product.priceString });
    } else if (product.packageType === PACKAGE_TYPE.ANNUAL) {
      plans.push({ id: 'annual', product, price: product.product.priceString });
    }
  }
  return plans.sort((a, b) => (a.id === 'annual' ? -1 : b.id === 'annual' ? 1 : 0));
}

export async function purchasePremium(product: PurchasesPackage): Promise<PurchaseResult> {
  if (!(await initializePurchases())) {
    return { active: false, message: 'Subscriptions are not available in this build yet.' };
  }
  try {
    const { customerInfo } = await Purchases.purchasePackage(product);
    const active = hasPremium(customerInfo);
    return {
      active,
      message: active ? 'Premium is active. Enjoy the full learning library!' : 'The store did not confirm an active subscription yet.',
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
    return { active: false, message: 'Subscriptions are not available in this build yet.' };
  }
  const customerInfo = await Purchases.restorePurchases();
  const active = hasPremium(customerInfo);
  return {
    active,
    message: active ? 'Your subscription has been restored.' : 'No active ABC Friends subscription was found for this Google Play account.',
  };
}

function hasPremium(customerInfo: CustomerInfo) {
  return Boolean(customerInfo.entitlements.active[premiumEntitlement]);
}
