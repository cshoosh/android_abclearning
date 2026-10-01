import { useEffect, useRef } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { useAppStore } from '../store/useAppStore';
import { subscribeUiSounds } from '../services/uiSoundEvents';

const popSound = require('../assets/sounds/ui-pop.mp3');
const successSound = require('../assets/sounds/ui-success.mp3');
const bubblePopSound = require('../assets/sounds/bubble-pop.wav');
const balloonPopSound = require('../assets/sounds/balloon-pop.wav');

export function UiSoundEffects() {
  const popPlayer = useAudioPlayer(popSound);
  const successPlayer = useAudioPlayer(successSound);
  const bubblePopPlayer = useAudioPlayer(bubblePopSound);
  const balloonPopPlayer = useAudioPlayer(balloonPopSound);
  const enabled = useAppStore(state => state.hydrated && state.effects);
  const stars = useAppStore(state => state.stars);
  const hydrated = useAppStore(state => state.hydrated);
  const previousStars = useRef<number | null>(null);

  useEffect(() => {
    popPlayer.loop = false;
    successPlayer.loop = false;
    bubblePopPlayer.loop = false;
    balloonPopPlayer.loop = false;
  }, [popPlayer, successPlayer, bubblePopPlayer, balloonPopPlayer]);

  useEffect(() => subscribeUiSounds(sound => {
    const state = useAppStore.getState();
    if (!state.hydrated || !state.effects) return;
    const player = sound === 'pop'
      ? popPlayer
      : sound === 'success'
        ? successPlayer
        : sound === 'bubble-pop'
          ? bubblePopPlayer
          : balloonPopPlayer;
    player.volume = sound === 'pop' ? 0.28 : sound === 'success' ? 0.38 : 0.55;
    void player.seekTo(0).catch(() => undefined);
    const current = useAppStore.getState();
    if (current.hydrated && current.effects) player.play();
  }), [popPlayer, successPlayer, bubblePopPlayer, balloonPopPlayer]);

  useEffect(() => {
    if (!hydrated) return;
    if (previousStars.current === null) {
      previousStars.current = stars;
      return;
    }
    if (stars > previousStars.current) {
      previousStars.current = stars;
      const state = useAppStore.getState();
      if (state.effects) {
        successPlayer.volume = 0.38;
        void successPlayer.seekTo(0).catch(() => undefined);
        successPlayer.play();
      }
    } else {
      previousStars.current = stars;
    }
  }, [hydrated, stars, successPlayer]);

  useEffect(() => {
    if (!enabled) {
      popPlayer.pause();
      successPlayer.pause();
      bubblePopPlayer.pause();
      balloonPopPlayer.pause();
    }
  }, [enabled, popPlayer, successPlayer, bubblePopPlayer, balloonPopPlayer]);

  return null;
}
