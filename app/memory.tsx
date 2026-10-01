import { Text } from '../components/AppText';
import React, { useState } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { BigButton, Header, Screen, WrongAnswerMessage } from '../components/ui';
import { memoryAnimals } from '../data/playActivities';
import { useAppStore } from '../store/useAppStore';
import { speak } from '../services/audio';
import { playUiSound } from '../services/uiSoundEvents';
import { useWrongAnswerFeedback } from '../hooks/useWrongAnswerFeedback';
import Animated, { FadeInUp, ZoomIn, BounceIn, LinearTransition } from 'react-native-reanimated';
import { translateText } from '../localization';
import { AnimalSoundPlayback } from '../components/AnimalSoundPlayback';
import { AnimalIllustration } from '../components/AnimalIllustration';

type MemoryCard = { id: string; pair: string; name: string; emoji: string };
const PAIR_COUNTS = [2, 3, 4] as const;

function createDeck(round: number): MemoryCard[] {
  const pairCount = PAIR_COUNTS[round % PAIR_COUNTS.length];
  const chosen = Array.from({ length: pairCount }, (_, index) => memoryAnimals[(round * 3 + index) % memoryAnimals.length]);
  const deck = chosen.flatMap((animal, index) => [0, 1].map(copy => ({
    id: `${round}-${index}-${copy}`,
    pair: `${round}-${index}`,
    name: animal.name,
    emoji: animal.emoji,
  })));
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[other]] = [deck[other], deck[index]];
  }
  return deck;
}

export default function Memory() {
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const state = useAppStore();
  const [round, setRound] = useState(0);
  const [deck, setDeck] = useState(() => createDeck(0));
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [soundRequest, setSoundRequest] = useState<{ animalName: string; key: number } | null>(null);
  const { message, showWrongAnswer } = useWrongAnswerFeedback(state.voice, state.language);

  function flip(card: MemoryCard) {
    if (finished || matched.includes(card.id) || open.includes(card.id)) return;
    playUiSound('pop');
    const nextOpen = open.length === 2 ? [card.id] : [...open, card.id];
    setOpen(nextOpen);
    if (nextOpen.length !== 2) return;

    const first = deck.find(item => item.id === nextOpen[0]);
    if (first?.pair === card.pair) {
      const nextMatched = [...matched, ...nextOpen];
      setMatched(nextMatched);
      setSoundRequest(current => ({ animalName: card.name, key: (current?.key ?? 0) + 1 }));
      if (nextMatched.length < deck.length) playUiSound('success');
      speak(`You found the ${card.name} twins!`, state.voice, state.language);
      if (nextMatched.length === deck.length) {
        setFinished(true);
        state.reward('memory-match', card.name);
        speak('You found every animal pair!', state.voice, state.language);
      }
    } else {
      setSoundRequest(null);
      showWrongAnswer();
    }
  }

  function playAgain() {
    const nextRound = round + 1;
    setRound(nextRound);
    setDeck(createDeck(nextRound));
    setOpen([]);
    setMatched([]);
    setFinished(false);
    setSoundRequest(null);
  }

  return (
    <Screen>
      <Header title="Memory Match" />
      <Text style={{ fontSize: 17, fontWeight: '900', color: '#5A7483', textAlign: 'center' }}>Find two of the same animal!</Text>
      <View style={{ width: '100%', padding: 13, borderRadius: 22, backgroundColor: '#FFF0C8', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: '900', color: '#244968' }}>Animal pairs</Text>
        <Text style={{ fontWeight: '900', color: '#244968' }}>✨ {matched.length / 2} of {deck.length / 2}</Text>
      </View>
      <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
        {deck.map((card, cardIndex) => {
          const revealed = open.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);
          return (
            <Animated.View key={card.id} entering={FadeInUp.delay(cardIndex * 35).duration(220)} layout={LinearTransition.duration(180)} style={{ width: landscape ? '22%' : width < 600 ? '47%' : '30%', aspectRatio: landscape ? 1.15 : 0.9 }}><Pressable
              key={card.id}
              accessibilityRole="button"
              accessibilityLabel={translateText(revealed ? card.name : 'Turn over animal card', state.language)}
              onPress={() => flip(card)}
              style={({ pressed }) => ({ width: '100%', flex: 1, borderRadius: 25, backgroundColor: isMatched ? '#C9F0D3' : revealed ? '#FFF1D1' : '#A9DDF0', borderWidth: isMatched ? 3 : 0, borderColor: '#65B27A', alignItems: 'center', justifyContent: 'center', transform: [{ scale: pressed ? 0.96 : 1 }] })}
            >
              {revealed ? <AnimalIllustration name={card.name} emoji={card.emoji} size={landscape ? 44 : 52} /> : <Text style={{ fontSize: landscape ? 34 : 39 }}>❔</Text>}
              {revealed && <Animated.View entering={ZoomIn.duration(180)}><Text style={{ fontSize: 12, fontWeight: '900', color: '#244968' }}>{card.name}</Text></Animated.View>}
            </Pressable></Animated.View>
          );
        })}
      </View>
      <WrongAnswerMessage message={message} />
      {soundRequest && <AnimalSoundPlayback key={soundRequest.key} animalName={soundRequest.animalName} enabled={state.effects} maxDurationMs={1400} />}
      {finished && <Animated.View entering={BounceIn.duration(280)} style={{ alignItems: 'center', gap: 12 }}><Text style={{ fontSize: 23, fontWeight: '900', color: '#41885B' }}>You found every friend! ⭐</Text><BigButton label="Meet new animals" emoji="➡️" attention onPress={playAgain} /></Animated.View>}
      <Text style={{ color: '#607B89', textAlign: 'center', fontWeight: '700' }}>Take turns with a grown-up: “What do you think is under this card?”</Text>
    </Screen>
  );
}
