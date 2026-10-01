import { Text } from '../components/AppText';
import React from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';
import { ParentPage } from '../components/ParentPage';
import { BigButton, Header, LanguageSwitcher } from '../components/ui';
import { useAppStore } from '../store/useAppStore';
import { AnimalIllustration } from '../components/AnimalIllustration';
import { animals } from '../data/content';

const avatarOptions = [
  { name: 'Lion', emoji: '🦁' },
  ...animals.filter(animal => ['Panda', 'Elephant', 'Frog', 'Cat', 'Giraffe', 'Rabbit'].includes(animal.name)),
  { name: 'Penguin', emoji: '🐧' },
];
import { colors } from '../theme/tokens';
import { isRTL, translateText } from '../localization';

export default function Settings() {
  const state = useAppStore();
  const audioOptions = [['Voice', 'voice', '🗣️'], ['Music', 'music', '🎵'], ['Sound effects', 'effects', '🔔']] as const;
  return <ParentPage><Header title="Settings" />
    <LanguageSwitcher />
    <Text style={{ fontSize: 16, fontWeight: '900', color: colors.ink, alignSelf: 'flex-start' }}>Child profile</Text>
    <TextInput value={state.nickname} onChangeText={nickname => state.patch({ nickname })} maxLength={12} placeholder={translateText('Optional nickname', state.language)} accessibilityLabel={translateText('Optional child nickname', state.language)} style={{ width: '100%', backgroundColor: '#fff', padding: 16, borderRadius: 18, fontSize: 16, writingDirection: isRTL(state.language) ? 'rtl' : 'ltr', textAlign: isRTL(state.language) ? 'right' : 'left' }} />
    <View style={{ flexDirection: 'row', gap: 9, flexWrap: 'wrap', justifyContent: 'center' }}>{avatarOptions.map(avatar => <Pressable key={avatar.name} accessibilityRole="button" accessibilityLabel={`${translateText(avatar.name, state.language)} ${translateText('Choose buddy', state.language)}`} accessibilityState={{ selected:avatar.emoji === state.avatar }} onPress={() => state.patch({ avatar: avatar.emoji })} style={{ width: 58, height: 58, borderRadius: 18, backgroundColor: avatar.emoji === state.avatar ? '#FFE7A3' : '#fff', alignItems: 'center', justifyContent: 'center' }}><AnimalIllustration name={avatar.name} emoji={avatar.emoji} size={40} /></Pressable>)}</View>
    <Text style={{ fontSize: 16, fontWeight: '900', color: colors.ink, alignSelf: 'flex-start', marginTop: 12 }}>Sound controls</Text>
    {audioOptions.map(([label, key, emoji]) => <Pressable key={key} onPress={() => state.patch({ [key]: !state[key] })} style={{ width: '100%', padding: 18, borderRadius: 21, backgroundColor: '#fff', marginTop: 7, flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontSize: 17, fontWeight: '900', color: colors.ink }}>{emoji}  {label}</Text><Text style={{ fontSize: 16, fontWeight: '900', color: state[key] ? '#4A9B68' : '#788995' }}>{state[key] ? 'ON' : 'OFF'}</Text></Pressable>)}
    <Text style={{ fontSize: 11, color: '#687B89', textAlign: 'center' }}>Music and sound effects generated with Stable Audio 3.0 · Powered by Stability AI</Text>
    <BigButton label="Reset all progress" emoji="🗑️" color="#FFE0DE" onPress={() => Alert.alert(translateText('Reset this device?', state.language), translateText('This clears stars, stickers and activity progress. Your profile and Premium access will stay.', state.language), [{ text: translateText('Cancel', state.language), style: 'cancel' }, { text: translateText('Reset progress', state.language), style: 'destructive', onPress: state.reset }])} />
    <Text style={{ fontSize: 12, color: '#687B89', textAlign: 'center' }}>Resetting progress does not cancel a store subscription or purchase.</Text>
  </ParentPage>;
}
