import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BigButton, Header, Screen } from '../components/ui';
import { memoryAnimals } from '../data/playActivities';
import { useAppStore } from '../store/useAppStore';
import { speak } from '../services/audio';

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
  const state = useAppStore();
  const [round, setRound] = useState(0);
  const [deck, setDeck] = useState(() => createDeck(0));
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  function flip(card: MemoryCard) {
    if (finished || matched.includes(card.id) || open.includes(card.id)) return;
    const nextOpen = open.length === 2 ? [card.id] : [...open, card.id];
    setOpen(nextOpen);
    if (nextOpen.length !== 2) return;

    const first = deck.find(item => item.id === nextOpen[0]);
    if (first?.pair === card.pair) {
      const nextMatched = [...matched, ...nextOpen];
      setMatched(nextMatched);
      speak(`You found the ${card.name} twins!`, state.voice);
      if (nextMatched.length === deck.length) {
        setFinished(true);
        state.reward('memory-match');
        speak('You found every animal pair!', state.voice);
      }
    } else {
      speak('Two different friends. Try again!', state.voice);
    }
  }

  function playAgain() {
    const nextRound = round + 1;
    setRound(nextRound);
    setDeck(createDeck(nextRound));
    setOpen([]);
    setMatched([]);
    setFinished(false);
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
        {deck.map(card => {
          const revealed = open.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);
          return (
            <Pressable
              key={card.id}
              accessibilityRole="button"
              accessibilityLabel={revealed ? card.name : 'Turn over animal card'}
              onPress={() => flip(card)}
              style={({ pressed }) => ({ width: '30%', aspectRatio: 0.9, borderRadius: 25, backgroundColor: isMatched ? '#C9F0D3' : revealed ? '#FFF1D1' : '#A9DDF0', borderWidth: isMatched ? 3 : 0, borderColor: '#65B27A', alignItems: 'center', justifyContent: 'center', transform: [{ scale: pressed ? 0.96 : 1 }] })}
            >
              <Text style={{ fontSize: revealed ? 49 : 39 }}>{revealed ? card.emoji : '❔'}</Text>
              {revealed && <Text style={{ fontSize: 12, fontWeight: '900', color: '#244968' }}>{card.name}</Text>}
            </Pressable>
          );
        })}
      </View>
      {finished && <><Text style={{ fontSize: 23, fontWeight: '900', color: '#41885B' }}>You found every friend! ⭐</Text><BigButton label="Meet new animals" emoji="➡️" onPress={playAgain} /></>}
      <Text style={{ color: '#607B89', textAlign: 'center', fontWeight: '700' }}>Take turns with a grown-up: “What do you think is under this card?”</Text>
    </Screen>
  );
}
