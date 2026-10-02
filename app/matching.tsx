import { Text } from '../components/AppText';
import React, { useMemo, useState } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { Header, Screen, BigButton, WrongAnswerMessage } from '../components/ui';
import { animals } from '../data/content';
import { createMatchingRounds, shuffled } from '../data/playActivities';
import { useAppStore } from '../store/useAppStore';
import { translateLearningWord, translateText } from '../localization';
import { speak } from '../services/audio';
import { useWrongAnswerFeedback } from '../hooks/useWrongAnswerFeedback';
import Animated, { BounceIn, FadeInUp, LinearTransition } from 'react-native-reanimated';
import { AnimalIllustration } from '../components/AnimalIllustration';
import { playUiSound } from '../services/uiSoundEvents';

export default function Matching() {
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const [rounds, setRounds] = useState(() => createMatchingRounds());
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [matched, setMatched] = useState(false);
  const state = useAppStore();
  const { message, showWrongAnswer } = useWrongAnswerFeedback(state.voice, state.language);
  const currentRound = rounds[roundIndex];
  const { letter, animal } = currentRound;
  const isUrdu = state.language === 'ur';
  const animalName = (item: typeof animal) => isUrdu ? translateLearningWord(item.name, state.language) : item.name;
  const targetAnimalName = animalName(animal);
  const targetLetter = isUrdu ? targetAnimalName[0] : letter.upper;
  const choices = useMemo(() => {
    const labelFor = (item: typeof animal) => isUrdu ? translateLearningWord(item.name, state.language) : item.name;
    const distractors = shuffled(animals.filter(item => item.name !== animal.name && labelFor(item)[0] !== targetLetter)).slice(0, 3);
    return shuffled([animal, ...distractors])
      .map(item => ({ id: item.name, name: item.name, label: labelFor(item), emoji: item.emoji }));
  }, [animal, isUrdu, state.language, targetLetter]);
  const answerId = animal.name;

  return <Screen><Header title="Match the Friend" />
    <View style={{ width: '100%', flexDirection: landscape ? 'row' : 'column', justifyContent: 'space-between', alignItems: 'stretch', gap: 14 }}>
    <View style={{ width: landscape ? '30%' : '100%', gap: 8 }}>
      <View style={{ width: '100%', padding: 14, alignItems: 'center', justifyContent: 'center', flex: landscape ? 1 : undefined, backgroundColor: '#E8E1FF', borderRadius: 28, gap: 4 }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#536A80', textAlign: 'center' }}>{state.language === 'ur' ? 'اس حرف سے کس جانور کا نام شروع ہوتا ہے؟' : translateText('Which animal starts with this letter?', state.language)}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={translateText(`Hear letter ${targetLetter}`, state.language)} onPress={() => { playUiSound('pop'); speak(targetLetter, state.voice, state.language); }} style={{ minWidth: 84, minHeight: 78, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: landscape ? 64 : 84, fontWeight: '900', color: '#344E76' }}>{targetLetter}</Text></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={state.language === 'ur' ? 'حرف اور لفظ سنیں' : translateText('Hear the letter and animal', state.language)} onPress={() => speak(state.language === 'ur' ? `${targetLetter}، ${targetAnimalName}` : `${letter.upper} is for ${animal.name}`, true, state.language)}><Text style={{ fontSize: 18 }}>🔊 Listen</Text></Pressable>
      </View>
      <Text style={{ fontSize: 17, fontWeight: '900', color: '#19334D', textAlign: landscape ? 'center' : 'left' }}>{state.language === 'ur' ? 'صحیح لفظ چنیں' : 'Tap the matching animal'}</Text>
    </View>
    <View style={{ width: landscape ? '68%' : '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
      {choices.map((choice, index) => <Animated.View key={choice.id} entering={FadeInUp.delay(index * 45).duration(220)} layout={LinearTransition.duration(180)} style={{ width: '45%' }}><Pressable key={choice.id} accessibilityRole="button" accessibilityLabel={translateText(choice.label, state.language)} onPress={() => {
        if (matched) return;
        setSelected(choice.id);
        if (choice.id === answerId) {
          if (!matched) state.reward('match', state.language === 'ur' ? `ur:${letter.upper}` : letter.upper);
          setMatched(true);
          speak('A perfect match!', state.voice, state.language);
        } else showWrongAnswer();
      }} style={{ width: '100%', height: landscape ? Math.min(132, height * 0.31) : 132, borderRadius: 25, backgroundColor: matched && choice.id === answerId ? '#BDECC7' : ['#FFE7C2', '#DDF4FF', '#F8DDED', '#E6E1FF'][index], alignItems: 'center', justifyContent: 'center', borderWidth: selected === choice.id ? 3 : 0, borderColor: '#19334D' }}>
        <AnimalIllustration name={choice.name} emoji={choice.emoji} size={landscape ? 57 : 70} /><Text style={{ fontSize: 14, fontWeight: '900', color: '#19334D' }}>{choice.label}</Text>
      </Pressable></Animated.View>)}
    </View>
    </View>
    <WrongAnswerMessage message={message} />
    {matched && <Animated.View entering={BounceIn.duration(280)} style={{ alignItems: 'center', gap: 12 }}><Text style={{ fontSize: 24 }}>⭐ Well matched! ⭐</Text><BigButton label="Next match" emoji="➡️" attention onPress={() => { if (roundIndex + 1 >= rounds.length) { setRounds(createMatchingRounds(animal.name)); setRoundIndex(0); } else { setRoundIndex(index => index + 1); } setMatched(false); setSelected(''); }} /></Animated.View>}
  </Screen>;
}
