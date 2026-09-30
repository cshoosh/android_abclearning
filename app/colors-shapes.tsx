import React, { useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Header, Pill, Screen } from '../components/ui';
import { colorsAndShapes } from '../data/content';
import { gridColumns } from '../domain/access';
import { speak } from '../services/audio';
import { useAppStore } from '../store/useAppStore';

export default function ColorsShapes() {
  const [mode, setMode] = useState<'Colors' | 'Shapes'>('Colors');
  const [selected, setSelected] = useState('');
  const state = useAppStore();
  const { width } = useWindowDimensions();
  const columns = gridColumns(width);
  const values = mode === 'Colors' ? colorsAndShapes.slice(0, 7) : colorsAndShapes.slice(7);

  return (
    <Screen>
      <Header title="Colors & Shapes" />
      <View style={{ flexDirection: 'row', gap: 9 }}>
        <Pill label="Colors" active={mode === 'Colors'} onPress={() => { setMode('Colors'); setSelected(''); }} />
        <Pill label="Shapes" active={mode === 'Shapes'} onPress={() => { setMode('Shapes'); setSelected(''); }} />
      </View>
      <Text style={{ fontSize: 17, fontWeight: '800', color: '#5A7483', textAlign: 'center' }}>
        Tap each one and say it together!
      </Text>
      <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 11 }}>
        {values.map((value, index) => {
          const locked = !state.premium && index > 3;
          return (
            <Pressable
              key={value.name}
              accessibilityRole="button"
              accessibilityLabel={locked ? 'More to explore, locked' : value.name}
              onPress={() => locked ? router.push('/parent-gate') : (setSelected(value.name), speak(value.name, state.voice))}
              style={{
                width: `${100 / columns - 2}%`,
                minHeight: width > 600 ? 182 : 153,
                borderRadius: 27,
                backgroundColor: value.color,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: selected === value.name ? 4 : 0,
                borderColor: '#fff',
              }}
            >
              <Text style={{ fontSize: width > 600 ? 68 : 57 }}>{locked ? '🔒' : value.emoji}</Text>
              <Text style={{ fontWeight: '900', fontSize: width > 600 ? 21 : 18, color: '#19334D' }}>
                {locked ? 'More to explore' : value.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {selected !== '' && (
        <Text style={{ fontSize: 22, fontWeight: '900', color: '#284C65' }}>
          That’s {selected}! {mode === 'Colors' ? '🌈' : '✨'}
        </Text>
      )}
    </Screen>
  );
}
