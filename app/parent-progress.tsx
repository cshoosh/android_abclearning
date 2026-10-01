import React from 'react';
import { View } from 'react-native';
import { Text } from '../components/AppText';
import { ParentPage } from '../components/ParentPage';
import { Header } from '../components/ui';
import { getLearningLetters } from '../data/learningLetters';
import { useAppStore } from '../store/useAppStore';

export default function Progress() {
  const progress = useAppStore();
  const letters = getLearningLetters(progress.language);
  const belongsToLanguage = (key: string) => progress.language === 'ur'
    ? key.startsWith('ur:')
    : !key.startsWith('ur:');
  const exploredCount = progress.viewedLetters.filter(belongsToLanguage).length;
  const tracedCount = progress.tracedLetters.filter(belongsToLanguage).length;
  const stats = [
    ['Letters explored', exploredCount, letters.length, '🔤'],
    ['Letters traced', tracedCount, letters.length, '✍️'],
    ['Activities played', progress.activities.length, 8, '🎮'],
    ['Stars earned', progress.stars, null, '⭐'],
  ] as const;

  return <ParentPage>
    <Header title="Child Progress" />
    {stats.map(([label, value, total, emoji]) => <View key={label} style={{ width: '100%', padding: 18, backgroundColor: '#fff', borderRadius: 22, marginTop: 5 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 17, fontWeight: '900', color: '#19334D' }}>{emoji}  {label}</Text>
        <Text style={{ fontSize: 18, fontWeight: '900', color: '#50829B' }}>{value}{total ? ` / ${total}` : ''}</Text>
      </View>
      {total && <View style={{ height: 9, backgroundColor: '#E9F0F3', borderRadius: 10, marginTop: 12 }}>
        <View style={{ height: 9, backgroundColor: '#79CE94', borderRadius: 10, width: `${Math.min(100, Number(value) / Number(total) * 100)}%` }} />
      </View>}
    </View>)}
    <Text style={{ fontSize: 13, color: '#687B89', marginTop: 15 }}>Progress is stored on this device. It is a play summary, not an educational assessment.</Text>
  </ParentPage>;
}
