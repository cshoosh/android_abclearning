import { Platform } from 'react-native';
import {
  AdsConsent,
  AgeRestrictedTreatment,
  MaxAdContentRating,
  TestIds,
} from 'react-native-google-mobile-ads';
import mobileAds from 'react-native-google-mobile-ads';
import { appConfig } from '../config/app';

export const parentDashboardBannerAdUnitId = appConfig.adsMode === 'test'
  ? TestIds.BANNER
  : 'ca-app-pub-4477487517732949/8731020141';

let initialization: Promise<boolean> | null = null;

async function initializeChildDirectedAds(): Promise<boolean> {
  if (Platform.OS !== 'android' || !appConfig.adsEnabled) return false;

  try {
    await mobileAds().setRequestConfiguration({
      ageRestrictedTreatment: AgeRestrictedTreatment.CHILD,
      maxAdContentRating: MaxAdContentRating.G,
      publisherPrivacyPersonalizationState: 'disabled',
    });

    await AdsConsent.gatherConsent({ tagForUnderAgeOfConsent: true });
    const consent = await AdsConsent.getConsentInfo();
    if (!consent.canRequestAds) {
      if (__DEV__) console.info('[ads] UMP has not allowed ad requests for this session.');
      return false;
    }

    await mobileAds().initialize();
    return true;
  } catch {
    // Fail closed when consent or SDK initialization is unavailable.
    if (__DEV__) console.warn('[ads] Consent or SDK initialization failed; ads remain disabled.');
    return false;
  }
}

export function prepareParentDashboardAds(): Promise<boolean> {
  initialization ??= initializeChildDirectedAds().then(ready => {
    if (!ready) initialization = null;
    return ready;
  });
  return initialization;
}

export function canShowAds(): boolean {
  return Platform.OS === 'android' && appConfig.adsEnabled;
}

export async function showParentAreaTransitionAd(): Promise<boolean> {
  return false;
}

export const adsService = {
  canShowAds,
  prepareParentDashboardAds,
  showParentAreaTransitionAd,
};
