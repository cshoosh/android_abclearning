import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Header, Screen, BigButton } from '../components/ui';
import { alphabet, animals } from '../data/content';
import { useAppStore } from '../store/useAppStore';
import { speak } from '../services/audio';

const pairs = alphabet.filter(letter => animals.some(animal => animal.name === letter.animal));

export default function Matching() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState('');
  const [matched, setMatched] = useState(false);
  const state = useAppStore();
  const available = state.premium ? pairs : pairs.slice(0, 6);
  const letter = available[round % available.length];
  const animal = animals.find(item => item.name === letter.animal)!;
  const distractors = animals.filter(item => item.name !== animal.name);
  const choices = [animal, ...Array.from({ length: 3 }, (_, index) => distractors[(round + index * 3) % distractors.length])];

  return <Screen><Header title="Match the Friend" />
    <View style={{ width: '100%', padding: 20, alignItems: 'center', backgroundColor: '#E8E1FF', borderRadius: 28, gap: 4 }}>
      <Text style={{ fontSize: 16, fontWeight: '800', color: '#536A80' }}>Who starts with this letter?</Text>
      <Text style={{ fontSize: 84, fontWeight: '900', color: '#344E76' }}>{letter.upper}</Text>
      <Pressable accessibilityLabel="Hear the letter and animal" onPress={() => speak(`${letter.upper} is for ${animal.name}`, state.voice)}><Text style={{ fontSize: 18 }}>🔊 Listen</Text></Pressable>
    </View>
    <Text style={{ fontSize: 17, fontWeight: '900', color: '#19334D', marginTop: 14 }}>Tap the matching animal</Text>
    <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
      {choices.map((choice, index) => <Pressable key={choice.name} accessibilityLabel={choice.name} onPress={() => {
        setSelected(choice.name);
        if (choice.name === animal.name) {
          if (!matched) state.reward('match', letter.upper);
          setMatched(true);
          speak('A perfect match!', state.voice);
        } else speak('Keep looking!', state.voice);
      }} style={{ width: '45%', height: 132, borderRadius: 25, backgroundColor: matched && choice.name === animal.name ? '#BDECC7' : ['#FFE7C2', '#DDF4FF', '#F8DDED', '#E6E1FF'][index], alignItems: 'center', justifyContent: 'center', borderWidth: selected === choice.name ? 3 : 0, borderColor: '#19334D' }}>
        <Text style={{ fontSize: 59 }}>{choice.emoji}</Text><Text style={{ fontSize: 14, fontWeight: '900', color: '#19334D' }}>{choice.name}</Text>
      </Pressable>)}
    </View>
    {matched && <><Text style={{ fontSize: 24 }}>⭐ Well matched! ⭐</Text><BigButton label="Next match" emoji="➡️" onPress={() => { setRound(round + 1); setMatched(false); setSelected(''); }} /></>}
  </Screen>;
}
