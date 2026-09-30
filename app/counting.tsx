import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BigButton, Header, Screen } from '../components/ui';
import { countRounds } from '../data/playActivities';
import { useAppStore } from '../store/useAppStore';
import { speak } from '../services/audio';

export default function Counting() {
  const state = useAppStore();
  const [round, setRound] = useState(0);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const activity = countRounds[round % countRounds.length];

  function addFood() {
    if (done) return;
    const next = count + 1;
    setCount(next);
    if (next >= activity.target) {
      setDone(true);
      state.reward('count-and-feed');
      speak(`Yummy! ${activity.friend} says thank you!`, state.voice);
    } else {
      speak(String(next), state.voice);
    }
  }

  function playAgain() {
    setRound(value => value + 1);
    setCount(0);
    setDone(false);
  }

  return (
    <Screen>
      <Header title="Count & Feed" />
      <View style={{ width: '100%', borderRadius: 30, padding: 20, alignItems: 'center', backgroundColor: '#FFF0C8', gap: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: '900', color: '#35556A' }}>Can you feed {activity.friend}?</Text>
        <Text accessibilityLabel={`${activity.friend} is hungry`} style={{ fontSize: 92 }}>{activity.friendEmoji}</Text>
        <Text style={{ fontSize: 22, fontWeight: '900', color: '#244968', textAlign: 'center' }}>Tap {activity.target} {activity.food}!</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Hear the counting prompt" onPress={() => speak(`Give ${activity.friend} ${activity.target} ${activity.food}`, state.voice)} style={{ padding: 12, backgroundColor: '#fff', borderRadius: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '900', color: '#244968' }}>🔊 Hear it</Text>
        </Pressable>
      </View>
      <View accessibilityLabel={`Plate: ${count} of ${activity.target}`} style={{ width: '100%', minHeight: 94, borderRadius: 28, backgroundColor: '#E1F3FF', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 10, padding: 12 }}>
        {Array.from({ length: activity.target }, (_, index) => <Text key={index} style={{ fontSize: 39, opacity: index < count ? 1 : 0.22 }}>{index < count ? activity.foodEmoji : '⚪'}</Text>)}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Add one ${activity.food}`}
        onPress={addFood}
        style={({ pressed }) => ({ width: '100%', minHeight: 152, borderRadius: 30, backgroundColor: '#8DD5A8', alignItems: 'center', justifyContent: 'center', transform: [{ scale: pressed ? 0.96 : 1 }] })}
      >
        <Text style={{ fontSize: 69 }}>{activity.foodEmoji}</Text>
        <Text style={{ fontSize: 21, fontWeight: '900', color: '#19334D' }}>Tap to feed!</Text>
      </Pressable>
      <Text style={{ fontSize: 20, fontWeight: '900', color: '#46667A' }}>{done ? 'Yum yum! ⭐' : `${count} of ${activity.target}`}</Text>
      {done && <BigButton label="Feed another friend" emoji="➡️" onPress={playAgain} />}
      <Text style={{ color: '#607B89', textAlign: 'center', fontWeight: '700' }}>Grown-up tip: count real snacks together after the game.</Text>
    </Screen>
  );
}
