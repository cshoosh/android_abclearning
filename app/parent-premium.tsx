import { Text } from '../components/AppText';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { ParentPage } from '../components/ParentPage';
import { BigButton, Header } from '../components/ui';
import { useAppStore } from '../store/useAppStore';
import {
  getLifetimePurchase,
  isPurchaseConfigured,
  purchasePremium,
  restorePremium,
  type LifetimePurchase,
} from '../services/purchases';

export default function Premium() {
  const state = useAppStore();
  const [lifetimePurchase, setLifetimePurchase] = useState<LifetimePurchase | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const configured = isPurchaseConfigured();
  useEffect(() => {
    let active = true;
    void getLifetimePurchase().then(availablePurchase => {
      if (!active) return;
      setLifetimePurchase(availablePurchase);
      if (!availablePurchase) setLoadError('The one-time Premium purchase is not set up for this build yet.');
    }).catch(() => {
      if (active) setLoadError('The purchase price could not be loaded. Check your connection and try again.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  async function buy() {
    if (!lifetimePurchase || busy) return;
    setBusy(true);
    try {
      const result = await purchasePremium(lifetimePurchase.product);
      if (result.active) state.setVerifiedPremium(true);
      if (!result.cancelled) Alert.alert(result.active ? 'Premium unlocked' : 'Not completed', result.message);
    } catch {
      Alert.alert('Please try again', 'Google Play could not complete this purchase. Premium was not unlocked.');
    } finally {
      setBusy(false);
    }
  }

  async function restore() {
    if (busy) return;
    setBusy(true);
    try {
      const result = await restorePremium();
      state.setVerifiedPremium(result.active);
      Alert.alert(result.active ? 'Purchase restored' : 'No purchase found', result.message);
    } catch {
      Alert.alert('Please try again', 'Google Play could not check your purchases right now.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ParentPage>
      <Header title="ABC Friends Premium" />
      <View style={{ width: '100%', borderRadius: 28, backgroundColor: '#FFF0C4', padding: 24, alignItems: 'center', gap: 11 }}>
        <Text style={{ fontSize: 67 }}>🌟</Text>
        <Text style={{ fontSize: 26, fontWeight: '900', color: '#19334D', textAlign: 'center' }}>Open the whole jungle</Text>
        {['All 26 letters and tracing', '26 animal friends', 'All games, colors and shapes', 'Every sticker', 'No ads in ABC Friends'].map(row => (
          <Text key={row} style={{ fontSize: 15, fontWeight: '700', color: '#4D687A' }}>✓  {row}</Text>
        ))}
      </View>

      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 20, backgroundColor: '#E8F8FF' }}>
        <Image
          source={require('../assets/branding/payment-secure.png')}
          accessibilityLabel="Wallet and lock payment illustration"
          style={{ width: 68, height: 68 }}
          resizeMode="contain"
        />
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={{ fontSize: 15, fontWeight: '900', color: '#19334D' }}>Google Play checkout</Text>
          <Text style={{ fontSize: 12, lineHeight: 17, color: '#4D687A' }}>One secure payment through Google Play. No subscription or renewal.</Text>
        </View>
      </View>

      {state.premium ? (
        <>
          <Text style={{ fontSize: 18, fontWeight: '900', color: '#4D9865', textAlign: 'center' }}>Premium is unlocked ⭐</Text>
          <Text style={{ fontSize: 13, color: '#687B89', textAlign: 'center' }}>This Google Play account has access to the full learning library.</Text>
        </>
      ) : (
        <>
          <View style={{ width: '100%', padding: 17, borderRadius: 20, backgroundColor: '#E8F8FF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ fontSize: 17, fontWeight: '900', color: '#19334D' }}>Lifetime Premium</Text>
              <Text style={{ fontSize: 12, color: '#687B89', marginTop: 3 }}>Pay once · Keep it forever</Text>
            </View>
            {lifetimePurchase && (
              <View style={{ alignItems: 'flex-end', gap: 2 }}>
                {lifetimePurchase.promotional && lifetimePurchase.regularPrice ? (
                  <Text style={{ fontSize: 12, color: '#687B89', textDecorationLine: 'line-through' }}>{lifetimePurchase.regularPrice}</Text>
                ) : null}
                <Text style={{ fontSize: 18, fontWeight: '900', color: '#19334D' }}>{lifetimePurchase.price}</Text>
                {lifetimePurchase.promotional ? <Text style={{ fontSize: 11, fontWeight: '800', color: '#D17B00' }}>Launch offer</Text> : null}
              </View>
            )}
          </View>

          {loading ? <ActivityIndicator accessibilityLabel="Loading one-time purchase" /> : null}
          {!!loadError && !loading ? <Text accessibilityLiveRegion="polite" style={{ fontSize: 13, color: '#8A4C3E', textAlign: 'center' }}>{loadError}</Text> : null}
          {lifetimePurchase && configured ? (
            <>
              <BigButton label={busy ? 'Please wait…' : `Unlock forever · ${lifetimePurchase.price}`} emoji="💎" onPress={() => void buy()} color="#FFD34F" />
              <Text style={{ fontSize: 12, color: '#687B89', textAlign: 'center', lineHeight: 18 }}>
                One payment through Google Play unlocks Premium for this account. No renewal or recurring charge. The store shows the final price before you confirm.
              </Text>
            </>
          ) : null}
        </>
      )}

      <BigButton label={busy ? 'Please wait…' : 'Restore purchases'} emoji="↻" onPress={() => void restore()} color="#DFF3FC" />
      <Pressable accessibilityRole="link" onPress={() => router.push('/privacy-policy')}>
        <Text style={{ color: '#276E8B', fontSize: 13, textDecorationLine: 'underline' }}>Privacy policy</Text>
      </Pressable>
      <Text style={{ fontSize: 12, color: '#687B89', textAlign: 'center' }}>Google Play handles payment. RevenueCat verifies Premium access. Restore purchases to recover access on this account.</Text>
      <BigButton label="Back to parent area" onPress={() => router.replace('/parent')} color="#EAF2F5" small />
    </ParentPage>
  );
}
