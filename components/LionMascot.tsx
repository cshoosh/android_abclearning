import { Image } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { translateText } from '../localization';

const lionIllustration = require('../assets/animals/lion.png');

export function LionMascot({ size = 118, opacity = 1 }: { size?: number; opacity?: number }) {
  const language = useAppStore(state => state.language);

  return (
    <Image
      source={lionIllustration}
      resizeMode="contain"
      accessibilityLabel={translateText('A friendly lion mascot', language)}
      style={{ width: size, height: size, opacity, borderRadius: size * 0.16 }}
    />
  );
}
