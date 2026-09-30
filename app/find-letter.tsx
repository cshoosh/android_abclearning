import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Header, Screen, BigButton } from '../components/ui';
import { alphabet } from '../data/content';
import { useAppStore } from '../store/useAppStore';
import { speak } from '../services/audio';
import { colors } from '../theme/tokens';

export default function FindLetter() {
  const [round, setRound] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const state = useAppStore();
  const available = state.premium ? alphabet : alphabet.slice(0, 6);
  const target = available[(round * 3 + 1) % available.length];
  const options = [target, available[(round + 2) % available.length], available[(round + 4) % available.length], available[(round + 5) % available.length]]
    .filter((letter, index, letters) => letters.findIndex(item => item.upper === letter.upper) === index);
  while (options.length < 4) options.push(available[options.length % available.length]);
  return <Screen><Header title="Find the Letter" right={<Text style={{ fontSize: 15, fontWeight: '900' }}>{round + 1} ⭐</Text>} />
    <View style={{ width: '100%', padding: 24, alignItems: 'center', borderRadius: 30, backgroundColor: '#DDF4FF', gap: 9 }}>
      <Text style={{ fontSize: 18, fontWeight: '800', color: '#496D81' }}>Can you find...</Text><Text style={{ fontSize: 78, fontWeight: '900', color: '#224B69' }}>{target.upper}?</Text>
      <Pressable accessibilityLabel={`Hear find ${target.upper}`} onPress={() => speak(`Find the letter ${target.upper}`, state.voice)}><Text style={{ fontSize: 27 }}>🔊 Listen again</Text></Pressable>
    </View>
    <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14, marginTop: 14 }}>
      {options.map((option, index) => <Pressable key={`${option.upper}-${index}`} accessibilityLabel={`Letter ${option.upper}`} onPress={() => {
        if (option.upper === target.upper) {
          if (!celebrating) state.reward('find-letter', option.upper);
          setCelebrating(true);
          speak('You found it! Great job!', state.voice);
        } else speak('Try another one!', state.voice);
      }} style={{ width: '43%', height: 135, borderRadius: 26, backgroundColor: celebrating && option.upper === target.upper ? colors.green : '#FFF0C5', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 62, fontWeight: '900', color: '#234D66' }}>{option.upper}</Text>
      </Pressable>)}
    </View>
    {celebrating && <><Text style={{ fontSize: 23, fontWeight: '900', color: '#478C5E' }}>You found it! ⭐ 🎉</Text><BigButton label="Play again" emoji="➡️" onPress={() => { setRound(round + 1); setCelebrating(false); }} /></>}
  </Screen>;
}
