import { LocaleProvider, Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/tokens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { isRTL } from '../localization';
import { BackgroundMusic } from '../components/BackgroundMusic';
import { UiSoundEffects } from '../components/UiSoundEffects';
import { StickerRewardToast } from '../components/StickerRewardToast';
import { addPurchaseStatusListener, getPremiumStatus, initializePurchases } from '../services/purchases';

export default function RootLayout() {
  const hydrate=useAppStore(s=>s.hydrate);
  const language=useAppStore(s=>s.language);
  useEffect(()=>{
    let active=true;
    let removeListener: () => void = () => {};
    void hydrate().then(()=>initializePurchases()).then(async ready=>{
      if(!active)return;
      if(!ready){useAppStore.getState().setPurchaseStatusChecked();return;}
      removeListener=addPurchaseStatusListener(isPremium=>useAppStore.getState().setVerifiedPremium(isPremium));
      const isPremium=await getPremiumStatus();
      if(active&&isPremium!==null)useAppStore.getState().setVerifiedPremium(isPremium);
    });
    return()=>{active=false;removeListener();};
  },[]);
  return <SafeAreaProvider><StatusBar style="dark"/><BackgroundMusic/><UiSoundEffects/><LocaleProvider direction={isRTL(language)?'rtl':'ltr'}><Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:colors.paper},animation:'fade'}} /><StickerRewardToast /></LocaleProvider></SafeAreaProvider>;
}
