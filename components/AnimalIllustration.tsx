import { Image, type ImageSourcePropType } from 'react-native';
import { Text } from './AppText';

const illustrations: Record<string, ImageSourcePropType> = {
  Alligator: require('../assets/animals/alligator.png'),
  Bear: require('../assets/animals/bear.png'),
  Cat: require('../assets/animals/cat.png'),
  Dog: require('../assets/animals/dog.png'),
  Elephant: require('../assets/animals/elephant.png'),
  Frog: require('../assets/animals/frog.png'),
  Giraffe: require('../assets/animals/giraffe.png'),
  Hippo: require('../assets/animals/hippo.png'),
  Iguana: require('../assets/animals/iguana.png'),
  Jaguar: require('../assets/animals/jaguar.png'),
  Lion: require('../assets/animals/lion.png'),
  Koala: require('../assets/animals/koala.png'),
  Monkey: require('../assets/animals/monkey.png'),
  Newt: require('../assets/animals/newt.png'),
  Owl: require('../assets/animals/owl.png'),
  Panda: require('../assets/animals/panda.png'),
  Penguin: require('../assets/animals/penguin.png'),
  Quail: require('../assets/animals/quail.png'),
  Rabbit: require('../assets/animals/rabbit.png'),
  Snake: require('../assets/animals/snake.png'),
  Turtle: require('../assets/animals/turtle.png'),
  Unicorn: require('../assets/animals/unicorn.png'),
  Vulture: require('../assets/animals/vulture.png'),
  Whale: require('../assets/animals/whale.png'),
  'X-ray fish': require('../assets/animals/x-ray-fish.png'),
  Yak: require('../assets/animals/yak.png'),
  Zebra: require('../assets/animals/zebra.png'),
};

export function AnimalIllustration({ name, emoji, size, opacity = 1 }: { name: string; emoji: string; size: number; opacity?: number }) {
  const image = illustrations[name];
  if (image) {
    return <Image source={image} resizeMode="contain" style={{ width: size * (name === 'Lion' ? 1.25 : 1.5), height: size * (name === 'Lion' ? 1.25 : 1), opacity, ...(name === 'Lion' ? { borderRadius: size * 0.38, backgroundColor: '#FFF0B5' } : {}) }} />;
  }
  return <Text style={{ fontSize: size, opacity }}>{emoji}</Text>;
}
