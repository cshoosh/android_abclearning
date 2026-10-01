import { Text } from '../components/AppText';
import React, { useRef, useState } from 'react';
import { Animated, type DimensionValue, Pressable, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Header, Screen } from '../components/ui';
import { animals } from '../data/content';
import { hasAnimalSound } from '../services/animalSounds';
import { useAppStore } from '../store/useAppStore';
import { canAccessAnimal, gridColumns } from '../domain/access';
import { translateText } from '../localization';
import { AnimalIllustration } from '../components/AnimalIllustration';
import { AnimalSoundPlayback } from '../components/AnimalSoundPlayback';

type Animal = (typeof animals)[number];

function AnimalFriendCard({
  animal,
  locked,
  cardWidth,
  cardHeight,
  language,
  onSelect,
}: {
  animal: Animal;
  locked: boolean;
  cardWidth: DimensionValue;
  cardHeight: number;
  language: ReturnType<typeof useAppStore.getState>['language'];
  onSelect: () => void;
}) {
  const bounce = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    if (locked) {
      onSelect();
      return;
    }

    Animated.sequence([
      Animated.spring(bounce, {
        toValue: 1,
        damping: 5,
        stiffness: 280,
        mass: 0.6,
        useNativeDriver: true,
      }),
      Animated.spring(bounce, {
        toValue: 0,
        damping: 7,
        stiffness: 220,
        mass: 0.7,
        useNativeDriver: true,
      }),
    ]).start();
    onSelect();
  };

  const iconMotion = {
    transform: [
      { scale: bounce.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] }) },
      {
        rotate: bounce.interpolate({
          inputRange: [0, 0.35, 0.7, 1],
          outputRange: ['0deg', '-10deg', '8deg', '0deg'],
        }),
      },
    ],
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={translateText(locked ? 'Premium animal' : hasAnimalSound(animal.name) ? `Hear the sound of ${animal.name}` : `Meet ${animal.name}`, language)}
      onPress={handlePress}
      style={{
        width: cardWidth,
        minHeight: cardHeight,
        margin: '1%',
        borderRadius: 24,
        backgroundColor: animal.color,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
      }}
    >
      <Animated.View style={[iconMotion, { alignItems: 'center', justifyContent: 'center' }]}>
        {locked ? <Animated.Text style={{ fontSize: cardHeight > 150 ? 58 : 53 }}>🔒</Animated.Text> : <AnimalIllustration name={animal.name} emoji={animal.emoji} size={cardHeight > 150 ? 64 : 58} />}
      </Animated.View>
      <Text style={{ fontWeight: '900', color: '#19334D', fontSize: 14, marginTop: 4 }}>
        {locked ? 'More friends' : animal.name}
      </Text>
      <Text style={{ fontSize: 17, marginTop: 3 }}>{locked || !hasAnimalSound(animal.name) ? '' : '🔊'}</Text>
    </Pressable>
  );
}

export default function Animals() {
  const effects = useAppStore(state => state.effects);
  const premium = useAppStore(state => state.premium);
  const language = useAppStore(state => state.language);
  const [soundRequest, setSoundRequest] = useState<{ animalName: string; key: number } | null>(null);
  const nextSoundRequest = useRef(0);
  const { width } = useWindowDimensions();
  const columns = gridColumns(width);
  const cardHeight = width > 600 ? 160 : 142;

  return (
    <Screen>
      <Header title="Animal Friends" />
      <Text style={{ fontSize: 15, color: '#617989', fontWeight: '700', alignSelf: 'flex-start' }}>
        Tap an animal with 🔊 to hear its sound!
      </Text>
      <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
        {animals.map((animal, index) => {
          const locked = !canAccessAnimal(index, premium);
          return (
            <AnimalFriendCard
              key={animal.name}
              animal={animal}
              locked={locked}
              cardWidth={`${100 / columns - 2}%` as DimensionValue}
              cardHeight={cardHeight}
              language={language}
              onSelect={() => {
                if (locked) router.push('/parent-gate');
                else if (hasAnimalSound(animal.name)) setSoundRequest({ animalName: animal.name, key: nextSoundRequest.current++ });
              }}
            />
          );
        })}
      </View>
      {soundRequest && <AnimalSoundPlayback key={soundRequest.key} animalName={soundRequest.animalName} enabled={effects} />}
    </Screen>
  );
}
