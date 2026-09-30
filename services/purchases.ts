export type PurchaseResult = { active: boolean; message: string };
import { appConfig } from '../config/app';
// Development uses an explicit local mock. Replace with a verified Play Billing provider before release.
export async function purchasePremium(mockEnabled: boolean): Promise<PurchaseResult> {
  if (!mockEnabled || !appConfig.mockPurchases) return { active: false, message: 'Purchases are not configured yet.' };
  await new Promise(resolve => setTimeout(resolve, 650));
  return { active: true, message: 'Premium is ready on this device.' };
}
export async function restorePremium(mockEnabled: boolean): Promise<PurchaseResult> {
  await new Promise(resolve => setTimeout(resolve, 450));
  return mockEnabled && appConfig.mockPurchases ? { active: true, message: 'Your development purchase was restored.' } : { active: false, message: 'No verified purchase was found.' };
}
