import { Text } from '../components/AppText';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { BigButton, Header, Screen } from '../components/ui';
import { getLearningLetters, getSpokenLearningWord, getSpokenLetterName } from '../data/learningLetters';
import { speak } from '../services/audio';
import { useAppStore } from '../store/useAppStore';
import { canAccessLetter } from '../domain/access';
import { colors } from '../theme/tokens';
import Animated, { FadeIn, FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import { translateLearningWord, translateText } from '../localization';
import { AnimalIllustration } from '../components/AnimalIllustration';
import { animals } from '../data/content';

export default function Learn() {
  const [index, setIndex] = useState(0);
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const premium = useAppStore(state => state.premium);
  const language = useAppStore(state => state.language);
  const patch = useAppStore(state => state.patch);
  const alphabet = getLearningLetters(language);
  const item = alphabet[index];
  const available = premium ? alphabet : alphabet.slice(0, 6);
  const locked = !canAccessLetter(index, premium);

  useEffect(() => {
    const key = language === 'ur' ? `ur:${item.upper}` : item.upper;
    patch({ viewedLetters: [...new Set([...useAppStore.getState().viewedLetters, key])] });
  }, [index, item.upper, language, patch]);

  return <Screen>
    <Header title="Learn ABC" right={<Text style={{ fontSize: 14, fontWeight: '900', color: colors.ink }}>{index + 1} / {alphabet.length}</Text>} />
    {locked ? <Animated.View entering={FadeInDown.duration(220)} layout={LinearTransition.duration(180)} style={{ width: '100%', minHeight: 370, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1C7', borderRadius: 30, padding: 26, gap: 14 }}>
      <Text style={{ fontSize: 72 }}>🔒</Text><Text style={{ fontSize: 25, fontWeight: '900', color: colors.ink, textAlign: 'center' }}>More letters are waiting!</Text>
      <Text style={{ fontSize: 16, color: colors.muted, textAlign: 'center' }}>Ask a grown-up to open the Parent area.</Text>
      <BigButton label="For grown-ups" emoji="👨‍👩‍👧" onPress={() => router.push('/parent-gate')} />
    </Animated.View> : <Animated.View key={index} entering={FadeIn.duration(180)} exiting={FadeOut.duration(100)} layout={LinearTransition.duration(180)} style={{ width: '100%', alignItems: 'center', gap: 14 }}>
      <View style={{ width: '100%', minHeight: landscape ? Math.min(265, height - 150) : width > 650 ? 420 : 365, borderRadius: 36, backgroundColor: '#FFF1C7', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingVertical: landscape ? 8 : 14 }}>
        <Text style={{ position: 'absolute', top: 12, left: 18, fontSize: 38 }}>☁️</Text>
        <Text style={{ position: 'absolute', right: 10, bottom: 18, fontSize: 38 }}>🌿</Text>
        <Pressable accessibilityLabel={language === 'ur' ? `حرف ${item.upper} سنیں` : translateText(`Hear the letter ${item.upper}`, language)} onPress={() => speak(getSpokenLetterName(item, language), true, language)} style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          {language === 'ur'
            ? <Text style={{ fontSize: landscape ? 112 : 150, fontWeight: '900', color: '#F08A4B' }}>{item.upper}</Text>
            : <><Text style={{ fontSize: landscape ? 102 : width > 650 ? 150 : 126, fontWeight: '900', color: '#F08A4B' }}>{item.upper}</Text><Text style={{ fontSize: landscape ? 64 : width > 650 ? 94 : 78, fontWeight: '900', color: '#F5B637' }}>{item.lower}</Text></>}
        </Pressable>
        <Pressable accessibilityLabel={translateText(`Hear ${item.word}`, language)} onPress={() => speak(getSpokenLearningWord(item.word, language), true, language)} style={{ alignItems: 'center', marginTop: 1 }}>
          {animals.some(animal => animal.name === item.word)
            ? <AnimalIllustration name={item.word} emoji={item.emoji} size={landscape ? 54 : width > 650 ? 94 : 76} />
            : <Text style={{ fontSize: landscape ? 54 : width > 650 ? 94 : 76 }}>{item.emoji}</Text>}
          <Text translate={false} style={{ fontSize: landscape ? 19 : 25, fontWeight: '900', color: colors.ink, marginTop: 5 }}>{item.word}{language === 'ur' ? '' : '!'}</Text>
        </Pressable>
        {item.animal && <Pressable accessibilityLabel={translateText(`Meet ${item.animal}`, language)} onPress={() => speak(translateLearningWord(item.animal!, language), true, language)} style={{ marginTop: 9, paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: '#FFFFFFB8', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#49687A' }}>🐾 Meet {item.animal}</Text><AnimalIllustration name={item.animal} emoji={item.animalEmoji ?? '🐾'} size={28} /><Text style={{ fontSize: 15, fontWeight: '800', color: '#49687A' }}>🔊</Text>
        </Pressable>}
        <Text style={{ fontSize: 12, fontWeight: '700', color: colors.muted, marginTop: 8 }}>Tap a letter, picture or animal friend</Text>
      </View>
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <BigButton label="Back" emoji="⬅️" color="#DFF3FC" onPress={() => setIndex(Math.max(0, index - 1))} />
        <Pressable accessibilityRole="button" accessibilityLabel={translateText('Hear this letter and word again', language)} onPress={() => speak(`${getSpokenLetterName(item, language)}. ${getSpokenLearningWord(item.word, language)}.`, true, language)} style={{ width: 58, height: 58, borderRadius: 25, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 29 }}>🔊</Text></Pressable>
        <BigButton label="Next" emoji="➡️" color={colors.yellow} attention onPress={() => setIndex(current => Math.min(alphabet.length - 1, current + 1))} />
      </View>
    </Animated.View>}
    {landscape
      ? <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%', flexGrow: 0 }} contentContainerStyle={{ flexDirection: 'row', justifyContent: 'center', gap: 7, paddingVertical: 2 }}>{available.map((letter, n) => <Pressable key={letter.upper} onPress={() => setIndex(n)} style={{ width: 38, height: 38, borderRadius: 14, backgroundColor: n === index ? colors.yellow : '#fff', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontWeight: '900', color: colors.ink }}>{letter.upper}</Text></Pressable>)}</ScrollView>
      : <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 7, marginTop: 9 }}>{available.map((letter, n) => <Pressable key={letter.upper} onPress={() => setIndex(n)} style={{ width: 38, height: 38, borderRadius: 14, backgroundColor: n === index ? colors.yellow : '#fff', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontWeight: '900', color: colors.ink }}>{letter.upper}</Text></Pressable>)}</View>}
  </Screen>;
}
