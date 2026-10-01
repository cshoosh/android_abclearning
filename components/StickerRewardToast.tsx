import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { animals } from '../data/content';
import { translateText } from '../localization';
import { useAppStore } from '../store/useAppStore';
import { AnimalIllustration } from './AnimalIllustration';
import { Text } from './AppText';

export function StickerRewardToast() {
  const notice = useAppStore(state => state.stickerReward);
  const clearStickerReward = useAppStore(state => state.clearStickerReward);
  const language = useAppStore(state => state.language);
  const insets = useSafeAreaInsets();
  const motion = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!notice) return;
    motion.setValue(0);
    Animated.timing(motion, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    const timer = setTimeout(() => {
      Animated.timing(motion, { toValue: 0, duration: 180, useNativeDriver: true }).start(({ finished }) => {
        if (finished) clearStickerReward(notice.id);
      });
    }, 2200);
    return () => clearTimeout(timer);
  }, [clearStickerReward, motion, notice]);

  if (!notice) return null;
  const animal = animals.find(item => item.name === notice.name);

  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', top: insets.top + 8, left: 0, right: 0, alignItems: 'center' }}>
      <Animated.View
        accessibilityLiveRegion="polite"
        style={{ opacity: motion, transform: [{ translateY: motion.interpolate({ inputRange: [0, 1], outputRange: [-72, 0] } ) }], minWidth: 235, maxWidth: '90%', paddingHorizontal: 18, paddingVertical: 11, borderRadius: 24, backgroundColor: '#FFF1C7', borderWidth: 2, borderColor: '#F2C34E', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, elevation: 8 }}
      >
        {animal && <AnimalIllustration name={animal.name} emoji={animal.emoji} size={42} />}
        <View>
          <Text style={{ fontSize: 14, fontWeight: '900', color: '#765111' }}>{translateText('Sticker collected!', language)}</Text>
          <Text style={{ fontSize: 18, fontWeight: '900', color: '#244968' }}>{translateText(notice.name, language)} ⭐</Text>
        </View>
      </Animated.View>
    </View>
  );
}
