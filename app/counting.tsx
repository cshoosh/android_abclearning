import { Text } from '../components/AppText';
import React, { useState } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { BigButton, Header, Screen } from '../components/ui';
import { createCountRounds } from '../data/playActivities';
import { useAppStore } from '../store/useAppStore';
import { speak } from '../services/audio';
import { translateText } from '../localization';
import Animated, { ZoomIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { AnimalIllustration } from '../components/AnimalIllustration';

export default function Counting() {
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const state = useAppStore();
  const [rounds, setRounds] = useState(() => createCountRounds());
  const [round, setRound] = useState(0);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const activity = rounds[round];

  function addFood() {
    if (done) return;
    const next = count + 1;
    setCount(next);
    if (next >= activity.target) {
      setDone(true);
      state.reward('count-and-feed', activity.friend);
      speak(`Hooray! ${activity.friend} is full!`, state.voice, state.language);
    } else {
      speak(String(next), state.voice, state.language);
    }
  }

  function playAgain() {
    if (round + 1 < rounds.length) {
      setRound(value => value + 1);
    } else {
      setRounds(createCountRounds(activity.friend));
      setRound(0);
    }
    setCount(0);
    setDone(false);
  }

  return (
    <Screen>
      <Header title="Count & Feed" />
      <View style={{ width: '100%', flexDirection: landscape ? 'row' : 'column', alignItems: 'stretch', justifyContent: 'space-between', gap: 12 }}>
      <View style={{ width: landscape ? '37%' : '100%', borderRadius: 30, padding: landscape ? 13 : 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF0C8', gap: landscape ? 6 : 10 }}>
        <Text style={{ fontSize: 18, fontWeight: '900', color: '#35556A' }}>Can you feed {activity.friend}?</Text>
        <View accessibilityLabel={translateText(`${activity.friend} is hungry`, state.language)}><AnimalIllustration name={activity.friend} emoji={activity.friendEmoji} size={landscape ? 70 : 100} /></View>
        <Text style={{ fontSize: 22, fontWeight: '900', color: '#244968', textAlign: 'center' }}>Tap {activity.target} {activity.food}!</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={translateText('Hear the counting prompt', state.language)} onPress={() => speak(`Give ${activity.friend} ${activity.target} ${activity.food}`, true, state.language)} style={{ padding: 12, backgroundColor: '#fff', borderRadius: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '900', color: '#244968' }}>🔊 Hear it</Text>
        </Pressable>
      </View>
      <View style={{ width: landscape ? '61%' : '100%', gap: landscape ? 8 : 14, alignItems: 'center' }}>
      <View accessibilityLabel={translateText(`Plate: ${count} of ${activity.target}`, state.language)} style={{ width: '100%', minHeight: landscape ? 74 : 94, borderRadius: 28, backgroundColor: '#E1F3FF', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 10, padding: 12 }}>
        {Array.from({ length: activity.target }, (_, index) => index < count ? <Animated.View key={index} entering={ZoomIn.springify().damping(15)} layout={LinearTransition.duration(160)}><Text style={{ fontSize: 39 }}>{activity.foodEmoji}</Text></Animated.View> : <Text key={index} style={{ fontSize: 39, opacity: 0.22 }}>⚪</Text>)}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={translateText(`Feed ${activity.friend} ${activity.food}`, state.language)}
        onPress={addFood}
        style={({ pressed }) => ({ width: '100%', minHeight: landscape ? Math.min(142, height * 0.35) : 152, borderRadius: 30, backgroundColor: '#8DD5A8', alignItems: 'center', justifyContent: 'center', transform: [{ scale: pressed ? 0.96 : 1 }] })}
      >
        <Text style={{ fontSize: 69 }}>{activity.foodEmoji}</Text>
        <Text style={{ fontSize: 21, fontWeight: '900', color: '#19334D' }}>Tap to feed!</Text>
      </Pressable>
      </View>
      </View>
      <Text style={{ fontSize: 20, fontWeight: '900', color: '#46667A' }}>{done ? 'Yum yum! ⭐' : `${count} of ${activity.target}`}</Text>
      {done && <Animated.View entering={FadeInDown.duration(220)}><BigButton label="Feed another friend" emoji="➡️" onPress={playAgain} /></Animated.View>}
      <Text style={{ color: '#607B89', textAlign: 'center', fontWeight: '700' }}>Grown-up tip: count real snacks together after the game.</Text>
    </Screen>
  );
}
