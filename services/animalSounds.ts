import { preload } from 'expo-audio';

const animalSoundAssets: Record<string, number> = {
  Alligator: require('../assets/sounds/alligator.mp3'),
  Lion: require('../assets/sounds/lion.mp3'),
  Elephant: require('../assets/sounds/elephant.mp3'),
  Monkey: require('../assets/sounds/monkey.mp3'),
  Panda: require('../assets/sounds/panda.mp3'),
  Giraffe: require('../assets/sounds/giraffe.mp3'),
  Hippo: require('../assets/sounds/hippo.mp3'),
  Iguana: require('../assets/sounds/iguana.mp3'),
  Jaguar: require('../assets/sounds/jaguar.mp3'),
  Koala: require('../assets/sounds/koala.mp3'),
  Zebra: require('../assets/sounds/zebra.mp3'),
  Bear: require('../assets/sounds/bear.mp3'),
  Rabbit: require('../assets/sounds/rabbit.mp3'),
  Cat: require('../assets/sounds/cat.mp3'),
  Dog: require('../assets/sounds/dog.mp3'),
  Penguin: require('../assets/sounds/penguin.mp3'),
  Frog: require('../assets/sounds/frog.mp3'),
  Newt: require('../assets/sounds/newt.mp3'),
  Quail: require('../assets/sounds/quail.mp3'),
  Fox: require('../assets/sounds/fox.mp3'),
  Owl: require('../assets/sounds/owl.mp3'),
  Dolphin: require('../assets/sounds/dolphin.mp3'),
  Snake: require('../assets/sounds/snake.mp3'),
  Turtle: require('../assets/sounds/turtle.mp3'),
  Vulture: require('../assets/sounds/vulture.mp3'),
  Whale: require('../assets/sounds/whale.mp3'),
  Yak: require('../assets/sounds/yak.mp3'),
  Unicorn: require('../assets/sounds/unicorn.mp3'),
  'X-ray fish': require('../assets/sounds/x-ray-fish.mp3'),
};

// Start buffering animal sounds as soon as this module is loaded so the first
// tap can play without waiting for the audio file to load.
Object.values(animalSoundAssets).forEach(source => {
  void preload(source).catch(() => undefined);
});

export function hasAnimalSound(animalName: string): boolean {
  return animalSoundAssets[animalName] !== undefined;
}

export function getAnimalSoundAsset(animalName: string): number | undefined {
  return animalSoundAssets[animalName];
}
