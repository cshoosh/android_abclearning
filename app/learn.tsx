import React, { useEffect, useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { BigButton, Header, Screen } from '../components/ui';
import { alphabet, animals } from '../data/content';
import { speak } from '../services/audio';
import { useAppStore } from '../store/useAppStore';
import { canAccessLetter } from '../domain/access';
import { colors } from '../theme/tokens';

export default function Learn() {
  const [index, setIndex] = useState(0);
  const { width } = useWindowDimensions();
  const item = alphabet[index];
  const premium = useAppStore(state => state.premium);
  const voice = useAppStore(state => state.voice);
  const patch = useAppStore(state => state.patch);
  const animalFriend = animals.find(animal => animal.name === item.animal);
  const available = premium ? alphabet : alphabet.slice(0, 6);
  const locked = !canAccessLetter(index, premium);

  useEffect(() => {
    patch({ viewedLetters: [...new Set([...useAppStore.getState().viewedLetters, item.upper])] });
  }, [index, item.upper, patch]);

  return <Screen>
    <Header title="Learn ABC" right={<Text style={{ fontSize: 14, fontWeight: '900', color: colors.ink }}>{index + 1} / 26</Text>} />
    {locked ? <View style={{ width: '100%', minHeight: 370, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1C7', borderRadius: 30, padding: 26, gap: 14 }}>
      <Text style={{ fontSize: 72 }}>🔒</Text><Text style={{ fontSize: 25, fontWeight: '900', color: colors.ink, textAlign: 'center' }}>More letters are waiting!</Text>
      <Text style={{ fontSize: 16, color: colors.muted, textAlign: 'center' }}>Ask a grown-up to open the Parent area.</Text>
      <BigButton label="For grown-ups" emoji="👨‍👩‍👧" onPress={() => router.push('/parent-gate')} />
    </View> : <View style={{ width: '100%', alignItems: 'center', gap: 14 }}>
      <View style={{ width: '100%', minHeight: width > 650 ? 420 : 365, borderRadius: 36, backgroundColor: '#FFF1C7', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingVertical: 14 }}>
        <Text style={{ position: 'absolute', top: 12, left: 18, fontSize: 38 }}>☁️</Text>
        <Text style={{ position: 'absolute', right: 10, bottom: 18, fontSize: 38 }}>🌿</Text>
        <Pressable accessibilityLabel={`Hear the letter ${item.upper}`} onPress={() => speak(item.upper, voice)} style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={{ fontSize: width > 650 ? 150 : 126, fontWeight: '900', color: '#F08A4B' }}>{item.upper}</Text>
          <Text style={{ fontSize: width > 650 ? 94 : 78, fontWeight: '900', color: '#F5B637' }}>{item.lower}</Text>
        </Pressable>
        <Pressable accessibilityLabel={`Hear ${item.word}`} onPress={() => speak(item.word, voice)} style={{ alignItems: 'center', marginTop: 1 }}>
          <Text style={{ fontSize: width > 650 ? 94 : 76 }}>{item.emoji}</Text>
          <Text style={{ fontSize: 25, fontWeight: '900', color: colors.ink, marginTop: 5 }}>{item.word}!</Text>
        </Pressable>
        {item.animal && <Pressable accessibilityLabel={`Meet ${item.animal}`} onPress={() => speak(item.animal!, voice)} style={{ marginTop: 9, paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: '#FFFFFFB8' }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#49687A' }}>🐾 Meet {item.animal} {animalFriend?.emoji ?? '🐾'}  🔊</Text>
        </Pressable>}
        <Text style={{ fontSize: 12, fontWeight: '700', color: colors.muted, marginTop: 8 }}>Tap a letter, picture or animal friend</Text>
      </View>
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <BigButton label="Back" emoji="⬅️" color="#DFF3FC" onPress={() => setIndex(Math.max(0, index - 1))} />
        <Pressable accessibilityLabel="Hear this letter and word again" onPress={() => speak(`${item.upper}. ${item.word}.`, voice)} style={{ width: 58, height: 58, borderRadius: 25, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 29 }}>🔊</Text></Pressable>
        <BigButton label="Next" emoji="➡️" color={colors.yellow} onPress={() => setIndex(Math.min(25, index + 1))} />
      </View>
    </View>}
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 7, marginTop: 9 }}>{available.map((letter, n) => <Pressable key={letter.upper} onPress={() => setIndex(n)} style={{ width: 38, height: 38, borderRadius: 14, backgroundColor: n === index ? colors.yellow : '#fff', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontWeight: '900', color: colors.ink }}>{letter.upper}</Text></Pressable>)}</View>
  </Screen>;
}
