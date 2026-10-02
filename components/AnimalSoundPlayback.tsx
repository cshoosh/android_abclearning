import { useEffect, useRef } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { getAnimalSoundAsset } from '../services/animalSounds';

export function AnimalSoundPlayback({ animalName, enabled, maxDurationMs = 3500 }: { animalName: string; enabled: boolean; maxDurationMs?: number }) {
  const source = getAnimalSoundAsset(animalName) ?? null;
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const stopPlayback = () => {
      player.pause();
      void player.seekTo(0).catch(() => undefined);
    };

    if (enabled && source !== null && status.isLoaded) {
      player.loop = false;
      player.volume = 0.75;
      player.play();
      const stopTimer = setTimeout(() => {
        if (mounted.current) stopPlayback();
      }, maxDurationMs);

      return () => {
        clearTimeout(stopTimer);
        stopPlayback();
      };
    } else {
      stopPlayback();
    }
  }, [enabled, maxDurationMs, player, source, status.isLoaded]);

  return null;
}
