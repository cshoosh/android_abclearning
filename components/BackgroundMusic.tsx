import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useAppStore } from '../store/useAppStore';

const music = require('../assets/music/abc-friends-gentle-loop.mp3');

export function BackgroundMusic() {
  const hydrated = useAppStore(state => state.hydrated);
  const enabled = useAppStore(state => state.music && state.onboarded);
  const player = useAudioPlayer(music, { updateInterval: 1000 });
  const status = useAudioPlayerStatus(player);
  const [isForeground, setIsForeground] = useState(AppState.currentState === 'active');

  useEffect(() => {
    player.loop = false;
    player.volume = 0.16;
  }, [player]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      setIsForeground(nextState === 'active');
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (hydrated && enabled && isForeground && status.isLoaded) {
      player.play();
    } else {
      player.pause();
    }
  }, [enabled, hydrated, isForeground, player, status.isLoaded]);

  return null;
}
