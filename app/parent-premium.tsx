import { Text } from '../components/AppText';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { ParentPage } from '../components/ParentPage';
import { BigButton, Header } from '../components/ui';
import { useAppStore } from '../store/useAppStore';
import {
  getSubscriptionPlans,
  isPurchaseConfigured,
  purchasePremium,
  restorePremium,
  type SubscriptionPlan,
} from '../services/purchases';

export default function Premium() {
  const state = useAppStore();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const configured = isPurchaseConfigured();
  const selected = useMemo(() => plans.find(plan => plan.id === selectedPlan) ?? plans[0], [plans, selectedPlan]);

  useEffect(() => {
    let active = true;
    void getSubscriptionPlans().then(availablePlans => {
      if (!active) return;
      setPlans(availablePlans);
      if (availablePlans.length === 0) setLoadError('Subscriptions are not set up for this build yet.');
    }).catch(() => {
      if (active) setLoadError('Plans could not be loaded. Check your connection and try again.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  async function buy() {
    if (!selected || busy) return;
    setBusy(true);
    try {
      const result = await purchasePremium(selected.product);
      if (result.active) state.setVerifiedPremium(true);
      if (!result.cancelled) Alert.alert(result.active ? 'Subscription active' : 'Not completed', result.message);
    } catch {
      Alert.alert('Please try again', 'Google Play could not complete this purchase. No subscription was activated.');
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
      Alert.alert(result.active ? 'Subscription restored' : 'No subscription found', result.message);
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
          <Text style={{ fontSize: 12, lineHeight: 17, color: '#4D687A' }}>Your payment and subscription are managed by Google Play.</Text>
        </View>
      </View>

      {state.premium ? (
        <>
          <Text style={{ fontSize: 18, fontWeight: '900', color: '#4D9865', textAlign: 'center' }}>Premium is active ⭐</Text>
          <BigButton label="Manage subscription" emoji="⚙️" onPress={() => void Linking.openURL('https://play.google.com/store/account/subscriptions')} color="#DFF3FC" />
        </>
      ) : (
        <>
          {plans.map(plan => {
            const chosen = selected?.id === plan.id;
            return (
              <Pressable
                key={plan.id}
                accessibilityRole="radio"
                accessibilityState={{ checked: chosen }}
                onPress={() => setSelectedPlan(plan.id)}
                style={{ width: '100%', padding: 17, borderRadius: 20, borderWidth: 2, borderColor: chosen ? '#35A3CE' : '#E2EAF0', backgroundColor: chosen ? '#E8F8FF' : '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <View>
                  <Text style={{ fontSize: 17, fontWeight: '900', color: '#19334D' }}>{plan.id === 'annual' ? 'Annual' : 'Monthly'}</Text>
                  <Text style={{ fontSize: 12, color: '#687B89', marginTop: 3 }}>{plan.id === 'annual' ? 'Billed once each year' : 'Billed once each month'}</Text>
                </View>
                <Text style={{ fontSize: 18, fontWeight: '900', color: '#19334D' }}>{plan.price}</Text>
              </Pressable>
            );
          })}

          {loading ? <ActivityIndicator accessibilityLabel="Loading subscription plans" /> : null}
          {!!loadError && !loading ? <Text accessibilityLiveRegion="polite" style={{ fontSize: 13, color: '#8A4C3E', textAlign: 'center' }}>{loadError}</Text> : null}
          {selected && configured ? (
            <>
              <BigButton label={busy ? 'Please wait…' : `Subscribe · ${selected.price}`} emoji="💎" onPress={() => void buy()} color="#FFD34F" />
              <Text style={{ fontSize: 12, color: '#687B89', textAlign: 'center', lineHeight: 18 }}>
                Automatically renews {selected.id === 'annual' ? 'each year' : 'each month'} until canceled. Cancel anytime in Google Play subscriptions. The price shown by Google Play is charged to your Google Play account. No free trial is included.
              </Text>
            </>
          ) : null}
        </>
      )}

      <BigButton label={busy ? 'Please wait…' : 'Restore purchases'} emoji="↻" onPress={() => void restore()} color="#DFF3FC" />
      <Pressable accessibilityRole="link" onPress={() => router.push('/privacy-policy')}>
        <Text style={{ color: '#276E8B', fontSize: 13, textDecorationLine: 'underline' }}>Privacy policy</Text>
      </Pressable>
      <Text style={{ fontSize: 12, color: '#687B89', textAlign: 'center' }}>Purchases are managed by Google Play. Premium access is verified by RevenueCat and is not stored as a local purchase flag.</Text>
      <BigButton label="Back to parent area" onPress={() => router.replace('/parent')} color="#EAF2F5" small />
    </ParentPage>
  );
}
