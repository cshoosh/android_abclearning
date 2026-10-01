import { Text } from '../components/AppText';
import React, { useState } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { Header, Screen, BigButton, WrongAnswerMessage } from '../components/ui';
import { getLearningLetters, getSpokenLetterName } from '../data/learningLetters';
import { useAppStore } from '../store/useAppStore';
import { translateText } from '../localization';
import { speak } from '../services/audio';
import { colors } from '../theme/tokens';
import Animated, { BounceIn, FadeInUp, LinearTransition } from 'react-native-reanimated';
import { useWrongAnswerFeedback } from '../hooks/useWrongAnswerFeedback';

export default function FindLetter() {
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const [round, setRound] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const state = useAppStore();
  const { message, showWrongAnswer } = useWrongAnswerFeedback(state.voice, state.language);
  const alphabet = getLearningLetters(state.language);
  const available = state.premium ? alphabet : alphabet.slice(0, 6);
  const target = available[(round * 3 + 1) % available.length];
  const prompt = state.language === 'ur' ? `حرف ${getSpokenLetterName(target, state.language)} تلاش کریں` : `Find the letter ${target.upper}`;
  const options = [target, available[(round + 2) % available.length], available[(round + 4) % available.length], available[(round + 5) % available.length]]
    .filter((letter, index, letters) => letters.findIndex(item => item.upper === letter.upper) === index);
  while (options.length < 4) options.push(available[options.length % available.length]);
  return <Screen><Header title="Find the Letter" right={<Text style={{ fontSize: 15, fontWeight: '900' }}>{round + 1}/{alphabet.length}</Text>} />
    <View style={{ width: '100%', flexDirection: landscape ? 'row' : 'column', justifyContent: 'space-between', alignItems: 'stretch', gap: 14 }}>
    <View style={{ width: landscape ? '31%' : '100%', padding: landscape ? 14 : 24, alignItems: 'center', justifyContent: 'center', borderRadius: 30, backgroundColor: '#DDF4FF', gap: 9 }}>
      <Text style={{ fontSize: 18, fontWeight: '800', color: '#496D81' }}>{state.language === 'ur' ? 'یہ حرف تلاش کریں' : 'Can you find...'}</Text><Text style={{ fontSize: landscape ? 62 : 78, fontWeight: '900', color: '#224B69' }}>{target.upper}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={prompt} onPress={() => speak(prompt, true, state.language)}><Text style={{ fontSize: 27 }}>🔊 {state.language === 'ur' ? 'دوبارہ سنیں' : 'Listen again'}</Text></Pressable>
    </View>
    <View style={{ width: landscape ? '67%' : '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 14, marginTop: landscape ? 0 : 14 }}>
      {options.map((option, index) => <Animated.View key={`${option.upper}-${index}`} entering={FadeInUp.delay(index * 45).duration(220)} layout={LinearTransition.duration(180)} style={{ width: '43%' }}><Pressable accessibilityRole="button" accessibilityLabel={state.language === 'ur' ? `حرف ${option.upper}` : translateText(`Letter ${option.upper}`, state.language)} onPress={() => {
        if (celebrating) return;
        if (option.upper === target.upper) {
          if (!celebrating) state.reward('find-letter', option.upper);
          setCelebrating(true);
          speak('You found it! Great job!', state.voice, state.language);
        } else showWrongAnswer();
      }} style={{ width: '100%', height: landscape ? Math.min(132, height * 0.31) : 135, borderRadius: 26, backgroundColor: celebrating && option.upper === target.upper ? colors.green : '#FFF0C5', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: landscape ? 48 : 62, fontWeight: '900', color: '#234D66' }}>{option.upper}</Text>
      </Pressable></Animated.View>)}
    </View>
    </View>
    <WrongAnswerMessage message={message} />
    {celebrating && <Animated.View entering={BounceIn.duration(280)} style={{ alignItems: 'center', gap: 12 }}><Text style={{ fontSize: 23, fontWeight: '900', color: '#478C5E' }}>You found it! ⭐ 🎉</Text><BigButton label="Play again" emoji="➡️" attention onPress={() => { setRound(round + 1); setCelebrating(false); }} /></Animated.View>}
  </Screen>;
}
