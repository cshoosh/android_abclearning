import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ActivityTile, BigButton, RewardBanner, Screen, SectionTitle } from '../components/ui';
import { activities, animals } from '../data/content';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/tokens';
import { speak } from '../services/audio';
import { LionMascot } from '../components/LionMascot';

export default function Home() {
  const state = useAppStore();
  const [page, setPage] = useState(0);
  if (!state.hydrated) return <Screen><LionMascot size={84} /><Text style={{ fontSize: 22, fontWeight: '900' }}>Getting our jungle ready…</Text></Screen>;
  if (!state.onboarded) return <Screen scroll={false}><View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', gap: 22 }}>
    {page === 1 ? <Text style={{ fontSize: 88 }}>{state.avatar}</Text> : <LionMascot size={124} />}
    <Text style={{ fontSize: 34, fontWeight: '900', color: colors.ink, textAlign: 'center' }}>{page === 0 ? "Let’s Learn!" : page === 1 ? 'Choose a friend' : 'Sound on?'}</Text>
    <Text style={{ fontSize: 17, color: colors.muted, textAlign: 'center', fontWeight: '700' }}>{page === 0 ? 'A happy little world of letters and animals.' : page === 1 ? 'Pick an animal to be your little buddy.' : 'You can change this later with a grown-up.'}</Text>
    {page === 1 && <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 400 }}>{animals.slice(0, 8).map(a => <Pressable key={a.name} onPress={() => state.patch({ avatar: a.emoji })} style={{ width: 66, height: 66, borderRadius: 24, backgroundColor: a.color, alignItems: 'center', justifyContent: 'center', borderWidth: state.avatar === a.emoji ? 3 : 0, borderColor: colors.ink }}><Text style={{ fontSize: 34 }}>{a.emoji}</Text></Pressable>)}</View>}
    {page === 2 && <View style={{ flexDirection: 'row', gap: 12 }}><BigButton label="Sound on" emoji="🔊" onPress={() => state.patch({ voice: true, effects: true })} color={colors.green} /><BigButton label="Sound off" emoji="🔇" onPress={() => state.patch({ voice: false, effects: false })} color="#D9EAF2" /></View>}
    <BigButton label={page < 2 ? 'Next' : 'Let’s play!'} emoji={page < 2 ? '✨' : '🎉'} onPress={() => page < 2 ? setPage(page + 1) : state.patch({ onboarded: true })} color={colors.yellow} />
  </View></Screen>;
  return <Screen>
    <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}><View style={{ flex: 1 }}><Text style={{ fontSize: 13, fontWeight: '800', color: colors.muted }}>HELLO, LITTLE EXPLORER</Text><Text style={{ fontSize: 25, fontWeight: '900', color: colors.ink }}>Welcome to ABC Kids!</Text></View><Pressable accessibilityLabel={state.voice ? 'Turn voice off' : 'Turn voice on'} onPress={() => state.patch({ voice: !state.voice })} style={{ width: 44, height: 44, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 22 }}>{state.voice ? '🔊' : '🔇'}</Text></Pressable><RewardBanner onPress={() => router.push('/stickers')} /></View>
    <Pressable onPress={() => speak(`Hello ${state.nickname || 'friend'}! Let’s learn and play together.`, state.voice)} style={{ width: '100%', backgroundColor: '#DFF5FF', borderRadius: 30, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 120, overflow: 'hidden' }}><View style={{ flex: 1 }}><Text style={{ fontSize: 20, fontWeight: '900', color: colors.ink }}>Hi, {state.nickname || state.avatar}!</Text><Text style={{ fontSize: 14, color: '#42667A', fontWeight: '700', marginTop: 4 }}>Tap a picture and let’s play.</Text><Text style={{ fontSize: 12, color: '#42667A', marginTop: 8 }}>🔊 Tap me to hear a hello!</Text></View>{state.avatar === '🦁' ? <LionMascot size={88} /> : <Text style={{ fontSize: 78 }}>{state.avatar}</Text>}<Text style={{ position: 'absolute', right: 12, top: 9, fontSize: 27 }}>☁️</Text></Pressable>
    <SectionTitle>Pick a game to play</SectionTitle><View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>{activities.map(item => <ActivityTile key={item.id} title={item.title} subtitle={item.subtitle} emoji={item.emoji} color={item.color} onPress={() => router.push(item.route as never)} />)}</View>
    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}><Text style={{ fontSize: 12, color: colors.muted, fontWeight: '700' }}>Grown-ups only area</Text><Pressable onPress={() => router.push('/parent-gate')} style={{ padding: 13, backgroundColor: '#fff', borderRadius: 17 }}><Text style={{ fontSize: 15, fontWeight: '900', color: colors.ink }}>👨‍👩‍👧 Parent</Text></Pressable></View>
  </Screen>;
}
