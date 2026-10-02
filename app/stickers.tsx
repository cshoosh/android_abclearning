import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '../components/AppText';
import { router } from 'expo-router';
import { animals } from '../data/content';
import { getLearningLetters } from '../data/learningLetters';
import { BigButton, BottomSheet, Header, Screen } from '../components/ui';
import { useAppStore } from '../store/useAppStore';
import { translateText } from '../localization';
import { AnimalIllustration } from '../components/AnimalIllustration';
import { getStickerFact } from '../data/stickerFacts';
import { shareCelebration } from '../services/sharing';

export default function Stickers() {
  const { stickers, stars, premium, language } = useAppStore();
  const [selectedAnimal, setSelectedAnimal] = useState<(typeof animals)[number] | null>(null);
  const alphabet = getLearningLetters(language);
  const visibleAnimals = animals.slice(0, premium ? 26 : 6);
  const earnedCount = visibleAnimals.filter(animal => stickers.includes(animal.name)).length;
  const progress = visibleAnimals.length ? Math.round((earnedCount / visibleAnimals.length) * 100) : 0;

  return (
    <Screen>
      <Header title="Sticker Book" />
      <View style={{ width: '100%', maxWidth: 760, padding: 18, backgroundColor: '#FFF0C5', borderRadius: 25, borderWidth: 2, borderColor: '#F5DE8D', gap: 13 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 19, fontWeight: '900', color: '#19334D' }}>Your little collection</Text>
            <Text style={{ fontSize: 13, lineHeight: 18, fontWeight: '700', color: '#5E7480', marginTop: 4 }}>Finish an activity to earn a star and a sticker reward.</Text>
          </View>
          <View style={{ minWidth: 64, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center' }}>
            <Text style={{ fontSize: 17, fontWeight: '900', color: '#19334D' }}>⭐ {stars}</Text>
          </View>
        </View>
        <View accessibilityRole="progressbar" accessibilityLabel={translateText('Sticker collection progress', language)} accessibilityValue={{ min: 0, max: visibleAnimals.length, now: earnedCount }} style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: '900', color: '#35586B' }}>Stickers collected</Text>
            <Text style={{ fontSize: 13, fontWeight: '900', color: '#35586B' }}>{earnedCount} / {visibleAnimals.length}</Text>
          </View>
          <View style={{ height: 12, borderRadius: 8, backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
            <View style={{ width: `${progress}%`, height: '100%', borderRadius: 8, backgroundColor: '#65B880' }} />
          </View>
        </View>
      </View>

      <BigButton label="Celebrate with friends" emoji="🎉" color="#DDF4E8" onPress={() => void shareCelebration(stars)} />

      <View style={{ width: '100%', maxWidth: 760, gap: 11, alignSelf: 'center' }}>
        {visibleAnimals.map(animal => {
          const earned = stickers.includes(animal.name);
          const letter = alphabet.find(item => item.animal === animal.name);
          const instruction = letter
            ? `Find ${letter.upper} in Find the Letter. Tap it to earn the ${animal.name} sticker.`
            : `Play Count & Feed for a star and a surprise sticker. Keep playing to collect ${animal.name}.`;

          return (
            <View key={animal.name} style={{ width: '100%', padding: 14, borderRadius: 23, backgroundColor: earned ? '#FFFFFF' : '#FFFFFFD9', borderWidth: earned ? 2 : 1, borderColor: earned ? '#B8E5C6' : '#E4EDF0', flexDirection: 'row', alignItems: 'center', gap: 13 }}>
              <View style={{ width: 72, height: 72, borderRadius: 22, backgroundColor: earned ? animal.color : '#EAF0F2', alignItems: 'center', justifyContent: 'center' }}>
                <AnimalIllustration name={animal.name} emoji={animal.emoji} size={50} opacity={earned ? 1 : 0.45} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                  <Text style={{ fontSize: 17, fontWeight: '900', color: '#19334D', flexShrink: 1 }}>{animal.name}</Text>
                  <Text style={{ fontSize: 10, fontWeight: '900', color: earned ? '#287344' : '#788B95', backgroundColor: earned ? '#E4F7E9' : '#F0F4F5', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 12 }}>{earned ? 'COLLECTED ✓' : 'NOT YET'}</Text>
                </View>
                {earned ? (
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#4D8A61', marginTop: 2 }}>Tap below to learn something fun!</Text>
                ) : (
                  <>
                    <Text style={{ fontSize: 13, lineHeight: 18, fontWeight: '600', color: '#526C7B' }}>{instruction}</Text>
                  </>
                )}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={translateText(`Interesting facts about ${animal.name}`, language)}
                  onPress={() => setSelectedAnimal(animal)}
                  style={{ alignSelf: 'flex-start', marginTop: 4, paddingHorizontal: 13, paddingVertical: 8, borderRadius: 16, backgroundColor: '#DFF3FC' }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '900', color: '#244968' }}>Interesting facts  ›</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      <BottomSheet
        visible={Boolean(selectedAnimal)}
        onClose={() => setSelectedAnimal(null)}
        title={selectedAnimal ? `Fun facts about ${selectedAnimal.name}` : 'Animal facts'}
      >
        {selectedAnimal && (() => {
          const earned = stickers.includes(selectedAnimal.name);
          const letter = alphabet.find(item => item.animal === selectedAnimal.name);
          const letterIndex = letter ? alphabet.findIndex(item => item.upper === letter.upper) : -1;
          const needsPremium = Boolean(letter && !premium && letterIndex >= 6);
          const route = letter ? (needsPremium ? '/parent-gate' : '/find-letter') : '/counting';
          const actionLabel = needsPremium ? 'Ask a grown-up' : letter ? 'Play letter challenge' : 'Play Count & Feed';

          return <View style={{ alignItems: 'center', gap: 12, paddingBottom: 4 }}>
            <View style={{ width: 112, height: 112, borderRadius: 34, backgroundColor: selectedAnimal.color, alignItems: 'center', justifyContent: 'center' }}>
              <AnimalIllustration name={selectedAnimal.name} emoji={selectedAnimal.emoji} size={76} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#35586B' }}>Did you know?</Text>
            <Text style={{ width: '100%', padding: 16, borderRadius: 20, backgroundColor: '#FFF0C5', fontSize: 16, lineHeight: 23, fontWeight: '800', color: '#35586B', textAlign: 'center' }}>
              {getStickerFact(selectedAnimal.name, language)}
            </Text>
            {!earned && <BigButton label={actionLabel} emoji={needsPremium ? '🔒' : '🎮'} color="#DFF3FC" onPress={() => { setSelectedAnimal(null); router.push(route as never); }} />}
            {earned && <BigButton label="Celebrate with friends" emoji="🎉" color="#DDF4E8" onPress={() => void shareCelebration(stars)} />}
          </View>;
        })()}
      </BottomSheet>

      {!premium && <Text style={{ width: '100%', maxWidth: 760, fontSize: 12, lineHeight: 18, fontWeight: '700', textAlign: 'center', color: '#687B89' }}>More animal stickers are waiting for a grown-up to unlock.</Text>}
    </Screen>
  );
}
