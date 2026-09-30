import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BigButton, Header, Screen } from '../components/ui';
import { animalHomeRounds, homeChoices } from '../data/playActivities';
import { useAppStore } from '../store/useAppStore';
import { speak } from '../services/audio';

const SESSION_LENGTH = 4;

export default function AnimalHomes() {
  const state = useAppStore();
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const round = animalHomeRounds[index % animalHomeRounds.length];

  function chooseHome(homeId: string) {
    if (answered || finished) return;
    if (round.home === homeId) {
      const next = index + 1;
      setAnswered(true);
      speak(`Yes! The ${round.animal} lives in the ${homeChoices.find(home => home.id === homeId)?.name}.`, state.voice);
      if (next >= SESSION_LENGTH) {
        setFinished(true);
        state.reward('animal-homes');
        return;
      }
      return;
    }
    speak('Let’s try another home.', state.voice);
  }

  function continuePlay() {
    setIndex(value => value + 1);
    setAnswered(false);
  }

  function startAgain() {
    setIndex(0);
    setAnswered(false);
    setFinished(false);
  }

  return (
    <Screen>
      <Header title="Animal Homes" />
      <Text style={{ fontSize: 17, fontWeight: '900', color: '#5A7483' }}>Where does this friend live?</Text>
      <View style={{ width: '100%', padding: 18, borderRadius: 30, backgroundColor: '#DDF4E8', alignItems: 'center', gap: 10 }}>
        <Text style={{ fontSize: 13, fontWeight: '900', color: '#577666' }}>FRIEND {Math.min(index + 1, SESSION_LENGTH)} OF {SESSION_LENGTH}</Text>
        <Text accessibilityLabel={round.animal} style={{ fontSize: 100 }}>{round.emoji}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`Hear ${round.animal}`} onPress={() => speak(round.animal, state.voice)}>
          <Text style={{ fontSize: 21, fontWeight: '900', color: '#244968' }}>🔊 {round.animal}</Text>
        </Pressable>
      </View>
      <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
        {homeChoices.map(home => {
          const selected = answered && home.id === round.home;
          return (
            <Pressable
              key={home.id}
              accessibilityRole="button"
              accessibilityLabel={`${home.name} home`}
              onPress={() => chooseHome(home.id)}
              style={({ pressed }) => ({ width: '47%', minHeight: 122, borderRadius: 26, backgroundColor: selected ? '#A4E2B8' : '#FFF', borderWidth: selected ? 4 : 0, borderColor: '#54AA71', alignItems: 'center', justifyContent: 'center', transform: [{ scale: pressed ? 0.97 : 1 }] })}
            >
              <Text style={{ fontSize: 49 }}>{home.emoji}</Text>
              <Text style={{ fontSize: 17, fontWeight: '900', color: '#244968' }}>{home.name}</Text>
            </Pressable>
          );
        })}
      </View>
      {answered && !finished && <BigButton label="Next friend" emoji="➡️" onPress={continuePlay} />}
      {finished && <><Text style={{ fontSize: 23, fontWeight: '900', color: '#41885B' }}>All friends found a home! ⭐</Text><BigButton label="Play again" emoji="🔁" onPress={startAgain} /></>}
    </Screen>
  );
}
