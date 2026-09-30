import React from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { ParentPage } from '../components/ParentPage';
import { BigButton, Header } from '../components/ui';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/tokens';

export default function Settings() {
  const state = useAppStore();
  const audioOptions = [['Voice', 'voice', '🗣️'], ['Music', 'music', '🎵'], ['Sound effects', 'effects', '🔔']] as const;
  return <ParentPage><Header title="Settings" />
    <Text style={{ fontSize: 16, fontWeight: '900', color: colors.ink, alignSelf: 'flex-start' }}>Child profile</Text>
    <TextInput value={state.nickname} onChangeText={nickname => state.patch({ nickname })} maxLength={12} placeholder="Optional nickname" accessibilityLabel="Optional child nickname" style={{ width: '100%', backgroundColor: '#fff', padding: 16, borderRadius: 18, fontSize: 16 }} />
    <View style={{ flexDirection: 'row', gap: 9, flexWrap: 'wrap', justifyContent: 'center' }}>{['🦁', '🐼', '🐘', '🐸', '🐱', '🦒', '🐰', '🐧'].map(avatar => <Pressable key={avatar} accessibilityLabel={`Choose ${avatar} buddy`} onPress={() => state.patch({ avatar })} style={{ width: 54, height: 54, borderRadius: 18, backgroundColor: avatar === state.avatar ? '#FFE7A3' : '#fff', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 29 }}>{avatar}</Text></Pressable>)}</View>
    <Text style={{ fontSize: 16, fontWeight: '900', color: colors.ink, alignSelf: 'flex-start', marginTop: 12 }}>Sound controls</Text>
    {audioOptions.map(([label, key, emoji]) => <Pressable key={key} onPress={() => state.patch({ [key]: !state[key] })} style={{ width: '100%', padding: 18, borderRadius: 21, backgroundColor: '#fff', marginTop: 7, flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontSize: 17, fontWeight: '900', color: colors.ink }}>{emoji}  {label}</Text><Text style={{ fontSize: 16, fontWeight: '900', color: state[key] ? '#4A9B68' : '#788995' }}>{state[key] ? 'ON' : 'OFF'}</Text></Pressable>)}
    <BigButton label="Reset all progress" emoji="🗑️" color="#FFE0DE" onPress={() => Alert.alert('Reset this device?', 'This clears stars, stickers and activity progress. Your profile and Premium access will stay.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Reset progress', style: 'destructive', onPress: state.reset }])} />
    <Text style={{ fontSize: 12, color: '#687B89', textAlign: 'center' }}>Resetting progress does not cancel a store subscription or purchase.</Text>
  </ParentPage>;
}
