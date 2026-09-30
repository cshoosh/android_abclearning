import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/tokens';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const hydrate=useAppStore(s=>s.hydrate);
  useEffect(()=>{void hydrate();},[hydrate]);
  return <SafeAreaProvider><StatusBar style="dark"/><Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:colors.paper},animation:'fade'}} /></SafeAreaProvider>;
}
