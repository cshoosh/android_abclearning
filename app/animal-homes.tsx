import { Text } from '../components/AppText';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { BigButton, Header, Screen, WrongAnswerMessage } from '../components/ui';
import { createAnimalHomeRounds, homeChoices } from '../data/playActivities';
import { AnimalIllustration } from '../components/AnimalIllustration';
import { useAppStore } from '../store/useAppStore';
import { speak } from '../services/audio';
import { useWrongAnswerFeedback } from '../hooks/useWrongAnswerFeedback';
import Animated, { FadeInUp, BounceIn, LinearTransition } from 'react-native-reanimated';
import { translateText } from '../localization';
import { AnimalSoundPlayback } from '../components/AnimalSoundPlayback';
import { hasAnimalSound } from '../services/animalSounds';

export default function AnimalHomes() {
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const state = useAppStore();
  const [rounds, setRounds] = useState(() => createAnimalHomeRounds());
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [soundRequest, setSoundRequest] = useState<{ animalName: string; key: number } | null>(null);
  const soundKey = useRef(0);
  const { message, showWrongAnswer } = useWrongAnswerFeedback(state.voice, state.language);
  const round = rounds[index];

  useEffect(() => {
    if (!finished) speak(`Where does ${round.animal} live?`, state.voice, state.language);
  }, [finished, index, round.animal, state.language, state.voice]);

  function chooseHome(homeId: string) {
    if (answered || finished) return;
    if (round.home === homeId) {
      const next = index + 1;
      setAnswered(true);
      speak(`Yes! The ${round.animal} lives in the ${homeChoices.find(home => home.id === homeId)?.name}.`, state.voice, state.language);
      if (next >= rounds.length) {
        setFinished(true);
        state.reward('animal-homes', round.animal);
        return;
      }
      return;
    }
    showWrongAnswer();
  }

  function continuePlay() {
    setIndex(value => value + 1);
    setAnswered(false);
  }

  function startAgain() {
    setRounds(createAnimalHomeRounds(round.animal));
    setIndex(0);
    setAnswered(false);
    setFinished(false);
  }

  return (
    <Screen>
      <Header title="Animal Homes" />
      <Text style={{ fontSize: 17, fontWeight: '900', color: '#5A7483' }}>Where does this friend live?</Text>
      <View style={{ width: '100%', flexDirection: landscape ? 'row' : 'column', alignItems: 'stretch', justifyContent: 'space-between', gap: 14 }}>
      <View style={{ width: landscape ? '30%' : '100%', padding: 14, borderRadius: 30, backgroundColor: '#DDF4E8', alignItems: 'center', justifyContent: 'center', gap: landscape ? 5 : 10 }}>
        <Text style={{ fontSize: 13, fontWeight: '900', color: '#577666' }}>FRIEND {index + 1} OF {rounds.length}</Text>
        <View accessible accessibilityLabel={translateText(round.animal, state.language)} style={{ height: landscape ? 84 : 116, alignItems: 'center', justifyContent: 'center' }}>
          <AnimalIllustration name={round.animal} emoji={round.emoji} size={landscape ? 70 : 96} />
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={translateText(`Hear ${round.animal}`, state.language)} onPress={() => {
          speak(round.animal, state.voice, state.language);
          if (hasAnimalSound(round.animal)) setSoundRequest({ animalName: round.animal, key: soundKey.current++ });
        }}>
          <Text style={{ fontSize: 21, fontWeight: '900', color: '#244968' }}>🔊 {round.animal}</Text>
        </Pressable>
      </View>
      <View style={{ width: landscape ? '68%' : '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', gap: 12 }}>
        {round.choices.map((home, homeIndex) => {
          const selected = answered && home.id === round.home;
          return (
            <Animated.View key={home.id} entering={FadeInUp.delay(homeIndex * 40).duration(220)} layout={LinearTransition.duration(180)} style={{ width: '47%' }}><Pressable
              accessibilityRole="button"
              accessibilityLabel={translateText(`${home.name} home`, state.language)}
              onPress={() => chooseHome(home.id)}
              style={({ pressed }) => ({ width: '100%', minHeight: landscape ? Math.min(105, height * 0.27) : 122, borderRadius: 26, backgroundColor: selected ? '#A4E2B8' : '#FFF', borderWidth: selected ? 4 : 0, borderColor: '#54AA71', alignItems: 'center', justifyContent: 'center', transform: [{ scale: pressed ? 0.97 : 1 }] })}
            >
              <Text style={{ fontSize: 49 }}>{home.emoji}</Text>
              <Text style={{ fontSize: 17, fontWeight: '900', color: '#244968' }}>{home.name}</Text>
            </Pressable></Animated.View>
          );
        })}
      </View>
      </View>
      <WrongAnswerMessage message={message} />
      {answered && !finished && <Animated.View entering={BounceIn.duration(240)}><BigButton label="Next friend" emoji="➡️" attention onPress={continuePlay} /></Animated.View>}
      {finished && <Animated.View entering={BounceIn.duration(280)} style={{ alignItems: 'center', gap: 12 }}><Text style={{ fontSize: 23, fontWeight: '900', color: '#41885B' }}>All friends found a home! ⭐</Text><BigButton label="Play again" emoji="🔁" attention onPress={startAgain} /></Animated.View>}
      {soundRequest && <AnimalSoundPlayback key={soundRequest.key} animalName={soundRequest.animalName} enabled={state.effects} />}
    </Screen>
  );
}
