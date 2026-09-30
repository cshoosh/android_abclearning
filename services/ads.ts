import { appConfig } from '../config/app';

/**
 * Ad provider seam. No advertising SDK is installed or initialized in this MVP.
 * Keep the provider null until child-directed eligibility and store disclosures
 * have been reviewed for the actual launch markets.
 */
export interface AdsProvider {
  showParentAreaTransition(): Promise<boolean>;
}

let provider: AdsProvider | null = null;

export function canShowAds(): boolean {
  return appConfig.adsEnabled && provider !== null;
}

export async function showParentAreaTransitionAd(): Promise<boolean> {
  if (!canShowAds() || !provider) return false;
  return provider.showParentAreaTransition();
}

/** Provider registration is intentionally unavailable until a reviewed SDK is selected. */
export const adsService = {
  canShowAds,
  showParentAreaTransitionAd,
};
