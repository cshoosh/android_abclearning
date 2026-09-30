import React from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { animals } from '../data/content';
import { gridColumns } from '../domain/access';
import { useAppStore } from '../store/useAppStore';
import { Header, Screen } from '../components/ui';

export default function Stickers() {
  const state = useAppStore();
  const { width } = useWindowDimensions();
  const columns = gridColumns(width);
  const unlocked = state.stickers;

  return (
    <Screen>
      <Header title="Sticker Book" />
      <View style={{ width: '100%', padding: 18, backgroundColor: '#FFF0C5', borderRadius: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '900', color: '#19334D' }}>Your little collection</Text>
        <Text style={{ fontSize: 16, fontWeight: '900' }}>⭐ {state.stars}</Text>
      </View>
      <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
        {animals.slice(0, state.premium ? 16 : 6).map(animal => {
          const earned = unlocked.includes(animal.name);
          return (
            <View key={animal.name} style={{ width: `${100 / columns - 2}%`, aspectRatio: 1, borderRadius: 25, backgroundColor: earned ? animal.color : '#EAF0F2', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: width > 600 ? 62 : 48, opacity: earned ? 1 : 0.35 }}>{animal.emoji}</Text>
              <Text style={{ fontSize: width > 600 ? 15 : 11, fontWeight: '900', color: earned ? '#19334D' : '#81919A', marginTop: 4 }}>{earned ? animal.name : 'Locked'}</Text>
              {earned && <Text style={{ position: 'absolute', top: 7, right: 8 }}>✨</Text>}
            </View>
          );
        })}
      </View>
      <Pressable accessibilityRole="button" onPress={() => router.replace('/')} style={{ padding: 13 }}>
        <Text style={{ fontWeight: '900', color: '#244968' }}>Keep playing to earn animal stickers! 🐾</Text>
      </Pressable>
    </Screen>
  );
}
