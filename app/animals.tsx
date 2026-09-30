import React from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Header, Screen } from '../components/ui';
import { animals } from '../data/content';
import { speak } from '../services/audio';
import { useAppStore } from '../store/useAppStore';
import { canAccessAnimal, gridColumns } from '../domain/access';

export default function Animals() {
  const voice = useAppStore(state => state.voice);
  const premium = useAppStore(state => state.premium);
  const { width } = useWindowDimensions();
  const columns = gridColumns(width);
  return <Screen><Header title="Animal Friends" />
    <Text style={{ fontSize: 15, color: '#617989', fontWeight: '700', alignSelf: 'flex-start' }}>Tap a friend to hear their name!</Text>
    <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
      {animals.map((animal, index) => {
        const locked = !canAccessAnimal(index, premium);
        return <Pressable key={animal.name} accessibilityLabel={locked ? 'Premium animal' : `Hear ${animal.name}`} onPress={() => locked ? router.push('/parent-gate') : speak(animal.name, voice)} style={{ width: `${100 / columns - 2}%`, minHeight: width > 600 ? 160 : 142, margin: '1%', borderRadius: 24, backgroundColor: animal.color, alignItems: 'center', justifyContent: 'center', padding: 8 }}>
          <Text style={{ fontSize: width > 600 ? 58 : 53 }}>{locked ? '🔒' : animal.emoji}</Text>
          <Text style={{ fontWeight: '900', color: '#19334D', fontSize: 14, marginTop: 4 }}>{locked ? 'More friends' : animal.name}</Text>
          <Text style={{ fontSize: 17, marginTop: 3 }}>{locked ? '' : '🔊'}</Text>
        </Pressable>;
      })}
    </View>
  </Screen>;
}
