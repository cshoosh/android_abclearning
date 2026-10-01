import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { prepareParentDashboardAds, parentDashboardBannerAdUnitId } from '../services/ads';
import { useAppStore } from '../store/useAppStore';
import { Text } from './AppText';
import { appConfig } from '../config/app';

export function ParentDashboardAd() {
  const parentUnlocked = useAppStore(state => state.parentUnlocked);
  const premium = useAppStore(state => state.premium);
  const purchaseStatusChecked = useAppStore(state => state.purchaseStatusChecked);
  const [ready, setReady] = useState(false);
  const [requestUnavailable, setRequestUnavailable] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!parentUnlocked || premium || !purchaseStatusChecked || Platform.OS !== 'android') return;
    let active = true;
    void prepareParentDashboardAds().then(canRequestAds => {
      if (active) {
        setReady(canRequestAds);
        setRequestUnavailable(!canRequestAds);
      }
    });
    return () => {
      active = false;
    };
  }, [parentUnlocked, premium, purchaseStatusChecked]);

  if (!parentUnlocked || premium || !purchaseStatusChecked || Platform.OS !== 'android') return null;

  if (!ready) {
    return appConfig.adsMode === 'test' && requestUnavailable
      ? <Text style={{ marginTop: 14, fontSize: 12, fontWeight: '700', color: '#8A5B27' }}>Test ad request unavailable. Check consent and network, then reopen this page.</Text>
      : null;
  }

  return (
    <View style={{ width: '100%', alignItems: 'center', gap: 6, marginTop: 16 }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color: '#627C8B' }}>Advertisement</Text>
      <BannerAd
        unitId={parentDashboardBannerAdUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdLoaded={() => {
          if (__DEV__) console.info('[ads] Parent dashboard banner loaded.');
        }}
        onAdFailedToLoad={error => {
          setLoadError(error.message);
          if (__DEV__) console.warn('[ads] Parent dashboard banner failed to load.', error);
        }}
      />
      {appConfig.adsMode === 'test' && loadError && <Text style={{ fontSize: 12, fontWeight: '700', color: '#8A5B27' }}>Test ad failed: {loadError}</Text>}
    </View>
  );
}
