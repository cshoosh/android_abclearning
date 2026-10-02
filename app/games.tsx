import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Text } from '../components/AppText';
import { BigButton, Header, Pill, Screen, WrongAnswerMessage } from '../components/ui';
import { useWrongAnswerFeedback } from '../hooks/useWrongAnswerFeedback';
import { speak } from '../services/audio';
import { useAppStore } from '../store/useAppStore';
import { canAccessMiniGame } from '../domain/access';
import { createMiniGameRound, miniGames } from '../domain/miniGames';
import type { MiniGameOption } from '../domain/miniGames';
import { translateText } from '../localization';
import { playUiSound } from '../services/uiSoundEvents';
import { AnimalIllustration } from '../components/AnimalIllustration';
import Animated, { FadeInDown } from 'react-native-reanimated';

const optionColors = ['#FFE1BA', '#C6EAF7', '#D9F2CE', '#E6D9FA'];
const balloonPopAnimation = require('../assets/lottie/balloon-pop.json');
const bubblePopAnimation = require('../assets/lottie/bubble-pop.json');

export default function Games() {
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const state = useAppStore();
  const [gameIndex, setGameIndex] = useState(0);
  const [round, setRound] = useState(() => createMiniGameRound(miniGames[0].id, undefined, Math.random, state.language));
  const [done, setDone] = useState(false);
  const [poppingOptionId, setPoppingOptionId] = useState<string | null>(null);
  const [popping, setPopping] = useState(false);
  const game = miniGames[gameIndex];
  const { message, showWrongAnswer } = useWrongAnswerFeedback(state.voice, state.language);

  function chooseGame(index: number) {
    const next = miniGames[index];
    if (!canAccessMiniGame(index, state.premium)) {
      router.push('/parent-gate');
      return;
    }
    setPopping(false);
    setPoppingOptionId(null);
    setGameIndex(index);
    setRound(createMiniGameRound(next.id, undefined, Math.random, state.language));
    setDone(false);
  }

  function finishAnswer() {
    state.reward(game.title, round.targetId);
    setDone(true);
    speak('Hooray! You did it!', state.voice, state.language);
  }

  function answer(option: MiniGameOption) {
    if (done || popping) return;
    const hasDedicatedPopSound = game.id === 'balloon-pop' || game.id === 'letter-bubbles';
    if (!hasDedicatedPopSound || option.id !== round.answerId) playUiSound('pop');
    if (option.id === round.answerId) {
      if (game.id === 'balloon-pop' || game.id === 'letter-bubbles') {
        playUiSound(game.id === 'balloon-pop' ? 'balloon-pop' : 'bubble-pop');
        setPoppingOptionId(option.id);
        setPopping(true);
      } else {
        finishAnswer();
      }
    } else {
      showWrongAnswer();
    }
  }

  function advance() {
    setPoppingOptionId(null);
    setRound(createMiniGameRound(game.id, round.targetId, Math.random, state.language));
    setDone(false);
  }

  function renderVisual() {
    if (round.visual.count) {
      return <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 270 }}>
        {Array.from({ length: round.visual.count }, (_, index) => <Text key={index} style={{ fontSize: 31 }}>⭐</Text>)}
      </View>;
    }
    return <View style={{ minHeight: 62, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 }}>
      {round.visual.name
        ? <AnimalIllustration name={round.visual.name} emoji={round.visual.emoji ?? '🐾'} size={52} />
        : round.visual.emoji && <Text style={{ fontSize: game.id === 'first-letter' ? 38 : 48 }}>{round.visual.emoji}</Text>}
      {round.visual.text && <Text style={{ fontSize: game.id === 'first-letter' ? 26 : 46, fontWeight: '900', color: '#244968', textAlign: 'center' }}>{round.visual.text}</Text>}
    </View>;
  }

  function optionBackground(option: MiniGameOption, index: number) {
    if (game.id === 'color-pop' || game.id === 'shape-hunt' || game.id === 'animal-match' || game.id === 'animal-puzzle') {
      return option.color ?? optionColors[index % optionColors.length];
    }
    return optionColors[index % optionColors.length];
  }

  function optionEmoji(option: MiniGameOption) {
    if (game.id === 'balloon-pop') return '🎈';
    if (game.id === 'letter-bubbles') return '🫧';
    if (game.id === 'first-letter') return undefined;
    return option.emoji;
  }

  return <Screen>
    <Header title="Mini Games" />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 2 }} style={{ width: '100%', flexGrow: 0, flexShrink: 0 }}>
      {miniGames.map((item, index) => {
        const locked = !canAccessMiniGame(index, state.premium);
        return <Pill
          key={item.id}
          label={locked ? `🔒 ${item.tab}` : item.tab}
          active={gameIndex === index}
          onPress={() => chooseGame(index)}
        />;
      })}
    </ScrollView>

    <View style={{ width: '100%', minHeight: landscape ? Math.min(190, height * 0.48) : 0, flexDirection: landscape ? 'row' : 'column', alignItems: 'stretch', justifyContent: 'space-between', gap: landscape ? 12 : 8 }}>
    <View style={{ width: landscape ? '32%' : '100%', minHeight: landscape ? Math.min(150, height * 0.42) : 112, padding: landscape ? 12 : 10, borderRadius: 27, alignItems: 'center', justifyContent: 'center', backgroundColor: game.color, gap: landscape ? 6 : 3 }}>
      <Text style={{ fontSize: 16, fontWeight: '800', color: '#567082', textAlign: 'center' }}>{round.prompt}</Text>
      {renderVisual()}
      <Pressable accessibilityRole="button" accessibilityLabel={translateText('Listen to the question', state.language)} onPress={() => speak(round.prompt, true, state.language)} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
        <Text style={{ fontSize: 17 }}>🔊 Listen</Text>
      </Pressable>
    </View>

    <View style={{ width: landscape ? '66%' : '100%', minHeight: landscape ? 0 : 178, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'stretch', gap: 8, marginTop: landscape ? 0 : 4 }}>
      {round.options.map((option, index) => (
        <Pressable
          key={option.id}
          accessibilityRole="button"
          accessibilityLabel={translateText(option.label, state.language)}
          accessibilityState={{ disabled: done || popping }}
          disabled={done || popping}
          onPress={() => answer(option)}
          style={({ pressed }) => ({ width: '48%', flexGrow: 1, minHeight: landscape ? Math.min(78, height * 0.23) : 70, maxHeight: landscape ? Math.min(112, height * 0.31) : undefined, borderRadius: 24, padding: 8, backgroundColor: optionBackground(option, index), alignItems: 'center', justifyContent: 'center', gap: 3, opacity: pressed ? 0.82 : 1, borderWidth: done && option.id === round.answerId ? 3 : 0, borderColor: '#4C9561' })}
        >
          {(game.id === 'balloon-pop' || game.id === 'letter-bubbles') && poppingOptionId === option.id
            ? done
              ? <Text style={{ fontSize: 38 }}>✨</Text>
              : <LottieView
                key={`${game.id}-${round.targetId}`}
                source={game.id === 'balloon-pop' ? balloonPopAnimation : bubblePopAnimation}
                autoPlay
                loop={false}
                onAnimationFinish={cancelled => {
                  if (cancelled) return;
                  finishAnswer();
                  setPopping(false);
                }}
                style={{ width: 76, height: 76 }}
              />
            : optionEmoji(option) && <AnimalIllustration name={option.name ?? ''} emoji={optionEmoji(option)!} size={50} />}
          {game.id === 'count-stars' && <Text style={{ fontSize: 32 }}>⭐</Text>}
          <Text style={{ fontSize: game.id === 'count-stars' ? 28 : 19, fontWeight: '900', color: '#19334D', textAlign: 'center' }}>{option.label}</Text>
        </Pressable>
      ))}
    </View>
    </View>

    <View style={{ width: '100%', minHeight: done ? 108 : message ? 66 : 0, alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      <WrongAnswerMessage message={message} />
      {done && <BigButton label="Play again" emoji="➡️" attention onPress={advance} />}
    </View>
    {done && <ConfettiOverlay width={width} height={height} />}
  </Screen>;
}

const confetti = ['🎉', '✨', '⭐', '🎊', '💛', '🌟', '🎈', '🟣', '🔵', '🟢', '🎉', '✨', '⭐', '🎊', '💛', '🌟', '🎈', '🟣', '🔵', '🟢'];
function ConfettiOverlay({ width, height }: { width: number; height: number }) {
  const [visible, setVisible] = React.useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(timeout);
  }, []);
  if (!visible) return null;
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill, { zIndex: 10, overflow: 'hidden' }]}>
    {confetti.map((item, index) => <AnimatedConfetti key={`${item}-${index}`} item={item} index={index} width={width} height={height} />)}
  </View>;
}

function AnimatedConfetti({ item, index, width, height }: { item: string; index: number; width: number; height: number }) {
  const left = (index * 47 + 13) % Math.max(1, width - 32);
  const top = (index * 83 + 5) % Math.max(1, height - 40);
  return <Animated.Text entering={FadeInDown.delay((index % 10) * 50).duration(420)} style={{ position: 'absolute', left, top, fontSize: index % 3 === 0 ? 30 : 24 }}>{item}</Animated.Text>;
}
